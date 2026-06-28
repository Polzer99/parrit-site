import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { getAllBlogSitemapEntries } from "@/lib/blog";
import { getAllActualiteSitemapEntries } from "@/lib/actualite";
import { locales, type Locale } from "@/app/[lang]/dictionaries";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://parrit.ai";

const STATIC_ROUTES = [
  { path: "", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "/masterclass-ia", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/masterclass-metier", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/sessions-mcp", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/audit", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/deploiement-agents", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/outils-agentiques", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/optimisation-flotte", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/deployer", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/croissance", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/transmettre", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/setup-claude-code", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/remote", changeFrequency: "monthly" as const, priority: 0.85 },
  { path: "/blog", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/actualite", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/glossaire", changeFrequency: "weekly" as const, priority: 0.85 },
  { path: "/auteur/paul-larmaraud", changeFrequency: "monthly" as const, priority: 0.7 },
];

type GlossaryIndex = {
  articles: { slug: string; langs: Locale[] }[];
};

function loadGlossaryIndex(): GlossaryIndex {
  try {
    const file = path.join(process.cwd(), "content", "glossaire", "index.json");
    return JSON.parse(fs.readFileSync(file, "utf-8")) as GlossaryIndex;
  } catch {
    return { articles: [] };
  }
}

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

  const blogPosts = getAllBlogSitemapEntries();
  const blogEntries: MetadataRoute.Sitemap = blogPosts.flatMap((post) =>
    locales.map((lang) => ({
      url: `${SITE_URL}/${lang}/blog/${post.slug}`,
      lastModified: new Date(post.lastModified),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: buildLanguagesMap(`/blog/${post.slug}`),
      },
    })),
  );

  const actualitePosts = getAllActualiteSitemapEntries();
  const actualiteEntries: MetadataRoute.Sitemap = actualitePosts.flatMap((post) =>
    locales.map((lang) => ({
      url: `${SITE_URL}/${lang}/actualite/${post.slug}`,
      lastModified: new Date(post.lastModified),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: buildLanguagesMap(`/actualite/${post.slug}`),
      },
    })),
  );

  const glossaryIndex = loadGlossaryIndex();
  const glossaryEntries: MetadataRoute.Sitemap = glossaryIndex.articles.flatMap((a) =>
    a.langs.map((lang) => ({
      url: `${SITE_URL}/${lang}/glossaire/${a.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.75,
      alternates: {
        languages: Object.fromEntries(
          a.langs.map((l) => [l, `${SITE_URL}/${l}/glossaire/${a.slug}`]),
        ),
      },
    })),
  );

  return [...staticEntries, ...blogEntries, ...actualiteEntries, ...glossaryEntries];
}
