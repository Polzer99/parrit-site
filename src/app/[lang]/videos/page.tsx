import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/shell/SiteHeader";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { Breadcrumb, type Miette } from "@/components/shell/Breadcrumb";
import { ContenusLies, JsonLd, PageBody } from "@/components/templates/parts";
import { EtatVide } from "@/components/EtatVide";
import { TextLink } from "@/components/ds/primitives";
import { breadcrumbList, graphe, SITE_URL } from "@/lib/seo/jsonld";
import { etatCollection, publies, robotsCollection } from "@/lib/collections";
import { getVideos } from "@/lib/videos";
import { hasLocale, locales } from "../dictionaries";
import { LIBELLES } from "../pilote-libelles";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const l = LIBELLES[lang] ?? LIBELLES.fr;
  const etat = etatCollection(getVideos());

  return {
    metadataBase: new URL(SITE_URL),
    title: `${l.videos.titreIndex} | Parrit.ai`,
    description: l.videos.description,
    // L'éligibilité vient de la DONNÉE : zéro élément publié = noindex.
    // Publier une première vidéo suffit à rendre la page indexable, sans
    // toucher à ce fichier.
    robots: robotsCollection(etat),
    alternates: { canonical: `${SITE_URL}/${lang}/videos` },
  };
}

export default async function VideosIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const l = LIBELLES[lang] ?? LIBELLES.fr;

  const toutes = getVideos();
  const etat = etatCollection(toutes);
  const visibles = publies(toutes);

  const miettes: Miette[] = [
    { nom: "Parrit.ai", href: `/${lang}` },
    { nom: l.videos.nav, href: `/${lang}/videos` },
  ];

  const noeuds: object[] = [
    {
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/${lang}/videos#collection`,
      name: l.videos.titreIndex,
      description: l.videos.description,
      inLanguage: lang,
      url: `${SITE_URL}/${lang}/videos`,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: visibles.length,
        itemListElement: visibles.map((v, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: v.titre,
          item: `${SITE_URL}/${lang}/videos/${v.slug}`,
        })),
      },
    },
    breadcrumbList(miettes),
  ];

  return (
    <>
      <JsonLd json={graphe(noeuds)} />
      <SiteHeader lang={lang} variante="lean" ctaId="rdv.paul" source="videos" />

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
            {l.videos.titreIndex}
          </h1>
        </header>

        {etat.eligible ? (
          <ContenusLies
            titre={l.videos.nav}
            items={visibles.map((v) => ({
              slug: v.slug,
              href: `/${lang}/videos/${v.slug}`,
              titre: v.titre,
              meta: v.media.publicationDate,
            }))}
          />
        ) : (
          <EtatVide
            label={l.videos.nav}
            titre={l.videos.videTitre}
            explication={l.videos.videExplication}
            sortie={<TextLink href={`/${lang}/blog`}>{l.videos.videSortie}</TextLink>}
          />
        )}
      </PageBody>

      <SiteFooter lang={lang} />
    </>
  );
}
