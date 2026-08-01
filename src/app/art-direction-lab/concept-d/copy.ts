/**
 * CONCEPT D — POINT D'ENTRÉE UNIQUE DE LA COPY
 *
 * Concept D est figé comme SOURCE VISUELLE DE VÉRITÉ de Parrit.ai
 * (voir docs/design-system/VISUAL-SOURCE-OF-TRUTH.md).
 *
 * Ce fichier est le SEUL endroit par lequel le texte entre dans la page.
 * Aujourd'hui il ne fait que réexporter le socle partagé du laboratoire.
 * Quand Paul livrera la copy définitive, un seul fichier change : celui-ci.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * RÈGLE. Cette tranche n'écrit AUCUNE copy et n'en réécrit aucune.
 * Aucune modification de texte ne sera faite avant réception du wording
 * validé par Paul.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * POUR LIVRER LA COPY DÉFINITIVE
 *
 *   1. Déposer le fichier de wording validé, par exemple
 *      `src/app/art-direction-lab/concept-d/copy.final.ts`, exportant un
 *      objet conforme au contrat `CopyContract` ci-dessous.
 *   2. Remplacer ici l'import de `../content` par celui de `./copy.final`.
 *   3. Lancer `node scripts/concept-d-qa.mjs` : le harnais vérifie que le
 *      contrat est complet et que le canon visuel n'a pas bougé.
 *
 * Le contrat décrit une FORME, pas un contenu. Il ne contraint ni les mots,
 * ni la longueur, ni le nombre de cas d'usage. Il garantit seulement que la
 * page trouvera chaque champ dont ses composants ont besoin.
 *
 * Ce qui n'est PAS figé et bougera donc avec la copy finale : les retours à
 * la ligne, la quantité exacte de rouge dans les titres, les hauteurs qui
 * dépendent du texte, la densité des blocs éditoriaux, et l'ordre final des
 * sections commerciales.
 */
import { FACTS } from "../content";

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
 * Copy actuellement servie par Concept D.
 *
 * Provisoire : c'est le socle partagé du laboratoire, issu de
 * PARRIT-COPY-RESET-V1. Il sera remplacé tel quel par le wording validé.
 * L'annotation de type garantit qu'un remplacement incomplet ne compilera pas.
 */
export const COPY: CopyContract = FACTS;
