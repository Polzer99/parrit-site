# Handoff Codex : tour 1 de la boucle nocturne, cohérence globale (27/10/2026, nuit)

Ordre de Paul (26/10, soir) : « un check minutieux de toutes les incohérences, de toute la cohérence du site dans sa globalité […] aligné avec la direction artistique » ; « plein de problèmes de boutons à droite, à gauche, insupportables à voir » ; termes juridiques « qui permettent de rester tranquilles » ; mise en production autorisée.

Sources : deux audits indépendants du 26/10 (texte : 46 constats ; visuel : 47 constats ; tous lus et triés par Claude) et la mesure des 48 boutons des 26 pages. Ce lot s'applique sur `main` après la PR correctif de la #330. **Il ne change ni la mise en page des sections (tour 2), ni le titre d'accueil, ni les noms des portes, ni le sort des pages anciennes : ce sont des décisions de Paul.**

## 1. Promesses juridiques restantes (texte exact)

| Page | Texte actuel | Nouveau texte FR | Nouveau texte EN |
|---|---|---|---|
| `/manufacture` | « Chaque système se fabrique dans vos comptes, avec vos clés. » / « Each system is built in your accounts, under your keys. » | « L'hébergement et les accès sont décidés pour chaque projet et écrits dans le contrat. » | « Hosting and access are decided for each project and written into the contract. » |
| `/systems`, FAQ « Où vont nos données ? » | « Dans vos comptes. Nous n'en construisons pas une seconde base ailleurs. » | « Là où le contrat le prévoit. L'hébergement se décide projet par projet, selon vos données et vos accès. » | « Where the contract says. Hosting is decided per project, based on your data and access. » |
| `/standard`, engagement 05, dernière phrase | « Votre équipe peut faire tourner le système sans nous ; nous garder en support reste votre choix. » | « La maintenance, par votre équipe ou par nous, est écrite dans le contrat. » | « Maintenance, by your team or by us, is written into the contract. » |
| `/systems`, FAQ « Formation ou système livré ? » | « Un système. […] pas un cours. » | « Les deux existent. Nos systèmes s'accompagnent d'une formation des équipes ; la formation seule n'est pas notre offre principale. » | « Both. Our systems come with team training; training alone is not our main offer. » |
| `/harness-engineering`, balise `<title>` | « … : des agents fiables en production » | « Harness Engineering : rendre vos agents plus fiables » | « Harness Engineering: making your agents more reliable » |
| `/ai-sprints` et accueil, étape Construction (EN) | « A system that runs on your real cases. » | (FR inchangé) | « A building block that runs on your real cases. » |
| `/legal`, politique de confidentialité | mentions de « description facultative de l'opération » et « ressources demandées » | aligner sur le formulaire réellement servi (lire le composant de formulaire et ne citer que les champs qu'il envoie) | idem |

**Journal (index et accroches, EN)** : dans les accroches affichées par `/journal` et `/fr/journal` (source : frontmatter `description` ou équivalent des articles), remplacer :
- « owned by the client at delivery » -> « Rights are assigned in writing, by contract. »
- « It is built for one company and belongs to it, code and data included. » -> « It is built for one company. What we develop is assigned to it in writing, by contract; its data stays its own. »
- « Your invoices are generated, sent and reconciled automatically. Your bookkeeping runs itself. » -> « Invoices are prepared and reconciled by the system; a person approves before anything is sent. »
- « A CRM that follows up with your customers automatically, detects slow seasons and sends the right messages at the right time. » -> « A CRM that prepares follow-ups and flags slow seasons; a person approves each message. »
- titre « Automated invoicing with AI: zero entry, zero forgotten invoices » -> « Invoicing with AI: less manual entry, approval kept »
- « from a partner that deploys them every week » -> supprimé.
Le corps des articles ne change pas dans ce lot (décision de Paul en attente). Étendre `scripts/lib/ownership-claims.mjs` (ou le contrôle `qa:claims:rev01`) aux accroches du Journal pour « owned by the client », « belongs to it », « sent … automatically », « runs itself ».

