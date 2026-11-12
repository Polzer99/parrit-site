import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import { extractPublicationDate, fetchSource, gateSources, sourceVisibleText } from '../scripts/journal-machine-gates.mjs';
import { researchSources, researchInPasses, verifiedMaterial, inferredSourceKind, safeResearchError } from '../scripts/journal-machine-research.mjs';
const deny = () => { throw new Error('Network forbidden'); };
mock.method(globalThis, 'fetch', deny);
for (const transport of [http, https]) for (const method of ['get', 'request']) mock.method(transport, method, deny);
mock.method(net.Socket.prototype, 'connect', deny);
const today = '2026-11-12';
const read = name => readFileSync(new URL(`./fixtures/journal-machine/dates/${name}`, import.meta.url), 'utf8');
const extract = (html, url = 'https://insee.fr/report', headers = {}) => extractPublicationDate(html, url, headers, today);
const options = { today, resolve: async () => [{ address: '1.1.1.1' }] };
for (const [file, methode, url] of [
  ['json-ld.html', 'json_ld'], ['meta.html', 'meta'], ['time.html', 'time'], ['url.html', 'url', 'https://insee.fr/2026/08/01/report'],
  ['texte-fr.html', 'texte'], ['arxiv.html', 'arxiv', 'https://arxiv.org/abs/2608.00001'],
]) test(`fixture ${file}: date et méthode`, () => {
  const result = extract(read(file), url);
  assert.equal(result.published_at, '2026-08-01'); assert.equal(result.methode, methode);
});
test('JSON-LD privilégie published dans tout le graphe puis created, modified séparée', () => {
  assert.equal(extract(read('json-ld.html')).modified_at, '2026-10-01');
  assert.equal(extract('<script type="application/ld+json">[{"dateCreated":"2026-07-01"},{"datePublished":"2026-08-01"}]</script>').published_at, '2026-08-01');
  assert.equal(extract('<script type="application/ld+json">{"dateCreated":"2026-08-01","dateModified":"2026-10-01"}</script>').published_at, '2026-08-01');
  assert.equal(extract('<script type="application/ld+json">{"dateModified":"2026-10-01"}</script>'), null);
  assert.equal(extract('<script type="application/ld+json">{"__proto__":{}}</script>'), null);
});
for (const name of ['article:published_time', 'og:published_time', 'citation_publication_date', 'citation_date', 'DC.date', 'dcterms.issued', 'date', 'pubdate', 'parsely-pub-date', 'sailthru.date']) test(`métadonnée ${name}`, () => {
  assert.deepEqual(extract(`<meta content="2026-08-01" name="${name}">`), { published_at: '2026-08-01', methode: 'meta' });
});
test('priorité indépendante de l’ordre des meta et JSON malformé toléré', () => {
  assert.equal(extract('<script type="application/ld+json">{broken</script><meta name="date" content="2026-09-01"><meta property="article:published_time" content="2026-08-01">').published_at, '2026-08-01');
});
test('time limité au premier article ou à l’en-tête', () => {
  assert.equal(extract('<footer><time datetime="2026-08-01"></time></footer>'), null);
  assert.equal(extract('<article>Vide</article><article><time datetime="2026-08-01"></time></article>'), null);
  assert.equal(extract('<header><time datetime="2026-08-01"></time></header>').methode, 'time');
});
for (const path of ['/2026/08/01/report', '/2026-08-01-report', '/report-20260801.pdf']) test(`date URL ${path}`, () => {
  assert.deepEqual(extract('aucune date', `https://insee.fr${path}`), { published_at: '2026-08-01', methode: 'url' });
});
for (const text of ['Publié le 01/08/2026', 'Mis à jour le 1 août 2026', 'Published: August 1st, 2026', 'Updated on 1 August 2026', 'Published on 2026-08-01']) test(`date visible ${text}`, () => {
  assert.deepEqual(extract(`<p>${text}</p>`), { published_at: '2026-08-01', methode: 'texte' });
});
test('rejette futur, avant 1990, dates impossibles, date HTTP et texte non visible', () => {
  for (const date of ['2099-01-01', '1989-12-31', '2026-02-30', '2026-13-01', '2026-08']) assert.equal(extract(`<meta name="date" content="${date}">`), null);
  assert.equal(extract('sans date', undefined, { date: '2026-08-01', 'last-modified': '2026-08-01' }), null);
  assert.equal(extract('<script>Published August 1, 2026</script><!-- Published August 1, 2026 --><style>Published August 1, 2026</style>'), null);
  assert.equal(extract('<meta name="date" content="2099-01-01"><article><time datetime="2026-08-01"></time></article>').methode, 'time');
});
test('PDF : CreationDate prioritaire, puis première date complète des deux premières pages', () => {
  const pdf = JSON.parse(read('pdf.json'));
  assert.deepEqual(extract(pdf), { published_at: '2026-08-01', methode: 'pdf_creation' });
  delete pdf.creationDate;
  assert.deepEqual(extract(pdf), { published_at: '2026-09-01', methode: 'pdf_texte' });
  pdf.pages[1] = 'sans date'; assert.equal(extract(pdf), null);
  pdf.creationDate = 'D:20990101000000'; assert.equal(extract(pdf), null);
});
// Minimal real three-page PDF, including a compressed content stream. No network
// or Python package is involved; Poppler is exercised through the production path.
import { deflateSync } from 'node:zlib';
function pdfBytes(creationDate, pageText = ['12 percent of 100 records.', '1 August 2026', '1 September 2026']) {
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R 4 0 R 5 0 R] /Count 3 >>',
    ...[6, 7, 8].map(id => `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 300] /Resources << /Font << /F1 9 0 R >> >> /Contents ${id} 0 R >>`),
    ...pageText.map(text => { const data = deflateSync(Buffer.from(`BT /F1 12 Tf 20 250 Td (${text}) Tj ET`)); return Buffer.concat([Buffer.from(`<< /Length ${data.length} /Filter /FlateDecode >>\nstream\n`), data, Buffer.from('\nendstream')]); }),
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', `<< ${creationDate ? `/CreationDate (${creationDate})` : ''} >>`];
  const parts = [Buffer.from('%PDF-1.4\n')], offsets = [0];
  for (const [i, object] of objects.entries()) { offsets.push(Buffer.concat(parts).length); parts.push(Buffer.from(`${i + 1} 0 obj\n`), Buffer.isBuffer(object) ? object : Buffer.from(object), Buffer.from('\nendobj\n')); }
  const start = Buffer.concat(parts).length;
  parts.push(Buffer.from(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map(n => `${String(n).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 10 0 R >>\nstartxref\n${start}\n%%EOF`));
  return Buffer.concat(parts);
}
test('récupère et décode un vrai PDF compressé, métadonnées et texte', async () => {
  const result = await fetchSource('https://insee.fr/report.pdf', { ...options, details: true, fetchImpl: async () => new Response(pdfBytes('D:20260701090000Z'), { headers: { 'content-type': 'application/pdf' } }) });
  assert.deepEqual(result.publication, { published_at: '2026-07-01', methode: 'pdf_creation' });
  assert.match(result.text, /12 percent of 100 records/);
  const fallback = await fetchSource('https://insee.fr/report.pdf', { ...options, details: true, fetchImpl: async () => new Response(pdfBytes()) });
  assert.deepEqual(fallback.publication, { published_at: '2026-08-01', methode: 'pdf_texte' });
  const third = await fetchSource('https://insee.fr/report.pdf', { ...options, details: true, fetchImpl: async () => new Response(pdfBytes(undefined, ['Report', 'No date', '1 August 2026'])) });
  assert.equal(third.publication, null);
});
const citations = count => Array.from({ length: count }, (_, i) => ({ type: 'url_citation', url_citation: { url: `https://insee.fr/report-${i}`, title: `Rapport ${i}`, content: '999 % inventés' } }));
const page = i => `<meta name="date" content="2026-08-01"><article><p>${20 + i} % des dossiers sont repris.</p><p>${100 + i} salariés participent.</p></article>`;
test('annotations sans JSON du modèle acceptées et faits extraits uniquement des pages', async () => {
  for (const content of ['{}', 'not json', '{"sources":[]}']) {
    const sources = researchSources({ content, annotations: citations(3) }, {}, today);
    const diagnostics = { sources_acceptees: [] };
    const material = await verifiedMaterial(sources, { ...options, fetchImpl: async url => new Response(page(Number(url.split('-').at(-1)))) }, diagnostics);
    assert.equal(material.length, 3);
    assert.ok(material.every(s => s.author === 'insee.fr' && s.kind === 'study' && s.published_at === '2026-08-01'));
    assert.ok(material.every(s => s.facts.length === 2 && !s.facts.join(' ').includes('999')));
    assert.ok(diagnostics.sources_acceptees.every(s => s.editeur === 'insee.fr' && s.methode === 'meta' && s.faits_chiffres === 2));
  }
});
test('date de page prime sur modèle ; page ancienne et faits inventés restent refusés', async () => {
  const annotations = citations(3);
  const metadata = annotations.map(a => ({ url: a.url_citation.url, published_at: '2020-01-01', author: 'Institut', kind: 'study' }));
  const sources = researchSources({ content: JSON.stringify({ sources: metadata }), annotations }, {}, today);
  const material = await verifiedMaterial(sources, { ...options, fetchImpl: async url => new Response(page(Number(url.split('-').at(-1)))) });
  assert.ok(material.every(s => s.published_at === '2026-08-01' && s.author === 'Institut'));
  await assert.rejects(verifiedMaterial(sources, { ...options, fetchImpl: async () => new Response(page(1).replace('2026-08-01', '2020-01-01')) }), /materiau_insuffisant/);
  await assert.rejects(verifiedMaterial(sources.map(s => ({ ...s, facts: ['999 % inventés'] })), { ...options, fetchImpl: async () => new Response(page(1)) }), /materiau_insuffisant/);
});
test('inférence selon registre, presse, éditeurs et lois', () => {
  for (const [host, kind] of [['insee.fr', 'study'], ['arxiv.org', 'study'], ['lemonde.fr', 'news'], ['reuters.com', 'news'], ['openai.com', 'documentation'], ['legifrance.gouv.fr', 'law'], ['eur-lex.europa.eu', 'law']]) assert.equal(inferredSourceKind(`https://www.${host}/a`), kind);
});
test('plafond 24 et quatre pages concurrentes, ordre des diagnostics stable', async () => {
  const sources = researchSources({ content: '{}', annotations: citations(30) }, {}, today);
  let active = 0, maximum = 0; const calls = [], diagnostics = { sources_acceptees: [], sources_ecartees: [] };
  const material = await verifiedMaterial(sources, { ...options, fetchImpl: async (url, init) => {
    const i = Number(url.split('-').at(-1)); calls.push(i); active++; maximum = Math.max(maximum, active);
    assert.ok(init.signal instanceof AbortSignal);
    await new Promise(resolve => setTimeout(resolve, (4 - i % 4) * 2)); active--;
    return new Response(page(i));
  } }, diagnostics);
  assert.equal(maximum, 4); assert.equal(calls.length, 24);
  assert.deepEqual(material.map(s => s.url), sources.slice(0, 24).map(s => s.url));
  assert.equal(diagnostics.sources_ecartees.filter(s => s.motif === 'limite_pages').length, 6);
});
test('ordre institutions puis presse puis contradiction conservé', async () => {
  const diagnostics = {}; let i = 0;
  const sources = await researchInPasses({ topic: { requete: 'test' }, today, diagnostics, ask: async (_role, _messages, extra) => extra.plugins ? { content: '{}', annotations: [citations(3)[i++]] } : { content: '{}' } });
  assert.deepEqual(sources.map(s => s.url), citations(3).map(a => a.url_citation.url));
});
test('diagnostic interruption : passe et message borné, secrets retirés aussi de l’erreur propagée', async () => {
  const diagnostics = {}; let calls = 0;
  await assert.rejects(researchInPasses({ topic: { requete: 'test' }, today, diagnostics, ask: async (_role, _messages, extra) => {
    if (!extra.plugins) return { content: '{}' };
    if (++calls === 2) throw new Error('Timeout token=confidentiel Bearer credential https://example.com/?secret=x ' + 'x'.repeat(250));
    return { content: '{}', annotations: citations(3) };
  } }), error => !/confidentiel|credential|example\.com/.test(error.message));
  assert.equal(diagnostics.recherche_interrompue.passe, 'presse_editeurs');
  assert.ok(diagnostics.recherche_interrompue.message.length <= 200);
  assert.ok(diagnostics.sources_ecartees.every(s => s.passe === 'presse_editeurs' && s.message.startsWith('Timeout')));
  assert.ok(!JSON.stringify(diagnostics).includes('confidentiel'));
  assert.equal(safeResearchError(new Error('sk-or-v1-abcdef')), '[secret]');
});
test('porte finale accepte la date meta sans date visible et refuse une divergence', async () => {
  const fr = readFileSync(new URL('./fixtures/journal-machine/fr.mdx', import.meta.url), 'utf8');
  const sourceText = readFileSync(new URL('./fixtures/journal-machine/source.txt', import.meta.url), 'utf8');
  const fixtures = JSON.parse(readFileSync(new URL('./fixtures/journal-machine/openrouter.json', import.meta.url), 'utf8'));
  const annotations = researchSources(fixtures.research.choices[0].message, {}, today);
  const fetching = { ...options, fetchImpl: async url => new Response(`<meta name="date" content="${annotations.find(s => s.url === url).published_at}"><article>${sourceText.replace(/2026-\d{2}-\d{2}/g, '')}</article>`) };
  assert.equal((await gateSources(fr, annotations, fetching)).ok, true);
  const bad = { ...options, fetchImpl: async () => new Response(`<meta name="date" content="2026-07-01"><article>${sourceText}</article>`) };
  assert.equal((await gateSources(fr, annotations, bad)).ok, false);
  assert.ok(!sourceVisibleText('<head><meta name="x" content="999 %"></head><script>888 %</script><article>12 %</article>').includes('999'));
});

