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
    basis: "forfait",
    cta: "Réserver l’examen offert",
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
        <section className="r2-close" aria-label="Build With You">
          <p className="offer-price">{formatOfferPrice({ amountHt: 3200, currency: "EUR", basis: copy.basis }, locale)}</p>
          <Link className="rev-button exec" href={localizedPath("/commission", locale)}>{copy.cta}</Link>
        </section>
        <footer className="r2-footer"><RegistryLine value="PARRIT / BUILD WITH YOU · 2026" /></footer>
      </div>
    </main>
  );
}
