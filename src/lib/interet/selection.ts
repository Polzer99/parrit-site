/**
 * SÉLECTEUR DE PROCHAINE RESSOURCE — une fonction pure, et un refus explicite.
 *
 * La règle qui gouverne ce fichier tient en une phrase : **le silence vaut
 * mieux qu'une ressource hors sujet.** Un envoi à côté coûte la crédibilité que
 * tout le reste sert à construire, et il ne se rattrape pas.
 *
 * La fonction ne connaît ni la base, ni le réseau, ni l'heure. On lui donne un
 * profil et un catalogue, elle rend une décision et sa raison. C'est ce qui
 * permet de la tester exhaustivement, et à un humain de contester le choix.
 */

import type { Ressource } from "../registry/ressources";
import { CONFIANCE_MINIMALE, type NiveauEngagement, type ProfilInteret } from "./profil";

export const AUCUNE_RESSOURCE = "no_relevant_resource" as const;

export type Decision =
  | { ressource: Ressource; raison: string }
  | { ressource: typeof AUCUNE_RESSOURCE; raison: string };

/**
 * Le niveau d'engagement d'une personne borne l'exigence de la ressource qu'on
 * lui propose. On ne demande pas un diagnostic à quelqu'un qui vient de lire un
 * article ; on ne renvoie pas un guide d'initiation à quelqu'un qui a déjà pris
 * deux ressources.
 *
 * Le vocabulaire est celui du registre (`niveauEngagement`), pas un nouveau.
 */
const ENGAGEMENT_MAXIMAL: Record<NiveauEngagement, number> = {
  froid: 1, // faible
  tiede: 2, // faible ou moyen
  chaud: 4, // jusqu'à très fort
};

const RANG_ENGAGEMENT: Record<Ressource["niveauEngagement"], number> = {
  faible: 1,
  moyen: 2,
  fort: 3,
  tres_fort: 4,
};

/**
 * `selectNextResource` — la ressource suivante, ou un refus motivé.
 *
 * Les conditions sont cumulatives et toutes obligatoires :
 *   — publiée ;
 *   — du pilier dominant ;
 *   — pas déjà consommée ;
 *   — au plus au niveau d'exigence que l'engagement autorise ;
 *   — **et dont la livraison est vérifiée**.
 *
 * Ce dernier point est celui qu'on oublie : proposer une ressource dont la
 * promesse n'est pas tenue, c'est fabriquer une déception à retardement. Une
 * ressource sans livrable réel n'entre pas dans une séquence, même si elle est
 * parfaitement dans le sujet.
 */
export function selectNextResource(
  profile: Pick<
    ProfilInteret,
    "dominant_pillar" | "confidence" | "resources_consumed" | "engagement_level" | "nurture_state"
  > & {
    /** La langue de la personne. Une ressource dans une autre langue est hors sujet. */
    langue?: "fr" | "en";
  },
  registry: readonly Ressource[],
): Decision {
  if (profile.nurture_state === "handoff_humain") {
    return {
      ressource: AUCUNE_RESSOURCE,
      raison: "handoff humain : toute automatisation sortante est arrêtée",
    };
  }

  if (!profile.dominant_pillar) {
    return {
      ressource: AUCUNE_RESSOURCE,
      raison: "aucun pilier dominant : les signaux ne désignent pas un sujet",
    };
  }

  if (profile.confidence < CONFIANCE_MINIMALE) {
    return {
      ressource: AUCUNE_RESSOURCE,
      raison: `confiance ${profile.confidence.toFixed(2)} sous le seuil ${CONFIANCE_MINIMALE} : deux sujets se valent, on se tait`,
    };
  }

  const dejaPrises = new Set(profile.resources_consumed);
  const plafond = ENGAGEMENT_MAXIMAL[profile.engagement_level];

  /* La langue fait partie de « hors sujet ». La matrice a montré qu'un lecteur
     francophone du pilier « agents-ia » se serait vu proposer `hr-radar`, qui
     est en anglais : dans le sujet, et parfaitement inutilisable. */
  const langue = profile.langue ?? "fr";

  const eligibles = registry.filter(
    (r) =>
      r.publiee &&
      r.pilier === profile.dominant_pillar &&
      r.langue === langue &&
      !dejaPrises.has(r.slug) &&
      r.livraisonVerifiee &&
      RANG_ENGAGEMENT[r.niveauEngagement] <= plafond,
  );

  if (eligibles.length === 0) {
    return {
      ressource: AUCUNE_RESSOURCE,
      raison: raisonDuVide(profile, registry, dejaPrises, plafond),
    };
  }

  /* À conditions égales, la ressource la moins engageante d'abord : on avance
     par palier, on ne saute pas à la demande la plus forte. */
  const choisie = [...eligibles].sort(
    (a, b) => RANG_ENGAGEMENT[a.niveauEngagement] - RANG_ENGAGEMENT[b.niveauEngagement],
  )[0];

  return {
    ressource: choisie,
    raison:
      `pilier ${profile.dominant_pillar} (confiance ${profile.confidence.toFixed(2)}), ` +
      `engagement ${profile.engagement_level}, livraison vérifiée, non encore consommée`,
  };
}

