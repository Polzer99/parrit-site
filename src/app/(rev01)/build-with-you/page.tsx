import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "@/lib/server/locale";
import { K, RegistryLine } from "@/system/components";
import { formatOfferPrice } from "@/system/components/OfferCard";
import { localizedAlternates, localizedOpenGraph, localizedPath } from "@/system/locale";

const DICT = {
  en: {
    metaTitle: "Build With You · Build with the founder",
    promise: "You want to leave with something that runs, built with you. Not an audit or a deck.",
    stepsTitle: "Build with the founder.",
    steps: [
      ["01", "Free examination", "The same 15-minute examination as every commission."],
      ["02", "Findings review", "30 minutes to review the findings together."],
      ["03", "Build together", "10 hours with the founder to build a working system."],
    ],
    outTitle: "What comes out of these 10 hours.",
    outBody: "Something that runs at the end, in your own tools, not a demo. Code, data and documentation are yours: your team runs it without us, like every system we deliver.",
    bringTitle: "What you bring.",
    bringBody: "One precise operation, not an audit of the whole company: the follow-up that quietly drops, the spreadsheet you copy out every week, the decision that always lands on your desk. You're in the room for the 10 hours: you decide, there's no project lead standing in for you.",
    nextTitle: "What happens next.",
    nextBody: "The system you build joins the next ones: every capability raises the value of the ones before it. If you want Parrit to build what comes next, a custom Commission starts at the same place.",
    nextLink: "See the custom system",
    basis: "fixed fee",
    cta: "Book the free examination",
  },
  fr: {
    metaTitle: "Build With You · Construire avec le fondateur",
    promise: "Vous voulez repartir avec quelque chose qui tourne, construit avec vous. Pas un audit ni un deck.",
    stepsTitle: "Construire avec le fondateur.",
    steps: [
      ["01", "Examen offert", "Le même examen de 15 minutes que toute commande."],
      ["02", "Restitution", "30 minutes pour reprendre les constats ensemble."],
      ["03", "Construction ensemble", "10 heures avec le fondateur pour construire un système qui tourne."],
    ],
    outTitle: "Ce qui sort de ces 10 heures.",
    outBody: "Une chose qui tourne à la fin, dans vos outils, pas une démonstration. Le code, les données et la documentation vous appartiennent : votre équipe le fait tourner sans nous, comme sur chaque système que nous livrons.",
    bringTitle: "Ce que vous apportez.",
    bringBody: "Une opération précise, pas un audit de l'entreprise entière : la relance qui retombe dans l'oubli, le tableau que vous recopiez chaque semaine, la décision qui atterrit toujours sur votre bureau. Vous êtes présent pendant les 10 heures : c'est vous qui tranchez, pas un chef de projet à votre place.",
    nextTitle: "Et ensuite.",
    nextBody: "Le système construit rejoint les suivants : chaque capacité augmente la valeur de celles d'avant. Si vous voulez que Parrit construise la suite, une Commande sur mesure part du même endroit.",
    nextLink: "Voir le système sur mesure",
    basis: "forfait",
    cta: "Réserver l'examen offert",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const description = DICT[locale].promise;
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
        <header className="r2-hero">
          <K>Parrit / Build With You</K>
          <h1>Build With You</h1>
          <p className="r2-sub">{copy.promise}</p>
        </header>
        <section className="r2-section" aria-labelledby="build-steps">
          <div className="r2-shead"><h2 className="r2-ed" id="build-steps">{copy.stepsTitle}</h2></div>
          <div className="r2-phases">
            {copy.steps.map(([number, title, body]) => <div className="r2-phase" key={number}>
              <div className="no">{number}</div><h3 className="nm">{title}</h3><div className="ds">{body}</div>
            </div>)}
          </div>
        </section>
        <section className="r2-section" aria-labelledby="build-out">
          <div className="r2-shead"><h2 className="r2-ed" id="build-out">{copy.outTitle}</h2></div>
          <p style={{ lineHeight: 1.8 }}>{copy.outBody}</p>
        </section>
        <section className="r2-section" aria-labelledby="build-bring">
          <div className="r2-shead"><h2 className="r2-ed" id="build-bring">{copy.bringTitle}</h2></div>
          <p style={{ lineHeight: 1.8 }}>{copy.bringBody}</p>
        </section>
        <section className="r2-section" aria-labelledby="build-next">
          <div className="r2-shead"><h2 className="r2-ed" id="build-next">{copy.nextTitle}</h2></div>
          <p style={{ lineHeight: 1.8, marginBottom: 16 }}>{copy.nextBody}</p>
          <Link href={localizedPath("/commission", locale)}>{copy.nextLink}</Link>
        </section>
        <section className="r2-close" aria-label="Build With You">
          <p className="offer-price">{formatOfferPrice({ amountHt: 3200, currency: "EUR", basis: copy.basis }, locale)}</p>
          <Link className="rev-button exec" href={localizedPath("/commission", locale)}>{copy.cta}</Link>
        </section>
        <footer className="r2-footer"><RegistryLine value="PARRIT / BUILD WITH YOU · 2026" /></footer>
      </div>
    </main>
  );
}
