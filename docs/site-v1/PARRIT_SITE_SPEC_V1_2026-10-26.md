PARRIT.AI — Spécification canonique du site

Version : 1.0 — 26 octobre 2026
État : Spec de conception validable ; éléments de preuve, identité et contrats à contrôler avant publication
Cible : Claude Code / Opus 5.5, équipe design, engineering, marketing et direction
Portée : parrit.ai ; articulation avec paul-larmaraud.com et Formia ; LinkedIn et vidéo en prolongement

(Texte reçu de Paul le 26/10/2026, conservé tel quel. Les arbitrages et écarts relevés par Claude sont dans `NOTE-CADRAGE.md`, à côté.)

0. Résumé décisionnel

Transformer parrit.ai d'une vitrine expliquant des prestations techniques en une interface commerciale claire pour des dirigeants et crédible pour les DSI : Conseil & Transformation d'abord, puis AI Sprints, Engineering & Intégration, avec Harness Engineering fortement mis en évidence. Le site doit démontrer la capacité de Parrit.ai à accompagner la transformation, intégrer les technologies existantes, concevoir des solutions propriétaires, déployer et faire adopter des systèmes opérationnels.

Phrase fondatrice proposée : « Nous accompagnons la transformation des entreprises. Et nous construisons les systèmes qui la rendent possible. »

Hero à tester : « Transformez votre entreprise. Pas simplement vos outils. »
Sous-texte : « De la stratégie à la mise en production, nous repensons vos opérations, intégrons les bonnes technologies et construisons les systèmes adaptés à votre métier. »
CTA primaire : « Parlons de votre transformation »
CTA secondaire : « Voir nos réalisations ».

Décisions actées :

• Conseil & Transformation comme premier pilier du discours et de l'expérience.
• Entrées principales : Conseil & Transformation / AI Sprints / Engineering & Intégration.
• Harness Engineering = capacité majeure avec page dédiée, visible depuis homepage et menu Engineering.
• Déploiement, adoption et formation, notamment avec Formia, dans le parcours de transformation.
• Content Factory retirée du catalogue commercial, des verticales mises en avant et de la navigation ; elle peut exister comme outil marketing interne.
• Palette, polices et design tokens Parrit.ai conservés depuis le code canonique, aucune refonte chromatique ou typographique imposée.
• Les partenaires scientifiques contribuent à la conception et l'implémentation des produits IA, pas de simples advisors.
• Séparer explicitement clients, partenaires, chercheurs, technologies intégrées, solutions propriétaires, et sociétés de l'écosystème.
• Aucun déploiement ni publication sans revue et validation.

1. Pourquoi le site existe

Audiences prioritaires

1. Dirigeants ETI / grands comptes : veulent transformer des opérations, maîtriser les risques, obtenir une feuille de route et des résultats.
2. DSI / CTO / responsables techniques : cherchent un partenaire capable d'architecturer, intégrer, fiabiliser, sécuriser et opérer des systèmes.
3. Directions métier : souhaitent fluidifier les tâches concrètes et obtenir des solutions testables.
4. PME à forte intensité opérationnelle : souhaitent démarrer par un sprint circonscrit, sans promesse de transformation lourde par défaut.

Objectif primaire

Générer des conversations qualifiées avec une intention de transformation, de sprint ou d'engineering.

Objectifs secondaires

Établir la confiance par des réalisations vérifiables ; clarifier la différence intégration/produit propriétaire ; rendre compréhensible Harness Engineering ; soutenir la diffusion de cas d'usage par LinkedIn/vidéo ; orienter vers Formia quand la demande porte sur l'adoption/formation.

Anti-objectifs

Ne pas devenir un annuaire de modèles IA, une boutique de formations courtes, un catalogue de six offres interchangeables, une agence généraliste indistincte ou une collection de logos sans preuves.

2. Positionnement et architecture de l'offre

