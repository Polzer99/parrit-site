# Journal : retirer les fiches internes affichées dans trois articles

Niveau de risque : faible

Statut : défaut constaté en ligne par Claude le 04/11/2026, à corriger sans attendre. Aucune nouvelle page, aucun texte nouveau.

## Constat

Le rendu des articles ne traite pas les commentaires `{/* … */}` : il les affiche comme un paragraphe, dans le texte visible et dans les données de la page. Lecteurs humains et robots voient donc une fiche interne (« RAIL parrit · MÉTIER … · URGENCE Normale ») en tête de ces articles :

- `content/journal/hook-timeout-lets-tool-call-through.mdx`, ligne 8 ;
- `content/journal/legacy-database-migration-writers-first.mdx`, ligne 8 ;
- `content/journal/what-a-pilot-skips-to-look-finished.mdx`, ligne 8.

## Correction

1. Retirer ces trois blocs, du `{/*` au `*/}` inclus, et rien d'autre dans ces fichiers. Le reste du texte ne change pas.
2. Ajouter à la porte de publication du Journal, celle couverte par `tests/publish-journal-gates.test.mjs`, un refus de tout article qui contient `{/*`, `*/}`, `FICHE D'ENTRÉE` ou une ligne commençant par `RAIL parrit`.
3. Ne pas modifier le moteur de rendu des articles : le contrôle suffit, et le texte des articles reste du texte simple.

## Banc

- Aucun fichier de `content/journal/` ne contient ces marques.
- La porte refuse un article de test avec chacune des quatre marques, et accepte un article sans elles.
- Le corps rendu des trois articles commence par leur vrai premier paragraphe, sans la fiche.

## Vérification

`npm run lint`, build Webpack, `npm test`. Le navigateur est refusé par le bac à sable : Claude rejoue les 410 tests sur l'hôte, ne rien revendiquer de réel. Après fusion, Claude contrôle les trois pages en ligne.

## Bornes

Une relecture de PR et une correction au plus.