/** Dire POURQUOI il n'y a rien : c'est ce qui rend le trou de catalogue visible. */
function raisonDuVide(
  profile: Pick<ProfilInteret, "dominant_pillar" | "engagement_level" | "resources_consumed">,
  registry: readonly Ressource[],
  dejaPrises: Set<string>,
  plafond: number,
): string {
  const langue = (profile as { langue?: "fr" | "en" }).langue ?? "fr";
  const duPilier = registry.filter(
    (r) => r.pilier === profile.dominant_pillar && r.langue === langue,
  );
  const publiees = duPilier.filter((r) => r.publiee);
  const restantes = publiees.filter((r) => !dejaPrises.has(r.slug));
  const livrables = restantes.filter((r) => r.livraisonVerifiee);

  if (duPilier.length === 0) {
    return `aucune ressource en ${langue} sur le pilier ${profile.dominant_pillar} : trou de catalogue`;
  }
  if (publiees.length === 0) {
    return `le pilier ${profile.dominant_pillar} n'a que des ressources non publiées`;
  }
  if (restantes.length === 0) {
    return `pilier ${profile.dominant_pillar} épuisé : tout a déjà été consommé`;
  }
  if (livrables.length === 0) {
    return (
      `pilier ${profile.dominant_pillar} : ${restantes.length} ressource(s) restante(s), ` +
      "mais aucune dont la livraison est vérifiée"
    );
  }
  return (
    `pilier ${profile.dominant_pillar} : les ressources restantes demandent plus d'engagement ` +
    `que le niveau ${profile.engagement_level} n'autorise (plafond ${plafond})`
  );
}

/**
 * L'action suivante, en langage d'opération — pas un message. Les mots du
 * courriel appartiennent à la session copie ; ici on dit seulement QUOI faire
 * et POURQUOI.
 */
export function prochaineAction(
  profile: Pick<ProfilInteret, "nurture_state" | "engagement_level" | "dominant_pillar">,
  decision: Decision,
): { action: string; raison: string } {
  if (profile.nurture_state === "handoff_humain") {
    return {
      action: "reprise_humaine",
      raison: "un signal humain est arrivé : la séquence s'arrête, Paul prend la main",
    };
  }

  if (profile.nurture_state === "intention_forte") {
    return {
      action: "proposer_echange_humain",
      raison:
        decision.ressource === AUCUNE_RESSOURCE
          ? `intention forte, et ${decision.raison}`
          : `intention forte sur ${profile.dominant_pillar} : la séquence générique s'arrête`,
    };
  }

  if (decision.ressource === AUCUNE_RESSOURCE) {
    return { action: "ne_rien_envoyer", raison: decision.raison };
  }

  return {
    action: `envoyer_ressource:${decision.ressource.slug}`,
    raison: decision.raison,
  };
}
