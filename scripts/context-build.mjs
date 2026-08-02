#!/usr/bin/env node
/**
 * context-build.mjs — génère les trois bundles de contexte Parrit.ai.
 *
 *   node scripts/context-build.mjs                    → régénère les trois bundles
 *   node scripts/context-build.mjs --profile public   → un seul profil
 *   node scripts/context-build.mjs --check            → échoue si un bundle committé diverge
 *   node scripts/context-build.mjs --show [profile]   → affiche le bundle sur stdout
 *
 * Règles appliquées, non négociables :
 *  - une source non suivie par Git n'entre dans aucun bundle ;
 *  - PUBLIC et COMMERCIAL échouent sur un symbole monétaire, un montant en devise
 *    ou une règle tarifaire interne ;
 *  - toute section contenant le marqueur INTERNAL STRICT est retirée de
 *    COMMERCIAL et PUBLIC ;
 *  - aucune ligne portant un statut hypothesis, experimental, client-specific ou
 *    deprecated n'entre dans COMMERCIAL ou PUBLIC ;
 *  - les 14 paires verrouillées doivent être présentes, exactes, dans l'ordre,
 *    avec leur correspondance FR/EN intacte.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const LOCKED = 'positioning-os/10-LOCKED-PUBLIC-COPY.md'

/* ------------------------------------------------------------------ profils */

/** mode `full` = contenu inliné · mode `ref` = référencé, lu à la demande */
const PROFILES = {
  internal: {
    out: '.ai/PARRIT_CONTEXT_INTERNAL.md',
    title: 'Contexte Parrit.ai · profil INTERNAL',
    intro:
      "Contexte complet par défaut pour les agents du dépôt. Contient le positionnement interne, externe et commercial, les phrases verrouillées et l'index canonique.",
    full: [
      'brand/00_SOURCE_OF_TRUTH.md',
      'brand/00A_POSITIONING_INTERNAL.md',
      'brand/00B_POSITIONING_EXTERNAL.md',
      'brand/00C_COMMERCIAL_NARRATIVE.md',
      LOCKED,
    ],
    ref: [
      'positioning-os/02B-DECISION-LOG.md',
      'positioning-os/03-POSITIONING-ONE-PAGER.md',
      'positioning-os/04-OFFER-LADDER.md',
      'positioning-os/05-BRAND-FOUNDATIONS.md',
      'positioning-os/06-STORYTELLING.md',
      'positioning-os/07-COPY-OS.md',
      'positioning-os/08-SITE-MESSAGING-ARCHITECTURE.md',
      'positioning-os/09-PUBLIC-COPY-LIBRARY.md',
      'brand/01_DESIGN_TOKENS.md',
      'brand/02_COMPONENTS.md',
      'brand/03_CONTENT_SYSTEM.md',
      'brand/04_IMAGE_SYSTEM.md',
      'brand/05_HERMES_CONVERSION.md',
      'brand/09_GOVERNANCE.md',
      'AGENTS.md',
    ],
    strict: false,
  },
  commercial: {
    out: '.ai/PARRIT_CONTEXT_COMMERCIAL.md',
    title: 'Contexte Parrit.ai · profil COMMERCIAL',
    intro:
      "Approfondit le positionnement externe grâce à la narration commerciale. Aucun prix, aucun secret opératoire, aucune hypothèse privée.",
    full: ['brand/00B_POSITIONING_EXTERNAL.md', 'brand/00C_COMMERCIAL_NARRATIVE.md', LOCKED],
    ref: ['positioning-os/09-PUBLIC-COPY-LIBRARY.md', 'brand/03_CONTENT_SYSTEM.md'],
    strict: true,
  },
  public: {
    out: '.ai/PARRIT_CONTEXT_PUBLIC.md',
    title: 'Contexte Parrit.ai · profil PUBLIC',
    intro:
      'Uniquement les informations immédiatement publiables : positionnement externe approuvé, phrases verrouillées, ton, CTA, preuves publiables.',
    full: ['brand/00B_POSITIONING_EXTERNAL.md', LOCKED],
    ref: ['brand/01_DESIGN_TOKENS.md', 'brand/03_CONTENT_SYSTEM.md'],
    strict: true,
  },
}

