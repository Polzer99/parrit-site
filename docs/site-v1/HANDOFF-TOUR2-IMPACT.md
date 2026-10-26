# Handoff Codex : tour 2 de la boucle nocturne, impact et grammaire de page (27/10/2026, nuit)

Retours de Paul (26/10) : « ça fait trop un site genre blog », « il manque quelque chose de très visuel », « ça manque d'impact technologique », « j'avais donné des sites à reverse engineer, et je vois pas ce qui a été reverse engineeré ».

## D'où vient ce lot (rétro-analyse vérifiée sur captures, 26/10)

Sites regardés à 1440 px : Harvey (harvey.ai), Pigment (pigment.com), Glean (glean.com), Artefact (artefact.com), plus les relevés existants (`docs/site-v1/releves/RAPPORT-BENCHMARK.md`, `RAPPORT-METALAB.md`). Grammaire commune constatée :
1. Premier écran : un titre fort, une phrase, **un** bouton principal, puis immédiatement **un grand cadre montrant le produit réel en fonctionnement** sur toute la largeur de la colonne (Harvey : titre à gauche, phrase et bouton à droite, cadre pleine largeur dessous).
2. Chaque section suivante associe un texte court (titre, une ou deux phrases, un bouton) à **un visuel** à côté, en alternance gauche/droite.
3. Les publics ou portes sont présentés en panneaux côte à côte, chacun avec son visuel (Harvey « For Law Firms / For In-House »).
4. Les listes de capacités sont des rangées à filets sobres (Harvey « Product innovation »).
5. Les intégrations se montrent comme des étiquettes de texte dans l'interface (Glean), pas comme un mur de logos.

On reprend ces **mécanismes**, jamais leurs couleurs, polices (pas de serif, pas de mono), images, textes ou compositions exactes. Charte : Brand OS mode accessible (`AGENTS.md`).

## 1. Accueil, premier écran (grammaire Harvey)

- À 1440 px : sur une rangée, le H1 actuel à gauche (colonnes 1-7 de la grille de 12, taille actuelle, aligné à gauche), et à droite (colonnes 8-12) le sous-titre puis la paire de boutons (`exec` puis `ghost`, alignés sur le bord gauche du sous-titre). Dessous, sur toute la largeur de la colonne de 1 160 px : un **cadre produit** dans le régime `canard` ou `ink` (aplat de jeton, rayon 0, aucune ombre), qui contient la scène produit existante (`ProductScene` : messagerie de validation à gauche, fiche CRM à droite) agrandie pour occuper le cadre, avec la mention « Démonstration, données fictives » / « Demonstration, fictional data » en pied de cadre.
- À 375 px : H1, sous-titre, boutons pleine largeur (tous deux), puis le cadre produit pleine largeur.
- Le premier écran à 1440 × 900 montre le H1, les boutons **et** le haut du cadre produit.

## 2. Accueil, les portes en alternance texte / visuel

Sections Conseil (H03), AI Sprints (H05), Engineering (H06), Harness (H07) : chacune devient une rangée à deux colonnes (texte 5 colonnes, visuel 7 colonnes), en alternance (texte à gauche pour H03 et H06, à droite pour H05 et H07). À 375 px : texte puis visuel. Texte = titre de la section, son paragraphe existant, son bouton `ghost`. Visuels, tous **construits en SVG ou HTML avec les jetons**, sans image inventée, sans fausse interface :
- **Conseil** : le schéma avant/après existant (`ProcessDiagram`, quatre étapes par colonne) dans un cadre de régime `calm` contrasté (`--brand-surf`).
- **AI Sprints** : une séquence de quatre nœuds (Cadrage, Construction, Évaluation, Décision) reliés par `ProcessConnector`, le dernier nœud se divisant en trois issues (« Passer en production », « Corriger », « Arrêter » / « Move to production », « Correct », « Stop »).
- **Engineering** : la fiche CRM réelle de la scène (`public/brand/scenes/scene-carte-visite-fiche-crm*`) dans un cadre, entourée de quatre étiquettes de texte reliées par connecteurs, désignant des **catégories** d'outils, jamais des marques : FR « Messagerie », « Agenda », « Tableur », « Base de données » ; EN « Email », « Calendar », « Spreadsheet », « Database ».
- **Harness** : schéma en étoile : un nœud central « Modèle » / « Model », huit nœuds autour (les huit composants déjà listés sur la page Harness, mêmes libellés), reliés par connecteurs VS-CONNECTOR.
- Le module à onglets Engineering (H06) reste disponible sur la page `/engineering-integration` ; sur l'accueil, la section H06 devient la rangée texte/visuel ci-dessus.

## 3. Pages V1 (Conseil, AI Sprints, Engineering, Harness) : fin de l'effet « blog »

