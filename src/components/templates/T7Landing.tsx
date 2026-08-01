/**
 * T7 · LANDING DE CAMPAGNE — TEMPLATE-GRAMMAR.md §3.
 *
 * Une entrée, un message, une action. Header `app` : logo + contexte, AUCUN lien
 * de navigation avant le formulaire. Pied de page minimal.
 *
 * Ce template est surtout du RETRAIT : la chrome « fenêtre d'OS » de
 * `LandingPage.tsx` (`.landing-v4-traffic`, pastilles rondes, titre mono centré)
 * ne passe pas ici. Elle ne fait pas partie du canon.
 *
 * `utmCampaign` porte le slug de la Content Seed, pas un nom de campagne inventé :
 * c'est ce qui relie mécaniquement une publication à la production dont elle sort.
 */

import { IndexMark, Label, SectionHeader } from "@/components/ds/primitives";
import {
  HeroLevel0,
  TestimonialShiftLevel0,
  type ShiftItem,
  type ProofItem,
} from "@/components/ds/level0";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { CtaInline, JsonLd, PageBody, ProofRail } from "./parts";
import {
  assertSinglePrincipal,
  type CtaId,
} from "@/lib/registry";
import { graphe, SITE_URL } from "@/lib/seo/jsonld";

export type CampagneData = {
  slug: string;
  contexte: string;
  titre: string;
  lede: string;
  /** À qui ça s'adresse, et à qui ça ne s'adresse pas. */
  cadrage: string[];
  /** Les formulations réelles du problème, telles qu'on les entend. */
  verbatims: string[];
  rail: ProofItem[];
  deplacements?: ShiftItem[];
  objections: { question: string; reponse: string }[];
  /** Slug de la Content Seed dont la campagne est issue. */
  utmCampaign: string;
  /** Une landing qui double une page existante reste hors index. */
  noindex: boolean;
};

export function T7Landing({
  data,
  lang,
  ctaId,
  formulaire,
}: {
  data: CampagneData;
  lang: string;
  ctaId: CtaId;
  /** Le formulaire est injecté : le template ne connaît pas ses champs. */
  formulaire: React.ReactNode;
}) {
  assertSinglePrincipal([ctaId]);

  const url = `${SITE_URL}/${lang}/c/${data.slug}`;
  const source = `campagne-${data.utmCampaign}`;

  const noeuds: object[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#page`,
      name: data.titre,
      description: data.lede,
      inLanguage: lang,
      url,
    },
  ];

  return (
    <>
      <JsonLd json={graphe(noeuds)} />

      {/* Header `app` : aucun lien de navigation. Une seule sortie possible,
          et c'est le formulaire. */}
      <SiteHeader lang={lang} variante="app" contexte={data.contexte} />

      <PageBody largeur="content">
        <HeroLevel0
          titleLead={data.titre}
          lede={data.lede}
          conditions={data.cadrage}
        />

        {/* Sur mobile, l'action est atteignable sans scroller la page entière. */}
        <div style={{ paddingBottom: "var(--space-6)" }}>
          <CtaInline ctaId={ctaId} lang={lang} source={source} />
        </div>

        <section style={{ paddingBlock: "var(--space-section-md)" }}>
          <SectionHeader index="01" label="Le problème" title="Ce qu'on nous dit, mot pour mot." />
          <ul
            style={{
              marginTop: "var(--space-6)",
              padding: 0,
              listStyle: "none",
              display: "grid",
              gap: 0,
              maxWidth: "var(--container-text)",
            }}
          >
            {data.verbatims.map((v, i) => (
              <li
                key={v}
                className="ds-row-indexed"
                style={{
                  paddingBlock: "var(--space-4)",
                  borderTop: "var(--border-hairline) solid var(--color-line-hairline)",
                }}
              >
                <IndexMark value={String(i + 1).padStart(2, "0")} />
                <span
                  style={{
                    fontFamily: "var(--type-mono-primary)",
                    fontSize: "var(--type-size-md)",
                    lineHeight: "var(--type-leading-body)",
                    color: "var(--color-ink-default)",
                  }}
                >
                  {v}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <ProofRail items={data.rail} index="02" label="Le mécanisme" />

        {data.deplacements && data.deplacements.length > 0 && (
          <TestimonialShiftLevel0 items={data.deplacements} />
        )}

        <section
          id="capture"
          style={{
            marginBlock: "var(--space-section-md)",
            padding: "var(--space-8) var(--space-6)",
            background: "var(--color-paper-alt)",
            borderRadius: "var(--radius-none)",
            boxShadow: "var(--shadow-none)",
            maxWidth: "var(--container-text)",
          }}
        >
          {formulaire}
        </section>

        <section style={{ paddingBlock: "var(--space-section-md)" }}>
          <SectionHeader index="03" label="Objections" title="Ce que vous allez nous opposer." />
          <dl style={{ marginTop: "var(--space-6)", display: "grid", gap: "var(--space-5)" }}>
            {data.objections.map((o) => (
              <div
                key={o.question}
                style={{
                  paddingTop: "var(--space-4)",
                  borderTop: "var(--border-hairline) solid var(--color-line-hairline)",
                  display: "grid",
                  gap: "var(--space-2)",
                  maxWidth: "var(--container-text)",
                }}
              >
                <dt
                  style={{
                    margin: 0,
                    fontFamily: "var(--type-mono-primary)",
                    fontSize: "var(--type-size-md)",
                    fontWeight: 600,
                    color: "var(--color-ink-default)",
                  }}
                >
                  {o.question}
                </dt>
                <dd
                  style={{
                    margin: 0,
                    fontFamily: "var(--type-mono-primary)",
                    fontSize: "var(--type-size-sm)",
                    lineHeight: "var(--type-leading-body)",
                    color: "var(--color-ink-muted)",
                  }}
                >
                  {o.reponse}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div style={{ paddingBottom: "var(--space-section-sm)", display: "grid", gap: "var(--space-4)" }}>
          <CtaInline ctaId={ctaId} lang={lang} source={source} />
          <Label>Campagne · {data.utmCampaign}</Label>
        </div>
      </PageBody>

      <SiteFooter lang={lang} variante="minimal" />
    </>
  );
}
