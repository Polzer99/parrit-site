"use client";

import { useCallback, useEffect, useState } from "react";

import type { Locale } from "@/system/locale";

const LINE_DELAYS = [180, 440, 700, 960, 1_220] as const;

const DICT = {
  en: {
    loading: "LOADING COMPANY MODEL ................",
    loaded: "DONE",
    connecting: "CONNECTING OPERATIONS ................",
    systems: "14 SYSTEMS",
    scanning: "SCANNING FOR EXCEPTIONS ..............",
    found: "2 FOUND",
    ready: "READY.",
    heroBefore: "The AI system your company",
    heroFrame: "operates",
    heroAfter: "on.",
    maker: <>Parrit.ai designs and builds<br />company operating systems.</>,
    statement: "One system to understand, decide and act across the company. Built for one company at a time. Commissioned, not subscribed.",
  },
  fr: {
    loading: "CHARGEMENT DU MODÈLE DE L'ENTREPRISE ........",
    loaded: "TERMINÉ",
    connecting: "CONNEXION DES OPÉRATIONS ...................",
    systems: "14 SYSTÈMES",
    scanning: "RECHERCHE D'EXCEPTIONS .....................",
    found: "2 TROUVÉES",
    ready: "PRÊT.",
    heroBefore: "Le système IA qui fait tourner votre",
    heroFrame: "entreprise.",
    heroAfter: "",
    maker: <>Parrit.ai conçoit et construit<br />des systèmes d'exploitation d'entreprise.</>,
    statement: "Un seul système pour comprendre, décider et agir, à l'échelle de l'entreprise. Une entreprise à la fois. Une commande, pas un abonnement.",
  },
} as const;

export function Opening({ locale }: { locale: Locale }) {
  const copy = DICT[locale];
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);
  const [footVisible, setFootVisible] = useState(false);

  const exit = useCallback(() => {
    setExiting(true);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timers = [window.setTimeout(() => setVisible(true), 0)];
    timers.push(
      ...LINE_DELAYS.map((delay, index) =>
        window.setTimeout(() => setVisibleLines(index + 1), delay),
      ),
    );
    timers.push(window.setTimeout(() => setHeroVisible(true), 1_580));
    timers.push(window.setTimeout(() => setFootVisible(true), 1_780));
    timers.push(window.setTimeout(exit, 2_400));

    const exitOnInput = () => exit();
    window.addEventListener("click", exitOnInput);
    window.addEventListener("keydown", exitOnInput);
    window.addEventListener("scroll", exitOnInput, { passive: true });
    window.addEventListener("wheel", exitOnInput, { passive: true });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("click", exitOnInput);
      window.removeEventListener("keydown", exitOnInput);
      window.removeEventListener("scroll", exitOnInput);
      window.removeEventListener("wheel", exitOnInput);
    };
  }, [exit]);

  useEffect(() => {
    if (!exiting) return;

    const timer = window.setTimeout(() => setVisible(false), 400);
    return () => window.clearTimeout(timer);
  }, [exiting]);

  if (!visible) return null;

  return (
    <div
      className={`opening${exiting ? " opening-exit" : ""}`}
      data-testid="opening"
      aria-hidden="true"
      role="presentation"
    >
      <div className="bootlog">
        <div className={visibleLines >= 1 ? "on" : undefined}>PARRIT / SITE · REV 01</div>
        <div className={visibleLines >= 2 ? "on" : undefined}>
          {copy.loading} <span className="ok-line">{copy.loaded}</span>
        </div>
        <div className={visibleLines >= 3 ? "on" : undefined}>
          {copy.connecting} <span className="ok-line">{copy.systems}</span>
        </div>
        <div className={visibleLines >= 4 ? "on" : undefined}>
          {copy.scanning} <span className="red-line">{copy.found}</span>
        </div>
        <div className={`ok-line${visibleLines >= 5 ? " on" : ""}`}>{copy.ready}</div>
      </div>
      <div className="boothero">
        <div className={heroVisible ? "on" : undefined}>
          {copy.heroBefore}{" "}
          <span className="op frame">
            {copy.heroFrame}<i className="fx" />
          </span>{" "}
          {copy.heroAfter}
        </div>
      </div>
      <div className={`bootfoot${footVisible ? " on" : ""}`}>
        <span className="k">
          {copy.maker}
        </span>
        <p>
          {copy.statement}
        </p>
      </div>
    </div>
  );
}
