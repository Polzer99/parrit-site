"use client";

import {
  DEMO_LABEL,
  DOSSIER_INITIAL,
  GATE,
  type BrancheId,
} from "../product-living-scene/scenario";
import { TIMELINE } from "../product-living-scene/useScene";
import {
  ANCRE_SURFACE,
  CHAPITRES,
  CONSEQUENCES,
  CONTRADICTION,
  NOYAU,
  OCCURRENCE,
  SURFACE_BOX,
  UI2,
  ancreModule,
  type ModuleId,
} from "./renderer";
import { Surface } from "./Surfaces";
import { useRenderer, type RendererState } from "./useRenderer";
import "./scene-v2.css";

/**
 * PRODUCT-LIVING-SYSTEM-SCENE-V2
 *
 * Second renderer de la scène Product Living System. Le moteur ne change pas :
 * même scénario, même horloge, même arrêt réel au HumanGate, mêmes branches.
 * Ce qui change, c'est ce que l'on voit.
 *
 * La V1 reste en place à /art-direction-lab/product-living-scene. Rien n'est
 * déclaré approuvé par ce fichier : la scène est expérimentale et n'appartient
 * pas au design system.
 */
export function SceneV2() {
  const s = useRenderer();

  return (
    <div
      className="pv2"
      data-phase={s.phase}
      data-version={`v${s.version}`}
      data-branche={s.branche ?? "aucune"}
      data-chapitre={s.chapitre}
      data-commit={s.commit ? "oui" : "non"}
      data-reduced={s.reduced ? "oui" : undefined}
    >
      <Topbar s={s} />
      {s.compact ? <Chapitres s={s} /> : <Plateau s={s} />}
      <Rail s={s} />
    </div>
  );
}

/* ======================================================================== */
/* Barre haute — compacte. Aucun manifeste, aucun titre d'un tiers d'écran.  */
/* ======================================================================== */

function Topbar({ s }: { s: RendererState }) {
  return (
    <header className="pv2-top">
      <div className="pv2-top-gauche">
        <span className="pv2-point" aria-hidden="true" />
        <span className="pv2-produit">{UI2.produit}</span>
        <span className="pv2-mono pv2-top-ref">
          {UI2.objet} · {DOSSIER_INITIAL.reference}
        </span>
        <span className="pv2-mono pv2-demo">
          {DEMO_LABEL.produit} · {DEMO_LABEL.donnees}
        </span>
      </div>
      <div className="pv2-top-droite">
        <p className="pv2-etat-majeur">{s.etat}</p>
        <Cadran s={s} />
      </div>
    </header>
  );
}

/** Cadran de version. Ni onglets, ni texte : quatre crans, un seul allumé. */
function Cadran({ s }: { s: RendererState }) {
  return (
    <div className="pv2-cadran" role="group" aria-label="Version du dossier">
      {[0, 1, 2, 3].map((v) => (
        <button
          key={v}
          type="button"
          className="pv2-cran"
          data-atteinte={v <= s.version ? "oui" : "non"}
          data-courante={v === s.version ? "oui" : undefined}
          data-comparee={s.versionComparee === v ? "oui" : undefined}
          disabled={v > s.version}
          onClick={() => s.setVersionComparee(s.versionComparee === v ? null : v)}
          aria-label={`Version ${v}`}
          aria-pressed={s.versionComparee === v}
        >
          <span aria-hidden="true" />
        </button>
      ))}
      <span className="pv2-mono pv2-cadran-val">v{s.version}</span>
    </div>
  );
}

/* ======================================================================== */
/* PLATEAU — l'espace de travail plein viewport.                            */
/* ======================================================================== */

