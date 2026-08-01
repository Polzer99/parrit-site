"use client";

import { useEffect, useMemo, useState } from "react";
import { BORNES, CYCLE, EFFETS, TOTAL, type MomentId } from "./moments";

/**
 * PRODUCT-LIVING-HERO-PROOF-V1 — l'horloge de la boucle du hero.
 *
 * Une horloge AUTONOME, distincte de celle de la scène longue. La scène
 * longue s'arrête réellement et attend une décision humaine ; le hero, lui,
 * ne peut rien exiger d'un visiteur. Il suspend visiblement, puis reprend.
 *
 * C'est la seule divergence assumée avec le moteur de la scène, et elle est
 * dictée par le contexte : personne ne clique dans un hero.
 *
 * La boucle s'arrête quand l'onglet n'est plus visible, et aucun timer ne
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

  /* Onglet caché : la boucle se met en veille. Elle ne consomme rien et ne
     reprend pas dix secondes plus loin, elle repart où elle en était. */
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (!visible) return;
    /* L'incrément passe par la forme fonctionnelle : l'intervalle ne dépend
       pas de `t`, donc il n'est ni recréé ni empilé à chaque tick. */
    const id = window.setInterval(() => setT((p) => (p + TICK) % CYCLE), TICK);
    return () => window.clearInterval(id);
  }, [visible]);

  /** Le moment courant. Après le dernier, la respiration. */
  const moment: MomentId | "respiration" = useMemo(() => {
    if (t >= TOTAL) return "respiration";
    return BORNES.find((b) => t >= b.debut && t < b.fin)?.id ?? "signal";
  }, [t]);

  /** Index du moment, de 1 à 6. Zéro pendant la respiration. */
  const index = useMemo(() => {
    const i = BORNES.findIndex((b) => b.id === moment);
    return i < 0 ? 0 : i + 1;
  }, [moment]);

  /** Progression dans le moment courant, de 0 à 1. */
  const dans = useMemo(() => {
    const b = BORNES.find((x) => x.id === moment);
    if (!b) return 1;
    return Math.min(1, (t - b.debut) / (b.fin - b.debut));
  }, [t, moment]);

  /** Un moment est atteint dès qu'il a commencé, et le reste jusqu'à la fin
   *  du cycle : la preuve s'accumule sous les yeux, elle ne clignote pas. */
  const atteint = (id: MomentId) => {
    const b = BORNES.find((x) => x.id === id)!;
    return t >= b.debut;
  };

  /** Les trois effets du travail coordonné, décalés dans leur moment. */
  const effets = useMemo(() => {
    const b = BORNES.find((x) => x.id === "travail")!;
    return EFFETS.map((e) => ({ ...e, vu: t >= b.debut + e.decalage }));
  }, [t]);

  return { t, moment, index, dans, atteint, effets, reduced, visible };
}
