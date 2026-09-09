/* Les promesses du funnel vivent ICI et nulle part ailleurs. Une promesse
   dupliquée finit par diverger : c'est ce qui est arrivé avant le 09/09/2026,
   où la même ligne existait en quatre formulations selon la page. */

import type { Locale } from "@/system/locale";

export const ENGAGEMENTS = {
  en: {
    unProtoParEntreprise: "One prototype per company",
    prepareALaMain: "Prepared by hand",
    aucuneSequence: "No automated sequence",
  },
  fr: {
    unProtoParEntreprise: "Un prototype par entreprise",
    prepareALaMain: "Préparé à la main",
    aucuneSequence: "Aucune séquence automatique",
  },
} as const;

export function noteFunnel(locale: Locale, variante: "hero" | "standard"): string {
  const e = ENGAGEMENTS[locale];
  const second = variante === "hero" ? e.prepareALaMain : e.aucuneSequence;
  return `${e.unProtoParEntreprise} · ${second}`;
}
