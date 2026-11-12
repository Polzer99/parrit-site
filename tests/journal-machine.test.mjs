import { sourceResponse } from './fixtures/journal-machine/source-response.mjs';
import assert from 'node:assert/strict';
import { test, mock } from 'node:test';
import { mkdtempSync, mkdirSync, readFileSync, existsSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import { EventEmitter } from 'node:events';
import { runMachine, main, DEFAULT_MODELS, atomicJSON, openRouterClient } from '../scripts/journal-machine.mjs';
import { addTopic, validateTopics } from '../scripts/journal-sujets.mjs';
import { createGitHubRuntime } from '../scripts/journal-machine-github.mjs';
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
    const role = request.model === DEFAULT_MODELS.research ? (request.plugins ? 'research' : 'queries') : request.model === DEFAULT_MODELS.judge ? 'judge' : request.temperature === 0.2 ? 'editing' : 'writing';
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
  return { options: { root, client, runtime, sourceOptions: { fetchImpl: async url => sourceResponse(url, sourceText), resolve: async () => [{ address: '1.1.1.1' }] }, now: () => new Date('2026-11-12T05:15:00Z') }, calls, events,
    queue: () => JSON.parse(readFileSync(path.join(root, 'content/plan/sujets.json'), 'utf8')),
    logs: () => readFileSync(path.join(root, 'content/plan/journal-runs.jsonl'), 'utf8').trim().split('\n').map(JSON.parse),
  };
}
test('choix premier sujet, deux éditions, annotations, manifeste et log exact', async t => {
  const s = setup(t); const result = await runMachine(s.options);
  assert.equal(result.issue, 'pr'); assert.ok(Math.abs(result.cout - 0.061) < 1e-10); assert.equal(s.calls.length, 7);
  assert.equal(s.calls.filter(c => c.plugins).length, 3);
  assert.ok(s.calls.filter(c => c.plugins).every(c => c.plugins[0].engine === 'exa' && c.plugins[0].max_results === 10));
  assert.match(s.calls[4].messages[1].content, /Mesure des délais/);
  for (const prefix of ['', 'fr/']) assert.ok(existsSync(path.join(s.options.root, `content/journal/${prefix}${first.id}.mdx`)));
  assert.deepEqual(JSON.parse(readFileSync(path.join(s.options.root, 'content/plan/journal-translations.json'))), [first.id]);
  assert.equal(s.queue()[0].statut, 'a_faire'); assert.equal(s.queue()[0].slug, first.id);
  assert.equal(s.logs().length, 1); assert.equal(s.logs()[0].issue, 'pr');
  assert.equal(s.logs()[0].tentatives[0].recherches.length, 3);
  assert.equal(s.logs()[0].tentatives[0].sources_acceptees.length, 3);
  assert.ok(!JSON.stringify(s.logs()).includes(fixtures.research.choices[0].message.annotations[0].url_citation.content));
  assert.deepEqual(s.events.slice(-2), ['persist', 'alert']);
});
for (const invalidJSON of [false, true]) test(`préparation tolérante persistée dans journal-runs.jsonl, JSON invalide=${invalidJSON}`, async t => {
  const raw = invalidJSON ? 'JSON cassé '.repeat(100) : JSON.stringify({ REQUETES: {
    Institutions: ['PME adoption'], PRESSE_EDITEURS: [], Contradiction: ['IA limites'], extra: true,
  } });
  const s = setup(t, { mutate: (response, role) => {
    if (role === 'queries') response.choices[0].message.content = raw;
  } });
  const result = await runMachine(s.options);
  assert.equal(result.issue, 'pr');
  assert.equal(result.tentatives.length, 1);
  assert.equal(s.queue()[0].essais || 0, 0);
  const preparationCalls = s.calls.filter(call => call.model === DEFAULT_MODELS.research && !call.plugins);
  assert.equal(preparationCalls.length, invalidJSON ? 2 : 1);
  assert.ok(Math.abs(result.cout - (invalidJSON ? 0.062 : 0.061)) < 1e-10);
  const persisted = s.logs()[0].tentatives[0];
  assert.equal(persisted.preparation_brute, raw.slice(0, 800));
  if (invalidJSON) assert.equal(persisted.preparation_relance_brute, raw.slice(0, 800));
  const expected = invalidJSON
    ? ['étude', 'enquête', 'limites échecs'].map(term => [`${first.requete} ${term} 2026`])
    : [['PME adoption'], [`${first.requete} enquête 2026`], ['IA limites']];
  assert.deepEqual(persisted.recherches.map(pass => pass.requetes), expected);
  assert.deepEqual(persisted.recherches.map(pass => pass.requetes_reconstruites), invalidJSON ? [true, true, true] : [false, true, false]);
  assert.deepEqual(s.calls.filter(call => call.plugins).map(call => JSON.parse(call.messages.at(-1).content).requetes), expected);
});

