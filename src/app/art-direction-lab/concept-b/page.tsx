import type { Metadata } from "next";
import { FACTS } from "../content";
import { LabBar } from "../LabBar";

export const metadata: Metadata = {
  title: "Concept B — Agent Operating System",
  robots: { index: false, follow: false },
};

/**
 * CONCEPT B — AGENT OPERATING SYSTEM
 *
 * Parti pris : la page EST le registre. Ce qui porte la direction, ce sont les
 * traces, les propriétaires et les états, pas une photographie.
 *
 * Contrainte tenue : aucun tableau de bord SaaS. Pas de carte, pas d'ombre,
 * pas de rayon, pas de graphique, pas de badge coloré, pas de faux chiffre.
 * Le système est rendu en typographie de presse, à la manière d'un registre
 * imprimé. Le rouge ne signale qu'une chose : un humain doit trancher.
 *
 * Le portrait est secondaire, en bas, en noir et blanc : l'humain est au bout
 * de la chaîne, il n'est pas la promesse.
 */
export default function ConceptB() {
  return (
    <div className="cB">
      <LabBar current="b" />

      <div className="wrap">
        <header className="head">
          <p className="mono">Registre d&apos;exécution · Parrit</p>
          <h1 className="disp">Chaque ligne a un propriétaire humain.</h1>
          <div className="sub">
            <p>
              Un agent qui tourne sans propriétaire est une panne qui attend.
              Chez Parrit, une chaîne se lit toujours de la même façon : une
              entrée réelle, une sortie définie, quelqu&apos;un qui en répond.
              Quand la décision n&apos;est pas automatisable, la chaîne
              s&apos;arrête et vous appelle.
            </p>
            <p className="mono">
              Entrée → sortie → propriétaire → état.
              <br />
              Le rouge signale une décision humaine, rien d&apos;autre.
            </p>
          </div>
        </header>

        <section className="registre" aria-label="Registre d'exécution">
          {FACTS.traces.map((t, i) => (
            <div className="ligne" key={t.entree}>
              <span className="ligne-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="ligne-in">{t.entree}</span>
              <span className="ligne-arrow" aria-hidden="true">
                →
              </span>
              <span className="ligne-out">{t.sortie}</span>
              <span className="ligne-meta">
                {t.proprietaire}
                <br />
                <span
                  className={t.etat === "décision humaine" ? "etat-decision" : undefined}
                >
                  {t.etat}
                </span>
              </span>
            </div>
          ))}
        </section>

        <section className="fronts" id="fronts">
          {FACTS.fronts.map((f) => (
            <article className="front" key={f.code}>
              <p className="mono">Front {f.code}</p>
              <h2>{f.titre}</h2>
              <p>{f.corps}</p>
            </article>
          ))}
        </section>

        <section className="humain">
          <img
            src="/brand/editorial/portraits/paul-bw.png"
            alt="Paul Larmaraud, cofondateur de Parrit"
            width={1200}
            height={930}
          />
          <div>
            <blockquote>« {FACTS.citation} »</blockquote>
            <p className="mono">
              {FACTS.mains.map((m) => `${m.qui} : ${m.role}`).join(" · ")}
            </p>
          </div>
        </section>

        <section className="offres">
          {FACTS.offres.map((o) => (
            <article className="offre" key={o.n}>
              <p className="mono">{o.n}</p>
              <h3>{o.titre}</h3>
              <p>{o.corps}</p>
              <span className="mono">{o.prix}</span>
            </article>
          ))}
        </section>

        <div className="actions">
          <a className="cta" href={FACTS.cta.principal.href}>
            {FACTS.cta.principal.label}
          </a>
          <span className="mono">{FACTS.cta.principal.note}</span>
        </div>

        <footer className="foot">
          <p>Concept B · Agent Operating System · laboratoire interne</p>
          <p>{FACTS.hermes}</p>
        </footer>
      </div>
    </div>
  );
}
