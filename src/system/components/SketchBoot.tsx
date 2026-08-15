"use client";

/* Le « watch me work » du funnel : un boot log qui lit l'entreprise, mappe les
   opérations et révèle l'esquisse. Même grammaire que l'Opening — skip au clic,
   skip total en reduced-motion, la page reste rendue dessous (SSR intact). */

import { useCallback, useEffect, useState } from "react";

const LINE_DELAYS = [200, 620, 1_040, 1_460, 1_880] as const;

export function SketchBoot({ company }: { company: string }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);

  const exit = useCallback(() => setExiting(true), []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timers = [window.setTimeout(() => setVisible(true), 0)];
    timers.push(
      ...LINE_DELAYS.map((delay, index) =>
        window.setTimeout(() => setVisibleLines(index + 1), delay),
      ),
    );
    timers.push(window.setTimeout(exit, 2_600));

    const exitOnInput = () => exit();
    window.addEventListener("click", exitOnInput);
    window.addEventListener("keydown", exitOnInput);
    window.addEventListener("scroll", exitOnInput, { passive: true });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("click", exitOnInput);
      window.removeEventListener("keydown", exitOnInput);
      window.removeEventListener("scroll", exitOnInput);
    };
  }, [exit]);

  useEffect(() => {
    if (!exiting) return;
    const timer = window.setTimeout(() => setVisible(false), 400);
    return () => window.clearTimeout(timer);
  }, [exiting]);

  if (!visible) return null;

  const upper = company.toUpperCase();

  return (
    <div
      className={`opening${exiting ? " opening-exit" : ""}`}
      data-testid="sketch-boot"
      aria-hidden="true"
      role="presentation"
    >
      <div className="bootlog">
        <div className={visibleLines >= 1 ? "on" : undefined}>PARRIT / SKETCH · {upper}</div>
        <div className={visibleLines >= 2 ? "on" : undefined}>
          READING DECLARED INTEREST ............ <span className="ok-line">DONE</span>
        </div>
        <div className={visibleLines >= 3 ? "on" : undefined}>
          MAPPING OPERATIONS ................... <span className="ok-line">DRAFT</span>
        </div>
        <div className={visibleLines >= 4 ? "on" : undefined}>
          DRAWING FIRST INSTRUMENT ............. <span className="red-line">1 SKETCH</span>
        </div>
        <div className={`ok-line${visibleLines >= 5 ? " on" : ""}`}>READY.</div>
      </div>
    </div>
  );
}
