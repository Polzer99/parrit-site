import Link from "next/link";
import type { Locale } from "@/app/[lang]/dictionaries";
import {
  CHEMIN_CONTENT,
  STEP_BASE,
  type StepText,
  type StepVisual,
  type Territoire,
} from "@/lib/chemin-content";

/* eslint-disable @next/next/no-img-element */

const SITE_URL = "https://parrit.ai";

type StepSide = "left" | "right";

function Cartographie({ hub, territoires }: { hub: string; territoires: Territoire[] }) {
  return (
    <div className="cmap" role="img" aria-label={hub}>
      <div className="cmap-hub">{hub}</div>
      <div className="cmap-grid">
        {territoires.map((t) => (
          <div className={`cmap-zone ${t.wide ? "wide" : ""}`} key={t.nom}>
            <p className="cmap-nom">{t.nom}</p>
            <p className="cmap-sous">{t.sous}</p>
            <div className="cmap-chips">
              {t.chips.map((chip) => (
                <span className="cmap-chip" key={chip}>{chip}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrailFlag({
  href,
  n,
  isShift,
  label,
}: {
  href: string;
  n: string;
  isShift: boolean;
  label: string;
}) {
  return (
    <Link className={`trail-pin ${isShift ? "is-key" : ""}`} href={href} aria-label={label}>
      <span className="trail-flag">{n}</span>
      <span className="trail-pole" />
      <span className="trail-base" />
      {isShift ? <span className="trail-work">{label}</span> : null}
    </Link>
  );
}

function TrailConnector({ side }: { side: StepSide }) {
  const path =
    side === "left"
      ? "M 28 10 C 28 58 72 92 72 160"
      : "M 72 10 C 72 58 28 92 28 160";

  return (
    <svg className="trail-svg" viewBox="0 0 100 170" aria-hidden="true" preserveAspectRatio="none">
      <path d={path} fill="none" />
    </svg>
  );
}

function CheminVisual({
  visual,
  text,
  cartoHub,
  territoires,
}: {
  visual: StepVisual;
  text: StepText;
  cartoHub: string;
  territoires: Territoire[];
}) {
  if (visual.kind === "logos") {
    return (
      <div className="step-visual logo-strip" aria-label={text.alt}>
        {visual.logos.map((logo) => (
          <img src={logo.src} alt={logo.label} key={logo.src} loading="lazy" />
        ))}
      </div>
    );
  }

  if (visual.kind === "badges" && text.visualText?.kind === "badges") {
    return (
      <div className="step-visual badge-row" aria-label={text.alt}>
        {text.visualText.badges.map((badge) => (
          <span className="visual-badge" key={badge}>{badge}</span>
        ))}
      </div>
    );
  }

  if (visual.kind === "mcp" && text.visualText?.kind === "mcp") {
    return (
      <div className="step-visual mcp-visual" aria-label={text.alt}>
        <div className="mcp-mark">{text.visualText.badge}</div>
        <div className="mcp-lines">
          {text.visualText.connectors.map((connector) => (
            <span key={connector}>{connector}</span>
          ))}
        </div>
        <img src={visual.src} alt="" loading="lazy" />
      </div>
    );
  }

  if (visual.kind === "cartography") {
    return (
      <div className="step-visual carto-visual">
        <Cartographie hub={cartoHub} territoires={territoires} />
      </div>
    );
  }

  if (visual.kind === "agent") {
    return (
      <div className="step-visual agent-visual" aria-label={text.alt}>
        <div className="agent-logo">
          <img src={visual.logo.src} alt={visual.logo.label} loading="lazy" />
        </div>
        <img className="agent-shot" src={visual.src} alt="" loading="lazy" />
      </div>
    );
  }

  if (visual.kind === "training" && text.visualText?.kind === "training") {
    return (
      <div className="step-visual training-visual" aria-label={text.alt}>
        <span className="training-badge">{text.visualText.badge}</span>
        <div className="training-logos">
          {visual.logos.map((logo) => (
            <img src={logo.src} alt={logo.label} key={logo.src} loading="lazy" />
          ))}
        </div>
      </div>
    );
  }

  if (visual.kind === "fleet" && text.visualText?.kind === "fleet") {
    return (
      <div className="step-visual fleet-visual" aria-label={text.alt}>
        {text.visualText.poles.map((pole) => (
          <div className="fleet-pole" key={pole.title}>
            <p>{pole.title}</p>
            <div>
              {pole.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default function Chemin({ lang }: { lang: Locale }) {
  const c = CHEMIN_CONTENT[lang];
  const steps = STEP_BASE.map((base, i) => ({ base, text: c.steps[i] }));

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: c.metaTitle,
    itemListElement: steps.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.text.title,
      url: `${SITE_URL}/${lang}/${s.base.slug}`,
    })),
  };

  return (
    <main className="chemin">
      <style>{CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <header className="chemin-hero">
        <Link href={`/${lang}`} className="chemin-back">{c.back}</Link>
        <p className="chemin-kicker">{c.kicker}</p>
        <h1 className="chemin-h1">{c.h1Line1}<br />{c.h1Line2}</h1>
        <p className="chemin-lede">{c.lede}</p>
        <span className="chemin-scroll">{c.scroll}</span>
      </header>

      <div className="chemin-path">
        <div className="trail-start" aria-hidden>
          <span>▽ {c.departure}</span>
        </div>

        {steps.map((step, i) => {
          const href = `/${lang}/${step.base.slug}`;
          const side: StepSide = i % 2 === 0 ? "left" : "right";
          const isLast = i === steps.length - 1;

          return (
            <section className={`chemin-step is-${side}`} key={step.base.n}>
              <div className="trail-cell" aria-hidden={false}>
                <TrailFlag href={href} n={step.base.n} isShift={Boolean(step.base.shift)} label={c.modeKicker} />
                {!isLast ? <TrailConnector side={side} /> : null}
              </div>

              <Link href={href} className="chemin-card">
                <CheminVisual
                  visual={step.base.visual}
                  text={step.text}
                  cartoHub={c.cartoHub}
                  territoires={c.territoires}
                />
                <p className="chemin-tag">
                  <span className="chemin-lv">{step.base.level}</span>
                  <span className="chemin-banane">{step.text.banane}</span>
                </p>
                <h2 className="chemin-title">{step.text.title}</h2>
                <p className={`chemin-mode ${step.base.shift ? "shift" : ""}`}>
                  <span className="chemin-mode-k">{c.modeKicker}</span>
                  {step.text.mode}
                </p>
                <p className="chemin-vo">{step.text.vo}</p>
                <p className="chemin-caption">{step.text.caption}</p>
                <span className="chemin-link">{step.text.cta} →</span>
              </Link>
            </section>
          );
        })}

        <div className="chemin-arrival">
          <div className="arrival-spole" aria-hidden />
          <div className="arrival-sflag" aria-hidden />
          <div className="arrival-peak" aria-hidden />
          <h2>{c.arrivalTitle}</h2>
          <p>{c.arrivalSubtitle}</p>
        </div>
      </div>

      <footer className="chemin-cta">
        <h2 className="chemin-cta-h">{c.ctaH}</h2>
        <p className="chemin-cta-p">{c.ctaP}</p>
        <div className="chemin-cta-row">
          <a className="chemin-btn primary" href={`mailto:paul.larmaraud@parrit.ai?subject=${encodeURIComponent(c.h1Line1)}`}>{c.ctaPrimary}</a>
          <Link className="chemin-btn ghost" href={`/${lang}/os-classic`}>{c.ctaGhost}</Link>
        </div>
      </footer>
    </main>
  );
}

const CSS = `
.chemin { background: var(--bg); color: var(--ink); }
.chemin-hero { max-width: 880px; margin: 0 auto; padding: 88px 24px 24px; text-align: center; }
.chemin-back { font-family: var(--font-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); text-decoration: none; }
.chemin-kicker { margin: 40px 0 14px; font-family: var(--font-mono); font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: var(--accent); }
.chemin-h1 { font-size: clamp(30px, 5vw, 52px); line-height: 1.08; font-weight: 800; margin: 0; }
.chemin-lede { max-width: 660px; margin: 22px auto 0; font-size: 18px; line-height: 1.6; color: var(--muted); }
.chemin-scroll { display: inline-block; margin-top: 30px; font-family: var(--font-mono); font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--faint); }

.chemin-path { position: relative; max-width: 1120px; margin: 28px auto 0; padding: 16px 24px 52px; }
.trail-start { display: grid; grid-template-columns: minmax(0, 1fr) 124px minmax(0, 1fr); margin-bottom: 2px; }
.trail-start span { grid-column: 2; justify-self: center; font-family: var(--font-mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--faint); }

.chemin-step { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) 124px minmax(0, 1fr); align-items: stretch; min-height: 284px; }
.chemin-card { display: flex; flex-direction: column; align-self: center; gap: 0; background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 18px; color: inherit; text-decoration: none; box-shadow: var(--shadow); transition: border-color .16s ease, box-shadow .16s ease, transform .16s ease; }
.chemin-card:hover { border-color: var(--line-2); box-shadow: var(--shadow-lg); transform: translateY(-2px); }
.chemin-step.is-left .chemin-card { grid-column: 1; }
.chemin-step.is-right .chemin-card { grid-column: 3; }
.chemin-step.is-right .chemin-tag { justify-content: flex-end; }

.trail-cell { position: relative; grid-column: 2; grid-row: 1; min-height: 284px; }
.trail-pin { position: absolute; top: 50%; transform: translate(-50%, -92%); width: 46px; height: 72px; z-index: 2; text-decoration: none; color: var(--ink); }
.chemin-step.is-left .trail-pin { left: 27%; }
.chemin-step.is-right .trail-pin { left: 73%; }
.trail-flag { position: absolute; left: 50%; top: 0; width: 38px; height: 24px; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 18% 50%); display: flex; align-items: center; justify-content: flex-end; padding-right: 7px; background: var(--accent); color: #fff; font-family: var(--font-mono); font-size: 12px; font-weight: 700; }
.trail-pole { position: absolute; left: 50%; top: 0; width: 2px; height: 42px; background: var(--ink); }
.trail-base { position: absolute; left: 50%; top: 39px; transform: translateX(-50%); width: 12px; height: 12px; border-radius: 50%; background: var(--surface); border: 2px solid var(--ink); box-shadow: var(--shadow-sm); }
.trail-pin.is-key .trail-base { border-color: var(--accent); }
.trail-work { position: absolute; left: 50%; top: 56px; transform: translateX(-50%); white-space: nowrap; font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); }
.trail-svg { position: absolute; left: 0; right: 0; top: calc(50% - 5px); bottom: -50%; width: 100%; height: calc(50% + 142px); overflow: visible; }
.trail-svg path { stroke: rgba(20,20,26,.32); stroke-width: 3; stroke-linecap: round; stroke-dasharray: 2 12; vector-effect: non-scaling-stroke; }

.step-visual { min-height: 74px; margin-bottom: 16px; border-radius: 10px; border: 1px solid var(--line); background: var(--band); overflow: hidden; }
.logo-strip { display: grid; grid-template-columns: repeat(4, 1fr); align-items: center; gap: 10px; padding: 16px; background: var(--surface); }
.logo-strip img { display: block; width: 100%; max-height: 34px; object-fit: contain; }
.badge-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 18px; }
.visual-badge, .training-badge { display: inline-flex; align-items: center; min-height: 28px; border-radius: 999px; border: 1px solid var(--line-2); background: var(--surface); padding: 5px 10px; font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--ink); }
.mcp-visual { position: relative; display: grid; grid-template-columns: 78px 1fr; align-items: center; gap: 12px; min-height: 94px; padding: 12px; background: var(--surface); }
.mcp-mark { display: grid; place-items: center; width: 60px; height: 60px; border-radius: 12px; background: var(--accent); color: #fff; font-family: var(--font-mono); font-size: 16px; font-weight: 800; }
.mcp-lines { display: flex; flex-wrap: wrap; gap: 7px; z-index: 1; }
.mcp-lines span { border: 1px solid var(--line); border-radius: 999px; background: var(--band); padding: 4px 9px; font-family: var(--font-mono); font-size: 10.5px; color: var(--muted); }
.mcp-visual img { position: absolute; right: 8px; bottom: 8px; width: 122px; max-height: 72px; object-fit: contain; opacity: .28; }
.carto-visual { max-height: 190px; padding: 12px; background: var(--surface); overflow: hidden; }
.agent-visual { position: relative; display: grid; grid-template-columns: 74px 1fr; align-items: center; gap: 12px; padding: 12px; background: var(--surface); }
.agent-logo { display: grid; place-items: center; width: 62px; height: 62px; border-radius: 12px; background: var(--band); border: 1px solid var(--line); }
.agent-logo img { width: 42px; height: 42px; object-fit: contain; }
.agent-shot { width: 100%; max-height: 82px; border-radius: 8px; object-fit: cover; object-position: left top; }
.training-visual { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px; background: var(--surface); }
.training-logos { display: flex; align-items: center; justify-content: center; min-width: 70px; min-height: 48px; border-radius: 10px; background: var(--band); border: 1px solid var(--line); }
.training-logos img { width: 38px; height: 38px; object-fit: contain; }
.fleet-visual { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 12px; background: var(--surface); }
.fleet-pole { border: 1px solid var(--line); border-radius: 10px; background: var(--band); padding: 10px; }
.fleet-pole p { margin: 0 0 8px; font-family: var(--font-mono); font-size: 10.5px; font-weight: 800; letter-spacing: .05em; color: var(--accent); text-transform: uppercase; }
.fleet-pole div { display: flex; flex-wrap: wrap; gap: 6px; }
.fleet-pole span { border-radius: 999px; background: var(--surface); border: 1px solid var(--line); padding: 3px 7px; font-family: var(--font-mono); font-size: 10px; color: var(--ink); }

.chemin-tag { display: flex; align-items: center; gap: 10px; margin: 0 0 12px; }
.chemin-lv { font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: .08em; color: #fff; background: var(--accent); padding: 3px 8px; border-radius: 6px; }
.chemin-banane { font-family: var(--font-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
.chemin-title { font-size: clamp(21px, 2.6vw, 28px); line-height: 1.15; font-weight: 800; margin: 0 0 14px; }
.chemin-card:hover .chemin-title { color: var(--accent); }
.chemin-mode { display: inline-flex; align-items: center; align-self: flex-start; gap: 9px; font-family: var(--font-mono); font-size: 12px; color: var(--text); background: var(--surface); border: 1px solid var(--line-2); border-radius: 999px; padding: 6px 13px 6px 7px; margin: 0 0 14px; }
.chemin-step.is-right .chemin-mode { align-self: flex-end; flex-direction: row-reverse; }
.chemin-mode-k { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); background: var(--band); border-radius: 999px; padding: 3px 8px; }
.chemin-mode.shift { color: var(--accent); border-color: var(--tint-bd); background: var(--tint); font-weight: 600; }
.chemin-mode.shift .chemin-mode-k { color: #fff; background: var(--accent); }
.chemin-vo { margin: 0; font-size: 15px; line-height: 1.62; color: var(--muted); }
.chemin-caption { margin: 12px 0 0; font-size: 13px; line-height: 1.5; color: var(--faint); }
.chemin-link { display: inline-block; margin-top: 16px; font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: .04em; color: var(--accent); }

.cmap { width: 100%; }
.cmap-hub { font-family: var(--font-mono); font-size: 10px; letter-spacing: .04em; color: #fff; background: var(--accent); border-radius: 7px; padding: 7px 9px; text-align: center; margin-bottom: 8px; }
.cmap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
.cmap-zone { background: var(--bg); border: 1px solid var(--line); border-radius: 8px; padding: 8px; }
.cmap-zone.wide { grid-column: 1 / -1; background: var(--tint); border-color: var(--tint-bd); }
.cmap-nom { font-size: 12px; font-weight: 700; margin: 0 0 2px; }
.cmap-zone.wide .cmap-nom { color: var(--accent); }
.cmap-sous { font-family: var(--font-mono); font-size: 9px; line-height: 1.35; color: var(--muted); margin: 0 0 6px; }
.cmap-chips { display: flex; flex-wrap: wrap; gap: 4px; }
.cmap-chip { font-family: var(--font-mono); font-size: 9px; color: var(--text); background: var(--surface); border: 1px solid var(--line); border-radius: 999px; padding: 2px 6px; }

.chemin-arrival { position: relative; max-width: 520px; margin: 32px auto 0; padding-top: 36px; text-align: center; }
.arrival-peak { position: relative; width: 0; height: 0; margin: 0 auto; border-left: 62px solid transparent; border-right: 62px solid transparent; border-bottom: 78px solid var(--dark); }
.arrival-peak::after { content: ""; position: absolute; left: -62px; bottom: -78px; border-left: 62px solid transparent; border-right: 24px solid transparent; border-bottom: 78px solid rgba(255,255,255,.14); }
.arrival-spole { position: absolute; left: 50%; top: 4px; width: 2px; height: 54px; background: var(--ink); z-index: 1; }
.arrival-sflag { position: absolute; left: 50%; top: 4px; width: 40px; height: 26px; background: var(--accent); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 20% 50%); z-index: 2; }
.chemin-arrival h2 { font-size: clamp(23px, 3vw, 30px); line-height: 1.15; font-weight: 800; margin: 16px 0 6px; }
.chemin-arrival p { margin: 0; font-size: 14px; color: var(--muted); }

.chemin-cta { max-width: 760px; margin: 30px auto 0; padding: 64px 24px 110px; text-align: center; }
.chemin-cta-h { font-size: clamp(24px, 3.6vw, 34px); font-weight: 800; margin: 0 0 16px; }
.chemin-cta-p { font-size: 17px; line-height: 1.6; color: var(--muted); margin: 0 auto 28px; max-width: 600px; }
.chemin-cta-row { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.chemin-btn { font-family: var(--font-mono); font-size: 13px; font-weight: 600; letter-spacing: .04em; padding: 13px 22px; border-radius: 10px; text-decoration: none; }
.chemin-btn.primary { background: var(--accent); color: #fff; }
.chemin-btn.primary:hover { background: var(--accent-hover); }
.chemin-btn.ghost { background: transparent; color: var(--ink); border: 1px solid var(--line-2); }
.chemin-btn.ghost:hover { background: var(--band); }

@media (max-width: 860px) {
  .chemin-step { grid-template-columns: 58px minmax(0, 1fr); min-height: 0; padding: 20px 0 34px; }
  .trail-start { grid-template-columns: 58px minmax(0, 1fr); }
  .trail-start span { grid-column: 1; justify-self: center; }
  .chemin-step.is-left .chemin-card,
  .chemin-step.is-right .chemin-card { grid-column: 2; }
  .trail-cell { grid-column: 1; min-height: 100%; }
  .chemin-step.is-left .trail-pin,
  .chemin-step.is-right .trail-pin { left: 50%; }
  .trail-work { top: 52px; writing-mode: vertical-rl; text-orientation: mixed; }
  .trail-svg { height: calc(100% + 84px); }
  .chemin-step.is-right .chemin-tag { justify-content: flex-start; }
  .chemin-step.is-right .chemin-mode { align-self: flex-start; flex-direction: row; }
}

@media (max-width: 520px) {
  .chemin-hero { padding-top: 62px; }
  .chemin-path { padding-left: 14px; padding-right: 14px; }
  .chemin-card { padding: 15px; }
  .fleet-visual { grid-template-columns: 1fr; }
  .mcp-visual { grid-template-columns: 1fr; }
  .mcp-mark { width: 54px; height: 54px; }
  .mcp-visual img { width: 96px; }
  .cmap-grid { grid-template-columns: 1fr; }
}
`;
