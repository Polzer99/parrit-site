import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { getLocale } from "@/lib/server/locale";
import type { Locale } from "@/system/locale";
import { AUTEUR } from "@/system/auteur";
import { blogPostingJsonLd, journalFaqJsonLd } from "@/system/jsonld";
import { HarnessBadge } from "@/system/components";
import { BookingCall } from "@/system/components/BookingCall";
import { getAllJournalEntrySummaries, getJournalEntry } from "@/system/journal";
import { localizedAlternates, localizedPath } from "@/system/locale";
import { hasFrenchJournalTranslation } from "@/system/journal-translations";
import { journalReadingMinutes } from "@/system/journal-reading";
import { getJournalThemes } from "@/system/journal-themes";

type JournalArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const SITE_URL = "https://parrit.ai";

function articleImageUrl(canonical: string): string {
  return `${canonical}/og`;
}

export function generateStaticParams() {
  return getAllJournalEntrySummaries().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: JournalArticlePageProps, routeLocale?: Locale): Promise<Metadata> {
  const { slug } = await params;
  const locale = routeLocale ?? await getLocale();
  const entry = getJournalEntry(slug, locale);

  if (!entry) {
    return {};
  }

  const alternates = localizedAlternates(`/journal/${entry.slug}`, locale);
  const canonical = `${SITE_URL}${alternates.canonical}`;
  const image = {
    url: articleImageUrl(`${SITE_URL}/journal/${entry.slug}`),
    width: 1200,
    height: 630,
    alt: "Parrit.ai Journal article",
  };
  return {
    title: entry.title,
    authors: [{ name: entry.author ?? AUTEUR.nom, ...(entry.author ? {} : { url: AUTEUR.url }) }],
    description: entry.description,
    alternates: { canonical, languages: Object.fromEntries(Object.entries(alternates.languages).map(([language, url]) => [language, `${SITE_URL}${url}`])) },
    openGraph: {
      title: entry.title,
      description: entry.description,
      type: "article",
      publishedTime: entry.date,
      ...(entry.updatedAt ? { modifiedTime: entry.updatedAt } : {}),
      siteName: "Parrit.ai",
      url: canonical,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      images: [image],
    },
    twitter: { card: "summary_large_image", images: [image] },
    robots: entry.noindex ? { index: false, follow: true } : undefined,
  };
}

export default async function JournalArticlePage({ params }: JournalArticlePageProps, routeLocale?: Locale) {
  const { slug } = await params;
  const locale = routeLocale ?? await getLocale();
  const entry = getJournalEntry(slug, locale);

  if (!entry) {
    notFound();
  }

  const formatDate = (date: string) => new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(date));
  const contentLocale = locale === "fr" && !entry.noindex && hasFrenchJournalTranslation(slug) ? "fr" : "en";
  const entries = getAllJournalEntrySummaries(locale).filter(entry => locale !== "fr" || hasFrenchJournalTranslation(entry.slug));
  const currentIndex = entries.findIndex((candidate) => candidate.slug === entry.slug);
  // Garder la position avant filtrage permet aussi de partir d'une entrée noindex.
  const relatedEntries = [
    ...entries.slice(currentIndex + 1),
    ...entries.slice(0, currentIndex),
  ].filter((candidate) => !candidate.noindex && candidate.slug !== entry.slug).slice(0, 3);
  const relatedLabel = locale === "fr" ? "À lire ensuite" : "Continue reading";
  // Legacy articles keep the exact historical Markdown renderer and markup.
  const machine = entry.pilier ? await import("@/system/components/JournalMachineBody") : null;
  const MachineBody = machine?.JournalMachineBody;
  const MachineFooter = machine?.JournalMachineFooter;

  return (
    <main className="rev-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingJsonLd(entry, contentLocale)).replace(/</g, "\\u003c") }}
      />
      {entry.faq?.length ? <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(journalFaqJsonLd(entry, contentLocale)).replace(/</g, "\\u003c"),
      }} /> : null}
      <article className="rev-wrap journal-article">
        <header className="journal-header">
          <p><time dateTime={entry.date}>{formatDate(entry.date)}</time></p>
          {entry.updatedAt && entry.updatedAt !== entry.date ? <p>{locale === "fr" ? "Mis à jour le " : "Updated on "}<time dateTime={entry.updatedAt}>{formatDate(entry.updatedAt)}</time></p> : null}
          <h1 lang={contentLocale}>{entry.title}</h1>
          <HarnessBadge slug={entry.slug} locale={locale} />
          {locale === "fr" && contentLocale === "en" ? <p data-language-note="">Article en anglais.</p> : null}
          {!MachineBody ? <p className="journal-deck" lang={contentLocale}>{entry.description}</p> : null}
          <div className="journal-entry-meta">
            {getJournalThemes(slug).map(theme => <span key={theme.page}>{theme.label[locale]}</span>)}
            <span>{journalReadingMinutes(entry.content)} {locale === "fr" ? "min de lecture" : "min read"}</span>
          </div>
        </header>

        <div className="journal-body" lang={contentLocale}>
          {MachineBody ? <MachineBody content={entry.content} /> : <ReactMarkdown>{entry.content}</ReactMarkdown>}
        </div>

        {entry.sources?.length ? <section className="journal-body" lang={contentLocale} aria-labelledby="journal-sources-title">
          <h2 id="journal-sources-title">Sources</h2>
          <ul>{entry.sources.map(({ label, url, publisher, published_at }, index) => <li key={index}><a href={url}>{label}</a>{publisher ? <> · {publisher}</> : null}{published_at ? <> · <time dateTime={published_at}>{published_at}</time></> : null}</li>)}</ul>
        </section> : null}

        {MachineFooter ? <MachineFooter locale={locale} contentLocale={contentLocale} slug={entry.slug} /> : <BookingCall locale={locale} source={`journal-${entry.slug}`} />}

        {relatedEntries.length > 0 ? (
          <nav className="journal-related" aria-label={relatedLabel}>

            {relatedEntries.map((related) => (
              <Link key={related.slug} href={localizedPath(`/journal/${related.slug}`, locale)}>
                <span>{related.title}</span>
                <time dateTime={related.date}>{formatDate(related.date)}</time>
              </Link>
            ))}
          </nav>
        ) : null}


      </article>
    </main>
  );
}
