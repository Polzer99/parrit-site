"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { COPY, type Lang } from "./content";
import { getAttribution, buildRdvHref } from "@/lib/attribution";
import { track } from "@/lib/analytics";

const WEBHOOK_URL = "https://n8n.srv1115145.hstgr.cloud/webhook/parrit-lead";
const SURFACE = "harnais-ia";
const PENDING_LEAD_KEY = `pending_lead_${SURFACE}`;

const SEND_ERROR: Record<Lang, string> = {
  fr: "Un problème est survenu. Réessayez.",
  en: "Something went wrong. Please try again.",
};

function statusFromError(error: unknown): number | undefined {
  if (!(error instanceof Error)) return undefined;
  const match = error.message.match(/webhook (\d+)/);
  return match ? Number(match[1]) : undefined;
}

function savePendingLead(payload: Record<string, unknown>, status?: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PENDING_LEAD_KEY, JSON.stringify({ surface: SURFACE, status, payload, savedAt: new Date().toISOString() }));
}

export default function Landing() {
  const [lang, setLang] = useState<Lang>("fr");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    track("form_view", { form: SURFACE });
  }, []);

  useEffect(() => {
    // SSR rend FR ; au montage, on s'aligne sur la langue du navigateur (anglophone → EN).
    // set-state-in-effect est volontaire ici (évite un hydration mismatch).
    if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("en")) {
      setLang("en");
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const retryPendingLead = async () => {
      const raw = localStorage.getItem(PENDING_LEAD_KEY);
      if (!raw) return;
      const pending = JSON.parse(raw) as { surface?: string; payload?: Record<string, unknown> };
      if (pending.surface !== SURFACE || !pending.payload) return;
      const r = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pending.payload),
      });
      if (!r.ok) throw new Error(`webhook ${r.status}`);
      localStorage.removeItem(PENDING_LEAD_KEY);
    };

    retryPendingLead().catch((error) => {
      const responseStatus = statusFromError(error);
      track("form_failed", { form: SURFACE, ...(responseStatus === undefined ? {} : { status: responseStatus }) });
    });
  }, []);

  const c = COPY[lang];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSending(true);
    setError("");
    const payload = {
      name: name.trim(),
      email: email.trim(),
      lang,
      page: "harnais-ia",
      source: "lead-magnet-harnais-cout-ia",
      url: typeof window !== "undefined" ? window.location.href : "",
      timestamp: new Date().toISOString(),
      ...getAttribution(),
    };
    try {
      const r = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(`webhook ${r.status}`);
      localStorage.removeItem(PENDING_LEAD_KEY);
      track("form_submitted", { form: SURFACE });
      setSent(true);
    } catch (error) {
      const status = statusFromError(error);
      track("form_failed", { form: SURFACE, ...(status === undefined ? {} : { status }) });
      console.error(payload, error);
      savePendingLead(payload, status);
      setError(SEND_ERROR[lang]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div className="frame" />

      <div className="wrap">
        <nav>
          <div className="logo">
            <img className="logo-img" src="/brand/parrit-lockup-red.svg" alt="Parrit·AI" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div className="lang-toggle">
              <button type="button" className={lang === "fr" ? "on" : ""} onClick={() => setLang("fr")}>FR</button>
              <span>/</span>
              <button type="button" className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
            </div>
            <a className="btn btn-red" href="#capture">{c.navCta}</a>
          </div>
        </nav>
      </div>

      <section className="hero left">
        <img className="seal-wm" src="/brand/parrit-seal.svg" alt="" />
        <div className="wrap">
          <span className="kicker">{c.kicker}</span>
          <h1>
            {c.h1a}
            <span className="red">{c.h1num}</span>
            {c.h1b}
          </h1>
          <p className="sub">{c.sub}</p>
          <div className="chips">
            {c.chips.map((chip) => (
              <span className="chip" key={chip.label}>
                {chip.logo ? <img className="ci" src={chip.logo} alt="" /> : <span className="dot" />}
                {" "}{chip.label}
              </span>
            ))}
          </div>

          <div className="proof">
            {c.proof.map((p) => (
              <div className="bc" key={p.sec}>
                <div className="sec">{p.sec}</div>
                <div className="res"><b>{p.res}</b></div>
                <div className="pain">{p.pain}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">{c.gateKicker}</span>
            <h2>{c.gateTitle}</h2>
            <p className="lead">{c.gateLead}</p>
          </div>

          <div className="gate">
            <div className={`gate-content${sent ? " unblurred" : ""}`} aria-hidden={!sent}>
              <div className="grid2">
                <div className="card">
                  <div className="ic">速</div>
                  <h3>{c.principleTitle}</h3>
                  <p>{c.principleBody}</p>
                </div>
                <div className="card">
                  <div className="ic">速</div>
                  <h3>{c.ruleTitle}</h3>
                  <p>{c.ruleBody}</p>
                </div>
              </div>

              <div className="card" style={{ marginTop: 20 }}>
                <h3>{c.matrixTitle}</h3>
                <table className="matrix">
                  <tbody>
                    <tr>{c.matrixHead.map((h) => <th key={h}>{h}</th>)}</tr>
                    {c.matrixRows.map((row) => (
                      <tr key={row[0]}>
                        <td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td><b>{row[3]}</b></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid3" style={{ marginTop: 20 }}>
                {c.steps.map((s) => (
                  <div className="card step" key={s.t}><h3>{s.t}</h3><p>{s.d}</p></div>
                ))}
              </div>
            </div>

            <div className="gate-capture" id="capture">
              <div className="seal">速</div>
              <h3>{c.captureTitle}</h3>
              <p className="cap-sub">{c.captureSub}</p>
              {!sent ? (
                <form className="leadform" onSubmit={handleSubmit}>
                  <input type="text" placeholder={c.fieldName} value={name} onChange={(e) => setName(e.target.value)} required />
                  <input type="email" placeholder={c.fieldEmail} value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <button type="submit" className="btn btn-red btn-lg" disabled={sending}>{c.submit}</button>
                </form>
              ) : (
                <>
                  <p className="gate-ok">{c.ok}</p>
                  <a
                    className="btn btn-red btn-lg"
                    style={{ marginTop: 16, display: "inline-block" }}
                    href={buildRdvHref("lead-magnet-harnais-cout-ia", lang)}
                  >
                    {lang === "en" ? "Book 15 minutes with Paul" : "Réserver 15 minutes avec Paul"}
                  </a>
                </>
              )}
              {error && <p className="gate-error" role="alert">{error}</p>}
              {!sent && <p className="fine">{c.fine}</p>}
              <img className="seal-wm" src="/brand/parrit-seal.svg" alt="" />
            </div>
          </div>
        </div>
      </section>

      <div className="wrap">
        <footer className="dim">
          <div className="logo">
            <img className="logo-img" src="/brand/parrit-lockup-red.svg" alt="Parrit·AI" />
          </div>
          <span className="mono">{c.footer}</span>
        </footer>
      </div>
    </>
  );
}
