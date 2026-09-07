import type { Metadata } from "next";
import Link from "next/link";

import { getLocale } from "@/lib/server/locale";
import { K, RegistryLine } from "@/system/components";
import { localizedAlternates, localizedOpenGraph, localizedPath } from "@/system/locale";

const DICT = {
  "en": {
    "metaTitle": "The Dossiers",
    "metaDescription": "Systems commissioned by large accounts, SMEs and mid-sized companies, anonymized on principle. Figures verified live, dossier by dossier.",
    "kicker": "Parrit / The Dossiers",
    "title": "The dossiers open in conversation.",
    "sub": "Systems commissioned by large accounts, SMEs and mid-sized companies. Anonymized on principle. The figures are verified live.",
    "dossiers": [
      {
        "ref": "Dossier 26-003 · A consumer brand",
        "title": "2.5 months recovered on a single reporting process.",
        "body": "The reporting assembles itself and ships on schedule. The client's own team runs it today.",
        "seal": "Delivered · In the client's hands"
      },
      {
        "ref": "Dossier 26-002 · A law firm",
        "title": "€5K to €10K more per month, from re-engaged case files.",
        "body": "Client intake and follow-ups, rebuilt on the firm's own infrastructure. Measured on the capabilities already live.",
        "seal": "Under construction · First capabilities live"
      },
      {
        "ref": "Dossier 26-001 · Parrit.ai, our own system",
        "title": "We sell the system we run on.",
        "body": "More than 200 signals become decisions every week, received and arbitrated by the founder.",
        "seal": "In production · Compounding"
      }
    ],
    "registry": "The registry",
    "registryTitle": "Other dossiers remain sealed.",
    "note": "They are read in a meeting, with the client's consent.",
    "close": "The next dossier could be yours.",
    "proof": "30 min · An examination, with the founder",
    "button": "Let's talk"
  },
  "fr": {
    "metaTitle": "Les dossiers",
    "metaDescription": "Des systèmes commandés par des grands comptes, des PME et des ETI, anonymisés par principe. Les chiffres se vérifient en direct, dossier par dossier.",
    "kicker": "Parrit / Les dossiers",
    "title": "Les dossiers s'ouvrent de vive voix.",
    "sub": "Des systèmes commandés par des grands comptes, des PME et des ETI. Anonymisés par principe. Les chiffres se vérifient en direct.",
    "dossiers": [
      {
        "ref": "Dossier 26-003 · Une marque grand public",
        "title": "2,5 mois gagnés sur un seul processus de reporting.",
        "body": "Le reporting s'assemble et part à l'heure. L'équipe du client le fait tourner aujourd'hui.",
        "seal": "Livré · Aux mains du client"
      },
      {
        "ref": "Dossier 26-002 · Un cabinet d'avocats",
        "title": "De 5 à 10 K€ de plus par mois, sur des dossiers relancés.",
        "body": "L'arrivée des clients et les relances, refondues sur l'infrastructure du cabinet. Chiffre mesuré sur les briques en service.",
        "seal": "En construction · Premières briques en service"
      },
      {
        "ref": "Dossier 26-001 · Parrit.ai, notre propre système",
        "title": "Nous vendons le système qui nous fait tourner.",
        "body": "Plus de 200 signaux deviennent des décisions chaque semaine, reçus et arbitrés par le fondateur.",
        "seal": "En production · La valeur s'accumule"
      }
    ],
    "registry": "Le registre",
    "registryTitle": "D'autres dossiers restent scellés.",
    "note": "Ils se lisent en rendez-vous, avec l'accord du client.",
    "close": "Le prochain dossier pourrait être le vôtre.",
    "proof": "30 min · Un examen, avec le fondateur",
    "button": "Parlons-en"
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
