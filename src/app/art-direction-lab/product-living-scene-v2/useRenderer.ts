"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BRANCHES,
  CHAMPS,
  SURFACES,
  type SurfaceId,
} from "../product-living-scene/scenario";
import { TIMELINE, useScene } from "../product-living-scene/useScene";
import {
  CHAPITRES,
  DISTRIBUTION,
  MODULES,
  type ChapitreId,
  type ModuleId,
} from "./renderer";

/**
 * PRODUCT-LIVING-SYSTEM-SCENE-V2 — dérivations du renderer.
 *
 * `useScene()` reste le MOTEUR : horloge, phases, agents, branches, versions,
 * arrêt réel au HumanGate. Ce hook n'en réimplémente rien. Il traduit cet état
 * en objets de scène : modules du noyau, surfaces entrantes ou rétractées,
 * moment de commit, sortie distribuée, chapitre mobile courant.
 *
 * Règle tenue : si une valeur décide de quelque chose, elle vient du moteur.
 * Si elle décide seulement de la façon dont ça se voit, elle est ici.
 */

/** État visuel d'un module du noyau. */
export type EtatModule = "vide" | "entrant" | "pose" | "bloque" | "verrouille";

/** État visuel d'une surface logicielle. */
export type EtatSurface = "dormante" | "entrante" | "active" | "retractee" | "bloquee";

/* Un module se verrouille peu après la décision : c'est le moment de commit.
   La sortie se dépose ensuite dans les surfaces, un peu plus tard, pour que le
   verrouillage et la distribution ne se confondent pas en un seul éclair. */
const DELAI_COMMIT = 700;
const DELAI_DISTRIBUTION = 1000;
const DELAI_OCCURRENCE = 400;

export type RendererState = ReturnType<typeof useRenderer>;

