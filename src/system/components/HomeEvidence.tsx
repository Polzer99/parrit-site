import { localizedPath, type Locale } from "@/system/locale";
import { BrandConnector } from "./BrandConnector";

// Article FR relu le 13/11/2026. Le 97 % du prototype est absent de l'article
// computer-use-what-it-can-undo : il est exclu, sans substitution de source.
export const HOME_MEASURES = [
  {
    slug: "ai-cost-french-vs-english-tokens", date: "2026-10-13",
    evidence: "Sur les versions anglaise et française de deux lois européennes, le français demande 29 à 54 % de tokens supplémentaires avec quatre tokenizers publics, dont celui de GPT-5.",
    value: { fr: "29 à 54 %", en: "29 to 54%" },
    caption: { fr: "de tokens supplémentaires en français sur deux lois européennes, avec quatre tokenizers.", en: "more tokens in French across two European laws, with four tokenizers." },
  },
  {
    slug: "legacy-database-migration-writers-first", date: "2026-10-10",
    evidence: "L'ancienne affichait 34 éléments, la nouvelle 21, et 16 n'apparaissaient que sur l'ancienne.",
    value: { fr: "16 sur 34", en: "16 of 34" },
    caption: { fr: "éléments de l'écran commercial affichés uniquement avec l'ancienne base.", en: "sales screen items shown only with the old database." },
  },
  {
    slug: "agents-that-fabricate-facts", date: "2026-08-31",
    evidence: "Cette semaine, nous en avons contenu un : 1 355 lignes de base de données affirmaient que notre système avait contacté des personnes qu’il n’avait jamais contactées.",
    value: { fr: "1 355", en: "1,355" },
    caption: { fr: "lignes fausses retirées d'une base de données.", en: "false rows removed from a database." },
  },
] as const;

export function HomeMeasures({ locale }: { locale: Locale }) {
  return <section className="home-measures" id={locale === "fr" ? "mesures" : "measurements"}><div className="wrap">
    <h2>{locale === "fr" ? "Ce que nous avons mesuré." : "What we measured."}</h2>
    <div className="measure-grid">{HOME_MEASURES.map(measure => <a className="home-measure" key={measure.slug} href={localizedPath(`/journal/${measure.slug}`, locale)}>
      <time dateTime={measure.date}>{new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${measure.date}T00:00:00Z`))}</time>
      <strong>{measure.value[locale]}</strong><p>{measure.caption[locale]}</p>
    </a>)}</div>
    <div className="home-press"><p>{locale === "fr" ? "Chroniques parues dans Le Monde Informatique." : "Columns published in Le Monde Informatique."}</p>
      <a className="btn rev-button ghost home-journal-link" href={localizedPath("/journal", locale)}>{locale === "fr" ? "Lire le Journal" : "Read the Journal"}<BrandConnector/></a>
    </div>
  </div></section>;
}

export function HomeAssistant({ locale }: { locale: Locale }) {
  const question = encodeURIComponent(locale === "fr"
    ? "Que fait Parrit.ai (https://parrit.ai) et pour quel type d'entreprise ? Appuie-toi sur leur site et cite tes sources."
    : "What does Parrit.ai (https://parrit.ai) do, and for what type of business? Use their website and cite your sources.");
  return <section className="home-assistant" id="assistant"><div className="wrap">
    <h2>{locale === "fr" ? "Ou demandez à votre assistant." : "Or ask your assistant."}</h2>
    <div className="assistant-links">{[
      ["ChatGPT", "https://chatgpt.com/?q="], ["Claude", "https://claude.ai/new?q="],
      ["Perplexity", "https://www.perplexity.ai/search?q="], ["Le Chat", "https://chat.mistral.ai/chat?q="],
    ].map(([name, url]) => <a href={`${url}${question}`} target="_blank" rel="noopener" key={name}>{name}</a>)}</div>
  </div></section>;
}
