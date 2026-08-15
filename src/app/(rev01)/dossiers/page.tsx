import type { Metadata } from "next";
import Link from "next/link";

import { K, RegistryLine } from "@/system/components";

export const metadata: Metadata = {
  title: "System dossiers",
  description:
    "Sealed records of commissioned company operating systems — sectors, systems and verified results. The dossiers open in conversation.",
  alternates: { canonical: "/dossiers" },
};

const DOSSIERS = [
  {
    ref: "DOSSIER 26-001",
    sector: "PARRIT ITSELF",
    title: "The system we sell is the system we run.",
    body: "Parrit operates on its own operating system: one place where signals, clients and campaigns become decisions — delivered to the founder’s phone as cards. Built for ourselves first, compounding since.",
    value: "200+",
    result: "signals become decisions, every week",
    seal: "In production · Compounding",
  },
  {
    ref: "DOSSIER 26-002",
    sector: "A LAW FIRM",
    title: "An operating system for a law firm.",
    body: "Client intake, follow-ups and case flow — rebuilt as one system, on the firm’s own infrastructure. First capabilities certified and live; the system grows case by case.",
    value: "+€5–10K",
    result: "additional revenue per month, from re-engaged case flow",
    seal: "Under construction · First capabilities live",
  },
  {
    ref: "DOSSIER 26-003",
    sector: "A CONSUMER BRAND",
    title: "Reporting nobody writes.",
    body: "The reporting assembles itself from source systems and ships on schedule — run today by the client’s own team, without us. Owned, documented, handed over.",
    value: "2.5 months",
    result: "recovered on a single reporting process",
    seal: "Delivered · Operated by the client",
  },
] as const;

export default function DossiersPage() {
  return (
    <main className="rev-page r2-dark">
      <div className="r2-wrap">
        <header className="r2-hero">
          <K>Parrit / System dossiers</K>
          <h1>Sealed dossiers.</h1>
          <p className="r2-sub">
            Records of commissioned systems — anonymized by doctrine. Every figure below is
            verified live, in conversation.
          </p>
        </header>

        <section className="r2-section" aria-label="Dossiers">
          <div className="r2-dossiers">
            {DOSSIERS.map((dossier) => (
              <article className="r2-dossier" key={dossier.ref}>
                <div className="ref">
                  <K>{dossier.ref}</K>
                  <K>{dossier.sector}</K>
                </div>
                <h3>{dossier.title}</h3>
                <p>{dossier.body}</p>
                <div className="res">
                  <div className="v">{dossier.value}</div>
                  <div className="l">{dossier.result}</div>
                </div>
                <div className="seal">{dossier.seal}</div>
              </article>
            ))}
          </div>
          <p className="r2-registre-note">
            Also in the registry: a CRM an agency never touches by hand, outbound
            infrastructure end-to-end, and systems commissioned by maisons in cosmetics and
            craft retail. The dossiers open in conversation — not on a website.
          </p>
        </section>

        <section className="r2-close" aria-label="Commission">
          <h2>Your company could be the next dossier.</h2>
          <p className="proof">30 MIN · AN EXAMINATION, NOT A SALES CALL</p>
          <Link className="rev-button exec" href="/commission">
            Let’s talk
          </Link>
        </section>

        <footer className="r2-footer">
          <RegistryLine value="PARRIT / DOSSIERS · REV 01 · 2026" />
          <K>COMMISSIONED, NOT SUBSCRIBED</K>
          <K>© 2026 Parrit.ai</K>
        </footer>
      </div>
    </main>
  );
}
