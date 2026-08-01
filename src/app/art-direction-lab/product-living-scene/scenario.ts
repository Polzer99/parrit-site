/**
 * PRODUCT-LIVING-SYSTEM-SCENE-V1 — scénario de démonstration.
 *
 * TOUTE la logique du scénario vit ici. Les composants ne décident de rien :
 * ils rendent l'état que la machine dérive de ce fichier.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * DONNÉES DE DÉMONSTRATION. Aucune donnée personnelle réelle, aucun client,
 * aucun chiffre de résultat. L'entreprise et la personne sont fictives et
 * l'interface l'affiche en clair : SPECIMEN PRODUIT · DONNÉES DE DÉMONSTRATION.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const DEMO_LABEL = {
  produit: "Specimen produit",
  donnees: "Données de démonstration",
} as const;

/** États successifs du dossier d'opportunité. L'ordre fait foi. */
export const ETATS = [
  "Reçu",
  "Contexte manquant",
  "En cours d'analyse",
  "Enrichi",
  "Action proposée",
  "Validation requise",
  "Validé",
  "Action préparée",
  "Retour enregistré",
  "Règle améliorée",
] as const;
export type Etat = (typeof ETATS)[number];

/** Les phases de la timeline. Les durées sont celles du cadrage. */
export type PhaseId =
  | "attente"
  | "signal"
  | "orchestration"
  | "convergence"
  | "gate"
  | "reprise"
  | "boucle";

export const PHASES: readonly {
  id: PhaseId;
  label: string;
  /** Durée en ms. `null` = la phase attend une décision humaine. */
  duree: number | null;
}[] = [
  { id: "attente", label: "Veille", duree: 600 },
  { id: "signal", label: "Signal entrant", duree: 900 },
  { id: "orchestration", label: "Travail parallèle", duree: 2500 },
  { id: "convergence", label: "Convergence", duree: 1500 },
  { id: "gate", label: "Décision humaine", duree: null },
  { id: "reprise", label: "Sortie", duree: 2000 },
  { id: "boucle", label: "Amélioration", duree: 1200 },
];

/** Surfaces logicielles. Abstraites : aucun écran de produit tiers reproduit. */
export type SurfaceId = "email" | "crm" | "calendar" | "knowledge" | "web" | "internal";

export const SURFACES: readonly {
  id: SurfaceId;
  label: string;
  /** Ce que la surface apporte, en langage de travail. */
  apporte: string;
  /** Ce que le système en fait. Un rôle, pas une décoration. */
  role: "lue" | "vérifiée" | "comparée" | "mise à jour" | "ignorée" | "bloquée";
}[] = [
  { id: "email", label: "Email", apporte: "Le message entrant et son fil", role: "lue" },
  { id: "crm", label: "CRM", apporte: "Une fiche existante, incomplète", role: "comparée" },
  { id: "web", label: "Web", apporte: "Une publication publique datée", role: "vérifiée" },
  { id: "knowledge", label: "Knowledge", apporte: "Vos règles métier écrites", role: "lue" },
  { id: "internal", label: "Internal data", apporte: "L'historique de la relation", role: "bloquée" },
  { id: "calendar", label: "Calendar", apporte: "Vos créneaux réellement libres", role: "mise à jour" },
];

/** Champs du dossier. Ils se composent en couches, pas en formulaire. */
export type ChampId =
  | "entreprise"
  | "personne"
  | "signal"
  | "contexte"
  | "hypothese"
  | "sources"
  | "confiance"
  | "action"
  | "decision"
  | "sortie"
  | "retour";

