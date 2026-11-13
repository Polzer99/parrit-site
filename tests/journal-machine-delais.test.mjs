import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { EventEmitter } from 'node:events';
import { spawnSync } from 'node:child_process';
import { withinDeadline } from '../scripts/journal-machine-io.mjs';
import { completeWithRetry, openRouterClient, main, atomicJSON } from '../scripts/journal-machine.mjs';
import { fetchSource } from '../scripts/journal-machine-gates.mjs';
import { verifiedMaterial } from '../scripts/journal-machine-research.mjs';

const deny = () => { throw new Error('Network forbidden'); };
mock.method(globalThis, 'fetch', deny);
for (const transport of [http, https]) for (const method of ['get', 'request']) mock.method(transport, method, deny);
mock.method(net.Socket.prototype, 'connect', deny);
const timeout = () => new DOMException('The operation was aborted due to timeout', 'TimeoutError');
const options = { resolve: async () => [{ address: '1.1.1.1' }], today: '2026-11-12' };
const sources = Array.from({ length: 5 }, (_, i) => ({ url: `https://insee.fr/report-${i}`, kind: 'study' }));
const page = i => `<meta name="date" content="2026-08-01"><p>${20 + i} % des dossiers sont repris.</p><p>${100 + i} salariés participent.</p>`;

for (const failure of ['timeout', 'network', 'size', 'length']) test(`source ${failure} écartée, les lots suivants restent traités`, async () => {
  const diagnostics = { sources_ecartees: [], sources_acceptees: [] }, visited = [];
  const accepted = await verifiedMaterial(sources, { ...options, fetchImpl: async url => {
    const i = Number(url.split('-').at(-1)); visited.push(i);
    if (i) return new Response(page(i));
    if (failure === 'size') return new Response('x'.repeat(5_000_001));
    if (failure === 'length') return new Response('', { headers: { 'content-length': '5000001' } });
    return new Response(new ReadableStream({ pull(controller) {
      controller.error(failure === 'timeout' ? timeout() : Object.assign(new Error('private details'), { cause: { code: 'ECONNRESET' } }));
    } }));
  } }, diagnostics);
  assert.equal(accepted.length, 4);
  assert.deepEqual(visited.sort(), [0, 1, 2, 3, 4]);
  assert.equal(diagnostics.sources_ecartees[0].motif, { timeout: 'delai_depasse', network: 'reseau_ECONNRESET', size: 'trop_lourde', length: 'trop_lourde' }[failure]);
});

for (const timedOut of [false, true]) test(`pdftotext échoue, timeout=${timedOut} : diagnostic et nettoyage`, async () => {
  const diagnostics = { sources_ecartees: [] }, files = [], commands = [];
  const accepted = await verifiedMaterial(sources, { ...options,
    fetchImpl: async url => url.endsWith('-0') ? new Response('%PDF-fixture') : new Response(page(Number(url.split('-').at(-1)))),
    executePDF: async (command, args, config) => {
      commands.push(command); files.push(args.find(arg => arg.endsWith('.pdf')));
      assert.ok(config.signal instanceof AbortSignal);
      if (command === 'pdfinfo') return { stdout: 'CreationDate: D:20260801000000' };
      throw timedOut ? Object.assign(new Error('aborted'), { name: 'AbortError', cause: timeout() }) : Object.assign(new Error('PDF private output'), { code: 1 });
    },
  }, diagnostics);
  assert.equal(accepted.length, 4);
  assert.deepEqual(commands, ['pdfinfo', 'pdftotext']);
  assert.ok(files.every(file => !existsSync(file)));
  assert.equal(diagnostics.sources_ecartees[0].motif, timedOut ? 'delai_depasse' : 'reseau_1');
});

test('cache de sources consommées : aucun Response.clone ni seconde lecture réseau', async () => {
  let fetched = 0;
  const sourceCache = new Map();
  const opts = { ...options, details: true, sourceCache, fetchImpl: async () => {
    fetched++;
    const response = new Response(page(1));
    response.clone = () => { throw new Error('clone interdit'); };
    return response;
  } };
  const first = await fetchSource(sources[0].url, opts);
  assert.deepEqual(await fetchSource(sources[0].url, opts), first);
  assert.equal(fetched, 1);
});

