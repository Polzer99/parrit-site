import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import { researchInPasses, researchSources, verifiedMaterial, canonicalSourceUrl } from '../scripts/journal-machine-research.mjs';
const deny = () => { throw new Error('Network forbidden'); };
mock.method(globalThis, 'fetch', deny);
for (const transport of [http, https]) for (const method of ['get', 'request']) mock.method(transport, method, deny);
mock.method(net.Socket.prototype, 'connect', deny);
const fixtures = JSON.parse(readFileSync(new URL('./fixtures/journal-machine/openrouter.json', import.meta.url), 'utf8'));
const message = fixtures.research.choices[0].message;
const primary = JSON.parse(readFileSync(new URL('../content/plan/sources-primaires.json', import.meta.url), 'utf8'));
const refused = JSON.parse(readFileSync(new URL('../content/plan/sources-refusees.json', import.meta.url), 'utf8'));
const queries = Object.fromEntries(['institutions', 'presse_editeurs', 'contradiction'].map(id => [id, [`PME industrie 2026 étude ${id}`, `PME industrie 2026 enquête baromètre rapport ${id}`]]));
const topic = { requete: 'Où commencer pour une PME industrielle ?', angle_local: false, these_pressentie: 'Une thèse provisoire' };
const date = '2026-11-12';

test('trois passes web après reformulation, filtres JSON et requêtes réellement transmises', async () => {
  const calls = [], diagnostics = {};
  const sources = await researchInPasses({ topic, today: date, diagnostics, ask: async (role, messages, extra) => {
    calls.push({ role, messages, ...extra });
    return extra.plugins ? structuredClone(message) : { content: JSON.stringify(queries) };
  } });
  assert.equal(calls.length, 4);
  assert.ok(!calls[0].plugins);
  const web = calls.slice(1);
  for (const [index, id] of Object.keys(queries).entries()) {
    const plugin = web[index].plugins[0];
    assert.equal(plugin.engine, 'exa'); assert.equal(plugin.max_results, 10);
    assert.deepEqual(plugin.include_domains, primary[id]);
    assert.deepEqual(plugin.exclude_domains, id === 'contradiction' ? refused : undefined);
    assert.deepEqual(JSON.parse(web[index].messages[1].content).requetes, queries[id]);
    assert.deepEqual(diagnostics.recherches[index].requetes, queries[id]);
    assert.equal(diagnostics.recherches[index].resultats, message.annotations.length);
  }
  assert.match(web[2].messages[0].content, /CONTREDIT/);
  assert.equal(sources.length, 3);
  assert.equal(diagnostics.sources_ecartees.filter(s => s.motif === 'doublon').length, 6);
  assert.ok(!JSON.stringify(diagnostics).includes(message.annotations[0].url_citation.content));
});

test('repli une seule fois sans engine uniquement pour refus API include_domains', async () => {
  const calls = [], diagnostics = {};
  await researchInPasses({ topic, today: date, diagnostics, ask: async (role, messages, extra) => {
    if (!extra.plugins) return { content: JSON.stringify(queries) };
    const plugin = extra.plugins[0]; calls.push(plugin);
    if (plugin.include_domains && plugin.engine) throw Object.assign(new Error('OpenRouter HTTP 400'), { status: 400, includeDomainsRejected: true });
    return structuredClone(message);
  } });
  assert.equal(calls.length, 5);
  assert.equal(calls[1].engine, undefined);
  assert.deepEqual(calls[1].include_domains, primary.institutions);
  assert.equal(diagnostics.recherches.filter(p => p.repli_sans_engine).length, 2);
  for (const error of [new Error('timeout'), Object.assign(new Error('HTTP 401'), { status: 401 })]) {
    let count = 0;
    await assert.rejects(researchInPasses({ topic, today: date, diagnostics: {}, ask: async (role, messages, extra) => {
      if (!extra.plugins) return { content: JSON.stringify(queries) };
      count++; throw error;
    } }));
    assert.equal(count, 1);
  }
});

test('URL canonique conserve paramètres utiles et dédoublonne UTM, fragment et ordre', () => {
  assert.equal(canonicalSourceUrl('https://insee.fr/a?z=2&utm_source=x&a=1#note'), 'https://insee.fr/a?a=1&z=2');
  const copy = structuredClone(message);
  copy.annotations.push({ type: 'url_citation', url_citation: { ...copy.annotations[0].url_citation, url: `${copy.annotations[0].url_citation.url}?utm_campaign=x#note` } });
  const diagnostics = { sources_ecartees: [] };
  assert.equal(researchSources(copy, topic, date, diagnostics).length, 3);
  assert.equal(diagnostics.sources_ecartees[0].motif, 'doublon');
});