Promesse centrale : Conseil stratégique + compréhension fine des processus + engineering en production + appropriation par les équipes.

Trois portes d'entrée dans la navigation

A. Conseil & Transformation — « Comprendre, décider, transformer. »

• Diagnostic opérationnel et maturité ; audit des workflows humains et SI ; cartographie des opportunités.
• Priorisation valeur/risque/faisabilité ; transformation des processus ; stratégie et architecture cible.
• Gouvernance, données, conformité applicables, conduite du changement ; trajectoire de déploiement.
• Livrables types : état des lieux, matrice de priorisation, roadmap, plan d'adoption et indicateurs.

B. AI Sprints — « Un problème précis, un système testable, une décision fondée sur des preuves. »

• Définir le besoin, résultat attendu, périmètre, données et critères de succès.
• Construire une brique, tester avec utilisateurs, mesurer fiabilité et valeur, décider du passage en production.
• Ne pas promettre un délai fixe sans qualification ; le terme sprint indique un cycle court à périmètre contrôlé, non une garantie universelle de 14 jours.
• Livrables types : démonstrateur, critères d'évaluation, synthèse des écarts, décision go/no-go et suite.

C. Engineering & Intégration — « Concevoir, connecter, construire. »

• Logiciels métiers, agents supervisés, connecteurs, orchestration, data et architectures privées/souveraines si appropriées.
• Intégrer l'existant quand il répond au besoin ; construire des composants propriétaires lorsque la différenciation métier le justifie.
• Définir pour chaque cas les droits de propriété intellectuelle, la réversibilité, la maintenance et le mode d'hébergement ; ne pas promettre une cession systématique de la propriété.

Capacités mises en avant sans alourdir le menu

• Harness Engineering (page phare) : instructions, contexte, mémoire, skills, outils, permissions, orchestration, évaluation, observabilité, supervision, coûts, robustesse et maintenance. Promesse dirigeant : « Des agents qui travaillent de façon fiable dans vos opérations. »
• Private & Sovereign AI : choix d'architecture, gestion des données, modèle d'exploitation ; ne pas présumer qu'un fournisseur précis est souverain au sens contractuel.
• AI Go-to-Market Infrastructure : acquisition, qualification, suivi CRM et flux métiers ; illustrer par des workflows concrets.
• Déploiement & Adoption : conduite du changement, formation, transfert de compétences, support ; mentionner Formia et Qualiopi uniquement dans les termes vérifiés.

3. Architecture de l'information (V1)

Menu desktop

• Conseil & Transformation
• AI Sprints
• Engineering & Intégration ▾
  • Harness Engineering
  • Logiciels & Agents sur mesure
  • Intégrations & Infrastructures privées
  • Go-to-Market Systems (si validé commercialement)
• Réalisations
• À propos ▾
  • Équipe et méthode
  • Partenaires scientifiques
  • Écosystème & Formia
• CTA fixe : Parler d'un projet

Sur mobile : navigation accordéon, CTA accessible sans recouvrir les contenus, pas de mega-menu surdimensionné. Afficher Ressources/Insights seulement si cadence de publication réelle.

Pages MVP

/ homepage ; /conseil-transformation ; /ai-sprints ; /engineering-integration ; /harness-engineering ; /realisations ; /realisations/[slug] ; /partenaires ; /ecosysteme ; /contact.

Phase 2 : pages par problème métier, technologies, recherche approfondie, articles, langues supplémentaires, comparaison intégration vs build.

Conserver les URLs actuellement référencées lorsqu'elles sont utiles ; prévoir 301 et hreflang pour toute migration. Audit des variantes FR/EN avant implémentation.

4. Homepage — séquence détaillée et comportement UX

