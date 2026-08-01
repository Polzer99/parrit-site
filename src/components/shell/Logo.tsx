/**
 * LOGO — unique. Remplace les trois copies identiques de `Logo()` qui vivent
 * dans OfferPage.tsx, OnePager.tsx et HomeClient.tsx.
 *
 * Le logotype est TOUJOURS le SVG. Il n'est jamais retapé en texte.
 */

import Link from "next/link";

export type LogoVariante = "rouge" | "encre" | "inverse";

const SOURCES: Record<LogoVariante, string> = {
  rouge: "/brand/parrit-lockup-red.svg",
  encre: "/brand/parrit-lockup.svg",
  inverse: "/brand/parrit-reversed.svg",
};

export function Logo({
  lang,
  variante = "rouge",
  hauteur = "1.5rem",
}: {
  lang: string;
  variante?: LogoVariante;
  hauteur?: string;
}) {
  return (
    <Link href={`/${lang}`} aria-label="Parrit.ai, accueil" style={{ display: "inline-flex" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SOURCES[variante]}
        alt="Parrit.ai"
        style={{ height: hauteur, width: "auto", display: "block" }}
      />
    </Link>
  );
}
