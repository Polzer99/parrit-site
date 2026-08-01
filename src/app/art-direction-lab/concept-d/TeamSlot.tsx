import { FACTS } from "../content";

/**
 * PARRIT-TECH-TRUST-POLISH-V2 — emplacement d'équipe, non rendu.
 *
 * Ce composant existe pour être activé le jour où une VRAIE photographie
 * source est disponible. Il n'est appelé nulle part, il ne rend rien, et
 * aucun visage n'est inventé en attendant.
 *
 * Règle d'or Parrit : le portrait part toujours d'une photographie réelle.
 * Pas de silhouette générique, pas d'initiales dans un rond, pas de gris de
 * remplacement. Un emplacement vide vaut mieux qu'un faux visage.
 *
 * Pour l'activer :
 *   1. déposer la photographie dans design-source/editorial/originals/
 *   2. ajouter une entrée dans build_founder_bust.py, même traitement
 *      documentaire : recadrage, noir et blanc, grain, aucune opération
 *      générative
 *   3. importer ce composant dans page.tsx, sous FounderValidation
 *
 * `role` décrit une responsabilité dans le système, pas un titre de poste
 * décoratif : c'est ce qui rend la présence humaine crédible dans D.
 */
export type Membre = {
  /** Fichier dans public/brand/editorial/portraits/. Aucune valeur par défaut. */
  photo: string;
  nom: string;
  /** Ce dont la personne répond dans la chaîne, pas son intitulé. */
  responsabilite: string;
};

export function TeamSlot({ membres }: { membres: Membre[] }) {
  if (!membres.length) return null;

  return (
    <section className="d-band d-team">
      <div className="d-wrap d-team-grid">
        {membres.map((m) => (
          <figure className="d-team-item" key={m.nom}>
            <img
              src={`/brand/editorial/portraits/${m.photo}`}
              alt={`${m.nom}, ${FACTS.nom}`}
              width={530}
              height={662}
            />
            <figcaption>
              <p className="d-team-nom">{m.nom}</p>
              <p className="d-mono">{m.responsabilite}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
