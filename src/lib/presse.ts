/**
 * MENTIONS ET INTERVENTIONS PRESSE.
 *
 * ⚠️ VIDE, ET C'EST LA VÉRITÉ. Aucune mention presse n'est enregistrée à ce jour.
 *
 * RÈGLE, appliquée par le type lui-même : un **logo de média** ne peut
 * accompagner qu'une mention RÉELLE, qui porte son média, son titre, sa date,
 * son URL source, son type et son statut. Les six champs sont obligatoires —
 * il est donc impossible d'enregistrer un logo sans la mention qui le justifie.
 *
 * Aucun mur décoratif de médias. Aucun média affiché sans mention réelle.
 *
 * À ne pas confondre avec un **logo client**, qui relève de
 * `publicationPermission` dans `src/lib/registry/preuves.ts`. Ce sont deux
 * régimes distincts : la construction de la page presse n'attend donc aucun
 * arbitrage sur les logos clients.
 */

import type { StatutPublication } from "./collections";

export type TypeMention =
  /** Parrit est cité dans un article écrit par un tiers. */
  | "citation"
  /** Paul signe une tribune ou une contribution. */
  | "contribution"
  /** Interview, podcast, plateau. */
  | "interview"
  /** Intervention publique : conférence, table ronde. */
  | "intervention";

export type MentionPresse = {
  slug: string;
  statut: StatutPublication;
  /** Les six champs qui rendent un logo de média légitime. */
  media: string;
  titre: string;
  date: string;
  urlSource: string;
  type: TypeMention;
  /** Facultatif, et n'existe QUE porté par les champs ci-dessus. */
  logoMedia?: string;
  langue: string;
  /** Ce que la mention dit, en une phrase. Pas un résumé promotionnel. */
  angle?: string;
  themeSlug?: string;
  articleSlug?: string;
};

const MENTIONS: MentionPresse[] = [];

export function getMentions(): MentionPresse[] {
  return MENTIONS;
}

export function getMention(slug: string): MentionPresse | undefined {
  return MENTIONS.find((m) => m.slug === slug && m.statut === "published");
}

export function getMentionSlugs(): string[] {
  return MENTIONS.filter((m) => m.statut === "published").map((m) => m.slug);
}

export function getMentionsParArticle(articleSlug: string): MentionPresse[] {
  return MENTIONS.filter((m) => m.statut === "published" && m.articleSlug === articleSlug);
}

/**
 * Le logo n'est retourné que si la mention est complète. Une mention à laquelle
 * il manque un champ n'a pas de logo affichable — la vérification est ici, pas
 * dans la page.
 */
export function logoMediaAffichable(m: MentionPresse): string | null {
  const complete =
    Boolean(m.media) && Boolean(m.titre) && Boolean(m.date) && Boolean(m.urlSource);
  return complete && m.logoMedia ? m.logoMedia : null;
}
