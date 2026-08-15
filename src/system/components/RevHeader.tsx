"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  ["/", "System"],
  ["/manufacture", "Manufacture"],
  ["/standard", "Standard"],
  ["/dossiers", "Dossiers"],
  ["/journal", "Journal"],
  ["/commission", "Commission"],
] as const;

export function RevHeader() {
  const [clock, setClock] = useState("—");
  const pathname = usePathname();

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
        {NAV.map(([href, label]) => {
          const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={active ? "on" : undefined}
              aria-current={active ? "page" : undefined}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <time className="clock" aria-label="Local time">
        {clock}
      </time>
    </header>
  );
}
