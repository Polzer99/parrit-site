import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { T1Article } from "@/components/templates/T1Article";
import { getPostBySlug, getAllSlugs, getRelatedPosts, type BlogLocale } from "@/lib/blog";
import { getPillar } from "@/lib/pillars";
import { getRessource } from "@/lib/registry";
import { getVideosParArticle } from "@/lib/videos";
import { getMentionsParArticle } from "@/lib/presse";
import { SITE_URL } from "@/lib/seo/jsonld";
import { getDictionary, hasLocale, locales, type Locale } from "../../dictionaries";
import { LIBELLES } from "../../pilote-libelles";

const contentAlternateLocales = locales.filter((locale) => locale !== "zh-CN");

/**
 * PAGE ARTICLE, rendue par le template canonique T1.
 *
 * L'URL, le canonical, les hreflang et le graphe `BlogPosting` sont identiques à
 * l'implémentation précédente : aucune adresse ne bouge, aucun signal SEO n'est
 * perdu. Ce qui change, c'est ce qui portait la dette :
 *
 *   - les rayons 4px et 6px codés en dur disparaissent (le canon dit 0) ;
 *   - l'en-tête maison `.blog-nav` devient `SiteHeader variant="lean"` ;
 *   - le CTA de pied de page pointait `/rendez-vous` SANS `?source=`, donc sans
 *     attribution possible. Il passe par le registre, qui pose la source.
 *
 * Et surtout : l'article devient un noeud du maillage. Il relie sa thématique,
 * son auteur, sa ressource, ses vidéos et ses mentions presse. Chacune de ces
 * collections peut être vide, auquel cas rien ne s'affiche et rien n'est inventé.
 */

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

// Le contenu n'est pas traduit en zh-CN : repli sur l'anglais, chrome en zh.
function toContentLocale(lang: string): BlogLocale {
  return (lang === "zh-CN" ? "en" : lang) as BlogLocale;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};

  const post = getPostBySlug(slug, toContentLocale(lang));
  if (!post) return {};

  const dict = await getDictionary(lang as Locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: `${post.title} | Parrit.ai`,
    description: post.description,
    authors: [{ name: post.author }],
    alternates: {
      canonical: `${SITE_URL}/${lang}/blog/${post.slug}`,
      languages: Object.fromEntries([
        ...contentAlternateLocales.map((l) => [l, `${SITE_URL}/${l}/blog/${post.slug}`]),
        ["x-default", `${SITE_URL}/fr/blog/${post.slug}`],
      ]),
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/${lang}/blog/${post.slug}`,
      siteName: "Parrit.ai",
      locale: dict.meta.ogLocale,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Parrit.ai",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

function slugifyHeading(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Pose les ancres sur les h2 et construit le sommaire. Logique conservée. */
function withHeadingAnchors(html: string): {
  html: string;
  toc: { id: string; texte: string }[];
} {
  const toc: { id: string; texte: string }[] = [];
  const idCounts: Record<string, number> = {};

  const result = html.replace(
    /<h2([^>]*)>([\s\S]*?)<\/h2>/g,
    (_match, attrs: string, inner: string) => {
      const texte = inner.replace(/<[^>]+>/g, "").trim();
      let id = slugifyHeading(texte);
      if (idCounts[id] !== undefined) {
        idCounts[id]++;
        id = `${id}-${idCounts[id]}`;
      } else {
        idCounts[id] = 0;
      }
      toc.push({ id, texte });
      return `<h2 id="${id}"${attrs}>${inner}</h2>`;
    },
  );

  return { html: result, toc };
}

/**
 * La ressource proposée par un article. UNE seule, par contrat du modèle de
 * contenu. Le rattachement est explicite par pilier : pas d'heuristique sur le
 * texte, qui produirait des associations fausses et invérifiables.
 */
const RESSOURCE_PAR_PILIER: Record<string, string> = {
  "agents-ia": "architecture-claude-md",
  "formation-agents-ia": "demarrer-claude-code",
  "logiciel-ia-sur-mesure": "harnais-ia",
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const post = getPostBySlug(slug, toContentLocale(lang));
  if (!post) notFound();

  const l = LIBELLES[lang] ?? LIBELLES.fr;
  const related = getRelatedPosts(post.slug, toContentLocale(lang), 3);
  const pillar = post.pillar ? getPillar(post.pillar) : undefined;
  const { html, toc } = withHeadingAnchors(post.content);

  const ressource = post.pillar
    ? getRessource(RESSOURCE_PAR_PILIER[post.pillar] ?? "")
    : undefined;

  /* Collections rattachées. Vides aujourd'hui : rien ne s'affiche, et aucune
     carte de remplissage n'est fabriquée. */
  const videos = getVideosParArticle(post.slug);
  const mentions = getMentionsParArticle(post.slug);

  const lies = [
    ...related.map((r) => ({
      slug: r.slug,
      href: `/${lang}/blog/${r.slug}`,
      titre: r.title,
      meta: `${r.readingTime} · ${r.date}`,
      categorie: r.category,
    })),
    ...videos.map((v) => ({
      slug: v.slug,
      href: `/${lang}/videos/${v.slug}`,
      titre: v.titre,
      meta: v.media.publicationDate,
      categorie: l.videos.nav,
    })),
    ...mentions.map((m) => ({
      slug: m.slug,
      href: `/${lang}/presse/${m.slug}`,
      titre: m.titre,
      meta: `${m.media} · ${m.date}`,
      categorie: l.presse.nav,
    })),
  ];

  return (
    <T1Article
      lang={lang}
      ctaId="rdv.paul"
      ressourceHref={ressource ? `/${lang}/ressources/${ressource.slug}` : undefined}
      ressourceTitre={ressource?.titre}
      data={{
        slug: post.slug,
        titre: post.title,
        description: post.description,
        corps: html,
        sommaire: toc,
        datePubliee: post.date,
        dateModifiee: post.updatedAt,
        auteur: {
          nom: post.author,
          slug: "paul-larmaraud",
          role: "Fondateur, Parrit.ai",
        },
        categorie: post.category,
        tempsLecture: post.readingTime,
        tldr: post.tldr,
        faq: post.faq,
        sources: post.sources ? [...post.sources] : undefined,
        articlesLies: lies,
        themeHref: pillar ? `/${lang}/blog/sujet/${pillar.slug}` : undefined,
        themeNom: pillar?.keyword,
      }}
      labels={{
        blog: l.blog,
        tldr: l.article.tldr,
        sommaire: l.article.sommaire,
        faq: l.article.faq,
        sources: l.article.sources,
        lireEnsuite: l.article.lireEnsuite,
        voirProfil: l.article.voirProfil,
      }}
    />
  );
}
