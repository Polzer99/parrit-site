/**
 * PARRIT DESIGN SYSTEM — NIVEAU 0
 *
 * Contrat : ces cinq composants portent l'identité Parrit SANS AUCUNE IMAGE.
 * Ils ne rendent aucun <img>, aucun background-image, aucune couche expressive.
 * C'est le socle du Structural Integrity Test : si le niveau 0 seul ne se lit
 * pas comme du Parrit, c'est le système qui est en faute, pas la page.
 *
 * Contrats détaillés : docs/design-system/04_COMPONENTS.md
 */

import type { CSSProperties } from "react";
import { Badge, Divider, IndexMark, Label, Metric, SectionHeader, Button } from "./primitives";

/* ---------------------------------------------- styles d'action du hero */

/**
 * L'action principale. Un seul élément de la page peut porter ce poids.
 * Rectangle net, rouge signal, aucune ombre, aucun rayon.
 */
const PRIMARY_ACTION_STYLE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "var(--control-height-lg)",
  padding: "0 var(--space-6)",
  background: "var(--color-action-primary)",
  color: "var(--color-ink-inverse)",
  fontFamily: "var(--type-mono-primary)",
  fontSize: "var(--type-size-sm)",
  fontWeight: 600,
  letterSpacing: "var(--type-tracking-label)",
  textTransform: "uppercase",
  textDecoration: "none",
  border: "none",
  borderRadius: "var(--radius-none)",
  boxShadow: "var(--shadow-none)",
};

/**
 * Le lien secondaire. Volontairement typé comme du texte, pas comme un bouton :
 * un second bouton plein recréerait la double porte commerciale.
 */
const SECONDARY_LINK_STYLE: CSSProperties = {
  fontFamily: "var(--type-mono-primary)",
  fontSize: "var(--type-size-sm)",
  color: "var(--color-ink-muted)",
  textDecoration: "underline",
  textUnderlineOffset: "0.3em",
  textDecorationColor: "var(--color-line-hairline)",
};

/* ============================================================== HeroLevel0 */

export type HeroLevel0Props = {
  /** Badge de contexte. Facultatif — n'en mettre un que s'il qualifie vraiment. */
  eyebrow?: string;
  /** Titre. Le segment mis en rouge doit porter le SUJET, pas un mot au hasard. */
  titleLead: string;
  titleSignal?: string;
  titleTail?: string;
  /** Chapô. Première phrase en gras = signature Parrit. */
  ledeStrong?: string;
  lede: string;
  primaryCta?: { label: string; href: string };
  /**
   * Seconde action de même poids visuel. À n'utiliser QUE si la page assume
   * deux portes équivalentes. Sur une page commerciale, préférer
   * `secondaryLink` : deux boutons pleins créent la double porte que le canon
   * de conversion demande de supprimer.
   */
  secondaryCta?: { label: string; href: string };
  /**
   * Lien texte discret, sous les actions. Répond à un besoin DISTINCT du CTA
   * principal (voir des exemples, comprendre la méthode) et ne doit jamais le
   * concurrencer visuellement.
   */
  secondaryLink?: { label: string; href: string };
  /** Bandeau de conditions réelles : périmètre, format, contrainte. */
  conditions?: string[];
  /** Attributs data-* posés sur les actions, pour l'instrumentation. */
  primaryCtaProps?: Record<string, string>;
  secondaryLinkProps?: Record<string, string>;
};

/**
 * Hero canonique. SANS IMAGE, par défaut et par conception.
 * La silhouette vient de la typographie, pas d'un visuel.
 */
