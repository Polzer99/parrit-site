/**
 * CONCEPT D — POINT D'ENTRÉE DE COPY DU PROTOTYPE
 *
 * Concept D est un **prototype de recherche**, pas la direction visuelle
 * finale de Parrit.ai. Voir ADR-019 et
 * docs/design-system/VISUAL-SOURCE-OF-TRUTH.md.
 *
 * Ce fichier est le seul endroit par lequel le texte entre **dans ce
 * prototype**. Ce n'est PAS le contrat de la future homepage : une direction
 * future est libre d'une tout autre structure de contenu.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * Aucune copy n'est écrite ni réécrite ici. Ce fichier réexporte simplement
 * le socle partagé du laboratoire.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * POUR CHANGER LE TEXTE DU PROTOTYPE
 *
 *   1. Déposer un fichier exportant un objet conforme à `CopyContract`.
 *   2. Remplacer ici l'import de `../content`.
 *   3. Lancer `node scripts/concept-d-qa.mjs` (Concept D Regression Test).
 *
 * `CopyContract` décrit la forme dont les composants de D ont besoin. Il ne
 * contraint ni les mots, ni la longueur, ni le nombre de cas d'usage, et il
 * n'engage que ce prototype.
 */
import { FACTS } from "../content";

/** Forme attendue par les composants du prototype Concept D. Aucune portée
 *  au-delà de ce prototype. */
export type CopyContract = {
  readonly nom: string;

  readonly hero: {
    readonly eyebrow: string;
    /** Le titre est un tableau de segments. Les retours à la ligne sont
     *  décidés à la composition, pas ici : ils ne sont pas figés. */
    readonly titre: readonly string[];
    readonly texte: string;
  };

  /** Alimente le registre de mission. Quatre entrées attendues, dans l'ordre
   *  durée, engagement économique, objet livré, condition de sortie. */
  readonly preuve: readonly { readonly cle: string; readonly ligne: string }[];

  readonly probleme: {
    readonly titre: readonly string[];
    readonly paragraphes: readonly string[];
  };

  /** Alimente ExecutionTrace. Chaque cas doit porter ses quatre moments :
   *  ce qui entre, ce que le système fait, ce qui sort, ce que l'humain
   *  continue de décider. */
  readonly cas: readonly {
    readonly id: string;
    readonly phrase: string;
    readonly entree: string;
    readonly systeme: string;
    readonly sortie: string;
    readonly humain: string;
  }[];

  /** Alimente la séquence opératoire. Trois étapes attendues. */
  readonly methode: {
    readonly titre: string;
    readonly etapes: readonly {
      readonly n: string;
      readonly titre: string;
      readonly corps: string;
    }[];
  };

  readonly hermes: {
    readonly titre: readonly string[];
    readonly texte: string;
    readonly trace: string;
    /** Attribution obligatoire, non négociable. Hermes n'est pas une
     *  technologie Parrit. Le harnais échoue si elle disparaît. */
    readonly attribution: string;
  };

  readonly offre: {
    readonly titre: string;
    readonly mois: readonly {
      readonly n: string;
      readonly titre: string;
      readonly corps: string;
    }[];
    readonly mention: string;
  };

  readonly final: {
    readonly titre: string;
    readonly texte: string;
  };

  /** Les destinations doivent pointer vers des parcours réellement
   *  implémentés. Ne jamais inventer une route. */
  readonly cta: {
    readonly principal: { readonly label: string; readonly href: string };
    readonly final: { readonly label: string; readonly href: string };
    readonly secondaire: { readonly label: string; readonly href: string };
  };
};

/**
 * Copy actuellement servie par le prototype.
 *
 * C'est le socle partagé du laboratoire, issu de PARRIT-COPY-RESET-V1.
 * L'annotation de type garantit qu'un remplacement incomplet ne compilera pas.
 */
export const COPY: CopyContract = FACTS;
