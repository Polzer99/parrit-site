import { Fragment } from "react";
import type { Locale } from "@/system/locale";

// VS-CONNECTOR: 2 px stroke, 10 × 8 px solid head, 15 px minimum shaft.
export function ProcessConnector() {
  return <svg width="32" height="14" viewBox="0 0 32 14" aria-hidden="true" focusable="false"><path d="M2 7H20" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M20 3L30 7L20 11Z" fill="currentColor"/></svg>;
}
export function ProcessDiagram({ locale }: { locale: Locale }) {
  const fr = locale === "fr";
  const columns = [
    { title: fr ? "Aujourd'hui" : "Today", target: false, steps: fr
      ? ["Demande reçue", "Saisie à la main", "Vérifiée à la main", "Relance oubliée"]
      : ["Request received", "Typed in by hand", "Checked by hand", "Follow-up forgotten"] },
    { title: fr ? "Demain" : "Tomorrow", target: true, steps: fr
      ? ["Demande reçue", "Le système prépare", "Une personne valide", "Trace consignée"]
      : ["Request received", "The system prepares", "A person approves", "Record kept"] },
  ];
  return <figure className="v1-process" aria-label={fr ? "Un processus actuel et sa cible" : "A current process and its target"}>
    {columns.map(({ title, target, steps }) => <div key={title} className={target ? "v1-process-target" : undefined}>
      <p><strong>{title}</strong></p>
      {steps.map((step, index) => <Fragment key={step}>
        {index > 0 && <ProcessConnector/>}<p>{step}</p>
      </Fragment>)}
    </div>)}
  </figure>;
}
