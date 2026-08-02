import type { Metadata } from "next";
import { FACTS } from "../content";
import { LabBar } from "../LabBar";

export const metadata: Metadata = {
  title: "Concept B · Agent Operating System",
  robots: { index: false, follow: false },
};

/**
 * CONCEPT B — AGENT OPERATING SYSTEM
 *
 * PARRIT-COPY-RESET-V1 : composition, couleurs, typographie, grille et assets
 * inchangés. Le registre garde ses cinq colonnes ; ce sont les données qui ont
 * changé de nature. Chaque ligne est désormais un cas d'usage déployé, avec
 * ce qui entre, ce qui sort, et ce que l'humain continue de décider.
 */
export default function ConceptB() {
  return (
    <div className="cB">
      <LabBar current="b" />

      <div className="wrap">
        <header className="head">
          <p className="mono">{FACTS.hero.eyebrow}</p>
          <h1 className="disp">
            {FACTS.hero.titre[0]} {FACTS.hero.titre[1]}
          </h1>
          <div className="sub">
            <p>{FACTS.hero.texte}</p>
            <p className="mono">
              {FACTS.probleme.titre[0]}
              <br />
              {FACTS.probleme.titre[1]}
            </p>
          </div>
          <div className="actions">
            <a className="cta" href={FACTS.cta.principal.href}>
              {FACTS.cta.principal.label}
            </a>
            <a className="cta-link" href={FACTS.cta.secondaire.href}>
              {FACTS.cta.secondaire.label}
            </a>
          </div>
        </header>

        <section className="proof" aria-label="Ce que contient la mission">
          {FACTS.preuve.map((p) => (
            <div className="proof-item" key={p.cle}>
              <p className="proof-key">{p.cle}</p>
              <p className="proof-line">{p.ligne}</p>
            </div>
          ))}
        </section>

        <section className="registre" id="cas" aria-label="Ce qu'on déploie">
          {FACTS.cas.map((c, i) => (
            <div className="ligne" key={c.id}>
              <span className="ligne-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="ligne-in">{c.entree}</span>
              <span className="ligne-arrow" aria-hidden="true">
                →
              </span>
              <span className="ligne-out">{c.sortie}</span>
              <span className="ligne-meta">
                {c.systeme}
                <br />
                <span className="etat-decision">L&apos;humain décide : {c.humain}</span>
              </span>
            </div>
          ))}
        </section>

        <section className="fronts">
          <article className="front">
            <p className="mono">Le point de départ</p>
            <h2>
              {FACTS.probleme.titre[0]}
              <br />
              {FACTS.probleme.titre[1]}
            </h2>
            {FACTS.probleme.paragraphes.map((t) => (
              <p key={t} style={{ marginBottom: "0.75rem" }}>
                {t}
              </p>
            ))}
          </article>

          <article className="front">
            <p className="mono">La méthode</p>
            <h2>{FACTS.methode.titre}</h2>
            {FACTS.methode.etapes.map((e) => (
              <p key={e.n} style={{ marginBottom: "0.75rem" }}>
                <b>{e.titre}. </b>
                {e.corps}
              </p>
            ))}
          </article>
        </section>

        <section className="humain">
          <img
            src="/brand/editorial/portraits/paul-bw.png"
            alt="Paul Larmaraud, cofondateur de Parrit"
            width={1200}
            height={930}
          />
          <div>
            <blockquote>
              {FACTS.hermes.titre[0]} {FACTS.hermes.titre[1]}
            </blockquote>
            <p className="mono">{FACTS.hermes.texte}</p>
            <p className="mono">{FACTS.hermes.trace}</p>
          </div>
        </section>

        <section className="offres">
          {FACTS.offre.mois.map((m) => (
            <article className="offre" key={m.n}>
              <p className="mono">{m.n}</p>
              <h3>{m.titre}</h3>
              <p>{m.corps}</p>
            </article>
          ))}
        </section>

        <p className="mono" style={{ marginTop: "1.5rem" }}>
          {FACTS.offre.titre} {FACTS.offre.mention}
        </p>

        <div className="actions">
          <a className="cta" href={FACTS.cta.final.href}>
            {FACTS.cta.final.label}
          </a>
          <span className="mono">{FACTS.final.titre}</span>
        </div>

        <p className="mono" style={{ marginTop: "1rem", maxWidth: "44rem" }}>
          {FACTS.final.texte}
        </p>

        <footer className="foot">
          <p>Concept B · Agent Operating System · laboratoire interne</p>
          <p>{FACTS.hermes.attribution}</p>
        </footer>
      </div>
    </div>
  );
}
