"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { getAttribution } from "@/lib/attribution";
import { track } from "@/lib/analytics";
import { getOfferCopy, type OfferKind, type OfferCopy } from "@/lib/offer-copy";
import type { Locale } from "@/app/[lang]/dictionaries";

const WEBHOOK_URL = "https://n8n.srv1115145.hstgr.cloud/webhook/parrit-lead";

function Logo() {
  return (
    <div className="logo">
      <img className="logo-img" src="/brand/parrit-lockup-red.svg" alt="Parrit·AI" />
    </div>
  );
}

function LeadForm({
  copy,
  lang,
  offer,
}: {
  copy: OfferCopy["cta"];
  lang: Locale;
  offer: OfferKind;
}) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const started = useRef(false);

  useEffect(() => {
    track("form_view", { form: `offre:${offer}` });
  }, [offer]);

  function markStarted(): void {
    if (started.current) return;
    started.current = true;
    track("form_start", { form: `offre:${offer}` });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !phone.trim()) return;

    setState("sending");
    const utms = getAttribution();
    const posthog =
      typeof window !== "undefined"
        ? ((window as unknown as { posthog?: { capture: (event: string, props: Record<string, unknown>) => void; identify: (id: string, props?: Record<string, unknown>) => void } }).posthog)
        : undefined;

    try {
      const r = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: `site:offre:${offer}`,
          action: "offer_callback_request",
          offer,
          page: `/${lang}/${offer}`,
          email: email.trim(),
          telephone: phone.trim(),
          contact_raw: `${email.trim()} · ${phone.trim()}`,
          referrer: typeof document !== "undefined" ? document.referrer : "",
          url: typeof window !== "undefined" ? window.location.href : "",
          timestamp: new Date().toISOString(),
          ...utms,
        }),
      });
      if (!r.ok) throw new Error(`webhook ${r.status}`);

      posthog?.identify(email.trim(), { email: email.trim(), phone: phone.trim() });
      track("form_submitted", {
        form: `offre:${offer}`,
      });
      setState("sent");
    } catch (error) {
      const status = error instanceof Error
        ? Number(error.message.match(/webhook (\d+)/)?.[1])
        : Number.NaN;
      track("form_failed", {
        form: `offre:${offer}`,
        ...(Number.isNaN(status) ? {} : { status }),
      });
      setState("error");
    }
  }

  return (
    <form className="leadform" onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        autoComplete="email"
        placeholder={copy.email}
        value={email}
        onChange={(e) => { setEmail(e.target.value); markStarted(); }}
        required
      />
      <input
        type="tel"
        name="tel"
        autoComplete="tel"
        placeholder={copy.phone}
        value={phone}
        onChange={(e) => { setPhone(e.target.value); markStarted(); }}
        required
      />
      <button
        className="btn btn-red btn-lg"
        type="submit"
        disabled={state === "sending"}
        data-ph="cta"
        data-ph-label={copy.submit}
        data-ph-dest="offer_callback_submit"
        data-ph-placement="offer_form"
      >
        {state === "sending" ? copy.submitting : copy.submit}
      </button>
      {state === "sent" && <p className="lead-status">{copy.thanks}</p>}
      {state === "error" && <p className="lead-status error">{copy.error}</p>}
    </form>
  );
}

