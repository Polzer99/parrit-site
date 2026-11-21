# Audit visuel du site Parrit.ai : cohérence, alignement, lisibilité des blocs

21/11/2026. Branche auditée : `codex/docs-CODEX-SPEC-2026-11-21-alignement-pages-parten`, commit `b5a1146`, site construit à 20 h 09 (`.next/BUILD_ID`), servi en local sur le port 3217 puis arrêté.

## Comment lire ce document

- **Mesuré** : relevé dans le navigateur (styles calculés et positions en pixels) à 1440 × 800, 1280 × 720 et 390 × 700, mouvement réduit. Les fichiers bruts sont dans `mesures/`, les captures dans `captures/`, les sites de référence dans `concurrents/`.
- **Jugé** : mon avis de directeur artistique. Chaque jugement est marqué « Jugement ».
- Positions horizontales données à 1440 px de large. Le bord gauche du conteneur est à **x = 180**, le bord droit à **x = 1260** (conteneur 1160 px, marges internes 40 px, donc 1080 px utiles).

Écarts avec la consigne, à connaître :
- Captures faites avec le Chromium de Playwright déjà installé dans le dépôt (`node_modules/playwright`), pas avec Chrome sans fenêtre. Avantage : le téléphone est capturé à **390 px réels**, pas à 500.
- Palantir : la capture du haut (`concurrents/palantir-1-haut.png`) est noire, la vidéo d'ouverture ne se rend pas sans fenêtre. Les deux captures du milieu sont exploitables.
- Le dépôt porte des modifications non validées d'un autre terminal (`AGENTS.md`, `DESIGN.md`, `TRUTH.md`, `src/system/home-layers.ts`, `src/app/sitemap.ts`, `tests/style-site.test.mjs`). Je n'ai rien écrit dans le dépôt. L'audit porte sur le site **construit**, qui peut être en retard sur ces sources.
- Contrastes non remesurés (le dépôt a déjà un test dédié). États au survol non audités.

---

## 1. État actuel

### 1.1 Accueil `/fr`, section par section (1440 × 800)

| # | Section | Titres (taille / interligne, graisse, alignement) | Conteneur et bord gauche | Marge haute / basse de la section, écart titre → contenu | Cartes | Boutons | Longueur de ligne | Élément visuel |
|---|---|---|---|---|---|---|---|---|
| 0 | Barre | pas de titre | 180 → 1260 | hauteur 76 | aucune | secondaire, 16 px / 600, 14 × 24, haut. 48, filet blanc 1 px | sans objet | logo texte |
| 1 | Hero | H1 46 / 52, 500 puis 2e phrase en 600, interlettrage −0,46 px, gauche x = 180, larg. 516 | texte 180 → 696, schéma 744 → 1260 | 48 / 48 | aucune | principal **grand** : 22 px, 22 × 36, haut. 78,8, rose, filet **blanc 2 px**, flèche. Sélecteur 26 px / 600 | 43 caractères | schéma à trois plans |
| 2 | Références | H2 40 / 42,4, 500 + « avec nous. » en 600, gauche x = 180 | bande de logos **190 → 1250**, premier logo à **x = 200** | 72 / 72, titre → logos **57** | aucune | aucun | sans objet | 6 logos (hauteurs 54 et 84) |
| 3 | Calculateurs | H2 **26 / 36,4**, 500, sans gras, gauche. H3 22 / 27,5, **600** | 180 → 1260, texte des cartes à x = 205 | **64 / 48**, titre → note **8**, note → grille 32, grille → pied 33 | 2 cartes : filet 1 px + **barre canard 3 px en haut**, fond blanc, marge interne 24, panneau sauge. Gouttière **48** | principal **moyen** : 16 px, 16 × 26, haut. **58,4**, rose, filet **encre 2 px**, flèche, calé **à droite** (x = 1000 → 1260) | 18 px | champs + chiffre 40 px canard |
| 4 | Offres | H2 40 / 42,4, 500, sans gras. H3 22 / 27,5, **500** | 180 → 1260, texte des cartes à x = 205 | 72 / 72, titre → cartes 32, cartes → ligne grise 24 | 2 cartes : filet 1 px `#7FA0A7`, fond `rgb(6,42,48)` sur fond `rgb(6,38,46)`, marge 24. Gouttière **24** | aucun | listes 16 px | 6 coches, rien d'autre |
| 5 | Partenaires | H2 40 / 42,4, 500 + 2e ligne en 600. Titres de cellule 16 px / 600 canard (pas des H3) | 180 → 1260, texte des cellules à **x = 199** | 72 / 72, titre → intro **19**, intro → grille **20** | 7 cellules **jointives** séparées par un trait de 1 px, fond blanc cassé, retrait 18 | aucun | intro 18 px sur 720 px : **89 caractères possibles**, 70 réels. Cellules 16 px, 45 | **aucun**. 235 mots |
| 6 | Parcours | H2 40 / 42,4, 500 + fin en 600. H3 22 / 27,5, **500** | colonnes à x = 180, 553, 927. **Pictogrammes à x = 394, 754, 1114** | 72 / 72, titre → pictos **56**, pictos → étapes 24 + 44 | 3 colonnes à filet haut 1 px, marge 16 en haut. Gouttière **40** | aucun | étapes 18 px, 43. Ligne « Déjà équipés ? » : **136 caractères sur une ligne** | 3 pictogrammes. « Étape 1 » en 16 px gris |
| 7 | Terrain | H2 40 / 42,4, 500, sans gras, **centré** (x = 310). Intro **centrée** | 180 → 1260 | **24 / 24**, titre → intro 16, intro → photos 24 | 3 photos avec bandeau encre. Gouttière **16** | aucun | 71 | 3 photos de session |
| 8 | Technologies | pas de titre : paragraphe 22 / 32 gris, fin en 600 | 180 → 1260 | **28 / 30** | **cadre canard 1 px sur toute la largeur de la fenêtre** (0 → 1440) | aucun | 47 | 10 logos avec leur nom |
| 9 | Presse | H2 **22 / 30,8**, 500 | 180 → 900 | **64 / 48**, écarts 24 | aucune | secondaire **moyen** : 16 px, 16 × 26, haut. **56,4**, filet encre 1 px, flèche | 18 px sur 720 px : 89 possibles, 72 réels | **aucun** |
| 10 | Questions | H2 40 / 42,4, 500 | 180 → 1260 | 72 / 72, titre → liste **25** | lignes à filet 1 px | aucun | questions 18 / 600, réponses **16 px** sur 745 px : **107 possibles**, 85 à 93 réels | triangles natifs |
| 11 | Contact | H2 40 / 42,4, 500 + fin en 600, **à x = 583** (2e colonne). H3 22 / 27,5, 500 | photo 180 → 519, texte 583 → 1260. Gouttière **64** | 72 / 72, grille → calendrier **79** | cadre du calendrier, filet 1 px `#7FA0A7` | principal **grand** : 22 px, 22 × 36, haut. **76,8**, rose, filet **rose 1 px**, **sans flèche**. Secondaire 16 px, 0 × 24, haut. 48 | 18 px sur 677 px : 86 possibles, 79 réels | portrait |
| 12 | Pied | sans objet | texte 180 → 1260, mais **filet du haut de 140 à 1300** | 28 / 40 | aucune | liens soulignés 16 px | sans objet | aucun |

