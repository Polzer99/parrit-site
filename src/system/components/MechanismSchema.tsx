import type { Locale } from "../locale";
import { K } from "./K";

const COPY = {
  fr: {
    label: "Le mécanisme, vérifié",
    sourceCanonical: ["Ce qui fait foi", "Notre application interne."],
    sourceLegacy: ["Ce qui écrit encore à côté", "Onze anciens outils, dont une synchronisation toutes les 15 minutes."],
    control: ["Deux contrôles", "Un verrou, posé au moment de modifier le code, empêche d'ajouter un nouveau point d'écriture non déclaré. Un audit du 11 septembre a trouvé 114 fiches présentes uniquement dans l'ancien système."],
    decision: ["Décision humaine, datée", "Le fondateur tranche, un type d'information à la fois. Une décision déjà prise et datée, comme celle du 14 septembre."],
  },
  en: {
    label: "The mechanism, verified",
    sourceCanonical: ["What's trusted", "Our internal application."],
    sourceLegacy: ["What still writes alongside it", "Eleven older tools, including a sync job running every 15 minutes."],
    control: ["Two checks", "A gate, applied when the code changes, blocks any new undeclared write path from being added. An audit run on September 11 found 114 records that existed only in the old system."],
    decision: ["Human decision, dated", "The founder decides, one type of information at a time. A decision already made and dated, like the one on September 14."],
  },
} as const;

export function MechanismSchema({ locale = "en" }: { locale?: Locale }) {
  const copy = COPY[locale];
  const ariaLabel = locale === "fr"
    ? "Schéma : deux sources se rejoignent dans un contrôle, qui alimente une décision humaine."
    : "Diagram: two sources feed into a check, which feeds into a human decision.";
  return (
    <div className="mechanism-diagram" role="img" aria-label={ariaLabel}>
      <K className="mechanism-diagram-label">{copy.label}</K>
      <div className="mechanism-diagram-sources">
        <div className="mechanism-diagram-node mechanism-diagram-node--canonical">
          <h3>{copy.sourceCanonical[0]}</h3>
          <p>{copy.sourceCanonical[1]}</p>
        </div>
        <div className="mechanism-diagram-node mechanism-diagram-node--legacy">
          <h3>{copy.sourceLegacy[0]}</h3>
          <p>{copy.sourceLegacy[1]}</p>
        </div>
      </div>
      <div className="mechanism-diagram-arrow" aria-hidden="true">↓</div>
      <div className="mechanism-diagram-node mechanism-diagram-node--control">
        <h3>{copy.control[0]}</h3>
        <p>{copy.control[1]}</p>
      </div>
      <div className="mechanism-diagram-arrow" aria-hidden="true">↓</div>
      <div className="mechanism-diagram-node mechanism-diagram-node--decision">
        <h3>{copy.decision[0]}</h3>
        <p>{copy.decision[1]}</p>
      </div>
    </div>
  );
}
