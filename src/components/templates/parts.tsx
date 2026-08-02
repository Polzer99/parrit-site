/**
 * PIÈCES PARTAGÉES DES TEMPLATES.
 *
 * Rien ici ne duplique `ds/primitives.tsx` ni `ds/level0.tsx` : ce sont des
 * assemblages, pas des composants. Aucune valeur visuelle en dur, uniquement
 * des tokens.
 */

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import {
  Divider,
  IndexMark,
  Label,
  Metric,
  SectionHeader,
  TextLink,
} from "@/components/ds/primitives";
import {
  ProofRailLevel0,
  CTASectionLevel0,
  HermesStatus,
  MediaPlate,
} from "@/components/ds/level0";
import type { ProofItem } from "@/components/ds/level0";
// Import par le BARIL, pas par les fichiers : c'est lui qui valide les
// registres au chargement, donc pendant `next build`. Les huit templates
// importent parts.tsx, donc toute page construite avec un template est couverte.
import {
  ctaHref,
  ctaProps,
  getCta,
  getOffre,
  getPreuves,
  libelleOrganisation,
  logoAutorise,
  metriqueAffichable,
  offreHref,
  preuvesPubliables,
  type CtaId,
  type OffreRef,
  type Preuve,
} from "@/lib/registry";

/* ------------------------------------------------------------------ Page */

/** Corps de page. Trois largeurs, pas quatre. */
export function PageBody({
  largeur = "content",
  children,
}: {
  largeur?: "text" | "content" | "wide";
  children: ReactNode;
}) {
  const max =
    largeur === "text"
      ? "var(--container-text)"
      : largeur === "wide"
        ? "var(--container-wide)"
        : "var(--container-content)";

  return (
    <main
      className="parrit-grain"
      style={{
        maxWidth: max,
        marginInline: "auto",
        paddingInline: "var(--gutter-mobile)",
      }}
    >
      {children}
    </main>
  );
}

/* -------------------------------------------------------------- JSON-LD */

/**
 * Balise brute, pas `next/script` : le JSON-LD doit être présent dans le HTML
 * rendu côté serveur, sinon les robots ne le voient pas. C'est déjà la méthode
 * retenue par `blog/[slug]/page.tsx:246`.
 */
export function JsonLd({ json }: { json: string }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}

/* ---------------------------------------------------------------- Méta */

