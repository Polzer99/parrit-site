#!/usr/bin/env node
/**
 * automerge-gate.mjs — la laisse d'Hermès sur parrit.ai
 *
 * Hermès est en L3 BORNÉ : il merge seul un changement MINEUR, jamais un MAJEUR.
 * Ce script décide. Pas le LLM. Un merge n'a lieu que si TOUTES les règles passent.
 *
 * Usage :
 *   node hermes/automerge-gate.mjs check <pr>     # verdict seul, ne touche à rien
 *   node hermes/automerge-gate.mjs merge <pr>     # vérifie puis merge si tout passe
 *   node hermes/automerge-gate.mjs revert-last    # annule le dernier auto-merge
 *   node hermes/automerge-gate.mjs status         # dernier auto-merge + fenêtre de cadence
 *
 * Sortie : code 0 = autorisé/fait, code 1 = refusé (la raison est écrite en clair).
 * Un refus n'est pas une panne : c'est le garde-fou qui fait son travail.
 */

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

const REPO = 'Polzer99/parrit-site'
const STATE = join(homedir(), '.hermes', 'state', 'site_automerge.json')

// ── Les bornes du MINEUR ─────────────────────────────────────────────────────
// Tout ce qui sort de ce cadre est MAJEUR par construction : PR + mail à Paul.
const RULES = {
  branchPrefix: 'hermes-auto/', // Hermès doit nommer sa branche pour demander le merge
  maxFiles: 3,
  maxLines: 20, // lignes ajoutées + supprimées, hors en-têtes de diff
  cadenceDays: 7, // un seul merge autonome par semaine
  // Seuls ces chemins sont touchables en autonomie. Le reste = MAJEUR.
  allow: [/^src\/components\/[^/]+\.tsx$/, /^src\/app\/.+\.tsx$/],
  // Un fichier créé = nouvelle page/section. Un fichier supprimé = suppression de
  // contenu. Un fichier renommé = refonte. Tous MAJEURS : seul « modified » passe.
  // (vocabulaire de l'API GitHub : added|removed|modified|renamed|copied|changed)
  allowedStatus: ['modified'],
}

