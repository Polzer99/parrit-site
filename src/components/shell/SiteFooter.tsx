/**
 * SITE FOOTER — un seul. Remplace `.blog-footer`, `.dim`, `.hd-legal`,
 * `.landing-v4-statusbar`, `.met-cta`, `.cfooter`, `.bsd-footer`.
 *
 * Le bloc de mentions légales est aujourd'hui dupliqué MOT POUR MOT dans
 * HomeDeux.tsx:515-524 et OfferPage.tsx:349-358. Il n'existe plus qu'ici.
 */

import type { CSSProperties } from "react";
import Link from "next/link";
import { Divider, Label } from "@/components/ds/primitives";
import { Logo } from "./Logo";

const LIEN_STYLE: CSSProperties = {
  fontFamily: "var(--type-mono-primary)",
  fontSize: "var(--type-size-xs)",
  color: "var(--color-ink-muted)",
  textDecoration: "none",
};

export type FooterVariante = "full" | "minimal";

export function SiteFooter({
  lang,
  variante = "full",
  liens = [],
}: {
  lang: string;
  variante?: FooterVariante;
  liens?: { libelle: string; href: string }[];
}) {
  return (
    <footer
      style={{
        marginTop: "var(--space-section-md)",
        paddingBlock: "var(--space-7)",
        paddingInline: "var(--gutter-mobile)",
        background: "var(--color-paper-default)",
        borderTop: "var(--border-hairline) solid var(--color-line-hairline)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-content)",
          marginInline: "auto",
          display: "grid",
          gap: "var(--space-5)",
        }}
      >
        {variante === "full" && (
          <>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-5)",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Logo lang={lang} variante="encre" hauteur="1.25rem" />
              <nav style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-5)" }}>
                {liens.map((l) => (
                  <Link key={l.href} href={l.href} style={LIEN_STYLE}>
                    {l.libelle}
                  </Link>
                ))}
              </nav>
            </div>
            <Divider />
          </>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-5)",
            alignItems: "center",
          }}
        >
          <Link href={`/${lang}/mentions-legales`} style={LIEN_STYLE}>
            Mentions légales
          </Link>
          <Link href={`/${lang}/confidentialite`} style={LIEN_STYLE}>
            Confidentialité
          </Link>
          <Label>© SASU PARRIT.AI · Rueil-Malmaison</Label>
        </div>
      </div>
    </footer>
  );
}
