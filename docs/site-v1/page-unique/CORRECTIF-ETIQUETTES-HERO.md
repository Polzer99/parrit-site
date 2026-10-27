# Correctif : étiquettes du hero qui se chevauchent (Paul, 27/10/2026)

Constat en production (27/10, 14 h) : deux histoires sont souvent en route en même temps dans
`OntologyHero`. Leurs étiquettes (`.toklab`, ex. « Stock bas » et « E-mail client ») se
superposent, et l'étiquette chevauche parfois le nom d'un nœud (« Seuils »).

Correctif demandé par Paul (« corrige ») :

1. **Une seule étiquette visible** : celle de l'histoire la plus récente, qui correspond à la
   légende sous le schéma. Quand une nouvelle histoire part, l'étiquette du jeton précédent
   s'efface (opacité à 0 en 300 ms) ; son jeton et son tracé continuent normalement.
2. L'étiquette ne recouvre pas le nom d'un nœud : la placer au-dessus-gauche du jeton
   (x −12, y −14, `text-anchor="end"`) quand le jeton est dans la moitié droite du schéma
   (x > 540), au-dessus-droite sinon (comportement actuel).
3. Texte de l'étiquette toujours à pleine opacité tant qu'elle est visible (contraste ≥ 4,5:1).
4. Mouvement réduit, rendu serveur et nettoyage au démontage : inchangés.

Tests : dans `tests/single-page.spec.ts` (test « six overlapping stories »), au moment où deux
jetons sont en route, vérifier qu'une seule `.toklab` est visible et qu'elle porte le libellé de
la dernière histoire lancée. Aucune assertion existante retirée.

Batterie : `npm run lint`, `npm run build -- --webpack`, `npm test`, `npm run qa:brand:rev01`,
`npm run qa:claims:rev01`, `npm run test:brand-os` ; navigateur rejoué sur l'hôte.
