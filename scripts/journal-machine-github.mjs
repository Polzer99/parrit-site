/** GitHub side effects for the daily Journal. All I/O is injectable for offline tests. */
import { readFile, writeFile, mkdir, lstat } from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execute = promisify(execFile);
const STATE_BRANCH = 'journal/etat';
const STATE_FILES = ['content/plan/sujets.json', 'content/plan/journal-runs.jsonl'];
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function assertContentDiff(files, tree) {
  if (!files.length || files.length >= 300) throw new Error('Diff absent ou potentiellement tronqué');
  for (const file of files) {
    if (!/^content\/(journal|plan)\/[a-zA-Z0-9/_.-]+$/.test(file.filename) || file.filename.split('/').includes('..')) {
      throw new Error(`Diff hors contenu : ${file.filename}`);
    }
    if (!['added', 'modified'].includes(file.status) || file.previous_filename) throw new Error(`Suppression ou renommage refusé : ${file.filename}`);
    const entry = tree.find((item) => item.path === file.filename);
    if (!entry || entry.type !== 'blob' || entry.mode !== '100644') throw new Error(`Fichier non régulier : ${file.filename}`);
  }
}

function plainText(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ').replace(/&#(x[0-9a-f]+|\d+);/gi, (_, value) => {
      const code = value[0].toLowerCase() === 'x' ? parseInt(value.slice(1), 16) : Number(value);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '';
    }).replace(/&(amp|quot|apos|lt|gt|nbsp|rsquo|lsquo|eacute|egrave|agrave|ecirc|ocirc|ugrave|ccedil);/g, (_, entity) => ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', rsquo: '’', lsquo: '‘', eacute: 'é', egrave: 'è', agrave: 'à', ecirc: 'ê', ocirc: 'ô', ugrave: 'ù', ccedil: 'ç' })[entity])
    .replace(/\s+/g, ' ').trim();
}

export async function provePublication({ slug, title, fetchImpl = fetch, sleep = delay, attempts = 31, clock = Date.now, signal }) {
  const deadline = clock() + 15 * 60 * 1000;
  const remaining = () => Math.max(1, Math.min(15000, deadline - clock()));
  const url = `https://parrit.ai/fr/journal/${slug}`;
  for (let attempt = 0; attempt < attempts && clock() < deadline; attempt++) {
    signal?.throwIfAborted();
    try {
      const page = await fetchImpl(url, { signal: AbortSignal.timeout(remaining()), redirect: 'error' });
      if (page.status === 200 && plainText(await page.text()).includes(plainText(title))) {
        const sitemap = await fetchImpl('https://parrit.ai/sitemap.xml', { signal: AbortSignal.timeout(remaining()), redirect: 'error' });
        if (sitemap.status === 200 && (await sitemap.text()).match(/<loc>[^<]+<\/loc>/g)?.some((loc) => plainText(loc) === url)) return true;
      }
    } catch { /* Network/deployment errors are retried within the bounded proof window. */ }
    if (attempt + 1 < attempts && clock() < deadline) await sleep(Math.min(30000, deadline - clock()));
  }
  return false;
}