H01. Hero — premier écran
• Eyebrow : « CONSEIL · TRANSFORMATION · ENGINEERING ».
• H1 : « Transformez votre entreprise. Pas simplement vos outils. »
• Sous-titre : de la stratégie à la mise en production.
• CTA A « Parlons de votre transformation », CTA B « Voir nos réalisations ».
• Visuel : dispositif éditorial/produit animé présentant un processus métier initial et le système cible ; pas de robot, cerveau lumineux ni pseudo-interface trompeuse.
• Desktop : forte hiérarchie, une seule proposition de valeur. Mobile : H1 lisible sans réduction extrême et CTA visible sans scroll disproportionné.

H02. Bandeau de confiance
• Logos clients autorisés et références de projets clairement catégorisées (direct, via partenaire, collaboration).
• Maximum 6–8 visibles au premier niveau ; chaque logo a tooltip/texte alternatif factuel et lien vers une preuve si disponible.
• Pas de faux « Ils nous font confiance » si le statut de relation diffère ; titre alternatif : « Des projets menés au sein d'organisations exigeantes » uniquement si documenté.

H03. Conseil & Transformation — bloc central prioritaire
• Avant de parler technologies, expliquer l'identification des opérations, la priorisation, le cadrage des risques et la conduite du changement.
• Montrer un mini-framework : « Observer → Prioriser → Transformer → Mesurer ».
• CTA « Explorer notre approche conseil ».

