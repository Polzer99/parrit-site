import { actualitePosts } from "./actualite-generated";
import type { BlogLocale, BlogPost, BlogPostSource, BlogSitemapEntry } from "./blog";

export type { BlogLocale } from "./blog";

function toActualitePost(src: BlogPostSource, locale: BlogLocale): BlogPost {
  const t = src.translations[locale];
  return {
    slug: src.slug,
    date: src.date,
    publishedAt: src.publishedAt ?? src.date,
    updatedAt: src.updatedAt ?? src.date,
    author: src.author,
    videoUrl: src.videoUrl,
    ogImage: src.ogImage,
    tags: src.tags,
    relatedSlugs: src.relatedSlugs,
    title: t.title,
    description: t.description,
    category: t.category,
    readingTime: t.readingTime,
    content: t.content,
  };
}

function isPublished(src: BlogPostSource): boolean {
  const publishDate = new Date(src.publishedAt ?? src.date);
  return publishDate.getTime() <= Date.now();
}

export function getAllActualitePosts(locale: BlogLocale = "fr"): BlogPost[] {
  return actualitePosts
    .filter(isPublished)
    .map((p) => toActualitePost(p, locale))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getActualitePostBySlug(
  slug: string,
  locale: BlogLocale = "fr",
): BlogPost | undefined {
  const src = actualitePosts.find((p) => p.slug === slug);
  if (!src || !isPublished(src)) return undefined;
  return toActualitePost(src, locale);
}

export function getAllActualiteSlugs(): string[] {
  return actualitePosts.filter(isPublished).map((p) => p.slug);
}

export function getAllActualiteSitemapEntries(): BlogSitemapEntry[] {
  return actualitePosts.filter(isPublished).map((p) => ({
    slug: p.slug,
    lastModified: p.updatedAt ?? p.publishedAt ?? p.date,
  }));
}
