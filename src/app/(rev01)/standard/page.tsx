import type { Metadata } from "next";
import Link from "next/link";

import { getLocale } from "@/lib/server/locale";
import { K, RegistryLine } from "@/system/components";
import { localizedAlternates } from "@/system/locale";

const DICT = {
  "en": {
    "metaTitle": "The Standard",
    "metaDescription": "Six commitments on every system we deliver.",
    "kicker": "Parrit / The Standard",
    "title": "Six commitments. Every system we deliver keeps them.",
    "tableMeta": "STD-1.0 · 2026",
    "principles": [
      [
        "PS-01",
        "The state is readable at any moment.",
        "Pipeline state, follow-ups sent, yesterday's incident. One screen."
      ],
      [
        "PS-02",
        "Every signal carries its decision.",
        "A blocked invoice surfaces framed and quantified, on a card."
      ],
      [
        "PS-03",
        "Every decision keeps its origin.",
        "Author, time, source, rationale. The journal is the audit."
      ],
      [
        "PS-04",
        "The way back is written in advance.",
        "A follow-up sent by mistake: one click undoes it and restores the state before."
      ],
      [
        "PS-05",
        "The system belongs to you.",
        "Code, data and documentation included. Your team runs it without us."
      ],
      [
        "PS-06",
        "The next brick raises the value of the ones before.",
        "The reporting built first feeds the follow-ups built next."
      ]
    ],
    "seal": "Sign-off by your team, at delivery",
    "note": "STD-1.0 is not an accreditation. It is Parrit.ai's own bar. Hold us to it.",
    "proof": "30 min · On a video call, with the founder",
    "button": "Let's talk"
  },
  "fr": {
    "metaTitle": "Le Standard",
    "metaDescription": "Six engagements sur chaque système livré.",
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
        "Chaque décision garde son origine.",
        "Auteur, heure, source, motif. Le journal est l'audit."
      ],
      [
        "PS-04",
        "Le retour arrière est écrit d'avance.",
        "Une relance partie par erreur : un clic l'annule et restaure l'état d'avant."
      ],
      [
        "PS-05",
        "Le système vous appartient.",
        "Code, données et documentation compris. Votre équipe le fait tourner sans nous."
      ],
      [
        "PS-06",
        "La brique suivante augmente la valeur des précédentes.",
        "Le reporting construit d'abord alimente les relances construites ensuite."
      ]
    ],
    "seal": "Recette signée par votre équipe, à la livraison",
    "note": "STD-1.0 n'est pas une accréditation. C'est l'exigence de Parrit.ai. Demandez-nous des comptes.",
    "proof": "30 min · En visio, avec le fondateur",
    "button": "Parlons-en"
  }
} as const;

export async function generateMetadata(): Promise<Metadata> { const copy = DICT[await getLocale()]; return { title: copy.metaTitle, description: copy.metaDescription, alternates: localizedAlternates("/standard") }; }

export default async function StandardPage() { const copy = DICT[await getLocale()]; return <main className="rev-page"><div className="rev-wrap"><header className="standard-intro"><K>{copy.kicker}</K><h1>{copy.title}</h1></header><section className="doctrine" aria-label={copy.metaTitle}><div className="doctrine-head"><K>{copy.tableMeta}</K></div>{copy.principles.map(([code, statement, scene]) => <div className="doctrine-row" key={code}><div className="doctrine-code"><K>{code}</K></div><div className="doctrine-name">{statement}</div><div className="doctrine-definition">{scene}</div></div>)}<div className="doctrine-foot"><span className="seal">{copy.seal}</span></div></section><p className="standard-note">{copy.note}</p><div className="standard-action"><K>{copy.proof}</K><Link className="rev-button exec" href="/commission">{copy.button}</Link></div><footer className="rev-footer"><RegistryLine /></footer></div></main>; }
