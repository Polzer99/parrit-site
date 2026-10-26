import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateGrain, readTokens, TONES, INK, makeTile, chunk } from '../scripts/generate-grain.mjs';
import { checkGrain, decodeGrain } from '../scripts/check-grain.mjs';

const css = await readFile('src/system/brand-os.tokens.css', 'utf8');
async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'parrit-grain-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'src/system'), { recursive: true });
  await writeFile(join(root, 'src/system/brand-os.tokens.css'), css);
  return root;
}
const tile = (root, tone) => readFile(join(root, `public/matiere/grain-${tone}.png`));

test('two prebuild generations are byte-identical and match delivered tiles', async t => {
  const root = await fixture(t);
  await generateGrain(root);
  const first = await Promise.all(Object.keys(TONES).map(tone => tile(root, tone)));
  await generateGrain(root);
  await checkGrain(root);
  for (const [i, tone] of Object.keys(TONES).entries()) {
    assert.deepEqual(await tile(root, tone), first[i]);
    assert.deepEqual(await tile(process.cwd(), tone), first[i]);
    assert.ok(first[i].length < 4096);
    const { palette, pixels } = decodeGrain(first[i]);
    assert.equal(palette.length, 6);
    assert.equal(pixels.length, 256 * 256);
    assert.equal(pixels.filter(Boolean).length, Math.round(128 * 128 * TONES[tone][1]) * 4);
  }
});

test('changing each token in an isolated copy changes the corresponding tiles', async t => {
  const root = await fixture(t);
  const tokens = readTokens(css);
  await generateGrain(root);
  const before = await Promise.all(Object.keys(TONES).map(tone => tile(root, tone)));
  for (const [name, color] of tokens) {
    const changed = Buffer.from(color); changed[0] ^= 1;
    const replacement = `#${changed.toString('hex')}`;
    await writeFile(join(root, 'src/system/brand-os.tokens.css'), css.replace(new RegExp(`(${name}\\s*:\\s*)#[\\da-f]{6}`, 'i'), `$1${replacement}`));
    await generateGrain(root);
    await checkGrain(root);
    for (const [i, [tone, [background]]] of Object.entries(TONES).entries()) {
      const after = await tile(root, tone);
      if (name === INK || name === background) assert.notDeepEqual(after, before[i]);
      else assert.deepEqual(after, before[i]);
    }
  }
});

test('missing, unreadable, duplicate and identical colors fail closed', () => {
  for (const name of readTokens(css).keys()) {
    assert.throws(() => readTokens(css.replace(name, '--removed-token')));
    assert.throws(() => readTokens(css.replace(new RegExp(`${name}\\s*:[^;]+`), `${name}:transparent`)));
    assert.throws(() => readTokens(`${css}\n:root {${name}: invalid;}`));
  }
  const ink = readTokens(css).get(INK);
  assert.throws(() => makeTile(ink, ink, 0.06));
});

test('brand gate rejects foreign palette, wrong density, corruption and extra files', async t => {
  const root = await fixture(t);
  await generateGrain(root);
  const path = join(root, 'public/matiere/grain-clair.png');
  const original = await readFile(path);
  const tokens = readTokens(css);
  const foreign = Buffer.from(tokens.get('--brand-core-off')); foreign[0] ^= 1;
  await writeFile(path, makeTile(foreign, tokens.get(INK), 0.06));
  await assert.rejects(checkGrain(root), /colors/);
  await writeFile(path, makeTile(tokens.get('--brand-core-off'), tokens.get(INK), 0.10));
  await assert.rejects(checkGrain(root), /density/);
  const corrupt = Buffer.from(original); corrupt[corrupt.length - 1] ^= 1;
  await writeFile(path, corrupt);
  await assert.rejects(checkGrain(root), /checksum/);
  // Even a valid extra transparency chunk is forbidden.
  await writeFile(path, Buffer.concat([original.subarray(0, 51), chunk('tRNS', Buffer.from([0, 255])), original.subarray(51)]));
  await assert.rejects(checkGrain(root), /format/);
  await writeFile(path, original);
  await writeFile(join(root, 'public/matiere/extra.txt'), 'unexpected');
  await assert.rejects(checkGrain(root), /exactly/);
});

for (const locale of ['fr', 'en']) {
  test(`server-rendered home has one empty decorative tile; guide pages have none (${locale})`, async () => {
    const { renderPage, loader } = await import('./helpers/site-v1-render.mjs');
    const { renderToStaticMarkup } = await import('react-dom/server');
    const React = await import('react');
    const html = await renderPage(locale);
    assert.equal([...html.matchAll(/data-matiere=/g)].length, 1);
    assert.match(html, /<div aria-hidden="true" data-matiere="clair"[^>]*><\/div>/);
    for (const id of ['consulting-transformation', 'ai-sprints', 'engineering-integration', 'harness-engineering']) {
      assert.doesNotMatch(await renderPage(locale, id), /data-matiere/);
    }
    const { Matiere } = loader(locale)('src/system/components/Matiere.tsx');
    assert.match(renderToStaticMarkup(React.createElement(Matiere, { tone: 'canard' })), /<div aria-hidden="true" data-matiere="canard"[^>]*><\/div>/);
  });
}