export default function OfferPage({
  lang,
  offer,
  relatedArticles,
}: {
  lang: Locale;
  offer: OfferKind;
  relatedArticles?: React.ReactNode;
}) {
  const copy = getOfferCopy(lang, offer);

  return (
    <main className="home-template offer-template">
      <div className="frame" />

      <div className="wrap">
        <nav className="nav" aria-label={copy.a11y.nav}>
          <a href={`/${lang}`} aria-label="Parrit.ai" data-ph="cta" data-ph-label="Parrit.ai" data-ph-dest={`/${lang}`} data-ph-placement="topbar_logo">
            <Logo />
          </a>
          <div className="nav-links" aria-label={copy.a11y.offers}>
            {copy.navLinks.map((item) => (
              <a href={`/${lang}/${item.href}`} key={item.href} aria-current={item.href === offer ? "page" : undefined} data-ph="cta" data-ph-label={item.label} data-ph-dest={`/${lang}/${item.href}`} data-ph-placement="topbar_nav">
                {item.label}
              </a>
            ))}
          </div>
          <a className="btn btn-red" href="mailto:paul.larmaraud@parrit.ai" data-ph="cta" data-ph-label={copy.navCta} data-ph-dest="mailto:paul.larmaraud@parrit.ai" data-ph-placement="topbar">
            {copy.navCta}
          </a>
        </nav>
      </div>

      <div className="wrap">
        <section className="hero left">
          <img className="seal-wm" src="/brand/parrit-seal.svg" alt="" aria-hidden="true" />
          <div className="eyebrow">{copy.hero.eyebrow}</div>
          <h1>
            {copy.hero.title}
            <span className="red">{copy.hero.accent}</span>
            {copy.hero.after}
          </h1>
          <p className="sub">{copy.hero.sub}</p>
          <div className="chips" aria-label={copy.a11y.chips}>
            {copy.hero.chips.map((chip) => (
              <span className="chip" key={chip}>
                <span className="dot" />
                {chip}
              </span>
            ))}
          </div>
          <div className="cta-row">
            <a className="btn btn-red btn-lg" href="#contact" data-ph="cta" data-ph-label={copy.hero.primary} data-ph-dest="#contact" data-ph-placement="hero">
              {copy.hero.primary}
            </a>
            <a className="btn btn-ghost btn-lg" href="#cadre" data-ph="cta" data-ph-label={copy.hero.secondary} data-ph-dest="#cadre" data-ph-placement="hero">
              {copy.hero.secondary}
            </a>
          </div>
        </section>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="two">
            <div>
              <div className="kicker">{copy.intro.kicker}</div>
              <h2>
                {copy.intro.title}
                <span className="red">{copy.intro.accent}</span>
                {copy.intro.after}
              </h2>
              <p className="lead">{copy.intro.lead}</p>
            </div>
            <div className="card">
              <div className="ic">速</div>
              <h3>{copy.intro.cardTitle}</h3>
              <p>{copy.intro.cardBody}</p>
            </div>
          </div>
        </div>
      </section>

      {copy.process && (
        <section className="section band">
          <div className="wrap">
            <div className="section-head">
              <div className="kicker">{copy.process.kicker}</div>
              <h2>
                {copy.process.title}
                <span className="red">{copy.process.accent}</span>
                {copy.process.after}
              </h2>
            </div>
            <div className="grid3">
              {copy.process.cards.map((card) => (
                <div className="card step" key={card.title}>
                  <div className="ic">{card.number ?? "速"}</div>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {copy.deliverables && (
        <section className="section band">
          <div className="wrap">
            <div className="section-head">
              <div className="kicker">{copy.deliverables.kicker}</div>
              <h2>
                {copy.deliverables.title}
                <span className="red">{copy.deliverables.accent}</span>
                {copy.deliverables.after}
              </h2>
            </div>
            <ul className="checks">
              {copy.deliverables.items.map((item) => (
                <li key={item}>
                  <span className="ck">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section" id="cadre">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">{copy.spec.kicker}</div>
            <h2>
              {copy.spec.title}
              <span className="red">{copy.spec.accent}</span>
              {copy.spec.after}
            </h2>
          </div>
          <dl className="spec">
            {copy.spec.rows.map((row) => (
              <div className="spec-row" key={row.label}>
                <dt>{row.label}</dt>
                <dd>
                  {row.value}
                  {row.note && <span className="m"> {row.note}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">{copy.proofs.kicker}</div>
            <h2>
              {copy.proofs.title}
              <span className="red">{copy.proofs.accent}</span>
              {copy.proofs.after}
            </h2>
          </div>
          <div className="proof">
            {copy.proofs.items.map((item) => (
              <div className="bc" key={item.sector}>
                <div className="sec">{item.sector}</div>
                <div className="pain">{item.pain}</div>
                <div className="res">
                  <b>{item.resultAccent}</b> {item.result}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="wrap">
          <div className="ctacard">
            <div>
              <Logo />
              <h2>
                {copy.cta.title}
                <span className="red">{copy.cta.accent}</span>
                {copy.cta.after}
              </h2>
              <p className="fine">{copy.cta.fine}</p>
              <LeadForm copy={copy.cta} lang={lang} offer={offer} />
              <div className="cta-alt">
                <a className="btn btn-wa btn-lg" href="https://wa.me/33683762219" data-ph="cta" data-ph-label={copy.cta.whatsapp} data-ph-dest="https://wa.me/33683762219" data-ph-placement="contact">
                  <img className="ci" src="/brand/tool-logos/whatsapp.svg" alt="" aria-hidden="true" />
                  {copy.cta.whatsapp}
                </a>
                <a className="cta-mail" href="mailto:paul.larmaraud@parrit.ai" data-ph="cta" data-ph-label={copy.cta.mail} data-ph-dest="mailto:paul.larmaraud@parrit.ai" data-ph-placement="contact">
                  {copy.cta.mail}
                </a>
              </div>
            </div>
            <img className="seal-wm" src="/brand/parrit-seal.svg" alt="" aria-hidden="true" />
          </div>
        </div>
      </section>

      {relatedArticles ? <div className="wrap">{relatedArticles}</div> : null}

      <div className="wrap">
        <footer className="dim">
          <Logo />
          <nav className="footer-links" aria-label={copy.a11y.offers}>
            {copy.navLinks.map((item) => (
              <a href={`/${lang}/${item.href}`} key={item.href} aria-current={item.href === offer ? "page" : undefined}>
                {item.label}
              </a>
            ))}
          </nav>
          <span className="mono">{copy.footer}</span>
          <span className="mono" style={{ opacity: 0.7, display: "block", marginTop: 12 }}>
            © {new Date().getFullYear()} SASU PARRIT.AI · Rueil-Malmaison ·{" "}
            <a href={`/${lang}/mentions-legales`} style={{ textDecoration: "underline" }}>
              {lang === "fr" ? "Mentions légales" : "Legal notice"}
            </a>{" "}
            ·{" "}
            <a href={`/${lang}/confidentialite`} style={{ textDecoration: "underline" }}>
              {lang === "fr" ? "Confidentialité" : "Privacy"}
            </a>
          </span>
        </footer>
      </div>

      <div className="frame" />
    </main>
  );
}