### 1.2 Autres gabarits (1440 × 800)

| Gabarit | Titres | Conteneur et bord gauche | Rythme vertical | Cartes | Boutons | Longueur de ligne | Élément visuel |
|---|---|---|---|---|---|---|---|
| **Page d'offre** (`/fr/journal/themes/ai-sprints`, `harness-engineering`) | H1 **84 / 90,7**, 500, interlettrage **normal**, haut du titre à **y = 196**. H2 **40 / 46**, 500, interlettrage **normal**, sur 1080 px. Titres d'étape : 22 px / 600 | 180 → 1260 | en-tête 64 / 64, corps 64 / 64, **64 entre sections**, titre → contenu 24 | étapes : filet haut `#B8CDD1`, marge 16, numéro « 01 » en **16 px gris**. Encadré « limites » : filet 1 px `#B8CDD1`, fond blanc, marge 24. Gouttière 32 | haut : principal grand, rose, filet blanc 2 px, flèche. Bas : principal **16 px, 14 × 24, haut. 48, fond CANARD, texte blanc, sans flèche** | chapeau 22 px : 75 possibles. Corps 18 px sur 720 px : **90 possibles**, 66 à 90 réels | **aucune image**. 555 mots (essai), 636 mots (contrôle) |
| **Index du Journal** (`/fr/journal`) | H1 **54 / 54**, 500, interlettrage −1,62 px, haut à **y = 200**. Titres de carte (H2) 22 / 35,2, 600 | 180 → 1260 | en-tête 98 / 48, cartes sur 2 colonnes, gouttière 32 | 31 cartes : filet bas `#B8CDD1`, pas de fond | aucun dans la page | extraits 16 px sur 524 px : 73 possibles, 61 réels | aucun. Dates en IBM Plex Mono |
| **Article** | H1 54 / 54, haut à **y = 253**. Intertitres (H2) **26 / 31,2, 600**. Bloc de fin (H2) **40 / 46, interlettrage normal** | colonne **180 → 871** (691 px), à gauche, 389 px vides à droite | en-tête 98 / 48 | corps entre deux filets | principal **16 px, 14 × 24, haut. 48, fond ROSE, filet rose 1 px, sans flèche** | corps 18 px sur 691 px : 88 possibles, 72 réels | aucun |
| **Rendez-vous** | H1 **40 / 46**, interlettrage normal, haut à **y = 124** | texte 180 → 892, **calendrier 180 → 712 (532 px sur 1080)** | 48 / 48, écarts 24 | cadre du calendrier, filet `#7FA0A7`. Bandeau **en capitales, IBM Plex Mono, espacement 2,56 px** | lien souligné | 89 possibles, 77 réels | calendrier |
| **Mentions légales** | H1 54 / 54, interlettrage **−1,89 px**, haut à y = 200. H2 **40 / 42**, interlettrage **−1 px**. H3 22 px / 600 | intitulés 180 → 400, texte **432 → 1065** | filet **encre 2 px** sous l'en-tête (seul du site), rubriques à filet `#B8CDD1`, marge 24 | lignes | aucun | 16 px sur 633 px : 89 possibles | aucun |

### 1.3 Mesures transversales

