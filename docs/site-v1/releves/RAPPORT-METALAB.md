# Relevé de métier : Metalab (agence de design de produit) pour inspirer la refonte de parrit.ai

Date des captures : 26/10/2026. Spec de référence : `PARRIT_SITE_SPEC_V1_2026-10-26.md` (sections 4 et 7), `ETAPE-1-PLAN.md`, `AGENTS.md` (« Source de vérité visuelle = Brand OS »), `parrit-canon/brand/` (lecture seule).
Statut : analyse de technique. **Rien n'est à copier.** Tout est décrit avec mes mots ; seuls quelques intitulés courts sont cités entre guillemets. Aucun fichier de Metalab n'est réutilisé : les captures et mesures restent dans ce dossier, pour analyse locale.
Convention de preuve : `CONSTATÉ` = mesuré ou lu dans le DOM, le CSS ou le réseau ; `DÉDUIT` = inférence de ma part ; `UNKNOWN` = non établi.

---

## 0. Méthode, périmètre, limites d'accès

**Outil.** Playwright 1.64.1 (npm, déjà présent hors dépôt dans `../benchmark/node_modules`), Chromium headless-shell déjà installé sur le poste. Aucune installation, aucun MCP, aucune configuration modifiée. Scripts rangés dans ce dossier : `common.js`, `capture.js`, `capture-mobile-full.js`, `dump-css.js`, `dump-type.js`, `motion-home.js`, `motion-hover.js`, `measure.js`, `measure-reveal.js`, `tour-video.js` (+ `tour-sheet.py`, `strip.py`, `sheets.py`, `zoom.py`, `curve.py`, `weights.py`, `assets-index.py`), `probe-js.js`, `structure.js`, `hero-media.js`, `counts.js`, `social.js`, `social2.js`, `social3.js`, `mobile-reduced.js`. Mesures brutes : `css-*.json`, `type-*.json`, `measure-*.json`, `structure.json`, `hero-media.json`, `js-analysis.json`, `social-probe*.json`, `counts.json`.

**Largeurs.** 1440x900 (bureau) et 390x844 (mobile émulé, tactile). Pour chaque page : capture « haut de page » (`_fold_`) et pleine page (`_full_`) dans `shots/`, planches-contact dans `sheets/` (tranches de 1 800 à 2 000 px). Séquences de mouvement : captures horodatées au chargement (`shots/motion-home/`), au survol (`shots/motion-hover/`), et un parcours filmé par `Page.startScreencast` (1 182 images, `video/`, horodatage dans `tour-frames.json`, repères dans `tour-marks.json`).

**Pages vues sur metalab.com** : accueil, `/work` (index), `/work/midjourney`, `/work/robinhood`, `/work/windsurf` (trois études de cas), `/what-we-do`, `/about`, `/careers`, `/contact`, `/blog`, et `archive.metalab.com` (404). Menu ouvert, bascule de thème, survol des pastilles de l'accueil, survol d'une ligne de l'index.

**Accès, constaté :**

| Canal | Résultat | Détail |
|---|---|---|
| metalab.com (toutes pages) | 200, aucun blocage | pas de bandeau cookies détecté ; GTM, GA4, pixel Meta et un script tiers « getswan » chargés (CONSTATÉ dans les `<script>`). Je n'ai rien accepté ni refusé : aucun bandeau ne s'est présenté |
| archive.metalab.com | 404 | des liens vers `archive.metalab.com/projects/...` (Amazon, Coinbase, Slack, Waking Up) existent sur le site mais l'hôte répond 404 |
| Dribbble `/metalab` | 200, public | bandeau cookies : « Reject All » cliqué. Profil, liste de shots et pages de shots lisibles sans compte |
| Instagram `/metalab/` | 200, **mur de connexion** | bandeau cookies : « Decline optional cookies » cliqué. Ensuite une fenêtre « Sign up / Log in » recouvre la grille ; seuls l'en-tête, les « stories à la une » et le haut de la grille sont visibles. Nombre de publications et contenu des légendes : `UNKNOWN` |
| LinkedIn `/company/metalab` | 200, **mur de cookies puis de connexion** | la page « À propos » publique est lisible (texte). Le bouton « Reject » n'a pas été détecté par mon script ; je n'ai rien accepté. Fil d'actualité et cadence : `UNKNOWN` |
| X / Twitter `/metalab/` | **403** | page vide, blocage côté plateforme ; contenu `UNKNOWN` |
| Medium `@metalabtech` | **403 Cloudflare** au bureau ; 200 en émulation mobile | page lisible en émulation mobile (profil et liste de billets), sans connexion |
| YouTube `@metalab` | consentement UE, « Tout refuser » cliqué, puis **404** | aucune chaîne à ce nom ; aucun lien YouTube sur metalab.com. Autre identifiant éventuel : `UNKNOWN` |
| Vimeo `/metalab` | 200 mais **homonyme** | c'est le « Metalab » de Vienne (espace de bricolage numérique), sans rapport. Exclu |
| Behance `/metalab` | 400 puis 404 | aucun profil à cet identifiant ; autre identifiant éventuel : `UNKNOWN` |

Aucun formulaire soumis (le formulaire `/contact` est lu dans le DOM, pas rempli), aucun compte créé, aucune connexion, aucun suivi ou j'aime. Quatre clics hors lecture pure : le menu (ouvrir/fermer), la bascule de thème sombre/clair, un clic sur la pastille « All Work » (navigation interne), un clic sur une ligne de l'index (sans effet). Aucun n'envoie de donnée.

**Incident d'outillage, pour mémoire.** Le garde `garde-codex.sh` (§25) a refusé trois commandes Bash d'analyse (faux positifs : un nom de fonction `cp`, une écriture de script par redirection). Je n'ai rien contourné ni touché à une variable d'autorisation : j'ai écrit les scripts avec l'outil d'écriture de fichiers, dans le dossier de travail hors dépôt demandé. Rien n'a été écrit dans un dépôt git.

---

## 1. Inventaire par plateforme

### 1.1 metalab.com (le site)

Pile (CONSTATÉ) : Next.js (routeur « pages »), CMS Sanity (images et vidéos servies par `cdn.sanity.io`, paramètres `w=`, `q=80`, `fm=webp`), défilement lissé par Lenis (durée de code 1,2), GSAP intégré au paquet (non exposé en global), un peu de Framer Motion, Lottie pour de petites icônes, Swiper. Un seul fichier CSS (modules CSS), police en `woff2` auto-hébergée.

Structure du site (5 portes, très court) : accueil, Work (index) + études de cas, What we do, About (+ Careers), Blog, Contact. Menu en panneau : « Case Studies, What We Do, About Us, Latest News, Get in Touch », plus 9 pastilles de cas, et des cartes d'actualité (prix presse, levée de fonds d'un client, billet, étude de cas récente).

**Accueil.** Un seul écran, sans défilement vertical (`scrollHeight` = 900 px). Séquence de chargement (voir 2.5) puis un fond plein écran qui change selon la pastille survolée parmi 9 études de cas + « All Work ». Au repos : boucle vidéo (reflets chromés violet/noir). Texte : une phrase d'accroche de 3 lignes, titre « We make interfaces », liste verticale de pastilles à gauche.