export const CHAMPS: Record<ChampId, { label: string; couche: 1 | 2 | 3 }> = {
  entreprise: { label: "Entreprise", couche: 1 },
  personne: { label: "Personne concernée", couche: 1 },
  signal: { label: "Signal initial", couche: 1 },
  contexte: { label: "Contexte", couche: 2 },
  hypothese: { label: "Hypothèse", couche: 2 },
  sources: { label: "Sources", couche: 2 },
  confiance: { label: "Niveau de confiance", couche: 2 },
  action: { label: "Action proposée", couche: 3 },
  decision: { label: "Décision humaine", couche: 3 },
  sortie: { label: "Sortie", couche: 3 },
  retour: { label: "Retour", couche: 3 },
};

/**
 * Agents. Chacun DOIT produire une modification observable du dossier :
 * `produit` n'est jamais vide. Aucun agent décoratif.
 */
export type Agent = {
  id: string;
  /** Rôle, en capitales, court. Pas un prénom, pas un personnage. */
  role: string;
  /** Surface consultée. La ligne d'exécution part de là. */
  surface: SurfaceId;
  /** Champ du dossier que cet agent renseigne. */
  produit: ChampId;
  /** Valeur déposée dans le dossier. */
  valeur: string;
  /** Décalage de départ dans la phase d'orchestration, en ms. */
  debut: number;
  /** Durée de l'intervention, en ms. */
  duree: number;
  /** Ce que l'agent fait, montré au survol. */
  geste: string;
  /** Un agent peut échouer : c'est ce qui crée le besoin d'un humain. */
  bloque?: string;
};

export const AGENTS: readonly Agent[] = [
  {
    id: "signal",
    role: "Signal",
    surface: "email",
    produit: "signal",
    valeur: "Demande entrante, canal partagé",
    debut: 0,
    duree: 700,
    geste: "Lit le message et isole ce qui est demandé",
  },
  {
    id: "company",
    role: "Company",
    surface: "web",
    produit: "entreprise",
    valeur: "Cabinet de conseil, 40 personnes",
    debut: 150,
    duree: 800,
    geste: "Vérifie l'entreprise sur une source publique datée",
  },
  {
    id: "relation",
    role: "Relation",
    surface: "crm",
    produit: "personne",
    valeur: "Directrice des opérations",
    debut: 350,
    duree: 750,
    geste: "Rapproche la personne d'une fiche existante",
  },
  {
    id: "context",
    role: "Context",
    surface: "internal",
    produit: "contexte",
    valeur: "Historique relationnel indisponible",
    debut: 600,
    duree: 900,
    geste: "Cherche l'historique de la relation",
    // C'est ce blocage qui rend la décision humaine nécessaire.
    bloque: "Aucun échange antérieur retrouvé",
  },
  {
    id: "usecase",
    role: "Use case",
    surface: "knowledge",
    produit: "hypothese",
    valeur: "Ressaisie de dossiers entre deux outils",
    debut: 900,
    duree: 800,
    geste: "Confronte la demande à vos règles métier écrites",
  },
  {
    id: "risk",
    role: "Risk",
    surface: "knowledge",
    produit: "confiance",
    valeur: "Partielle, une source manque",
    debut: 1300,
    duree: 700,
    geste: "Évalue ce qui manque avant de proposer quoi que ce soit",
  },
  {
    id: "next",
    role: "Next action",
    surface: "calendar",
    produit: "action",
    valeur: "Proposer un créneau de cadrage de 45 min",
    debut: 1750,
    duree: 750,
    geste: "Prépare une action concrète et vérifie vos disponibilités",
  },
];

/** Les sources réellement consultées, dans l'ordre où elles le sont. */
export const SOURCES_ORDRE: readonly SurfaceId[] = AGENTS.map((a) => a.surface).filter(
  (s, i, all) => all.indexOf(s) === i,
);

/** Le dossier au départ. Presque vide : tout le reste est produit à l'écran. */
export const DOSSIER_INITIAL = {
  reference: "OPP-2041",
  ouvert: "à l'instant",
} as const;

/**
 * Décision humaine. Le système s'arrête ici, réellement : aucune suite n'est
 * jouée tant qu'aucune branche n'est choisie.
 */
