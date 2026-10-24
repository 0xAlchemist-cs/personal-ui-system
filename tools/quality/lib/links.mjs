import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fromMarkdown } from 'mdast-util-from-markdown';

function isOutside(root, target) {
  const relative = path.relative(root, target);
  return relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative);
}

function* descendants(node) {
  yield node;
  for (const child of node.children ?? []) yield* descendants(child);
}

function diagnostic(file, node, message) {
  const start = node?.position?.start;
  return {
    file,
    rule: 'markdown-link',
    message,
    ...(start ? { line: start.line, column: start.column } : {}),
  };
}

function identifier(node) {
  // The parser normalizes reference identifiers; retaining normalization here
  // also makes the first-definition-wins policy explicit.
  return node.identifier.trim().replace(/\s+/g, ' ').toLowerCase();
}

function classifyTarget(url) {
  // Network-path references are URLs, never paths relative to this checkout.
  if (url.startsWith('//')) return { ignored: true };
  if (/^\/?[a-z]:/i.test(url) || /^file:/i.test(url)) {
    return { error: 'Use a repository-relative URL path; drive paths, file: URLs and backslashes are unsupported.' };
  }
  if (/^[a-z][a-z\d+.-]*:/i.test(url) || url.startsWith('#')) return { ignored: true };

  // Split URL suffixes before decoding: %23 and %3F can be filename characters.
  const rawPath = url.split(/[?#]/, 1)[0];
  if (!rawPath) return { ignored: true };
  let target;
  try {
    target = decodeURIComponent(rawPath);
  } catch {
    return { error: 'Local URL path has invalid percent encoding.' };
  }
  if (/^\/?[a-z]:/i.test(target) || /^file:/i.test(target) || target.includes('\\')) {
    return { error: 'Use a repository-relative URL path; drive paths, file: URLs and backslashes are unsupported.' };
  }
  if (target.includes('\0')) return { error: 'Local URL path contains a null character.' };
  if (target.startsWith('//')) return { error: 'Encoded network paths are unsupported; use an explicit external URL.' };
  return { target };
}

/**
 * Check active Markdown links/images in the supplied repository-owned files.
 * Ordinary paths resolve beside the source; /paths resolve from repository root.
 * Only local file/directory existence is checked, without HTTP or heading checks.
 * `checked` counts local link uses, including uses that produce a diagnostic.
 */
export async function checkMarkdownLinks(root, relativeFiles) {
  const repository = path.resolve(root);
  const realRepository = await realpath(repository);
  const errors = [];
  let checked = 0;

  for (const file of relativeFiles) {
    const source = path.resolve(repository, file);
    let tree;
    try {
      if (isOutside(repository, source) || isOutside(realRepository, await realpath(source))) {
        errors.push(diagnostic(file, null, 'Markdown source resolves outside the repository.'));
        continue;
      }
      tree = fromMarkdown(await readFile(source, 'utf8'));
    } catch (error) {
      errors.push(diagnostic(file, null, `Cannot read Markdown source (${error.code ?? error.name}).`));
      continue;
    }

    const definitions = new Map();
    for (const node of descendants(tree)) {
      if (node.type === 'definition' && !definitions.has(identifier(node))) {
        definitions.set(identifier(node), node);
      }
    }

    for (const node of descendants(tree)) {
      let url;
      if (node.type === 'link' || node.type === 'image') url = node.url;
      else if (node.type === 'linkReference' || node.type === 'imageReference') {
        url = definitions.get(identifier(node))?.url;
      }
      if (url === undefined) continue;

      const result = classifyTarget(url);
      if (result.ignored) continue;
      checked += 1;
      const quoted = JSON.stringify(url);
      if (result.error) {
        errors.push(diagnostic(file, node, `${quoted}: ${result.error}`));
        continue;
      }

      const target = result.target.startsWith('/')
        ? path.resolve(repository, result.target.slice(1))
        : path.resolve(path.dirname(source), result.target);
      if (isOutside(repository, target)) {
        errors.push(diagnostic(file, node, `${quoted}: Local target escapes the repository.`));
        continue;
      }
      try {
        if (isOutside(realRepository, await realpath(target))) {
          errors.push(diagnostic(file, node, `${quoted}: Local target resolves outside the repository through a symlink.`));
        }
      } catch (error) {
        errors.push(diagnostic(file, node, `${quoted}: Local target does not exist or cannot be resolved (${error.code ?? error.name}).`));
      }
    }
  }
  return { checked, errors };
}