H04. Réalisations / cas d'usage
• Grille de 3 exemples avec niveau de preuve : problème / intervention / système / résultat / contexte.
• Suggestions candidates : finance (balance générale vers analyse et support d'investissement), CRM (carte de visite vers fiche après validation), documents internes (recherche contrôlée) ; à n'utiliser que si démonstrations permises et niveau de réalité marqué.
• Captures réelles autorisées ou reconstitutions explicitement signalées.

H05. AI Sprints
• Contraste « Une décision fondée sur un prototype testé plutôt que six mois d'hypothèses » ; ne pas inventer le calendrier.
• Cartes : cadrage, build, évaluation, next step ; présenter ce qui est livré et ce qui ne l'est pas.
• CTA « Cadrer un sprint ».

H06. Engineering & Intégration
• Module interactif pédagogique à 3 états : Intégrer l'existant / Construire le manquant / Orchestrer l'ensemble.
• État cliquable avec illustration cohérente et exemple de livrable ; accessible au clavier, sans animation obligatoire.
• Insister sur propriété du code, contrôle, interopérabilité et réversibilité selon contrat.

H07. Harness Engineering — section phare
• H2 proposé : « Le modèle ne suffit pas. Il faut un système fiable autour. »
• Démonstration contrôlée : même tâche, sans puis avec contexte, outils, vérifications, autorisations ; mesures affichées uniquement si tests réels.
• CTA « Optimiser notre système d'agents ».

H08. Technologies intégrées
• Vrais logos en SVG optimisés et autorisés, groupés par fonction : modèles / données / cloud / orchestration / outils métiers.
• Statuts dans le registre : intégré en production / utilisé sur projet / expérimenté / compatible ; seuls les statuts prouvés sont affichés.
• L'utilisation d'une technologie ne doit jamais être présentée comme un partenariat officiel.

H09. Partenaires scientifiques
• Titre : « De la recherche avancée aux systèmes en production. »
• Profils individuels, spécialité, affiliation vérifiée, rôle concret dans la conception et l'implémentation des produits IA, projets publiables.
• Certains chercheurs peuvent être affiliés au MIT. Ne pas appeler le MIT « partenaire institutionnel » ni utiliser son logo sans preuve et autorisation.
• Photos, noms, titres, citations : consentements et validations explicites.

H10. Écosystème — formation, Formia, Calypie
• Montrer Formia et, selon validation de dénomination et rôle, Calypie ; préciser la nature des relations, sans inventer de schéma capitalistique.
• Qualiopi : contrôler l'entité titulaire, la validité, les catégories d'actions certifiées et les mentions obligatoires. Ne pas attribuer à Parrit.ai une certification portée par Formia.
• Formation comme levier d'adoption, pas offre qui éclipse conseil ou engineering.

H11. Méthode / équipe
• Processus commun : reverse-engineering des opérations → priorisation → première brique mesurée → intégration → tests → adoption/maintenance.
• Montrer qui fait quoi : pilotage, spécialistes, partenaires scientifiques et équipes delivery, sans faire passer un partenaire externe pour un salarié.

H12. Dernier CTA
• « Parlons de l'opération que vous voulez transformer. »
• CTA formulaire ou prise de rendez-vous avec champs minimaux ; éviter doubles parcours concurrents.
• Mentions légales et consentement adaptés, suivi de conversion soumis au choix de cookies applicable.

5. Templates

T1. Page offre (commune) : Hero (résultat métier) → problèmes réels → ce que nous faisons / livrables → méthode → exemple → contraintes et gouvernance → FAQ → CTA.

T2. Harness Engineering (spécifique) : Problème (« agent performant en démo mais fragile en production ») → schéma du harnais → audit/architecture/optimisation → composants (contexte, outils, skills, mémoire, tests, supervision, coût) → protocole d'évaluation → livrables (audit, backlog, harnais refactoré, suite de tests, runbook) → CTA. Différencier construction neuve et optimisation d'un système existant.

T3. Étude de cas : Contexte & statut publiable → problème humain existant → baseline vérifiable → décision intégrer vs construire → architecture (sans divulguer secrets) → mise en œuvre → tests & validation humaine → résultats avec méthode de mesure → limites → CTA. Un cas anonymisé doit le dire.

T4. Partenaire / expertise : Profil ou organisation → relation exacte → apport aux projets → preuve de collaboration → autorisations → contact ou redirection.

6. Système de preuve / règles de publication

Mettre en place un registre éditorial structuré pour chaque logo, nom, citation, métrique, capture, attribution et relation.

Champs minimum : id, category, display_name, relationship_type, claim, evidence_source, permission_owner, permission_status, approved_assets, usage_scope, expiration_or_review_date, last_verified, page_ids.

Règles :
• Clients : vérifier relation directe / sous-traitance / partenaire, puis permission de logo et de projet.
• Partenaires : distinguer contrat, collaboration scientifique individuelle et simple utilisation technique.
• MIT : l'affiliation d'un chercheur n'autorise pas un soutien institutionnel attribué au MIT.
• Formia/Qualiopi : mentions vérifiées ; Calypie : dénomination et rôle exacts à confirmer.
• Chiffres : préciser méthode de mesure et période ; aucun ROI fictif.
• Solutions propriétaires : confirmer détenteur des droits et périmètre avant d'utiliser « propriétaire ».
• Démonstrations : distinguer « simulation », « prototype », « pilote », « en production ».
• Si preuve ou permission absente : masquer / anonymiser / demander validation, jamais supposer.

7. Design system, inspiration et ergonomie

Références à analyser, pas à reproduire :
• https://lecoledelia.com/ : pédagogie, simplicité, lisibilité des bénéfices et parcours de conversion.
• https://galadrim.fr/ : cas clients, crédibilité engineering, architecture des services, profondeur éditoriale.

Auditer les deux sites sur desktop et mobile avec captures datées, et inventorier : header, hero, structure de scroll, CTA, menu, preuves, cas, menus de services, motions, responsive, formulaires. Documenter ce qu'on transpose et ce qu'on rejette pour Parrit.ai. Respecter la propriété intellectuelle ; ne pas copier textes, illustrations, code, composition singulière ou identité.

Identité canonique Parrit.ai :
• Lire les CSS variables / tokens / font-face / Tailwind / composants des projets courants.
• Conserver les couleurs et polices trouvées et validées ; ne pas inventer de palette.
• Ne pas réinstaurer l'ancien code noir/blanc/encre/sceau rouge comme norme.
• Produire un inventaire de tokens avec chemin de fichier et usages réels.
• Typographie : niveaux H1/H2/H3, lisibilité mobile, longueur de ligne, césure contrôlée.

Exigences UX :
• Navigation claire par intention commerciale ; maximum un niveau profond sur mobile.
• Contrastes WCAG AA visés, focus visible, interaction clavier et prefers-reduced-motion.
• Images optimisées, chargement différé sous la ligne de flottaison ; réserver dimensions pour éviter CLS.
• Performance cible : Core Web Vitals « good » sur terrain, puis tests Lighthouse reproductibles ; ne pas prétendre performance atteinte avant mesure.
• Animations discrètes, non bloquantes, sans carrousel de confiance obligatoire.
• Responsive : 360 / 390 / 768 / 1024 / 1440 px minimum.
• SEO : titres uniques, canonical, OpenGraph, JSON-LD approprié uniquement si vérifiable, sitemap, robots, maillage, redirections.
• FR primaire ; EN selon contenu réellement relu, éviter traductions semi-automatiques incohérentes.

8. Architecture technique et modèle éditorial

Ne pas choisir une stack avant audit du dépôt. Préférer réutiliser les composants, CMS, CI/CD, hébergement et pipelines existants.

Types de contenu : Offer, UseCase, CaseStudy, Technology, Partner, Person, Entity, Testimonial, Evidence, Video, CTA.

Relations : une offre référence plusieurs cas ; un cas mobilise plusieurs technologies et compétences ; preuves associées aux affirmations ; personnes rattachées à des rôles réels ; vidéos réutilisent des cas et une source structurée.

Gouvernance : brouillon → revue factuelle → validation droits/assets → revue marque → prêt publication → publié ; horodatage et responsable par champ sensible.

Maintenance : revue trimestrielle des logos / affiliations / certifications ; tests d'intégrité des pages, liens, schémas et formulaires.

9. Vidéo & LinkedIn comme extension (pas une offre Content Factory)

Produire une Video Factory interne, réutilisant le contenu structuré des cas d'usage, avec une vidéo hebdomadaire si la capacité de production le permet.

Six axes éditoriaux proposés : Transformation ; AI Sprints ; Harness Engineering ; Logiciels sur mesure ; IA privée/intégration ; Go-to-Market systems. Chaque vidéo doit démontrer un problème → intervention → contrôle → résultat.

Premier prototype : « Une carte de visite. Une validation. Votre CRM est à jour. » ; données fictives, états explicites. Format vertical 1080×1920, 35–50 s, sous-titres, compréhension sans son. Pour Opus 5.5, utiliser le modèle pour scénariser et coder un pipeline de rendu (Remotion si compatible), sans prétendre qu'il génère nativement de la vidéo.

Bannières LinkedIn : tailles et zones sûres à vérifier avec les spécifications actuelles de la plateforme ; reprendre directement couleurs et fontes du design system Parrit.ai. Textes des profils personnels/entreprise cohérents avec le site, sans confondre marque du fondateur et marque commerciale.

10. Parcours de conversion et instrumentation

Parcours A — Dirigeant transformation : Homepage → Conseil → cas d'usage métier → « Parlons de votre transformation » → RDV qualifié.
Parcours B — DSI / engineering : Homepage → Engineering → Harness → architecture + protocole d'évaluation → prise de contact technique.
Parcours C — Besoin circonscrit : Homepage → AI Sprints → livrables et critères de succès → demande de cadrage.
Parcours D — Adoption / formation : Homepage → méthode/déploiement → Formia avec relation claire → prise de contact pertinente.

Mesures : taux de clic CTA par page, profondeur vers case studies, formulaires aboutis, rendez-vous qualifiés, origine LinkedIn/vidéos, conversions par persona. Ne pas suivre les visiteurs de manière non conforme ; consentement et paramétrage privacy-first.

11. Plan d'exécution terminal / Claude Code

Étape 0 — Découverte et sauvegarde (bloquante)
• Trouver les dépôts locaux actifs, l'état git status, branches, fichiers de design, contenu et scripts.
• Identifier la session du chantier en cours et éviter les conflits.
• Sauvegarder les changements non commités selon pratique projet ; ne rien supprimer.
• Extraire les tokens couleurs/polices avec chemins et captures du site actuel.
• Faire l'audit des références lecoledelia.com et galadrim.fr ; documenter explicitement les limites d'accès.
• Cartographier les sources de vérité client/partenaire/qualification et les preuves.

Étape 1 — Stratégie et UX
• Proposer sitemap annoté, wireframes responsive, contenu exact du hero, premier écran et trois pages pivots.
• Produire tableau comparatif existant → cible ; énumérer les hypothèses non vérifiées.
• Bloquer toute publication de logos/claims sans preuve et autorisation.

Étape 2 — UI et code
• Branch dédiée ; re-use design tokens canoniques ; composants LogoWall, Capabilities, CaseStudyCard, EvidenceBadge (statut interne, pas nécessairement visible), TechnologyRegistry, ScientificPartnerCard, IntegrationBuildSwitcher, CTA.
• Construire pages homepage, conseil, sprints, engineering, harness, cas, partenaires, écosystème.
• Contenus structurés ; modules éditoriaux réutilisables ; état vide élégant quand preuves manquent.

Étape 3 — QA
• Contrôles desktop/mobile, clavier, contraste, prefers-reduced-motion, performance, SEO, liens/redirects, formulaire et suivi consentement.
• Screenshots avant/après, revue sur cinq tailles et rapport des points bloquants.
• Tests : aucun logo non autorisé, aucune attribution MIT institutionnelle, aucune certification fausse, aucun chiffre non sourcé.

Étape 4 — Livraison et approbation
• PR ou patch avec fichiers, captures, environnement de preview et checklist.
• Produire la liste des arbitrages restants, dépendances d'assets et permissions.
• Pas de merge, de mise en production, d'envoi d'email ni de publication LinkedIn sans validation explicite.

12. Critères d'acceptation (Definition of Done)

☐ Le premier écran énonce clairement Conseil & Transformation + capacité de construire.
☐ En moins de deux clics, un dirigeant comprend les trois portes d'entrée.
☐ Harness Engineering possède une page spécifique compréhensible sans jargon.
☐ AI Sprints explique périmètre, livrables, validation et limites.
☐ La distinction technologies intégrées / partenaires / clients / entités / solutions propriétaires est explicite.
☐ Logos et preuves vérifiés, permissions renseignées, états de publication sûrs.
☐ Formia / Calypie / Qualiopi correctement attribués après vérification.
☐ Chercheurs scientifiques décrits comme contributeurs effectifs, affiliations et autorisations contrôlées.
☐ Content Factory absente du catalogue commercial et de la navigation.
☐ Couleurs et typographies Parrit.ai inchangées, conformément aux tokens actifs.
☐ Les pages fonctionnent sur mobile et au clavier ; QA documentaire.
☐ Le code réutilise l'architecture existante et n'efface pas le travail local.
☐ Une preview et un rapport de livraison permettent la validation avant production.

13. Registre des points ouverts

P0 — avant publication : repository/session actifs ; tokens & fontes canoniques ; validation des textes d'accroche ; logos clients et statuts commerciaux ; chercheurs nommés, affiliation et permission ; statut Qualiopi/Formia ; identité/rôle exact de Calypie ; propriété des solutions présentées ; droits des images/vidéos ; calendrier et formulaire de RDV.

P1 — avant mise à l'échelle : choix des cas d'usage emblématiques ; ressources disponibles pour vidéos hebdomadaires ; stratégie FR/EN ; analytics privacy-first ; SEO et redirections ; ownership éditorial ; CMS existant vs nouveau.
