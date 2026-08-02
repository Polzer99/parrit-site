/**
 * MOTEUR D'INTÉRÊT — le profil, dérivé, jamais saisi.
 *
 * Ce fichier ne contient QUE des fonctions pures. Pas de réseau, pas d'horloge
 * implicite, pas de LLM. Deux fois le même historique donne deux fois le même
 * profil — c'est ce qui rend la décision auditable, rejouable, et testable sans
 * base de données.
 *
 * L'AXE D'INTÉRÊT EST LE PILIER. Les articles en portent un, les ressources
 * aussi. « Ce qui intéresse quelqu'un » se calcule donc à partir de ce qu'il a
 * lu et pris, au lieu de se demander dans un formulaire.
 *
 * LE CANAL N'EST PAS L'INTÉRÊT. LinkedIn, podcast, vidéo, recherche : ça dit
 * comment on lui parle et à qui attribuer la visite. Ça ne dit pas quoi lui
 * envoyer. Confondre les deux est l'erreur classique, et elle produit des
 * séquences hors sujet.
 */

import type { PillarSlug } from "../pillars";

/* ------------------------------------------------------------------ signaux */

/**
 * Les natures de signal, de la plus explicite à la plus passive.
 *
 * Le poids traduit une intention, pas une fréquence : demander une ressource
 * est un acte, voir une page ne l'est pas. Une centaine de vues ne vaut pas une
 * demande.
 */
export type NatureSignal =
  | "ressource_demandee"
  | "retour_repete"
  | "cta_offre"
  | "diagnostic_demande"
  | "lecture_profonde"
  | "vue_page";

export const POIDS: Record<NatureSignal, number> = {
  ressource_demandee: 100,
  retour_repete: 60,
  diagnostic_demande: 55,
  cta_offre: 50,
  lecture_profonde: 15,
  vue_page: 3,
};

/** Vrai pour un acte délibéré. Départage les égalités. */
export function estExplicite(nature: NatureSignal): boolean {
  return (
    nature === "ressource_demandee" ||
    nature === "cta_offre" ||
    nature === "diagnostic_demande" ||
    nature === "retour_repete"
  );
}

export type Signal = {
  nature: NatureSignal;
  pilier: PillarSlug;
  /** ISO 8601. Fourni par l'appelant : le calcul n'appelle jamais l'horloge. */
  date: string;
  /** La ressource concernée, quand le signal en désigne une. */
  ressourceSlug?: string;
  /** L'article d'origine, quand il y en a un. */
  articleSlug?: string;
  canal?: string;
  campagne?: string;
};

/* ------------------------------------------------------------------ profil */

export type NiveauEngagement = "froid" | "tiede" | "chaud";
export type EtatNurturing = "nurture_automatique" | "intention_forte" | "handoff_humain";

export type ProfilInteret = {
  dominant_pillar: PillarSlug | null;
  pillar_scores: Record<string, number>;
  /** 0 à 1. Écart entre le pilier dominant et le suivant, rapporté au total. */
  confidence: number;
  resources_consumed: string[];
  last_signal: string | null;
  engagement_level: NiveauEngagement;
  nurture_state: EtatNurturing;
  next_resource_slug: string | null;
  next_action: string;
  next_action_reason: string;
  human_handoff_required: boolean;
};

/** Les faits qui forcent un état, indépendamment des scores. */
export type FaitsHumains = {
  /** La personne a répondu à un message. */
  aRepondu?: boolean;
  /** Un rendez-vous est pris. */
  aReserve?: boolean;
  /** Demande explicite d'être contactée. */
  aDemandeContact?: boolean;
  /** Décision manuelle de Paul, ou qualification commerciale. */
  repriseManuelle?: boolean;
};

/**
 * Le seuil de confiance en dessous duquel on ne recommande rien.
 *
 * Il n'est pas là pour être joli : le silence vaut mieux qu'une ressource hors
 * sujet, parce qu'un envoi à côté coûte la crédibilité que tout le reste sert à
 * construire.
 */
export const CONFIANCE_MINIMALE = 0.15;

/** Additionne les poids par pilier. Aucune décroissance temporelle : voir §note. */
export function scoresParPilier(signaux: readonly Signal[]): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const s of signaux) {
    scores[s.pilier] = (scores[s.pilier] ?? 0) + POIDS[s.nature];
  }
  return scores;
}

/**
 * Départage deux piliers à égalité de score, dans l'ordre imposé :
 * le signal explicite d'abord, puis le plus récent. Si rien ne départage,
 * on retourne `null` — et l'appelant se taira.
 */
function departager(signaux: readonly Signal[], candidats: string[]): PillarSlug | null {
  const meilleurPour = (pilier: string) => {
    const siens = signaux.filter((s) => s.pilier === pilier);
    const explicites = siens.filter((s) => estExplicite(s.nature));
    const retenus = explicites.length > 0 ? explicites : siens;
    const plusRecent = retenus.reduce<Signal | null>(
      (acc, s) => (acc === null || s.date > acc.date ? s : acc),
      null,
    );
    return { aExplicite: explicites.length > 0, date: plusRecent?.date ?? "" };
  };

  const evalues = candidats.map((p) => ({ pilier: p, ...meilleurPour(p) }));

  const avecExplicite = evalues.filter((e) => e.aExplicite);
  const pool = avecExplicite.length > 0 ? avecExplicite : evalues;

  const trie = [...pool].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  if (trie.length > 1 && trie[0].date === trie[1].date) return null;
  return (trie[0]?.pilier as PillarSlug) ?? null;
}

