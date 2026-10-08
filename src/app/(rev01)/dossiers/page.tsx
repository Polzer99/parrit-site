import type { Metadata } from "next";
import Link from "next/link";

import { getLocale } from "@/lib/server/locale";
import { K, RegistryLine } from "@/system/components";
import { localizedAlternates, localizedOpenGraph, localizedPath } from "@/system/locale";

const DICT = {
  "en": {
    "metaTitle": "The Dossiers",
    "metaDescription": "Systems commissioned by large accounts, SMEs and mid-sized companies, anonymized on principle.",
    "kicker": "Parrit / The Dossiers",
    "title": "We show client dossiers in a meeting, not on this site.",
    "sub": "The dossiers open in conversation. Systems commissioned by large accounts, SMEs and mid-sized companies. Anonymized on principle.",
    "dossiers": [
      {
        "ref": "Dossier 26-003 · A consumer brand",
        "title": "A reporting system, commissioned to assemble itself and ship on time.",
        "body": "The brief: pull the report together from the source systems automatically, with no manual rebuild each cycle.",
        "seal": "Commissioned"
      },
      {
        "ref": "Dossier 26-002 · A law firm",
        "title": "A law firm.",
        "body": "A system commissioned to handle the firm's mailbox and act as a tailored assistant.",
        "seal": "Commissioned"
      },
      {
        "ref": "Dossier 26-001 · Parrit.ai, our own system",
        "title": "We sell the system we run on.",
        "body": "Every signal that touches the business reaches the founder already framed as a decision to make.",
        "seal": "In production"
      }
    ],
    "registry": "The registry",
    "registryTitle": "Other dossiers remain sealed.",
    "note": "They are read in a meeting, on request.",
    "close": "The next dossier could be yours.",
    "proof": "15 min · An examination, with the founder",
    "button": "Book the examination"
  },
  "fr": {
    "metaTitle": "Les dossiers",
    "metaDescription": "Des systèmes commandés par des grands comptes, des PME et des ETI, anonymisés par principe.",
    "kicker": "Parrit / Les dossiers",
    "title": "Nous montrons les dossiers clients en rendez-vous, pas sur ce site.",
    "sub": "Les dossiers s'ouvrent de vive voix. Des systèmes commandés par des grands comptes, des PME et des ETI. Anonymisés par principe.",
    "dossiers": [
      {
        "ref": "Dossier 26-003 · Une marque grand public",
        "title": "Un reporting commandé pour s'assembler seul et partir à l'heure.",
        "body": "Le mandat : assembler le rapport depuis les systèmes sources, sans reprise manuelle à chaque cycle.",
        "seal": "Commandé"
      },
      {
        "ref": "Dossier 26-002 · Un cabinet d'avocats",
        "title": "Un cabinet d'avocats.",
        "body": "Un système commandé pour traiter la boîte mail du cabinet et lui servir d'assistant sur mesure.",
        "seal": "Commandé"
      },
      {
        "ref": "Dossier 26-001 · Parrit.ai, notre propre système",
        "title": "Nous vendons le système qui nous fait tourner.",
        "body": "Chaque signal qui touche l'entreprise arrive chez le fondateur déjà transformé en décision à trancher.",
        "seal": "En production"
      }
    ],
    "registry": "Le registre",
    "registryTitle": "D'autres dossiers restent scellés.",
    "note": "Ils se lisent en rendez-vous, sur demande.",
    "close": "Le prochain dossier pourrait être le vôtre.",
    "proof": "15 min · Un examen, avec le fondateur",
    "button": "Réserver l'examen"
  }
} as const;

export async function generateMetadata(): Promise<Metadata> { const locale = await getLocale(); const copy = DICT[locale]; return { title: copy.metaTitle, description: copy.metaDescription, openGraph: localizedOpenGraph("/dossiers", locale, copy.metaTitle, copy.metaDescription), alternates: localizedAlternates("/dossiers", locale) }; }

export default async function DossiersPage() {
  const locale = await getLocale();
  const copy = DICT[locale];
  return (
    <main className="rev-page r2-dark">
      <div className="r2-wrap">
        <header className="r2-hero">
          <K>{copy.kicker}</K>
          <h1>{copy.title}</h1>
          <p className="r2-sub">{copy.sub}</p>
        </header>

        <section className="r2-section" aria-label="Dossiers">
          <div className="r2-dossiers">
            {copy.dossiers.map((dossier) => (
              <article className="r2-dossier" key={dossier.ref}>
                <div className="ref">
                  <K>{dossier.ref}</K>
                </div>
                <h3>{dossier.title}</h3>
                <p>{dossier.body}</p>
                <div className="seal">{dossier.seal}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="r2-section" aria-labelledby="registry-heading">
          <K>{copy.registry}</K>
          <h2 className="r2-ed" id="registry-heading">{copy.registryTitle}</h2>
          <p className="r2-registre-note">{copy.note}</p>
        </section>

        <section className="r2-close" aria-label="Commission">
          <h2>{copy.close}</h2>
          <p className="proof">{copy.proof}</p>
          <Link className="rev-button exec" href={localizedPath("/commission", locale)}>
            {copy.button}
          </Link>
        </section>

        <footer className="r2-footer">
          <RegistryLine value="PARRIT / DOSSIERS · REV 01 · 2026" />
          <K>© 2026 Parrit.ai</K>
        </footer>
      </div>
    </main>
  );
}
