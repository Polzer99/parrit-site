import type { Metadata } from "next";

import { COMMISSIONING } from "@/system/commissioning";
import { K, ParritCalInline, RegistryLine } from "@/system/components";

export const metadata: Metadata = {
  title: "Commission an examination",
  description:
    "Commission a 45-minute examination of how your company operates and where its first operating system should begin.",
};

export default function CommissionPage() {
  return (
    <main className="rev-page">
      <div className="rev-wrap">
        <header className="commission-header">
          <K>Parrit / Commission</K>
          <h1>Commission an examination.</h1>
          <p>
            The first step is a working session on how your company actually operates. We
            examine the flows, decisions, tools and failure points that should shape its first
            system.
          </p>
        </header>

        <section className="rev-section" aria-labelledby="commissioning-heading">
          <div className="rev-section-head">
            <h2 id="commissioning-heading">Commissioned, not subscribed</h2>
            <K>Examination / Construction / Compounding</K>
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

        <section className="commission-calendar" aria-labelledby="calendar-heading">
          <div className="rev-section-head">
            <h2 id="calendar-heading">Select a time</h2>
            <K>30 min · Visio</K>
          </div>
          <ParritCalInline />
        </section>

        <footer className="rev-footer">
          <RegistryLine />
        </footer>
      </div>
    </main>
  );
}
