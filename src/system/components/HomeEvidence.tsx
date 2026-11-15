import { localizedPath, type Locale } from "@/system/locale";
import { homeSectionHeadings } from "@/system/home-layers";
import { BrandConnector } from "./BrandConnector";

// Décision de Paul du 15/11/2026 : les trois mesures internes (tokens, écran
// commercial, lignes fausses) quittent l'accueil, ce ne sont pas des résultats
// clients. Seule la presse reste, comme renvoi vers le Journal.
export function HomeMeasures({ locale }: { locale: Locale }) {
  return <section className="home-measures" id={locale === "fr" ? "mesures" : "measurements"}><div className="wrap">
    <div className="home-press"><h2>{homeSectionHeadings(locale).measures[0]}</h2>
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
