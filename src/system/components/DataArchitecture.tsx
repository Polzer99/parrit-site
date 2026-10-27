import type { CSSProperties } from "react";
import type { Locale } from "@/system/locale";
import { SINGLE_PAGE_EN } from "@/system/single-page-copy";
import { MobileCarousel } from "./MobileCarousel";
import { RevealOnView } from "./RevealOnView";

const stages = [
  { title: "Vos sources", description: "Tout ce que vos équipes utilisent déjà.", chips: ["E-mails", "Agenda", "Téléphone et messages vocaux", "WhatsApp", "Teams et Slack", "ERP", "CRM", "Comptabilité", "Paie", "Tableurs", "Documents et PDF", "Scans et photos", "Sites web", "Machines et capteurs"] },
  { title: "Votre base", description: "Une seule base, où vous le décidez.", chips: ["Dans le cloud, en Europe", "Sur vos serveurs", "En local, sur vos machines"] },
  { title: "Les agents", description: "Le bon modèle en face de chaque tâche, dans un harnais construit pour vous.", chips: ["Le bon modèle pour chaque tâche", "En ligne ou en local", "Vos règles et vos contrôles", "Des tests à chaque changement"] },
  { title: "Vous validez", description: "Là où vous êtes déjà.", chips: ["Votre propre application", "WhatsApp", "iMessage", "E-mail", "Teams", "Telegram"] },
  { title: "Le résultat", description: "Le travail est fait.", chips: [] },
] as const;
export function DataArchitecture({ locale }: { locale: Locale }) {
  const fr = locale === "fr";
  const t = (text: string) => locale === "fr" ? text : SINGLE_PAGE_EN[text] ?? text;
  return <section id="architecture"><RevealOnView className="wrap">
    <h2>{t("Le trajet d'une donnée,")}{" "}<b>{t("de vos sources au résultat.")}</b></h2>
    <div className="flow-container"><div className="rail" aria-hidden="true"><i/></div>
    <MobileCarousel className="flowmap" label={fr ? "Le trajet d’une donnée" : "The journey of a data item"} autoAdvance>
      {stages.map(({ title, description, chips }, i) => <div key={title} className="stage" style={{ "--stage-delay": `${i * 2.4}s` } as CSSProperties}>
        <span className="num">{i + 1}</span><h3>{t(title)}</h3><p>{t(description)}</p>
        <div className="chips">{chips.length ? chips.map(label => <span key={label} className={label === "Votre propre application" ? "chip app" : "chip"}>{t(label)}</span>) : <div className="results">{["Relance envoyée", "Commande saisie", "Tableau à jour"].map(label => <span key={label}>{t(label)}</span>)}</div>}</div>
      </div>)}
    </MobileCarousel></div>
    <p className="legal-note">{t("Les marques citées appartiennent à leurs propriétaires. Nous les utilisons ; aucun partenariat n'est sous-entendu.")}</p>
  </RevealOnView></section>;
}
