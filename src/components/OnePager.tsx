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
  forWho: string[];
  deliverables: string[];
  steps: { title: string; body: string }[];
  proof: string;
  price: string;
  priceNote?: string;
  lang: Locale;
}

const navLinks = [
  { href: "#pour-qui", label: "Pour qui" },
  { href: "#livrables", label: "Livrables" },
  { href: "#prix", label: "Prix" },
];

const maturityNav: { level: MaturiteLevel; slug: MaturiteSlug; label: string }[] = [
  { level: "N1", slug: "masterclass-ia", label: "Découverte" },
  { level: "N2", slug: "masterclass-metier", label: "Métier" },
  { level: "N3", slug: "sessions-mcp", label: "Connexion" },
  { level: "N4", slug: "audit", label: "Diagnostic" },
  { level: "N5", slug: "deploiement-agents", label: "Production" },
  { level: "N6", slug: "outils-agentiques", label: "Autonomie" },
  { level: "N7", slug: "optimisation-flotte", label: "Flotte" },
];

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
  forWho,
  deliverables,
  steps,
  proof,
  price,
  priceNote,
  lang,
}: OnePagerProps) {
  return (
    <main className="home-template">
      <div className="frame" />

      <div className="wrap">
        <nav className="nav" aria-label="Navigation principale">
          <Link href={`/${lang}`} aria-label="Parrit.ai">
            <Logo />
          </Link>
          <div className="nav-links">
            {navLinks.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <a className="btn btn-red" href="mailto:paul.larmaraud@parrit.ai">
            Nous écrire
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
            Voir le prix
          </a>
        </div>
        <nav className="maturity-rail" aria-label="Parcours de maturité IA">
          {maturityNav.map((item) => (
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

      <section className="section band" id="pour-qui">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">{level} · Pour qui</div>
            <h2>Ce niveau est fait pour vous si...</h2>
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
            <div className="kicker">Ce qu'on livre</div>
            <h2>Un livrable clair, actionnable, utilisable par vos équipes.</h2>
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
            <div className="kicker">Comment ça se passe</div>
            <h2>Un rythme court, des étapes visibles, pas de flou.</h2>
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
            <div className="kicker">Preuve</div>
            <h2>Cas anonymisé.</h2>
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
              <div className="kicker">Prix</div>
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