test('une source par passe forme ensemble le matériau ; le plafond de huit ne tronque pas la recherche', async () => {
  let index = 0;
  const sources = await researchInPasses({ topic, today: date, diagnostics: {}, ask: async (role, messages, extra) => {
    if (!extra.plugins) return { content: JSON.stringify(queries) };
    const i = index++;
    return { content: JSON.stringify({ sources: [JSON.parse(message.content).sources[i]] }), annotations: [message.annotations[i]] };
  } });
  assert.equal(sources.length, 3);
  const many = structuredClone(message), meta = JSON.parse(message.content);
  for (let i = 0; i < 8; i++) {
    const url = `https://insee.fr/source-${i}`;
    many.annotations.push({ type: 'url_citation', url_citation: { ...message.annotations[0].url_citation, url } });
    meta.sources.push({ ...meta.sources[0], url });
  }
  many.content = JSON.stringify(meta);
  assert.equal(researchSources(many, topic, date).length, 11);
});

test('aucune boucle après échec du repli et diagnostic conservé', async () => {
  let calls = 0;
  const diagnostics = {};
  await assert.rejects(researchInPasses({ topic, today: date, diagnostics, ask: async (role, messages, extra) => {
    if (!extra.plugins) return { content: JSON.stringify(queries) };
    calls++;
    throw Object.assign(new Error('OpenRouter HTTP 400'), { status: 400, includeDomainsRejected: true });
  } }));
  assert.equal(calls, 2);
  assert.equal(diagnostics.recherches[0].repli_sans_engine, true);
  assert.equal(diagnostics.recherches[0].erreur, 'http_400');
});

test('échec de la deuxième passe conserve les URL non vérifiées de la première', async () => {
  let calls = 0;
  const diagnostics = {};
  await assert.rejects(researchInPasses({ topic, today: date, diagnostics, ask: async (role, messages, extra) => {
    if (!extra.plugins) return { content: JSON.stringify(queries) };
    if (++calls === 2) throw new Error('Timeout');
    return message;
  } }));
  assert.equal(diagnostics.sources_ecartees.length, 3);
  assert.ok(diagnostics.sources_ecartees.every(s => s.motif === 'recherche_interrompue'));
  assert.ok(!JSON.stringify(diagnostics).includes(message.annotations[0].url_citation.content));
});

test('chaque rejet est diagnostiqué et les faits ne sont acceptés que dans la page', async () => {
  const baseMeta = JSON.parse(message.content).sources[0];
  const cases = [
    ['https://forbes.com/reprise', {}, 'domaine_refuse'],
    ['https://insee.fr/vieux', { published_at: '2020-01-01' }, 'trop_ancienne'],
    ['https://insee.fr/non-date', { published_at: null }, 'sans_date'],
    ['https://insee.fr/manquant', {}, 'http_404'],
    ['https://insee.fr/sans-fait', {}, 'sans_chiffre'],
    ['https://insee.fr/date-inventee', {}, 'sans_date'],
  ];
  const extra = cases.map(([url, override]) => ({ ...baseMeta, url, ...override }));
  const mixed = { content: JSON.stringify({ sources: [...JSON.parse(message.content).sources, ...extra] }), annotations: [...message.annotations, ...extra.map(source => ({ type: 'url_citation', url_citation: { url: source.url, title: 'Étude', content: 'Texte privé du journal' } }))] };
  const diagnostics = { sources_ecartees: [], sources_acceptees: [] };
  const sources = researchSources(mixed, topic, date, diagnostics);
  const sourceText = readFileSync(new URL('./fixtures/journal-machine/source.txt', import.meta.url), 'utf8');
  const accepted = await verifiedMaterial(sources, { resolve: async () => [{ address: '1.1.1.1' }], fetchImpl: async url => {
    if (url.endsWith('/manquant')) return new Response('', { status: 404 });
    if (url.endsWith('/sans-fait')) return new Response(baseMeta.published_at + ' aucun fait');
    if (url.endsWith('/date-inventee')) return new Response('aucune date');
    return new Response(sourceText);
  } }, diagnostics);
  assert.equal(accepted.length, 3);
  for (const [url, , motif] of cases) assert.ok(diagnostics.sources_ecartees.some(s => s.url === url && s.motif === motif), `${url}: ${motif}`);
  assert.ok(diagnostics.sources_acceptees.every(s => s.faits_chiffres > 0));
  assert.ok(diagnostics.sources_acceptees.reduce((n, s) => n + s.faits_chiffres, 0) >= 4);
  assert.ok(!JSON.stringify(diagnostics).includes('Texte privé'));
  assert.ok(diagnostics.sources_acceptees.every(s => Object.keys(s).sort().join() === 'faits_chiffres,titre,url'));
});
