/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import type { Locale } from "@/system/locale";
import { SINGLE_PAGE_EN } from "@/system/single-page-copy";
import { RevealOnView } from "./RevealOnView";

type Chip = readonly [label: string, icon?: string];
const stages: readonly { title: string; description: string; chips: readonly Chip[] }[] = [
  { title: "Vos sources", description: "Là où l'information arrive aujourd'hui.", chips: [["E-mails", "gmail.svg"], ["ERP et CRM"], ["Fichiers"], ["WhatsApp", "whatsapp.svg"]] },
  { title: "Votre base", description: "Une seule base, chez vous ou chez un hébergeur.", chips: [["Supabase", "supabase.svg"], ["OVH", "ovh.svg"]] },
  { title: "Les agents", description: "Ils lisent, appliquent vos règles et préparent le travail.", chips: [["Claude", "claude.svg"], ["ChatGPT", "openai.svg"], ["Gemini", "googlegemini.svg"], ["Mistral", "mistralai.svg"], ["Qwen", "qwen.svg"], ["DeepSeek", "deepseek.svg"], ["via OpenRouter", "openrouter.svg"]] },
  { title: "Vous validez", description: "Là où vous êtes déjà.", chips: [["Votre application"], ["WhatsApp", "whatsapp.svg"], ["iMessage", "imessage.svg"], ["E-mail", "gmail.svg"], ["Telegram", "telegram.svg"]] },
  { title: "Le résultat", description: "Le travail est fait.", chips: [] },
];
const builders: readonly Chip[] = [["Claude Code", "claude.svg"], ["Codex", "openai.svg"], ["OpenCode", "opencode.png"], ["GitHub", "github.svg"], ["Vercel", "vercel.svg"], ["n8n", "n8n.svg"]];
function ToolChip({ label, icon }: { label: string; icon?: string }) {
  return <span className="chip">{icon === "opencode.png" ? <img src="/tools/opencode.png" width="16" height="16" alt=""/> : icon ? <span aria-hidden="true" className="ic" style={{ maskImage: `url(/tools/${icon})` }}/> : <i aria-hidden="true"/>}{label}</span>;
}
export function DataArchitecture({ locale }: { locale: Locale }) {
  const t = (text: string) => locale === "fr" ? text : SINGLE_PAGE_EN[text] ?? text;
  return <section id="architecture"><RevealOnView className="wrap">
    <h2>{t("Le trajet d'une donnée,")}{" "}<b>{t("de vos sources au résultat.")}</b></h2>
    <div className="flowmap">
      <div className="rail" aria-hidden="true"><i/></div>
      {stages.map(({ title, description, chips }, i) => <div key={title} className="stage" style={{ "--stage-delay": `${i * 2.4}s` } as CSSProperties}>
        <span className="num">{i + 1}</span><h3>{t(title)}</h3><p>{t(description)}</p>
        <div className="chips">{chips.length ? chips.map(([label, icon]) => <ToolChip key={label} label={t(label)} icon={icon}/>) : <div className="results">{["Relance envoyée", "Commande saisie", "Tableau à jour"].map(label => <span key={label}>{t(label)}</span>)}</div>}</div>
      </div>)}
    </div>
    <div className="builders"><span>{t("Nous construisons avec")}</span>{builders.map(([label, icon]) => <ToolChip key={label} label={label} icon={icon}/>)}</div>
    <p className="legal-note">{t("Les marques citées appartiennent à leurs propriétaires. Nous les utilisons ; aucun partenariat n'est sous-entendu.")}</p>
  </RevealOnView></section>;
}
