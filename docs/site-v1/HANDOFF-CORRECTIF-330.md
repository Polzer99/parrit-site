# Correctif de la PR #330 (26/10/2026, nuit)

La suite complète rejouée par Claude sur l'hôte (Chromium) donne 420 réussis, 14 échecs. Ce correctif les traite. Aucun autre changement.

## 1. Vrai défaut : taille hors échelle sur /commission

`tests/aeration.spec.ts` (1440 et 390 px) : « 27px: h2 "No slot that works? Leave your e-mail" » (et l'équivalent FR). Le texte qui était une étiquette est devenu un `h2` à 27 px, taille absente de l'échelle fermée. Le ramener à un pas existant de l'échelle (celui des autres titres de bloc de la page), ou le rendre en texte courant `--t-m` gras. Ne pas toucher l'échelle ni le test.

## 2. Test à adapter : références en cartes (`tests/conformity-home.spec.ts`)

Le test exige `#H02 li` avec une bordure de 1 px. Le handoff ergonomie demandait des cartes sans bordure, fond `var(--brand-surf)`. Remplacer cette assertion par l'équivalent structurel du nouveau contrat : chaque `#H02 li` a un fond égal à la valeur calculée de `--brand-surf`, `border-radius: 0px`, aucune ombre, et les cartes forment 2 colonnes à 1440/1024 px et 1 colonne à 375/390 px. Garder toutes les autres assertions du test (références, géométrie, preuves).

## 3. Test à adapter et alignement : titre de l'accueil (`tests/alignment-grid.spec.ts`, 1440 px)

Le test exige un H1 centré sur l'accueil. Le nouveau haut de page met le texte à gauche et la scène produit à droite. Règle retenue (cohérente avec la règle des boutons de Paul) : à 1440 px, le H1 de l'accueil s'aligne sur la grille gauche comme toutes les autres pages (`left`), ses boutons alignés sur le bord gauche du H1. Adapter le test : supprimer le cas particulier de centrage de l'accueil (le H1 de l'accueil doit être à `left`, comme les autres routes). Vérifier que le H1 et les boutons du hero sont effectivement à gauche à 1440 px ; à 375 px, comportement inchangé.

## Critères

Suite complète `npm run qa:network:rev01` verte sur l'hôte (Claude la rejoue) ; `npm run lint`, `npm test`, `npm run build`, `npm run qa:brand:rev01`, `npm run qa:claims:rev01` verts. Rapport : ajouter une section « Correctif » à `docs/site-v1/RAPPORT-ERGONOMIE-IMPACT.md`.

## Branche

Branche dédiée créée depuis le commit `bdf6167` de la PR #330 ; PR vers `main` qui remplace la #330. Pas de fusion par Codex.
