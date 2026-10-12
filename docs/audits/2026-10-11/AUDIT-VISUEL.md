# Audit visuel parrit.ai : alignement et finition (prod, 11/10/2026)

Auditeur : rôle évaluateur, en lecture seule. Aucune écriture dans le dépôt.
Périmètre : 10 pages × FR/EN × 1440×900 et 375×812 (40 rendus), avec `reducedMotion: reduce`.
Captures : `shots/` (pleine page et `_fold`), découpes lisibles dans `crops/`. Mesures DOM brutes : `measures.json`, `probe.json`, `probe_d.txt`.
Sources : `src/app/(rev01)/rev01.css` (abrégé **R**), `src/system/system.css` (**S**), pages `src/app/(rev01)/*/page.tsx`.
Consigne fondateur intégrée : on ne redessine rien. Chaque correction garde le design existant : mêmes composants, mêmes compositions, seulement les cotes, les bords communs et la cohérence.

Statut des faits : chaque valeur en px vient d'une mesure `getBoundingClientRect` en prod (CONSTATÉ). Quand une cause est déduite du CSS sans avoir été testée en local, je l'écris « déduit ».
`/sketch` renvoie 404 et `/fr/sketch` redirige (301) vers `/sketch`, donc 404 aussi. Seul `/sketch/[id]` existe : page non auditée.

---

## Tableau récapitulatif

