"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
 * Barre du lab. Elle a un seul travail : passer d'une direction à l'autre sans
 * délai, pour que Paul et Maxime puissent comparer de mémoire courte.
 *
 * Elle porte aussi la température de la page courante : la barre prend le thème
 * de la direction affichée, et pose ce thème sur <body> pour que le fond, le
 * grain et la sélection suivent. Sans ça, on comparerait trois pages posées sur
 * un même fond, ce qui fausse la lecture.
 */

const ROUTES = [
  { href: "/brand-lab/inspirations", label: "Inspirations", theme: "t-lab" },
  { href: "/brand-lab/paul", label: "Paul", theme: "t-paul" },
  { href: "/brand-lab/maxime", label: "Maxime", theme: "t-maxime" },
  { href: "/brand-lab/parrit", label: "Parrit", theme: "t-parrit" },
];

const THEMES = ROUTES.map((r) => r.theme).concat("t-lab");

export default function LabNav() {
  const pathname = usePathname() || "";
  const active = ROUTES.find((r) => pathname.startsWith(r.href));
  const theme = active?.theme ?? "t-lab";

  useEffect(() => {
    const body = document.body;
    THEMES.forEach((t) => body.classList.remove(t));
    body.classList.add(theme);
  }, [theme]);

  return (
    <nav className={`lab-nav ${theme}`} aria-label="Directions du Brand Lab">
      <div className="lab-nav__inner">
        <span className="lab-nav__mark">Parrit Brand Lab · interne · v1</span>
        <div className="lab-nav__links">
          {ROUTES.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="lab-nav__link"
              aria-current={pathname.startsWith(r.href) ? "page" : undefined}
            >
              {r.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
