import type { ReactNode } from "react";

/*
 * KIT · les composants de la maison.
 *
 * Un seul jeu pour les trois expressions. Aucun composant ne connaît le thème :
 * la température vient uniquement des variables CSS posées par .t-paul,
 * .t-maxime, .t-parrit. Si un composant devait savoir dans quel thème il est,
 * ce serait le signe qu'il est mal découpé.
 */

export function Section({
  id,
  label,
  variant,
  children,
}: {
  id?: string;
  label?: string;
  variant?: "deep" | "alt" | "flush";
  children: ReactNode;
}) {
  const cls = ["lab-section", variant ? `lab-section--${variant}` : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <section id={id} className={cls} data-label={label}>
      {children}
    </section>
  );
}

export function Wrap({
  size,
  children,
}: {
  size?: "wide" | "text";
  children: ReactNode;
}) {
  return (
    <div className={`lab-wrap${size ? ` lab-wrap--${size}` : ""}`}>{children}</div>
  );
}

export function Head({
  num,
  label,
  title,
  lead,
}: {
  num?: string;
  label?: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="lab-head">
      <div className="lab-head__meta">
        {num ? <span className="lab-num">{num}</span> : null}
        {label ? <span className="lab-label">{label}</span> : null}
      </div>
      <h2 className="lab-h2">{title}</h2>
      {lead ? <p className="lab-body">{lead}</p> : null}
    </header>
  );
}

export function Card({
  title,
  children,
  kicker,
}: {
  title: string;
  kicker?: string;
  children?: ReactNode;
}) {
  return (
    <article className="lab-card">
      {kicker ? <span className="lab-label">{kicker}</span> : null}
      <h3 className="lab-card__title">{title}</h3>
      {children ? <div className="lab-card__body">{children}</div> : null}
    </article>
  );
}

export function Badge({
  children,
  neutral,
}: {
  children: ReactNode;
  neutral?: boolean;
}) {
  return (
    <span className={`lab-badge${neutral ? " lab-badge--neutral" : ""}`}>
      <i className="lab-dot" aria-hidden />
      {children}
    </span>
  );
}

/**
 * Emplacement de média manquant. On dit ce qui manque et pourquoi, on ne
 * remplit jamais avec un faux visuel ni du copy de garnissage.
 */
export function Slot({
  kind,
  what,
  ratio,
}: {
  kind: string;
  what: string;
  ratio?: string;
}) {
  return (
    <div className="lab-slot" style={ratio ? { aspectRatio: ratio } : undefined}>
      <span className="lab-slot__kind">{kind}</span>
      <span className="lab-slot__what">{what}</span>
    </div>
  );
}

export function Media({
  src,
  alt,
  caption,
  shape,
}: {
  src: string;
  alt: string;
  caption?: string;
  shape?: "portrait" | "square";
}) {
  return (
    <figure
      className={`lab-media${shape ? ` lab-media--${shape}` : ""}`}
      style={{ margin: 0 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" />
      {caption ? <figcaption className="lab-media__cap">{caption}</figcaption> : null}
    </figure>
  );
}

export function Quote({
  text,
  who,
}: {
  text: string;
  who: string;
}) {
  return (
    <blockquote className="lab-quote">
      <p className="lab-quote__text">{text}</p>
      <cite className="lab-quote__who">{who}</cite>
    </blockquote>
  );
}

export function Cta({
  href,
  children,
  variant,
  size,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "lg";
}) {
  const cls = [
    "lab-btn",
    variant ? `lab-btn--${variant}` : "",
    size ? `lab-btn--${size}` : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <a className={cls} href={href}>
      {children}
    </a>
  );
}

export function Stack({
  gap = 4,
  children,
  style,
}: {
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`lab-stack lab-stack--${gap}`} style={style}>
      {children}
    </div>
  );
}