export function createGitHubRuntime({ root = process.cwd(), env = process.env, fetchImpl = fetch,
  runCommand = async (command, args) => (await execute(command, args, { cwd: root, maxBuffer: 20 * 1024 * 1024 })).stdout,
  sleep = delay, now = () => new Date() } = {}) {
  const repository = env.GITHUB_REPOSITORY;
  const token = env.GITHUB_TOKEN || env.GH_TOKEN;
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository ?? '') || !token) throw new Error('GITHUB_REPOSITORY et GITHUB_TOKEN requis');
  const armed = env.JOURNAL_AUTOPUBLISH === '1';
  const endpoint = `https://api.github.com/repos/${repository}`;
  let checkedBase;
  let validatedCandidate;
  let restoredStateRef;
  let restoreFailed = false;
  async function api(route, method = 'GET', body, allow404 = false, signal) {
    signal?.throwIfAborted();
    const response = await fetchImpl(endpoint + route, {
      method, headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }), signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(30000)]) : AbortSignal.timeout(30000), redirect: 'error',
    });
    if (allow404 && response.status === 404) return null;
    if (!response.ok) throw new Error(`GitHub ${method} ${route}: ${response.status}`);
    return response.status === 204 ? null : response.json();
  }
  async function list(route) {
    const all = [];
    for (let page = 1; ; page++) {
      const batch = await api(`${route}${route.includes('?') ? '&' : '?'}per_page=100&page=${page}`);
      all.push(...batch);
      if (batch.length < 100) return all;
      if (page >= 100) throw new Error('Pagination GitHub excessive');
    }
  }
  const main = async () => (await api('/git/ref/heads/main')).object.sha;
  async function issueOnce(title, body, signal) {
    const existing = (await list('/issues?state=open')).find((issue) => !issue.pull_request && issue.title === title);
    if (existing) return existing;
    return api('/issues', 'POST', { title, body, assignees: ['Polzer99'] }, false, signal);
  }
  async function pendingTopics() {
    const pulls = await list('/pulls?state=all&base=main');
    return pulls.filter((pull) => pull.state === 'open' || pull.merged_at).flatMap((pull) => [...(pull.body ?? '').matchAll(/<!-- journal-topic:([a-z0-9-]+) -->/g)].map((match) => match[1]));
  }
  async function regularFile(relative) {
    let cursor = root;
    for (const part of relative.split('/')) {
      cursor = path.join(cursor, part);
      const info = await lstat(cursor);
      if (info.isSymbolicLink()) throw new Error(`Lien symbolique refusé : ${relative}`);
    }
    if (!(await lstat(cursor)).isFile()) throw new Error(`Fichier non régulier : ${relative}`);
    return readFile(cursor, 'utf8');
  }
  async function createCommit(base, files, message, snapshot, signal) {
    const baseCommit = await api(`/git/commits/${base}`);
    const tree = [];
    for (const relative of files) tree.push({ path: relative, mode: '100644', type: 'blob', content: snapshot ? snapshot.get(relative) : await regularFile(relative) });
    const created = await api('/git/trees', 'POST', { base_tree: baseCommit.tree.sha, tree }, false, signal);
    return (await api('/git/commits', 'POST', { message, tree: created.sha, parents: [base] }, false, signal)).sha;
  }
  async function openPull(branch, title, body, signal) {
    const existing = (await list('/pulls?state=open&base=main')).find((pull) => pull.head.ref === branch);
    const pull = existing || await api('/pulls', 'POST', { title, body, head: branch, base: 'main' }, false, signal);
    // Creating the label is idempotent; the permissions are deliberately limited to issues.
    if (!await api('/labels/journal', 'GET', undefined, true)) await api('/labels', 'POST', { name: 'journal', color: '0e6655', description: 'Articles et état de la machine Journal' }, false, signal);
    await api(`/issues/${pull.number}/labels`, 'POST', { labels: ['journal'] }, false, signal);
    return pull;
  }
  async function verifyCandidate(base, head, pullNumber) {
    const pull = await api(`/pulls/${pullNumber}`);
    if (pull.head.sha !== head || pull.base.ref !== 'main' || pull.base.repo.full_name !== repository || pull.head.repo.full_name !== repository) throw new Error('Tête ou dépôt de PR modifié');
    if (await main() !== base) throw new Error('main a changé depuis les contrôles');
    const comparison = await api(`/compare/${base}...${head}`);
    if (comparison.status !== 'ahead' || comparison.merge_base_commit.sha !== base || comparison.total_commits !== 1) throw new Error('Historique candidat inattendu');
    const tree = await api(`/git/trees/${head}?recursive=1`);
    if (tree.truncated) throw new Error('Arbre GitHub tronqué');
    assertContentDiff(comparison.files, tree.tree);
    // A final ref check follows every potentially slow read; PUT merge also pins the head SHA.
    // REST merge has no base-SHA compare-and-swap: keep main's up-to-date branch protection
    // enabled and do not grant this token a bypass (a concurrent main push can otherwise race PUT).
    if (await main() !== base || (await api(`/pulls/${pullNumber}`)).head.sha !== head) throw new Error('Base ou tête déplacée avant fusion');
  }
  const candidateFiles = (slug) => [`content/journal/${slug}.mdx`, `content/journal/fr/${slug}.mdx`, 'content/plan/journal-translations.json'];
  async function assertWorkspace(files) {
    const changed = (await runCommand('git', ['diff', '--name-only', 'HEAD'])).trim().split('\n').filter(Boolean);
    const untracked = (await runCommand('git', ['ls-files', '--others', '--exclude-standard'])).trim().split('\n').filter(Boolean);
    const all = [...new Set([...changed, ...untracked])];
    if (all.some((file) => !files.includes(file) && !STATE_FILES.includes(file) && file !== 'public/llms.txt')) throw new Error('Checkout contient des changements hors candidat');
    for (const required of files) if (!all.includes(required)) throw new Error(`Édition ou registre manquant : ${required}`);
  }
  async function validateCandidate({ slug }) {
    validatedCandidate = undefined;
    if (!slugPattern.test(slug)) throw new Error('Slug invalide');
    const files = candidateFiles(slug);
    const base = (await runCommand('git', ['rev-parse', 'HEAD'])).trim();
    await assertWorkspace(files);
    const snapshot = new Map();
    for (const file of files) snapshot.set(file, await regularFile(file));
    await runCommand('node', ['scripts/journal-machine-verify.mjs']);
    await assertWorkspace(files);
    for (const file of files) if (await regularFile(file) !== snapshot.get(file)) throw new Error(`Candidat modifié pendant les contrôles : ${file}`);
    if ((await runCommand('git', ['rev-parse', 'HEAD'])).trim() !== base) throw new Error('Checkout modifié pendant les contrôles');
    validatedCandidate = { slug, base, snapshot };
  }
  async function publish({ topic, slug, title, signal }) {
    signal?.throwIfAborted();
    if (!slugPattern.test(slug) || !slugPattern.test(topic.id)) throw new Error('Slug ou sujet invalide');
    const base = await main();
    const localHead = (await runCommand('git', ['rev-parse', 'HEAD'])).trim();
    if (localHead !== base) throw new Error('Checkout différent de main : nouveaux contrôles nécessaires');
    const files = candidateFiles(slug);
    await assertWorkspace(files);
    let reusable = validatedCandidate?.slug === slug && validatedCandidate.base === base;
    for (const file of files) if (await regularFile(file) !== validatedCandidate?.snapshot.get(file)) reusable = false;
    signal?.throwIfAborted();
    if (!reusable) await validateCandidate({ slug });
    // Commit the already validated snapshot, never a fresh read after the gate.
    const snapshot = validatedCandidate.snapshot;
    await assertWorkspace(files);
    for (const file of files) if (await regularFile(file) !== snapshot.get(file)) throw new Error(`Candidat modifié après les contrôles : ${file}`);
    checkedBase = base;
    const head = await createCommit(base, files, `Journal : ${title}`, snapshot, signal);
    if (await main() !== base) throw new Error('main a changé pendant les contrôles');
    await api('/git/refs', 'POST', { ref: `refs/heads/journal/${slug}`, sha: head }, false, signal);
    const pull = await openPull(`journal/${slug}`, `Journal : ${title}`, `<!-- journal-topic:${topic.id} -->\n\nArticle FR/EN ; portes déterministes, lint, build et tests exécutés dans le même job.\nMode : ${armed ? 'armé par JOURNAL_AUTOPUBLISH=1' : 'désarmé, validation humaine'}.`, signal);
    if (!armed) return 'pr';
    await verifyCandidate(checkedBase, head, pull.number);
    const merged = await api(`/pulls/${pull.number}/merge`, 'PUT', { sha: head, merge_method: 'squash' }, false, signal);
    if (!merged.merged) throw new Error('GitHub a refusé la fusion');
    if (!await provePublication({ slug, title, fetchImpl, sleep, signal })) {
      await issueOnce('Journal : article fusionné mais absent en ligne', `URL : https://parrit.ai/fr/journal/${slug}\nPR #${pull.number}, commit ${merged.sha}. Titre FR et sitemap non prouvés après 15 minutes.`, signal);
      throw new Error(`Preuve de mise en ligne absente : ${slug}`);
    }
    // IndexNow failure must not erase a successful production proof or trigger a duplicate article.
    try {
      const key = env.INDEXNOW_KEY;
      if (!/^[a-zA-Z0-9-]{8,128}$/.test(key ?? '') || (await regularFile(`public/${key}.txt`)).trim() !== key) throw new Error('Clé IndexNow absente ou fichier de vérification incohérent');
      signal?.throwIfAborted();
      const response = await fetchImpl('https://api.indexnow.org/indexnow', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000), redirect: 'error',
        body: JSON.stringify({ host: 'parrit.ai', key, keyLocation: `https://parrit.ai/${key}.txt`, urlList: [`https://parrit.ai/fr/journal/${slug}`, `https://parrit.ai/journal/${slug}`] }),
      });
      if (![200, 202].includes(response.status)) throw new Error(`IndexNow HTTP ${response.status}`);
    } catch (error) { await issueOnce('Journal : IndexNow en échec', `${slug} : ${error.message}`, signal); }
    return 'publie';
  }
  async function stateDate(sha, file) {
    // A code-only commit on main must not invalidate the saved retry counters.
    const commits = await api(`/commits?sha=${encodeURIComponent(sha)}&path=${encodeURIComponent(file)}&per_page=1`);
    if (!commits.length) return 0;
    const date = Date.parse(commits[0]?.commit?.committer?.date);
    if (!Number.isFinite(date)) throw new Error('Date de commit état invalide');
    return date;
  }
  async function restoreState() {
    restoreFailed = true; // A failed restore must never be followed by an overwrite in finally.
    let ref = await api(`/git/ref/heads/${STATE_BRANCH}`, 'GET', undefined, true);
    restoredStateRef = ref?.object.sha ?? null;
    // One-way migration: older deployed runs used this branch. Never write it again.
    if (!ref) ref = await api('/git/ref/heads/journal/etat-machine', 'GET', undefined, true);
    if (!ref) { restoreFailed = false; return; }
    const base = await main();
    const updates = new Map();
    for (const file of STATE_FILES) {
      const newer = await stateDate(ref.object.sha, file) > await stateDate(base, file);
      // Counters are monotonic even when main merely adds another topic later.
      // Only a newer state may supply statuses/reasons or the run log.
      if (!newer && !file.endsWith('sujets.json')) continue;
      const remote = await api(`/contents/${file}?ref=${ref.object.sha}`, 'GET', undefined, true);
      if (!remote || remote.type !== 'file' || remote.encoding !== 'base64' || typeof remote.content !== 'string') throw new Error('État distant invalide');
      const content = Buffer.from(remote.content, 'base64').toString('utf8');
      if (file.endsWith('sujets.json')) {
        const current = JSON.parse(await readFile(path.join(root, file), 'utf8'));
        const saved = JSON.parse(content);
        if (!Array.isArray(saved) || saved.some(entry => !entry || !slugPattern.test(entry.id ?? '') || !['a_faire', 'ecarte', 'publie'].includes(entry.statut) || (entry.essais != null && (!Number.isSafeInteger(entry.essais) || entry.essais < 0))) || new Set(saved.map(entry => entry.id)).size !== saved.length) throw new Error('Sujets distants invalides');
        const byId = new Map(saved.map(entry => [entry.id, entry]));
        for (const entry of current) {
          const state = byId.get(entry.id);
          if (!state || entry.statut === 'publie') continue;
          const currentAttempts = Number.isSafeInteger(entry.essais) ? entry.essais : 0;
          const savedAttempts = Number.isSafeInteger(state.essais) ? state.essais : 0;
          entry.essais = Math.max(currentAttempts, savedAttempts);
          const advances = savedAttempts > currentAttempts;
          const terminal = ['ecarte', 'publie'].includes(state.statut) && savedAttempts >= currentAttempts;
          if (newer && (advances || terminal) && entry.statut === 'a_faire') {
            entry.statut = state.statut;
            for (const field of ['motif', 'slug', 'publie_le']) if (state[field] != null) entry[field] = state[field];
          }
        }
        updates.set(file, JSON.stringify(current, null, 2) + '\n');
      } else {
        let current = '';
        try { current = await readFile(path.join(root, file), 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
        const lines = [...new Set([...current.split('\n'), ...content.split('\n')].filter(Boolean))];
        for (const line of lines) {
          const run = JSON.parse(line);
          if (!run || !Number.isFinite(Date.parse(run.date)) || !['echec', 'pr', 'publie', 'crash'].includes(run.issue)) throw new Error('Journal distant invalide');
        }
        updates.set(file, lines.join('\n') + '\n');
      }
    }
    // Parse and validate both files before changing either local file.
    for (const [file, content] of updates) {
      await mkdir(path.dirname(path.join(root, file)), { recursive: true });
      await writeFile(path.join(root, file), content);
    }
    restoreFailed = false;
  }
  async function persistState() {
    if (restoreFailed) throw new Error('Restauration état échouée : sauvegarde refusée');
    const base = await main();
    const existing = await api(`/git/ref/heads/${STATE_BRANCH}`, 'GET', undefined, true);
    const previous = existing?.object.sha ?? null;
    if (restoredStateRef !== undefined && restoredStateRef !== previous) throw new Error('Branche état déplacée depuis la restauration');
    // State never needs a PR, even in armed mode. Article publication is separate.
    // Parent the previous state commit so GitHub rejects concurrent non-fast-forward writes.
    const head = await createCommit(previous || base, STATE_FILES, `Journal : état du ${now().toISOString().slice(0, 10)}`);
    if (await main() !== base) throw new Error('main déplacé pendant la sauvegarde : état non écrasé');
    if (existing) await api(`/git/refs/heads/${STATE_BRANCH}`, 'PATCH', { sha: head, force: false });
    else await api('/git/refs', 'POST', { ref: `refs/heads/${STATE_BRANCH}`, sha: head });
    restoredStateRef = head;
  }
  async function alertIfStalled() {
    let text = '';
    try { text = await readFile(path.join(root, STATE_FILES[1]), 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    const runs = text.split('\n').filter(Boolean).map((line) => JSON.parse(line));
    const target = armed ? 'publie' : 'pr';
    const cutoff = now().getTime() - 48 * 60 * 60 * 1000;
    if (!runs.some((run) => (run.issue === target || run.issue === 'publie') && Date.parse(run.date) >= cutoff)) {
      await issueOnce('Journal en panne', `Aucune issue ${target} depuis 48 h.\n\nDerniers runs :\n\n\`\`\`json\n${JSON.stringify(runs.slice(-5).map(({ date, sujet, issue, cout, motif, motifs, portes }) => ({ date, sujet, issue, cout, motif, motifs, portes })), null, 2).slice(0, 12000)}\n\`\`\``);
    }
  }
  return { restoreState, pendingTopics, issueOnce, validateCandidate, publish, persistState, alertIfStalled };
}

/** Independent watchdog: usable even when npm ci or the generator failed. */
export async function runWatchdog(runtime = createGitHubRuntime()) {
  await runtime.restoreState();
  await runtime.alertIfStalled();
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length !== 3 || process.argv[2] !== '--watchdog') {
    console.error('Usage: node scripts/journal-machine-github.mjs --watchdog');
    process.exitCode = 1;
  } else {
    runWatchdog().catch((error) => {
      console.error(`Journal watchdog : ${error.message}`);
      process.exitCode = 1;
    });
  }
}
