import test, { mock } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, symlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createGitHubRuntime, assertContentDiff, provePublication, runWatchdog } from '../scripts/journal-machine-github.mjs';

import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
const denyNetwork = () => { throw new Error('Network forbidden in tests'); };
mock.method(globalThis, 'fetch', denyNetwork);
for (const transport of [http, https]) for (const method of ['get', 'request']) mock.method(transport, method, denyNetwork);
mock.method(net.Socket.prototype, 'connect', denyNetwork);


const slug = 'audit-ia';
const paths = [`content/journal/${slug}.mdx`, `content/journal/fr/${slug}.mdx`, 'content/plan/journal-translations.json'];
const files = paths.map((filename) => ({ filename, status: 'added' }));
const tree = paths.map((path) => ({ path, type: 'blob', mode: '100644' }));
const reply = (data, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => data, text: async () => typeof data === 'string' ? data : JSON.stringify(data) });

async function harness(t, { armed = false, change = '', overrideFiles = files, overrideTree = tree } = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'journal-github-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'content/journal/fr'), { recursive: true });
  await mkdir(path.join(root, 'content/plan'), { recursive: true });
  await mkdir(path.join(root, 'public'), { recursive: true });
  for (const file of paths) await writeFile(path.join(root, file), 'article');
  await writeFile(path.join(root, 'public/abcdefgh.txt'), 'abcdefgh\n');
  await writeFile(path.join(root, 'content/plan/sujets.json'), JSON.stringify([{ id: slug, statut: 'a_faire', essais: 2 }]));
  await writeFile(path.join(root, 'content/plan/journal-runs.jsonl'), JSON.stringify({ date: '2026-11-09T00:00:00Z', issue: 'echec', motifs: ['source absente'] }) + '\n');
  const requests = [];
  let pullReads = 0;
  let mainReads = 0;
  const pull = { number: 4, body: `<!-- journal-topic:${slug} -->`, state: 'open', head: { sha: 'candidate', ref: `journal/${slug}`, repo: { full_name: 'test/repo' } }, base: { ref: 'main', repo: { full_name: 'test/repo' } } };
  const runCommand = async (command, args) => {
    requests.push({ command, args });
    if (command === 'git') {
      if (args[0] === 'rev-parse') return 'base\n';
      if (args[0] === 'diff') return '';
      if (args[0] === 'ls-files') return paths.join('\n');
    }
    if (command === 'node' && args[0] === 'scripts/journal-machine-verify.mjs') return '';
    throw new Error(`Unexpected command ${command} ${args}`);
  };
  const fetchImpl = async (url, options = {}) => {
    const route = url.replace('https://api.github.com/repos/test/repo', '');
    const method = options.method ?? 'GET';
    const body = options.body ? JSON.parse(options.body) : undefined;
    requests.push({ route, method, body });
    if (route === '/git/ref/heads/main') return reply({ object: { sha: change === 'base' && ++mainReads >= 3 ? 'moved' : 'base' } });
    if (route === '/git/commits/base') return reply({ tree: { sha: 'base-tree' } });
    if (route === '/git/trees' && method === 'POST') return reply({ sha: 'candidate-tree' });
    if (route === '/git/commits' && method === 'POST') return reply({ sha: 'candidate' });
    if (route === '/git/refs' && method === 'POST') return reply({});
    if (route.startsWith('/pulls?state=open')) return reply([]);
    if (route.startsWith('/pulls?state=all')) return reply([pull]);
    if (route === '/pulls' && method === 'POST') return reply(pull);
    if (route === '/labels/journal') return reply({ name: 'journal' });
    if (route === '/issues/4/labels') return reply({});
    if (route === '/pulls/4') {
      pullReads++;
      return reply({ ...pull, head: { ...pull.head, sha: change === 'head' && pullReads >= 2 ? 'moved' : 'candidate' } });
    }
    if (route === '/compare/base...candidate') return reply({ status: 'ahead', merge_base_commit: { sha: 'base' }, total_commits: 1, files: overrideFiles });
    if (route === '/git/trees/candidate?recursive=1') return reply({ tree: overrideTree, truncated: false });
    if (route === '/pulls/4/merge') return reply({ merged: true, sha: 'merged' });
    if (route === `https://parrit.ai/fr/journal/${slug}`) return reply('<h1>L’IA &amp; vous&nbsp;?</h1>');
    if (route === 'https://parrit.ai/sitemap.xml') return reply(`<urlset><url><loc>https://parrit.ai/fr/journal/${slug}</loc></url></urlset>`);
    if (route === 'https://api.indexnow.org/indexnow') return reply('', 202);
    if (route.startsWith('/issues?')) return reply([]);
    if (route === '/issues' && method === 'POST') return reply({ number: 5, ...body });
    if (['/git/ref/heads/journal/etat', '/git/ref/heads/journal/etat-machine'].includes(route)) return reply({}, 404);
    if (route === '/git/refs/heads/main' && method === 'PATCH') return reply({});
    throw new Error(`UNEXPECTED NETWORK: ${method} ${url}`);
  };
  const runtime = createGitHubRuntime({ root, env: { GITHUB_REPOSITORY: 'test/repo', GITHUB_TOKEN: 'test-token', JOURNAL_AUTOPUBLISH: armed ? '1' : '', INDEXNOW_KEY: 'abcdefgh' }, fetchImpl, runCommand, now: () => new Date('2026-11-12T08:00:00Z'), sleep: async () => {} });
  return { runtime, requests, root, fetchImpl, runCommand };
}
const candidate = { topic: { id: slug }, slug, title: 'L’IA & vous ?' };

