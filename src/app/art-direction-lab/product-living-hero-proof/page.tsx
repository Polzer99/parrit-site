import type { Metadata } from "next";
import { HeroProof } from "./HeroProof";

export const metadata: Metadata = {
  title: "Hero proof — preuve produit vivante",
  description: "Hero expérimental. Interne, non publié.",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * PRODUCT-LIVING-HERO-PROOF-V1
 *
 * Route isolée. Hors navigation publique, hors indexation, sans effet sur
 * `/fr`. Supprimer ce dossier suffit à supprimer l'expérimentation.
 *
 * Concept D, la scène V1, la V2 et la variante Premium restent servies à
 * leurs routes respectives et ne sont pas modifiées.
 *
 * Aucune direction visuelle n'est déclarée approuvée par cette tranche.
 */
export default function ProductLivingHeroProofPage() {
  return <HeroProof />;
}