/** Ligne de métadonnées mono : catégorie · date · durée. */
export function MetaLine({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
      {items.filter(Boolean).map((item, i) => (
        <span key={item} style={{ display: "inline-flex", gap: "var(--space-3)" }}>
          {i > 0 && (
            <span aria-hidden="true" style={{ color: "var(--color-ink-faint)" }}>
              ·
            </span>
          )}
          <Label>{item}</Label>
        </span>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- Preuves */

/**
 * Bloc de preuve. La règle dure : un chiffre ne s'affiche QUE s'il porte sa
 * période et sa méthode de mesure. Sinon on rend la preuve sans son chiffre —
 * on ne rend pas un trou, et on n'invente pas la méthode.
 */
export function ProofBlock({
  preuveRefs,
  index = "01",
  label = "Ce qui tourne",
  titre = "Ce qu'on a mesuré, et comment.",
}: {
  preuveRefs: readonly string[];
  index?: string;
  label?: string;
  titre?: string;
}) {
  const preuves = preuvesPubliables(getPreuves(preuveRefs));
  if (preuves.length === 0) return null;

  return (
    <section style={{ paddingBlock: "var(--space-section-md)" }}>
      <SectionHeader index={index} label={label} title={titre} />
      <div style={{ marginTop: "var(--space-7)", display: "grid", gap: "var(--space-6)" }}>
        {preuves.map((p, i) => (
          <PreuveLigne key={p.id} preuve={p} index={String(i + 1).padStart(2, "0")} />
        ))}
      </div>
    </section>
  );
}

function PreuveLigne({ preuve, index }: { preuve: Preuve; index: string }) {
  const organisation = libelleOrganisation(preuve);
  const logo = logoAutorise(preuve);

  return (
    <article
      className="ds-row-indexed"
      style={{
        paddingTop: "var(--space-5)",
        borderTop: "var(--border-hairline) solid var(--color-line-hairline)",
      }}
    >
      <IndexMark value={index} />
      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--type-display-primary)",
            fontSize: "var(--type-display-card)",
            fontWeight: 600,
            letterSpacing: "var(--type-tracking-display)",
            lineHeight: "var(--type-leading-display)",
            color: "var(--color-ink-default)",
            textWrap: "balance",
          }}
        >
          {preuve.titre}
        </h3>
        <p
          style={{
            margin: 0,
            maxWidth: "var(--container-text)",
            fontFamily: "var(--type-mono-primary)",
            fontSize: "var(--type-size-sm)",
            lineHeight: "var(--type-leading-body)",
            color: "var(--color-ink-muted)",
          }}
        >
          {preuve.description}
        </p>

        {/* Chiffre — seulement avec sa période ET sa méthode. */}
        {metriqueAffichable(preuve) && preuve.mesure && (
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Metric value={preuve.mesure.metrique} caption={preuve.mesure.periode} signal />
            <p
              style={{
                margin: 0,
                fontFamily: "var(--type-mono-primary)",
                fontSize: "var(--type-size-xs)",
                lineHeight: "var(--type-leading-mono)",
                color: "var(--color-ink-faint)",
              }}
            >
              Méthode · {preuve.mesure.methodeMesure}
            </p>
          </div>
        )}

        {/* Trace — les états portent un libellé ET un symbole, jamais la
            couleur seule. */}
        {preuve.trace && (
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            {preuve.trace.etapes.map((e, i) => (
              <div
                key={`${e.time}-${i}`}
                className="ds-row-trace"
                style={{
                  paddingBlock: "var(--space-3)",
                  borderTop: "var(--border-hairline) solid var(--color-line-hairline)",
                }}
              >
                <IndexMark value={e.time} />
                <span
                  style={{
                    fontFamily: "var(--type-mono-primary)",
                    fontSize: "var(--type-size-sm)",
                    lineHeight: "var(--type-leading-mono)",
                    color: "var(--color-ink-default)",
                  }}
                >
                  {e.action}
                </span>
                <HermesStatus state={e.state} />
              </div>
            ))}
            <Label>Périmètre · {preuve.trace.perimetre}</Label>
          </div>
        )}

        {/* Média — couche expressive, disparaît au Structural Integrity Test. */}
        {preuve.media && (
          <MediaPlate
            src={preuve.media.src}
            alt={preuve.media.alt}
            caption={preuve.media.legende}
          />
        )}

        {/* Témoignage — l'anonymat est un cas valide, pas un manque. */}
        {preuve.temoignage && (
          <figure style={{ margin: 0, display: "grid", gap: "var(--space-3)" }}>
            <blockquote
              style={{
                margin: 0,
                fontFamily: "var(--type-mono-primary)",
                fontSize: "var(--type-size-md)",
                lineHeight: "var(--type-leading-body)",
                color: "var(--color-ink-default)",
              }}
            >
              {preuve.temoignage.texte}
            </blockquote>
            <figcaption>
              <Label>
                {[preuve.temoignage.auteur, preuve.temoignage.role, preuve.temoignage.date]
                  .filter(Boolean)
                  .join(" · ")}
              </Label>
            </figcaption>
          </figure>
        )}

        {/* Organisation — le nom réel si l'autorisation existe, le descriptif
            anonymisé sinon, et rien du tout si ni l'un ni l'autre. Le template
            n'exige jamais un nom pour se rendre. */}
        {organisation && (
          <div
            style={{ display: "flex", gap: "var(--space-4)", alignItems: "center", flexWrap: "wrap" }}
          >
            {logo && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={logo}
                alt={organisation}
                data-layer="expressive"
                style={{ height: "1.5rem", width: "auto", display: "block" }}
              />
            )}
            <Label>{organisation}</Label>
          </div>
        )}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------ Rail input/output */

export function ProofRail({
  items,
  index,
  label,
  titre,
  lede,
}: {
  items: ProofItem[];
  index?: string;
  label?: string;
  titre?: string;
  lede?: string;
}) {
  if (items.length === 0) return null;
  return (
    <ProofRailLevel0
      items={items}
      index={index}
      label={label}
      title={titre}
      lede={lede}
    />
  );
}

/* ------------------------------------------------------------------ CTA */

/**
 * Bloc d'action. Le libellé et la destination viennent du registre, jamais de
 * la page. `source` est obligatoire : c'est lui qui rend l'attribution possible.
 */
export function CtaBlock({
  ctaId,
  lang,
  source,
  titre,
  lede,
  finePrint,
}: {
  ctaId: CtaId;
  lang: string;
  source: string;
  titre: string;
  lede: string;
  finePrint?: string;
}) {
  const cta = getCta(ctaId);
  return (
    <div {...ctaProps(cta.id, source)}>
      <CTASectionLevel0
        title={titre}
        lede={lede}
        primaryCta={{ label: cta.libelle, href: ctaHref(cta.id, lang, source) }}
        finePrint={finePrint}
      />
    </div>
  );
}

/** Lien d'action en ligne, pour les fins de section. */
export function CtaInline({
  ctaId,
  lang,
  source,
}: {
  ctaId: CtaId;
  lang: string;
  source: string;
}) {
  const cta = getCta(ctaId);
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "var(--control-height-md)",
    padding: "0 var(--space-6)",
    background:
      cta.priorite === "principale"
        ? "var(--color-action-primary)"
        : "var(--color-action-secondary)",
    color: "var(--color-ink-inverse)",
    fontFamily: "var(--type-mono-primary)",
    fontSize: "var(--type-size-sm)",
    fontWeight: 600,
    letterSpacing: "var(--type-tracking-label)",
    textTransform: "uppercase",
    textDecoration: "none",
    borderRadius: "var(--radius-none)",
    boxShadow: "var(--shadow-none)",
  };

  return (
    <a href={ctaHref(cta.id, lang, source)} {...ctaProps(cta.id, source)} style={style}>
      {cta.libelle}
    </a>
  );
}

/* ------------------------------------------------------------ Offre liée */

/**
 * Lien vers l'offre rattachée, s'il y en a une ET si elle existe encore dans le
 * registre de ciblage.
 *
 * Le template ne connaît ni le nom, ni le nombre, ni la hiérarchie des offres :
 * il passe une référence opaque et rend ce qu'on lui répond. Une référence qui
 * ne résout plus ne casse rien — elle ne rend rien. C'est ce qui permettra au
 * document de positionnement de remplacer les deux taxonomies actuelles sans
 * toucher une seule ligne de composant.
 */
export function OffreLink({
  offreRef,
  lang,
}: {
  offreRef?: OffreRef;
  lang: string;
}) {
  if (!offreRef) return null;
  const offre = getOffre(offreRef);
  const href = offreHref(offreRef, lang);
  if (!offre || !href) return null;

  return (
    <div style={{ display: "grid", gap: "var(--space-3)" }}>
      <Label>Offre rattachée</Label>
      <TextLink href={href}>{offre.nom}</TextLink>
    </div>
  );
}

/* ---------------------------------------------------- Ce que ça ne fait pas */

/**
 * Le bloc qui distingue une démonstration d'une promesse. Obligatoire sur T4,
 * recommandé partout où une machine est montrée.
 */
export function LimitesBlock({ limites }: { limites: string[] }) {
  if (limites.length === 0) return null;
  return (
    <section style={{ paddingBlock: "var(--space-section-sm)" }}>
      <SectionHeader
        index="05"
        label="Frontière"
        title="Ce que la machine ne fait pas."
      />
      <ul
        style={{
          marginTop: "var(--space-6)",
          padding: 0,
          listStyle: "none",
          display: "grid",
          gap: 0,
        }}
      >
        {limites.map((l) => (
          <li
            key={l}
            style={{
              padding: "var(--space-4) 0",
              borderTop: "var(--border-hairline) solid var(--color-line-hairline)",
              fontFamily: "var(--type-mono-primary)",
              fontSize: "var(--type-size-sm)",
              lineHeight: "var(--type-leading-body)",
              color: "var(--color-ink-default)",
            }}
          >
            {l}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------- Liste d'index */

export type EntreeIndex = {
  cle: string;
  /** La destination FINALE. Jamais une fiche qui obligerait à recliquer. */
  href: string;
  titre: string;
  /** La promesse, en une phrase. */
  resume: string;
  /** Catégorie, date, durée : ce qui aide à choisir, pas à décorer. */
  meta: string[];
  /** L'action unique de la carte : « Lire l'article », « Accéder à la ressource ». */
  action: string;
  /** Vrai quand la destination sort du routage `[lang]` (page servie à la racine). */
  externeAuLocale?: boolean;
};

/**
 * LISTE D'INDEX — la grammaire d'un index, blog comme ressources.
 *
 * Arbitrage Paul du 02/08/2026 : **une seule action principale par carte**, et
 * cette action mène à la valeur finale. La carte entière est le lien ; il n'y a
 * pas de second bouton, pas de « voir la fiche », pas de destination qui
 * demanderait de recliquer pour obtenir ce qui est promis.
 *
 * Aucune valeur visuelle n'est écrite ici : tokens et primitives uniquement.
 */
export function ListeIndex({ entrees }: { entrees: EntreeIndex[] }) {
  if (entrees.length === 0) return null;
  return (
    <div
      style={{
        display: "grid",
        gap: "var(--space-5)",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 22rem), 1fr))",
      }}
    >
      {entrees.map((e) => {
        const contenu = (
          <>
            {e.meta.length > 0 && <MetaLine items={e.meta} />}
            <span
              style={{
                fontFamily: "var(--type-display-primary)",
                fontSize: "var(--type-size-xl)",
                fontWeight: 600,
                letterSpacing: "var(--type-tracking-display)",
                lineHeight: "var(--type-leading-headline)",
                color: "var(--color-ink-default)",
                textWrap: "balance",
              }}
            >
              {e.titre}
            </span>
            <span
              style={{
                fontFamily: "var(--type-ui-primary)",
                fontSize: "var(--type-size-base)",
                lineHeight: "var(--type-leading-body)",
                color: "var(--color-ink-muted)",
              }}
            >
              {e.resume}
            </span>
            <Label tone="signal">{e.action}</Label>
          </>
        );

        const style = {
          display: "grid",
          gap: "var(--space-4)",
          alignContent: "start",
          padding: "var(--space-6)",
          border: "var(--border-hairline) solid var(--color-line-hairline)",
          borderRadius: "var(--radius-none)",
          boxShadow: "var(--shadow-none)",
          background: "var(--color-paper-default)",
          textDecoration: "none",
        } as const;

        /* Les expériences servies hors `[lang]` (fichiers statiques, outils) ne
           passent pas par le routeur applicatif : un lien nu est le bon outil. */
        return e.externeAuLocale ? (
          <a key={e.cle} href={e.href} style={style}>
            {contenu}
          </a>
        ) : (
          <Link key={e.cle} href={e.href} prefetch={false} style={style}>
            {contenu}
          </Link>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------ Contenus liés */

export type LienContenu = {
  slug: string;
  href: string;
  titre: string;
  meta: string;
  categorie?: string;
};

export function ContenusLies({
  titre,
  items,
}: {
  titre: string;
  items: LienContenu[];
}) {
  if (items.length === 0) return null;
  return (
    <section style={{ paddingBlock: "var(--space-section-sm)" }}>
      <Divider />
      <div style={{ marginTop: "var(--space-6)", display: "grid", gap: "var(--space-5)" }}>
        <Label>{titre}</Label>
        <div
          style={{
            display: "grid",
            gap: "var(--space-5)",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))",
          }}
        >
          {items.map((item) => (
            <a
              key={item.slug}
              href={item.href}
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
              {item.categorie && <Label tone="signal">{item.categorie}</Label>}
              <span
                style={{
                  fontFamily: "var(--type-display-primary)",
                  fontSize: "var(--type-size-lg)",
                  fontWeight: 600,
                  lineHeight: "var(--type-leading-headline)",
                  color: "var(--color-ink-default)",
                  textWrap: "balance",
                }}
              >
                {item.titre}
              </span>
              <Label>{item.meta}</Label>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
