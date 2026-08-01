"use client";

import { useEffect, useRef } from "react";
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
  INTERNAL,
  OCCURRENCE,
  SURFACE_BOX,
  UI2,
  type ModuleDef,
} from "../product-living-scene-v2/renderer";
import { SurfacePremium } from "./SurfacesPremium";
import { usePremium, type PremiumState } from "./usePremium";
import "./premium.css";

/**
 * PRODUCT-LIVING-SYSTEM-SCENE-V2-PREMIUM-V1
 *
 * Variante de finition de la scène V2. Même moteur, même scénario, mêmes
 * branches, même wording. Ce fichier ne change que la façon dont tout cela
 * est vécu : hiérarchie, lumière, profondeur, mouvement, densité.
 *
 * La V1 et la V2 restent en place, à leurs routes respectives.
 * Rien n'est déclaré approuvé par ce fichier.
 */

/* Le noyau prend plus de place qu'en V2 : les surfaces disponibles se
   rétractent au bord, l'objet gagne le centre. */
const NOYAU = { left: 32, top: 13, width: 36, height: 68 } as const;

/**
 * Poids des quatre rangées du noyau selon la phase. Les modules prioritaires
 * prennent temporairement plus de place.
 *
 * Cette table est la SEULE source : elle produit à la fois le
 * `grid-template-rows` et les ancres des tracés. Séparer les deux revenait à
 * dessiner la contradiction entre deux points qui n'existaient plus une fois
 * les rangées redimensionnées.
 */
const POIDS_RANGEES: Record<string, readonly number[]> = {
  gate: [0.85, 1.32, 1, 0.83],
  reprise: [0.85, 0.9, 1.1, 1.15],
  boucle: [0.85, 0.9, 1.1, 1.15],
};
const POIDS_DEFAUT = [1, 1, 1, 1] as const;

const poidsDe = (phase: string): readonly number[] => POIDS_RANGEES[phase] ?? POIDS_DEFAUT;

/**
 * La photographie documentaire du propriétaire au moment du gate. Elle est
 * FACULTATIVE : la mettre à `false` ne doit rien casser, et le Product First
 * Test se joue sans elle. Elle nomme qui porte la décision, elle ne sauve pas
 * l'interface. Aucun visage généré, recadrage seul.
 */
const PHOTO_GATE = true;

/** Ancre d'un module, dans le plateau, en tenant compte des poids de rangée. */
function ancre(m: ModuleDef, w: readonly number[]) {
  const total = w.reduce((a, b) => a + b, 0);
  const avant = w.slice(0, m.row - 1).reduce((a, b) => a + b, 0);
  const propre = w.slice(m.row - 1, m.row - 1 + m.rowSpan).reduce((a, b) => a + b, 0);
  const colW = NOYAU.width / 3;
  return {
    x: NOYAU.left + (m.col - 1 + m.colSpan / 2) * colW,
    y: NOYAU.top + ((avant + propre / 2) / total) * NOYAU.height,
  };
}

export function ScenePremium() {
  const s = usePremium();

  return (
    <div
      className="pp"
      data-phase={s.phase}
      data-version={`v${s.version}`}
      data-branche={s.branche ?? "aucune"}
      data-chapitre={s.chapitre}
      data-commit={s.commit ? "oui" : "non"}
      data-inspect={s.inspect ? "oui" : undefined}
      data-reduced={s.reduced ? "oui" : undefined}
    >
      <Topbar s={s} />
      {s.compact ? <Chapitres s={s} /> : <Plateau s={s} />}
      <Rail s={s} />
    </div>
  );
}

/* ======================================================================== */
/* TOP BAR — produit, pas console. Cinq informations, pas une de plus.      */
/* ======================================================================== */

