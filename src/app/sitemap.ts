import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/blog";
import { locales } from "@/app/[lang]/dictionaries";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://parrit.ai";

const STATIC_ROUTES = [
  { path: "", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "/sprint", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/audit-claude-code", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/setup-claude-code", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/remote", changeFrequency: "monthly" as const, priority: 0.85 },
  { path: "/blog", changeFrequency: "weekly" as const, priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const buildLanguagesMap = (route: string): Record<string, string> => {
    const map: Record<string, string> = {};
    locales.forEach((lang) => {
      map[lang] = `${SITE_URL}/${lang}${route}`;
    });
    map["x-default"] = `${SITE_URL}/fr${route}`;
    return map;
  };

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap(
    ({ path, changeFrequency, priority }) =>
      locales.map((lang) => ({
        url: `${SITE_URL}/${lang}${path}`,
        lastModified,
        changeFrequency,
        priority,
        alternates: {
          languages: buildLanguagesMap(path),
        },
      })),
  );

  const blogSlugs = getAllSlugs();
  const blogEntries: MetadataRoute.Sitemap = blogSlugs.flatMap((slug) =>
    locales.map((lang) => ({
      url: `${SITE_URL}/${lang}/blog/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: buildLanguagesMap(`/blog/${slug}`),
      },
    })),
  );

  return [...staticEntries, ...blogEntries];
}
