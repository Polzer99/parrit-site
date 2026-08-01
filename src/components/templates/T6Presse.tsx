/**
 * T6 · PRESSE — TEMPLATE-GRAMMAR.md §3.
 *
 * Le template le mieux doté en assets (32 SVG de marque, 13 portraits, 4 photos
 * d'équipe) et le plus vide en contenu : aucune mention presse n'existe encore.
 *
 * Deux règles codées :
 *   — aucun CTA commercial ici. Ce n'est pas un funnel ;
 *   — un fait chiffré ne s'affiche qu'avec sa source. Pas de source, pas de fait.
 */

import { Divider, Label, SectionHeader } from "@/components/ds/primitives";
import { HeroLevel0, MediaPlate } from "@/components/ds/level0";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { Breadcrumb, type Miette } from "@/components/shell/Breadcrumb";
import { CtaInline, JsonLd, PageBody } from "./parts";
import { breadcrumbList, graphe, SITE_URL } from "@/lib/seo/jsonld";

export type FaitSociete = { libelle: string; valeur: string; source: string };

export type VisuelPresse = {
  fichier: string;
  nom: string;
  usage: string;
};

export type MentionPresse = {
  titre: string;
  media: string;
  url: string;
  date: string;
  langue: string;
};

export type Citation = {
  texte: string;
  auteur: string;
  role: string;
  date: string;
};

export type PresseData = {
  phrase: string;
  faits: FaitSociete[];
  visuels: VisuelPresse[];
  portrait?: { src: string; alt: string; legende?: string };
  citations: Citation[];
  mentions: MentionPresse[];
  contact: { nom: string; role: string; email: string };
};