test('default disarmed creates a journal PR, validates in-job and never merges or writes main', async (t) => {
  const { runtime, requests } = await harness(t);
  assert.equal(await runtime.publish(candidate), 'pr');
  assert.ok(requests.some((call) => call.command === 'node'));
  assert.deepEqual(requests.find((call) => call.route === '/git/trees' && call.method === 'POST').body.tree.map((entry) => entry.path), paths);
  assert.ok(requests.some((call) => call.route === '/issues/4/labels'));
  assert.ok(!requests.some((call) => call.route?.endsWith('/merge') || call.route === '/git/refs/heads/main'));
  assert.deepEqual(await runtime.pendingTopics(), [slug]);
});

test('armed publication pins squash SHA then proves title and sitemap before IndexNow', async (t) => {
  const { runtime, requests } = await harness(t, { armed: true });
  assert.equal(await runtime.publish(candidate), 'publie');
  assert.deepEqual(requests.find((call) => call.route === '/pulls/4/merge').body, { sha: 'candidate', merge_method: 'squash' });
  const ping = requests.findIndex((call) => call.route === 'https://api.indexnow.org/indexnow');
  assert.ok(ping > requests.findIndex((call) => call.route === 'https://parrit.ai/sitemap.xml'));
  assert.equal(requests[ping].body.urlList.length, 2);
});

for (const change of ['base', 'head']) test(`refuses ${change} moved after validation`, async (t) => {
  const { runtime, requests } = await harness(t, { armed: true, change });
  await assert.rejects(runtime.publish(candidate), /chang|déplac|modifié/);
  assert.ok(!requests.some((call) => call.route === '/pulls/4/merge'));
});

for (const [name, badFiles, badTree] of [
  ['code', [{ filename: 'src/app/page.tsx', status: 'modified' }], tree],
  ['rename', [{ ...files[0], status: 'renamed', previous_filename: 'src/app/page.tsx' }], tree],
  ['symlink', files, [{ ...tree[0], mode: '120000' }, tree[1]]],
  ['deletion', [{ ...files[0], status: 'removed' }], tree],
]) test(`refuses a full remote diff containing ${name}`, async (t) => {
  const { runtime, requests } = await harness(t, { armed: true, overrideFiles: badFiles, overrideTree: badTree });
  await assert.rejects(runtime.publish(candidate), /hors contenu|renommage|non régulier/);
  assert.ok(!requests.some((call) => call.route === '/pulls/4/merge'));
});

test('refuses a local symlink before creating an article commit', async (t) => {
  const { runtime, root, requests } = await harness(t);
  await rm(path.join(root, paths[0]));
  await symlink(path.join(root, 'public/abcdefgh.txt'), path.join(root, paths[0]));
  await assert.rejects(runtime.publish(candidate), /symbolique/);
  assert.ok(!requests.some((call) => call.route === '/git/commits' && call.method === 'POST'));
});

