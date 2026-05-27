import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "./dictionaries";
import { getAllSlugs, getPostBySlug, type BlogLocale } from "@/lib/blog";
import HomeClient, { type FeaturedPost } from "./HomeClient";

const FEATURED_SLUGS = [
  "crm-automatise-pme-artisans",
  "prospection-ia-signaux-podcasts-linkedin",
  "facturation-automatique-ia-pme",
  "veille-juridique-automatisee-avocats",
];

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  // Featured posts — blog content available only in FR/EN/PT-BR; fall back to EN for zh-CN
  const blogLang: BlogLocale = lang === "zh-CN" ? "en" : (lang as BlogLocale);
  const allSlugs = getAllSlugs();
  const featuredPosts: FeaturedPost[] = FEATURED_SLUGS.filter((s) => allSlugs.includes(s))
    .map((slug) => {
      const post = getPostBySlug(slug, blogLang);
      if (!post) return null;
      return {
        slug: post.slug,
        title: post.title,
        description: post.description,
        category: post.category,
        readingTime: post.readingTime,
        date: post.date,
      };
    })
    .filter((p): p is FeaturedPost => p !== null);

  return <HomeClient dict={dict} lang={lang as Locale} featuredPosts={featuredPosts} />;
}
