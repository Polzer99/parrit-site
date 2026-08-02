"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AGENTS,
  BRANCHES,
  ETATS,
  PHASES,
  type BrancheId,
  type ChampId,
  type Etat,
  type PhaseId,
} from "./scenario";

/**
 * PRODUCT-LIVING-SYSTEM-SCENE-V1 — horloge et machine de la scène.
 *
 * Tout l'affichage se dérive d'un seul nombre : `t`, le temps écoulé depuis
 * le début du scénario, en millisecondes. Aucun composant ne garde d'état
 * d'animation propre, ce qui évite les désynchronisations et rend `step`,
 * `pause` et `replay` triviaux.
 *
 * L'horloge s'ARRÊTE réellement au HumanGate : elle ne repart qu'après le
 * choix d'une branche. Ce n'est pas une pause visuelle, c'est un blocage de
 * la machine.
 */

/* Bornes absolues de la timeline, dérivées des durées du scénario. */
const T_SIGNAL = PHASES[0].duree!; // 600
const T_ORCH = T_SIGNAL + PHASES[1].duree!; // 1500
const T_CONV = T_ORCH + PHASES[2].duree!; // 4000
const T_GATE = T_CONV + PHASES[3].duree!; // 5500
const T_SORTIE = T_GATE + PHASES[5].duree!; // 7500
const T_FIN = T_SORTIE + PHASES[6].duree!; // 8700

export const TIMELINE = { T_SIGNAL, T_ORCH, T_CONV, T_GATE, T_SORTIE, T_FIN };

/** Instants remarquables, pour le mode pas à pas. */
const MILESTONES = Array.from(
  new Set([
    0,
    T_SIGNAL,
    T_ORCH,
    ...AGENTS.map((a) => T_ORCH + a.debut),
    ...AGENTS.map((a) => T_ORCH + a.debut + a.duree),
    T_CONV,
    T_GATE,
    T_SORTIE,
    T_FIN,
  ]),
).sort((a, b) => a - b);

const TICK = 60;

export type SceneState = ReturnType<typeof useScene>;

