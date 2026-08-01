import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { T1Article } from "@/components/templates/T1Article";
import { T2Video } from "@/components/templates/T2Video";
import { T3Ressource } from "@/components/templates/T3Ressource";
import { T4Systeme } from "@/components/templates/T4Systeme";
import { T5Theme } from "@/components/templates/T5Theme";
import { T6Presse } from "@/components/templates/T6Presse";
import { T7Landing } from "@/components/templates/T7Landing";
import { T8Auteur } from "@/components/templates/T8Auteur";
import { Label } from "@/components/ds/primitives";
import { getRessource } from "@/lib/registry/ressources";
import {
  ARTICLE,
  AUTEUR,
  CAMPAGNE,
  LANG,
  PRESSE,
  SYSTEME,
  THEME,
  VIDEO,
} from "../fixtures";

export const metadata: Metadata = {
  title: "Specimen des templates · Parrit.ai",
  robots: { index: false, follow: false },
};

const TEMPLATES = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"] as const;
type TemplateId = (typeof TEMPLATES)[number];

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ t }));
}

/** Formulaire de démonstration, volontairement inerte. */
function FormulaireSpecimen() {
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <Label tone="ink">Formulaire — gabarit G2, rendu par la page appelante</Label>
      <p
        style={{
          margin: 0,
          fontFamily: "var(--type-mono-primary)",
          fontSize: "var(--type-size-sm)",
          lineHeight: "var(--type-leading-body)",
          color: "var(--color-ink-muted)",
        }}
      >
        Le template ne connaît pas les champs. Il expose l&apos;emplacement, la page injecte
        le formulaire réel avec sa vérification de réponse et son mécanisme de reprise.
      </p>
    </div>
  );
}

export default async function SpecimenPage({
  params,
}: {
  params: Promise<{ t: string }>;
}) {
  const { t } = await params;
  if (!TEMPLATES.includes(t as TemplateId)) notFound();

  switch (t as TemplateId) {
    case "t1":
      return (
        <T1Article
          data={ARTICLE}
          lang={LANG}
          ctaId="rdv.paul"
          ressourceHref="/harnais-ia"
          ressourceTitre="Le harnais IA"
          labels={{
            blog: "Blog",
            tldr: "En bref",
            sommaire: "Sommaire",
            faq: "Questions fréquentes",
            sources: "Sources",
            lireEnsuite: "À lire ensuite",
            voirProfil: "Voir le profil",
          }}
        />
      );

    case "t2":
      return (
        <T2Video
          data={VIDEO}
          lang={LANG}
          ctaId="rdv.paul"
          labels={{
            videos: "Vidéos",
            resume: "Résumé",
            transcript: "Transcript",
            aVoir: "À voir ensuite",
          }}
        />
      );

    case "t3": {
      const ressource = getRessource("harnais-ia");
      if (!ressource) notFound();
      return (
        <T3Ressource
          ressource={ressource}
          lang={LANG}
          preuveRefs={["preuve.derive-openrouter"]}
          apercu={{
            src: "/brand/editorial/plates/plate-decision.jpg",
            alt: "Aperçu de la matrice tâche vers modèle",
            legende: "Aperçu du livrable",
          }}
          labels={{
            ressources: "Ressources",
            obtenez: "Contenu",
            autres: "Autres ressources",
          }}
        />
      );
    }

    case "t4":
      return (
        <T4Systeme
          data={SYSTEME}
          lang={LANG}
          ctaId="rdv.systeme"
          labels={{ systemes: "Systèmes", casLies: "Cas liés" }}
        />
      );

    case "t5":
      return (
        <T5Theme
          data={THEME}
          lang={LANG}
          ctaId="rdv.paul"
          labels={{
            themes: "Thèmes",
            articles: "Articles",
            systemes: "Systèmes",
            videos: "Vidéos",
            voisins: "Thèmes voisins",
          }}
        />
      );

    case "t6":
      return (
        <T6Presse
          data={PRESSE}
          lang={LANG}
          labels={{
            presse: "Presse",
            faits: "Faits",
            kit: "Kit visuel",
            citations: "Citations",
            mentions: "Parutions",
          }}
        />
      );

    case "t7":
      return (
        <T7Landing
          data={CAMPAGNE}
          lang={LANG}
          ctaId="ressource.demander"
          formulaire={<FormulaireSpecimen />}
        />
      );

    case "t8":
      return (
        <T8Auteur
          data={AUTEUR}
          lang={LANG}
          ctaId="rdv.auteur"
          labels={{
            auteurs: "Auteurs",
            livre: "Ce qui a été livré",
            publications: "Publications",
          }}
        />
      );
  }
}
