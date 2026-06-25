import Link from "next/link";

/* eslint-disable @next/next/no-img-element */

import type { Locale } from "@/app/[lang]/dictionaries";
import type { MaturiteLevel, MaturiteSlug } from "@/lib/maturite";

export interface OnePagerProps {
  level: MaturiteLevel;
  eyebrow: string;
  h1: string;
  sub: string;
  phrase: string;
  ctaLabel: string;
  ctaHref: string;
  stories: {
    title: string;
    person: string;
    before: string;
    after: string;
    result: string;
    logo?: { src: string; alt: string };
  }[];
  forWho: string[];
  deliverables: string[];
  steps: { title: string; body: string }[];
  proof?: string;
  price: string;
  priceNote?: string;
  lang: Locale;
}

type OnePagerStory = OnePagerProps["stories"][number];

type OnePagerLocalizedContent = {
  eyebrow: string;
  h1: string;
  sub: string;
  phrase: string;
  stories: OnePagerStory[];
};

type OnePagerChrome = {
  navAria: string;
  contact: string;
  priceCta: string;
  ctaLabels: Record<MaturiteLevel, string>;
  emailSubject: (level: MaturiteLevel, label: string) => string;
  emailBody: (level: MaturiteLevel, label: string) => string;
  whatsappText: (level: MaturiteLevel, label: string) => string;
  maturityRailAria: string;
  navLinks: { href: string; label: string }[];
  maturityNav: { level: MaturiteLevel; slug: MaturiteSlug; label: string }[];
  storyKicker: string;
  storyTitle: string;
  storyLead: string;
  before: string;
  after: string;
  forWhoKicker: (level: MaturiteLevel) => string;
  forWhoTitle: string;
  deliverablesKicker: string;
  deliverablesTitle: string;
  stepsKicker: string;
  stepsTitle: string;
  proofKicker: string;
  proofTitle: string;
  priceKicker: string;
  trainingTrust: string;
};

const baseNavLinks = [
  { href: "#histoires", key: "stories" },
  { href: "#pour-qui", key: "fit" },
  { href: "#livrables", key: "deliverables" },
  { href: "#prix", key: "pricing" },
] as const;

type NavLinkKey = (typeof baseNavLinks)[number]["key"];

const maturityItems: { level: MaturiteLevel; slug: MaturiteSlug }[] = [
  { level: "N1", slug: "masterclass-ia" },
  { level: "N2", slug: "masterclass-metier" },
  { level: "N3", slug: "sessions-mcp" },
  { level: "N4", slug: "audit" },
  { level: "N5", slug: "deploiement-agents" },
  { level: "N6", slug: "outils-agentiques" },
  { level: "N7", slug: "optimisation-flotte" },
];

function buildNavLinks(labels: Record<NavLinkKey, string>) {
  return baseNavLinks.map((item) => ({ href: item.href, label: labels[item.key] }));
}

function buildMaturityNav(labels: Record<MaturiteLevel, string>) {
  return maturityItems.map((item) => ({ ...item, label: labels[item.level] }));
}

function getMailtoAddress(href: string) {
  return href.startsWith("mailto:") ? href.slice("mailto:".length).split("?")[0] : "paul.larmaraud@parrit.ai";
}

function buildMailtoHref(address: string, subject: string, body: string) {
  const params = new URLSearchParams({ subject, body });
  return `mailto:${address}?${params.toString()}`;
}

function buildWhatsappHref(text: string) {
  return `https://wa.me/33683762219?text=${encodeURIComponent(text)}`;
}

