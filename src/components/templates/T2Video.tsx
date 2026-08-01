/**
 * T2 · VIDÉO — TEMPLATE-GRAMMAR.md §3.
 *
 * Règle centrale : la page doit se lire SANS la vidéo. Le lecteur porte
 * `data-layer="expressive"` et disparaît au Structural Integrity Test ; le
 * résumé structuré et le transcript, eux, restent. Une page vidéo qui devient
 * vide sans son lecteur est non conforme.
 *
 * Aucune chrome de fenêtre, aucune ombre portée, aucun player habillé.
 */

import { IndexMark, Label, SectionHeader } from "@/components/ds/primitives";
import { HermesTraceLevel0, type TraceStep } from "@/components/ds/level0";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { Breadcrumb, type Miette } from "@/components/shell/Breadcrumb";
import {
  CtaBlock,
  ContenusLies,
  JsonLd,
  MetaLine,
  PageBody,
  type LienContenu,
} from "./parts";
import { assertSinglePrincipal, type CtaId } from "@/lib/registry/cta";
import {
  breadcrumbList,
  dureeISO,
  graphe,
  organizationRef,
  SITE_URL,
} from "@/lib/seo/jsonld";

export type VideoData = {
  slug: string;
  titre: string;
  description: string;
  /** URL du fichier ou de l'embed. La politique d'hébergement n'est pas tranchée. */
  videoUrl: string;
  poster: string;
  dureeSecondes: number;
  datePubliee: string;
  auteur: { nom: string; slug: string };
  /** Ce que la vidéo montre, en 3 à 5 points. Lisible SANS la vidéo. */
  resumeStructure: string[];
  transcript: { t: string; texte: string }[];
  /** Si la vidéo montre un système en marche. */
  trace?: { steps: TraceStep[]; scope: string };
  videosLiees: LienContenu[];
};

function formatDuree(secondes: number): string {
  const m = Math.floor(secondes / 60);
  const s = secondes % 60;
  return `${m} min ${String(s).padStart(2, "0")}`;
}

export function T2Video({
  data,
  lang,
  ctaId,
  labels,
}: {
  data: VideoData;
  lang: string;
  ctaId: CtaId;
  labels: { videos: string; resume: string; transcript: string; aVoir: string };
}) {
  assertSinglePrincipal([ctaId]);

  const url = `${SITE_URL}/${lang}/videos/${data.slug}`;
  const source = `video:${data.slug}`;

  const miettes: Miette[] = [
    { nom: "Parrit.ai", href: `/${lang}` },
    { nom: labels.videos, href: `/${lang}/videos` },
    { nom: data.titre, href: `/${lang}/videos/${data.slug}` },
  ];

  const noeuds: object[] = [
    {
      "@type": "VideoObject",
      "@id": `${url}#video`,
      name: data.titre,
      description: data.description,
      thumbnailUrl: [`${SITE_URL}${data.poster}`],
      uploadDate: data.datePubliee,
      duration: dureeISO(data.dureeSecondes),
      contentUrl: data.videoUrl,
      inLanguage: lang,
      transcript: data.transcript.map((t) => t.texte).join(" "),
      publisher: organizationRef(),
    },
    breadcrumbList(miettes),
  ];

  return (
    <>
      <JsonLd json={graphe(noeuds)} />

      <SiteHeader
        lang={lang}
        variante="lean"
        liens={[{ libelle: labels.videos, href: `/${lang}/videos` }]}
        ctaId={ctaId}
        source={source}
      />

      <PageBody largeur="content">
        <Breadcrumb miettes={miettes} />

        <header style={{ display: "grid", gap: "var(--space-5)", paddingBlock: "var(--space-7)" }}>
          <MetaLine items={[formatDuree(data.dureeSecondes), data.datePubliee, data.auteur.nom]} />
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
        </header>

        {/* Couche expressive. Filet 1px, angles nets, aucune ombre, aucune
            barre de titre. Elle disparaît au Structural Integrity Test. */}
        <figure
          data-layer="expressive"
          data-collapse="true"
          style={{
            margin: 0,
            border: "var(--border-hairline) solid var(--color-line-hairline)",
            borderRadius: "var(--radius-none)",
            boxShadow: "var(--shadow-none)",
          }}
        >
          <video
            controls
            preload="none"
            poster={data.poster}
            style={{ display: "block", width: "100%", height: "auto", aspectRatio: "16 / 9" }}
          >
            <source src={data.videoUrl} />
          </video>
        </figure>

        <section style={{ paddingBlock: "var(--space-section-md)" }}>
          <SectionHeader index="01" label={labels.resume} title="Ce que la vidéo montre." />
          <ol
            style={{
              marginTop: "var(--space-6)",
              padding: 0,
              listStyle: "none",
              display: "grid",
              gap: 0,
              maxWidth: "var(--container-text)",
            }}
          >
            {data.resumeStructure.map((point, i) => (
              <li
                key={point}
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
                  {point}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {data.trace && (
          <HermesTraceLevel0 steps={data.trace.steps} scope={data.trace.scope} />
        )}

        <section style={{ paddingBlock: "var(--space-section-md)" }}>
          <details>
            <summary style={{ cursor: "pointer", listStyle: "none" }}>
              <Label tone="ink">{labels.transcript}</Label>
            </summary>
            <div
              style={{
                marginTop: "var(--space-5)",
                display: "grid",
                gap: 0,
                maxWidth: "var(--container-text)",
              }}
            >
              {data.transcript.map((t) => (
                <p
                  key={t.t}
                  className="ds-row-indexed"
                  style={{
                    margin: 0,
                    paddingBlock: "var(--space-3)",
                    borderTop: "var(--border-hairline) solid var(--color-line-hairline)",
                  }}
                >
                  <IndexMark value={t.t} />
                  <span
                    style={{
                      fontFamily: "var(--type-mono-primary)",
                      fontSize: "var(--type-size-sm)",
                      lineHeight: "var(--type-leading-body)",
                      color: "var(--color-ink-muted)",
                    }}
                  >
                    {t.texte}
                  </span>
                </p>
              ))}
            </div>
          </details>
        </section>

        <CtaBlock
          ctaId={ctaId}
          lang={lang}
          source={source}
          titre="Le même système, chez vous ?"
          lede="On regarde ensemble ce que ça donnerait sur vos données, et où il faudrait s'arrêter."
        />

        <ContenusLies titre={labels.aVoir} items={data.videosLiees} />
      </PageBody>

      <SiteFooter lang={lang} />
    </>
  );
}
