"use client";

import {
  ARRET,
  BORNES,
  COMPREHENSION,
  DECISION,
  MENTIONS,
  SIGNAL,
  SORTIES,
} from "./moments";
import type { BoucleState } from "./useBoucle";

/**
 * PRODUCT-LIVING-HERO-PROOF-V1 — le bloc de preuve du hero.
 *
 * Six moments, une boucle de dix secondes, aucune interaction requise.
 *
 * Ce n'est PAS la scène V2 miniaturisée : ni états, ni versions, ni agents
 * listés, ni sources, ni contrôles de lecture, ni identifiants internes. La
 * démonstration longue existe pour ça, et un lien y mène.
 *
 * Le même balisage sert aux deux traitements Paper et Ink : seule la feuille
 * de style change, ce qui garantit que le scénario montré est identique.
 */
export function ProofLoop({ s }: { s: BoucleState }) {
  return (
    <figure
      className="hp-proof"
      data-moment={s.moment}
      data-index={s.index}
      aria-label="Démonstration : une demande arrive, le système travaille, il s'arrête pour une décision humaine, puis l'action est préparée."
    >
      <figcaption className="hp-specimen">{MENTIONS.specimen}</figcaption>

      <div className="hp-stage">
        {/* 01 — quelque chose vient de se produire. */}
        <div className="hp-signal" data-vu={s.atteint("signal") ? "oui" : "non"} data-bloc="signal">
          <p className="hp-tag">{SIGNAL.tag}</p>
          <p className="hp-signal-objet">{SIGNAL.objet}</p>
        </div>

        {/* 02 et 03 — l'objet apparaît, puis se remplit de ce qui a été fait. */}
        <div className="hp-objet" data-vu={s.atteint("comprehension") ? "oui" : "non"} data-bloc="comprehension">
          <p className="hp-objet-titre">{COMPREHENSION.titre}</p>
          <p className="hp-objet-ligne">{COMPREHENSION.entreprise}</p>
          <p className="hp-objet-ligne">{COMPREHENSION.personne}</p>

          <ul className="hp-effets" data-bloc="travail">
            {s.effets.map((e) => (
              <li key={e.cle} data-vu={e.vu ? "oui" : "non"} data-manque={e.manque ? "oui" : undefined}>
                <span className="hp-effet-cle">{e.cle}</span>
                <span className="hp-effet-ligne">{e.ligne}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 04 et 05 — la machine s'arrête, un humain tranche. */}
        <div
          className="hp-arret"
          data-vu={s.atteint("arret") ? "oui" : "non"}
          data-decide={s.atteint("decision") ? "oui" : "non"}
          data-bloc="arret"
        >
          <p className="hp-arret-etat">{ARRET.etat}</p>
          <p className="hp-arret-raison">{ARRET.raison}</p>
          <p className="hp-arret-qui" data-bloc="decision">
            {/* Photographie documentaire réelle, recadrée. Elle nomme qui
                porte la décision ; le bloc tient sans elle. */}
            <img className="hp-photo" src={DECISION.photo} alt="" width={30} height={30} />
            <span className="hp-arret-nom">{DECISION.proprietaire}</span>
            <span className="hp-arret-acte">{DECISION.acte}</span>
          </p>
        </div>

        {/* 06 — la conséquence, là où elle atterrit. */}
        <ul className="hp-sorties" data-vu={s.atteint("action") ? "oui" : "non"} data-bloc="action">
          {SORTIES.map((o) => (
            <li key={o.destination}>
              <span className="hp-sortie-dest">{o.destination}</span>
              <span className="hp-sortie-ligne">{o.ligne}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Repère de lecture passif. Aucune commande : on ne pilote rien ici. */}
      <span className="hp-progression" aria-hidden="true">
        {BORNES.map((b, i) => (
          <span key={b.id} data-fait={s.index > i ? "oui" : "non"} data-courant={s.index === i + 1 ? "oui" : undefined} />
        ))}
      </span>
    </figure>
  );
}
