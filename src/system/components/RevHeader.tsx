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
      <div className="registry" aria-label="System registry">
        <span>
          SYSTEM <b>PARRIT.AI</b>
        </span>
        <span>
          · REV <b>01</b>
        </span>
        <span>
          · STATUS <b>OPERATIONAL</b>
        </span>
      </div>
      <time className="clock" aria-label="Local time">
        {clock}
      </time>
    </header>
  );
}
