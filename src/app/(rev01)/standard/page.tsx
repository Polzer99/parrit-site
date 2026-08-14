import type { Metadata } from "next";
import Link from "next/link";

import { K, RegistryLine } from "@/system/components";

export const metadata: Metadata = {
  title: "The Parrit Standard",
  description:
    "The six operating principles that govern every system commissioned and built by Parrit.",
};

const PRINCIPLES = [
  [
    "PS-01",
    "Observable",
    "The operator can determine the state of the system at any moment, without asking anyone.",
  ],
  [
    "PS-02",
    "Actionable",
    "Every surfaced piece of information leads to a possible action within the same view.",
  ],
  [
    "PS-03",
    "Traceable",
    "Every significant decision carries its origin: data, author, timestamp, rationale.",
  ],
  [
    "PS-04",
    "Reversible",
    "Every critical process has a documented path of return before it enters production.",
  ],
  [
    "PS-05",
    "Owned",
    "The client holds the system, its data and its documentation as company assets.",
  ],
  [
    "PS-06",
    "Compounding",
    "Each new capability increases the value of every capability already in production.",
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
          {PRINCIPLES.map(([code, name, definition]) => (
            <div className="doctrine-row" key={code}>
              <div className="doctrine-code">
                <K>{code}</K>
              </div>
              <div className="doctrine-name">{name}</div>
              <div className="doctrine-definition">{definition}</div>
            </div>
          ))}
          <div className="doctrine-foot">
            <span className="seal">Certified — Built to the Parrit Standard</span>
          </div>
        </section>

        <div className="standard-action">
          <Link className="rev-button" href="/commission">
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