export function T6Presse({
  data,
  lang,
  labels,
}: {
  data: PresseData;
  lang: string;
  labels: { presse: string; faits: string; kit: string; citations: string; mentions: string };
}) {
  const url = `${SITE_URL}/${lang}/presse`;

  const miettes: Miette[] = [
    { nom: "Parrit.ai", href: `/${lang}` },
    { nom: labels.presse, href: `/${lang}/presse` },
  ];

  const noeuds: object[] = [
    {
      "@type": "AboutPage",
      "@id": `${url}#about`,
      name: `${labels.presse} · Parrit.ai`,
      inLanguage: lang,
      url,
      mainEntity: {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Parrit.ai",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/parrit-lockup-red.svg` },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Rueil-Malmaison",
          addressCountry: "FR",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "press",
          name: data.contact.nom,
          email: data.contact.email,
        },
      },
    },
    breadcrumbList(miettes),
  ];

  return (
    <>
      <JsonLd json={graphe(noeuds)} />

      <SiteHeader lang={lang} variante="lean" />

      <PageBody largeur="content">
        <Breadcrumb miettes={miettes} />

        <HeroLevel0 eyebrow={labels.presse} titleLead="Parrit.ai" lede={data.phrase} />

        <section style={{ paddingBlock: "var(--space-section-md)" }}>
          <SectionHeader index="01" label={labels.faits} title="Les faits." />
          <dl style={{ marginTop: "var(--space-6)", display: "grid", gap: 0 }}>
            {data.faits
              /* Pas de source, pas de fait. */
              .filter((f) => Boolean(f.source))
              .map((f) => (
                <div
                  key={f.libelle}
                  className="ds-row-trace"
                  style={{
                    paddingBlock: "var(--space-4)",
                    borderTop: "var(--border-hairline) solid var(--color-line-hairline)",
                  }}
                >
                  <dt style={{ margin: 0 }}>
                    <Label>{f.libelle}</Label>
                  </dt>
                  <dd
                    style={{
                      margin: 0,
                      fontFamily: "var(--type-mono-primary)",
                      fontSize: "var(--type-size-sm)",
                      lineHeight: "var(--type-leading-mono)",
                      color: "var(--color-ink-default)",
                    }}
                  >
                    {f.valeur}
                  </dd>
                  <Label>{f.source}</Label>
                </div>
              ))}
          </dl>
        </section>

        <section id="kit" style={{ paddingBlock: "var(--space-section-md)" }}>
          <SectionHeader
            index="02"
            label={labels.kit}
            title="Les visuels, et comment les utiliser."
          />
          <div
            style={{
              marginTop: "var(--space-6)",
              display: "grid",
              gap: "var(--space-5)",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))",
            }}
          >
            {data.visuels.map((v) => (
              <a
                key={v.fichier}
                href={v.fichier}
                download
                style={{
                  display: "grid",
                  gap: "var(--space-3)",
                  padding: "var(--space-5)",
                  border: "var(--border-hairline) solid var(--color-line-hairline)",
                  borderRadius: "var(--radius-none)",
                  boxShadow: "var(--shadow-none)",
                  background: "var(--color-paper-default)",
                  textDecoration: "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.fichier}
                  alt={v.nom}
                  data-layer="expressive"
                  style={{ height: "2rem", width: "auto", display: "block" }}
                />
                <Label tone="ink">{v.nom}</Label>
                <Label>{v.usage}</Label>
              </a>
            ))}
          </div>

          {data.portrait && (
            <div style={{ marginTop: "var(--space-7)", maxWidth: "var(--container-text)" }}>
              <MediaPlate
                src={data.portrait.src}
                alt={data.portrait.alt}
                caption={data.portrait.legende}
              />
            </div>
          )}
        </section>

        <section style={{ paddingBlock: "var(--space-section-md)" }}>
          <SectionHeader index="03" label={labels.citations} title="Citations attribuables." />
          <div style={{ marginTop: "var(--space-6)", display: "grid", gap: "var(--space-6)" }}>
            {data.citations.map((c) => (
              <figure
                key={c.texte}
                style={{
                  margin: 0,
                  paddingTop: "var(--space-5)",
                  borderTop: "var(--border-hairline) solid var(--color-line-hairline)",
                  display: "grid",
                  gap: "var(--space-3)",
                  maxWidth: "var(--container-text)",
                }}
              >
                <blockquote
                  style={{
                    margin: 0,
                    fontFamily: "var(--type-display-primary)",
                    fontSize: "var(--type-display-card)",
                    fontWeight: 600,
                    lineHeight: "var(--type-leading-display)",
                    color: "var(--color-ink-default)",
                    textWrap: "balance",
                  }}
                >
                  {c.texte}
                </blockquote>
                <figcaption>
                  <Label>
                    {c.auteur} · {c.role} · {c.date}
                  </Label>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {data.mentions.length > 0 && (
          <section style={{ paddingBlock: "var(--space-section-md)" }}>
            <SectionHeader index="04" label={labels.mentions} title="Parutions." />
            <ul style={{ marginTop: "var(--space-6)", padding: 0, listStyle: "none" }}>
              {data.mentions.map((m) => (
                <li
                  key={m.url}
                  className="ds-row-trace"
                  style={{
                    paddingBlock: "var(--space-4)",
                    borderTop: "var(--border-hairline) solid var(--color-line-hairline)",
                  }}
                >
                  <Label>{m.date}</Label>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "var(--type-mono-primary)",
                      fontSize: "var(--type-size-sm)",
                      color: "var(--color-ink-default)",
                    }}
                  >
                    {m.titre}
                  </a>
                  <Label>{m.media}</Label>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section style={{ paddingBlock: "var(--space-section-md)" }}>
          <Divider />
          <div style={{ marginTop: "var(--space-6)", display: "grid", gap: "var(--space-4)" }}>
            <Label>Contact presse</Label>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--type-mono-primary)",
                fontSize: "var(--type-size-md)",
                color: "var(--color-ink-default)",
              }}
            >
              {data.contact.nom} · {data.contact.role}
            </p>
            {/* Un mail nommé, pas un formulaire, et AUCUN CTA commercial. */}
            <div>
              <CtaInline ctaId="presse.contact" lang={lang} source="presse" />
            </div>
          </div>
        </section>
      </PageBody>

      <SiteFooter lang={lang} variante="minimal" />
    </>
  );
}
