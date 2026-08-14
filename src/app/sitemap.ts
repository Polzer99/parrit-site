import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { getAllBlogSitemapEntries } from "@/lib/blog";
import { getAllLaunchSitemapEntries } from "@/lib/launches";
import { getAllActualiteSitemapEntries } from "@/lib/actualite";
import { getPillars } from "@/lib/pillars";
import { etatCollection } from "@/lib/collections";
import { getVideos } from "@/lib/videos";
import { getMentions } from "@/lib/presse";
import { aliasRessourcesARediriger, getRessourcesRenduesParTemplate } from "@/lib/registry";
import { getPostsByPillar } from "@/lib/blog";
import { locales, type Locale } from "@/app/[lang]/dictionaries";
import { getAllJournalEntrySummaries } from "@/system/journal";

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
  { path: "/rendez-vous", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/ressources", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/launches", changeFrequency: "weekly" as const, priority: 0.85 },
  { path: "/actualite", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/glossaire", changeFrequency: "weekly" as const, priority: 0.85 },
  { path: "/auteur/paul-larmaraud", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/mentions-legales", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/confidentialite", changeFrequency: "yearly" as const, priority: 0.3 },
];

const REV01_PUBLIC_ROUTES = [
  { path: "", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "/standard", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/commission", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/legal", changeFrequency: "yearly" as const, priority: 0.3 },
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

  const rev01PublicEntries: MetadataRoute.Sitemap = REV01_PUBLIC_ROUTES.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency,
      priority,
    }),
  );

  /* UNE seule URL par ressource au sitemap : celle qui rend l'expérience.
     Les ressources servies par une route dédiée sont déjà présentes à leur URL
     canonique — les réinscrire sous `/[lang]/ressources/[slug]` fabriquerait le
     doublon indexable que l'arbitrage du 02/08/2026 supprime, et pointerait de
     surcroît vers une 301. */
  const ressourceEntries: MetadataRoute.Sitemap = getRessourcesRenduesParTemplate().flatMap((r) =>
    locales.map((lang) => ({
      url: `${SITE_URL}/${lang}/ressources/${r.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
      alternates: { languages: buildLanguagesMap(`/ressources/${r.slug}`) },
    })),
  );

  /* Vidéo et presse n'entrent au sitemap QUE si elles contiennent au moins un
     élément publié. Zéro élément = la collection n'existe pas encore pour le
     public. Le passage de zéro à un suffit, sans toucher à ce fichier. */
  const collectionsConditionnelles: MetadataRoute.Sitemap = [
    { chemin: "/videos", etat: etatCollection(getVideos()) },
    { chemin: "/presse", etat: etatCollection(getMentions()) },
  ]
    .filter((c) => c.etat.eligible)
    .flatMap((c) =>
      locales.map((lang) => ({
        url: `${SITE_URL}/${lang}${c.chemin}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
        alternates: { languages: buildLanguagesMap(c.chemin) },
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

  const launchPosts = getAllLaunchSitemapEntries();
  const launchEntries: MetadataRoute.Sitemap = launchPosts.flatMap((launch) =>
    locales.map((lang) => ({
      url: `${SITE_URL}/${lang}/launches/${launch.slug}`,
      lastModified: new Date(launch.lastModified),
      changeFrequency: "monthly" as const,
      priority: 0.75,
      alternates: {
        languages: buildLanguagesMap(`/launches/${launch.slug}`),
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

  // Seuls les piliers avec au moins un article (cluster non vide) entrent au sitemap.
  const pillarEntries: MetadataRoute.Sitemap = getPillars()
    .filter((pillar) => getPostsByPillar(pillar.slug, "fr").length > 0)
    .flatMap((pillar) =>
    locales.map((lang) => ({
      url: `${SITE_URL}/${lang}/blog/sujet/${pillar.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: buildLanguagesMap(`/blog/sujet/${pillar.slug}`),
      },
    })),
  );

  /* Les expériences servies par une route dédiée, hors routing `[lang]`. Elles
     sont DÉRIVÉES du registre, plus recopiées : publier une ressource suffit à
     la faire entrer au sitemap à son URL canonique, et à une seule. */
  const resourceEntries: MetadataRoute.Sitemap = aliasRessourcesARediriger().map(({ url }) => ({
    url: `${SITE_URL}${url}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const journalEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/journal`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...getAllJournalEntrySummaries().map((entry) => ({
      url: `${SITE_URL}/journal/${entry.slug}`,
      lastModified: new Date(entry.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return [
    ...rev01PublicEntries,
    ...staticEntries,
    ...resourceEntries,
    ...ressourceEntries,
    ...collectionsConditionnelles,
    ...blogEntries,
    ...launchEntries,
    ...actualiteEntries,
    ...glossaryEntries,
    ...pillarEntries,
    ...journalEntries,
  ];
}
