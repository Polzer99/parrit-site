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
 * PARRIT-COPY-RESET-V1 : la composition, les couleurs, la typographie, la
 * grille et les assets sont inchangés. Seuls le texte et le nombre de blocs
 * qu'il occupe ont bougé.
 *
 * Parti pris inchangé : la page est un compte rendu de terrain, son sujet est
 * quelqu'un, et le portrait chaleureux porte le premier écran.
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
            <p className="mono kicker">{FACTS.hero.eyebrow}</p>
            <h1 className="disp">
              <span>On entre pour</span>
              <span>déployer.</span>
              <span className="red">On vous laisse</span>
              <span className="red">les clés quand</span>
              <span className="red">ça tourne.</span>
            </h1>
            <p className="lede">{FACTS.hero.texte}</p>
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
          <a className="cta-link" href={FACTS.cta.secondaire.href}>
            {FACTS.cta.secondaire.label}
          </a>
        </div>

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
            <p className="mono">Deux exemples déjà déployés</p>
            <h2>Ce qu&apos;on déploie</h2>
            {FACTS.cas.slice(0, 2).map((c) => (
              <div key={c.id}>
                <p>{c.phrase}</p>
                <dl className="io">
                  <div>
                    <dt>Entrée</dt>
                    <dd>{c.entree}</dd>
                  </div>
                  <div>
                    <dt>Sortie</dt>
                    <dd>{c.sortie}</dd>
                  </div>
                  <div>
                    <dt>Humain</dt>
                    <dd>{c.humain}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </article>
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
          <blockquote>{FACTS.methode.titre}</blockquote>
          {FACTS.methode.etapes.map((e) => (
            <p key={e.n}>
              <strong>{e.titre}</strong>
              {e.corps}
            </p>
          ))}
        </section>

        <section className="hands">
          <blockquote>
            {FACTS.hermes.titre[0]} {FACTS.hermes.titre[1]}
          </blockquote>
          <p>{FACTS.hermes.texte}</p>
          <p>{FACTS.hermes.trace}</p>
        </section>

        <section className="offres">
          <p className="mono" style={{ padding: "1.25rem 0 0" }}>
            {FACTS.offre.titre}
          </p>
          {FACTS.offre.mois.map((m) => (
            <article className="offre" key={m.n}>
              <span className="offre-n">{m.n.replace("Mois ", "0")}</span>
              <h3>{m.titre}</h3>
              <p>{m.corps}</p>
              <span className="mono offre-prix">{m.n}</span>
            </article>
          ))}
          <p className="mono" style={{ padding: "1.25rem 0 0" }}>
            {FACTS.offre.mention}
          </p>
        </section>

        <section className="hands">
          <blockquote>{FACTS.final.titre}</blockquote>
          <p style={{ gridColumn: "1 / -1" }}>{FACTS.final.texte}</p>
        </section>

        <div className="actions" style={{ borderBottom: 0 }}>
          <a className="cta" href={FACTS.cta.final.href}>
            {FACTS.cta.final.label}
          </a>
          <span className="cta-note">45 minutes, visio ou présentiel</span>
        </div>

        <footer className="foot">
          <p>Concept A · Editorial Field Report · laboratoire interne</p>
          <p>{FACTS.hermes.attribution}</p>
        </footer>
      </div>
    </div>
  );
}
