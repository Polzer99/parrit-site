/**
 * SITE HEADER — un seul en-tête, trois variantes de densité.
 * Contrat : 04-DESIGN-SYSTEM-CONSOLIDATION.md §2.
 *
 * Remplace `.nav` (×3), `.blog-nav` (17 pages), `.landing-v4-topbar`, `.met-hero`
 * et le `<nav>` nu de harnais-ia.
 *
 * Invariants, quelle que soit la variante :
 *   logo SVG · hauteur --control-height-lg · fond papier OPAQUE (aucun
 *   backdrop-filter) · filet bas 1px · rayon 0 · aucune ombre.
 */

import type { CSSProperties } from "react";
import Link from "next/link";
import { Label } from "@/components/ds/primitives";
import { Logo } from "./Logo";
import {
  ctaHref,
  ctaProps,
  getCta,
  type CtaId,
} from "@/lib/registry";

export type HeaderVariante = "full" | "lean" | "app";

export type LienNav = { libelle: string; href: string };

const BARRE_STYLE: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "var(--space-5)",
  minHeight: "var(--control-height-lg)",
  paddingInline: "var(--gutter-mobile)",
  background: "var(--color-paper-default)",
  borderBottom: "var(--border-hairline) solid var(--color-line-hairline)",
  borderRadius: "var(--radius-none)",
  boxShadow: "var(--shadow-none)",
};

const LIEN_STYLE: CSSProperties = {
  fontFamily: "var(--type-mono-primary)",
  fontSize: "var(--type-size-sm)",
  color: "var(--color-ink-muted)",
  textDecoration: "none",
};

const CTA_STYLE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "var(--control-height-sm)",
  padding: "0 var(--space-5)",
  background: "var(--color-action-primary)",
  color: "var(--color-ink-inverse)",
  fontFamily: "var(--type-mono-primary)",
  fontSize: "var(--type-size-xs)",
  fontWeight: 600,
  letterSpacing: "var(--type-tracking-label)",
  textTransform: "uppercase",
  textDecoration: "none",
  borderRadius: "var(--radius-none)",
  boxShadow: "var(--shadow-none)",
};

export function SiteHeader({
  lang,
  variante = "lean",
  liens = [],
  /** Variante `app` : le contexte en cours, en mono. */
  contexte,
  /** Variante `app` : la sortie. */
  sortie,
  ctaId,
  source,
}: {
  lang: string;
  variante?: HeaderVariante;
  liens?: LienNav[];
  contexte?: string;
  sortie?: LienNav;
  ctaId?: CtaId;
  source?: string;
}) {
  const cta = ctaId ? getCta(ctaId) : undefined;

  return (
    <header style={BARRE_STYLE}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-5)" }}>
        <Logo lang={lang} />
        {variante === "app" && contexte && <Label>{contexte}</Label>}
      </div>

      {/* prefetch désactivé sur toute la navigation structurelle : sans ça, un
          lien vers une route pas encore créée laisse une requête RSC en vol
          indéfiniment, et la page n'atteint jamais networkidle. */}
      <nav style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
        {variante !== "app" &&
          liens.map((l) => (
            <Link key={l.href} href={l.href} prefetch={false} style={LIEN_STYLE}>
              {l.libelle}
            </Link>
          ))}

        {variante === "app" && sortie && (
          <Link href={sortie.href} prefetch={false} style={LIEN_STYLE}>
            {sortie.libelle}
          </Link>
        )}

        {cta && source && (
          <a
            href={ctaHref(cta.id, lang, source)}
            {...ctaProps(cta.id, "header")}
            style={CTA_STYLE}
          >
            {cta.libelle}
          </a>
        )}
      </nav>
    </header>
  );
}
