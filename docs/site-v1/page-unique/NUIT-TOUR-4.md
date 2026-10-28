# Tour 4 de la nuit du 28/10 : barre du haut sur tablette

Revue à 1280×720 et 800×1100 après le tour 3. Périmètre : mise en page de la barre, risque faible.
Ne pas toucher : hero, libellés et styles des boutons, Cal.com, offres.

1. **Barre canard entre 761 px et la largeur où la navigation d'ordinateur disparaît** (mesuré :
   900, 800, 761 px) : la navigation est masquée, et « FR EN » et le bouton « Parler d'un projet »
   flottent au milieu de la barre (ex. à 800 px : langues 245-290, bouton 405-586, menu 700-760).
   Les regrouper à droite, dans l'ordre langues, bouton, menu, avec l'espacement utilisé sous
   760 px (où langues et menu sont déjà groupés à droite). Logo seul à gauche. Aucun changement à
   ≥ la largeur où la navigation d'ordinateur est visible, ni sous 761 px.

## Contrôles

- Test dans `tests/single-page.spec.ts`, FR et EN, à 900, 800 et 761 px de large : logo à gauche ;
  langues, bouton et menu visibles, dans cet ordre, sur une même ligne, groupés à droite (bord
  droit du menu au bord droit du contenu à 1 px près, écart entre deux éléments voisins ≤ 48 px) ;
  aucun débordement horizontal.
- Contrôles existants conservés, sans assouplissement.
- Batterie : `npm ci && npm run lint && npm run build && npm test && npm run qa:brand:rev01 &&
  npm run qa:claims:rev01 && npm run test:brand-os` ; navigateur rejoué par Claude sur l'hôte.
