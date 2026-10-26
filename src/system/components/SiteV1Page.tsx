import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "@/lib/server/locale";
import { localizedPath, localizedAlternates, localizedOpenGraph } from "@/system/locale";
import { SITE_V1_PAGES, type SiteV1PageId, type GuideCopy } from "@/system/site-v1-pages";
import { K } from "@/system/components";
import { IntegrationBuildSwitcher } from "./IntegrationBuildSwitcher";
import { ProcessConnector } from "./ProcessDiagram";

export async function siteV1Metadata(id: SiteV1PageId): Promise<Metadata> {
  const locale = await getLocale(); const copy = SITE_V1_PAGES[id][locale];
  const title = `${copy.name} · Parrit.ai`;
  return { title: { absolute: title }, description: copy.description, alternates: localizedAlternates(`/${id}`, locale), openGraph: localizedOpenGraph(`/${id}`, locale, title, copy.description) };
}
export async function SiteV1Page({ id }: { id: SiteV1PageId }) {
  const locale = await getLocale(); const fr = locale === "fr";
  const copy: GuideCopy = SITE_V1_PAGES[id][locale]; const harness = id === "harness-engineering";
  const href = (path: string) => localizedPath(path, locale);
  return <main className="rev-page home-s v1-page v1-guide">
    <section className="v1-guide-hero r2-dark"><div className="home-s-wrap"><K>{copy.name}</K><h1>{copy.title}</h1><p>{copy.description}</p><Link className="rev-button exec" href={href("/commission")}>{fr ? "Parler d'un projet" : "Talk about a project"}</Link></div></section>
    <div className={`home-s-wrap v1-guide-body${harness ? " v1-with-toc" : ""}`}>
      {harness && <nav className="v1-toc" aria-label={fr ? "Sommaire" : "Contents"}>{copy.sections.map(([anchor, title]) => <a key={anchor} href={`#${anchor}`}>{title}</a>)}</nav>}
      <div>
        {copy.brief && <section><h2>{fr ? "En bref" : "At a glance"}</h2><dl className="v1-brief">{copy.brief.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl></section>}
        {id === "engineering-integration" && <section><h2>{fr ? "Intégrer ce qui existe. Construire ce qui manque." : "Integrate what exists. Build what is missing."}</h2><IntegrationBuildSwitcher locale={locale}/></section>}
        {copy.sections.map(([anchor, title, paragraphs]) => <section key={anchor} id={anchor}><h2>{title}</h2>{paragraphs.map(text => <p key={text}>{text}</p>)}
          {harness && anchor === "harness" && <ol className="v1-harness-diagram" aria-label={fr ? "Composants du harnais" : "Harness components"}>{(fr ? ["Instructions", "Contexte", "Mémoire", "Outils", "Permissions", "Vérifications", "Supervision", "Coûts"] : ["Instructions", "Context", "Memory", "Tools", "Permissions", "Checks", "Supervision", "Costs"]).map((text, index) => <li key={text}>{text}{index < 7 && <ProcessConnector/>}</li>)}</ol>}
          {id === "engineering-integration" && anchor === "harness" && <Link className="rev-button ghost" href={href("/harness-engineering")}>Harness Engineering</Link>}
        </section>)}
        {copy.faq.length > 0 && <section><h2>{fr ? "Questions fréquentes" : "Frequently asked questions"}</h2>{copy.faq.map(([question, answer]) => <details className="v1-faq" key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>}
        {harness && <p>{fr ? "Mis à jour le " : "Updated on "}<time dateTime="2026-10-26">{fr ? "26 octobre 2026" : "26 October 2026"}</time></p>}
      </div>
    </div>
    <section><div className="home-s-wrap"><h2>{fr ? "Poursuivre votre réflexion" : "Explore further"}</h2><nav className="v1-related" aria-label={fr ? "Pages associées" : "Related pages"}>{(Object.keys(SITE_V1_PAGES) as SiteV1PageId[]).filter(key => key !== id).map(key => <Link key={key} href={href(`/${key}`)}>{SITE_V1_PAGES[key][locale].name}</Link>)}<Link href={href("/dossiers")}>{fr ? "Réalisations" : "Work"}</Link><Link href={href("/standard")}>{fr ? "Le Standard" : "The Standard"}</Link><Link href={href("/manufacture")}>{fr ? "La méthode" : "The method"}</Link><Link href={href("/journal")}>Journal</Link></nav></div></section>
    <section className="home-s-close r2-dark"><div className="home-s-wrap"><h2>{fr ? "Parlons de l'opération que vous voulez transformer." : "Let's talk about the operation you want to transform."}</h2><Link className="rev-button exec" href={href("/commission")}>{fr ? "Parler d'un projet" : "Talk about a project"}</Link></div></section>
  </main>;
}
