/**
 * COUVERTURE ÉDITORIALE — la matrice, calculée depuis les registres.
 *
 * Aucune base manuelle. Tout ce qui suit est dérivé de `PILLARS`, du registre
 * des ressources et des articles publiés. Ajouter une ressource au registre
 * change la matrice ; il n'y a rien à tenir à jour à côté.
 *
 * Ce que la matrice sert à voir, et qu'aucune liste de ressources ne montre :
 * les piliers sans ressource, les niveaux d'engagement vides, les promesses
 * sans livrable, les ressources inutilisables dans une séquence, et donc la
 * prochaine ressource à produire.
 */

import { PILLARS, type PillarSlug } from "../pillars";
import type { NiveauEngagement, Ressource } from "../registry/ressources";

export type CelluleCouverture = {
  pilier: PillarSlug;
  niveau: NiveauEngagement;
  ressources: string[];
};

export type EtatPilier = {
  pilier: PillarSlug;
  motCle: string;
  /** Articles publiés rattachés à ce pilier. */
  articles: number;
  ressourcesPubliees: string[];
  /** Publiées ET livrables : les seules utilisables dans une séquence. */
  ressourcesUtilisables: string[];
  /** Publiées mais sans livraison vérifiée : des promesses ouvertes. */
  promessesSansLivrable: string[];
  niveauxVides: NiveauEngagement[];
  /** Ce qu'il manque, en une phrase actionnable. */
  manque: string | null;
};

export type MatriceCouverture = {
  cellules: CelluleCouverture[];
  piliers: EtatPilier[];
  /** Le pilier où produire la prochaine ressource, et pourquoi. */
  prochaineRessourceAProduire: { pilier: PillarSlug; raison: string } | null;
};

const NIVEAUX: NiveauEngagement[] = ["faible", "moyen", "fort", "tres_fort"];

/**
 * Une séquence a besoin d'au moins deux ressources utilisables par pilier :
 * avec une seule, « envoyer la suivante » n'existe pas.
 */
export const MINIMUM_POUR_UNE_SEQUENCE = 2;

export function construireMatrice(
  registre: readonly Ressource[],
  articlesParPilier: Record<string, number> = {},
): MatriceCouverture {
  const cellules: CelluleCouverture[] = [];
  const piliers: EtatPilier[] = [];

  for (const p of PILLARS) {
    const duPilier = registre.filter((r) => r.pilier === p.slug);
    const publiees = duPilier.filter((r) => r.publiee);
    const utilisables = publiees.filter((r) => r.livraisonVerifiee);
    const promesses = publiees.filter((r) => !r.livraisonVerifiee);

    const niveauxVides: NiveauEngagement[] = [];
    for (const niveau of NIVEAUX) {
      const dedans = utilisables.filter((r) => r.niveauEngagement === niveau);
      cellules.push({ pilier: p.slug, niveau, ressources: dedans.map((r) => r.slug) });
      if (dedans.length === 0) niveauxVides.push(niveau);
    }

    piliers.push({
      pilier: p.slug,
      motCle: p.keyword,
      articles: articlesParPilier[p.slug] ?? 0,
      ressourcesPubliees: publiees.map((r) => r.slug),
      ressourcesUtilisables: utilisables.map((r) => r.slug),
      promessesSansLivrable: promesses.map((r) => r.slug),
      niveauxVides,
      manque: diagnostiquer(p.slug, utilisables, promesses, articlesParPilier[p.slug] ?? 0),
    });
  }

  return { cellules, piliers, prochaineRessourceAProduire: prioriser(piliers) };
}

function diagnostiquer(
  pilier: PillarSlug,
  utilisables: readonly Ressource[],
  promesses: readonly Ressource[],
  articles: number,
): string | null {
  if (utilisables.length === 0 && promesses.length === 0) {
    return `aucune ressource sur « ${pilier} » : les lecteurs de ce pilier n'ont nulle part où aller`;
  }
  if (utilisables.length === 0) {
    return `« ${pilier} » n'a que des promesses sans livrable (${promesses.map((r) => r.slug).join(", ")}) : rien d'envoyable`;
  }
  if (utilisables.length < MINIMUM_POUR_UNE_SEQUENCE) {
    return `« ${pilier} » n'a qu'une ressource utilisable : une séquence ne peut pas enchaîner`;
  }
  if (articles === 0) {
    return `« ${pilier} » a des ressources mais aucun article : rien n'y amène`;
  }
  return null;
}

/**
 * Où produire ensuite. On priorise là où l'audience existe déjà mais où l'on
 * n'a rien à lui envoyer : un pilier qui attire et ne retient rien est le plus
 * coûteux.
 */
function prioriser(piliers: readonly EtatPilier[]): { pilier: PillarSlug; raison: string } | null {
  const enManque = piliers.filter((p) => p.manque !== null);
  if (enManque.length === 0) return null;

  const trie = [...enManque].sort((a, b) => {
    // Le plus grave d'abord : zéro utilisable, puis une seule.
    const gravite = (p: EtatPilier) => (p.ressourcesUtilisables.length === 0 ? 0 : 1);
    if (gravite(a) !== gravite(b)) return gravite(a) - gravite(b);
    // À gravité égale, celui qui a le plus d'articles : l'audience est déjà là.
    return b.articles - a.articles;
  });

  const cible = trie[0];
  return { pilier: cible.pilier, raison: cible.manque as string };
}
