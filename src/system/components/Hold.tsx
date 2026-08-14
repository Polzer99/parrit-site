"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type HoldProps = {
  label: string;
  doneLabel: string;
  onCommit?: () => void;
};

export function Hold({ label, doneLabel, onCommit }: HoldProps) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const raf = useRef<number | null>(null);
  const t0 = useRef(0);
  const reduced =
    typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  const stop = useCallback(() => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    setPct(0);
  }, []);

  const start = useCallback(() => {
    if (done) return;
    if (reduced) {
      setDone(true);
      onCommit?.();
      return;
    }
    t0.current = performance.now();
    const step = (now: number) => {
      const p = Math.min(100, ((now - t0.current) / 600) * 100);
      setPct(p);
      if (p >= 100) {
        setDone(true);
        onCommit?.();
        return;
      }
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, [done, onCommit, reduced]);

  useEffect(
    () => () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    },
    [],
  );

  return (
    <button
      type="button"
      className="hold"
      data-armed={pct > 0}
      data-done={done}
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onKeyDown={(event) => {
        if ((event.key === " " || event.key === "Enter") && !event.repeat) {
          event.preventDefault();
          start();
        }
      }}
      onKeyUp={(event) => {
        if (event.key === " " || event.key === "Enter") stop();
      }}
      aria-label={done ? doneLabel : `${label} · hold to commit`}
    >
      <span className="fill" style={{ width: `${done ? 0 : pct}%` }} />
      <span className="lab">{done ? doneLabel : label}</span>
    </button>
  );
}