test('rejects empty/truncated diffs and path traversal', () => {
  assert.throws(() => assertContentDiff([], []), /tronqué/);
  assert.throws(() => assertContentDiff(Array(300).fill(files[0]), tree), /tronqué/);
  assert.throws(() => assertContentDiff([{ filename: 'content/journal/../../src/app.js', status: 'added' }], tree), /hors contenu/);
});

test('a 200 or a title hidden in scripts does not prove publication', async () => {
  const calls = [];
  assert.equal(await provePublication({ slug, title: candidate.title, attempts: 2, sleep: async () => {}, fetchImpl: async (url) => { calls.push(url); return reply(`<script>${candidate.title}</script><p>Not deployed</p>`); } }), false);
  assert.equal(calls.length, 2);
});

test('requires the exact FR URL in sitemap, not an EN URL or a prefix match', async () => {
  assert.equal(await provePublication({ slug, title: candidate.title, attempts: 1, fetchImpl: async (url) => reply(url.endsWith('sitemap.xml') ? `<loc>https://parrit.ai/fr/journal/${slug}-other</loc>` : '<h1>L’IA &amp; vous ?</h1>') }), false);
});

test('failure counters and JSONL persist on state branch without a PR without main write when disarmed', async (t) => {
  const { runtime, requests } = await harness(t);
  await runtime.persistState();
  const persisted = requests.find((call) => call.route === '/git/trees' && call.method === 'POST').body.tree;
  assert.deepEqual(persisted.map((entry) => entry.path), ['content/plan/sujets.json', 'content/plan/journal-runs.jsonl']);
  assert.equal(JSON.parse(persisted[0].content)[0].essais, 2);
  assert.ok(requests.some((call) => call.body?.ref === 'refs/heads/journal/etat'));
  assert.ok(!requests.some((call) => call.route === '/git/refs/heads/main'));
  assert.ok(!requests.some((call) => call.route === '/pulls' && call.method === 'POST'));
});

test('un arrêt pendant publication bloque les écritures suivantes, sauvegarde état encore autorisée', async t => {
  const h = await harness(t, { armed: true });
  const controller = new AbortController();
  let writesAfterAbort = 0;
  const runtime = createGitHubRuntime({ root: h.root, env: { GITHUB_REPOSITORY: 'test/repo', GITHUB_TOKEN: 'x', JOURNAL_AUTOPUBLISH: '1' }, runCommand: h.runCommand,
    fetchImpl: async (url, options) => {
      if (controller.signal.aborted && options?.signal?.aborted) writesAfterAbort++;
      const result = await h.fetchImpl(url, options);
      if (url.endsWith('/git/trees') && options.method === 'POST') controller.abort(new Error('crash'));
      return result;
    },
  });
  await assert.rejects(runtime.publish({ ...candidate, signal: controller.signal }), /crash/);
  assert.equal(writesAfterAbort, 0);
  assert.ok(!h.requests.some(call => call.route === '/git/commits' || call.route === '/pulls' || call.route?.endsWith('/merge')));
  await runtime.persistState();
  assert.ok(h.requests.some(call => call.body?.ref === 'refs/heads/journal/etat'));
});

test('un diagnostic crash distant se restaure puis se sauvegarde sur journal/etat', async t => {
  const h = await harness(t);
  const crash = { date: '2026-11-12T06:00:00Z', issue: 'crash', sujet: slug, etape: 'sources', message: 'timeout' };
  const runtime = createGitHubRuntime({ root: h.root, env: { GITHUB_REPOSITORY: 'test/repo', GITHUB_TOKEN: 'x' }, fetchImpl: async (url, init) => {
    if (url.endsWith('/git/ref/heads/journal/etat')) return reply({ object: { sha: 'saved' } });
    if (url.includes('/commits?')) return reply([{ commit: { committer: { date: url.includes('sha=saved') ? '2026-11-12T06:00:00Z' : '2026-11-10T06:00:00Z' } } }]);
    if (url.includes('/contents/content/plan/')) return reply({ type: 'file', encoding: 'base64', content: Buffer.from(url.includes('sujets.json') ? JSON.stringify([{ id: slug, statut: 'a_faire', essais: 2 }]) : JSON.stringify(crash) + '\n').toString('base64') });
    if (url.endsWith('/git/commits/saved')) return reply({ tree: { sha: 'saved-tree' } });
    if (url.endsWith('/git/refs/heads/journal/etat')) { assert.equal(init.method, 'PATCH'); return reply({}); }
    return h.fetchImpl(url, init);
  } });
  await runtime.restoreState();
  await runtime.persistState();
  const persisted = h.requests.find(call => call.route === '/git/trees').body.tree;
  const lines = persisted.find(file => file.path.endsWith('.jsonl')).content.trim().split('\n').map(JSON.parse);
  assert.deepEqual(lines.at(-1), crash);
});

