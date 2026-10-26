# Handoff : la référence SNCF s'écrit « SNCF », sans « avec Arkel »

Date : 26/10/2026. Base : origin/main `3c8a3e2` (page unique, #337). Rédigée par Claude, implémentée par Codex (§25).
Niveau de risque : faible (texte visible et un test).

## Décision de Paul (26/10/2026, soir)

« Oublie le "avec Arkel". Écris SNCF. » La référence SNCF ne mentionne plus Arkel, en français comme en anglais.

## Changements, et rien d'autre

1. `src/system/components/SinglePage.tsx`, ligne de la référence SNCF :
   `Un programme de formation, réalisé avec Arkel.` devient `Un programme de formation.`
2. `src/system/single-page-copy.ts` : la clé de traduction suit le nouveau texte français ;
   anglais : `A training program.` (supprimer l'ancienne entrée « réalisé avec Arkel »).
3. `src/lib/registry/preuves.ts`, entrée `publication("SNCF", …)` : libellé
   `Un programme de formation réalisé avec Arkel` devient `Un programme de formation`. Le statut
   (`"via partenaire"`) et les autres champs ne changent pas.
4. `tests/single-page.test.mjs` : la ligne `assert.match(text, /Arkel/);` exprime désormais la nouvelle règle :
   `assert.doesNotMatch(text, /Arkel/);` (Arkel n'apparaît plus sur la page). Les autres assertions restent.

Aucun autre mot visible ne change. Ne pas toucher au style, à la structure, aux autres clients.

## Vérifications

`npm ci --silent && npm run lint && npm test && npm run build`

## Compte rendu attendu

Fichiers modifiés, résultat de la batterie. Ne pas embarquer de fichier de spec copié dans `tmp/`.
