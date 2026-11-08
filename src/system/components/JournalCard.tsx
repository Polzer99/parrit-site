import Link from "next/link";
import type { Locale } from "@/system/locale";
import type { JournalEntrySummary } from "@/system/journal";
import { getJournalThemes } from "@/system/journal-themes";

/** One action, one canonical article; shared by the index and home. */
export function JournalCard({ entry, locale, compact = false }: {
  entry: JournalEntrySummary; locale: Locale; compact?: boolean;
}) {
  const Heading = compact ? "h3" : "h2";
  return <Link href={`/journal/${entry.slug}`} hrefLang="en">
    <div>
      <div className="journal-entry-meta">
        {getJournalThemes(entry.slug).map(theme => <span className="journal-entry-theme" key={theme.page}>{theme.label[locale]}</span>)}
        <span className="journal-reading-time">{entry.readingMinutes} {locale === "fr" ? "min de lecture" : "min read"}</span>
      </div>
      <Heading lang="en">{entry.title}</Heading>
      {!compact && <p lang="en">{entry.description}</p>}
    </div>
    <time dateTime={entry.date}>{new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${entry.date}T00:00:00Z`))}</time>
  </Link>;
}
