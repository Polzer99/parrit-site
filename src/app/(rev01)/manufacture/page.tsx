import type { Metadata } from "next";
import Link from "next/link";

import { K, RegistryLine } from "@/system/components";

export const metadata: Metadata = {
  title: "The Manufacture",
  description:
    "How Parrit designs and builds a company operating system: examination, construction, compounding — one company at a time, certified to the Parrit Standard.",
  alternates: { canonical: "/manufacture" },
};

const PRINCIPLES = [
  {
    name: "One company at a time",
    body: "A system is built against how your company actually operates — its flows, its decisions, its exceptions. Not against how software vendors assume a company should work. Each commission is led hands-on by one of our partners, which is why we do not take every one.",
  },
  {
    name: "Production before promises",
    body: "Construction targets one critical operation, rebuilt end-to-end and certified in production before anything else begins. A system that only exists in slides is not a system.",
  },
  {
    name: "The executive decides, the system executes",
    body: "Only what requires the executive reaches the executive — framed, sourced, quantified. The decision then executes through the same system that surfaced it: traced, reversible, journaled.",
  },
  {
    name: "Built in your perimeter",
    body: "The system is built in your accounts, on your infrastructure, under your keys — from the first day, not at handover. Your data never lives on Parrit’s servers, and our access ends the day you revoke it. Security is not a clause in a contract; it is where the system physically lives.",
  },
  {
    name: "Owned, not rented",
    body: "Everything you receive is yours: code, data, documentation — handed over as company assets. The repository is yours from the first commit, and the system is built on ordinary, widely-adopted technology (TypeScript, Python, PostgreSQL), so any competent engineer can maintain it without us. Commissioned, not subscribed: if Parrit disappears tomorrow, your system does not.",
  },
] as const;

const PHASES = [
  {
    no: "01",
    name: "Examination",
    body: "A diagnostic of flows, decisions and failure points, documented as an engineering brief. It fixes the scope, the first operation to rebuild, and the criteria of success — before any commitment.",
  },
  {
    no: "02",
    name: "Construction",
    body: "The first critical operation is rebuilt end-to-end on your infrastructure and certified to the Parrit Standard. It runs in production, with real users and real stakes, before anything else begins.",
  },
  {
    no: "03",
    name: "Compounding",
    body: "Each new capability joins the operating system and increases the value of every previous one. The system grows with the company — and the company keeps owning all of it.",
  },
] as const;

export default function ManufacturePage() {
  return (
    <main className="rev-page r2-dark">
      <div className="r2-wrap">
        <header className="r2-hero">
          <K>Parrit / The Manufacture</K>
          <h1>Manufactured, not installed.</h1>
          <p className="r2-sub">
            How a company operating system is actually built — and why it cannot be bought
            off the shelf.
          </p>
        </header>

        <section className="r2-section" aria-labelledby="principles-heading">
          <div className="r2-shead">
            <h2 className="r2-ed" id="principles-heading">
              The doctrine.
            </h2>
            <K>5 principles</K>
          </div>
          <div className="r2-faq">
            {PRINCIPLES.map((principle) => (
              <div className="r2-qa" key={principle.name}>
                <div className="q">{principle.name}</div>
                <div className="a">{principle.body}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="r2-section" aria-labelledby="phases-heading">
          <div className="r2-shead">
            <h2 className="r2-ed" id="phases-heading">
              Three phases.
            </h2>
            <K>Examination → Construction → Compounding</K>
          </div>
          <div className="r2-phases">
            {PHASES.map((phase) => (
              <div className="r2-phase" key={phase.no}>
                <div className="no">{phase.no}</div>
                <div className="nm">{phase.name}</div>
                <div className="ds">{phase.body}</div>
              </div>
            ))}
          </div>
          <p className="r2-registre-note">
            Every phase ships against the{" "}
            <Link className="k" href="/standard">
              Parrit Standard
            </Link>{" "}
            — six criteria, the same for every system we deliver.
          </p>
        </section>

        <section className="r2-close" aria-label="Commission">
          <h2>The Examination comes first. Commission it.</h2>
          <p className="proof">30 MIN · AN EXAMINATION, NOT A SALES CALL</p>
          <Link className="rev-button exec" href="/commission">
            Let’s talk
          </Link>
        </section>

        <footer className="r2-footer">
          <RegistryLine value="PARRIT / MANUFACTURE · REV 01 · 2026" />
          <K>COMMISSIONED, NOT SUBSCRIBED</K>
          <Link className="k" href="/legal">
            /Legal
          </Link>
          <K>© 2026 Parrit.ai</K>
        </footer>
      </div>
    </main>
  );
}