**Index Work.** Titre en deux lignes serif, filtres en pastilles (Startup, Leader, AI, Ecommerce, Finance, Health & Wellness, Productivity, SaaS, Media), puis une liste de lignes : logo à gauche, une phrase de description au centre, services en gris à droite, filet de 1 px entre chaque ligne. 85 lignes dans le DOM (doublons possibles entre variantes d'affichage), dont 18 portent un lien vers une étude de cas ; 14 URL `/work/<slug>` distinctes relevées dans les liens (Atoms, Calvin Klein, Genies, Headspace, Midjourney, Pitch, Ro, Robinhood, Suno, The Athletic, The Atlantic, Uber, Upwork, Windsurf).

**Étude de cas (trois lues).** 12 sections (Midjourney), 17 (Robinhood), 25 (Windsurf). Voir 2.7.

**What we do.** Phrase d'accroche plein écran, mur de visuels en parallaxe, 4 lignes « problème/ambition » avec une phrase de bénéfice en petit, très grand titre (« From pre-seed to fortune 500 ») en grotesque, citations de dirigeants avec portrait, 6 colonnes numérotées 01 à 06 séparées par des filets verticaux violets (principes de travail), 3 chiffres d'ensemble en grand serif (2,2 G d'utilisateurs, 455 produits, 18 licornes : chiffres affichés par Metalab, non vérifiés), puis le bloc « How can we help? ».

**About / Careers.** Titre « Global talent, Canadian home » avec de petits portraits insérés dans la ligne, photo d'équipe, défilement de villes, quatre chiffres de diversité en grand serif avec filet vertical violet, liste d'avantages en tiroirs (une ligne, un signe +), puis carrières : 4 postes (flux Greenhouse), filtre All/Design.

**Blog.** « We write words too », 6 filtres (Research, Meta, Engineering, People, Design, Product), 10 billets listés, datés du 04/05/2023 au 19/02/2026, soit un billet tous les trois à quatre mois environ (DÉDUIT de 10 billets sur 33 mois). Mise en page : auteur en gris, titre en 40 px, catégorie et date.

**Contact.** Titre « Say hey. » + 3 paragraphes très courts de consigne + formulaire à 5 champs (nom, e-mail, comment avez-vous entendu parler de nous, stade de l'entreprise, message), soulignés plutôt qu'encadrés, case d'inscription à une lettre, bouton. Aucun champ budget.

**Poids de l'accueil (CONSTATÉ, en-têtes `content-length`, ordre de grandeur).** 89 requêtes ; JS ≈ 0,75 Mo ; polices ≈ 0,34 Mo (dont deux fichiers de 118 Ko pour le serif d'affichage) ; images ≈ 2,9 Mo (formats WebP 29, AVIF 10, GIF 2) ; vidéo de fond 2,9 Mo. Total de l'ordre de 7 Mo. Index Work : 268 requêtes, dont 170 logos SVG légers (médiane 1,9 Ko).

### 1.2 Dribbble (`dribbble.com/metalab`)

CONSTATÉ. Profil « MetaLab », localisation « San Francisco », spécialités « Animation, Mobile Design, UI / Visual Design », boutons « Get in touch / Follow », onglets Work, Reviews, Collections, Liked Shots, Members, About. Plus de 40 shots listés sur la première page (le script en a relevé 40 titres, il peut y en avoir davantage). Aucun mur de connexion.

**Cadence.** Le dernier élément épinglé en tête est le « 2022 Showreel » ; les identifiants de shots récents sont de la série 19 millions, ce qui correspond à 2022. Je n'ai pas d'élément daté après 2022 : cadence actuelle `UNKNOWN` (probablement canal ralenti ; DÉDUIT, à vérifier par connexion).

**Format d'un cas sur Dribbble.** Un projet est éclaté en 3 à 4 shots autonomes, un par facette (exemples : Calvin Klein = « Product Detail Pages », « CalvinKlein.com », « Navigation » ; Headspace = « Desktop », « mega menu », « Dot on Mobile », « case study », « Wires to HiFi »). Chaque shot : une miniature 4:3, souvent une courte vidéo ou un GIF (l'icône caméra est visible sur la miniature), titre « Client : facette » ou « Client – facette », crédit « [designer] for MetaLab », palette de couleurs extraite automatiquement par la plateforme (7 teintes, ex. `#020202 #CEC6AF #F6F6F5…`), texte d'accompagnement à la première personne et au ton familier (« Hey Dribbble, we're back, with more intel on our recent work… »), vidéos MP4 800x600 pour les détails, une vidéo 1408x1056 pour la bande démo. Le texte explique l'objectif, le système conçu, et remercie l'équipe.

**Différence avec le site.** Le site : quasi sans mots, monumental, une histoire unique par client, ordre éditorial strict. Dribbble : fragmenté, facettes réutilisables, mots plus abondants et plus chaleureux, destiné à la communauté de pairs. Les captures du site n'ont aucun rapport visuel avec la vitrine Dribbble (fond clair de plateforme, vignettes encadrées).

### 1.3 Instagram (`@metalab`)

CONSTATÉ (mur de connexion, partiel). 16,5 K abonnés, 105 abonnements. Biographie : une phrase qui reprend le slogan du site et une liste de clients cités (Slack, Robinhood, Nike, Apple, Midjourney, Google), invitation à recruter, lien metalab.com. « Stories à la une » classées **par client** (Trajectory, Sweatpals, Oro, Robinhood, PlayerZero, Windsurf, Humanaut, Suno). Grille visible : un aplat chartreuse uni, une tuile noire avec le sigle étoile de la marque, une tuile « mur de logos clients » en grille de 3 colonnes, au moins un Reel. DÉDUIT : la grille traite des tuiles comme des blocs de marque (couleur, logo, mur) plutôt que comme des photos. Nombre de publications, fréquence, légendes : `UNKNOWN`.

### 1.4 LinkedIn (page entreprise)

CONSTATÉ (texte public après le mur de cookies). « Metalab », secteur « Software Development », Victoria (BC), 32 400 abonnés, « View all 258 employees », accroche « We make interfaces. », paragraphe « About us ». Publications, formats, cadence : `UNKNOWN` (mur de connexion).

### 1.5 X, Medium, YouTube, Vimeo, Behance

- **X** : 403, rien lu. `UNKNOWN`.
- **Medium « Metalab Tech »** (accessible en émulation mobile) : 78 abonnés, billets d'ingénierie, dont des publications du 02/05/2025 et du 05/08/2025 (« Polymorphic components and you »). Cadence faible, canal technique. Le site renvoie aussi vers Medium dans le pied de page.
- **YouTube** : aucune chaîne trouvée à `@metalab` ; **Vimeo** : homonyme exclu ; **Behance** : introuvable à cet identifiant. Metalab semble n'avoir ni chaîne vidéo officielle ni Behance publics aux adresses testées (DÉDUIT, non prouvé : des adresses différentes peuvent exister). Les vidéos vivent sur le site (boucles de fond, démonstrations d'étude de cas) et sur Dribbble (showreel).

### 1.6 Synthèse des canaux

| Canal | Rôle apparent | Format dominant | Cadence |
|---|---|---|---|
| Site | vitrine et preuve | grand serif + très peu de mots + visuels plein cadre | refonte datée de « july-2025 » (nom de dataset CMS) ; blog tous les 3 à 4 mois |
| Dribbble | portfolio pour pairs | shots par facette, boucles courtes | `UNKNOWN`, dernier repère 2022 |
| Instagram | image de marque | tuiles couleur, logos, reels | `UNKNOWN` |
| LinkedIn | employeur et prospects | `UNKNOWN` | `UNKNOWN` |
| Medium | ingénierie | billets techniques | 2 billets visibles en 2025 |

---

## 2. Grammaire visuelle de Metalab

### 2.1 Échelle typographique et rythme (CONSTATÉ, 1440 px)

