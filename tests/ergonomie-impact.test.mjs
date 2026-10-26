import test from 'node:test';
import assert from 'node:assert/strict';
import { renderPage } from './helpers/site-v1-render.mjs';
import { visibleText } from '../scripts/brand-os-contracts.mjs';

for (const locale of ['fr', 'en']) {
  test(`accessible home restores approved scene and moves process without JS (${locale})`, async () => {
    const html = await renderPage(locale);
    const hero = html.match(/<section[^>]*id="H01"[\s\S]*?<\/section>/)[0];
    const consulting = html.match(/<section[^>]*id="H03"[\s\S]*?<\/section>/)[0];
    assert.match(hero, /class="product-scene"/);
    assert.match(hero, /scene-carte-visite-fiche-crm/);
    assert.match(hero, /class="v1-demo-note">[^<]+/);
    assert.doesNotMatch(hero, /class="v1-process"/);
    assert.ok(consulting.indexOf('</ol>') < consulting.indexOf('<figure'));
    assert.doesNotMatch(html, /class="k"|class="v1-index"|<dt>/);
    const steps = html.match(/<ol class="v1-sequence v1-method">[\s\S]*?<\/ol>/)[0];
    assert.equal((steps.match(/<li>/g) ?? []).length, 6);
    assert.equal((steps.match(/<svg/g) ?? []).length, 5);
    for (const [, text] of html.matchAll(/<a class="rev-button [^"]+"[^>]*>(.*?)<\/a>/g)) assert.doesNotMatch(visibleText(text), /\.$/);
  });
  test(`accessible guides preserve all unenhanced panel titles (${locale})`, async () => {
    for (const id of ['consulting-transformation', 'ai-sprints', 'engineering-integration', 'harness-engineering']) {
      const html = await renderPage(locale, id);
      assert.doesNotMatch(html, /class="k"|class="v1-index"|registry-line/);
      if (id === 'engineering-integration') {
        assert.match(html, /data-enhanced="false"/);
        assert.doesNotMatch(html, /class="sr-only"|\shidden[=> ]/);
        assert.equal((html.match(/<h3>/g) ?? []).length, 3);
      }
    }
  });
}