test('une annulation du corps en erreur ne masque pas la limite de taille', async () => {
  await assert.rejects(fetchSource(sources[0].url, { ...options, fetchImpl: async () => ({
    status: 200, headers: new Headers({ 'content-length': '5000001' }), body: { cancel: async () => { throw timeout(); } },
  }) }), error => error.code === 'SOURCE_TOO_LARGE');
});

test('délai déjà expiré : aucune opération lancée ; rejet tardif observé', async () => {
  const controller = new AbortController(); controller.abort(timeout());
  let invoked = false;
  await assert.rejects(withinDeadline(() => { invoked = true; return Promise.reject(timeout()); }, controller.signal), /timeout/);
  assert.equal(invoked, false);
  const active = new AbortController();
  let rejectLate;
  const pending = withinDeadline(() => new Promise((resolve, reject) => { rejectLate = reject; active.abort(timeout()); }), active.signal);
  await assert.rejects(pending, /timeout/);
  rejectLate(timeout());
  await new Promise(resolve => setImmediate(resolve));
});

for (const [role, milliseconds] of [['research', 90000], ['writing', 180000], ['judge', 60000]]) {
  test(`OpenRouter ${role} : délai explicite ${milliseconds}, corps expiré puis succès`, async t => {
    const delays = [], waits = [], signals = [];
    const original = AbortSignal.timeout;
    t.mock.method(AbortSignal, 'timeout', ms => { delays.push(ms); return original(ms); });
    let calls = 0;
    const client = openRouterClient({ apiKey: 'fixture', fetchImpl: async (_url, init) => {
      signals.push(init.signal); calls++;
      return { ok: true, json: async () => { if (calls === 1) throw timeout(); return { usage: { cost: 0.01 } }; } };
    } });
    assert.deepEqual(await completeWithRetry(client, {}, role, { sleep: async ms => waits.push(ms) }), { usage: { cost: 0.01 } });
    assert.equal(calls, 2); assert.deepEqual(waits, [5000]); assert.deepEqual(delays, [milliseconds, milliseconds]);
    assert.notEqual(signals[0], signals[1]);
  });
}

for (const status of [429, 500, 503, 599, 401, 400]) test(`OpenRouter HTTP ${status} : nombre strict de tentatives même sans corps JSON`, async () => {
  let calls = 0; const waits = [];
  const client = openRouterClient({ apiKey: 'fixture', fetchImpl: async () => {
    calls++; return { ok: false, status, json: async () => { throw new Error('invalid private body'); } };
  } });
  await assert.rejects(completeWithRetry(client, {}, 'research', { sleep: async ms => waits.push(ms) }), new RegExp(`^Error: openrouter_recherche_${status}$`));
  assert.equal(calls, [400, 401].includes(status) ? 1 : 2);
  assert.deepEqual(waits, [400, 401].includes(status) ? [] : [5000]);
});

test('OpenRouter : deux délais, aucun troisième appel', async () => {
  let calls = 0;
  await assert.rejects(completeWithRetry({ complete: async () => { calls++; throw timeout(); } }, {}, 'research', { sleep: async () => {} }), /^Error: openrouter_recherche_delai$/);
  assert.equal(calls, 2);
});

function crashSetup(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'journal-crash-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  atomicJSON(path.join(root, 'content/plan/sujets.json'), []);
  const processImpl = new EventEmitter(), events = [], errors = [];
  processImpl.exit = code => events.push(['exit', code]);
  const runtime = { persistState: async () => events.push(['persist']) };
  return { root, processImpl, events, errors, runtime,
    logs: () => readFileSync(path.join(root, 'content/plan/journal-runs.jsonl'), 'utf8').trim().split('\n').map(JSON.parse),
    args: { options: { root, runtime }, processImpl, output: () => {}, reportError: text => errors.push(text) },
  };
}

