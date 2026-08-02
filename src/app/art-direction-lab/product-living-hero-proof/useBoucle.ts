"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BORNES,
  CHAPITRES,
  CYCLE,
  INSTANT_DECISION,
  TOTAL,
  type ChapitreId,
  type Focus,
} from "./moments";

/**
 * PRODUCT-LIVING-HERO-CLARITY-POLISH-V1 — l'horloge de la boucle du hero.
 *
 * Horloge autonome, distincte de celle de la démonstration longue. La scène
 * longue s'arrête réellement et attend une décision ; le hero ne peut rien
 * exiger d'un visiteur : il suspend visiblement, puis reprend.
 *
 * Elle expose un CONTRAT unique, `focus`, que le renderer applique pour
 * n'avoir qu'un seul élément dominant à l'écran. Tout le reste s'en déduit.
 *
 * La boucle s'arrête quand l'onglet n'est plus visible et aucun timer ne
 * survit au démontage.
 */

const TICK = 60;

export type BoucleState = ReturnType<typeof useBoucle>;

export function useBoucle() {
  const [t, setT] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: { matches: boolean }) => setReduced(e.matches);
    if (mq.matches) onChange(mq);
    mq.addEventListener("change", onChange as (e: MediaQueryListEvent) => void);
    return () =>
      mq.removeEventListener("change", onChange as (e: MediaQueryListEvent) => void);
  }, []);

  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (!visible) return;
    /* Forme fonctionnelle : l'intervalle ne dépend pas de `t`, il n'est donc
       ni recréé ni empilé à chaque tick. */
    const id = window.setInterval(() => setT((p) => (p + TICK) % CYCLE), TICK);
    return () => window.clearInterval(id);
  }, [visible]);

  /** Le chapitre courant. Après le cinquième, la respiration. */
  const chapitre: ChapitreId | "respiration" = useMemo(() => {
    if (t >= TOTAL) return "respiration";
    return BORNES.find((b) => t >= b.debut && t < b.fin)?.id ?? "signal";
  }, [t]);

  /** Index affiché : 01 à 05. Pendant la respiration, on garde le cinquième. */
  const index = useMemo(() => {
    if (chapitre === "respiration") return CHAPITRES.length;
    return BORNES.findIndex((b) => b.id === chapitre) + 1;
  }, [chapitre]);

  /** Progression dans le chapitre courant, de 0 à 1. */
  const dans = useMemo(() => {
    const b = BORNES.find((x) => x.id === chapitre);
    if (!b) return 1;
    return Math.min(1, (t - b.debut) / (b.fin - b.debut));
  }, [t, chapitre]);

  /**
   * LE contrat de focus. Un seul élément domine à chaque instant ; pendant la
   * respiration, on conserve le dernier focus plutôt que d'en inventer un.
   */
  const focus: Focus = useMemo(() => {
    if (chapitre === "respiration") return "output";
    return CHAPITRES.find((c) => c.id === chapitre)!.focus;
  }, [chapitre]);

  const definition = CHAPITRES[Math.max(0, index - 1)];

  /** Sixième moment technique : l'instant où la décision est prise. */
  const decidee = chapitre === "sortie" || chapitre === "respiration" ||
    (chapitre === "decision" && dans >= INSTANT_DECISION);

  /** Le système est arrêté depuis que le contexte manque jusqu'à la décision. */
  const arrete = chapitre === "manque" || (chapitre === "decision" && !decidee);

  /** Un chapitre est atteint dès qu'il a commencé. Sert à l'accumulation. */
  const atteint = (id: ChapitreId) => t >= BORNES.find((x) => x.id === id)!.debut;

  return { t, chapitre, index, dans, focus, definition, decidee, arrete, atteint, reduced, visible };
}