test('even armed runs persist state without any main write or state PR', async t => {
  const h = await harness(t, { armed: true });
  await h.runtime.persistState();
  assert.ok(h.requests.some(call => call.body?.ref === 'refs/heads/journal/etat'));
  assert.ok(!h.requests.some(call => call.route === '/git/refs/heads/main' || call.route === '/pulls'));
});

for (const savedDate of ['2026-11-08T00:00:00Z', '2026-11-10T00:00:00Z']) test(`state older or equal preserves counters only: ${savedDate}`, async t => {
  const h = await harness(t);
  let contents = 0;
  const runtime = createGitHubRuntime({ root: h.root, env: { GITHUB_REPOSITORY: 'test/repo', GITHUB_TOKEN: 'x' }, fetchImpl: async url => {
    if (url.includes('/git/ref/heads/')) return reply({ object: { sha: url.endsWith('/main') ? 'base' : 'saved' } });
    if (url.includes('/commits?')) return reply([{ commit: { committer: { date: url.includes('sha=saved') ? savedDate : '2026-11-10T00:00:00Z' } } }]);
    if (url.includes('/contents/content/plan/sujets.json')) {
      contents++;
      return reply({ type: 'file', encoding: 'base64', content: Buffer.from(JSON.stringify([{ id: slug, statut: 'ecarte', essais: 3, motif: 'old reason' }])).toString('base64') });
    }
    throw new Error(`Unexpected request: ${url}`);
  } });
  await runtime.restoreState();
  assert.equal(contents, 1);
  const { readFile } = await import('node:fs/promises');
  const topics = JSON.parse(await readFile(path.join(h.root, 'content/plan/sujets.json'), 'utf8'));
  assert.equal(topics[0].essais, 3);
  assert.equal(topics[0].statut, 'a_faire');
  assert.equal(topics[0].motif, undefined);
});

test('existing state branch advances without force and a concurrent update refuses the write', async t => {
  const h = await harness(t);
  const requests = [];
  const runtime = createGitHubRuntime({ root: h.root, env: { GITHUB_REPOSITORY: 'test/repo', GITHUB_TOKEN: 'x' }, fetchImpl: async (url, options) => {
    const body = options.body ? JSON.parse(options.body) : undefined;
    requests.push({ url, body });
    if (url.endsWith('/git/ref/heads/journal/etat')) return reply({ object: { sha: 'saved' } });
    if (url.endsWith('/git/commits/saved')) return reply({ tree: { sha: 'saved-tree' } });
    if (url.endsWith('/git/refs/heads/journal/etat')) return reply({}, 422);
    return h.fetchImpl(url, options);
  } });
  await assert.rejects(runtime.persistState(), /422/);
  assert.deepEqual(requests.find(c => c.url.endsWith('/git/commits') && c.body).body.parents, ['saved']);
  assert.deepEqual(requests.find(c => c.url.endsWith('/git/refs/heads/journal/etat')).body, { sha: 'candidate', force: false });
  assert.ok(!h.requests.some(call => call.route === '/pulls' || call.route === '/git/refs/heads/main'));
});

test('invalid remote JSONL leaves both local files intact and prevents state overwrite', async t => {
  const h = await harness(t);
  const { readFile } = await import('node:fs/promises');
  const original = await readFile(path.join(h.root, 'content/plan/sujets.json'), 'utf8');
  const runtime = createGitHubRuntime({ root: h.root, env: { GITHUB_REPOSITORY: 'test/repo', GITHUB_TOKEN: 'x' }, fetchImpl: async (url, options) => {
    assert.equal(options.method, 'GET');
    if (url.includes('/git/ref/heads/')) return reply({ object: { sha: url.endsWith('/main') ? 'base' : 'saved' } });
    if (url.includes('/commits?')) return reply([{ commit: { committer: { date: url.includes('sha=saved') ? '2026-11-12T00:00:00Z' : '2026-11-10T00:00:00Z' } } }]);
    if (url.includes('/contents/')) return reply({ type: 'file', encoding: 'base64', content: Buffer.from(url.includes('sujets.json') ? JSON.stringify([{ id: slug, statut: 'ecarte', essais: 3 }]) : 'invalid json').toString('base64') });
    throw new Error(`Unexpected request: ${url}`);
  } });
  await assert.rejects(runtime.restoreState());
  assert.equal(await readFile(path.join(h.root, 'content/plan/sujets.json'), 'utf8'), original);
  await assert.rejects(runtime.persistState(), /Restauration état échouée/);
});

