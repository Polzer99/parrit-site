# Spec — Hermes (amélioration continue site + conversion)
Date : 2026-06-18
Status : implemented (v1)

## Objectif
Un agent, **Hermes**, qui améliore en continu le site parrit.ai et sa **conversion** (visiteur dirigeant → RDV qualifié avec Paul), par **auto-apprentissage**, **conscient de ce que fait Parrit** via une **source de vérité commune** au site et à l'agent, et qui **implémente** les améliorations.
Lien cash : **indirect, court/moyen terme** (le site est le convertisseur des north stars RDV/cash).

## Contexte
- Site = `parrit-site` (Next.js 16, Vercel, 4 langues, PostHog). Déploiement = push `main` → CD.
- Doctrine : `REGLES-DOR` §22 (livraison gatée), §25 (ping-pong Codex), §28 (loop engineering), §30 (chronos autonomes coupés, human-triggered). Skills appliquées : `designing`, `loop-doctor`.
- Contrainte forte §30 : pas de cron autonome ; HITL ; la voix reste à Paul (Codex ne la touche pas).

## Questions résolues (décisions, goal « ne pas gater »)
- **Où vit Hermes ?** → dans le repo `parrit-site` → la source de vérité est *littéralement commune* (même fichier, même repo) et l'implémentation se fait par PR sur le même repo.
- **Source de vérité commune ?** → `TRUTH.md` à la racine, lu par Hermes ET pointé par `AGENTS.md` (cerveau des agents du site).
- **Qui implémente ?** → Codex (issue → PR, §25), Claude relit, Paul merge (3 feux). « utilise codex si nécessaire » (Paul).
- **Autonomie ?** → **L2 déclarée** (propose + draft), human-triggered, jamais d'auto-merge prod.
- **Modèle ?** → OpenRouter, défaut `deepseek` (§7), `HERMES_MODEL` override.

## Alternatives considérées
- **A. Agent qui édite le site directement et pousse** → rejeté : viole §22/§30 (auto-push prod), risque voix.
- **B. Doc de reco hors-repo (Notion/chat)** → rejeté : pas de source de vérité *commune* avec le site, pas d'implémentation.
- **C (choisi). Loop in-repo, source de vérité partagée `TRUTH.md`, implémentation via Codex/PR gatée.** → respecte toute la doctrine, vérité réellement commune, boucle d'apprentissage versionnée.

## Spec
- **Inputs** : `TRUTH.md`, contenu live des surfaces clés (`/fr`, `/fr/sprint`, `/academy`, `/outils/detecteur-bullshit`, `/fondateurs`), `PROGRESS.md`, (optionnel) PostHog Query API, (optionnel) leads.
- **Process** : observe → propose (OpenRouter, grounded, ICE, falsifiable, LE TAMIS + 7 règles dures) → émet `proposals/<date>.md` + tick `PROGRESS.md` + brouillon issue Codex (`--open-issue`).
- **Outputs** : propositions classées ICE ; issue Codex de la #1 ; mémoire mise à jour.
- **Comportement** : human-triggered ; stop si aucune proposition ICE ≥ seuil ; garde-fou tokens.
- **Non-goals** : pas d'auto-merge prod ; pas de changement de voix sans Paul ; pas de cron autonome (§30) ; pas de prix/clients/jargon.
- **Edge cases** : page live en erreur (skip), OpenRouter down (exit 1), pas de clé PostHog (fallback qualitatif).

## Risques + mitigations
- *Propositions hors-voix* → Codex ne merge jamais ; copy = validée par Paul (3ᵉ feu).
- *Boucle qui dérive / spam d'issues* → human-triggered + stop condition + 1 issue/cycle (curée).
- *Évaluateur faible (pas de PostHog)* → déclaré gap LOOP.md #1 ; v1 = audit qualitatif honnête.

## Acceptance criteria (testables)
- [x] `TRUTH.md` existe et est pointé par `AGENTS.md` (source de vérité commune).
- [x] `node hermes/hermes.mjs` tourne, lit `TRUTH.md`, produit des propositions grounded + falsifiables.
- [x] `PROGRESS.md` est mis à jour à chaque cycle (mémoire d'apprentissage).
- [x] Canal d'implémentation prouvé : issue Codex ouverte (#7) avec critères + contraintes §25.
- [x] `LOOP.md` : autonomie L2 déclarée, scorecard, stop condition, garde-fous, backlog.
- [ ] (backlog) PostHog Query API câblée → evaluator quantitatif (LOOP.md #1).
- [ ] (backlog) boucle de mesure avant→après écrite dans PROGRESS (LOOP.md #2).

## Table de livraison
| Lot | Statut | Preuve |
|---|---|---|
| Source de vérité commune | ✅ | `TRUTH.md` + pointeur `AGENTS.md` |
| Boucle observe→propose→émet | ✅ | `hermes/hermes.mjs` (run 2026-06-18, 5 propositions) |
| Mémoire d'apprentissage | ✅ | `hermes/PROGRESS.md` (ticks) |
| Canal d'implémentation Codex | ✅ | issue #7 (proposition #2, CTA mobile) |
| Doctrine loop (LOOP.md) | ✅ | `hermes/LOOP.md` (L2 déclarée) |
| Observabilité conversion (PostHog) | ⏳ backlog | LOOP.md #1 (clé Query API à créer par Paul) |
| Boucle de mesure avant→après | ⏳ backlog | LOOP.md #2 |
| loop_lint (invariants) | ⏳ backlog | LOOP.md #4 |

## Reste à faire (Paul / prochains cycles)
- Créer une **clé PostHog Query API** (`POSTHOG_PERSONAL_API_KEY` + `POSTHOG_PROJECT_ID`) pour l'observation quantitative.
- Valider (ou non) les propositions de **copy/voix** (#1, #3, #4 du cycle) — elles attendent ton œil.
- Décider si on arme un **cycle hebdo gated** (sinon ça reste human-triggered, §30).
