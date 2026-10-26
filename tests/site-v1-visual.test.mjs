import test from 'node:test';
import assert from 'node:assert/strict';
import { renderPage } from './helpers/site-v1-render.mjs';

for (const locale of ['fr', 'en']) {
  test(`V3 ${locale}: ordered methods, evidence metadata and final destinations render without JS`, async () => {
    const html = await renderPage(locale);
    for (const [id, count] of [['H03', 4], ['H11', 6]]) {
      const section = html.match(new RegExp(`<section[^>]*id="${id}"[^>]*>([\\s\\S]*?)</section>`))[1];
      const numbers = [...section.matchAll(/class="v1-index" aria-hidden="true">(\d+)</g)].map(match => match[1]);
      assert.deepEqual(numbers, Array.from({ length: count }, (_, i) => String(i + 1).padStart(2, '0')));
      assert.match(section, /<ol/);
    }
    const closing = html.match(/<section[^>]*id="H12"[^>]*>([\s\S]*?)<\/section>/)[1];
    const links = [...closing.matchAll(/<a[^>]*href="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(links, Array(3).fill(locale === 'fr' ? '/fr/commission' : '/commission'));
    const cases = [...html.matchAll(/<article class="v1-case"[^>]*>([\s\S]*?)<\/article>/g)];
    assert.equal(cases.length, 3);
    for (const [, card] of cases) {
      assert.match(card, /^<dl class="v1-case-status">/);
      assert.ok(card.indexOf('</dl>') < card.indexOf('<h3>'));
      assert.equal((card.match(/<dt>/g) ?? []).length, 4);
    }
    for (const regime of ['ink', 'calm', 'canard']) assert.ok(html.includes(`data-regime="${regime}"`));
    assert.doesNotMatch(html, /data-regime="rose"/);
    const diagram = html.match(/<figure class="v1-process"[\s\S]*?<\/figure>/)[0];
    assert.equal((diagram.match(/<svg/g) ?? []).length, 2);
    assert.equal((diagram.match(/stroke-width="2"/g) ?? []).length, 2);
    assert.doesNotMatch(diagram, /[→←]/);
  });
}
