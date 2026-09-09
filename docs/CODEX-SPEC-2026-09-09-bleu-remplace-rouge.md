# Le rouge disparaît, le bleu prend l'accent

Date : 2026-09-09. **Décision de Paul, sur le conseil de Bénédicte** : « l'objectif,
c'est de supprimer le rouge ». Pas de le réserver aux états critiques, pas de le
garder en signal : le supprimer.

Ce n'est pas une préférence de goût. Le rouge `#E10600` a été mesuré le même jour
sur ses trois usages réels, et il échoue aux trois :

| usage | ratio | seuil |
|---|---|---|
| texte papier sur fond d'accent (bouton) | 4,43 | 4,5 |
| accent en texte sur carbone | 3,68 | 4,5 |
| accent en texte sur papier | 4,43 | 4,5 |

## La couleur qui remplace, et pourquoi elle est double

Sept bleus ont été mesurés sur les fonds réels du canon. **Tous** passent le
bouton et le papier ; **tous** échouent en texte sur le carbone, entre 1,58 et
3,07. Un bleu assez profond pour porter du texte blanc est trop sombre pour se
lire sur un fond presque noir.

L'accent a donc **deux valeurs qui ne s'échangent jamais** — même doctrine que le
laiton de paul-larmaraud.com :

```css
  --accent:       #0047B3;   /* la profonde : remplissages et texte sur papier */
  --accent-p:     #00368A;   /* état pressé sur papier */
  --accent-clair: #79ACF7;   /* la claire : remplissages, texte, bordure et point sur fond sombre */
  --accent-clair-p: #6399E6; /* état pressé sur fond sombre */
```

Ratios mesurés : papier sur `--accent` **7,34** · `--accent` sur papier **7,34** ·
`--accent-clair` sur carbone **7,89**. Les trois usages passent largement.

## 1. Les tokens

Dans `src/system/tokens.css` :

- **supprimer** `--red` et `--red-p`. Ils ne doivent plus exister, pas même comme
  valeur brute derrière un alias : la décision est de supprimer le rouge.
- définir `--accent`, `--accent-p` et `--accent-clair` avec les trois valeurs
  ci-dessus, en valeurs littérales.
- ajouter au-dessus un commentaire court : l'accent a deux valeurs, la profonde
  vit sur le papier, la claire vit sur le carbone, remplissages inclus ; elles ne
  s'échangent jamais.

## 2. La règle d'emploi, à appliquer en compréhension

Les usages de `var(--accent)` existent déjà (lot précédent). Il faut maintenant
distinguer, **selon le fond effectif de l'élément** :

- une action remplie est toujours l’objet le plus contrasté de son fond :
  sur ink/carbon/carbon2, fond `var(--accent-clair)`, texte `var(--ink)`,
  pressé `var(--accent-clair-p)` ; sur paper/paper2, fond `var(--accent)`,
  texte `var(--paper)`, pressé `var(--accent-p)` ;
- les pastilles et sceaux non interactifs conservent leur règle existante ;
- l'accent en **texte, bordure, contour de focus ou glyphe** sur un fond sombre
  (`--ink`, `--carbon`, `--carbon2`) prend `var(--accent-clair)` ;
- l'accent en **texte ou bordure** sur un fond clair (`--paper`, `--paper2`)
  garde `var(--accent)`.

Écrire la règle en compréhension, pas en énumérant des sélecteurs : remonter le
fond effectif de chaque usage dans `rev01.css` et `system.css`, et choisir. Les
cas connus sur fond sombre incluent au moins `.wordmark i`, `.bootlog .red-line`,
`.agent-esquisse-title`, et les contours de focus de la command bar — vérifie-les
tous plutôt que de te fier à cette liste.

**Renomme aussi ce qui ment** : une classe qui s'appelle `.red-line` alors que
plus rien n'est rouge est un piège pour la prochaine personne. Renomme-la en
`.accent-line` et mets à jour son usage dans le composant.

## 3. Les assets de marque

- `public/brand/favicon.svg` contient `#E10600` : le point passe à `#0047B3`.
- `public/brand/parrit-lockup.svg` est un **orphelin d'une DA enterrée** : il
  porte `#D1132F` et `#0C0C0D`, les couleurs de la génération Smoooth supprimée
  le 14/08. Aucun code ne le référence, seul `BRAND.md` le mentionne. **Le
  supprimer**, et corriger la ligne de `BRAND.md` qui le décrit pour dire qu'il a
  été retiré le 09/09/2026 avec la suppression du rouge.
- Les cinq PNG d'icône (`public/brand/favicon-32|180|192|512.png` et
  `src/app/icon.png`) contiennent le point rouge **en pixels** : 4 à 994 pixels
  de `#e10600` selon la taille. **Ne les touche pas** : Claude les régénère
  depuis le SVG corrigé, avec un navigateur que tu n'as pas.

## 4. Mécaniser « plus jamais de rouge »

Dans `scripts/brand-conformity-check.mjs`, ajouter un contrôle : **aucune valeur
rougeâtre** ne doit apparaître dans `src/`, ni dans les SVG de `public/`. Un
hexadécimal est rougeâtre quand sa composante rouge dépasse 90 et vaut au moins
1,8 fois chacune des deux autres. Le message d'échec nomme le fichier, la ligne
et la valeur.

Deux exceptions à déclarer explicitement dans le script, avec leur raison en
commentaire : `src/app/camp-costa-rica/` (seule survivance volontaire de
l'ancienne palette, décision Paul) et `docs/` (archives historiques).

## 5. La documentation qui égare

`AGENTS.md` désigne encore `docs/site-prod-rev01/parrit-command-center-rev03.html`
comme « la LOI » visuelle et liste **Parrit Red `#E10600`** dans la palette, avec
la « red law ». C'est faux depuis aujourd'hui et cela égarera le prochain agent.

Mettre à jour la section palette d'`AGENTS.md` : l'accent est le bleu, en deux
valeurs, la « red law » devient la loi de l'accent avec la même sémantique
(décision requise, action qui s'exécute, état critique, objet sélectionné), et le
prototype REV 03 devient une **référence historique de mise en page**, plus une
autorité de couleur.

## Périmètre

`src/system/tokens.css` · `src/app/(rev01)/rev01.css` · `src/system/system.css` ·
les composants dont une classe est renommée · `public/brand/favicon.svg` ·
`public/brand/parrit-lockup.svg` (suppression) · `scripts/brand-conformity-check.mjs` ·
`AGENTS.md` · `BRAND.md` (une ligne).

**Aucun texte affiché n'est modifié.** Aucune taille n'est modifiée.

## Preuve attendue

1. `npm run qa:brand:rev01` vert, **avec** le nouveau contrôle anti-rouge.
2. `npm run build` vert.
3. `npm run qa:network:rev01` vert.
4. Claude régénérera les PNG, vérifiera aux pixels qu'il ne reste aucun rouge sur
   aucune surface rendue, et regardera le résultat à 1440, 768 et 390.
