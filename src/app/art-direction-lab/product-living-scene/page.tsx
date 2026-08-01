import type { Metadata } from "next";
import { LivingScene } from "./LivingScene";

export const metadata: Metadata = {
  title: "Product Living System — scène",
  description: "Scène produit expérimentale. Interne, non publiée.",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * PRODUCT-LIVING-SYSTEM-SCENE-V1
 *
 * Route isolée. Elle n'est liée ni à la navigation publique, ni à la
 * homepage, ni aux pages commerciales, ni au design system. Supprimer ce
 * dossier suffit à supprimer la scène, sans conséquence ailleurs.
 *
 * Aucune direction visuelle n'est déclarée approuvée par cette tranche.
 */
export default function ProductLivingScenePage() {
  return <LivingScene />;
}
