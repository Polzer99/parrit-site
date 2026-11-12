import assert from 'node:assert/strict';
import { test, mock } from 'node:test';
import { mkdtempSync, mkdirSync, readFileSync, existsSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import { runMachine, DEFAULT_MODELS, atomicJSON, openRouterClient } from '../scripts/journal-machine.mjs';
import { addTopic, validateTopics } from '../scripts/journal-sujets.mjs';
const deny = () => { throw new Error('Network forbidden'); };
mock.method(globalThis, 'fetch', deny);
for (const transport of [http, https]) for (const method of ['get', 'request']) mock.method(transport, method, deny);
mock.method(net.Socket.prototype, 'connect', deny);
const fixtures = JSON.parse(readFileSync(new URL('./fixtures/journal-machine/openrouter.json', import.meta.url), 'utf8'));
const sourceText = readFileSync(new URL('./fixtures/journal-machine/source.txt', import.meta.url), 'utf8');
const first = { id: 'premier-outil-ia', requete: 'Comment choisir votre premier outil IA ?', intention: 'informationnelle', pilier: 'audit-pme', offre: 'audit', angle_local: false, statut: 'a_faire', slug: null, publie_le: null };
function setup(t, { topics = [first], mutate = () => {}, outcome = 'pr', pending = [], validate = async () => {} } = {}) {
  const root = mkdtempSync(path.join(tmpdir(), 'journal-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  atomicJSON(path.join(root, 'content/plan/sujets.json'), topics);
  atomicJSON(path.join(root, 'content/plan/journal-translations.json'), []);
  const calls = [], events = [];
  let writing = 0, current = first;
  const client = { models: async () => Object.values(DEFAULT_MODELS), complete: async request => {
    calls.push(request);
    const role = request.model === DEFAULT_MODELS.research ? 'research' : request.model === DEFAULT_MODELS.judge ? 'judge' : request.temperature === 0.2 ? 'editing' : 'writing';
    if (role === 'research') current = topics.find(topic => topic.requete === JSON.parse(request.messages.at(-1).content).requete);
    const response = structuredClone(fixtures[role]);
    if (role === 'writing') writing++;
    response.choices[0].message.content = response.choices[0].message.content.replaceAll(first.id, current.id).replaceAll(first.requete, current.requete);
    mutate(response, role, writing, calls);
    return response;
  } };
  const runtime = { restoreState: async () => events.push('restore'), pendingTopics: async () => pending,
    validateCandidate: async options => { events.push('validate'); return validate(options); },
    publish: async payload => { events.push(['publish', payload]); if (outcome instanceof Error) throw outcome; return outcome; },
    persistState: async () => events.push('persist'), alertIfStalled: async () => events.push('alert'), issueOnce: async title => events.push(['issue', title]),
  };
  return { options: { root, client, runtime, sourceOptions: { fetchImpl: async () => new Response(sourceText), resolve: async () => [{ address: '1.1.1.1' }] }, now: () => new Date('2026-11-12T05:15:00Z') }, calls, events,
    queue: () => JSON.parse(readFileSync(path.join(root, 'content/plan/sujets.json'), 'utf8')),
    logs: () => readFileSync(path.join(root, 'content/plan/journal-runs.jsonl'), 'utf8').trim().split('\n').map(JSON.parse),
  };
}
test('choix premier sujet, deux éditions, annotations, manifeste et log exact', async t => {
  const s = setup(t); const result = await runMachine(s.options);
  assert.equal(result.issue, 'pr'); assert.equal(result.cout, 0.04); assert.equal(s.calls.length, 4);
  assert.deepEqual(s.calls[0].plugins, [{ id: 'web', max_results: 8 }]);
  assert.match(s.calls[1].messages[1].content, /Mesure des délais/);
  for (const prefix of ['', 'fr/']) assert.ok(existsSync(path.join(s.options.root, `content/journal/${prefix}${first.id}.mdx`)));
  assert.deepEqual(JSON.parse(readFileSync(path.join(s.options.root, 'content/plan/journal-translations.json'))), [first.id]);
  assert.equal(s.queue()[0].statut, 'a_faire'); assert.equal(s.queue()[0].slug, first.id);
  assert.equal(s.logs().length, 1); assert.equal(s.logs()[0].issue, 'pr');
  assert.deepEqual(s.events.slice(-2), ['persist', 'alert']);
});
test('statut publié seulement après preuve runtime', async t => {
  const s = setup(t, { outcome: 'publie' }); await runMachine(s.options);
  assert.equal(s.queue()[0].statut, 'publie'); assert.equal(s.queue()[0].publie_le, '2026-11-12T05:15:00.000Z');
});
test('deux passes systématiques GLM-5.2, températures et thèse retenue', async t => {
  const s = setup(t, { mutate: (response, role) => { if (role === 'writing') response.choices[0].message.content += '\n—'; } });
  const result = await runMachine(s.options);
  assert.equal(result.issue, 'pr');
  const writing = s.calls.filter(call => call.model === DEFAULT_MODELS.writing);
  assert.equal(DEFAULT_MODELS.writing, 'z-ai/glm-5.2');
  assert.deepEqual(writing.map(c => c.temperature), [0.5, 0.2]);
  assert.match(writing[1].messages.at(-1).content, /Secrétariat de rédaction/);
  assert.match(writing[1].messages.at(-1).content, /—/);
  assert.equal(result.these_retenue, 'Les outils ne réduisent les délais que si les règles sont explicites');
  assert.equal(s.logs()[0].these_retenue, result.these_retenue);
});
test('deux échecs reportent, second sujet au maximum, essais conservés', async t => {
  const topics = [first, { ...first, id: 'autre-outil', requete: 'Comment préparer un autre outil ?' }, { ...first, id: 'troisieme-outil', requete: 'Comment organiser le troisième sujet ?' }];
  const s = setup(t, { topics, mutate: (response, role) => { if (role === 'editing') { const pair = JSON.parse(response.choices[0].message.content); pair.fr += '\n—'; response.choices[0].message.content = JSON.stringify(pair); } } });
  const result = await runMachine(s.options);
  assert.equal(result.issue, 'echec'); assert.equal(result.tentatives.length, 2);
  assert.deepEqual(s.queue().map(topic => topic.essais || 0), [1, 1, 0]);
  assert.ok(s.queue().every(topic => topic.statut === 'a_faire'));
  assert.equal(s.calls.filter(call => call.model === DEFAULT_MODELS.research).length, 2);
  assert.equal(s.calls.filter(call => call.model === DEFAULT_MODELS.writing).length, 4);
  assert.ok(!existsSync(path.join(s.options.root, `content/journal/${first.id}.mdx`)));
});
test('troisième run en échec écarte le sujet avec son motif', async t => {
  const s = setup(t, { topics: [{ ...first, essais: 2 }], mutate: (response, role) => { if (role === 'editing') { const pair = JSON.parse(response.choices[0].message.content); pair.fr += '\n—'; response.choices[0].message.content = JSON.stringify(pair); } } });
  await runMachine(s.options); assert.equal(s.queue()[0].statut, 'ecarte'); assert.equal(s.queue()[0].essais, 3); assert.match(s.queue()[0].motif, /anti-ia/);
});
for (const cost of [0.81, undefined, -1]) test(`coût ${cost} arrête avant écriture ou publication`, async t => {
  const s = setup(t, { mutate: response => { response.usage.cost = cost; } });
  const result = await runMachine(s.options);
  assert.equal(result.issue, 'echec'); assert.equal(s.calls.length, 1); assert.match(result.motif, /coût|usage.cost/);
  assert.ok(!s.events.some(event => Array.isArray(event) && event[0] === 'publish'));
});
test('plafond cumulatif traverse tous les appels et sujets', async t => {
  const s = setup(t); const result = await runMachine({ ...s.options, budget: 0.025 });
  assert.equal(result.issue, 'echec'); assert.equal(s.calls.length, 3); assert.equal(result.cout, 0.03);
});
test('file vide code logique succès sans LLM et issue dédiée', async t => {
  const s = setup(t, { topics: [] }); const result = await runMachine(s.options);
  assert.equal(s.calls.length, 0); assert.equal(result.motif, 'file de sujets vide');
  assert.ok(s.events.some(event => event[1] === 'Journal : file de sujets vide'));
});
test('sujets en PR ne sont pas régénérés', async t => {
  const s = setup(t, { pending: [first.id] }); await runMachine(s.options); assert.equal(s.calls.length, 0);
});
test('sujet duplicatif existant écarté avant LLM', async t => {
  const s = setup(t); mkdirSync(path.join(s.options.root, 'content/journal/fr'), { recursive: true });
  writeFileSync(path.join(s.options.root, 'content/journal/fr/old.mdx'), fixtures.fr.choices[0].message.content);
  await runMachine(s.options); assert.equal(s.queue()[0].statut, 'ecarte'); assert.equal(s.calls.length, 0);
});
test('build rouge reporte sans troisième passe et sans publication', async t => {
  let count = 0;
  const s = setup(t, { validate: async () => { count++; throw new Error('Build: invalid article render'); } });
  const result = await runMachine(s.options);
  assert.equal(result.issue, 'echec'); assert.equal(count, 1); assert.equal(result.tentatives[0].passes.length, 1);
  assert.equal(s.calls.filter(c => c.model === DEFAULT_MODELS.writing).length, 2);
  assert.ok(!s.events.some(e => Array.isArray(e) && e[0] === 'publish'));
});
test('build échoue deux fois, rollback éditions/manifest et passage sujet suivant', async t => {
  const s = setup(t, { topics: [first, { ...first, id: 'autre-outil', requete: 'Comment préparer un autre outil ?' }], validate: async () => { throw new Error('Build failed'); } });
  const result = await runMachine(s.options); assert.equal(result.issue, 'echec'); assert.equal(result.tentatives.length, 2);
  assert.deepEqual(JSON.parse(readFileSync(path.join(s.options.root, 'content/plan/journal-translations.json'))), []);
  assert.ok(!s.events.some(event => Array.isArray(event) && event[0] === 'publish'));
});
test('publication incertaine: ni nouveau sujet ni statut publié', async t => {
  const s = setup(t, { outcome: new Error('Preuve de mise en ligne absente') });
  const result = await runMachine(s.options); assert.equal(result.issue, 'echec'); assert.equal(s.queue()[0].statut, 'a_faire'); assert.equal(result.tentatives.length, 1);
});
test('pas de modèle disponible: aucun fallback coûteux silencieux', async t => {
  const s = setup(t); s.options.client.models = async () => [];
  const result = await runMachine(s.options); assert.match(result.motif, /modèle indisponible/); assert.equal(s.calls.length, 0);
});
test('transport OpenRouter injectable garde coûts, timeout et schéma', async () => {
  const calls = [];
  const client = openRouterClient({ apiKey: 'fixture-not-secret', fetchImpl: async (url, options) => {
    calls.push([url, options]); return new Response(JSON.stringify(url.endsWith('/models') ? { data: [{ id: 'model' }] } : fixtures.fr));
  } });
  assert.deepEqual(await client.models(), ['model']); assert.equal((await client.complete({ model: 'model' })).usage.cost, 0.01);
  assert.equal(calls[1][0], 'https://openrouter.ai/api/v1/chat/completions'); assert.equal(calls[1][1].method, 'POST');
  await assert.rejects(openRouterClient({}).models(), /manquante/);
});
test('graine 36 sujets, IDs uniques, CLI enrichissement validé sans doublon', () => {
  const queue = validateTopics(JSON.parse(readFileSync('content/plan/sujets.json', 'utf8')));
  assert.ok(queue.length >= 36); assert.ok(queue.some(topic => topic.angle_local));
  const updated = addTopic(queue, { requete: 'Comment vérifier un dossier ?', pilier: 'audit-pme', offre: 'audit' });
  assert.equal(updated.length, queue.length + 1); assert.throws(() => addTopic(updated, { requete: 'Comment vérifier un dossier ?', pilier: 'audit-pme', offre: 'audit' }), /déjà/);
});

test('C1 sujets 23/33 écartés, thèse facultative, titre presse refusé dès ajout', () => {
  const topics = JSON.parse(readFileSync('content/plan/sujets.json', 'utf8'));
  for (const index of [22, 32]) { assert.equal(topics[index].statut, 'ecarte'); assert.equal(topics[index].motif, 'couvert_par_chronique_presse'); }
  assert.ok(topics.every(t => Object.hasOwn(t, 'these_pressentie')));
  const added = addTopic([], { requete: 'Un autre angle de recherche', titre: 'La spécification est devenue le livrable', pilier: 'audit-pme', offre: 'audit', these_pressentie: null });
  assert.equal(added[0].statut, 'ecarte'); assert.equal(added[0].motif, 'couvert_par_chronique_presse');
  assert.throws(() => validateTopics([{ ...first, these_pressentie: 123 }]), /these_pressentie/);
});
test('C1 pas de matériau : report avant rédaction, sujet suivant tenté', async t => {
  const s = setup(t, { topics: [first, { ...first, id: 'autre-outil', requete: 'Autre angle' }], mutate: (r, role) => { if (role === 'research') r.choices[0].message.annotations = []; } });
  const result = await runMachine(s.options);
  assert.equal(result.issue, 'echec'); assert.equal(result.tentatives.length, 2);
  assert.equal(s.calls.length, 2); assert.ok(s.queue().every(t => t.motif === 'materiau_insuffisant'));
});
test('C1 titre de presse dans la file écarté avant toute recherche', async t => {
  const s = setup(t, { topics: [{ ...first, titre: 'La spécification est devenue le livrable' }] });
  await runMachine(s.options); assert.equal(s.calls.length, 0); assert.equal(s.queue()[0].motif, 'couvert_par_chronique_presse');
});
test('C1 recherche contradictoire et thèse pressentie transmises', async t => {
  const s = setup(t, { topics: [{ ...first, these_pressentie: 'La règle semble suffisante' }] });
  await runMachine(s.options);
  assert.match(s.calls[0].messages[0].content, /CONTREDIT/);
  assert.equal(JSON.parse(s.calls[0].messages[1].content).these_pressentie, 'La règle semble suffisante');
});

test('C1 plafond par défaut 0,80 accepte 0,54 et compte toutes les passes', async t => {
  const s = setup(t, { mutate: (r, role) => { if (role === 'research') r.usage.cost = 0.51; } });
  const result = await runMachine(s.options);
  assert.equal(result.issue, 'pr'); assert.equal(result.cout, 0.54); assert.equal(s.calls.length, 4);
});
test('C1 thèse finale couverte par la presse écarte immédiatement le sujet', async t => {
  const s = setup(t, { mutate: (r, role) => {
    if (role !== 'editing') return;
    const pair = JSON.parse(r.choices[0].message.content);
    pair.fr = pair.fr.replace('Les outils ne réduisent les délais que si les règles sont explicites', "L'IA est partout dans les entreprises, les agents presque nulle part");
    r.choices[0].message.content = JSON.stringify(pair);
  } });
  const result = await runMachine(s.options);
  assert.equal(result.issue, 'echec'); assert.equal(s.queue()[0].statut, 'ecarte');
  assert.equal(s.queue()[0].motif, 'couvert_par_chronique_presse');
  assert.equal(s.calls.filter(c => c.model === DEFAULT_MODELS.writing).length, 2);
});