test('exception arbitraire de runMachine : crash borné sans secret et état sauvegardé', async t => {
  const s = crashSetup(t);
  const result = await main({ ...s.args, execute: async ({ context }) => {
    context.stateRestored = true; context.run = { sujet: 'premier-outil-ia' }; context.etape = 'sources';
    throw new Error(`panne token=fixture-secret https://private.test/token ${'x'.repeat(500)}`);
  } });
  assert.equal(result.issue, 'crash'); assert.equal(result.sujet, 'premier-outil-ia'); assert.equal(result.etape, 'sources');
  assert.ok(result.message.length <= 300); assert.ok(!result.message.includes('fixture-secret')); assert.ok(!result.message.includes('private.test'));
  assert.deepEqual(s.logs(), [result]); assert.deepEqual(s.events, [['persist']]); assert.equal(s.processImpl.exitCode, 1);
  assert.equal(s.processImpl.listenerCount('unhandledRejection'), 0);
});

test('rejet non traité : sauvegarde unique avant sortie, même si la machine rejette ensuite', async t => {
  const s = crashSetup(t);
  const result = await main({ ...s.args, execute: async ({ context }) => {
    context.stateRestored = true; context.etape = 'redaction'; context.run = { sujet: 'premier-outil-ia' };
    s.processImpl.emit('unhandledRejection', timeout());
    s.processImpl.emit('unhandledRejection', new Error('second'));
    assert.equal(context.signal.aborted, true);
    throw new Error('unwind');
  } });
  assert.equal(result.issue, 'crash'); assert.equal(s.logs().length, 1);
  assert.equal(s.events.filter(e => e[0] === 'persist').length, 1);
  assert.deepEqual(s.events[0], ['persist']); assert.equal(s.events.at(-1)[0], 'exit');
});

test('crash avant restauration : diagnostic local sans écrasement de branche état', async t => {
  const s = crashSetup(t);
  await main({ ...s.args, execute: async () => { throw new Error('restauration impossible'); } });
  assert.equal(s.logs()[0].issue, 'crash'); assert.deepEqual(s.events, []); assert.equal(s.processImpl.exitCode, 1);
});

test('sauvegarde du crash échouée : une tentative, erreur expurgée, aucune récursion', async t => {
  const s = crashSetup(t);
  s.runtime.persistState = async () => { s.events.push(['persist']); throw new Error('token=private-token panne état'); };
  await main({ ...s.args, execute: async ({ context }) => { context.stateRestored = true; throw new Error('panne'); } });
  assert.equal(s.logs().length, 1); assert.deepEqual(s.events, [['persist']]);
  assert.match(s.errors[0], /panne état/); assert.ok(!s.errors[0].includes('private-token')); assert.equal(s.processImpl.exitCode, 1);
});

test('vrai unhandledRejection Node : écrit le log, sauvegarde puis quitte en code 1', t => {
  const s = crashSetup(t);
  const moduleUrl = new URL('../scripts/journal-machine.mjs', import.meta.url).href;
  const child = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import { main } from ${JSON.stringify(moduleUrl)};
    import { writeFileSync } from 'node:fs';
    globalThis.fetch = () => { throw new Error('Network forbidden'); };
    await main({ options: { root: ${JSON.stringify(s.root)}, runtime: {
      persistState: async () => writeFileSync(${JSON.stringify(path.join(s.root, 'saved'))}, 'saved'),
    } }, execute: async ({ context }) => {
      context.stateRestored = true; context.etape = 'sources'; context.run = { sujet: 'test' };
      Promise.reject(new Error('crash token=fixture-private'));
      await new Promise(() => {});
    } });
  `], { encoding: 'utf8', timeout: 10000 });
  assert.equal(child.status, 1, child.stderr);
  assert.equal(s.logs().length, 1); assert.equal(s.logs()[0].issue, 'crash'); assert.equal(s.logs()[0].etape, 'sources');
  assert.ok(!s.logs()[0].message.includes('fixture-private'));
  assert.ok(existsSync(path.join(s.root, 'saved')));
});