test('first new run migrates legacy branch counters, then saves only journal/etat without PR', async t => {
  const h = await harness(t);
  const runtime = createGitHubRuntime({ root: h.root, env: { GITHUB_REPOSITORY: 'test/repo', GITHUB_TOKEN: 'x' }, fetchImpl: async (url, options) => {
    if (url.endsWith('/git/ref/heads/journal/etat-machine')) return reply({ object: { sha: 'legacy' } });
    if (url.includes('/commits?')) return reply([{ commit: { committer: { date: url.includes('sha=legacy') ? '2026-11-12T00:00:00Z' : '2026-11-10T00:00:00Z' } } }]);
    if (url.includes('/contents/')) {
      assert.ok(url.endsWith('?ref=legacy'));
      return reply({ type: 'file', encoding: 'base64', content: Buffer.from(url.includes('sujets.json') ? JSON.stringify([{ id: slug, statut: 'ecarte', essais: 3 }]) : '{"date":"2026-11-12","issue":"echec"}\n').toString('base64') });
    }
    return h.fetchImpl(url, options);
  } });
  await runtime.restoreState();
  await runtime.persistState();
  const persisted = h.requests.find(c => c.route === '/git/trees' && c.method === 'POST').body.tree;
  assert.equal(JSON.parse(persisted[0].content)[0].essais, 3);
  assert.ok(h.requests.some(c => c.body?.ref === 'refs/heads/journal/etat'));
  assert.ok(!h.requests.some(c => c.route === '/pulls' || c.body?.ref === 'refs/heads/journal/etat-machine'));
});

test('48h stall issue includes failure reasons and is assigned to Paul', async (t) => {
  const { runtime, requests } = await harness(t);
  await runtime.alertIfStalled();
  const issue = requests.find((call) => call.route === '/issues' && call.method === 'POST').body;
  assert.equal(issue.title, 'Journal en panne');
  assert.deepEqual(issue.assignees, ['Polzer99']);
  assert.match(issue.body, /source absente/);
});

test('recent PR prevents disarmed stall alert; issues are deduplicated', async (t) => {
  const { runtime, root, requests } = await harness(t);
  await writeFile(path.join(root, 'content/plan/journal-runs.jsonl'), JSON.stringify({ date: '2026-11-12T07:00:00Z', issue: 'pr' }) + '\n');
  await runtime.alertIfStalled();
  assert.ok(!requests.some((call) => call.route === '/issues'));
  let posts = 0;
  const dedup = createGitHubRuntime({ env: { GITHUB_REPOSITORY: 'test/repo', GITHUB_TOKEN: 'x' }, fetchImpl: async (url, options) => {
    if (options.method === 'POST') { posts++; throw new Error('Unexpected write'); }
    assert.match(url, /\/issues\?state=open/);
    return reply([{ number: 1, title: 'Journal en panne' }]);
  } });
  assert.equal((await dedup.issueOnce('Journal en panne', 'failure')).number, 1);
  assert.equal(posts, 0);
});

test('publication proof stops at 15 minutes including HTTP latency', async () => {
  let time = 0;
  let calls = 0;
  assert.equal(await provePublication({ slug, title: candidate.title, clock: () => time,
    sleep: async (ms) => { time += ms; },
    fetchImpl: async () => { calls++; time += 15000; return reply('', 503); },
  }), false);
  assert.equal(time, 15 * 60 * 1000);
  assert.equal(calls, 20);
});

