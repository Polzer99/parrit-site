import type { Metadata } from "next";

import { K, ParritCalInline, RegistryLine } from "@/system/components";

export const metadata: Metadata = {
  alternates: { canonical: "/commission" },
  title: "Commission your Operating System",
  description:
    "One conversation to examine how your company operates. The first step — an examination, not a sales call.",
};

export default function CommissionPage() {
  return (
    <main className="rev-page commission-page">
      <div className="rev-wrap">
        <header className="commission-header">
          <K>Parrit — Commission</K>
          <h1>Commission your Operating System.</h1>
          <p>
            One conversation to examine how your company operates. The first step — an
            examination, not a sales call.
          </p>
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
