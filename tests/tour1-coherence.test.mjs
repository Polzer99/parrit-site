import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { ownershipClaims } from '../scripts/lib/ownership-claims.mjs';
import { renderPage } from './helpers/site-v1-render.mjs';

test('Journal claim gate checks headings and summaries but leaves article bodies out of scope', () => {
  for (const claim of ['owned by the client', 'belongs to it', 'sent and reconciled automatically', 'runs itself']) {
    assert.equal(ownershipClaims(`---\ndescription: "${claim}"\n---\n`, 'content/journal/test.mdx').length, 1);
    assert.equal(ownershipClaims(`---\ndescription: "Approved"\n---\n${claim}`, 'content/journal/test.mdx').length, 0);
  }
  assert.equal(ownershipClaims('---\ndescription: >\n  Sent and reconciled\n  automatically.\n---\n', 'content/journal/test.mdx').length, 1);
  for (const file of readdirSync('content/journal').filter(f => f.endsWith('.mdx'))) assert.deepEqual(ownershipClaims(readFileSync(`content/journal/${file}`, 'utf8'), `content/journal/${file}`), []);
});
for (const locale of ['fr', 'en']) test(`shared sequences and FAQ retain content without JavaScript ${locale}`, async () => {
  const home = await renderPage(locale);
  for (const [id, count] of [['H03', 4], ['H05', 4], ['H11', 6]]) {
    const section = home.match(new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?</section>`))[0];
    assert.equal((section.match(/<li>/g) ?? []).length, count);
    const sequence = section.match(/<ol[\s\S]*?<\/ol>/)[0];
    assert.equal((sequence.match(/<svg/g) ?? []).length, count - 1);
  }
  const guide = await renderPage(locale, 'ai-sprints');
  assert.equal((guide.match(/<details class="v1-faq"/g) ?? []).length, 2);
  assert.match(guide, /<summary><span>[^<]+<\/span><svg aria-hidden="true"/);
  assert.match(home, /id="H12" class="final-call/);
});
test('built redirects put French article aliases before generic routes', () => {
  const { redirects } = JSON.parse(readFileSync('.next/routes-manifest.json', 'utf8'));
  const redirect = redirects.find(r => r.source === '/fr/journal/:slug');
  assert.equal(redirect?.statusCode, 308);
  assert.equal(redirect?.destination, '/journal/:slug');
  const alias = redirects.find(r => r.source === '/fr/journal/une-carte-une-action');
  assert.equal(alias?.statusCode, 308);
  assert.equal(alias?.destination, '/journal/one-card-one-action');
  assert.ok(redirects.indexOf(alias) < redirects.indexOf(redirect));
  assert.ok(!redirects.some(r => r.source === '/fr/journal'));
});
