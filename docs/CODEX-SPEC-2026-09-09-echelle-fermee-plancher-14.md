# Échelle typographique fermée, plancher 14 px, accent échangeable

Date : 2026-09-09. Arbitrage de Paul : **plancher 14 px partout, sans exception**
(« ce qui ne mérite pas 14 px ne mérite pas d'être sur la page »). Règles 5 et 6
de `docs/EXIGENCE-SITE-PARRIT.md`.

## Ce qui est mesuré, pas supposé

Audit du 09/09 sur la production, quinze pages, largeur 1440 :

- **25 crans de taille distincts** sur l'ensemble du site : 9, 10, 10.5, 11, 12,
  13, 13.5, 14, 14.5, 16, 16.5, 17, 19, 21, 22, 24, 25, 44, 46, 52, 54, 66, 68,
  84, 92 px.
- **551 textes rendus sous 14 px**, dont 30 à 9 px et 358 à 10 px.
- La cause : `src/system/tokens.css` **ne contient aucun token de taille**. Les
  102 déclarations `font-size` de `src/app/(rev01)/rev01.css` sont écrites en
  dur, dont **neuf formules `clamp()` différentes** qui produisent les
  demi-pixels (13,5 · 14,5 · 16,5 · 10,5).

## 1. L'échelle, dans les tokens, et nulle part ailleurs

Ajouter à `src/system/tokens.css` une section « PC-03b · échelle typographique »,
**neuf pas, pas un de plus** :

```css
  /* pas fixes */
  --t-k:  14px;   /* registre mono : kickers, statuts, horloge, registry line */
  --t-s:  16px;   /* petit corps, légendes, cellules de tableau */
  --t-m:  18px;   /* corps courant */
  --t-l:  22px;   /* chapô, titre de carte */
  --t-xl: 26px;   /* titre de section mineur */

  /* pas fluides, chacun défini UNE fois */
  --d-s:  clamp(30px, 4vw, 44px);
  --d-m:  clamp(34px, 5vw, 54px);
  --d-l:  clamp(38px, 6.4vw, 68px);
  --d-xl: clamp(40px, 6.8vw, 84px);
```

Puis remplacer **les 102 déclarations** de `rev01.css` par ces tokens. La
correspondance se fait par la valeur MAXIMALE de l'ancienne déclaration :

| ancien | nouveau |
|---|---|
| 9, 10, 10.5, 11, 12, 13 px | `--t-k` |
| 13.5, 14, 14.5 px | `--t-s` |
| 16, 16.5, 17 px | `--t-m` |
| 19, 21, 22 px | `--t-l` |
| 24, 25 px | `--t-xl` |
| clamp(…, 44px) · clamp(…, 46px) | `--d-s` |
| clamp(…, 52px) · clamp(…, 54px) | `--d-m` |
| clamp(…, 66px) · clamp(…, 68px) | `--d-l` |
| clamp(…, 84px) · clamp(…, 88px) · clamp(…, 92px) | `--d-xl` |

`font-size: inherit` reste tel quel.

**Deux points de vigilance à traiter, pas à ignorer :**

1. Le H1 de la home doit continuer à mesurer entre 82 et 86 px à 1440 :
   `tests/conformity-home.spec.ts` le vérifie. `--d-xl` vaut 84 px à cette
   largeur, la contrainte est tenue — vérifie-le plutôt que de me croire.
2. Une déclaration a une pente très raide, `clamp(43px, 12vw, 68px)` : sur
   mobile elle rend beaucoup plus gros que `--d-l`. Si tu juges que la ramener à
   `--d-l` abîme le rendu en petit écran, **dis-le dans ton message final** au
   lieu d'inventer un dixième pas. C'est un arbitrage, pas un détail.

## 2. Le plancher de 14 px

Après le remplacement, **aucune règle** ne doit produire un texte sous 14 px.
Cela vaut aussi dans les media queries : si une règle mobile réduit une taille
sous le plancher, elle passe à `--t-k`. Vérifier l'ensemble du fichier, pas
seulement les déclarations de premier niveau.

Le registre mono passe donc de 10 à 14 px. C'est un changement d'allure voulu et
assumé par Paul. **Conséquence à traiter** : les libellés mono sont posés en
majuscules avec `letter-spacing` généreux ; à 14 px ils deviennent nettement plus
larges. Là où un libellé ne tient plus dans son conteneur (la command bar en
premier lieu), **réduire le `letter-spacing`, jamais la taille**. Si un libellé
ne tient toujours pas, le signaler dans le message final : la doctrine dit qu'on
coupe le contenu, et couper du contenu n'est pas ton périmètre.

## 3. L'accent devient échangeable en une ligne

Paul prépare un remplacement global de la couleur d'accent. Aujourd'hui,
`var(--red)` est écrit 21 fois dans `rev01.css`.

Dans `tokens.css`, ajouter juste après `--red-p` :

```css
  /* l'accent du système. Changer ces deux lignes suffit à changer la DA. */
  --accent: var(--red);
  --accent-p: var(--red-p);
```

Puis remplacer **toutes** les occurrences de `var(--red)` et `var(--red-p)` dans
`src/app/(rev01)/` et `src/system/` par `var(--accent)` et `var(--accent-p)`.
Ne pas toucher aux définitions `--red` / `--red-p` elles-mêmes : elles restent la
valeur brute, l'accent est ce qui la désigne.

Vérifier que `npm run qa:brand:rev01` accepte cette indirection ; s'il refuse un
token qui référence un autre token, **dis-le** au lieu de contourner le gate.

## Le gate

Ajouter à `tests/aeration.spec.ts` (le fichier existe déjà, même registre de
mesure) deux vérifications, sur les mêmes routes et les mêmes largeurs :

1. **Plancher** : aucun élément visible portant du texte n'a une `font-size`
   calculée inférieure à 14 px. Le message d'échec nomme la page, la taille, le
   sélecteur et les 40 premiers caractères.
2. **Échelle fermée** : l'ensemble des tailles calculées rencontrées sur une page
   est inclus dans la liste des neuf valeurs attendues, aux arrondis près
   (tolérance 0,5 px pour les pas fluides). Le message d'échec liste les tailles
   intruses et où elles ont été vues.

## Périmètre

`src/system/tokens.css`, `src/app/(rev01)/rev01.css`, `src/system/*.css` si des
tailles y traînent, `tests/aeration.spec.ts`. **Aucun texte affiché n'est
modifié.** Aucune couleur n'est modifiée : le point 3 est un renommage, la valeur
rendue reste identique au pixel.

## Preuve attendue

1. `npm run qa:brand:rev01` et `npm run build` verts.
2. `npm run qa:network:rev01` vert, plancher et échelle compris.
3. Claude vérifiera à l'œil, à 1440, 768 et 390 px, que rien ne déborde et que la
   hiérarchie tient. Signale dans ton message final tout endroit où tu as un
   doute sur le rendu : tu n'as pas de navigateur, moi si.
