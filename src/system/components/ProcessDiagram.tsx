import type { Locale } from "@/system/locale";

// VS-CONNECTOR: 2 px stroke, 10 × 8 px solid head, 15 px minimum shaft.
export function ProcessConnector() {
  return <svg width="32" height="14" viewBox="0 0 32 14" aria-hidden="true" focusable="false"><path d="M2 7H20" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M20 3L30 7L20 11Z" fill="currentColor"/></svg>;
}
export function ProcessDiagram({ locale }: { locale: Locale }) {
  const fr = locale === "fr";
  return <figure className="v1-process" aria-label={fr ? "Un processus actuel et sa cible" : "A current process and its target"}>
    {[[fr ? "Aujourd'hui" : "Today", fr ? "Saisie manuelle" : "Manual entry", fr ? "Vérification manuelle" : "Manual check"], [fr ? "Demain" : "Tomorrow", fr ? "Système" : "System", fr ? "Validation humaine" : "Human approval"]].map(([title, first, last]) => <div key={title}><p><strong>{title}</strong></p><p>{first}</p><ProcessConnector/><p>{last}</p></div>)}
  </figure>;
}