- **Police** : General Sans partout, vérifiée glyphe par glyphe (protocole du navigateur). Les pages d'offre ne paraissent dans une autre police que parce que l'interlettrage change (−0,03 em sur l'accueil, normal sur les offres).
- **Largeur de `1ch`** à 18 px : 10,47 px. Donc `70ch` = 733 px = **environ 90 caractères réels**, pas 70. La règle « texte courant plafonné à 70ch » de `DESIGN.md` produit des lignes de 86 à 90 caractères.
- **Gris de filet** : quatre teintes servies pour le même rôle. `#798A8E` (accueil), `#496167` (champs), `#7FA0A7` (fonds sombres), `#B8CDD1` (offres, Journal, mentions légales).
- **Aucun débordement horizontal** sur les six gabarits aux trois tailles. Aucun arrondi, aucune ombre, aucun dégradé dans nos pages (seul le calendrier Cal.com, tiers, porte des arrondis).
- **Hauteur des blocs de l'accueil** (premier enfant de chaque section, ce que mesure le test « un bloc = un écran ») :

| Section | 1440 × 800 | 1280 × 720 | 390 × 700 |
|---|---|---|---|
| Références | 204 | 204 | 391 |
| Calculateurs | 576 | 576 | **675 (marge 25)** |
| Offres | 434 | 434 | 526 |
| Partenaires | 728 (marge 72) | **708 (marge 12)** | 566 |
| Parcours | 551 | 551 | 521 |
| Terrain | 606 | 557 | 443 |
| Technologies | 116 | 116 | 192 |
| Presse | 193 | 193 | 265 |
| Questions | 497 | 497 | 563 |
| Hero entier, barre comprise | bas à 757 (marge 43) | sans objet | sans objet |

### 1.4 Les quatre références, mêmes mesures

| Site | H1 | H2 | H3 | Bord gauche | Boutons | Texte courant |
|---|---|---|---|---|---|---|
| craft.ai | 40 / 52, 600 | 36 à 38, 600, tous à x = 132 | 18 à 24 | x = 132 partout | une forme : fond marine, 15 px / 600, haut. 49 | 18 px, 50 à 83 caractères |
| galadrim.fr | 48 / 48, 500 | **40 / 40, 500, les 8 relevés identiques, tous à x = 116** | 32 puis 18 | x = 116 partout | une géométrie (haut. 44, angles droits), vert plein ou blanc plein | 14 px, 47 à 66 |
| 1600.agency | 95,8 / 97,7, 400 | **49 / 51, 400, les 5 relevés identiques, tous à x = 66** | 21,6 | x = 66 partout | noir plein + contour, même hauteur | 14 à 19 px, 45 à 83 |
| palantir.com | sans objet | une graisse (400) partout | 34 / 36 | x = 30 partout | blanc, angles droits, haut. 40 | 16 à 26 px |

Ce que les quatre ont en commun, et que nous n'avons pas : **une taille par niveau de titre, une seule graisse dans un titre, un seul bord gauche, un seul bouton**. Et chaque bloc s'ouvre par un repère visible avant le texte : numéro (Craft « 01 » à « 05 » reliés par un trait, Palantir « /0.1 »), étiquette (1600 « STAGE 1 » avec un schéma par carte), photo ou vidéo (Galadrim).

---

## 2. Incohérences, par gravité

Format : où · preuve · règle de la grille `ux-audit` ou référence enfreinte · correction.

### Gravité 1 : se voit en trois secondes, sur tout le site

**1. Le titre de page a quatre tailles.**
Preuve : 46 px (accueil), **84 px** (offres), 54 px (Journal, article, mentions légales), **40 px** (rendez-vous). Cinq réglages d'interlettrage : −0,46 / normal / −1,62 / −1,89 / normal. Captures `offre-ai-sprints-1440-full-t01.png` et `rendez-vous-1440-full-t01.png` côte à côte.
Règle : référence Galadrim et 1600 (une taille par niveau). Règle 19 (la hiérarchie dit la structure).
Correction : 54 px sur toutes les pages intérieures, voir le système cible.

**2. Le titre de section « 40 px » existe en trois dessins, et deux sections de l'accueil ont un titre à 26 et 22 px.**
Preuve : accueil 40 / 42,4 interlettrage −1,2 px ; offres, bloc de fin d'article et rendez-vous 40 / 46 interlettrage normal ; mentions légales 40 / 42 interlettrage −1 px. Calculateurs **26 px**, presse **22 px**, technologies : un paragraphe gris de 22 px. Captures `accueil-1440-full-t02.png` (« Vous travaillez avec les spécialistes ») et `offre-ai-sprints-1440-full-t01.png` (« Un essai est utile ») : on croit voir deux polices.
Règle : références (les 8 H2 de Galadrim sont identiques). Règle 13 par analogie : un parti pris, pas un mélange.
Correction : un seul H2, 40 / 44, interlettrage −0,03 em, graisse 500.

**3. Le bouton « Prendre rendez-vous » existe en six versions.**

| Où | Taille | Hauteur | Fond | Filet | Flèche |
|---|---|---|---|---|---|
| Barre | 16 | 48 | transparent | blanc 1 px | non |
| Hero (accueil, offres) | 22 | 78,8 | rose | **blanc 2 px** | oui |
| Calculateurs | 16 | **58,4** | rose | **encre 2 px** | oui |
| Contact | 22 | **76,8** | rose | **rose 1 px** | **non** |
| Bas des pages d'offre | 16 | 48 | **canard** | canard 1 px | non |
| Bas des articles | 16 | 48 | rose | rose 1 px | non |

Règle : **règle 9** (un seul design de bouton, plus une variante sur fond sombre ; jamais deux traitements pour le même rôle).
Correction : un principal (rose, filet 2 px, flèche) en deux tailles, un secondaire. Voir le système cible.

**4. L'accueil a trois axes, plus trois décalages.**
Preuve : titres à gauche à x = 180 (7 sections), titre **centré** à x = 310 (terrain), titre à **x = 583** (contact). Bouton des calculateurs calé à droite (x = 1000). Logos qui démarrent à **x = 200** sous un titre à 180. Pictogrammes du parcours à **x = 394, 754, 1114** au-dessus de colonnes qui commencent à **180, 553, 927** : ni alignés à gauche, ni centrés (les centres sont à 347, 720, 1093). Filet du pied de **140 à 1300** quand tous les autres filets vont de 180 à 1260.
Règle : **règle 20** (un seul axe d'alignement par page, le défaut est le zigzag).
Correction : tout part de x = 180. Texte à gauche, visuel à droite.

**5. Le rythme vertical n'a pas de règle.**
Preuve : marges de section **48 / 48, 72 / 72, 64 / 48, 24 / 24, 28 / 30**. La valeur 72 est `clamp(56px, 9vh, 112px)` : elle vaut 72 à 800 px de haut, 64,8 à 720, 112 sur un grand écran, donc le rythme change avec la fenêtre. Écart titre → contenu : **8, 16, 19, 25, 32, 56, 57**. Terrain (24) et technologies (28) sont collés quand tout le reste respire à 72 : capture `accueil-1440-full-t03.png`, de la photo au bandeau d'outils. Gouttières entre colonnes : **16, 24, 32, 40, 48, 64** et une grille jointive.
Règle : **règle 19** (respiration hiérarchisée : serré dans un groupe, large entre sections).
Correction : deux valeurs, 64 et 32.

**6. Des blocs entiers ne sont que du texte.**
Preuve : partenaires, 7 cellules, **235 mots, 0 image, 0 pictogramme** (`accueil-1440-full-t02.png`). Pages d'offre : **555 et 636 mots, 0 image**, 7 sections de texte à la suite (`offre-ai-sprints-1440-full-t01.png` à `t03`). Presse : un titre de 22 px, deux lignes, un bouton. Numéros d'étape en **16 px gris** (« Étape 1 » sur l'accueil, « 01 » sur les offres) : le repère le plus utile de la page est son plus petit texte.
Règle : références. Craft numérote « 01 » à « 05 » en pastilles reliées (`concurrents/craft-2-milieu.png`), 1600 met un schéma par étape (`concurrents/1600-3-milieu.png`), Palantir indexe « /0.1 » (`concurrents/palantir-3-milieu.png`). Règle 26 (un chiffre-clé est un objet graphique). Analyse du 08/11, procédés 6 et 8.
Correction : un repère en tête de chaque carte. Voir 3.9.

### Gravité 2 : se voit en lisant

**7. Sept traitements de « carte » et quatre gris de filet.**
Preuve : carte à barre canard 3 px (calculateurs), carte sombre à filet (offres), grille jointive (partenaires), colonne à filet haut (étapes), encadré blanc (offres, « limites »), cadre du calendrier, **cadre canard bord à bord** autour des technologies. Filets `#798A8E`, `#496167`, `#7FA0A7`, `#B8CDD1`.
Règle : **règle 12** (le non-cliquable prend un filet simple). Le cadre canard des technologies a la couleur des contours de focus : il ressemble à un élément sélectionné.
Correction : une carte, une ligne de liste, un gris par registre.

**8. Le gras dans les titres n'a pas de règle.**
Preuve : sur l'accueil, 5 titres ont une partie en 600 (hero, références, partenaires, parcours, contact) et 4 n'en ont pas (calculateurs, offres, terrain, questions). Aucune autre page n'en a. Les fragments en gras : « avec nous. », « dont votre projet a besoin. », « vous commencez où vous voulez. », « une tâche précise. », « selon votre besoin. ». Pas de sens commun.
Règle : **règle 15** (l'accent a une seule signification par page). Références : une seule graisse dans un titre chez les quatre.
Correction : gras réservé à la 2e phrase du titre du hero (verrouillée par un test). Nulle part ailleurs.

**9. Les lignes sont trop longues.**
Preuve : 720 px à 18 px = 89 à 90 caractères possibles (intro des partenaires, presse, corps des offres). Réponses des questions : 745 px à 16 px = **107**. « Déjà équipés ? » : **136 caractères sur une seule ligne**. Article : 88 possibles.
Règle : règle 4 (le visiteur scanne). Références : 45 à 83. Notre propre `DESIGN.md` vise 70 et sert 90, parce que `70ch` vaut 733 px.
Correction : `58ch`, soit 607 px à 18 px, environ 70 à 75 caractères réels.

**10. Le premier titre ne tombe jamais à la même hauteur.**
Preuve : haut du H1 à y = **124** (rendez-vous), **196** (offres), **200** (Journal, mentions légales), **201** (accueil), **253** (article).
Règle : règle 20, appliquée à la verticale. Références.
Correction : barre (76) + 64 = **y = 140** sur toutes les pages intérieures.

**11. Le même rôle de texte a deux tailles.**
Preuve : réponses des questions en 16 px, étapes en 18 px. Extraits d'articles en 18 px sur les pages d'offre, en 16 px sur l'index. Listes des cartes d'offre en 16 px, description des partenaires en 16 px, intro en 18 px.
Règle : règle 19.
Correction : 18 px pour ce qui se lit en phrase, 16 px pour ce qui est dans une carte ou une légende.

**12. Deux titres se coupent au milieu d'une idée.**
Preuve (captures) : « Trois étapes, **vous** / **commencez où vous voulez.** » et le hero « Votre expertise est la / matière première. **Nous** / **la mettons au travail.** ».
Règle : **règle 24** (une idée par ligne, coupure à la frontière de phrase).
Correction : un saut de ligne à la frontière, comme c'est déjà fait pour « Vos équipes prennent l'IA en main. / Nous construisons vos outils. ».

### Gravité 3 : finitions

**13. Page rendez-vous** : le calendrier occupe 532 px sur 1080 (**règle 17**, un bloc écrasé). Un bandeau « PRENDRE RENDEZ-VOUS · CHOISISSEZ UN CRÉNEAU » et un pied « VISIO » en capitales IBM Plex Mono espacées de 2,56 px : seul endroit du site dans ce registre, et il est déjà masqué sur l'accueil. Capture `rendez-vous-1440-full-t01.png`.

**14. Contact** : « Aucune relance automatique. » touche le filet du bas (texte à y ≈ 1724, filet à 1738 dans `accueil-1440-full-t04.png`). Le bouton rose n'a ni flèche ni le filet du hero.

**15. Carte d'offre sombre** : fond `rgb(6,42,48)` sur une section `rgb(6,38,46)`. Quatre points d'écart sur un seul canal : la carte ne se détache que par son filet. Jugement : soit le fond est celui de la section, soit il s'en écarte franchement.

**16. Sélecteur de langue** : FR et EN sont tous deux soulignés, l'état actif n'est pas marqué (**règle 18**). Observé sur capture, non mesuré.

**17. Bouton « Lire nos retours de terrain »** : cinq mots (**règle 6**, un verbe et un ou deux mots).

**18. Mentions légales** : « Dernière mise à jour : octobre 2026 » deux fois. Filet encre 2 px unique sur le site.

**19. Feuilles de style** : `single-page.css` porte au moins trois générations de la même règle (marge de section ligne 22 à 128 px, ligne 89 à 80 px, ligne 256 en `clamp`, lignes 537, 654 et 701 par section). `rev01.css` fait 3 484 lignes avec des corrections en fin de fichier (lignes 3327, 3391). Jugement : c'est la cause de tout ce qui précède. Chaque correctif a réglé sa section sans règle commune.

### Ce qui est bon, à garder

La charte tient : une police, pas d'arrondi, pas d'ombre, pas de dégradé, aucun débordement. Le bord gauche x = 180 est déjà celui de 7 sections sur 11 et de toutes les autres pages. Le hero (texte à gauche, schéma à droite, un bouton) et les calculateurs (on comprend qu'on peut taper sans le lire) sont les deux blocs les plus aboutis : ce sont eux le modèle.

---

## 3. Système cible

Dans la charte existante. Toutes les tailles restent dans l'échelle fermée que le test `aeration.spec.ts` impose (16, 18, 22, 26, 40, 54, 84 ; 32, 34, 40 sur téléphone).

### 3.1 Jetons à ajouter dans `src/system/tokens.css`

```css
:root {
  --section-y: var(--brand-s8);   /* 64 : au-dessus et au-dessous de chaque section */
  --stack:     var(--brand-s4);   /* 32 : titre → contenu, contenu → contenu, gouttière */
  --inner:     var(--brand-s2);   /* 16 : à l'intérieur d'un composant */
  --card-pad:  var(--brand-s3);   /* 24 */
  --measure:   58ch;              /* environ 607 px à 18 px, 70 à 75 caractères réels */
  --title-max: 820px;
  --title-tracking: -0.03em;
}
```

### 3.2 Échelle de titres : une taille par niveau, sur tout le site

| Niveau | Jeton | Taille / interligne | Graisse | Interlettrage | Téléphone |
|---|---|---|---|---|---|
| Titre de page (H1), pages intérieures | `var(--d-m)` | 54 / 1,05 | 500 | `var(--title-tracking)` | 34 |
| Titre du hero de l'accueil (verrouillé par test) | sans objet | 46 / 52 | 500, 2e phrase 600 | −0,01 em | 38 / 43 |
| Titre de section (H2) | `var(--d-s)` | 40 / 1,1 | 500 | `var(--title-tracking)` | 32 |
| Titre de carte, d'étape, de rubrique (H3 ou `strong`) | `var(--t-l)` | 22 / 1,25 | **600** | −0,01 em | 22 |
| Intertitre dans un article | `var(--t-xl)` | 26 / 1,2 | 600 | −0,01 em | 26 |
| Étiquette au-dessus d'un titre de carte | `var(--t-s)` | 16 / 1,4 | 600, couleur `var(--accent-text)` | normal | 16 |
| Texte courant | `var(--t-m)` | 18 / 1,55 | 400 | normal | 18 |
| Texte dans une carte, légende, réponse | `var(--t-s)` | 16 / 1,5 | 400 | normal | 16 |

Le 84 px (`--d-xl`) n'est plus utilisé par aucune page.

### 3.3 Alignement : une règle

Tout commence sur le bord gauche du conteneur (`.wrap` et `.rev-wrap`, 1160 px, marges 40, soit x = 180 à 1440) : titre, introduction, première colonne, bouton, premier logo, premier pictogramme, filets. Rien n'est centré. Quand un bloc a un visuel, **le texte est à gauche et le visuel à droite** (c'est déjà le hero ; le contact s'y range). Les colonnes partagent une gouttière unique `var(--stack)`.

### 3.4 Rythme vertical : deux valeurs

- `var(--section-y)` (64) : marge haute et basse de **toute** section, fixe, sans `vh`. Exception documentée : le hero de l'accueil garde `var(--brand-s6)` (48), il doit tenir entier à 1440 × 800.
- `var(--stack)` (32) : entre le titre et le contenu, entre deux contenus d'une section, entre deux colonnes ou deux cartes. Les bandeaux (technologies) prennent 32 en haut et en bas.
- À l'intérieur d'un composant seulement : `var(--inner)` (16). Titre → introduction, numéro → titre de carte, titre de carte → texte.
- Pages intérieures : premier titre à 64 px sous la barre, soit y = 140.

### 3.5 Une carte

```css
.card {
  background: var(--paper2);                 /* blanc ; sur fond sombre : le fond de la section */
  border: 1px solid var(--brand-accessible-line);   /* sur fond sombre : var(--brand-derived-on-ink-line) */
  padding: var(--card-pad);
  /* pas d'arrondi, pas d'ombre, pas de barre de couleur */
}
```

Ordre intérieur, toujours le même : **repère** (numéro en 40 px, pictogramme de 32 px ou chiffre) → étiquette 16 / 600 → titre 22 / 600 → texte 16 → liste à coches. Sert pour : calculateurs, offres, spécialités des partenaires, étapes (accueil et offres), exemples de tâches et encadré « limites » des pages d'offre.

Ce qui n'est pas une carte est une **ligne** : un filet `1px solid var(--brand-accessible-line)` au-dessus, 16 px de marge. Sert pour : questions, liste du Journal, « À lire ensuite », rubriques des mentions légales. Un seul gris de filet sur fond clair, un seul sur fond sombre. `#B8CDD1` (`--rule-l`) disparaît des pages.

### 3.6 Boutons

| | Principal (`.rev-button.exec`) | Secondaire (`.rev-button.ghost`) |
|---|---|---|
| Fond | `var(--brand-core-rose)` | transparent |
| Texte | `var(--brand-accessible-ink)`, 600 | couleur du texte courant, 600 |
| Filet | **2 px**, `var(--brand-accessible-ink)` sur fond clair, `var(--brand-derived-white)` sur fond canard ou encre | 1 px, couleur du texte |
| Flèche du Brand OS | **toujours** | **jamais** |
| Taille normale | 16 px, `var(--button-padding)` (14 × 24), haut. 48 | idem |
| Grande taille | 22 px, 22 × 36, haut. 64 mini | n'existe pas |
| Où | **grand** : hero de l'accueil, hero des pages d'offre, contact. **Normal** : sous les calculateurs, bas des pages d'offre, bas des articles | barre, « Lire le Journal », envoi du formulaire |

Un seul libellé pour le principal : « Prendre rendez-vous ». Un principal par écran. Le canard n'est plus jamais un fond de bouton. Tout le reste est un lien souligné.

### 3.7 Largeur de lecture

`max-width: var(--measure)` sur tout paragraphe, toute liste et toute réponse. `max-width: var(--title-max)` sur les titres. Aucune phrase sur 1080 px. Corriger la ligne 7 de la section « Épure » de `DESIGN.md` (70ch → 58ch, avec la mesure).

### 3.8 Gras dans les titres

Une seule graisse par titre : 500 pour les titres de page et de section, 600 pour les titres de carte. Seule exception : la 2e phrase du titre du hero de l'accueil, en 600 (test `h1 b`). Retirer les `<b>` des cinq autres titres. Dans le texte courant, le gras reste permis pour un nom ou un chiffre.

### 3.9 Chaque bloc « que du texte » reçoit un repère

Les pictogrammes existent déjà : `OntologyGlyph.tsx` (mail, doc, rule, tool, cal, cube, person, gear, chart, bot), ceux du hero. Aucun nouvel actif à dessiner. Les correspondances proposées sont un jugement, à valider par Paul.

| Bloc | Aujourd'hui | Repère sobre |
|---|---|---|
| Accueil, offres (2 cartes) | étiquette + titre + 3 coches | un pictogramme de 32 px en tête de carte : `person` (vos équipes apprennent), `cube` (nous construisons) |
| Accueil, partenaires (7 cellules) | 235 mots | 7 cartes séparées : pictogramme + titre 22 / 600 + **une** phrase. `gear` ingénieurs, `bot` automatisation, `chart` transformation, `mail` marque, `person` prise en main, `rule` conseil et qualité, `doc` chercheurs |
| Accueil, parcours (3 étapes) | « Étape 1 » en 16 px gris, pictos décalés | numéro **1, 2, 3 en 40 px canard** (`var(--d-s)`, `var(--accent-text)`) en tête de carte, pictogramme existant à sa droite, les deux au bord gauche de la colonne. Les trois cartes reliées par la flèche du Brand OS |
| Accueil, presse | titre 22 px + 2 lignes + bouton | texte à gauche, **chiffre à droite** : le nombre d'articles publiés en 54 px canard, avec sa légende. Le nombre se calcule depuis le registre du Journal (31 cartes comptées aujourd'hui sur l'index), jamais écrit en dur |
| Page d'offre, « quatre étapes » | « 01 » en 16 px gris | numéros **01 à 04 en 40 px canard**, en CSS seul (`.theme-steps > li::before`), sans toucher au balisage |
| Page d'offre, exemples de tâches | 3 puces | **trois cases** côte à côte (la carte), un pictogramme chacune : `mail` réponse au client, `chart` rapport financier, `doc` saisie des commandes |
| Page d'offre, « vous recevez » | 4 puces | les coches des cartes d'offre de l'accueil à la place des puces |
| Page d'offre, hero | titre 84 px sur fond encre | titre 54 px à gauche, à droite les quatre noms d'étape numérotés en colonne : on voit le chemin avant de lire |
| Page rendez-vous | calendrier sur une demi-largeur | texte à gauche (titre, phrase, « Nous écrire »), calendrier à droite, sur la même ligne |
| Questions, Journal, article, mentions légales | texte | rien à ajouter : ce sont des lignes de lecture. Seuls l'échelle, le filet et la largeur changent |

---

## 4. Changements, fichier par fichier, dans l'ordre

Chaque étape se vérifie seule. « Risque » porte sur les tests de géométrie (`tests/single-page.spec.ts`, « un bloc = un écran » à 1440 × 800, 1280 × 720, 390 × 700) et sur les tests voisins quand je les ai lus. Aucun seuil n'est à abaisser.

**Étape 0. Trois décisions à faire prendre par Paul avant d'écrire la spec.**
a) Retirer de l'affichage les sous-listes des partenaires (le contrat du 27/10 garde 23 offres dans le HTML servi). b) Supprimer « Remplacez ces chiffres par les vôtres. » et trancher le sort de « Déjà équipés ? ». c) Le chiffre du bloc presse.

**Étape 1. `src/system/tokens.css`** : ajouter les sept jetons du 3.1.
Risque : nul, rien ne les consomme encore. Les contrôles de marque refusent une couleur littérale : n'utiliser que des `var()`.

**Étape 2. Titres : une règle commune, puis retirer les règles locales.**
- `src/system/system.css` : un seul bloc pour H1, H2, H3 de toutes les pages (3.2).
- `src/system/journal-themes.css` : ligne 3 (`--d-xl` → `--d-m`, interligne), ligne 7 (H2), ligne 17 (titres d'étape).
- `src/system/booking.css` : bloc `.booking-call h2, .booking-page h1` (le H1 du rendez-vous passe à `--d-m`).
- `src/app/(rev01)/rev01.css` : `.legal-header h1` (l. 990), `.legal-document > h2` (l. 1013), `.journal-article h1` (l. 1059).
- `src/system/single-page.css` : l. 12 à 16 et 99 à 101 fusionnées ; l. 728 (`.home-press h2` 22 → 40) ; l. 704 et 764 (`.home-calculator h2`, 26 → 40 et 22 → 32 sur téléphone) ; H3 en 600 partout (l. 16, 50, 711).
- Retirer les `<b>` des titres de section dans `src/system/components/SinglePage.tsx` et dans `src/system/home-layers.ts`.
Risque : **élevé sur les calculateurs à 390 × 700**. Le bloc fait 675 px pour 700. Son titre passe de 22 px sur 2 lignes (62 px) à 32 px sur 3 lignes (106 px), soit +44 : 719, le test casse. Parade : supprimer dans la même étape la note « Remplacez ces chiffres… » (−36 px), ce qui donne environ 683. Marge de 17 px, **à mesurer avant de fusionner**. Faible ailleurs : 54 px est dans l'échelle autorisée, le H1 du hero (46 px, test) ne bouge pas, `densite-pages.test.mjs` ne compte que les balises. Le texte « H1 88 px » dans `AGENTS.md` est périmé, à corriger.

**Étape 3. Alignement.**
- `single-page.css` l. 537 et 538 : retirer `text-align:center` et `margin-inline:auto` du terrain.
- l. 216 : `.logo-strip`, `margin: … auto 0` → marge gauche 0 (garder le plafond de 1060 px, un test le vérifie l. 954).
- l. 724 : `.calc-footer`, `justify-content:space-between` → `flex-start`, le bouton sous la phrase.
- l. 62, 302, 304 : contact, colonnes inversées (texte en 1re colonne, portrait en 2e). Le gabarit téléphone (l. 329) reste.
- l. 86 : filet du pied ramené à la largeur du contenu.
- `src/system/components/PathWalker.tsx` : pictogrammes au bord gauche de chaque colonne.
- `booking.css` + `src/system/pages/booking.tsx` : rendez-vous en deux colonnes.
Risque : faible sur les hauteurs (aucune ne change). Moyen sur le contact : `single-page.spec.ts` mesure la grille du fondateur (l. 1000) et le portrait 3:4 ; à rejouer. Les tests qui alignent le hero sur le logo de la barre ne sont pas touchés.

**Étape 4. Rythme vertical.**
- `single-page.css` l. 256 : `clamp(56px,9vh,112px)` → `var(--section-y)`. Retirer les exceptions l. 537 (terrain), 701 (calculateurs, presse), 357 et 377 (technologies → `var(--stack)`). Le hero (l. 654) garde 48.
- Écart titre → contenu : une règle, `var(--stack)`. Retirer l. 216 (56), l. 192 (56), l. 46 (44), l. 54 et 207 (64), l. 646 (20), l. 705 (8).
- `journal-themes.css` l. 7 : marge sous H2 24 → `var(--stack)`. `rev01.css` l. 3391 : `.journal-header{padding-top:98px}` → `var(--section-y)`, et retirer la marge haute de 26 px du H1.
Risque : **élevé sur les partenaires à 1280 × 720**. Le bloc fait 708 px pour 720. L'écart titre → intro → grille passe de 19 + 20 à 16 + 32, soit +9 : 717, marge de 3 px. **Ne pas faire cette étape sans l'étape 5**, qui allège ce bloc. Les marges de section, elles, ne comptent pas dans le test (il mesure le premier enfant de la section) : passer le terrain de 24 à 64 est sans risque. Références et parcours perdent 24 px chacun. Questions +7 (570 à 390 × 700).

**Étape 5. Cartes, lignes, filets.**
- `single-page.css` l. 710 : retirer la barre canard 3 px des calculateurs. l. 558 : fond des cartes d'offre. l. 54 à 59 et 280 à 283 : partenaires en cartes séparées, gouttière `var(--stack)`, une phrase par carte. l. 46 et 47 : étapes en cartes. l. 529 : retirer le cadre canard permanent des technologies (garder le contour de focus de la l. 530, un test l'attend).
- Gouttières l. 62, 495, 709 → `var(--stack)`. La mosaïque de photos garde ses 16 px (géométrie verrouillée par `home-visual-layers.spec.ts`).
- `journal-themes.css` l. 15, 20, 23, 24 et `rev01.css` (Journal, mentions légales) : `--rule-l` → le gris de filet unique.
Risque : moyen. Partenaires : les cartes séparées ajoutent 2 × 32 px, la suppression des sous-listes en retire environ 150 ; le bloc descend vers 620 px, **à mesurer**. Étapes en cartes : +48 px de marges internes et +24 pour le numéro, soit environ 620 à 1280 × 720 et 595 à 390 × 700, sous le seuil. `stabilite.spec.ts` compare les rangées des étapes à 1 px près : garder la sous-grille.

**Étape 6. Boutons.**
- `rev01.css` l. 395 à 500 et 3327 : la définition unique (3.6), avec une classe de grande taille.
- `single-page.css` : retirer l. 23 (marge 16 × 26), 38, 162, 726. `journal-themes.css` : retirer les lignes 36 à 41 (fond canard) et 44 à 58 (copie du grand bouton).
- `src/system/components/BookingCall.tsx` et le bouton du contact dans `SinglePage.tsx` : ajouter la flèche (`BrandConnector`).
Risque : faible. `audit-readability.spec.ts` exige 48 px mini, 22 px pour hero et contact, 16 px ailleurs, graisse 600 : le système cible est exactement cela. `single-page.spec.ts` exige `22px 36px` sur le hero et le contact (l. 230, 443) : inchangé. Les boutons moyens passent de 56 à 58 px à 48 : les blocs raccourcissent. À vérifier : le bouton de 22 px du hero des pages d'offre n'entre pas dans la définition « bouton en vue » du test ; rejouer `audit-readability` sur ces routes. Le test de contraste des fonds d'action demande 3:1 : d'où le filet encre de 2 px sur fond clair, déjà en place sous les calculateurs.

**Étape 7. Largeur de lecture.**
`journal-themes.css` l. 4, 8, 12 (720 px) ; `single-page.css` l. 52, 503 (80ch), 646 (720), 671 (70ch), 783 (720) ; `rev01.css` l. 3395 (66ch), `.legal-document p` (l. 1035) : tout à `var(--measure)`.
Risque : moyen. Les paragraphes gagnent des lignes. Questions : les deux réponses ouvertes passent à 2 lignes, +48 px à 1440 (545 pour 800). Rien ne change à 390 px, la colonne y est déjà plus étroite.

**Étape 8. Repères visuels (3.9).**
`ServiceGrid.tsx` (pictogramme par partenaire), `SinglePage.tsx` (offres, numéros d'étape, bloc presse), `journal-themes.css` (numéros en CSS, trois cases), `src/system/pages/theme.tsx` (coches, colonne d'étapes du hero).
Risque : moyen sur la presse (bloc à 265 px à 390 × 700, large marge). `densite-pages.test.mjs` impose aux pages d'offre : aucun H3 dans le corps, 7 H2 au plus, 4 étapes faites d'un `strong` et d'un `p`. Les numéros en CSS et les trois cases en CSS respectent ce contrat ; la colonne du hero doit être une liste sans titre.

**Étape 9. Garde-fou et documents.**
Un test `tests/coherence-visuelle.spec.ts` qui verrouille le système sur les six gabarits : une seule taille calculée par niveau de titre, tous les titres au même x, une seule hauteur par taille de bouton, aucune ligne de texte au-delà de 80 caractères. Mettre à jour `DESIGN.md` et la décision datée dans `AGENTS.md`.
Risque : nul sur l'existant. Sans ce test, les six versions du bouton reviendront au prochain correctif.

**Étape 10, plus tard, à part.** Fusionner les générations de règles de `single-page.css` et de `rev01.css`. Risque élevé, aucun gain visible : seulement quand le système est stable et verrouillé par l'étape 9.

---

## 5. À supprimer

| Quoi | Où | Pourquoi |
|---|---|---|
| « Remplacez ces chiffres par les vôtres. » | accueil, calculateurs | c'est une marche à suivre écrite. Des champs remplis se comprennent seuls. Rend 36 px au bloc le plus serré sur téléphone |
| Sous-listes des 7 partenaires (23 lignes) | accueil, partenaires | 235 mots dans le bloc le plus dense. Titre + une phrase suffit. **Décision de Paul** (contrat du 27/10) |
| « Déjà équipés ? Nous vérifions… » | accueil, sous les étapes | 136 caractères sur une ligne, hors des trois étapes. À supprimer ou à verser dans les questions. **Décision de Paul** |
| « Pour les PME, les ETI et les grands groupes. » en ligne grise isolée | accueil, sous les offres | ligne orpheline. À remonter sous le titre, ou à retirer |
| Cadre canard autour des technologies | accueil | seul bloc encadré bord à bord, ressemble à un élément sélectionné |
| Barre canard de 3 px des calculateurs | accueil | un style de carte de plus pour rien |
| Les fragments en gras de cinq titres | accueil | sans règle, sans sens commun |
| Le centrage du terrain | accueil | seul bloc centré du site |
| Le fond canard du bouton | bas des pages d'offre | le bouton principal change de couleur selon la page |
| Le titre à 84 px | pages d'offre | une taille que rien d'autre n'emploie |
| Bandeau « PRENDRE RENDEZ-VOUS · CHOISISSEZ UN CRÉNEAU » et pied « VISIO » | page rendez-vous | redit le titre de la page, seul texte en capitales du site, déjà masqué sur l'accueil |
| Extraits des articles | pages d'offre, « À lire dans le Journal » | 3 à 4 lignes grises par article, déjà lues sur l'index. Titre + date suffisent. Jugement |
| Second « Dernière mise à jour : octobre 2026 » | mentions légales | doublon |
| Le filet encre de 2 px | mentions légales | seul de son espèce |
| `clamp(56px, 9vh, 112px)` | `single-page.css` l. 256 | fait varier le rythme avec la hauteur de la fenêtre |
| `--rule-l` (`#B8CDD1`) comme filet de page | offres, Journal, mentions légales | quatrième gris pour le même rôle |

---

## Annexe : passage des règles de la grille `ux-audit`

| Règle | État | Preuve ou remarque |
|---|---|---|
| 1. On comprend l'activité en un coup d'œil | partiel (jugement) | le sélecteur « Je veux… » aide ; texte fixé par décision, hors périmètre |
| 2. Pas de négation | conforme | sans objet |
| 3. Bouton principal visible sans défiler | conforme, mesuré | bouton de y = 553 à 632 à 1440 × 800 ; visible à 390 × 700 |
| 4. Pas de mur de texte en haut | conforme | 96 mots, schéma compris |
| 5. Phrases testées de l'extérieur | non audité | texte, hors périmètre |
| 6. Bouton = un verbe, un ou deux mots | défaut mineur | « Lire nos retours de terrain » |
| 7. Jamais « mon » dans un bouton | conforme | sans objet |
| 8. La barre porte toujours une action | partiel | présente au chargement ; la barre ne suit pas le défilement (décision du 27/10). Entre les calculateurs (y = 1687) et le contact (y = 5945), 4 250 px sans bouton principal |
| 9. Un seul design de bouton | **défaut** | incohérence 3 |
| 10. Actions à droite dans la barre | conforme | sans objet |
| 11. Contraste | non remesuré | test du dépôt |
| 12. Le non-cliquable prend un filet simple | défaut | incohérence 7 |
| 13. Un parti pris d'angles | conforme | angles droits partout, sauf le calendrier tiers |
| 14. Chevron pour déplier | conforme | triangles natifs |
| 15. L'accent a un seul sens | **défaut** | incohérence 8 |
| 16. La direction visuelle suit le texte | partiel | progression de gauche à droite, pictogrammes décalés |
| 17. Les blocs occupent la largeur | défaut | calendrier à 532 px sur 1080 |
| 18. Deux langues visibles, état actif marqué | défaut mineur | incohérence 16 |
| 19. Respiration hiérarchisée | **défaut** | incohérence 5 |
| 20. Un seul axe | **défaut** | incohérence 4 |
| 21. Tout artefact porte une étiquette | conforme | logos, photos, schéma étiquetés |
| 23. Preuve d'humanité | conforme | vraies photos |
| 24. Titres coupés à la frontière de phrase | défaut | incohérence 12 |
| 26. Un chiffre-clé est un objet graphique | conforme aux calculateurs, absent ailleurs | incohérence 6 |
| Confiance et premier pas | conforme | logos, photos, appel de 15 minutes mis en avant |
