"use client";

/**
 * PAGE SPECIMEN — /design-system
 *
 * Démonstration vivante du design system Parrit.ai et support du
 * Structural Integrity Test.
 *
 * Le bouton « Masquer les images » pose data-hide-media="true" sur <html>.
 * Toute la couche expressive disparaît. Si la page reste lisible, structurée
 * et reconnaissable comme Parrit, le système tient.
 *
 * Page interne, noindex. Elle ne fait partie d'aucun parcours commercial.
 */

import { useState, type CSSProperties } from "react";
import {
  Badge,
  Button,
  CTASectionLevel0,
  Divider,
  HeroLevel0,
  HermesStatus,
  HermesTraceLevel0,
  IndexMark,
  Label,
  MediaPlate,
  Metric,
  ProofRailLevel0,
  SectionHeader,
  TestimonialShiftLevel0,
  type HermesState,
} from "@/components/ds/level0";

/* ------------------------------------------------------------------ data */

const PALETTE: { token: string; value: string; role: string }[] = [
  { token: "--color-paper-default", value: "#FFFDFA", role: "papier, fond de tout" },
  { token: "--color-paper-alt", value: "#F0F0F0", role: "fond de section" },
  { token: "--color-ink-default", value: "#0C0C0D", role: "titres, texte fort" },
  { token: "--color-ink-muted", value: "#6E7079", role: "corps atténué" },
  { token: "--color-ink-faint", value: "#8987A1", role: "labels d'index" },
  { token: "--color-signal-critical", value: "#D1132F", role: "signal, action, causalité" },
  { token: "--color-line-hairline", value: "#D0D8D7", role: "filets 1px" },
  { token: "--color-accent-warm", value: "#C67C60", role: "accent rare, liseré" },
];

const FRENCH_TEST = [
  "ÉQUIPES",
  "EXÉCUTION",
  "RÉDUCTION",
  "MÉTIERS",
  "DÉCRIVEZ",
  "AMÉLIORATION",
  "DÉPLOIEMENT",
];

const HERMES_ALL: HermesState[] = [
  "success",
  "failure",
  "waiting",
  "blocked",
  "human-review",
  "improvement-proposed",
  "improvement-accepted",
  "improvement-rejected",
];

const FORBIDDEN = [
  "Dégradé bleu-violet de startup tech",
  "Robot humanoïde, avatar, mascotte",
  "Cerveau lumineux, circuits génériques",
  "Glassmorphism, verre, blur, glow",
  "Faux dashboard, faux terminal décoratif",
  "Photo de stock corporate",
  "Cartes arrondies identiques empilées",
  "Rouge posé en aplat décoratif",
  "Ombre portée, quelle qu'elle soit",
  "Blanc pur #FFFFFF en fond ou en encre",
];

/* --------------------------------------------------------------- helpers */

function Section({
  id,
  index,
  label,
  title,
  lede,
  children,
}: {
  id: string;
  index: string;
  label: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      style={{
        paddingBlock: "var(--space-section-md)",
        borderTop: "var(--border-hairline) solid var(--color-line-hairline)",
      }}
    >
      <SectionHeader index={index} label={label} title={title} lede={lede} />
      <div style={{ marginTop: "var(--space-7)" }}>{children}</div>
    </section>
  );
}

const monoText: CSSProperties = {
  fontFamily: "var(--type-mono-primary)",
  fontSize: "var(--type-size-sm)",
  lineHeight: "var(--type-leading-body)",
  color: "var(--color-ink-muted)",
  margin: 0,
};

/* ------------------------------------------------------------------ page */

