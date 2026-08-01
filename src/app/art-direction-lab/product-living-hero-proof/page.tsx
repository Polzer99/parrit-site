import type { Metadata } from "next";
import { HeroProof } from "./HeroProof";

export const metadata: Metadata = {
  title: "Hero proof — preuve produit vivante",
  description: "Hero expérimental. Interne, non publié.",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * PRODUCT-LIVING-HERO-PROOF · passe de clarté
 *
 * Route isolée. Hors navigation publique, hors indexation, sans effet sur
 * `/fr`. Supprimer ce dossier suffit à supprimer l'expérimentation.
 *
 * `?presentation=1` masque le mobilier de laboratoire. Le mode est résolu
 * côté serveur : le lire après le montage ferait apparaître la barre de
 * laboratoire une fraction de seconde, exactement pendant le Retell Test.
 */
export default async function ProductLivingHeroProofPage({
  searchParams,
}: {
  searchParams: Promise<{ presentation?: string }>;
}) {
  const { presentation } = await searchParams;
  return <HeroProof presentation={presentation === "1"} />;
}