**Articles en double sous /fr** : `/fr/journal/<slug>` sert l'article anglais sous `lang="fr"`. Redirection 308 de `/fr/journal/:slug` vers `/journal/:slug` dans `next.config.ts` (un seul saut, requête conservée). `/fr/journal` (l'index) reste ; il affiche une seule fois « Articles en anglais » en tête et retire l'étiquette répétée « Journal / Entrée · EN » ; dates au format « 13 oct. 2026 » (FR) / « 13 Oct 2026 » (EN).

## 2. Boutons : une seule règle sur tout le site

Mesure du 26/10 à 1440 px : 48 boutons dans `main`, cinq traitements (20 cadres pleine largeur ; boutons courts tantôt centrés tantôt à gauche ; 4 décalages arbitraires sur Standard et Systems ; points finaux ; « Réserver l'examen »).

Règle (à écrire aussi dans `AGENTS.md`, section Brand OS) :
1. Jamais pleine largeur à partir de 600 px : largeur du contenu, hauteur tactile existante. Sous 600 px : pleine largeur pour tous les boutons d'un même groupe, ou pour aucun.
2. Un bouton s'aligne sur le bord gauche du texte qu'il suit. Seule exception : un bloc dont le titre est centré centre ses boutons. Aucun décalage arbitraire.
3. Deux boutons côte à côte : principal `exec` puis secondaire `ghost`, espacés de `var(--brand-s2)`, même hauteur, même ligne de base.
4. Un seul `exec` par section ; la clôture de chaque page porte le principal.
5. Libellés sans point final ; infinitif en français, impératif court en anglais.
6. Toute action vers `/commission` : « Parler d'un projet » / « Talk about a project » (y compris Build with you : « Réserver l'examen » / « Book the examination » disparaissent ; le libellé « (… un système sur mesure) » devient « Parler d'un système sur mesure » / « Talk about a custom system »).
7. Exception écrite : le bouton d'envoi du formulaire de `/commission` reste à droite de son champ.
8. Bouton « Parler d'un projet » de la barre de navigation : un seul style sur toutes les pages (aujourd'hui texte blanc sur l'accueil, rose ailleurs).

Contrôle bloquant : spec Playwright sur les 26 pages FR/EN à 1440 et 375 px : chaque `.rev-button` de `main` hors formulaire a une largeur inférieure à la colonne (à 1440) ; son bord gauche est à ±2 px de celui du titre ou paragraphe qui le précède, ou centré à ±2 px si ce titre est centré ; libellé sans point final ; libellé identique pour toute destination `/commission`.

## 3. Un seul composant par fonction

- **Liens de texte** : style unique en jetons (`var(--brand-acc)` ou équivalent du registre, souligné 1 px). Aucun lien à la couleur par défaut du navigateur (constaté `#0000EE` dans « Poursuivre votre réflexion » et le sommaire de Harness). Contrôle : aucun `a` visible dans `main` dont la couleur calculée est `rgb(0, 0, 238)`.
- **Étapes** : un seul composant « séquence » (titre + une ligne par étape, `ProcessConnector` entre étapes) réutilisé pour Conseil (4 étapes), AI Sprints (4) et Méthode (6). Les autres rendus d'étapes disparaissent.
- **FAQ** : un seul composant à filets (`<details>` natif, signe + vectoriel, pas le triangle natif) sur toutes les pages, y compris `/systems`.
- **Dernier appel** : un seul composant sur toutes les pages : titre et bouton dans le même axe, bouton `exec` à largeur de contenu, aucun filet au-dessus ni au-dessous.
- **Pied de page** : aucun filet pleine largeur quand la section précédente est sombre ; une seule ligne de filets entre rangées de liens, sur toute la largeur de la grille (aujourd'hui la dernière rangée s'arrête aux 2/3) ; la ligne « © » fusionne toute ligne de registre restante.
- **Titre H1** : une seule recette (graisse, interligne, largeur de mesure) pour toutes les pages ; les pages anciennes (Dossiers, Manufacture, Build with you, Systems) l'adoptent.
- **Onglets** : inactif en contour `--brand-line`, actif plein, identiques sur fond clair et fond canard ; panneau commençant par une majuscule.
- **Navigation** : le « + » seul reçoit un libellé (« Plus » / « More ») ; barre et haut de page sur le même fond quand ils se touchent (pas deux encres différentes au contact).

## 4. Cohérence de texte (finition)

- Menu : les trois entrées sous Engineering ont des descriptions distinctes : FR « Fiabiliser les agents que vous utilisez. » / « Construire ce qu'aucun outil ne couvre. » / « Relier vos outils et choisir l'hébergement. » ; EN « Make the agents you use reliable. » / « Build what no tool covers. » / « Connect your tools and choose the hosting. »
- `/commission` : « Toute commande commence par un examen. » / « Every commission begins with an examination. » -> FR « Un premier échange en visio pour parler de votre projet. » EN « A first video call to discuss your project. » ; titres de blocs en casse normale ; « Chargement des créneaux… » en casse normale.
- `/standard` : « sur une carte » -> « prête à être tranchée » / « ready to decide » ; « L'état du pipeline » -> « L'état des ventes » / « Sales status » ; « Le journal est l'audit. » -> « L'historique fait foi. » / « The log is the audit trail. »
- Un seul mot pour la liste du Standard : « engagements » / « commitments » (fin de « critères »).
- EN : `/dossiers` « The Dossiers » -> « Case files » ; numéros « Dossier 26-00x » retirés de l'affichage ; « The Manufacture » -> « How we build » (titres et liens EN uniquement ; URL inchangées).
- Accueil EN, références : « Laparra, fruit and vegetable wholesaler at the Rungis market: a CRM » ; « Joone: helping the teams adopt AI ». FR : même ponctuation pour les cinq lignes (nom, deux-points, réalisation).
- Ponctuation des titres : point si phrase, rien si groupe nominal ; majuscule au premier mot seulement dans les titres du Journal ; anglais américain partout (« licenses », « color »).
- Sous-titres « Mis à jour le … » de Harness : style de pied de section en `--brand-fg2`.

## 5. Réservation (Cal.com) sur /commission

Dans `CalInline` : passer la langue de la page (`fr` sur `/fr/commission`, `en` sinon) et le format 24 h en français à l'intégration ; thème et couleurs de l'intégration réglés sur les jetons du régime encre (fond, texte, accent) via les options de l'intégration Cal.com (vérifier l'API d'intégration actuelle avec Context7 ou la doc officielle de `@calcom/embed-react`) ; largeur 100 % de la colonne, aucune marge interne asymétrique, aucun débordement des créneaux. Ce que l'intégration ne permet pas (rayons, nom affiché) : le noter dans le rapport pour Paul (réglage du compte Cal.com).

## Interdits

Aucun nouveau texte hors ce document ; aucun chiffre, prix, nom de client, logo ; aucune couleur littérale, nouvelle taille de police, ombre, radius, dégradé ; aucune mono visible hors code du Journal et `/systems` ; ne pas toucher : titre d'accueil, noms des portes, structure des sections (tour 2), contenu des articles du Journal. Ne supprimer ni affaiblir aucune assertion ; adapter seulement celles qui figeaient l'ancienne structure, en le disant dans le rapport.

## Critères d'acceptation

1. `npm run lint`, `npm test`, `npm run build`, `npm run qa:brand:rev01`, `npm run qa:claims:rev01`, `npm run test:brand-os` verts ; Claude rejoue `npm run qa:network:rev01` en entier sur l'hôte.
2. Nouveaux contrôles bloquants : boutons (§2), liens (§3), accroches du Journal (§1), redirection `/fr/journal/:slug` (§1).
3. Rapport `docs/site-v1/RAPPORT-TOUR1-COHERENCE.md` : chaque ligne de ce document avec son statut (fait, impossible et pourquoi).

## Branche et PR

Branche dédiée depuis `main`, PR vers `main`, pas de fusion par Codex. Claude fusionne après relecture, suite hôte complète verte et CI verte (ordre de mise en production de Paul).
