# LOOP.md — Hermes (amélioration continue site + conversion)

> Gabarit loop-doctor (RÈGLES-DOR §28). Pipeline = `hermes/`. Source de vérité commune = `../TRUTH.md`.
> **Autonomie DÉCLARÉE : L2** — Hermes observe + propose + draft (issue Codex / PR). Il **n'applique rien en prod seul**. Le merge vers `main` (= prod) exige les **3 feux** (review APPROVE + CD/batterie vert + Paul a COMPRIS), §22/§25. **Human-triggered (§30)** : pas de cron autonome tant que Paul ne l'arme pas explicitement.

## Les 2 loops

### Loop runtime (le cycle d'amélioration)
`trigger humain` → **observe** (site live + PostHog* + leads*) → **propose** (OpenRouter, grounded `TRUTH.md` + doctrine + `PROGRESS.md`) → **émet** (`proposals/<date>.md` + tick `PROGRESS.md` + brouillon issue Codex) → **[humain : merge 3 feux]** → **mesure** l'effet au cycle suivant → **apprend** (`PROGRESS.md`).

### Loop dev (le « Codex dedans », ping-pong §25)
**writer = Codex** (implémente le changement, ouvre la PR) → **checker = Claude + batterie** (`npm run build` + `contrast-audit.py` + revue sécu/voix/règles dures) → **mémoire = thread Issue/PR + PROGRESS** → **stop = 3 feux**. Codex ne touche jamais la voix, les prix, ni le 3ᵉ feu.

## Scorecard (10 briques)
| Brique | État | Preuve |
|---|---|---|
| Automation (trigger) | 🟡 partiel | human-triggered voulu (§30) ; cron gated = backlog |
| Worktrees | ⚪ n/a | implémentation déléguée à Codex (PR isolée) |
| Skills | 🟢 | `designing` + `loop-doctor` appliquées ; `qa-playwright`/contrast en gate |
| Connectors | 🟡 | OpenRouter ✓ · GitHub (`gh`) ✓ · **PostHog Query API ✗** (clé perso absente) · leads Supabase ✗ |
| Sub-agents | 🟢 | Codex = writer ; Claude = checker |
| Mémoire | 🟢 | `PROGRESS.md` versionné + lu à chaque cycle |
| Evaluator-optimizer | 🟡 | writer(Codex)≠checker(Claude+build/contrast) ✓ ; gate de CONVERSION objectif (PostHog) = à câbler |
| Stop condition | 🟢 | `SCORE_THRESHOLD` (aucune proposition ICE≥seuil → stop) + `MAX_PROPOSALS` backstop |
| Autonomy ladder | 🟢 | **L2 déclarée** ici + dans chaque sortie ; jamais d'auto-merge prod |
| Token guard | 🟢 | `HERMES_MAX_TOKENS` (kill par run) |
| Liveness connecteur (+1 Parrit) | 🟡 | la livraison réelle = PR mergée **+ vérif live** (`curl` page après CD, comme le détecteur) ; à formaliser en check |

## Backlog Codex (gaps → Issues §25)
1. **Observabilité conversion** : câbler la **PostHog Query API** (clé perso `POSTHOG_PERSONAL_API_KEY` + `POSTHOG_PROJECT_ID`) → funnel réel (pageviews, `form_submitted`, `bullshit_detector_lead`, drop-offs). Sans ça l'evaluator est qualitatif. _(Paul : créer la clé perso PostHog.)_
2. **Boucle de mesure** : après merge, comparer la métrique avant→après (fenêtre 14j) et l'écrire dans `PROGRESS.md` (fermer la boucle d'apprentissage).
3. **Leads** : lire les issues du pipeline `parrit-lead` (Supabase) pour la qualité réelle des RDV générés.
4. **loop_lint** : adapter `tests/test_loop_invariants.py` (état/stop/token/liveness/PROGRESS/autonomie déclarée) à `hermes/`.
5. **Cron gated** (optionnel, seulement si Paul l'arme) : 1 cycle/semaine qui DRAFTE (jamais merge), notif HITL.

## Stop condition (vérifiable)
Un cycle s'arrête si aucune proposition n'atteint `SCORE_THRESHOLD` (ICE), ou au `MAX_PROPOSALS`. Le « done » d'une amélioration est détenu par **autre chose que Hermes** : `npm run build` + `contrast-audit.py` + (à venir) le mouvement de la métrique PostHog.

\* PostHog/leads = câblage backlog (#1/#3). Aujourd'hui l'observation est l'audit qualitatif du contenu live + la doctrine + la mémoire.
