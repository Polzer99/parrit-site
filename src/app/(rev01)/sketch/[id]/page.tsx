import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { lireEsquisse } from "@/lib/server/sketch";
import type { Interet } from "@/lib/server/interets";
import type { Locale } from "@/system/locale";
import { localizedPath } from "@/system/locale";
import { Instrument, K, RegistryLine, St } from "@/system/components";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Operating System · Sketch",
  robots: { index: false, follow: false, nocache: true },
};

type SketchContent = {
  title: string;
  intro: string;
  instrument: { value: string; label: string; status: string; critical?: boolean }[];
  next: string[];
};

/* Chaque intérêt déclaré reçoit son instrument : des lignes crédibles pour CE
   périmètre, pas un gabarit générique. Déterministe — aucun chiffre inventé
   n’est présenté comme réel : c’est une ESQUISSE, dite comme telle. */
const SKETCHES: Record<Locale, Partial<Record<Interet, SketchContent>>> = {
  en: {
    reporting: {
      title: "Reporting that writes itself.",
      intro: "A live model of your operations assembles the pack on schedule, traced to the line and reversible to the day. Nobody writes it, everybody reads it.",
      instrument: [
        { value: "MON 07:00", label: "the weekly pack assembled itself from source systems", status: "DONE" },
        { value: "3", label: "figures moved beyond tolerance, flagged with cause and source", status: "REVIEW", critical: true },
        { value: "0 h", label: "of manual assembly this week, or any week", status: "STANDING" },
      ],
      next: [
        "Examination maps your actual reporting flow: sources, owners, dead time.",
        "Construction rebuilds one pack end-to-end, certified, in production.",
        "Every later capability reads the same live model. Nothing is rebuilt twice.",
      ],
    },
    "client-flow": {
      title: "A client flow that never loses the thread.",
      intro: "Every client, every promise, every next step: one system that remembers, so nobody has to. Touched by hand only when a human decision is required.",
      instrument: [
        { value: "12", label: "open threads, each with its next step and its owner", status: "LIVE" },
        { value: "2", label: "commitments approaching their date, surfaced before they slip", status: "ACTION", critical: true },
        { value: "0", label: "clients waiting on a reply nobody saw", status: "STANDING" },
      ],
      next: [
        "Examination maps how clients actually enter, wait, and leave your pipeline.",
        "Construction rebuilds the critical path, from intake to commitment, as one system.",
        "The CRM becomes something you read, not something you fill.",
      ],
    },
    "mail-followups": {
      title: "Mail answered as doctrine.",
      intro: "Every inbound classified, drafted and journaled; every follow-up fired on time. You sign. The system remembers.",
      instrument: [
        { value: "23", label: "inbound mails classified and drafted since this morning", status: "DONE" },
        { value: "4", label: "follow-ups due today, drafted and waiting for your signature", status: "ACTION", critical: true },
        { value: "100%", label: "of threads journaled with author, time and rationale", status: "STANDING" },
      ],
      next: [
        "Examination reads a week of your real inbox flow: volumes, delays, drops.",
        "Construction ships the classifier and the draft doctrine, certified.",
        "Follow-ups stop depending on memory, yours or anyone's.",
      ],
    },
    "full-os": {
      title: "Your company. One system.",
      intro: "Orders, cash, operations, people, clients: one place to understand what is happening, decide what matters, and act. This sketch shows the first surface.",
      instrument: [
        { value: "3", label: "decisions require the executive this morning", status: "TODAY" },
        { value: "1", label: "exposure surfaced with its cause and the one decision it requires", status: "ACTION", critical: true },
        { value: "7", label: "actions executed overnight, journaled and reversible", status: "JOURNAL" },
      ],
      next: [
        "Examination maps flows, decisions and failure points as an engineering brief.",
        "Construction rebuilds one critical operation end-to-end, certified.",
        "Each capability joins the system; the value of every previous one increases.",
      ],
    },
  },
  fr: {
    reporting: {
      title: "Le reporting qui s'écrit tout seul.",
      intro: "Un modèle à jour de vos opérations assemble le rapport à l'heure prévue, tracé jusqu'à la ligne et réversible jusqu'au jour. Personne ne l'écrit. Tout le monde le lit.",
      instrument: [
        { value: "LUN 07:00", label: "le rapport de la semaine s'est assemblé seul depuis vos systèmes", status: "FAIT" },
        { value: "3", label: "chiffres sortis de la tolérance, signalés avec leur cause et leur source", status: "À TRANCHER", critical: true },
        { value: "0 h", label: "d'assemblage manuel cette semaine, comme toutes les autres", status: "ACQUIS" },
      ],
      next: [
        "L'Examen cartographie votre reporting réel : sources, responsables, temps mort.",
        "La Construction reconstruit un rapport de bout en bout, certifié, en production.",
        "Chaque capacité suivante lit le même modèle à jour. Rien n'est reconstruit deux fois.",
      ],
    },
    "client-flow": {
      title: "Un suivi client qui ne perd jamais le fil.",
      intro: "Chaque client, chaque promesse, chaque prochaine étape : un seul système qui s'en souvient, pour que personne n'ait à le faire. La main humaine n'intervient que pour une vraie décision.",
      instrument: [
        { value: "12", label: "dossiers ouverts, chacun avec sa prochaine étape et son responsable", status: "EN COURS" },
        { value: "2", label: "engagements qui approchent de leur date, signalés avant de glisser", status: "À TRANCHER", critical: true },
        { value: "0", label: "client en attente d'une réponse que personne n'a vue", status: "ACQUIS" },
      ],
      next: [
        "L'Examen cartographie comment vos clients entrent, attendent et sortent réellement de votre pipeline.",
        "La Construction reconstruit le chemin critique, de l'arrivée à l'engagement, en un seul système.",
        "Le CRM devient quelque chose que vous lisez, pas quelque chose que vous remplissez.",
      ],
    },
    "mail-followups": {
      title: "Le mail traité comme une doctrine.",
      intro: "Chaque message entrant classé, rédigé et consigné ; chaque relance part à l'heure. Vous signez. Le système se souvient.",
      instrument: [
        { value: "23", label: "mails entrants classés et rédigés depuis ce matin", status: "FAIT" },
        { value: "4", label: "relances dues aujourd'hui, rédigées et en attente de votre signature", status: "À TRANCHER", critical: true },
        { value: "100%", label: "des échanges consignés avec auteur, heure et motif", status: "ACQUIS" },
      ],
      next: [
        "L'Examen relit une semaine de votre boîte réelle : volumes, délais, oublis.",
        "La Construction livre le classeur et la doctrine de rédaction, certifiés.",
        "Les relances cessent de dépendre d'une mémoire, la vôtre ou celle de quelqu'un d'autre.",
      ],
    },
    "full-os": {
      title: "Votre entreprise. Un seul système.",
      intro: "Commandes, trésorerie, opérations, équipe, clients : un seul endroit pour comprendre ce qui se passe, décider ce qui compte, et agir. Cette esquisse montre la première surface.",
      instrument: [
        { value: "3", label: "décisions attendent le dirigeant ce matin", status: "AUJOURD'HUI" },
        { value: "1", label: "exposition signalée avec sa cause et la seule décision qu'elle exige", status: "À TRANCHER", critical: true },
        { value: "7", label: "actions exécutées cette nuit, consignées et réversibles", status: "JOURNAL" },
      ],
      next: [
        "L'Examen cartographie les flux, les décisions et les points de rupture, comme un cahier des charges technique.",
        "La Construction reconstruit une opération critique de bout en bout, certifiée.",
        "Chaque capacité rejoint le système ; la valeur de toutes les précédentes augmente.",
      ],
    },
  },
};

