import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createBriefValidator, parseYaml, stringTokens, validateRepository } from '../lib/validate.mjs';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const schema = JSON.parse(fs.readFileSync(path.join(root, 'briefs/ui-brief.schema.json'), 'utf8'));
const brief = parseYaml(fs.readFileSync(path.join(root, 'briefs/examples/user-management.yaml'), 'utf8'));
const validate = createBriefValidator(schema);
const clone = () => structuredClone(brief);

test('existing Brief validates without mutation; schema is itself checked', () => {
  const input = clone();
  assert.equal(validate(input), true);
  assert.deepEqual(input, brief);
  assert.throws(() => createBriefValidator({ ...schema, type: 'unknown-type' }));
});

const invalidBriefs = [
  ['numeric version', value => { value.schema_version = 1; }],
  ['missing state detail', value => { delete value.state_details.disabled; }],
  ['unknown top-level field', value => { value.unexpected = true; }],
  ['unknown nested field', value => { value.stack.extra = true; }],
  ['preset conditional mismatch', value => { value.design.theme = 'dark'; }],
  ['duplicate state', value => { value.states[4] = value.states[0]; }],
  ['missing fifth state', value => { value.states.pop(); }],
  ['empty string list', value => { value.components = []; }],
  ['duplicate string list', value => { value.constraints = ['same', 'same']; }],
  ['invalid nested interaction id', value => { value.interaction[0].id = 'UPPERCASE'; }],
];
for (const [name, change] of invalidBriefs) test(`full Schema rejects ${name}`, () => {
  const input = clone(); change(input); const before = structuredClone(input);
  assert.equal(validate(input), false);
  assert(validate.errors.length > 0);
  assert.deepEqual(input, before, 'Validation must not repair or coerce input');
});

test('Draft 2020-12 tuple semantics are executed, not a field-name approximation', () => {
  const tuple = createBriefValidator({ $schema: schema.$schema, type: 'array', prefixItems: [{ type: 'string' }],
    items: false, minItems: 1, maxItems: 1 });
  assert.equal(tuple(['valid']), true);
  assert.equal(tuple(['valid', 'unexpected']), false);
  assert.equal(tuple([1]), false);
});

for (const [name, text] of [
  ['duplicate mapping key', 'page: One\npage: Two\n'],
  ['multiple documents', 'page: One\n---\npage: Two\n'],
  ['malformed mapping', 'page: [unterminated\n'],
  ['non-finite JSON number', 'number: .nan\n'],
  ['cyclic aliases', 'value: &loop [*loop]\n'],
]) test(`YAML rejects ${name}`, () => assert.throws(() => parseYaml(text)));

test('YAML preserves quoted version strings and ordinary shared aliases', () => {
  assert.deepEqual(parseYaml('schema_version: "1.0"\na: &value [one]\nb: *value\n'), { schema_version: '1.0', a: ['one'], b: ['one'] });
});

test('Token data must be a runtime string dictionary', () => {
  assert.throws(() => stringTokens({ schemaVersion: '1.0', tokens: { size: 40 } }));
  assert.throws(() => stringTokens({ schemaVersion: '1.0', tokens: [] }));
});

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'pui-quality-contract-'));
  t.after(() => {
    const resolved = fs.realpathSync(directory);
    assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()));
    assert(path.basename(resolved).startsWith('pui-quality-contract-'));
    assert.equal(fs.lstatSync(directory).isSymbolicLink(), false);
    fs.rmSync(resolved, { recursive: true, force: true });
  });
  for (const file of ['briefs/ui-brief.schema.json', 'design-system/tokens/primitives.json', 'design-system/tokens/semantic.json',
    'design-system/styles/minimal-saas.json', 'design-system/styles/developer-editorial.json', 'design-system/styles/enterprise-data.json']) {
    const target = path.join(directory, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.copyFileSync(path.join(root, file), target);
  }
  fs.mkdirSync(path.join(directory, 'briefs/examples'), { recursive: true });
  fs.copyFileSync(path.join(root, 'briefs/examples/user-management.yaml'), path.join(directory, 'briefs/examples/example.yaml'));
  fs.writeFileSync(path.join(directory, 'README.md'), '[Brief](briefs/examples/example.yaml)\n');
  return directory;
}

test('repository fixture passes and CLI validates independent of the caller cwd', t => {
  const directory = fixture(t);
  const result = spawnSync(process.execPath, ['--experimental-strip-types', fileURLToPath(new URL('../check.mjs', import.meta.url)), '--root', directory], { cwd: os.tmpdir(), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.ok, true);
  assert.equal(report.counts.briefs, 1);
  assert.equal(report.counts.presets, 3);
});

const brokenTokens = [
  ['unknown primitive alias', p => { p.tokens.unused = '{not.found}'; }, null, null],
  ['semantic cycle', null, s => { s.tokens['color.text'] = '{color.muted}'; s.tokens['color.muted'] = '{color.text}'; }, null],
  ['reverse primitive dependency', p => { p.tokens.unused = '{color.text}'; }, null, null],
  ['key conflict', p => { p.tokens['color.text'] = 'value'; }, null, null],
  ['unknown override', null, null, p => { p.tokens['unknown.semantic'] = '1px'; }],
  ['primitive override', null, null, p => { p.tokens['color.blue.600'] = '#000000'; }],
  ['non-string value', p => { p.tokens.invalid = 10; }, null, null],
  ['partial interpolation', null, s => { s.tokens['color.text'] = 'text {color.blue.600}'; }, null],
];
for (const [name, primitiveChange, semanticChange, presetChange] of brokenTokens) test(`repository rejects ${name}`, async t => {
  const directory = fixture(t);
  for (const [file, change] of [['design-system/tokens/primitives.json', primitiveChange], ['design-system/tokens/semantic.json', semanticChange], ['design-system/styles/minimal-saas.json', presetChange]]) {
    if (!change) continue;
    const target = path.join(directory, file); const value = JSON.parse(fs.readFileSync(target, 'utf8')); change(value); fs.writeFileSync(target, JSON.stringify(value));
  }
  const report = await validateRepository(directory);
  assert.equal(report.ok, false);
  assert(report.errors.some(error => error.rule === 'token-contract'));
});

for (const [name, file, text, rule] of [
  ['Brief Schema failure', 'briefs/examples/example.yaml', 'page: Incomplete\n', 'brief-schema'],
  ['YAML parse failure', 'briefs/examples/example.yaml', 'page: [invalid\n', 'yaml-syntax'],
  ['Token failure', 'design-system/tokens/primitives.json', '{"schemaVersion":"1.0","tokens":{"broken":false}}', 'token-contract'],
  ['local link failure', 'README.md', '[Missing](does-not-exist.md)\n', 'markdown-link'],
]) test(`CLI exits nonzero for ${name}`, t => {
  const directory = fixture(t); fs.writeFileSync(path.join(directory, file), text);
  const result = spawnSync(process.execPath, ['--experimental-strip-types', fileURLToPath(new URL('../check.mjs', import.meta.url)), '--root', directory], { encoding: 'utf8' });
  assert.equal(result.status, 1, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.ok, false);
  assert(report.errors.some(error => error.rule === rule));
});
