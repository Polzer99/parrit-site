# parrit.ai : alignement au pixel et retrait de l'AI slop (11/10/2026)

Ordre direct de Paul (11/10/2026) : « corriger tous les désalignements, tous les signes d'AI slop […] il ne faut pas qu'il y ait
écrit "exemple fictif" […] exigeant, top consulting », puis : « le site est beau, il faut juste l'aligner, parce qu'on produit des
slides qui sont propres, mais le site ça ne va pas ». Exemple de formulation à bannir cité par Paul : « Pas publiés. Partagés en
rendez-vous. »

**Cadre non négociable : on ne redessine rien.** Mêmes composants, mêmes compositions, même palette, même typo. On corrige les
cotes, les bords communs, le rythme, et la copy (réécritures minimales). Aucun nouveau composant, aucune nouvelle section.

Annexes qui font foi pour le détail (mesures en px, fichier:ligne, texte actuel, réécriture FR et EN), recopiées en fin de
ce fichier : **ANNEXE A, audit visuel** (31 défauts, mesurés en prod sur 40 rendus) et **ANNEXE B, audit copy** (inventaire FR/EN
des tells et incohérences). Copies aussi sous `docs/audits/2026-10-11/`. Les références « AUDIT-VISUEL.md » et « AUDIT-COPY.md »
ci-dessous désignent ces annexes. Les points que les annexes laissent « à l'arbitrage de Paul » sont tranchés par ce document ;
à défaut, ne rien changer.

## 1. Alignement (AUDIT-VISUEL.md)

Implémenter **tous** les correctifs n° 1 à 23 et 25 à 29, dans l'ordre conseillé du rapport, avec la correction CSS proposée ou
une correction équivalente qui donne la même mesure. Invariants à obtenir :
- Un seul bord gauche pour tous les blocs de premier niveau, header, accueil, pied de page global, article et /legal compris :
  x = 180 à 1440 px, x = 20 à 375 px (logo du header compris). Bord droit 1260 à 1440.
- Les notes centrées sont réellement centrées (règle générale : `p` dans un bloc `text-align: center` → `margin-inline: auto`).
- Aucune `<time>` du journal ni code du Standard sur deux lignes ; libellés `.k` en `text-wrap: balance`, jamais un « · » en tête
  de ligne.
- Un seul pied de page local par page, au même format partout (`RegistryLine` seule, filet 1 px), sans doublon de © ni de Legal.
- Une seule cote d'attaque de hero (98 px) et une seule cote d'écart titre de section → contenu sur tout le site ; h2 sans marges
  navigateur ; plus aucun `style={{ lineHeight }}` en ligne dans `(rev01)` (une seule valeur de corps dans le CSS).
- Cartes d'une même rangée : titres sur la même ligne (subgrid ou `min-height` en `lh`).
- Les trois variantes du bloc d'appel final convergent (interligne du h2, une seule police pour la note, une seule cote de padding).
- Header : tous les éléments de la rangée à 48 px de haut.
- `.cal-instrument` sur la largeur de la colonne.
- Hors périmètre de cette tranche : n° 24 (journal FR en anglais, chantier de contenu), n° 30 (roses multiples et rayon du
  téléphone : arbitrage de marque, AGENTS.md admet le rayon du téléphone), réglage de l'événement Cal.com lui-même (geste Paul).

## 2. Copy (AUDIT-COPY.md)

Appliquer les réécritures FR **et** EN des sections 1, 2, 3 et 4 du rapport, avec ces arbitrages (Claude, 11/10) :
- **Supprimer** toute mention « Exemple fictif / Fictional example », « illustratif / illustrative », « pas une analyse de votre
  entreprise / not an analysis of your company », y compris aria-label, alt, et le mail automatique `lib/server/interets.ts`.
- « Pas publiés. Partagés en rendez-vous. » → « Les noms des clients sont communiqués en rendez-vous. » / « Client names are shared
  in a meeting. »
- **Note d'examen unique** : une constante par langue (même mécanique que `system/engagements.ts`), utilisée partout où la note
  apparaît : FR « 15 min · En visio, avec le fondateur » · EN « 15 min · Video call with the founder ». CalInline garde sa forme
  courte en capitales. Ne pas ajouter ni retirer le mot « offert » là où il figure aujourd'hui.
- Majuscule « Examen / Examination » réservée au nom de phase ; minuscule ailleurs.
- Codes internes : retirer « REV 01 / REV 02 », « PS-0x » → « 01…06 », « STD-1.0 » → « Le Standard / The Standard », « Registre P0 »
  → « Registre », dates ISO affichées en FR → « 13 septembre 2026 ». Le format `PARRIT / X · 2026` de la registry line reste.
- Tagline « Une commande, pas un abonnement / Commissioned, not subscribed » : **conservée uniquement dans le pied de page global**
  (canon TRUTH §1, arbitrage réservé à Paul). La retirer de CalInline, de `/sketch/[id]`, de l'image OG, du JSON-LD et de llms.txt.
- Métier en une phrase (TRUTH §1, rapport §5.2) : meta description de l'accueil, JSON-LD (`system/jsonld.ts`) et llms.txt. Le H1
  de l'accueil ne change pas ; l'image OG reprend le H1 au lieu de « Your company. One system. ».
- `public/llms.txt` : corriger le générateur `scripts/generate-llms.mjs` (zéro tiret cadratin ou demi-cadratin, zéro antithèse,
  six énoncés du Standard repris mot pour mot de `/standard`).
- Ne **pas** toucher : l'état des dossiers 26-002 / 26-003 et le corps vide de 26-002, les chiffres et la date de mesure du
  13/09/2026, les prix, le H1. Aucun fait, chiffre ou client nouveau.
