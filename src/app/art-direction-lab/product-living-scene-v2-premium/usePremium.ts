"use client";

import { useMemo, useState } from "react";
import type { SurfaceId } from "../product-living-scene/scenario";
import { TIMELINE } from "../product-living-scene/useScene";
import { useRenderer } from "../product-living-scene-v2/useRenderer";
import type { ModuleId } from "../product-living-scene-v2/renderer";

/**
 * PRODUCT-LIVING-SYSTEM-SCENE-V2-PREMIUM-V1 — dérivations de finition.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * RIEN DE FONCTIONNEL N'EST REDÉFINI ICI.
 *
 * Le moteur (`useScene`) et les dérivations V2 (`useRenderer`) sont consommés
 * tels quels : mêmes états, même timeline, mêmes branches, même arrêt réel au
 * HumanGate, même sortie distribuée, même règle R-014, même occurrence.
 *
 * Cette couche ne décide que d'une chose : ce qu'on montre, à quel niveau de
 * détail, et à quel moment. C'est de la hiérarchie, pas du scénario.
 * ─────────────────────────────────────────────────────────────────────────
 */

/** Trois niveaux de présence. Une seule surface est active à la fois. */
export type NiveauSurface = "active" | "contextuelle" | "disponible";

/* Le commit se joue en deux temps déjà fixés par le moteur V2 : verrouillage
   puis distribution. On n'y touche pas, on ne fait qu'en dater l'impulsion. */
const DUREE_PULSE = 700;
/** Une surface reste « chaude » un moment après la fin de son agent. */
const REMANENCE = 1200;

/** Ordre dans lequel les confirmations se posent. Elles ne tombent pas ensemble. */
const ORDRE_CONFIRMATION: SurfaceId[] = ["email", "calendar", "crm"];

export type PremiumState = ReturnType<typeof usePremium>;

export function usePremium() {
  const s = useRenderer();
  const [surfaceSurvolee, setSurfaceSurvolee] = useState<SurfaceId | null>(null);
  /** Le tiroir des alternatives du gate. Fermé par défaut : une seule action évidente. */
  const [alternatives, setAlternatives] = useState(false);
  /** Les commandes secondaires du mobile, révélées à la demande. */
  const [commandes, setCommandes] = useState(false);

  /* ------------------------------------------------------------------ */
  /* Surface dominante — une seule à la fois, c'est le sujet du moment.  */
  /* ------------------------------------------------------------------ */

  const dominante: SurfaceId = useMemo(() => {
    if (s.phase === "attente" || s.phase === "signal") return "email";
    if (s.phase === "orchestration") {
      /* Celui qui est le plus avancé parmi les agents en cours : c'est
         l'intervention que l'œil suit naturellement. */
      const actifs = s.agents.filter((a) => a.actif);
      if (actifs.length) {
        return actifs.reduce((m, a) => (a.progression > m.progression ? a : m)).surface;
      }
      const finis = s.agents.filter((a) => a.termine);
      return finis.length ? finis[finis.length - 1].surface : "email";
    }
    if (s.phase === "convergence") return "knowledge";
    // L'arrêt porte sur ce qui manque : c'est la seule surface qui compte.
    if (s.phase === "gate") return "internal";
    if (s.phase === "reprise") return "email";
    return "knowledge";
  }, [s.phase, s.agents]);

  /* ------------------------------------------------------------------ */
  /* Niveaux de surface                                                  */
  /* ------------------------------------------------------------------ */

  const surfaces = useMemo(
    () =>
      s.surfaces.map((surf) => {
        const a = surf.agent;
        const finAgent = a ? TIMELINE.T_ORCH + a.debut + a.duree : null;
        const recente = finAgent !== null && a?.termine && s.t - finAgent < REMANENCE;

        let niveau: NiveauSurface = "disponible";
        if (surf.id === dominante) niveau = "active";
        else if (a?.actif || surf.etat === "bloquee" || surf.recoit || recente) {
          niveau = "contextuelle";
        }

        const rang = surf.recoit ? ORDRE_CONFIRMATION.indexOf(surf.id as SurfaceId) : -1;

        return {
          ...surf,
          niveau,
          /* Rang de confirmation : les sorties se posent l'une après l'autre. */
          rang: rang < 0 ? 0 : rang,
          survolee: surfaceSurvolee === surf.id,
        };
      }),
    [s.surfaces, s.t, dominante, surfaceSurvolee],
  );

  /* ------------------------------------------------------------------ */
  /* Modules prioritaires — ils prennent temporairement plus de place.   */
  /* ------------------------------------------------------------------ */

  const prioritaires: ModuleId[] = useMemo(() => {
    if (s.bloque) return ["contexte", "action"];
    if (s.phase === "reprise" || s.phase === "boucle") return ["decision", "action"];
    const actif = s.modules.find((m) => m.agent?.actif);
    return actif ? [actif.id] : [];
  }, [s.bloque, s.phase, s.modules]);

  const modules = useMemo(
    () =>
      s.modules.map((m) => ({
        ...m,
        prioritaire: prioritaires.includes(m.id),
        /* Les dépendances ne s'affichent qu'au focus : en permanence, elles
           transformaient le noyau en schéma. */
        relie:
          s.moduleSurvole !== null &&
          (m.id === s.moduleSurvole ||
            m.depend.includes(s.moduleSurvole) ||
            s.modules.find((x) => x.id === s.moduleSurvole)?.depend.includes(m.id) === true),
      })),
    [s.modules, s.moduleSurvole, prioritaires],
  );

  /* ------------------------------------------------------------------ */
  /* Moments                                                             */
  /* ------------------------------------------------------------------ */

  /** L'impulsion de commit. Discrète, courte, sans mot géant. */
  const pulse =
    s.commit && s.t < TIMELINE.T_GATE + 700 + DUREE_PULSE && s.t >= TIMELINE.T_GATE + 700;

  /**
   * Niveau 3 : version, trace, métadonnées. Jamais affiché par défaut.
   * Il apparaît au survol, au focus, ou quand la scène est mise en pause,
   * c'est-à-dire quand quelqu'un regarde vraiment.
   */
  const inspect =
    s.moduleSurvole !== null || surfaceSurvolee !== null || (!s.running && !s.bloque);

  return {
    ...s,
    modules,
    surfaces,
    dominante,
    prioritaires,
    pulse,
    inspect,
    surfaceSurvolee,
    setSurfaceSurvolee,
    alternatives,
    setAlternatives,
    commandes,
    setCommandes,
  };
}