test('la relance JSON est facturée et reste soumise au plafond de coût', async t => {
  const s = setup(t, { mutate: (response, role) => {
    if (role === 'queries') {
      response.choices[0].message.content = '{';
      response.usage.cost = 0.45;
    }
  } });
  const result = await runMachine(s.options);
  assert.equal(result.issue, 'echec');
  assert.match(result.motif, /plafond de coût dépassé/);
  assert.equal(result.cout, 0.9);
  assert.equal(s.calls.length, 2);
  assert.ok(s.calls.every(call => !call.plugins));
  assert.equal(s.logs()[0].tentatives[0].preparation_brute, '{');
  assert.ok(!s.events.some(event => Array.isArray(event) && event[0] === 'publish'));
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
  assert.equal(s.calls.filter(call => call.plugins).length, 6);
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
  assert.equal(result.issue, 'echec'); assert.equal(s.calls.length, 4); assert.ok(Math.abs(result.cout - 0.031) < 1e-10);
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
  assert.equal(s.calls.length, 8); assert.ok(s.queue().every(t => t.motif === 'materiau_insuffisant'));
});
test('C1 titre de presse dans la file écarté avant toute recherche', async t => {
  const s = setup(t, { topics: [{ ...first, titre: 'La spécification est devenue le livrable' }] });
  await runMachine(s.options); assert.equal(s.calls.length, 0); assert.equal(s.queue()[0].motif, 'couvert_par_chronique_presse');
});
test('C1 recherche contradictoire et thèse pressentie transmises', async t => {
  const s = setup(t, { topics: [{ ...first, these_pressentie: 'La règle semble suffisante' }] });
  await runMachine(s.options);
  assert.match(s.calls[3].messages[0].content, /CONTREDIT/);
  assert.equal(JSON.parse(s.calls[0].messages[1].content).these_pressentie, 'La règle semble suffisante');
});

