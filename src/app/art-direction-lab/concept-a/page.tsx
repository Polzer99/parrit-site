import type { Metadata } from "next";
import { FACTS } from "../content";
import { LabBar } from "../LabBar";

export const metadata: Metadata = {
  title: "Concept A — Editorial Field Report",
  robots: { index: false, follow: false },
};

/**
 * CONCEPT A — EDITORIAL FIELD REPORT
 *
 * Parti pris : la page est un compte rendu de terrain, et son sujet est
 * quelqu'un. Le portrait chaleureux est l'élément principal, pas une vignette
 * d'équipe. La typographie condensée donne l'autorité, Arpona donne la
 * chaleur, la trame et le fil rouge donnent la preuve du travail.
 *
 * Ce que le concept cherche : donner envie de travailler avec Paul.
 */
export default function ConceptA() {
  return (
    <div className="cA">
      <LabBar current="a" />

      <div className="wrap">
        <header className="masthead">
          <strong>Parrit</strong>
          <p className="mono">Compte rendu de terrain · Édition 2026</p>
        </header>

        <section className="hero">
          <div>
            <p className="mono kicker">Deux fronts critiques, un seul opérateur</p>
            <h1 className="disp">
              <span>On ne vous rend</span>
              <span>pas un deck.</span>
              <span className="red">On vous laisse</span>
              <span className="red">ce qui tourne.</span>
            </h1>
            <p className="lede">
              Parrit construit et opère des outils sur mesure avec des agents IA.
              Paul fait naître le prototype et code tous les jours. Yukun le met
              en production sur vos systèmes réels.
            </p>
          </div>

          <figure className="portrait">
            <img
              src="/brand/editorial/portraits/paul-warm.png"
              alt="Paul Larmaraud, cofondateur de Parrit"
              width={690}
              height={957}
            />
            <figcaption>Paul Larmaraud · cofondateur</figcaption>
          </figure>
        </section>

        <div className="actions">
          <a className="cta" href={FACTS.cta.principal.href}>
            {FACTS.cta.principal.label}
          </a>
          <span className="cta-note">{FACTS.cta.principal.note}</span>
        </div>

        <section className="fronts" id="fronts">
          {FACTS.fronts.map((f) => (
            <article className="front" key={f.code}>
              <p className="mono">Front {f.code}</p>
              <h2>{f.titre}</h2>
              <p>{f.corps}</p>
              <dl className="io">
                <div>
                  <dt>Entrée</dt>
                  <dd>{f.entree}</dd>
                </div>
                <div>
                  <dt>Sortie</dt>
                  <dd>{f.sortie}</dd>
                </div>
              </dl>
            </article>
          ))}
        </section>

        <figure className="plate">
          <img
            src="/brand/editorial/plates/plate-decision.jpg"
            alt="Atelier de cartographie chez un client, et la suite d'enregistrements que la décision produit"
            width={1400}
            height={788}
          />
          <figcaption>
            Une décision prise en atelier devient une règle qui tourne toute
            seule. Le fil part de la salle, il arrive dans le système.
          </figcaption>
        </figure>

        <section className="hands">
          <blockquote>« {FACTS.citation} »</blockquote>
          {FACTS.mains.map((m) => (
            <p key={m.qui}>
              <strong>{m.qui}</strong>
              {m.role}
            </p>
          ))}
        </section>

        <section className="offres">
          <p className="mono" style={{ padding: "1.25rem 0 0" }}>
            Trois façons de commencer
          </p>
          {FACTS.offres.map((o) => (
            <article className="offre" key={o.n}>
              <span className="offre-n">{o.n}</span>
              <h3>{o.titre}</h3>
              <p>{o.corps}</p>
              <span className="mono offre-prix">{o.prix}</span>
            </article>
          ))}
        </section>

        <div className="actions" style={{ borderBottom: 0 }}>
          <a className="cta" href={FACTS.cta.principal.href}>
            {FACTS.cta.principal.label}
          </a>
          <span className="cta-note">{FACTS.cta.principal.note}</span>
        </div>

        <footer className="foot">
          <p>Concept A · Editorial Field Report · laboratoire interne</p>
          <p>
            Photographies réelles, prises en mission. Aucun visuel de banque
            d&apos;images.
          </p>
        </footer>
      </div>
    </div>
  );
}
