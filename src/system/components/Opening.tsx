"use client";

import { useCallback, useEffect, useState } from "react";

const SESSION_KEY = "parrit-opening-seen";
const LINE_DELAYS = [180, 440, 700, 960, 1_220] as const;

export function Opening() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);
  const [footVisible, setFootVisible] = useState(false);

  const exit = useCallback(() => {
    setExiting(true);
  }, []);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.sessionStorage.getItem(SESSION_KEY) === "true"
    ) {
      return;
    }

    window.sessionStorage.setItem(SESSION_KEY, "true");

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
          LOADING COMPANY MODEL ................ <span className="ok-line">DONE</span>
        </div>
        <div className={visibleLines >= 3 ? "on" : undefined}>
          CONNECTING OPERATIONS ................ <span className="ok-line">14 SYSTEMS</span>
        </div>
        <div className={visibleLines >= 4 ? "on" : undefined}>
          SCANNING FOR EXCEPTIONS .............. <span className="red-line">2 FOUND</span>
        </div>
        <div className={`ok-line${visibleLines >= 5 ? " on" : ""}`}>READY.</div>
      </div>
      <div className="boothero">
        <div className={heroVisible ? "on" : undefined}>
          The system your company{" "}
          <span className="op frame">
            operates<i className="fx" />
          </span>{" "}
          on.
        </div>
      </div>
      <div className={`bootfoot${footVisible ? " on" : ""}`}>
        <span className="k">
          Parrit designs and builds
          <br />
          company operating systems.
        </span>
        <p>
          One system to understand, decide and act across the company. Built for one company
          at a time. Commissioned, not subscribed.
        </p>
      </div>
    </div>
  );
}
