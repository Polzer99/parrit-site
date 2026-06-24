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
    h1: "Arrêtez de subir le bruit médiatique. Comprenez enfin la mécanique.",
    sub: "Vous entendez parler d'intelligence artificielle partout. On pose les bases pour distinguer le vrai du faux.",
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
      "Vous êtes noyé sous les concepts théoriques.",
      "Vous craignez pour la sécurité de vos données internes.",
      "Vous refusez de valider des budgets sans comprendre la technologie.",
    ],
    deliverables: [
      "Masterclass Généraliste : Trois heures pour cartographier les outils du marché et démystifier la technique.",
      "Atelier de Sensibilisation : Une session interactive pour éveiller vos dirigeants aux véritables enjeux de demain.",
      "Format Sur-Mesure : On adapte le discours à votre secteur d'activité.",
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
    h1: "L'outil génère du texte. Faites-le travailler sur votre métier.",
    sub: "Vos collaborateurs utilisent des requêtes basiques. On adapte la machine à vos vrais processus quotidiens.",
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
      "Vos licences dorment ou sous-performent.",
      "Les gains de temps réels sont invisibles sur la rentabilité.",
      "Les usages se limitent à corriger des fautes dans des emails.",
    ],
    deliverables: [
      "Masterclass Métier : On cible un département (RH, Ventes) pour créer des requêtes ultra-spécifiques.",
      "Atelier Cas d'Usage : On identifie ensemble les tâches chronophages de vos équipes pour les automatiser.",
      "Accompagnement Sur-Mesure : Création d'instructions standards pour homogénéiser le travail de vos collaborateurs.",
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
    h1: "L'intelligence artificielle est aveugle. Branchez-la sur vos outils.",
    sub: "Vous maîtrisez les concepts de base. On connecte la machine à vos logiciels pour qu'elle déclenche des actions réelles.",
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
      "Vous copiez-collez des informations manuellement toute la journée.",
      "L'outil reste enfermé dans une page web isolée.",
      "Vos logiciels internes (CRM, ERP) ne communiquent pas avec les nouveaux modèles.",
    ],
    deliverables: [
      "Sessions MCP : Création de connecteurs pour lier vos bases de données aux modèles.",
      "Atelier d'Intégration : Configuration des accès sécurisés pour faire agir la machine.",
      "Intervention Sur-Mesure : On construit les ponts techniques spécifiques à votre architecture.",
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
    eyebrow: "N4 · Audit & Cartographie",
    h1: "Ne financez pas au hasard. Ciblez vos goulots d'étranglement financiers.",
    sub: "Vous voulez passer à l'échelle. On audite vos processus pour chiffrer les gains avant de développer.",
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
      "Vous manquez de chiffres concrets pour valider un investissement technique.",
      "Vous ignorez par quelle tâche chronophage commencer.",
      "Vous craignez de financer une usine à gaz inutile.",
    ],
    deliverables: [
      "Diagnostic Opérationnel : Cartographie complète de vos processus back-office avec plan de rentabilité.",
      "Audit Flash : Analyse rapide d'un département précis pour identifier les urgences.",
      "Cadrage Sur-Mesure : Définition de votre feuille de route technique sur six mois.",
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
    h1: "Vos processus fuient. Confiez-les à un agent autonome.",
    sub: "Une tâche vous prend dix heures par semaine. Parrit déploie un système qui l'exécute en continu.",
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
      "La saisie manuelle étouffe la productivité de vos équipes.",
      "Des erreurs humaines bloquent des dossiers critiques.",
      "Le recrutement pour des tâches répétitives devient impossible.",
    ],
    deliverables: [
      "Forfait de Déploiement Continu : Création et itération de plusieurs agents suite au diagnostic de vos opérations.",
      "Sprint Borné (One-shot) : Un agent spécifique mis en production en 14 jours, pour régler un problème précis sans engagement à long terme.",
      "Déploiement Sur-Mesure : Architecture connectée de plusieurs agents pour traiter une chaîne de valeur de bout en bout.",
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
    h1: "L'indépendance s'achète. Construisez vos machines en interne, même sans coder.",
    sub: "Vos équipes tech et métier veulent créer des flux complexes. On transfère la compétence ou on débloque vos impasses techniques.",
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
      "Vous dépendez de prestataires externes pour la moindre ligne de code.",
      "Vos collaborateurs non-tech ont la vision métier mais bloquent sur l'exécution.",
      "Vos équipes autonomes butent sur un mur technique et perdent du temps.",
    ],
    deliverables: [
      "Transfert de Compétences : Formation de vos équipes (techniques ou métiers) pour devenir autonomes sur la création de workflows.",
      "Intervention One-Shot : Un déblocage technique express avec Claude Code pour craquer une impasse sur une architecture existante.",
      "Co-construction : Création de votre premier outil propriétaire en binôme avec Parrit pour asseoir les bonnes pratiques.",
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
    h1: "Vos agents plantent et coûtent cher. Reprenez le contrôle.",
    sub: "Votre flotte grossit. On traite votre dette technique et on refond l'architecture pour garantir la fiabilité.",
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
      "Vos factures d'API explosent sans justification liée aux revenus.",
      "Les codes écrits à la va-vite ont créé une dette technique paralysante.",
      "Des erreurs silencieuses bloquent vos processus en production.",
    ],
    deliverables: [
      "Diagnostic de Flotte : Analyse de la latence, des coûts et du taux d'erreur de vos systèmes actuels.",
      "Refonte d'Architecture : Nettoyage de la dette technique et centralisation pour une infrastructure robuste.",
      "Fractional AI Operator : On prend la responsabilité de vos opérations en continu pour assurer la conformité et la disponibilité.",
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
