"use client";

import {
  CHAPITRES,
  DECISION,
  MANQUE,
  MENTIONS,
  OBJET,
  SORTIES,
  VERIFICATIONS,
} from "./moments";
import type { BoucleState } from "./useBoucle";

/**
 * PRODUCT-LIVING-HERO-CLARITY-POLISH-V1 — le bloc de preuve.
 *
 * Cinq chapitres, un seul visible à la fois. L'objet de travail est le seul
 * élément permanent : c'est le fil que l'œil suit d'un chapitre à l'autre.
 *
 * Règle appliquée partout : UNE surface détaillée, le reste atténué ou
 * absent. Aucune surface fantôme laissée pour faire riche.
 *
 * Ce que le hero ne montre pas : identifiants, règles, codes, versions,
 * horodatages, niveaux de confiance, provenance. Un lien mène à la
 * démonstration longue, qui les porte toutes.
 */
export function ProofLoop({ s }: { s: BoucleState }) {
  const c = s.definition;

  return (
    <figure
      className="hp-proof"
      data-focus={s.focus}
      data-chapitre={s.chapitre}
      data-arrete={s.arrete ? "oui" : undefined}
      aria-label="Démonstration : une demande arrive, les informations sont vérifiées, une information manque, un humain décide, l'action est préparée."
    >
      <header className="hp-proof-tete">
        <span className="hp-marque" aria-hidden="true" />
        <span className="hp-specimen">{MENTIONS.specimen}</span>
        <span className="hp-index">
          {String(s.index).padStart(2, "0")} / {String(CHAPITRES.length).padStart(2, "0")}
        </span>
      </header>

      {/* Le chapitre courant. Ils occupent tous le même emplacement : la
          composition ne bouge jamais, donc rien ne peut déborder au passage
          de l'un à l'autre. */}
      <div className="hp-chapitre" key={s.chapitre === "respiration" ? "sortie" : s.chapitre}>
        <p className="hp-chap-titre">{c.titre}</p>
        <p className="hp-chap-info">{c.info}</p>

        <div className="hp-chap-corps">
          {s.focus === "signal" ? <span className="hp-corps-vide" aria-hidden="true" /> : null}

          {s.focus === "verification" ? (
            <ul className="hp-verifs">
              {VERIFICATIONS.map((v, i) => (
                <li key={v.quoi} data-vu={s.dans > 0.15 + i * 0.35 ? "oui" : "non"}>
                  <span className="hp-verif-cle">{v.quoi}</span>
                  <span className="hp-verif-valeur">{v.valeur}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {s.focus === "missing_information" ? (
            <p className="hp-manque">
              <span className="hp-manque-cle">{MANQUE.quoi}</span>
              <span className="hp-manque-valeur">{MANQUE.valeur}</span>
            </p>
          ) : null}

          {s.focus === "human_decision" ? (
            <div className="hp-decision">
              <p className="hp-decision-action">{DECISION.action}</p>
              <p className="hp-decision-acte" data-vu={s.decidee ? "oui" : "non"}>
                {/* Photographie documentaire réelle. Elle nomme qui décide ;
                    le bloc tient sans elle. */}
                <img className="hp-photo" src={DECISION.photo} alt="" width={26} height={26} />
                {DECISION.acte}
              </p>
            </div>
          ) : null}

          {s.focus === "output" ? (
            <ul className="hp-sorties">
              {SORTIES.map((o, i) => (
                <li key={o.destination} data-vu={s.chapitre === "respiration" || s.dans > 0.1 + i * 0.22 ? "oui" : "non"}>
                  <span className="hp-sortie-dest">{o.destination}</span>
                  <span className="hp-sortie-ligne">{o.ligne}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {/* L'objet de travail. Permanent, contextuel, jamais dominant. */}
      <div className="hp-objet">
        <span className="hp-objet-titre">{OBJET.titre}</span>
        <span className="hp-objet-ligne">{OBJET.personne}</span>
      </div>

      {/* Repère de lecture : cinq crans, aucune commande. */}
      <span className="hp-crans" aria-hidden="true">
        {CHAPITRES.map((x, i) => (
          <span key={x.id} data-fait={s.index > i ? "oui" : "non"} data-courant={s.index === i + 1 ? "oui" : undefined} />
        ))}
      </span>
    </figure>
  );
}
