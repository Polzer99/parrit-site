import type { Metadata } from "next";
import Link from "next/link";

import { getLocale } from "@/lib/server/locale";
import { K, RegistryLine } from "@/system/components";
import { localizedAlternates } from "@/system/locale";

const EN_DOSSIERS = [
  {
    ref: "DOSSIER 26-001",
    sector: "PARRIT ITSELF",
    title: "The system we sell is the system we run.",
    body: "Parrit.ai operates on its own operating system: one place where signals, clients and campaigns become decisions, delivered to the founder’s phone as cards. Built for ourselves first, compounding since.",
    value: "200+",
    result: "signals become decisions, every week",
    seal: "In production · Compounding",
  },
  {
    ref: "DOSSIER 26-002",
    sector: "A LAW FIRM",
    title: "An operating system for a law firm.",
    body: "Client intake, follow-ups and case flow, rebuilt as one system on the firm’s own infrastructure. First capabilities certified and live; the system grows case by case.",
    value: "+€5\u201310K",
    result: "additional revenue per month, from re-engaged case flow",
    seal: "Under construction · First capabilities live",
  },
  {
    ref: "DOSSIER 26-003",
    sector: "A CONSUMER BRAND",
    title: "Reporting nobody writes.",
    body: "The reporting assembles itself from source systems and ships on schedule. It is run today by the client’s own team, without us. Owned, documented, handed over.",
    value: "2.5 months",
    result: "recovered on a single reporting process",
    seal: "Delivered · Operated by the client",
  },
] as const;

const FR_DOSSIERS = [
  { ref: "DOSSIER 26-001", sector: "PARRIT", title: "Nous vendons le système qui nous fait tourner.", body: "Parrit.ai tourne sur son propre système d'exploitation : un seul endroit où les signaux, les clients et les campagnes deviennent des décisions, qui arrivent en cartes sur le téléphone du fondateur. Construit pour nous d'abord. Depuis, la valeur s'accumule.", value: "200+", result: "signaux deviennent des décisions chaque semaine", seal: "En production · La valeur s'accumule" },
  { ref: "DOSSIER 26-002", sector: "UN CABINET D'AVOCATS", title: "Un système d'exploitation pour un cabinet d'avocats.", body: "L'arrivée des nouveaux clients, les relances et la circulation des dossiers, refondues en un seul système sur l'infrastructure du cabinet. Les premières briques sont certifiées et en service. Le système grandit dossier après dossier.", value: "+5 à 10 K€", result: "de chiffre d'affaires en plus chaque mois, sur des dossiers relancés", seal: "En construction · Premières briques en service" },
  { ref: "DOSSIER 26-003", sector: "UNE MARQUE GRAND PUBLIC", title: "Le reporting que personne ne rédige.", body: "Le reporting s'assemble seul à partir des systèmes sources et part à l'heure. L'équipe du client le fait tourner aujourd'hui, sans nous. Documenté, transmis. À eux.", value: "2,5 mois", result: "gagnés sur un seul processus de reporting", seal: "Livré · Aux mains du client" },
] as const;

const DICT = {
  en: { metaTitle: "System dossiers", metaDescription: "Sealed records of commissioned company operating systems: sectors, systems and verified results. The dossiers open in conversation.", kicker: "Parrit / System dossiers", title: "Sealed dossiers.", sub: "Records of commissioned systems, anonymized by doctrine. Every figure below is verified live, in conversation.", dossiers: EN_DOSSIERS, note: "Also among the dossiers: a CRM an agency never touches by hand, outbound infrastructure end-to-end, and systems commissioned by maisons in cosmetics and craft retail. The dossiers open in conversation, not on a website.", close: "Your company could be the next dossier.", proof: "30 MIN · AN EXAMINATION, NOT A SALES CALL", button: "Let’s talk", status: "COMMISSIONED, NOT SUBSCRIBED" },
  fr: { metaTitle: "Les dossiers", metaDescription: "Archives scellées : des systèmes d'exploitation commandés par des entreprises, leurs secteurs, leurs résultats vérifiés. Les dossiers s'ouvrent de vive voix.", kicker: "Parrit / Les dossiers", title: "Dossiers scellés.", sub: "Les archives des systèmes commandés, anonymisées par principe. Chaque chiffre ci-dessous se vérifie en direct, de vive voix.", dossiers: FR_DOSSIERS, note: "Les dossiers contiennent aussi : un CRM qu'une agence ne touche jamais à la main, une infrastructure de prospection de bout en bout, des systèmes commandés par des marques de cosmétique et de commerce artisanal. Les dossiers, et des références avec l'accord du client, s'ouvrent de vive voix. Pas sur un site.", close: "Le prochain dossier pourrait être le vôtre.", proof: "30 MIN · UN EXAMEN, PAS UN RENDEZ-VOUS COMMERCIAL", button: "Parlons-en", status: "UNE COMMANDE, PAS UN ABONNEMENT" },
} as const;

export async function generateMetadata(): Promise<Metadata> { const copy = DICT[await getLocale()]; return { title: copy.metaTitle, description: copy.metaDescription, alternates: localizedAlternates("/dossiers") }; }

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
                  <K>{dossier.sector}</K>
                </div>
                <h3>{dossier.title}</h3>
                <p>{dossier.body}</p>
                <div className="res">
                  <div className="v">{dossier.value}</div>
                  <div className="l">{dossier.result}</div>
                </div>
                <div className="seal">{dossier.seal}</div>
              </article>
            ))}
          </div>
          <p className="r2-registre-note">{copy.note}</p>
        </section>

        <section className="r2-close" aria-label="Commission">
          <h2>{copy.close}</h2>
          <p className="proof">{copy.proof}</p>
          <Link className="rev-button exec" href="/commission">
            {copy.button}
          </Link>
        </section>

        <footer className="r2-footer">
          <RegistryLine value="PARRIT / DOSSIERS · REV 01 · 2026" />
          <K>{copy.status}</K>
          <K>© 2026 Parrit.ai</K>
        </footer>
      </div>
    </main>
  );
}
