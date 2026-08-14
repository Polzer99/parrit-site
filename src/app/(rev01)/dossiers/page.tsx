import type { Metadata } from "next";

import { K, RegistryLine } from "@/system/components";

export const metadata: Metadata = {
  title: "System dossiers",
  description: "Published records of commissioned company systems.",
  robots: { index: false, follow: false, nocache: true },
};

export default function DossiersPage() {
  return (
    <main className="rev-page">
      <div className="rev-wrap dossiers-wrap">
        <header className="dossiers-header">
          <K>Parrit / System dossiers</K>
          <h1>System dossiers.</h1>
        </header>

        <section className="dossiers-empty" aria-labelledby="dossiers-empty-heading">
          <K>Status · No approved dossiers</K>
          <h2 id="dossiers-empty-heading">No dossiers published.</h2>
          <p>System dossiers are published once a client has approved their release.</p>
        </section>

        <footer className="rev-footer">
          <RegistryLine value="PARRIT / DOSSIERS · REV 01 · 2026" />
        </footer>
      </div>
    </main>
  );
}
