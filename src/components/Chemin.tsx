import Link from "next/link";
import type { Locale } from "@/app/[lang]/dictionaries";
import {
  CHEMIN_CONTENT,
  STEP_BASE,
  type Territoire,
  type StepVisual,
  type StepVisualText,
} from "@/lib/chemin-content";

const SITE_URL = "https://parrit.ai";

// Position horizontale du drapeau/sentier par étape (alternance gauche/droite).
const flagX = (i: number) => (i % 2 === 0 ? 34 : 66);

// Connecteur en tirets qui zigzague d'une étape à l'autre.
function Connector({ from, to }: { from: number; to: number }) {
  return (
    <div className="ch-conn" aria-hidden>
      <svg viewBox="0 0 100 60" preserveAspectRatio="none">
        <path d={`M ${from} 0 C ${from} 30, ${to} 30, ${to} 60`} fill="none" stroke="rgba(20,20,26,.28)" strokeWidth="0.7" strokeDasharray="0.6 3.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

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
              {t.chips.map((c) => (
                <span className="cmap-chip" key={c}>{c}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepMedia({
  visual,
  visualText,
  hub,
  territoires,
}: {
  visual: StepVisual;
  visualText?: StepVisualText;
  hub: string;
  territoires: Territoire[];
}) {
  if (visual.kind === "logos") {
    return (
      <div className="sv-logos">
        {visual.logos.map((l) => (
          // eslint-disable-next-line @next/next/no-img-element
          <span className="sv-logo" key={l.label}><img src={l.src} alt={l.label} loading="lazy" /></span>
        ))}
      </div>
    );
  }
  if (visual.kind === "badges" && visualText?.kind === "badges") {
    return (
      <div className="sv-badges">
        {visualText.badges.map((b) => (
          <span className="sv-badge" key={b}>{b}</span>
        ))}
      </div>
    );
  }
  if (visual.kind === "mcp" && visualText?.kind === "mcp") {
    return (
      <div className="sv-mcp">
        <span className="sv-mcp-k">{visualText.badge}</span>
        <div className="sv-conn">
          {visualText.connectors.map((c) => (
            <span className="sv-pill" key={c}>{c}</span>
          ))}
        </div>
      </div>
    );
  }
  if (visual.kind === "cartography") {
    return <Cartographie hub={hub} territoires={territoires} />;
  }
  if (visual.kind === "agent") {
    return (
      <div className="sv-agent">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <span className="sv-logo lg"><img src={visual.logo.src} alt={visual.logo.label} loading="lazy" /></span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="sv-shot" src={visual.src} alt={visual.logo.label} loading="lazy" />
      </div>
    );
  }
  if (visual.kind === "training" && visualText?.kind === "training") {
    return (
      <div className="sv-train">
        <span className="sv-train-k">{visualText.badge}</span>
        <div className="sv-logos sm">
          {visual.logos.map((l) => (
            // eslint-disable-next-line @next/next/no-img-element
            <span className="sv-logo" key={l.label}><img src={l.src} alt={l.label} loading="lazy" /></span>
          ))}
        </div>
      </div>
    );
  }
  if (visual.kind === "fleet" && visualText?.kind === "fleet") {
    return (
      <div className="sv-fleet">
        {visualText.poles.map((p) => (
          <div className="sv-pole" key={p.title}>
            <p className="sv-pole-h">{p.title}</p>
            <div className="sv-pole-items">
              {p.items.map((it) => (
                <span className="sv-pole-i" key={it}>{it}</span>
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
  const steps = STEP_BASE.map((base, i) => ({ ...base, ...c.steps[i] }));

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: c.metaTitle,
    itemListElement: steps.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.title,
      url: `${SITE_URL}/${lang}/${s.slug}`,
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

      <div className="ch-trail">
        <div className="ch-depart"><span className="ch-depart-pin" aria-hidden />{c.departure}</div>

        {steps.map((s, i) => {
          const href = `/${lang}/${s.slug}`;
          const x = flagX(i);
          const prev = i === 0 ? 50 : flagX(i - 1);
          const side = i % 2 === 0 ? "left" : "right";
          return (
            <div className="ch-seg" key={s.n}>
              <Connector from={prev} to={x} />
              <div className={`ch-step is-${side} ${s.shift ? "shift" : ""}`}>
                <span className="ch-flag" style={{ left: `${x}%` }} aria-hidden>
                  <span className="ch-flag-pennant">{s.n}</span>
                  <span className="ch-flag-pole" />
                  <span className="ch-flag-base" />
                </span>
                <div className="ch-card">
                  <div className="ch-media">
                    <StepMedia visual={s.visual} visualText={s.visualText} hub={c.cartoHub} territoires={c.territoires} />
                  </div>
                  <p className="chemin-tag">
                    <span className="chemin-lv">{s.level}</span>
                    <span className="chemin-banane">{s.banane}</span>
                  </p>
                  <h2 className="chemin-title"><Link href={href}>{s.title}</Link></h2>
                  <p className={`chemin-mode ${s.shift ? "shift" : ""}`}>
                    <span className="chemin-mode-k">{c.modeKicker}</span>
                    {s.mode}
                  </p>
                  <p className="chemin-vo">{s.vo}</p>
                  <Link href={href} className="chemin-link">{s.cta} →</Link>
                </div>
              </div>
            </div>
          );
        })}

        <Connector from={flagX(steps.length - 1)} to={50} />
        <div className="ch-summit">
          <span className="ch-summit-pole" aria-hidden />
          <span className="ch-summit-flag" aria-hidden />
          <span className="ch-summit-peak" aria-hidden />
          <p className="ch-summit-title">{c.arrivalTitle}</p>
          <p className="ch-summit-sub">{c.arrivalSubtitle}</p>
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
.chemin-hero { max-width: 880px; margin: 0 auto; padding: 88px 24px 8px; text-align: center; }
.chemin-back { font-family: var(--font-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); text-decoration: none; }
.chemin-kicker { margin: 40px 0 14px; font-family: var(--font-mono); font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: var(--accent); }
.chemin-h1 { font-size: clamp(30px, 5vw, 52px); line-height: 1.08; font-weight: 800; letter-spacing: -0.02em; margin: 0; }
.chemin-lede { max-width: 660px; margin: 22px auto 0; font-size: 18px; line-height: 1.6; color: var(--muted); }
.chemin-scroll { display: inline-block; margin-top: 26px; font-family: var(--font-mono); font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--faint); }

/* ===== Sentier ===== */
.ch-trail { position: relative; max-width: 1080px; margin: 16px auto 0; padding: 0 24px; }
.ch-depart { text-align: center; font-family: var(--font-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--faint); padding-top: 12px; }
.ch-depart-pin { display: block; width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--faint); margin: 0 auto 8px; }
.ch-conn { height: 60px; }
.ch-conn svg { width: 100%; height: 60px; display: block; overflow: visible; }

.ch-step { position: relative; display: grid; grid-template-columns: 1fr 1fr; }
.ch-step.is-right .ch-card { grid-column: 2; }
.ch-step.is-left .ch-card { grid-column: 1; }

.ch-flag { position: absolute; top: -6px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; z-index: 3; }
.ch-flag-pennant { order: 1; min-width: 30px; height: 21px; background: var(--accent); color: #fff; font-family: var(--font-mono); font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; padding: 0 8px; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 22% 50%); }
.ch-flag-pole { order: 2; width: 2px; height: 18px; background: var(--ink); }
.ch-flag-base { order: 3; width: 9px; height: 9px; border-radius: 50%; background: var(--surface); border: 2px solid var(--ink); margin-top: -2px; }
.ch-step.shift .ch-flag-base { border-color: var(--accent); }

.ch-card { max-width: 430px; background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 16px 18px 18px; box-shadow: var(--shadow); margin-top: 26px; }
.ch-step.is-right .ch-card { margin-left: auto; }
.ch-step.shift .ch-card { border-color: var(--tint-bd); box-shadow: 0 1px 2px rgba(170,0,3,.06), 0 14px 34px rgba(170,0,3,.06); }

/* ===== Médias par étape ===== */
.ch-media { margin-bottom: 14px; }
.sv-logos { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.sv-logos.sm { gap: 9px; }
.sv-logo { display: inline-flex; align-items: center; justify-content: center; width: 46px; height: 46px; border-radius: 11px; background: var(--bg); border: 1px solid var(--line); }
.sv-logo.lg { width: 52px; height: 52px; }
.sv-logo img { width: 26px; height: 26px; object-fit: contain; }
.sv-badges { display: flex; flex-wrap: wrap; gap: 8px; }
.sv-badge { font-family: var(--font-mono); font-size: 12px; font-weight: 600; color: var(--ink); background: var(--band); border: 1px solid var(--line); border-radius: 999px; padding: 6px 12px; }
.sv-mcp { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.sv-mcp-k { font-family: var(--font-mono); font-size: 13px; font-weight: 700; letter-spacing: .08em; color: #fff; background: var(--dark); border-radius: 8px; padding: 7px 12px; }
.sv-conn { display: flex; flex-wrap: wrap; gap: 6px; }
.sv-pill { font-family: var(--font-mono); font-size: 11px; color: var(--muted); background: var(--bg); border: 1px solid var(--line); border-radius: 999px; padding: 4px 10px; }
.sv-agent { display: flex; align-items: center; gap: 14px; }
.sv-shot { flex: 1; min-width: 0; height: 70px; width: 100%; object-fit: cover; object-position: left center; border-radius: 10px; border: 1px solid var(--line); background: var(--card-dark); }
.sv-train { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.sv-train-k { font-family: var(--font-mono); font-size: 12.5px; font-weight: 700; color: var(--accent); background: var(--tint); border: 1px solid var(--tint-bd); border-radius: 999px; padding: 7px 13px; }
.sv-fleet { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.sv-pole { background: var(--bg); border: 1px solid var(--line); border-radius: 12px; padding: 11px 12px; }
.sv-pole-h { font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: var(--accent); margin: 0 0 8px; }
.sv-pole-items { display: flex; flex-wrap: wrap; gap: 6px; }
.sv-pole-i { font-size: 12px; color: var(--ink); background: var(--surface); border: 1px solid var(--line); border-radius: 7px; padding: 4px 9px; }

/* ===== Cartographie (N4) ===== */
.cmap { width: 100%; }
.cmap-hub { font-family: var(--font-mono); font-size: 11px; letter-spacing: .03em; color: #fff; background: var(--accent); border-radius: 8px; padding: 8px 11px; text-align: center; margin-bottom: 10px; }
.cmap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.cmap-zone { background: var(--bg); border: 1px solid var(--line); border-radius: 11px; padding: 10px 11px; }
.cmap-zone.wide { grid-column: 1 / -1; background: var(--tint); border-color: var(--tint-bd); }
.cmap-nom { font-size: 13.5px; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 3px; }
.cmap-zone.wide .cmap-nom { color: var(--accent); }
.cmap-sous { font-family: var(--font-mono); font-size: 10px; line-height: 1.4; color: var(--muted); margin: 0 0 8px; }
.cmap-chips { display: flex; flex-wrap: wrap; gap: 5px; }
.cmap-chip { font-family: var(--font-mono); font-size: 10px; color: var(--text); background: var(--surface); border: 1px solid var(--line); border-radius: 999px; padding: 3px 8px; }

/* ===== Texte étape ===== */
.chemin-tag { display: flex; align-items: center; gap: 10px; margin: 0 0 10px; }
.chemin-lv { font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: .08em; color: #fff; background: var(--accent); padding: 3px 8px; border-radius: 6px; }
.chemin-banane { font-family: var(--font-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
.chemin-title { font-size: clamp(20px, 2.4vw, 26px); line-height: 1.15; font-weight: 800; letter-spacing: -0.015em; margin: 0 0 12px; }
.chemin-title a { color: inherit; text-decoration: none; transition: color .15s ease; }
.chemin-title a:hover { color: var(--accent); }
.chemin-mode { display: inline-flex; align-items: center; gap: 9px; font-family: var(--font-mono); font-size: 12.5px; color: var(--text); background: var(--bg); border: 1px solid var(--line-2); border-radius: 999px; padding: 5px 12px 5px 6px; margin: 0 0 14px; }
.chemin-mode-k { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); background: var(--band); border-radius: 999px; padding: 3px 8px; }
.chemin-mode.shift { color: var(--accent); border-color: var(--tint-bd); background: var(--tint); font-weight: 600; }
.chemin-mode.shift .chemin-mode-k { color: #fff; background: var(--accent); }
.chemin-vo { font-size: 15.5px; line-height: 1.6; color: var(--text); opacity: .82; margin: 0 0 16px; }
.chemin-link { font-family: var(--font-mono); font-size: 13px; font-weight: 600; letter-spacing: .04em; color: var(--accent); text-decoration: none; border-bottom: 1px solid var(--tint-bd); padding-bottom: 2px; }
.chemin-link:hover { border-color: var(--accent); }

/* ===== Sommet / arrivée ===== */
.ch-summit { position: relative; text-align: center; padding-top: 8px; margin-top: 4px; }
.ch-summit-pole { position: absolute; left: 50%; top: -6px; width: 2px; height: 46px; background: var(--ink); transform: translateX(-1px); }
.ch-summit-flag { position: absolute; left: 50%; top: -6px; width: 38px; height: 24px; background: var(--accent); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 22% 50%); }
.ch-summit-peak { display: block; width: 0; height: 0; margin: 40px auto 0; border-left: 58px solid transparent; border-right: 58px solid transparent; border-bottom: 72px solid var(--dark); }
.ch-summit-title { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin: 16px 0 4px; }
.ch-summit-sub { font-size: 14px; color: var(--muted); margin: 0; }

.chemin-cta { max-width: 760px; margin: 30px auto 0; padding: 56px 24px 110px; text-align: center; }
.chemin-cta-h { font-size: clamp(24px, 3.6vw, 34px); font-weight: 800; letter-spacing: -0.02em; margin: 0 0 16px; }
.chemin-cta-p { font-size: 17px; line-height: 1.6; color: var(--muted); margin: 0 auto 28px; max-width: 600px; }
.chemin-cta-row { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.chemin-btn { font-family: var(--font-mono); font-size: 13px; font-weight: 600; letter-spacing: .04em; padding: 13px 22px; border-radius: 10px; text-decoration: none; }
.chemin-btn.primary { background: var(--accent); color: #fff; }
.chemin-btn.primary:hover { background: var(--accent-hover); }
.chemin-btn.ghost { background: transparent; color: var(--ink); border: 1px solid var(--line-2); }
.chemin-btn.ghost:hover { background: var(--band); }

@media (max-width: 760px) {
  .ch-trail { padding: 0 16px; }
  .ch-conn { height: 40px; }
  .ch-conn svg { height: 40px; }
  .ch-step { display: block; }
  .ch-flag { left: 16px !important; transform: none; flex-direction: row; align-items: center; gap: 6px; }
  .ch-flag-pole, .ch-flag-base { display: none; }
  .ch-card { max-width: 100%; margin: 18px 0 0 !important; }
  .sv-fleet, .cmap-grid { grid-template-columns: 1fr 1fr; }
}
`;
