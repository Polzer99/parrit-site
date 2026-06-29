import Link from "next/link";
import type { Locale } from "@/app/[lang]/dictionaries";
import { CHEMIN_CONTENT, STEP_BASE, type Territoire } from "@/lib/chemin-content";

const SITE_URL = "https://parrit.ai";

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

      <div className="chemin-path">
        <span className="chemin-spine" aria-hidden />
        {steps.map((s, i) => {
          const href = `/${lang}/${s.slug}`;
          return (
            <section className={`chemin-step ${i % 2 === 0 ? "is-left" : "is-right"}`} key={s.n}>
              <span className="chemin-node" aria-hidden>{s.n}</span>

              <div className="chemin-visual">
                <div className={`chemin-frame ${s.visual.kind === "svg" ? "is-svg" : ""}`}>
                  {s.visual.kind === "shot" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.visual.src} alt={s.alt} loading="lazy" />
                  ) : (
                    <Cartographie hub={c.cartoHub} territoires={c.territoires} />
                  )}
                </div>
                <p className="chemin-caption">{s.caption}</p>
              </div>

              <div className="chemin-copy">
                <p className="chemin-tag">
                  <span className="chemin-lv">{s.level}</span>
                  <span className="chemin-banane">{s.banane}</span>
                </p>
                <h2 className="chemin-title">
                  <Link href={href}>{s.title}</Link>
                </h2>
                <p className={`chemin-mode ${s.shift ? "shift" : ""}`}>
                  <span className="chemin-mode-k">{c.modeKicker}</span>
                  {s.mode}
                </p>
                <p className="chemin-vo">{s.vo}</p>
                <Link href={href} className="chemin-link">{s.cta} →</Link>
              </div>
            </section>
          );
        })}
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
.chemin-h1 { font-size: clamp(30px, 5vw, 52px); line-height: 1.08; font-weight: 800; letter-spacing: -0.02em; margin: 0; }
.chemin-lede { max-width: 660px; margin: 22px auto 0; font-size: 18px; line-height: 1.6; color: var(--muted); }
.chemin-scroll { display: inline-block; margin-top: 30px; font-family: var(--font-mono); font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--faint); }

.chemin-path { position: relative; max-width: 1120px; margin: 40px auto 0; padding: 20px 24px 40px; }
.chemin-spine { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; transform: translateX(-50%); background: linear-gradient(var(--dash), var(--dash)); }

.chemin-step { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; padding: 56px 0; }
.chemin-step.is-right .chemin-visual { order: 2; }
.chemin-step.is-right .chemin-copy { order: 1; text-align: right; }
.chemin-step.is-right .chemin-tag { justify-content: flex-end; }

.chemin-node { position: absolute; left: 50%; top: 56px; transform: translate(-50%, -4px); width: 46px; height: 46px; border-radius: 50%; background: var(--surface); border: 2px solid var(--accent); color: var(--accent); font-family: var(--font-mono); font-size: 15px; font-weight: 700; display: grid; place-items: center; z-index: 2; box-shadow: var(--shadow-sm); }

.chemin-frame { border-radius: 16px; overflow: hidden; background: var(--card-dark); padding: 12px; border: 1px solid var(--border); box-shadow: var(--shadow-lg); }
.chemin-frame.is-svg { background: var(--surface); padding: 22px; }
.chemin-frame img { display: block; width: 100%; height: auto; border-radius: 8px; }
.chemin-caption { margin: 14px 2px 0; font-size: 13.5px; line-height: 1.5; color: var(--faint); }

.chemin-tag { display: flex; align-items: center; gap: 10px; margin: 0 0 14px; }
.chemin-lv { font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: .08em; color: #fff; background: var(--accent); padding: 3px 8px; border-radius: 6px; }
.chemin-banane { font-family: var(--font-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
.chemin-title { font-size: clamp(22px, 3vw, 30px); line-height: 1.15; font-weight: 800; letter-spacing: -0.015em; margin: 0 0 14px; }
.chemin-title a { color: inherit; text-decoration: none; transition: color .15s ease; }
.chemin-title a:hover { color: var(--accent); }
.chemin-mode { display: inline-flex; align-items: center; gap: 9px; font-family: var(--font-mono); font-size: 13px; letter-spacing: .01em; color: var(--text); background: var(--surface); border: 1px solid var(--line-2); border-radius: 999px; padding: 6px 13px 6px 7px; margin: 0 0 16px; }
.chemin-mode-k { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); background: var(--band); border-radius: 999px; padding: 3px 8px; }
.chemin-mode.shift { color: var(--accent); border-color: var(--tint-bd); background: var(--tint); font-weight: 600; }
.chemin-mode.shift .chemin-mode-k { color: #fff; background: var(--accent); }
.chemin-step.is-right .chemin-mode { flex-direction: row-reverse; }

.cmap { width: 100%; }
.cmap-hub { font-family: var(--font-mono); font-size: 11.5px; letter-spacing: .04em; color: #fff; background: var(--accent); border-radius: 8px; padding: 9px 12px; text-align: center; margin-bottom: 12px; }
.cmap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.cmap-zone { background: var(--bg); border: 1px solid var(--line); border-radius: 12px; padding: 12px 13px; }
.cmap-zone.wide { grid-column: 1 / -1; background: var(--tint); border-color: var(--tint-bd); }
.cmap-nom { font-size: 14.5px; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 3px; }
.cmap-zone.wide .cmap-nom { color: var(--accent); }
.cmap-sous { font-family: var(--font-mono); font-size: 10.5px; line-height: 1.4; color: var(--muted); margin: 0 0 9px; }
.cmap-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.cmap-chip { font-family: var(--font-mono); font-size: 10.5px; color: var(--text); background: var(--surface); border: 1px solid var(--line); border-radius: 999px; padding: 3px 9px; }
@media (max-width: 520px) { .cmap-grid { grid-template-columns: 1fr; } }

.chemin-cta { max-width: 760px; margin: 30px auto 0; padding: 64px 24px 110px; text-align: center; }
.chemin-cta-h { font-size: clamp(24px, 3.6vw, 34px); font-weight: 800; letter-spacing: -0.02em; margin: 0 0 16px; }
.chemin-cta-p { font-size: 17px; line-height: 1.6; color: var(--muted); margin: 0 auto 28px; max-width: 600px; }
.chemin-cta-row { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.chemin-btn { font-family: var(--font-mono); font-size: 13px; font-weight: 600; letter-spacing: .04em; padding: 13px 22px; border-radius: 10px; text-decoration: none; }
.chemin-btn.primary { background: var(--accent); color: #fff; }
.chemin-btn.primary:hover { background: var(--accent-hover); }
.chemin-btn.ghost { background: transparent; color: var(--ink); border: 1px solid var(--line-2); }
.chemin-btn.ghost:hover { background: var(--band); }

@media (max-width: 760px) {
  .chemin-spine { left: 22px; }
  .chemin-step { grid-template-columns: 1fr; gap: 18px; padding: 28px 0 28px 52px; }
  .chemin-step.is-right .chemin-visual,
  .chemin-step.is-right .chemin-copy { order: initial; text-align: left; }
  .chemin-step.is-right .chemin-tag { justify-content: flex-start; }
  .chemin-step.is-right .chemin-mode { flex-direction: row; }
  .chemin-node { left: 22px; top: 30px; width: 38px; height: 38px; font-size: 13px; }
}
`;
