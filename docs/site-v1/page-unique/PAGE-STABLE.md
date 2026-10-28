# Page stable : la page ne change plus de dimension sous les yeux (Paul, 28/10/2026)

Paul : « la page change de dimension de façon fréquente, et pour l'œil, ce n'est pas agréable. Il faut
vraiment se mettre dans un point de vue de neurosciences. » Principe (lecture et attention) : un
changement de position involontaire capte l'attention périphérique et casse la lecture ; tout texte
qui change seul doit changer **dans une boîte de taille fixe**, dimensionnée pour sa version la plus
longue. Le contenu bouge, la page jamais.

## Mesure (production du 28/10, `/fr`, 45 s immobile puis défilement lent)

À 1440×800 : CLS 0,092, dix-huit changements de hauteur ; à 390×844 : treize.

1. **Légende du hero** (`.ontocap`) : une ou deux lignes selon l'histoire ⇒ le hero passe de 563 à
   581 px et revient, toute la page dessous saute de 18 px à chaque histoire.
2. **Chargement des polices** (~1,2 s) : le titre se recompose, la page remonte de 77 px.
3. **Applications** (`#en-production`) : ±18 px pendant que les conversations se jouent (des
   messages entrent ou sortent du flux : la hauteur intrinsèque du tour 2 suit l'état courant).
4. **Partenaires** : ±49 px (1440) et ±9 px (390) quand une carte bascule sur ses offres.
5. **Services** : ±3 px quand les cas changent (nombre de lignes variable).
6. **Réservation Cal.com** : +150 px (1440) et +490 px (390) quand le calendrier finit de charger.

## Changements

- Pour chaque texte qui change seul (légende du hero, cas des services, offres et faces des
  partenaires) : réserver la hauteur de la variante la plus longue, à chaque largeur, sans JS ;
  technique attendue : toutes les variantes empilées dans une même cellule de grille, une seule
  visible (les autres en `visibility:hidden`, `aria-hidden`), ou toute méthode équivalente sans
  valeur en dur. Aucune troncature, aucune réduction de police.
- Applications : la hauteur réservée est celle de la conversation complète ; les messages
  apparaissent par opacité/transformation, jamais en entrant dans le flux.
- Polices : précharger les fichiers General Sans utilisés au-dessus de la ligne de flottaison et
  donner à la police de repli des métriques ajustées (`size-adjust`, `ascent-override`,
  `descent-override`, `line-gap-override`), avec `font-display: optional` pour General Sans
  400/500/600 afin de conserver le repli pendant la visite si les fontes arrivent trop tard,
  sans saut dû aux coupures de mots ; IBM Plex Mono inchangée, aucune police nouvelle ni service externe.
- Réservation : réserver pour le cadre Cal.com la hauteur qu'il prend une fois chargé, à chaque
  largeur testée (pas de saut au chargement), sans couper le calendrier.
- Ne change ni texte, ni durée de lecture, ni rendu final ; hero, boutons, offres et Cal.com
  identiques une fois chargés.

## Contrôles

- Nouveau test Playwright `tests/stabilite.spec.ts` : FR et EN, 1440×800, 1280×720, 800×1100 et
  390×844, mouvement normal, Cal.com remplacé par une réponse locale (deny-all réseau intact) ; après
  chargement des polices, rester 25 s immobile puis défiler jusqu'au bas : aucune section ne change
  de hauteur de plus de 1 px, `scrollHeight` du document constant à 1 px près, somme des
  `layout-shift` hors interaction ≤ 0,01.
- Contrôles existants conservés, sans assouplissement (dont durées de lecture, « un bloc = un
  écran », mouvement réduit, sans JS).
- Batterie : `npm ci && npm run lint && npm run build && npm test && npm run qa:brand:rev01 &&
  npm run qa:claims:rev01 && npm run test:brand-os` ; navigateur rejoué par Claude sur l'hôte avec
  la mesure ci-dessus, avant/après.
