/**
 * ÉLIGIBILITÉ DES COLLECTIONS — la règle qui décide si un index paraît.
 *
 * Une collection sans aucun élément publié ne paraît pas :
 *   — la route reste `noindex` ;
 *   — elle n'entre pas dans le sitemap public ;
 *   — elle n'apparaît pas dans la navigation.
 *
 * Elle reste **rendue et testée** : la route existe, l'état vide est honnête,
 * et aucune fausse donnée ni carte « bientôt disponible » n'est fabriquée.
 *
 * Le point important : le passage de ZÉRO À UN élément `published` suffit à
 * rendre la collection éligible, **sans toucher au template ni à la page**.
 * L'éligibilité se CALCULE à partir de la donnée ; elle ne se code nulle part.
 */

export type StatutPublication = "draft" | "published";

export type ElementCollection = {
  slug: string;
  statut: StatutPublication;
};

export type EtatCollection = {
  /** Nombre d'éléments réellement publiés. */
  publies: number;
  /** Vrai dès qu'il y en a au moins un. */
  eligible: boolean;
};

export function etatCollection(elements: readonly ElementCollection[]): EtatCollection {
  const publies = elements.filter((e) => e.statut === "published").length;
  return { publies, eligible: publies > 0 };
}

/**
 * Les métadonnées d'un index, dérivées de son état. Une collection non éligible
 * est `noindex, nofollow` : elle existe pour être testée, pas pour être trouvée.
 */
export function robotsCollection(etat: EtatCollection) {
  return etat.eligible
    ? { index: true, follow: true }
    : { index: false, follow: false };
}

/** Les éléments publiés, dans l'ordre reçu. Un brouillon ne sort jamais. */
export function publies<T extends ElementCollection>(elements: readonly T[]): T[] {
  return elements.filter((e) => e.statut === "published");
}
