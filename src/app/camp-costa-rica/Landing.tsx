"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { CAMP_LANGS, DICT, type CampLang } from "./dict";

const WEBHOOK_URL = "https://n8n.srv1115145.hstgr.cloud/webhook/parrit-lead";

const LANG_PATH: Record<CampLang, string> = {
  fr: "/camp-costa-rica",
  en: "/camp-costa-rica/en",
  es: "/camp-costa-rica/es",
};

export default function Landing({ lang }: { lang: CampLang }) {
  const c = DICT[lang];
  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [who, setWho] = useState<"parent" | "participant">("parent");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setState("sending");
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          telephone: phone.trim(),
          profil: who,
          message: message.trim(),
          lang,
          page: "camp-costa-rica",
          source: "camp-parrita-candidature",
          action: "candidature",
          url: typeof window !== "undefined" ? window.location.href : "",
          timestamp: new Date().toISOString(),
        }),
      });
      setState("sent");
    } catch {
      setState("error");
    }
  }

  return (
    <>
      {/* ——— HERO plein écran, documentaire ——— */}
      <header className="chero">
        <img className="chero-bg" src="/camp/hero-coast.jpg" alt="" />
        <div className="chero-veil" />
        <nav className="cnav">
          <img className="cnav-logo" src="/brand/parrit-lockup-red.svg" alt="Parrit·AI" />
          <div className="cnav-right">
            <div className="clang">
              {CAMP_LANGS.map((l, i) => (
                <span key={l}>
                  {i > 0 && <i>/</i>}
                  {l === lang ? (
                    <b>{DICT[l].langLabel}</b>
                  ) : (
                    <a href={LANG_PATH[l]}>{DICT[l].langLabel}</a>
                  )}
                </span>
              ))}
            </div>
            <a className="cnav-cta" href="#candidature">{c.nav.cta}</a>
          </div>
        </nav>
        <div className="chero-inner">
          <span className="ckicker light">{c.hero.kicker}</span>
          <h1>
            {c.hero.h1a}<br />
            {c.hero.h1b}<br />
            <span className="red">{c.hero.h1red}</span>
          </h1>
          <p className="chero-sub">{c.hero.sub}</p>
          <a className="cbtn" href="#candidature">{c.hero.cta}</a>
        </div>
        <div className="chero-facts">
          {c.hero.facts.map((f, i) => (
            <span className="cfact" key={f}>{i > 0 && <i />}<span>{f}</span></span>
          ))}
        </div>
      </header>

      {/* ——— Chapitre 01 · L'histoire ——— */}
      <section className="csection" id="histoire">
        <div className="cwrap">
          <span className="ckicker">{c.story.kicker}</span>
          <h2>{c.story.h2}</h2>
          <p className="clead">{c.story.lead}</p>
        </div>
        <figure className="cfig">
          <img src="/camp/story-surf.jpg" alt={c.story.capSurf} loading="lazy" />
          <figcaption>{c.story.capSurf}</figcaption>
        </figure>
        <div className="cwrap">
          <ol className="cstory">
            {c.story.steps.map((s, i) => (
              <li key={s.t}>
                <span className="cnum">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <figure className="cfig">
          <img src="/camp/story-market.jpg" alt={c.story.capMarket} loading="lazy" />
          <figcaption>{c.story.capMarket}</figcaption>
        </figure>
      </section>

      {/* ——— Chapitre 02 · Le programme ——— */}
      <section className="csection cdark" id="programme">
        <div className="cwrap">
          <span className="ckicker light">{c.program.kicker}</span>
          <h2>{c.program.h2}</h2>
        </div>
        <figure className="cfig">
          <img src="/camp/program-fire.jpg" alt={c.program.capFire} loading="lazy" />
          <figcaption>{c.program.capFire}</figcaption>
        </figure>
        <div className="cwrap">
          <div className="cphases">
            {c.program.phases.map((p) => (
              <div className="cphase" key={p.title}>
                <span className="cphase-days">{p.days}</span>
                <h3>{p.title}</h3>
                <p>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Ce qu'ils créent sur place ——— */}
      <section className="csection" id="creations">
        <div className="cwrap">
          <span className="ckicker">{c.creations.kicker}</span>
          <h2>{c.creations.h2}</h2>
          <p className="clead">{c.creations.lead}</p>
          <div className="cgrid3">
            {c.creations.items.map((it) => (
              <div className="ccell" key={it.t}>
                <h3>{it.t}</h3>
                <p>{it.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Citation ——— */}
      <section className="cquote">
        <div className="cwrap">
          <blockquote>{c.quote.text}</blockquote>
          <span className="cquote-by">{c.quote.by}</span>
        </div>
      </section>

      {/* ——— Chapitre 03 · Pour les parents ——— */}
      <section className="csection" id="parents">
        <div className="cwrap">
          <span className="ckicker">{c.parents.kicker}</span>
          <h2>{c.parents.h2}</h2>
          <p className="clead">{c.parents.lead}</p>
        </div>
        <figure className="cfig">
          <img src="/camp/program-walk.jpg" alt={c.parents.capWalk} loading="lazy" />
          <figcaption>{c.parents.capWalk}</figcaption>
        </figure>
        <div className="cwrap">
          <div className="cbeforeafter">
            {[c.parents.before, c.parents.during, c.parents.after].map((b) => (
              <div key={b.label}>
                <span className="cba-label">{b.label}</span>
                <p>{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— La sécurité, en détail ——— */}
      <section className="csection" id="securite">
        <div className="cwrap">
          <span className="ckicker">{c.security.kicker}</span>
          <h2>{c.security.h2}</h2>
          <p className="clead">{c.security.lead}</p>
          <div className="cgrid3">
            {c.security.items.map((it) => (
              <div className="ccell" key={it.t}>
                <h3>{it.t}</h3>
                <p>{it.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Qui encadre ——— */}
      <section className="csection cband" id="fondateur">
        <div className="cwrap">
          <div className="cfounder">
            <img src="/camp/paul-costarica.jpg" alt={c.founder.alt} loading="lazy" />
            <div>
              <span className="ckicker">{c.founder.kicker}</span>
              <h2>{c.founder.h2}</h2>
              <p className="cfounder-p">{c.founder.p1}</p>
              <p className="cfounder-p">{c.founder.p2}</p>
              <p className="cfounder-p">{c.founder.p3}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Pour qui / pas pour qui ——— */}
      <section className="csection" id="pour-qui">
        <div className="cwrap">
          <span className="ckicker">{c.forWho.kicker}</span>
          <h2>{c.forWho.h2}</h2>
          <div className="cyesno">
            <div>
              <span className="cba-label">{c.forWho.yesLabel}</span>
              <ul>
                {c.forWho.yes.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
            <div>
              <span className="cba-label dark">{c.forWho.noLabel}</span>
              <ul>
                {c.forWho.no.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Le cadre, concrètement ——— */}
      <section className="csection" id="cadre">
        <div className="cwrap">
          <span className="ckicker">{c.practical.kicker}</span>
          <h2>{c.practical.h2}</h2>
          <div className="cgrid3 cpract">
            {c.practical.cols.map((col) => (
              <div className="ccell" key={col.t}>
                <h3>{col.t}</h3>
                <ul>
                  {col.items.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— FAQ ——— */}
      <section className="csection cband" id="faq">
        <div className="cwrap">
          <span className="ckicker">{c.faqSection.kicker}</span>
          <h2>{c.faqSection.h2}</h2>
          <div className="cfaq">
            {c.faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Candidature ——— */}
      <section className="capply" id="candidature">
        <img className="capply-bg" src="/camp/parents-return.jpg" alt="" loading="lazy" />
        <div className="capply-veil" />
        <div className="cwrap">
          <div className="capply-card">
            <span className="ckicker">{c.apply.kicker}</span>
            <h2>{c.apply.h2}</h2>
            <p className="capply-sub">{c.apply.sub}</p>
            {state !== "sent" ? (
              <form onSubmit={handleSubmit}>
                <div className="capply-row">
                  <input type="text" placeholder={c.apply.fieldName} value={name} onChange={(e) => setName(e.target.value)} required />
                  <input type="email" placeholder={c.apply.fieldEmail} value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="capply-row">
                  <input type="tel" placeholder={c.apply.fieldPhone} value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <select value={who} onChange={(e) => setWho(e.target.value as "parent" | "participant")} aria-label={c.apply.whoParent}>
                    <option value="parent">{c.apply.whoParent}</option>
                    <option value="participant">{c.apply.whoParticipant}</option>
                  </select>
                </div>
                <textarea
                  placeholder={c.apply.fieldWhy}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
                <button type="submit" className="cbtn wide" disabled={state === "sending"}>
                  {state === "sending" ? c.apply.submitting : c.apply.submit}
                </button>
                {state === "error" && <p className="capply-error">{c.apply.error}</p>}
                <p className="capply-fine">{c.apply.fine}</p>
              </form>
            ) : (
              <p className="capply-ok">{c.apply.ok}</p>
            )}
          </div>
        </div>
      </section>

      <footer className="cfooter">
        <img className="cnav-logo" src="/brand/parrit-lockup-red.svg" alt="Parrit·AI" />
        <span>{c.footer}</span>
      </footer>
    </>
  );
}
