"use client";

import { useState } from "react";
import Link from "next/link";
import { FACTS } from "../content";
import { MENTIONS } from "./moments";
import { ProofLoop } from "./ProofLoop";
import { useBoucle } from "./useBoucle";
import "./hero-proof.css";

/**
 * PRODUCT-LIVING-HERO-PROOF-V1
 *
 * Hypothèse testée : la CHARPENTE commerciale de Concept D — eyebrow, titre,
 * promesse, appel à l'action, panneau de preuve — combinée à la PREUVE VIVANTE
 * de la scène V2, réduite à six moments compréhensibles sans rien lire.
 *
 * De Concept D on reprend la hiérarchie et la logique de conversion. On ne
 * reprend NI ses filets, NI son registre de rapport, NI ses tableaux.
 *
 * La copy vient mot pour mot de `../content.ts`. Aucun mot n'est écrit ici.
 *
 * Route de laboratoire, non indexée, sans effet sur le site public.
 */

type Traitement = "paper" | "ink";

export function HeroProof() {
  const s = useBoucle();
  /* Deux traitements du MÊME hero. Le choix appartient à Paul : rien ici ne
     désigne de gagnant, et les deux partagent scénario, copy et timing. */
  const [traitement, setTraitement] = useState<Traitement>("paper");

  return (
    <div className="hp" data-traitement={traitement} data-moment={s.moment} data-reduced={s.reduced ? "oui" : undefined}>
      {/* Barre de laboratoire. Elle n'appartient pas au hero : elle sert à
          comparer, et elle disparaîtrait dans une vraie page. */}
      <nav className="hp-lab" aria-label="Laboratoire">
        <Link href="/art-direction-lab">Visual reset v2</Link>
        <span className="hp-lab-titre">Hero proof</span>
        <span className="hp-lab-choix" role="group" aria-label="Traitement du panneau de preuve">
          {(["paper", "ink"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setTraitement(v)}
              aria-pressed={traitement === v}
              data-actif={traitement === v ? "oui" : undefined}
            >
              {v === "paper" ? "Paper" : "Ink"}
            </button>
          ))}
        </span>
        <span className="hp-lab-note">Interne, non publié</span>
      </nav>

      <header className="hp-hero">
        <div className="hp-grid">
          {/* ---- Zone éditoriale : la charpente de conversion ---- */}
          <div className="hp-lede">
            <p className="hp-eyebrow">{FACTS.hero.eyebrow}</p>
            <h1 className="hp-titre">
              {FACTS.hero.titre.map((ligne) => (
                <span key={ligne}>{ligne}</span>
              ))}
            </h1>
            <p className="hp-promesse">{FACTS.hero.texte}</p>
            <div className="hp-actions">
              <a className="hp-cta" href={FACTS.cta.principal.href}>
                {FACTS.cta.principal.label}
              </a>
              <a className="hp-cta-lien" href={FACTS.cta.secondaire.href}>
                {FACTS.cta.secondaire.label}
              </a>
            </div>
          </div>

          {/* ---- Zone de preuve : la boucle autonome ---- */}
          <div className="hp-preuve">
            <ProofLoop s={s} />
            {/* Le lien vers la démonstration longue est secondaire : il ne
                concurrence pas l'appel à l'action commercial. */}
            <a className="hp-demo" href={MENTIONS.demoHref}>
              {MENTIONS.demo}
            </a>
          </div>
        </div>
      </header>
    </div>
  );
}
