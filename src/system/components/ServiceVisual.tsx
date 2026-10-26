import type { Locale } from "@/system/locale";
import type { SiteV1PageId } from "@/system/site-v1-pages";
import { ProcessConnector, ProcessDiagram } from "./ProcessDiagram";

export const HARNESS_COMPONENTS = {
  fr: ["Instructions", "Contexte", "Mémoire", "Outils", "Permissions", "Vérifications", "Supervision", "Coûts"],
  en: ["Instructions", "Context", "Memory", "Tools", "Permissions", "Checks", "Supervision", "Costs"],
} as const;

/** Shared, server-rendered diagrams: real assets and categories, never invented UI. */
export function ServiceVisual({ id, locale }: { id: SiteV1PageId; locale: Locale }) {
  const fr = locale === "fr";
  return <div className={`v1-service-visual v1-visual-${id}`} data-service-visual={id} data-regime="calm">
    {id === "consulting-transformation" && <ProcessDiagram locale={locale}/>}
    {id === "ai-sprints" && <div className="v1-sprint-diagram">
      <ol>{(fr ? ["Cadrage", "Construction", "Évaluation", "Décision"] : ["Scoping", "Construction", "Evaluation", "Decision"]).map((label, index) => <li key={label}><span>{label}</span>{index < 3 && <ProcessConnector/>}</li>)}</ol>
      <ul className="v1-sprint-outcomes">{(fr ? ["Passer en production", "Corriger", "Arrêter"] : ["Move to production", "Correct", "Stop"]).map(label => <li key={label}><ProcessConnector/><span>{label}</span></li>)}</ul>
    </div>}
    {id === "engineering-integration" && <figure className="v1-integration-diagram">
      <div className="v1-tool-categories">{(fr ? ["Messagerie", "Agenda"] : ["Email", "Calendar"]).map(label => <div key={label}><span>{label}</span><ProcessConnector/></div>)}</div>
      <div className="v1-crm-frame">
        {/* Approved screenshot, including its original baked-in corners and shadow. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/scenes/scene-carte-visite-fiche-crm.png" width={860} height={564} alt={fr ? "Fiche du contact créée dans le CRM : société, nom, poste, mobile masqué" : "Contact record created in the CRM: company, name, role, masked mobile number"}/>
      </div>
      <div className="v1-tool-categories v1-tools-bottom">{(fr ? ["Tableur", "Base de données"] : ["Spreadsheet", "Database"]).map(label => <div key={label}><ProcessConnector/><span>{label}</span></div>)}</div>
      <figcaption>{fr ? "Démonstration, données fictives." : "Demonstration in French, fictional data."}</figcaption>
    </figure>}
    {id === "harness-engineering" && <div className="v1-harness-star">
      <p className="v1-model">{fr ? "Modèle" : "Model"}</p>
      <svg className="v1-star-links" aria-hidden="true" focusable="false">
        <defs><marker id={`harness-head-${locale}`} viewBox="0 0 10 8" refX="10" refY="4" markerWidth="10" markerHeight="8" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L10 4L0 8Z" fill="currentColor"/></marker></defs>
        {([
          ["26.667%", "28.6%"], ["50%", "28.6%"], ["73.333%", "28.6%"],
          ["72.8%", "50%"], ["73.333%", "71.4%"], ["50%", "71.4%"],
          ["26.667%", "71.4%"], ["27.2%", "50%"],
        ] as const).map(([x, y], index) => <g key={index} fill="none" stroke="currentColor" strokeWidth="2">
          {y !== "50%" && <line x1="50%" y1="50%" x2={x} y2="50%"/>}
          <line x1={y === "50%" ? "50%" : x} y1="50%" x2={x} y2={y} markerEnd={`url(#harness-head-${locale})`}/>
        </g>)}
      </svg>
      <ol className="v1-harness-diagram" aria-label={fr ? "Composants du harnais" : "Harness components"}>{HARNESS_COMPONENTS[locale].map((label, index) => <li key={label} style={{ gridArea: ["1 / 1", "1 / 2", "1 / 3", "2 / 3", "3 / 3", "3 / 2", "3 / 1", "2 / 1"][index] }}><span>{label}</span></li>)}</ol>
    </div>}
  </div>;
}
