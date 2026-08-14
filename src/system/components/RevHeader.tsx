"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function RevHeader() {
  const [clock, setClock] = useState("—");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map((part) => String(part).padStart(2, "0"))
        .join(":");
      setClock(`${time} · LOCAL`);
    };

    updateClock();
    const interval = window.setInterval(updateClock, 1_000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <header className="cmdbar">
      <Link className="wordmark" href="/" aria-label="Parrit home">
        PARRIT<i aria-hidden="true">.</i>AI
      </Link>
      <nav className="cmd-nav" aria-label="Main navigation">
        <Link href="/">System</Link>
        <Link href="/manufacture">Manufacture</Link>
        <Link href="/standard">Standard</Link>
        <Link href="/dossiers">Dossiers</Link>
        <Link href="/journal">Journal</Link>
        <Link href="/commission">Commission</Link>
      </nav>
      <time className="clock" aria-label="Local time">
        {clock}
      </time>
    </header>
  );
}
