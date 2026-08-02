/**
 * PRODUCT-LIVING-SYSTEM-SCENE-V2 — données de PRÉSENTATION du renderer.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * CE FICHIER NE CONTIENT AUCUNE LOGIQUE MÉTIER.
 *
 * Le scénario, les états, les branches, les versions et la timeline restent
 * dans `../product-living-scene/scenario.ts` et `../product-living-scene/useScene.ts`.
 * Le moteur V1 est consommé tel quel, il n'est ni dupliqué ni réécrit.
 *
 * Ici vivent uniquement : la forme de l'objet central, l'intérieur des six
 * surfaces logicielles, la géométrie de la scène, la prévisualisation des
 * conséquences et l'occurrence suivante. Ce sont des choix de représentation.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * DONNÉES DE DÉMONSTRATION. Aucune donnée personnelle réelle, aucun client,
 * aucun chiffre de résultat.
 */

import type { BrancheId, ChampId, SurfaceId } from "../product-living-scene/scenario";

/* ========================================================================
   OBJET CENTRAL — une architecture modulaire, pas un document.

   Huit modules occupent une grille irrégulière de 3 colonnes sur 4 rangées.
   L'irrégularité est volontaire : alignés parfaitement, les modules
   redeviendraient les lignes d'une fiche.
   ======================================================================== */

export type ModuleId =
  | "identite"
  | "relation"
  | "signal"
  | "contexte"
  | "hypothese"
  | "risque"
  | "action"
  | "decision";

export type ModuleDef = {
  id: ModuleId;
  /** Code technique, en mono. C'est ainsi qu'un module s'identifie. */
  code: string;
  label: string;
  /** Champ du moteur dont ce module est la représentation. */
  champ: ChampId;
  /** Emplacement dans la grille du noyau : colonne, rangée, étendues. */
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
  /** Modules dont celui-ci dépend. Tracé en filets courts dans le noyau. */
  depend: ModuleId[];
};

export const MODULES: readonly ModuleDef[] = [
  { id: "signal", code: "SGN", label: "Signal", champ: "signal", col: 1, row: 1, colSpan: 2, rowSpan: 1, depend: [] },
  { id: "identite", code: "IDN", label: "Identité", champ: "entreprise", col: 3, row: 1, colSpan: 1, rowSpan: 1, depend: [] },
  { id: "relation", code: "REL", label: "Relation", champ: "personne", col: 1, row: 2, colSpan: 1, rowSpan: 1, depend: ["identite"] },
  { id: "contexte", code: "CTX", label: "Contexte", champ: "contexte", col: 2, row: 2, colSpan: 2, rowSpan: 1, depend: ["relation"] },
  { id: "hypothese", code: "HYP", label: "Hypothèse", champ: "hypothese", col: 1, row: 3, colSpan: 1, rowSpan: 1, depend: ["signal"] },
  { id: "risque", code: "RSK", label: "Risque", champ: "confiance", col: 2, row: 3, colSpan: 1, rowSpan: 1, depend: ["contexte", "hypothese"] },
  { id: "action", code: "ACT", label: "Action", champ: "action", col: 3, row: 3, colSpan: 1, rowSpan: 2, depend: ["risque"] },
  { id: "decision", code: "DEC", label: "Décision", champ: "decision", col: 1, row: 4, colSpan: 2, rowSpan: 1, depend: ["risque"] },
];

/** Le champ du moteur permet de retrouver le module qu'un agent alimente. */
export const MODULE_PAR_CHAMP = MODULES.reduce<Partial<Record<ChampId, ModuleId>>>(
  (acc, m) => ({ ...acc, [m.champ]: m.id }),
  {},
);

/**
 * La contradiction que le gate doit trancher : le contexte est indisponible
 * alors qu'une action est déjà proposée. Ce n'est pas une décoration, c'est
 * exactement ce que le système ne peut pas résoudre seul.
 */
export const CONTRADICTION: readonly [ModuleId, ModuleId] = ["contexte", "action"];

/* ========================================================================
   GÉOMÉTRIE — en pourcentage du plateau.

   Fixe, donc les faisceaux se calculent sans mesurer le DOM : ni reflow,
   ni décalage au chargement, ni dépendance à l'ordre de peinture.
   ======================================================================== */

/** Boîte du noyau dans le plateau. */
export const NOYAU = { left: 33, top: 20, width: 36, height: 56 } as const;

/** Ancre d'un module, déduite de sa case dans la grille du noyau. */
export function ancreModule(m: ModuleDef) {
  const colW = NOYAU.width / 3;
  const rowH = NOYAU.height / 4;
  return {
    x: NOYAU.left + (m.col - 1 + m.colSpan / 2) * colW,
    y: NOYAU.top + (m.row - 1 + m.rowSpan / 2) * rowH,
  };
}

/** Position des six surfaces. Les colonnes latérales encadrent le noyau. */
export const SURFACE_BOX: Record<SurfaceId, { x: number; y: number; cote: "gauche" | "droite" }> = {
  email: { x: 2.5, y: 3, cote: "gauche" },
  crm: { x: 2.5, y: 37, cote: "gauche" },
  web: { x: 2.5, y: 70, cote: "gauche" },
  knowledge: { x: 2.5, y: 3, cote: "droite" },
  internal: { x: 2.5, y: 40, cote: "droite" },
  calendar: { x: 2.5, y: 70, cote: "droite" },
};

