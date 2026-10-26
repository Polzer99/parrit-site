# Benchmark UX : L'École de l'IA et Galadrim, pour la refonte de parrit.ai

Date de la capture : 26/10/2026. Spec de référence : `PARRIT_SITE_SPEC_V1_2026-10-26.md`, sections 4 (homepage H01-H12) et 7 (design system, inspiration, ergonomie).
Statut : analyse de modèles, **rien n'est à copier**. Tout est décrit avec mes mots ; seuls quelques mots courts sont cités entre guillemets.

## 0. Méthode, périmètre, limites d'accès

- Outil : Playwright (npm `playwright` 1.64.1, installé dans ce dossier hors dépôt git) avec un Chromium headless déjà présent sur le poste. Scripts : `probe.js`, `capture.js`, `menus*.js`, `motion.js`, `dump*.js`, `scroll390.js`. Mesures brutes : `probe-home.json`, `metrics_ecole.json`, `metrics_galadrim.json`, `sections-home.json`.
- Largeurs : 1440x900 et 390x844 (mobile émulé, tactile). Pour chaque page : une capture « haut de page » (`_fold_`) et une capture pleine page (`_full_`), après un défilement lent qui déclenche les chargements différés et les apparitions.
- Pages capturées. L'École : accueil, page formation certifiante (`/formations/certification-ia-rs7311`), page entreprises (`/entreprises`), ressource (`/ressources/automatiser-relance-devis`), contact, financement CPF. Galadrim : accueil, page offre IA (`/offres/applications-agents-ia`), page conseil (`/offres/conseil-transformation`), étude de cas (`/fiche-projet/paladin-540/`), références, contact, article de blog (`/blog/etude-roi-ia-entreprise-14-projets`).
- Menus : desktop au survol (4 panneaux École, 3 panneaux Galadrim), mobile burger ouvert (École : un seul état ; Galadrim : état fermé, ouvert, sous-niveau Expertises). Aussi : bandeau cookies, et mobile après défilement (`*_scrolled-sticky_*`).
- Noms de fichiers : `<site>_<page>_<1440|390>_<fold|full>_2026-10-26.png`, `<site>_menu_*`, `*_cookie-banner_*`.

### Limites d'accès (constatées)
- Aucun blocage anti-bot, aucun mur de connexion : les 2 sites répondent 200 en headless sur toutes les pages visitées.
- Bandeau cookies sur les 2 sites (L'École : accepter/refuser ; Galadrim : CookieYes, personnaliser/refuser/accepter). J'ai cliqué « Refuser » pour dégager la vue ; la capture avec bandeau est conservée pour les 2 accueils (`*_cookie-banner_*`). Aucun autre clic de décision.
- **Aucun formulaire soumis**, aucun bouton de réservation ou d'envoi cliqué, aucun compte créé. Les champs de formulaire sont lus dans le DOM, pas testés en réel : les étapes post-envoi (page de confirmation, e-mail, calendrier) sont donc `UNKNOWN`.
- Le calendrier de rappel de L'École (jour/heure) est lu comme listes déroulantes ; je n'ai pas vérifié si la disponibilité est réelle.
- Les vidéos de Galadrim (témoignage, 2:11 et 4:21 min) ne sont pas lues : démarrage manuel uniquement, contenu non analysé.
- Pas de test de performance (Core Web Vitals) ni d'accessibilité complète : seules des observations visibles (focus, contraste) et la réaction à `prefers-reduced-motion` sont notées.
- Les chiffres que ces sites affichent sont cités comme **affichés par eux**, jamais vérifiés. C'est important pour Parrit.ai : la spec §6 interdit le chiffre sans méthode, et plusieurs chiffres du benchmark n'en ont pas.
- Les pages sont des états du 26/10/2026 ; ni l'un ni l'autre n'est figé (L'École publie des guides au jour le jour, Galadrim un article tous les 1 à 2 jours).

---

## 1. L'École de l'IA (lecoledelia.com)

