# LOOP.md — Hermes (amélioration continue site + conversion)

> Gabarit loop-doctor (RÈGLES-DOR §28). Pipeline = `hermes/`. Source de vérité commune = `../TRUTH.md`.
> **Autonomie DÉCLARÉE — deux étages distincts** (§30) :
> - **`hermes.mjs` (cycle hebdo, cron `hermes-weekly.yml`) : L2.** Observe + propose + **ouvre une issue Codex tout seul, chaque semaine** (lundi 07:00 UTC, assignée à Paul). N'applique **rien** en prod. Garde-fou anti-pileup : pas de nouvelle issue si ≥3 issues `hermes` déjà ouvertes. Désarmer : `gh workflow disable "Hermes — amelioration continue (gated)"`.
> - **skill `site-analysis` (cron local `site-optim`, mardi 09:00) : L3 BORNÉ** (armé par Paul le 2026-07-27). Elle **merge seule** un changement **mineur** vers `main` (= déploie en prod), dans un cadre tranché par `hermes/automerge-gate.mjs` — pas par le LLM. Tout le reste (MAJEUR) reste aux **3 feux** (review APPROVE + CI verte + Paul a COMPRIS), §22/§25. Désarmer : `hermes cron disable c8fe67fec45c`, ou couper net en changeant `RULES.branchPrefix` dans le gate.
>
> **Pourquoi L3 est arrivé.** Entre le 26/06 et le 27/07, Hermes a ouvert des PR correctes, CI vertes — et **aucune n'a été mergée** (20 PR ouvertes au 27/07). Une proposition qui n'atterrit pas n'est pas une amélioration, c'est du bruit (§45). Le goulot n'était pas la qualité des propositions, c'était le geste humain hebdomadaire. L3 borné déplace ce geste : Paul ne merge plus le mineur, il **révoque** s'il n'est pas d'accord.

## Le gate d'auto-merge (`hermes/automerge-gate.mjs`)

Le périmètre du MINEUR est du **code testable**, jamais un jugement de LLM. Une PR est auto-mergeable si et seulement si les 6 règles passent :

| Règle | Seuil | Pourquoi |
|---|---|---|
| Préfixe de branche | `hermes-auto/` | une PR humaine ne peut pas être auto-mergée par accident |
| Fichiers touchés | ≤ 3 | au-delà, ce n'est plus une retouche |
| Lignes changées | ≤ 20 | un diff qu'un humain relit en 30 s |
| Périmètre | `src/components/*.tsx` · `src/app/**/*.tsx`, **modifiés uniquement** | exclut `globals.css`, tokens, `package.json`, `.github/`, `public/` ; création/suppression de fichier = nouvelle page ou suppression de contenu = MAJEUR |
| CI | **toute** verte (lint · qa:doctrine · build · Playwright · contraste) | la CI bloque, la consigne ne bloque pas |
| Cadence | 1 merge / 7 j | un changement à la fois, sinon on ne sait plus lequel a bougé le funnel |

Boucle de mesure fermée : chaque auto-merge est enregistré (`~/.hermes/state/site_automerge.json`, avec le SHA). Le cycle suivant **commence** par comparer le funnel avant/après et revert (`revert-last`, qui repasse par la CI) si ça s'est dégradé.

## Les 2 loops

### Loop runtime (le cycle d'amélioration)
`trigger` (cron hebdo gaté `hermes-weekly.yml` OU `node hermes/hermes.mjs` manuel) → **observe** (site live + PostHog* + leads*) → **propose** (OpenRouter, grounded `TRUTH.md` + doctrine + `PROGRESS.md`) → **émet** (`proposals/<date>.md` + tick `PROGRESS.md` + brouillon issue Codex) → **[humain : merge 3 feux]** → **mesure** l'effet au cycle suivant → **apprend** (`PROGRESS.md`).

### Loop dev (le « Codex dedans », ping-pong §25)
**writer = Codex** (implémente le changement, ouvre la PR) → **checker = Claude + batterie** (`npm run build` + `contrast-audit.py` + revue sécu/voix/règles dures) → **mémoire = thread Issue/PR + PROGRESS** → **stop = 3 feux**. Codex ne touche jamais la voix, les prix, ni le 3ᵉ feu.

## Scorecard (10 briques)
| Brique | État | Preuve |
|---|---|---|
| Automation (trigger) | 🟢 | cron hebdo GATÉ `hermes-weekly.yml` (armé 21/06, §30) + `workflow_dispatch` + run manuel ; n'ouvre qu'une issue, ne merge jamais |
| Worktrees | ⚪ n/a | implémentation déléguée à Codex (PR isolée) |
| Skills | 🟢 | `designing` + `loop-doctor` appliquées ; `qa-playwright`/contrast en gate |
| Connectors | 🟢 | OpenRouter ✓ · GitHub (`gh`) ✓ · **PostHog Query API ✓** (clé perso câblée, project 148153, host eu) · leads Supabase ✗ |
| Sub-agents | 🟢 | Codex = writer ; Claude = checker |
| Mémoire | 🟢 | `PROGRESS.md` versionné + lu à chaque cycle |
| Evaluator-optimizer | 🟢 | writer(Codex)≠checker(Claude+build/contrast) ✓ ; gate de CONVERSION objectif (PostHog) **câblé** : observe pageviews 14j + `form_submitted` 30j |
| Stop condition | 🟢 | `SCORE_THRESHOLD` (aucune proposition ICE≥seuil → stop) + `MAX_PROPOSALS` backstop |
| Autonomy ladder | 🟢 | **L2** pour `hermes.mjs` · **L3 borné** pour la skill `site-analysis` (27/07), périmètre tranché par `automerge-gate.mjs`, pas par le LLM |
| Token guard | 🟢 | `HERMES_MAX_TOKENS` (kill par run) |
| Liveness connecteur (+1 Parrit) | 🟡 | la livraison réelle = PR mergée **+ vérif live** (`curl` page après CD, comme le détecteur) ; à formaliser en check |

## Backlog Codex (gaps → Issues §25)
1. ✅ **Observabilité conversion — FAIT (18/06)** : PostHog Query API câblée (`POSTHOG_PERSONAL_API_KEY` + `POSTHOG_PROJECT_ID=148153` + `POSTHOG_HOST=https://eu.posthog.com` dans `.env.local`, gitignored). Hermes observe pageviews 14j + `form_submitted` 30j. Reste à enrichir : drop-offs / funnel par étape, et tagger `bullshit_detector_lead` distinctement.
2. **Boucle de mesure** : après merge, comparer la métrique avant→après (fenêtre 14j) et l'écrire dans `PROGRESS.md` (fermer la boucle d'apprentissage).
3. **Leads** : lire les issues du pipeline `parrit-lead` (Supabase) pour la qualité réelle des RDV générés.
4. **loop_lint** : adapter `tests/test_loop_invariants.py` (état/stop/token/liveness/PROGRESS/autonomie déclarée) à `hermes/`.
5. **Cron gated** (optionnel, seulement si Paul l'arme) : 1 cycle/semaine qui DRAFTE (jamais merge), notif HITL.

## Stop condition (vérifiable)
Un cycle s'arrête si aucune proposition n'atteint `SCORE_THRESHOLD` (ICE), ou au `MAX_PROPOSALS`. Le « done » d'une amélioration est détenu par **autre chose que Hermes** : `npm run build` + `contrast-audit.py` + (à venir) le mouvement de la métrique PostHog.

\* PostHog **câblé** (#1 fait) : observation = contenu live + pageviews/conversions PostHog + doctrine + mémoire. Reste leads Supabase (#3).
