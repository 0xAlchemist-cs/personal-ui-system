import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, symlink, writeFile, realpath, lstat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { checkMarkdownLinks } from '../lib/links.mjs';

async function fixture(t, files) {
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'pui-links-'));
  const root = path.join(temporary, 'repo');
  await mkdir(root);
  t.after(async () => {
    const resolved = await realpath(temporary);
    assert.equal(path.dirname(resolved), await realpath(os.tmpdir()));
    assert(path.basename(resolved).startsWith('pui-links-'));
    assert.equal((await lstat(temporary)).isSymbolicLink(), false);
    await rm(resolved, { recursive: true, force: true });
  });
  for (const [file, text] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), text);
  }
  return { root, temporary };
}

test('resolves relative, root-relative, encoded and directory destinations', async (t) => {
  const { root } = await fixture(t, {
    'docs/source.md': [
      '[sibling](target.md#missing-heading)',
      '[root](/README.md?raw=1#intro)',
      '[space](<folder/a file (draft).md>)',
      '![encoded](folder/a%20file%20%28draft%29.md)',
      '[balanced parentheses](folder/a(b).md)',
      '[directory](folder/)',
      '[encoded hash](folder/a%23b.md)',
      '[third-party target](../.agents/skills/example/SKILL.md)',
    ].join('\n'),
    'docs/target.md': '',
    'README.md': '',
    'docs/folder/a file (draft).md': '',
    'docs/folder/a(b).md': '',
    'docs/folder/a#b.md': '',
    '.agents/skills/example/SKILL.md': '',
    // Supplied input files alone are parsed; target files need not be clean.
    'not-selected.md': '[broken](missing.md)',
  });
  assert.deepEqual(await checkMarkdownLinks(root, ['docs/source.md']), { checked: 8, errors: [] });
});

test('ignores external URLs, fragments, inline code, fences and unused definitions', async (t) => {
  const { root } = await fixture(t, {
    'source.md': [
      '[https](https://example.invalid/%not-an-escape)',
      '[http](http://example.invalid/a)',
      '[mail](mailto:person@example.invalid)',
      '![data](data:image/png;base64,a)',
      '[custom](vscode://file/a)',
      '[network](//example.invalid/a)',
      '[fragment](#unverified-heading)',
      '[query](?view=raw)',
      '`[inline](missing.md)`',
      '```md',
      '[fenced](missing.md)',
      '```',
      '[unused]: missing.md',
    ].join('\n'),
  });
  assert.deepEqual(await checkMarkdownLinks(root, ['source.md']), { checked: 0, errors: [] });
});

test('checks full, collapsed, shortcut and image references using the first definition', async (t) => {
  const { root } = await fixture(t, {
    'source.md': [
      '[full][Shared Label]',
      '[shared label][]',
      '[shared label]',
      '![image][Shared Label]',
      '[missing][bad]',
      '',
      '[SHARED   LABEL]: exists.md',
      '[shared label]: missing-duplicate.md',
      '[bad]: missing.md',
      '[unused]: missing-unused.md',
    ].join('\n'),
    'exists.md': '',
  });
  const result = await checkMarkdownLinks(root, ['source.md']);
  assert.equal(result.checked, 5);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0].message, /missing\.md.*does not exist/);
  assert.deepEqual({ ...result.errors[0], message: '' }, {
    file: 'source.md', rule: 'markdown-link', message: '', line: 5, column: 1,
  });
});

test('reports missing targets and malformed local percent escapes at their use sites', async (t) => {
  const { root } = await fixture(t, {
    'source.md': '[missing](missing.md)\n\n  ![bad](a%GG.png)\n[utf8](a%E0%A4.png)',
  });
  const result = await checkMarkdownLinks(root, ['source.md']);
  assert.equal(result.checked, 3);
  assert.equal(result.errors.length, 3);
  assert.match(result.errors[0].message, /does not exist.*ENOENT/);
  assert.match(result.errors[1].message, /invalid percent encoding/);
  assert.match(result.errors[2].message, /invalid percent encoding/);
  assert.equal(result.errors[1].line, 3);
  assert.equal(result.errors[1].column, 3);
});

test('rejects traversal, encoded traversal, drive paths, file URLs and backslash paths', async (t) => {
  const { root, temporary } = await fixture(t, {
    'source.md': [
      '[traversal](../outside.md)',
      '[encoded](%2e%2e/outside.md)',
      '[root traversal](/../outside.md)',
      '[drive](C:/private.md)',
      '[drive-relative](C:private.md)',
      '[encoded drive](C%3A/private.md)',
      '[file](file:///tmp/private.md)',
      '[backslash](folder%5Cprivate.md)',
      '[UNC](%5C%5Cserver/share.md)',
      '[encoded network](%2F%2Fserver/share.md)',
      '[null](a%00b.md)',
    ].join('\n'),
  });
  await writeFile(path.join(temporary, 'outside.md'), '');
  const result = await checkMarkdownLinks(root, ['source.md']);
  assert.equal(result.checked, 11);
  assert.equal(result.errors.length, 11);
  assert.ok(result.errors.slice(0, 3).every(({ message }) => /escapes the repository/.test(message)));
  assert.ok(result.errors.slice(3, 9).every(({ message }) => /repository-relative URL path/.test(message)));
  assert.match(result.errors[9].message, /Encoded network paths/);
  assert.match(result.errors[10].message, /null character/);
});

test('allows internal symlinks and rejects existing targets reached outside the repository', async (t) => {
  const { root, temporary } = await fixture(t, {
    'source.md': '[inside](internal/target.md)\n[outside](external/target.md)',
    'actual/target.md': '',
  });
  const outside = path.join(temporary, 'outside');
  await mkdir(outside);
  await writeFile(path.join(outside, 'target.md'), '');
  try {
    await symlink(path.join(root, 'actual'), path.join(root, 'internal'), 'junction');
    await symlink(outside, path.join(root, 'external'), 'junction');
  } catch (error) {
    if (!['EPERM', 'EACCES', 'ENOSYS'].includes(error.code)) throw error;
    t.skip(`This environment cannot create symlinks (${error.code}).`);
    return;
  }
  const result = await checkMarkdownLinks(root, ['source.md']);
  assert.equal(result.checked, 2);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0].message, /outside the repository through a symlink/);
  assert.equal(result.errors[0].line, 2);
});

test('detects a case-mismatched target on a case-sensitive filesystem', async (t) => {
  const { root } = await fixture(t, {
    'source.md': '[wrong case](Target.md)',
    'target.md': '',
  });
  if (process.platform === 'win32') {
    t.skip('Windows lookup is case-insensitive; Linux CI must verify this case.');
    return;
  }
  const result = await checkMarkdownLinks(root, ['source.md']);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0].message, /does not exist.*ENOENT/);
});
