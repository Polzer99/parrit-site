# Hermes

Agent d'**amélioration continue** du site parrit.ai et de la **conversion** (visiteur dirigeant → RDV qualifié avec Paul), par **auto-apprentissage**.

- **Conscient de ce que fait Parrit** : il lit la source de vérité commune [`../TRUTH.md`](../TRUTH.md) à chaque cycle (le même fichier que le site, via `AGENTS.md`).
- **Auto-apprenant** : il garde sa mémoire entre les cycles dans [`PROGRESS.md`](./PROGRESS.md) (ce qui a été testé, ce qui a bougé).
- **Il implémente** : pour la meilleure proposition, il produit une **issue Codex** prête (ping-pong §25). Codex code → PR → Claude relit → **Paul comprend → merge** (les 3 feux). Jamais d'auto-merge en prod.
- **Cadré** : autonomie **L2** déclarée, **human-triggered** (§30), garde-fou tokens, stop condition. Voir [`LOOP.md`](./LOOP.md).

## Lancer un cycle
```bash
# depuis la racine du repo (parrit-site)
node hermes/hermes.mjs                 # observe + propose -> hermes/proposals/<date>.md + tick PROGRESS
node hermes/hermes.mjs --open-issue    # + ouvre l'issue Codex de la proposition #1 (gh)
node hermes/hermes.mjs --max 6         # nb max de propositions
```
Requiert `OPENROUTER_API_KEY` (lu depuis `.env.local`). Optionnel : `POSTHOG_PERSONAL_API_KEY` + `POSTHOG_PROJECT_ID` (active l'observation quantitative du funnel), `HERMES_MODEL`, `HERMES_ASSIGNEE`, `HERMES_MAX_OPEN_ISSUES`.

## Cadence automatique (gatée, armée le 21/06)
Un cron hebdo (`.github/workflows/hermes-weekly.yml`, lundi 07:00 UTC) lance le cycle tout seul : il observe, propose et **ouvre une issue Codex assignée à Paul**. Il **ne merge jamais** (les 3 feux restent humains, §22/§25). Garde-fou anti-pileup : aucune nouvelle issue si ≥ 3 issues `hermes` sont déjà ouvertes.
- Déclencher à la demande : `gh workflow run "Hermes — amelioration continue (gated)" --repo Polzer99/parrit-site`
- Désarmer : `gh workflow disable "Hermes — amelioration continue (gated)" --repo Polzer99/parrit-site`
- Secrets GitHub Actions requis : `OPENROUTER_API_KEY`, `POSTHOG_PERSONAL_API_KEY` (project-id/host en clair dans le workflow).

## Le cycle
1. **Observe** le contenu live des surfaces clés + (si câblé) le funnel PostHog + la mémoire.
2. **Propose** des améliorations *grounded* sur `TRUTH.md`, falsifiables (métrique nommée), ICE-scorées, qui passent LE TAMIS et les 7 règles dures.
3. **Émet** `proposals/<date>.md`, un tick dans `PROGRESS.md`, et le brouillon d'issue Codex de la #1.
4. **Humain** : on choisit, Codex implémente, on merge avec les 3 feux, ça déploie (push `main` → CD Vercel).
5. **Mesure** au cycle suivant (avant→après) → apprend.

## Pourquoi « source de vérité commune »
`TRUTH.md` vit dans le repo du site. Le site (via `AGENTS.md`) et Hermes lisent **le même fichier**. Quand la réalité de Parrit change, on met à jour `TRUTH.md` d'abord (HITL) ; le site et l'agent restent synchronisés par construction.