test('merged article without production proof opens the specific issue and never pings IndexNow', async (t) => {
  const h = await harness(t, { armed: true });
  const runtime = createGitHubRuntime({ root: h.root, env: { GITHUB_REPOSITORY: 'test/repo', GITHUB_TOKEN: 'x', JOURNAL_AUTOPUBLISH: '1' }, runCommand: h.runCommand, sleep: async () => {},
    fetchImpl: async (url, options) => url.startsWith('https://parrit.ai/') ? reply('', 404) : h.fetchImpl(url, options),
  });
  await assert.rejects(runtime.publish(candidate), /Preuve de mise en ligne absente/);
  assert.ok(h.requests.some((call) => call.body?.title === 'Journal : article fusionné mais absent en ligne'));
  assert.ok(!h.requests.some((call) => call.route === 'https://api.indexnow.org/indexnow'));
});

test('restore persists failed attempts across jobs and retains newly added main topics', async (t) => {
  const h = await harness(t);
  await writeFile(path.join(h.root, 'content/plan/sujets.json'), JSON.stringify([{ id: slug, statut: 'a_faire' }, { id: 'new-topic', statut: 'a_faire' }, { id: 'published-topic', statut: 'publie' }]));
  const saved = JSON.stringify([{ id: slug, statut: 'ecarte', essais: 3, motif: 'source non vérifiée' }, { id: 'published-topic', statut: 'a_faire' }]);
  const runtime = createGitHubRuntime({ root: h.root, env: { GITHUB_REPOSITORY: 'test/repo', GITHUB_TOKEN: 'x' }, fetchImpl: async (url) => {
    if (url.endsWith('/git/ref/heads/journal/etat')) return reply({ object: { sha: 'saved' } });
    if (url.endsWith('/git/ref/heads/main')) return reply({ object: { sha: 'base' } });
    if (url.includes('/commits?')) return reply([{ commit: { committer: { date: url.includes('sha=saved') ? '2026-11-12T06:00:00Z' : '2026-11-10T06:00:00Z' } } }]);
    if (url.includes('/contents/content/plan/')) return reply({ type: 'file', encoding: 'base64', content: Buffer.from(url.includes('sujets.json') ? saved : '{"date":"2026-11-10","issue":"echec"}\n').toString('base64') });
    throw new Error(`UNEXPECTED NETWORK ${url}`);
  } });
  await runtime.restoreState();
  const { readFile } = await import('node:fs/promises');
  const topics = JSON.parse(await readFile(path.join(h.root, 'content/plan/sujets.json'), 'utf8'));
  assert.equal(topics[0].essais, 3);
  assert.equal(topics[0].statut, 'ecarte');
  assert.equal(topics[1].id, 'new-topic');
  assert.equal(topics[2].statut, 'publie');
  const runs = (await readFile(path.join(h.root, 'content/plan/journal-runs.jsonl'), 'utf8')).trim().split('\n');
  assert.equal(runs.length, 2);
});

test('unverified IndexNow key raises an issue but keeps the proved publication outcome', async (t) => {
  const h = await harness(t, { armed: true });
  const runtime = createGitHubRuntime({ root: h.root, env: { GITHUB_REPOSITORY: 'test/repo', GITHUB_TOKEN: 'x', JOURNAL_AUTOPUBLISH: '1', INDEXNOW_KEY: '../../wrong' }, runCommand: h.runCommand, fetchImpl: h.fetchImpl });
  assert.equal(await runtime.publish(candidate), 'publie');
  assert.ok(h.requests.some((call) => call.body?.title === 'Journal : IndexNow en échec'));
  assert.ok(!h.requests.some((call) => call.route === 'https://api.indexnow.org/indexnow'));
});

test('candidate bytes changed during verification cannot be committed', async (t) => {
  const h = await harness(t);
  const runtime = createGitHubRuntime({ root: h.root, env: { GITHUB_REPOSITORY: 'test/repo', GITHUB_TOKEN: 'x' }, fetchImpl: h.fetchImpl,
    runCommand: async (command, args) => {
      const result = await h.runCommand(command, args);
      if (command === 'node') await writeFile(path.join(h.root, paths[0]), 'unvalidated replacement');
      return result;
    },
  });
  await assert.rejects(runtime.publish(candidate), /modifié pendant les contrôles/);
  assert.ok(!h.requests.some((call) => call.route === '/git/commits' && call.method === 'POST'));
});

test('unrelated legacy article changes cannot be included in a new article commit', async (t) => {
  const h = await harness(t);
  const runtime = createGitHubRuntime({ root: h.root, env: { GITHUB_REPOSITORY: 'test/repo', GITHUB_TOKEN: 'x' }, fetchImpl: h.fetchImpl,
    runCommand: async (command, args) => command === 'git' && args[0] === 'diff' ? 'content/journal/old-article.mdx\n' : h.runCommand(command, args),
  });
  await assert.rejects(runtime.publish(candidate), /hors candidat/);
});