Deux familles : un **serif d'affichage fin** (« PP Eiko », graisses 240 à 400, très contrasté) pour titres, chiffres, légendes de citation ; un **grotesque** (« Basis Grotesque Pro », 350 à 500) pour le texte, les menus, les blocs de déclaration et le très grand « Next case study » ; deux autres fichiers chargés (« Suisse Int'l », « ABC Diatype Mono ») ne produisent rien dans les pages relevées. Police racine : 10 px (toutes les tailles en `rem`).

| Rôle observé | Famille | Corps (1440) | Interligne | Approche (em) | Mobile 390 |
|---|---|---|---|---|---|
| Titre d'étude de cas | serif | 140 px (9,7 vw) | 1,2 | −0,015 | 64 px |
| Titre de page / gros énoncé | serif | 88 px (6,1 vw) | 1,18 (0,8 à 1 quand les mots sont dispersés) | −0,02 | 44 px |
| Grands chiffres | serif | 84 px | 0,85 | −0,015 | 120 px (!) |
| Énoncé de section | serif | 64 px | 1,2 | −0,02 | non relevé |
| Très grand titre en grotesque | grotesque | 220 px (15,3 vw) | 1,0 | −0,03 | 110 px |
| Introduction d'étude de cas | grotesque | 56 px | 1,21 | −0,02 | 28 px |
| Phrase de vision (une phrase) | grotesque | 40 px | 1,2 | −0,03 | 24 px |
| Étiquette de section / titre de ligne | grotesque | 20 px | 1,3 | −0,01 | 18 px |
| Texte courant | grotesque | 16 px (graisse 350 à 400) | 1,4 | −0,01 | 14 à 16 px |
| Navigation, horloge, mentions | grotesque | 12 px | 1,2 | −0,01 | 14 px |

À retenir : (a) un saut très fort entre texte (16) et affichage (88 à 220), avec très peu de paliers intermédiaires ; (b) l'interligne **se resserre quand la taille monte** (de 1,4 à 0,8) ; (c) l'approche est toujours légèrement négative ; (d) sur mobile les grands corps sont divisés par deux environ, le texte courant ne bouge pas, la navigation grossit (12 → 14) ; (e) aucune capitale en titre ; les capitales n'apparaissent que sur les micro-mentions.

**Quantité de texte (CONSTATÉ, structure.json).** Étude de cas Midjourney : 11 à 80 mots par section, environ 370 mots au total. Les sections « énoncé » ont 5 à 18 mots. L'index Work : une phrase de 15 à 25 mots par ligne.

### 2.2 Grille, marges, rythme vertical

- Marge latérale : 24 px. Gouttière : 24 px. **6 colonnes de 212 px** pour les modules de texte et d'images (1440 = 2 x 24 + 6 x 212 + 5 x 24) ; **12 colonnes de 94 px** pour les rangées de chiffres. Les textes et les images sont placés **par décalage de colonnes** (texte en colonnes 1 à 2, image en 3 à 6, puis l'inverse), ce qui crée un zigzag lent.
- Jeton de respiration vertical : `--vertical-gutter: 14rem` = 140 px. Les « blocs d'air » sont de vraies sections vides de 102, 150 ou 198 px entre deux modules (CONSTATÉ : plusieurs sections de 102 à 198 px portant seulement une phrase).
- Autres valeurs de l'échelle : 8 px (rayon de petit cadre), 16 px (grand cadre), 50 px (pastille), gouttière de bouton 16 px, hauteurs de bouton 24 / 32 / 36 px.
- Largeur de lecture : paragraphes courts de 3 à 4 colonnes (environ 500 à 690 px) ; énoncés de 40 px sur environ 700 px.

### 2.3 Couleurs et matière (CONSTATÉ, variables CSS)

- Fond noir pur `#000`, texte `#fff`, texte courant `#cac5ca`, texte discret `#79767a`, filets `#313033` (1 px), fond de ligne survolée `#171717`, fond de pastille gris à 20 % (`hsla(0,0%,73%,.2)`). Thème clair : `#fff` / `#edf1f5`.
- **Un seul accent : `#584dff` (violet).** Usage mesuré : pastille de filtre active, filets verticaux des rangées de chiffres et des colonnes numérotées, bordures d'état. Moins de 1 % de la surface de la page. Un violet très sombre `#100037` est défini mais non vu en usage.
- **Aucun grain, aucun bruit, aucun SVG de turbulence, aucun mode de fusion, aucune ombre portée, aucun dégradé CSS** sur les pages de contenu (CONSTATÉ : 0 `feTurbulence`, 0 `mix-blend-mode`, 0 `canvas`, `box-shadow` absent, `background-image` limité aux ombres internes de Swiper non affichées). Le seul `box-shadow` du CSS appartient à une bibliothèque de lecteur vidéo.
- **Les matières sont dans les images**, pas dans le CSS (CONSTATÉ, voir 2.4) : dégradés flous granuleux (dithering), trames de lignes de balayage, mosaïque de blocs, reflets 3D chromés, éclairage d'ambiance derrière les produits. Le site reste « propre » ; la richesse vient d'actifs préparés.
- **Verre dépoli (CONSTATÉ).** `backdrop-filter: blur(1.4rem)` sur les pastilles et boutons ronds, flou de 20 px sur la barre de navigation fixe (elle se resserre en une pastille centrée au défilement), flou de 20 px sur le curseur quand il survole une vidéo, avec un masque en forme d'icône (le flou n'apparaît qu'à l'intérieur du symbole lecture/pause).
- Rayons : pastilles 50 px, petites cartes 8 px, grandes cartes 16 px ; **images de contenu à 0 px**, vignettes de personnes à 0 px.

### 2.4 Traitement des images et de la vidéo

