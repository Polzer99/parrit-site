import type { Metadata } from "next";
import Link from "next/link";

import { Instrument, K, RegistryLine, St } from "@/system/components";

export const metadata: Metadata = {
  title: "Company operating systems",
};

const LOOP = [
  {
    label: "UNDERSTAND",
    body: "The system maintains a live model of the company: orders, cash, operations, people, clients — provenance on every number.",
  },
  {
    label: "DECIDE",
    body: "Only what requires the executive reaches the executive. Framed, sourced, quantified, with its path of return documented.",
    critical: true,
  },
  {
    label: "ACT",
    body: "A decision executes through the same system that surfaced it — held, committed, journaled.",
  },
] as const;

const COMMISSIONING = [
  {
    label: "01 — EXAMINATION",
    title: "We study how your company actually operates.",
    body: "Not a workshop. A diagnostic of flows, decisions and failure points, documented as an engineering brief.",
  },
  {
    label: "02 — CONSTRUCTION",
    title: "We build the first system into production.",
    body: "One critical operation, rebuilt end-to-end and certified to the Parrit Standard before anything else begins.",
  },
  {
    label: "03 — COMPOUNDING",
    title: "Each capability joins the Operating System.",
    body: "The system grows with the company. You own it — code, data, documentation — as company infrastructure.",
  },
] as const;

export default function HomePage() {
  return (
    <main className="rev-page">
      <div className="rev-wrap rev-home-wrap">
        <header className="rev-hero">
          <K>Parrit — Company operating systems</K>
          <h1>Your company. One system.</h1>
          <p>
            Parrit designs and builds the operating system your company runs on: one place
            to understand what is happening, decide what matters and act — down to your
            phone.
          </p>
          <div className="rev-actions">
            <Link className="rev-button" href="/commission">
              Commission your Operating System
            </Link>
            <Link className="rev-button ghost" href="/standard">
              Examine a system
            </Link>
          </div>
        </header>

        <section className="instrument-stage" aria-label="Operating system instrument">
          <Instrument
            className="home-instrument"
            left={<St kind="crit">PARRIT / OS — LIVE DEMO</St>}
            center={<K>·</K>}
            right={<K>Tue 09:14</K>}
            rows={[
              {
                value: "3",
                label: "decisions require attention",
                status: <K>Today</K>,
              },
              {
                value: "€1.2M",
                label: "at risk on blocked orders",
                status: <K style={{ color: "var(--red)" }}>Action required</K>,
                critical: true,
              },
              {
                value: "7",
                label: "actions executed overnight",
                status: <K>Journal</K>,
              },
            ]}
          />
          <div className="instrument-caption">
            <K>THE OPERATING SYSTEM — SURFACED. COMPLEXITY ABSORBED UNDERNEATH.</K>
          </div>
        </section>

        <section className="rev-section" aria-labelledby="loop-heading">
          <div className="rev-section-head">
            <h2 id="loop-heading">One operating loop</h2>
            <K>Screen 02</K>
          </div>
          <div className="operating-loop">
            {LOOP.map((item) => (
              <article key={item.label}>
                <h3 className={"critical" in item && item.critical ? "critical" : undefined}>
                  {item.label}
                </h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rev-section" aria-labelledby="commissioning-heading">
          <div className="rev-section-head">
            <h2 id="commissioning-heading">Commissioned, not subscribed</h2>
            <K>Screen 03</K>
          </div>
          <div className="commissioning-grid">
            {COMMISSIONING.map((item) => (
              <article key={item.label}>
                <K>{item.label}</K>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <Link className="rev-journal-link k" href="/journal">
            Read the journal
          </Link>
        </section>

        <footer className="rev-footer home-footer">
          <RegistryLine />
          <Link className="k" href="/legal">
            /Legal
          </Link>
          <K>© 2026 Parrit.ai</K>
        </footer>
      </div>
    </main>
  );
}