/** Ancre d'une surface, point de départ des faisceaux. */
export const ANCRE_SURFACE: Record<SurfaceId, { x: number; y: number }> = {
  email: { x: 16, y: 14 },
  crm: { x: 16, y: 48 },
  web: { x: 16, y: 80 },
  knowledge: { x: 85, y: 15 },
  internal: { x: 85, y: 51 },
  calendar: { x: 85, y: 81 },
};

/* ========================================================================
   INTÉRIEUR DES SURFACES

   Chaque surface a une fonction visuelle distincte : un message, une
   relation, une vérification, une politique, un blocage, un calendrier.
   Aucune ne reproduit un produit tiers, aucune ne porte de logo.
   ======================================================================== */

export const EMAIL = {
  provenance: "Canal partagé · demande entrante",
  objet: "Nous perdons du temps entre deux outils",
  extrait: "Nos équipes ressaisissent les mêmes dossiers deux fois par semaine, et il faudrait que ce soit réglé avant septembre.",
  /** Fragments que l'agent Signal surligne réellement dans l'extrait. */
  fragments: ["ressaisissent les mêmes dossiers", "deux fois par semaine", "avant septembre"],
  intention: "Demande de cadrage",
} as const;

export const CRM = {
  statut: "Contact connu, fiche incomplète",
  historique: [
    { quand: "il y a 14 mois", quoi: "Premier échange", etat: "clos" },
    { quand: "il y a 11 mois", quoi: "Relance sans suite", etat: "clos" },
    { quand: "à l'instant", quoi: "Signal entrant", etat: "ouvert" },
  ],
  actions: "Aucune action ouverte",
} as const;

export const WEB = {
  entreprise: "Cabinet de conseil",
  taille: "40 personnes",
  verifie: [
    { quoi: "Publication publique datée", ok: true },
    { quoi: "Périmètre d'activité", ok: true },
    { quoi: "Organisation interne", ok: false },
  ],
  source: "Page publique · consultée à l'instant",
} as const;

/**
 * La politique interne. C'est ICI que vit la règle : le retour humain n'écrit
 * pas un paragraphe « après », il modifie un segment de politique versionné.
 */
export const POLITIQUE = {
  reference: "POL-04",
  titre: "Proposition d'action",
  /** Les règles qui encadrent la décision. Une seule sera modifiée. */
  regles: [
    { code: "R-011", texte: "Ne jamais engager de dépense sans validation humaine.", modifiable: false },
    { code: "R-014", texte: null, modifiable: true }, // texte fourni par le moteur
    { code: "R-021", texte: "Signaler toute source indisponible dans la trace.", modifiable: false },
  ],
  comparables: "3 cas comparables",
} as const;

/** La règle que le retour humain modifie. Son texte vient du moteur. */
export const REGLE_MODIFIEE = "R-014";

export const INTERNAL = {
  acces: "Refusé",
  permission: "Lecture de l'historique relationnel",
  raison: "Périmètre non accordé au système",
  consequence: "Le système ne peut pas savoir si cette personne a déjà été contactée.",
} as const;

export const CALENDAR = {
  contrainte: "45 min · sous 8 jours",
  /** Bande de créneaux. Deux sont réellement libres. */
  creneaux: [
    { quand: "lun 14:00", libre: false },
    { quand: "mar 09:30", libre: true },
    { quand: "mar 16:00", libre: false },
    { quand: "jeu 11:00", libre: true },
    { quand: "ven 08:30", libre: false },
  ],
  retenu: "mar 09:30",
} as const;

/* ========================================================================
   DÉCISION — chaque option montre ce qu'elle provoque AVANT le clic.

   Quatre options, quatre formes différentes. Ce ne sont pas quatre boutons
   génériques : l'une propose un choix de formulation, l'autre nomme la
   surface qui sera consultée.
   ======================================================================== */

export type Consequence = {
  /** Ce qui se produit, en une ligne. */
  effet: string;
  /** Ce que ça coûte ou laisse ouvert. La conséquence n'est pas que positive. */
  risque: string;
  /** Version du dossier après la décision. Doit correspondre au moteur. */
  version: string;
  /** Surface qui sera consultée, s'il y en a une. */
  surface?: SurfaceId;
  /** Choix précis à faire dans l'option elle-même. */
  choix?: readonly string[];
};

export const CONSEQUENCES: Record<BrancheId, Consequence> = {
  valider: {
    effet: "Le message part et le créneau est réservé.",
    risque: "La source manquante reste signalée dans la trace.",
    version: "v3",
  },
  corriger: {
    effet: "Même action, formulation reprise par vous.",
    risque: "Votre reformulation devient une préférence conservée.",
    version: "v3",
    choix: [
      "Reprendre en signalant que le contexte manque",
      "Reprendre sans mentionner le contexte",
    ],
  },
  rejeter: {
    effet: "Rien ne part, le dossier reste ouvert.",
    risque: "L'opportunité n'est pas travaillée aujourd'hui.",
    version: "v2",
  },
  contexte: {
    effet: "Le système demande l'historique avant de reprendre.",
    risque: "L'action est repoussée le temps de la réponse.",
    version: "v2",
    surface: "internal",
  },
};

