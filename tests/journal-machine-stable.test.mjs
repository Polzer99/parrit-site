import assert from 'node:assert/strict';
import { test, mock } from 'node:test';
import { EventEmitter } from 'node:events';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import { runMachine, main, DEFAULT_MODELS, atomicJSON } from '../scripts/journal-machine.mjs';
import { circuitHistory, runRecord, runSummary, diagnosticReason, parseResponseObject } from '../scripts/journal-machine-trace.mjs';
import { createGitHubRuntime } from '../scripts/journal-machine-github.mjs';
import { sourceResponse } from './fixtures/journal-machine/source-response.mjs';

const deny = () => { throw new Error('Network forbidden'); };
mock.method(globalThis, 'fetch', deny);
for (const transport of [http, https]) for (const method of ['get', 'request']) mock.method(transport, method, deny);
mock.method(net.Socket.prototype, 'connect', deny);
const fixtures = JSON.parse(readFileSync(new URL('./fixtures/journal-machine/openrouter.json', import.meta.url), 'utf8'));
const sourceText = readFileSync(new URL('./fixtures/journal-machine/source.txt', import.meta.url), 'utf8');
const first = { id: 'premier-outil-ia', requete: 'Comment choisir votre premier outil IA ?', intention: 'informationnelle', pilier: 'audit-pme', offre: 'audit', angle_local: false, statut: 'a_faire', slug: null, publie_le: null };
const second = { ...first, id: 'autre-outil', requete: 'Comment préparer un autre outil ?' };
const roleOf = request => request.plugins ? 'research' : request.response_format?.type === 'json_schema' ? 'judge' : request.max_tokens === 1200 ? 'queries' : request.temperature === 0.2 ? 'editing' : 'writing';
function setup(t, { topics = [first], mutate = () => {}, models = DEFAULT_MODELS, history = [] } = {}) {
  const root = mkdtempSync(path.join(tmpdir(), 'journal-stable-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  atomicJSON(path.join(root, 'content/plan/sujets.json'), topics);
  atomicJSON(path.join(root, 'content/plan/journal-translations.json'), []);
  const log = path.join(root, 'content/plan/journal-runs.jsonl');
  writeFileSync(log, history.map(run => JSON.stringify(run) + '\n').join(''));
  const summary = path.join(root, 'summary.md'), calls = [], events = [], counts = {};
  let current = topics[0];
  const client = {
    models: async () => Object.values(models),
    complete: async request => {
      calls.push(request);
      const role = roleOf(request);
      counts[role] = (counts[role] || 0) + 1;
      if (role === 'queries') current = topics.find(topic => topic.requete === JSON.parse(request.messages.at(-1).content).requete);
      const response = structuredClone(fixtures[role]);
      response.choices[0].finish_reason = 'stop';
      response.usage = { ...response.usage, prompt_tokens: 200, completion_tokens: 100, completion_tokens_details: { reasoning_tokens: 20 } };
      response.choices[0].message.content = response.choices[0].message.content.replaceAll(first.id, current.id).replaceAll(first.requete, current.requete);
      await mutate({ response, role, count: counts[role], request, current, calls });
      return response;
    },
  };
  const runtime = { restoreState: async () => events.push('restore'), pendingTopics: async () => [],
    validateCandidate: async () => events.push('validate'), publish: async () => { events.push('publish'); return 'pr'; },
    persistState: async () => events.push('persist'), alertIfStalled: async () => events.push('alert'),
    issueOnce: async (title, body) => events.push({ title, body }),
  };
  const options = { root, client, runtime, models, env: { GITHUB_STEP_SUMMARY: summary },
    sleep: async ms => events.push({ sleep: ms }), now: () => new Date('2026-11-13T05:15:00Z'),
    sourceOptions: { fetchImpl: async url => sourceResponse(url, sourceText), resolve: async () => [{ address: '1.1.1.1' }] } };
  return { options, calls, events, log, summary,
    logs: () => readFileSync(log, 'utf8').trim().split('\n').map(JSON.parse),
    article: topic => existsSync(path.join(root, `content/journal/${topic.id}.mdx`)),
  };
}
const unusable = (response, value = null, finish = 'stop') => {
  response.choices[0].message.content = value;
  response.choices[0].finish_reason = finish;
};
for (const role of ['writing', 'editing', 'judge']) test(`${role}: length vide, effort low puis succès, trace de chaque échelon`, async t => {
  const s = setup(t, { mutate: ({ response, role: active, count }) => { if (active === role && count === 1) unusable(response, '', 'length'); } });
  const run = await runMachine(s.options);
  assert.equal(run.issue, 'pr'); assert.ok(s.article(first));
  const stage = { writing: 'redaction', editing: 'secretariat', judge: 'juge' }[role];
  const traces = run.appels.filter(call => call.etape === stage);
  assert.deepEqual(traces.map(call => [call.echelon, call.issue]), [[1, 'tronquee'], [2, 'ok']]);
  assert.equal(traces[0].finish_reason, 'length');
  const requests = s.calls.filter(request => roleOf(request) === role);
  assert.deepEqual(requests[0].reasoning, { max_tokens: 4000 });
  assert.deepEqual(requests[1].reasoning, { effort: 'none' });
  assert.equal(requests[0].model, requests[1].model);
  assert.equal(requests[0].max_tokens, requests[1].max_tokens);
});
for (const value of [null, undefined, '', ' \n\t']) test(`contenu ${String(value)} : deux réponses inutilisables puis repli effectif`, async t => {
  const s = setup(t, { mutate: ({ response, role, count }) => { if (role === 'writing' && count < 3) unusable(response, value); } });
  const run = await runMachine(s.options);
  assert.equal(run.issue, 'pr');
  assert.equal(run.modeles_effectifs.redaction, DEFAULT_MODELS.writingFallback);
  const requests = s.calls.filter(request => roleOf(request) === 'writing');
  assert.equal(requests.length, 3); assert.deepEqual(requests[2].reasoning, { max_tokens: 4000 });
  assert.equal(run.tentatives[0].redaction.model, DEFAULT_MODELS.writingFallback);
  assert.deepEqual(run.appels.filter(call => call.etape === 'redaction').map(call => call.echelon), [1, 2, 3]);
});
test('JSON non vide tronqué : jamais transmis au secrétariat ni aux portes', async t => {
  const s = setup(t, { mutate: ({ response, role }) => { if (role === 'writing') response.choices[0].finish_reason = 'length'; } });
  const run = await runMachine(s.options);
  assert.equal(run.motif, 'openrouter_redaction_tronquee'); assert.equal(run.issue, 'echec');
  assert.equal(s.calls.filter(request => roleOf(request) === 'editing').length, 0);
  assert.deepEqual(run.tentatives[0].passes, []); assert.ok(!s.article(first));
});
for (const role of ['writing', 'editing', 'judge']) test(`${role}: JSON illisible repris, sans envoyer de réponse cassée à la suite`, async t => {
  const s = setup(t, { mutate: ({ response, role: active, count }) => { if (active === role && count < 3) unusable(response, 'PRIVATE_INVALID_JSON'); } });
  const run = await runMachine(s.options);
  assert.equal(run.issue, 'pr');
  const stage = { writing: 'redaction', editing: 'secretariat', judge: 'juge' }[role];
  assert.deepEqual(run.appels.filter(call => call.etape === stage).map(call => call.issue), ['json_invalide', 'json_invalide', 'ok']);
  assert.ok(!readFileSync(s.log, 'utf8').includes('PRIVATE_INVALID_JSON'));
  assert.ok(!readFileSync(s.summary, 'utf8').includes('PRIVATE_INVALID_JSON'));
});
test('trois échelons vides par sujet : deux sujets, aucun fichier ni manifeste résiduel', async t => {
  const s = setup(t, { topics: [first, second], mutate: ({ response, role }) => { if (role === 'writing') unusable(response); } });
  const run = await runMachine(s.options);
  assert.equal(run.motif, 'openrouter_redaction_vide'); assert.equal(run.tentatives.length, 2);
  assert.equal(run.modeles_effectifs.redaction, DEFAULT_MODELS.writingFallback);
  assert.ok(run.tentatives.every(attempt => attempt.motif === 'openrouter_redaction_vide' && attempt.passes.length === 0));
  assert.equal(s.calls.filter(request => roleOf(request) === 'writing').length, 6);
  assert.ok(!s.article(first) && !s.article(second));
  assert.deepEqual(JSON.parse(readFileSync(path.join(s.options.root, 'content/plan/journal-translations.json'))), []);
  assert.ok(!s.events.includes('publish'));
});
for (const status of [400, 422]) test(`reasoning refusé ${status} : trace puis repli simple`, async t => {
  const s = setup(t, { mutate: ({ response, role, count }) => {
    if (role !== 'writing') return;
    if (count === 1) unusable(response);
    if (count === 2) throw Object.assign(new Error('PRIVATE_PROVIDER_BODY'), { status });
  } });
  const run = await runMachine(s.options);
  assert.equal(run.issue, 'pr');
  assert.deepEqual(run.appels.filter(call => call.etape === 'redaction').map(call => call.issue), ['vide', 'parametre_refuse', 'ok']);
  assert.equal(run.appels.find(call => call.issue === 'parametre_refuse').cout, null);
});
for (const failure of ['delai', 429, 503]) test(`reprise réseau ${failure} interne à chaque échelon, deux traces puis succès`, async t => {
  const s = setup(t, { mutate: ({ response, role, count }) => {
    if (role !== 'writing') return;
    if ([1, 3, 5].includes(count)) throw failure === 'delai' ? new DOMException('private timeout', 'TimeoutError') : Object.assign(new Error('private HTTP'), { status: failure });
    if (count < 6) unusable(response);
  } });
  const run = await runMachine(s.options);
  assert.equal(run.issue, 'pr');
  const traces = run.appels.filter(call => call.etape === 'redaction');
  assert.deepEqual(traces.map(call => [call.echelon, call.tentative]), [[1, 1], [1, 2], [2, 1], [2, 2], [3, 1], [3, 2]]);
  assert.deepEqual(traces.filter(call => call.tentative === 1).map(call => call.issue), Array(3).fill(failure === 'delai' ? failure : `http_${failure}`));
  assert.ok(traces.filter(call => call.tentative === 1).every(call => call.cout === null));
  assert.equal(s.events.filter(event => event.sleep === 5000).length, 3);
});
for (const allSame of [false, true]) test(`juge identique au rédacteur de repli : autre juge ou refus (${allSame})`, async t => {
  const models = { ...DEFAULT_MODELS, judge: DEFAULT_MODELS.writingFallback, judgeFallback: allSame ? DEFAULT_MODELS.writingFallback : 'fixture/independent-judge' };
  const s = setup(t, { models, mutate: ({ response, role, count }) => { if (role === 'writing' && count < 3) unusable(response); } });
  const run = await runMachine(s.options);
  assert.equal(run.issue, allSame ? 'echec' : 'pr');
  const judges = s.calls.filter(request => roleOf(request) === 'judge');
  if (allSame) { assert.equal(run.motif, 'juge_identique_au_redacteur'); assert.equal(judges.length, 0); assert.ok(!s.article(first)); }
  else { assert.equal(run.modeles_effectifs.juge, models.judgeFallback); assert.ok(judges.every(request => request.model !== run.modeles_effectifs.redaction)); }
});
test('le juge exclut aussi le modèle ayant fait le secrétariat et conserve le motif du juge distinct en échec', async t => {
  const models = { ...DEFAULT_MODELS, judge: DEFAULT_MODELS.writingFallback, judgeFallback: 'fixture/independent-judge' };
  const s = setup(t, { models, mutate: ({ response, role, count }) => {
    if ((role === 'editing' && count < 3) || role === 'judge') unusable(response);
  } });
  const run = await runMachine(s.options);
  assert.equal(run.motif, 'openrouter_juge_vide');
  assert.equal(run.modeles_effectifs.secretariat, models.writingFallback);
  assert.ok(s.calls.filter(request => roleOf(request) === 'judge').every(request => request.model === models.judgeFallback));
  assert.ok(!s.article(first));
});
test('aucun juge différent au catalogue : zéro appel de juge, refus explicite', async t => {
  const models = { ...DEFAULT_MODELS, judge: DEFAULT_MODELS.writing, judgeFallback: 'fixture/unavailable' };
  const s = setup(t, { models });
  s.options.client.models = async () => Object.values(DEFAULT_MODELS);
  const run = await runMachine(s.options);
  assert.equal(run.motif, 'juge_identique_au_redacteur'); assert.ok(!s.article(first));
});
const failures = Array.from({ length: 3 }, (_, i) => ({ date: `2026-11-${10 + i}T05:15:00Z`, issue: 'echec', motif: `openrouter_redaction_${['vide', 'tronquee', 'json_invalide'][i]}`, cout: 0.2, appels: [{ etape: 'redaction', modele: 'z-ai/glm-5.2', echelon: 1, issue: 'vide', finish_reason: 'stop', cout: 0.2 }] }));
test('cron arrêté après restauration, code 0, une issue, zéro appel et résumé conservé', async t => {
  const s = setup(t);
  s.options.runtime.restoreState = async () => { writeFileSync(s.log, failures.map(run => JSON.stringify(run) + '\n').join('')); };
  s.options.client.models = async () => { throw new Error('Catalogue must not run'); };
  s.options.env = { ...s.options.env, GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: 'schedule' };
  const processImpl = new EventEmitter(); processImpl.exitCode = 0;
  const run = await main({ options: s.options, processImpl, output: () => {} });
  assert.equal(run.issue, 'coupe_circuit'); assert.equal(run.cout, 0); assert.equal(processImpl.exitCode, 0);
  assert.equal(s.calls.length, 0); assert.deepEqual(run.appels, []);
  const issues = s.events.filter(event => event.title);
  assert.equal(issues.length, 1); assert.equal(issues[0].title, 'Journal : coupe-circuit, trois échecs de suite');
  for (const failure of failures) assert.ok(issues[0].body.includes(failure.motif));
  assert.match(issues[0].body, /finish_reason/);
  assert.equal(s.logs().at(-1).issue, 'coupe_circuit'); assert.ok(s.events.includes('persist'));
  assert.ok(!s.events.includes('alert')); assert.match(readFileSync(s.summary, 'utf8'), /coupe_circuit/);
});
for (const env of [{ GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: 'workflow_dispatch' }, { GITHUB_EVENT_NAME: 'schedule' }]) test(`réarmement manuel ou local ${JSON.stringify(env)}`, async t => {
  const s = setup(t, { history: failures }); Object.assign(s.options.env, env);
  const run = await runMachine(s.options);
  assert.equal(run.issue, 'pr'); assert.ok(s.calls.length > 0);
  assert.deepEqual(circuitHistory(s.log), []);
});
for (const reset of [{ issue: 'pr' }, { issue: 'publie' }, { issue: 'echec', motif: 'file de sujets vide' }, { issue: 'echec', motif: 'sujets en attente de PR' }, { issue: 'echec', motif: 'couvert_par_chronique_presse' }]) test(`historique : ${JSON.stringify(reset)} remet le compteur à zéro`, t => {
  const s = setup(t, { history: [...failures, { date: '2026-11-13', ...reset }] });
  assert.deepEqual(circuitHistory(s.log), []);
});
test('simulations exclues ; un cron sauté ne réarme pas le suivant', async t => {
  const history = [...failures, { date: '2026-11-13', issue: 'pr', simulation: true }, { date: '2026-11-13', issue: 'coupe_circuit' }];
  const s = setup(t, { history });
  assert.equal(circuitHistory(s.log).length, 3);
  Object.assign(s.options.env, { GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: 'schedule' });
  assert.equal((await runMachine(s.options)).issue, 'coupe_circuit');
  assert.equal((await runMachine(s.options)).issue, 'coupe_circuit');
  assert.equal(s.calls.length, 0);
  const onlySimulated = setup(t, { history: failures.map(run => ({ ...run, simulation: true })) });
  assert.deepEqual(circuitHistory(onlySimulated.log), []);
});
test('simulation ne déclenche pas de coupe-circuit ni issue GitHub', async t => {
  const s = setup(t, { history: failures }); s.options.simulation = true;
  Object.assign(s.options.env, { GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: 'schedule' });
  assert.equal((await runMachine(s.options)).issue, 'pr'); assert.ok(!s.events.some(event => event.title));
});
test('issueOnce réutilise une seule issue ouverte et met à jour son diagnostic', async () => {
  const requests = [];
  const title = 'Journal : coupe-circuit, trois échecs de suite';
  const runtime = createGitHubRuntime({ env: { GITHUB_REPOSITORY: 'fixture/repo', GITHUB_TOKEN: 'fixture' }, fetchImpl: async (url, options) => {
    requests.push({ url, options });
    return new Response(JSON.stringify(options.method === 'PATCH' ? { number: 42 } : [{ number: 42, title, body: 'old' }]));
  } });
  assert.equal((await runtime.issueOnce(title, 'new metadata')).number, 42);
  assert.equal(requests.length, 2); assert.ok(requests[1].url.endsWith('/issues/42'));
  assert.equal(requests[1].options.method, 'PATCH');
  assert.equal(JSON.parse(requests[1].options.body).body, 'new metadata');
});
test('trace exhaustive : diagnostics historiques conservés, appels et résumés sans texte', async t => {
  const prompt = 'PRIVATE_PROMPT_MARKER', responseMarker = 'PRIVATE_RESPONSE_MARKER';
  const s = setup(t, { topics: [{ ...first, these_pressentie: prompt }], mutate: ({ response, role }) => {
    if (role === 'queries') {
      const value = JSON.parse(response.choices[0].message.content); value.extra = responseMarker;
      response.choices[0].message.content = JSON.stringify(value);
    }
    if (role === 'research') response.choices[0].message.annotations[0].url_citation.title = responseMarker;
    response.private = responseMarker;
    response.choices[0].message.reasoning = responseMarker;
  } });
  const run = await runMachine(s.options); assert.equal(run.issue, 'pr');
  assert.equal(run.appels.length, s.calls.length);
  const keys = ['etape', 'modele', 'tentative', 'echelon', 'finish_reason', 'jetons_entree', 'jetons_sortie', 'jetons_raisonnement', 'cout', 'duree_ms', 'issue', 'alerte_cout'];
  for (const call of run.appels) {
    assert.ok(keys.every(key => Object.hasOwn(call, key))); assert.ok(call.duree_ms >= 0);
    assert.equal(call.jetons_entree, 200); assert.equal(call.jetons_sortie, 100); assert.equal(call.jetons_raisonnement, 20);
  }
  for (const text of [JSON.stringify(s.logs()[0].appels), readFileSync(s.summary, 'utf8')]) {
    for (const marker of [prompt, responseMarker, fixtures.judge.choices[0].message.content]) assert.ok(!text.includes(marker));
  }
  assert.ok(s.calls.some(request => JSON.stringify(request).includes(prompt)));
  const projected = JSON.stringify(runRecord({ ...run, portes: [{ gate: 'juge', ok: false, motif: responseMarker }] }));
  assert.ok(projected.includes(responseMarker));
  assert.deepEqual(s.logs()[0].tentatives, run.tentatives);
  assert.deepEqual(s.logs()[0].portes, run.portes);
  assert.equal(s.logs()[0].these_retenue, run.these_retenue);
  assert.ok(s.logs()[0].tentatives[0].preparation_brute.includes(responseMarker));
  // The circuit issue reuses only safe summaries of historical records.
  const historical = { ...s.logs()[0], issue: 'echec', motif: `juge: ${responseMarker} ${prompt}` };
  writeFileSync(s.log, Array(3).fill(JSON.stringify(historical) + '\n').join(''));
  Object.assign(s.options.env, { GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: 'schedule' });
  assert.equal((await runMachine(s.options)).issue, 'coupe_circuit');
  const body = s.events.find(event => event.title).body;
  for (const marker of [prompt, responseMarker, fixtures.judge.choices[0].message.content]) assert.ok(!body.includes(marker));
  assert.match(body, /Motif : juge/);
  assert.equal(s.logs()[0].appels.length, run.appels.length);
});
for (const role of ['writing', 'editing', 'judge']) test(`alerte coût ${role} et champs usage optionnels`, async t => {
  const s = setup(t, { mutate: ({ response, role: active }) => {
    if (active !== role) return;
    response.usage.cost = role === 'judge' ? 0.06 : 0.26;
    delete response.usage.completion_tokens_details;
  } });
  const run = await runMachine(s.options); assert.equal(run.issue, 'pr');
  const call = run.appels.find(call => call.etape === { writing: 'redaction', editing: 'secretariat', judge: 'juge' }[role]);
  assert.equal(call.alerte_cout, true); assert.equal(call.jetons_raisonnement, null);
});
test('échelon sans réserve suffisante ne part pas, coût connu conservé', async t => {
  const s = setup(t, { mutate: ({ response, role }) => { if (role === 'writing') { response.usage.cost = 0.4; unusable(response); } } });
  const run = await runMachine(s.options);
  assert.match(run.motif, /réserve insuffisante/); assert.equal(run.issue, 'echec');
  assert.equal(s.calls.filter(request => roleOf(request) === 'writing').length, 1);
  assert.ok(Math.abs(run.cout - 0.431) < 1e-10); assert.ok(!s.article(first));
});
test('le plafond utilise le coût précédent le plus cher, pas seulement le dernier', async t => {
  const s = setup(t, { mutate: ({ response, role, count }) => { if (role === 'writing') { response.usage.cost = count === 1 ? 0.3 : 0.2; unusable(response); } } });
  const run = await runMachine(s.options);
  assert.match(run.motif, /réserve insuffisante/);
  assert.equal(s.calls.filter(request => roleOf(request) === 'writing').length, 2);
  assert.ok(Math.abs(run.cout - 0.531) < 1e-10);
});
test('workflow passe les deux replis, sans toucher à armement', () => {
  const workflow = readFileSync('.github/workflows/journal-quotidien.yml', 'utf8');
  for (const variable of ['JOURNAL_MODELE_REDACTION_REPLI', 'JOURNAL_MODELE_JUGE_REPLI']) assert.ok(workflow.includes(`${variable}: \${{ vars.${variable} }}`));
  assert.ok(workflow.includes('JOURNAL_AUTOPUBLISH: ${{ vars.JOURNAL_AUTOPUBLISH }}'));
});

for (const marker of ['PRIVATE_RESPONSE_MARKER', 'private-response-marker']) test(`crash pendant appel en vol : trace présente, client suspendu, marqueur ${marker} absent`, async t => {
  const s = setup(t), processImpl = new EventEmitter(), exits = [];
  processImpl.exit = code => exits.push(code);
  let called = 0;
  s.options.client.complete = async () => {
    called++;
    setImmediate(() => processImpl.emit('unhandledRejection', new Error(marker)));
    return new Promise(() => {});
  };
  const run = await main({ options: s.options, processImpl, output: () => {} });
  assert.equal(run.issue, 'crash'); assert.equal(called, 1); assert.equal(run.appels.length, 1);
  assert.equal(run.motif, 'erreur_technique');
  assert.deepEqual(run.modeles, DEFAULT_MODELS);
  assert.equal(run.modeles_effectifs.recherche, DEFAULT_MODELS.research);
  assert.equal(run.appels[0].etape, 'recherche'); assert.equal(run.appels[0].cout, null);
  assert.equal(s.logs().at(-1).appels.length, 1);
  for (const file of [s.log, s.summary]) assert.ok(!readFileSync(file, 'utf8').includes(marker));
  assert.equal(processImpl.exitCode, 1); assert.deepEqual(exits, [1]);
  assert.ok(!s.events.includes('publish'));
});

test('coupe-circuit distant restauré puis conservé par le runtime GitHub', async t => {
  const s = setup(t), calls = [];
  const saved = [...failures, { date: '2026-11-13T01:00:00Z', issue: 'coupe_circuit', cout: 0, appels: [] }];
  const reply = value => new Response(JSON.stringify(value));
  const runtime = createGitHubRuntime({ root: s.options.root, env: { GITHUB_REPOSITORY: 'fixture/repo', GITHUB_TOKEN: 'fixture' }, fetchImpl: async (url, options) => {
    calls.push({ url, options });
    if (url.endsWith('/git/ref/heads/journal/etat')) return reply({ object: { sha: 'saved' } });
    if (url.endsWith('/git/ref/heads/main')) return reply({ object: { sha: 'base' } });
    if (url.includes('/commits?')) return reply([{ commit: { committer: { date: url.includes('sha=saved') ? '2026-11-13' : '2026-11-10' } } }]);
    if (url.includes('/contents/content/plan/')) return reply({ type: 'file', encoding: 'base64', content: Buffer.from(url.includes('sujets.json') ? JSON.stringify([first]) : saved.map(run => JSON.stringify(run) + '\n').join('')).toString('base64') });
    if (url.endsWith('/git/commits/saved')) return reply({ tree: { sha: 'saved-tree' } });
    if (url.endsWith('/git/trees')) return reply({ sha: 'tree' });
    if (url.endsWith('/git/commits')) return reply({ sha: 'commit' });
    if (url.endsWith('/git/refs/heads/journal/etat')) return reply({});
    throw new Error(`unexpected mocked endpoint ${url}`);
  } });
  await runtime.restoreState(); await runtime.persistState();
  assert.equal(circuitHistory(s.log).length, 3);
  const tree = JSON.parse(calls.find(call => call.url.endsWith('/git/trees')).options.body).tree;
  assert.ok(tree.find(file => file.path.endsWith('.jsonl')).content.includes('coupe_circuit'));
  assert.ok(!calls.some(call => call.url.endsWith('/git/refs/heads/main') || call.url.endsWith('/pulls')));
});

test('les motifs arbitraires ne deviennent pas des noms de portes autorisés', () => {
  for (const marker of ['private-response-marker', 'PRIVATE_RESPONSE_MARKER', 'openrouter_redaction_PRIVATE_SECRET']) {
    assert.equal(diagnosticReason(marker), 'erreur_technique');
    const run = { date: '2026-11-13', issue: 'echec', motif: marker, cout: 0 };
    assert.equal(runRecord(run).motif, marker);
    assert.ok(!runSummary(run).includes(marker));
  }
  assert.equal(diagnosticReason('anti-ia: contenu privé; sources: citation privée'), 'anti-ia; sources');
});

for (const role of ['writing', 'editing', 'judge']) {
  for (const failure of ['delai', 429, 503]) test(`${role}: ${failure} épuisé puis repli direct, sans effort none`, async t => {
    const s = setup(t, { mutate: ({ role: active, count }) => {
      if (active === role && count <= 2) throw failure === 'delai'
        ? new DOMException('private timeout', 'TimeoutError')
        : Object.assign(new Error('private provider error'), { status: failure });
    } });
    const run = await runMachine(s.options);
    assert.equal(run.issue, 'pr');
    const requests = s.calls.filter(request => roleOf(request) === role);
    const stage = { writing: 'redaction', editing: 'secretariat', judge: 'juge' }[role];
    assert.deepEqual(run.appels.filter(call => call.etape === stage).map(call => [call.echelon, call.tentative, call.issue]), [
      [1, 1, failure === 'delai' ? 'delai' : `http_${failure}`],
      [1, 2, failure === 'delai' ? 'delai' : `http_${failure}`], [3, 1, 'ok'],
    ]);
    assert.equal(requests.length, 3);
    assert.ok(requests.every(request => request.reasoning.max_tokens === 4000));
    assert.equal(requests[2].model, role === 'judge' ? DEFAULT_MODELS.judgeFallback : DEFAULT_MODELS.writingFallback);
    assert.equal(run.modeles_effectifs[stage], requests[2].model);
    assert.equal(s.events.filter(event => event.sleep === 5000).length, 1);
  });
  for (const status of [400, 401, 403, 422]) test(`${role}: HTTP ${status} initial échoue sans repli`, async t => {
    const s = setup(t, { mutate: ({ role: active }) => {
      if (active === role) throw Object.assign(new Error('private provider error'), { status });
    } });
    const run = await runMachine(s.options);
    const stage = { writing: 'redaction', editing: 'secretariat', judge: 'juge' }[role];
    assert.equal(run.issue, 'echec'); assert.equal(run.motif, `openrouter_${stage}_http_${status}`);
    assert.equal(s.calls.filter(request => roleOf(request) === role).length, 1);
    assert.ok(!s.article(first));
  });
  for (const wrap of [text => '```json\n' + text + '\n```', text => text + '\nTexte après l’objet. {annexe}']) {
    test(`${role}: JSON entouré accepté dès le premier échelon (${wrap('{}')})`, async t => {
      const s = setup(t, { mutate: ({ response, role: active }) => {
        if (active === role) response.choices[0].message.content = wrap(response.choices[0].message.content);
      } });
      const run = await runMachine(s.options);
      assert.equal(run.issue, 'pr');
      assert.equal(s.calls.filter(request => roleOf(request) === role).length, 1);
      assert.ok(run.appels.every(call => call.echelon === 1 && call.issue === 'ok'));
    });
  }
}

test('JSON partagé : accolades imbriquées, échappements, texte après et objet illisible', () => {
  const object = { nested: { list: [{ value: 'guillemet " et accolades } { et barre \\' }] } };
  assert.deepEqual(parseResponseObject('```json\n' + JSON.stringify(object) + '\n```\nannexe {sans JSON}'), object);
  for (const invalid of ['pas de JSON', '```json\n{"fr":\n```', '{"fr":}', '{"fr":"texte}']) {
    assert.throws(() => parseResponseObject(invalid), SyntaxError);
  }
});

test('JSON illisible aux trois échelons : refus sans article', async t => {
  const s = setup(t, { mutate: ({ response, role }) => { if (role === 'editing') unusable(response, '```json\n{"fr":}\n```'); } });
  const run = await runMachine(s.options);
  assert.equal(run.motif, 'openrouter_secretariat_json_invalide');
  assert.deepEqual(run.appels.filter(call => call.etape === 'secretariat').map(call => call.echelon), [1, 2, 3]);
  assert.ok(!s.article(first)); assert.ok(!s.events.includes('publish'));
});

for (const primary of [true, false]) for (const fallback of [true, false]) {
  test(`catalogue rédaction : principal ${primary}, repli ${fallback}`, async t => {
    const models = { ...DEFAULT_MODELS, writingFallback: 'fixture/writing-fallback' };
    const s = setup(t, { models });
    s.options.client.models = async () => Object.values(models).filter(model => (primary || model !== models.writing) && (fallback || model !== models.writingFallback));
    const run = await runMachine(s.options);
    if (!primary && !fallback) {
      assert.equal(run.issue, 'echec'); assert.equal(run.motif, 'modèles indisponibles : redaction');
      assert.equal(s.calls.length, 0); assert.equal(run.cout, 0); assert.equal(run.tentatives.length, 0);
    } else {
      assert.equal(run.issue, 'pr');
      assert.equal(run.modeles_effectifs.redaction, primary ? models.writing : models.writingFallback);
      assert.equal(run.modeles_effectifs.secretariat, primary ? models.writing : models.writingFallback);
      assert.ok(run.appels.filter(call => ['redaction', 'secretariat'].includes(call.etape)).every(call => call.echelon === (primary ? 1 : 3)));
    }
  });
  test(`catalogue juge : principal ${primary}, repli ${fallback}`, async t => {
    const models = { ...DEFAULT_MODELS, judgeFallback: 'fixture/judge-fallback' };
    const s = setup(t, { models });
    s.options.client.models = async () => Object.values(models).filter(model => (primary || model !== models.judge) && (fallback || model !== models.judgeFallback));
    const run = await runMachine(s.options);
    if (!primary && !fallback) {
      assert.equal(run.issue, 'echec'); assert.equal(run.motif, 'modèles indisponibles : juge');
      assert.equal(s.calls.length, 0); assert.equal(run.cout, 0); assert.equal(run.tentatives.length, 0);
      assert.notEqual(run.motif, 'juge_identique_au_redacteur');
    } else {
      assert.equal(run.issue, 'pr');
      assert.equal(run.modeles_effectifs.juge, primary ? models.judge : models.judgeFallback);
    }
  });
}

test('catalogue recherche absent : arrêt de configuration avant tout appel payant', async t => {
  const s = setup(t);
  s.options.client.models = async () => Object.values(DEFAULT_MODELS).filter(model => model !== DEFAULT_MODELS.research);
  const run = await runMachine(s.options);
  assert.equal(run.issue, 'echec'); assert.equal(run.motif, `modèle indisponible : ${DEFAULT_MODELS.research}`);
  assert.equal(s.calls.length, 0); assert.equal(run.cout, 0);
});

for (const issues of [['crash', 'crash', 'crash'], ['echec', 'crash', 'echec']]) {
  test(`cron coupe les trois échecs techniques ${issues.join(', ')}`, async t => {
    const history = failures.map((run, index) => ({ ...run, issue: issues[index] }));
    const s = setup(t, { history });
    Object.assign(s.options.env, { GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: 'schedule' });
    s.options.client.models = async () => { throw new Error('no catalogue on circuit break'); };
    const processImpl = new EventEmitter(); processImpl.exitCode = 0;
    const run = await main({ options: s.options, processImpl, output: () => {} });
    assert.equal(run.issue, 'coupe_circuit'); assert.equal(run.cout, 0); assert.equal(processImpl.exitCode, 0);
    assert.equal(s.calls.length, 0); assert.equal(s.events.filter(event => event.title).length, 1);
    assert.deepEqual(circuitHistory(s.log), history);
  });
}

test('projection JSONL conserve exactement tous les diagnostics historiques', () => {
  const historical = {
    motif: 'sources: détail de porte', these_retenue: 'Thèse retenue',
    portes: [{ gate: 'sources', ok: false, motif: 'source rejetée avec détail' }],
    tentatives: [{ sujet: first.id, passes: [[{ gate: 'juge', ok: false, motif: 'citation exacte' }]],
      motif: 'juge: citation exacte', preparation_brute: '{"requete":"brute"}', preparation_relance_brute: '{"requete":"relance"}',
      these_retenue: 'Thèse retenue', recherches: [{ passe: 'institutions', requetes: ['recherche exacte'], requetes_reconstruites: false }],
      recherche_interrompue: { passe: 'contradiction', message: 'diagnostic historique' },
      sources_acceptees: [{ url: 'https://example.org/retained', title: 'Titre retenu', publisher: 'Éditeur', published_at: '2026-11-01', faits_chiffres: 4 }],
      sources_ecartees: [{ url: 'https://example.org/rejected', title: 'Titre écarté', motif: 'date_absente' }],
    }],
  };
  const { appels, modeles, modeles_effectifs, ...persisted } = runRecord(historical);
  assert.deepEqual(persisted, historical); assert.deepEqual(appels, []);
  assert.deepEqual(modeles, {}); assert.deepEqual(modeles_effectifs, {});
});

for (const failure of [400, 503, 'vide']) test(`juge distinct disponible en échec ${failure} : motif réel, jamais conflit de modèles`, async t => {
  const models = { ...DEFAULT_MODELS, judge: DEFAULT_MODELS.writing, judgeFallback: 'fixture/independent-judge' };
  const s = setup(t, { models, mutate: ({ response, role }) => {
    if (role !== 'judge') return;
    if (failure === 'vide') unusable(response);
    else throw Object.assign(new Error('private provider error'), { status: failure });
  } });
  const run = await runMachine(s.options);
  assert.equal(run.issue, 'echec');
  assert.equal(run.motif, `openrouter_juge_${failure === 'vide' ? 'vide' : `http_${failure}`}`);
  assert.ok(s.calls.filter(request => roleOf(request) === 'judge').every(request => request.model === models.judgeFallback));
  assert.ok(!s.article(first));
});

test('repli indisponible après délai du juge distinct : conserve le motif délai', async t => {
  const s = setup(t, { mutate: ({ role }) => { if (role === 'judge') throw new DOMException('private timeout', 'TimeoutError'); } });
  s.options.client.models = async () => [DEFAULT_MODELS.research, DEFAULT_MODELS.writing, DEFAULT_MODELS.judge];
  const run = await runMachine(s.options);
  assert.equal(run.motif, 'openrouter_juge_delai'); assert.equal(run.issue, 'echec');
  assert.equal(s.calls.filter(request => roleOf(request) === 'judge').length, 2);
  assert.ok(!s.article(first));
});
