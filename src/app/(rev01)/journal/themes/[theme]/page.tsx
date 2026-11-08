import type { Metadata } from "next";
import "@/system/journal-themes.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale } from "@/lib/server/locale";
import { getAllJournalEntrySummaries } from "@/system/journal";
import { localizedAlternates, localizedOpenGraph, localizedPath } from "@/system/locale";
import { SITE_V1_PAGES, type GuideCopy } from "@/system/site-v1-pages";
import { INTEGRATION_COPY } from "@/system/integration-copy";
import { JOURNAL_THEMES as THEMES } from "@/system/journal-themes";
import { journalThemeJsonLd } from "@/system/jsonld";
import { BookingCall } from "@/system/components/BookingCall";


type Theme = keyof typeof THEMES;
type Props = { params: Promise<{ theme: string }> };
function getTheme(theme: string): Theme {
  if (!Object.hasOwn(THEMES, theme)) notFound();
  return theme as Theme;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const theme = getTheme((await params).theme);
  const locale = await getLocale();
  const copy = SITE_V1_PAGES[THEMES[theme].page][locale];
  const path = `/journal/themes/${theme}`;
  const title = `${locale === "fr" ? copy.title : `${copy.name} : ${copy.title}`} · Parrit.ai`;
  return { title: { absolute: title }, description: copy.description, alternates: localizedAlternates(path, locale), openGraph: localizedOpenGraph(path, locale, title, copy.description) };
}

export default async function JournalThemePage({ params }: Props) {
  const theme = getTheme((await params).theme);
  const locale = await getLocale();
  const fr = locale === "fr";
  const config = THEMES[theme];
  const copy: GuideCopy = SITE_V1_PAGES[config.page][locale];
  const articleSlugs: readonly string[] = config.articles;
  const entries = getAllJournalEntrySummaries(locale).filter(entry => !entry.noindex && articleSlugs.includes(entry.slug));
  const canonical = `https://parrit.ai${localizedPath(`/journal/themes/${theme}`, locale)}`;
  return <main className="rev-page journal-theme" data-brand-mode="accessible">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(journalThemeJsonLd(copy, locale, canonical)).replace(/</g, "\\u003c") }}/>
    <header className="journal-theme-hero r2-dark" data-regime="ink"><div className="rev-wrap"><h1>{copy.title}</h1><p>{copy.description}</p></div></header>
    <div className="rev-wrap journal-theme-body"><div>
      {copy.brief && <section><h2>{fr ? "En bref" : "At a glance"}</h2>{copy.brief.map(([term, value]) => <p key={term}><strong>{term} : </strong>{value}</p>)}</section>}
      {config.page === "engineering-integration" && <section><h2>{fr ? "Intégrer ce qui existe. Construire ce qui manque." : "Integrate what exists. Build what is missing."}</h2>{INTEGRATION_COPY[locale].map(([title, body]) => <div key={title}><h3>{title}</h3><p>{body.charAt(0).toUpperCase() + body.slice(1)}</p></div>)}</section>}
      {copy.sections.map(([anchor, title, paragraphs]) => <section key={anchor} id={anchor}><h2>{title}</h2>{paragraphs.map(text => <p key={text}>{text}</p>)}</section>)}
      {theme === "harness-engineering" && <ul>{(fr ? ["Instructions", "Contexte", "Mémoire", "Outils", "Permissions", "Vérifications", "Supervision", "Coûts"] : ["Instructions", "Context", "Memory", "Tools", "Permissions", "Checks", "Supervision", "Costs"]).map(item => <li key={item}>{item}</li>)}</ul>}
      {copy.faq.length > 0 && <section><h2>{fr ? "Questions fréquentes" : "Frequently asked questions"}</h2>{copy.faq.map(([question, answer]) => <div key={question}><h3>{question}</h3><p>{answer}</p></div>)}</section>}
      <section><h2>Journal</h2><ol className="journal-list">{entries.map(entry => <li key={entry.slug}><Link href={localizedPath(`/journal/${entry.slug}`, locale)} hrefLang={locale}><div lang={locale}><h3>{entry.title}</h3><p>{entry.description}</p></div></Link></li>)}</ol></section>
      <BookingCall locale={locale} source={`theme-${theme}`} />
    </div></div>
  </main>;
}
