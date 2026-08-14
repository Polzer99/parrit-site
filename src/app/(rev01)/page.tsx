import type { Metadata } from "next";
import Link from "next/link";

import { Instrument, K, RegistryLine, St } from "@/system/components";
import { COMMISSIONING } from "@/system/commissioning";

export const metadata: Metadata = {
  title: "Company operating systems",
};

const LOOP = [
  {
    label: "Understand",
    title: "See the company as it operates.",
    body: "The system maintains a sourced view of operations, cash, clients and work in motion. The state is visible without a chain of requests.",
  },
  {
    label: "Decide",
    title: "Frame what requires a decision.",
    body: "Only material exceptions reach the operator, with their source, rationale and documented path of return.",
  },
  {
    label: "Act",
    title: "Execute in the same system.",
    body: "Approved actions run through the system that surfaced them. Each action is recorded in a shared journal.",
  },
] as const;

export default function HomePage() {
  return (
    <main className="rev-page">
      <div className="rev-wrap">
        <header className="rev-hero">
          <K>Parrit / Company operating systems</K>
          <h1>Your company. One operating system.</h1>
          <p>
            Parrit builds and operates the systems that let a company understand what is
            happening, decide what matters and act from one line of record.
          </p>
          <div className="rev-actions">
            <Link className="rev-button" href="/commission">
              Commission an examination
            </Link>
            <Link className="rev-button ghost" href="/standard">
              Examine the standard
            </Link>
          </div>
        </header>

        <section className="instrument-stage" aria-label="Operating system instrument">
          <Instrument
            left={<St kind="ok">Operational</St>}
            center={<K>Parrit / Operating system</K>}
            right={<K>Live state</K>}
            rows={[
              {
                value: "Back office",
                label: "critical internal operations monitored in one system",
                status: <K>Observable</K>,
              },
              {
                value: "Revenue",
                label: "market signals and commercial actions connected to execution",
                status: <K>Actionable</K>,
                critical: true,
              },
              {
                value: "Journal",
                label: "decisions and actions recorded with their origin",
                status: <K>Traceable</K>,
              },
            ]}
          />
          <div className="instrument-caption">
            <K>The company surfaced. Complexity absorbed underneath.</K>
          </div>
        </section>

        <section className="rev-section" aria-labelledby="loop-heading">
          <div className="rev-section-head">
            <h2 id="loop-heading">One operating loop</h2>
            <K>Screen 02</K>
          </div>
          <div className="three-column">
            {LOOP.map((item) => (
              <article key={item.label}>
                <K>{item.label}</K>
                <h3>{item.title}</h3>
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
          <div className="three-column">
            {COMMISSIONING.map((item) => (
              <article key={item.label}>
                <K>{item.label}</K>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rev-section" aria-labelledby="operators-heading">
          <div className="rev-section-head">
            <h2 id="operators-heading">The operators</h2>
            <K>Human faces / text-only</K>
          </div>
          <div className="faces">
            <Link className="face" href="/paul">
              <K>Founder · Operating partner</K>
              <strong>Paul Larmaraud</strong>
              <K>Profile to follow</K>
            </Link>
            <Link className="face" href="/maxime">
              <K>Partner · Operating systems</K>
              <strong>Maxime</strong>
              <K>Profile to follow</K>
            </Link>
          </div>
        </section>

        <footer className="rev-footer">
          <RegistryLine />
        </footer>
      </div>
    </main>
  );
}