export function HeroLevel0({
  eyebrow,
  titleLead,
  titleSignal,
  titleTail,
  ledeStrong,
  lede,
  primaryCta,
  secondaryCta,
  secondaryLink,
  conditions,
  primaryCtaProps,
  secondaryLinkProps,
}: HeroLevel0Props) {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-7)",
        paddingBlock: "var(--space-section-lg)",
        maxWidth: "var(--container-content)",
      }}
    >
      {eyebrow && (
        <div>
          <Badge>{eyebrow}</Badge>
        </div>
      )}

      <h1
        style={{
          margin: 0,
          fontFamily: "var(--type-display-primary)",
          fontSize: "var(--type-display-hero)",
          fontWeight: "var(--type-weight-display)" as CSSProperties["fontWeight"],
          letterSpacing: "var(--type-tracking-display)",
          lineHeight: "var(--type-leading-display)",
          color: "var(--color-ink-default)",
          textWrap: "balance",
        }}
      >
        {titleLead}
        {titleSignal && (
          <>
            {" "}
            <span style={{ color: "var(--color-signal-critical)" }}>{titleSignal}</span>
          </>
        )}
        {titleTail && <> {titleTail}</>}
      </h1>

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
        {ledeStrong && (
          <strong style={{ color: "var(--color-ink-default)", fontWeight: 600 }}>
            {ledeStrong}{" "}
          </strong>
        )}
        {lede}
      </p>

      {(primaryCta || secondaryCta || secondaryLink) && (
        <div
          style={{
            display: "flex",
            gap: "var(--space-5)",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {primaryCta && (
            <a href={primaryCta.href} {...primaryCtaProps} style={PRIMARY_ACTION_STYLE}>
              {primaryCta.label}
              <span aria-hidden="true" style={{ marginLeft: "var(--space-3)" }}>
                →
              </span>
            </a>
          )}
          {secondaryCta && (
            <Button href={secondaryCta.href} variant="secondary">
              {secondaryCta.label}
            </Button>
          )}
          {secondaryLink && (
            <a href={secondaryLink.href} {...secondaryLinkProps} style={SECONDARY_LINK_STYLE}>
              {secondaryLink.label}
            </a>
          )}
        </div>
      )}

      {conditions && conditions.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "var(--space-5)",
            flexWrap: "wrap",
            paddingTop: "var(--space-5)",
            borderTop: "var(--border-hairline) solid var(--color-line-hairline)",
          }}
        >
          {conditions.map((c) => (
            <Label key={c}>{c}</Label>
          ))}
        </div>
      )}
    </section>
  );
}

/* ========================================================= ProofRailLevel0 */

/** Valeur d'une métadonnée de preuve. Contrairement au Label, elle se replie. */
const META_VALUE_STYLE: CSSProperties = {
  fontFamily: "var(--type-mono-primary)",
  fontSize: "var(--type-size-xs)",
  lineHeight: "var(--type-leading-mono)",
  color: "var(--color-ink-muted)",
  minWidth: 0,
};

export type ProofItem = {
  index: string;
  input: string;
  output: string;
  owner: string;
  scope: string;
};

/**
 * Rail de preuve : input → output → propriétaire humain → périmètre.
 * C'est le modèle de preuve Parrit rendu visible. Le rouge marque le PASSAGE
 * input → output : c'est là qu'est la causalité.
 */