function Topbar({ s }: { s: PremiumState }) {
  return (
    <header className="pp-top">
      <span className="pp-marque" aria-hidden="true" />
      <span className="pp-produit">{UI2.produit}</span>

      <span className="pp-sep" aria-hidden="true" />

      <h1 className="pp-dossier">
        {UI2.objet} <span className="pp-ref">{DOSSIER_INITIAL.reference}</span>
      </h1>

      <p className="pp-statut" data-gate={s.bloque ? "oui" : undefined}>
        <span className="pp-statut-point" aria-hidden="true" />
        {s.etat}
      </p>

      <Cadran s={s} />

      <p className="pp-demo">{DEMO_LABEL.donnees}</p>
    </header>
  );
}

/** Cadran de version. Quatre crans, la valeur courante lisible. */
function Cadran({ s }: { s: PremiumState }) {
  return (
    <div className="pp-cadran" role="group" aria-label="Version du dossier">
      <span className="pp-cadran-val">v{s.version}</span>
      <span className="pp-crans">
        {[0, 1, 2, 3].map((v) => (
          <button
            key={v}
            type="button"
            className="pp-cran"
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
      </span>
    </div>
  );
}

/* ======================================================================== */
/* PLATEAU                                                                  */
/* ======================================================================== */

function Plateau({ s }: { s: PremiumState }) {
  const w = poidsDe(s.phase);
  const comparaison = s.versionComparee !== null && s.versionComparee < s.version;

  return (
    <div className="pp-field" data-gate={s.bloque ? "oui" : undefined}>
      {/* Lumière localisée sous l'objet. Elle dit où le travail a lieu ;
          elle ne colore rien et n'éclaire aucune surface au hasard. */}
      <div className="pp-lumiere" aria-hidden="true" />
      <div className="pp-grain" aria-hidden="true" />

      {/* Pistes des agents en cours. Une trajectoire, pas un faisceau d'alerte. */}
      <svg className="pp-pistes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {s.modules.map((m) => {
          const a = m.agent;
          if (!a || !a.actif) return null;
          const from = ANCRE_SURFACE[a.surface];
          const to = ancre(m, w);
          return (
            <g key={m.id} data-attenue={s.agentSurvole && s.agentSurvole !== a.id ? "oui" : undefined}>
              <line className="pp-piste" x1={from.x} y1={from.y} x2={to.x} y2={to.y} vectorEffect="non-scaling-stroke" />
              <line
                className="pp-piste-faite"
                x1={from.x}
                y1={from.y}
                x2={from.x + (to.x - from.x) * a.progression}
                y2={from.y + (to.y - from.y) * a.progression}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        })}
      </svg>

      {s.surfaces.map((surf) => {
        const box = SURFACE_BOX[surf.id];
        const cote = box.cote === "gauche" ? { left: `${box.x}%` } : { right: `${box.x}%` };
        return (
          <div
            key={surf.id}
            className="pp-slot"
            data-cote={box.cote}
            data-niveau={surf.niveau}
            style={{ ...cote, top: `${box.y}%` }}
          >
            <SurfacePremium surf={surf} s={s} />
          </div>
        );
      })}

      {/* Marqueurs d'agents. Un objet transporté, pas une étiquette de debug. */}
      {s.modules.map((m) => {
        const a = m.agent;
        if (!a || !a.actif) return null;
        const from = ANCRE_SURFACE[a.surface];
        const to = ancre(m, w);
        return (
          <button
            key={a.id}
            type="button"
            className="pp-agent is-actif"
            data-echoue={a.bloque ? "oui" : undefined}
            data-focus={s.agentSurvole === a.id ? "oui" : undefined}
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
            <span className="pp-agent-charge" aria-hidden="true" />
            <span className="pp-agent-nom">{a.role}</span>
          </button>
        );
      })}

      <Noyau s={s} comparaison={comparaison} />

      {s.bloque ? <Gate s={s} /> : null}
      {s.occurrence && s.branche ? <Occurrence s={s} /> : null}

      {/* L'impulsion de commit : une ligne de lumière qui traverse une fois. */}
      {s.pulse ? <span className="pp-pulse" aria-hidden="true" /> : null}

      <Inspector s={s} />
    </div>
  );
}

/* ======================================================================== */
/* NOYAU — un châssis, des couches, des modules de poids différents.        */
/* ======================================================================== */

function Noyau({ s, comparaison }: { s: PremiumState; comparaison: boolean }) {
  const w = poidsDe(s.phase);
  return (
    <section
      className="pp-noyau"
      style={{
        left: `${NOYAU.left}%`,
        top: `${NOYAU.top}%`,
        width: `${NOYAU.width}%`,
        height: `${NOYAU.height}%`,
      }}
      aria-label={`${UI2.objet}, état : ${s.etat}`}
    >
      <div className="pp-chassis" aria-hidden="true" />

      {/* Les dépendances n'apparaissent qu'au focus d'un module. En permanence,
          elles retransformaient l'objet en schéma. */}
      <svg className="pp-liens" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {s.moduleSurvole
          ? s.modules.flatMap((m) =>
              m.depend
                .filter((d) => m.id === s.moduleSurvole || d === s.moduleSurvole)
                .map((d) => {
                  const c = s.modules.find((x) => x.id === d);
                  if (!c) return null;
                  const p = local(ancre(m, w));
                  const q = local(ancre(c, w));
                  return (
                    <line key={`${m.id}-${d}`} className="pp-lien" x1={p.x} y1={p.y} x2={q.x} y2={q.y} vectorEffect="non-scaling-stroke" />
                  );
                }),
            )
          : null}
      </svg>

      {/* La contradiction reste au-dessus des modules : c'est ce que la
          machine ne sait pas résoudre seule. */}
      {s.bloque ? (
        <svg className="pp-contradiction" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <Contradiction s={s} w={w} />
        </svg>
      ) : null}

      <div className="pp-grille" style={{ gridTemplateRows: w.map((v) => `${v}fr`).join(" ") }}>
        {s.modules.map((m) => (
          <button
            key={m.id}
            type="button"
            className="pp-module"
            style={{
              gridColumn: `${m.col} / span ${m.colSpan}`,
              gridRow: `${m.row} / span ${m.rowSpan}`,
            }}
            data-module={m.id}
            data-etat={m.etat}
            data-prioritaire={m.prioritaire ? "oui" : undefined}
            data-relie={m.relie ? "oui" : undefined}
            data-isole={m.isole ? "oui" : undefined}
            data-entrant={m.agent?.actif ? "oui" : undefined}
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
            <span className="pp-module-accent" aria-hidden="true" />
            <span className="pp-module-label">{m.label}</span>
            {m.valeur ? <span className="pp-n1 pp-module-valeur">{m.valeur}</span> : null}
            <span className="pp-n3 pp-module-code">
              {m.code} · v{m.version}
            </span>
          </button>
        ))}
      </div>

      {comparaison ? (
        <p className="pp-comparaison">Comparé à v{s.versionComparee}</p>
      ) : null}
    </section>
  );
}

function Contradiction({ s, w }: { s: PremiumState; w: readonly number[] }) {
  const a = s.modules.find((m) => m.id === "contexte");
  const b = s.modules.find((m) => m.id === "action");
  if (!a || !b) return null;
  const p = local(ancre(a, w));
  const q = local(ancre(b, w));
  return <line className="pp-contra" x1={p.x} y1={p.y} x2={q.x} y2={q.y} vectorEffect="non-scaling-stroke" />;
}

function local(p: { x: number; y: number }) {
  return {
    x: ((p.x - NOYAU.left) / NOYAU.width) * 100,
    y: ((p.y - NOYAU.top) / NOYAU.height) * 100,
  };
}

/* ======================================================================== */
/* INSPECTOR — le niveau 3, à la demande seulement.                         */
/* ======================================================================== */

function Inspector({ s }: { s: PremiumState }) {
  if (!s.inspect) return null;
  const m = s.moduleActif;
  const a = s.agents.find((x) => x.id === s.agentSurvole);
  const surf = s.surfaces.find((x) => x.id === s.surfaceSurvolee);
  return (
    <aside className="pp-inspector" aria-label="Détail">
      {a ? (
        <>
          <p className="pp-insp-titre">{a.role}</p>
          <p>{a.geste}</p>
          <p className="pp-insp-meta">
            {labelSurface(s, a.surface)} · {a.duree} ms
          </p>
        </>
      ) : m && m.etat !== "vide" ? (
        <>
          <p className="pp-insp-titre">{m.label}</p>
          <p>{m.valeur}</p>
          <p className="pp-insp-meta">
            {m.agent ? `${m.agent.role} · ${labelSurface(s, m.agent.surface)}` : "Décision humaine"}
            {" · "}v{m.version}
            {m.etat === "bloque" ? " · source manquante" : ""}
          </p>
        </>
      ) : surf ? (
        <>
          <p className="pp-insp-titre">{surf.label}</p>
          <p>{surf.apporte}</p>
          <p className="pp-insp-meta">
            {surf.etat === "bloquee" ? "bloquée" : surf.role} · {surf.niveau}
          </p>
        </>
      ) : (
        <>
          <p className="pp-insp-titre">{phaseLabel(s.phase)}</p>
          <p className="pp-insp-meta">
            {DEMO_LABEL.produit} · {DEMO_LABEL.donnees}
          </p>
        </>
      )}
    </aside>
  );
}

function labelSurface(s: PremiumState, id: string) {
  return s.surfaces.find((x) => x.id === id)?.label ?? id;
}

/* ======================================================================== */
/* HUMAN GATE — question, manque, action, conséquences, décision.           */
/* ======================================================================== */

function Gate({ s }: { s: PremiumState }) {
  const principale = GATE.options[0];
  const autres = GATE.options.slice(1);
  const action = s.modules.find((m) => m.id === "action");

  return (
    <aside className="pp-gate" aria-label="Décision humaine requise">
      {/* A — la question */}
      <p className="pp-gate-tag">{UI2.gateTag}</p>
      <p className="pp-gate-question">{GATE.question}</p>

      {/* B — ce qui manque */}
      <div className="pp-gate-manque">
        <p className="pp-gate-cle">{INTERNAL.permission}</p>
        <p>{GATE.pourquoi}</p>
      </div>

      {/* C — l'action proposée */}
      {action?.valeur ? (
        <div className="pp-gate-action">
          <p className="pp-gate-cle">{action.label}</p>
          <p className="pp-gate-action-valeur">{action.valeur}</p>
        </div>
      ) : null}

      {/* E — la décision. Une action évidente, trois alternatives en retrait. */}
      <button
        type="button"
        className="pp-principale"
        data-poids="principal"
        onClick={() => s.decider(principale.id as BrancheId)}
      >
        <span className="pp-principale-label">{principale.label}</span>
        <span className="pp-principale-effet">{CONSEQUENCES[principale.id as BrancheId].effet}</span>
        <span className="pp-principale-pied">
          <span className="pp-tag">{CONSEQUENCES[principale.id as BrancheId].version}</span>
          <span className="pp-principale-risque">{CONSEQUENCES[principale.id as BrancheId].risque}</span>
        </span>
      </button>

      <ul className="pp-alternatives" data-ouvert={s.alternatives ? "oui" : undefined}>
        {autres.map((o) => {
          const c = CONSEQUENCES[o.id as BrancheId];
          return (
            <li key={o.id} className="pp-alt" data-poids="alternative">
              {c.choix ? (
                <>
                  <p className="pp-alt-label">{o.label}</p>
                  <p className="pp-alt-effet">{c.effet}</p>
                  {/* Corriger n'est pas un bouton de plus : c'est un choix précis. */}
                  <div className="pp-choix">
                    {c.choix.map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        className="pp-choix-btn"
                        onClick={() => s.decider(o.id as BrancheId)}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                  <p className="pp-n3 pp-alt-risque">{c.risque}</p>
                </>
              ) : (
                <button type="button" className="pp-alt-btn" onClick={() => s.decider(o.id as BrancheId)}>
                  <span className="pp-alt-label">{o.label}</span>
                  <span className="pp-alt-effet">{c.effet}</span>
                  <span className="pp-alt-pied">
                    <span className="pp-tag">{c.version}</span>
                    {c.surface ? <span className="pp-n3">consulte {labelSurface(s, c.surface)}</span> : null}
                  </span>
                  <span className="pp-n3 pp-alt-risque">{c.risque}</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {/* D — comparer les suites, à la demande. */}
      <button
        type="button"
        className="pp-comparer"
        onClick={() => s.setAlternatives(!s.alternatives)}
        aria-expanded={s.alternatives}
      >
        {s.alternatives ? "Masquer les conséquences" : "Comparer les conséquences"}
      </button>

      {PHOTO_GATE ? (
        <p className="pp-owner">
          <img className="pp-photo" src={UI2.photoGate} alt="" width={28} height={28} />
          <span>{GATE.proprietaire}</span>
        </p>
      ) : null}
    </aside>
  );
}

/* ======================================================================== */
/* OCCURRENCE SUIVANTE                                                      */
/* ======================================================================== */

function Occurrence({ s }: { s: PremiumState }) {
  const o = OCCURRENCE[s.branche as BrancheId];
  return (
    <section className="pp-occurrence" aria-label={UI2.occurrence}>
      <p className="pp-occ-tag">{UI2.occurrence}</p>
      <p className="pp-occ-effet">{o.effet}</p>
      <p className="pp-n3 pp-occ-meta">{o.quand}</p>
    </section>
  );
}

/* ======================================================================== */
/* RAIL                                                                     */
/* ======================================================================== */

function Rail({ s }: { s: PremiumState }) {
  return (
    <div className="pp-rail">
      <span className="pp-rail-phase">{phaseLabel(s.phase)}</span>
      <span className="pp-piste-lecture" aria-hidden="true">
        <span className="pp-piste-fill" style={{ transform: `scaleX(${Math.min(1, s.t / TIMELINE.T_FIN)})` }} />
        {[TIMELINE.T_SIGNAL, TIMELINE.T_ORCH, TIMELINE.T_CONV, TIMELINE.T_GATE, TIMELINE.T_SORTIE].map((t) => (
          <span key={t} className="pp-cran-lecture" style={{ left: `${(t / TIMELINE.T_FIN) * 100}%` }} />
        ))}
      </span>

      <button type="button" className="pp-ctrl pp-ctrl-primaire" onClick={s.togglePause} disabled={s.bloque || s.fini}>
        {s.running ? UI2.controles.pause : UI2.controles.reprendre}
      </button>

      {/* Sur mobile les commandes secondaires sont derrière ce bouton : pas
          trois carrés permanents en bas de l'écran. */}
      <button
        type="button"
        className="pp-ctrl pp-ctrl-plus"
        onClick={() => s.setCommandes(!s.commandes)}
        aria-expanded={s.commandes}
        aria-label="Autres commandes"
      >
        <span aria-hidden="true">···</span>
      </button>

      <div className="pp-ctrls" data-ouvert={s.commandes ? "oui" : undefined}>
        <button type="button" className="pp-ctrl" onClick={s.replay}>
          {UI2.controles.replay}
        </button>
        <button type="button" className="pp-ctrl" onClick={s.step} disabled={s.bloque}>
          {UI2.controles.step}
        </button>
      </div>
    </div>
  );
}

/* ======================================================================== */
/* MOBILE — sept chapitres, chacun conçu comme un écran produit.            */
/* ======================================================================== */

function Chapitres({ s }: { s: PremiumState }) {
  /* Le chapitre courant vient à l'écran quand la scène avance. Le ref vit
     ICI, dans le composant qui possède le conteneur : le sortir du hook
     évitait de le faire transiter par une valeur lue pendant le rendu.
     On ne défile que sur un vrai changement de chapitre, sinon on lutterait
     contre le doigt de l'utilisateur à chaque tick d'horloge. */
  const conteneur = useRef<HTMLDivElement>(null);
  const precedent = useRef<string | null>(null);
  useEffect(() => {
    if (precedent.current === s.chapitre) return;
    precedent.current = s.chapitre;
    const box = conteneur.current;
    const el = box?.querySelector<HTMLElement>(`[data-chapitre-id="${s.chapitre}"]`);
    if (!box || !el) return;
    /* On défile le conteneur, pas la fenêtre : `scrollIntoView` alignerait le
       chapitre sur le haut du viewport et laisserait son titre sous la barre. */
    box.scrollTo({ top: el.offsetTop, behavior: s.reduced ? "auto" : "smooth" });
  }, [s.chapitre, s.reduced]);

  return (
    <div className="pp-chapitres" ref={conteneur}>
      {CHAPITRES.map((c) => {
        const actif = c.id === s.chapitre;
        const surf = c.surface ? s.surfaces.find((x) => x.id === c.surface) : null;
        const focus = c.focus ? s.modules.find((x) => x.id === c.focus) : null;
        return (
          <section
            key={c.id}
            className="pp-chapitre"
            data-chapitre-id={c.id}
            data-actif={actif ? "oui" : undefined}
            aria-label={`Chapitre ${c.num} sur ${CHAPITRES.length} : ${c.titre}`}
          >
            <p className="pp-chap-num">
              {c.num} / {CHAPITRES.length}
            </p>
            <h2 className="pp-chap-titre">{c.titre}</h2>

            <BandeObjet s={s} focus={focus ?? null} />

            {surf ? (
              <div className="pp-chap-surface" data-niveau="active">
                <SurfacePremium surf={{ ...surf, niveau: "active" }} s={s} />
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

/** L'objet en bande : présent dans chaque chapitre, jamais en colonne longue. */
function BandeObjet({ s, focus }: { s: PremiumState; focus: PremiumState["modules"][number] | null }) {
  return (
    <div className="pp-bande" aria-label={`${UI2.objet} : ${s.etat}`}>
      <span className="pp-bande-tuiles">
        {s.modules.map((m) => (
          <span key={m.id} className="pp-tuile" data-etat={m.etat} data-focus={m.id === focus?.id ? "oui" : undefined} />
        ))}
      </span>
      <p className="pp-bande-valeur">
        {focus && focus.valeur ? focus.valeur : s.etat}
      </p>
    </div>
  );
}

/** Le gate mobile : une action évidente, les alternatives révélables. */
function GateMobile({ s }: { s: PremiumState }) {
  const principale = GATE.options[0];
  const autres = GATE.options.slice(1);
  return (
    <aside className="pp-gate pp-gate-mobile" aria-label="Décision humaine requise">
      <p className="pp-gate-tag">{UI2.gateTag}</p>
      <p className="pp-gate-question">{GATE.question}</p>
      <div className="pp-gate-manque">
        <p className="pp-gate-cle">{INTERNAL.permission}</p>
        <p>{GATE.pourquoi}</p>
      </div>

      <button
        type="button"
        className="pp-principale"
        data-poids="principal"
        onClick={() => s.decider(principale.id as BrancheId)}
      >
        <span className="pp-principale-label">{principale.label}</span>
        <span className="pp-principale-effet">{CONSEQUENCES[principale.id as BrancheId].effet}</span>
      </button>

      <button
        type="button"
        className="pp-comparer"
        onClick={() => s.setAlternatives(!s.alternatives)}
        aria-expanded={s.alternatives}
      >
        {s.alternatives ? "Masquer les autres suites" : "Voir les autres suites"}
      </button>

      <ul className="pp-alternatives" data-ouvert={s.alternatives ? "oui" : undefined}>
        {autres.map((o) => {
          const c = CONSEQUENCES[o.id as BrancheId];
          return (
            <li key={o.id} className="pp-alt" data-poids="alternative">
              <button type="button" className="pp-alt-btn" onClick={() => s.decider(o.id as BrancheId)}>
                <span className="pp-alt-label">{o.label}</span>
                <span className="pp-alt-effet">{c.effet}</span>
                <span className="pp-tag">{c.version}</span>
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
