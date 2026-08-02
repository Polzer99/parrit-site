/**
 * PRODUCT-LIVING-HERO-CLARITY-POLISH-V1 — les cinq chapitres visibles.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * AUCUNE COPY COMMERCIALE N'EST ÉCRITE ICI.
 *
 * Le texte du hero — eyebrow, titre, promesse, appels à l'action — vient
 * MOT POUR MOT de `../content.ts`. Il n'est pas touché.
 *
 * Ce fichier ne porte que les MICROTEXTES INTERNES de la démonstration. Ils
 * sont volontairement écrits en langage non technique : c'est la consigne de
 * la passe de clarté, et c'est ce qui décide si un dirigeant comprend ou non.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Budget tenu, et vérifié par le harnais :
 *   titre         2 à 5 mots
 *   explication   12 mots maximum
 *   métadonnées   2 maximum
 *   surface détaillée   1 seule
 *
 * Ce qui reste dans la démonstration longue : identifiants, règles, codes,
 * versions, niveaux de confiance, horodatages, politiques, provenance.
 */

import { AGENTS } from "../product-living-scene/scenario";
import { CALENDAR, EMAIL } from "../product-living-scene-v2/renderer";
import { SPECIMEN } from "../concept-d/system";

const agent = (id: string) => AGENTS.find((a) => a.id === id)!;

/**
 * Le focus visuel dominant. Un seul à la fois : c'est le contrat que le
 * renderer applique pour renforcer un élément et atténuer tout le reste.
 */
export type Focus =
  | "signal"
  | "verification"
  | "missing_information"
  | "human_decision"
  | "output";

export type ChapitreId = "signal" | "verification" | "manque" | "decision" | "sortie";

/**
 * Cinq chapitres, douze secondes et demie. La boucle précédente tenait en
 * 9,3 s : trop rapide pour quelqu'un qui découvre. Chaque chapitre laisse
 * maintenant le temps de lire son titre PUIS son information.
 */
export const CHAPITRES: readonly {
  id: ChapitreId;
  focus: Focus;
  duree: number;
  /** 2 à 5 mots. */
  titre: string;
  /** 12 mots maximum. */
  info: string;
}[] = [
  {
    id: "signal",
    focus: "signal",
    duree: 2000,
    titre: "Demande reçue",
    info: EMAIL.objet,
  },
  {
    id: "verification",
    focus: "verification",
    duree: 2500,
    titre: "Informations vérifiées",
    info: "Deux sources consultées, sans intervention.",
  },
  {
    id: "manque",
    focus: "missing_information",
    duree: 2000,
    titre: "Contexte manquant",
    info: "Impossible de savoir si cette personne a déjà été contactée.",
  },
  {
    id: "decision",
    focus: "human_decision",
    duree: 2300,
    titre: "Validation humaine",
    info: "Le système s'arrête et attend votre décision.",
  },
  {
    id: "sortie",
    focus: "output",
    duree: 2300,
    titre: "Action préparée",
    info: "Rien n'a été envoyé sans vous.",
  },
];

/** Respiration avant la répétition. La boucle ne redémarre pas d'un coup sec. */
export const RESPIRATION = 1400;

export const TOTAL = CHAPITRES.reduce((s, c) => s + c.duree, 0);
export const CYCLE = TOTAL + RESPIRATION;

export const BORNES = CHAPITRES.reduce<{ id: ChapitreId; debut: number; fin: number }[]>(
  (acc, c) => {
    const debut = acc.length ? acc[acc.length - 1].fin : 0;
    return [...acc, { id: c.id, debut, fin: debut + c.duree }];
  },
  [],
);

/**
 * Sixième moment technique, invisible comme chapitre : à l'intérieur de la
 * validation, l'instant où la décision est effectivement prise. Le visiteur
 * perçoit cinq chapitres, la machine en compte six.
 */
export const INSTANT_DECISION = 0.6;

/* ========================================================================
   CONTENU
   ======================================================================== */

/** L'objet de travail, présent du chapitre 1 au chapitre 5. Deux lignes. */
export const OBJET = {
  titre: "Dossier d'opportunité",
  personne: agent("relation").valeur,
} as const;

/** Deux vérifications, pas une de plus. */
export const VERIFICATIONS = [
  { quoi: "Entreprise", valeur: agent("company").valeur },
  { quoi: "Besoin", valeur: agent("usecase").valeur },
] as const;

/** Ce qui manque, en une ligne. */
export const MANQUE = {
  quoi: "Historique de la relation",
  valeur: "Aucun échange antérieur retrouvé",
} as const;

/** L'action proposée, et la marque humaine qui la valide. */
export const DECISION = {
  action: agent("next").valeur,
  acte: "Validé par un humain",
  /* Photographie documentaire réelle, recadrage seul. Aucun visage généré. */
  photo: "/brand/editorial/portraits/paul-gate.jpg",
} as const;

/** Trois destinations, pas une de plus. */
export const SORTIES = [
  { destination: "Message", ligne: "Préparé, prêt à partir" },
  { destination: "Dossier", ligne: "Mis à jour" },
  { destination: "Agenda", ligne: `Créneau proposé · ${CALENDAR.retenu}` },
] as const;

export const MENTIONS = {
  specimen: SPECIMEN.interface,
  demo: "Voir la démonstration complète",
  demoHref: "/art-direction-lab/product-living-scene-v2",
} as const;
