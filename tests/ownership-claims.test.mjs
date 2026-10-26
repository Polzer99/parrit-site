import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { ownershipClaims } from '../scripts/lib/ownership-claims.mjs';

const claims = ['vous appartiennent', 'propriétaire du système', 'propriétaire de tout', 'propriété complète', 'you keep ownership', 'full client ownership', 'belong to you', 'belongs to you'];
test('ownership gate catches each forbidden promise in dictionaries, JSX and metadata', () => {
  for (const claim of claims) {
    for (const source of [`const copy = { description: ${JSON.stringify(claim)} };`, `const view = <p>${claim}</p>;`, 'const copy = `' + claim + '`;']) {
      assert.equal(ownershipClaims(source, 'src/app/(rev01)/standard/page.tsx').length, 1, source);
      assert.equal(ownershipClaims(source, 'src/system/copy.tsx').length, 1, source);
    }
  }
  assert.equal(ownershipClaims('const copy = "FULL CLIENT\\nOWNERSHIP";', 'src/system/copy.ts').length, 1);
});
test('ownership gate excludes comments and protected routes, and accepts scoped assignment', () => {
  assert.deepEqual(ownershipClaims('// full client ownership\n/* vous appartiennent */\nconst c = <p>{/* belong to you */}Written assignment of what is built for you.</p>;', 'src/system/copy.tsx'), []);
  for (const route of ['legal', 'sketch/[id]', 'journal', 'fr/legal']) {
    assert.deepEqual(ownershipClaims('const c = "full client ownership";', `src/app/(rev01)/${route}/page.tsx`), []);
  }
  assert.deepEqual(ownershipClaims('const c = "Le contrat vous cède les droits sur le code développé pour vous ; vos données restent les vôtres.";', 'src/system/copy.ts'), []);
});
test('qa claims exits nonzero on an injected ownership promise and passes after correction', async t => {
  const root = await mkdtemp(join(tmpdir(), 'ownership-gate-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const dir of ['src/system', 'scripts', 'content/journal', 'public']) await mkdir(join(root, dir), { recursive: true });
  for (const file of ['public/llms.txt', 'site.config.ts', 'TRUTH.md']) await writeFile(join(root, file), '');
  const path = join(root, 'src/system/copy.ts');
  const check = () => spawnSync(process.execPath, [resolve('scripts/false-claims-check.mjs')], { cwd: root, encoding: 'utf8' });
  await writeFile(path, 'const copy = "full client ownership";');
  const rejected = check();
  assert.equal(rejected.status, 1);
  assert.match(rejected.stderr, /unsupported ownership/);
  await writeFile(path, 'const copy = "Written assignment of what is built for you.";');
  const accepted = check();
  assert.equal(accepted.status, 0, accepted.stderr);
});
