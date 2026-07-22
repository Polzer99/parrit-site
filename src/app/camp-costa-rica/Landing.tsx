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
      {/* ——— HERO plein écran, documentaire ——— */}
      <header className="chero">
        <img className="chero-bg" src="/camp/hero-coast.jpg" alt="Côte Pacifique du Costa Rica à l'aube, jungle et océan" />
        <div className="chero-veil" />
        <nav className="cnav">
          <img className="cnav-logo" src="/brand/parrit-lockup-red.svg" alt="Parrit·AI" />
          <a className="cnav-cta" href="#candidature">Candidater</a>
        </nav>
        <div className="chero-inner">
          <span className="ckicker light">Camp Parrita · Côte Pacifique, Costa Rica</span>
          <h1>
            10 jours sans téléphone.<br />
            Un business à créer.<br />
            <span className="red">Un déclic pour la vie.</span>
          </h1>
          <p className="chero-sub">
            8 jeunes adultes. Un budget minuscule. L&apos;obligation de créer une activité
            qui rapporte, en négociant en direct avec les locaux. Ce n&apos;est pas un
            voyage. C&apos;est une métamorphose, encadrée.
          </p>
          <a className="cbtn" href="#candidature">Postuler à la prochaine cohorte</a>
        </div>
        <div className="chero-facts">
          <span>10 jours</span><i />
          <span>0 écran</span><i />
          <span>8 places</span><i />
          <span>1 business créé sur place</span>
        </div>
      </header>

      {/* ——— CHAPITRE 01 · L'histoire ——— */}
      <section className="csection" id="histoire">
        <div className="cwrap">
          <span className="ckicker">Chapitre 01 · L&apos;histoire d&apos;origine</span>
          <h2>Parrit porte le nom d&apos;une ville du Costa Rica : Parrita.</h2>
          <p className="clead">
            Avant de fonder son entreprise, Paul Larmaraud est parti seul sur cette côte,
            avec moins de 3 000 €. Ce qui s&apos;est passé en six mois a tout déclenché.
            Le camp reproduit exactement ce mécanisme.
          </p>
        </div>
        <figure className="cfig">
          <img src="/camp/story-surf.jpg" alt="Planche de surf plantée dans le sable noir à Sámara, au crépuscule" loading="lazy" />
          <figcaption>Playa Sámara. Donner des cours de surf sans savoir surfer : on apprend en marchant.</figcaption>
        </figure>
        <div className="cwrap">
          <ol className="cstory">
            {STORY_STEPS.map((s, i) => (
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
          <img src="/camp/story-market.jpg" alt="Étal de fruits en bord de route dans un village costaricien" loading="lazy" />
          <figcaption>Le business de jus de fruits : repérer ce qui manque, le vendre le lendemain.</figcaption>
        </figure>
      </section>

      {/* ——— CHAPITRE 02 · Le programme (section sombre) ——— */}
      <section className="csection cdark" id="programme">
        <div className="cwrap">
          <span className="ckicker light">Chapitre 02 · Le programme</span>
          <h2>Trois phases. Aucune échappatoire. Un cadre solide.</h2>
        </div>
        <figure className="cfig">
          <img src="/camp/program-fire.jpg" alt="Feu de camp sur la plage la nuit, silhouettes de dos face à l'océan" loading="lazy" />
          <figcaption>Le débrief du soir, autour du feu : 30 minutes sur les blocages réels de la journée.</figcaption>
        </figure>
        <div className="cwrap">
          <div className="cphases">
            {PROGRAM.map((p) => (
              <div className="cphase" key={p.phase}>
                <span className="cphase-days">{p.days}</span>
                <h3>{p.title}</h3>
                <p>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Citation ——— */}
      <section className="cquote">
        <div className="cwrap">
          <blockquote>
            « Personne ne m&apos;a appris à entreprendre. On m&apos;a juste retiré
            le filet. Le reste est venu tout seul. »
          </blockquote>
          <span className="cquote-by">Paul Larmaraud · fondateur, Parrit</span>
        </div>
      </section>

      {/* ——— CHAPITRE 03 · Pour les parents ——— */}
      <section className="csection" id="parents">
        <div className="cwrap">
          <span className="ckicker">Chapitre 03 · Pour les parents</span>
          <h2>Vous ne payez pas un séjour. Vous financez un avant / après.</h2>
          <p className="clead">
            Beaucoup de jeunes brillants n&apos;ont jamais eu à se débrouiller. Le camp
            leur donne ce que ni les études ni un stage ne donnent : la preuve vécue
            qu&apos;ils peuvent créer de la valeur en partant de rien. Pendant ce temps,
            le cadre de sécurité (référent local, contact médical, base arrière, point
            quotidien) reste actif en permanence, sans qu&apos;ils le sentent.
          </p>
        </div>
        <figure className="cfig">
          <img src="/camp/program-walk.jpg" alt="Pieds nus sur un sentier de jungle après la pluie" loading="lazy" />
          <figcaption>Pieds nus, sans téléphone. L&apos;inconfort est le professeur ; la sécurité, invisible.</figcaption>
        </figure>
        <div className="cwrap">
          <div className="cbeforeafter">
            <div>
              <span className="cba-label">Avant</span>
              <p>À l&apos;aise partout, autonome nulle part. Le téléphone comme prothèse, le confort comme plafond.</p>
            </div>
            <div>
              <span className="cba-label">Pendant</span>
              <p>Obligé d&apos;aborder, de négocier, d&apos;encaisser des refus, de trouver un manque et de le combler. Débriefé chaque soir.</p>
            </div>
            <div>
              <span className="cba-label">Après</span>
              <p>Un jeune qui a généré du cash en partant de rien ne raconte plus sa vie de la même façon. Et ne la conduit plus de la même façon.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ——— FAQ ——— */}
      <section className="csection cband" id="faq">
        <div className="cwrap">
          <span className="ckicker">Questions des parents</span>
          <h2>Tout ce que vous vous demandez, sans détour.</h2>
          <div className="cfaq">
            {FAQS.map((f) => (
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
            <span className="ckicker">Candidature</span>
            <h2>8 places par cohorte. L&apos;entretien décide.</h2>
            <p className="capply-sub">
              Laissez vos coordonnées : nous revenons vers vous sous 48 h pour un
              entretien de 20 minutes. Parents bienvenus.
            </p>
            {state !== "sent" ? (
              <form onSubmit={handleSubmit}>
                <div className="capply-row">
                  <input type="text" placeholder="Prénom et nom" value={name} onChange={(e) => setName(e.target.value)} required />
                  <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="capply-row">
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
                <button type="submit" className="cbtn wide" disabled={state === "sending"}>
                  {state === "sending" ? "Envoi..." : "Postuler à la prochaine cohorte"}
                </button>
                {state === "error" && (
                  <p className="capply-error">Un souci d&apos;envoi. Réessayez, ou écrivez à paul.larmaraud@parrit.ai</p>
                )}
                <p className="capply-fine">Réponse sous 48 h. Aucune donnée revendue, aucun spam.</p>
              </form>
            ) : (
              <p className="capply-ok">✓ Candidature reçue. Nous revenons vers vous sous 48 h pour planifier l&apos;entretien.</p>
            )}
          </div>
        </div>
      </section>

      <footer className="cfooter">
        <img className="cnav-logo" src="/brand/parrit-lockup-red.svg" alt="Parrit·AI" />
        <span>Camp Parrita · une expérience Parrit · parrit.ai</span>
      </footer>
    </>
  );
}
