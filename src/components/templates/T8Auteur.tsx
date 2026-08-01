/**
 * T8 · AUTEUR — TEMPLATE-GRAMMAR.md §3.
 *
 * C'est le nœud `#person` du graphe Schema.org : le `BlogPosting` de T1 pointe
 * dessus. L'`@id` est stable et ne bouge JAMAIS.
 *
 * Règle photo, non négociable : vraie photo retravaillée, jamais 100 % IA.
 * Les 13 déclinaisons de `public/brand/editorial/portraits/` dérivent toutes de
 * vraies prises de vue.
 */

import { SectionHeader } from "@/components/ds/primitives";
import { MediaPlate } from "@/components/ds/level0";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { Breadcrumb, type Miette } from "@/components/shell/Breadcrumb";
import {
  CtaBlock,
  ContenusLies,
  JsonLd,
  PageBody,
  ProofBlock,
  type LienContenu,
} from "./parts";
import { assertSinglePrincipal, type CtaId } from "@/lib/registry/cta";
import {
  breadcrumbList,
  graphe,
  organizationRef,
  personId,
  SITE_URL,
} from "@/lib/seo/jsonld";

export type AuteurData = {
  slug: string;
  nom: string;
  role: string;
  /** Ce que cette personne FAIT. Pas ce dont elle est « passionnée ». */
  positionnement: string;
  portrait: { src: string; alt: string; legende?: string };
  preuveRefs?: readonly string[];
  publications: LienContenu[];
  sameAs: string[];
};

export function T8Auteur({
  data,
  lang,
  ctaId,
  labels,
}: {
  data: AuteurData;
  lang: string;
  ctaId: CtaId;
  labels: { auteurs: string; livre: string; publications: string };
}) {
  assertSinglePrincipal([ctaId]);

  const url = `${SITE_URL}/${lang}/auteur/${data.slug}`;
  const source = `auteur-${data.slug}`;

  const miettes: Miette[] = [
    { nom: "Parrit.ai", href: `/${lang}` },
    { nom: labels.auteurs, href: `/${lang}/blog` },
    { nom: data.nom, href: `/${lang}/auteur/${data.slug}` },
  ];

  const noeuds: object[] = [
    {
      "@type": "ProfilePage",
      "@id": `${url}#profile`,
      inLanguage: lang,
      url,
      mainEntity: {
        "@type": "Person",
        // Stable. Le casser casse le graphe entier.
        "@id": personId(lang, data.slug),
        name: data.nom,
        jobTitle: data.role,
        description: data.positionnement,
        image: `${SITE_URL}${data.portrait.src}`,
        url,
        sameAs: data.sameAs,
        worksFor: organizationRef(),
      },
    },
    breadcrumbList(miettes),
  ];

  return (
    <>
      <JsonLd json={graphe(noeuds)} />

      <SiteHeader lang={lang} variante="lean" ctaId={ctaId} source={source} />

      <PageBody largeur="content">
        <Breadcrumb miettes={miettes} />

        <section
          style={{
            display: "grid",
            gap: "var(--space-7)",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 20rem), 1fr))",
            paddingBlock: "var(--space-section-md)",
            alignItems: "start",
          }}
        >
          <MediaPlate
            src={data.portrait.src}
            alt={data.portrait.alt}
            caption={data.portrait.legende}
          />
          <div style={{ display: "grid", gap: "var(--space-5)" }}>
            <h1
              style={{
                margin: 0,
                fontFamily: "var(--type-display-primary)",
                fontSize: "var(--type-display-section)",
                fontWeight: 600,
                letterSpacing: "var(--type-tracking-display)",
                lineHeight: "var(--type-leading-display)",
                color: "var(--color-ink-default)",
                textWrap: "balance",
              }}
            >
              {data.nom}
            </h1>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--type-mono-primary)",
                fontSize: "var(--type-size-md)",
                lineHeight: "var(--type-leading-body)",
                color: "var(--color-ink-muted)",
              }}
            >
              <span style={{ color: "var(--color-ink-default)", fontWeight: 600 }}>
                {data.role}.{" "}
              </span>
              {data.positionnement}
            </p>
          </div>
        </section>

        {data.preuveRefs && data.preuveRefs.length > 0 ? (
          <ProofBlock preuveRefs={data.preuveRefs} index="01" label={labels.livre} />
        ) : (
          <section style={{ paddingBlock: "var(--space-section-sm)" }}>
            <SectionHeader index="01" label={labels.livre} title="Ce qui a été livré." />
          </section>
        )}

        <ContenusLies titre={labels.publications} items={data.publications} />

        <CtaBlock
          ctaId={ctaId}
          lang={lang}
          source={source}
          titre="Quinze minutes, directement."
          lede="Pas de qualification en trois étapes. Vous décrivez, on répond."
        />
      </PageBody>

      <SiteFooter lang={lang} />
    </>
  );
}