export function ProofRailLevel0({
  items,
  index = "01",
  label = "Ce qui tourne",
  title = "Un input réel, un output défini, un propriétaire humain.",
  lede,
  itemProps,
}: {
  items: ProofItem[];
  /** En-tête surchargeable. Les valeurs par défaut sont celles du specimen. */
  index?: string;
  label?: string;
  title?: string;
  lede?: string;
  /** Attributs data-* posés sur chaque ligne, pour l'instrumentation. */
  itemProps?: Record<string, string>;
}) {
  return (
    <section style={{ paddingBlock: "var(--space-section-md)" }}>
      <SectionHeader index={index} label={label} title={title} lede={lede} />
      <div style={{ marginTop: "var(--space-7)", display: "grid", gap: "var(--space-6)" }}>
        {items.map((item) => (
          <article
            key={item.index}
            className="ds-row-indexed"
            {...itemProps}
            data-proof-index={item.index}
            style={{
              paddingTop: "var(--space-5)",
              borderTop: "var(--border-hairline) solid var(--color-line-hairline)",
            }}
          >
            <IndexMark value={item.index} />
            <div style={{ display: "grid", gap: "var(--space-3)" }}>
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-3)",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  fontFamily: "var(--type-mono-primary)",
                  fontSize: "var(--type-size-md)",
                  lineHeight: "var(--type-leading-mono)",
                  color: "var(--color-ink-default)",
                }}
              >
                <span>{item.input}</span>
                {/* Rouge causal : il matérialise le passage input → output. */}
                <span
                  aria-hidden="true"
                  style={{ color: "var(--color-signal-critical)", fontWeight: 600 }}
                >
                  →
                </span>
                <span>{item.output}</span>
              </div>
              {/* Le LIBELLÉ est un Label (court, une ligne, nowrap par
                  contrat). La VALEUR est du texte courant, qui doit pouvoir
                  passer à la ligne : mettre une phrase dans un Label produit un
                  débordement horizontal en mobile. */}
              <dl style={{ margin: 0, display: "grid", gap: "var(--space-2)" }}>
                <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                  <dt style={{ margin: 0 }}>
                    <Label>Propriétaire</Label>
                  </dt>
                  <dd style={{ margin: 0, ...META_VALUE_STYLE }}>{item.owner}</dd>
                </div>
                <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                  <dt style={{ margin: 0 }}>
                    <Label>Périmètre</Label>
                  </dt>
                  <dd style={{ margin: 0, ...META_VALUE_STYLE }}>{item.scope}</dd>
                </div>
              </dl>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ================================================ TestimonialShiftLevel0 */

export type ShiftItem = { before: string; after: string; context: string };

/**
 * Avant → Après. Structure la transformation sans photo ni logo.
 * Le rouge marque l'état ATTEINT, pas la citation.
 */
export function TestimonialShiftLevel0({ items }: { items: ShiftItem[] }) {
  return (
    <section style={{ paddingBlock: "var(--space-section-md)" }}>
      <SectionHeader index="02" label="Déplacement" title="Ce qui change, concrètement." />
      <div
        style={{
          marginTop: "var(--space-7)",
          display: "grid",
          gap: "var(--space-6)",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 20rem), 1fr))",
        }}
      >
        {items.map((item) => (
          <article
            key={item.context}
            style={{
              display: "grid",
              gap: "var(--space-4)",
              padding: "var(--space-5)",
              border: "var(--border-hairline) solid var(--color-line-hairline)",
              borderRadius: "var(--radius-none)",
              boxShadow: "var(--shadow-none)",
              background: "var(--color-paper-default)",
            }}
          >
            <Label>{item.context}</Label>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--type-mono-primary)",
                fontSize: "var(--type-size-sm)",
                lineHeight: "var(--type-leading-body)",
                color: "var(--color-ink-muted)",
                textDecoration: "line-through",
                textDecorationColor: "var(--color-line-hairline)",
              }}
            >
              {item.before}
            </p>
            <Divider />
            <p
              style={{
                margin: 0,
                fontFamily: "var(--type-mono-primary)",
                fontSize: "var(--type-size-md)",
                lineHeight: "var(--type-leading-body)",
                color: "var(--color-ink-default)",
              }}
            >
              {item.after}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ====================================================== HermesTraceLevel0 */

export type HermesState =
  | "success"
  | "failure"
  | "waiting"
  | "blocked"
  | "human-review"
  | "improvement-proposed"
  | "improvement-accepted"
  | "improvement-rejected";

/**
 * Chaque état porte un LIBELLÉ et un SYMBOLE, pas seulement une couleur.
 * Contrainte d'accessibilité et contrainte de marque : on évite l'arc-en-ciel
 * de statuts. Seul l'état qui demande une intervention porte du rouge.
 */
const HERMES_STATES: Record<HermesState, { label: string; mark: string; signal: boolean }> = {
  success: { label: "Exécuté", mark: "●", signal: false },
  failure: { label: "Échec", mark: "×", signal: true },
  waiting: { label: "En attente", mark: "○", signal: false },
  blocked: { label: "Bloqué", mark: "▪", signal: true },
  "human-review": { label: "Revue humaine", mark: "◆", signal: true },
  "improvement-proposed": { label: "Amélioration proposée", mark: "△", signal: false },
  "improvement-accepted": { label: "Amélioration retenue", mark: "▲", signal: false },
  "improvement-rejected": { label: "Amélioration écartée", mark: "▽", signal: false },
};

export function HermesStatus({ state }: { state: HermesState }) {
  const s = HERMES_STATES[state];
  const color = s.signal ? "var(--color-signal-critical)" : "var(--color-ink-muted)";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontFamily: "var(--type-mono-primary)",
        fontSize: "var(--type-size-xs)",
        letterSpacing: "var(--type-tracking-label)",
        textTransform: "uppercase",
        color,
      }}
    >
      <span aria-hidden="true">{s.mark}</span>
      {s.label}
    </span>
  );
}

export type TraceStep = {
  time: string;
  action: string;
  source?: string;
  state: HermesState;
};

/**
 * Trace d'exécution Hermès. Rend visibles les actions, les sources, les états
 * et le point de contrôle humain. Hermès n'est jamais une fenêtre de conversation ici :
 * c'est un système dont on lit le journal.
 *
 * L'attribution Nous Research / MIT est OBLIGATOIRE et fait partie du composant.
 */
