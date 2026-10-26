"use client";

import { useId, useState, useSyncExternalStore } from "react";
import type { Locale } from "@/system/locale";

const subscribe = () => () => {};
export const INTEGRATION_COPY = {
  fr: [
    ["Intégrer l'existant", "vos outils actuels restent en place quand ils font le travail ; nous les relions entre eux et à vos données."],
    ["Construire le manquant", "un logiciel ou un agent sur mesure quand votre métier a un besoin qu'aucun outil ne couvre."],
    ["Orchestrer l'ensemble", "un système où chaque étape est tracée, supervisée et réversible."],
  ],
  en: [
    ["Integrate what exists", "your current tools stay in place when they do the job; we connect them to each other and to your data."],
    ["Build what is missing", "custom software or an agent when your business has a need that no tool covers."],
    ["Orchestrate the whole", "a system where every step is traced, supervised and reversible."],
  ],
} as const;

export function IntegrationBuildSwitcher({ locale }: { locale: Locale }) {
  const id = useId();
  const enhanced = useSyncExternalStore(subscribe, () => true, () => false);
  const [selected, select] = useState(0);
  const items = INTEGRATION_COPY[locale];
  return <div className="v1-switcher" data-enhanced={enhanced}>
    {enhanced && <div role="tablist" aria-label={locale === "fr" ? "Engineering & Intégration" : "Engineering & Integration"}>
      {items.map(([title], index) => <button key={title} type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1}
        onClick={() => select(index)} onKeyDown={(event) => {
          const next = event.key === "Home" ? 0 : event.key === "End" ? 2 : event.key === "ArrowRight" ? (index + 1) % 3 : event.key === "ArrowLeft" ? (index + 2) % 3 : undefined;
          if (next === undefined) return;
          event.preventDefault(); select(next);
          document.getElementById(`${id}-tab-${next}`)?.focus();
        }}>{title}</button>)}
    </div>}
    {items.map(([title, body], index) => <div key={title} id={`${id}-panel-${index}`} role={enhanced ? "tabpanel" : undefined} aria-labelledby={enhanced ? `${id}-tab-${index}` : undefined} hidden={enhanced && selected !== index} tabIndex={enhanced ? 0 : undefined}>
      <h3 className={enhanced ? "sr-only" : undefined}>{title}</h3><p>{body}</p>
    </div>)}
    <p>{locale === "fr" ? "La cession des droits sur ce que nous développons, l'hébergement, la réversibilité et la maintenance sont écrits dans le contrat de chaque projet." : "The assignment of rights to what we build, hosting, reversibility and maintenance are written into each project's contract."}</p>
  </div>;
}
