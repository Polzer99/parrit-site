import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderPage } from './helpers/site-v1-render.mjs';

for (const locale of ['fr', 'en']) {
  test(`four-step process and canonical final actions render without JS (${locale})`, async () => {
    const html = await renderPage(locale);
    const figure = html.match(/<figure class="v1-process"[\s\S]*?<\/figure>/)[0];
    assert.match(figure, /aria-label="[^"]+"/);
    const columns = [...figure.matchAll(/<div[^>]*>([\s\S]*?)<\/div>/g)];
    assert.equal(columns.length, 2);
    assert.equal((figure.match(/class="v1-process-target"/g) ?? []).length, 1);
    const firstSteps = [];
    for (const [, column] of columns) {
      assert.equal((column.match(/<p>/g) ?? []).length, 5);
      assert.equal((column.match(/<svg /g) ?? []).length, 3);
      assert.equal((column.match(/<\/p><svg[\s\S]*?<\/svg><p>/g) ?? []).length, 3);
      firstSteps.push(column.match(/<\/strong><\/p><p>([^<]+)<\/p>/)[1]);
    }
    assert.equal(firstSteps[0], firstSteps[1]);
    const destination = locale === 'fr' ? '/fr/commission' : '/commission';
    const close = html.match(/<section id="H12"[\s\S]*?<\/section>/)[0];
    assert.match(close, new RegExp(`<a class="rev-button exec" href="${destination}">`));
    for (const id of ['consulting-transformation', 'ai-sprints', 'engineering-integration', 'harness-engineering']) {
      const page = await renderPage(locale, id);
      const sections = [...page.matchAll(/<section[^>]*>[\s\S]*?<\/section>/g)].map(m => m[0]);
      assert.match(sections[0], new RegExp(`<a class="rev-button ghost" href="${destination}">`));
      assert.match(sections.at(-1), new RegExp(`<a class="rev-button exec" href="${destination}">`));
    }
  });
}
test('grain breathing space and target marker use canonical tokens', async () => {
  const grain = await readFile('src/system/components/Matiere.module.css', 'utf8');
  assert.match(grain, /margin-top:\s*var\(--brand-s6\)/);
  const css = await readFile('src/system/site-v1.css', 'utf8');
  assert.match(css, /\.v1-process-target\s*\{[^}]*border-top-color:\s*var\(--brand-acc\)/);
});