/* ========================================================================
   SORTIE DISTRIBUÉE — la sortie n'est pas une carte « SORTIE ».

   Elle se dépose dans les logiciels concernés. Trois surfaces changent
   réellement, et pas les mêmes selon la branche.
   ======================================================================== */

export type Distribution = Partial<Record<SurfaceId, { titre: string; detail: string; engage: boolean }>>;

export const DISTRIBUTION: Record<BrancheId, Distribution> = {
  valider: {
    email: { titre: "Message prêt à partir", detail: "Proposition de créneau incluse", engage: true },
    calendar: { titre: "Créneau réservé", detail: CALENDAR.retenu, engage: true },
    crm: { titre: "Fiche mise à jour", detail: "Échéance posée, source manquante signalée", engage: true },
  },
  corriger: {
    email: { titre: "Message réécrit", detail: "Formulation validée par vous", engage: true },
    calendar: { titre: "Créneau réservé", detail: CALENDAR.retenu, engage: true },
    crm: { titre: "Fiche mise à jour", detail: "Préférence de formulation conservée", engage: true },
  },
  rejeter: {
    email: { titre: "Aucun message envoyé", detail: "Le brouillon est abandonné", engage: false },
    calendar: { titre: "Aucun créneau posé", detail: "Les disponibilités sont relâchées", engage: false },
    crm: { titre: "Motif consigné", detail: "Le dossier reste ouvert", engage: false },
  },
  contexte: {
    email: { titre: "Demande d'historique envoyée", detail: "Adressée à l'équipe qui détient l'accès", engage: true },
    calendar: { titre: "Aucun créneau posé", detail: "En attente du contexte", engage: false },
    crm: { titre: "Dossier suspendu", detail: "Reprise dès que l'historique arrive", engage: false },
  },
};

/* ========================================================================
   OCCURRENCE SUIVANTE — la règle corrigée s'applique, et ça se voit.

   Copy d'illustration : un second signal, de même forme, traité avec la
   politique modifiée. Rien n'est appris automatiquement.
   ======================================================================== */

export const OCCURRENCE: Record<BrancheId, { quand: string; effet: string }> = {
  valider: {
    quand: "Signal suivant, même forme",
    effet: "L'action est proposée d'emblée, avec la source manquante signalée.",
  },
  corriger: {
    quand: "Signal suivant, même forme",
    effet: "La formulation que vous avez validée est reprise sans repasser par vous.",
  },
  rejeter: {
    quand: "Signal suivant, même forme",
    effet: "Aucune action n'est proposée tant qu'aucun échange antérieur n'est retrouvé.",
  },
  contexte: {
    quand: "Signal suivant, même forme",
    effet: "Le contexte relationnel est demandé avant toute proposition.",
  },
};

/* ========================================================================
   MOBILE — sept chapitres plein écran.
   ======================================================================== */

export type ChapitreId =
  | "signal"
  | "contexte"
  | "parallele"
  | "enrichi"
  | "decision"
  | "commit"
  | "amelioration";

export const CHAPITRES: readonly {
  id: ChapitreId;
  num: number;
  titre: string;
  /** La surface principale du chapitre. Une seule par écran. */
  surface: SurfaceId | null;
  /** Le module transformé pendant ce chapitre. */
  focus: ModuleId | null;
}[] = [
  { id: "signal", num: 1, titre: "Un signal entre", surface: "email", focus: "signal" },
  { id: "contexte", num: 2, titre: "Le contexte manque", surface: "internal", focus: "contexte" },
  { id: "parallele", num: 3, titre: "Le travail se répartit", surface: "web", focus: "identite" },
  { id: "enrichi", num: 4, titre: "Le dossier se compose", surface: "knowledge", focus: "hypothese" },
  { id: "decision", num: 5, titre: "Vous tranchez", surface: "internal", focus: "action" },
  { id: "commit", num: 6, titre: "Le système engage", surface: "calendar", focus: "decision" },
  { id: "amelioration", num: 7, titre: "La règle change", surface: "knowledge", focus: null },
];

/* ========================================================================
   LIBELLÉS
   ======================================================================== */

export const UI2 = {
  produit: "Parrit",
  objet: "Dossier d'opportunité",
  /** Photographie documentaire, réelle. Recadrage seul, aucun visage généré. */
  photoGate: "/brand/editorial/portraits/paul-gate.jpg",
  controles: { replay: "Rejouer", pause: "Pause", reprendre: "Reprendre", step: "Pas à pas" },
  commit: "Engagé",
  gateTag: "Le système est arrêté",
  distribution: "Ce qui vient de changer",
  politique: "Politique interne",
  occurrence: "Prochaine occurrence",
  conclusion:
    "Le système travaille seul jusqu'à l'endroit exact où il ne doit plus décider seul.",
} as const;
