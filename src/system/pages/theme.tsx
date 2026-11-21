import { hasFrenchJournalTranslation } from "@/system/journal-translations";
import type { Metadata } from "next";
import "@/system/journal-themes.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale } from "@/lib/server/locale";
import type { Locale } from "@/system/locale";
import { getAllJournalEntrySummaries } from "@/system/journal";
import { localizedAlternates, localizedOpenGraph, localizedPath } from "@/system/locale";
import { SITE_V1_PAGES, type GuideCopy } from "@/system/site-v1-pages";
import { JOURNAL_THEMES as THEMES } from "@/system/journal-themes";
import { journalThemeJsonLd } from "@/system/jsonld";
import { BookingCall } from "@/system/components/BookingCall";
import { BrandConnector } from "@/system/components/BrandConnector";
import { BOOKING_COPY } from "@/system/booking";
import { avecSource } from "@/lib/registry/cta";


type Theme = keyof typeof THEMES;
// Keep existing inbound fragment links at the relevant part of the shared plan.
const LEGACY_ANCHORS = {
  "ai-sprints": { cases: ["scoping"], steps: ["construction", "evaluation", "decision"], rules: ["limits"] },
  "harness-engineering": { cases: ["problem", "interventions", "existing"], steps: ["harness", "evaluation"], rules: ["limits"] },
  "integration-developpement": { cases: ["custom"], steps: ["integrations"], rules: ["harness", "governance"] },
  "conseil-transformation": { cases: ["problems"], steps: ["work", "method", "first-task"], rules: ["governance"] },
} as const;

function LegacyAnchors({ anchors }: { anchors: readonly string[] }) {
  return anchors.map(anchor => <span className="theme-anchor-alias" id={anchor} key={anchor} aria-hidden="true" />);
}
type Props = { params: Promise<{ theme: string }> };
function getTheme(theme: string): Theme {
  if (!Object.hasOwn(THEMES, theme)) notFound();
  return theme as Theme;
}

export async function generateMetadata({ params }: Props, routeLocale?: Locale): Promise<Metadata> {
  const theme = getTheme((await params).theme);
  const locale = routeLocale ?? await getLocale();
  const copy = SITE_V1_PAGES[THEMES[theme].page][locale];
  const path = `/journal/themes/${theme}`;
  const title = `${copy.title} · Parrit.ai`;
  return { title: { absolute: title }, description: copy.description, alternates: localizedAlternates(path, locale), openGraph: localizedOpenGraph(path, locale, title, copy.description) };
}

export default async function JournalThemePage({ params }: Props, routeLocale?: Locale) {
  const theme = getTheme((await params).theme);
  const locale = routeLocale ?? await getLocale();
  const fr = locale === "fr";
  const config = THEMES[theme];
  const copy: GuideCopy = SITE_V1_PAGES[config.page][locale];
  const anchors = LEGACY_ANCHORS[theme];
  const articleSlugs: readonly string[] = config.articles;
  const entries = getAllJournalEntrySummaries(locale).filter(entry => locale !== "fr" || hasFrenchJournalTranslation(entry.slug)).filter(entry => !entry.noindex && articleSlugs.includes(entry.slug));
  const canonical = `https://parrit.ai${localizedPath(`/journal/themes/${theme}`, locale)}`;
  return <main className="rev-page journal-theme" data-brand-mode="accessible">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(journalThemeJsonLd(copy, locale, canonical)).replace(/</g, "\\u003c") }}/>
    <header className="journal-theme-hero r2-dark" data-regime="ink"><div className="rev-wrap">
      <h1>{copy.title}.</h1><p>{copy.description}</p>
      <Link className="rev-button exec" href={avecSource(localizedPath("/rendez-vous", locale), `theme-${theme}-haut`)}>{BOOKING_COPY[locale].action}<BrandConnector /></Link>
    </div></header>
    <div className="rev-wrap journal-theme-body">
      <section id="cases">
        <LegacyAnchors anchors={anchors.cases} />
        <h2>{copy.cases.title}</h2><p>{copy.cases.intro}</p>
        <ul className="theme-list">{copy.cases.items.map(item => <li key={item}>{item}</li>)}</ul>
      </section>
      <section id="steps">
        <LegacyAnchors anchors={anchors.steps} />
        <h2>{copy.steps.title}</h2>
        <ol className="theme-steps">{copy.steps.items.map(([name, description]) => <li key={name}><strong>{name}</strong><p>{description}</p></li>)}</ol>
      </section>
      <section id="deliverables">
        <h2>{copy.deliverables.title}</h2>
        <div className="theme-deliverables">
          <ul className="theme-list">{copy.deliverables.items.map(item => <li key={item}>{item}</li>)}</ul>
          <aside><strong>{copy.deliverables.note[0]}</strong><p>{copy.deliverables.note[1]}</p></aside>
        </div>
      </section>
      <section id="rules">
        <LegacyAnchors anchors={anchors.rules} />
        <h2>{copy.rules.title}</h2>{copy.rules.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </section>
      <section><h2>{fr ? "Questions fréquentes" : "Common questions"}</h2><div className="home-faq">{copy.faq.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
      {entries.length > 0 && <section><h2>{fr ? "À lire dans le Journal." : "From the Journal."}</h2><ol className="journal-list">{entries.map(entry => <li key={entry.slug}><Link href={localizedPath(`/journal/${entry.slug}`, locale)} hrefLang={locale}><div lang={locale}><strong className="theme-article-title">{entry.title}</strong><p>{entry.description}</p></div></Link></li>)}</ol></section>}
      <BookingCall locale={locale} source={`theme-${theme}`} variant={theme} />
    </div>
  </main>;
}

export function generateStaticParams() { return Object.keys(THEMES).map(theme => ({ theme })); }
