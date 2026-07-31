/**
 * PARRIT DESIGN SYSTEM — primitives structurelles
 *
 * Contrats : docs/design-system/04_COMPONENTS.md
 * Tokens   : src/styles/parrit-tokens.css
 *
 * Toutes ces primitives appartiennent à la COUCHE STRUCTURELLE.
 * Elles ne contiennent aucun média et restent intactes quand les images
 * sont masquées. Aucune ne pose d'ombre ni d'arrondi.
 */

import type { CSSProperties, ReactNode } from "react";

/* ------------------------------------------------------------------ Label */

/**
 * Label mono uppercase. Sert à nommer une zone, pas à décorer.
 * Contrainte de contenu : une seule ligne, jamais de phrase.
 */
export function Label({
  children,
  tone = "muted",
  style,
}: {
  children: ReactNode;
  tone?: "muted" | "signal" | "ink";
  style?: CSSProperties;
}) {
  const color =
    tone === "signal"
      ? "var(--color-signal-critical)"
      : tone === "ink"
        ? "var(--color-ink-default)"
        : "var(--color-ink-faint)";

  return (
    <span
      style={{
        fontFamily: "var(--type-mono-primary)",
        fontSize: "var(--type-size-xs)",
        fontWeight: "var(--type-weight-mono)" as CSSProperties["fontWeight"],
        letterSpacing: "var(--type-tracking-label)",
        lineHeight: "var(--type-leading-mono)",
        textTransform: "uppercase",
        color,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------- IndexMark */

/**
 * Marque d'index éditoriale — « 01 », « 02 ». Structure le rythme de lecture
 * et sert d'ancrage à l'asymétrie. C'est un repère, pas une décoration.
 */
export function IndexMark({ value, style }: { value: string; style?: CSSProperties }) {
  return (
    <span
      style={{
        fontFamily: "var(--type-mono-primary)",
        fontSize: "var(--type-size-xs)",
        letterSpacing: "var(--type-tracking-label)",
        color: "var(--color-ink-faint)",
        fontVariantNumeric: "tabular-nums",
        ...style,
      }}
    >
      {value}
    </span>
  );
}

/* ------------------------------------------------------------------ Badge */

/**
 * Badge signal. Fond red-tint, texte rouge, angles nets.
 * Red Causality : le badge signale un état ou une catégorie active.
 */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "var(--space-2) var(--space-3)",
        background: "var(--color-signal-tint)",
        color: "var(--color-signal-critical)",
        fontFamily: "var(--type-mono-primary)",
        fontSize: "var(--type-size-xs)",
        letterSpacing: "var(--type-tracking-label)",
        textTransform: "uppercase",
        borderRadius: "var(--radius-none)",
        lineHeight: "var(--type-leading-mono)",
      }}
    >
      {children}
    </span>
  );
}

/* ----------------------------------------------------------------- Metric */

/**
 * Donnée chiffrée + sa légende. La valeur est structurelle : c'est de la
 * preuve, pas de l'ornement. Ne jamais afficher un chiffre non vérifié.
 */
export function Metric({
  value,
  caption,
  signal = false,
}: {
  value: string;
  caption: string;
  signal?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <span
        style={{
          fontFamily: "var(--type-display-primary)",
          fontSize: "var(--type-display-card)",
          fontWeight: "var(--type-weight-display)" as CSSProperties["fontWeight"],
          letterSpacing: "var(--type-tracking-display)",
          lineHeight: "var(--type-leading-display)",
          color: signal ? "var(--color-signal-critical)" : "var(--color-ink-default)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "var(--type-mono-primary)",
          fontSize: "var(--type-size-sm)",
          lineHeight: "var(--type-leading-mono)",
          color: "var(--color-ink-muted)",
        }}
      >
        {caption}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- Divider */

/** Filet 1px. La hiérarchie repose dessus, pas sur une ombre. */
export function Divider({ style }: { style?: CSSProperties }) {
  return (
    <hr
      style={{
        border: 0,
        borderTop: "var(--border-hairline) solid var(--color-line-hairline)",
        margin: 0,
        ...style,
      }}
    />
  );
}

/* ---------------------------------------------------------- SectionHeader */

/**
 * En-tête de section : index + label + titre display + chapô facultatif.
 * Une section = une idée dominante. Le titre porte cette idée.
 */
export function SectionHeader({
  index,
  label,
  title,
  lede,
}: {
  index?: string;
  label?: string;
  title: string;
  lede?: string;
}) {
  return (
    <header style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {(index || label) && (
        <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "baseline" }}>
          {index && <IndexMark value={index} />}
          {label && <Label>{label}</Label>}
        </div>
      )}
      <h2
        style={{
          margin: 0,
          fontFamily: "var(--type-display-primary)",
          fontSize: "var(--type-display-section)",
          fontWeight: "var(--type-weight-display)" as CSSProperties["fontWeight"],
          letterSpacing: "var(--type-tracking-display)",
          lineHeight: "var(--type-leading-display)",
          color: "var(--color-ink-default)",
          textWrap: "balance",
        }}
      >
        {title}
      </h2>
      {lede && (
        <p
          style={{
            margin: 0,
            maxWidth: "var(--container-text)",
            fontFamily: "var(--type-mono-primary)",
            fontSize: "var(--type-size-md)",
            lineHeight: "var(--type-leading-body)",
            color: "var(--color-ink-muted)",
          }}
        >
          {lede}
        </p>
      )}
    </header>
  );
}

/* ----------------------------------------------------------------- Button */

/**
 * Bouton rectangulaire net. Deux variantes seulement.
 * primary = rouge (action principale, une seule par écran).
 * secondary = encre.
 */
export function Button({
  children,
  href,
  variant = "primary",
  type,
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
}) {
  const background =
    variant === "primary" ? "var(--color-action-primary)" : "var(--color-action-secondary)";

  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "var(--control-height-md)",
    padding: "0 var(--space-6)",
    background,
    color: "var(--color-ink-inverse)",
    fontFamily: "var(--type-mono-primary)",
    fontSize: "var(--type-size-sm)",
    fontWeight: "var(--type-weight-mono-strong)" as CSSProperties["fontWeight"],
    letterSpacing: "var(--type-tracking-label)",
    textTransform: "uppercase",
    textDecoration: "none",
    border: "none",
    borderRadius: "var(--radius-none)",
    boxShadow: "var(--shadow-none)",
    cursor: "pointer",
    transition: `opacity var(--motion-base) var(--ease-standard)`,
  };

  if (href) {
    return (
      <a href={href} style={style}>
        {children}
      </a>
    );
  }
  return (
    <button type={type ?? "button"} style={style}>
      {children}
    </button>
  );
}

/* ------------------------------------------------------------- TextLink */

/** Lien texte souligné. Le rouge marque la destination active. */
export function TextLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a
      href={href}
      style={{
        color: "var(--color-signal-critical)",
        fontFamily: "var(--type-mono-primary)",
        fontSize: "var(--type-size-sm)",
        textDecoration: "underline",
        textUnderlineOffset: "0.25em",
      }}
    >
      {children}
    </a>
  );
}