Nature : organisme de formation (une offre phare à 1 700 € net de TVA, une offre entreprise sur devis). Écrit pour un acheteur individuel et une TPE, très peu « grand compte ». Intérêt pour Parrit.ai : la pédagogie, la lisibilité des bénéfices, le chemin de conversion court. Limite : un seul produit, une seule date de session, pas de cas client (la première session date d'octobre 2026).

### Header
- Barre blanche collante en haut (sticky, 111 px avec le bandeau de session) : logo, 4 entrées à panneau (Formations IA, Financement, Ressources, L'école), téléphone en clair, **un seul bouton plein** « Être rappelé ». Sous la barre, un bandeau rouge plein largeur : prochaine session, nombre de places, lien « Réserver » et lien « Voir les dates ». Il reste collé en haut aussi sur mobile.
- Un bouton flottant WhatsApp, fixe en bas à droite sur toutes les pages et tous les formats (52 px).

### Hero (accueil)
- Structure, de haut en bas : pastille de certification Qualiopi (logo + « voir le certificat »), H1, sous-titre, **formulaire de rappel intégré dans le hero** (3 champs + case de consentement + bouton), puis une ligne « Une question ? » avec photo du responsable et bouton WhatsApp, puis la promesse « rappel sous 48 h ».
- H1 : 56 caractères, phrase complète à valeur de principe (humain, pédagogie) plutôt qu'à promesse chiffrée. Une partie en couleur d'accent.
- CTA dans le premier écran : 1 formulaire (bouton « Être rappelé ») + 1 bouton WhatsApp + 2 dans le bandeau (« Réserver », « Voir les dates ») + 1 dans l'en-tête = **5 points d'action** au premier écran sur desktop. Mais ils portent le même verbe d'action (être rappelé ou réserver), pas de choix « abstrait ». Libellés : verbes concrets de contact ou d'inscription, aucun « en savoir plus ».
- Mobile : le H1 occupe le tiers haut, le bloc WhatsApp passe **avant** le formulaire (le bouton « Être rappelé » du formulaire arrive à ~770 px sur 844, juste dans le premier écran).

### Structure de défilement (accueil, 9 620 px desktop / 15 078 px mobile)
1. Hero (pastille Qualiopi, H1, formulaire, WhatsApp)
2. Phrase d'identité (organisme, présentiel, lieu) + 3 chiffres de cadre (100 % présentiel, 9 personnes au plus, 2 sur 2 certifiés)
3. « Créer un agent IA » : démonstration animée en 5 étapes (demande, données, flux, agent, validation humaine)
4. Deux produits côte à côte (certifiante / entreprise), un seul bouton chacun
5. Trois cas d'agents que l'on construit en 3 jours (devis, réponse clients, relance de pièces) + liste de résultats typiques ; chaque carte mène à un guide
6. Méthode en 3 temps (données, flux, agents) + bande d'outils utilisés
7. Preuve : certification, indicateurs de la première session (avec date, taille d'échantillon et lien « indicateurs détaillés »), avis Google
8. Financement : 3 cartes (CPF, OPCO, entreprise) puis inscription en 3 étapes
9. Campus (adresse, accès)
10. FAQ (accordéon)
11. 4 guides récents (liés à l'actualité)
12. « En sept phrases » (bloc de définition lisible par un moteur de réponse)
13. CTA final : deux boutons (« Je me forme », « Je forme mon équipe ») + WhatsApp
14. Pied de page (adresse, certificat, mentions)

### CTA : placement, répétition, collant
- Répétition forte mais **de même nature** : le même geste « être rappelé / réserver / WhatsApp » revient dans l'en-tête, le bandeau, le hero, chaque produit, la section financement, le CTA final et le bouton flottant. Collants : en-tête + bandeau (haut) et WhatsApp (bas droite).
- Segmentation : le visiteur choisit en un clic entre « moi » et « mon équipe » (même au CTA final), ce qui évite un parcours unique mal adapté.
- Pas de prix masqué : le prix, la durée, la date et la prise en charge sont dans le premier écran de la page produit.

### Menu
- Desktop : 4 entrées, chacune avec un panneau de 3 à 4 liens (titre en gras + une ligne de bénéfice sous chaque lien) et, à droite, un encart avec une phrase et deux boutons (rappel, WhatsApp). Profondeur : 1 niveau de panneau, 1 clic. Total : environ 14 destinations.
- Mobile : un burger, qui ouvre **une liste plate à titres de rubriques** (pas d'accordéon, aucun second niveau à ouvrir) ; le téléphone reste visible à côté du burger. 1 niveau de profondeur, tout le menu lisible d'un coup, avec défilement dans le panneau.

### Preuves
- Dispositifs : certificat officiel (lien PDF), indicateurs chiffrés **datés et dimensionnés** (« 2 sur 2 », « résultats au 13/10/2026 », une seule session), avis Google avec lien, présentation de formateurs, renvoi aux textes officiels.
- Qualification : la preuve est honnête sur sa petite taille. Le site écrit explicitement le nombre de répondants au lieu d'un pourcentage seul. Pas de logos clients, pas de témoignages nommés.
- Quasi-absence de cas client : les « cas » sont des **exemples types** de ce que le participant construit, pas des références.

### Page cas / ressource
- Pas d'étude de cas. L'équivalent est une page de guide (80 caractères de H1, auteur et date de mise à jour, sommaire collant à gauche sur desktop, sections numérotées, FAQ, sources, « à lire aussi », puis CTA). Intéressant : sommaire + sources + date visibles, dans l'esprit de la spec §6 (méthode, période).

### Architecture des offres (page produit)
- Ordre : fil d'Ariane, hero avec fiche « En bref » à droite (date, prix, durée, lieu, groupe, financement, certification), dates à choisir, preuve officielle, méthode, programme jour par jour, livrables, « pour qui », formateurs, candidature, détails réglementaires dépliables, FAQ, textes officiels, lectures liées.
- La page entreprise reprend la même trame avec : problème, parti pris, **six exemples de personnalisation par métier**, formats les plus demandés avec prix indicatifs, déroulé en 7 temps, livrables, financement, FAQ, formulaire.

### Motion
- Ce qui bouge : apparitions au défilement sur l'accueil (« rise ») ; la démonstration d'agent en 5 étapes se joue seule (saisie, curseur, éclairage séquentiel) ; petites rotations d'icônes.
- Blocage de lecture : **oui, à l'état initial** (mesure : 109 éléments texte sur 167 sont à opacité quasi nulle avant tout défilement ; revenus à 2 après). Conséquence : une personne qui imprime, un lecteur sans JS ou un moteur qui n'exécute pas le défilement voit une page presque vide. Avec `prefers-reduced-motion: reduce` tout est visible immédiatement et aucune animation ne tourne : bon comportement. Les pages intérieures n'ont pas de motion.

### Responsive
- Pas de débordement horizontal sur aucune page testée. Mobile : formulaire et WhatsApp empilés, bandeau de session collant, bouton WhatsApp flottant qui peut recouvrir le coin du contenu (visible sur la capture d'accueil). Pages hautes : accueil 15 078 px sur mobile (x1,6 par rapport au desktop).

### Formulaires
- Hero : 3 champs (nom, téléphone, e-mail) + 1 case de consentement = **4 éléments, 1 étape**, bouton explicite, retour promis (« rappel sous 48 h »).
- Candidature formation : 9 éléments (3 coordonnées, session, mode de financement en 4 choix, message libre, consentement), **2 minutes annoncées, aucun paiement**, puis rappel et échange de cadrage de 20 min (étapes décrites à côté).
- Page contact : **deux parcours** : choisir un jour et une heure puis rappel (6 éléments) ; ou formulaire libre (jusqu'à 10 éléments, dont 7 facultatifs : entreprise, financement, projet). Quatre cartes d'orientation au-dessus (équipes, individu, téléphone, e-mail) dirigent déjà vers le bon formulaire.
- La demande de devis entreprise : 10 éléments, un seul champ message obligatoire (le reste est facultatif).

---

## 2. Galadrim (galadrim.fr)

Nature : agence de produits numériques et d'IA sur mesure (plus de 800 clients annoncés, 3 villes). Intérêt pour Parrit.ai : crédibilité ingénierie, profondeur éditoriale, architecture des offres, cas clients. Limite : tonalité « agence », une grande partie des chiffres de preuve sont affichés sans méthode visible.

### Header
- Barre collante sobre (76 px), logo **centré**, entrées à gauche (Expertises, Parlons IA, Équipe) et à droite (Références, Secteurs, À propos, langue, sélecteur de couleur du site). Au chargement, la barre desktop ne porte **aucun bouton de contact** ; un bouton « Discutons de votre projet » s'y ajoute après défilement (vu dans le DOM de la barre collante des pages intérieures). Sur mobile, le bouton de contact apparaît dans la barre une fois le hero dépassé.
- Détail notable : une entrée « Parlons IA » est une porte d'entrée thématique (page IA) dans la barre principale, pas un sous-menu.

### Hero (accueil)
- Structure : surtitre « depuis 2017 », H1, sous-titre, 2 boutons, photo d'équipe sur la droite, et **la bande de preuve tout de suite sous le hero** (une phrase de cadrage sur 800 organisations + 7 logos monochromes).
- H1 : 27 caractères, générique (« Votre partenaire tech et IA »). Sa précision vient du sous-titre, pas du titre. Les pages d'offres, elles, ont un H1 de 55 à 72 caractères avec un résultat (de la stratégie aux opérations, de l'automatisation à l'expérience client) et des puces chiffrées.
- CTA : 2 dans le hero (un plein « Discutons de votre projet », un secondaire contour « Découvrir nos réalisations »). Même paire que celle envisagée en spec §0 (principal = contact, secondaire = réalisations). Libellés : un verbe d'échange (discuter) et un verbe d'exploration (découvrir). Sur les pages d'offre, le CTA principal change : « Échanger avec un ingénieur IA » plus « Découvrir 7 solutions IA ».
- Mobile : le H1, le sous-titre et les 2 boutons tiennent dans le premier écran, la photo passe dessous.

### Structure de défilement (accueil, 10 433 px desktop / 13 282 px mobile)
1. Hero + bande logos
2. « Une équipe d'experts » : 4 pôles (Conseil et formation, Produit et design, Développement, Intelligence artificielle) avec des pastilles de compétences
3. Vidéo de présentation d'une collaboratrice (lancement manuel)
4. Savoir-faire : 8 types de produits avec une illustration de produit, un lien « en savoir plus » chacun
5. Témoignages : 6 dirigeants, chaque citation accompagnée d'un chiffre (utilisateurs, économies, précision) et d'un lien vers la fiche projet
6. À propos : 4 chiffres (800+, 180+, 23 M€, +60 %) et phrase d'équipe
7. Piliers : 4 valeurs avec une phrase de preuve de recrutement
8. Équipe : fondateurs, parcours d'école et d'entreprise, logos d'écoles
9. Blog : 6 articles, la plupart en lien direct avec la décision d'achat (« meilleures agences », étude de ROI)
10. Contact : formulaire + 20 logos de clients + coordonnées des 3 agences
11. Pied de page (newsletter, mentions, très grand wordmark)

### CTA : placement, répétition, collant
- Le CTA « contact » revient dans le hero, après la vidéo, en bas de chaque page d'offre (deux fois sur les pages d'offre : après l'équipe puis le formulaire complet) et dans la barre mobile. Collant : la barre de navigation uniquement ; **sur mobile, le bouton « Prenons contact » apparaît dans la barre collante dès que le hero sort de l'écran** (vérifié après défilement), sans recouvrir le contenu.
- Les cartes de savoir-faire ont un lien « en savoir plus » sans résultat dans le libellé (faible), alors que les boutons d'offre sont nommés (« Échanger avec un ingénieur IA »).

### Menu
- Desktop : trois **panneaux larges** sous la barre. Expertises = 3 colonnes (Développement sur mesure, 9 liens ; Produit et design + Intelligence artificielle, 4+4 ; Conseil et transformation + Assistance technique, 4+3) : environ **24 destinations d'offre**. Secteurs : 23 secteurs. À propos : 5 pages. Profondeur : 1 niveau de panneau, mais très dense.
- Mobile : burger → panneau plein écran ; les groupes sont des accordéons. Le sous-niveau Expertises affiche une longue liste (plus de 20 liens, à faire défiler). Contact et langue en pied de panneau. 2 niveaux d'interaction (burger puis accordéon).

### Preuves
- Dispositifs : bandeau de 7 logos sous le hero, mur de 20 logos au contact, 6 témoignages nommés avec fonction et entreprise, vidéo de témoignage, citations accompagnées d'un chiffre, fiches projet, citations presse (5 liens), chiffres de l'entreprise (800+, 180+ experts, 23 M€), écoles des ingénieurs.
- Qualification : la qualité de la preuve est inégale. Les points forts : personne nommée avec fonction + entreprise, un chiffre rattaché à **une** personne et à **un** projet, lien vers la page du projet. Les points faibles : « 98,3 % de temps gagné », « 30 M€ de gains mesurés », « +60 % » sont affichés sans période, sans méthode, sans baseline. Les logos sont présentés sans distinguer client direct, sous-traitance ou partenaire. C'est exactement ce que la spec Parrit.ai §6 interdit (H02 : statut de relation).

### Page offre (service) : architecture
- Surtitre de rubrique, H1 avec le résultat, 3 puces chiffrées, 2 CTA, logos. Puis : la technologie en action, **méthode en 5 à 6 étapes numérotées avec le critère décisionnel fixé avant le développement** (idée très proche de la porte go/no-go des AI Sprints), pourquoi nous (3 arguments chiffrés), **7 réalisations avec format problème / ce qui a été fait / 2 chiffres**, équipe nommée avec spécialité, FAQ, formulaire.
- La page « Conseil et transformation IA » a un ordre analogue avec, en plus, une citation de l'expert maison qui énumère les obstacles typiques et une présentation de l'équipe par rôle (« cartographie, priorise par ROI et faisabilité, cadre les feuilles de route »).

### Page cas (fiche projet, 4 046 px)
- Structure courte : bandeau visuel + logo client, nom du client, une phrase de contexte, **2 chiffres clés**, « Le besoin » (3 phrases), vidéo de témoignage, « La solution de Galadrim » (3 puces : qui, combien de temps, quoi), carrousel d'illustrations, citation, formulaire de contact, logos.
- Manques par rapport à la spec T3 de Parrit.ai : pas de baseline vérifiable, pas de décision intégrer vs construire, pas d'architecture, pas de tests et de validation, pas de méthode de mesure, pas de limites. Aucun lien vers l'offre d'origine ni vers des cas voisins depuis la fiche.
- Les cas plus riches sont sur les **pages d'offre** (format problème / réponse / 2 à 3 chiffres), pas sur les fiches.

### Profondeur éditoriale
- Un blog régulier, orienté décision (étude de rentabilité sur 14 projets, avec une section « Les limites de l'étude » et une section « Mesurer avant de déployer »), une page références filtrable (champ de recherche, 23 secteurs, 13 091 px de long), des pages par secteur (23), par ville (3), « Notre usage de l'IA », « Notre méthode », « Notre approche conseil ».
- Des pages pour moteurs de recherche à large échelle (pages sectorielles, pages par agence), à ne pas confondre avec une profondeur utile.

### Motion
- Peu d'animation : une rotation décorative de petites croix, des carrousels (témoignages, projets, équipe) avec flèches et points, une bande de logos **statique** (pas de défilement automatique, vérifié sur 3 s), deux vidéos non lancées automatiquement. Sélecteur de couleur du site (6 teintes) : fonction de personnalité, sans valeur de conversion.
- Aucun contenu masqué en attente d'animation (même quantité d'éléments invisibles avant et après défilement, soit des carrousels hors champ). Avec `prefers-reduced-motion`, les rotations s'arrêtent. Lecture non bloquée.

### Responsive
- Pas de débordement horizontal. Le menu mobile à deux niveaux est le point le plus lourd ; la barre collante garde le CTA. Accueil 13 282 px sur mobile (x1,3). Pages références : 22 010 px sur mobile (très longue).

### Formulaires
- Un formulaire unique sur toutes les pages (« Votre demande ») : prénom, nom, e-mail, téléphone, société ou nom du projet, **budget (liste de 7 choix, de 0 à plus de 300 k€ ou « je ne sais pas »)**, message, joindre des fichiers = **8 champs, 6 obligatoires**, 1 étape, promesse « sous 1 h ». Pas de prise de rendez-vous en ligne visible.
- Un deuxième champ à part : l'abonnement à la newsletter (1 champ e-mail, en pied de page).

---

## 3. Comparaison courte

| Critère | L'École de l'IA | Galadrim |
|---|---|---|
| Promesse du premier écran | Une phrase de principe + preuve de certification + action immédiate | Titre générique + sous-titre de bénéfice + logos immédiats |
| Chemin de conversion | Le plus court : rappel ou WhatsApp dans le hero, 3 champs | Contact en 2 clics, formulaire de 8 champs, budget demandé |
| Preuve | Rare, honnête, datée, dimensionnée | Abondante, nommée, mais chiffres souvent sans méthode |
| Offres | 2 offres lisibles, fiche « En bref » | ~24 destinations, dense, par discipline |
| Cas | Exemples types, pas de références | 7 cas par offre + 6 témoignages, fiche projet courte |
| Menu mobile | Liste plate, 1 niveau | Accordéon, 2 niveaux, long |
| Motion | Apparition au défilement qui masque le contenu avant défilement | Quasi inexistante, lecture libre |

---

## 4. À transposer / À rejeter pour Parrit.ai

Principe : on transpose des **mécanismes** (ordre, rôle d'un bloc, règle de preuve), pas des compositions, des textes, des illustrations ni des identités. Les tokens, polices et palette de Parrit.ai restent ceux du Brand OS (spec §0, §7).

| Section de la spec | À transposer (mécanisme, à notre façon) | À rejeter | Pourquoi |
|---|---|---|---|
| **H01 Hero** | Tenir le premier écran sur 4 éléments : surtitre, H1, sous-titre, 2 CTA. Chez Galadrim la paire CTA principal / CTA secondaire est identique à la spec ; sur les pages d'offre, nommer le CTA par l'interlocuteur et le résultat plutôt que « en savoir plus ». Chez L'École : un point d'action qui annonce le délai de réponse (« rappel sous 48 h »). | Un formulaire complet dans le hero ; 5 points d'action ; un H1 générique sans résultat. | La cible est dirigeant/DSI, pas un particulier qui s'inscrit : un formulaire dans le hero est trop tôt. Un H1 abstrait ne traduit pas la phrase fondatrice de la spec. Un CTA principal unique tient la spec §4 H12 (« éviter doubles parcours »). |
| **H02 Bandeau de confiance** | Le placement : la bande de preuve **juste sous le hero**, une phrase de cadrage et 6 à 8 marques max. Chez L'École : afficher la **date et la taille de l'échantillon** à côté de tout chiffre. | Logos non classés (client direct, sous-traitance, partenaire confondus) ; chiffres sans période ; mur de 20 logos. | La spec exige le statut de relation et une preuve ; les deux sites ne le font pas. Chez nous, 5 noms seulement sont publiables (liste `public-clients.ts`), donc la bande doit savoir se réduire sans paraître vide (état vide élégant). |
| **H03 Conseil & Transformation** | Le mini-cadre « Observer, Prioriser, Transformer, Mesurer » peut s'appuyer sur la **méthode numérotée de Galadrim** où le critère de décision est fixé avant le développement ; et sur les trois temps pédagogiques de L'École (données, flux, agents) : un trio nommé, une ligne par temps, un livrable par temps. | Un bloc « pourquoi nous » à chiffres d'agence ; un jargon de transformation sans livrable. | La spec demande d'expliquer avant de parler technologie : la pédagogie en 3 temps est le bon modèle. |
| **H04 Réalisations** | Format **problème / intervention / système / résultat** en 3 cartes (celui des pages d'offre de Galadrim), avec **un chiffre rattaché à une personne, un projet et une période** ; fiche d'exemple type « ce que vous repartez avec » de L'École quand le cas n'est pas publiable. | Citation + chiffre sans méthode ; fiche projet de 4 000 px sans baseline, décision ni limites ; chiffres globaux (« 30 M€ de gains »). | La spec T3 impose baseline, décision intégrer/construire, tests, limites. Un cas anonymisé doit le dire ; les « exemples types » de L'École sont un bon format de **repli explicitement signalé**. |
| **H05 AI Sprints** | La **fiche « En bref »** de L'École (date, durée, lieu, groupe, prix, certification) adaptée sans prix : périmètre, livrables, critère de succès, décision go/no-go, ce qui n'est pas livré. La méthode Galadrim « seuil de mise en production fixé avant le premier développement ». | Une date de session et un compteur de places ; une promesse de durée fixe. | La spec §2 interdit une promesse universelle de 14 jours ; aucun prix public (règle repo 12/10). |
| **H06 Engineering & Intégration** | La **démonstration en étapes** de L'École (demande, données, flux, agent, validation humaine), jouée mais lisible sans animation, comme modèle pour le sélecteur Intégrer / Construire / Orchestrer. Chez Galadrim, une capture de produit réel plutôt qu'un schéma abstrait pour les cas montrables. | Démonstration qui ne démarre qu'avec JS ; carrousels de produits à flèches comme seul accès. | La spec demande clavier et lecture sans animation ; un état initial invisible va à l'encontre de H06. |
| **H07 Harness Engineering** | La rigueur de L'École : « tout est vérifiable », chaque affirmation renvoie à une source et indique sa date ; la FAQ qui répond à une objection concrète ; le **sommaire collant + sources** des guides pour la page Harness (audience DSI). Chez Galadrim, l'article « limites de l'étude » : montrer les limites de la mesure. | Présenter des mesures « avant/après » sans test réel. | La spec : « mesures affichées uniquement si tests réels ». Le modèle à suivre est l'honnêteté sur l'échantillon, pas l'effet d'annonce. |
| **H08 Technologies intégrées** | Bande d'outils **groupée par fonction** (L'École) ; statut par techno. | Logos de technologies placés comme preuve de savoir-faire sans statut. | La spec §4 H08 exige un statut prouvé (intégré, utilisé, expérimenté, compatible) et interdit l'effet « partenariat officiel ». |
| **H09 Partenaires scientifiques** | Présentation **nominative par rôle** (Galadrim, équipe : nom, spécialité, ce que la personne fait sur un projet) ; formateurs « praticiens » de L'École. | Logos d'écoles en bandeau pour dire la qualité de l'équipe ; mise en avant de diplômes. | La spec exige affiliation vérifiée et consentement ; l'effet « grandes écoles » ressemble à l'usage institutionnel du nom du MIT que la spec interdit. |
| **H10 Écosystème, Formia** | L'École : la **page de preuve officielle** (certificat, numéro, organisme certificateur, périmètre) pour traiter Qualiopi exactement comme il est écrit ; le parcours « moi / mon équipe » pour orienter vers Formia. | Mettre Qualiopi en pastille de hero de Parrit.ai. | Le Qualiopi de L'École est celui de son entité ; la spec §H10 interdit d'attribuer à Parrit.ai la certification de Formia. |
| **H11 Méthode / équipe** | Équipe **par rôle** (chaque personne : titre, ce qu'elle fait dans le projet), méthode numérotée commune à toutes les pages d'offre. | Culture / piliers de recrutement (« moins de 1 % des candidats ») ; vidéo de présentation en autoplay. | La spec veut « qui fait quoi » sans faire passer un partenaire pour un salarié ; l'argument de recrutement est un argument d'agence. |
| **H12 Dernier CTA** | Une **seule** issue : un message ou un rendez-vous. Délai de réponse annoncé. Pas de champ obligatoire en trop. Orientation préalable en 3 cartes au-dessus du formulaire (L'École, page contact). | Champ budget en tranches obligatoire ; deux parcours concurrents (rappel + libre) sur la même page ; bouton WhatsApp flottant. | La règle repo « un seul lien de réservation » et la spec « éviter les doubles parcours » ; pas de prix public, donc pas de budget affiché. Un budget en liste est une information commerciale sensible à un premier contact de dirigeant. |
| **Menu / architecture** | Panneau avec **une ligne de bénéfice sous chaque lien** (L'École) ; 1 niveau ; menu mobile **liste plate** sans accordéon. Un CTA qui reste dans la barre mobile après le hero (Galadrim). | Panneau de 24 liens et 23 secteurs ; pages par ville et par secteur à grande échelle ; sélecteur de couleur du site. | La spec : « maximum un niveau profond sur mobile », pas de méga-menu surdimensionné, « sans alourdir le menu ». |
| **Motion** | Prefers-reduced-motion respecté à 100 % (L'École) ; carrousels sans lecture automatique et logos statiques (Galadrim). | Apparition au défilement avec contenu invisible avant tout scroll (109/167 éléments à l'état initial chez L'École). | La spec : animations discrètes et non bloquantes. Le critère d'acceptation doit tester le rendu sans JS et sans mouvement. |
| **Formulaire** | 3 coordonnées + consentement + promesse de délai ; une fois la prise de contact faite, questions facultatives. | Pièce jointe, budget, demande de société obligatoire en première étape. | « Champs minimaux » (H12). |

### Les trois portes d'entrée et Harness Engineering

| Page de la spec | À transposer | À rejeter | Pourquoi |
|---|---|---|---|
| **Conseil & Transformation** (porte A) | La page conseil de Galadrim : problèmes typiques énumérés (données dispersées, POC sans impact, adoption faible) → méthode en étapes numérotées → **cas avec résultat par contexte** → équipe par rôle (cartographie, priorisation, feuille de route). La pédagogie L'École « pour qui, ce qu'on construit, ce que vous repartez avec ». | La mise en avant de chiffres de ROI d'agence ; le terme « consultants qui construisent » comme slogan. | Livrables types de la spec §2A : état des lieux, matrice de priorisation, feuille de route, plan d'adoption, indicateurs. Un « repartez avec » les rend concrets. |
| **AI Sprints** (porte B) | Fiche « En bref » à six lignes sans prix ; sections « livré / non livré » ; cartes cadrage, construction, évaluation, décision (modèle du déroulé en 7 temps de la page entreprise de L'École). | Calendrier fixe, places limitées, urgence, tarif. | La spec interdit un délai universel ; la règle repo interdit le prix public. |
| **Engineering & Intégration** (porte C) | Page d'offre Galadrim IA : H1 avec résultat, 3 puces, méthode, réalisations par format fixe, FAQ « agent contre automatisation classique ». Aux DSI, la FAQ répond à une objection réelle. | 7 sous-offres au même niveau ; catalogue de pages techno. | La spec : « sans alourdir le menu » ; 4 entrées sous Engineering suffisent. |
| **Harness Engineering** (page phare) | Mise en page « guide d'expert » de L'École : sommaire collant, sources, mise à jour datée, FAQ, schéma ; section « limites » du billet de ROI de Galadrim. Afficher la relation entre harnais et résultat avec un exemple **même tâche, avec et sans harnais** si des tests réels existent. | Promesse de gain chiffré ; schéma décoratif d'IA ; jargon sans traduction dirigeant. | La spec T2 : « compréhensible sans jargon », protocole d'évaluation, deux entrées (construction neuve / optimisation). Aucun de ces deux sites n'a d'équivalent : c'est un espace laissé libre. |

---

## 5. Dix à douze enseignements prioritaires (résumé)

À transposer :
1. Bande de preuve juste sous le hero, 6 à 8 marques, avec statut de relation (Galadrim pour le placement, pas pour la rigueur).
2. Délai de réponse annoncé à côté du CTA (L'École, Galadrim « sous 1 h » comme forme).
3. Fiche « En bref » de 6 lignes sur la page offre, sans prix (L'École).
4. Méthode en étapes numérotées avec critère de décision posé avant la construction (Galadrim) : base des AI Sprints.
5. Cas au format problème / intervention / résultat avec un chiffre daté et attribué (Galadrim page d'offre, rehaussé par la rigueur de L'École).
6. Chiffre toujours accompagné de sa date et de la taille de l'échantillon (L'École).
7. Orientation en 2 portes dès le CTA final (moi / mon équipe : ici, « dirigeant » / « DSI »).
8. Menu mobile en liste plate, bénéfice d'une ligne sous chaque lien en desktop (L'École) ; CTA qui se re-colle dans la barre mobile après le hero (Galadrim).
9. Guide d'expert avec sommaire collant, sources et date de mise à jour (L'École) pour Harness Engineering.
10. Équipe par rôle (« ce que la personne fait dans le projet ») plutôt que par diplôme (Galadrim, corrigé).
11. Rendu complet sans JS ni mouvement : tout le contenu visible à l'état initial, motion = bonus.

À rejeter :
1. Logos sans statut et chiffres d'agence sans méthode.
2. Formulaire complet dans le hero, budget en tranches, pièce jointe comme étape 1.
3. Contenu invisible tant qu'on n'a pas défilé.
4. Méga-menu de 25 liens et pages en masse par secteur / par ville ; bouton flottant qui recouvre.

## 6. Écarts et inconnus à garder à l'esprit
- `UNKNOWN` : conversions réelles, performance (Core Web Vitals), accessibilité clavier complète, comportement après envoi, contenu des vidéos.
- Les deux sites visent un autre public que Parrit.ai : L'École vend une formation à des TPE ; Galadrim vend du développement d'applications sur mesure. Le benchmark éclaire la forme, pas le ton ni le niveau de décision d'un dirigeant d'ETI.
- Les chiffres cités dans ce rapport sont ceux que les sites affichent ; ils ne sont ni vérifiés ni réutilisables comme références de marché.
