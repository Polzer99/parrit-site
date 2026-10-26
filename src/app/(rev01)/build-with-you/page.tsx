import { EXAM_NOTE } from "@/system/examination";
import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "@/lib/server/locale";
import { localizedAlternates, localizedOpenGraph, localizedPath } from "@/system/locale";

const DICT = {
  en: {
    title: "With Parrit.ai, you build a system that runs.",
    metaTitle: "With Parrit.ai, you build a system that runs.",
    metaDescription: "With Parrit.ai, you build a system that runs, and you leave able to build the next one without us.",
    autonomy: "You also leave able to build the next one without us.",
    stepsTitle: "Build together.",
    steps: [
      ["01", "Examination", "An examination of your needs."],
      ["02", "Findings review", "The findings reviewed together."],
      ["03", "Building together", "Building a working system together."],
    ],
    outTitle: "What comes out of it.",
    outBody: "A system running at the end, in your own tools. The contract assigns you the rights to the code and documentation built together; your data remains yours. With this formula, your team runs it without us.",
    bringTitle: "What you bring.",
    bringBody: "One precise operation: the follow-up that quietly drops, the spreadsheet you copy out every week, the decision that always lands on your desk. You're in the room: you decide.",
    nextTitle: "What happens next.",
    nextBody: "The system runs on your side, and the method stays with your team: you watched how one operation turns into something that runs. The next one you spot, your team can take on alone with what it learned, or you call Parrit back for a custom system, starting from the same place.",
    nextLink: "Book the examination (custom system)",
    cta: "Book the examination",
    examinationNote: EXAM_NOTE.en,
  },
  fr: {
    title: "Avec Parrit.ai, vous construisez un système qui tourne.",
    metaTitle: "Avec Parrit.ai, vous construisez un système qui tourne.",
    metaDescription: "Avec Parrit.ai, vous construisez un système qui tourne, et vous repartez capable de construire le suivant sans nous.",
    autonomy: "Vous repartez aussi capable de construire le suivant sans nous.",
    stepsTitle: "Construire ensemble.",
    steps: [
      ["01", "Examen", "Un examen du besoin."],
      ["02", "Restitution", "Les constats repris ensemble."],
      ["03", "Construction ensemble", "La construction ensemble d'un système qui tourne."],
    ],
    outTitle: "Ce qui en sort.",
    outBody: "Un système qui tourne à la fin, dans vos outils. Le contrat vous cède les droits sur le code et la documentation produits ensemble ; vos données restent les vôtres. Pour cette formule, votre équipe le fait tourner sans nous.",
    bringTitle: "Ce que vous apportez.",
    bringBody: "Une opération précise : la relance qui retombe dans l'oubli, le tableau que vous recopiez chaque semaine, la décision qui atterrit toujours sur votre bureau. Vous êtes présent : c'est vous qui tranchez.",
    nextTitle: "Et ensuite.",
    nextBody: "Le système tourne chez vous, et la méthode reste à votre équipe : vous avez vu comment une opération se transforme en quelque chose qui tourne. La prochaine que vous repérerez, votre équipe peut s'y attaquer seule avec ce qu'elle a appris, ou vous rappelez Parrit pour un système sur mesure qui part du même endroit.",
    nextLink: "Réserver l'examen (système sur mesure)",
    cta: "Réserver l'examen",
    examinationNote: EXAM_NOTE.fr,
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const description = DICT[locale].metaDescription;
  return {
    title: DICT[locale].metaTitle, description,
    alternates: localizedAlternates("/build-with-you", locale),
    openGraph: localizedOpenGraph("/build-with-you", locale, DICT[locale].metaTitle, description),
  };
}

export default async function BuildWithYouPage() {
  const locale = await getLocale();
  const copy = DICT[locale];
  return (
    <main className="rev-page r2-dark">
      <div className="r2-wrap">
        <header className="r2-hero build-with-you-hero">

          <h1>{copy.title}</h1>
          <p className="r2-sub">{copy.autonomy}</p>
          <div className="build-with-you-examination">
            <p className="doctrine-note">{copy.examinationNote}</p>
            <Link className="rev-button ghost" href={localizedPath("/commission", locale)}>{copy.cta}</Link>
          </div>
        </header>
        <section className="r2-section" aria-labelledby="build-steps">
          <div className="r2-shead"><h2 className="r2-ed" id="build-steps">{copy.stepsTitle}</h2></div>
          <div className="r2-phases">
            {copy.steps.map(([number, title, body]) => <div className="r2-phase" key={number}>
              <h3 className="nm">{title}</h3><div className="ds">{body}</div>
            </div>)}
          </div>
          <p style={{ marginTop: 24 }}>
            <Link className="rev-button ghost" href={localizedPath("/commission", locale)}>{copy.cta}</Link>
          </p>
        </section>
        <section className="r2-section" aria-labelledby="build-out">
          <div className="r2-shead"><h2 className="r2-ed" id="build-out">{copy.outTitle}</h2></div>
          <p>{copy.outBody}</p>
        </section>
        <section className="r2-section" aria-labelledby="build-bring">
          <div className="r2-shead"><h2 className="r2-ed" id="build-bring">{copy.bringTitle}</h2></div>
          <p>{copy.bringBody}</p>
        </section>
        <section className="r2-section" aria-labelledby="build-next">
          <div className="r2-shead"><h2 className="r2-ed" id="build-next">{copy.nextTitle}</h2></div>
          <p style={{ marginBottom: 16 }}>{copy.nextBody}</p>
          <Link className="build-with-you-next-link" href={localizedPath("/commission", locale)}>{copy.nextLink}</Link>
        </section>
        <section className="r2-close" aria-label="Build With You">
          <Link className="rev-button exec" href={localizedPath("/commission", locale)}>{copy.cta}</Link>
        </section>

      </div>
    </main>
  );
}
