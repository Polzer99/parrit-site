import assert from 'node:assert/strict';
import { test, mock } from 'node:test';
import { EventEmitter } from 'node:events';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import { main, runMachine, DEFAULT_MODELS, atomicJSON, fixtureClient, openRouterClient } from '../scripts/journal-machine.mjs';
import { generationSettings } from '../scripts/journal-machine-config.mjs';
import { runModelTrial, TRIAL_SETTINGS } from '../scripts/journal-machine-trial.mjs';
import { callTrace, responseIssue, runRecord, runSummary, circuitHistory } from '../scripts/journal-machine-trace.mjs';
import { sourceResponse } from './fixtures/journal-machine/source-response.mjs';

const deny = () => { throw new Error('Network forbidden'); };
mock.method(globalThis, 'fetch', deny);
for (const transport of [http, https]) for (const method of ['get', 'request']) mock.method(transport, method, deny);
mock.method(net.Socket.prototype, 'connect', deny);
const fixtureDir = path.resolve('tests/fixtures/journal-machine');
const topic = { id: 'premier-outil-ia', requete: 'Comment choisir votre premier outil IA ?', intention: 'informationnelle', pilier: 'audit-pme', offre: 'audit', angle_local: false, statut: 'a_faire', slug: null, publie_le: null };
const response = (cost = 0.001) => ({ choices: [{ finish_reason: 'stop', message: { content: '{"paragraphe":"PRIVATE_TEXT"}' } }], usage: { prompt_tokens: 40, completion_tokens: 200, completion_tokens_details: { reasoning_tokens: 60 }, cost } });
function setup(t, mutate = () => {}) {
  const root = mkdtempSync(path.join(tmpdir(), 'journal-budget-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  atomicJSON(path.join(root, 'content/plan/sujets.json'), [topic]);
  atomicJSON(path.join(root, 'content/plan/journal-translations.json'), []);
  const summary = path.join(root, 'summary.md');
  const calls = [], events = [];
  const models = { ...DEFAULT_MODELS, judgeFallback: 'fixture/second-judge' };
  const options = { root, models, env: { GITHUB_STEP_SUMMARY: summary }, client: {
    models: async ({ withPricing } = {}) => { events.push('catalogue'); return withPricing ? Object.values(models).map(id => ({ id, pricing: { prompt: '0', completion: '0.000001', request: '0' } })) : Object.values(models); },
    complete: async request => { calls.push(request); const data = response(); await mutate(data, request, calls.length); return data; },
  }, runtime: new Proxy({}, { get: () => () => { throw new Error('Runtime forbidden'); } }) };
  return { options, calls, events, summary, log: path.join(root, 'content/plan/journal-runs.jsonl') };
}
function snapshot(root) {
  return readdirSync(root, { recursive: true, withFileTypes: true }).filter(entry => entry.isFile())
    .map(entry => path.join(entry.parentPath, entry.name)).filter(file => !/journal-runs.jsonl$|summary.md$/.test(file))
    .sort().map(file => [path.relative(root, file), readFileSync(file, 'utf8')]);
}

test('essai CLI : quatre modèles distincts × cinq réglages une fois, aucun état métier ni appel runtime', async t => {
  const s = setup(t), before = snapshot(s.options.root), processImpl = new EventEmitter();
  processImpl.exitCode = 0;
  const run = await main({ args: ['--essai-modeles'], options: s.options, processImpl, output: () => {} });
  assert.equal(run.issue, 'essai_termine'); assert.equal(run.mode, 'essai_modeles');
  assert.equal(s.calls.length, 20); assert.equal(processImpl.exitCode, 0);
  assert.deepEqual(snapshot(s.options.root), before);
  assert.deepEqual(s.events, ['catalogue']);
  const summary = readFileSync(s.summary, 'utf8'), log = JSON.parse(readFileSync(s.log, 'utf8'));
  assert.equal(summary.split('\n').filter(line => line.startsWith('| essai_modeles |')).length, 20);
  assert.equal(log.appels.length, 20);
  for (const model of new Set([s.options.models.writing, s.options.models.writingFallback, s.options.models.judge, s.options.models.judgeFallback])) {
    const requests = s.calls.filter(request => request.model === model);
    assert.equal(requests.length, 5);
    assert.deepEqual(requests.map(request => request.reasoning), TRIAL_SETTINGS.map(setting => setting.reasoning));
    assert.ok(!Object.hasOwn(requests[4], 'reasoning'));
    for (const setting of TRIAL_SETTINGS) assert.ok(summary.includes(`| ${model} | — | ${setting.name} | 200 | stop | 200 | 60 | 140 |`));
  }
  assert.ok(s.calls.every(request => request.max_tokens === 3000 && !request.plugins && request.response_format.type === 'json_object'));
  assert.ok(s.calls.every(request => JSON.stringify(request.messages) === JSON.stringify(s.calls[0].messages)));
  assert.match(s.calls[0].messages[0].content, /120 mots/);
  assert.ok(!summary.includes('PRIVATE_TEXT')); assert.ok(!readFileSync(s.log, 'utf8').includes('PRIVATE_TEXT'));
});
test('modèle de repli partagé essayé une seule fois', async t => {
  const s = setup(t); s.options.models = DEFAULT_MODELS;
  await runModelTrial(s.options);
  assert.equal(s.calls.length, 15);
  const models = [DEFAULT_MODELS.writing, DEFAULT_MODELS.writingFallback, DEFAULT_MODELS.judge];
  const settings = [
    { effort: 'none' }, { enabled: false }, { max_tokens: 1024 }, { effort: 'low' }, undefined,
  ];
  assert.deepEqual(s.calls.map(({ model, reasoning }) => ({ model, reasoning })),
    settings.flatMap(reasoning => models.map(model => ({ model, reasoning }))));
});
for (const status of [400, 422]) test(`essai : refus ${status} tracé, sans répétition ni interruption`, async t => {
  const s = setup(t, (_data, _request, index) => { if (index === 2) throw Object.assign(new Error('PRIVATE_PROVIDER_ERROR'), { status }); });
  const run = await runModelTrial(s.options);
  assert.equal(run.issue, 'essai_termine'); assert.equal(s.calls.length, 20);
  assert.equal(run.appels[1].issue, 'parametre_refuse'); assert.equal(run.appels[1].http_status, status);
  assert.match(readFileSync(s.summary, 'utf8'), new RegExp(`effort_none \\| ${status} .*parametre_refuse`));
  assert.ok(!readFileSync(s.log, 'utf8').includes('PRIVATE_PROVIDER_ERROR'));
});
for (const cost of [0.025, 0.04]) test(`essai : coût ${cost}, plafond et réserve avant chaque appel`, async t => {
  const s = setup(t, data => { data.usage.cost = cost; });
  const run = await runModelTrial({ ...s.options, budget: 500 });
  assert.equal(run.issue, 'essai_plafond'); assert.equal(s.calls.length, cost === 0.025 ? 4 : 2);
  assert.ok(run.cout <= 0.1); assert.equal(run.appels.length, s.calls.length);
  const summary = readFileSync(s.summary, 'utf8');
  assert.equal(summary.split('non essayé (plafond)').length - 1, 20 - s.calls.length);
  assert.ok(summary.includes('| Modèle | effort_none | enabled_false | max_tokens_1024 | effort_low | sans_parametre |'));
  for (const model of [s.options.models.writing, s.options.models.writingFallback, s.options.models.judge, s.options.models.judgeFallback]) {
    const cells = ['effort_none', 'enabled_false', 'max_tokens_1024', 'effort_low', 'sans_parametre']
      .map(setting => run.appels.some(call => call.modele === model && call.reglage === setting) ? 'ok' : 'non essayé (plafond)');
    assert.ok(summary.includes(`| ${model} | ${cells.join(' | ')} |`));
  }
});
for (const cost of [undefined, NaN, -1]) test(`essai : coût inconnu/invalide ${cost}, aucun nouvel appel`, async t => {
  const s = setup(t, data => { data.usage.cost = cost; });
  const run = await runModelTrial(s.options);
  assert.equal(run.issue, 'echec'); assert.equal(s.calls.length, 1);
  assert.equal(run.appels[0].http_status, 200);
  assert.equal(run.cout_reserves_sans_reponse, 0);
});
for (const data of [null, undefined]) test(`essai : réponse 200 ${data} sans coût reste bloquante`, async t => {
  const s = setup(t);
  s.options.client.complete = async request => { s.calls.push(request); return data; };
  const run = await runModelTrial(s.options);
  assert.equal(run.issue, 'echec'); assert.equal(s.calls.length, 1);
  assert.equal(run.appels[0].http_status, 200); assert.equal(run.cout_reserves_sans_reponse, 0);
});
for (const status of [429, 503]) test(`essai HTTP ${status} : une tentative par cellule, réserve comptée, essai poursuivi`, async t => {
  const s = setup(t, () => { throw Object.assign(new Error('PRIVATE'), { status }); });
  const run = await runModelTrial(s.options);
  assert.equal(s.calls.length, 20); assert.equal(run.issue, 'essai_termine');
  assert.ok(run.appels.every(call => call.issue === `http_${status}` && call.cout === null));
  assert.ok(Math.abs(run.cout - 20 * 0.003) < 1e-12);
  assert.equal(run.cout_reserves_sans_reponse, run.cout);
});
test('essai : 404 au milieu, coût nul, tableau complet', async t => {
  const s = setup(t, (_data, _request, index) => { if (index === 8) throw Object.assign(new Error('PRIVATE'), { status: 404 }); });
  const run = await runModelTrial(s.options);
  assert.equal(run.issue, 'essai_termine'); assert.equal(s.calls.length, 20);
  assert.equal(run.appels[7].issue, 'http_404'); assert.equal(run.appels[7].http_status, 404);
  assert.equal(run.appels[7].cout, 0); assert.equal(run.cout_reserves_sans_reponse, 0);
  assert.ok(Math.abs(run.cout - 19 * 0.001) < 1e-12);
  assert.equal(JSON.parse(readFileSync(s.log, 'utf8')).appels[7].cout, 0);
});
test('essai : délai puis 503, deux réserves, succès suivant puis arrêt avant dépassement', async t => {
  const s = setup(t, (data, _request, index) => {
    if (index === 1) throw new DOMException('PRIVATE', 'TimeoutError');
    if (index === 2) throw Object.assign(new Error('PRIVATE'), { status: 503 });
    data.usage.cost = 0.02;
  });
  s.options.client.models = async () => Object.values(s.options.models).map(id => ({ id, pricing: { prompt: '0', completion: '0.00001', request: '0' } }));
  const run = await runModelTrial(s.options);
  assert.equal(run.issue, 'essai_plafond'); assert.equal(s.calls.length, 3);
  assert.deepEqual(run.appels.map(call => [call.issue, call.cout]), [['delai', null], ['http_503', null], ['ok', 0.02]]);
  assert.ok(Math.abs(run.cout_reserves_sans_reponse - 0.06) < 1e-12); assert.ok(Math.abs(run.cout - 0.08) < 1e-12);
  assert.ok(readFileSync(s.summary, 'utf8').includes(`dont réserves comptées pour appels sans réponse : ${run.cout_reserves_sans_reponse} USD`));
  const record = JSON.parse(readFileSync(s.log, 'utf8'));
  assert.equal(record.cout, run.cout); assert.equal(record.cout_reserves_sans_reponse, run.cout_reserves_sans_reponse);
  assert.deepEqual(record.appels.map(call => call.cout), [null, null, 0.02]);
});
test('essai : coupure réseau réservée sans interrompre le réglage suivant', async t => {
  const s = setup(t, (_data, _request, index) => { if (index === 1) throw Object.assign(new Error('PRIVATE'), { code: 'ECONNRESET' }); });
  const run = await runModelTrial(s.options);
  assert.equal(run.issue, 'essai_termine'); assert.equal(s.calls.length, 20);
  assert.equal(run.appels[0].issue, 'http_000'); assert.equal(run.appels[0].cout, null);
  assert.equal(run.cout_reserves_sans_reponse, 0.003);
  assert.ok(Math.abs(run.cout - (0.003 + 19 * 0.001)) < 1e-12);
});
test('essais exclus du coupe-circuit, y compris un crash', async t => {
  const s = setup(t);
  const failures = Array.from({ length: 3 }, (_, index) => ({ date: `2026-11-${10 + index}`, issue: 'echec', motif: 'openrouter_redaction_vide' }));
  writeFileSync(s.log, [...failures, { date: '2026-11-13', mode: 'essai_modeles', issue: 'essai_termine' }, { date: '2026-11-14', mode: 'essai_modeles', issue: 'crash' }].map(JSON.stringify).join('\n'));
  assert.deepEqual(circuitHistory(s.log), failures);
});

for (const [name, values] of Object.entries({
  JOURNAL_REDACTION_MAX_TOKENS: ['abc', '0', '-1', '1.5', 'Infinity'],
  JOURNAL_JUGE_MAX_TOKENS: ['abc', '0', '9007199254740992'],
  JOURNAL_RAISONNEMENT_REDACTION: ['{PRIVATE', 'null', '[]', '"low"', '{"effort":42}', '{"enabled":"false"}', '{"max_tokens":-1}'],
  JOURNAL_RAISONNEMENT_JUGE: ['{', 'true', '{"effort":"invalid"}', '{"exclude":0}', '{"effort":"low","max_tokens":1000}'],
})) for (const value of values) test(`configuration invalide ${name}=${value} : arrêt avant catalogue, paiement et restauration`, async t => {
  const s = setup(t); s.options.env[name] = value;
  const before = snapshot(s.options.root);
  for (const execute of [runMachine, runModelTrial]) {
    const run = await execute(s.options);
    assert.equal(run.issue, 'echec'); assert.equal(run.motif, `${name} invalide`);
  }
  assert.equal(s.calls.length, 0); assert.deepEqual(s.events, []); assert.deepEqual(snapshot(s.options.root), before);
});
for (const custom of [false, true]) test(`configuration envoyée aux trois échelons rédaction/secrétariat/juge, personnalisée=${custom}`, async t => {
  const s = setup(t), counts = {}, fixture = fixtureClient(fixtureDir);
  const env = custom ? { JOURNAL_REDACTION_MAX_TOKENS: '24000', JOURNAL_JUGE_MAX_TOKENS: '9000', JOURNAL_RAISONNEMENT_REDACTION: '{"enabled":false,"exclude":true}', JOURNAL_RAISONNEMENT_JUGE: '{"effort":"minimal"}' } : {};
  const settings = generationSettings(env);
  s.options.models = DEFAULT_MODELS;
  s.options.simulation = true;
  s.options.runtime = undefined;
  s.options.env = env;
  s.options.now = () => new Date('2026-11-13T05:15:00Z');
  s.options.sourceOptions = { fetchImpl: async url => sourceResponse(url, readFileSync(path.join(fixtureDir, 'source.txt'), 'utf8')), resolve: async () => [{ address: '1.1.1.1' }] };
  s.options.client.complete = async request => {
    s.calls.push(request);
    const role = request.response_format?.type === 'json_schema' ? 'judge' : request.model === DEFAULT_MODELS.research ? 'research' : request.temperature === 0.2 ? 'editing' : 'writing';
    counts[role] = (counts[role] || 0) + 1;
    // Writing consumes its fallback; give the judge a distinct configured fallback.
    const data = await fixture.complete({ ...request, model: role === 'judge' ? DEFAULT_MODELS.judge : request.model });
    if (role !== 'research' && counts[role] < 3) data.choices[0].message.content = '';
    return data;
  };
  s.options.models = { ...DEFAULT_MODELS, judgeFallback: 'fixture/second-judge' };
  const run = await runMachine(s.options);
  assert.equal(run.issue, 'pr', run.motif);
  for (const [stage, role, filter] of [
    ['redaction', 'writing', request => request.temperature === 0.5],
    ['secretariat', 'writing', request => request.temperature === 0.2],
    ['juge', 'judge', request => request.response_format?.type === 'json_schema'],
  ]) {
    const requests = s.calls.filter(filter);
    assert.equal(requests.length, 3, stage);
    assert.ok(requests.every(request => request.max_tokens === settings[role].max_tokens));
    assert.deepEqual(requests.map(request => request.reasoning), [settings[role].reasoning, { effort: 'none' }, settings[role].reasoning]);
  }
  assert.ok(s.calls.filter(request => request.model === DEFAULT_MODELS.research).every(request => !request.reasoning));
});
test('variables vides du workflow utilisent les défauts', () => {
  assert.deepEqual(generationSettings({ JOURNAL_REDACTION_MAX_TOKENS: '', JOURNAL_JUGE_MAX_TOKENS: '', JOURNAL_RAISONNEMENT_REDACTION: '', JOURNAL_RAISONNEMENT_JUGE: '' }), {
    writing: { max_tokens: 32000, reasoning: { max_tokens: 4000 } }, judge: { max_tokens: 8000, reasoning: { max_tokens: 4000 } },
  });
});
for (const reasoning of [200, 300]) for (const content of [undefined, ' ', '{"ok":true}', 'JSON invalide']) for (const finish of ['stop', 'length']) test(`contenu prioritaire sur les jetons visibles : ${JSON.stringify(content)}, ${finish}, raisonnement=${reasoning}`, () => {
  const data = response(); data.usage.completion_tokens_details.reasoning_tokens = reasoning;
  data.choices[0] = { finish_reason: finish, message: { content } };
  assert.equal(responseIssue(data, true), !content?.trim() ? 'vide' : finish === 'length' ? 'tronquee' : content === 'JSON invalide' ? 'json_invalide' : 'ok');
  const trace = callTrace({ etape: 'redaction', response: data, duration: 1 });
  assert.equal(trace.jetons_visibles, 0); assert.equal(runRecord({ appels: [trace] }).appels[0].jetons_visibles, 0);
});
test('contenu vide tronqué avec jetons visibles : priorité historique conservée', () => {
  const data = response(); data.choices[0] = { finish_reason: 'length', message: { content: ' ' } };
  assert.equal(responseIssue(data, true), 'tronquee');
});
test('jetons visibles calculés, métadonnées absentes tolérées sans faux zéro', () => {
  const data = response();
  assert.equal(callTrace({ response: data, duration: 0 }).jetons_visibles, 140);
  delete data.usage.completion_tokens_details;
  assert.equal(callTrace({ response: data, duration: 0 }).jetons_visibles, 200);
  delete data.usage;
  assert.equal(callTrace({ response: data, duration: 0 }).jetons_visibles, null);
  assert.equal(responseIssue(data, true), 'ok');
});
for (const stage of ['redaction', 'secretariat', 'juge']) for (const over of [false, true]) test(`seuil strict d'alerte ${stage}, dépassé=${over}`, () => {
  const cost = (stage === 'juge' ? 0.05 : 0.25) + (over ? 0.001 : 0);
  assert.equal(callTrace({ etape: stage, response: response(cost), duration: 0 }).alerte_cout, over);
});
test('résumé protège également réglage et HTTP non fiables', () => {
  const text = runSummary({ appels: [{ etape: 'essai_modeles', reglage: 'PRIVATE', http_status: 'PRIVATE' }] });
  assert.ok(!text.includes('PRIVATE'));
});
test('workflow expose le booléen et les quatre nouveaux paramètres plus le budget existant', () => {
  const workflow = readFileSync('.github/workflows/journal-quotidien.yml', 'utf8');
  assert.match(workflow, /essai_modeles:[\s\S]*?default: false\s+type: boolean/);
  assert.match(workflow, /run: node scripts\/journal-machine.mjs \$\{\{ inputs.essai_modeles && '--essai-modeles' \|\| '' \}\}/);
  for (const variable of ['JOURNAL_REDACTION_MAX_TOKENS', 'JOURNAL_JUGE_MAX_TOKENS', 'JOURNAL_RAISONNEMENT_REDACTION', 'JOURNAL_RAISONNEMENT_JUGE', 'JOURNAL_COUT_MAX_USD']) assert.ok(workflow.includes(`${variable}: \${{ vars.${variable} }}`));
});

test('crash catalogue essai : un seul journal, aucune restauration ou persistance', async t => {
  const s = setup(t), processImpl = new EventEmitter(), before = snapshot(s.options.root);
  s.options.client.models = async () => { throw new Error('PRIVATE_CATALOG_ERROR'); };
  const run = await main({ args: ['--essai-modeles'], options: s.options, processImpl, output: () => {} });
  assert.equal(run.issue, 'crash'); assert.equal(run.mode, 'essai_modeles');
  assert.equal(processImpl.exitCode, 1); assert.equal(s.calls.length, 0);
  assert.deepEqual(snapshot(s.options.root), before);
  assert.equal(readFileSync(s.log, 'utf8').trim().split('\n').length, 1);
  assert.ok(!readFileSync(s.log, 'utf8').includes('PRIVATE_CATALOG_ERROR'));
});
test('essai interrompu pendant un appel : trace unique et arrêt sans écriture métier', async t => {
  const s = setup(t), processImpl = new EventEmitter(), before = snapshot(s.options.root), exits = [];
  processImpl.exit = code => exits.push(code);
  s.options.client.complete = async request => {
    s.calls.push(request);
    setImmediate(() => processImpl.emit('unhandledRejection', new Error('PRIVATE_ASYNC_ERROR')));
    return new Promise(() => {});
  };
  const run = await main({ args: ['--essai-modeles'], options: s.options, processImpl, output: () => {} });
  assert.equal(run.issue, 'crash'); assert.equal(run.mode, 'essai_modeles');
  assert.equal(run.appels.length, 1); assert.equal(s.calls.length, 1); assert.deepEqual(exits, [1]);
  assert.deepEqual(snapshot(s.options.root), before);
  assert.equal(readFileSync(s.log, 'utf8').trim().split('\n').length, 1);
  assert.ok(!readFileSync(s.log, 'utf8').includes('PRIVATE_ASYNC_ERROR'));
});

for (const ceiling of [0.05, 0.11]) test(`borne tarifaire ${ceiling} réservée avant paiement, même au premier appel`, async t => {
  const s = setup(t, (data, _request, index) => { data.usage.cost = [0.025, 0.025, 0.025, 0.05][index - 1]; });
  s.options.client.models = async () => Object.values(s.options.models).map(id => ({ id, pricing: { prompt: '0', completion: String(ceiling / 3000), request: '0' } }));
  const run = await runModelTrial(s.options);
  // The rounded cap raises the .05 reserve slightly: only two .025 calls fit.
  assert.equal(run.issue, 'essai_plafond'); assert.equal(s.calls.length, ceiling === 0.05 ? 2 : 0);
  assert.ok(run.cout <= 0.1);
  assert.ok(s.calls.every(request => request.provider.max_price.completion >= ceiling / 3000 * 1e6));
});
for (const pricing of [undefined, {}, { prompt: '0', completion: '-1', request: '0' }, { prompt: '', completion: '0', request: '0' }, { prompt: '0', completion: '0' }]) test(`tarifs inconnus ou invalides : aucun paiement ${JSON.stringify(pricing)}`, async t => {
  const s = setup(t);
  s.options.client.models = async () => Object.values(s.options.models).map(id => ({ id, pricing }));
  const run = await runModelTrial(s.options);
  assert.equal(run.issue, 'echec'); assert.equal(s.calls.length, 0); assert.match(run.motif, /tarifs/);
});
test('réserve comprend entrée, sortie et prix par requête, caps fournisseur aux mêmes tarifs', async t => {
  const s = setup(t);
  s.options.client.models = async () => Object.values(s.options.models).map(id => ({ id, pricing: { prompt: '0.00001', completion: '0.00001', request: '0.03' } }));
  const run = await runModelTrial(s.options);
  assert.equal(run.issue, 'essai_plafond'); assert.equal(s.calls.length, 0); // .04096 + .03 + .03 > .10
});

test('catalogue : IDs historiques conservés, prix disponibles seulement sur demande', async () => {
  const models = [{ id: 'fixture/model', pricing: { prompt: '0.000001', completion: '0.000002', request: '0' }, private: 'NOT_EXPORTED' }];
  const client = openRouterClient({ apiKey: 'fixture', fetchImpl: async () => new Response(JSON.stringify({ data: models })) });
  assert.deepEqual(await client.models(), ['fixture/model']);
  assert.deepEqual(await client.models({ withPricing: true }), [{ id: models[0].id, pricing: models[0].pricing }]);
});
test('essai : conversion des prix par jeton en caps par million et coût requête natif', async t => {
  const s = setup(t);
  s.options.client.models = async () => Object.values(s.options.models).map(id => ({ id, pricing: { prompt: '0.000001', completion: '0.000002', request: '0.0001' } }));
  const run = await runModelTrial(s.options);
  assert.equal(run.issue, 'essai_termine'); assert.equal(s.calls.length, 20);
  assert.ok(s.calls.every(request => JSON.stringify(request.provider.max_price) === JSON.stringify({ prompt: 1, completion: 2, request: 0.0001 })));
});
for (const pricing of [
  { prompt: '0.00000055', completion: '0.0000022', request: '0.00000000011' },
  { prompt: '0.0000005500001', completion: '0.0000022000001', request: '0.00000000101' },
]) test(`caps arrondis vers le haut et réserve calculée sur les caps : ${JSON.stringify(pricing)}`, async t => {
  const s = setup(t, () => { throw new Error('PRIVATE_NETWORK_FAILURE'); });
  s.options.client.models = async () => Object.values(s.options.models).map(id => ({ id, pricing }));
  const run = await runModelTrial(s.options);
  assert.equal(run.issue, 'essai_plafond'); assert.ok(s.calls.length > 0);
  const caps = s.calls[0].provider.max_price;
  assert.deepEqual(caps, pricing.prompt === '0.00000055'
    ? { prompt: 0.55, completion: 2.2, request: 0.000000001 }
    : { prompt: 0.550001, completion: 2.200001, request: 0.000000002 });
  for (const key of ['prompt', 'completion', 'request']) {
    const converted = Number(pricing[key]) * (key === 'request' ? 1 : 1e6);
    assert.ok(caps[key] >= converted, key);
    assert.ok(caps[key] - converted < (key === 'request' ? 1e-9 : 1e-6), key);
  }
  const reserve = caps.prompt / 1e6 * 4096 + caps.completion / 1e6 * 3000 + caps.request;
  assert.ok(Math.abs(run.cout - s.calls.length * reserve) < 1e-12);
  assert.equal(run.cout_reserves_sans_reponse, run.cout);
  assert.ok(run.cout <= 0.1); assert.ok(run.cout + reserve > 0.1);
  assert.ok(run.appels.every(call => call.cout === null));
});
