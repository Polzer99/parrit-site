import type { Metadata } from "next";
import { FACTS } from "../content";
import { LabBar } from "../LabBar";

export const metadata: Metadata = {
  title: "Concept C — Manifesto in Production",
  robots: { index: false, follow: false },
};

/**
 * CONCEPT C — MANIFESTO IN PRODUCTION
 *
 * Parti pris : l'affiche. Fond encre pleine page, typographie condensée
 * presque architecturale, rythme volontairement discontinu, portrait tramé
 * à fond perdu, rouge utilisé comme une coupe.
 *
 * Le risque assumé : un manifeste peut devenir une déclaration sans objet.
 * La contrainte tenue est donc qu'on comprenne l'offre en cinq secondes et
 * que le CTA reste évident, malgré la radicalité.
 */
export default function ConceptC() {
  return (
    <div className="cC">
      <LabBar current="c" />

      <div className="wrap">
        <section className="stage">
          <div>
            <p className="mono">Manifeste · Parrit · 2026</p>
            <h1 className="disp">
              <span className="l1">Une IA</span>
              <span className="l2">qui parle</span>
              <span className="l3">n&apos;exécute rien.</span>
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
          <p>
            Parrit construit et opère des outils sur mesure avec des agents IA.
            Une entrée réelle, une sortie définie, un propriétaire humain. Ce
            qui tourne chez un client tourne d&apos;abord chez nous.
          </p>
        </section>

        <section className="fronts" id="fronts">
          {FACTS.fronts.map((f) => (
            <article className="front" key={f.code}>
              <p className="mono">Front {f.code}</p>
              <h2>{f.titre}</h2>
              <p>{f.corps}</p>
              <div className="io">
                <p>
                  <b>Entrée</b> {f.entree}
                </p>
                <p>
                  <b>Sortie</b> {f.sortie}
                </p>
              </div>
            </article>
          ))}
        </section>

        <figure className="plate">
          <img
            src="/brand/editorial/plates/plate-repetition.jpg"
            alt="Le même geste répété chaque jour, et l'endroit où la boucle se referme"
            width={1400}
            height={788}
          />
          <figcaption>
            Le même geste, chaque jour. Puis l&apos;endroit où la boucle se
            referme.
          </figcaption>
        </figure>

        <section className="offres">
          {FACTS.offres.map((o) => (
            <p className="offre" key={o.n}>
              {o.titre}
              <span>
                {o.n} · {o.prix}
              </span>
            </p>
          ))}
        </section>

        <div className="actions">
          <a className="cta" href={FACTS.cta.principal.href}>
            {FACTS.cta.principal.label}
          </a>
          <span className="cta-note">{FACTS.cta.principal.note}</span>
        </div>

        <footer className="foot">
          <p>Concept C · Manifesto in Production · laboratoire interne</p>
          <p>{FACTS.hermes}</p>
        </footer>
      </div>
    </div>
  );
}