export function useScene() {
  const [t, setT] = useState(0);
  /* La scène démarre en marche. Le rendu serveur et le premier rendu client
     sont identiques (t = 0), donc aucune divergence d'hydratation : c'est
     l'horloge, montée après coup, qui fait avancer la scène. */
  const [running, setRunning] = useState(true);
  const [branche, setBranche] = useState<BrancheId | null>(null);
  const [reduced, setReduced] = useState(false);
  /** Sélections d'exploration. Elles n'influencent jamais le scénario. */
  const [agentSurvole, setAgentSurvole] = useState<string | null>(null);
  const [sourceChoisie, setSourceChoisie] = useState<string | null>(null);
  const [versionComparee, setVersionComparee] = useState<number | null>(null);

  /* Lecture de la préférence de mouvement. On ne pousse pas d'état de départ
     ici : `running` vaut déjà true, et un setState synchrone dans un effet
     provoquerait un rendu en cascade. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: { matches: boolean }) => setReduced(e.matches);
    if (mq.matches) onChange(mq);
    mq.addEventListener("change", onChange as (e: MediaQueryListEvent) => void);
    return () =>
      mq.removeEventListener("change", onChange as (e: MediaQueryListEvent) => void);
  }, []);

  /* Le gate bloque l'horloge tant qu'aucune branche n'est choisie. */
  const bloque = t >= T_GATE && branche === null;

  useEffect(() => {
    if (!running || bloque) return;
    if (t >= T_FIN) return;
    const id = window.setInterval(() => {
      setT((prev) => Math.min(T_FIN, prev + TICK));
    }, TICK);
    // Le timer est systématiquement retiré : aucun n'survit au démontage.
    return () => window.clearInterval(id);
  }, [running, bloque, t]);

  const replay = useCallback(() => {
    setT(0);
    setBranche(null);
    setSourceChoisie(null);
    setVersionComparee(null);
    setAgentSurvole(null);
    setRunning(true);
  }, []);

  const togglePause = useCallback(() => setRunning((r) => !r), []);

  const step = useCallback(() => {
    setRunning(false);
    setT((prev) => {
      if (prev >= T_GATE && branche === null) return prev; // le gate ne se saute pas
      const next = MILESTONES.find((m) => m > prev + 1);
      return next === undefined ? T_FIN : Math.min(next, branche === null ? T_GATE : T_FIN);
    });
  }, [branche]);

  const decider = useCallback((id: BrancheId) => {
    setBranche(id);
    setRunning(true);
  }, []);

  /* ------------------------------------------------------------------ */
  /* Dérivations : tout ce que l'écran montre vient d'ici.               */
  /* ------------------------------------------------------------------ */

  const phase: PhaseId = useMemo(() => {
    if (t < T_SIGNAL) return "attente";
    if (t < T_ORCH) return "signal";
    if (t < T_CONV) return "orchestration";
    if (t < T_GATE) return "convergence";
    if (branche === null) return "gate";
    if (t < T_SORTIE) return "reprise";
    return "boucle";
  }, [t, branche]);

  /** Progression d'un agent, de 0 à 1. Sert à tracer sa ligne d'exécution. */
  const agents = useMemo(
    () =>
      AGENTS.map((a) => {
        const debut = T_ORCH + a.debut;
        const fin = debut + a.duree;
        const p = t <= debut ? 0 : t >= fin ? 1 : (t - debut) / a.duree;
        return {
          ...a,
          progression: p,
          actif: p > 0 && p < 1,
          termine: p === 1,
          /* Un agent bloqué termine sans rien déposer d'exploitable. */
          echoue: p === 1 && Boolean(a.bloque),
        };
      }),
    [t],
  );

  /** Champs présents dans le dossier, dans l'ordre où ils sont apparus. */
  const champs = useMemo(() => {
    const out: { id: ChampId; valeur: string; bloque?: string }[] = [];
    for (const a of agents) {
      if (a.termine) out.push({ id: a.produit, valeur: a.valeur, bloque: a.bloque });
    }
    if (branche) {
      const b = BRANCHES[branche];
      out.push({ id: "decision", valeur: b.confiance });
      if (t >= T_ORCH) out.push({ id: "sources", valeur: `${sourcesLues(agents)} consultées` });
      if (t >= T_SORTIE - 400) out.push({ id: "sortie", valeur: b.sortie });
      if (t >= T_SORTIE) out.push({ id: "retour", valeur: b.retour });
    } else if (t >= T_CONV) {
      out.push({ id: "sources", valeur: `${sourcesLues(agents)} consultées` });
    }
    return out;
  }, [agents, branche, t]);

  /**
   * Version du dossier. Elle ne change QUE lorsqu'une transformation réelle
   * a eu lieu, jamais au passage d'une phase.
   */
  const version = useMemo(() => {
    if (t < T_ORCH) return 0;
    const deposes = agents.filter((a) => a.termine && !a.echoue).length;
    if (branche) return BRANCHES[branche].version;
    if (deposes >= 5) return 2;
    if (deposes >= 1) return 1;
    return 0;
  }, [t, agents, branche]);

  const etat: Etat = useMemo(() => {
    if (t < T_SIGNAL) return ETATS[0];
    if (t < T_ORCH) return ETATS[0];
    if (agents.some((a) => a.echoue) && t < T_CONV) return ETATS[1];
    if (t < T_CONV) return ETATS[2];
    if (t < T_GATE) return ETATS[3];
    if (branche === null) return ETATS[5];
    if (t < T_SORTIE) return ETATS[6];
    if (t < T_FIN) return BRANCHES[branche].etat;
    return ETATS[9];
  }, [t, agents, branche]);

  return {
    t,
    phase,
    running,
    bloque,
    reduced,
    branche,
    agents,
    champs,
    version,
    etat,
    fini: t >= T_FIN,
    agentSurvole,
    sourceChoisie,
    versionComparee,
    setAgentSurvole,
    setSourceChoisie,
    setVersionComparee,
    replay,
    togglePause,
    step,
    decider,
  };
}

function sourcesLues(agents: { surface: string; termine: boolean }[]) {
  return new Set(agents.filter((a) => a.termine).map((a) => a.surface)).size;
}

/** Positions de scène, en pourcentage. Fixes : les faisceaux s'en déduisent
 *  sans mesurer le DOM, donc sans reflow ni décalage au chargement. */
export const ANCRES: Record<string, { x: number; y: number }> = {
  email: { x: 8, y: 16 },
  crm: { x: 6, y: 44 },
  web: { x: 10, y: 72 },
  knowledge: { x: 88, y: 22 },
  internal: { x: 92, y: 52 },
  calendar: { x: 86, y: 80 },
};

export const ANCRE_DOSSIER = { x: 50, y: 50 };