- `AGENTS.md` : corriger la description de `Opening.tsx` (le composant n'est importé nulle part aujourd'hui), le format de la
  registry line (`PARRIT / X · 2026`, sans code de révision) et la mention « PS-01…PS-06 » (critères numérotés 01…06). Ne pas
  supprimer le composant `Opening.tsx`.

## 3. Gate anti-régression (cliquet)

Ajouter `tests/anti-slop-copy.spec.ts` (Playwright, inclus dans `qa:network:rev01`) qui charge chaque page publique en EN et en
FR (`/`, `/systems`, `/journal`, `/standard`, `/commission`, `/manufacture`, `/build-with-you`, `/dossiers`, `/legal`) et échoue
si le texte rendu (innerText + aria-label + alt) contient :
1. `[—–]` ;
2. `\b(fictif|fictive|fictional|illustrati(f|ve)|illustrées?|non interactive|pas une analyse|not an analysis)\b` (insensible à la casse) ;
3. `\bREV\s?0\d\b|\bPS-0\d\b|\bSTD-\d\.\d\b|\bP0\b` ;
4. le motif négation-puis-rectification `(?:^|[.!?]\s+)(?:Pas|Not)\s+[^.!?]{1,40}\.\s+[A-ZÀ-Ý][^.!?]{1,60}\.` ;
5. une date ISO `\b20\d\d-\d\d-\d\d\b` dans les pages FR hors `<time datetime>` et hors liste du journal.
Ajouter un test node qui vérifie la même règle 1 et 2 sur la sortie de `scripts/generate-llms.mjs`.

Ajouter `tests/alignment-grid.spec.ts` (Playwright) qui vérifie à 1440 et 375 sur les mêmes pages : bord gauche du logo, du
premier titre, de chaque section de premier niveau et du pied de page global = 180 / 20 (± 1 px) ; `.home-s-close-note` centré
à 720 ± 2 ; aucune `time` de `.journal-list` ni code du Standard plus haut que 24 px.

Mettre à jour les tests qui figent les anciennes chaînes (le contrat produit change, décision de Paul) :
`tests/conformity-home.spec.ts`, `tests/audit-truth-copy.test.mjs`, `tests/product-scene.spec.ts`, `tests/brand-os-render.test.mjs`,
et tout autre test qui assert une chaîne réécrite. Ne baisser l'exigence d'aucun autre test (notamment `doctrine-visible`,
`audit-readability`, `v54-*`, conformité Brand OS).

## Batterie
`npm ci && npm run lint && npm run build && npm run qa:claims:rev01 && npm run qa:brand:rev01 && npm run test:brand-os` verte,
plus `npx playwright test tests/anti-slop-copy.spec.ts tests/alignment-grid.spec.ts` contre `next start`. La CI rejoue Playwright.
Diffusion : PR ; fusion par Claude après CI verte (déploiement Vercel automatique sur main), puis contre-mesure en prod avec la
sonde de l'audit visuel.


---

# ANNEXE A — AUDIT-VISUEL.md

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


---

# ANNEXE B — AUDIT-COPY.md

# Audit copy parrit.ai : tells « AI slop » et cohérence FR/EN