CONSTATÉ.
- **Fonds plein écran de l'accueil** : 10 images (une par cas) de 2000x1200 en WebP qualité 80 (sources 2500x1500, JPG ou PNG), plus 10 vignettes 1500 px et 10 versions 1920 px (AVIF ou WebP). Les plus lourdes (≈ 220 à 660 Ko) sont les fonds **texturés** ; les fonds lisses font 8 à 60 Ko.
- Boucle vidéo de l'accueil : `…/files/nuxb3jim/production-july-2025/6fbb33f6…c542.mp4`, MP4, 2 922 144 octets, 1920x1152, 20,0 s, muette, en boucle, `object-fit: cover`, apparition en fondu de 0,6 s (délai 0,1 s). Image de remplacement affichée avec un fondu de 0,6 s (délai 0,4 s).
- **Matières observées** (captures `shots/motion-hover/`, zooms `sheets/zoom-suno.png` et `zoom-atlantic.png`) : (1) Suno : champ de dégradé flou **traité en bruit stochastique** (grain par pixel, violet/orangé/prune) ; (2) The Atlantic : portrait monochrome en **lignes de balayage** horizontales avec rectangles noirs, effet « écran de contrôle » ; (3) accueil par défaut : rendu 3D métal chromé et lavande ; (4) Robinhood : bague 3D chartreuse sur noir. Les transitions entre fonds laissent apparaître brièvement une **mosaïque de blocs** (frames à 120 ms), puis le fond net en 500 ms.
- Études de cas : produits montrés sur **fond sombre éclairé** (halo doux derrière une maquette, cadrage serré, ombres de contact peintes dans l'image), téléphones tenus en main, écrans réels. Vignettes de personnes en 130x160, sans traitement colorimétrique visible.
- **Logos clients** : SVG monochromes blancs 120 px de large, `object-fit: contain`, très nombreux (170 dans l'index).
- Chargement différé (`loading="lazy"`), tailles servies par le CDN (largeurs de 50 à 2 500 px), AVIF + WebP.
- Cadrage dans le texte : une image « flotte » dans la grille, avec une légende minuscule alignée à gauche, sans bordure ni ombre ; certaines images s'ouvrent par un masque rectangulaire (voir 2.5).

### 2.5 Mouvement : durées et courbes mesurées

CONSTATÉ, sauf mention.

| Geste | Mesure | Détail |
|---|---|---|
| **Préchargeur de l'accueil** | **5,4 s** du premier fond blanc au texte final (screencast) | 0,0 à 0,8 s : blanc ; 0,86 s : mots « We / Make / Interfaces » dispersés sur la page blanche ; 1,08 s : une barre noire verticale traverse ; 1,3 s : une carte verticale foncée s'ouvre au milieu ; 1,5 à 4,0 s : les mots glissent latéralement autour de la carte ; 4,1 à 4,8 s : la carte s'agrandit jusqu'au plein écran ; 5,0 s : « We make interfaces » en fondu ; 5,4 s : menu et pastilles. Avec `prefers-reduced-motion` : **préchargeur supprimé**, fond sombre visible dès 0,6 s, fondu de ≈ 1,5 s |
| **Transition de page** (accueil vers Work) | **≈ 2,7 s** (11,6 s à 14,3 s dans le film) | un rideau noir fait défiler un mur de logos clients en monochrome, de droite à gauche, puis le nouveau titre apparaît. La page est déjà chargée : c'est du théâtre |
| **Défilement** | Lenis, durée de code 1,2 ; 600 px de molette atteints à 98 % en **665 ms** | fort amorti de sortie (69 % de la distance parcourue à 25 % du temps) ; Lenis **reste actif** avec `prefers-reduced-motion: reduce` (CONSTATÉ : classe `lenis lenis-smooth`). Sur mobile, le défilement a lieu dans un conteneur interne |
| **Texte qui entre** (paragraphes et titres de section) | opacité 0 → 1 en **≈ 1,05 s** | courbe quasi linéaire à légère sortie douce (16 % à 20 % du temps, 64 % à 50 %, 97 % à 90 %) |
| **Masque d'image** (révélation d'une image) | découpe `clip-path` polygonale de 0 à 100 % de la hauteur en **≈ 0,8 s** | courbe en S (16 % à 40 % du temps, 76 % à 60 %, 99 % à 80 %) : entrée et sortie douces, type `power3/power4.inOut` |
| **Image sous le masque** | échelle de 1,3 à 1 en **≈ 1,2 s**, démarrage retardé d'environ la moitié de la découpe | sortie douce ; sensation d'image qui « se pose » |
| **Survol d'une ligne de l'index** | fond de transparent à `#171717` en **≈ 0,32 s** utiles (déclaré 0,4 s) ; un aperçu d'image s'ouvre dans la ligne (conteneur de hauteur 0 → 160 px, déclaré 0,4 s) | pas de ressaut, pas d'agrandissement ; sous `prefers-reduced-motion` la hauteur ne s'anime plus (règle explicite dans le CSS) |
| Pastilles, boutons, bordures | 0,2 s (couleur de fond, bordure, remplissage droit) | déclaré |
| Trait de lien, flèche de ligne | 0,4 s (largeur ou translation) ; souligné de bouton de pied de page 0,7 s | déclaré ; « lire la suite » : texte qui monte (`translateY(105%)`) et trait qui s'étire (`scaleX(0 → 1)`) en 0,4 s |
| Aperçus de menu, fond vidéo | fondus de 0,6 s | déclaré |
| Courbes dans le code | `cubic-bezier(0.22, 1, 0.36, 1)` (sortie forte), `(0.65, 0, 0.35, 1)` (entrée-sortie), `(0.75, 0, 0.15, 1)`, GSAP `power3/power4/expo`, Framer `[.4, 0, .1, 1]` | lu dans les paquets JS en mémoire ; rien conservé |

Observations d'accessibilité utiles pour la transposition : curseur natif **supprimé** au-dessus de 967 px en pointeur précis (`html, html * { cursor: none }`) ; seule la règle d'index Work déclare `prefers-reduced-motion` dans le CSS ; sans JavaScript la page d'étude de cas ne rend que **231 caractères** (le titre, pas le corps) ; avant tout défilement, le texte hors écran est à opacité nulle (comportement normal, mais le contenu n'existe pas sans JS ni mouvement).

### 2.6 Micro-interactions

- **Curseur personnalisé** : cercle de 96 px, suit la souris sans retard mesurable, se réduit à un point de 10 px au survol d'une ligne, affiche les mentions « Hover » ou « Drag » selon la zone, devient une icône lecture/pause floutée au-dessus d'une vidéo.
- **Pastilles de cas** (accueil) : survol d'une pastille = le fond change (transition en blocs, voir 2.4) et le titre du cas s'affiche en serif au centre bas, la description en haut, les services à droite, une vignette du produit en bas à droite ; la pastille active a un contour blanc.
- **Menu** : un bouton « Menu » en haut à gauche ; panneau clair (blanc) qui s'ouvre avec le visuel de la page courante, 4 liens serif, 9 pastilles de cas, une rangée de cartes d'actualité.
- **Horloge** : « YYZ 12:34 PM », puis cycle de codes de villes (LDN, CDG, YYJ, NYC, SFO, FRA, SYD, CPT) dans le menu : repère d'équipe répartie. Bouton de bascule sombre/clair, bouton enveloppe vers le contact.
- **Rangées « How can we help? »** : trois lignes à filet de 1 px (« Work together », « Join our team », « Just say hello ») avec une flèche à droite ; survol = trait de souligné.
- **Filtres** : pastilles ; la pastille active devient violette ; compteur « nothing found » en fondu retardé de 0,6 s.
- **Formulaire** : champs soulignés, soulignement qui s'étire en 0,2 s au focus, étoile sur les champs obligatoires, texte d'aide qui devient gris.

### 2.7 Structure d'une étude de cas (CONSTATÉ, `structure.json`)

