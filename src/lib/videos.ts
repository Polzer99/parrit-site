/**
 * COLLECTION VIDÉO.
 *
 * ⚠️ VIDE, ET C'EST LA VÉRITÉ. Aucune vidéo n'a été produite à ce jour.
 *
 * On ne fabrique pas de fausse vidéo, pas de vignette de remplissage, pas de
 * carte « bientôt disponible ». L'index rend un état vide honnête et reste
 * `noindex` tant qu'aucun élément n'est `published` — voir `collections.ts`.
 *
 * Le jour où la première vidéo arrive : on ajoute une entrée ici, avec son
 * statut `published`, et **rien d'autre ne bouge**. L'index devient indexable,
 * il entre dans le sitemap, il apparaît dans la navigation. Aucun template,
 * aucune page, aucune configuration à modifier.
 *
 * Le média suit le contrat neutre de `src/lib/video/contract.ts` : aucun
 * hébergeur n'est retenu. Une entrée peut fournir ses trois URL directement, ou
 * s'appuyer sur un adapter enregistré le jour où l'hébergeur sera tranché.
 */

import type { StatutPublication } from "./collections";
import type { VideoSource } from "./video/contract";

export type VideoEntry = {
  slug: string;
  statut: StatutPublication;
  titre: string;
  description: string;
  media: VideoSource;
  auteurSlug: string;
  /** Ce que la vidéo montre, en 3 à 5 points. Lisible SANS la vidéo. */
  resumeStructure: string[];
  /** Rattachements éditoriaux, pour les liens croisés. */
  themeSlug?: string;
  articleSlug?: string;
  ressourceSlug?: string;
};

const VIDEOS: VideoEntry[] = [];

export function getVideos(): VideoEntry[] {
  return VIDEOS;
}

export function getVideo(slug: string): VideoEntry | undefined {
  return VIDEOS.find((v) => v.slug === slug && v.statut === "published");
}

export function getVideoSlugs(): string[] {
  return VIDEOS.filter((v) => v.statut === "published").map((v) => v.slug);
}

/** Les vidéos rattachées à un article, pour le bloc de liens croisés. */
export function getVideosParArticle(articleSlug: string): VideoEntry[] {
  return VIDEOS.filter((v) => v.statut === "published" && v.articleSlug === articleSlug);
}
