/**
 * Feature flags — mécanisme minimal, sans service externe.
 *
 * Le repository n'avait aucun mécanisme de flag avant le 31/07/2026. Celui-ci
 * est volontairement pauvre : une variable d'environnement, lue au build.
 *
 * Pourquoi pas un flag runtime : la homepage est générée statiquement pour les
 * quatre langues (`generateStaticParams`). Lire `searchParams` ou un cookie
 * ferait basculer `/fr` en rendu dynamique, ce qui serait une régression de
 * performance sur toutes les langues pour le confort d'un seul variant.
 *
 * Conséquence assumée : la bascule demande un redéploiement. Sur la CD
 * existante, c'est de l'ordre de la minute, et le rollback est le même geste
 * en sens inverse. C'est documenté dans docs/design-system/HOMEPAGE-LEVEL0-V1.md.
 */

/** Toute valeur autre que "1" laisse le flag éteint. Défaut : éteint. */
function readBooleanEnv(value: string | undefined): boolean {
  return value === "1";
}

/**
 * HOMEPAGE-LEVEL0-V1 — hero structurel + rail de preuve sur `/fr`.
 *
 * Activation   : `NEXT_PUBLIC_HOMEPAGE_LEVEL0_V1=1` puis build.
 * Rollback     : retirer la variable, ou la passer à `0`, puis build.
 * Routes       : `/fr` uniquement. Les autres langues ne sont jamais affectées,
 *                même si la variable est active.
 */
export function isHomepageLevel0Enabled(lang: string): boolean {
  if (lang !== "fr") return false;
  return readBooleanEnv(process.env.NEXT_PUBLIC_HOMEPAGE_LEVEL0_V1);
}

/** Nom du variant, propagé tel quel dans les événements analytics. */
export const HOMEPAGE_LEVEL0_VARIANT = "homepage_level0_v1" as const;

/** Nom du variant de contrôle, pour que les deux branches soient comparables. */
export const HOMEPAGE_CONTROL_VARIANT = "homepage_control" as const;