Ordre sur Midjourney (12 sections, 11 226 px de haut au bureau) :
1. **Hero de cas** (1 288 px) : titre de client en serif 140 px ; rangée de trois métadonnées (Type de projet, Stade, Livrables) en libellé gras de 16 px et valeur grise ; sous elle, **visuel plein cadre** (maquette sur fond éclairé).
2. **Introduction** : un paragraphe de 56 px (≈ 66 mots) précédé d'un libellé minuscule (« Introduction »).
3. **Phrase de vision** (13 mots) en 40 px, précédée du libellé « The vision ».
4. **Texte + 1 image** en zigzag : petit texte de légende (14 à 16 px, 36 mots) dans les deux premières colonnes, image large à droite, souvent une courte vidéo en boucle.
5. Phrase-titre (« Sweating the details ») + média large masqué ; ensuite un diptyque d'images ; encore une phrase-titre ; encore un texte + image.
6. **Rangées de résultats** (« Outcomes ») : phrase de portée à droite, puis trois lignes à filet 1 px, chacune avec un **grand chiffre serif à gauche** (6, 10 k+, 20 M+) et un libellé à droite (« Months of collaboration », « Discord messages exchanged », « Users impacted »).
7. **« Next case study »** : texte de 220 px en grotesque avec une image verticale qui passe au milieu (le texte et l'image se recouvrent) et la légende du cas suivant.
8. **« How can we help? »** + 3 lignes d'action + pied de page (liens sociaux, Careers, Contact, Privacy, Accessibility) + deux icônes animées.

Robinhood : 17 sections ; Windsurf : 25 sections, avec un module de citation minimaliste (`MinimalQuote`, 33 mots) avant le cas suivant. Les trois cas partagent les mêmes modules (`TitleAndText`, `TextAnd1Image`, `TextAnd2Images`, `MaskReveal`, `StatRows`, `NextCaseStudy`) : le CMS compose un cas en empilant des blocs. Le nom du CMS et des composants confirme un **système de blocs réutilisables**, proche de la logique « types de contenu » de la spec §8.

### 2.8 Composition signature (à ne pas reproduire)

- Mots du H1 dispersés à travers un écran blanc autour d'une carte vidéo verticale qui s'ouvre en plein cadre.
- Portraits miniatures insérés dans la ligne du titre (page About).
- Liste verticale de pastilles qui pilote un fond plein écran.
- Mur de logos en rideau de transition.
- Combinaison exacte serif fin contrasté + grotesque + violet unique sur noir pur.

---

## 3. Table de transposition pour Parrit.ai

Principe : on transpose un **mécanisme** (ordre, rôle d'un bloc, durée, règle), pas une composition, un texte, une illustration ni l'identité. Les couleurs et polices restent celles du Brand OS : General Sans (600 pour boutons, 500 pour l'éditorial `--ed`) et IBM Plex Mono ; jetons `--brand-*` adaptés par `src/system/tokens.css`. **Aucun hex dans une page.**

Règles du dépôt citées (AGENTS.md, section « Source de vérité visuelle = Brand OS », et canon `parrit-canon/brand/`) :
- **R1** : « **Formes** : radius 0 sauf téléphone, zéro dégradé ; zéro ombre. » (le test `qa:network:rev01` dit « une ombre max, zéro radius » ; l'écart est à lever, voir section 5)
- **R2** : « **Accent** : utiliser les jetons contextuels du registre clair/sombre ; aucune couleur littérale hors du fichier vendorisé. »
- **R3** : « Interdit de créer un design system local ou une seconde famille typo. » ; « Un hex dans une page est un défaut. »
- **R4** : « **Photo** : aucune photo de remplacement avant AV-3 ».
- **R5** : « **Connecteurs** : tige et tête vectorielles suivant VS-CONNECTOR, aucune flèche-caractère. »
- **R6** : la command bar « porte … une seule action principale » ; elle est « dans le flux normal du document, PAS `position: fixed` » ; « sans horloge live (retirée, décorative) ».
- **R7** (canon `rules/composition.json`) : « STRUCTURE VISIBLE : la structure (grille, repère, bande, étiquette) est le décor » ; « un éclat par slide (rose en accessible) » ; « interdits : dégradé, halo, ombre décorative, majuscules de titre, micro-texte, rouge ».
- **R8** (canon `tokens/foundations.json`) : « effects: shadow none, gradient none … Le flou de la photo (fond de cadre large) est une exception documentée » ; décision D3 « formes/flou » encore à confirmer.
- **R9** (spec §7) : « Animations discrètes, non bloquantes » ; `prefers-reduced-motion` ; images différées, dimensions réservées ; H06 « accessible au clavier, sans animation obligatoire ». Benchmark du 26/10 : « Rendu complet sans JS ni mouvement ».
- **R10** (AGENTS « règle d'index ») : « La structure n'ajoute pas d'étape entre le visiteur et la valeur. »
- **R11** : échelle typographique à « cinq pas » de titres (contrat de lisibilité) ; nouveau jeton = « ADR §48, pas un hex dans le code ».
- **R12** : tokens de mouvement existants : `--ease: cubic-bezier(.2,0,0,1)`, `--micro 120ms`, `--move 240ms`, `--seq 400ms`, `--hold 600ms`.
- **R13** : spec §6 et AGENTS : aucun chiffre sans source, aucun logo sans autorisation, noms de clients limités à `public-clients.ts`.

Légende : **OUI** = compatible tel qu'écrit ; **NON** = contraire à une règle écrite ; **À ARBITRER** = la règle écrite ne tranche pas, ou une décision de Paul est déjà ouverte (D3, AV-3, AV-6).

| # | Technique observée chez Metalab | Comment la faire avec les couleurs et polices de Parrit | Verdict et règle |
|---|---|---|---|
| T01 | Titre d'affichage énorme, interligne très serré (0,8 à 1,2), approche négative, aucune capitale | Garder `--d-xl` (84/88 px) et `--d-m` ; interligne ≈ 0,95 à 1,0 sur le H1 ; approche négative du canon (`tracking_em.display = -0,035`) ; General Sans 500 (`--ed`). **Le contraste Metalab entre serif fin et grotesque ne se transpose pas** (pas de seconde famille) : on obtient la tension par l'échelle (88 contre 16) et la graisse (500 contre 400), pas par une police | **OUI** (R3, R11 : on reste dans les cinq pas) |
| T02 | Serif d'affichage contrasté en face d'un grotesque | Aucune ; la serif est « exceptionnelle et hors decks commerciaux » (canon) et `dead_families` liste Fraunces, Cormorant, Playfair | **NON** (R3) |
| T03 | Saut texte/titre très fort, peu de paliers | Resserrer l'usage de l'échelle existante : H1 84, H2 54 (`--d-m`), corps 18, étiquettes 16 mono. Interdire les corps intermédiaires dans les pages nouvelles | **OUI** (R11) |
| T04 | Libellé minuscule + une phrase de déclaration de 40 px + paragraphe court (grammaire de bloc) | Libellé en IBM Plex Mono (`mono_caps` 0,14 em), phrase en General Sans 500 à `--t-xl` ou `--d-s`, paragraphe à `--t-m` ; une phrase = une idée ; 5 à 18 mots pour la phrase | **OUI** (R7 « la mono est réservée à l'appareil technique ») |
| T05 | Rangée de métadonnées en tête de cas (type de projet, stade, livrables) | Remplacer par le « statut publiable » de la spec T3 : « Nature de la mission / Niveau de preuve (simulation, prototype, pilote, en production) / Livrables », libellés mono, valeurs en `--g2` | **OUI** (R13 : sert l'exigence de statut) |
| T06 | Grille de 6 colonnes (212 + 24) avec zigzag texte/image par décalage de colonnes | Garder la colonne `max-width: 1160px` (alignement de la command bar) ; y poser 6 colonnes de 24 px de gouttière (`--s3`) ; zigzag par décalage de colonnes | **OUI** (R6 : alignement sur 1160 px conservé) |
| T07 | Marges de 24 px et « blocs d'air » de 102 à 198 px | Respiration verticale = multiples de `--s8` (64) : 64 / 128 px ; un bloc d'air = une section vide de `calc(var(--s8) * 2)` portant éventuellement une seule phrase | **OUI** (R11 : pas de nouveau jeton, des multiples) |
| T08 | Filets de 1 px entre rangées, structure comme décor | Filets `--rule-l` / `--rule-d` ; rangées à filet pour Références (H02), livrables, critères ; repères d'angle du **Parrit Frame** déjà existants | **OUI** (R7 « STRUCTURE VISIBLE ») |
| T09 | Fond noir pur et blanc en alternance de blocs | Alternance des régimes du Brand OS : `calm` (fond `--paper`), `ink`, `canard`, `rose` (réservé à un éclat par écran), via `data-regime` | **OUI** (R2, R7) |
| T10 | Accent unique sur moins de 1 % de la surface (violet) | Rose en éclat unique par écran (`--accent-on-dark`) sur fond sombre ; canard en texte d'action sur clair ; jamais deux éclats | **OUI** (R7 « un éclat par slide ») |
| T11 | Numérotation 01 à 06 en colonnes séparées par des filets verticaux violets | Le « Standard en critères numérotés 01…06 » existe déjà comme élément propriétaire : réutiliser pour Observer / Prioriser / Transformer / Mesurer (4 colonnes) ; chiffres en mono ; un filet vertical `--accent-line` sur l'étape active | **OUI** (R7, AGENTS « Éléments propriétaires ») |
| T12 | Grands chiffres en serif de 84 px avec filet, sur 12 colonnes | La forme (chiffre, libellé, filet) sert à des chiffres **sourcés** seulement ; sur Parrit : taille `--d-xl`, source et période dans le libellé | **OUI** sous R13 (aucun chiffre sans méthode) ; **À ARBITRER** si un corps supérieur à 88 px est voulu (R11 : sixième pas = jeton nouveau, ADR §48) |
| T13 | « Next case study » en 220 px | Lien « Cas suivant » en `--d-xl`, légende en mono ; pas de 220 px | **OUI** à 84/88 px ; **À ARBITRER** au-delà (R11) |
| T14 | Texte et image qui se recouvrent (le « Next » traversé par une image) | Recouvrement texte sur image : tolérable seulement avec un contraste vérifié (WCAG AA visé). Sur Parrit, la superposition est limitée aux bandes pleines `canard` ou `ink` | **À ARBITRER** (spec §7 contraste AA ; test `audit-readability`) |
| T15 | Aplat de fond « matière » préparé dans une image (grain stochastique, trame) | Trame **à pas fixe** (lignes, points, hachures) en deux couleurs de jetons, produite comme `<svg>` ou image ; densité constante, **aucun passage progressif d'une teinte à l'autre** | **OUI** pour la trame régulière (R1, R7 : pas de dégradé) ; voir T16 pour le grain |
| T16 | Grain « dithering » qui simule un dégradé flou (fond Suno) | Même technique avec jetons : un bruit entre `--ink` et `--canard` en densité variable. **Visuellement, c'est un dégradé** | **À ARBITRER** (R1 « zéro dégradé », R7 « interdits : dégradé, halo » : la règle vise le CSS mais l'effet visuel en est un ; compatible seulement si la densité reste constante, ce qui revient à un aplat granuleux) |
| T17 | Grain en surimpression (couche d'opacité sur tout le site) | Absent chez Metalab (CONSTATÉ). Possible chez Parrit par une couche `background-color` d'un jeton à opacité faible : les jetons `--brand-surf` (`rgba(255,255,255,.12)`) montrent le principe. Un bruit raster resterait un actif | **OUI** pour une couche unie d'un jeton à opacité ; **À ARBITRER** pour un bruit raster (R2 : couleur depuis les jetons) |
| T18 | Grille de points (trame discrète) | Les jetons `dots` / `aqua_dots` existent dans le canon pour le mode **complex**, non exporté (AV-6) | **À ARBITRER** : demander à Paul si une trame de points en mode accessible est admise ; sinon filets seuls |
| T19 | Verre dépoli (`backdrop-filter: blur`) sur pastilles et barre de navigation | Aucun flou sur les surfaces ; fond plein `--paper2` ou `--carbon2` | **À ARBITRER** (R8 : le flou est une exception documentée **seulement pour la photo** ; D3 ouverte) ; recommandation : **ne pas faire** |
| T20 | Pastilles arrondies à 50 px, cadres à 8 et 16 px | Puces rectangulaires (radius 0), filet de 1 px, remplissage `--accent-surface` en état actif ; le téléphone (propriétaire) garde son rayon | **NON** pour les rayons (R1 « radius 0 sauf téléphone ») ; **OUI** pour la forme à rayon 0 |
| T21 | Ombre peinte derrière un produit (éclairage dans l'image) | Capture sur fond uni de jeton, sans halo ; le canon interdit « halo, ombre décorative » | **NON** (R7, R8) ; capture réelle sur aplat |
| T22 | Boucle vidéo plein écran muette en fond de hero | Boucle courte de **vrais écrans** de réalisations autorisées (pas de robot, pas de pseudo-interface), poster fixe, ≤ 1,5 Mo, désactivée en `prefers-reduced-motion` et en économie de données ; sinon image fixe | **À ARBITRER** (R4 sur la photo ne vise pas la vidéo ; mais spec §6 exige permission et statut ; poids contre « Core Web Vitals good ») |
| T23 | Un fond plein cadre par cas (liste de pastilles qui pilote le fond) | Pour `/dossiers` : index en lignes (T24) ; pas de fond plein cadre qui change au survol (inaccessible au toucher, lourd) | **NON** pour le mécanisme ; l'idée d'index est reprise en T24 |
| T24 | Index en lignes à filet : nom à gauche, une phrase au centre, services en gris à droite, ligne qui s'éclaire au survol | Rangée : nom du client (public-clients.ts, en texte, **sans logo**), ce que nous avons fait, statut en mono ; survol : fond `--accent-surface` en `--move` (240 ms) ; clavier : même état au focus visible | **OUI** (R10 : une action par ligne vers la destination finale ; R13) |
| T25 | Aperçu d'image qui s'ouvre dans la ligne survolée (hauteur 0 → 160 px en 0,4 s) | Aperçu ouvert au survol **et au focus**, 240 à 400 ms (`--move` / `--seq`), contenu = capture réelle autorisée ou schéma ; sous `prefers-reduced-motion` : hauteur fixe visible | **OUI** (R9, R12) |
| T26 | Révélation d'image par masque polygonal + échelle 1,3 → 1 | `clip-path: inset()` rectangulaire (aucun rayon) en `--hold` (600 ms) avec `--ease` ; échelle 1,06 → 1 plutôt que 1,3 ; CSS pur (`animation-timeline: view()` si pris en charge, sinon rien) | **OUI** (R1 : formes rectangulaires ; R9 ; R12) |
| T27 | Apparition de texte par opacité (1,05 s) | Opacité + translation de 8 à 12 px en `--seq` (400 ms), une seule fois, **contenu visible par défaut** et animation ajoutée par `@media (prefers-reduced-motion: no-preference)` ; jamais d'état initial invisible dépendant de JS | **OUI** (R9 ; leçon L'École : 109/167 éléments invisibles avant défilement) |
| T28 | Défilement lissé (Lenis) | Aucun : défilement natif | **NON** (R9 « non bloquantes » ; Lenis reste actif sous `prefers-reduced-motion` : CONSTATÉ ; casse la recherche dans la page et les ancres) |
| T29 | Préchargeur de 5,4 s | Aucun préchargeur ; séquence d'entrée du hero **≤ 1,0 s** et non bloquante, en CSS | **NON** (R9, R10 : la structure n'ajoute pas d'étape) |
| T30 | Rideau de transition de page (2,7 s) | Aucun ; navigation immédiate | **NON** (R10) |
| T31 | Curseur personnalisé de 96 px et suppression du curseur natif | Aucun | **NON** (accessibilité ; R9) |
| T32 | Barre de navigation fixe qui se resserre en pastille au défilement | La command bar Parrit n'est « PAS `position: fixed` » ; garder. Pour les pages longues : sommaire collant de la page Harness (spec T2), pas de barre flottante | **NON** pour la barre flottante (R6) ; **OUI** pour le sommaire de page |
| T33 | Horloge d'équipe et codes de villes | Ligne de registre statique « PARRIT / SPRINTS · 2026 » (élément propriétaire existant) | **NON** pour l'horloge (R6 « horloge live (retirée, décorative) ») ; **OUI** pour la ligne de registre |
| T34 | Bascule de thème sombre/clair choisie par le visiteur | Les régimes du Brand OS sont posés par section, pas par préférence utilisateur | **À ARBITRER** (hors spec ; faible priorité) |
| T35 | « How can we help? » : titre + 3 lignes d'action à filet et flèche | H12 : « Parlons de l'opération que vous voulez transformer. » + 3 lignes (dirigeant, DSI, besoin circonscrit) qui mènent **toutes** à `/commission` avec `?source=` posé par `avecSource()` ; flèche = connecteur vectoriel VS-CONNECTOR ; souligné de survol 240 ms | **OUI** (R5 ; AGENTS « un seul lien de réservation » ; spec H12 « éviter doubles parcours ») |
| T36 | Rangées « tiroir » (libellé gauche, ligne à filet, signe +) | `<details>` natif ; signe + vectoriel ; libellé à gauche, contenu au dépliage en 240 ms | **OUI** (R9 clavier) |
| T37 | Colonnes qui s'élargissent au survol (`HoverableColumns`, largeur 0,4 s, description en fondu 0,6 s) | Module H06 à trois états : colonne active plus large, **choisie par clic ou clavier** (boutons radio), pas au survol seul ; sans animation obligatoire | **OUI** (spec H06) |
| T38 | Marquee de logos (`LargeTicker`) | Aucun défilement automatique ; H08 en rangées groupées par fonction avec statut | **NON** (spec H08, benchmark « logos statiques ») |
| T39 | Logos clients monochromes en mur | Aucun logo au lot 1 | **NON** (R13) |
| T40 | Équipe par portraits miniatures dans une ligne de titre | Aucune photo ; rangées nominatives par rôle sans image | **NON** (R4 ; AV-3) |
| T41 | Formulaire à champs soulignés, 5 champs, sans budget | Champs minimaux sur `/commission` ; soulignés en `--rule-l` | **OUI** (spec H12 « champs minimaux ») |
| T42 | Chips de filtre (Startup, AI, Finance…) | Pour `/dossiers` : filtres par porte (Conseil, Sprint, Engineering) en puces à rayon 0 | **OUI** (R1 pour la forme) |
| T43 | Descriptif servi par le CMS en blocs réutilisables | Types de contenu de la spec §8 ; module `CaseStudyCard`, `EvidenceBadge` | **OUI** (spec §8, §11) |
| T44 | Médias servis en AVIF/WebP à largeurs multiples | Déjà le standard Next ; garder `loading="lazy"` sous la ligne de flottaison et dimensions réservées | **OUI** (R9) |

---

## 4. Propositions concrètes par section (spec H01 à H12 et page Harness)

Elles ne reprennent que des mécanismes de la table 3. Toutes respectent le contenu de `ETAPE-1-PLAN.md` ; aucun chiffre ni nom nouveau n'est introduit. Hypothèses à tester, pas des décisions.

**H01, hero.** Garder le H1 « Transformez votre entreprise. Pas simplement vos outils. » à `--d-xl`, interligne ≈ 0,95, approche du canon, 3 lignes sur mobile (`--d-xl` passe à 40 px sous 760 px). Ajouter, au lieu d'une horloge, une ligne de registre mono « PARRIT / TRANSFORMATION · 2026 ». Visuel « Aujourd'hui → Demain » : filets qui se tracent en `--seq` (T27), repères du Parrit Frame qui passent de « fermé » à « ouvert » (le mécanisme existe : `.frame.closed`, 240 ms), puis les étapes manuelles, puis le système avec sa validation humaine, 120 ms d'écart entre étapes. **Durée totale ≤ 1,0 s**, contenu entièrement visible sans JS. Contre-exemple Metalab : 5,4 s de préchargeur.

**H02, bandeau de confiance.** Cinq noms de `public-clients.ts` en rangées à filet (T24) : nom, ce qui a été fait, statut en mono. Pas de logo, pas de mur. Au survol et au focus, fond `--accent-surface` en 240 ms. Quand une référence est masquée faute de permission, la rangée disparaît sans trou (état vide élégant).

**H03, Conseil & Transformation.** Les quatre étapes en 4 colonnes numérotées 01 à 04 séparées par des filets verticaux (T11) ; l'étape active reçoit un filet `--accent-line` ; apparition en cascade de 120 ms (`--micro`) quand la section entre à l'écran, sinon visible d'emblée. Chaque colonne : libellé mono, phrase de 8 à 15 mots, un livrable.

**H04, réalisations.** Trois cartes sur la grammaire du cas Metalab : rangée de statut (T05), phrase de déclaration (T04), paragraphe court. Le niveau de preuve (simulation, prototype, pilote, en production) est la première ligne, pas un pied de carte. Aperçu d'image dans la carte au survol et au focus (T25), seulement si une capture réelle autorisée existe ; sinon un schéma vectoriel. Aucun chiffre sans méthode (R13).

**H05, AI Sprints.** Quatre étapes en rangées (Cadrage, Construction, Évaluation, Décision) à filet de 1 px, numéro mono à gauche, phrase à droite ; « Livré / Non livré » en deux colonnes à rangées de tiroirs natifs (T36). Pas de « chiffres d'effet » ; pas de durée.

**H06, Engineering & Intégration.** Trois états Intégrer / Construire / Orchestrer en trois colonnes dont l'active s'élargit en 240 ms (T37), choix par clic, touches fléchées ou focus ; sans mouvement, les trois sont lisibles en pile. Phrase de bas de module sur propriété, hébergement et réversibilité.

**H07, Harness Engineering (section de l'accueil).** « Même tâche, sans puis avec le harnais » : deux états d'un même schéma, reliés par des connecteurs VS-CONNECTOR ; l'état « avec » referme les repères du Parrit Frame et fait apparaître les vérifications et les permissions un par un (240 ms chacun). Affichage de mesures **uniquement** avec un test réel ; sinon un bandeau de statut « simulation ». Un interrupteur à deux positions pour comparer, avec les deux états côte à côte quand le mouvement est réduit.

**H08, H09, H10 (lot 2).** H08 : rangées groupées par fonction (modèles, données, cloud, orchestration, outils), **sans marquee**, avec colonne « statut ». H09 : profils sous forme de rangées nominatives (nom, spécialité, rôle concret, statut de permission) sans photo (R4). H10 : rangées Formia / Calypie / Qualiopi avec la relation exacte en mono ; la certification n'est jamais posée en pastille de hero.

**H11, méthode et équipe.** Les six étapes de la méthode en ligne verticale dont le filet se trace avec le défilement (CSS `animation-timeline: view()` en amélioration progressive ; sans prise en charge, filet tracé d'emblée). Rangées « qui fait quoi » par rôle, sans portrait.

**H12, dernier appel.** « Parlons de l'opération que vous voulez transformer. » en `--d-xl` ; sous le titre, trois rangées à filet (dirigeant, DSI, besoin circonscrit) qui mènent toutes à `/commission` avec le paramètre `source`. Une flèche vectorielle à droite ; au survol, souligné de 240 ms. Délai de réponse annoncé seulement s'il est engagé (le plan dit qu'il ne l'est pas).

**Page Harness Engineering (gabarit T2).** Grammaire de cas Metalab appliquée à un guide : très grand titre ; rangée de métadonnées « Nature : construction neuve ou optimisation / Public : DSI, dirigeant / Mise à jour : date » ; puis modules « libellé mono, phrase de déclaration, paragraphe court » ; un schéma du harnais en grille de filets avec repères d'angle ; protocole d'évaluation en rangées numérotées (T11, T12 seulement avec un résultat réel) ; sommaire collant dans la colonne de gauche (remplace la barre flottante de Metalab) ; « Page suivante » (équivalent de « Next case study ») à `--d-xl`. Les dates de mise à jour visibles reprennent la leçon de L'École.

**Transversal.**
1. Une grammaire de bloc commune (T04) pour toutes les pages d'offre : cela répond à la spec §3 (gabarit T1).
2. Alternance de régimes `calm / ink / canard` toutes les 1 à 2 sections, un seul éclat rose par écran.
3. Tokens de mouvement existants conservés. Plafond de **600 ms** (`--hold`) pour toute révélation ; au-delà, c'est du décor.
4. Test à ajouter aux specs Playwright (par Codex) : page rendue lisible **sans JS** et en `prefers-reduced-motion`, aucun élément hors écran n'a une opacité nulle en l'absence de la classe d'animation.
5. Pas de nouveau jeton : si une valeur manque, ADR §48.

---

## 5. Ce qu'il faut rejeter, et pourquoi

| À rejeter | Pourquoi |
|---|---|
| Préchargeur de 5,4 s et rideau de transition de 2,7 s | Violent R9 et R10 ; l'utilisateur attend 8 secondes de théâtre avant la valeur ; Parrit a un benchmark qui reproche déjà à L'École un masquage avant défilement |
| Défilement lissé (Lenis) et curseur remplacé | Casse la recherche de texte, les ancres, le clavier et les lecteurs d'écran ; Lenis reste actif sous `prefers-reduced-motion` (CONSTATÉ) ; curseur natif supprimé |
| Serif d'affichage contrasté | Seconde famille interdite (R3) |
| Accueil sans défilement vertical piloté par des survols | Inaccessible au toucher et au clavier ; contenu invisible pour un robot ; contraire à la règle d'index |
| Fond plein écran par cas qui change au survol | Poids (10 fonds de 2000 px = 1,6 Mo), dépend de visuels autorisés, aucun équivalent sûr tant que AV-3 et la permission des captures ne sont pas levés |
| Verre dépoli, rayons de 8, 16 et 50 px, ombres peintes dans l'image, halo | R1, R7, R8 : « radius 0 », « zéro ombre », « interdits : dégradé, halo, ombre décorative » |
| Mur de logos et défilement de logos | R13 : aucun logo sans autorisation ; spec H08 : pas d'effet de partenariat |
| Horloge d'équipe, codes de villes | R6 : horloge live déjà retirée comme décorative |
| Portraits dans la ligne du titre, photos d'équipe | R4 (AV-3) ; composition propre à Metalab |
| Mots du H1 dispersés autour d'une carte vidéo qui s'ouvre | Composition signature de Metalab ; spec §7 interdit de copier une composition singulière |
| Grands chiffres d'ensemble sans méthode (« 2,2 G d'utilisateurs », « 18 licornes ») | Spec §6 : chiffre avec méthode et période ; Metalab affiche les siens sans méthode |
| Bandeau de 220 px et superposition texte sur image | Sixième pas typographique non prévu (R11) et risque de contraste |
| Dithering qui simule un dégradé et grain raster sur l'ensemble du site | À arbitrer ; par défaut non ; risque de poids et de lisibilité |
| Hero de boucle vidéo de 2,9 Mo | À arbitrer ; poids ; capture réelle autorisée requise ; sinon image fixe |
| Dribbble en vitrine d'équipe | Canal ralenti chez Metalab (dernier repère 2022) ; tonalité de pairs, inadaptée à des dirigeants ; Parrit n'est pas un studio de design |
| Nombre de lignes d'index de 85 sans hiérarchie | Spec : « un catalogue de six offres interchangeables » est un anti-objectif ; on garde peu de cas, mieux prouvés |

### Arbitrages à demander à Paul (conflits de règles)

1. **Grain et dithering.** Un grain à densité constante est compatible ; un grain qui dessine un dégradé ne l'est pas tel que la règle est écrite (« zéro dégradé », « interdits : dégradé, halo »). Réponse attendue : oui pour aplat granuleux uniforme, non pour dégradé simulé ?
2. **Flou (verre dépoli).** D3 est ouverte : le flou n'est une exception que pour le fond de la photo. Si la réponse est non, tout le verre dépoli reste exclu.
3. **Rayons.** « radius 0 sauf téléphone » interdit les pastilles de filtre arrondies et les cartes à 8 ou 16 px. À confirmer : on garde des puces rectangulaires.
4. **Sixième pas typographique** (au-delà de 88 px) pour « Page suivante » et grands chiffres : jeton nouveau par ADR §48, ou on reste à 84/88 px.
5. **Trame de points en mode accessible** : les jetons existent pour le mode complex, non exporté (AV-6).
6. **Boucle vidéo en hero ou en cas** : permission des captures réelles, budget de poids, ou image fixe.
7. **Écart de formulation entre règles** : AGENTS dit « zéro ombre » et le test dit « une ombre max, zéro radius » ; à unifier avant tout lot qui touche aux surfaces.
8. **Bascule de thème** par le visiteur (faible priorité, hors spec).
9. **Recouvrement de texte sur image** (T14) : permis seulement avec contraste AA vérifié ?

---

## 6. Inconnus et limites

- Cadence, légendes, publications et audience réelle d'Instagram, LinkedIn et X : `UNKNOWN` (murs de connexion, 403).
- Aucune donnée de conversion, de performance de terrain ni de trafic : `UNKNOWN`. Les poids de page sont ceux des en-têtes `content-length` ; ils sont approximatifs.
- Les 14 études de cas ouvrables et la quantité d'entrées (85) viennent du DOM à un instant donné ; des doublons de variantes d'affichage sont possibles.
- Le noir pur, le serif fin et le violet sont les marqueurs d'identité de Metalab : ils ne sont pas transposables et ne doivent pas l'être.
- Les chiffres qu'affiche Metalab (utilisateurs, produits, licornes, diversité) sont cités tels qu'affichés ; non vérifiés ; non réutilisables.
- Ce qui est mesuré ici l'a été à 1440 et 390 px sous Chromium headless ; Safari et Firefox non testés. Le préchargeur peut varier selon la bande passante (mesure faite avec cache froid).
- Le contenu de l'étude de cas sans JavaScript (231 caractères rendus) est un constat de rendu ; la raison technique exacte (rendu côté client ou masquage) : `UNKNOWN`.
- Aucun actif de Metalab n'est repris ; les images de `shots/`, `sheets/` et `video/` sont des captures d'analyse locales et ne doivent pas sortir de ce dossier.

## 7. Index des livrables de ce dossier

- `RAPPORT.md` (ce fichier).
- `shots/` : captures de page (`<page>_<1440|390>_<fold|full>_2026-10-26.png`), mouvement (`motion-home/`, `motion-hover/`, `hero-media/`), réseaux (`social_*`), cas sans JS (`nojs_case_*`).
- `sheets/` : planches-contact (cas Midjourney, What we do, About, Work, préchargeur, transition de page, survols, menu, réduction de mouvement, zooms de matière).
- `video/` : 1 182 images de parcours (analyse seulement).
- `*.json` : `css-home.json`, `css-work.json`, `type-*.json` (échelle typographique, grilles, couleurs, rayons, bordures, espacements par page et par largeur), `measure-work.json`, `measure-reveal.json`, `structure.json`, `hero-media.json`, `js-analysis.json`, `social-probe.json`, `social-probe2.json`, `social-probe3.json`, `counts.json`, `tour-marks.json`, `tour-frames.json`, `mobile-reduced.json`.
- Scripts (voir section 0).
