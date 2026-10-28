# Tour 5 de la nuit du 28/10 : panneau du menu mobile

Revue des états ouverts (menu mobile), du 404 et des mentions légales après le tour 4. Périmètre :
mise en page, risque faible. Ne pas toucher : hero, libellés, boutons, Cal.com, offres.

1. **Menu mobile ouvert** (≤ 900 px) : le panneau des liens a le même fond canard que le hero et
   aucune limite basse ; le titre du hero passe dessous et paraît coupé (« du possible, » à moitié
   masqué sous les liens, à 390×844). Donner au panneau une limite basse nette : un filet d'un pixel
   au jeton existant de ligne sur fond canard (`--on-canard` ou le jeton de ligne dérivé déjà
   utilisé sur les fonds sombres), et un rembourrage bas identique au rembourrage haut. Aucune
   ombre, aucun dégradé, aucun rayon (Brand OS). Fermé, rien ne change.

## Contrôles

- Test dans `tests/single-page.spec.ts`, FR et EN, à 390×844 et 800×1100 : menu ouvert, le panneau
  a une bordure basse de 1 px visible (couleur ≠ fond du panneau), rembourrages haut et bas égaux,
  aucun lien coupé ni débordement horizontal ; menu fermé, aucune bordure ne s'affiche.
- Contrôles existants conservés, sans assouplissement.
- Batterie : `npm ci && npm run lint && npm run build && npm test && npm run qa:brand:rev01 &&
  npm run qa:claims:rev01 && npm run test:brand-os` ; navigateur rejoué par Claude sur l'hôte.