test('C1 plafond par défaut 0,80 accepte 0,541 et compte toutes les passes', async t => {
  const s = setup(t, { mutate: (r, role) => { if (role === 'research') r.usage.cost = 0.17; } });
  const result = await runMachine(s.options);
  assert.equal(result.issue, 'pr'); assert.ok(Math.abs(result.cout - 0.541) < 1e-10); assert.equal(s.calls.length, 7);
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

test('sans article, deux runs GitHub simulés conservent les essais et ne créent aucune PR', async t => {
  let state = null, tree, sequence = 0;
  const commits = new Map();
  const calls = [];
  const fetchImpl = async (input, options = {}) => {
    const url = new URL(input), route = url.pathname.replace('/repos/test/repo', '');
    const body = options.body ? JSON.parse(options.body) : undefined;
    calls.push({ route, method: options.method, body });
    const reply = (data, status = 200) => new Response(JSON.stringify(data), { status });
    if (route === '/git/ref/heads/main') return reply({ object: { sha: 'base' } });
    if (route === '/git/ref/heads/journal/etat-machine') return reply({}, 404);
    if (route === '/git/ref/heads/journal/etat') return state ? reply({ object: { sha: state } }) : reply({}, 404);
    if (route === '/commits') return reply([{ commit: { committer: { date: url.searchParams.get('sha') === 'base' ? '2026-11-01T00:00:00Z' : '2026-11-12T00:00:00Z' } } }]);
    if (route.startsWith('/contents/')) {
      assert.equal(url.searchParams.get('ref'), state);
      return reply({ type: 'file', encoding: 'base64', content: Buffer.from(commits.get(state).find(f => f.path === route.slice('/contents/'.length)).content).toString('base64') });
    }
    if (route.startsWith('/git/commits/')) return reply({ tree: { sha: 'tree' } });
    if (route === '/git/trees') { tree = body.tree; return reply({ sha: 'tree' }); }
    if (route === '/git/commits') { const sha = `state-${++sequence}`; commits.set(sha, tree); return reply({ sha }); }
    if (route === '/git/refs') { assert.equal(body.ref, 'refs/heads/journal/etat'); state = body.sha; return reply({}); }
    if (route === '/git/refs/heads/journal/etat') { assert.equal(body.force, false); state = body.sha; return reply({}); }
    if (route === '/pulls' && options.method === 'GET') return reply([]);
    if (route === '/issues' && options.method === 'GET') return reply([{ title: 'Journal en panne' }]);
    throw new Error(`Unexpected simulated API: ${options.method} ${input}`);
  };
  for (let index = 0; index < 2; index++) {
    const s = setup(t, { topics: [{ ...first, essais: 1 }], mutate: (r, role) => { if (role === 'research') r.choices[0].message.annotations = []; } });
    s.options.runtime = createGitHubRuntime({ root: s.options.root, env: { GITHUB_REPOSITORY: 'test/repo', GITHUB_TOKEN: 'fixture', JOURNAL_AUTOPUBLISH: index ? '1' : '' }, fetchImpl, runCommand: deny });
    const result = await runMachine(s.options);
    assert.equal(result.issue, 'echec'); assert.equal(result.motif, 'materiau_insuffisant');
    assert.equal(s.queue()[0].essais, index + 2);
    assert.equal(s.logs().length, index + 1);
    if (index) assert.equal(s.queue()[0].statut, 'ecarte');
  }
  assert.equal(sequence, 2);
  assert.ok(!calls.some(call => call.route === '/pulls' && call.method === 'POST'));
  assert.ok(!calls.some(call => call.route === '/git/refs/heads/main'));
  for (const files of commits.values()) assert.deepEqual(files.map(f => f.path), ['content/plan/sujets.json', 'content/plan/journal-runs.jsonl']);
});

test('transport classifie le refus include_domains sans exposer le corps API', async () => {
  for (const status of [400, 422, 401, 429, 500]) {
    const client = openRouterClient({ apiKey: 'fixture', fetchImpl: async () => new Response(JSON.stringify({ error: { message: 'include_domains unsupported; private prompt text' } }), { status }) });
    await assert.rejects(client.complete({}), error => {
      assert.equal(error.status, status);
      assert.equal(error.includeDomainsRejected, [400, 422].includes(status));
      assert.ok(!error.message.includes('private prompt'));
      return true;
    });
  }
});

test('configuration invalide ou reprise échouée ne sauvegarde jamais un état non restauré', async t => {
  for (const failure of ['budget', 'restore']) {
    const s = setup(t);
    if (failure === 'budget') s.options.budget = NaN;
    else s.options.runtime.restoreState = async () => { throw new Error('État distant invalide'); };
    const result = await runMachine(s.options);
    assert.equal(result.issue, 'echec');
    assert.ok(!s.events.includes('persist'));
    assert.equal(s.calls.length, 0);
    assert.equal(s.logs().length, 1);
  }
});

test('interruption recherche ne persiste aucun secret dans run ni file', async t => {
  const s = setup(t, { topics: [first] });
  const original = s.options.client.complete;
  let research = 0;
  s.options.client.complete = async request => {
    if (request.plugins && ++research === 2) throw new Error('Timeout token=fixture-sensitive-token');
    return original(request);
  };
  await runMachine(s.options);
  assert.ok(!JSON.stringify(s.logs()).includes('fixture-sensitive-token'));
  assert.ok(!JSON.stringify(s.queue()).includes('fixture-sensitive-token'));
  assert.equal(s.logs()[0].tentatives[0].recherche_interrompue.passe, 'presse_editeurs');
});

test('deux délais OpenRouter reportent le premier sujet et tentent le suivant', async t => {
  const s = setup(t, { topics: [first, { ...first, id: 'autre-outil', requete: 'Autre angle' }] });
  const original = s.options.client.complete;
  let failed = 0; const waits = [];
  s.options.sleep = async ms => waits.push(ms);
  s.options.client.complete = async request => {
    if (request.model === DEFAULT_MODELS.research && JSON.parse(request.messages.at(-1).content).requete === first.requete) {
      failed++; throw new DOMException('timeout', 'TimeoutError');
    }
    return original(request);
  };
  const result = await runMachine(s.options);
  assert.equal(failed, 2); assert.deepEqual(waits, [5000]);
  assert.equal(result.issue, 'pr');
  assert.equal(result.tentatives.length, 2);
  assert.equal(result.tentatives[0].motif, 'openrouter_recherche_delai');
  assert.equal(s.queue()[0].essais, 1);
  assert.ok(s.calls.some(call => call.plugins && JSON.parse(call.messages.at(-1).content).requete === 'Autre angle'));
  assert.equal(s.logs()[0].tentatives[0].motif, 'openrouter_recherche_delai');
});

test('exception inattendue dans le vrai runMachine : main enregistre crash et sauvegarde', async t => {
  const s = setup(t);
  s.options.runtime.pendingTopics = async () => { throw new Error('panne inattendue token=private-value'); };
  const processImpl = new EventEmitter();
  const result = await main({ options: s.options, processImpl, output: () => {} });
  assert.equal(result.issue, 'crash'); assert.equal(result.etape, 'selection');
  assert.equal(s.logs().length, 1); assert.equal(s.logs()[0].issue, 'crash');
  assert.ok(s.events.includes('persist')); assert.equal(processImpl.exitCode, 1);
  assert.ok(!JSON.stringify(s.logs()).includes('private-value'));
});

test('rejet non traité pendant rédaction : vrai run arrêté avant validation et publication', async t => {
  const s = setup(t);
  const processImpl = new EventEmitter(), exits = [];
  processImpl.exit = code => exits.push(code);
  const complete = s.options.client.complete;
  s.options.client.complete = async request => {
    if (request.model === DEFAULT_MODELS.writing) {
      processImpl.emit('unhandledRejection', new Error('crash rédaction'));
    }
    return complete(request);
  };
  const result = await main({ options: s.options, processImpl, output: () => {} });
  assert.equal(result.issue, 'crash'); assert.equal(result.etape, 'redaction'); assert.equal(result.sujet, first.id);
  assert.equal(s.logs().length, 1); assert.equal(s.events.filter(event => event === 'persist').length, 1);
  assert.ok(!s.events.includes('validate'));
  assert.ok(!s.events.some(event => Array.isArray(event) && event[0] === 'publish'));
  assert.deepEqual(exits, [1]);
});

test('crash dans persistState : diagnostic conservé et une seule sauvegarde de secours', async t => {
  const s = setup(t, { topics: [] }); let saves = 0;
  s.options.runtime.persistState = async () => { if (++saves === 1) throw new Error('panne sauvegarde'); };
  const processImpl = new EventEmitter();
  const result = await main({ options: s.options, processImpl, output: () => {} });
  assert.equal(result.issue, 'crash'); assert.equal(result.etape, 'persistance');
  assert.equal(s.logs().filter(run => run.issue === 'crash').length, 1); assert.equal(saves, 2);
  assert.equal(processImpl.exitCode, 1);
});
