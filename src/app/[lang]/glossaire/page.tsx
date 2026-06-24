import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { hasLocale, locales, type Locale } from "../dictionaries";

const SITE_URL = "https://parrit.ai";
const CONTENT_DIR = path.join(process.cwd(), "content", "glossaire");

type IndexFile = {
  articles: { slug: string; category: string; langs: Locale[]; published_at: string }[];
};

type ArticleLang = {
  title: string;
  subtitle: string;
};

function loadIndex(): IndexFile {
  try {
    return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "index.json"), "utf-8")) as IndexFile;
  } catch {
    return { articles: [] };
  }
}

function loadArticleTitle(slug: string, lang: Locale): ArticleLang | null {
  try {
    const file = path.join(CONTENT_DIR, `${slug}.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    return (data.langs?.[lang] as ArticleLang) || null;
  } catch {
    return null;
  }
}

const STRINGS: Record<Locale, { title: string; subtitle: string; pageTitle: string; pageDesc: string }> = {
  fr: {
    title: "Glossaire opérationnel",
    subtitle: "Réponses concrètes aux questions des dirigeants sur les agents, les LLM, et l'intégration en entreprise. Pas de jargon, pas de hype. Mis à jour chaque semaine.",
    pageTitle: "Glossaire IA en entreprise · Définitions concrètes · Parrit",
    pageDesc: "Glossaire opérationnel pour dirigeants : agents IA, LLM, intégration en entreprise. Définitions, cas d'usage, retours terrain. Mis à jour chaque semaine.",
  },
  en: {
    title: "Operational glossary",
    subtitle: "Concrete answers to executive questions about AI agents, LLMs, and enterprise integration. No jargon, no hype. Updated weekly.",
    pageTitle: "Enterprise AI Glossary · Concrete definitions · Parrit",
    pageDesc: "Operational glossary for executives: AI agents, LLMs, enterprise integration. Definitions, use cases, field reports. Updated weekly.",
  },
  "pt-BR": {
    title: "Glossário operacional",
    subtitle: "Respostas concretas às perguntas de diretorias sobre agentes de IA, LLMs, e integração em empresas. Sem jargão, sem hype. Atualizado toda semana.",
    pageTitle: "Glossário de IA empresarial · Definições concretas · Parrit",
    pageDesc: "Glossário operacional para diretorias: agentes de IA, LLMs, integração em empresas. Definições, casos de uso, retornos de campo. Atualizado toda semana.",
  },
  "zh-CN": {
    title: "运营术语表",
    subtitle: "针对企业领导关于 AI 代理、大语言模型与企业集成问题的具体回答。无术语堆砌，无炒作。每周更新。",
    pageTitle: "企业 AI 术语表 · 具体定义 · Parrit",
    pageDesc: "面向企业领导的运营术语表：AI 代理、大语言模型、企业集成。定义、应用案例、实战反馈。每周更新。",
  },
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const s = STRINGS[lang as Locale];
  const languagesMap: Record<string, string> = { "x-default": `${SITE_URL}/fr/glossaire` };
  for (const l of locales) languagesMap[l] = `${SITE_URL}/${l}/glossaire`;
  return {
    metadataBase: new URL(SITE_URL),
    title: s.pageTitle,
    description: s.pageDesc,
    alternates: { canonical: `${SITE_URL}/${lang}/glossaire`, languages: languagesMap },
    openGraph: {
      title: s.pageTitle,
      description: s.pageDesc,
      url: `${SITE_URL}/${lang}/glossaire`,
      siteName: "Parrit.ai",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Parrit.ai : l'IA qui agit pour vous, en 14 jours",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: s.pageTitle,
      description: s.pageDesc,
      images: [`${SITE_URL}/opengraph-image`],
    },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const idx = loadIndex();
  const s = STRINGS[lang as Locale];

  const articles = idx.articles
    .filter((a) => a.langs.includes(lang as Locale))
    .map((a) => ({ ...a, data: loadArticleTitle(a.slug, lang as Locale) }))
    .filter((a) => a.data);

  return (
    <main style={{ maxWidth: 880, margin: "0 auto", padding: "120px 24px 80px", color: "var(--text)" }}>
      <header style={{ marginBottom: 56 }}>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(36px, 5vw, 52px)",
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 20,
          }}
        >
          {s.title}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 18,
            lineHeight: 1.55,
            color: "var(--text-muted)",
            fontWeight: 300,
            maxWidth: 640,
          }}
        >
          {s.subtitle}
        </p>
      </header>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 28 }}>
        {articles.length === 0 && (
          <li
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              color: "var(--text-muted)",
              fontStyle: "italic",
            }}
          >
            Aucun article publié pour cette langue.
          </li>
        )}
        {articles.map((a) => (
          <li key={a.slug} style={{ paddingBottom: 28, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
            <Link href={`/${lang}/glossaire/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--parrit-red)",
                  marginBottom: 8,
                  fontWeight: 500,
                  fontFamily: "var(--font-body)",
                }}
              >
                {a.category}
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 24,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  margin: "0 0 8px 0",
                }}
              >
                {a.data!.title}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "var(--text-muted)",
                  fontWeight: 300,
                  margin: 0,
                }}
              >
                {a.data!.subtitle}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
