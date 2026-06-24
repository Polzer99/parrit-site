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

type OnePagerChrome = {
  navAria: string;
  contact: string;
  priceCta: string;
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

const chromeByLocale: Record<Locale, OnePagerChrome> = {
  fr: {
    navAria: "Navigation principale",
    contact: "Nous écrire",
    priceCta: "Voir le prix",
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
          {eyebrow}
        </div>
        <p className="onepager-phrase">{phrase}</p>
        <h1>{h1}</h1>
        <p className="sub">{sub}</p>
        <div className="cta-row">
          <a className="btn btn-red btn-lg" href={ctaHref}>
            {ctaLabel}
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
            {stories.map((story) => (
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
            <a className="btn btn-red btn-lg" href={ctaHref}>
              {ctaLabel}
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
                <a className="btn btn-red btn-lg" href={ctaHref}>
                  {ctaLabel}
                </a>
                <a className="btn btn-wa btn-lg" href="https://wa.me/33683762219">
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