const contentByLocale: Partial<Record<Locale, Partial<Record<MaturiteLevel, OnePagerLocalizedContent>>>> = {
  en: {
    N1: {
      eyebrow: "N1 · General masterclass",
      h1: "Stop absorbing AI noise. Understand the mechanics.",
      sub: "You hear about artificial intelligence everywhere. We give your team the foundations to separate signal from theatre.",
      phrase: "I am discovering generative AI",
      stories: [
        {
          title: "Level-zero AI training for a large team",
          person: "General training",
          before:
            "Teams were exposed to constant noise: generative AI, agents and automation, without a simple grid to separate true, useful and risky.",
          after:
            "They leave with shared foundations: generative AI, agents, automation, limits, security and credible first use cases.",
          result: "The topic becomes discussable without jargon: people understand the mechanics before talking tools.",
        },
        {
          title: "Generative AI masterclass for business teams",
          person: "Custom training",
          before:
            "Teams were curious but scattered between text generation, automation and early agent use cases.",
          after:
            "The session clarifies generative AI, agent usage and simple automations people can actually understand.",
          result: "Training opens a path: generalist to align, custom to apply to the business.",
        },
      ],
    },
    N2: {
      eyebrow: "N2 · Business masterclass",
      h1: "The tool can generate text. Make it work on your business.",
      sub: "Your teams use basic requests. We adapt the machine to the real workflows they run every day.",
      phrase: "I want to apply AI to my sector",
      stories: [
        {
          title: "Practical workshop for one business team",
          person: "Business training",
          before:
            "People knew how to ask for text, but not how to turn recurring tasks into reliable methods.",
          after:
            "The session starts from their work: meeting prep, file synthesis, analysis, client reply or operational decision support.",
          result: "The team leaves with simple operating methods adapted to its business.",
        },
        {
          title: "Custom program by department",
          person: "HR, sales, operations, finance",
          before:
            "Generic training stayed too far from daily work. Teams did not see what should change on Monday morning.",
          after:
            "We build the session around the department: documents, vocabulary, constraints, sensitive data and useful gestures.",
          result: "Training becomes a business toolkit, not a tool demo.",
        },
      ],
    },
    N3: {
      eyebrow: "N3 · Creation and MCP sessions",
      h1: "Artificial intelligence is blind. Connect it to your tools.",
      sub: "You understand the basics. We teach you how to connect models to useful sources and services so they can trigger real actions.",
      phrase: "I want to connect my software to AI",
      stories: [
        {
          title: "Connect Claude to Google Maps and Notion",
          person: "Connector session",
          before:
            "The model answered well, but it could not see addresses, notes or knowledge bases that structure the work.",
          after:
            "The session shows how to connect Claude to Google Maps, Notion or a document source, with rights and simple tests.",
          result: "Teams understand the difference between chatting with a model and giving it useful context.",
        },
        {
          title: "Connect legal or Gemini connectors",
          person: "Introduction to agentic systems",
          before:
            "Teams hear about APIs, MCP, Gemini connectors and agents, but do not know what concretely changes.",
          after:
            "We use useful examples: query a legal source, an internal base, Gemini connectors or a governed business system.",
          result: "The session gives enough technical understanding to scope the next step without selling magic.",
        },
      ],
    },
    N4: {
      eyebrow: "N4 · Process mapping",
      h1: "From diagnostic to decision: map your processes.",
      sub: "The starting point is still the audit: we establish maturity by team, then turn that read into a concrete map of your workflows. You know what AI can do, what must stay human and which process to handle first.",
      phrase: "I want to move from diagnostic to decision",
      stories: [
        {
          title: "Strategic audit to launch AI transformation",
          person: "Executive team, CIO, transformation leadership",
          before:
            "Departments were not at the same level: some discovered AI, others tested tools, others were already discussing agents.",
          after:
            "The audit maps processes, team maturity, data, risks and the right solutions to deploy to the right people.",
          result: "Leadership stops funding isolated ideas and starts arbitrating a transformation plan.",
        },
        {
          title: "Team-by-team assessment before deployment",
          person: "Large multi-department organization",
          before:
            "Each business unit surfaced different use cases. It was unclear what to train, automate, connect or refuse.",
          after:
            "Each team receives a readable assessment: maturity, priority processes, risks, training needs and deployment path.",
          result: "The CIO can reconcile strategic audit, business constraints and the agentic roadmap.",
        },
      ],
    },
    N5: {
      eyebrow: "N5 · Agent deployment",
      h1: "This is when an agent starts intervening week after week.",
      sub: "One workflow keeps coming back. We put it under control: agent, automation or RPA depending on the need. The machine prepares, traces and escalates; humans keep sensitive decisions.",
      phrase: "I want an agent in production",
      stories: [
        {
          title: "Clevery operating system",
          person: "Law firm operating system",
          before:
            "Inboxes, calendar, client requests and document production lived in separate manual gestures.",
          after:
            "An operating system prepares inbox management, calendar actions, documents and custom contracts, with human validation.",
          result: "The firm keeps legal control; the agent takes repetitive back office work and leaves a trace.",
          logo: { src: "/brand/client-logos/logo-5.png", alt: "Clevery" },
        },
        {
          title: "Laparra production tool",
          person: "Proprietary software layer",
          before:
            "The business needed its own software layer, not just a conversational assistant sitting beside the tools.",
          after:
            "A proprietary tool orchestrates data, actions and validations on a controlled workflow.",
          result: "The project moves from an isolated agent to an operating-system layer embedded in daily work.",
          logo: { src: "/brand/client-logos/logo-2.png", alt: "Laparra" },
        },
      ],
    },
    N6: {
      eyebrow: "N6 · Agentic tooling",
      h1: "Anyone can ship. Give your teams the power to build.",
      sub: "Founders, product managers and business teams: we help you build internal agentic tools with the right stack: open source, proprietary, cloud or on-premise.",
      phrase: "I want to master agentic tools",
      stories: [
        {
          title: "Amazon Rufus for Lavazza and Carte Noire",
          person: "E-commerce GEO",
          before:
            "Teams needed to understand how their brands appear in Rufus-like shopping answers without waiting for a market tool.",
          after:
            "An internal tool tracks signals, structures analysis and helps steer GEO actions on shopping platforms.",
          result: "The topic becomes an internal product: observable, iterable and actionable by teams.",
          logo: { src: "/brand/client-logos/logo-1.png", alt: "Lavazza" },
        },
        {
          title: "Art object estimator",
          person: "Internal agentic tool",
          before:
            "The business knew what to estimate, compare and document, but not how to turn expertise into a usable tool.",
          after:
            "An internal prototype combines structured input, assisted reasoning, sources and usable output.",
          result: "The team moves from business intuition to a testable feature.",
        },
        {
          title: "Weak-signal monitoring and agentic reporting",
          person: "Internal product",
          before:
            "Signals were spotted too late, then copied by hand into notes, spreadsheets or reports.",
          after:
            "An agentic loop collects, triages, summarizes and reports continuously, on an open or proprietary stack.",
          result: "Product and business teams start shipping their own tools, with a validation frame.",
        },
      ],
    },
    N7: {
      eyebrow: "N7 · Fleet optimization",
      h1: "Your agents fail and cost too much. Take control back.",
      sub: "Your fleet is growing. We work on technical debt, token costs, models, self-improvement loops and the supervision harness.",
      phrase: "I have a fleet and want to optimize it",
      stories: [
        {
          title: "Our internal fleet of agents",
          person: "Hermes, n8n, Codex, Claude Code, Vertex, LangChain",
          before:
            "Useful but numerous agents: overnight orchestration, monitoring, writing, supervision and reporting, with token costs and model choices to manage.",
          after:
            "Agent managers supervise loops, the harness improves and models are chosen by cost, latency, confidentiality and quality.",
          result: "The fleet becomes operable: less debt, better observability, better open-source/proprietary tradeoffs.",
        },
        {
          title: "Self-improvement loops and technical debt",
          person: "Agentic architecture",
          before:
            "Agents produce output, but silent errors, scattered instructions and costs make the system hard to improve.",
          after:
            "We treat technical debt, strengthen tests, optimize tokens and install actionable feedback loops.",
          result: "The fleet learns better, costs less and becomes simpler to maintain.",
        },
      ],
    },
  },
};

