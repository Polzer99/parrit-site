"use client";

import { useState } from "react";
import Link from "next/link";
import { FACTS } from "../content";
import { MENTIONS } from "./moments";
import { ProofLoop } from "./ProofLoop";
import { useBoucle } from "./useBoucle";
import "./hero-proof.css";

/**
 * PRODUCT-LIVING-HERO-PROOF · passe de clarté
 *
 * Charpente commerciale de Concept D, preuve vivante de la scène, réduite à
 * cinq chapitres qu'une personne non technique peut suivre sans lire les
 * détails.
 *
 * La copy vient mot pour mot de `../content.ts`. Aucun mot n'est écrit ici.
 *
 * `presentation` masque tout le mobilier de laboratoire : c'est dans ce mode
 * que se fait le Retell Test, pour qu'aucun repère interne ne souffle la
 * réponse au visiteur.
 *
 * Route de laboratoire, non indexée, sans effet sur le site public.
 */

type Traitement = "paper" | "ink";

export function HeroProof({ presentation = false }: { presentation?: boolean }) {
  const s = useBoucle();
  /* Ink devient le traitement principal. Paper reste comparable au
     laboratoire, mais ne dicte plus la finition. */
  const [traitement, setTraitement] = useState<Traitement>("ink");

  return (
    <div
      className="hp"
      data-traitement={traitement}
      data-chapitre={s.chapitre}
      data-focus={s.focus}
      data-presentation={presentation ? "oui" : undefined}
      data-reduced={s.reduced ? "oui" : undefined}
    >
      {!presentation ? (
        <nav className="hp-lab" aria-label="Laboratoire">
          <Link href="/art-direction-lab">Visual reset v2</Link>
          <span className="hp-lab-titre">Hero proof</span>
          <span className="hp-lab-choix" role="group" aria-label="Traitement du panneau de preuve">
            {(["ink", "paper"] as const).map((v) => (
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
          <a className="hp-lab-presentation" href="?presentation=1">
            Mode présentation
          </a>
        </nav>
      ) : null}

      <header className="hp-hero">
        <div className="hp-grid">
          {/* ---- Une idée dominante, une action dominante ---- */}
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

          {/* ---- Une preuve dominante ---- */}
          <div className="hp-preuve">
            <ProofLoop s={s} />
            <a className="hp-demo" href={MENTIONS.demoHref}>
              {MENTIONS.demo}
            </a>
          </div>
        </div>
      </header>
    </div>
  );
}