test('old state branch cannot reduce main retry counts or replace current failure reasons after arming', async (t) => {
  const h = await harness(t);
  await writeFile(path.join(h.root, 'content/plan/sujets.json'), JSON.stringify([{ id: slug, statut: 'a_faire', essais: 2, motif: 'current failure' }]));
  const saved = JSON.stringify([{ id: slug, statut: 'a_faire', essais: 1, motif: 'stale failure' }]);
  const runtime = createGitHubRuntime({ root: h.root, env: { GITHUB_REPOSITORY: 'test/repo', GITHUB_TOKEN: 'x', JOURNAL_AUTOPUBLISH: '1' }, fetchImpl: async (url) => {
    if (url.endsWith('/git/ref/heads/journal/etat')) return reply({ object: { sha: 'saved' } });
    if (url.endsWith('/git/ref/heads/main')) return reply({ object: { sha: 'base' } });
    if (url.includes('/commits?') && url.includes('journal-runs.jsonl')) return reply([]);
    if (url.includes('/commits?')) return reply([{ commit: { committer: { date: url.includes('sha=saved') ? '2026-11-12T06:00:00Z' : '2026-11-10T06:00:00Z' } } }]);
    if (url.includes('sujets.json')) return reply({ type: 'file', encoding: 'base64', content: Buffer.from(saved).toString('base64') });
    if (url.includes('journal-runs.jsonl')) return reply({}, 404);
    throw new Error(`UNEXPECTED NETWORK ${url}`);
  } });
  await runtime.restoreState();
  const { readFile } = await import('node:fs/promises');
  const current = JSON.parse(await readFile(path.join(h.root, 'content/plan/sujets.json'), 'utf8'))[0];
  assert.equal(current.essais, 2);
  assert.equal(current.motif, 'current failure');
  assert.equal(current.statut, 'a_faire');
});


test('standalone watchdog restores durable runs then checks cadence without publishing or persisting', async () => {
  const calls = [];
  await runWatchdog({
    restoreState: async () => { calls.push('restore'); },
    alertIfStalled: async () => { calls.push('alert'); },
    publish: async () => { throw new Error('Forbidden publish'); },
    persistState: async () => { throw new Error('Forbidden state write'); },
  });
  assert.deepEqual(calls, ['restore', 'alert']);
});

test('workflow watchdog runs always after generator and does not depend on npm modules', async () => {
  const { readFile } = await import('node:fs/promises');
  const workflow = await readFile(new URL('../.github/workflows/journal-quotidien.yml', import.meta.url), 'utf8');
  assert.match(workflow, /if: always\(\)[\s\S]*?run: node scripts\/journal-machine-github\.mjs --watchdog/);
  assert.ok(workflow.indexOf('run: npm ci') < workflow.indexOf('run: node scripts/journal-machine.mjs'));
  assert.ok(workflow.indexOf('run: node scripts/journal-machine.mjs') < workflow.indexOf('--watchdog'));
  const source = await readFile(new URL('../scripts/journal-machine-github.mjs', import.meta.url), 'utf8');
  const imports = [...source.matchAll(/^import .* from '([^']+)';$/gm)].map((match) => match[1]);
  assert.ok(imports.length > 0 && imports.every((specifier) => specifier.startsWith('node:')));
});

test('publish reuses an explicitly validated byte-identical candidate without a second build', async (t) => {
  const h = await harness(t);
  await h.runtime.validateCandidate({ slug });
  assert.equal(await h.runtime.publish(candidate), 'pr');
  assert.equal(h.requests.filter((call) => call.command === 'node').length, 1);
});

test('changing bytes after explicit validation requires a new successful build', async (t) => {
  const h = await harness(t);
  await h.runtime.validateCandidate({ slug });
  await writeFile(path.join(h.root, paths[0]), 'revised article');
  assert.equal(await h.runtime.publish(candidate), 'pr');
  assert.equal(h.requests.filter((call) => call.command === 'node').length, 2);
  const committed = h.requests.find((call) => call.route === '/git/trees' && call.method === 'POST').body.tree;
  assert.equal(committed.find((file) => file.path === paths[0]).content, 'revised article');
});
