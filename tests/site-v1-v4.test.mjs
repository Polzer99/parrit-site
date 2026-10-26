import test from 'node:test';
import assert from 'node:assert/strict';
import { renderPage } from './helpers/site-v1-render.mjs';

for (const locale of ['fr', 'en']) {
  test(`V4 closing has one final destination without JavaScript (${locale})`, async () => {
    const html = await renderPage(locale);
    const closing = html.match(/<section[^>]*id="H12"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(closing);
    const links = [...closing.matchAll(/<a\b[^>]*href="([^"]+)"/g)];
    assert.deepEqual(links.map(match => match[1]), [locale === 'fr' ? '/fr/commission' : '/commission']);
  });
}