test('faits sans modèle préservés avec balisage inline et retours de mise en forme HTML', async () => {
  const sources = researchSources({ content: '{}', annotations: citations(3) }, {}, today);
  const accepted = await verifiedMaterial(sources, { ...options, fetchImpl: async url => {
    const i = Number(url.split('-').at(-1));
    return new Response(`<meta name="date" content="2026-08-01"><article><p>Le taux atteint\n<strong>${40 + i} %</strong>\ndes entreprises interrogées.</p><p>Le gain est de <em>${15 + i} heures</em> pour chaque équipe.</p></article>`);
  } });
  assert.ok(accepted.every(s => s.facts.length === 2));
  assert.match(accepted[0].facts[0], /Le taux atteint\s+40 %\s+des entreprises/);
});
test('dates de publication seules ne comptent pas comme faits chiffrés', async () => {
  const sources = researchSources({ content: '{}', annotations: citations(3) }, {}, today);
  const diagnostics = { sources_ecartees: [] };
  for (const dates of ['<p>Published August 1st, 2026</p><p>Mis à jour le 12 septembre 2026</p>', '<p>Published on 2026/08/10</p><p>Updated on 2026/09/10</p>', '<p>Published on 2026-08-01 at 12:30 UTC</p><p>Updated on 2026-09-01 at 15:45:00+02:00</p>']) {
    await assert.rejects(verifiedMaterial(sources, { ...options, fetchImpl: async () => new Response(`<meta name="date" content="2026-08-01"><article>${dates}</article>`) }, diagnostics), /materiau_insuffisant/);
  }
  assert.ok(diagnostics.sources_ecartees.every(s => s.motif === 'sans_chiffre'));
});
test('délai de 15 secondes transmis à la résolution et à la lecture du corps', async () => {
  const delays = [], controllers = [];
  const timer = mock.method(AbortSignal, 'timeout', ms => {
    delays.push(ms); const controller = new AbortController(); controllers.push(controller); return controller.signal;
  });
  const abort = () => controllers.at(-1).abort(new DOMException('timeout', 'TimeoutError'));
  try {
    await assert.rejects(fetchSource('https://insee.fr/a', { resolve: async () => { abort(); return new Promise(() => {}); } }), /timeout/i);
    let cancelled = false;
    await assert.rejects(fetchSource('https://insee.fr/a', { ...options, fetchImpl: async () => ({
      status: 200, headers: new Headers(), body: { getReader: () => ({
        read: () => { abort(); return Promise.reject(new DOMException('timeout', 'TimeoutError')); },
        cancel: async () => { cancelled = true; },
      }) },
    }) }), /timeout/i);
    assert.equal(cancelled, true);
    assert.deepEqual(delays, [15000, 15000, 1000]);
  } finally { timer.mock.restore(); }
});
test('limite de taille vérifiée pendant le flux et redirection datée sur URL finale', async () => {
  await assert.rejects(fetchSource('https://insee.fr/a', { ...options, fetchImpl: async () => new Response('x'.repeat(5_000_001)) }), /volumineuse/);
  let calls = 0;
  const result = await fetchSource('https://insee.fr/old', { ...options, details: true, fetchImpl: async () => ++calls === 1 ? new Response('', { status: 302, headers: { location: '/2026/08/01/report' } }) : new Response('12 % des dossiers.') });
  assert.deepEqual(result.publication, { published_at: '2026-08-01', methode: 'url' });
});
