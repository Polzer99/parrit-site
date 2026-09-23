import type { Metadata } from "next";
import Link from "next/link";

import { getLocale } from "@/lib/server/locale";
import { K, RegistryLine } from "@/system/components";
import { localizedAlternates, localizedOpenGraph, localizedPath } from "@/system/locale";

const DICT = {
  "en": {
    "metaTitle": "The Standard",
    "metaDescription": "Six commitments on every system we deliver: state readable at any moment, framed decisions, the way back written in advance, full client ownership.",
    "kicker": "Parrit / The Standard",
    "title": "Six commitments. Every system we deliver keeps them.",
    "tableMeta": "STD-1.0 · 2026",
    "principles": [
      [
        "PS-01",
        "State is readable at any moment.",
        "Pipeline state, follow-ups sent, yesterday's incident. One screen."
      ],
      [
        "PS-02",
        "Every signal carries its decision.",
        "A blocked invoice surfaces framed and quantified, on a card."
      ],
      [
        "PS-03",
        "A decision always keeps its origin.",
        "Author, time, source, rationale. The journal is the audit."
      ],
      [
        "PS-04",
        "Rolling back is written in advance.",
        "A send still pending cancels with one click. Once it's gone, the internal state rolls back and a correction can go out: never the erasure of a message someone has already received."
      ],
      [
        "PS-05",
        "The system belongs to you.",
        "Code, data and documentation included. Your team can run it without us. If you'd rather keep us on for support, that access is your choice, never a dependency we build in."
      ],
      [
        "PS-06",
        "Each brick raises the value of the ones before it.",
        "The reporting built first feeds the follow-ups built next."
      ]
    ],
    "seal": "Sign-off by your team, at delivery",
    "note": "STD-1.0 is not an accreditation. It is Parrit.ai's own bar. Hold us to it.",
    "proof": "15 min · On a video call, with the founder",
    "button": "Let's talk"
  },
  "fr": {
    "metaTitle": "Le Standard",
    "metaDescription": "Six engagements sur chaque système livré : état lisible à tout moment, décisions cadrées et chiffrées, retour arrière écrit d'avance, propriété complète du client.",
    "kicker": "Parrit / Le Standard",
    "title": "Six engagements. Chaque système livré les tient.",
    "tableMeta": "STD-1.0 · 2026",
    "principles": [
      [
        "PS-01",
        "L'état se lit à tout moment.",
        "L'état du pipeline, les relances parties, l'incident d'hier. Un écran."
      ],
      [
        "PS-02",
        "Chaque signal porte sa décision.",
        "La facture bloquée remonte cadrée et chiffrée, sur une carte."
      ],
      [
        "PS-03",
        "Toute décision garde son origine.",
        "Auteur, heure, source, motif. Le journal est l'audit."
      ],
      [
        "PS-04",
        "Le retour arrière est écrit d'avance.",
        "Un envoi encore en attente s'annule d'un clic. Une fois parti, l'état interne revient en arrière et une correction peut repartir : jamais l'effacement d'un message déjà reçu."
      ],
      [
        "PS-05",
        "Vous restez propriétaire du système.",
        "Code, données et documentation compris. Votre équipe peut le faire tourner sans nous. Si vous préférez nous garder en support, cet accès est votre choix, jamais une dépendance imposée."
      ],
      [
        "PS-06",
        "Une nouvelle brique augmente la valeur des précédentes.",
        "Le reporting construit d'abord alimente les relances construites ensuite."
      ]
    ],
    "seal": "Recette signée par votre équipe, à la livraison",
    "note": "STD-1.0 n'est pas une accréditation. C'est l'exigence de Parrit.ai. Demandez-nous des comptes.",
    "proof": "15 min · En visio, avec le fondateur",
    "button": "Parlons-en"
  }
} as const;

export async function generateMetadata(): Promise<Metadata> { const locale = await getLocale(); const copy = DICT[locale]; return { title: copy.metaTitle, description: copy.metaDescription, openGraph: localizedOpenGraph("/standard", locale, copy.metaTitle, copy.metaDescription), alternates: localizedAlternates("/standard", locale) }; }

export default async function StandardPage() { const locale = await getLocale(); const copy = DICT[locale]; return <main className="rev-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: copy.principles.map(([, name, description], index) => ({
    "@type": "ListItem", position: index + 1, name, description,
  })),
}).replace(/</g, "\\u003c") }} /><div className="rev-wrap"><header className="standard-intro"><K>{copy.kicker}</K><h1>{copy.title}</h1></header><section className="doctrine" aria-label={copy.metaTitle}><div className="doctrine-head"><K>{copy.tableMeta}</K></div>{copy.principles.map(([code, statement, scene]) => <div className="doctrine-row" key={code}><div className="doctrine-code"><K>{code}</K></div><h3 className="doctrine-name">{statement}</h3><div className="doctrine-definition">{scene}</div></div>)}<div className="doctrine-foot"><span className="seal">{copy.seal}</span></div></section><p className="standard-note">{copy.note}</p><div className="standard-action"><K>{copy.proof}</K><Link className="rev-button exec" href={localizedPath("/commission", locale)}>{copy.button}</Link></div><footer className="rev-footer"><RegistryLine /></footer></div></main>; }
