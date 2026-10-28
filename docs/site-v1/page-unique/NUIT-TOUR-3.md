# Tour 3 de la nuit du 27/10 : alignement de « Ce que l'IA change »

Revue « dirigeant pressé » sur captures FR/EN 1440×800 et 390×844 après le tour 2. Périmètre :
mise en page, risque faible. Ne pas toucher : hero, boutons, Cal.com, offres, textes.

1. **Illustrations de même hauteur** (`#ce-qui-change` / `#what-changes`) : en FR à 1440×800,
   « Vos informations » passe sur deux lignes dans la troisième illustration (« Votre logiciel »),
   qui devient plus haute que les deux autres (≈ 373 px contre 362 px) ; le titre de cette carte
   descend de ~10 px par rapport aux deux autres. Les trois cadres d'illustration doivent avoir la
   même hauteur, et les trois titres la même ligne de départ, en FR et EN, à 1440×800, 1280×720,
   et dans le carrousel tablette/téléphone. Aucun texte d'illustration coupé ni réduit sous 16 px.
2. **Carrousel téléphone de cette section** : à 390×844, ~170 px de vide entre la fin de la
   première carte et les points de position (la carte la plus haute fixe la hauteur). Une fois le
   point 1 réglé, les cartes doivent avoir des hauteurs proches ; les points suivent la carte sans
   bande vide de plus de 48 px.

## Contrôles

- Tests ajoutés dans `tests/single-page.spec.ts` : FR et EN, mouvement réduit, 1440×800 et
  1280×720 : hauteurs des trois cadres d'illustration égales à 1 px près, `top` des trois titres
  `h3` égal à 1 px près ; à 390×844 : écart entre le bas de la carte active et les points ≤ 48 px.
- Contrôles existants conservés sans assouplissement ; « un bloc = un écran » intact.
- Batterie : `npm ci && npm run lint && npm run build && npm test && npm run qa:brand:rev01 &&
  npm run qa:claims:rev01 && npm run test:brand-os` ; navigateur rejoué par Claude sur l'hôte.
