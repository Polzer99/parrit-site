import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { lireEsquisse } from "@/lib/server/sketch";
import type { Interet } from "@/lib/server/interets";
import { Instrument, K, RegistryLine, St } from "@/system/components";
import { SketchBoot } from "@/system/components/SketchBoot";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Operating System — Sketch",
  robots: { index: false, follow: false, nocache: true },
};

/* Chaque intérêt déclaré reçoit son instrument : des lignes crédibles pour CE
   périmètre, pas un gabarit générique. Déterministe — aucun chiffre inventé
   n'est présenté comme réel : c'est une ESQUISSE, dite comme telle. */
const SKETCHES: Record<
  Interet,
  {
    title: string;
    intro: string;
    instrument: { value: string; label: string; status: string; critical?: boolean }[];
    next: string[];
  }
> = {
  reporting: {
    title: "Reporting that writes itself.",
    intro:
      "A live model of your operations assembles the pack on schedule — traced to the line, reversible to the day. Nobody writes it, everybody reads it.",
    instrument: [
      { value: "MON 07:00", label: "the weekly pack assembled itself from source systems", status: "DONE" },
      { value: "3", label: "figures moved beyond tolerance — flagged with cause and source", status: "REVIEW", critical: true },
      { value: "0 h", label: "of manual assembly this week, or any week", status: "STANDING" },
    ],
    next: [
      "Examination maps your actual reporting flow: sources, owners, dead time.",
      "Construction rebuilds one pack end-to-end, certified, in production.",
      "Every later capability reads the same live model — nothing is rebuilt twice.",
    ],
  },
  "client-flow": {
    title: "A client flow that never loses the thread.",
    intro:
      "Every client, every promise, every next step — one system that remembers, so nobody has to. Touched by hand only when a human decision is required.",
    instrument: [
      { value: "12", label: "open threads, each with its next step and its owner", status: "LIVE" },
      { value: "2", label: "commitments approaching their date — surfaced before they slip", status: "ACTION", critical: true },
      { value: "0", label: "clients waiting on a reply nobody saw", status: "STANDING" },
    ],
    next: [
      "Examination maps how clients actually enter, wait, and leave your pipeline.",
      "Construction rebuilds the critical path — intake to commitment — as one system.",
      "The CRM becomes something you read, not something you fill.",
    ],
  },
  "mail-followups": {
    title: "Mail answered as doctrine.",
    intro:
      "Every inbound classified, drafted and journaled; every follow-up fired on time. You sign — the system remembers.",
    instrument: [
      { value: "23", label: "inbound mails classified and drafted since this morning", status: "DONE" },
      { value: "4", label: "follow-ups due today — drafted, waiting for your signature", status: "ACTION", critical: true },
      { value: "100%", label: "of threads journaled with author, time and rationale", status: "STANDING" },
    ],
    next: [
      "Examination reads a week of your real inbox flow: volumes, delays, drops.",
      "Construction ships the classifier and the draft doctrine, certified.",
      "Follow-ups stop depending on memory — yours or anyone's.",
    ],
  },
  "full-os": {
    title: "Your company. One system.",
    intro:
      "Orders, cash, operations, people, clients — one place to understand what is happening, decide what matters, and act. This sketch shows the first surface.",
    instrument: [
      { value: "3", label: "decisions require the executive this morning", status: "TODAY" },
      { value: "€ —", label: "exposure surfaced with cause and the one decision required", status: "ACTION", critical: true },
      { value: "7", label: "actions executed overnight, journaled and reversible", status: "JOURNAL" },
    ],
    next: [
      "Examination maps flows, decisions and failure points as an engineering brief.",
      "Construction rebuilds one critical operation end-to-end, certified.",
      "Each capability joins the system; the value of every previous one increases.",
    ],
  },
};

export default async function SketchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const esquisse = await lireEsquisse(id).catch(() => null);
  if (!esquisse) notFound();

  const sketch = SKETCHES[esquisse.interet] ?? SKETCHES["full-os"];
  const company = esquisse.entreprise;

  return (
    <>
      <SketchBoot company={company} />
      <main className="rev-page r2-dark">
        <div className="r2-wrap">
          <header className="r2-hero sketch-hero">
            <K>
              PARRIT / SKETCH · PREPARED FOR {company.toUpperCase()} ·{" "}
              {new Date(esquisse.declareLe).toISOString().slice(0, 10)}
            </K>
            <h1>{sketch.title}</h1>
            <p className="r2-sub">{sketch.intro}</p>
          </header>

          <section className="r2-instrument-stage" aria-label="Sketched instrument">
            <Instrument
              className="home-instrument"
              left={<St kind="crit">{`${company.toUpperCase()} / OS — SKETCH`}</St>}
              center={<K>·</K>}
              right={<K>Draft 01</K>}
              rows={sketch.instrument.map((row) => ({
                value: row.value,
                label: row.label,
                status: (
                  <K style={row.critical ? { color: "var(--red)" } : undefined}>{row.status}</K>
                ),
                critical: row.critical,
              }))}
            />
            <div className="r2-instrument-caption">
              <K>A SKETCH, NOT A PROMISE — THE REAL INSTRUMENT IS BUILT ON YOUR ACTUAL FLOWS.</K>
            </div>
          </section>

          <section className="r2-section" aria-labelledby="sketch-next-heading">
            <div className="r2-shead">
              <h2 className="r2-ed" id="sketch-next-heading">
                From sketch to system.
              </h2>
              <K>Three phases</K>
            </div>
            <div className="r2-phases">
              {sketch.next.map((step, index) => (
                <div className="r2-phase" key={step}>
                  <div className="no">{`0${index + 1}`}</div>
                  <div className="nm">
                    {["Examination", "Construction", "Compounding"][index] ?? ""}
                  </div>
                  <div className="ds">{step}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="r2-close" aria-label="Commission">
            <h2>Thirty minutes turns this sketch into a scope.</h2>
            <p className="proof">30 MIN · AN EXAMINATION, NOT A SALES CALL</p>
            <Link className="rev-button exec" href="/commission">
              Let&apos;s talk
            </Link>
          </section>

          <footer className="r2-footer">
            <RegistryLine value="PARRIT / SKETCH · DRAFT 01 · 2026" />
            <K>COMMISSIONED, NOT SUBSCRIBED</K>
            <K>© 2026 Parrit.ai</K>
          </footer>
        </div>
      </main>
    </>
  );
}
