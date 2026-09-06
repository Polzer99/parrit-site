import type { MetadataRoute } from "next";
import { localizedAlternates, localizedPath } from "@/system/locale";
import { getAllJournalEntrySummaries } from "@/system/journal";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://parrit.ai";

const REV01_PUBLIC_ROUTES = [
  { path: "", lastModified: "2026-09-06", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "/manufacture", lastModified: "2026-09-06", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/standard", lastModified: "2026-09-06", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/dossiers", lastModified: "2026-09-06", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/commission", lastModified: "2026-09-06", changeFrequency: "monthly" as const, priority: 0.9 },
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
    ...entries.filter((entry) => !entry.noindex).map((entry) => ({
      url: `${SITE_URL}/journal/${entry.slug}`,
      lastModified: new Date(entry.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return [
    ...rev01PublicEntries,
    ...journalEntries,
  ];
}
