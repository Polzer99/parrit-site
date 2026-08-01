import type { Metadata } from "next";
import { FACTS } from "../content";
import { LabBar } from "../LabBar";
import "./d.css";
import {
  AVANT_APRES,
  ETAT,
  JOURNAL,
  PREUVES,
  SPECIMEN,
  TOPOLOGIE,
  TRACE,
  TRUST,
} from "./system";

export const metadata: Metadata = {
  title: "Concept D — Editorial Operating System",
  robots: { index: false, follow: false },
};

/**
 * CONCEPT D — EDITORIAL OPERATING SYSTEM
 *
 * Synthèse de A, B et C. Le wording canonique de `../content.ts` est repris
 * MOT POUR MOT : cette tranche ne touche pas au texte. Seuls les retours à la
 * ligne du titre changent, pour la composition.
 *
 * Répartition visée : 55 % système, 25 % éditorial, 20 % humain.
 * Grille de 12 colonnes, filets visibles par endroits, aucun rayon, aucune
 * ombre, un seul rouge fonctionnel.
 */
export default function ConceptD() {
  return (
    <div className="cD">
      <LabBar current="d" />

      {/* ---------------------------------------------------------------
          TechHero — éditorial à gauche, panneau d'exécution à droite.
          Le panneau n'est pas une carte : il est tenu par des filets et
          partage la grille de la page.
          --------------------------------------------------------------- */}
      <header className="d-hero">
        <div className="d-wrap d-hero-grid">
          <div className="d-hero-lede">
            <p className="d-eyebrow">{FACTS.hero.eyebrow}</p>
            <h1 className="d-title">
              <span>On entre pour déployer.</span>
              <span className="d-title-2">On vous laisse les clés</span>
              <span className="d-title-2">quand ça tourne.</span>
            </h1>
            <p className="d-lede">{FACTS.hero.texte}</p>
            <div className="d-actions">
              <a className="d-cta" href={FACTS.cta.principal.href}>
                {FACTS.cta.principal.label}
              </a>
              <a className="d-cta-link" href={FACTS.cta.secondaire.href}>
                {FACTS.cta.secondaire.label}
              </a>
            </div>
          </div>

          <section className="d-panel" aria-label="Trace d'exécution">
            <div className="d-panel-head">
              <p className="d-mono d-specimen">{SPECIMEN.trace}</p>
              <p className="d-mono">
                {TRACE.id} · {TRACE.version}
              </p>
            </div>

            <dl className="d-meta">
              <div>
                <dt>Source</dt>
                <dd>{TRACE.source}</dd>
              </div>
              <div>
                <dt>Propriétaire</dt>
                <dd>{TRACE.proprietaire}</dd>
              </div>
              <div>
                <dt>Dernière vérification</dt>
                <dd>{TRACE.verifie}</dd>
              </div>
            </dl>

            <ol className="d-steps">
              {TRACE.etapes.map((e) => (
                <li key={e.n} className={`d-step is-${e.etat}`}>
                  <span className="d-step-n">{e.n}</span>
                  <span className="d-step-rail" aria-hidden="true" />
                  <span className="d-step-label">{e.label}</span>
                  <span className="d-step-t">{e.t}</span>
                </li>
              ))}
            </ol>

            {/* HumanGate. Le signe distinctif : le système s'arrête ici. */}
            <div className="d-gate">
              <img
                className="d-gate-face"
                src="/brand/editorial/portraits/paul-founder-gate.png"
                alt="Paul Larmaraud, cofondateur de Parrit"
                width={450}
                height={522}
              />
              <div>
                <p className="d-mono d-gate-state">{ETAT.validation}</p>
                <p className="d-gate-line">
                  La chaîne s&apos;arrête. Un propriétaire humain tranche.
                </p>
                <p className="d-mono">Direction commerciale · en attente depuis 4 min</p>
              </div>
            </div>
          </section>
        </div>

        {/* TrustRail. Aucune certification, aucune conformité revendiquée. */}
        <div className="d-trust">
          <div className="d-wrap d-trust-inner">
            {TRUST.map((t) => (
              <p className="d-mono" key={t}>
                {t}
              </p>
            ))}
          </div>
        </div>
      </header>

      {/* Preuve immédiate. Bascule en encre : première immersion. */}
      <section className="d-band">
        <div className="d-wrap d-proof">
          {FACTS.preuve.map((p, i) => (
            <div className="d-proof-item" key={p.cle}>
              <span className="d-mono d-proof-n">{String(i + 1).padStart(2, "0")}</span>
              <p className="d-proof-key">{p.cle}</p>
              <p className="d-proof-line">{p.ligne}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problème. Grand champ typographique, respiration. */}
      <section className="d-wrap d-problem">
        <p className="d-mono d-index">01 · Le point de départ</p>
        <h2 className="d-h2">
          <span>{FACTS.probleme.titre[0]}</span>
          <span className="d-red">{FACTS.probleme.titre[1]}</span>
        </h2>
        <div className="d-problem-body">
          {FACTS.probleme.paragraphes.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      </section>

      {/* ExecutionTrace, quatre chaînes. Zone dense. */}
      <section className="d-wrap d-cases" id="cas">
        <p className="d-mono d-index">02 · Ce qu&apos;on déploie</p>
        <div className="d-case-head d-mono" aria-hidden="true">
          <span>Entrée</span>
          <span>Traitement</span>
          <span>Sortie</span>
          <span>Décision humaine</span>
        </div>
        {FACTS.cas.map((c, i) => (
          <article className="d-case" key={c.id}>
            <span className="d-mono d-case-n">{String(i + 1).padStart(2, "0")}</span>
            <p className="d-case-in">{c.entree}</p>
            <p className="d-case-mid d-mono">{c.systeme}</p>
            <p className="d-case-out">{c.sortie}</p>
            <p className="d-mono d-case-gate">{c.humain}</p>
          </article>
        ))}
      </section>

      {/* SystemTopology. Des couches et des relations, pas des bulles. */}
      <section className="d-band d-band-topo">
        <div className="d-wrap">
          <p className="d-mono d-index">03 · {SPECIMEN.flux}</p>
          <div className="d-topo">
            {TOPOLOGIE.map((n, i) => (
              <div className={`d-node ${n.id === "gate" ? "is-gate" : ""}`} key={n.id}>
                <p className="d-mono d-node-couche">{n.couche}</p>
                <p className="d-node-label">{n.label}</p>
                <p className="d-mono d-node-detail">{n.detail}</p>
                {i < TOPOLOGIE.length - 1 ? (
                  <span className="d-node-link" aria-hidden="true" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BeforeAfterFlow. Même matière, deux états, une bascule. */}
      <section className="d-wrap d-ba">
        <p className="d-mono d-index">04 · Avant et après</p>
        <div className="d-ba-grid">
          <div className="d-ba-col is-before">
            <p className="d-mono">Avant</p>
            {AVANT_APRES.avant.map((t) => (
              <p className="d-ba-line" key={t}>
                {t}
              </p>
            ))}
          </div>
          <div className="d-ba-switch" aria-hidden="true">
            <span />
          </div>
          <div className="d-ba-col is-after">
            <p className="d-mono">Après</p>
            {AVANT_APRES.apres.map((t) => (
              <p className="d-ba-line" key={t}>
                {t}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Méthode. Respiration éditoriale, Arpona. */}
      <section className="d-wrap d-method">
        <p className="d-mono d-index">05 · La méthode</p>
        <h2 className="d-h2 d-h2-small">{FACTS.methode.titre}</h2>
        <div className="d-method-grid">
          {FACTS.methode.etapes.map((e) => (
            <article key={e.n}>
              <p className="d-mono">{e.n}</p>
              <h3 className="d-method-t">{e.titre}</h3>
              <p>{e.corps}</p>
            </article>
          ))}
        </div>
      </section>

      {/* HermesActivity + attribution. */}
      <section className="d-band">
        <div className="d-wrap d-hermes">
          <div>
            <p className="d-mono d-index">06 · Hermes</p>
            <h2 className="d-h2 d-h2-small">
              <span>{FACTS.hermes.titre[0]}</span>
              <span className="d-red">{FACTS.hermes.titre[1]}</span>
            </h2>
            <p className="d-hermes-body">{FACTS.hermes.texte}</p>
            <p className="d-hermes-body">{FACTS.hermes.trace}</p>
            <p className="d-mono d-attrib">{FACTS.hermes.attribution}</p>
          </div>
          <div className="d-journal">
            <p className="d-mono d-specimen">{SPECIMEN.interface}</p>
            {JOURNAL.map((j) => (
              <div className={`d-journal-row is-${j.etat}`} key={j.t}>
                <span className="d-mono d-journal-t">{j.t}</span>
                <span className="d-journal-label">{j.label}</span>
                <span className="d-mono d-journal-detail">{j.detail}</span>
              </div>
            ))}
            <p className="d-mono d-journal-foot">
              {ETAT.retour} · toute sortie est réversible
            </p>
          </div>
        </div>
      </section>

      {/* ProofLedger. Chaque ligne porte sa source ET sa limite. */}
      <section className="d-wrap d-ledger">
        <p className="d-mono d-index">07 · Ce qui est vérifiable</p>
        <div className="d-ledger-head d-mono" aria-hidden="true">
          <span>Élément</span>
          <span>Source</span>
          <span>État</span>
          <span>Vérifié</span>
          <span>Limite</span>
        </div>
        {PREUVES.map((p) => (
          <div className={`d-ledger-row is-${p.etat}`} key={p.element}>
            <p className="d-ledger-el">{p.element}</p>
            <p className="d-mono">{p.source}</p>
            <p className="d-mono d-ledger-etat">{p.etat}</p>
            <p className="d-mono">{p.verifie}</p>
            <p className="d-mono d-ledger-limite">{p.limite}</p>
          </div>
        ))}
      </section>

      {/* FounderValidation. Paul associé à une responsabilité, pas à un mot. */}
      <section className="d-band d-founder">
        <div className="d-wrap d-founder-grid">
          <figure className="d-founder-fig">
            <img
              src="/brand/editorial/portraits/paul-founder-cutout.png"
              alt="Paul Larmaraud, cofondateur de Parrit"
              width={548}
              height={1536}
            />
          </figure>
          <div>
            <p className="d-mono d-index">08 · Qui répond de ce qui tourne</p>
            <blockquote className="d-quote">{FACTS.offre.titre}</blockquote>
            <dl className="d-meta d-meta-wide">
              <div>
                <dt>Propriétaire</dt>
                <dd>Paul Larmaraud, cofondateur</dd>
              </div>
              <div>
                <dt>Responsabilité</dt>
                <dd>Le périmètre déployé et sa remise en main</dd>
              </div>
              <div>
                <dt>Méthode</dt>
                <dd>{FACTS.methode.etapes.map((e) => e.titre).join(" · ")}</dd>
              </div>
            </dl>
            <div className="d-months">
              {FACTS.offre.mois.map((m) => (
                <div key={m.n}>
                  <p className="d-mono">{m.n}</p>
                  <p className="d-months-t">{m.titre}</p>
                  <p className="d-months-b">{m.corps}</p>
                </div>
              ))}
            </div>
            <p className="d-mono d-mention">{FACTS.offre.mention}</p>
          </div>
        </div>
      </section>

      {/* CTA final. Contraste maximal, dernière bascule. */}
      <section className="d-final">
        <div className="d-wrap">
          <p className="d-mono d-index">09 · Prochaine étape</p>
          <h2 className="d-final-t">{FACTS.final.titre}</h2>
          <p className="d-final-b">{FACTS.final.texte}</p>
          <div className="d-actions">
            <a className="d-cta is-final" href={FACTS.cta.final.href}>
              {FACTS.cta.final.label}
            </a>
          </div>
        </div>
      </section>

      <footer className="d-wrap d-foot">
        <p className="d-mono">Concept D · Editorial Operating System · laboratoire interne</p>
        <p className="d-mono">{FACTS.hermes.attribution}</p>
      </footer>
    </div>
  );
}
