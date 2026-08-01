/**
 * PRODUCT-LIVING-HERO-PROOF-V1 — les six moments de la preuve du hero.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * CE FICHIER NE CRÉE AUCUNE COPY COMMERCIALE.
 *
 * Le texte éditorial du hero vient MOT POUR MOT de `../content.ts`, comme
 * dans Concept D. Les libellés d'état viennent de `../concept-d/system.ts`.
 * Les valeurs métier viennent du scénario de la scène V2. Rien n'est réécrit.
 *
 * Ce fichier ne fait qu'une chose : choisir QUELS fragments de ce matériau
 * existant tiennent dans une boucle de dix secondes, et dans quel ordre.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Ce qui est délibérément ABSENT, parce que le hero n'est pas la démonstration
 * longue : les dix états, les quatre versions, les identifiants internes, les
 * références de politique, les codes de module, les contrôles de lecture, la
 * liste des agents et la liste des sources.
 */

import { AGENTS, GATE } from "../product-living-scene/scenario";
import {
  CALENDAR,
  DISTRIBUTION,
  EMAIL,
  INTERNAL,
} from "../product-living-scene-v2/renderer";
import { ETAT, SPECIMEN } from "../concept-d/system";

/** Un agent du scénario V2, retrouvé par son rôle. La source reste le moteur. */
const agent = (id: string) => AGENTS.find((a) => a.id === id)!;

export type MomentId =
  | "signal"
  | "comprehension"
  | "travail"
  | "arret"
  | "decision"
  | "action";

/**
 * Durées. Total 9 300 ms, plus une respiration : la boucle tient dans la
 * fenêtre de 8 à 12 secondes du cadrage.
 */
export const MOMENTS: readonly { id: MomentId; duree: number }[] = [
  { id: "signal", duree: 1300 },
  { id: "comprehension", duree: 1400 },
  { id: "travail", duree: 2300 },
  { id: "arret", duree: 1600 },
  { id: "decision", duree: 900 },
  { id: "action", duree: 1800 },
];

/** Respiration avant la répétition. La boucle ne redémarre pas d'un coup sec. */
export const RESPIRATION = 1100;

export const TOTAL = MOMENTS.reduce((s, m) => s + m.duree, 0);
export const CYCLE = TOTAL + RESPIRATION;

/** Bornes absolues, dans l'ordre. Sert aussi aux tests. */
export const BORNES = MOMENTS.reduce<{ id: MomentId; debut: number; fin: number }[]>(
  (acc, m) => {
    const debut = acc.length ? acc[acc.length - 1].fin : 0;
    return [...acc, { id: m.id, debut, fin: debut + m.duree }];
  },
  [],
);

/* ========================================================================
   CONTENU DES SIX MOMENTS

   Tout vient du matériau existant. Aucun vocabulaire technique : pas
   d'agent, pas d'orchestration, pas de politique, pas de version.
   ======================================================================== */

/** 01 — quelque chose vient de se produire. */
export const SIGNAL = {
  tag: "Demande entrante",
  objet: EMAIL.objet,
} as const;

/** 02 — le système comprend de quoi il s'agit. */
export const COMPREHENSION = {
  titre: "Dossier d'opportunité",
  entreprise: agent("company").valeur,
  personne: agent("relation").valeur,
} as const;

/**
 * 03 — le travail coordonné, montré par ses EFFETS et non par ses auteurs.
 * Trois lignes, décalées, jamais une liste d'agents.
 */
export const EFFETS: readonly {
  cle: string;
  ligne: string;
  decalage: number;
  /** Un effet peut être un manque : c'est lui qui provoquera l'arrêt. */
  manque?: boolean;
}[] = [
  { cle: "Vérifié", ligne: agent("usecase").valeur, decalage: 0 },
  { cle: "Manquant", ligne: agent("context").bloque!, decalage: 700, manque: true },
  { cle: "Préparé", ligne: agent("next").valeur, decalage: 1400 },
];

/** 04 — l'arrêt. Le libellé d'état existe déjà dans Concept D. */
export const ARRET = {
  etat: ETAT.validation,
  raison: INTERNAL.consequence,
} as const;

/** 05 — la décision, portée par un humain nommé. */
export const DECISION = {
  proprietaire: GATE.proprietaire,
  acte: "Validé",
  /* Photographie documentaire réelle, recadrage seul. Aucun visage généré. */
  photo: "/brand/editorial/portraits/paul-gate.jpg",
} as const;

/** 06 — la conséquence, dans les destinations réellement concernées. */
export const SORTIES = [
  { destination: "Message", ligne: DISTRIBUTION.valider.email!.titre },
  { destination: "Agenda", ligne: `${DISTRIBUTION.valider.calendar!.titre} · ${CALENDAR.retenu}` },
  { destination: "Dossier", ligne: DISTRIBUTION.valider.crm!.titre },
] as const;

/** Mentions de laboratoire. Reprises telles quelles de Concept D. */
export const MENTIONS = {
  specimen: SPECIMEN.interface,
  demo: "Voir la démonstration complète",
  demoHref: "/art-direction-lab/product-living-scene-v2",
} as const;
