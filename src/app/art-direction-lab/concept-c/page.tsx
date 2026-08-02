import type { Metadata } from "next";
import { FACTS } from "../content";
import { LabBar } from "../LabBar";

export const metadata: Metadata = {
  title: "Concept C · Manifesto in Production",
  robots: { index: false, follow: false },
};

/**
 * CONCEPT C — MANIFESTO IN PRODUCTION
 *
 * PARRIT-COPY-RESET-V1 : composition, couleurs, typographie, grille et assets
 * inchangés. Le titre d'affiche reste sur trois lignes désalignées, mais il
 * porte maintenant la formulation centrale au lieu d'une déclaration.
 *
 * Contrainte tenue : la radicalité ne coûte rien à la lisibilité de l'offre.
 * Durée, prix, résultat et prochaine action sont tous sur la page.
 */
export default function ConceptC() {
  return (
    <div className="cC">
      <LabBar current="c" />

      <div className="wrap">
        <section className="stage">
          <div>
            <p className="mono">{FACTS.hero.eyebrow}</p>
            <h1 className="disp">
              <span className="l1">On entre</span>
              <span className="l2">pour déployer.</span>
              <span className="l3">On vous laisse</span>
              <span className="l4">les clés.</span>
            </h1>
          </div>

          <figure className="portrait">
            <span className="slash" style={{ bottom: "34%" }} aria-hidden="true" />
            <img
              src="/brand/editorial/portraits/paul-halftone-inverse.png"
              alt="Paul Larmaraud, cofondateur de Parrit"
              width={1200}
              height={930}
            />
          </figure>
        </section>

        <section className="verdict">
          <p>{FACTS.hero.texte}</p>
          <div className="actions" style={{ marginTop: "2rem" }}>
            <a className="cta" href={FACTS.cta.principal.href}>
              {FACTS.cta.principal.label}
            </a>
            <a className="cta-link" href={FACTS.cta.secondaire.href}>
              {FACTS.cta.secondaire.label}
            </a>
          </div>
        </section>

        <section className="proof" aria-label="Ce que contient la mission">
          {FACTS.preuve.map((p) => (
            <div className="proof-item" key={p.cle}>
              <p className="proof-key">{p.cle}</p>
              <p className="proof-line">{p.ligne}</p>
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
              <p key={t}>{t}</p>
            ))}
          </article>

          <article className="front" id="cas">
            <p className="mono">Ce qu&apos;on déploie</p>
            <h2>{FACTS.methode.titre}</h2>
            <div className="io">
              {FACTS.cas.slice(0, 2).map((c) => (
                <p key={c.id}>
                  <b>Entrée</b> {c.entree}
                  <br />
                  <b>Sortie</b> {c.sortie}
                  <br />
                  <b>L&apos;humain décide</b> {c.humain}
                </p>
              ))}
            </div>
          </article>
        </section>

        <figure className="plate">
          <img
            src="/brand/editorial/plates/plate-repetition.jpg"
            alt="Le même geste répété chaque jour, et l'endroit où la boucle se referme"
            width={1400}
            height={788}
          />
          <figcaption>
            {FACTS.hermes.titre[0]} {FACTS.hermes.titre[1]} {FACTS.hermes.trace}
          </figcaption>
        </figure>

        <section className="offres">
          {FACTS.offre.mois.map((m) => (
            <p className="offre" key={m.n}>
              {m.titre}
              <span>
                {m.n} · {m.corps}
              </span>
            </p>
          ))}
        </section>

        <p className="mono" style={{ marginTop: "1.5rem" }}>
          {FACTS.offre.titre} {FACTS.offre.mention}
        </p>

        <div className="actions">
          <a className="cta" href={FACTS.cta.final.href}>
            {FACTS.cta.final.label}
          </a>
          <span className="cta-note">{FACTS.final.titre}</span>
        </div>

        <p className="mono" style={{ marginTop: "1rem", maxWidth: "44rem" }}>
          {FACTS.final.texte}
        </p>

        <footer className="foot">
          <p>Concept C · Manifesto in Production · laboratoire interne</p>
          <p>{FACTS.hermes.attribution}</p>
        </footer>
      </div>
    </div>
  );
}