/**
 * La confiance : l'écart entre le premier pilier et le second, rapporté au
 * total. Un seul pilier observé donne 1. Deux piliers à égalité donnent 0.
 */
export function confiance(scores: Record<string, number>): number {
  const valeurs = Object.values(scores).sort((a, b) => b - a);
  const total = valeurs.reduce((s, v) => s + v, 0);
  if (total === 0) return 0;
  if (valeurs.length === 1) return 1;
  return (valeurs[0] - valeurs[1]) / total;
}

export function niveauEngagement(signaux: readonly Signal[]): NiveauEngagement {
  const explicites = signaux.filter((s) => estExplicite(s.nature)).length;
  if (explicites >= 2) return "chaud";
  if (explicites === 1) return "tiede";
  return "froid";
}

/**
 * L'état de nurturing. Les faits humains l'emportent toujours sur les scores :
 * quelqu'un qui a répondu n'est plus dans une séquence, quelle que soit sa
 * navigation.
 */
export function etatNurturing(
  signaux: readonly Signal[],
  faits: FaitsHumains = {},
): EtatNurturing {
  if (faits.aRepondu || faits.aReserve || faits.aDemandeContact || faits.repriseManuelle) {
    return "handoff_humain";
  }

  const explicites = signaux.filter((s) => estExplicite(s.nature));
  const ressources = new Set(
    signaux.filter((s) => s.nature === "ressource_demandee").map((s) => s.ressourceSlug),
  );

  const deuxRessources = ressources.size >= 2;
  const retourRepete = signaux.some((s) => s.nature === "retour_repete");
  const offreApresRessource =
    ressources.size >= 1 &&
    signaux.some((s) => s.nature === "cta_offre" || s.nature === "diagnostic_demande");
  const plusieursSurUnPilier =
    explicites.length >= 2 &&
    new Set(explicites.map((s) => s.pilier)).size === 1;

  if (deuxRessources || retourRepete || offreApresRessource || plusieursSurUnPilier) {
    return "intention_forte";
  }
  return "nurture_automatique";
}

/**
 * Le profil complet, sans la prochaine ressource : c'est le sélecteur qui la
 * décide, à partir de ce profil et du registre. La séparation est volontaire —
 * on peut tester le profil sans le catalogue, et le catalogue sans l'historique.
 */
export function construireProfil(
  signaux: readonly Signal[],
  faits: FaitsHumains = {},
): Omit<ProfilInteret, "next_resource_slug" | "next_action" | "next_action_reason"> {
  const scores = scoresParPilier(signaux);
  const conf = confiance(scores);

  const maxScore = Math.max(0, ...Object.values(scores));
  const candidats = Object.keys(scores).filter((p) => scores[p] === maxScore);
  const dominant =
    maxScore === 0 ? null : candidats.length === 1 ? (candidats[0] as PillarSlug) : departager(signaux, candidats);

  const ressources = signaux
    .filter((s) => s.nature === "ressource_demandee" && s.ressourceSlug)
    .map((s) => s.ressourceSlug as string);

  const dernier = signaux.reduce<string | null>(
    (acc, s) => (acc === null || s.date > acc ? s.date : acc),
    null,
  );

  const etat = etatNurturing(signaux, faits);

  return {
    dominant_pillar: dominant,
    pillar_scores: scores,
    confidence: conf,
    resources_consumed: [...new Set(ressources)],
    last_signal: dernier,
    engagement_level: niveauEngagement(signaux),
    nurture_state: etat,
    human_handoff_required: etat === "handoff_humain" || etat === "intention_forte",
  };
}

/**
 * Traduit l'historique brut de `prospects.metadata.demandes_ressource[]` en
 * signaux. C'est le seul endroit qui connaît la forme stockée : le reste du
 * moteur ne voit que des `Signal`.
 *
 * Le pilier d'une demande vient de la RESSOURCE demandée, résolu par
 * l'appelant : le moteur ne lit pas le registre, pour rester pur.
 */
export type DemandeStockee = {
  submission_id: string;
  ressource_slug: string;
  article_slug?: string;
  source?: string;
  demande_le: string;
  attribution?: Record<string, string>;
};

export function signauxDepuisDemandes(
  demandes: readonly DemandeStockee[],
  pilierDeLaRessource: (slug: string) => PillarSlug | null,
): Signal[] {
  const signaux: Signal[] = [];

  for (const d of demandes) {
    const pilier = pilierDeLaRessource(d.ressource_slug);
    if (!pilier) continue;
    signaux.push({
      nature: "ressource_demandee",
      pilier,
      date: d.demande_le,
      ressourceSlug: d.ressource_slug,
      articleSlug: d.article_slug,
      canal: d.attribution?.["utm_source"],
      campagne: d.attribution?.["utm_campaign"],
    });
  }

  /* Un retour répété n'est pas une donnée stockée : il se DÉDUIT de deux
     demandes espacées de plus d'une journée. Une personne qui prend deux
     ressources dans la même minute n'est pas revenue, elle a cliqué deux fois. */
  const dates = [...demandes].map((d) => d.demande_le).sort();
  for (let i = 1; i < dates.length; i += 1) {
    const ecartMs = Date.parse(dates[i]) - Date.parse(dates[i - 1]);
    if (Number.isFinite(ecartMs) && ecartMs > 24 * 3600 * 1000) {
      const pilier = pilierDeLaRessource(
        demandes.find((d) => d.demande_le === dates[i])?.ressource_slug ?? "",
      );
      if (pilier) signaux.push({ nature: "retour_repete", pilier, date: dates[i] });
    }
  }

  return signaux;
}