const CHROME = {
  en: {
    sectionKicker: (company: string, date: string) => `PARRIT / SKETCH · PREPARED FOR ${company.toUpperCase()} · ${date}`,
    instrumentLeft: (company: string) => `${company.toUpperCase()} / OS · SKETCH`,
    draft: "Draft 01",
    caption: "A SKETCH, NOT A PROMISE. THE REAL INSTRUMENT IS BUILT ON YOUR ACTUAL FLOWS.",
    nextHeading: "From sketch to system.",
    phasesLabel: "Three phases",
    phaseNames: ["Examination", "Construction", "Compounding"],
    closeTitle: "Fifteen minutes turns this sketch into a scope.",
    closeProof: "15 MIN · AN EXAMINATION, NOT A SALES CALL",
    talk: "Let's talk",
    registry: "PARRIT / SKETCH · DRAFT 01 · 2026",
    commissioned: "COMMISSIONED, NOT SUBSCRIBED",
  },
  fr: {
    sectionKicker: (company: string, date: string) => `PARRIT / ESQUISSE · PRÉPARÉ POUR ${company.toUpperCase()} · ${date}`,
    instrumentLeft: (company: string) => `${company.toUpperCase()} / OS · ESQUISSE`,
    draft: "Brouillon 01",
    caption: "UNE ESQUISSE, PAS UNE PROMESSE. LE VRAI INSTRUMENT SE CONSTRUIT SUR VOS FLUX RÉELS.",
    nextHeading: "De l'esquisse au système.",
    phasesLabel: "Trois phases",
    phaseNames: ["Examen", "Construction", "Capitalisation"],
    closeTitle: "Quinze minutes transforment cette esquisse en périmètre.",
    closeProof: "15 MIN · UN EXAMEN, PAS UN APPEL COMMERCIAL",
    talk: "Parlons-en",
    registry: "PARRIT / ESQUISSE · BROUILLON 01 · 2026",
    commissioned: "UNE COMMANDE, PAS UN ABONNEMENT",
  },
} as const;