| # | Prio | Défaut | Pages | Écart mesuré |
|---|---|---|---|---|
| 1 | P0 | Le bord gauche saute entre l'accueil (et le pied de page global) et tout le reste | toutes | 140 vs 180 px (40 px) |
| 2 | P0 | Logo du header décalé par rapport au contenu sur mobile | toutes, 375 | 12 vs 20 px |
| 3 | P0 | Point final orphelin hors des crochets dans le titre de l'accueil (mobile), crochets asymétriques (desktop) | / | « . » seul sur 1 ligne ; 9 px de décalage |
| 4 | P0 | Paragraphe du panneau « Your agent · Sketch » décentré | / | centre 651 vs 720 (69 px) |
| 5 | P0 | Dates du Journal coupées sur deux lignes (« 2026-10- / 11 ») | /journal, /fr/journal | colonne de 120 px |
| 6 | P0 | Codes « PS- / 01 » coupés dans le tableau du Standard | /standard, /fr/standard | colonne de 92 px |
| 7 | P0 | Notes centrées dont la boîte reste calée à gauche (« 15 min · … », « Not published… ») | / | centre 457 vs 720 (263 px) |
| 8 | P1 | Pied de page global : « Founded by » 12 px plus bas, espace manquant avant « · » | toutes | baseline +12 px |
| 9 | P1 | Deux pieds de page empilés sur chaque page intérieure, en 6 variantes | 9 pages | — |
| 10 | P1 | Écart titre de section → contenu gonflé par les marges navigateur du h2 | /systems, /build-with-you, /manufacture | ~95 px vs 34 px sur l'accueil |
| 11 | P1 | Interlignage du corps de texte incohérent dans une même page | /systems, /build-with-you | 1.45 / 1.7 / 1.8 |
| 12 | P1 | Hauteur d'attaque du hero différente selon la page | 8 pages | surtitre à y = 133 à 205 |
| 13 | P1 | Titres de cartes décalés dans une même rangée (surtitres de 1 à 3 lignes) | /dossiers, /systems | 20 px |
| 14 | P1 | Carte de preuve du hero Systems invisible : texte en retrait qui flotte | /systems | retrait 24 px sans cadre |
| 15 | P1 | Widget Cal.com plus étroit que la colonne, en français sur la page EN, texte coupé | /commission | 860 vs 1080 px |
| 16 | P1 | Trois variantes du bloc d'appel final (interlignage, police de la note) | /, /manufacture, /dossiers, /systems, /build-with-you | lh 1.04 vs ~1.35 |
| 17 | P1 | Filets de liste plus courts que le filet de tête | /, /journal | 712 vs 1080/1160 px |
| 18 | P1 | Libellés mono qui se coupent avec un mot orphelin | /systems, /commission, /journal (m), / (m) | — |
| 19 | P1 | Article et mentions légales sur d'autres bords gauches que le site | article, /legal | 374 et 280 vs 180 px |
| 20 | P1 | Mobile : gouttière de l'article à 16 px au lieu de 20 | article (m) | 16 vs 20 px |
| 21 | P1 | Rangée du header : hauteurs mélangées | toutes | 44 / 48 / 50 px |
| 22 | P1 | Lien mono en ligne qui ouvre l'interligne d'un paragraphe | /manufacture | 33 vs 23 px |
| 23 | P1 | En-tête du panneau Sketch : un libellé à gauche, l'autre centré (mobile) ; 1 ligne en EN, 2 en FR (desktop) | / (m), /fr | — |
| 24 | P1 | Journal FR et article FR affichés en anglais | /fr/journal, /fr/journal/* | — |
| 25 | P2 | Boutons empilés de largeurs différentes (mobile) | /systems (m) | 215 vs 257 px |
| 26 | P2 | Rythme vertical des sections de l'accueil non tenu | / | 64 / 78 / 80 / 100 / 110 px |
| 27 | P2 | Scène produit : libellés qui flottent, maquette décalée de 4 px sur mobile | / | — |
| 28 | P2 | Double filet en bas d'article | article | 25 px entre deux filets |
| 29 | P2 | Liste « Guardrails » : 4 puces soulignées, 1 non | /systems | — |
| 30 | P2 | Marque : plusieurs roses par écran ; rayons sur la maquette de téléphone | /, /commission, /manufacture | — |
| 31 | P2 | Contenu : chapô de Build With You qui répète le H1 ; « BUILD WITH YOU » non traduit en FR | /build-with-you | — |

---

## P0 : premier écran, CTA, défauts visibles immédiatement

### 1. Le bord gauche saute de 40 px entre l'accueil et le reste du site
- **Où** : `/` et `/fr` (toutes les sections), plus le pied de page global (`RevFooter`) **sur toutes les pages**, à 1440.
- **Constat** : le header (`.cmdbar-inner`), `.r2-wrap` et `.rev-wrap` mettent le contenu à **x = 180** (1160 px de colonne, 40 px de rembourrage intérieur). `.home-s-wrap` le met à **x = 140** (1160 px sans rembourrage). Sur l'accueil, le logo est donc à 180 et tout le contenu en dessous à 140. En bas de chaque page intérieure, le contenu est à 180, puis le pied de page global repart à 140. Le commentaire de **R:343-344** dit déjà que « le bord gauche ne saute jamais entre pages » : c'est exactement ce qui casse.
- **Source** : **R:1728-1731** `.home-s-wrap { width: min(1160px, calc(100% - 80px)); }` ; `src/system/components/RevFooter.tsx:37` (le pied de page utilise `home-s-wrap`).
- **Correction** : aligner `.home-s-wrap` sur les cotes de `.r2-wrap` :
  ```css
  .home-s-wrap { width: 100%; max-width: 1160px; margin: 0 auto; padding-inline: 40px; }
  @media (max-width: 760px) { .home-s-wrap { padding-inline: 20px; } }
  ```
  Supprimer aussi le plafond tablette `width: min(100% - 40px, 620px)` (**R:2209**). Entre 760 et 859 px, il centre une colonne de 620 px alors que le header reste calé à gauche. À vérifier après correction : la grille 3 colonnes du pied de page et les cartes « Ways to start » passent de 1160 à 1080 px de large, ce qui est voulu.

### 2. Mobile : le logo est à 12 px du bord, le contenu à 20 px
- **Où** : header, toutes les pages, à 375.
- **Constat** : logo à x = 12, contenu à x = 20, article à x = 16. Trois bords gauches dans le même écran.
- **Source** : **R:3310** `@media (max-width:1000px) .cmdbar-inner { padding-inline: 12px }` et **R:3317** (même chose à 760 px). Ces deux règles écrasent le `padding: 0 20px` de **R:125-129**.
- **Correction** : `padding-inline: 20px` dans les deux media queries (ou supprimer les deux surcharges). Pour que tout tienne à 375 px, réduire si besoin `.cmd-menu-toggle { padding-inline: 8px }` (déjà présent) et `.locale-toggle button { min-width: 44px }`.

### 3. Titre de l'accueil : point orphelin (mobile) et crochets asymétriques (desktop)
- **Où** : `/` et `/fr`, h1 du hero.
- **Constat** :
  - À 375 px, le « . » tombe seul sur une 5e ligne, **sous** les crochets roses (capture `shots/en_home_m_fold.png`).
  - À 1440 px, les crochets encadrent « systems that work » sans le point : le cadre est centré à x = 711 alors que la ligne est centrée à x = 720. Le crochet gauche est à 79 px du texte, le droit à 58 px.
- **Source** : `src/app/(rev01)/page.tsx:215` `<span className="frame">{copy.hero.frame}…</span>{copy.hero.after}` ; **R:3325-3330** (sur mobile, `.frame` passe en `white-space: normal`).
- **Correction** (même dessin, même copy) : mettre la ponctuation **dans** le cadre. Soit `frame: "systems that work."` / `"systèmes qui fonctionnent."` avec `after: ""`, soit rendre `{copy.hero.after}` à l'intérieur du `<span className="frame">`, avant le `<i className="fx">`. Le cadre redevient symétrique et le point ne peut plus se détacher. Si le point doit rester hors du cadre : `.home-s-hero-ending { white-space: nowrap }` sur mobile, avec le dernier mot et le point dans un `<span>` insécable.

### 4. Panneau « Your agent · Sketch » : paragraphe décentré
- **Où** : `/`, `/fr`, hero, à 1440 (visible au premier écran).
- **Constat** : `.agent-esquisse-body > p` va de x = 295 à 1007 (largeur max 712 px), centre à **651**, alors que le panneau et le formulaire sont centrés à **720**. L'écart de **69 px** saute aux yeux, au-dessus d'un champ qui, lui, est centré.
- **Source** : la mesure par défaut de **R:3300** `:where(.rev-page …) :where(p, li, dd) { max-width: 68ch }` combinée à **R:1667** `.agent-esquisse-body p { margin: 0 0 20px }` (pas de marges latérales auto).
- **Correction** : `.agent-esquisse-body p { margin: 0 auto 20px; }`. Ou `max-width: none` si le paragraphe doit prendre la largeur du formulaire (850 px), ce qui donne un bord gauche commun avec le champ à x = 295. Recommandé : `max-width: none; text-align: left`, puisque l'en-tête du panneau est lui-même calé à gauche à x = 295.

### 5. Journal : dates coupées « 2026-10- / 11 »
- **Où** : `/journal`, `/fr/journal`, à 1440 (toutes les entrées).
- **Constat** : `<time>` est dans une colonne de **120 px**, en mono 16 px avec un interlettrage de 0,16 em. « 2026-10-11 » mesure environ 140 px et passe donc sur deux lignes.
- **Source** : **R:1069** `grid-template-columns: minmax(0, 1fr) 120px;` et **R:1091-1098**.
- **Correction** : `.journal-list a { grid-template-columns: minmax(0, 1fr) max-content; } .journal-list time { white-space: nowrap; }`.

### 6. Standard : codes « PS- / 01 » coupés
- **Où** : `/standard`, `/fr/standard`, à 1440.
- **Constat** : la colonne `.doctrine-code` fait 92 px. Avec 22 px de rembourrage de chaque côté, il reste 48 px pour « PS-01 », qui casse après le tiret. Sur mobile, le code tient sur une ligne : le desktop est donc moins soigné que le mobile.
- **Source** : **R:824** `grid-template-columns: 92px minmax(280px, 32%) minmax(0, 1fr);` (et **R:2452**, même 92 px).
- **Correction** : `.doctrine-code .k { white-space: nowrap; }` et colonne à `104px` (ou `max-content`).

### 7. Notes centrées dont la boîte reste calée à gauche
- **Où** : `/`, `/fr`. Bloc d'appel final (« 15 min · An examination, on a video call, with the founder ») et bandeau des clients (« Not published. Shared in person. »).
- **Constat** : boîte de x = 140 à 773 avec `text-align: center`, donc centre à **457** au lieu de 720. **263 px** de décalage, sous un titre et un bouton qui sont, eux, centrés (`crops/en_home_d_05.png`).
- **Source** : **R:3300** (`max-width: 68ch`) avec **R:2146** `.home-s-close-note { margin: 0 0 30px }` et **R:1929** `.home-s-brands-list + p { margin: 0 }`.
- **Correction** : `.home-s-close-note { margin: 0 auto 30px; } .home-s-brands-list + p { margin: 0 auto; }`. Règle générale à poser une fois : tout `p` à l'intérieur d'un bloc `text-align: center` reçoit `margin-inline: auto`.

---

## P1 : cohérence entre pages, rythme, grilles

### 8. Pied de page global : lignes de base décalées et espace manquant
- **Où** : toutes les pages, `.home-s-footer`.
- **Constat** :
  - « FOUNDED BY PAUL LARMARAUD » a sa ligne de base **12 px plus bas** que « COMMISSIONED, NOT SUBSCRIBED » et « © 2026 PARRIT.AI » : le lien fait 44 px de haut, les `span` 20 px.
  - Les liens s'affichent « The Manufacture· the method » : l'espace avant le point médian disparaît.
  - Les trois éléments de méta (x = 140, 450, 794) ne tombent pas sur les 3 colonnes de la nav au-dessus (140, 527, 913).
- **Source** : **R:3289-3294** (`.home-s-footer a { display: inline-flex; min-block-size: 44px }`), **R:2192** (`.home-s-footer-meta` en flex sans `align-items`). Dans `RevFooter.tsx:39`, le `<small> · …</small>` est un élément flex : son espace de tête est supprimé.
- **Correction** :
  ```css
  .home-s-footer-meta { align-items: center; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .home-s-footer nav a { gap: .35em; }   /* et retirer l'espace dans " · " côté TSX : <small>· {description}</small> */
  ```

### 9. Deux pieds de page empilés, en 6 variantes
- **Où** : `/systems` (« PARRIT / SYSTEMS · 2026 » + Legal), `/manufacture` (4 éléments sur 2 lignes, dont « LEGAL » et un deuxième « © 2026 PARRIT.AI »), `/dossiers` (« © 2026 PARRIT.AI »), `/build-with-you`, `/journal`, `/commission`, `/legal`, `/standard` (`rev-footer` avec filet de 2 px), article (`journal-article-footer`). Le pied de page global `RevFooter` suit chaque fois.
- **Constat** : chaque page intérieure a un mini-pied local à x = 180, puis le pied global à x = 140. Le copyright apparaît deux fois sur /manufacture et /dossiers. Les filets varient : 1 px clair, 1 px sombre, 2 px encre.
- **Source** : `systems/page.tsx:335`, `manufacture/page.tsx:85`, `dossiers/page.tsx:120`, `build-with-you/page.tsx:110`, `journal/page.tsx:55`, `commission/page.tsx:56`, `standard/page.tsx:105`, `legal/page.tsx:26`, `journal/[slug]/page.tsx:112` ; styles **R:2663** `.r2-footer`, **R:628** `.rev-footer`.
- **Correction** (aucun composant nouveau) : garder une seule ligne locale, au même format partout (`RegistryLine` seule, filet 1 px `--rule-*`, sans Legal ni ©, qui sont déjà dans le pied global). Ou la supprimer et laisser `RevFooter` seul. Le correctif n° 1 aligne ensuite les deux à x = 180.

### 10. Écart titre de section → contenu de ~95 px (34 px sur l'accueil)
- **Où** : `/systems`, `/build-with-you`, `/manufacture` (FR et EN, 1440 et 375).
- **Constat** : `.r2-shead` fait **120 px** de haut pour un h2 de 54 px, parce que le h2 garde la marge par défaut du navigateur (0,83 em = 33,2 px en haut et en bas). On a ensuite `margin-bottom: 44px`, puis 18 px de marge sur le paragraphe. Bilan : ~95 px de vide entre « What you bring. » et son texte (`crops/en_build-with-you_d_01.png`). Le même rôle sur l'accueil donne 34 px.
- **Source** : **R:1475-1482** `.r2-shead` ; **R:1484** `.r2-ed` (aucune remise à zéro de marge).
- **Correction** : `.r2-shead h2, .r2-shead .r2-ed { margin: 0; }`. Garder `margin-bottom: 44px` sur `.r2-shead`, ou l'aligner sur l'accueil (34 px) pour une seule cote de site.

### 11. Interlignage du corps de texte incohérent
- **Où** : `/systems` (paragraphes à 26,1 px = 1.45, 30,6 px = 1.7 et 32,4 px = 1.8 dans la même page), `/build-with-you` (1.8 contre 1.45 dans le hero).
- **Source** : styles en ligne `systems/page.tsx:301` (`lineHeight: 1.7`), `:305` (`1.8`) ; `build-with-you/page.tsx:95, 99, 103` (`1.8`). Contre **R:3296** (`1.45`) et **R:2994-3018** (`1.6`).
- **Correction** : retirer les `style={{ lineHeight }}` et poser une seule valeur de corps, par exemple `:where(.r2-section) p { line-height: 1.6 }`. Au passage, ce sont 18 styles en ligne dans `(rev01)`, à purger.

### 12. Hauteur d'attaque du hero différente selon la page
- **Constat** (y du surtitre à 1440) : /systems, /manufacture, /dossiers, /build-with-you = **172** ; /commission = **161** ; /legal = **141** ; /journal = **138** ; /standard = **133** ; article = **205**. Le titre de page « saute » de 0 à 70 px quand on navigue.
- **Source** : **R:1494** `.r2-hero { padding: 98px 0 0 }`, **R:353** `.rev-hero { padding: 96px 0 72px }`, padding de 84 px pour /commission (mesuré), 64 px pour `.legal-wrap > header` et le journal, `.standard-intro`, **R:1101** `.journal-article { padding: var(--s8) 0 0 }`.
- **Correction** : une seule cote d'attaque, `padding-top: 98px` (valeur de `.r2-hero`), appliquée à `.standard-intro`, à l'en-tête de `/journal`, à `.legal-header` et au hero de `/commission`. Même `margin-bottom` entre surtitre et h1 partout : 26 px (`.r2-hero .k`). Les pages claires utilisent aujourd'hui environ 12 px.

### 13. Titres de cartes décalés dans une même rangée
- **Où** :
  - `/dossiers` à 1440 : les surtitres font 40 / 40 / **60** px de haut (3e carte sur 3 lignes), donc h3 à y = 970 / 970 / **990**.
  - `/systems`, « Demonstrated capabilities » : surtitre sur 2 lignes à gauche (« YOUR INFORMATION, ONE VERSION THAT / COUNTS »), donc h3 à y = 4486 contre 4466 à droite. Les sous-libellés INPUT / PROCESS sont décalés de 20 px dans toute la carte.
  - Même effet en FR (libellés plus longs).
- **Source** : **R:2337-2350** `.r2-dossier`, `.r2-dossier .ref` ; cartes `SystemCard`.
- **Correction** : sous-grille, sans changement de dessin :
  ```css
  .r2-dossiers { grid-template-rows: auto auto 1fr auto; }
  .r2-dossier { display: grid; grid-row: span 4; grid-template-rows: subgrid; }
  ```
  Même principe pour la grille des cartes système. Repli simple : `min-height: 3lh` sur `.r2-dossier .ref` et `2lh` sur le surtitre des cartes système.

### 14. Carte de preuve du hero Systems invisible
- **Où** : `/systems`, `/fr/systems`, hero (1440 et 375).
- **Constat** : « INTERNAL USE · OBSERVED… / The list that's trusted / … » est en retrait de **24 px** (x = 204) sous un chapô à x = 180, sans cadre visible : fond `--ink` sur fond `--carbon`. Le bloc a l'air mal aligné.
- **Source** : **R:3191-3197** `.systems-hero-proof-card { padding: 20px 24px; background: var(--ink); }`.
- **Correction** : rendre le cadre lisible, comme les autres cartes du site : `border: 1px solid var(--rule-d)`. Sinon supprimer le rembourrage horizontal (`padding: 20px 0`) pour retomber sur x = 180.

### 15. /commission : widget de réservation hors grille et hors langue
- **Constat** :
  - `.cal-instrument` fait 860 px centré (x = 290 à 1150), alors que le chapô au-dessus et l'encadré « You leave with a clear direction » en dessous font 1080 px (180 à 1260). Trois largeurs en un écran.
  - Le widget affiche « Audit offert · 15 min » et une description en **français**, coupée par un fondu (« … offertes. Gratuit, sans »), sur la page **anglaise**.
  - Les rayons et les puces de Cal.com contredisent radius 0 (contenu tiers).
- **Source** : **S:594-599** `.cal-instrument { max-width: 860px; margin: 0 auto }`.
- **Correction** : `.cal-instrument { max-width: none; }` (bord commun 180 à 1260). Côté Cal.com : un événement EN pour `/commission`, une description courte qui n'est plus coupée, et le thème du widget en `borderRadius: 0` si l'option existe dans `CalInline` (à vérifier dans la doc Cal embed).

### 16. Trois variantes du bloc d'appel final
- **Constat** :
  - Accueil (`.home-s-close`) : h2 54 px, interligne 1.04, note en sans-serif, bouton rose.
  - /manufacture, /dossiers, /systems, /build-with-you (`.r2-close`) : h2 54 px avec `line-height: normal`, soit ~73 px entre deux lignes (« The Examination / comes first. » paraît relâché), note en **mono**.
  - /build-with-you : prix en sans 22 px au lieu de la note.
  - Padding : 100/100 (accueil) contre 130/120 (r2).
- **Source** : **R:2633-2661** `.r2-close`, **R:2128-2148** `.home-s-close`.
- **Correction** : `.r2-close h2 { line-height: 1.04; letter-spacing: -.035em; }` (valeurs de `.home-s h2`), une seule police pour la note (choisir mono **ou** sans, partout) et une seule cote de padding (110/110, la cote de section de l'accueil).

### 17. Filets de liste plus courts que le filet de tête
- **Où** : `/journal` (filet de tête 1080 px, filets des entrées 712 px : x = 180 à 892) ; accueil, section Journal (tête 1160, entrées 140 à 852).
- **Source** : la mesure `68ch` de **R:3300** s'applique aux `li` ; **R:1063**, **R:2103**.
- **Correction** : `.journal-list li, .home-s-journal li { max-width: none; }`. Garder la mesure de lecture sur le `p` à l'intérieur, pas sur le `li`. Les dates passent alors en fin de rangée, à droite (x = 1260), comme le reste des colonnes de date du site.

### 18. Libellés mono coupés avec un mot orphelin
- **Constat** : « THE SYSTEM WE USE OURSELVES, EVERY / DAY. » (/systems hero et carte) ; « VERIFIABLE ON EVERY UPDATE TO THIS / SITE. » ; « ONE PERSONAL REPLY PER COMPANY · NO / AUTOMATED SEQUENCE » (/commission) ; « PARRIT / JOURNAL · REV 01 / · 2026 » (/journal à 375) ; « AN EXAMPLE, NOT AN / ANALYSIS OF YOUR / COMPANY » (accueil à 375) ; surtitres de /dossiers.
- **Source** : **S:274-281** `.k` (interlettrage 0,18 em, sans `text-wrap`).
- **Correction** : `.k { text-wrap: balance; }` et, pour les séparateurs, un espace insécable autour de « · » (` · `) dans `RegistryLine`, pour qu'un « · » ne commence jamais une ligne.

### 19. Article et mentions légales sur d'autres bords gauches
- **Constat** : article à x = **374** (colonne de 66 ch centrée), /legal à x = **280** (960 px centrés), tout le reste à x = 180. Depuis /journal (x = 180), le clic vers un article déplace tout le texte de 194 px.
- **Source** : **R:1101-1104** `.journal-article { width: min(100% - var(--s6), 66ch); margin: 0 auto }`, **R:956** `.legal-wrap { max-width: 960px }`.
- **Correction** (même colonne de lecture, ancrée sur le bord commun) : article dans un `.rev-wrap` (180 à 1260) avec `.journal-article > * { max-width: 66ch }`, aligné à gauche ; `.legal-wrap { max-width: 1160px }` en conservant sa grille interne 2 colonnes.

### 20. Mobile : gouttière de l'article à 16 px
- **Constat** : article de x = 16 à 359, tout le reste à 20 px (et le header à 12 px, voir n° 2).
- **Source** : **R:1245-1247** `.journal-article { width: min(100% - var(--s4), 66ch) }` (`--s4` = 32 px, donc 16 px par côté).
- **Correction** : `calc(100% - 40px)`, ou mieux, le correctif n° 19 (`.rev-wrap`, déjà réglé à 20 px).

### 21. Rangée du header : hauteurs mélangées
- **Constat** : à 1440, liens de nav 44 px (y = 10), boutons FR/EN 48 px (y = 8) dans un groupe de 50 px (y = 7), CTA 48 px (y = 8). À 375, MENU fait 44 px (y = 10) à côté de FR/EN à 48 px : les cadres ne s'alignent ni en haut ni en bas (`shots/en_home_m_fold.png`).
- **Source** : **R:1331-1336** `.cmd-menu-toggle { min-height: 44px; padding: 10px 14px }` ; `.locale-toggle`, dont le conteneur a une bordure de 1 px.
- **Correction** : `.cmd-menu-toggle { min-height: var(--button-min-height); }` (48 px) et `.locale-toggle { border: 0 }`, avec la bordure portée par les boutons, pour que groupe, MENU et CTA mesurent tous 48 px.

### 22. /manufacture : lien mono en ligne qui ouvre l'interligne
- **Constat** : « … identical for any system / delivered. READ THE STANDARD » : 33 px entre les deux lignes au lieu de 23 px, parce que le lien prend 44 px de haut à l'intérieur du paragraphe.
- **Source** : **R:3289-3294** (`a.k { display: inline-flex; min-block-size: 44px }`) appliqué à un lien dans `.r2-registre-note` (**R:2403**).
- **Correction** : `.r2-registre-note a.k { display: inline; min-block-size: 0; }` (la cible tactile reste celle d'un lien en ligne, comme le prévoit le commentaire de **R:3271**).

### 23. En-tête du panneau Sketch : alignements mélangés
- **Constat** : à 375, « YOUR AGENT · SKETCH » est à gauche (x = 45) et « AN EXAMPLE, NOT AN ANALYSIS… » centré sur 3 lignes, dans le même en-tête. À 1440, l'EN tient sur une ligne (`space-between`) alors que le FR passe sur 2 lignes calées à gauche : deux dessins pour le même composant.
- **Source** : **R:1648-1655** `.agent-esquisse-header` (flex, `space-between`, `wrap`) qui hérite du `text-align: center` du hero (**R:1749**).
- **Correction** : `.agent-esquisse-header { text-align: left; flex-direction: column; gap: 8px; }` dans les deux langues. Le dessin le plus robuste est celui que le FR affiche déjà.

### 24. Journal FR en anglais
- **Constat** : `/fr/journal` affiche le H1 en FR mais **toutes les entrées en anglais** (liens `hreflang="en"` vers `/journal/...`). `/fr/journal/agent-ia-entreprise`, dont le slug est français, affiche l'article en anglais.
- **Correction** : contenu ou routage, pas de CSS. Soit servir les versions FR, soit indiquer clairement « (EN) » sur chaque entrée. Non bloquant visuellement, mais incohérent pour un lecteur FR.

---

## P2 : finition

### 25. Boutons empilés de largeurs différentes (/systems, 375)
« Book the examination » fait 215 px, « Demonstrated capabilities. » 257 px. Correction : `@media (max-width:760px) { .systems-hero-actions { flex-direction: column; align-items: stretch; } }`. Même règle pour toute paire de boutons empilés.

### 26. Rythme vertical des sections de l'accueil
Padding haut/bas mesurés à 1440 : hero 72/64, clients 64/64, méthode 110/110, Build 110/110, preuve 64/64, offres **80/110** (asymétrique), journal 110/110, appel final 100/100. À 375 : 74/60, 64, 78, 78, 64, **56**, 78, 100.
Correction : deux cotes seulement, 110 (section) et 64 (bandeau), en desktop comme en mobile (78/44). Offres : `padding: 110px 0`. Appel final : 110.

### 27. Scène produit (« What we build »)
- « In your CRM » flotte à mi-hauteur (y ≈ 906), sans alignement avec le haut du téléphone (y = 363) ni avec son en-tête : la colonne 3 est alignée en bas (`align-self: end`, **R:2075**). « Fictional example » flotte en bas de la colonne texte, sans lien visuel avec la maquette.
- Mobile : la maquette du téléphone est à x = 24, le texte à 20 (4 px).
- Correction, sans recomposer : `.product-scene-object { align-self: start; margin-top: <hauteur de l'en-tête du téléphone> }` ou alignement des deux objets en bas (déjà le cas), avec le libellé collé au-dessus de l'image. Mettre la mention fictive à la même ligne de base que le bas du téléphone (elle y est à 24 px près). Mobile : retirer le décalage de 4 px de `.scene-chat`.

### 28. Double filet en bas d'article
Le dernier lien de `.journal-related` a un `border-bottom`, puis `.journal-article-footer` un `border-top` : deux filets à 25 px d'écart. Correction : `.journal-related a:last-child { border-bottom: 0; }`.

### 29. Liste « Guardrails » (/systems)
Quatre puces sont des liens soulignés, la cinquième est du texte nu. Visuellement, la liste paraît incohérente. Correction : retirer le soulignement dans cette liste (`text-decoration: none`, avec une flèche ou le soulignement au survol seulement), ou ajouter un lien à la 5e puce.

### 30. Contraintes de marque (à arbitrer)
- **Une seule pastille rose par écran** : au premier écran de l'accueil, on compte 4 coins roses, le bouton « Sketch » rose et le point rose du logo. Sur /commission : jour sélectionné « 13 », bouton « Send to Paul » et texte du CTA du header. Sur /manufacture et /build-with-you : numéros de phase 01/02/03 en rose, plus le bouton final.
- **Radius 0** : la maquette du téléphone a 24/12/20 px de rayon (`.scene-chat`, `.scene-chat-bubble`, `.scene-chat-input`). Exception documentée « VS-PRODUCT-SCENE » dans **R:2052** pour les marqueurs, pas pour le téléphone. La carte CRM a rayon et ombre dans l'image elle-même.
- **Zéro ombre ni dégradé** : aucune ombre CSS ni dégradé mesuré sur les 40 rendus. Conforme.

### 31. Contenu (signalé, hors alignement)
- /build-with-you : le chapô répète mot pour mot le H1 (« In 10 hours with the founder, you build a system that runs »). Trois tailles de texte s'empilent ensuite sous le H1.
- /fr/build-with-you : le surtitre « BUILD WITH YOU » n'est pas traduit, alors que le CTA l'est.
- Mentions visibles « Fictional example » / « Exemple fictif » et « AN EXAMPLE, NOT AN ANALYSIS OF YOUR COMPANY » : présentes et lisibles. Je les laisse à l'arbitrage du fondateur.

---

## Ce qui est propre (mesuré)
- Aucun débordement horizontal : `scrollWidth == clientWidth` sur les 40 rendus.
- Aucun texte tronqué hors les `sr-only` (voulu) et la description Cal.com (n° 15).
- Images : aucune déformation (`object-fit: fill` mais ratio d'affichage = ratio natif pour le portrait, la carte de visite et la fiche CRM).
- Les pages intérieures (/systems, /manufacture, /dossiers, /build-with-you, /standard, /commission, /journal) partagent bien le bord x = 180 et le bord droit x = 1260 à 1440, et x = 20 à 375. C'est l'accueil, le pied de page global, l'article et /legal qui sortent de la grille.

## Ordre de correction conseillé
1. n° 1 et n° 2 : un bord gauche unique, 180 desktop et 20 mobile, header compris. Corrige la majorité de l'impression de désalignement.
2. n° 3, 4, 7 : premier écran et appel final de l'accueil.
3. n° 5, 6 : ruptures de mots visibles.
4. n° 8 à 12 : pied de page, rythme vertical, attaque des heros.
5. Le reste.

Méthode de preuve à rejouer après correction : `node run.js && node probe.js` dans ce dossier. Critère : un seul x de bord gauche pour les blocs de premier niveau (180 / 20), `.home-s-close-note` centré à 720, aucune `<time>` ni `.doctrine-code` sur plus d'une ligne (h ≤ 24 px).
