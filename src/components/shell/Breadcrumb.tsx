/**
 * FIL D'ARIANE — structurel. Le même objet alimente le rendu ET le
 * `BreadcrumbList` du graphe Schema.org : une seule source, donc jamais de
 * divergence entre ce que voit un humain et ce que lit un robot.
 */

import Link from "next/link";
import { Label } from "@/components/ds/primitives";

export type Miette = { nom: string; href: string };

export function Breadcrumb({ miettes }: { miettes: Miette[] }) {
  return (
    <nav
      aria-label="Fil d'Ariane"
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "var(--space-3)",
        paddingBlock: "var(--space-4)",
      }}
    >
      {miettes.map((m, i) => (
        <span
          key={m.href}
          style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-3)" }}
        >
          {i > 0 && (
            <span aria-hidden="true" style={{ color: "var(--color-ink-faint)" }}>
              ›
            </span>
          )}
          {i === miettes.length - 1 ? (
            <Label tone="ink">{m.nom}</Label>
          ) : (
            <Link href={m.href} style={{ textDecoration: "none" }}>
              <Label>{m.nom}</Label>
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
