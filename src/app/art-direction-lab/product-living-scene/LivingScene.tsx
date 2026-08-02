"use client";

import { useId } from "react";
import {
  BRANCHES,
  CHAMPS,
  DEMO_LABEL,
  DOSSIER_INITIAL,
  GATE,
  SURFACES,
  UI,
  type BrancheId,
} from "./scenario";
import { ANCRES, ANCRE_DOSSIER, TIMELINE, useScene } from "./useScene";
import "./scene.css";

/**
 * PRODUCT-LIVING-SYSTEM-SCENE-V1
 *
 * Une seule scène continue. Pas une page à sections, pas un tableau de bord,
 * pas un rapport. Le dossier d'opportunité reste au centre du début à la fin ;
 * les surfaces et les agents entrent et sortent autour de lui.
 *
 * Cette scène est expérimentale. Elle n'appartient pas au design system.
 */
export function LivingScene() {
  const s = useScene();
  const gradId = useId().replace(/:/g, "");

  const branche = s.branche ? BRANCHES[s.branche] : null;

  return (
    <div
      className={`pls pls-phase-${s.phase}${s.reduced ? " is-reduced" : ""}`}
      data-phase={s.phase}
      data-version={`v${s.version}`}
      data-branche={s.branche ?? "aucune"}
    >
      <header className="pls-head">
        <p className="pls-demo">
          <span>{DEMO_LABEL.produit}</span>
          <span>{DEMO_LABEL.donnees}</span>
        </p>
        <h1 className="pls-titre">{UI.titre}</h1>
      </header>

      {/* ================= SCÈNE ================= */}
      <div className="pls-stage" role="img" aria-label={`${UI.objet}, état : ${s.etat}`}>
        {/* Plans de fond. Deux surfaces décalées, jamais une carte : elles
            créent la profondeur sans ombre ni verre. */}
        <div className="pls-plan pls-plan-1" aria-hidden="true" />
        <div className="pls-plan pls-plan-2" aria-hidden="true" />
        {/* Lumière fonctionnelle : elle suit l'activité, pas l'esthétique. */}
        <div className="pls-lumiere" aria-hidden="true" />

        {/* Faisceaux d'exécution. Chaque ligne est une intervention réelle. */}
        <svg className="pls-beams" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <marker id={`tip-${gradId}`} markerWidth="4" markerHeight="4" refX="2" refY="2">
              <rect width="4" height="4" fill="var(--pls-red)" />
            </marker>
          </defs>
          {s.agents.map((a) => {
            const from = ANCRES[a.surface];
            if (!from || a.progression === 0) return null;
            const x = from.x + (ANCRE_DOSSIER.x - from.x) * a.progression;
            const y = from.y + (ANCRE_DOSSIER.y - from.y) * a.progression;
            return (
              <line
                key={a.id}
                className={`pls-beam${a.echoue ? " is-echoue" : ""}${
                  s.agentSurvole === a.id ? " is-survole" : ""
                }`}
                x1={from.x}
                y1={from.y}
                x2={x}
                y2={y}
                markerEnd={a.actif ? `url(#tip-${gradId})` : undefined}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {/* Surfaces logicielles. Fenêtres partielles, jamais un faux écran. */}
        {SURFACES.map((surf) => {
          const agent = s.agents.find((a) => a.surface === surf.id);
          const a = ANCRES[surf.id];
          const actif = Boolean(agent?.actif);
          const lu = Boolean(agent?.termine);
          const bloquee = Boolean(agent?.echoue);
          return (
            <button
              key={surf.id}
              type="button"
              className={`pls-surface${actif ? " is-actif" : ""}${lu ? " is-lu" : ""}${
                bloquee ? " is-bloquee" : ""
              }${s.sourceChoisie === surf.id ? " is-choisie" : ""}`}
              style={{ left: `${a.x}%`, top: `${a.y}%` }}
              onClick={() =>
                s.setSourceChoisie(s.sourceChoisie === surf.id ? null : surf.id)
              }
              aria-pressed={s.sourceChoisie === surf.id}
            >
              <span className="pls-surface-label">{surf.label}</span>
              <span className="pls-surface-role">{bloquee ? "bloquée" : surf.role}</span>
              {s.sourceChoisie === surf.id ? (
                <span className="pls-surface-apport">{surf.apporte}</span>
              ) : null}
            </button>
          );
        })}

        {/* ============ OBJET CENTRAL ============ */}
        <section className="pls-dossier" aria-label={UI.objet}>
          <header className="pls-dossier-head">
            <p className="pls-mono">
              {UI.objet} · {DOSSIER_INITIAL.reference}
            </p>
            <div className="pls-versions">
              {[0, 1, 2, 3].map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`pls-version${v === s.version ? " is-courante" : ""}${
                    v <= s.version ? " is-atteinte" : ""
                  }${s.versionComparee === v ? " is-comparee" : ""}`}
                  disabled={v > s.version}
                  onClick={() => s.setVersionComparee(s.versionComparee === v ? null : v)}
                  aria-pressed={s.versionComparee === v}
                >
                  v{v}
                </button>
              ))}
            </div>
          </header>

          <p className={`pls-etat pls-etat-${slug(s.etat)}`}>{s.etat}</p>

          {/* Les champs se composent en couches. Ce n'est pas un formulaire :
              rien n'est réservé à l'avance, chaque ligne est déposée. */}
          <ul className="pls-champs">
            {s.champs.map((c) => (
              <li
                key={c.id}
                className={`pls-champ pls-couche-${CHAMPS[c.id].couche}${
                  c.bloque ? " is-bloque" : ""
                }${
                  s.versionComparee !== null && s.versionComparee < s.version
                    ? " is-diff"
                    : ""
                }`}
              >
                <span className="pls-champ-label">{CHAMPS[c.id].label}</span>
                <span className="pls-champ-valeur">{c.bloque ?? c.valeur}</span>
              </li>
            ))}
          </ul>

          {s.versionComparee !== null && s.versionComparee < s.version ? (
            <p className="pls-mono pls-diff-note">
              Comparaison avec v{s.versionComparee} : les lignes marquées ont été
              ajoutées depuis.
            </p>
          ) : null}
        </section>

        {/* ============ HUMAN GATE ============ */}
        {s.bloque ? (
          <div className="pls-gate" role="group" aria-label="Décision humaine requise">
            <div className="pls-gate-inner">
              <p className="pls-mono pls-gate-tag">Le système est arrêté</p>
              <p className="pls-gate-question">{GATE.question}</p>
              <p className="pls-gate-pourquoi">{GATE.pourquoi}</p>
              <p className="pls-mono">{GATE.proprietaire}</p>
              <div className="pls-gate-actions">
                {GATE.options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className={`pls-btn${o.tonalite === "primaire" ? " is-primaire" : ""}`}
                    onClick={() => s.decider(o.id as BrancheId)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* ============ SORTIE ============ */}
        {/* La sortie apparaît une fois l'action réellement préparée, pas au
            clic : il faut que quelque chose se soit passé entre les deux. */}
        {branche ? (
          <div
            className={`pls-sortie${s.t >= TIMELINE.T_GATE + 900 ? " is-visible" : ""}`}
          >
            <p className="pls-mono">Sortie</p>
            <p className="pls-sortie-titre">{branche.sortie}</p>
            <p className="pls-sortie-detail">{branche.sortieDetail}</p>
          </div>
        ) : null}
      </div>

      {/* Lignes d'exécution, sous le plateau. Ce sont des processus, pas des
        cartes ni des avatars : chacun porte sa progression réelle. */}
      <ul className="pls-agents">
        {s.agents.map((a) => (
          <li key={a.id}>
            <button
              type="button"
              className={`pls-agent${a.actif ? " is-actif" : ""}${
                a.termine ? " is-termine" : ""
              }${a.echoue ? " is-echoue" : ""}`}
              onMouseEnter={() => s.setAgentSurvole(a.id)}
              onMouseLeave={() => s.setAgentSurvole(null)}
              onFocus={() => s.setAgentSurvole(a.id)}
              onBlur={() => s.setAgentSurvole(null)}
            >
              <span className="pls-agent-role">{a.role}</span>
              <span className="pls-agent-barre" aria-hidden="true">
                <span style={{ transform: `scaleX(${a.progression})` }} />
              </span>
              <span className="pls-agent-geste">
                {a.echoue ? a.bloque : a.termine ? a.valeur : a.geste}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* ============ BOUCLE D'AMÉLIORATION ============ */}
      {/* La boucle EST la phase 6 : elle apparaît avec elle, pas à la toute
          fin, sinon elle serait invisible en mouvement réduit. */}
      {branche && (s.phase === "boucle" || s.fini) ? (
        <section className="pls-boucle" aria-label="Boucle d'amélioration">
          <div>
            <p className="pls-mono">{UI.regle.avant}</p>
            <p className="pls-regle is-avant">{branche.regleAvant}</p>
          </div>
          <span className="pls-boucle-fleche" aria-hidden="true" />
          <div>
            <p className="pls-mono pls-red">{UI.regle.apres}</p>
            <p className="pls-regle is-apres">{branche.regleApres}</p>
            <p className="pls-mono">
              Modification enregistrée par {GATE.proprietaire}. Rien n&apos;a été appris
              automatiquement.
            </p>
          </div>
        </section>
      ) : null}

      {/* ============ CONTRÔLES ============ */}
      <div className="pls-controls">
        <button type="button" className="pls-ctrl" onClick={s.replay}>
          {UI.controles.replay}
        </button>
        <button
          type="button"
          className="pls-ctrl"
          onClick={s.togglePause}
          disabled={s.bloque || s.fini}
        >
          {s.running ? UI.controles.pause : UI.controles.reprendre}
        </button>
        <button type="button" className="pls-ctrl" onClick={s.step} disabled={s.bloque}>
          {UI.controles.step}
        </button>
        <span className="pls-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.min(1, s.t / 8700)})` }} />
        </span>
        <span className="pls-mono pls-phase-label">{phaseLabel(s.phase)}</span>
      </div>

      <section className="pls-legend">
        <p className="pls-mono">{UI.legende.titre}</p>
        <ul>
          {UI.legende.lignes.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z]+/g, "-");
}

function phaseLabel(p: string) {
  const m: Record<string, string> = {
    attente: "Veille",
    signal: "Signal entrant",
    orchestration: "Travail parallèle",
    convergence: "Convergence",
    gate: "Décision humaine",
    reprise: "Sortie",
    boucle: "Amélioration",
  };
  return m[p] ?? p;
}