export function useRenderer() {
  const s = useScene();
  const [moduleSurvole, setModuleSurvole] = useState<ModuleId | null>(null);

  /* Le rendu serveur est celui du plateau. Le passage en chapitres se décide
     après le montage : premier rendu client identique au serveur, donc aucune
     divergence d'hydratation. */
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 52rem)");
    const onChange = (e: { matches: boolean }) => setCompact(e.matches);
    onChange(mq);
    mq.addEventListener("change", onChange as (e: MediaQueryListEvent) => void);
    return () =>
      mq.removeEventListener("change", onChange as (e: MediaQueryListEvent) => void);
  }, []);

  const branche = s.branche ? BRANCHES[s.branche] : null;

  /** Moment de commit : les modules se verrouillent. */
  const commit = Boolean(s.branche) && s.t >= TIMELINE.T_GATE + DELAI_COMMIT;
  /** La sortie est déposée dans les surfaces concernées. */
  const distribue = Boolean(s.branche) && s.t >= TIMELINE.T_GATE + DELAI_DISTRIBUTION;
  /** L'occurrence suivante applique la règle corrigée. */
  const occurrence =
    Boolean(s.branche) && (s.fini || s.t >= TIMELINE.T_SORTIE + DELAI_OCCURRENCE);

  const distribution = s.branche ? DISTRIBUTION[s.branche] : null;

  /* ------------------------------------------------------------------ */
  /* Modules du noyau                                                    */
  /* ------------------------------------------------------------------ */

  const modules = useMemo(
    () =>
      MODULES.map((m) => {
        const agent = s.agents.find((a) => a.produit === m.champ) ?? null;

        let etat: EtatModule = "vide";
        let valeur: string | null = null;

        if (m.id === "decision") {
          /* Le module Décision n'a pas d'agent : il n'est rempli que par un
             humain. C'est la seule case que la machine ne peut pas écrire. */
          if (branche) {
            valeur = branche.confiance;
            etat = commit ? "verrouille" : "pose";
          }
        } else if (agent) {
          if (agent.echoue) {
            etat = "bloque";
            valeur = agent.bloque ?? null;
          } else if (agent.termine) {
            etat = commit ? "verrouille" : "pose";
            valeur = agent.valeur;
          } else if (agent.progression > 0) {
            etat = "entrant";
          }
        }

        return {
          ...m,
          agent,
          etat,
          valeur,
          /* Version à laquelle ce module apparaît. La couche du champ fait foi :
             c'est le moteur qui la définit, pas le renderer. */
          version: CHAMPS[m.champ].couche,
          isole: moduleSurvole !== null && moduleSurvole !== m.id,
        };
      }),
    [s.agents, branche, commit, moduleSurvole],
  );

  const moduleActif = modules.find((m) => m.id === moduleSurvole) ?? null;

  /* ------------------------------------------------------------------ */
  /* Surfaces logicielles                                                */
  /* ------------------------------------------------------------------ */

  const surfaces = useMemo(
    () =>
      SURFACES.map((surf) => {
        const agent = s.agents.find((a) => a.surface === surf.id) ?? null;
        let etat: EtatSurface = "dormante";
        if (agent?.echoue) etat = "bloquee";
        else if (agent?.actif) etat = agent.progression < 0.35 ? "entrante" : "active";
        else if (agent?.termine) etat = "retractee";

        /* Une surface qui reçoit la sortie se rallume : c'est là que le
           travail atterrit réellement. */
        const recoit = distribue ? (distribution?.[surf.id as SurfaceId] ?? null) : null;

        return {
          ...surf,
          agent,
          etat,
          recoit,
          /* Isolement au survol d'un agent : le reste s'atténue. */
          attenuee: s.agentSurvole !== null && agent?.id !== s.agentSurvole,
          choisie: s.sourceChoisie === surf.id,
        };
      }),
    [s.agents, s.agentSurvole, s.sourceChoisie, distribue, distribution],
  );

  /** Surfaces réellement modifiées par la sortie. Sert au Distributed Output. */
  const surfacesModifiees = surfaces.filter((x) => x.recoit).length;

  /* ------------------------------------------------------------------ */
  /* Politique interne                                                   */
  /* ------------------------------------------------------------------ */

  /* Le moteur porte la même règle de départ dans les quatre branches : c'est
     la règle en vigueur AVANT toute décision. On la lit une fois, sans la
     recopier ici, pour qu'une correction du scénario suive automatiquement. */
  const regleAvant = BRANCHES.valider.regleAvant;
  /* La règle n'est réécrite qu'une fois la boucle atteinte : tant que la
     sortie se dépose, la politique est encore celle d'avant. */
  const regleModifiee = Boolean(branche) && (s.phase === "boucle" || s.fini);
  const regleApres = regleModifiee && branche ? branche.regleApres : null;

  /* ------------------------------------------------------------------ */
  /* Chapitres mobiles                                                   */
  /* ------------------------------------------------------------------ */

  const chapitre: ChapitreId = useMemo(() => {
    if (s.phase === "attente" || s.phase === "signal") return "signal";
    if (s.phase === "orchestration") {
      /* Le contexte se cherche tôt dans l'orchestration : son échec mérite son
         propre chapitre, sinon il passe inaperçu au milieu du reste. */
      return s.t < TIMELINE.T_ORCH + 900 ? "contexte" : "parallele";
    }
    if (s.phase === "convergence") return "enrichi";
    if (s.phase === "gate") return "decision";
    if (s.phase === "reprise") return "commit";
    return "amelioration";
  }, [s.phase, s.t]);

  const indexChapitre = CHAPITRES.findIndex((c) => c.id === chapitre);

  /* Le chapitre courant vient à l'écran quand la scène avance. On ne défile
     que sur un vrai changement de chapitre : sinon on lutterait contre le
     doigt de l'utilisateur à chaque tick d'horloge. */
  const refs = useRef(new Map<ChapitreId, HTMLElement | null>());
  const conteneur = useRef<HTMLElement | null>(null);
  const precedent = useRef<ChapitreId | null>(null);
  useEffect(() => {
    if (!compact) return;
    if (precedent.current === chapitre) return;
    precedent.current = chapitre;
    const el = refs.current.get(chapitre);
    const box = conteneur.current;
    if (!el || !box) return;
    /* On défile le conteneur, pas la fenêtre : `scrollIntoView` alignerait le
       chapitre sur le haut du viewport et laisserait son titre sous la barre. */
    box.scrollTo({ top: el.offsetTop, behavior: s.reduced ? "auto" : "smooth" });
  }, [chapitre, compact, s.reduced]);

  const enregistrerChapitre = (id: ChapitreId) => (el: HTMLElement | null) => {
    refs.current.set(id, el);
  };
  const enregistrerConteneur = (el: HTMLElement | null) => {
    conteneur.current = el;
  };

  return {
    ...s,
    brancheDetail: branche,
    commit,
    distribue,
    distribution,
    occurrence,
    modules,
    moduleActif,
    moduleSurvole,
    setModuleSurvole,
    surfaces,
    surfacesModifiees,
    regleAvant,
    regleApres,
    regleModifiee,
    compact,
    chapitre,
    indexChapitre,
    enregistrerChapitre,
    enregistrerConteneur,
  };
}
