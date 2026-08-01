/**
 * T4 · SYSTÈME / CAS D'USAGE — TEMPLATE-GRAMMAR.md §3.
 *
 * Le template qui incarne le positionnement : frontière, pas puissance.
 *
 * Deux invariants CODÉS, pas seulement documentés :
 *   — la trace doit contenir au moins un `blocked` ou un `human-review`,
 *     sinon la page se lit comme une maquette (règle du 01/08) ;
 *   — `limites` ne peut pas être vide : « ce que la machine ne fait pas »
 *     est ce qui distingue une démonstration d'une promesse.
 */

import { Badge, Label, SectionHeader } from "@/components/ds/primitives";
import {
  HeroLevel0,
  HermesTraceLevel0,
  MediaPlate,
  TestimonialShiftLevel0,
  type ProofItem,
  type ShiftItem,
  type TraceStep,
} from "@/components/ds/level0";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { Breadcrumb, type Miette } from "@/components/shell/Breadcrumb";
import {
  CtaBlock,
  ContenusLies,
  JsonLd,
  LimitesBlock,
  PageBody,
  ProofBlock,
  ProofRail,
  type LienContenu,
} from "./parts";
import { assertSinglePrincipal, type CtaId } from "@/lib/registry/cta";
import { breadcrumbList, graphe, organizationRef, SITE_URL } from "@/lib/seo/jsonld";
import {
  MATURITE_LIBELLE,
  type MaturiteSysteme,
  type OffreRef,
  type PersonaRef,
  type ProblemeRef,
} from "@/lib/registry/ciblage";

export type SystemeData = {
  slug: string;
  /** Le titre dit ce que le système FAIT, pas comment il s'appelle. */
  titre: string;
  lede: string;
  fonction: string;
  perimetre: string[];
  rail: ProofItem[];
  trace: { steps: TraceStep[]; scope: string };
  /** Obligatoire. Une liste vide fait échouer la construction de la page. */
  limites: string[];
  deplacements?: ShiftItem[];
  capture?: { src: string; alt: string; legende?: string };
  maturite: MaturiteSysteme;
  /* Ciblage — des RÉFÉRENCES opaques. Le template n'a aucune connaissance du
     nom, du nombre ni de la hiérarchie des offres : la taxonomie est de la
     donnée, et le document de positionnement la remplacera sans toucher ici. */
  offreRef?: OffreRef;
  problemeRef?: ProblemeRef;
  personaRef?: PersonaRef;
  statutVerifieManuellement: boolean;
  preuveRefs?: readonly string[];
  casLies: LienContenu[];
};

function traceCredible(steps: TraceStep[]): boolean {
  return steps.some((s) => s.state === "blocked" || s.state === "human-review");
}

export function T4Systeme({
  data,
  lang,
  ctaId,
  labels,
}: {
  data: SystemeData;
  lang: string;
  ctaId: CtaId;
  labels: { systemes: string; casLies: string };
}) {
  assertSinglePrincipal([ctaId]);

  if (data.limites.length === 0) {
    throw new Error(
      `Système « ${data.slug} » sans limites déclarées. « Ce que la machine ne fait ` +
        `pas » est obligatoire : c'est ce qui distingue une démonstration d'une promesse.`,
    );
  }

  if (!traceCredible(data.trace.steps)) {
    throw new Error(
      `Système « ${data.slug} » : trace sans échec ni reprise humaine. Une trace ` +
        `100 % verte se lit comme une maquette (04_COMPONENTS.md, HermesTraceLevel0).`,
    );
  }

  const url = `${SITE_URL}/${lang}/systemes/${data.slug}`;
  const source = `systeme-${data.slug}`;

  const miettes: Miette[] = [
    { nom: "Parrit.ai", href: `/${lang}` },
    { nom: labels.systemes, href: `/${lang}/systemes` },
    { nom: data.titre, href: `/${lang}/systemes/${data.slug}` },
  ];

  const noeuds: object[] = [
    {
      "@type": "Service",
      "@id": `${url}#service`,
      name: data.titre,
      description: data.lede,
      serviceType: data.fonction,
      areaServed: "FR",
      url,
      provider: organizationRef(),
    },
    breadcrumbList(miettes),
  ];

  return (
    <>
      <JsonLd json={graphe(noeuds)} />

      <SiteHeader
        lang={lang}
        variante="full"
        liens={[{ libelle: labels.systemes, href: `/${lang}/systemes` }]}
        ctaId={ctaId}
        source={source}
      />

      <PageBody largeur="content">
        <Breadcrumb miettes={miettes} />

        <HeroLevel0
          eyebrow={data.fonction}
          titleLead={data.titre}
          lede={data.lede}
          conditions={data.perimetre}
        />

        <ProofRail
          items={data.rail}
          index="01"
          label="Ce qui tourne"
          titre="Un input réel, un output défini, un propriétaire humain."
        />

        <HermesTraceLevel0 steps={data.trace.steps} scope={data.trace.scope} />

        {data.deplacements && data.deplacements.length > 0 && (
          <TestimonialShiftLevel0 items={data.deplacements} />
        )}

        {data.capture && (
          <section style={{ paddingBlock: "var(--space-section-sm)" }}>
            <MediaPlate
              src={data.capture.src}
              alt={data.capture.alt}
              caption={data.capture.legende}
            />
          </section>
        )}

        <LimitesBlock limites={data.limites} />

        {data.preuveRefs && data.preuveRefs.length > 0 && (
          <ProofBlock preuveRefs={data.preuveRefs} index="06" label="Mesure" />
        )}

        <section style={{ paddingBlock: "var(--space-section-sm)" }}>
          <SectionHeader index="07" label="État" title="Où en est ce système." />
          <div
            style={{
              marginTop: "var(--space-6)",
              display: "flex",
              gap: "var(--space-4)",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Badge>{MATURITE_LIBELLE[data.maturite]}</Badge>
            {/* Le statut hérité du registre est une heuristique lexicale, fausse
                sur plusieurs lignes. Tant qu'un humain ne l'a pas vérifié, on le
                dit. */}
            {!data.statutVerifieManuellement && (
              <Label tone="signal">Statut non vérifié manuellement</Label>
            )}
          </div>
        </section>

        <CtaBlock
          ctaId={ctaId}
          lang={lang}
          source={source}
          titre="Ce système, adapté à votre cas."
          lede="On regarde vos données réelles, on définit où le système s'arrête, et qui reprend la main."
        />

        <ContenusLies titre={labels.casLies} items={data.casLies} />
      </PageBody>

      <SiteFooter lang={lang} />
    </>
  );
}
