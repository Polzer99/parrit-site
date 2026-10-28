# Hero lisible sur tablette et étiquette du jeton lisible (Paul, 28/10/2026 : « go »)

Le hero est validé par Paul (« c'est canon ») : ni texte, ni ontologie, ni animation, ni rendu
ordinateur (≥ 1101 px) ou téléphone (≤ 760 px) ne changent. Deux défauts constatés en navigateur :

1. **Tablette, de 761 à 1100 px** : la règle `@media(min-width:761px)` met le schéma à côté du texte ;
   à 800 px il ne fait plus qu'environ 300 px de large et ses étiquettes deviennent illisibles
   (≈ 6 px à l'écran). Entre 761 et 1100 px, placer le schéma **sous** le texte et le bouton, sur
   toute la largeur du contenu, comme sur téléphone mais sans défilement horizontal (la largeur
   suffit) ; légende (`ontocap`) sous le schéma, citation (`humby`) ensuite. Les étiquettes du
   schéma doivent mesurer au moins 14 px à l'écran à 800 px et 1024 px. Le bouton garde ses
   règles actuelles (largeur de contenu au-dessus de 760 px, une ligne). La règle
   `max-height:calc(100svh - 460px)` ne doit pas réduire le schéma dans cette plage.
2. **Étiquette du jeton** (`.toklab`, ex. « E-mail client », « Stock bas ») : pendant le trajet, elle
   passe sur les lignes et les icônes d'agents et chevauche leurs noms. Lui donner un contour au fond
   canard (`paint-order: stroke`, trait `var(--canard)` de 4 à 6 unités, jointures arrondies) pour
   qu'elle reste lisible par-dessus ; même chose pour rien d'autre. Aucune couleur littérale.

## Contrôles

- Tests dans `tests/single-page.spec.ts`, FR et EN : à 800×1100 et 1024×768, schéma sous le texte
  (haut du schéma ≥ bas du bouton), largeur du schéma ≥ 90 % du contenu, étiquettes `.lab` et `.nt`
  ≥ 14 px à l'écran (taille calculée × échelle du SVG), aucun débordement horizontal ; à 1440×800 et
  1280×720 la géométrie actuelle du hero est inchangée (contrôles existants, dont « le hero entier
  tient à 1440×800 ») ; à 390×700 rendu inchangé.
- `.toklab` : `paint-order` contient `stroke`, trait de largeur > 0 à la couleur `--canard`.
- Contrôles existants conservés sans assouplissement.
- Batterie : `npm ci && npm run lint && npm run build && npm test && npm run qa:brand:rev01 &&
  npm run qa:claims:rev01 && npm run test:brand-os` ; navigateur rejoué par Claude sur l'hôte.
