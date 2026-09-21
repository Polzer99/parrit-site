/* Les promesses du funnel vivent ICI et nulle part ailleurs. Une promesse
   dupliquée finit par diverger : c'est ce qui est arrivé avant le 09/09/2026,
   où la même ligne existait en quatre formulations selon la page.

   Corrigé le 21/09/2026 (audit funnel) : « prototype » surpromettait un
   livrable personnalisé à ce stade du parcours, alors qu'il s'agit d'un
   exemple illustratif suivi d'une revue humaine — jamais d'un prototype
   fabriqué automatiquement pour chaque entreprise. */

import type { Locale } from "@/system/locale";

export const ENGAGEMENTS = {
  en: {
    reponsePersonnelle: "One personal reply per company",
    aucuneSequence: "No automated sequence",
  },
  fr: {
    reponsePersonnelle: "Une réponse personnelle par entreprise",
    aucuneSequence: "Aucune séquence automatique",
  },
} as const;

export function noteFunnel(locale: Locale, variante: "hero" | "standard"): string {
  const e = ENGAGEMENTS[locale];
  if (variante === "hero") return e.reponsePersonnelle;
  return `${e.reponsePersonnelle} · ${e.aucuneSequence}`;
}
