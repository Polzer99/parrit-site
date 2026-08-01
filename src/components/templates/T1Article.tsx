/**
 * T1 · ARTICLE — TEMPLATE-GRAMMAR.md §3.
 *
 * Le fixe : shell lean · fil d'Ariane · h1 unique · TL;DR · sommaire · corps en
 * --container-text · FAQ · sources · UNE ressource · UN CTA · articles liés ·
 * graphe BlogPosting + BreadcrumbList + FAQPage.
 *
 * Le configurable : tout le reste, fourni par la donnée.
 *
 * Ce que ce template CORRIGE par rapport à `blog/[slug]/page.tsx` :
 *   — les rayons 4px et 6px en dur (:307-365) → --radius-none ;
 *   — le pied de page qui pointait /rendez-vous SANS ?source= ;
 *   — le libellé de CTA en dur → cta_ref ;
 *   — l'en-tête `.blog-nav` maison → SiteHeader variant="lean".
 */

import { Label, SectionHeader, TextLink } from "@/components/ds/primitives";
import { MediaPlate } from "@/components/ds/level0";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { Breadcrumb, type Miette } from "@/components/shell/Breadcrumb";
import {
  CtaBlock,
  ContenusLies,
  JsonLd,
  MetaLine,
  PageBody,
  ProofBlock,
  type LienContenu,
} from "./parts";
import {
  assertSinglePrincipal,
  type CtaId,
} from "@/lib/registry";
import {
  breadcrumbList,
  faqPage,
  graphe,
  organizationRef,
  personId,
  SITE_URL,
} from "@/lib/seo/jsonld";

export type ArticleData = {
  slug: string;
  titre: string;
  description: string;
  /** HTML déjà assaini, avec ancres posées sur les h2. */
  corps: string;
  sommaire: { id: string; texte: string }[];
  datePubliee: string;
  dateModifiee?: string;
  auteur: { nom: string; slug: string; role: string };
  categorie: string;
  tempsLecture: string;
  tldr?: string;
  faq?: { q: string; a: string }[];
  sources?: { label: string; url: string }[];
  plaque?: { src: string; alt: string; legende?: string };
  preuveRefs?: readonly string[];
  articlesLies: LienContenu[];
  themeHref?: string;
  themeNom?: string;
};

