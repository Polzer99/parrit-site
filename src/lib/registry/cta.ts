/**
 * REGISTRE DES CTA — contrat de TEMPLATE-GRAMMAR.md §2, règle 1.
 *
 * Une page référence un `CtaId`. Elle ne contient JAMAIS le libellé d'un bouton
 * ni sa destination. Changer une offre se fait ici, et nulle part ailleurs.
 *
 * Chaque CTA porte son événement analytics et sa priorité. Le contrat du modèle
 * de contenu est strict : une page n'a qu'un seul CTA de priorité `principale`.
 * `assertSingleprincipal()` le vérifie à la construction de la page.
 */

import type { EventName } from "@/lib/analytics";

export type CtaAction =
  | "ouvrir_formulaire"
  | "aller_page"
  | "demander_ressource"
  | "prendre_rdv"
  | "telecharger";

export type CtaPriorite = "principale" | "secondaire";

export type Cta = {
  id: CtaId;
  libelle: string;
  action: CtaAction;
  /** Chemin relatif SANS la langue, ou URL absolue. `{lang}` est substitué. */
  cible: string;
  /** Identifiant de formulaire, quand l'action en ouvre un. */
  formRef?: string;
  /** Funnel auquel ce CTA rattache le visiteur. */
  funnel: FunnelId;
  evenement: EventName;
  priorite: CtaPriorite;
};

export type FunnelId =
  | "rendez_vous"
  | "ressource"
  | "diagnostic"
  | "prototype"
  | "veille"
  | "presse";

export type CtaId =
  | "rdv.paul"
  | "rdv.systeme"
  | "rdv.offre"
  | "rdv.auteur"
  | "diagnostic.decrire_mon_cas"
  | "ressource.demander"
  | "ressource.telecharger"
  | "veille.recevoir"
  | "prototype.demander"
  | "presse.kit"
  | "presse.contact";

/**
 * Lien de booking canonique — mémoire `reference_lien_booking_canonique`.
 * Il ne se retape nulle part ailleurs.
 */
export const BOOKING_URL = "https://calendar.app.google/kkpaNisBa78BuuAj8";

const REGISTRE: Record<CtaId, Cta> = {
  "rdv.paul": {
    id: "rdv.paul",
    libelle: "Réserver 15 minutes avec Paul",
    action: "prendre_rdv",
    cible: "/{lang}/rendez-vous",
    funnel: "rendez_vous",
    evenement: "meeting_requested",
    priorite: "principale",
  },
  "rdv.systeme": {
    id: "rdv.systeme",
    libelle: "Parler de ce système",
    action: "prendre_rdv",
    cible: "/{lang}/rendez-vous",
    funnel: "rendez_vous",
    evenement: "meeting_requested",
    priorite: "principale",
  },
  "rdv.offre": {
    id: "rdv.offre",
    libelle: "Réserver 15 minutes sur ce palier",
    action: "prendre_rdv",
    cible: "/{lang}/rendez-vous",
    funnel: "rendez_vous",
    evenement: "meeting_requested",
    priorite: "principale",
  },
  "rdv.auteur": {
    id: "rdv.auteur",
    libelle: "Réserver 15 minutes",
    action: "prendre_rdv",
    cible: "/{lang}/rendez-vous",
    funnel: "rendez_vous",
    evenement: "meeting_requested",
    priorite: "principale",
  },
  // Le texte dit ce que la page fait vraiment : elle ne « réserve » rien.
  // Correction actée dans 02-ROUTES-CTA-AND-LEAD-MAGNETS.md §B.
  "diagnostic.decrire_mon_cas": {
    id: "diagnostic.decrire_mon_cas",
    libelle: "Décrire mon cas en 3 minutes",
    action: "aller_page",
    cible: "/diagnostic",
    funnel: "diagnostic",
    evenement: "diagnostic_started",
    priorite: "principale",
  },
  "ressource.demander": {
    id: "ressource.demander",
    libelle: "Recevoir la ressource",
    action: "demander_ressource",
    cible: "#capture",
    formRef: "G2_ressource_qualifiante",
    funnel: "ressource",
    evenement: "resource_requested",
    priorite: "principale",
  },
  "ressource.telecharger": {
    id: "ressource.telecharger",
    libelle: "Ouvrir la ressource",
    action: "telecharger",
    cible: "",
    funnel: "ressource",
    evenement: "resource_requested",
    priorite: "secondaire",
  },
  "veille.recevoir": {
    id: "veille.recevoir",
    libelle: "Recevoir la veille",
    action: "ouvrir_formulaire",
    cible: "#veille",
    formRef: "G1_optin_leger",
    funnel: "veille",
    evenement: "resource_requested",
    priorite: "secondaire",
  },
  "prototype.demander": {
    id: "prototype.demander",
    libelle: "Demander ce système",
    action: "prendre_rdv",
    cible: "/{lang}/rendez-vous",
    funnel: "prototype",
    evenement: "prototype_requested",
    priorite: "secondaire",
  },
  "presse.kit": {
    id: "presse.kit",
    libelle: "Télécharger le kit",
    action: "telecharger",
    cible: "#kit",
    funnel: "presse",
    evenement: "resource_requested",
    priorite: "principale",
  },
  "presse.contact": {
    id: "presse.contact",
    libelle: "Contacter Paul Larmaraud",
    action: "aller_page",
    cible: "mailto:paul.larmaraud@parrit.ai",
    funnel: "presse",
    evenement: "cta_click",
    priorite: "secondaire",
  },
};

export function getCta(id: CtaId): Cta {
  return REGISTRE[id];
}

/**
 * Résout la destination d'un CTA : substitue la langue et pose `?source=`.
 * Le `source` n'est JAMAIS facultatif — c'est lui qui rend l'attribution possible.
 */
export function ctaHref(id: CtaId, lang: string, source: string): string {
  const cta = REGISTRE[id];
  const cible = cta.cible.replace("{lang}", lang);

  if (cible.startsWith("mailto:") || cible.startsWith("#") || cible === "") {
    return cible;
  }

  const separateur = cible.includes("?") ? "&" : "?";
  return `${cible}${separateur}source=${encodeURIComponent(source)}`;
}

/** Attributs d'instrumentation, captés par `CtaTracker`. */
export function ctaProps(id: CtaId, placement: string): Record<string, string> {
  const cta = REGISTRE[id];
  return {
    "data-ph": "cta",
    "data-cta-id": cta.id,
    "data-cta-funnel": cta.funnel,
    "data-cta-event": cta.evenement,
    "data-placement": placement,
  };
}

/**
 * Contrat du modèle de contenu : « Une page n'a qu'un cta de priorite principale.
 * Jamais deux CTA de poids égal. » Appelé par chaque template.
 */
export function assertSinglePrincipal(ids: CtaId[]): void {
  const principaux = ids.filter((id) => REGISTRE[id].priorite === "principale");
  if (principaux.length > 1) {
    throw new Error(
      `Deux CTA principaux sur la même page : ${principaux.join(", ")}. ` +
        `Le contrat en autorise un seul (11-CONTENT-MODEL.json, entité cta).`,
    );
  }
}
