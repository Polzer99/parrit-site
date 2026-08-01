/**
 * T5 · PAGE THÉMATIQUE — TEMPLATE-GRAMMAR.md §3.
 *
 * Élargit `blog/sujet/[pillar]` : un thème ne regroupe pas que des articles, il
 * regroupe aussi les systèmes, les vidéos et LA ressource la plus qualifiante.
 * C'est le socle SEO et le routeur interne, pas une page de liens.
 */

import { SectionHeader } from "@/components/ds/primitives";
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
import {
  assertSinglePrincipal,
  type CtaId,
} from "@/lib/registry";
import { breadcrumbList, graphe, SITE_URL } from "@/lib/seo/jsonld";

export type ThemeData = {
  slug: string;
  motCle: string;
  titre: string;
  description: string;
  /** Intro éditoriale en HTML — pas un résumé de la liste de liens. */
  intro: string;
  articles: LienContenu[];
  systemes: LienContenu[];
  videos?: LienContenu[];
  ressource?: { titre: string; href: string };
  preuveRefs?: readonly string[];
  themesVoisins: LienContenu[];
};

export function T5Theme({
  data,
  lang,
  ctaId,
  labels,
}: {
  data: ThemeData;
  lang: string;
  ctaId: CtaId;
  labels: {
    themes: string;
    articles: string;
    systemes: string;
    videos: string;
    voisins: string;
  };
}) {
  assertSinglePrincipal([ctaId]);

  const url = `${SITE_URL}/${lang}/blog/sujet/${data.slug}`;
  const source = `theme-${data.slug}`;

  const miettes: Miette[] = [
    { nom: "Parrit.ai", href: `/${lang}` },
    { nom: labels.themes, href: `/${lang}/blog` },
    { nom: data.motCle, href: `/${lang}/blog/sujet/${data.slug}` },
  ];

  const tous = [...data.articles, ...data.systemes, ...(data.videos ?? [])];

  const noeuds: object[] = [
    {
      "@type": "CollectionPage",
      "@id": `${url}#collection`,
      name: data.titre,
      description: data.description,
      inLanguage: lang,
      url,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: tous.length,
        itemListElement: tous.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.titre,
          item: `${SITE_URL}${item.href}`,
        })),
      },
    },
    breadcrumbList(miettes),
  ];

  return (
    <>
      <JsonLd json={graphe(noeuds)} />

      <SiteHeader
        lang={lang}
        variante="lean"
        liens={[{ libelle: labels.themes, href: `/${lang}/blog` }]}
        ctaId={ctaId}
        source={source}
      />

      <PageBody largeur="content">
        <Breadcrumb miettes={miettes} />

        <header style={{ display: "grid", gap: "var(--space-5)", paddingBlock: "var(--space-7)" }}>
          <h1
            style={{
              margin: 0,
              maxWidth: "var(--container-text)",
              fontFamily: "var(--type-display-primary)",
              fontSize: "var(--type-display-hero)",
              fontWeight: 600,
              letterSpacing: "var(--type-tracking-display)",
              lineHeight: "var(--type-leading-display)",
              color: "var(--color-ink-default)",
              textWrap: "balance",
            }}
          >
            {data.titre}
          </h1>
          <div
            className="theme-intro"
            style={{
              maxWidth: "var(--container-text)",
              fontFamily: "var(--type-mono-primary)",
              fontSize: "var(--type-size-md)",
              lineHeight: "var(--type-leading-body)",
              color: "var(--color-ink-muted)",
            }}
            dangerouslySetInnerHTML={{ __html: data.intro }}
          />
        </header>

        {data.preuveRefs && data.preuveRefs.length > 0 && (
          <ProofBlock preuveRefs={data.preuveRefs} index="01" label="Ce qui tourne" />
        )}

        {data.systemes.length > 0 && (
          <section style={{ paddingBlock: "var(--space-section-sm)" }}>
            <SectionHeader index="02" label={labels.systemes} title="Les systèmes livrés sur ce sujet." />
            <div style={{ marginTop: "var(--space-6)" }}>
              <ContenusLies titre={labels.systemes} items={data.systemes} />
            </div>
          </section>
        )}

        <section style={{ paddingBlock: "var(--space-section-sm)" }}>
          <SectionHeader index="03" label={labels.articles} title="Ce qu'on a écrit dessus." />
          <div style={{ marginTop: "var(--space-6)" }}>
            <ContenusLies titre={labels.articles} items={data.articles} />
          </div>
        </section>

        {data.videos && data.videos.length > 0 && (
          <ContenusLies titre={labels.videos} items={data.videos} />
        )}

        <CtaBlock
          ctaId={ctaId}
          lang={lang}
          source={source}
          titre={`Votre cas sur « ${data.motCle} » ?`}
          lede="Quinze minutes pour savoir si c'est faisable chez vous, et à quelle condition."
        />

        <ContenusLies titre={labels.voisins} items={data.themesVoisins} />
      </PageBody>

      <SiteFooter lang={lang} />
    </>
  );
}
