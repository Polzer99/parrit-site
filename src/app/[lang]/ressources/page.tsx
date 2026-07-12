import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, locales } from "../dictionaries";

const SITE_URL = "https://parrit.ai";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

type UI = {
  metaTitle: string;
  metaDesc: string;
  label: string;
  titleMain: string;
  titleAccent: string;
  subtitle: string;
  navBlog: string;
  navRes: string;
};

const UISTR: Record<string, UI> = {
  fr: {
    metaTitle: "Ressources · Parrit.ai",
    metaDesc:
      "Les guides et ressources gratuites de Parrit.ai pour piloter votre entreprise avec des agents IA. Actionnables, sans code, pour ceux qui dirigent.",
    label: "Ressources gratuites",
    titleMain: "Des guides pour",
    titleAccent: "passer à l'action",
    subtitle:
      "Ce qu'on déploie chez nos clients, mis à votre portée. Actionnable, sans code, pour ceux qui dirigent.",
    navBlog: "Blog",
    navRes: "Ressources",
  },
  en: {
    metaTitle: "Resources · Parrit.ai",
    metaDesc:
      "Free guides and resources from Parrit.ai to run your business with AI agents. Actionable, no code, for people who lead.",
    label: "Free resources",
    titleMain: "Guides to",
    titleAccent: "take action",
    subtitle:
      "What we deploy for our clients, made available to you. Actionable, no code, for people who lead.",
    navBlog: "Blog",
    navRes: "Resources",
  },
  "pt-BR": {
    metaTitle: "Recursos · Parrit.ai",
    metaDesc:
      "Guias e recursos gratuitos da Parrit.ai para gerenciar sua empresa com agentes de IA. Práticos, sem código, para quem lidera.",
    label: "Recursos gratuitos",
    titleMain: "Guias para",
    titleAccent: "agir",
    subtitle:
      "O que implantamos para nossos clientes, ao seu alcance. Prático, sem código, para quem lidera.",
    navBlog: "Blog",
    navRes: "Recursos",
  },
  "zh-CN": {
    metaTitle: "资源 · Parrit.ai",
    metaDesc:
      "Parrit.ai 免费指南与资源，用智能体运营你的业务。可落地、无需编程，面向管理者。",
    label: "免费资源",
    titleMain: "行动",
    titleAccent: "指南",
    subtitle: "我们为客户部署的一切，触手可及。可落地、无需编程，面向管理者。",
    navBlog: "博客",
    navRes: "资源",
  },
};

type Ressource = {
  href: string;
  cat: Record<string, string>;
  time: Record<string, string>;
  title: Record<string, string>;
  desc: Record<string, string>;
  cta: Record<string, string>;
};

const RESSOURCES: Ressource[] = [
  {
    href: "/demarrer-claude-code",
    cat: {
      fr: "Guide · Démarrage",
      en: "Guide · Getting started",
      "pt-BR": "Guia · Início",
      "zh-CN": "指南 · 入门",
    },
    time: {
      fr: "20 min pour démarrer",
      en: "20 min to start",
      "pt-BR": "20 min para começar",
      "zh-CN": "20 分钟上手",
    },
    title: {
      fr: "Démarrer avec Claude Code : piloter votre boîte avec des agents",
      en: "Getting started with Claude Code: run your business with agents",
      "pt-BR": "Comece com Claude Code: gerencie sua empresa com agentes",
      "zh-CN": "上手 Claude Code：用智能体运营你的业务",
    },
    desc: {
      fr: "Le guide pas à pas pour dirigeants, sans code. Installer Claude Code, brancher votre boîte mail, déléguer votre première vraie tâche. Toutes les commandes à copier et le fichier de pilotage à télécharger.",
      en: "The step-by-step guide for leaders, no code. Install Claude Code, connect your inbox, delegate your first real task. Every command to copy and the pilot file to download.",
      "pt-BR": "O guia passo a passo para gestores, sem código. Instale o Claude Code, conecte seu e-mail, delegue sua primeira tarefa real. Todos os comandos para copiar e o arquivo de pilotagem para baixar.",
      "zh-CN": "面向管理者的分步指南，无需编程。安装 Claude Code，连接邮箱，委派第一个真实任务。所有可复制的命令与可下载的驾驶舱文件。",
    },
    cta: {
      fr: "Ouvrir le guide",
      en: "Open the guide",
      "pt-BR": "Abrir o guia",
      "zh-CN": "打开指南",
    },
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const ui = UISTR[lang] ?? UISTR.fr;
  return {
    metadataBase: new URL(SITE_URL),
    title: ui.metaTitle,
    description: ui.metaDesc,
    alternates: {
      canonical: `${SITE_URL}/${lang}/ressources`,
      languages: {
        fr: `${SITE_URL}/fr/ressources`,
        en: `${SITE_URL}/en/ressources`,
        "pt-BR": `${SITE_URL}/pt-BR/ressources`,
        "x-default": `${SITE_URL}/fr/ressources`,
      },
    },
    openGraph: {
      title: ui.metaTitle,
      description: ui.metaDesc,
      url: `${SITE_URL}/${lang}/ressources`,
      siteName: "Parrit.ai",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Parrit.ai",
        },
      ],
    },
  };
}

export default async function RessourcesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const ui = UISTR[lang] ?? UISTR.fr;

  return (
    <>
      <nav className="blog-nav">
        <Link href={`/${lang}`} className="nav-logo">
          Parrit.ai
        </Link>
        <div className="blog-nav-links">
          <Link href={`/${lang}/blog`} className="blog-nav-link">
            {ui.navBlog}
          </Link>
          <Link href={`/${lang}/ressources`} className="blog-nav-link">
            {ui.navRes}
          </Link>
        </div>
      </nav>

      <header className="blog-header">
        <p className="blog-header-label">{ui.label}</p>
        <h1 className="blog-header-title">
          {ui.titleMain} <em className="hero-accent">{ui.titleAccent}</em>
        </h1>
        <p className="blog-header-subtitle">{ui.subtitle}</p>
      </header>

      <main className="blog-list">
        {RESSOURCES.map((r, i) => (
          // Page statique gated hors routing Next (fichier public + rewrite) : lien plein-page volontaire
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <a
            key={r.href}
            href={r.href}
            className="blog-card"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="blog-card-meta">
              <span className="blog-card-category">{r.cat[lang] ?? r.cat.fr}</span>
              <span className="blog-card-dot">·</span>
              <span className="blog-card-reading">{r.time[lang] ?? r.time.fr}</span>
            </div>
            <h2 className="blog-card-title">{r.title[lang] ?? r.title.fr}</h2>
            <p className="blog-card-desc">{r.desc[lang] ?? r.desc.fr}</p>
            <span className="blog-card-read">{r.cta[lang] ?? r.cta.fr}</span>
          </a>
        ))}
      </main>

      <footer className="blog-footer">
        <p className="footer-legal" style={{ marginTop: 40 }}>
          © {new Date().getFullYear()} SASU PARRIT.AI · Rueil-Malmaison
        </p>
      </footer>
    </>
  );
}
