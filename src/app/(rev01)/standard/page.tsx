import type { Metadata } from "next";
import Link from "next/link";

import { K, RegistryLine } from "@/system/components";

export const metadata: Metadata = {
  alternates: { canonical: "/standard" },
  title: "The Parrit Standard",
  description:
    "The six operating principles that govern every system commissioned and built by Parrit.",
};

const PRINCIPLES = [
  [
    "PS-01",
    "Observable",
    "The operator can determine the state of the system at any moment, without asking anyone.",
    "The operator reads the state of a live dossier at any moment — no meeting, no export, no asking anyone.",
  ],
  [
    "PS-02",
    "Actionable",
    "Every surfaced piece of information leads to a possible action within the same view.",
    "A blocked order surfaces with its cause, its exposure and the one decision required — in the same card.",
  ],
  [
    "PS-03",
    "Traceable",
    "Every significant decision carries its origin: data, author, timestamp, rationale.",
    "The journal records author, timestamp, source and rationale for every decision. The journal is the audit.",
  ],
  [
    "PS-04",
    "Reversible",
    "Every critical process has a documented path of return before it is put into production.",
    "An automated action can be halted and unwound to the last human decision — the path back is documented before go-live.",
  ],
  [
    "PS-05",
    "Owned",
    "The client holds the system, its data and its documentation as company assets.",
    "Code, data and documentation are handed over as company assets. The client's team operates the system without us.",
  ],
  [
    "PS-06",
    "Compounding",
    "Each new capability increases the value of every capability already in production.",
    "The reporting built in phase one feeds the follow-up system built in phase two. Each addition raises the value of the last.",
  ],
] as const;

export default function StandardPage() {
  return (
    <main className="rev-page">
      <div className="rev-wrap">
        <header className="standard-intro">
          <K>Parrit / Specification</K>
          <h1>Every system we deliver is certified to the same specification.</h1>
        </header>

        <section className="doctrine" aria-label="The Parrit Standard specification">
          <div className="doctrine-head">
            <K>The Parrit Standard</K>
            <K>Specification · STD-1.0 · 2026</K>
          </div>
          {PRINCIPLES.map(([code, name, definition, example]) => (
            <div className="doctrine-row" key={code}>
              <div className="doctrine-code">
                <K>{code}</K>
              </div>
              <div className="doctrine-name">{name}</div>
              <div className="doctrine-definition">
                {definition}
                <span className="doctrine-example">
                  <b>In practice</b>
                  {example}
                </span>
              </div>
            </div>
          ))}
          <div className="doctrine-foot">
            <span className="seal">Certified — Built to the Parrit Standard</span>
          </div>
        </section>

        <div className="standard-action">
          <Link className="rev-button exec" href="/commission">
            Commission your Operating System
          </Link>
        </div>

        <footer className="rev-footer">
          <RegistryLine />
        </footer>
      </div>
    </main>
  );
}
