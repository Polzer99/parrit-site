/**
 * ÉTAT VIDE HONNÊTE.
 *
 * Ce qu'il fait : dire qu'il n'y a rien, dire pourquoi, et proposer la sortie
 * la plus utile.
 *
 * Ce qu'il ne fait JAMAIS : fabriquer une carte « bientôt disponible », un
 * élément grisé, un compteur à zéro déguisé en promesse, ou un contenu
 * d'exemple. Une collection vide se lit comme une collection vide.
 *
 * Il n'invente aucune valeur visuelle : uniquement des primitives et des tokens.
 */

import type { ReactNode } from "react";
import { Divider, Label, SectionHeader } from "@/components/ds/primitives";

export function EtatVide({
  index = "01",
  label,
  titre,
  explication,
  sortie,
}: {
  index?: string;
  label: string;
  /** Ce qui n'existe pas encore. Pas de conditionnel, pas de promesse. */
  titre: string;
  /** Pourquoi, en une phrase vraie. */
  explication: string;
  /** La sortie la plus utile depuis cette page. */
  sortie?: ReactNode;
}) {
  return (
    <section style={{ paddingBlock: "var(--space-section-md)" }}>
      <SectionHeader index={index} label={label} title={titre} lede={explication} />
      <div style={{ marginTop: "var(--space-7)" }}>
        <Divider />
        <div
          style={{
            paddingTop: "var(--space-5)",
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-5)",
            alignItems: "center",
          }}
        >
          <Label>Aucun élément publié</Label>
          {sortie}
        </div>
      </div>
    </section>
  );
}
