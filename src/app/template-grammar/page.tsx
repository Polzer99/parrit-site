import type { Metadata } from "next";
import Link from "next/link";

import { Label, SectionHeader } from "@/components/ds/primitives";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { PageBody } from "@/components/templates/parts";

export const metadata: Metadata = {
  title: "Grammaire de pages · Parrit.ai",
  description: "Les huit patrons de page, rendus avec des données réelles.",
  robots: { index: false, follow: false },
};

const TEMPLATES = [
  { id: "t1", nom: "Article", objectif: "Répondre à une question, prouver, proposer UNE ressource." },
  { id: "t2", nom: "Vidéo", objectif: "Une démonstration filmée, lisible sans la vidéo." },
  { id: "t3", nom: "Ressource", objectif: "Une promesse tenue contre une qualification." },
  { id: "t4", nom: "Système", objectif: "Ce que la machine fait, et où elle s'arrête." },
  { id: "t5", nom: "Thème", objectif: "Tout ce qui traite d'un problème, en une porte." },
  { id: "t6", nom: "Presse", objectif: "Ce qu'il faut à un journaliste, sans écrire un mail." },
  { id: "t7", nom: "Landing", objectif: "Une entrée, un message, une action." },
  { id: "t8", nom: "Auteur", objectif: "Le nœud du graphe, et une autorité vérifiable." },
];

export default function GrammairePage() {
  return (
    <>
      <SiteHeader lang="fr" variante="app" contexte="Grammaire de pages" />

      <PageBody largeur="content">
        <section style={{ paddingBlock: "var(--space-section-md)" }}>
          <SectionHeader
            index="00"
            label="Specimen"
            title="Huit patrons, zéro nouvelle direction artistique."
            lede="Chaque page ci-dessous est un assemblage de composants existants piloté par la donnée. Aucun template ne définit une couleur, une taille de police, un rayon ni une ombre."
          />

          <div style={{ marginTop: "var(--space-7)", display: "grid", gap: 0 }}>
            {TEMPLATES.map((t) => (
              <Link
                key={t.id}
                href={`/template-grammar/${t.id}`}
                className="ds-row-indexed"
                style={{
                  paddingBlock: "var(--space-5)",
                  borderTop: "var(--border-hairline) solid var(--color-line-hairline)",
                  textDecoration: "none",
                }}
              >
                <Label tone="signal">{t.id.toUpperCase()}</Label>
                <span style={{ display: "grid", gap: "var(--space-2)" }}>
                  <span
                    style={{
                      fontFamily: "var(--type-display-primary)",
                      fontSize: "var(--type-display-card)",
                      fontWeight: 600,
                      lineHeight: "var(--type-leading-display)",
                      color: "var(--color-ink-default)",
                    }}
                  >
                    {t.nom}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--type-mono-primary)",
                      fontSize: "var(--type-size-sm)",
                      lineHeight: "var(--type-leading-body)",
                      color: "var(--color-ink-muted)",
                    }}
                  >
                    {t.objectif}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </PageBody>

      <SiteFooter lang="fr" variante="minimal" />
    </>
  );
}
