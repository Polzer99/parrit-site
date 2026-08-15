import type { Metadata } from "next";

import { K, ParritCalInline, RegistryLine } from "@/system/components";

export const metadata: Metadata = {
  alternates: { canonical: "/commission" },
  title: "Commission your operating system",
  description:
    "One conversation to examine how your company operates. The first step — an examination, not a sales call.",
};

export default function CommissionPage() {
  return (
    <main className="rev-page commission-page">
      <div className="rev-wrap">
        <header className="commission-header">
          <K>Parrit / Commission</K>
          <h1>Commission your operating system.</h1>
          <p>
            One conversation to examine how your company operates. The first step — an
            examination, not a sales call.
          </p>
          <div className="commission-notes">
            <p>
              <b>Who you meet.</b> Paul Larmaraud, the founder — the person who builds the
              systems, not a sales team. Figures from the dossiers are verified live, on
              screen.
            </p>
            <p>
              <b>What you leave with.</b> An honest read of your operations: either a
              written scope for an Examination, or a clear no if we are not the right
              maison for it.
            </p>
            <p>
              <b>What it commits you to.</b> Nothing. Scope and terms are set in writing
              after the conversation, before any engagement — walking away costs nothing
              and requires no explanation.
            </p>
          </div>
        </header>

        <section className="commission-instrument" aria-label="Select a time">
          <ParritCalInline />
        </section>

        <footer className="rev-footer">
          <RegistryLine />
        </footer>
      </div>
    </main>
  );
}
