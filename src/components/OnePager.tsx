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
  }[];
  forWho: string[];
  deliverables: string[];
  steps: { title: string; body: string }[];
  proof: string;
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
          title: "The committee that did not know where to start",
          person: "Commercial leadership, B2B distribution",
          before:
            "AI was a watch topic. Teams had tested tools, but nobody could separate gadget, real gain and business risk.",
          after:
            "In three hours, the committee leaves with shared language, four realistic use cases and a first roadmap the business can understand.",
          result: "The discussion moves from 'should we do this?' to 'which process do we handle first?'.",
        },
        {
          title: "The CEO who wanted clarity without jargon",
          person: "CEO, services SME",
          before:
            "The executive team heard about generative AI, but decisions stayed stuck between enthusiasm, data fear and blurry vocabulary.",
          after:
            "The session levels everyone up: what can write, what can act, what must stay supervised and what must not leave the company.",
          result: "The topic becomes governable: leadership knows what to test, what to refuse and who should carry the next step.",
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
          title: "The firm that needed truly business-specific use cases",
          person: "Partner, consulting firm",
          before:
            "Consultants used AI individually. Output quality depended on personal habits, with no method and no reuse.",
          after:
            "The session turns their real cases into shared business configurations: market analysis, interview prep, client synthesis.",
          result: "Two use cases become team routines without adding another tool to the stack.",
        },
        {
          title: "The HR team that wanted adoption without resistance",
          person: "HR director, multi-site group",
          before:
            "Employees saw AI as a threat or as examples too generic to matter. Use cases stayed far from hiring, onboarding and payroll questions.",
          after:
            "We start from their real cases: CV triage, candidate replies, interview prep and internal policy synthesis.",
          result: "HR referents leave with shared configurations and a simple way to explain the tool to teams.",
        },
      ],
    },
    N3: {
      eyebrow: "N3 · Creation and MCP sessions",
      h1: "Artificial intelligence is blind. Connect it to your tools.",
      sub: "You understand the basics. We connect the model to your software so it can trigger real actions.",
      phrase: "I want to connect my software to AI",
      stories: [
        {
          title: "The proprietary CRM finally connected to AI models",
          person: "Insurance broker, sales team",
          before:
            "Customer data lived in an isolated CRM. Agents answered well, but never saw real records, contracts or follow-ups.",
          after:
            "The sessions create the technical bridges. The assistant accesses useful data, with documented testing and handover.",
          result: "Teams query their data in natural language without rebuilding the CRM.",
        },
        {
          title: "The back office that stopped copy-pasting",
          person: "Operations manager, B2B e-commerce",
          before:
            "Orders, tickets and follow-ups moved across three tools. Each update required re-entry and created error risk.",
          after:
            "Connectors link the useful sources. The agent reads, prepares the action and leaves a trace of what happened.",
          result: "Manual transfer time drops without forcing a new tool on the team.",
        },
      ],
    },
    N4: {
      eyebrow: "N4 · Audit and mapping",
      h1: "Do not fund AI at random. Target the bottlenecks that matter.",
      sub: "You want to scale. We audit your workflows to quantify the gains before anyone builds.",
      phrase: "I want to map my processes",
      stories: [
        {
          title: "The AI budget redirected before money was wasted",
          person: "Founder, B2B energy brokerage",
          before:
            "The team thought outbound prospecting was the automation priority. The visible problem was loud, but not necessarily the most profitable.",
          after:
            "The audit shows that inbound lead qualification is the real lever, then quantifies the gain and deployment risks.",
          result: "The priority changes: less dispersion, one first deployment with measurable impact.",
        },
        {
          title: "The CFO who needed a defensible gain",
          person: "CFO, industrial SME",
          before:
            "Automation ideas existed, but none was quantified enough to pass a budget committee.",
          after:
            "The audit ranks workflows by volume, risk, recoverable time and production complexity.",
          result: "The decision no longer rests on intuition: the first project is chosen because it is defensible process by process.",
        },
      ],
    },
    N5: {
      eyebrow: "N5 · Agent deployment",
      h1: "Your processes are leaking. Give them to a supervised agent.",
      sub: "One task costs you ten hours a week. Parrit deploys a system that runs it continuously.",
      phrase: "I want an agent in production",
      stories: [
        {
          title: "Inbound leads handled at the right moment",
          person: "Law firm, client relationship team",
          before:
            "Requests arrived by email, then waited for someone available to read, qualify and prepare the reply.",
          after:
            "An agent qualifies in real time, drafts the response and flags priority matters. The team keeps validation.",
          result: "No lead is missed, three hours a week are recovered, and response time becomes more reliable.",
        },
        {
          title: "The support team that kept only exceptions",
          person: "COO, high-volume service",
          before:
            "The same inbox received complaints, simple requests and sensitive cases. Everything went to the same people with no clear priority.",
          after:
            "The agent classifies, prepares replies and escalates only the cases that require human arbitration.",
          result: "The team gets a readable flow again: repetitive work runs, exceptions stay human.",
        },
      ],
    },
    N6: {
      eyebrow: "N6 · Proprietary agentic tooling",
      h1: "Independence can be built. Create your machines internally, even without coding.",
      sub: "Your technical and business teams want to create complex workflows. We transfer the capability or unblock the technical wall.",
      phrase: "I want to master Claude Code and Codex",
      stories: [
        {
          title: "The product team that wanted to build without dependency",
          person: "Product team, B2B SaaS",
          before:
            "Every developer used AI differently. Gains existed, but practices were fragile and hard to transmit.",
          after:
            "The team structures Claude Code, Codex and recurring workflows. Referents know how to scope, test and maintain their own agents.",
          result: "Three internal workflows are built during the training, then owned by the team.",
        },
        {
          title: "The business team that had vision but no execution path",
          person: "Transformation lead, mid-market company",
          before:
            "Business teams knew exactly which tool they lacked, but every request went back into a saturated technical queue.",
          after:
            "We transfer a method to scope, build and test a first agentic tool with the company's guardrails.",
          result: "The business gains autonomy without bypassing IT: documentation and validation reflexes are set from the start.",
        },
      ],
    },
    N7: {
      eyebrow: "N7 · Fleet optimization",
      h1: "Your agents fail and cost too much. Take control back.",
      sub: "Your fleet is growing. We treat technical debt and redesign the architecture for reliability.",
      phrase: "I have a fleet and want to optimize it",
      stories: [
        {
          title: "The fleet that had to become manageable",
          person: "SaaS scale-up, operations and data",
          before:
            "Six agents had been built quickly. Costs were rising, errors were hard to trace and data stayed scattered.",
          after:
            "The fleet is centralized, triggers are clarified and feedback loops surface errors for continuous improvement.",
          result: "The error rate drops, costs become readable and the team knows where to act.",
        },
        {
          title: "The CIO who wanted control back",
          person: "CIO, multi-entity group",
          before:
            "Several teams had launched their own agents. Access, logs and responsibilities were not consistent.",
          after:
            "The diagnosis resets the fleet: inventory, dependencies, costs, risks, validation rules and architecture path.",
          result: "Governance becomes readable again: every agent has an owner, a trace and a reason to exist.",
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
      N1: "Réserver la masterclass",
      N2: "Réserver la session",
      N3: "Réserver les sessions",
      N4: "Demander l'audit",
      N5: "En parler 15 min",
      N6: "En parler 15 min",
      N7: "Demander le diagnostic flotte",
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
    proofTitle: "Cas anonymisé.",
    priceKicker: "Prix",
  },
  en: {
    navAria: "Primary navigation",
    contact: "Write to us",
    priceCta: "See pricing",
    ctaLabels: {
      N1: "Book the masterclass",
      N2: "Book the session",
      N3: "Book the sessions",
      N4: "Request the audit",
      N5: "Talk for 15 minutes",
      N6: "Talk for 15 minutes",
      N7: "Request a fleet diagnosis",
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
    proofTitle: "Anonymized case.",
    priceKicker: "Pricing",
  },
  "pt-BR": {
    navAria: "Navegação principal",
    contact: "Escrever para nós",
    priceCta: "Ver o preço",
    ctaLabels: {
      N1: "Reservar a masterclass",
      N2: "Reservar a sessão",
      N3: "Reservar as sessões",
      N4: "Solicitar a auditoria",
      N5: "Conversar por 15 minutos",
      N6: "Conversar por 15 minutos",
      N7: "Solicitar diagnóstico da frota",
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
    proofTitle: "Caso anonimizado.",
    priceKicker: "Preço",
  },
  "zh-CN": {
    navAria: "主导航",
    contact: "联系我们",
    priceCta: "查看价格",
    ctaLabels: {
      N1: "预约大师课",
      N2: "预约工作坊",
      N3: "预约连接会话",
      N4: "申请审计",
      N5: "聊 15 分钟",
      N6: "聊 15 分钟",
      N7: "申请智能体舰队诊断",
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
    proofTitle: "匿名案例。",
    priceKicker: "价格",
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
                <div className="story-person">{story.person}</div>
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

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">{chrome.proofKicker}</div>
            <h2>{chrome.proofTitle}</h2>
          </div>
          <blockquote className="bc">
            <p>
              <em dangerouslySetInnerHTML={{ __html: proof }} />
            </p>
          </blockquote>
        </div>
      </section>

      <section className="section band" id="prix">
        <div className="wrap">
          <div className="ctacard">
            <div>
              <Logo />
              <div className="kicker">{chrome.priceKicker}</div>
              <h2>{price}</h2>
              {priceNote && <p className="fine">{priceNote}</p>}
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
