/**
 * T3 · RESSOURCE / LEAD MAGNET — TEMPLATE-GRAMMAR.md §3.
 *
 * Le template le plus rentable du site, et le plus cassé aujourd'hui : le mail
 * de confirmation du workflow n8n est générique et ne livre AUCUNE ressource.
 *
 * D'où la règle codée ici : si `livraisonVerifiee` est faux, la page NE PROMET
 * PAS un envoi par mail. Elle donne le lien directement dans l'état de succès.
 * Un template ne peut pas réparer n8n, mais il peut refuser de mentir.
 */

import { IndexMark, Label, SectionHeader, TextLink } from "@/components/ds/primitives";
import { HeroLevel0, MediaPlate } from "@/components/ds/level0";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { Breadcrumb, type Miette } from "@/components/shell/Breadcrumb";
import {
  CtaInline,
  ContenusLies,
  JsonLd,
  PageBody,
  ProofBlock,
  type LienContenu,
} from "./parts";
import {
  Ressource,
  assertSinglePrincipal,
} from "@/lib/registry";
import { breadcrumbList, graphe, organizationRef, SITE_URL } from "@/lib/seo/jsonld";

const TYPE_SCHEMA: Record<string, string> = {
  guide: "HowTo",
  architecture: "HowTo",
  calculateur: "WebApplication",
  diagnostic: "WebApplication",
  audit_rapide: "WebApplication",
};

export function T3Ressource({
  ressource,
  lang,
  preuveRefs = [],
  apercu,
  ressourcesLiees = [],
  labels,
}: {
  ressource: Ressource;
  lang: string;
  preuveRefs?: readonly string[];
  apercu?: { src: string; alt: string; legende?: string };
  ressourcesLiees?: LienContenu[];
  labels: { ressources: string; obtenez: string; autres: string };
}) {
  assertSinglePrincipal([ressource.ctaPrincipal]);

  const url = `${SITE_URL}/${lang}/ressources/${ressource.slug}`;
  const source = `ressource-${ressource.slug}`;

  const miettes: Miette[] = [
    { nom: "Parrit.ai", href: `/${lang}` },
    { nom: labels.ressources, href: `/${lang}/ressources` },
    { nom: ressource.titre, href: `/${lang}/ressources/${ressource.slug}` },
  ];

  const noeuds: object[] = [
    {
      "@type": TYPE_SCHEMA[ressource.type] ?? "CreativeWork",
      "@id": `${url}#ressource`,
      name: ressource.titre,
      description: ressource.promesse,
      inLanguage: ressource.langue,
      url,
      isAccessibleForFree: true,
      publisher: organizationRef(),
    },
    breadcrumbList(miettes),
  ];

  /* Le point de vérité : ce que la personne obtient, et QUAND. */
  const conditions = [
    ressource.type,
    ressource.langue === "en" ? "en anglais" : "en français",
    ressource.livraisonVerifiee ? "accès immédiat" : "lien donné à l'écran",
  ];

  return (
    <>
      <JsonLd json={graphe(noeuds)} />

      <SiteHeader
        lang={lang}
        variante="lean"
        liens={[{ libelle: labels.ressources, href: `/${lang}/ressources` }]}
      />

      <PageBody largeur="content">
        <Breadcrumb miettes={miettes} />

        <HeroLevel0
          eyebrow={labels.ressources}
          titleLead={ressource.titre}
          lede={ressource.promesse}
          conditions={conditions}
        />

        <section style={{ paddingBlock: "var(--space-section-md)" }}>
          <SectionHeader index="01" label={labels.obtenez} title="Ce que vous obtenez." />
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
            {ressource.contenu.map((item, i) => (
              <li
                key={item}
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
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {apercu && (
          <section style={{ paddingBlock: "var(--space-section-sm)" }}>
            <MediaPlate src={apercu.src} alt={apercu.alt} caption={apercu.legende} />
          </section>
        )}

        {preuveRefs.length > 0 && (
          <ProofBlock preuveRefs={preuveRefs} index="02" label="Preuve" />
        )}

        <section
          id="capture"
          style={{
            marginBlock: "var(--space-section-md)",
            padding: "var(--space-8) var(--space-6)",
            background: "var(--color-paper-alt)",
            borderRadius: "var(--radius-none)",
            boxShadow: "var(--shadow-none)",
            display: "grid",
            gap: "var(--space-5)",
            maxWidth: "var(--container-text)",
          }}
        >
          <h2
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
            {ressource.livraisonVerifiee
              ? "Ouvrez la ressource."
              : "Laissez votre adresse, le lien s'affiche ici."}
          </h2>

          {/* On ne promet un envoi que si l'envoi existe. */}
          <p
            style={{
              margin: 0,
              fontFamily: "var(--type-mono-primary)",
              fontSize: "var(--type-size-sm)",
              lineHeight: "var(--type-leading-body)",
              color: "var(--color-ink-muted)",
            }}
          >
            {ressource.livraisonVerifiee
              ? "Accès direct, sans formulaire préalable."
              : "Le lien apparaît à l'écran dès la validation. Rien n'est envoyé par courriel."}
          </p>

          <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
            {ressource.livrable && (
              <TextLink href={ressource.livrable}>Ouvrir « {ressource.titre} »</TextLink>
            )}
          </div>

          <div>
            <CtaInline ctaId={ressource.ctaPrincipal} lang={lang} source={source} />
          </div>

          <Label>Gabarit de formulaire · {ressource.formGabarit}</Label>
        </section>

        <ContenusLies titre={labels.autres} items={ressourcesLiees} />
      </PageBody>

      <SiteFooter lang={lang} />
    </>
  );
}