export function HermesTraceLevel0({
  steps,
  scope,
}: {
  steps: TraceStep[];
  scope: string;
}) {
  return (
    <section style={{ paddingBlock: "var(--space-section-md)" }}>
      <SectionHeader
        index="03"
        label="Trace"
        title="Ce que l'agent a fait, et où l'humain reprend la main."
        lede={`Périmètre déclaré : ${scope}`}
      />

      <ol
        style={{
          marginTop: "var(--space-7)",
          padding: 0,
          listStyle: "none",
          display: "grid",
          gap: 0,
        }}
      >
        {steps.map((step, i) => (
          <li
            key={`${step.time}-${i}`}
            className="ds-row-trace"
            style={{
              padding: "var(--space-4) 0",
              borderTop: "var(--border-hairline) solid var(--color-line-hairline)",
            }}
          >
            <IndexMark value={step.time} />
            <div style={{ display: "grid", gap: "var(--space-2)" }}>
              <span
                style={{
                  fontFamily: "var(--type-mono-primary)",
                  fontSize: "var(--type-size-sm)",
                  lineHeight: "var(--type-leading-mono)",
                  color: "var(--color-ink-default)",
                }}
              >
                {step.action}
              </span>
              {step.source && <Label>Source · {step.source}</Label>}
            </div>
            <HermesStatus state={step.state} />
          </li>
        ))}
      </ol>

      <p
        style={{
          marginTop: "var(--space-5)",
          paddingTop: "var(--space-4)",
          borderTop: "var(--border-hairline) solid var(--color-line-hairline)",
          fontFamily: "var(--type-mono-primary)",
          fontSize: "var(--type-size-xs)",
          lineHeight: "var(--type-leading-mono)",
          color: "var(--color-ink-faint)",
        }}
      >
        Hermes Agent · open source by Nous Research, MIT License. Parrit.ai conçoit, adapte,
        intègre et déploie le système, et organise les boucles de contrôle.
      </p>
    </section>
  );
}

/* ======================================================= CTASectionLevel0 */

export function CTASectionLevel0({
  title,
  lede,
  primaryCta,
  secondaryCta,
  finePrint,
}: {
  title: string;
  lede: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  finePrint?: string;
}) {
  return (
    <section
      style={{
        marginBlock: "var(--space-section-md)",
        padding: "var(--space-8) var(--space-6)",
        background: "var(--color-paper-alt)",
        borderRadius: "var(--radius-none)",
        boxShadow: "var(--shadow-none)",
      }}
    >
      <div style={{ display: "grid", gap: "var(--space-5)", maxWidth: "var(--container-text)" }}>
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
        <p
          style={{
            margin: 0,
            fontFamily: "var(--type-mono-primary)",
            fontSize: "var(--type-size-md)",
            lineHeight: "var(--type-leading-body)",
            color: "var(--color-ink-muted)",
          }}
        >
          {lede}
        </p>
        <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
          <Button href={primaryCta.href} variant="primary">
            {primaryCta.label}
          </Button>
          {secondaryCta && (
            <Button href={secondaryCta.href} variant="secondary">
              {secondaryCta.label}
            </Button>
          )}
        </div>
        {finePrint && (
          <p
            style={{
              margin: 0,
              fontFamily: "var(--type-mono-primary)",
              fontSize: "var(--type-size-xs)",
              lineHeight: "var(--type-leading-mono)",
              color: "var(--color-ink-faint)",
            }}
          >
            {finePrint}
          </p>
        )}
      </div>
    </section>
  );
}

/* ============================================ Couche expressive (isolée) */

/**
 * MediaPlate — couche EXPRESSIVE. Porte data-layer="expressive" : disparaît
 * au Structural Integrity Test. Toute page qui devient illisible sans elle
 * est non conforme.
 */
export function MediaPlate({
  src,
  alt,
  caption,
  collapse = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  collapse?: boolean;
}) {
  return (
    <figure
      data-layer="expressive"
      data-collapse={collapse ? "true" : undefined}
      style={{ margin: 0, display: "grid", gap: "var(--space-3)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          borderRadius: "var(--radius-none)",
          boxShadow: "var(--shadow-none)",
        }}
      />
      {caption && (
        <figcaption>
          <Label>{caption}</Label>
        </figcaption>
      )}
    </figure>
  );
}

export { Badge, Divider, IndexMark, Label, Metric, SectionHeader, Button };
