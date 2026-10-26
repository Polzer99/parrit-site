import { EXAM_NOTE } from "@/system/examination";
import type { Metadata } from "next";
import Link from "next/link";

import { getLocale } from "@/lib/server/locale";
import { localizedAlternates, localizedOpenGraph, localizedPath } from "@/system/locale";

const DICT = {
  "en": {
    "metaTitle": "The Standard",
    "metaDescription": "Six commitments on every system we deliver: state readable at any moment, framed, quantified decisions, the way back written in advance, written assignment of what is built for you.",
    "kicker": "Parrit / The Standard",
    "title": "Six commitments we apply to our systems.",
    "tableMeta": "The Standard · 2026",
    "principles": [
      [
        "01",
        "State is readable at any moment.",
        "Pipeline state, follow-ups sent and yesterday's incident fit on one screen."
      ],
      [
        "02",
        "Every signal carries its decision.",
        "A blocked invoice surfaces framed and quantified, on a card."
      ],
      [
        "03",
        "A decision always keeps its origin.",
        "Author, time, source, rationale. The journal is the audit."
      ],
      [
        "04",
        "Rolling back is written in advance.",
        "A send still pending cancels with one click. Once it's gone, the internal state rolls back and a correction can go out: never the erasure of a message someone has already received."
      ],
      [
        "05",
        "What is built for you is assigned to you in writing.",
        "The contract assigns, right by right, the rights to the code and documentation built for your project. Your data remains yours. Reused components, open-source software and third-party services stay under their own licences and are listed in an annex. Your team can run the system without us; keeping us for support remains your choice."
      ],
      [
        "06",
        "Each new capability reuses what already exists.",
        "The reporting built first feeds the follow-ups built next."
      ]
    ],
    "seal": "Sign-off by your team, at delivery",
    "note": "The Standard is Parrit.ai's internal check, with no external accreditation. Hold us to it.",
    "proof": EXAM_NOTE.en,
    "button": "Talk about a project"
  },
  "fr": {
    "metaTitle": "Le Standard",
    "metaDescription": "Six engagements sur chaque système livré : état lisible à tout moment, décisions cadrées et chiffrées, retour arrière écrit d'avance, cession écrite de ce qui est développé pour vous.",
    "kicker": "Parrit / Le Standard",
    "title": "Six engagements que nous appliquons à nos systèmes.",
    "tableMeta": "Le Standard · 2026",
    "principles": [
      [
        "01",
        "L'état se lit à tout moment.",
        "L'état du pipeline, les relances parties et l'incident d'hier tiennent sur un écran."
      ],
      [
        "02",
        "Chaque signal porte sa décision.",
        "La facture bloquée remonte cadrée et chiffrée, sur une carte."
      ],
      [
        "03",
        "Toute décision garde son origine.",
        "Auteur, heure, source, motif. Le journal est l'audit."
      ],
      [
        "04",
        "Le retour arrière est écrit d'avance.",
        "Un envoi encore en attente s'annule d'un clic. Une fois parti, l'état interne revient en arrière et une correction peut repartir : jamais l'effacement d'un message déjà reçu."
      ],
      [
        "05",
        "Ce qui est développé pour vous vous est cédé par écrit.",
        "Le contrat cède, droit par droit, les droits sur le code et la documentation développés pour votre projet. Vos données restent les vôtres. Les briques réutilisées, les logiciels libres et les services tiers restent sous leur propre licence et sont listés en annexe. Votre équipe peut faire tourner le système sans nous ; nous garder en support reste votre choix."
      ],
      [
        "06",
        "Une nouvelle brique réutilise ce qui existe déjà.",
        "Le reporting construit d'abord alimente les relances construites ensuite."
      ]
    ],
    "seal": "Recette signée par votre équipe, à la livraison",
    "note": "Le Standard est un contrôle interne de Parrit.ai, sans accréditation externe. Demandez-nous des comptes.",
    "proof": EXAM_NOTE.fr,
    "button": "Parler d'un projet"
  }
} as const;

export async function generateMetadata(): Promise<Metadata> { const locale = await getLocale(); const copy = DICT[locale]; return { title: copy.metaTitle, description: copy.metaDescription, openGraph: localizedOpenGraph("/standard", locale, copy.metaTitle, copy.metaDescription), alternates: localizedAlternates("/standard", locale) }; }

export default async function StandardPage() { const locale = await getLocale(); const copy = DICT[locale]; return <main className="rev-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: copy.principles.map(([, name, description], index) => ({
    "@type": "ListItem", position: index + 1, name, description,
  })),
}).replace(/</g, "\\u003c") }} /><div className="rev-wrap"><header className="standard-intro"><h1>{copy.title}</h1></header><section className="doctrine" aria-label={copy.metaTitle}>{copy.principles.map(([code, statement, scene]) => <div className="doctrine-row" key={code}><h3 className="doctrine-name">{statement}</h3><div className="doctrine-definition">{scene}</div></div>)}<div className="doctrine-foot"><span className="seal">{copy.seal}</span></div></section><p className="standard-note">{copy.note}</p><div className="standard-action"><p>{copy.proof}</p><Link className="rev-button exec" href={localizedPath("/commission", locale)}>{copy.button}</Link></div></div></main>; }
