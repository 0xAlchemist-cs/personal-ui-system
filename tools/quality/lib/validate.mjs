import fs from 'node:fs';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import { parseDocument } from 'yaml';
import { resolveTokens } from '../../../showcase/app/src/theme/resolve-tokens.ts';
import { checkMarkdownLinks } from './links.mjs';

const ignoredDirectories = new Set([
  '.git', '.agents', '.codex', '.aws', '.superpowers', 'node_modules',
  'dist', 'build', 'storybook-static', 'playwright-report', 'test-results', '__pycache__',
]);
const relative = (root, file) => path.relative(root, file).split(path.sep).join('/');

export function parseYaml(text) {
  const document = parseDocument(text, { uniqueKeys: true, version: '1.2', strict: true });
  if (document.errors.length || document.warnings.length) {
    throw new Error([...document.errors, ...document.warnings].map(error => error.message).join('; '));
  }
  const value = document.toJS({ maxAliasCount: 100 });
  const ancestors = new Set();
  function jsonValue(item) {
    if (item === null || typeof item === 'string' || typeof item === 'boolean') return;
    if (typeof item === 'number' && Number.isFinite(item)) return;
    if (typeof item !== 'object' || ancestors.has(item)) throw new Error('YAML must represent finite, acyclic JSON data.');
    if (!Array.isArray(item) && ![Object.prototype, null].includes(Object.getPrototypeOf(item))) throw new Error('YAML must represent plain JSON objects.');
    ancestors.add(item);
    for (const child of Object.values(item)) jsonValue(child);
    ancestors.delete(item);
  }
  jsonValue(value);
  return value;
}

export function createBriefValidator(schema) {
  if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') {
    throw new Error('Brief schema must explicitly declare Draft 2020-12.');
  }
  const ajv = new Ajv2020({ allErrors: true, strict: true, validateSchema: true,
    coerceTypes: false, useDefaults: false, removeAdditional: false });
  if (!ajv.validateSchema(schema)) throw new Error(ajv.errorsText(ajv.errors));
  return ajv.compile(schema);
}

export function stringTokens(data) {
  if (!data || data.schemaVersion !== '1.0' || !data.tokens || Array.isArray(data.tokens) || typeof data.tokens !== 'object') {
    throw new Error('Expected schemaVersion "1.0" and a flat tokens object.');
  }
  for (const [name, value] of Object.entries(data.tokens)) {
    if (!name || typeof value !== 'string') throw new Error(`Token "${name}" must have a string value.`);
  }
  return data.tokens;
}

export async function validateRepository(directory) {
  const root = fs.realpathSync(directory);
  const errors = [];
  const files = [];
  const add = (file, rule, message) => errors.push({ file, rule, message });
  function walk(folder) {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name);
      const name = relative(root, file);
      if (ignoredDirectories.has(entry.name) || name === 'docs/imports' || entry.name.startsWith('.env')) continue;
      if (entry.isSymbolicLink()) { add(name, 'source-symlink', 'Owned source must not use filesystem links.'); continue; }
      if (entry.isDirectory()) walk(file);
      else if (entry.isFile() && /\.(md|json|ya?ml)$/.test(entry.name)) files.push(name);
    }
  }
  walk(root);
  files.sort();
  const parsed = new Map();
  const counts = { markdown: 0, json: 0, yaml: 0, briefs: 0, presets: 0, localLinks: 0 };
  for (const file of files) {
    if (file.endsWith('.md')) { counts.markdown++; continue; }
    const json = file.endsWith('.json');
    counts[json ? 'json' : 'yaml']++;
    try { const text = fs.readFileSync(path.join(root, file), 'utf8'); parsed.set(file, json ? JSON.parse(text) : parseYaml(text)); }
    catch (error) { add(file, json ? 'json-syntax' : 'yaml-syntax', error.message); }
  }
  function required(file) {
    if (!parsed.has(file)) throw new Error(`Required readable JSON/YAML file: ${file}`);
    return parsed.get(file);
  }
  const presets = new Map();
  const presetFiles = files.filter(file => /^design-system\/styles\/[^/]+\.json$/.test(file));
  try {
    const primitive = stringTokens(required('design-system/tokens/primitives.json'));
    const semantic = stringTokens(required('design-system/tokens/semantic.json'));
    // Check the base graph even if a preset would mask a broken semantic alias.
    resolveTokens(primitive, semantic, {});
    if (!presetFiles.length) throw new Error('No style preset JSON found.');
    for (const file of presetFiles) {
      try {
        const preset = required(file);
        if (preset.id !== path.basename(file, '.json')) throw new Error('Preset id must match its file name.');
        resolveTokens(primitive, semantic, stringTokens(preset));
        presets.set(preset.id, preset);
        counts.presets++;
      } catch (error) { add(file, 'token-contract', error.message); }
    }
  } catch (error) { add('design-system/tokens', 'token-contract', error.message); }

  const briefFiles = files.filter(file => /^briefs\/examples\/[^/]+\.ya?ml$/.test(file) || /^showcase\/[^/]+\.brief\.ya?ml$/.test(file));
  try {
    const validate = createBriefValidator(required('briefs/ui-brief.schema.json'));
    if (!briefFiles.length) throw new Error('No Brief YAML found in the documented Brief locations.');
    for (const file of briefFiles) {
      if (!parsed.has(file)) continue;
      const data = parsed.get(file);
      counts.briefs++;
      if (!validate(data)) {
        for (const error of validate.errors) add(file, 'brief-schema', `${error.instancePath || '/'} ${error.message} (${error.schemaPath})`);
        continue;
      }
      const preset = presets.get(data.design.preset);
      if (!preset || !['theme', 'density', 'accent', 'radius'].every(key => data.design[key] === preset[key])) {
        add(file, 'brief-preset', 'Brief design must match the actual selected preset metadata.');
      }
    }
  } catch (error) { add('briefs/ui-brief.schema.json', 'schema-compile', error.message); }
  const links = await checkMarkdownLinks(root, files.filter(file => file.endsWith('.md')));
  counts.localLinks = links.checked;
  errors.push(...links.errors);
  return { ok: errors.length === 0, counts, errors,
    scope: 'Owned JSON/YAML, full Brief Draft 2020-12, all preset Token graphs and Markdown file targets. Preserved .agents and docs/imports bodies excluded; heading anchors and remote URLs not fetched.' };
}
