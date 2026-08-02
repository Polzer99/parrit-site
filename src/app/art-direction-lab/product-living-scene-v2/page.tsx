import type { Metadata } from "next";
import { SceneV2 } from "./SceneV2";

export const metadata: Metadata = {
  title: "Product Living System · scène v2",
  description: "Second renderer de la scène produit. Interne, non publiée.",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * PRODUCT-LIVING-SYSTEM-SCENE-V2
 *
 * Route isolée, distincte de la V1 qui reste servie à
 * /art-direction-lab/product-living-scene pour comparaison.
 *
 * Elle n'est liée ni à la navigation publique, ni à la homepage, ni aux pages
 * commerciales, ni au design system. Aucune direction visuelle n'est déclarée
 * approuvée par cette tranche.
 */
export default function ProductLivingSceneV2Page() {
  return <SceneV2 />;
}
