import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/shell/SiteHeader";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { Breadcrumb, type Miette } from "@/components/shell/Breadcrumb";
import { JsonLd, PageBody } from "@/components/templates/parts";
import { EtatVide } from "@/components/EtatVide";
import { IndexMark, Label, TextLink } from "@/components/ds/primitives";
import { breadcrumbList, graphe, SITE_URL } from "@/lib/seo/jsonld";
import { etatCollection, publies, robotsCollection } from "@/lib/collections";
import { getMentions, logoMediaAffichable } from "@/lib/presse";
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

  return {
    metadataBase: new URL(SITE_URL),
    title: `${l.presse.titreIndex} | Parrit.ai`,
    description: l.presse.description,
    robots: robotsCollection(etatCollection(getMentions())),
    alternates: { canonical: `${SITE_URL}/${lang}/presse` },
  };
}

export default async function PresseIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const l = LIBELLES[lang] ?? LIBELLES.fr;

  const toutes = getMentions();
  const etat = etatCollection(toutes);
  const visibles = publies(toutes);

  const miettes: Miette[] = [
    { nom: "Parrit.ai", href: `/${lang}` },
    { nom: l.presse.nav, href: `/${lang}/presse` },
  ];

  const noeuds: object[] = [
    {
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/${lang}/presse#collection`,
      name: l.presse.titreIndex,
      description: l.presse.description,
      inLanguage: lang,
      url: `${SITE_URL}/${lang}/presse`,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: visibles.length,
        itemListElement: visibles.map((m, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: m.titre,
          item: `${SITE_URL}/${lang}/presse/${m.slug}`,
        })),
      },
    },
    breadcrumbList(miettes),
  ];

  return (
    <>
      <JsonLd json={graphe(noeuds)} />
      <SiteHeader lang={lang} variante="lean" ctaId="rdv.paul" source="presse" />

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
            {l.presse.titreIndex}
          </h1>
        </header>

        {etat.eligible ? (
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {visibles.map((m, i) => {
              /* Le logo n'apparaît QUE porté par une mention complète.
                 La vérification vit dans la donnée, pas dans la page. */
              const logo = logoMediaAffichable(m);
              return (
                <li
                  key={m.slug}
                  className="ds-row-indexed"
                  style={{
                    paddingBlock: "var(--space-5)",
                    borderTop: "var(--border-hairline) solid var(--color-line-hairline)",
                  }}
                >
                  <IndexMark value={String(i + 1).padStart(2, "0")} />
                  <div style={{ display: "grid", gap: "var(--space-3)" }}>
                    <TextLink href={`/${lang}/presse/${m.slug}`}>{m.titre}</TextLink>
                    <div
                      style={{ display: "flex", gap: "var(--space-4)", alignItems: "center", flexWrap: "wrap" }}
                    >
                      {logo && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={logo}
                          alt={m.media}
                          data-layer="expressive"
                          style={{ height: "1.25rem", width: "auto", display: "block" }}
                        />
                      )}
                      <Label>
                        {m.media} · {m.date}
                      </Label>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <EtatVide
            label={l.presse.nav}
            titre={l.presse.videTitre}
            explication={l.presse.videExplication}
            sortie={<TextLink href={`/${lang}/blog`}>{l.presse.videSortie}</TextLink>}
          />
        )}
      </PageBody>

      <SiteFooter lang={lang} />
    </>
  );
}
