"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { FAQS, PROGRAM, STORY_STEPS } from "./content";

const WEBHOOK_URL = "https://n8n.srv1115145.hstgr.cloud/webhook/parrit-lead";

export default function Landing() {
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
      <div className="frame" />

      <div className="wrap">
        <nav>
          <div className="logo">
            <img className="logo-img" src="/brand/parrit-lockup-red.svg" alt="Parrit·AI" />
          </div>
          <a className="btn btn-red" href="#candidature">Candidater</a>
        </nav>
      </div>

      <section className="hero left">
        <img className="seal-wm" src="/brand/parrit-seal.svg" alt="" />
        <div className="wrap">
          <span className="kicker">Camp Parrita · Immersion entrepreneuriale · Costa Rica</span>
          <h1>
            10 jours sans téléphone.<br />
            Un business à créer. <span className="red">Un déclic</span> pour la vie.
          </h1>
          <p className="sub">
            Le Camp Parrita emmène 8 jeunes adultes sur la côte Pacifique du Costa Rica,
            là où le fondateur de Parrit a vécu son propre déclic : sans téléphone, avec
            un budget minuscule, l&apos;obligation de créer une activité qui rapporte, en
            négociant en direct avec les locaux. Ce n&apos;est pas un voyage. C&apos;est une
            métamorphose, encadrée.
          </p>
          <div className="chips">
            <span className="chip"><span className="dot" /> 8 participants max</span>
            <span className="chip"><span className="dot" /> Zéro écran pendant 10 jours</span>
            <span className="chip"><span className="dot" /> Sécurité invisible, permanente</span>
            <span className="chip"><span className="dot" /> Admission sur candidature</span>
          </div>
        </div>
      </section>

      <section className="section band" id="histoire">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">L&apos;histoire d&apos;origine</span>
            <h2>Parrit porte le nom d&apos;une ville du Costa Rica : Parrita.</h2>
            <p className="lead">
              Avant de fonder son entreprise, Paul Larmaraud est parti seul au Costa Rica.
              Ce qui s&apos;est passé en six mois sur cette côte a tout déclenché. Le camp
              reproduit exactement ce mécanisme.
            </p>
          </div>
          <div className="grid3">
            {STORY_STEPS.map((s) => (
              <div className="card step" key={s.t}>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="programme">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">Le programme</span>
            <h2>Trois phases. Aucune échappatoire. Un cadre solide.</h2>
          </div>
          <div className="grid3">
            {PROGRAM.map((p) => (
              <div className="card" key={p.phase}>
                <span className="kicker">{p.phase} · {p.days}</span>
                <h3>{p.title}</h3>
                <p>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section band" id="parents">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">Pour les parents</span>
            <h2>Vous ne payez pas un séjour. Vous financez un avant / après.</h2>
            <p className="lead">
              Beaucoup de jeunes brillants n&apos;ont jamais eu à se débrouiller. Le camp leur
              donne ce que ni les études ni un stage ne donnent : la preuve vécue qu&apos;ils
              peuvent créer de la valeur en partant de rien. Pendant ce temps, le cadre de
              sécurité (référent local, contact médical, base arrière, point quotidien) reste
              actif en permanence, sans qu&apos;ils le sentent.
            </p>
          </div>
          <div className="grid3">
            <div className="card step">
              <h3>Avant</h3>
              <p>À l&apos;aise partout, autonome nulle part. Le téléphone comme prothèse, le confort comme plafond.</p>
            </div>
            <div className="card step">
              <h3>Pendant</h3>
              <p>Obligé d&apos;aborder, de négocier, d&apos;encaisser des refus, de trouver un manque et de le combler. Débriefé chaque soir.</p>
            </div>
            <div className="card step">
              <h3>Après</h3>
              <p>Un jeune qui a généré du cash en partant de rien ne raconte plus sa vie de la même façon. Et ne la conduit plus de la même façon.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">Questions des parents</span>
            <h2>Tout ce que vous vous demandez, sans détour.</h2>
          </div>
          <div className="faq-list">
            {FAQS.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section band" id="candidature">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">Candidature</span>
            <h2>8 places par cohorte. L&apos;entretien décide.</h2>
            <p className="lead">
              Laissez vos coordonnées : nous revenons vers vous sous 48 h pour un
              entretien de 20 minutes. Parents bienvenus.
            </p>
          </div>
          <div className="apply-card">
            {state !== "sent" ? (
              <form className="apply-form" onSubmit={handleSubmit}>
                <div className="apply-row">
                  <input type="text" placeholder="Prénom et nom" value={name} onChange={(e) => setName(e.target.value)} required />
                  <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="apply-row">
                  <input type="tel" placeholder="Téléphone (optionnel)" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <select value={who} onChange={(e) => setWho(e.target.value as "parent" | "participant")} aria-label="Je suis">
                    <option value="parent">Je suis un parent</option>
                    <option value="participant">Je suis le futur participant</option>
                  </select>
                </div>
                <textarea
                  placeholder="Pourquoi ce camp, pourquoi maintenant ? (3 lignes suffisent)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
                <button type="submit" className="btn btn-red btn-lg" disabled={state === "sending"}>
                  {state === "sending" ? "Envoi..." : "Postuler à la prochaine cohorte"}
                </button>
                {state === "error" && (
                  <p className="apply-error">Un souci d&apos;envoi. Réessayez, ou écrivez à paul.larmaraud@parrit.ai</p>
                )}
                <p className="fine">Réponse sous 48 h. Aucune donnée revendue, aucun spam.</p>
              </form>
            ) : (
              <p className="gate-ok">
                ✓ Candidature reçue. Nous revenons vers vous sous 48 h pour planifier l&apos;entretien.
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="wrap">
        <footer className="dim">
          <div className="logo">
            <img className="logo-img" src="/brand/parrit-lockup-red.svg" alt="Parrit·AI" />
          </div>
          <span className="mono">Camp Parrita · une expérience Parrit · parrit.ai</span>
        </footer>
      </div>
    </>
  );
}