const chromeByLocale: Record<Locale, OnePagerChrome> = {
  fr: {
    navAria: "Navigation principale",
    contact: "Nous écrire",
    priceCta: "Voir le prix",
    ctaLabels: {
      N1: "Recevoir mon programme",
      N2: "Recevoir ma session",
      N3: "Concevoir ma session",
      N4: "Demander l'Audit de Transformation",
      N5: "Définir mon flux cible",
      N6: "Construire mon outil interne",
      N7: "Auditer ma flotte",
    },
    emailSubject: (level, label) => `Parrit ${level} · ${label}`,
    emailBody: (level, label) =>
      `Bonjour Paul,\n\nJe viens de la page ${level} (${label}).\n\nEntreprise :\nContexte :\nObjectif :\nCréneau possible :\n\nMerci,\n`,
    whatsappText: (level, label) => `Bonjour Paul, je viens de la page ${level} (${label}). J'aimerais en parler.`,
    maturityRailAria: "Parcours de maturité IA",
    navLinks: buildNavLinks({
      stories: "Histoires",
      fit: "Pour qui",
      deliverables: "Livrables",
      pricing: "Prix",
    }),
    maturityNav: buildMaturityNav({
      N1: "Découverte",
      N2: "Métier",
      N3: "Connexion",
      N4: "Diagnostic",
      N5: "Production",
      N6: "Autonomie",
      N7: "Flotte",
    }),
    storyKicker: "Avant / après",
    storyTitle: "À quoi ressemble une transformation à ce niveau ?",
    storyLead:
      "On part toujours d'une situation concrète : une équipe, un métier, un blocage. Puis on rend le prochain pas visible.",
    before: "Avant",
    after: "Après",
    forWhoKicker: (level) => `${level} · Pour qui`,
    forWhoTitle: "Ce niveau est fait pour vous si...",
    deliverablesKicker: "Ce qu'on livre",
    deliverablesTitle: "Un livrable clair, actionnable, utilisable par vos équipes.",
    stepsKicker: "Comment ça se passe",
    stepsTitle: "Un rythme court, des étapes visibles, pas de flou.",
    proofKicker: "Preuve",
    proofTitle: "Preuve terrain.",
    priceKicker: "Prix",
    trainingTrust: "Formation finançable OPCO · certification Qualiopi",
  },
  en: {
    navAria: "Primary navigation",
    contact: "Write to us",
    priceCta: "See pricing",
    ctaLabels: {
      N1: "Receive my program",
      N2: "Receive my session",
      N3: "Design my session",
      N4: "Request the Transformation Audit",
      N5: "Define my target workflow",
      N6: "Build my internal tool",
      N7: "Audit my fleet",
    },
    emailSubject: (level, label) => `Parrit ${level} · ${label}`,
    emailBody: (level, label) =>
      `Hi Paul,\n\nI am coming from the ${level} page (${label}).\n\nCompany:\nContext:\nGoal:\nPossible time slot:\n\nThanks,\n`,
    whatsappText: (level, label) => `Hi Paul, I am coming from the ${level} page (${label}) and would like to discuss it.`,
    maturityRailAria: "AI maturity journey",
    navLinks: buildNavLinks({
      stories: "Stories",
      fit: "Who it fits",
      deliverables: "Deliverables",
      pricing: "Pricing",
    }),
    maturityNav: buildMaturityNav({
      N1: "Discovery",
      N2: "Business use",
      N3: "Connection",
      N4: "Diagnosis",
      N5: "Production",
      N6: "Autonomy",
      N7: "Fleet",
    }),
    storyKicker: "Before / after",
    storyTitle: "What does transformation look like at this level?",
    storyLead:
      "We always start from a concrete situation: a team, a role, a blocker. Then we make the next step visible.",
    before: "Before",
    after: "After",
    forWhoKicker: (level) => `${level} · Who it fits`,
    forWhoTitle: "This level fits you if...",
    deliverablesKicker: "What we deliver",
    deliverablesTitle: "A clear, actionable deliverable your teams can use.",
    stepsKicker: "How it works",
    stepsTitle: "A short rhythm, visible steps, no fog.",
    proofKicker: "Proof",
    proofTitle: "Field proof.",
    priceKicker: "Pricing",
    trainingTrust: "OPCO-financeable training · Qualiopi certification",
  },
  "pt-BR": {
    navAria: "Navegação principal",
    contact: "Escrever para nós",
    priceCta: "Ver o preço",
    ctaLabels: {
      N1: "Receber meu programa",
      N2: "Receber minha sessão",
      N3: "Desenhar minha sessão",
      N4: "Solicitar a Auditoria de Transformação",
      N5: "Definir meu fluxo alvo",
      N6: "Construir minha ferramenta interna",
      N7: "Auditar minha frota",
    },
    emailSubject: (level, label) => `Parrit ${level} · ${label}`,
    emailBody: (level, label) =>
      `Olá Paul,\n\nVim da página ${level} (${label}).\n\nEmpresa:\nContexto:\nObjetivo:\nHorário possível:\n\nObrigado,\n`,
    whatsappText: (level, label) => `Olá Paul, vim da página ${level} (${label}) e gostaria de conversar.`,
    maturityRailAria: "Jornada de maturidade em IA",
    navLinks: buildNavLinks({
      stories: "Histórias",
      fit: "Para quem",
      deliverables: "Entregáveis",
      pricing: "Preço",
    }),
    maturityNav: buildMaturityNav({
      N1: "Descoberta",
      N2: "Uso de negócio",
      N3: "Conexão",
      N4: "Diagnóstico",
      N5: "Produção",
      N6: "Autonomia",
      N7: "Frota",
    }),
    storyKicker: "Antes / depois",
    storyTitle: "Como é uma transformação neste nível?",
    storyLead:
      "Partimos sempre de uma situação concreta: uma equipe, uma função, um bloqueio. Depois tornamos o próximo passo visível.",
    before: "Antes",
    after: "Depois",
    forWhoKicker: (level) => `${level} · Para quem`,
    forWhoTitle: "Este nível é para você se...",
    deliverablesKicker: "O que entregamos",
    deliverablesTitle: "Um entregável claro, acionável e utilizável pelas suas equipes.",
    stepsKicker: "Como funciona",
    stepsTitle: "Um ritmo curto, etapas visíveis, sem zona cinzenta.",
    proofKicker: "Prova",
    proofTitle: "Prova de campo.",
    priceKicker: "Preço",
    trainingTrust: "Formação financiável OPCO · certificação Qualiopi",
  },
  "zh-CN": {
    navAria: "主导航",
    contact: "联系我们",
    priceCta: "查看价格",
    ctaLabels: {
      N1: "获取我的课程方案",
      N2: "获取我的工作坊",
      N3: "设计我的连接会话",
      N4: "申请转型审计",
      N5: "定义我的目标流程",
      N6: "构建我的内部工具",
      N7: "审计我的智能体舰队",
    },
    emailSubject: (level, label) => `Parrit ${level} · ${label}`,
    emailBody: (level, label) =>
      `Paul 你好，\n\n我来自 ${level} 页面（${label}）。\n\n公司：\n背景：\n目标：\n可沟通时间：\n\n谢谢，\n`,
    whatsappText: (level, label) => `Paul 你好，我来自 ${level} 页面（${label}），想和你聊聊。`,
    maturityRailAria: "AI 成熟度路径",
    navLinks: buildNavLinks({
      stories: "案例",
      fit: "适合谁",
      deliverables: "交付物",
      pricing: "价格",
    }),
    maturityNav: buildMaturityNav({
      N1: "认知",
      N2: "业务应用",
      N3: "连接",
      N4: "诊断",
      N5: "生产",
      N6: "自主",
      N7: "舰队",
    }),
    storyKicker: "之前 / 之后",
    storyTitle: "这个阶段的转型是什么样？",
    storyLead:
      "我们总是从一个具体场景开始：一支团队、一个岗位、一个卡点。然后把下一步变得清晰可见。",
    before: "之前",
    after: "之后",
    forWhoKicker: (level) => `${level} · 适合谁`,
    forWhoTitle: "如果你有这些情况，这个阶段适合你...",
    deliverablesKicker: "我们交付什么",
    deliverablesTitle: "一个清晰、可执行、团队能真正使用的交付物。",
    stepsKicker: "如何推进",
    stepsTitle: "节奏短、步骤清楚、不留模糊地带。",
    proofKicker: "证明",
    proofTitle: "真实证明。",
    priceKicker: "价格",
    trainingTrust: "可由 OPCO 资助的培训 · Qualiopi 认证",
  },
};

