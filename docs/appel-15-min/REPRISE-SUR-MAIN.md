# Appel de 15 minutes, lot A : reprise sur `main` à jour

Niveau de risque : élevé (même contenu que le lot A, validé par Paul le 08/11/2026). Aucun changement de fond : on rejoue un travail déjà relu et testé, sur une base à jour.

## Pourquoi

La PR #364 (branche `codex/docs-CODEX-SPEC-2026-11-08-appel-15-min-lot-a-md`) est relue, et ses 426 tests navigateur passent sur l'hôte. Elle est en conflit avec `main` depuis la fusion de #363, seulement sur `AGENTS.md`, `AI_CONTEXT.md` et `TRUTH.md`. Le bac à sable ne permet pas de faire une fusion git : on rejoue donc le diff sur `main`.

## Travail

1. Lire le diff de référence, en lecture seule : `git diff 2796790 4a2a578 -- . ':(exclude).codex-handoffs'`. `4a2a578` est le commit du correctif des tests H1 sur cette branche, déjà poussé sur `origin`. Ne pas prendre le commit `15192d9`.
2. Reproduire ce diff à l'identique dans le dépôt courant, basé sur `main` à jour : code, tests, styles, `package.json` et documents (`docs/CODEX-SPEC-2026-11-08-appel-15-min-lot-a.md`, `docs/appel-15-min/`).
3. Pour `AGENTS.md`, `AI_CONTEXT.md` et `TRUTH.md`, partir de leur version actuelle sur `main` et y ajouter l'apport du lot A :
   - `AGENTS.md` : la section « Appel de 15 minutes, décision de Paul du 08/11/2026 » en tête, telle quelle ;
   - `AI_CONTEXT.md` : le paragraphe du lot A ;
   - `TRUTH.md` : la phrase « La prise de rendez-vous est l'objectif mesuré, par `source`, sans pression ni promesse (décision de Paul du 08/11/2026). » remplace « Le rendez-vous est une suite possible, pas une métrique à maximiser. ».

   Rien d'autre ne change dans ces trois fichiers.
4. Aucun fichier sous `.codex-handoffs/`.

## Vérification

`npm ci`, `npm run lint`, build Webpack, `npm test`, `npm run qa:brand:rev01`. Résultat attendu : `git diff 2796790 4a2a578` et le diff de cette PR coïncident hors des trois fichiers de documentation. Claude rejoue les 426 tests navigateur sur l'hôte.
