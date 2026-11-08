# CODEX SPEC — Parcours de l'accueil par couches (inspiré d'Alegria, Studeria, AI Sisters)

Niveau de risque : moyen (ordre et sections de l'accueil). Aucune donnée, aucun prix, aucun envoi, aucun client nouveau.
À lancer **après la fusion de la PR #365** (boutons par intention), sur `origin/main`.

## Décision

Paul, 08/11/2026 : « que le parcours, l'UX, soit optimisé en allant copier les différentes couches présentes chez nos concurrents » (Alegria, Studeria, AI Sisters). Étude : `~/parrit-canon/docs/site-benchmark/ETUDE-CONCURRENTS-2026-11-08.md` et `PARCOURS-CIBLE-ACCUEIL.md`.

## Ordre cible de l'accueil

1. Hero (inchangé : H1, sous-titre, deux boutons de la PR #365)
2. **Références** : la section `#references` (« Ils travaillent avec nous. », logos en défilement) remonte juste sous le hero. Mêmes logos, mêmes contrôles `getSiteEvidence` / `publicationLogo`.
3. **Nouvelle section « Par où commencer »** (ancre `#offres` / `#offers`), trois cartes, chacune un lien `ghost` vers le contact avec sa `source` :
   - **Former vos équipes** : « Des formations pratiques sur vos outils et vos documents, du comité de direction aux équipes métier. » → « Former mes équipes », `intention-formation-offres`
   - **Grands groupes** : « Cadrage, choix des cas d'usage, pilotes et conformité, avec vos directions métier et votre DSI. » → « Parler d'un projet », `intention-grands-groupes-offres`
   - **PME et ETI** : « On part d'un service, on retire ce qui fait perdre du temps, vos équipes gardent la décision. » → « Parler d'un projet », `intention-pme-offres`
   EN : Train your teams / Large companies / SMEs and mid-sized companies, même sens.
4. « Quelques applications concrètes » (inchangé)
5. « Trois étapes » (inchangé, boutons de la PR #365)
6. « Ce que l'IA prépare dans chaque service » (inchangé)
7. Technologies, puis « Chaque projet a son équipe » (inchangés)
8. **Nouvelle section FAQ** (ancre `#questions`), accordéons natifs `<details>` accessibles au clavier, ouverts sans JS lisibles, données structurées `FAQPage` strictement issues du texte affiché, FR/EN :
   1. Par où commence-t-on ? — Par un premier échange de 15 minutes en visioconférence, puis un cadrage écrit, ou un refus motivé si nous ne sommes pas les bons interlocuteurs.
   2. Faut-il des équipes techniques ? — Non. Nous formons vos équipes sur leurs outils, puis nous construisons des assistants qu'elles relisent et valident.
   3. Que deviennent nos données ? — L'IA peut être installée sur vos serveurs, et nous contrôlons l'usage qu'en font vos équipes.
   4. Quelles technologies utilisez-vous ? — Pour chaque besoin, la plus adaptée : ChatGPT, Claude, Gemini, Mistral, Copilot, entre autres, sans dépendre d'un seul fournisseur.
   5. Travaillez-vous avec les grands groupes comme avec les PME ? — Oui. L'équipe se compose selon le diagnostic, parmi plus de vingt partenaires.
   6. Combien cela coûte-t-il ? — Le prix se fixe après le cadrage, selon le périmètre. Nous ne publions pas de grille.
9. **Nouvelle section « Derniers articles »** : les 3 articles les plus récents du Journal (titre, thème s'il existe, temps de lecture, date), une seule action par carte vers l'article, puis un lien vers le Journal. Mêmes composants que l'index du Journal (PR #365).
10. Fondateur et contact (inchangé)

**Retirer** la section « Ce que l'IA change dans votre entreprise » (doublon avec la démonstration). La définition « Un assistant, ou agent IA, … » est conservée : la déplacer en première phrase de « Quelques applications concrètes » (le contrat « le mot agent IA une seule fois » reste vrai). Mettre à jour la navigation : Applications, Offres, Le parcours, Services, Questions, Contact (l'ancre `#references` reste accessible).

## Contraintes

- Brand OS strict, aucun texte inventé hors de cette spec, aucun prix, aucun chiffre nouveau, aucun client hors `public-clients.ts`.
- « Un bloc = un écran », hero à 1440×800, stabilité, réseau deny-all : contrôles inchangés. Mettre à jour uniquement les contrats d'ordre des sections et de navigation, avec la mention « décision de Paul du 08/11/2026 » dans `AGENTS.md` et `TRUTH.md`.
- Anciennes ancres (`#ce-qui-change` / `#what-changes`) : redirection vers `#en-production` / `#in-production` si elles sont liées quelque part.

## Tests

Nouveaux tests FR/EN : ordre des sections, trois cartes d'offres (une action, bonne `source`), FAQ (6 questions, `FAQPage` identique au texte), 3 derniers articles (tri par date, une action par carte). Batterie : `npm ci --silent && npm run lint && npm run build -- --webpack && npm test`. Ne pas committer les PNG réécrits sous `.codex-handoffs/brand-os-p1/after/`.

---

# PASSE 2 — Couches visuelles des concurrents, vraies photos (Paul, 08/11/2026 au soir)

Décision de Paul : « Avec les logos, il faut que ça clignote… Il y a beaucoup de choses qu'on peut mettre en place en termes de wow… Photos : il faut aller les chercher, on en a sur mon ordi, il faut juste mettre des photos pro. Vas-y, mets ça en prod. » Analyse source : `~/parrit-canon/docs/site-benchmark/ANALYSE-VISUELLE-CONCURRENTS.md`, maquette `~/parrit-canon/docs/site-benchmark/maquette/index.html` (lecture seule ; ne pas copier ses hex, passer par les jetons Brand OS). Tout ce qui est déjà fait dans la passe 1 de cette branche est conservé.

Le hero (titre, sous-titre, deux boutons, schéma trois plans) est **inchangé** et tient toujours à 1440×800.

## A. Vraies photos de session (procédé n°1 des trois concurrents)

Sources réelles, fournies par Paul (lecture seule, hors dépôt) :
- `~/Downloads/_Images/Activité de Paul Larmaraud (2).jpeg` → `public/photos/session/formation-equipes` (Paul forme une équipe, salle claire, écran)
- `~/Downloads/_Images/Activité de Paul Larmaraud.jpeg` → `public/photos/session/atelier-outils` (Paul montre un schéma d'agents à l'écran)
- `~/Downloads/_Images/Activité de Paul Larmaraud (1).jpeg` → `public/photos/session/intervention-dirigeants` (Paul au micro devant un public)

Conversion avec `sharp` (déjà présent via Next) en AVIF + WebP, largeurs 480 et 960 (sans agrandir au-delà de la source), **toutes métadonnées EXIF/GPS retirées**, aucune retouche, aucun recadrage qui coupe Paul. Si `sharp` ne lit pas un fichier, s'arrêter et le dire : **aucune image générée, aucune photo de banque**. Ajouter une ligne de provenance par photo dans `public/photos/session/SOURCES.md` (fichier source, date d'intégration, « photo réelle, choisie par Paul le 08/11/2026 »).

Nouvelle section **« Sur le terrain » / « In the field »** (ancre `#terrain` / `#in-the-field`), placée **juste après les références** (donc écran 2-3 de la page) :
- titre centré « Sur le terrain, avec vos équipes. » / « In the field, with your teams. » ; une ligne : « Nous formons et construisons dans vos locaux, sur vos outils. » / « We train and build on your premises, with your tools. »
- mosaïque façon AI Sisters : grande photo `formation-equipes` à gauche (pleine hauteur), deux photos empilées à droite ; sous chaque photo une légende courte : « Formation des équipes » / « Team training » ; « Atelier sur vos outils » / « Workshop on your tools » ; « Intervention devant des dirigeants » / « Talk to business leaders ». Aucun nom de client, aucun lieu, aucune date dans les légendes.
- `<picture>` avec `width`/`height` explicites (pas de saut de mise en page), `loading="lazy"`, `alt` descriptif FR/EN. Radius 0, aucune ombre, aucun dégradé, aucun filtre.
- mobile : photos en colonne pleine largeur, ou carrousel natif accessible au clavier avec points, au choix le plus simple qui respecte « un bloc = un écran ».
- un seul bouton `ghost` sous la mosaïque : « Former mes équipes » / « Train my teams », `source=intention-formation-terrain`, via `ContactIntentLink`.

## B. Logos qui s'animent (« il faut que ça clignote »)

Dans `#references`, garder la boucle de défilement et ses contrôles (`getSiteEvidence`, `publicationLogo`, pause survol/focus). Ajouter un **éclairage tournant** : au repos les logos sont à opacité ~0,55 en niveaux de gris ; à tour de rôle, toutes les ~1,6 s, un logo passe en pleine couleur et opacité 1 avec une légère mise à l'échelle (≤ 1,06), puis revient. Animation CSS uniquement (`@keyframes` + `animation-delay` par rang), opacité/transform/filter seulement, aucun minuteur JS. Logos un peu plus grands qu'aujourd'hui si la hauteur le permet. En mouvement réduit : logos statiques, centrés, **tous en pleine couleur**. Les noms accessibles restent.

## C. Cartes d'offre sombres (procédé n°8, Studeria)

La section « Par où commencer » de la passe 1 passe sur fond encre (jeton sombre Brand OS) avec trois cartes sur la surface sombre secondaire : surtitre en couleur d'accent claire (« Formation », « Conseil », « Conseil et outils »), titre, la phrase existante, puis une liste de trois coches vectorielles (SVG, aucune coche-caractère) :
- Former vos équipes : « Sur vos outils et vos documents » · « Du comité de direction aux équipes métier » · « En présentiel ou à distance »
- Grands groupes : « Choix des cas d'usage et cadrage » · « Pilotes avec vos directions métier » · « Sécurité et conformité avec votre DSI »
- PME et ETI : « Un service à la fois » · « Des outils construits sur mesure » · « Vos équipes gardent la décision »
EN avec le même sens (Train your teams / Large companies / SMEs and mid-sized companies). Le bouton de chaque carte est **aligné en pied de carte** (même ligne de base sur les trois). Un seul `exec` dans la section au plus ; les trois restent `ghost` (version claire sur fond sombre via les jetons existants). Radius 0, pas d'ombre.

## D. Rythme des fonds (procédé n°7)

Alterner les fonds de section avec les jetons existants pour que chaque section se distingue à l'œil : hero canard → références blanc → terrain fond clair teinté (sauge/sky) → offres encre → applications blanc cassé → parcours blanc → services sauge → technologies/équipe blanc → FAQ blanc cassé → articles blanc → bandeau final canard → contact inchangé. Ajuster seulement les fonds et les couleurs de texte contextuelles (registre clair/sombre), jamais la géométrie interne des sections existantes. Contrastes AA vérifiés par test.

## E. Bandeau d'appel final (procédé n°10)

Juste avant la section fondateur/contact : bande canard pleine largeur, titre centré « Votre expertise, mise au travail. » / « Your expertise, put to work. », puis `exec` « Parler d'un projet » (`source=intention-projet-bandeau`) et `ghost` « Former mes équipes » (`source=intention-formation-bandeau`), même hauteur, écart `var(--brand-s2)`. Le bouton `exec` porte la **flèche vectorielle** du paquet canon (connecteur VS-CONNECTOR, tige + tête), jamais un caractère.

## F. Apparition au défilement

Chaque section (hors hero et contact) apparaît au défilement par un fondu + translation verticale ≤ 16 px, 400 ms, une seule fois, via `IntersectionObserver`. Amélioration progressive : **le contenu est visible sans JS, en mouvement réduit et dans les tests de géométrie** (la classe d'état n'est posée que par le JS, et jamais en mouvement réduit). Aucun impact CLS (opacité/transform seulement) ; `tests/stabilite.spec.ts` doit rester vert sans seuil assoupli.

## Contrats et tests de la passe 2

- Mettre à jour `AGENTS.md` et `TRUTH.md` : « vraies photos de session autorisées, décision de Paul du 08/11/2026, provenance dans `public/photos/session/SOURCES.md` ; aucune image générée par IA ni photo de banque » (remplace « aucune photo de remplacement avant AV-3 » pour ces trois photos uniquement).
- Tests FR/EN : section terrain présente après les références, 3 `<picture>` avec `alt`, `width`/`height`, fichiers servis localement (deny-all) ; aucune métadonnée EXIF dans les fichiers (test Node qui lit l'en-tête) ; logos : animation présente hors mouvement réduit, absente et pleine couleur en mouvement réduit ; cartes : 3 coches SVG chacune, boutons alignés en pied à 1 px ; bandeau final : un `exec`, un `ghost`, bonnes `source` ; contenu visible sans JS.
- Inchangés : hero à 1440×800, « un bloc = un écran », stabilité, réseau deny-all, Brand OS (`qa:brand:rev01`, `test:brand-os`), false-claims.

---

# CORRECTIF PASSE 2 (relecture Claude sur l'hôte, 08/11/2026 soir)

Batterie Playwright hôte : 467 réussis, **20 échecs**. Captures : la mosaïque est trop petite, les logos ne « clignotent » pas assez. À corriger **sans assouplir aucun seuil** (sauf le point 6, qui est un changement de contrat décidé).

1. **Mosaïque « Sur le terrain » en grand.** Largeur de contenu complète (même largeur que la grille des offres). Grille ordinateur `2fr 1fr` : grande photo à gauche, deux photos empilées à droite qui remplissent exactement la hauteur de la grande ; toutes en `object-fit: cover` (aucun Paul coupé : `object-position` réglé par photo). Hauteur de la mosaïque ≈ `min(540px, 62vh)` pour que titre + mosaïque + bouton tiennent dans un écran à 1280×720 et 1440×800. Légendes posées en bas de chaque photo sur un aplat encre plein (pas de dégradé), texte clair, ou juste dessous si plus simple ; aucun vide latéral. Si les sources 800 px sont trop petites pour la cellule, utiliser les tailles disponibles sans agrandir au-delà de la source.
2. **Logos : éclairage tournant nettement visible.** Les fichiers sont des masques monochromes (constaté), on ne recolore pas. Au repos opacité 0,35 ; le logo éclairé passe à opacité 1 et échelle 1,08, transition ~300 ms, un logo à la fois, cycle complet ≤ 8 s. Logos ~20 % plus grands si « un bloc = un écran » le permet. Mouvement réduit : tous à opacité 1, statiques.
3. **Bandeau final déplacé** entre « Technologies / équipe » et la FAQ (au lieu de juste avant le contact), pour que son `exec` ne partage jamais un écran avec un autre `exec` (`doctrine-visible` : écart ≥ 844 px, inchangé). Mettre à jour les tests d'ordre.
4. **Contrastes** (`aeration.spec.ts`, liste de dette gelée à `[]`, inchangée) : `div.service-tasks.mobile-carousel` à 2,869 et `section#technologies` à 1,057 depuis le changement de fond. Corriger les couleurs de contrôle/texte par les jetons contextuels du nouveau fond, pas la liste.
5. **Alignement à 1 px** (`un bloc = un écran` 390×700, ligne 515) : les cartes des nouvelles grilles mobiles (`.home-offers`, `.session-mosaic`) doivent partager le même sommet que leur piste. Corriger le CSS (marges/bordures), le test reste à `toBeCloseTo(top, 0)`.
6. **Lien Journal dans « Derniers articles »** : la passe 1 demande un lien vers le Journal après les trois articles (décision de Paul du 08/11/2026). Le test « night tour 2 » (`single-page.spec.ts:1225`) exige zéro lien Journal dans `main`. Mettre à jour ce contrat seulement : **exactement un** lien Journal dans `main`, et uniquement dans la section des articles ; le pied garde le sien. Noter l'amendement dans `AGENTS.md`.
7. Investiguer et corriger la cause (pas le test) de : `parcours-accueil.spec.ts:26` FR JS=true 1280×720 (liste d'articles non vide là où `[]` est attendu : probablement un article tronqué ou hors écran) ; `single-page.spec.ts:96` (`≤ 1` reçu 2, à 1440 FR/EN) ; `single-page.spec.ts:572` hero EN 1200 en dépassement de 30 s sur `element.evaluate` (vérifier qu'aucune animation ou observateur ajouté ne bloque la page : `SectionEntrance` ne doit jamais tourner sur le hero ni en boucle).

Rejouer ensuite la batterie Node complète ; je rejoue Playwright sur l'hôte.

# CORRECTIF 2 (hôte, 476 réussis / 13 échecs) — dernier tour

Rendu validé à l'œil (mosaïque 1440 et 390 correcte). Corriger la cause, jamais le seuil :
1. `single-page.spec.ts:1189` « reference logos on one line » (8 échecs, 1440×800 et 1280×720, JS on/off) : la bande mesure 1080 px pour un maximum de 1060. Réduire l'écart entre logos ou leur taille pour revenir ≤ 1060 tout en gardant le gain de taille maximal possible.
2. `home-visual-layers.spec.ts:20` JS=false à 390×700 et 375×844 (4 échecs) : sans JS, les éléments de la piste mobile de la mosaïque n'ont pas le même sommet (écarts 29 à 141 px). Le rendu sans JS doit être identique au SSR avec JS : même structure de carrousel natif, cartes alignées en haut, légendes de hauteur réservée.
3. `parcours-accueil.spec.ts:26` FR JS=true 390×700 : la liste d'articles signalée n'est pas vide (même famille que l'échec 1280×720 corrigé). Trouver ce que mesure ce contrôle (troncature, débordement ou hors écran d'un titre d'article long sur mobile, ex. « Does AI cost more when your team works in French? ») et corriger la mise en page de la carte d'article mobile.
