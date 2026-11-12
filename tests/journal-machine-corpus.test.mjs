import assert from 'node:assert/strict';
import { test, mock } from 'node:test';
import { readFileSync } from 'node:fs';
import { getJournalEntry } from '../src/system/journal-data.ts';
import { gateAdaptation, gateStructure, gateAntiIA, gateParrit, visibleArticle } from '../scripts/journal-machine-gates.mjs';
import { loader } from './helpers/site-v1-render.mjs';
import ReactMarkdown from 'react-markdown';
import { renderToStaticMarkup } from 'react-dom/server';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
const denyNetwork = () => { throw new Error('Network forbidden in tests'); };
mock.method(globalThis, 'fetch', denyNetwork);
for (const transport of [http, https]) for (const method of ['get', 'request']) mock.method(transport, method, denyNetwork);
mock.method(net.Socket.prototype, 'connect', denyNetwork);


const manifest = JSON.parse(readFileSync('content/plan/journal-translations.json', 'utf8'));
test('le manifeste machine est distinct du corpus historique', () => { assert.ok(Array.isArray(manifest)); });
for (const slug of manifest) test(`candidate réellement lisible et rendu bilingue : ${slug}`, async () => {
  const fr = readFileSync(`content/journal/fr/${slug}.mdx`, 'utf8');
  const en = readFileSync(`content/journal/${slug}.mdx`, 'utf8');
  assert.equal(gateAdaptation(fr, en).ok, true);
  for (const [locale, raw] of [['fr', fr], ['en', en]]) {
    const gates = [gateStructure(raw, slug, locale), gateAntiIA(visibleArticle(raw)), gateParrit(visibleArticle(raw))];
    assert.ok(gates.every(gate => gate.ok), JSON.stringify(gates));
    const entry = getJournalEntry(slug, locale);
    assert.ok(entry); assert.ok(entry.faq.length >= 2); assert.equal(entry.pilier, getJournalEntry(slug).pilier);
    const load = loader(locale, { 'react-markdown': ReactMarkdown, 'next/navigation': { notFound: () => assert.fail('404') }, '@/system/components': { HarnessBadge: () => null } });
    const page = load('src/app/(rev01)/journal/[slug]/page.tsx');
    const html = renderToStaticMarkup(await page.default({ params: Promise.resolve({ slug }) }));
    assert.doesNotMatch(html, /journal-faq-title|booking-call-title/); assert.match(html, /"@type":"FAQPage"/);
    const faq = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1])).find(item => item['@type'] === 'FAQPage');
    assert.deepEqual(faq.mainEntity.map(item => item.name), entry.faq.map(item => item.q));
    const metadata = await page.generateMetadata({ params: Promise.resolve({ slug }) });
    assert.equal(metadata.openGraph.modifiedTime, entry.updatedAt);
    const sitemap = load('src/app/sitemap.ts').default();
    assert.ok(sitemap.some(item => item.url === `https://parrit.ai${locale === 'fr' ? '/fr' : ''}/journal/${slug}`));
  }
});

test('les liens du registre CTA gardent leurs destinations sans charger le corpus Journal', () => {
  const load = loader('fr');
  const { ctaHref, getCta, avecSource, bookingPath } = load('src/lib/registry/cta.ts');
  const { localizedPath } = load('src/system/locale.ts');
  for (const locale of ['fr', 'en']) {
    assert.equal(bookingPath(locale), localizedPath('/rendez-vous', locale));
    for (const id of ['rdv.paul', 'rdv.systeme', 'rdv.offre', 'rdv.auteur', 'diagnostic.decrire_mon_cas', 'ressource.demander', 'ressource.telecharger', 'veille.recevoir', 'prototype.demander', 'presse.kit', 'presse.contact']) {
      assert.equal(ctaHref(id, locale, 'test'), avecSource(localizedPath(getCta(id).cible, locale), 'test'));
    }
  }
});