export const GATE = {
  question: "Une source manque. Faut-il proposer cette action maintenant ?",
  pourquoi:
    "L'historique relationnel est indisponible. Le système ne sait pas si cette personne a déjà été contactée.",
  proprietaire: "Direction commerciale",
  options: [
    { id: "valider", label: "Valider", tonalite: "primaire" },
    { id: "corriger", label: "Corriger", tonalite: "neutre" },
    { id: "rejeter", label: "Rejeter", tonalite: "neutre" },
    { id: "contexte", label: "Demander plus de contexte", tonalite: "neutre" },
  ],
} as const;
export type BrancheId = (typeof GATE.options)[number]["id"];

/**
 * Conséquences. Chaque branche produit un état, une sortie, une confiance et
 * une règle différents. Deux branches ne peuvent pas donner le même résultat.
 */
export const BRANCHES: Record<
  BrancheId,
  {
    etat: Etat;
    confiance: string;
    sortie: string;
    sortieDetail: string;
    retour: string;
    regleAvant: string;
    regleApres: string;
    version: number;
  }
> = {
  valider: {
    etat: "Action préparée",
    confiance: "Assumée par un humain",
    sortie: "Message rédigé, créneau réservé",
    sortieDetail:
      "Le message part avec la proposition de créneau. La fiche est mise à jour et l'échéance posée.",
    retour: "Validée sans correction",
    regleAvant: "Les signaux faibles ne suffisent pas à proposer une relance.",
    regleApres:
      "Lorsque le signal est faible mais la demande explicite, proposer l'action et signaler la source manquante.",
    version: 3,
  },
  corriger: {
    etat: "Action préparée",
    confiance: "Corrigée à la main",
    sortie: "Message réécrit avant envoi",
    sortieDetail:
      "L'action reste la même, sa formulation est reprise. La correction est conservée comme préférence.",
    retour: "Corrigée par un humain",
    regleAvant: "Les signaux faibles ne suffisent pas à proposer une relance.",
    regleApres:
      "Reprendre la formulation validée par la direction commerciale pour ce type de demande.",
    version: 3,
  },
  rejeter: {
    etat: "Retour enregistré",
    confiance: "Insuffisante, action abandonnée",
    sortie: "Aucune action envoyée",
    sortieDetail:
      "Rien ne part. Le dossier reste ouvert, la raison du refus est consignée dans la trace.",
    retour: "Rejetée, motif consigné",
    regleAvant: "Les signaux faibles ne suffisent pas à proposer une relance.",
    regleApres:
      "Ne pas proposer d'action tant qu'aucun échange antérieur n'a été retrouvé.",
    version: 2,
  },
  contexte: {
    etat: "Contexte manquant",
    confiance: "En attente d'une source",
    sortie: "Demande de contexte adressée à l'équipe",
    sortieDetail:
      "Le système suspend l'action et demande l'historique manquant avant de reprendre.",
    retour: "Contexte demandé",
    regleAvant: "Les signaux faibles ne suffisent pas à proposer une relance.",
    regleApres:
      "Lorsque le signal est faible, demander le contexte relationnel avant de proposer une action.",
    version: 2,
  },
};

/** Libellés d'interface. Séparés du scénario pour rester relisibles. */
export const UI = {
  titre: "Un signal entre. Le système travaille. Vous tranchez.",
  objet: "Dossier d'opportunité",
  controles: { replay: "Replay", pause: "Pause", reprendre: "Reprendre", step: "Step" },
  legende: {
    titre: "Ce que vous regardez",
    lignes: [
      "Chaque ligne rouge est une intervention réelle sur le dossier.",
      "Une source barrée n'a rien pu apporter.",
      "La version du dossier ne change que si une transformation a eu lieu.",
      "Le système s'arrête avant toute action engageante.",
    ],
  },
  regle: { avant: "Règle avant", apres: "Après retour humain" },
} as const;
