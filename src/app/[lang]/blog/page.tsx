import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/shell/SiteHeader";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { Breadcrumb, type Miette } from "@/components/shell/Breadcrumb";
import { EtatVide } from "@/components/EtatVide";
import { JsonLd, ListeIndex, PageBody, type EntreeIndex } from "@/components/templates";
import { Label, TextLink } from "@/components/ds/primitives";
import { breadcrumbList, graphe } from "@/lib/seo/jsonld";
import { getAllPosts, type BlogLocale } from "@/lib/blog";
import { getPillars } from "@/lib/pillars";
import { getDictionary, hasLocale, locales, type Locale } from "../dictionaries";
import { LIBELLES } from "../pilote-libelles";

/**
 * INDEX DU BLOG.
 *
 * ARBITRAGE PAUL DU 02/08/2026 — chaque carte mène DIRECTEMENT à l'article,
 * jamais à une page intermédiaire. Une carte, une action : « Lire l'article ».
 *
 * Les deux cartes de RESSOURCES qui figuraient ici ont été retirées : leur
 * contenu était recopié à la main dans ce fichier alors qu'elles vivent au
 * registre, et elles paraissent déjà à l'index des ressources. Elles gardent
 * exactement la même URL — aucun lien entrant n'est cassé.
 *
 * La page est reconstruite avec les primitives et les tokens canoniques : elle
 * n'écrit ni couleur, ni taille de police, ni rayon.
 */

const SITE_URL = "https://parrit.ai";
const contentAlternateLocales = locales.filter((locale) => locale !== "zh-CN");

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Le contenu du blog n'est pas traduit en zh-CN : on sert l'anglais, la chrome reste en zh.
function toContentLocale(lang: string): BlogLocale {
  return (lang === "zh-CN" ? "en" : lang) as BlogLocale;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const dict = await getDictionary(lang as Locale);
  const m = dict.blog.meta;

  return {
    metadataBase: new URL(SITE_URL),
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `${SITE_URL}/${lang}/blog`,
      languages: Object.fromEntries([
        ...contentAlternateLocales.map((l) => [l, `${SITE_URL}/${l}/blog`]),
        ["x-default", `${SITE_URL}/fr/blog`],
      ]),
    },
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      url: `${SITE_URL}/${lang}/blog`,
      siteName: "Parrit.ai",
      locale: dict.meta.ogLocale,
      type: "website",
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Parrit.ai : diagnostic IA avant transformation",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.ogTitle,
      description: m.ogDescription,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

function formatDate(iso: string, dateLocale: string): string {
  return new Date(iso).toLocaleDateString(dateLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const l = LIBELLES[lang] ?? LIBELLES.fr;
  const posts = getAllPosts(toContentLocale(lang));
  const pillars = getPillars();

  const entreesSujets: EntreeIndex[] = pillars.map((pillar) => {
    const pl =
      lang === "zh-CN"
        ? pillar.translations["en"]
        : pillar.translations[(lang as "fr" | "en" | "pt-BR") ?? "fr"] ??
          pillar.translations["fr"];
    return {
      cle: `sujet-${pillar.slug}`,
      href: `/${lang}/blog/sujet/${pillar.slug}`,
      titre: pl.title,
      resume: pl.description,
      meta: [pillar.keyword],
      action: l.index.lireSujet,
    };
  });

  const entreesArticles: EntreeIndex[] = posts.map((post) => ({
    cle: post.slug,
    // La destination finale, en un clic : l'article lui-même.
    href: `/${lang}/blog/${post.slug}`,
    titre: post.title,
    resume: post.description,
    meta: [post.category, formatDate(post.date, dict.blogListDateLocale), post.readingTime],
    action: l.index.lireArticle,
  }));

  const miettes: Miette[] = [
    { nom: "Parrit.ai", href: `/${lang}` },
    { nom: l.blog, href: `/${lang}/blog` },
  ];

  const noeuds: object[] = [
    {
      "@type": "Blog",
      "@id": `${SITE_URL}/${lang}/blog#blog`,
      name: "Blog Parrit.ai",
      url: `${SITE_URL}/${lang}/blog`,
      description: dict.blog.meta.schemaDescription,
      inLanguage: lang,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: posts.length,
        itemListElement: posts.map((post, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: post.title,
          item: `${SITE_URL}/${lang}/blog/${post.slug}`,
        })),
      },
    },
    breadcrumbList(miettes),
  ];

  return (
    <>
      <JsonLd json={graphe(noeuds)} />
      <SiteHeader lang={lang} variante="lean" ctaId="rdv.paul" source="blog" />

      <PageBody largeur="content">
        <Breadcrumb miettes={miettes} />

        <header style={{ paddingBlock: "var(--space-7)" }}>
          <h1
            style={{
              margin: 0,
              maxWidth: "var(--container-text)",
              fontFamily: "var(--type-display-primary)",
              fontSize: "var(--type-display-hero)",
              fontWeight: 600,
              letterSpacing: "var(--type-tracking-display)",
              lineHeight: "var(--type-leading-display)",
              color: "var(--color-ink-default)",
              textWrap: "balance",
            }}
          >
            {dict.blog.headerTitleMain} {dict.blog.headerTitleAccent}
          </h1>
          <p
            style={{
              margin: "var(--space-5) 0 0",
              maxWidth: "var(--container-text)",
              fontFamily: "var(--type-ui-primary)",
              fontSize: "var(--type-size-lg)",
              lineHeight: "var(--type-leading-body)",
              color: "var(--color-ink-muted)",
            }}
          >
            {dict.blog.headerSubtitle}
          </p>
        </header>

        {entreesSujets.length > 0 && (
          <section style={{ paddingBlock: "var(--space-section-sm)", display: "grid", gap: "var(--space-5)" }}>
            <Label>{l.index.sujets}</Label>
            <ListeIndex entrees={entreesSujets} />
          </section>
        )}

        {entreesArticles.length > 0 ? (
          <section style={{ paddingBlock: "var(--space-section-sm)", display: "grid", gap: "var(--space-5)" }}>
            <Label>{l.index.articles}</Label>
            <ListeIndex entrees={entreesArticles} />
          </section>
        ) : (
          <EtatVide
            label={l.blog}
            titre={dict.blog.headerTitleMain}
            explication={dict.blog.headerSubtitle}
            sortie={<TextLink href={`/${lang}/ressources`}>{l.ressources.nav}</TextLink>}
          />
        )}
      </PageBody>

      <SiteFooter lang={lang} />
    </>
  );
}