export default async function SketchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const esquisse = await lireEsquisse(id).catch(() => null);
  if (!esquisse) notFound();

  const locale = esquisse.lang;
  const chrome = CHROME[locale];
  const sketch = SKETCHES[locale][esquisse.interet] ?? SKETCHES[locale]["full-os"]!;
  const company = esquisse.entreprise;
  const date = new Date(esquisse.declareLe).toISOString().slice(0, 10);

  return (
    <main className="rev-page r2-dark">
      <div className="r2-wrap">
        <header className="r2-hero sketch-hero">
          <K>{chrome.sectionKicker(company, date)}</K>
          <h1>{sketch.title}</h1>
          <p className="r2-sub">{sketch.intro}</p>
        </header>

        <section className="r2-instrument-stage" aria-label="Sketched instrument">
          <Instrument
            className="home-instrument"
            left={<St kind="crit">{chrome.instrumentLeft(company)}</St>}
            center={<K className="instrument-sep">·</K>}
            right={<K>{chrome.draft}</K>}
            rows={sketch.instrument.map((row) => ({
              value: row.value,
              label: row.label,
              status: (
                <K style={row.critical ? { color: "var(--accent-on-dark)" } : undefined}>{row.status}</K>
              ),
              critical: row.critical,
            }))}
          />
          <div className="r2-instrument-caption">
            <K>{chrome.caption}</K>
          </div>
        </section>

        <section className="r2-section" aria-labelledby="sketch-next-heading">
          <div className="r2-shead">
            <h2 className="r2-ed" id="sketch-next-heading">{chrome.nextHeading}</h2>
            <K>{chrome.phasesLabel}</K>
          </div>
          <div className="r2-phases">
            {sketch.next.map((step, index) => (
              <div className="r2-phase" key={step}>
                <div className="no">{`0${index + 1}`}</div>
                <div className="nm">{chrome.phaseNames[index] ?? ""}</div>
                <div className="ds">{step}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="r2-close" aria-label="Commission">
          <h2>{chrome.closeTitle}</h2>
          <p className="proof">{chrome.closeProof}</p>
          <Link className="rev-button exec" href={localizedPath("/commission", locale)}>{chrome.talk}</Link>
        </section>

        <footer className="r2-footer">
          <RegistryLine value={chrome.registry} />
          <K>{chrome.commissioned}</K>
          <K>© 2026 Parrit.ai</K>
        </footer>
      </div>
    </main>
  );
}
