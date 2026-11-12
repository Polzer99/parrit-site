import type { MetadataRoute } from "next";
import { isTranslatedPath, localizedAlternates, localizedPath } from "@/system/locale";
import { getAllJournalEntrySummaries } from "@/system/journal";
import { JOURNAL_THEMES_LAST_MODIFIED } from "@/system/journal-themes";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://parrit.ai";

const REV01_PUBLIC_ROUTES = [
  ...["harness-engineering", "ai-sprints", "integration-developpement", "conseil-transformation"].map(theme => ({ path: `/journal/themes/${theme}`, lastModified: JOURNAL_THEMES_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.8 })),
  { path: "", lastModified: "2026-11-03", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "/legal", lastModified: "2026-09-02", changeFrequency: "yearly" as const, priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = getAllJournalEntrySummaries();

  const rev01PublicEntries: MetadataRoute.Sitemap = REV01_PUBLIC_ROUTES.flatMap(
    ({ path, changeFrequency, priority, lastModified }) => (["en", "fr"] as const).map((locale) => ({
      url: `${SITE_URL}${localizedPath(path || "/", locale)}`,
      alternates: { languages: Object.fromEntries(Object.entries(localizedAlternates(path || "/", locale).languages).map(([lang, url]) => [lang, `${SITE_URL}${url}`])) },
      lastModified,
      changeFrequency,
      priority,
    })),
  );

  const journalEntries: MetadataRoute.Sitemap = [
    ...(["en", "fr"] as const).map((locale) => ({
      url: `${SITE_URL}${localizedPath("/journal", locale)}`,
      alternates: { languages: Object.fromEntries(Object.entries(localizedAlternates("/journal", locale).languages).map(([lang, url]) => [lang, `${SITE_URL}${url}`])) },
      lastModified: entries[0]?.date,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...entries.filter((entry) => !entry.noindex).flatMap((entry) => {
      const path = `/journal/${entry.slug}`;
      const locales = isTranslatedPath(path) ? ["en", "fr"] as const : ["en"] as const;
      return locales.map(locale => ({
        url: `${SITE_URL}${localizedPath(path, locale)}`,
        alternates: { languages: Object.fromEntries(Object.entries(localizedAlternates(path, locale).languages).map(([lang, url]) => [lang, `${SITE_URL}${url}`])) },
        lastModified: new Date(entry.updatedAt ?? entry.date),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }),
  ];

  return [
    ...rev01PublicEntries,
    ...journalEntries,
  ];
}