Date : 11/10/2026 · Rôle : évaluateur, lecture seule · Base : worktree `/Users/paullarmaraud/codex-work/parrit-alignement-2026-10-11` (rien modifié).
Cadre (précision du fondateur relayée en cours d'audit) : le site est beau, **pas de refonte**. On retire les tells (« Exemple fictif », « Pas X. Y. »), on aligne les termes entre pages et entre FR et EN. **Réécritures minimales, aucune nouvelle section.**

Doctrine lue avant de juger : skill `anti-ia-tells`, REGLES-DOR §10/§24/§53/§57/§60, corpus de style (usage privé, non cité), `TRUTH.md`, `AGENTS.md`.

Légende priorité : **P0** = premier écran de l'accueil ou demande explicite de Paul · **P1** = CTA et cohérence entre pages · **P2** = autres pages · **P3** = surfaces machine (OG, JSON-LD, llms.txt).
Chemins relatifs à `src/` sauf mention contraire. `(rev01)` = `app/(rev01)`.

---

## 0. Ce que la gate devra aussi mettre à jour (sinon CI rouge)

Ces tests vérifient **mot pour mot** les chaînes à supprimer. Ils changent parce que le contrat produit change (décision Paul). Ce n'est pas « modifier un test pour le faire passer » au sens de §11 :
- `tests/conformity-home.spec.ts:199-200` : « Pas publiés. Partagés en rendez-vous. » / « Not published. Shared in person. »
- `tests/audit-truth-copy.test.mjs:87` : même chaîne FR.
- `tests/product-scene.spec.ts:19` : `.product-scene-mention` = « Exemple fictif » / « Fictional example ».
- `tests/brand-os-render.test.mjs:98,103` : « Exemple fictif », « Fictional example ».
- `public/llms.txt` est généré : corriger `scripts/generate-llms.mjs`, pas le fichier.

---

## 1. P0 · Premier écran et demandes explicites de Paul

| # | Fichier:ligne | Langue | Texte actuel | Tell / règle | Réécriture FR | Réécriture EN |
|---|---|---|---|---|---|---|
| 1 | `(rev01)/page.tsx:132` + `:48` (rendu `ProductScene.tsx:67`) | FR/EN | « Exemple fictif » / « Fictional example » | Mention défensive, bannie par Paul | **Supprimer la mention** (prop `mention` et `<p className="product-scene-mention">`). Les noms « Prospect B » / « Contact achat » suffisent à montrer qu'il s'agit d'un cas type. Ne pas écrire « anonymisé » : ce serait faux. | idem |
| 2 | `system/components/ProductScene.tsx:74` | FR (lu aussi sur EN) | aria-label « Exemple fictif de conversation avec l'agent CRM » | Même tell, côté lecteur d'écran | « Conversation avec l'agent CRM » | (bloc en `lang="fr"`, garder FR) |
| 3 | `ProductScene.tsx:82` | FR | alt « Carte de visite fictive : Contact achat, acheteur chez Prospect B » | Même tell | « Carte de visite photographiée : Contact achat, acheteur chez Prospect B » | idem |
| 4 | `ProductScene.tsx:86` | FR | aria-label « Réponses illustrées, démonstration non interactive » | Mention défensive + jargon | « Réponses proposées : oui ou non » | idem |
| 5 | `(rev01)/page.tsx:110` / `:26` | FR/EN | « Pas publiés. Partagés en rendez-vous. » / « Not published. Shared in person. » | Motif exact cité par Paul : négation puis rectification, deux fragments sans verbe | « Les noms des clients sont communiqués en rendez-vous. » | « Client names are shared in a meeting. » |
| 6 | `system/components/AgentEsquisse.tsx:13` / `:29` (premier écran, dans le hero) | FR/EN | « Un exemple, pas une analyse de votre entreprise » / « An example, not an analysis of your company » | « X, pas Y » défensif, visible dès l'arrivée | **Supprimer** la ligne `mode` (le titre « Votre agent · esquisse » suffit). Si un libellé reste : « Esquisse type » | « Sample sketch » |
| 7 | `AgentEsquisse.tsx:23` / `:39` | FR/EN | « Cette esquisse est un exemple, choisi dans une catégorie proche de votre phrase, pas une analyse de votre entreprise. Envoyez-la à Paul : … » | Même antithèse, en doublon de #6 | « Cette esquisse part d'un cas proche de votre phrase. Envoyez-la à Paul : il regarde si un système de ce type a du sens chez vous et vous répond personnellement. » | « This sketch starts from a case close to your sentence. Send it to Paul: he checks whether a system like this makes sense for you and replies personally. » |
| 8 | `AgentEsquisse.tsx:14` / `:30` | FR/EN | « Un système s'esquisse pour la reprendre. » / « A system gets sketched to take it over. » | Passif flou, sonne traduit | « Nous esquissons le système qui la reprendrait. » | « We sketch the system that would take it over. » |
| 9 | `AgentEsquisse.tsx:18` / `:34` | FR/EN | « Brouillon prêt, journalisé, réversible » / « Draft ready, journaled, reversible » | Triade d'adjectifs + anglicisme « journalisé » | « Brouillon prêt, consigné, annulable » | « Draft ready, logged, can be undone » |
| 10 | `AgentEsquisse.tsx:21` / `:37` | FR/EN | « Votre opération, observée en continu » · « Le reste s'exécute et se consigne » / « Only the arbitrations reach you » | Jargon (« arbitrations » en EN est un calque) | garder FR | « Only the decisions reach you » ; idem `:35` « Two gaps to arbitrate » → « Two gaps to decide on » |
| 11 | `system/components/QuickCapture.tsx:42` / `:26` | FR/EN | « Voir l'exemple illustratif » / « See an illustrative example » | Mention défensive + incohérence de terme (ailleurs : « esquisse ») | « Voir l'esquisse » | « See the sketch » |
| 12 | `QuickCapture.tsx:33` | FR | « Votre process à reconstruire, en une phrase (facultatif) » | Anglicisme « process » ; le site dit partout « opération » | « L'opération à reprendre, en une phrase (facultatif) » | `:17` « The operation to take over, in one sentence (optional) » |
| 13 | `QuickCapture.tsx:22` | EN | « Registration failed » | Incohérence FR/EN (FR : « L'envoi a échoué ») | — | « Sending failed » |

Note hero (pas un tell, à signaler seulement) : `(rev01)/page.tsx:101-103` « Nous transformons des problèmes opérationnels en systèmes qui fonctionnent. » échoue au test §60 : une autre agence pourrait la signer en changeant le logo. La phrase suivante (`:104`, « La facture qui traîne, le rapport refait à la main chaque semaine… ») est concrète et porte la page. **Le fondateur a exclu la refonte**, donc pas de réécriture imposée. Option si Paul le souhaite, tirée de TRUTH §1 : « Nous transformons les données de votre entreprise en outils qui vous appartiennent. » / « We turn your company's data into tools you own. »

---

## 2. P1 · CTA et cohérence des termes entre pages, FR/EN

### 2.1 L'examen : une seule graphie, une seule note

Constat : le même objet porte **six notes différentes** et deux graphies.

| Fichier:ligne | Texte actuel FR | EN |
|---|---|---|
| `(rev01)/page.tsx:178` | « 15 min · Un examen, en visio, avec le fondateur » | « 15 min · An examination, on a video call, with the founder » |
| `(rev01)/dossiers/page.tsx:72` | « 15 min · Un examen, avec le fondateur » | « 15 min · An examination, with the founder » |
| `(rev01)/manufacture/page.tsx:70` | « 15 min · En visio, avec le fondateur » | « 15 min · On a video call, with the founder » |
| `(rev01)/standard/page.tsx:92` | « 15 min · En visio, avec le fondateur » | idem |
| `(rev01)/build-with-you/page.tsx:52` | « Examen offert de 15 minutes, avec le fondateur » | « Free 15-minute examination with the founder » |
| `system/components/CalInline.tsx:25` | « 15 MIN · VISIO » | « 15 MIN · VIDEO » |
| `(rev01)/sketch/[id]/page.tsx:171` | « 15 MIN · UN EXAMEN, PAS UN APPEL COMMERCIAL » | « 15 MIN · AN EXAMINATION, NOT A SALES CALL » (antithèse en plus) |

**Proposition, une seule note partout** : FR « 15 min · En visio, avec le fondateur » · EN « 15 min · Video call with the founder ». CalInline peut garder sa version courte en capitales.

**« Offert » : le mot apparaît ou non selon la page.** Les cartes d'offre et la page Build With You disent « Examen offert » (`page.tsx:157`, `systems/page.tsx:164`, `build-with-you:39`). La page `/commission` ne dit pas que l'examen est gratuit, et la FAQ dit « sans engagement » (`systems:173`). C'est un fait commercial, donc **à trancher par Paul** : soit « offert » partout où l'examen est nommé, soit nulle part. Ne rien inventer.

**Majuscule de l'examen.** On trouve « Examen » capitalisé en texte courant (`manufacture:69` « Tout commence par un Examen. », `systems:152` « montré à l'Examen », `:172-173` « après l'Examen », « Un Examen de 15 minutes ») et en minuscule ailleurs (bouton « Réserver l'examen », `commission:19`). Règle proposée : majuscule seulement dans le nom de phase (« L'Examen · La Construction · La Capitalisation », manufacture et sketch), minuscule partout ailleurs. Même règle en EN (« examination » / « Examination »).

### 2.2 CTA

Le bouton principal est cohérent (« Réserver l'examen » / « Book the examination » dans le header, l'accueil, les pages et la capture). Deux écarts :
- `build-with-you/page.tsx:49` / `:27` : « Réserver un examen pour un système sur mesure » / « Book an examination for a custom system ». C'est acceptable comme lien secondaire. Pour l'aligner : « Réserver l'examen (système sur mesure) » / « Book the examination (custom system) ».
- `RevFooter.tsx:24` / `:12` : « Commande · réserver l'examen » / « Commission · book the examination ». OK.
- Le nom du fondateur alterne entre « Paul » (capture : « Envoyer à Paul », « Paul la regarde », esquisse : « Envoyez-la à Paul ») et « le fondateur » (offres, commission, manufacture). Ce n'est pas un tell, c'est un choix de voix. Garder « Paul » dans la capture (geste personnel) et « le fondateur » ailleurs, **sans mélanger les deux dans un même bloc**. Aujourd'hui c'est le cas.

### 2.3 Antithèse répétée sur les offres : « pas un audit ni un deck »

Trois occurrences du même motif « X, pas Y » :
- `(rev01)/page.tsx:154` / `:70` et `systems/page.tsx:161` / `:127` : « Pour le dirigeant qui veut repartir avec quelque chose qui tourne, pas un audit ni un deck. » / « For leaders who want something that runs, not an audit or a deck. »
- `build-with-you/page.tsx:44` / `:22` : « …pas l'audit ni le deck d'une mission classique » / « not the audit or the deck of a typical engagement ».

Tells : antithèse, anglicisme « deck » en FR.
→ Cartes d'offre : « Pour le dirigeant qui veut repartir avec un système en service. » / « For leaders who want to leave with a system in service. »
→ BWY `outBody` : « Un système qui tourne à la fin, dans vos outils. Le code, les données et la documentation vous appartiennent : pour cette formule, votre équipe le fait tourner sans nous. » / « A system running at the end, in your own tools. Code, data and documentation are yours: for this engagement, your team runs it without us. »

Redondance dans la même carte : le format « 10 heures, avec le fondateur » (`page.tsx:161`, `systems:168`) répète la puce « 10 heures de construction avec le fondateur ». **Supprimer `format`** sur les deux cartes, en FR comme en EN.

### 2.4 « Une commande, pas un abonnement » / « Commissioned, not subscribed »

C'est le même motif « X, pas Y », présent sur **toutes les pages** via le footer (`RevFooter.tsx:28` / `:16`). On le retrouve aussi dans `CalInline.tsx:26` / `:33`, `sketch/[id]/page.tsx:174` / `:160`, l'image OG (`app/opengraph-image.tsx:72`), le JSON-LD (`system/jsonld.ts:11`), `llms.txt` et `Opening.tsx:22,36` (code mort, voir §4).
La formule figure dans TRUTH §1. **Arbitrage de Paul requis** (tagline). Proposition : « Payé à la commande, sans abonnement » / « Paid per commission, no subscription ». Elle garde le fait et retire l'antithèse. Si Paul garde la formule, la garder en **un seul endroit** (le footer) et la retirer du reste.

### 2.5 Dossiers : contradiction entre titre et page

- `(rev01)/page.tsx:144` / `:60` : « Nous montrons les dossiers clients en rendez-vous, pas en ligne. »
- `dossiers/page.tsx:46` / `:13` : « …en rendez-vous, pas sur ce site. »

Tells : antithèse, et formulations différentes d'une page à l'autre. Il y a aussi une **contradiction** : la page affiche juste en dessous trois dossiers en ligne.
→ FR (les deux pages) : « Trois dossiers sont résumés ici. Les autres se présentent en rendez-vous. » · EN : « Three dossiers are summarised here. The others are presented in a meeting. »
→ `page.tsx:145` / `:61` devient alors redondant (« Trois dossiers ouverts aujourd'hui. Les autres restent scellés jusqu'au rendez-vous. ») : garder l'un des deux, pas les deux.

### 2.6 Codes internes visibles (REV, PS, STD, P0)

Ces codes n'aident pas un dirigeant et sont **incohérents entre eux** (REV 01 sur une page, REV 02 sur une autre, aucun sur une troisième). Ils restent en anglais sur les pages FR.

| Fichier:ligne | Actuel | Proposition |
|---|---|---|
| `system/components/RegistryLine.tsx:7` (défaut, utilisé par commission, standard, legal) | `PARRIT / SITE · REV 01 · 2026` | `PARRIT.AI · 2026` |
| `dossiers/page.tsx:121` | `PARRIT / DOSSIERS · REV 01 · 2026` | `PARRIT / DOSSIERS · 2026` |
| `manufacture/page.tsx:85` | `PARRIT / MANUFACTURE · REV 02 · 2026` (seul « REV 02 » du site) | `PARRIT / MANUFACTURE · 2026` |
| `journal/page.tsx:35` **et** `:56` | `PARRIT / JOURNAL · REV 01 · 2026` (affiché deux fois) | garder une seule ligne, sans REV |
| `legal/page.tsx:26` | `PARRIT / LEGAL · REV 01 · 2026` | `PARRIT / LEGAL · 2026` |
| `journal/[slug]/og/route.tsx:41` | `PARRIT / JOURNAL · REV 01 · {date}` | `PARRIT / JOURNAL · {date}` |
| `standard/page.tsx:14,57` | `STD-1.0 · 2026` | `LE STANDARD · 2026` / `THE STANDARD · 2026` |
| `standard/page.tsx:17-43,60-86` | `PS-01` … `PS-06` | `01` … `06` |
| `standard/page.tsx:91` / `:48` | « STD-1.0 n'est pas une accréditation. C'est l'exigence de Parrit.ai. Demandez-nous des comptes. » | « Le Standard est un contrôle interne de Parrit.ai, sans accréditation externe. Demandez-nous des comptes. » / « The Standard is Parrit.ai's internal check, with no external accreditation. Hold us to it. » |
| `system/components/RegistrySnapshot.tsx:15` | « Registre P0 · constaté le 2026-09-13 » / « P0 registry · observed 2026-09-13 » | « Registre · constaté le 13 septembre 2026 » / « Registry · observed September 13, 2026 » (date au format de la langue) |
| `systems/page.tsx:154` | « Parrit / Cas central » / « Parrit / Central case » | « Notre propre cas » / « Our own case » |

AGENTS.md fait de la registry line un « élément propriétaire ». Le format `PARRIT / X · 2026` est donc conservé. Seul le code de révision part.

### 2.7 Mention « contrôle interne » : deux formulations

- `system/components/HarnessBadge.tsx:9-13` : « Harness Certified ✓ » (EN seul, même sur FR) + « Contrôle interne Parrit, pas une accréditation. » / « Parrit internal check, not an accreditation. »
- Standard (ci-dessus).

→ Aligner sur une seule phrase : « Contrôle interne Parrit.ai, sans accréditation externe. » / « Parrit.ai internal check, with no external accreditation. » Libellé FR du badge : « Vérifié par le contrôle interne » (EN « Harness Certified » à garder si Paul tient au nom ; le « ✓ » est un glyphe à vérifier contre `brand-os.glyphs.json`).

### 2.8 /systems : écarts FR/EN et dans un même tableau

- `systems/page.tsx:155` FR « Usage interne · vérifié le 13 septembre 2026 » vs `:121` EN « Internal use · observed 2026-09-13 ». Le verbe et le format de date diffèrent. → EN « Internal use · observed September 13, 2026 ».
- Dans le même tableau `ROWS`, deux libellés pour un même statut : FR « En cours de transfert » (`:189,213,219`) et « Transfert en cours » (`:195`) ; EN « Being transferred » (`:233,257,263`) et « Transfer under way » (`:239`). → un seul : « En cours de transfert » / « Being transferred ».
- `:55` FR « (les contacts, les rendez-vous, les appels, les dossiers en cours) » vs `:98` EN « (a contact, a deadline, a call, an open deal) ». La liste n'est pas la même. → EN « (contacts, meetings, calls, open files) », comme `:114`.

### 2.9 Terme « prototype » (abandonné, toujours visible)

`system/engagements.ts:5-8` documente le retrait de « prototype », qui surpromettait. Il reste visible :
- `legal/page.tsx:15,20` : « formulaire prototype » (×2 par langue) → « formulaire de demande » / « request form ».

---

## 3. P2 · Autres pages

### Accueil (`(rev01)/page.tsx`)
| Ligne | Langue | Actuel | Tell | FR | EN |
|---|---|---|---|---|---|
| 115 / 31 | FR/EN | « Chaque étape dit ce que Parrit fait, ce que vous apportez, et ce qu'elle débloque pour la suite. » | Méta-texte en triade, promesse que les étapes ne tiennent pas toutes. Test des −20 % | **Supprimer** | **Supprimer** |
| 140 / 56 | FR/EN | « 15 des 25 types d'information que nous suivons étaient encore tenus en double (mesuré le 13 septembre 2026). » | Chiffre sans verdict : sous le titre « La preuve », le dirigeant lit « leurs données sont en double » | « Nous publions l'état réel de notre propre système : au 13 septembre 2026, 15 des 25 types d'information suivis étaient encore tenus en double. » | « We publish the real state of our own system: as of September 13, 2026, 15 of the 25 types of information we track were still held in two places. » |
| 108 / 24 | FR/EN | « Commandes de : » / « Orders from: » | Tournure maladroite ; « Orders » ≠ « commission » ailleurs | « Ils nous ont commandé un système : » | « Systems commissioned by: » |
| 128 / 44 | FR/EN | « Vous demandez, vous validez, la fiche est créée. » | Ternaire rythmé (léger) | garder (il structure les 3 étapes illustrées), sinon « Une photo, un oui : la fiche est créée. » | « One photo, one yes: the record is created. » |

### Commission (`(rev01)/commission/page.tsx`)
| Ligne | Langue | Actuel | Tell | FR | EN |
|---|---|---|---|---|---|
| 23 / 13 | FR/EN | « Vous repartez avec une direction claire. » | Formule creuse. Contredit aussi la meta (`:20`, « Vous repartez avec un périmètre écrit ») alors que le corps dit que le périmètre est envoyé *ensuite* | « Après l'appel, un périmètre écrit ou un non clair. » | « After the call, a written scope or a clear no. » |
| 20 / 10 | FR/EN | meta « Vous repartez avec un périmètre écrit ou un non clair. » | Incohérent avec le corps | « Vous recevez ensuite un périmètre écrit, ou un non clair. » | « You then receive a written scope, or a clear no. » |

### Build With You (`(rev01)/build-with-you/page.tsx`)
| Ligne | Langue | Actuel | Tell | FR | EN |
|---|---|---|---|---|---|
| 35 / 13 | FR/EN | sous-titre qui répète mot pour mot le H1 puis ajoute « et vous repartez capable de construire le suivant sans nous » | Redite H1 | « Vous repartez aussi capable de construire le suivant sans nous. » | « You also leave able to build the next one without us. » |
| 36 / 14 | FR/EN | « Vous voulez repartir avec quelque chose qui tourne, construit avec vous. » (sous-titre ET meta description) | Parle à la place du lecteur, redite | **Supprimer du rendu** ; meta = la phrase `autonomy` corrigée | idem |
| 44 / 22 | FR/EN | voir §2.3 | | | |

### Manufacture (`(rev01)/manufacture/page.tsx`)
| Ligne | Langue | Actuel | Tell | FR | EN |
|---|---|---|---|---|---|
| 47 / 14 | FR/EN | « Un système se fabrique. Il ne s'installe pas. » / « A system is manufactured. It is not installed. » | Négation puis rectification | « Chaque système se fabrique dans vos comptes, avec vos clés. » (fait repris de la phase 02) | « Each system is built in your accounts, under your keys. » |
| 59 / 26 | FR/EN | « …reconstruite de bout en bout… Ensuite seulement, le reste. » / « …end-to-end… Only then, the rest. » | Jargon « de bout en bout » + fragment final | « …reconstruite entièrement dans vos comptes, avec vos clés… Le reste vient ensuite. » | « …rebuilt in full in your accounts… The rest comes after. » |
| 67 / 34 | FR/EN | « …au même Standard. Six critères, identiques pour tout système livré. » | Fragment nominal | « …au même Standard : six critères, les mêmes pour tout système livré. » | « …to the same Standard: six criteria, the same for every system delivered. » |
| 69 / 36 | FR/EN | « Tout commence par un Examen. » | Majuscule (§2.1) | « Tout commence par un examen. » | « It starts with an examination. » |

### Standard (`(rev01)/standard/page.tsx`)
| Ligne | Langue | Actuel | Tell | FR | EN |
|---|---|---|---|---|---|
| 62 / 19 | FR/EN | « L'état du pipeline, les relances parties, l'incident d'hier. Un écran. » | Cascade de fragments | « L'état du pipeline, les relances parties et l'incident d'hier tiennent sur un écran. » | « Pipeline state, follow-ups sent and yesterday's incident fit on one screen. » |
| 54 / 11 | FR/EN | meta FR « décisions cadrées et chiffrées » vs EN « framed decisions » | Écart FR/EN | garder | « framed, quantified decisions » |
| 91 / 48 | | voir §2.6 | | | |

### Dossiers (`(rev01)/dossiers/page.tsx`)
| Ligne | Langue | Actuel | Tell | FR | EN |
|---|---|---|---|---|---|
| 47 / 14 | FR/EN | « Les dossiers s'ouvrent de vive voix. Des systèmes commandés par… Anonymisés par principe. » | Fragments en cascade, préciosité | « Ces systèmes ont été commandés par des grands comptes, des PME et des ETI. Nous les anonymisons tous. » | « These systems were commissioned by large accounts, SMEs and mid-sized companies. We anonymize all of them. » |
| 71 / 38 | FR/EN | « Le prochain dossier pourrait être le vôtre. » | Cliché CTA, échoue à §60 | « Un dossier commence par un examen. » | « A dossier starts with an examination. » |
| 58 / 25 | FR/EN | dossier 26-002 : `body` vide | Carte incomplète, incohérente avec les deux autres | Paul doit fournir une phrase de mandat **ou** on laisse vide. Ne pas inventer | idem |
| 53,59 / 20,26 | FR/EN | sceau « Commandé » vs « En production » (Parrit) | Ambigu : on peut lire que les systèmes clients ne tournent pas | **UNKNOWN** : Paul confirme l'état réel de 26-002/26-003 avant toute reformulation | idem |
| 69-70 / 36-37 | FR/EN | « D'autres dossiers restent scellés. Ils se lisent en rendez-vous, sur demande. » | Redite du titre après correction §2.5 | garder une seule de ces mentions sur la page | idem |

### /systems (`(rev01)/systems/page.tsx`)
| Ligne | Langue | Actuel | Tell | FR | EN |
|---|---|---|---|---|---|
| 145 / 111 | FR/EN | « Montré, pas revendiqué. » / « Shown, not claimed. » | Motif exact « Pas X. Y. » sous forme de titre | « Ce que le système fait aujourd'hui. » | « What the system does today. » |
| 53 / 96 | FR/EN | « …comme dans cet exemple. Nous ne le cachons pas. » / « We do not hide it. » | Phrase défensive qui rassure sans informer (§54) | **Supprimer la dernière phrase** | idem |
| 54 / 97 | FR/EN | « …Mais nous ne l'avons pas encore branché… Et aucune vente ne lui est due : … » | « Et » d'attaque rhétorique | « …Aucune vente ne lui est due : nos clients viennent de personnes que nous connaissons déjà. » | « …No sale is owed to it: our clients come from people we already know. » |
| 22, 53, 103, 114, 148 | FR/EN | « 13 septembre 2026 », cinq fois sur la page | Pas un tell. Donnée datée d'un mois : **vérifier qu'elle est encore la dernière mesure** (§55, UNKNOWN sinon) | — | — |

### Journal index (`(rev01)/journal/page.tsx`)
| Ligne | Langue | Actuel | Tell | FR | EN |
|---|---|---|---|---|---|
| 19 / 13 | FR/EN | « Ce qui a tenu, ce qui a cassé, sur des systèmes IA en entreprise. Daté et consigné. » | Fragment final | « Ce qui a tenu et ce qui a cassé sur des systèmes d'IA en entreprise, daté et consigné. » | « What held and what broke on AI systems inside companies, dated and on the record. » |
| `RevFooter.tsx:23` / `:11` | FR/EN | « Le Journal · les chantiers » / « The Journal · field notes » | Écart léger FR/EN | « notes de chantier » | « field notes » |

### Esquisse privée (`(rev01)/sketch/[id]/page.tsx`, page noindex envoyée par mail à un prospect)
C'est la page la plus chargée en tells. Elle est lue par un prospect, donc dans le périmètre.
| Ligne | Langue | Actuel | Tell | FR | EN |
|---|---|---|---|---|---|
| 166 / 152 | FR/EN | « UNE ESQUISSE, PAS UNE PROMESSE. LE VRAI INSTRUMENT SE CONSTRUIT SUR VOS FLUX RÉELS. » | Motif « Pas X. Y. » | « LES CHIFFRES RÉELS VIENDRONT DE VOS PROPRES FLUX. » (l'honnêteté sur les chiffres reste, l'antithèse part) | « THE REAL FIGURES WILL COME FROM YOUR OWN FLOWS. » |
| 171 / 157 | FR/EN | « 15 MIN · UN EXAMEN, PAS UN APPEL COMMERCIAL » | Antithèse | « 15 MIN · EN VISIO, AVEC LE FONDATEUR » (§2.1) | « 15 MIN · VIDEO CALL WITH THE FOUNDER » |
| 90 / 32 | FR/EN | « …tracé jusqu'à la ligne et réversible jusqu'au jour. Personne ne l'écrit. Tout le monde le lit. » | Calque EN + antithèse en paire | « …chaque chiffre renvoie à sa ligne source et peut être annulé. Il se lit sans être écrit à la main. » | « …every figure traces to its source line and can be undone. Nobody writes it by hand. » |
| 113 / 55 | FR/EN | « Le CRM devient quelque chose que vous lisez, pas quelque chose que vous remplissez. » | « X, pas Y » | « Le CRM se lit au lieu de se remplir. » | « You read the CRM instead of filling it in. » |
| 117 / 59 | FR/EN | « Le mail traité comme une doctrine. » / « Mail answered as doctrine. » | Jargon creux | « Chaque mail classé, chaque relance à l'heure. » | « Every mail sorted, every follow-up on time. » |
| 118 / 60 | FR/EN | « …Vous signez. Le système se souvient. » | Paire rythmée | « …Vous signez, le système garde la trace. » | « …You sign; the system keeps the record. » |
| 126 / 68 | FR/EN | « La Construction livre le classeur et la doctrine de rédaction, vérifiés. » | **Contresens** : « classeur » traduit « classifier » | « La Construction livre le tri automatique des mails et les règles de rédaction, vérifiés. » | « Construction ships the mail classifier and the drafting rules, checked. » |
| 131 / 73 | FR/EN | « Votre entreprise. Un seul système. » | Deux fragments | « Toute votre entreprise dans un seul système. » | « Your whole company in one system. » |
| 135 / 77 | FR | « exposition signalée… » | Calque de « exposure » | « risque signalé avec sa cause… » | garder |
| 98, 140 / 40, 82 | FR/EN | « de bout en bout » / « end-to-end » | Jargon | « entièrement » | « in full » |
| 150, 164 | FR/EN | « {SOCIÉTÉ} / OS · ESQUISSE », « Brouillon 01 », « PARRIT / ESQUISSE · BROUILLON 01 · 2026 » | Codes internes | « {SOCIÉTÉ} · ESQUISSE » ; supprimer « Brouillon 01 » / « Draft 01 » | idem |
| 174 / 160 | | voir §2.4 | | | |

### Légal (`(rev01)/legal/page.tsx`)
- `:18` / `:13` : « Dernière mise à jour / Octobre 2026 » → « Dernière mise à jour : octobre 2026 » / « Last updated: October 2026 ».
- `:18` kicker « Parrit / Registre documentaire » : jargon léger, acceptable.
- « formulaire prototype » : voir §2.9.

### 404 (`app/not-found.tsx`)
RAS.

### CalInline (`system/components/CalInline.tsx:100-101`)
« [TO FILL] Coaching calendar link must be configured before launch. » ne s'affiche qu'en cas de mauvaise configuration, en EN seul, et parle de « Coaching ». Risque faible. À traiter par la gate config, pas par le copy.

---

## 4. P3 · Surfaces machine (partage LinkedIn, moteurs, IA)

| Fichier:ligne | Actuel | Tell | Proposition |
|---|---|---|---|
| `app/opengraph-image.tsx:58` | « Your company. One system. » (visuel de partage, différent du hero) | Fragments + incohérence avec le H1 | « We turn operational problems into systems that work. » (ou la formule métier §6) |
| `app/opengraph-image.tsx:72` | « COMMISSIONED, NOT SUBSCRIBED · PARRIT / SITE · REV 01 · 2026 » | Antithèse + code REV | « PARRIT.AI · DATA AND AI · 2026 » |
| `system/jsonld.ts:10-11` | « …tools the company owns: commissioned, not subscribed. Based in France; operating internationally… » | Antithèse | « Parrit.ai is an independent French data and AI company. It turns a company's data into tools the company owns, built in its own accounts and documented. Works in English and French. » |
| `scripts/generate-llms.mjs` → `public/llms.txt` | **16 tirets cadratins « — »** dans llms.txt (17 dans le générateur), dont PS-01…PS-06, « Operates internationally… — », « Built on… — the client… » ; « not a workshop », « Not a sales call. », « Commissioned, not subscribed. » ; définitions PS-01…06 différentes de la page Standard | Tiret cadratin = blocage dur ; antithèses ; incohérence avec /standard | Remplacer « — » par « : » ou « , » ; retirer les antithèses ; reprendre mot pour mot les six énoncés EN de `/standard` |
| `system/components/Opening.tsx` (tout le fichier) | « REV 01 », « Une commande, pas un abonnement », « 14 SYSTÈMES », « 2 TROUVÉES » | Code mort : **importé nulle part**. AGENTS.md le décrit pourtant comme joué à chaque arrivée (doc obsolète) | Ne pas réécrire. Signaler à Paul : supprimer le composant ou corriger AGENTS.md |

Hors périmètre page, même tell : `lib/server/interets.ts:242,250`, le mail automatique après capture : « Voici un exemple illustratif, proche de votre besoin, pas une analyse de votre entreprise ». À aligner sur #7 dans le même lot, sinon le prospect retrouve dans sa boîte la phrase retirée du site.

---

## 5. Synthèse

### 5.1 Les 10 motifs à bannir (règles pour une future gate CI sur les chaînes des `DICT`/`COPY`/`FOOTER`)

1. **Négation puis rectification en fragments** (« Pas publiés. Partagés… », « Not published. Shared… »)
   `(?:^|[.!?]\s+)(?:Pas|Not|No|Jamais|Never)\s+[^.!?]{1,40}\.\s+[A-ZÀ-Ý][^.!?]{1,60}\.`
2. **Antithèse en ligne « X, pas Y »** (« une commande, pas un abonnement », « Shown, not claimed », « pas un audit ni un deck »)
   `(?i),\s+(?:pas|not|plutôt que|rather than)\s+(?:un|une|le|la|les|des|d'|l'|a|an|the|claimed|revendiqu)` (sauf liste blanche validée par Paul)
3. **Mentions défensives** : `(?i)\b(fictif|fictive|fictional|illustrati(f|ve|on)|illustrées?|non interactive|pas une analyse|not an analysis|pas une promesse|not a promise)\b`
4. **Codes internes visibles** : `\bREV\s?0\d\b|\bPS-0\d\b|\bSTD-\d\.\d\b|\bP0\b|\bDraft 0\d\b|\bBrouillon 0\d\b`
5. **Tiret cadratin et demi-cadratin** dans toute chaîne publique, générateurs compris (`scripts/*.mjs`) : `[—–]`
6. **Cascade de fragments courts** (deux phrases de quatre mots ou moins, sans verbe, à la suite) :
   `(?:^|[.!?]\s+)[A-ZÀ-Ý][^.!?\s]*(?:\s[^.!?\s]+){0,3}\.\s+[A-ZÀ-Ý][^.!?\s]*(?:\s[^.!?\s]+){0,3}\.` (en avertissement : les listes Signal/Décision/Action en sont exemptées)
7. **Jargon et calques** en FR : `(?i)\b(de bout en bout|journalis|doctrine|process\b|deck\b|exposition|arbitrage|seamless|robust|leverage)\b`
8. **Termes retirés** : `(?i)\bprototype\b` hors code (cf. `engagements.ts`) ; « Commandes de » ; « Orders from ».
9. **Graphie de l'examen hors nom de phase** : `\b(?:un|l'|à l'|après l')Examen\b|\ban Examination\b|\bthe Examination\b` (la majuscule n'est admise que dans les listes de phases)
10. **Date ISO dans une chaîne FR affichée** : `\b20\d\d-\d\d-\d\d\b` dans les valeurs `fr:` (le FR écrit « 13 septembre 2026 »)

Le plus utile en plus, sans regex : un test de **cohérence des notes** qui vérifie qu'une seule constante `EXAM_NOTE[locale]` est utilisée partout (§2.1). Même mécanique que `engagements.ts`, qui centralise déjà les promesses du funnel.

### 5.2 Le métier de Parrit en une phrase (tirée de TRUTH §1, aucun fait ajouté)

- **FR** : « Parrit.ai est une maison française indépendante de données et d'IA : nous transformons les données d'une entreprise en outils qui lui appartiennent, construits dans ses comptes et documentés. »
- **EN** : « Parrit.ai is an independent French data and AI firm. We turn a company's data into tools it owns, built in its own accounts and documented. »

Usage proposé : meta description de l'accueil, JSON-LD, llms.txt, et en option le hero si Paul rouvre la question (§1, note hero).

### 5.3 Arbitrages qui reviennent à Paul (aucun fait inventé ici)
1. Garder ou non la tagline « Une commande, pas un abonnement » (§2.4).
2. Examen « offert » partout ou nulle part (§2.1).
3. État réel des dossiers 26-002 et 26-003 (« Commandé » ou « En production ») et la phrase de mandat manquante pour 26-002.
4. Mesure du 13 septembre 2026 : encore la dernière ? (/systems, accueil).
5. Composant `Opening.tsx` mort : supprimer ou corriger AGENTS.md.