/** Jamais dans aucun bundle. */
const HISTORICAL = [
  'TRUTH.md',
  'MATURITE-SOT.md',
  'BRAND.md',
  'DESIGN-SYSTEM.md',
  'design-source/DA-TOKENS-EXTRACTED.md',
]

/**
 * Empreinte épinglée du fichier de copy verrouillée. Toute modification, même
 * d'un seul caractère, fait échouer la génération : les 14 paires ne se
 * réécrivent pas. Changer cette constante exige une décision explicite de Paul,
 * consignée dans positioning-os/02B-DECISION-LOG.md.
 */
const LOCKED_SHA256 = 'da8d6d65af3c339f4301528cf10b3a4224638f9d85fe44e01e8cb0749ff89190'

const BANNED_STATUSES = ['hypothesis', 'experimental', 'client-specific', 'deprecated']
const STRICT_MARKER = 'INTERNAL STRICT'

/* ------------------------------------------------------------------- outils */

const sh = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim()
const sha256 = (s) => createHash('sha256').update(s, 'utf8').digest('hex').slice(0, 16)
const words = (s) => (s.match(/[A-Za-zÀ-ÿ0-9'’]+/g) || []).length
/** Estimation volontairement grossière et documentée : ~1,55 jeton par mot en français. */
const tokens = (s) => Math.round(words(s) * 1.55)

function trackedFiles() {
  return new Set(sh(['ls-files']).split('\n'))
}

function read(rel) {
  const abs = resolve(ROOT, rel)
  if (!existsSync(abs)) throw new Error(`source absente : ${rel}`)
  return readFileSync(abs, 'utf8')
}

/* ------------------------------------------------------------------ filtres */

/** Retire toute section (## ou ###) dont le corps porte le marqueur INTERNAL STRICT. */
function stripStrictSections(md) {
  const lines = md.split('\n')
  const out = []
  let skip = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^#{2,3} /.test(line)) {
      let body = ''
      for (let j = i + 1; j < lines.length && !/^#{2,3} /.test(lines[j]); j++) body += lines[j] + '\n'
      skip = body.includes(STRICT_MARKER)
    }
    if (!skip) out.push(line)
  }
  return out.join('\n')
}

/** Retire les lignes portant un statut interdit en commercial et public. */
function stripBannedStatuses(md) {
  return md
    .split('\n')
    .filter((l) => !BANNED_STATUSES.some((s) => l.includes('`' + s + '`')))
    .join('\n')
}

/* ----------------------------------------------------------------- contrôles */

const MONEY_RE = /[€$£¥]|\bEUR\b|\bUSD\b|\d[\d   ]*\s?(euros?|EUR|€)/i
const TARIF_RE = /\b(à partir de|hors taxes?|HT\b|TTC\b|par mois|\/mois)\b.{0,30}[€$]|prix\s*:\s*\d/i

function assertNoMoney(profile, md) {
  const bad = []
  md.split('\n').forEach((l, i) => {
    if (MONEY_RE.test(l) || TARIF_RE.test(l)) bad.push(`  ligne ${i + 1} : ${l.trim().slice(0, 110)}`)
  })
  if (bad.length) {
    throw new Error(
      `profil ${profile} : ${bad.length} occurrence(s) monétaire(s) interdite(s)\n${bad.join('\n')}`
    )
  }
}

function assertNoStrict(profile, md) {
  if (md.includes(STRICT_MARKER)) throw new Error(`profil ${profile} : marqueur ${STRICT_MARKER} présent`)
}

/** Extrait les 14 paires FR/EN du fichier verrouillé, dans l'ordre. */
function lockedPairs() {
  const md = read(LOCKED)
  const re = /### (\d+)\. .*?\n\n\*\*FR\*\*\n\n(.+?)\n\n\*\*EN\*\*\n\n(.+?)\n/gs
  const pairs = []
  let m
  while ((m = re.exec(md)) !== null) pairs.push({ n: Number(m[1]), fr: m[2].trim(), en: m[3].trim() })
  return pairs
}

function assertLockedIntegrity(pairs) {
  const actual = createHash('sha256').update(read(LOCKED), 'utf8').digest('hex')
  if (actual !== LOCKED_SHA256) {
    throw new Error(
      `${LOCKED} a été modifié.\n` +
        `  attendu : ${LOCKED_SHA256}\n  obtenu  : ${actual}\n` +
        `  Les 14 paires verrouillées ne se réécrivent pas. Si Paul a tranché une évolution,\n` +
        `  mettre à jour LOCKED_SHA256 dans scripts/context-build.mjs et consigner la décision\n` +
        `  dans positioning-os/02B-DECISION-LOG.md.`
    )
  }
  if (pairs.length !== 14) throw new Error(`paires verrouillées : ${pairs.length} trouvées, 14 attendues`)
  pairs.forEach((p, i) => {
    if (p.n !== i + 1) throw new Error(`paires verrouillées : ordre canonique rompu à l'index ${i + 1}`)
    if (!p.fr || !p.en) throw new Error(`paire ${p.n} : correspondance FR/EN cassée`)
  })
}

function assertLockedInBundle(profile, md, pairs) {
  for (const p of pairs) {
    if (!md.includes(p.fr)) throw new Error(`profil ${profile} : paire ${p.n} FR absente ou reformulée`)
    if (!md.includes(p.en)) throw new Error(`profil ${profile} : paire ${p.n} EN absente ou reformulée`)
  }
  // ordre canonique : vérifié dans le bloc issu du fichier verrouillé, où il fait foi.
  // Ailleurs dans le bundle, 00B en cite librement quelques unes.
  const start = md.indexOf(`<!-- source: ${LOCKED}`)
  const block = start >= 0 ? md.slice(start) : md
  let cursor = -1
  for (const p of pairs) {
    const at = block.indexOf(p.fr)
    if (at < 0) throw new Error(`profil ${profile} : paire ${p.n} absente du bloc verrouillé`)
    if (at < cursor) throw new Error(`profil ${profile} : ordre canonique des paires modifié à la paire ${p.n}`)
    cursor = at
  }
}

/* ------------------------------------------------------------------ montage */

function build(name, tracked) {
  const p = PROFILES[name]
  // SHA du dernier commit ayant touché les sources de ce profil, et non HEAD :
  // graver HEAD invaliderait le bundle au moment même où on le committe.
  const sources = [...p.full, ...p.ref]
  const gitSha = sh(['log', '-1', '--format=%H', '--', ...sources]) || sh(['rev-parse', 'HEAD'])
  const parts = []
  const manifest = []

  for (const rel of [...p.full, ...p.ref]) {
    if (HISTORICAL.includes(rel)) throw new Error(`${rel} est historical, il ne peut pas entrer dans un bundle`)
    if (!tracked.has(rel)) throw new Error(`${rel} n'est pas suivi par Git : génération refusée`)
  }

  parts.push(`# ${p.title}`)
  parts.push('')
  parts.push('> **Fichier généré. Ne jamais l\'éditer à la main.**')
  parts.push('> Régénérer avec `npm run context:build`. Vérifier avec `npm run context:check`.')
  parts.push('')
  parts.push(p.intro)
  parts.push('')
  parts.push(`- Profil : \`${name}\``)
  parts.push(`- SHA Git des sources : \`${gitSha}\``)
  parts.push(`- Sources inlinées : ${p.full.length} · référencées : ${p.ref.length}`)
  if (p.strict) {
    parts.push('- Filtres appliqués : sections `INTERNAL STRICT` retirées, statuts non validés retirés, aucun montant.')
  }
  parts.push('')
  parts.push('---')
  parts.push('')

  let sourceBody = ''
  for (const rel of p.full) {
    let body = read(rel)
    const h = sha256(body)
    manifest.push({ rel, h, mode: 'full' })
    if (p.strict) {
      body = stripStrictSections(body)
      body = stripBannedStatuses(body)
    }
    sourceBody += body + '\n'
    parts.push(`<!-- source: ${rel} sha256:${h} mode:full -->`)
    parts.push('')
    parts.push(body.trim())
    parts.push('')
    parts.push('---')
    parts.push('')
  }

  parts.push('## Sources référencées, à lire à la demande')
  parts.push('')
  parts.push("Ces documents ne sont pas chargés automatiquement. Les ouvrir uniquement quand la question l'exige.")
  parts.push('')
  parts.push('| Source | sha256 |')
  parts.push('|---|---|')
  for (const rel of p.ref) {
    const h = sha256(read(rel))
    manifest.push({ rel, h, mode: 'ref' })
    parts.push(`| \`${rel}\` | \`${h}\` |`)
  }
  parts.push('')
  parts.push('## Exclusions de ce profil')
  parts.push('')
  const excl = []
  excl.push(`Documents \`historical\` : ${HISTORICAL.map((f) => '`' + f + '`').join(' · ')}.`)
  if (p.strict) {
    excl.push('Toute section marquée `INTERNAL STRICT`.')
    excl.push(`Toute ligne portant un statut ${BANNED_STATUSES.map((s) => '`' + s + '`').join(', ')}.`)
    excl.push('Tout prix, montant en devise ou règle tarifaire interne.')
    excl.push('Le prototype commercial gratuit sélectif.')
  }
  if (name === 'public') excl.push('La narration commerciale `00C` et le positionnement interne `00A`.')
  if (name === 'commercial') excl.push('Le positionnement interne `00A`.')
  for (const e of excl) parts.push(`- ${e}`)
  parts.push('')

  let md = parts.join('\n')

  const pairs = lockedPairs()
  assertLockedIntegrity(pairs)
  assertLockedInBundle(name, md, pairs)
  if (p.strict) {
    // le marqueur est cherché dans le contenu issu des sources ; l'en-tête et le
    // pied de page que nous écrivons le nomment légitimement comme règle.
    assertNoStrict(name, sourceBody)
    assertNoMoney(name, md)
  }

  return { md, manifest, out: p.out }
}

/* --------------------------------------------------------------------- main */

const argv = process.argv.slice(2)
const flag = (n) => argv.includes(n)
const val = (n) => {
  const i = argv.indexOf(n)
  return i >= 0 ? argv[i + 1] : null
}

const only = val('--profile')
const names = only ? [only] : Object.keys(PROFILES)
if (only && !PROFILES[only]) {
  console.error(`profil inconnu : ${only}. Attendu : ${Object.keys(PROFILES).join(', ')}`)
  process.exit(1)
}

const tracked = trackedFiles()
let failed = false

try {
  for (const name of names) {
    const { md, out } = build(name, tracked)
    const abs = resolve(ROOT, out)

    if (flag('--show')) {
      process.stdout.write(md)
      continue
    }

    if (flag('--check')) {
      if (!existsSync(abs)) {
        console.error(`✖ ${out} manquant. Lancer \`npm run context:build\`.`)
        failed = true
        continue
      }
      const onDisk = readFileSync(abs, 'utf8')
      // La ligne de SHA est exclue de la comparaison : certaines sources, dont
      // AGENTS.md, sont committées dans le même commit que le bundle, ce qui
      // ferait diverger le fichier au moment même où on l'enregistre. Le contenu,
      // lui, est comparé intégralement, et chaque source porte son sha256.
      const strip = (s) => s.replace(/^- SHA Git des sources : .*$/m, '')
      if (strip(onDisk) !== strip(md)) {
        console.error(`✖ ${out} diverge des sources. Lancer \`npm run context:build\` et committer.`)
        failed = true
        continue
      }
      console.log(`✔ ${out} · ${words(md)} mots · ~${tokens(md)} jetons`)
      continue
    }

    writeFileSync(abs, md, 'utf8')
    console.log(`✔ ${out} · ${words(md)} mots · ~${tokens(md)} jetons`)
  }
} catch (e) {
  console.error(`✖ ${e.message}`)
  process.exit(1)
}

process.exit(failed ? 1 : 0)
