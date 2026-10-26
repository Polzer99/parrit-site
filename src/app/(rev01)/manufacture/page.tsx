import { EXAM_NOTE } from "@/system/examination";
import type { Metadata } from "next";
import Link from "next/link";

import { getLocale } from "@/lib/server/locale";
import { K, RegistryLine } from "@/system/components";
import { localizedAlternates, localizedOpenGraph, localizedPath } from "@/system/locale";

const DICT = {
  "en": {
    "metaTitle": "The Manufacture",
    "metaDescription": "How Parrit.ai builds a system, from Examination to Compounding.",
    "kicker": "Parrit / The Manufacture",
    "title": "We build each system one operation at a time, from Examination to Compounding.",
    "sub": "Each system is built in your accounts, under your keys.",
    "phasesTitle": "Three phases turn an examined operation into a system you own.",
    "phasesKicker": "Examination · Construction · Compounding",
    "phases": [
      [
        "01",
        "Examination",
        "A first conversation, then a written scope or a reasoned refusal."
      ],
      [
        "02",
        "Construction",
        "One critical operation, rebuilt in full in your accounts, under your keys. It runs in production, with real users, then it is checked against the Standard. The rest comes after."
      ],
      [
        "03",
        "Compounding",
        "Each new capability joins the same system and reuses what the previous ones put in place. The one that detects the signal hands over to the one that follows up with the client. You keep ownership of everything, code and data included."
      ]
    ],
    "note": "All three phases answer to the same Standard: six criteria, the same for every system delivered.",
    "standard": "Read the Standard",
    "close": "It starts with an examination.",
    "proof": EXAM_NOTE.en,
    "button": "Talk about a project",
    "status": "EACH NEW SYSTEM CHECKED AGAINST THE STANDARD",
    "legal": "Legal"
  },
  "fr": {
    "metaTitle": "La Manufacture",
    "metaDescription": "La méthode de Parrit.ai : comment une commande se construit, de l'Examen à la Capitalisation.",
    "kicker": "Parrit / La Manufacture",
    "title": "Nous construisons chaque système une opération à la fois, de l'Examen à la Capitalisation.",
    "sub": "Chaque système se fabrique dans vos comptes, avec vos clés.",
    "phasesTitle": "Trois phases transforment une opération examinée en un système qui vous appartient.",
    "phasesKicker": "Examen · Construction · Capitalisation",
    "phases": [
      [
        "01",
        "L'Examen",
        "Un premier échange, puis un périmètre écrit ou un refus motivé."
      ],
      [
        "02",
        "La Construction",
        "Une opération critique, reconstruite entièrement dans vos comptes, avec vos clés. Elle tourne en production, devant de vrais utilisateurs, puis elle est vérifiée au regard du Standard. Le reste vient ensuite."
      ],
      [
        "03",
        "La Capitalisation",
        "Chaque nouvelle brique rejoint le même système et réutilise ce que les précédentes ont mis en place. Celle qui détecte le signal passe la main à celle qui relance le client. Vous restez propriétaire de tout, code et données compris."
      ]
    ],
    "note": "Les trois phases répondent au même Standard : six critères, les mêmes pour tout système livré.",
    "standard": "Lire le Standard",
    "close": "Tout commence par un examen.",
    "proof": EXAM_NOTE.fr,
    "button": "Parler d'un projet",
    "status": "CHAQUE NOUVEAU SYSTÈME VÉRIFIÉ AU STANDARD",
    "legal": "Mentions légales"
  }
} as const;

export async function generateMetadata(): Promise<Metadata> { const locale = await getLocale(); const copy = DICT[locale]; return { title: copy.metaTitle, description: copy.metaDescription, openGraph: localizedOpenGraph("/manufacture", locale, copy.metaTitle, copy.metaDescription), alternates: localizedAlternates("/manufacture", locale) }; }

export default async function ManufacturePage() {
  const locale = await getLocale(); const copy = DICT[locale];
  return <main className="rev-page r2-dark"><div className="r2-wrap">
    <header className="r2-hero"><K>{copy.kicker}</K><h1>{copy.title}</h1><p className="r2-sub">{copy.sub}</p></header>
    <section className="r2-section" aria-labelledby="phases-heading"><div className="r2-shead"><h2 className="r2-ed" id="phases-heading">{copy.phasesTitle}</h2><K>{copy.phasesKicker}</K></div><div className="r2-phases">{copy.phases.map(([no, name, body]) => <div className="r2-phase" key={no}><div className="no">{no}</div><h3 className="nm">{name}</h3><div className="ds">{body}</div></div>)}</div><p className="r2-registre-note">{copy.note} <Link className="k" href={localizedPath("/standard", locale)}>{copy.standard}</Link></p></section>
    <section className="r2-close" aria-label={locale === "fr" ? "Commande" : "Commission"}><h2>{copy.close}</h2><p className="proof">{copy.proof}</p><Link className="rev-button exec" href={localizedPath("/commission", locale)}>{copy.button}</Link></section>
    <footer className="rev-footer"><RegistryLine value="PARRIT / MANUFACTURE · 2026" /></footer>
  </div></main>;
}
