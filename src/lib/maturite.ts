export type MaturiteLevel = "N1" | "N2" | "N3" | "N4" | "N5" | "N6" | "N7";

export type MaturiteSlug =
  | "masterclass-ia"
  | "masterclass-metier"
  | "sessions-mcp"
  | "audit"
  | "deploiement-agents"
  | "outils-agentiques"
  | "optimisation-flotte";

export type MaturiteOffer = {
  level: MaturiteLevel;
  slug: MaturiteSlug;
  eyebrow: string;
  h1: string;
  sub: string;
  phrase: string;
  ctaLabel: string;
  ctaHref: string;
  stories: {
    title: string;
    person: string;
    before: string;
    after: string;
    result: string;
    logo?: { src: string; alt: string };
  }[];
  forWho: string[];
  deliverables: string[];
  steps: { title: string; body: string }[];
  proof?: string;
  price: string;
  priceNote?: string;
  metaDescription: string;
};

const CONTACT_MAIL = "mailto:paul.larmaraud@parrit.ai";

export const maturiteOffers: Record<MaturiteSlug, MaturiteOffer> = {
  "masterclass-ia": {
    level: "N1",
    slug: "masterclass-ia",
    eyebrow: "N1 · Masterclass Généraliste",
    h1: "Arrêtez de subir le bruit médiatique. Comprenez enfin la mécanique.",
    sub: "Vous entendez parler d'intelligence artificielle partout. On pose les bases pour distinguer le vrai du faux.",
    phrase: "Je découvre l'IA générative",
    ctaLabel: "Recevoir mon programme",
    ctaHref: CONTACT_MAIL,
    stories: [
      {
        title: "Formation SNCF niveau 0",
        person: "Formation à la SNCF",
        before:
          "Des équipes exposées au bruit ambiant : ChatGPT, Copilot, agents, automatisation, sans grille simple pour savoir ce qui est vrai, utile ou risqué.",
        after:
          "Une base commune : IA générative, agents, automatisation, limites, sécurité et premiers cas d'usage crédibles pour les métiers.",
        result: "Le sujet devient discutable sans jargon : chacun comprend la mécanique avant de parler outils.",
        logo: { src: "/brand/client-logos/logo-3.png", alt: "SNCF" },
      },
      {
        title: "Masterclass IA générative chez Joone",
        person: "Formation chez Joone",
        before:
          "Des équipes curieuses mais dispersées entre consignes, générateurs de texte, automatisations et premiers usages d'agents.",
        after:
          "Une session claire sur l'IA générative, l'utilisation des agents et les automatisations simples que les équipes peuvent comprendre.",
        result: "La formation ouvre une trajectoire : généraliste pour aligner, sur mesure pour appliquer au métier.",
        logo: { src: "/brand/client-logos/logo-4.png", alt: "Joone" },
      },
    ],
    forWho: [
      "Vous êtes noyé sous les concepts théoriques.",
      "Vous craignez pour la sécurité de vos données internes.",
      "Vous refusez de valider des budgets sans comprendre la technologie.",
    ],
    deliverables: [
      "Programme généraliste : comprendre l'IA générative, les agents, l'automatisation et les limites à connaître.",
      "Programme sur mesure : adaptation au vocabulaire, aux métiers et aux vrais cas d'usage de vos équipes.",
      "Support partageable : un deck clair pour que les participants gardent une base commune après la session.",
    ],
    steps: [],
    proof: "",
    price: "à partir de 1 598 €",
    priceNote: "Finançable OPCO",
    metaDescription:
      "Masterclass généraliste de 3 heures pour cartographier les besoins, établir un glossaire opérationnel et définir des scénarios d'application.",
  },
  "masterclass-metier": {
    level: "N2",
    slug: "masterclass-metier",
    eyebrow: "N2 · Masterclass Métier",
    h1: "L'outil génère du texte. Faites-le travailler sur votre métier.",
    sub: "Vos collaborateurs utilisent des requêtes basiques. On adapte la machine à vos vrais processus quotidiens.",
    phrase: "Je veux l'appliquer à mon secteur",
    ctaLabel: "Recevoir ma session",
    ctaHref: CONTACT_MAIL,
    stories: [
      {
        title: "Atelier pratique pour une équipe métier",
        person: "Formation métier",
        before:
          "Les collaborateurs savent demander un texte, mais ne savent pas transformer leurs tâches récurrentes en méthodes fiables.",
        after:
          "La session part de leurs tâches : préparer une réunion, synthétiser un dossier, produire une analyse, accélérer une réponse client.",
        result: "L'équipe repart avec des modes opératoires simples, adaptés à son métier et réutilisables.",
      },
      {
        title: "Programme sur mesure par département",
        person: "RH, ventes, opérations, finance",
        before:
          "Les formations génériques restent trop loin du quotidien. Les équipes ne voient pas quoi changer lundi matin.",
        after:
          "On construit la session autour du département : documents, vocabulaire, contraintes, données sensibles et gestes vraiment utiles.",
        result: "La formation devient une boîte à outils métier, pas une démonstration d'outil.",
      },
    ],
    forWho: [
      "Vos licences dorment ou sous-performent.",
      "Les gains de temps réels sont invisibles sur la rentabilité.",
      "Les usages se limitent à corriger des fautes dans des emails.",
    ],
    deliverables: [
      "Session métier : RH, ventes, opérations, finance ou direction selon vos priorités.",
      "Bibliothèque d'exemples : cas d'usage, consignes, limites et gestes prêts à reprendre.",
      "Adaptation sur mesure : on relie les exercices aux documents, outils et contraintes du département.",
    ],
    steps: [],
    proof: "",
    price: "à partir de 2 345 €",
    priceNote: "Finançable OPCO",
    metaDescription:
      "Masterclass métier avec exercices pratiques et instructions personnalisées adaptées au métier du client.",
  },
  "sessions-mcp": {
    level: "N3",
    slug: "sessions-mcp",
    eyebrow: "N3 · Sessions Création & MCP",
    h1: "L'intelligence artificielle est aveugle. Branchez-la sur vos outils.",
    sub: "Vous maîtrisez les concepts de base. On vous apprend à connecter les modèles à des sources et services utiles pour déclencher des actions réelles.",
    phrase: "Je veux connecter mes logiciels à l'IA",
    ctaLabel: "Concevoir ma session",
    ctaHref: CONTACT_MAIL,
    stories: [
      {
        title: "Connecter Claude à Google Maps et Notion",
        person: "Session connecteurs",
        before:
          "Le modèle répond bien, mais il ne voit ni les adresses, ni les comptes rendus, ni les bases documentaires qui structurent le travail.",
        after:
          "La session montre comment relier Claude à Google Maps, Notion ou une base documentaire, avec des droits et des tests simples.",
        result: "Les équipes comprennent la différence entre discuter avec un modèle et le brancher à un contexte utile.",
      },
      {
        title: "Connecter Claude à Légifrance ou Gemini à ses connecteurs",
        person: "Introduction à l'agentique",
        before:
          "Les équipes entendent parler d'API, de MCP, de connecteurs Gemini et d'agents, mais ne savent pas ce qui change concrètement.",
        after:
          "On part d'exemples utiles : consulter Légifrance, interroger une base interne, utiliser des connecteurs Gemini, comprendre où commence l'agentique.",
        result: "La session donne assez de compréhension technique pour cadrer une suite sans vendre de magie.",
      },
    ],
    forWho: [
      "Vous copiez-collez des informations manuellement toute la journée.",
      "L'outil reste enfermé dans une page web isolée.",
      "Vos logiciels internes (CRM, ERP) ne communiquent pas avec les nouveaux modèles.",
    ],
    deliverables: [
      "Compréhension des connexions API : ce qu'un modèle peut lire, appeler, modifier ou préparer.",
      "Introduction MCP et connecteurs : Claude, Gemini, Notion, Google Maps, Légifrance ou sources internes.",
      "Diagnostic agentique léger : ce qui relève d'une formation, d'un connecteur, d'une automatisation ou d'un futur agent.",
    ],
    steps: [],
    proof: "",
    price: "à partir de 250 € / session",
    priceNote: "Finançable OPCO",
    metaDescription:
      "Sessions techniques pour créer des MCPs et connecter vos logiciels métier aux modèles IA.",
  },
  audit: {
    level: "N4",
    slug: "audit",
    eyebrow: "N4 · Cartographie des Process",
    h1: "Du diagnostic à la décision : cartographiez vos process.",
    sub: "Le point de départ reste l'audit : on pose votre niveau de maturité par équipe, puis on transforme cette lecture en carte concrète de vos flux. Vous savez ce qui est possible avec l'IA, ce qui doit rester humain et quel process traiter en premier.",
    phrase: "Je veux passer du diagnostic à la décision",
    ctaLabel: "Demander l'Audit de Transformation",
    ctaHref: CONTACT_MAIL,
    stories: [
      {
        title: "Audit stratégique pour lancer une transformation IA",
        person: "COMEX, DSI, direction transformation",
        before:
          "Les départements n'étaient pas au même niveau : certains découvraient l'IA, d'autres testaient déjà des outils, d'autres parlaient agents.",
        after:
          "L'audit cartographie les process, le niveau réel des équipes, les données, les risques et les solutions à déployer aux bonnes personnes.",
        result: "La discussion change : on ne finance plus des idées isolées, on arbitre un plan de transformation.",
      },
      {
        title: "Bilan par équipe avant déploiement",
        person: "Grand compte multi-départements",
        before:
          "Chaque métier remontait des cas d'usage différents. Impossible de savoir quoi former, quoi automatiser, quoi intégrer et quoi refuser.",
        after:
          "Chaque équipe reçoit un bilan lisible : maturité, process prioritaires, risques, besoins de formation et trajectoire vers le déploiement.",
        result: "La DSI peut concilier audit stratégique, contraintes métiers et feuille de route agentique.",
      },
    ],
    forWho: [
      "Vous avez des usages IA dispersés, mais pas encore de trajectoire de transformation.",
      "Vous souhaitez un diagnostic pour savoir ce qu'il est possible de faire avec l'IA dans votre contexte.",
      "Vous devez protéger la donnée, la validation humaine ou la gouvernance avant de construire.",
    ],
    deliverables: [
      "Diagnostic de maturité par équipe : niveau réel, blocages visibles, besoins de formation et premiers cas crédibles.",
      "Cartographie des process : entrées, données, exceptions, validations humaines, risques et indicateurs à suivre.",
      "Plan de match chiffré : quoi former, quoi automatiser, quoi connecter, quoi déployer et dans quel ordre.",
    ],
    steps: [
      { title: "Diagnostic de départ", body: "On part de votre contexte, de vos outils et d'un flux réel, pas d'un catalogue de cas d'usage." },
      { title: "Cartographie des process", body: "On décrit ce qui entre, ce qui sort, qui valide, quelles données circulent et où le risque apparaît." },
      { title: "Décision partageable", body: "Vous repartez avec une synthèse claire : niveau de maturité, premier process, risques et prochaine décision." },
    ],
    proof: "",
    price: "à partir de 3 500 €",
    metaDescription:
      "Diagnostic IA et cartographie des processus pour identifier votre maturité, le premier flux à traiter et la ressource à préparer avant rendez-vous.",
  },
  "deploiement-agents": {
    level: "N5",
    slug: "deploiement-agents",
    eyebrow: "N5 · Déploiement d'Agents",
    h1: "C'est le moment où un agent intervient semaine après semaine.",
    sub: "Un flux revient tout le temps. On le met sous contrôle : agent, automatisation ou RPA selon le besoin. La machine prépare, trace et escalade ; l'humain garde les décisions sensibles.",
    phrase: "Je veux un agent en production",
    ctaLabel: "Définir mon flux cible",
    ctaHref: CONTACT_MAIL,
    stories: [
      {
        title: "Operating system Clevery",
        person: "Cabinet d'avocats",
        before:
          "Boîtes mail, calendrier, demandes clients et production documentaire vivaient dans des gestes séparés et très manuels.",
        after:
          "Un operating system prépare la gestion des boîtes mail, du calendrier, des documents et des contrats sur mesure, avec validation humaine.",
        result: "Le cabinet garde le contrôle juridique ; l'agent prend le back-office répétitif et laisse une trace.",
        logo: { src: "/brand/client-logos/logo-5.png", alt: "Clevery" },
      },
      {
        title: "Outil en production Laparra",
        person: "Couche logicielle propriétaire",
        before:
          "Le métier avait besoin d'une couche logicielle propre, pas d'un simple assistant conversationnel posé à côté des outils.",
        after:
          "Un outil propriétaire orchestre les données, les actions et les validations sur un flux maîtrisé.",
        result: "On passe d'un agent isolé à une brique d'operating system qui tient dans le quotidien de l'équipe.",
        logo: { src: "/brand/client-logos/logo-2.png", alt: "Laparra" },
      },
      {
        title: "Back-office e-commerce Mr Couteau",
        person: "E-commerce",
        before:
          "Les signaux, demandes et relances se perdaient entre boutique, messages, tableurs et décisions manuelles.",
        after:
          "Les automatisations traitent ce qui est prédictible ; les agents préparent les cas plus riches et remontent les exceptions.",
        result: "Le bon niveau de complexité est choisi : parfois une automatisation suffit, parfois il faut une couche agentique.",
      },
    ],
    forWho: [
      "La saisie manuelle étouffe la productivité de vos équipes.",
      "Des erreurs humaines bloquent des dossiers critiques.",
      "Le recrutement pour des tâches répétitives devient impossible.",
    ],
    deliverables: [
      "Flux cible mis sous contrôle : entrées, règles, exceptions, validations humaines et journaux d'action.",
      "Déploiement adapté : agent IA, automatisation classique ou RPA quand cela suffit amplement.",
      "Sécurité et conformité : données, accès, traces, supervision, garde-fous et trajectoire AI Act compliant.",
      "Boucles de feedback : remontée des erreurs, amélioration continue, mesure de qualité et arbitrages d'extension.",
    ],
    steps: [
      { title: "Flux cible", body: "On choisit un flux qui revient souvent et qui peut être contrôlé sans toucher à tout le système." },
      { title: "Mise sous contrôle", body: "On définit les entrées, les actions autorisées, les exceptions, la validation humaine, la trace et les règles de sécurité." },
      { title: "Production supervisée", body: "L'agent ou l'automatisation intervient sur le répétitif. L'équipe relit les cas sensibles et décide quoi étendre ensuite." },
    ],
    proof: "",
    price: "à partir de 3 000 €",
    priceNote: "Selon périmètre, connexions et niveau de supervision",
    metaDescription:
      "Déploiement d'un ou plusieurs agents IA opérationnels avec démonstration du ROI.",
  },
  "outils-agentiques": {
    level: "N6",
    slug: "outils-agentiques",
    eyebrow: "N6 · Outils agentiques",
    h1: "N'importe qui peut shipper. Donnez à vos équipes le pouvoir de construire.",
    sub: "Fondateurs, product managers, équipes métier : on vous aide à construire vos outils agentiques internes avec la bonne stack : open source, propriétaire, cloud ou on-premise.",
    phrase: "Je veux maîtriser les outils agentiques",
    ctaLabel: "Construire mon outil interne",
    ctaHref: CONTACT_MAIL,
    stories: [
      {
        title: "Rufus Amazon pour Lavazza et Carte Noire",
        person: "GEO e-commerce",
        before:
          "Les équipes avaient besoin de comprendre comment leurs marques ressortent dans les réponses type Rufus/Alexa for Shopping, sans attendre un outil marché.",
        after:
          "Un outil interne suit les signaux, structure les analyses et aide à piloter les actions GEO sur les plateformes d'achat.",
        result: "Le sujet devient un produit interne : observable, itérable, actionnable par les équipes.",
        logo: { src: "/brand/client-logos/logo-1.png", alt: "Lavazza" },
      },
      {
        title: "Estimateur d'objets d'art",
        person: "Outil agentique interne",
        before:
          "Le métier savait ce qu'il fallait estimer, comparer et documenter, mais pas comment transformer l'expertise en outil utilisable.",
        after:
          "Un prototype interne combine saisie structurée, raisonnement assisté, sources et restitution exploitable.",
        result: "L'équipe passe d'une intuition métier à une feature testable.",
      },
      {
        title: "Veille signaux faibles et reporting agentique",
        person: "Produit interne",
        before:
          "Les signaux étaient repérés trop tard, puis recopiés à la main dans des notes, tableaux ou reportings.",
        after:
          "Une boucle agentique collecte, trie, synthétise, reporte et s'améliore en continu, sur stack ouverte ou propriétaire.",
        result: "Les product managers et métiers commencent à shipper leurs propres outils, avec un cadre de validation.",
      },
    ],
    forWho: [
      "Vos fondateurs ou dirigeants veulent prototyper sans attendre un cycle produit classique.",
      "Vos product managers doivent livrer des features, pas seulement écrire des specs.",
      "Vos équipes métier ont la vision de l'outil interne, mais pas encore la méthode pour le shipper.",
    ],
    deliverables: [
      "Construction d'outils agentiques internes : cadrage, prototype, tests, données, interface et trajectoire produit.",
      "Méthode de shipping : transformer une idée métier en feature, puis en outil utilisable.",
      "Transfert outils agentiques : stack open source ou propriétaire, consignes, specs, tests, documentation, revue et passation.",
      "Déploiement adapté à vos contraintes : SaaS, cloud privé, VPC ou on-premise quand la donnée l'exige.",
    ],
    steps: [
      { title: "Choix de l'outil", body: "On part d'un besoin interne concret : estimation, veille, reporting, recherche, interface métier ou automatisation produit." },
      { title: "Build accompagné", body: "On construit avec vos équipes, en gardant les réflexes produit : données, cas limites, validation, sécurité et usage réel." },
      { title: "Passation", body: "Vos équipes repartent avec l'outil, la méthode et les réflexes pour continuer à shipper." },
    ],
    proof: "",
    price: "à partir de 3 497 €",
    priceNote: "Selon périmètre et niveau d'accompagnement",
    metaDescription:
      "Accompagnement aux outils agentiques avancés pour auditer votre configuration et former vos équipes à l'autonomie.",
  },
  "optimisation-flotte": {
    level: "N7",
    slug: "optimisation-flotte",
    eyebrow: "N7 · Optimisation de Flotte",
    h1: "Vos agents plantent et coûtent cher. Reprenez le contrôle.",
    sub: "Votre flotte grossit. On traite la dette technique, les coûts tokens, les modèles, les boucles d'auto-amélioration et le harnais de supervision.",
    phrase: "J'ai une flotte, je veux l'optimiser",
    ctaLabel: "Auditer ma flotte",
    ctaHref: CONTACT_MAIL,
    stories: [
      {
        title: "Notre flotte interne d'agents",
        person: "Hermès, n8n, Codex, Claude Code, Vertex, LangChain",
        before:
          "Des agents utiles mais nombreux : orchestration nocturne, veille, rédaction, supervision, reporting, avec coûts tokens et choix de modèles à maîtriser.",
        after:
          "Des managers-agents pilotent les boucles, le harnais s'améliore, les modèles sont choisis selon coût, latence, confidentialité et qualité.",
        result: "La flotte devient opérable : moins de dette, meilleure observabilité, meilleurs arbitrages open source/propriétaire.",
      },
      {
        title: "Boucles d'auto-amélioration et dette technique",
        person: "Architecture agentique",
        before:
          "Les agents produisent, mais les erreurs silencieuses, les consignes dispersés et les coûts rendent l'ensemble difficile à améliorer.",
        after:
          "On traite la dette technique, on renforce les tests, on optimise les tokens et on met en place des feedback loops actionnables.",
        result: "La flotte apprend mieux, coûte moins cher et devient plus simple à maintenir.",
      },
    ],
    forWho: [
      "Vos factures d'API explosent sans justification liée aux revenus.",
      "Les codes écrits à la va-vite ont créé une dette technique paralysante.",
      "Des erreurs silencieuses bloquent vos processus en production.",
    ],
    deliverables: [
      "Diagnostic de flotte : agents, orchestrateurs, consignes, coûts tokens, latence, taux d'erreur, traces et dépendances.",
      "Traitement de la dette technique : harnais de tests, logs, règles de fallback, observabilité et responsabilités.",
      "Optimisation modèles : arbitrage open source / propriétaire, routage, coûts, sécurité, confidentialité et qualité.",
      "Boucles d'auto-amélioration : managers-agents, feedback loops, évaluation continue et gouvernance d'architecture.",
    ],
    steps: [
      { title: "Inventaire", body: "On cartographie agents, workflows n8n, scripts, consignes, modèles, coûts, logs et dépendances." },
      { title: "Harnais", body: "On renforce tests, supervision, règles de fallback, gestion des tokens et évaluation de qualité." },
      { title: "Optimisation", body: "On améliore la flotte : dette technique, routage modèles, open source/propriétaire, boucles et managers-agents." },
    ],
    proof: "",
    price: "à partir de 8 000 €",
    priceNote: "Selon taille de la flotte",
    metaDescription:
      "Optimisation de flotte d'agents IA, réduction de dette technique et architecture auto-améliorante.",
  },
};

export const maturiteSlugs = Object.keys(maturiteOffers) as MaturiteSlug[];