// ── Plomberie ────────────────────────────────────────────────────────────────
const sh = (cmd, args) =>
  execFileSync(cmd, args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim()

const gh = (args) => sh('gh', args)

const loadState = () => {
  if (!existsSync(STATE)) return { merges: [] }
  try {
    return JSON.parse(readFileSync(STATE, 'utf8'))
  } catch {
    return { merges: [] }
  }
}

const saveState = (state) => {
  mkdirSync(dirname(STATE), { recursive: true })
  writeFileSync(STATE, JSON.stringify(state, null, 2) + '\n')
}

const lastMerge = (state) => state.merges[state.merges.length - 1] ?? null

const daysSince = (iso) => (Date.now() - new Date(iso).getTime()) / 86_400_000

// ── Le verdict ───────────────────────────────────────────────────────────────
function inspect(prNumber) {
  const refusals = []
  const facts = {}

  const pr = JSON.parse(
    gh([
      'pr',
      'view',
      String(prNumber),
      '--repo',
      REPO,
      '--json',
      'number,title,state,isDraft,baseRefName,headRefName,mergeable,mergeStateStatus,files,statusCheckRollup,url',
    ])
  )

  facts.number = pr.number
  facts.title = pr.title
  facts.url = pr.url
  facts.branch = pr.headRefName

  // 1. La PR est ouvrable
  if (pr.state !== 'OPEN') refusals.push(`la PR est ${pr.state}, pas OPEN`)
  if (pr.isDraft) refusals.push('la PR est en draft')
  if (pr.baseRefName !== 'main') refusals.push(`la base est ${pr.baseRefName}, pas main`)

  // 2. La branche demande explicitement l'auto-merge.
  //    Une PR humaine ne porte jamais ce préfixe : elle ne peut pas être mergée ici.
  if (!pr.headRefName.startsWith(RULES.branchPrefix)) {
    refusals.push(
      `la branche « ${pr.headRefName} » ne commence pas par « ${RULES.branchPrefix} » ` +
        '(seules les branches Hermès sont éligibles à l\'auto-merge)'
    )
  }

  // 3. Git est d'accord pour merger
  if (pr.mergeable !== 'MERGEABLE') {
    refusals.push(`git ne peut pas merger (mergeable=${pr.mergeable}, état=${pr.mergeStateStatus})`)
  }

  // 4. La CI est verte — toute la CI, pas « surtout verte »
  const checks = pr.statusCheckRollup ?? []
  const verdicts = checks.map((c) => c.conclusion || c.state || 'PENDING')
  facts.checks = verdicts.reduce((acc, v) => ({ ...acc, [v]: (acc[v] ?? 0) + 1 }), {})
  if (checks.length === 0) refusals.push('aucun check CI trouvé sur la PR')
  const bad = verdicts.filter((v) => !['SUCCESS', 'NEUTRAL', 'SKIPPED'].includes(v))
  if (bad.length > 0) refusals.push(`CI non verte : ${bad.join(', ')}`)

  // 5. Le périmètre : quels fichiers, et comment
  const files = pr.files ?? []
  facts.files = files.map((f) => f.path)
  facts.lines = files.reduce((n, f) => n + (f.additions ?? 0) + (f.deletions ?? 0), 0)

  if (files.length > RULES.maxFiles) {
    refusals.push(`${files.length} fichiers touchés, le plafond mineur est ${RULES.maxFiles}`)
  }
  if (facts.lines > RULES.maxLines) {
    refusals.push(`${facts.lines} lignes changées, le plafond mineur est ${RULES.maxLines}`)
  }

  for (const f of files) {
    if (!RULES.allow.some((re) => re.test(f.path))) {
      refusals.push(`« ${f.path} » est hors du périmètre autonome (MAJEUR)`)
    }
  }

  // Statut par fichier : `gh pr view --json files` ne le donne pas, on passe par l'API.
  try {
    const raw = gh([
      'api',
      `repos/${REPO}/pulls/${prNumber}/files`,
      '--paginate',
      '--jq',
      '.[] | "\\(.status)\\t\\(.filename)"',
    ])
    for (const line of raw.split('\n').filter(Boolean)) {
      const [status, path] = line.split('\t')
      if (!RULES.allowedStatus.includes(status)) {
        refusals.push(`« ${path} » : ${status} de fichier = MAJEUR`)
      }
    }
  } catch (err) {
    refusals.push(`impossible de lire le diff (${err.message.split('\n')[0]})`)
  }

  // 6. La cadence : un merge autonome par semaine, pas plus
  const state = loadState()
  const last = lastMerge(state)
  if (last) {
    const age = daysSince(last.merged_at)
    facts.last_merge = { pr: last.pr, at: last.merged_at, days_ago: Number(age.toFixed(1)) }
    if (age < RULES.cadenceDays) {
      refusals.push(
        `dernier auto-merge il y a ${age.toFixed(1)} j (PR #${last.pr}) ; ` +
          `la cadence autorise 1 merge tous les ${RULES.cadenceDays} j`
      )
    }
  }

  return { allowed: refusals.length === 0, refusals, facts }
}

function report({ allowed, refusals, facts }) {
  console.log(`PR #${facts.number} — ${facts.title}`)
  console.log(`  ${facts.url}`)
  console.log(`  branche : ${facts.branch}`)
  console.log(`  périmètre : ${facts.files.length} fichier(s), ${facts.lines} ligne(s)`)
  for (const f of facts.files) console.log(`    · ${f}`)
  console.log(`  CI : ${JSON.stringify(facts.checks ?? {})}`)
  if (facts.last_merge) {
    console.log(
      `  dernier auto-merge : PR #${facts.last_merge.pr}, il y a ${facts.last_merge.days_ago} j`
    )
  }
  console.log('')
  if (allowed) {
    console.log('VERDICT : MINEUR — auto-merge autorisé.')
  } else {
    console.log('VERDICT : REFUSÉ — ce changement n\'est pas mineur, ou la CI/cadence bloque.')
    for (const r of refusals) console.log(`  ✗ ${r}`)
    console.log('')
    console.log(
      'Suite : laisse la PR ouverte et mail paul.larmaraud@parrit.ai avec le diff et la raison.'
    )
  }
}

function doMerge(prNumber) {
  const verdict = inspect(prNumber)
  report(verdict)
  if (!verdict.allowed) process.exit(1)

  console.log('\nMerge en cours (squash)…')
  gh(['pr', 'merge', String(prNumber), '--repo', REPO, '--squash', '--delete-branch'])

  // On récupère le SHA du merge : c'est ce qui rend le rollback possible.
  const merged = JSON.parse(
    gh(['pr', 'view', String(prNumber), '--repo', REPO, '--json', 'mergeCommit,mergedAt,title,url'])
  )
  const state = loadState()
  state.merges.push({
    pr: prNumber,
    title: merged.title,
    url: merged.url,
    sha: merged.mergeCommit?.oid ?? null,
    merged_at: merged.mergedAt ?? new Date().toISOString(),
    files: verdict.facts.files,
    lines: verdict.facts.lines,
    reverted: false,
  })
  saveState(state)

  console.log(`Mergé. SHA ${merged.mergeCommit?.oid ?? '(inconnu)'} — déploiement Vercel déclenché.`)
  console.log('Rollback si le funnel se dégrade : node hermes/automerge-gate.mjs revert-last')
}

function revertLast() {
  const state = loadState()
  const last = lastMerge(state)
  if (!last) {
    console.log('Aucun auto-merge enregistré : rien à annuler.')
    process.exit(1)
  }
  if (last.reverted) {
    console.log(`Le dernier auto-merge (PR #${last.pr}) est déjà annulé.`)
    process.exit(1)
  }
  if (!last.sha) {
    console.log(`Pas de SHA enregistré pour la PR #${last.pr} : annulation manuelle nécessaire.`)
    process.exit(1)
  }

  console.log(`Annulation de PR #${last.pr} (${last.sha.slice(0, 8)}) — ${last.title}`)
  const branch = `hermes-auto/revert-${last.sha.slice(0, 8)}`
  sh('git', ['checkout', 'main'])
  sh('git', ['pull', 'origin', 'main'])
  sh('git', ['checkout', '-b', branch])
  sh('git', ['revert', '--no-edit', '-m', '1', last.sha])
  sh('git', ['push', '-u', 'origin', branch])

  const url = gh([
    'pr',
    'create',
    '--repo',
    REPO,
    '--base',
    'main',
    '--head',
    branch,
    '--title',
    `revert: annulation de l'auto-merge #${last.pr}`,
    '--body',
    `Rollback automatique de l'auto-merge Hermès #${last.pr} (${last.sha.slice(0, 8)}).\n\n` +
      `Raison : le funnel ne s'est pas amélioré, ou une régression a été constatée.\n` +
      `Fichiers concernés : ${last.files.join(', ')}\n\n` +
      `Le revert repasse par la CI complète avant d'atterrir.`,
  ])

  last.reverted = true
  last.revert_pr = url
  saveState(state)
  console.log(`PR de revert ouverte : ${url}`)
  console.log('Elle repasse par la CI. Merge-la via ce même gate une fois verte.')
}

function status() {
  const state = loadState()
  const last = lastMerge(state)
  console.log(`Auto-merges Hermès enregistrés : ${state.merges.length}`)
  if (!last) {
    console.log('Aucun encore. La fenêtre de cadence est ouverte.')
    return
  }
  const age = daysSince(last.merged_at)
  console.log(`Dernier : PR #${last.pr} — ${last.title}`)
  console.log(`  ${last.url}`)
  console.log(`  il y a ${age.toFixed(1)} j · ${last.lines} lignes · reverté : ${last.reverted}`)
  console.log(
    age >= RULES.cadenceDays
      ? 'Fenêtre de cadence : OUVERTE.'
      : `Fenêtre de cadence : FERMÉE encore ${(RULES.cadenceDays - age).toFixed(1)} j.`
  )
}

// ── Entrée ───────────────────────────────────────────────────────────────────
const [, , cmd, arg] = process.argv

try {
  switch (cmd) {
    case 'check': {
      if (!arg) throw new Error('numéro de PR manquant : check <pr>')
      const verdict = inspect(Number(arg))
      report(verdict)
      process.exit(verdict.allowed ? 0 : 1)
      break
    }
    case 'merge':
      if (!arg) throw new Error('numéro de PR manquant : merge <pr>')
      doMerge(Number(arg))
      break
    case 'revert-last':
      revertLast()
      break
    case 'status':
      status()
      break
    default:
      console.log(readFileSync(new URL(import.meta.url)).toString().split('*/')[0])
      process.exit(1)
  }
} catch (err) {
  console.error(`ERREUR : ${err.message.split('\n')[0]}`)
  process.exit(1)
}
