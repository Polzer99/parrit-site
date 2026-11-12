#!/usr/bin/env node
// The historical tests explicitly freeze the 31 translated originals. Replay
// them unchanged in an isolated historical corpus, then test every new article
// against the actual candidate build. Never move files out of the real checkout.
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
export function verifyJournal(root = process.cwd(), execute = execFileSync) {
  const run = (command, args, cwd = root) => execute(command, args, { cwd, stdio: 'inherit', timeout: 12 * 60 * 1000 });
  const manifest = JSON.parse(readFileSync(path.join(root, 'content/plan/journal-translations.json'), 'utf8'));
  let historical;
  try {
    if (manifest.length) {
      historical = mkdtempSync(path.join(tmpdir(), 'journal-historical-check-'));
      cpSync(root, historical, { recursive: true, filter: source => {
        const relative = path.relative(root, source);
        return !['node_modules', '.next', '.git', 'test-results', 'playwright-report', '.codex-handoffs'].includes(relative.split(path.sep)[0]);
      } });
      symlinkSync(path.join(root, 'node_modules'), path.join(historical, 'node_modules'), 'dir');
      for (const slug of manifest) {
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('manifest invalide');
        for (const locale of ['', 'fr/']) rmSync(path.join(historical, `content/journal/${locale}${slug}.mdx`));
      }
      writeFileSync(path.join(historical, 'content/plan/journal-translations.json'), '[]\n');
      run('npm', ['run', 'build', '--', '--webpack'], historical);
      run('npm', ['test'], historical);
    }
    run('npm', ['run', 'lint']);
    run('npm', ['run', 'build', '--', '--webpack']);
    run('npm', ['run', 'qa:claims:rev01']);
    run('npm', ['run', 'qa:brand:rev01']);
    run('npm', ['run', 'test:brand-os']);
    if (!manifest.length) run('npm', ['test']);
    else {
      const tests = readdirSync(path.join(root, 'tests')).filter(file => file.startsWith('journal-machine-') && file.endsWith('.test.mjs')).map(file => `tests/${file}`);
      run(process.execPath, ['--test', ...tests]);
    }
  } finally { if (historical && existsSync(historical)) rmSync(historical, { recursive: true, force: true }); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) verifyJournal();