- Grille : chaque section devient une rangée à filet, titre de section en colonnes 1-4, contenu en colonnes 5-12 (au lieu d'un bloc à gauche et d'une moitié droite vide). À 375 px : empilé.
- Regrouper « Les problèmes réels », « Ce que nous faisons » et « Les livrables » en une seule section à trois colonnes à filets.
- Supprimer les doublons constatés : AI Sprints (« Ce qui n'est pas livré » = « Les limites », « Comment on décide » = « Évaluation » : garder une occurrence) ; Engineering (« vos outils actuels restent en place… » et la phrase de cession apparaissent deux fois : garder une occurrence).
- Chaque page V1 reçoit **le même visuel que sa porte sur l'accueil**, placé sous le premier écran.
- Hauteur de page attendue : au moins 30 % plus courte qu'aujourd'hui à 1440 px (mesure avant/après dans le rapport).

## 4. Mouvement sobre (technique Metalab T26/T27, transposée)

Les visuels des sections apparaissent une fois par `clip-path: inset()` rectangulaire de bas en haut en `--hold` (600 ms) avec `--ease`. Le contenu est **visible par défaut** ; l'animation n'est ajoutée que sous `@media (prefers-reduced-motion: no-preference)`, en CSS, sans dépendre de JavaScript pour être lisible. Aucun défilement lissé, aucun préchargeur, aucun curseur personnalisé.

## 5. Constats des deux évaluateurs indépendants (note de référence 4/10, 27/10 vers minuit)

Deux évaluateurs (Codex et Claude) ont noté la production après la PR #333 sans se voir. Points convergents non couverts par le tour 1, à traiter ici :
- **Premier écran de l'accueil allégé** : à droite (ou dans le cadre produit pleine largeur du §1), seulement la scène produit (téléphone de validation et fiche CRM). Le second grand titre de la scène (« Vous demandez, vous validez… » ou équivalent) et la liste numérotée 1-2-3 sortent du premier écran : ils passent sous le cadre, en texte courant.
- **Démonstration sur la page anglaise** : la scène est en français (« Sociétés », « Aujourd'hui », « Oui / Non »). Ne pas fabriquer de capture anglaise : ajouter sur `/` (EN) la mention « Demonstration in French, fictional data. » à la place de « Demonstration, fictional data. ».
- **Image de la fiche CRM** : l'image approuvée a des coins arrondis et une ombre cuits dans les pixels. Ne pas modifier l'actif approuvé (empreinte contrôlée par les tests). La placer dans un cadre de jeton à rayon 0 assez grand pour que l'image se lise comme une capture posée sur un aplat ; signaler dans le rapport que le remplacement de l'actif est une décision de Paul.
- **Séquences sur mobile** : « Aujourd'hui / Demain » et « Six étapes » ne s'étirent plus sur plusieurs écrans à 375 px : version compacte (colonnes côte à côte réduites, ou liste à une ligne par étape sans connecteur vertical entre chaque). La flèche finale de « Six étapes » ne pointe plus dans le vide (aucun connecteur après la dernière étape). Filets « Aujourd'hui » et « Demain » de la même couleur de jeton, la colonne cible marquée seulement par son libellé ou son accent.
- **Menu mobile et FAQ** : le triangle natif « ▶ » est remplacé par le signe vectoriel du canon (si le tour 1 ne l'a pas déjà fait pour la FAQ, le faire aussi pour le menu mobile).
- **En-tête mobile** : le premier écran à 375 px montre le H1 sans avoir à défiler ; logo, langues et menu tiennent sur une seule rangée, le bouton « Parler d'un projet » de la barre passe sous le H1 (il reste le bouton principal du hero).
- **Promesses absolues** (texte exact) :
  - Standard EN « at any moment » -> « at any time during the project » ; « Every signal carries its decision » -> « Each signal comes with a proposed decision » ; « A decision always keeps its origin » -> « Each decision records its origin » ; « never the erasure of a message already received » -> « a message already received is not erased ». FR : formulations équivalentes sur la page française (lire le texte servi et appliquer le même adoucissement, sans en changer le sens).
  - Commission : « Rien ne se signe pendant l'appel » -> « Aucun engagement n'est pris pendant l'appel » / « Nothing is committed during the call » ; « Aucune séquence automatique » -> « Une réponse écrite par une personne » / « A reply written by a person ».
  - Format du rendez-vous dit d'une seule façon sur `/commission` : « un premier échange de 15 minutes en visio » / « a first 15-minute video call » ; retirer « 30 minutes de restitution » s'il décrit autre chose que ce rendez-vous, ou le requalifier explicitement (« après l'échange, une restitution de 30 minutes si le projet s'y prête »).
- **Typographie** : apostrophes typographiques (’) partout dans les textes français, au lieu du mélange droites/typographiques.

## Interdits

Aucune image ni interface inventée ; aucun logo ni nom de marque d'outil ; aucun nouveau chiffre, client, prix ou texte autre que ceux listés ; aucune couleur littérale, nouvelle taille de police, ombre, dégradé ; rayon 0 partout sauf le téléphone existant ; aucune mono visible ; ne pas changer le titre d'accueil ni les noms des portes. Ne supprimer ni affaiblir aucune assertion ; adapter seulement celles qui figeaient l'ancienne structure, en le disant.

## Critères d'acceptation

1. Batterie verte (`lint`, `test`, `build`, `qa:brand:rev01`, `qa:claims:rev01`, `test:brand-os`) ; Claude rejoue `qa:network:rev01` en entier sur l'hôte.
2. Nouveau test : à 1440 × 900 le cadre produit est visible dans le premier écran ; chaque section porte H03/H05/H06/H07 contient un visuel (SVG ou image) à côté du texte ; alternance gauche/droite vérifiée ; à 375 px le visuel suit le texte sans débordement ; contenu visible avec `reducedMotion: reduce` et sans JavaScript.
3. Rapport `docs/site-v1/RAPPORT-TOUR2-IMPACT.md` avec captures 1440/375 FR/EN de l'accueil et d'une page V1, et la mesure des hauteurs avant/après.

## Branche et PR

Depuis `main` après le tour 1 ; PR vers `main` ; pas de fusion par Codex.