function Logo() {
  return (
    <div className="logo">
      <img className="logo-img" src="/brand/parrit-lockup-red.svg" alt="Parrit·AI" />
    </div>
  );
}

export default function OnePager({
  level,
  eyebrow,
  h1,
  sub,
  phrase,
  ctaLabel,
  ctaHref,
  stories,
  forWho,
  deliverables,
  steps,
  proof,
  price,
  priceNote,
  lang,
}: OnePagerProps) {
  const chrome = chromeByLocale[lang];
  const localizedContent = contentByLocale[lang]?.[level];
  const renderedEyebrow = localizedContent?.eyebrow ?? eyebrow;
  const renderedH1 = localizedContent?.h1 ?? h1;
  const renderedSub = localizedContent?.sub ?? sub;
  const renderedPhrase = localizedContent?.phrase ?? phrase;
  const renderedStories = localizedContent?.stories ?? stories;
  const primaryCtaLabel = chrome.ctaLabels[level] ?? ctaLabel;
  const currentMaturityLabel = chrome.maturityNav.find((item) => item.level === level)?.label ?? level;
  const ctaContext = `${currentMaturityLabel} · ${primaryCtaLabel}`;
  const actionHref = buildMailtoHref(
    getMailtoAddress(ctaHref),
    chrome.emailSubject(level, ctaContext),
    chrome.emailBody(level, ctaContext),
  );
  const whatsappHref = buildWhatsappHref(chrome.whatsappText(level, ctaContext));
  const isTrainingOffer = level === "N1" || level === "N2" || level === "N3";
  const hasSteps = steps.length > 0;
  const renderedProof = proof?.trim() ?? "";
  const hasProof = renderedProof.length > 0;

  return (
    <main className="home-template">
      <div className="frame" />

      <div className="wrap">
        <nav className="nav" aria-label={chrome.navAria}>
          <Link href={`/${lang}`} aria-label="Parrit.ai">
            <Logo />
          </Link>
          <div className="nav-links">
            {chrome.navLinks.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <a className="btn btn-red" href="mailto:paul.larmaraud@parrit.ai">
            {chrome.contact}
          </a>
        </nav>
      </div>

      <section className="hero left">
        <img className="seal-wm" src="/brand/parrit-seal.svg" alt="" aria-hidden="true" />
        <div className="eyebrow chip onepager-eyebrow">
          <span className="dot" aria-hidden="true" />
          {renderedEyebrow}
        </div>
        <p className="onepager-phrase">{renderedPhrase}</p>
        <h1>{renderedH1}</h1>
        <p className="sub">{renderedSub}</p>
        <div className="cta-row">
          <a className="btn btn-red btn-lg" href={actionHref}>
            {primaryCtaLabel}
          </a>
          <a className="btn btn-ghost btn-lg" href="#prix">
            {chrome.priceCta}
          </a>
        </div>
        {isTrainingOffer && (
          <div className="onepager-qualification">
            <img src="/brand/qualiopi/qualiopi-marianne.png" alt="Qualiopi : processus certifié, République Française" />
            <span>{chrome.trainingTrust}</span>
          </div>
        )}
        <nav className="maturity-rail" aria-label={chrome.maturityRailAria}>
          {chrome.maturityNav.map((item) => (
            <Link
              aria-current={item.level === level ? "page" : undefined}
              className="maturity-rail-item"
              href={`/${lang}/${item.slug}`}
              key={item.level}
            >
              <span>{item.level}</span>
              <strong>{item.label}</strong>
            </Link>
          ))}
        </nav>
      </section>

      <section className="section story-section" id="histoires">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">{chrome.storyKicker}</div>
            <h2>{chrome.storyTitle}</h2>
            <p className="lead">{chrome.storyLead}</p>
          </div>
          <div className="story-grid">
            {renderedStories.map((story) => (
              <article className="story-card" key={story.title}>
                <div className="story-head">
                  {story.logo && <img className="story-logo" src={story.logo.src} alt={story.logo.alt} />}
                  <div className="story-person">{story.person}</div>
                </div>
                <h3>{story.title}</h3>
                <div className="story-compare">
                  <div>
                    <span>{chrome.before}</span>
                    <p>{story.before}</p>
                  </div>
                  <div>
                    <span>{chrome.after}</span>
                    <p>{story.after}</p>
                  </div>
                </div>
                <p className="story-result">{story.result}</p>
              </article>
            ))}
          </div>
          <div className="story-cta">
            <a className="btn btn-red btn-lg" href={actionHref}>
              {primaryCtaLabel}
            </a>
          </div>
        </div>
      </section>

      <section className="section band" id="pour-qui">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">{chrome.forWhoKicker(level)}</div>
            <h2>{chrome.forWhoTitle}</h2>
          </div>
          <div className="grid3">
            {forWho.map((item) => (
              <div className="card" key={item}>
                <span className="ck" aria-hidden="true">
                  ✓
                </span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="livrables">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">{chrome.deliverablesKicker}</div>
            <h2>{chrome.deliverablesTitle}</h2>
          </div>
          <ul className="checks">
            {deliverables.map((item) => (
              <li key={item}>
                <span className="ck" aria-hidden="true">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {hasSteps && (
        <section className="section band">
          <div className="wrap">
            <div className="section-head">
              <div className="kicker">{chrome.stepsKicker}</div>
              <h2>{chrome.stepsTitle}</h2>
            </div>
            <div className="grid3">
              {steps.map((step, index) => (
                <div className="card step" key={`${step.title}-${step.body}`}>
                  <h3>
                    {String(index + 1).padStart(2, "0")} · {step.title}
                  </h3>
                  <p>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {hasProof && (
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <div className="kicker">{chrome.proofKicker}</div>
              <h2>{chrome.proofTitle}</h2>
            </div>
            <blockquote className="bc">
              <p>
                <em dangerouslySetInnerHTML={{ __html: renderedProof }} />
              </p>
            </blockquote>
          </div>
        </section>
      )}

      <section className="section band" id="prix">
        <div className="wrap">
          <div className="ctacard">
            <div>
              <Logo />
              <div className="kicker">{chrome.priceKicker}</div>
              <h2>{price}</h2>
              {priceNote && <p className="fine">{priceNote}</p>}
              {isTrainingOffer && (
                <div className="onepager-qualification price-qualification">
                  <img src="/brand/qualiopi/qualiopi-marianne.png" alt="Qualiopi : processus certifié, République Française" />
                  <span>{chrome.trainingTrust}</span>
                </div>
              )}
              <div className="cta-row">
                <a className="btn btn-red btn-lg" href={actionHref}>
                  {primaryCtaLabel}
                </a>
                <a className="btn btn-wa btn-lg" href={whatsappHref}>
                  <img className="ci" src="/brand/tool-logos/whatsapp.svg" alt="" aria-hidden="true" />
                  WhatsApp
                </a>
              </div>
            </div>
            <img className="seal-wm" src="/brand/parrit-seal.svg" alt="" aria-hidden="true" />
          </div>
        </div>
      </section>
    </main>
  );
}