function Plateau({ s }: { s: RendererState }) {
  const comparaison = s.versionComparee !== null && s.versionComparee < s.version;

  return (
    <div className="pv2-field" data-gate={s.bloque ? "oui" : undefined}>
      {/* Profondeur : des plans de systèmes disponibles, en retrait. Ils ne
          décorent pas, ils disent qu'il y a un arrière-plan technique. */}
      <div className="pv2-fond" aria-hidden="true">
        <span className="pv2-fond-a" />
        <span className="pv2-fond-b" />
        <span className="pv2-texture" />
      </div>

      {/* Faisceaux de travail. En encre, jamais en rouge : un transfert normal
          n'est pas une alerte. */}
      <svg className="pv2-beams" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {s.modules.map((m) => {
          const a = m.agent;
          if (!a || a.progression === 0 || a.progression === 1) return null;
          const from = ANCRE_SURFACE[a.surface];
          const to = ancreModule(m);
          const x = from.x + (to.x - from.x) * a.progression;
          const y = from.y + (to.y - from.y) * a.progression;
          return (
            <line
              key={m.id}
              className="pv2-beam"
              data-attenue={s.agentSurvole !== null && s.agentSurvole !== a.id ? "oui" : undefined}
              x1={from.x}
              y1={from.y}
              x2={x}
              y2={y}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {/* Surfaces logicielles. Elles entrent quand elles servent, se rétractent
          ensuite, et se rallument si la sortie les concerne. */}
      {s.surfaces.map((surf) => {
        const box = SURFACE_BOX[surf.id];
        const cote = box.cote === "gauche" ? { left: `${box.x}%` } : { right: `${box.x}%` };
        return (
          <div key={surf.id} className="pv2-slot-surface" style={{ ...cote, top: `${box.y}%` }}>
            <Surface surf={surf} s={s} />
          </div>
        );
      })}

      {/* Curseurs d'agents : seulement ceux qui travaillent réellement. */}
      {s.modules.map((m) => {
        const a = m.agent;
        if (!a || !a.actif) return null;
        const from = ANCRE_SURFACE[a.surface];
        const to = ancreModule(m);
        return (
          <button
            key={a.id}
            type="button"
            className="pv2-agent is-actif"
            data-echoue={a.bloque ? "oui" : undefined}
            style={{
              left: `${from.x + (to.x - from.x) * a.progression}%`,
              top: `${from.y + (to.y - from.y) * a.progression}%`,
            }}
            onMouseEnter={() => s.setAgentSurvole(a.id)}
            onMouseLeave={() => s.setAgentSurvole(null)}
            onFocus={() => s.setAgentSurvole(a.id)}
            onBlur={() => s.setAgentSurvole(null)}
            aria-label={`${a.role} : ${a.geste}`}
          >
            <span className="pv2-agent-code">{m.code}</span>
            <span className="pv2-agent-geste">{a.geste}</span>
          </button>
        );
      })}

      <Noyau s={s} comparaison={comparaison} />

      {s.bloque ? <GatePanel s={s} /> : null}

      {s.occurrence && s.branche ? <Occurrence s={s} /> : null}
    </div>
  );
}

/* ======================================================================== */
/* NOYAU — l'objet de travail. Une architecture modulaire, pas un document.  */
/* ======================================================================== */

function Noyau({ s, comparaison }: { s: RendererState; comparaison: boolean }) {
  const flash = s.commit && s.t < TIMELINE.T_GATE + 2100;
  const contradiction = s.bloque;

  return (
    <section
      className="pv2-noyau"
      style={{
        left: `${NOYAU.left}%`,
        top: `${NOYAU.top}%`,
        width: `${NOYAU.width}%`,
        height: `${NOYAU.height}%`,
      }}
      aria-label={`${UI2.objet}, état : ${s.etat}`}
    >
      <div className="pv2-noyau-cadre" aria-hidden="true" />

      {/* Dépendances entre modules. Ce sont des filets courts à l'intérieur de
          l'objet : ils disent qu'un module en tient un autre. */}
      <svg className="pv2-liens" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {s.modules.flatMap((m) =>
          m.depend.map((d) => {
            const cible = s.modules.find((x) => x.id === d);
            if (!cible) return null;
            const a = local(ancreModule(m));
            const b = local(ancreModule(cible));
            const rouge =
              contradiction &&
              ((m.id === CONTRADICTION[0] && cible.id === CONTRADICTION[1]) ||
                (m.id === CONTRADICTION[1] && cible.id === CONTRADICTION[0]));
            return (
              <line
                key={`${m.id}-${d}`}
                className="pv2-lien"
                data-rouge={rouge ? "oui" : undefined}
                data-vif={m.etat !== "vide" && cible.etat !== "vide" ? "oui" : undefined}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                vectorEffect="non-scaling-stroke"
              />
            );
          }),
        )}
      </svg>

      {/* La contradiction que la machine ne peut pas trancher seule. Elle est
          dans sa propre couche, au-dessus des modules, sinon elle passerait
          derrière eux et personne ne la verrait. */}
      {contradiction ? (
        <svg
          className="pv2-contradictions"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <ContradictionLigne s={s} />
        </svg>
      ) : null}

      <div className="pv2-grille">
        {s.modules.map((m) => (
          <button
            key={m.id}
            type="button"
            className="pv2-module"
            style={{
              gridColumn: `${m.col} / span ${m.colSpan}`,
              gridRow: `${m.row} / span ${m.rowSpan}`,
            }}
            data-module={m.id}
            data-etat={m.etat}
            data-isole={m.isole ? "oui" : undefined}
            data-probleme={s.bloque && m.id === CONTRADICTION[0] ? "oui" : undefined}
            data-propose={s.bloque && m.id === CONTRADICTION[1] ? "oui" : undefined}
            data-diff={
              comparaison && m.etat !== "vide"
                ? m.etat === "bloque"
                  ? "modifie"
                  : m.version > (s.versionComparee ?? 0)
                    ? "ajoute"
                    : "inchange"
                : undefined
            }
            onMouseEnter={() => s.setModuleSurvole(m.id)}
            onMouseLeave={() => s.setModuleSurvole(null)}
            onFocus={() => s.setModuleSurvole(m.id)}
            onBlur={() => s.setModuleSurvole(null)}
            aria-label={`${m.label} : ${m.valeur ?? "en attente"}`}
          >
            <span className="pv2-module-code">{m.code}</span>
            <span className="pv2-module-label">{m.label}</span>
            {m.valeur ? <span className="pv2-module-valeur">{m.valeur}</span> : null}
            <span className="pv2-module-jauge" aria-hidden="true">
              <span style={{ transform: `scaleX(${m.agent?.progression ?? (m.valeur ? 1 : 0)})` }} />
            </span>
          </button>
        ))}
      </div>

      {/* Détail au survol : provenance, agent, version. Il ne s'affiche que
          lorsqu'on le demande, sinon la scène redeviendrait une fiche. */}
      {s.moduleActif && s.moduleActif.etat !== "vide" ? (
        <p className="pv2-module-detail pv2-mono">
          {s.moduleActif.agent
            ? `${s.moduleActif.agent.role} · ${labelSurface(s, s.moduleActif.agent.surface)}`
            : "Décision humaine"}
          {" · "}v{s.moduleActif.version}
          {s.moduleActif.etat === "bloque" ? " · source manquante" : ""}
        </p>
      ) : null}

      {comparaison ? (
        <p className="pv2-mono pv2-comparaison">
          Comparé à v{s.versionComparee} : ajouté, modifié, inchangé.
        </p>
      ) : null}

      {/* Moment de commit. Un des rares moments en condensée. */}
      {flash ? <p className="pv2-commit">{UI2.commit}</p> : null}
    </section>
  );
}

function ContradictionLigne({ s }: { s: RendererState }) {
  const a = s.modules.find((m) => m.id === CONTRADICTION[0]);
  const b = s.modules.find((m) => m.id === CONTRADICTION[1]);
  if (!a || !b) return null;
  const p = local(ancreModule(a));
  const q = local(ancreModule(b));
  return (
    <line
      className="pv2-contradiction"
      x1={p.x}
      y1={p.y}
      x2={q.x}
      y2={q.y}
      vectorEffect="non-scaling-stroke"
    />
  );
}

/** Convertit une ancre du plateau en coordonnées internes au noyau. */
function local(p: { x: number; y: number }) {
  return {
    x: ((p.x - NOYAU.left) / NOYAU.width) * 100,
    y: ((p.y - NOYAU.top) / NOYAU.height) * 100,
  };
}

function labelSurface(s: RendererState, id: string) {
  return s.surfaces.find((x) => x.id === id)?.label ?? id;
}

/* ======================================================================== */
/* HUMAN GATE — intégré à l'objet, pas posé par-dessus.                     */
/* ======================================================================== */

function GatePanel({ s }: { s: RendererState }) {
  return (
    <aside className="pv2-gate" aria-label="Décision humaine requise">
      <p className="pv2-mono pv2-gate-tag">{UI2.gateTag}</p>
      <p className="pv2-gate-question">{GATE.question}</p>
      <p className="pv2-gate-pourquoi">{GATE.pourquoi}</p>

      <div className="pv2-gate-owner">
        {/* Photographie documentaire réelle, recadrée. Aucun visage généré,
            aucun portrait décoratif : elle nomme qui porte la décision. */}
        <img className="pv2-photo" src={UI2.photoGate} alt="" width={44} height={44} />
        <span className="pv2-mono">{GATE.proprietaire}</span>
      </div>

      <ul className="pv2-options">
        {GATE.options.map((o) => {
          const c = CONSEQUENCES[o.id as BrancheId];
          /* Corriger n'est pas un bouton de plus : c'est un choix précis. */
          if (c.choix) {
            return (
              <li key={o.id} className="pv2-option pv2-option-choix">
                <p className="pv2-option-label">{o.label}</p>
                <p className="pv2-option-effet">{c.effet}</p>
                <div className="pv2-choix">
                  {c.choix.map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      className="pv2-choix-btn"
                      onClick={() => s.decider(o.id as BrancheId)}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
                <p className="pv2-option-risque">{c.risque}</p>
              </li>
            );
          }
          return (
            <li key={o.id} className="pv2-option">
              <button
                type="button"
                className="pv2-option-btn"
                data-ton={o.tonalite}
                onClick={() => s.decider(o.id as BrancheId)}
              >
                <span className="pv2-option-label">{o.label}</span>
                <span className="pv2-option-effet">{c.effet}</span>
                <span className="pv2-option-risque">{c.risque}</span>
                <span className="pv2-option-pied">
                  <span className="pv2-mono pv2-option-version">{c.version}</span>
                  {c.surface ? (
                    <span className="pv2-mono pv2-option-surface">
                      consulte {labelSurface(s, c.surface)}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

/* ======================================================================== */
/* OCCURRENCE SUIVANTE — la règle corrigée s'applique, et ça se voit.       */
/* ======================================================================== */

function Occurrence({ s }: { s: RendererState }) {
  const o = OCCURRENCE[s.branche as BrancheId];
  return (
    <section className="pv2-occurrence" aria-label={UI2.occurrence}>
      <p className="pv2-mono pv2-occ-tag">{UI2.occurrence}</p>
      <ol className="pv2-occ-trace">
        <li>{o.quand}</li>
        <li>Politique {"→"} v2</li>
        <li className="pv2-occ-effet">{o.effet}</li>
      </ol>
    </section>
  );
}

/* ======================================================================== */
/* RAIL DE LECTURE — intégré, pas trois boutons posés sous la scène.        */
/* ======================================================================== */

function Rail({ s }: { s: RendererState }) {
  return (
    <div className="pv2-rail">
      <span className="pv2-mono pv2-rail-phase">{phaseLabel(s.phase)}</span>
      <span className="pv2-piste" aria-hidden="true">
        <span className="pv2-piste-fill" style={{ transform: `scaleX(${Math.min(1, s.t / TIMELINE.T_FIN)})` }} />
        {/* Les crans marquent les phases : la lecture est située, pas linéaire. */}
        {[TIMELINE.T_SIGNAL, TIMELINE.T_ORCH, TIMELINE.T_CONV, TIMELINE.T_GATE, TIMELINE.T_SORTIE].map(
          (t) => (
            <span key={t} className="pv2-piste-cran" style={{ left: `${(t / TIMELINE.T_FIN) * 100}%` }} />
          ),
        )}
      </span>
      <div className="pv2-rail-ctrls">
        <button type="button" className="pv2-ctrl" onClick={s.replay}>
          {UI2.controles.replay}
        </button>
        <button
          type="button"
          className="pv2-ctrl"
          onClick={s.togglePause}
          disabled={s.bloque || s.fini}
        >
          {s.running ? UI2.controles.pause : UI2.controles.reprendre}
        </button>
        <button type="button" className="pv2-ctrl" onClick={s.step} disabled={s.bloque}>
          {UI2.controles.step}
        </button>
      </div>
      <p className="pv2-conclusion">{UI2.conclusion}</p>
    </div>
  );
}

/* ======================================================================== */
/* MOBILE — sept chapitres plein écran, un événement majeur par écran.      */
/* ======================================================================== */

function Chapitres({ s }: { s: RendererState }) {
  return (
    <div className="pv2-chapitres" ref={s.enregistrerConteneur}>
      {CHAPITRES.map((c) => {
        const actif = c.id === s.chapitre;
        const surf = c.surface ? s.surfaces.find((x) => x.id === c.surface) : null;
        return (
          <section
            key={c.id}
            className="pv2-chapitre"
            ref={s.enregistrerChapitre(c.id)}
            data-actif={actif ? "oui" : undefined}
            aria-label={`Chapitre ${c.num} sur ${CHAPITRES.length} : ${c.titre}`}
          >
            <header className="pv2-chap-head">
              <span className="pv2-mono">
                {c.num} / {CHAPITRES.length}
              </span>
              <h2 className="pv2-chap-titre">{c.titre}</h2>
            </header>

            {/* L'objet reste lisible dans chaque chapitre, en bande compacte. */}
            <NoyauCompact s={s} focus={c.focus} />

            {surf ? (
              <div className="pv2-chap-surface">
                <Surface surf={surf} s={s} />
              </div>
            ) : null}

            {c.id === "decision" && s.bloque ? <GateMobile s={s} /> : null}
            {c.id === "amelioration" && s.occurrence && s.branche ? <Occurrence s={s} /> : null}
          </section>
        );
      })}
    </div>
  );
}

/** Le dossier en bande : huit modules, leur état, et le module du chapitre. */
function NoyauCompact({ s, focus }: { s: RendererState; focus: ModuleId | null }) {
  const m = focus ? s.modules.find((x) => x.id === focus) : null;
  return (
    <div className="pv2-noyau-compact" aria-label={`${UI2.objet} : ${s.etat}`}>
      <div className="pv2-bande">
        {s.modules.map((x) => (
          <span
            key={x.id}
            className="pv2-tuile"
            data-etat={x.etat}
            data-focus={x.id === focus ? "oui" : undefined}
          >
            {x.code}
          </span>
        ))}
      </div>
      {m && m.valeur ? (
        <p className="pv2-bande-valeur">
          <span className="pv2-mono">{m.label}</span> {m.valeur}
        </p>
      ) : (
        <p className="pv2-bande-valeur pv2-mono">{s.etat}</p>
      )}
    </div>
  );
}

/** Le gate mobile occupe l'écran, mais l'objet reste visible au-dessus. */
function GateMobile({ s }: { s: RendererState }) {
  return (
    <aside className="pv2-gate pv2-gate-mobile" aria-label="Décision humaine requise">
      <p className="pv2-mono pv2-gate-tag">{UI2.gateTag}</p>
      <p className="pv2-gate-question">{GATE.question}</p>
      <p className="pv2-gate-pourquoi">{GATE.pourquoi}</p>
      <ul className="pv2-options">
        {GATE.options.map((o) => {
          const c = CONSEQUENCES[o.id as BrancheId];
          return (
            <li key={o.id} className="pv2-option">
              <button
                type="button"
                className="pv2-option-btn"
                data-ton={o.tonalite}
                onClick={() => s.decider(o.id as BrancheId)}
              >
                <span className="pv2-option-label">{o.label}</span>
                <span className="pv2-option-effet">{c.effet}</span>
                <span className="pv2-mono pv2-option-version">{c.version}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
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
