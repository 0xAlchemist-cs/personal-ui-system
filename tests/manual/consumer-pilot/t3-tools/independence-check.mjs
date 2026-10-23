import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// Read-only consumer audit. Only --out is written; this is a QA tool, not an installer.
const args = process.argv.slice(2);
const options = {};
for (let index = 0; index < args.length; index += 2) {
  if (!['--project', '--out'].includes(args[index]) || !args[index + 1] || options[args[index]]) {
    throw new Error('Usage: node independence-check.mjs --project <consumer> --out <evidence.json>');
  }
  options[args[index]] = args[index + 1];
}
if (!options['--project'] || !options['--out']) {
  throw new Error('Usage: node independence-check.mjs --project <consumer> --out <evidence.json>');
}
const root = path.resolve(options['--project']);
const output = path.resolve(options['--out']);
const expectedSource = '16184844550f970570408a79e649a37dd7fe5c0d';
const result = {
  schemaVersion: '1.0',
  scope: 'P03-T3 consumer checkout and runtime dependency independence',
  project: root,
  invocation: { executable: process.execPath, args: process.argv.slice(1), cwd: process.cwd() },
  environment: { platform: process.platform, node: process.version, nodeExecutable: process.execPath },
  commands: [],
  findings: [],
  limitations: [
    'Static literal import/URL scanning is lexical, not a full JavaScript or CSS parser. Computed paths, runtime code generation and network behavior require code review/browser evidence.',
    'Markdown environment paths are recorded separately and are not treated as runtime dependencies. Runtime source/configuration files are scanned even when a matching string is in a comment.',
    'Package realpaths cover declared direct dependencies and npm-installed node_modules link entries; this is not a malicious-package/security audit.',
    'The adjacent immutable T2 manifest is used only by this external QA tool to compare the 16 copied assets. The consumer runtime does not read this knowledge repository.',
    'Snapshot validation does not itself install dependencies, typecheck, build or verify the browser. Those commands and UI evidence are recorded separately.',
  ],
};
const finding = (code, detail) => result.findings.push({ code, detail });
const normalize = (value) => value.split(path.sep).join('/');
const inside = (base, target) => {
  const relative = path.relative(base, target);
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
};
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
function run(executable, commandArgs) {
  const execution = spawnSync(executable, commandArgs, { cwd: root, encoding: 'utf8', windowsHide: true, timeout: 60000, maxBuffer: 16 * 1024 * 1024 });
  const record = { executable, args: commandArgs, cwd: root, exitCode: execution.status, signal: execution.signal, stdout: execution.stdout ?? '', stderr: execution.stderr ?? '', error: execution.error?.message ?? null };
  result.commands.push(record);
  if (execution.status !== 0) finding('command-failed', record);
  return record;
}
function git(commandArgs) { return run('git', commandArgs); }
function absoluteReferences(text) {
  const matches = [];
  for (const match of text.matchAll(/(?:^|[^\w])([A-Za-z]:[\\/][^\r\n"'`<>]*)|(?:^|[\s"'`(=,])((?:\\\\|\/\/)[A-Za-z0-9_.-]+[\\/][^\r\n"'`<>]*)/gm)) {
    matches.push({ value: (match[1] ?? match[2]).trim(), line: text.slice(0, match.index).split('\n').length });
  }
  return matches;
}
function assertRealInside(target, label) {
  const real = fs.realpathSync(target);
  if (!inside(fs.realpathSync(root), real)) finding('realpath-escape', { label, path: target, realpath: real });
  return real;
}
function resolveRelative(file, specifier, allowDirectory = false) {
  const base = path.resolve(path.dirname(path.join(root, file)), specifier);
  if (!inside(root, base)) { finding('relative-import-escape', { file, specifier, resolved: base }); return null; }
  const candidates = [base, ...['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs', '.json', '.css', '.d.ts'].map((suffix) => base + suffix), ...['index.ts', 'index.tsx', 'index.js', 'index.json'].map((name) => path.join(base, name))];
  const target = candidates.find((candidate) => fs.existsSync(candidate) && (fs.statSync(candidate).isFile() || (allowDirectory && candidate === base && fs.statSync(candidate).isDirectory())));
  if (!target) { finding('unresolved-relative-import', { file, specifier }); return null; }
  assertRealInside(target, `${file}: ${specifier}`);
  return normalize(path.relative(root, target)) || '.';
}

try {
  if (!fs.statSync(root).isDirectory()) throw new Error('Project is not a directory');
  if (inside(root, output)) throw new Error('--out must be outside the read-only audited consumer');
  const head = git(['rev-parse', 'HEAD']);
  const status = git(['status', '--porcelain=v1', '--untracked-files=all']);
  const top = git(['rev-parse', '--show-toplevel']);
  const common = git(['rev-parse', '--git-common-dir']);
  const alternates = git(['rev-parse', '--git-path', 'objects/info/alternates']);
  const staged = git(['ls-files', '--stage', '-z']);
  const gitEntry = path.join(root, '.git');
  const commonPath = path.resolve(root, common.stdout.trim());
  const alternatesPath = path.resolve(root, alternates.stdout.trim());
  const alternateContents = fs.existsSync(alternatesPath) ? fs.readFileSync(alternatesPath, 'utf8').trim() : '';
  const plainGitDirectory = fs.existsSync(gitEntry) && fs.lstatSync(gitEntry).isDirectory() && !fs.lstatSync(gitEntry).isSymbolicLink();
  const commonRealpath = fs.realpathSync(commonPath);
  const objectsRealpath = fs.realpathSync(path.join(commonPath, 'objects'));
  const independentGit = plainGitDirectory && inside(root, commonRealpath) && inside(root, objectsRealpath) && alternateContents === '';
  result.git = { head: head.stdout.trim(), clean: status.stdout === '', status: status.stdout, topLevel: top.stdout.trim(), dotGitIsDirectory: plainGitDirectory, commonDirectory: commonPath, commonRealpath, objectsRealpath, alternatesPath, alternatesContents: alternateContents, independent: independentGit };
  if (!inside(root, path.resolve(top.stdout.trim())) || path.resolve(top.stdout.trim()).toLowerCase() !== root.toLowerCase()) finding('unexpected-git-root', top.stdout.trim());
  if (!result.git.clean) finding('dirty-checkout', status.stdout);
  if (!independentGit) finding('not-independent-git-checkout', 'Final evidence requires a plain consumer-local .git directory, local common dir and no alternates. A linked implementation worktree is preliminary only.');
  const tracked = staged.stdout.split('\0').filter(Boolean).map((entry) => {
    const match = /^(\d+) ([a-f\d]+) (\d+)\t([\s\S]+)$/.exec(entry);
    if (!match) throw new Error(`Cannot parse git ls-files record: ${entry}`);
    return { mode: match[1], blob: match[2], stage: Number(match[3]), path: match[4] };
  });
  result.tracked = { count: tracked.length, symlinks: tracked.filter((entry) => entry.mode === '120000'), nonzeroStages: tracked.filter((entry) => entry.stage !== 0) };
  if (result.tracked.symlinks.length) finding('tracked-symlinks', result.tracked.symlinks);
  if (result.tracked.nonzeroStages.length) finding('unmerged-index', result.tracked.nonzeroStages);
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const declared = { ...packageJson.dependencies, ...packageJson.devDependencies, ...packageJson.optionalDependencies };
  const packageNames = new Set(Object.keys(declared));
  const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
  result.lock = { version: lock.lockfileVersion, sha256: hash(fs.readFileSync(path.join(root, 'package-lock.json'))), packages: Object.keys(lock.packages ?? {}).length, localDependencies: [] };
  for (const [name, version] of Object.entries(declared)) {
    if (/^(?:file:|link:|workspace:|\.\.?[\\/]|[A-Za-z]:[\\/]|\/|\\\\)/i.test(version)) result.lock.localDependencies.push({ origin: 'package.json', name, version });
  }
  for (const [name, entry] of Object.entries(lock.packages ?? {})) {
    if (entry.link || (entry.resolved && !/^https:\/\//i.test(entry.resolved))) result.lock.localDependencies.push({ origin: 'package-lock.json', name, resolved: entry.resolved, link: entry.link });
  }
  if (result.lock.localDependencies.length) finding('local-package-dependencies', result.lock.localDependencies);

  const imports = [];
  const runtimeFiles = [];
  const documentPaths = [];
  const aliasConfigurations = [];
  const projectRootUrls = [];
  const importPattern = /\bfrom\s*['"]([^'"]+)['"]|\bimport\s*['"]([^'"]+)['"]|\bimport\s*\(\s*['"]([^'"]+)['"]|\brequire\s*\(\s*['"]([^'"]+)['"]|\bnew\s+URL\(\s*['"]([^'"]+)['"]\s*,\s*import\.meta\.url/g;
  for (const entry of tracked) {
    const file = path.join(root, entry.path);
    assertRealInside(file, entry.path);
    if (fs.lstatSync(file).isSymbolicLink()) finding('filesystem-symlink', entry.path);
    if (!/\.(?:[cm]?[jt]sx?|json|css|html|md)$|(?:^|\/)\.npmrc$/.test(entry.path)) continue;
    const text = fs.readFileSync(file, 'utf8');
    const absolute = absoluteReferences(text);
    if (/\.md$/.test(entry.path)) {
      if (absolute.length) documentPaths.push({ file: entry.path, references: absolute });
      continue;
    }
    runtimeFiles.push(entry.path);
    if (absolute.length) finding('machine-path-in-runtime-file', { file: entry.path, references: absolute });
    for (const match of text.matchAll(/(['"`])(\/(?!\/)[^'"`\r\n]+)\1/g)) {
      const value = match[2];
      // Vite's root-relative HTML entry is a project URL, not a disk import.
      const localTarget = path.resolve(root, `.${value}`);
      if (/\.html$/.test(entry.path) && inside(root, localTarget) && fs.existsSync(localTarget)) {
        projectRootUrls.push({ file: entry.path, url: value, resolved: normalize(path.relative(root, localTarget)) });
      } else finding('absolute-posix-path-literal', { file: entry.path, value });
    }
    if (/(?:\/\@fs\/|file:\/\/)/i.test(text)) finding('filesystem-url-in-runtime-file', entry.path);
    if (/^(?:vite|vitest)\.config\./.test(entry.path) && /\balias\s*:|\ballow\s*:/g.test(text)) {
      aliasConfigurations.push(entry.path);
      finding('configuration-requires-manual-alias-review', entry.path);
    }
    if (/tsconfig[^/]*\.json$/.test(entry.path)) {
      const configuration = JSON.parse(text);
      for (const extension of [configuration.extends].flat().filter(Boolean)) {
        if (extension.startsWith('.')) resolveRelative(entry.path, extension);
        else if (/^[A-Za-z]:[\\/]|^\//.test(extension)) finding('absolute-tsconfig-extends', { file: entry.path, extension });
      }
      for (const [alias, targets] of Object.entries(configuration.compilerOptions?.paths ?? {})) {
        for (const target of targets) {
          const resolved = path.resolve(path.dirname(file), configuration.compilerOptions?.baseUrl ?? '.', target.replace(/\*/g, ''));
          if (!inside(root, resolved)) finding('tsconfig-alias-escape', { file: entry.path, alias, target });
        }
      }
    }
    if (!/\.(?:[cm]?[jt]sx?)$/.test(entry.path)) continue;
    for (const match of text.matchAll(importPattern)) {
      const specifier = match.slice(1).find((value) => value !== undefined);
      const record = { file: entry.path, specifier };
      if (specifier.startsWith('.')) record.resolved = resolveRelative(entry.path, specifier, match[5] !== undefined);
      else if (specifier.startsWith('node:')) record.kind = 'node-builtin';
      else if (/^[A-Za-z]:[\\/]|^\/|^[a-z][a-z\d+.-]*:/i.test(specifier)) finding('absolute-or-url-import', record);
      else {
        const packageName = specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0];
        record.packageName = packageName;
        if (!packageNames.has(packageName)) finding('undeclared-bare-import', record);
      }
      imports.push(record);
    }
  }
  result.runtimeScan = { files: runtimeFiles, imports, aliasConfigurations, projectRootUrls, documentEnvironmentPaths: documentPaths };

  const nodeModules = path.join(root, 'node_modules');
  const moduleRoot = fs.realpathSync(nodeModules);
  if (!inside(fs.realpathSync(root), moduleRoot) || fs.lstatSync(nodeModules).isSymbolicLink()) finding('external-node-modules', { nodeModules, realpath: moduleRoot });
  const links = [];
  function walkInstalled(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) {
        const realpath = fs.realpathSync(target);
        links.push({ path: normalize(path.relative(root, target)), realpath });
        if (!inside(moduleRoot, realpath)) finding('external-installed-symlink', { target, realpath });
      } else if (entry.isDirectory()) walkInstalled(target);
    }
  }
  walkInstalled(nodeModules);
  const requireFromProject = createRequire(path.join(root, 'package.json'));
  const resolutions = [];
  for (const packageName of [...packageNames].sort()) {
    let resolved;
    try { resolved = requireFromProject.resolve(`${packageName}/package.json`); }
    catch { resolved = requireFromProject.resolve(packageName); }
    const realpath = fs.realpathSync(resolved);
    resolutions.push({ packageName, resolved, realpath });
    if (!inside(moduleRoot, realpath)) finding('package-resolves-outside-consumer', { packageName, resolved, realpath });
  }
  result.installed = { nodeModulesRealpath: moduleRoot, links, directResolutions: resolutions };
  result.environment.NODE_PATH = process.env.NODE_PATH ?? null;
  result.environment.NODE_OPTIONS = process.env.NODE_OPTIONS ?? null;
  result.environment.GIT_ALTERNATE_OBJECT_DIRECTORIES = process.env.GIT_ALTERNATE_OBJECT_DIRECTORIES ?? null;
  result.environment.GIT_OBJECT_DIRECTORY = process.env.GIT_OBJECT_DIRECTORY ?? null;
  if (process.env.NODE_PATH?.trim()) finding('implicit-node-path', process.env.NODE_PATH);
  if (/--(?:require|import|loader|experimental-loader)(?:\s|=)|(?:^|\s)-r\s/.test(process.env.NODE_OPTIONS ?? '')) finding('node-preload-options', process.env.NODE_OPTIONS);
  if (process.env.GIT_ALTERNATE_OBJECT_DIRECTORIES?.trim()) finding('git-alternates-environment', process.env.GIT_ALTERNATE_OBJECT_DIRECTORIES);
  if (process.env.GIT_OBJECT_DIRECTORY?.trim()) finding('git-objects-environment', process.env.GIT_OBJECT_DIRECTORY);

  const baselineFile = fileURLToPath(new URL('../t2-manifest.json', import.meta.url));
  const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(path.join(root, '.personal-ui/manifest.json'), 'utf8'));
  const baselineValidator = baseline.integrationFiles.find((entry) => entry.path === 'scripts/check-personal-ui.mjs');
  const validatorUnchangedSinceT2 = hash(fs.readFileSync(path.join(root, 'scripts/check-personal-ui.mjs'))) === baselineValidator?.sha256;
  if (!validatorUnchangedSinceT2) finding('snapshot-validator-changed-since-t2', 'The consumer static validator must not be weakened to obtain a passing T3 result.');
  const copiedAssets = manifest.includedFiles.map((entry) => {
    const previous = baseline.includedFiles.find((candidate) => candidate.path === entry.path);
    const actualSha256 = hash(fs.readFileSync(path.join(root, '.personal-ui', entry.path)));
    const unchangedFromT2 = JSON.stringify(entry) === JSON.stringify(previous) && actualSha256 === entry.sha256;
    if (!unchangedFromT2) finding('copied-asset-changed-since-t2', entry.path);
    return { path: entry.path, sourcePath: entry.sourcePath, actualSha256, unchangedFromT2 };
  });
  if (manifest.sourceCommit !== expectedSource || baseline.sourceCommit !== expectedSource || copiedAssets.length !== 16) finding('source-snapshot-drift', { sourceCommit: manifest.sourceCommit, expectedSource, count: copiedAssets.length });
  const snapshotCommand = run(process.execPath, ['scripts/check-personal-ui.mjs']);
  let snapshotResult = null;
  try { snapshotResult = JSON.parse(snapshotCommand.stdout); }
  catch { finding('invalid-snapshot-validator-output', snapshotCommand.stdout); }
  if (!snapshotResult?.ok) finding('snapshot-validator-failed', snapshotResult);
  result.snapshot = { sourceCommit: manifest.sourceCommit, t2BaselineManifest: baselineFile, t2BaselineSha256: hash(fs.readFileSync(baselineFile)), copiedAssets, validatorUnchangedSinceT2, validator: snapshotResult };
} catch (error) {
  finding('audit-error', error instanceof Error ? error.message : String(error));
}
result.ok = result.findings.length === 0;
result.status = result.ok ? 'passed' : result.git?.dotGitIsDirectory === false ? 'preliminary-not-independent-checkout' : 'failed';
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({ ok: result.ok, status: result.status, project: root, output, findings: result.findings.length, commands: result.commands.length }, null, 2)}\n`);
process.exitCode = result.ok ? 0 : 1;
