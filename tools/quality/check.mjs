import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateRepository } from './lib/validate.mjs';

let root = fileURLToPath(new URL('../../', import.meta.url));
try {
  const args = process.argv.slice(2);
  if (args.length) {
    if (args.length !== 2 || args[0] !== '--root') throw new Error('Usage: check.mjs [--root <repository>]');
    root = path.resolve(args[1]);
  }
  const report = await validateRepository(root);
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = report.ok ? 0 : 1;
} catch (error) {
  console.error(JSON.stringify({ ok: false, errors: [{ rule: 'quality-runner', message: error.message }] }, null, 2));
  process.exitCode = 1;
}
