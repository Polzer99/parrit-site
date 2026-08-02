import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/shell/SiteHeader";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { Breadcrumb, type Miette } from "@/components/shell/Breadcrumb";
import { EtatVide } from "@/components/EtatVide";
import { JsonLd, ListeIndex, PageBody, type EntreeIndex } from "@/components/templates";
import { TextLink } from "@/components/ds/primitives";
import { breadcrumbList, graphe, SITE_URL } from "@/lib/seo/jsonld";
import { avecSource, getRessourcesPubliees, urlExperience, type Ressource } from "@/lib/registry";
import { hasLocale, locales } from "../dictionaries";
import { LIBELLES } from "../pilote-libelles";

/**
 * INDEX DES RESSOURCES.
 *
 * ARBITRAGE PAUL DU 02/08/2026 — chaque carte mène DIRECTEMENT à l'expérience
 * complète. Plus de tableau recopié dans la page, plus de fiche intermédiaire :
 * la destination vient de `urlExperience()`, c'est-à-dire de la donnée.
 *
 * Une carte, une action. Ajouter une ressource au registre suffit à la faire
 * paraître ici, avec la bonne destination et la bonne attribution.
 */

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** Les ressources d'une langue de page. L'anglais a les siennes ; le reste suit le français. */
function ressourcesPour(lang: string): Ressource[] {
  return getRessourcesPubliees(lang === "en" ? "en" : "fr");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const l = LIBELLES[lang] ?? LIBELLES.fr;

  return {
    metadataBase: new URL(SITE_URL),
    title: `${l.ressources.titreIndex} | Parrit.ai`,
    description: l.ressources.description,
    alternates: {
      canonical: `${SITE_URL}/${lang}/ressources`,
      languages: {
        fr: `${SITE_URL}/fr/ressources`,
        en: `${SITE_URL}/en/ressources`,
        "pt-BR": `${SITE_URL}/pt-BR/ressources`,
        "x-default": `${SITE_URL}/fr/ressources`,
      },
    },
    openGraph: {
      title: l.ressources.titreIndex,
      description: l.ressources.description,
      url: `${SITE_URL}/${lang}/ressources`,
      siteName: "Parrit.ai",
      type: "website",
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "Parrit.ai" }],
    },
  };
}

export default async function RessourcesIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const l = LIBELLES[lang] ?? LIBELLES.fr;

  const ressources = ressourcesPour(lang);

  const entrees: EntreeIndex[] = ressources.map((r) => {
    return {
      cle: r.id,
      /* L'attribution voyage avec le clic : la destination sait d'où vient la
         visite, sans que la carte ait besoin d'une seconde étape. */
      href: avecSource(urlExperience(r, lang), "ressources"),
      titre: r.titre,
      resume: r.promesse,
      meta: [r.type.replace(/_/g, " ")],
      action: r.type === "diagnostic" ? l.index.faireDiagnostic : l.index.accederRessource,
      // Les expériences vivent hors du routage `[lang]`, à la racine du site.
      externeAuLocale: r.experience.rendu === "route_dediee",
    };
  });

  const miettes: Miette[] = [
    { nom: "Parrit.ai", href: `/${lang}` },
    { nom: l.ressources.nav, href: `/${lang}/ressources` },
  ];

  const noeuds: object[] = [
    {
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/${lang}/ressources#collection`,
      name: l.ressources.titreIndex,
      description: l.ressources.description,
      inLanguage: lang,
      url: `${SITE_URL}/${lang}/ressources`,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: ressources.length,
        itemListElement: ressources.map((r, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: r.titre,
          /* L'URL déclarée est la canonique : celle qui rend l'expérience. */
          item: `${SITE_URL}${urlExperience(r, lang)}`,
        })),
      },
    },
    breadcrumbList(miettes),
  ];

  return (
    <>
      <JsonLd json={graphe(noeuds)} />
      <SiteHeader lang={lang} variante="lean" ctaId="rdv.paul" source="ressources" />

      <PageBody largeur="content">
        <Breadcrumb miettes={miettes} />

        <header style={{ paddingBlock: "var(--space-7)" }}>
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
            {l.ressources.titreIndex}
          </h1>
          <p
            style={{
              margin: "var(--space-5) 0 0",
              maxWidth: "var(--container-text)",
              fontFamily: "var(--type-ui-primary)",
              fontSize: "var(--type-size-lg)",
              lineHeight: "var(--type-leading-body)",
              color: "var(--color-ink-muted)",
            }}
          >
            {l.ressources.description}
          </p>
        </header>

        {entrees.length > 0 ? (
          <section style={{ paddingBlock: "var(--space-section-sm)" }}>
            <ListeIndex entrees={entrees} />
          </section>
        ) : (
          <EtatVide
            label={l.ressources.nav}
            titre={l.ressources.titreIndex}
            explication={l.ressources.description}
            sortie={<TextLink href={`/${lang}/blog`}>{l.blog}</TextLink>}
          />
        )}
      </PageBody>

      <SiteFooter lang={lang} />
    </>
  );
}
