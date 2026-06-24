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
  }[];
  forWho: string[];
  deliverables: string[];
  steps: { title: string; body: string }[];
  proof: string;
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
    h1: "Comprendre ce que fait vraiment l'IA — en 3 heures.",
    sub: "Pour les dirigeants et managers qui veulent piloter sans coder. Aucun prérequis technique.",
    phrase: "Je découvre l'IA générative",
    ctaLabel: "Réserver la masterclass",
    ctaHref: CONTACT_MAIL,
    stories: [
      {
        title: "Le comité qui ne savait pas par où commencer",
        person: "Direction commerciale, distribution B2B",
        before:
          "L'IA était un sujet de veille. Les équipes avaient testé des outils, mais personne ne savait distinguer gadget, gain réel et risque métier.",
        after:
          "En 3 heures, le comité repart avec un vocabulaire commun, 4 cas d'usage réalistes et une première feuille de route compréhensible par les métiers.",
        result: "La discussion passe de « faut-il y aller ? » à « quel process traite-t-on d'abord ? ».",
      },
    ],
    forWho: [
      "Vous entendez parler d'agents IA partout mais vous ne savez pas ce que ça couvre dans votre secteur.",
      "Vos équipes ont accès à des outils IA mais personne ne sait comment les intégrer dans un vrai process.",
      "Vous êtes décideur et vous ne voulez pas déléguer une décision stratégique à quelqu'un que vous ne pouvez pas challenger.",
    ],
    deliverables: [
      "Session de 3h en visioconférence",
      "Cartographie des besoins et cas d'usage réels dans votre métier",
      "Glossaire opérationnel — sans jargon technique",
      "Scénarios d'application définis ensemble",
      "Deck de présentation complet livré sous 48h",
    ],
    steps: [
      { title: "J0", body: "questionnaire de cadrage (15 min)" },
      { title: "J+2 à J+5", body: "session masterclass (3h, visio)" },
      { title: "J+6", body: "deck livré + scénarios d'application" },
    ],
    proof:
      "Un directeur commercial dans la distribution (120 personnes) n'avait jamais ouvert un outil IA. Après 3h, il a identifié 4 process à automatiser et rédigé lui-même le brief pour son équipe technique.",
    price: "à partir de 1 598 €",
    priceNote: "Finançable OPCO",
    metaDescription:
      "Masterclass généraliste de 3 heures pour cartographier les besoins, établir un glossaire opérationnel et définir des scénarios d'application.",
  },
  "masterclass-metier": {
    level: "N2",
    slug: "masterclass-metier",
    eyebrow: "N2 · Masterclass Métier",
    h1: "L'IA appliquée à votre métier — pas aux autres.",
    sub: "Une demi-journée pour produire des configurations opérationnelles directement utilisables dans votre secteur.",
    phrase: "Je veux l'appliquer à mon secteur",
    ctaLabel: "Réserver la session",
    ctaHref: CONTACT_MAIL,
    stories: [
      {
        title: "Le cabinet qui voulait des usages vraiment métier",
        person: "Associé, cabinet de conseil",
        before:
          "Les consultants utilisaient l'IA chacun dans leur coin. Les résultats dépendaient des habitudes individuelles, sans méthode ni réutilisation.",
        after:
          "La session transforme leurs cas réels en configurations métier partageables : analyse de marché, préparation d'entretien, synthèse client.",
        result: "Deux usages deviennent des routines d'équipe, sans ajouter d'outil à la stack.",
      },
    ],
    forWho: [
      "Vous avez fait une première exploration IA mais aucun cas d'usage ne s'est concrétisé dans votre quotidien.",
      "Vous revenez d'une démonstration qui vous a convaincu mais vous ne savez pas comment l'adapter à votre contexte.",
      "Vous voulez pouvoir piloter et briefer vos équipes sur l'IA sans dépendre d'un prestataire.",
    ],
    deliverables: [
      "Demi-journée (4h) centrée sur votre secteur et vos outils",
      "Exercices pratiques sur vos cas d'usage réels",
      "Instructions personnalisées opérationnelles, utilisables immédiatement",
      "Méthodologie pour en créer d'autres en autonomie",
    ],
    steps: [
      { title: "J0", body: "audit rapide outils + cas d'usage (formulaire, 20 min)" },
      { title: "J+3", body: "session de travail pratique (4h, visio ou présentiel)" },
      { title: "J+4", body: "instructions personnalisées livrées" },
    ],
    proof:
      "Un cabinet de conseil en stratégie (12 consultants) ne savait pas par où commencer. La session a produit des configurations opérationnelles pour 5 cas d'usage. Deux sont en production 3 mois plus tard, sans prestataire.",
    price: "à partir de 2 345 €",
    priceNote: "Finançable OPCO",
    metaDescription:
      "Masterclass métier avec exercices pratiques et instructions personnalisées adaptées au métier du client.",
  },
  "sessions-mcp": {
    level: "N3",
    slug: "sessions-mcp",
    eyebrow: "N3 · Sessions Création & MCP",
    h1: "Vos logiciels, connectés à l'IA — sans reconstruire votre stack.",
    sub: "On crée les ponts entre vos outils métier et les modèles IA. Votre CRM, votre ERP, votre base documentaire parlent enfin à Claude.",
    phrase: "Je veux connecter mes logiciels à l'IA",
    ctaLabel: "Réserver les sessions",
    ctaHref: CONTACT_MAIL,
    stories: [
      {
        title: "Le CRM propriétaire enfin relié aux modèles IA",
        person: "Courtier assurance, équipe commerciale",
        before:
          "Les données clients étaient dans un CRM isolé. Les agents répondaient bien, mais ne voyaient jamais les vraies fiches, contrats ou relances.",
        after:
          "Les sessions créent les ponts techniques nécessaires. Claude accède aux données utiles, avec une méthode de test et de passation documentée.",
        result: "Les équipes interrogent leurs données en langage naturel, sans reconstruire le CRM.",
      },
    ],
    forWho: [
      "Vous avez des logiciels métier (CRM, ERP, outils internes) qui ne parlent pas encore à l'IA.",
      "Vous voulez que vos agents accèdent à vos données réelles — pas à des données simulées.",
      "Vous avez un cas d'usage précis qui nécessite une intégration technique propre.",
    ],
    deliverables: [
      "MCPs fonctionnels connectant vos logiciels à Claude ou ChatGPT",
      "Cas d'usage précis documentés et testés",
      "Méthodologie pour créer de nouveaux MCPs en autonomie",
      "Documentation technique de passation",
    ],
    steps: [
      { title: "Session 1", body: "cartographie des intégrations à créer + priorisation" },
      { title: "Sessions 2–N", body: "création des MCPs (selon périmètre)" },
      { title: "Dernière session", body: "tests en conditions réelles + passation" },
    ],
    proof:
      "Un courtier en assurance avait un CRM propriétaire déconnecté de tout. Deux MCPs créés en 3 sessions : son CRM parle maintenant à Claude. Les agents accèdent aux fiches clients en temps réel.",
    price: "à partir de 250 € / session",
    metaDescription:
      "Sessions techniques pour créer des MCPs et connecter vos logiciels métier aux modèles IA.",
  },
  audit: {
    level: "N4",
    slug: "audit",
    eyebrow: "N4 · Audit de Transformation",
    h1: "On cartographie ce qui vous coûte — et ce qui peut changer vite.",
    sub: "L'audit qui précède tout déploiement sérieux. Résultat : vos process critiques cartographiés et vos quick wins identifiés.",
    phrase: "Je veux cartographier mes process",
    ctaLabel: "Demander l'audit",
    ctaHref: CONTACT_MAIL,
    stories: [
      {
        title: "Le budget IA recadré avant de dépenser trop vite",
        person: "Dirigeant, courtage énergie B2B",
        before:
          "L'équipe pensait automatiser la prospection sortante. Le problème visible était bruyant, mais pas forcément le plus rentable.",
        after:
          "L'audit révèle que le vrai levier est la qualification des leads entrants, puis chiffre le gain et les risques de déploiement.",
        result: "La priorité change : moins de dispersion, un premier déploiement avec impact mesurable.",
      },
    ],
    forWho: [
      "Vous voulez un regard externe avant d'investir dans quoi que ce soit.",
      "Vous avez essayé des outils IA sans résultat durable et vous voulez comprendre pourquoi.",
      "Vous êtes en train de cadrer un budget IA et vous avez besoin de chiffres réels.",
    ],
    deliverables: [
      "Cartographie complète de vos processus métier",
      "Identification des quick wins (actions à fort impact, effort minimal)",
      "Recommandations de déploiement priorisées",
      "Session de restitution (45 min)",
    ],
    steps: [
      { title: "J0", body: "formulaire de cadrage + accès outils (30 min)" },
      { title: "J+2 à J+4", body: "analyse par Parrit" },
      { title: "J+5", body: "restitution + recommandations" },
    ],
    proof:
      "Un courtier en énergie B2B voulait automatiser sa prospection. L'audit a révélé que le vrai levier était la qualification des leads entrants. Le déploiement qui a suivi a réduit le temps de qualification de 80 %.",
    price: "à partir de 3 567 €",
    metaDescription:
      "Audit de transformation IA pour cartographier vos processus métier et identifier les quick wins.",
  },
  "deploiement-agents": {
    level: "N5",
    slug: "deploiement-agents",
    eyebrow: "N5 · Déploiement d'Agents",
    h1: "Un agent opérationnel dans votre stack — en 14 jours.",
    sub: "On prend un process qui vous coûte du temps ou du business. On construit l'agent. Il tourne chez vous avant la fin du mois, avec un ROI démontré.",
    phrase: "Je veux un agent en production",
    ctaLabel: "En parler 15 min",
    ctaHref: CONTACT_MAIL,
    stories: [
      {
        title: "Les leads entrants traités au bon moment",
        person: "Cabinet d'avocats, équipe relation client",
        before:
          "Les demandes arrivaient par email, puis attendaient qu'une personne disponible les lise, les qualifie et prépare la réponse.",
        after:
          "Un agent qualifie en temps réel, prépare la réponse et signale les dossiers prioritaires. L'équipe garde la main sur la validation.",
        result: "Zéro lead oublié, 3 heures récupérées chaque semaine, et un délai de réponse plus fiable.",
      },
    ],
    forWho: [
      "Vous perdez plusieurs heures par semaine sur une tâche répétitive (relances, rapports, qualification, saisie).",
      "Votre pipeline commercial fuit entre les étapes et personne n'a le temps de le surveiller.",
      "Votre équipe fait manuellement quelque chose qui devrait être automatique.",
    ],
    deliverables: [
      "1 à N agents IA déployés dans vos outils (CRM, Gmail, Notion, votre stack)",
      "Démonstration du ROI dès la mise en production",
      "Documentation de passation complète",
      "Session de formation (2h) — utilisation et évolution",
      "30 jours de support post-livraison",
    ],
    steps: [
      { title: "J1", body: "diagnostic (2h) — on choisit le process à attaquer" },
      { title: "J2–J12", body: "construction + itérations avec votre équipe" },
      { title: "J13–J14", body: "déploiement en production + passation" },
    ],
    proof:
      "Un cabinet d'avocats qualifiait ses leads entrants à la main — 3h/semaine perdues. L'agent traite la qualification en temps réel. Résultat : 0 lead manqué, 3h/semaine récupérées dès J15.",
    price: "à partir de 2 998 €",
    priceNote: "Finançable OPCO",
    metaDescription:
      "Déploiement d'un ou plusieurs agents IA opérationnels avec démonstration du ROI.",
  },
  "outils-agentiques": {
    level: "N6",
    slug: "outils-agentiques",
    eyebrow: "N6 · Outil propriétaire agentique",
    h1: "Construire vos propres agents — avec les outils des meilleurs développeurs IA.",
    sub: "Pour les équipes techniques qui veulent maîtriser Claude Code et Codex. On vous forme et on audite votre configuration pour que vous soyez autonomes sur le déploiement.",
    phrase: "Je veux maîtriser Claude Code et Codex",
    ctaLabel: "En parler 15 min",
    ctaHref: CONTACT_MAIL,
    stories: [
      {
        title: "L'équipe produit qui voulait construire sans dépendre",
        person: "Équipe produit, SaaS B2B",
        before:
          "Chaque développeur avait sa manière d'utiliser l'IA. Les gains existaient, mais les pratiques restaient fragiles et difficiles à transmettre.",
        after:
          "L'équipe structure Claude Code, Codex et ses workflows récurrents. Les référents savent cadrer, tester et maintenir leurs propres agents.",
        result: "Trois workflows internes sont construits pendant la formation, puis repris par l'équipe.",
      },
    ],
    forWho: [
      "Vous avez des développeurs en interne qui veulent monter en compétence sur les outils agentiques avancés.",
      "Vous voulez construire et maintenir vos propres workflows sans dépendre d'un prestataire.",
      "Vous utilisez déjà Claude ou ChatGPT mais vous ne savez pas comment structurer des workflows récurrents fiables.",
    ],
    deliverables: [
      "Audit de votre configuration actuelle (outils, stack, pratiques)",
      "Formation à l'utilisation de Claude Code et Codex",
      "Construction ensemble de vos premiers workflows récurrents",
      "Méthodologie et bonnes pratiques pour continuer en autonomie",
    ],
    steps: [
      { title: "Session 1", body: "audit configuration + identification des workflows cibles" },
      { title: "Sessions 2–N", body: "formation pratique + construction des workflows" },
      { title: "Dernière session", body: "validation autonomie + remise de la documentation" },
    ],
    proof:
      "Une équipe produit de 5 développeurs utilisait l'IA de façon disparate. En 4 sessions, ils ont unifié leurs pratiques sur Claude Code, construit 3 workflows récurrents et sont maintenant autonomes sur le déploiement.",
    price: "Sur devis",
    metaDescription:
      "Accompagnement aux outils agentiques avancés pour auditer votre configuration et former vos équipes à l'autonomie.",
  },
  "optimisation-flotte": {
    level: "N7",
    slug: "optimisation-flotte",
    eyebrow: "N7 · Optimisation de Flotte",
    h1: "Vos agents tournent. On leur donne une architecture pour évoluer seuls.",
    sub: "Pour les équipes qui opèrent déjà une flotte d'agents et veulent éliminer la dette technique, centraliser sur une base de données unique et créer des boucles d'auto-amélioration.",
    phrase: "J'ai une flotte, je veux l'optimiser",
    ctaLabel: "Demander le diagnostic flotte",
    ctaHref: CONTACT_MAIL,
    stories: [
      {
        title: "La flotte qui devait devenir pilotable",
        person: "Scale-up SaaS, opérations et data",
        before:
          "Six agents avaient été construits vite. Les coûts montaient, les erreurs étaient difficiles à tracer et les données restaient éparpillées.",
        after:
          "La flotte est centralisée, les déclenchements sont clarifiés et les boucles de feedback remontent les erreurs pour amélioration continue.",
        result: "Le taux d'erreur baisse, les coûts deviennent lisibles et l'équipe sait où agir.",
      },
    ],
    forWho: [
      "Vous gérez plusieurs agents sans base de données centralisée — les données sont éparpillées et incohérentes.",
      "Votre dette technique s'accumule : agents dupliqués, triggers non fiables, coût incontrôlé.",
      "Vous voulez des agents qui s'améliorent d'eux-mêmes via des boucles de feedback automatisées.",
    ],
    deliverables: [
      "Architecture de données scalable (SQL/NoSQL selon les besoins)",
      "Centralisation de la flotte sur une base unique",
      "Systèmes de triggers/cron pour l'automatisation des déclenchements",
      "Boucles auto-améliorantes (feedback automatique sur les résultats)",
      "Documentation technique exhaustive et passation équipe",
    ],
    steps: [
      { title: "Semaine 1", body: "audit flotte + architecture actuelle + identification de la dette" },
      { title: "Semaine 2", body: "restitution + plan d'action technique validé" },
      { title: "Semaines 3+", body: "remédiation et construction (forfait ou régie selon périmètre)" },
    ],
    proof:
      "Une scale-up SaaS avait 6 agents construits en 8 mois. Taux d'erreur de 18 %, coût incontrôlé, aucune centralisation. Après audit et remédiation : taux d'erreur à 2 %, coût divisé par 3, architecture centralisée avec boucles auto-améliorantes opérationnelles.",
    price: "Sur devis",
    priceNote: "Selon taille de la flotte",
    metaDescription:
      "Optimisation de flotte d'agents IA, réduction de dette technique et architecture auto-améliorante.",
  },
};

export const maturiteSlugs = Object.keys(maturiteOffers) as MaturiteSlug[];
