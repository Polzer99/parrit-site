import type { Metadata } from "next";
import { ScenePremium } from "./ScenePremium";

export const metadata: Metadata = {
  title: "Product Living System · scène v2 premium",
  description: "Variante de finition de la scène produit. Interne, non publiée.",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * PRODUCT-LIVING-SYSTEM-SCENE-V2-PREMIUM-V1
 *
 * Variante de finition. Elle consomme exactement le même moteur que la V2 :
 * même scénario, mêmes états, mêmes branches, même wording.
 *
 * V1 et V2 restent servies à leurs routes respectives pour comparaison.
 * Aucune direction visuelle n'est déclarée approuvée par cette tranche.
 */
export default function ProductLivingScenePremiumPage() {
  return <ScenePremium />;
}