export default function DesignSystemSpecimen() {
  const [hidden, setHidden] = useState(false);

  function toggle() {
    const next = !hidden;
    setHidden(next);
    document.documentElement.setAttribute("data-hide-media", next ? "true" : "false");
  }

  return (
    <main
      className="parrit-grain"
      style={{
        maxWidth: "var(--container-content)",
        margin: "0 auto",
        padding: "0 var(--gutter-mobile) var(--space-section-lg)",
      }}
    >
      {/* ---------------------------------------------- barre de contrôle */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: "var(--z-sticky)" as CSSProperties["zIndex"],
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-4)",
          flexWrap: "wrap",
          paddingBlock: "var(--space-4)",
          background: "var(--color-paper-default)",
          borderBottom: "var(--border-hairline) solid var(--color-line-hairline)",
        }}
      >
        <Label tone="ink">Parrit design system · specimen · v1.0.0</Label>
        <button
          type="button"
          onClick={toggle}
          aria-pressed={hidden}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-3)",
            minHeight: "var(--control-height-sm)",
            padding: "0 var(--space-5)",
            background: hidden ? "var(--color-signal-critical)" : "var(--color-ink-default)",
            color: "var(--color-ink-inverse)",
            fontFamily: "var(--type-mono-primary)",
            fontSize: "var(--type-size-xs)",
            letterSpacing: "var(--type-tracking-label)",
            textTransform: "uppercase",
            border: "none",
            borderRadius: "var(--radius-none)",
            boxShadow: "var(--shadow-none)",
            cursor: "pointer",
          }}
        >
          {hidden ? "Réafficher les images" : "Masquer les images"}
        </button>
      </div>

      {hidden && (
        <p
          role="status"
          style={{
            marginTop: "var(--space-5)",
            padding: "var(--space-4)",
            background: "var(--color-signal-tint)",
            color: "var(--color-signal-critical)",
            fontFamily: "var(--type-mono-primary)",
            fontSize: "var(--type-size-sm)",
            lineHeight: "var(--type-leading-body)",
          }}
        >
          Structural Integrity Test actif. La couche expressive est masquée. La page doit rester
          hiérarchisée, lisible et reconnaissable comme Parrit. Si ce n&apos;est pas le cas, la
          composition est non conforme.
        </p>
      )}

      {/* ------------------------------------------------------ NIVEAU 0 */}

      <HeroLevel0
        eyebrow="Specimen interne"
        titleLead="Le système tient"
        titleSignal="sans une seule image"
        titleTail="ou il ne tient pas."
        ledeStrong="Couche structurelle d&apos;abord."
        lede="La typographie, la grille, les filets, l&apos;index et le rouge causal portent l&apos;identité. La photographie enrichit ; elle ne sauve jamais une structure faible."
        primaryCta={{ label: "Voir les tokens", href: "#tokens" }}
        secondaryCta={{ label: "Voir la QA", href: "#qa" }}
        conditions={["Niveau 0 · sans média", "Arpona + Geist Mono", "Rayon 0 · zéro ombre"]}
      />

      {/* -------------------------------------------------------- TOKENS */}

      <Section
        id="tokens"
        index="01"
        label="Fondations"
        title="Couleurs"
        lede="Valeurs vérifiées dans Figma le 31/07/2026. Il n&apos;existe pas de blanc pur dans le système."
      >
        <div
          style={{
            display: "grid",
            gap: "var(--space-5)",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))",
          }}
        >
          {PALETTE.map((c) => (
            <div key={c.token} style={{ display: "grid", gap: "var(--space-3)" }}>
              <div
                style={{
                  height: "4rem",
                  background: c.value,
                  border: "var(--border-hairline) solid var(--color-line-hairline)",
                  borderRadius: "var(--radius-none)",
                }}
              />
              <code style={{ ...monoText, color: "var(--color-ink-default)" }}>{c.token}</code>
              <code style={monoText}>{c.value}</code>
              <Label>{c.role}</Label>
            </div>
          ))}
        </div>

        {/* Démonstration de la règle ADR-012 : le rouge dans un titre. */}
        <div style={{ marginTop: "var(--space-8)", display: "grid", gap: "var(--space-6)" }}>
          <div>
            <Label tone="ink">Le rouge dans un titre · règle</Label>
            <p style={{ ...monoText, marginTop: "var(--space-3)" }}>
              Un seul segment rouge par titre, et ce segment porte une cause, un problème, une
              transformation, un résultat ou le sujet. Le titre doit garder tout son sens lu
              entièrement en noir.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "var(--space-6)",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 20rem), 1fr))",
            }}
          >
            <div
              style={{
                padding: "var(--space-5)",
                border: "var(--border-hairline) solid var(--color-line-hairline)",
              }}
            >
              <Label tone="ink">Conforme</Label>
              <p
                style={{
                  margin: "var(--space-4) 0 0",
                  fontFamily: "var(--type-display-primary)",
                  fontSize: "var(--type-display-card)",
                  fontWeight: 600,
                  letterSpacing: "var(--type-tracking-display)",
                  lineHeight: "var(--type-leading-display)",
                }}
              >
                Trois heures par jour passaient dans{" "}
                <span style={{ color: "var(--color-signal-critical)" }}>le tri de la boîte</span>
              </p>
              <p style={{ ...monoText, marginTop: "var(--space-4)", fontSize: "var(--type-size-xs)" }}>
                Le rouge porte la cause. Le titre reste entier en noir.
              </p>
            </div>

            <div
              style={{
                padding: "var(--space-5)",
                border: "var(--border-hairline) solid var(--color-line-hairline)",
              }}
            >
              <Label tone="signal">Rejeté</Label>
              <p
                style={{
                  margin: "var(--space-4) 0 0",
                  fontFamily: "var(--type-display-primary)",
                  fontSize: "var(--type-display-card)",
                  fontWeight: 600,
                  letterSpacing: "var(--type-tracking-display)",
                  lineHeight: "var(--type-leading-display)",
                }}
              >
                Une approche{" "}
                <span style={{ color: "var(--color-signal-critical)" }}>vraiment</span> différente
                de <span style={{ color: "var(--color-signal-critical)" }}>l&apos;IA</span>
              </p>
              <p style={{ ...monoText, marginTop: "var(--space-4)", fontSize: "var(--type-size-xs)" }}>
                Deux segments, dont un adverbe. Aucun ne porte de causalité. Le rouge décore.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------- TYPOGRAPHIE */}

      <Section
        id="typo"
        index="02"
        label="Fondations"
        title="Typographie"
        lede="Arpona porte le titrage. Geist Mono porte le corps, les labels et les boutons. Geist reste le fallback gracieux d&apos;Arpona."
      >
        <div style={{ display: "grid", gap: "var(--space-7)" }}>
          <div>
            <Label>Display · Arpona SemiBold 600 · tracking -0.04em</Label>
            <p
              style={{
                margin: "var(--space-3) 0 0",
                fontFamily: "var(--type-display-primary)",
                fontSize: "var(--type-display-hero)",
                fontWeight: 600,
                letterSpacing: "var(--type-tracking-display)",
                lineHeight: "var(--type-leading-display)",
                color: "var(--color-ink-default)",
              }}
            >
              Des agents qui exécutent
            </p>
          </div>

          <div>
            <Label>Mono · Geist Mono 400 · corps</Label>
            <p style={{ ...monoText, marginTop: "var(--space-3)", fontSize: "var(--type-size-md)" }}>
              L&apos;agent reçoit un input défini, produit un output contrôlé, laisse une trace, et
              rend la main à un propriétaire humain identifié.
            </p>
          </div>

          <div>
            <Label tone="signal">Test typographique français · contrainte dure</Label>
            <p style={{ ...monoText, marginTop: "var(--space-3)" }}>
              Interlignage display plafonné à 0.95, jamais sous 0.92. En dessous, les capitales
              accentuées collident avec la ligne du dessus.
            </p>
            <p
              style={{
                margin: "var(--space-4) 0 0",
                fontFamily: "var(--type-display-primary)",
                fontSize: "var(--type-display-section)",
                fontWeight: 600,
                letterSpacing: "var(--type-tracking-display)",
                lineHeight: "var(--type-leading-display)",
                color: "var(--color-ink-default)",
              }}
            >
              {FRENCH_TEST.join(" ")}
            </p>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------ CONTRÔLES */}

      <Section
        id="controls"
        index="03"
        label="Primitives"
        title="Contrôles et marqueurs"
        lede="Angles nets, aucune ombre. Une seule action principale par écran."
      >
        <div style={{ display: "grid", gap: "var(--space-6)" }}>
          <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
            <Button variant="primary">Action principale</Button>
            <Button variant="secondary">Action secondaire</Button>
          </div>
          <div
            style={{
              display: "flex",
              gap: "var(--space-5)",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Badge>Badge signal</Badge>
            <Label>Label mono</Label>
            <IndexMark value="04" />
          </div>
          <Divider />
          <div
            style={{
              display: "grid",
              gap: "var(--space-6)",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 12rem), 1fr))",
            }}
          >
            <Metric value="1 j" caption="Premier déploiement contrôlé" />
            <Metric value="4" caption="Workflows en production" />
            <Metric value="100 %" caption="Actions tracées" signal />
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------- NIVEAU 0 */}

      <Section
        id="level0"
        index="04"
        label="Niveau 0"
        title="Composants qui fonctionnent sans photographie"
        lede="Ces blocs sont le socle. Ils ne rendent aucun média et ne changent pas quand les images sont masquées."
      >
        <ProofRailLevel0
          items={[
            {
              index: "01",
              input: "Mail entrant client",
              output: "Fiche qualifiée + brouillon de réponse",
              owner: "Responsable support",
              scope: "Lecture boîte partagée, aucun envoi automatique",
            },
            {
              index: "02",
              input: "Transcript de rendez-vous",
              output: "Compte rendu + prochaine étape convenue",
              owner: "Commercial",
              scope: "Aucun accès CRM en écriture",
            },
            {
              index: "03",
              input: "Facture fournisseur PDF",
              output: "Écriture proposée, à valider",
              owner: "Comptable",
              scope: "Proposition seule, validation humaine obligatoire",
            },
          ]}
        />

        <TestimonialShiftLevel0
          items={[
            {
              context: "Support",
              before: "Trois heures par jour à trier la boîte partagée.",
              after: "Le tri est fait au réveil. L’équipe arbitre les cas limites.",
            },
            {
              context: "Administration",
              before: "Les factures s’empilent jusqu’à la clôture.",
              after: "Chaque facture arrive pré-imputée, prête à valider.",
            },
          ]}
        />

        <HermesTraceLevel0
          scope="Boîte partagée en lecture seule, aucune écriture, aucun envoi"
          steps={[
            { time: "08:02", action: "Lecture de 34 messages entrants", source: "Boîte partagée", state: "success" },
            { time: "08:03", action: "Classement par intention", state: "success" },
            { time: "08:04", action: "Extraction du numéro de commande", source: "Corps du message", state: "success" },
            { time: "08:05", action: "Message ambigu, aucune règle applicable", state: "human-review" },
            { time: "08:05", action: "Accès CRM refusé par le périmètre déclaré", state: "blocked" },
            { time: "08:06", action: "Brouillons de réponse déposés, non envoyés", state: "waiting" },
          ]}
        />

        <CTASectionLevel0
          title="Décrivez un workflow qui vous coûte du temps."
          lede="Pas une demande de démo, pas un choix d'offre. Un cas réel, avec son input et son output attendu. On vous dit ce qui est faisable, et ce qui ne l'est pas."
          primaryCta={{ label: "Décrire un cas", href: "#level0" }}
          secondaryCta={{ label: "Parler à un humain", href: "#level0" }}
          finePrint="Bloc de démonstration. Les actions de cette page specimen ne mènent nulle part."
        />
      </Section>

      {/* ---------------------------------------------------- HERMÈS */}

      <Section
        id="hermes"
        index="05"
        label="Hermès"
        title="États"
        lede="Chaque état porte un libellé et un symbole, pas seulement une couleur. Seul ce qui demande une intervention porte du rouge."
      >
        <div
          style={{
            display: "grid",
            gap: "var(--space-4)",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 15rem), 1fr))",
          }}
        >
          {HERMES_ALL.map((s) => (
            <div
              key={s}
              style={{
                padding: "var(--space-4)",
                border: "var(--border-hairline) solid var(--color-line-hairline)",
                borderRadius: "var(--radius-none)",
              }}
            >
              <HermesStatus state={s} />
            </div>
          ))}
        </div>
        <p style={{ ...monoText, marginTop: "var(--space-6)", fontSize: "var(--type-size-xs)" }}>
          Hermes Agent · open source by Nous Research, MIT License. Parrit.ai conçoit les systèmes,
          adapte les agents, les intègre, les déploie et organise les boucles de contrôle. Hermès
          n&apos;est jamais présenté comme une technologie propriétaire de Parrit.ai.
        </p>
      </Section>

      {/* ------------------------------------------- COUCHE EXPRESSIVE */}

      <Section
        id="expressive"
        index="06"
        label="Couche expressive"
        title="Facultative, isolée, jamais structurante"
        lede="Ces médias portent data-layer=&quot;expressive&quot;. Active « Masquer les images » : ils disparaissent, la page reste entière."
      >
        <div
          style={{
            display: "grid",
            gap: "var(--space-6)",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))",
          }}
        >
          <MediaPlate
            src="/brand/parrit-lockup.svg"
            alt="Logotype Parrit.ai : PARRIT·AI surmonté du sceau 速 rouge"
            caption="Logotype · asset, jamais retapé en typo"
          />
          <div
            style={{
              display: "grid",
              gap: "var(--space-4)",
              alignContent: "start",
              paddingTop: "var(--space-2)",
            }}
          >
            <Label tone="ink">Ce que la structure porte seule</Label>
            <p style={monoText}>
              Le titre, l&apos;index, le filet, le label et le rouge causal restent en place quand
              l&apos;image part. C&apos;est cela, une page Parrit.
            </p>
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------------- QA */}

      <Section
        id="qa"
        index="07"
        label="Conformité"
        title="Ce que le système refuse"
        lede="Rejet automatique. Une proposition qui contient l&apos;un de ces éléments comme langage dominant est refusée sans discussion."
      >
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gap: 0,
          }}
        >
          {FORBIDDEN.map((f) => (
            <li
              key={f}
              style={{
                display: "flex",
                gap: "var(--space-4)",
                alignItems: "baseline",
                padding: "var(--space-3) 0",
                borderTop: "var(--border-hairline) solid var(--color-line-hairline)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  color: "var(--color-signal-critical)",
                  fontFamily: "var(--type-mono-primary)",
                }}
              >
                ×
              </span>
              <span style={monoText}>{f}</span>
            </li>
          ))}
        </ul>
      </Section>

      <p style={{ ...monoText, fontSize: "var(--type-size-xs)", marginTop: "var(--space-8)" }}>
        Page interne, non indexée. Source de vérité :{" "}
        <code>docs/design-system/PARRIT-DESIGN-SYSTEM.md</code>.
      </p>
    </main>
  );
}
