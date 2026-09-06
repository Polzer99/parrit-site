import type { Metadata } from "next";
import Link from "next/link";

import { getLocale } from "@/lib/server/locale";
import { K, RegistryLine } from "@/system/components";
import { localizedAlternates } from "@/system/locale";

const DICT = {
  "en": {
    "metaTitle": "The Manufacture",
    "metaDescription": "How Parrit.ai builds a company operating system, from Examination to Compounding.",
    "kicker": "Parrit / The Manufacture",
    "title": "Manufactured, not installed.",
    "sub": "How Parrit.ai builds a company operating system: your operations, rebuilt one by one, from Examination to Compounding.",
    "phasesTitle": "Three phases.",
    "phasesKicker": "Examination → Construction → Compounding",
    "phases": [
      [
        "01",
        "Examination",
        "Thirty minutes with the founder, then a written diagnostic: your flows, your failure points, the first operation to rebuild. Before any commitment."
      ],
      [
        "02",
        "Construction",
        "One critical operation, rebuilt end-to-end in your accounts, under your keys. It runs in production, with real users, then it is certified to the Standard. A few weeks, usually. Only then, the rest."
      ],
      [
        "03",
        "Compounding",
        "Each new capability joins the system and raises the value of every previous one: the one that detects the signal hands over to the one that follows up with the client. You keep ownership of everything, code and data included."
      ]
    ],
    "note": "All three phases answer to the same Standard. Six criteria, identical for any system delivered.",
    "standard": "Read the Standard",
    "close": "The Examination comes first.",
    "proof": "30 min · On a video call, with the founder",
    "button": "Let's talk",
    "status": "EVERY SYSTEM CERTIFIED TO THE STANDARD",
    "legal": "Legal"
  },
  "fr": {
    "metaTitle": "La Manufacture",
    "metaDescription": "La méthode de Parrit.ai : comment une commande se construit, de l'Examen à la Capitalisation.",
    "kicker": "Parrit / La Manufacture",
    "title": "Un système se fabrique. Il ne s'installe pas.",
    "sub": "Comment Parrit.ai construit un système d'exploitation d'entreprise : vos opérations, reconstruites une par une, de l'Examen à la Capitalisation.",
    "phasesTitle": "Trois phases.",
    "phasesKicker": "Examen → Construction → Capitalisation",
    "phases": [
      [
        "01",
        "L'Examen",
        "Trente minutes avec le fondateur, puis un diagnostic écrit : vos flux, vos points de défaillance, la première opération à reconstruire. Avant tout engagement."
      ],
      [
        "02",
        "La Construction",
        "Une opération critique, reconstruite de bout en bout dans vos comptes, avec vos clés. Elle tourne en production, devant de vrais utilisateurs, puis elle est certifiée selon le Standard. Quelques semaines, en général. Ensuite seulement, le reste."
      ],
      [
        "03",
        "La Capitalisation",
        "Chaque nouvelle brique rejoint le système et augmente la valeur des précédentes : celle qui détecte le signal passe la main à celle qui relance le client. Vous restez propriétaire de tout, code et données compris."
      ]
    ],
    "note": "Les trois phases répondent au même Standard. Six critères, identiques pour tout système livré.",
    "standard": "Lire le Standard",
    "close": "Tout commence par un Examen.",
    "proof": "30 min · En visio, avec le fondateur",
    "button": "Parlons-en",
    "status": "CHAQUE SYSTÈME CERTIFIÉ AU STANDARD",
    "legal": "Mentions légales"
  }
} as const;

export async function generateMetadata(): Promise<Metadata> { const copy = DICT[await getLocale()]; return { title: copy.metaTitle, description: copy.metaDescription, alternates: localizedAlternates("/manufacture") }; }

export default async function ManufacturePage() {
  const locale = await getLocale(); const copy = DICT[locale];
  return <main className="rev-page r2-dark"><div className="r2-wrap">
    <header className="r2-hero"><K>{copy.kicker}</K><h1>{copy.title}</h1><p className="r2-sub">{copy.sub}</p></header>
    <section className="r2-section" aria-labelledby="phases-heading"><div className="r2-shead"><h2 className="r2-ed" id="phases-heading">{copy.phasesTitle}</h2><K>{copy.phasesKicker}</K></div><div className="r2-phases">{copy.phases.map(([no, name, body]) => <div className="r2-phase" key={no}><div className="no">{no}</div><div className="nm">{name}</div><div className="ds">{body}</div></div>)}</div><p className="r2-registre-note">{copy.note} <Link className="k" href="/standard">{copy.standard}</Link></p></section>
    <section className="r2-close" aria-label={locale === "fr" ? "Commande" : "Commission"}><h2>{copy.close}</h2><p className="proof">{copy.proof}</p><Link className="rev-button exec" href="/commission">{copy.button}</Link></section>
    <footer className="r2-footer"><RegistryLine value="PARRIT / MANUFACTURE · REV 02 · 2026" /><K>{copy.status}</K><Link className="k" href="/legal">{copy.legal}</Link><K>© 2026 Parrit.ai</K></footer>
  </div></main>;
}
