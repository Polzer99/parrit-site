import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/shell/SiteHeader";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { Breadcrumb, type Miette } from "@/components/shell/Breadcrumb";
import { CtaBlock, JsonLd, MetaLine, PageBody } from "@/components/templates/parts";
import { Label, SectionHeader, TextLink } from "@/components/ds/primitives";
import { breadcrumbList, graphe, organizationRef, SITE_URL } from "@/lib/seo/jsonld";
import { getMention, getMentionSlugs, logoMediaAffichable } from "@/lib/presse";
import { hasLocale, locales } from "../../dictionaries";
import { LIBELLES } from "../../pilote-libelles";

/**
 * PAGE DE MENTION PRESSE.
 *
 * Elle renvoie vers la source, elle ne la recopie pas : republier l'article d'un
 * tiers n'est ni légitime ni utile. La page porte ce qui nous appartient — le
 * contexte, l'angle, et le lien.
 *
 * Aucune mention n'existe aujourd'hui : la route compile et se teste, elle ne
 * génère aucune page. La première entrée `published` la remplit sans qu'une
 * ligne d'ici change.
 */
export function generateStaticParams() {
  const slugs = getMentionSlugs();
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const m = getMention(slug);
  if (!hasLocale(lang) || !m) return {};

  return {
    metadataBase: new URL(SITE_URL),
    title: `${m.titre} | Parrit.ai`,
    description: m.angle ?? `${m.media}, ${m.date}`,
    alternates: { canonical: `${SITE_URL}/${lang}/presse/${m.slug}` },
  };
}

export default async function MentionPressePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const m = getMention(slug);
  if (!m) notFound();

  const l = LIBELLES[lang] ?? LIBELLES.fr;
  const logo = logoMediaAffichable(m);
  const url = `${SITE_URL}/${lang}/presse/${m.slug}`;

  const miettes: Miette[] = [
    { nom: "Parrit.ai", href: `/${lang}` },
    { nom: l.presse.nav, href: `/${lang}/presse` },
    { nom: m.titre, href: `/${lang}/presse/${m.slug}` },
  ];

  const noeuds: object[] = [
    {
      "@type": "Article",
      "@id": `${url}#mention`,
      headline: m.titre,
      datePublished: m.date,
      inLanguage: m.langue,
      url,
      // La source fait autorité : on la déclare, on ne se substitue pas à elle.
      isBasedOn: m.urlSource,
      publisher: { "@type": "Organization", name: m.media },
      about: organizationRef(),
    },
    breadcrumbList(miettes),
  ];

  return (
    <>
      <JsonLd json={graphe(noeuds)} />
      <SiteHeader
        lang={lang}
        variante="lean"
        liens={[{ libelle: l.presse.nav, href: `/${lang}/presse` }]}
        ctaId="rdv.paul"
        source={`presse:${m.slug}`}
      />

      <PageBody largeur="text">
        <Breadcrumb miettes={miettes} />

        <article style={{ display: "grid", gap: "var(--space-6)", paddingBlock: "var(--space-7)" }}>
          <MetaLine items={[m.media, m.date, m.type]} />

          <h1
            style={{
              margin: 0,
              fontFamily: "var(--type-display-primary)",
              fontSize: "var(--type-display-hero)",
              fontWeight: 600,
              letterSpacing: "var(--type-tracking-display)",
              lineHeight: "var(--type-leading-display)",
              color: "var(--color-ink-default)",
              textWrap: "balance",
            }}
          >
            {m.titre}
          </h1>

          {logo && (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo}
                alt={m.media}
                data-layer="expressive"
                style={{ height: "1.75rem", width: "auto", display: "block" }}
              />
            </div>
          )}

          {m.angle && (
            <p
              style={{
                margin: 0,
                fontFamily: "var(--type-mono-primary)",
                fontSize: "var(--type-size-md)",
                lineHeight: "var(--type-leading-body)",
                color: "var(--color-ink-muted)",
              }}
            >
              {m.angle}
            </p>
          )}

          <section style={{ display: "grid", gap: "var(--space-3)" }}>
            <SectionHeader index="01" label={l.presse.mention} title={l.presse.source} />
            <div style={{ marginTop: "var(--space-4)" }}>
              <TextLink href={m.urlSource}>{m.media}</TextLink>
            </div>
            <Label>La source fait autorité. Cette page ne la reproduit pas.</Label>
          </section>
        </article>

        <CtaBlock
          ctaId="rdv.paul"
          lang={lang}
          source={`presse:${m.slug}`}
          titre="Un sujet à creuser ensemble ?"
          lede="Quinze minutes pour décrire votre cas et savoir ce qui est faisable."
        />
      </PageBody>

      <SiteFooter lang={lang} />
    </>
  );
}