export function T1Article({
  data,
  lang,
  ctaId,
  ressourceHref,
  ressourceTitre,
  labels,
}: {
  data: ArticleData;
  lang: string;
  ctaId: CtaId;
  /** UNE seule ressource par article. Contrat du modèle de contenu. */
  ressourceHref?: string;
  ressourceTitre?: string;
  labels: {
    blog: string;
    tldr: string;
    sommaire: string;
    faq: string;
    sources: string;
    lireEnsuite: string;
    voirProfil: string;
  };
}) {
  assertSinglePrincipal([ctaId]);

  const url = `${SITE_URL}/${lang}/blog/${data.slug}`;
  const source = `blog:${data.slug}`;

  const miettes: Miette[] = [
    { nom: "Parrit.ai", href: `/${lang}` },
    { nom: labels.blog, href: `/${lang}/blog` },
    ...(data.themeHref && data.themeNom
      ? [{ nom: data.themeNom, href: data.themeHref }]
      : []),
    { nom: data.titre, href: `/${lang}/blog/${data.slug}` },
  ];

  const motsCount = data.corps
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  const noeuds: object[] = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: data.titre,
      description: data.description,
      datePublished: data.datePubliee,
      dateModified: data.dateModifiee ?? data.datePubliee,
      wordCount: motsCount,
      articleSection: data.categorie,
      inLanguage: lang,
      url,
      mainEntityOfPage: url,
      author: {
        "@type": "Person",
        "@id": personId(lang, data.auteur.slug),
        name: data.auteur.nom,
      },
      publisher: organizationRef(),
    },
    breadcrumbList(miettes),
  ];
  if (data.faq?.length) noeuds.push(faqPage(url, data.faq));

  return (
    <>
      <JsonLd json={graphe(noeuds)} />

      <SiteHeader
        lang={lang}
        variante="lean"
        liens={[{ libelle: labels.blog, href: `/${lang}/blog` }]}
        ctaId={ctaId}
        source={source}
      />

      <PageBody largeur="text">
        <Breadcrumb miettes={miettes} />

        <article>
          <header style={{ display: "grid", gap: "var(--space-5)", paddingBlock: "var(--space-7)" }}>
            <MetaLine items={[data.categorie, data.tempsLecture]} />
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
              {data.titre}
            </h1>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--type-mono-primary)",
                fontSize: "var(--type-size-sm)",
                lineHeight: "var(--type-leading-mono)",
                color: "var(--color-ink-muted)",
              }}
            >
              <span style={{ color: "var(--color-ink-default)", fontWeight: 600 }}>
                {data.auteur.nom}
              </span>
              {" · "}
              {data.auteur.role}
              {" · "}
              <TextLink href={`/${lang}/auteur/${data.auteur.slug}`}>
                {labels.voirProfil}
              </TextLink>
              {" · "}
              <time dateTime={data.datePubliee}>{data.datePubliee}</time>
            </p>
          </header>

          {data.plaque && (
            <MediaPlate
              src={data.plaque.src}
              alt={data.plaque.alt}
              caption={data.plaque.legende}
            />
          )}

          {data.tldr && (
            <aside
              style={{
                marginTop: "var(--space-6)",
                padding: "var(--space-5)",
                borderLeft: "var(--border-strong) solid var(--color-signal-critical)",
                background: "var(--color-paper-alt)",
                borderRadius: "var(--radius-none)",
                boxShadow: "var(--shadow-none)",
                display: "grid",
                gap: "var(--space-3)",
              }}
            >
              <Label tone="signal">{labels.tldr}</Label>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--type-mono-primary)",
                  fontSize: "var(--type-size-sm)",
                  lineHeight: "var(--type-leading-body)",
                  color: "var(--color-ink-default)",
                }}
              >
                {data.tldr}
              </p>
            </aside>
          )}

          {data.sommaire.length >= 3 && (
            <nav
              aria-label={labels.sommaire}
              style={{
                marginTop: "var(--space-6)",
                padding: "var(--space-5)",
                border: "var(--border-hairline) solid var(--color-line-hairline)",
                borderRadius: "var(--radius-none)",
                boxShadow: "var(--shadow-none)",
                display: "grid",
                gap: "var(--space-3)",
              }}
            >
              <Label>{labels.sommaire}</Label>
              <ol style={{ margin: 0, paddingLeft: "var(--space-5)" }}>
                {data.sommaire.map((e) => (
                  <li
                    key={e.id}
                    style={{
                      margin: "var(--space-1) 0",
                      fontFamily: "var(--type-mono-primary)",
                      fontSize: "var(--type-size-sm)",
                      lineHeight: "var(--type-leading-mono)",
                    }}
                  >
                    <a href={`#${e.id}`} style={{ color: "var(--color-ink-muted)" }}>
                      {e.texte}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div
            className="blog-article-body"
            style={{ marginTop: "var(--space-7)" }}
            dangerouslySetInnerHTML={{ __html: data.corps }}
          />

          {data.preuveRefs && data.preuveRefs.length > 0 && (
            <ProofBlock preuveRefs={data.preuveRefs} index="02" label="Preuve" />
          )}

          {data.faq && data.faq.length > 0 && (
            <section style={{ paddingBlock: "var(--space-section-sm)" }}>
              <SectionHeader index="03" label="Questions" title={labels.faq} />
              <dl style={{ marginTop: "var(--space-6)", display: "grid", gap: "var(--space-5)" }}>
                {data.faq.map((f) => (
                  <div
                    key={f.q}
                    style={{
                      paddingTop: "var(--space-4)",
                      borderTop: "var(--border-hairline) solid var(--color-line-hairline)",
                      display: "grid",
                      gap: "var(--space-2)",
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
                      {f.q}
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
                      {f.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {data.sources && data.sources.length > 0 && (
            <section style={{ paddingBlock: "var(--space-section-sm)" }}>
              <Label>{labels.sources}</Label>
              <ul style={{ margin: "var(--space-4) 0 0", paddingLeft: "var(--space-5)" }}>
                {data.sources.map((s) => (
                  <li key={s.url} style={{ margin: "var(--space-1) 0" }}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--type-mono-primary)",
                        fontSize: "var(--type-size-sm)",
                        color: "var(--color-ink-muted)",
                      }}
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {ressourceHref && ressourceTitre && (
            <section style={{ paddingBlock: "var(--space-section-sm)" }}>
              <div
                style={{
                  padding: "var(--space-6)",
                  border: "var(--border-hairline) solid var(--color-line-hairline)",
                  borderRadius: "var(--radius-none)",
                  boxShadow: "var(--shadow-none)",
                  display: "grid",
                  gap: "var(--space-4)",
                }}
              >
                <Label tone="signal">Ressource</Label>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--type-display-primary)",
                    fontSize: "var(--type-display-card)",
                    fontWeight: 600,
                    lineHeight: "var(--type-leading-display)",
                    color: "var(--color-ink-default)",
                  }}
                >
                  {ressourceTitre}
                </p>
                <TextLink href={ressourceHref}>Ouvrir la ressource</TextLink>
              </div>
            </section>
          )}
        </article>

        <CtaBlock
          ctaId={ctaId}
          lang={lang}
          source={source}
          titre="On en parle quinze minutes ?"
          lede="Vous décrivez votre cas, on vous dit ce qui est faisable et ce qui ne l'est pas."
        />

        <ContenusLies titre={labels.lireEnsuite} items={data.articlesLies} />
      </PageBody>

      <SiteFooter lang={lang} />
    </>
  );
}
