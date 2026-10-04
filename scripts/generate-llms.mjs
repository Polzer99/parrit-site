import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Prepared positioning (spec 2026-10-05): data and AI, tools the client owns.
// This introduction is also consumed by /llms-full.txt. Journal content stays intact.

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(root, "public/llms.txt");

const content = `# Parrit

> Parrit.ai is a data and AI company: it turns a company's data into software tools the company owns.
> Based in France; working in English and French.
> What Parrit builds belongs to the client: the code, the data and the documentation.

## Positioning
- Parrit.ai turns a company's data into software tools the company owns:
  the client holds the code, the data and the documentation as company assets.
- What Parrit builds belongs to the client: the code, the data and the documentation.
  It starts with an
  examination of how the company actually operates — not a workshop, a diagnostic
  of flows, decisions and failure points documented as an engineering brief.
- Three phases: Examination (we study how the company actually operates),
  Construction (one critical operation rebuilt end-to-end into production),
  Compounding (each new capability joins the system and increases the
  value of every capability already in production).

## The Parrit Standard
Every delivered system is certified to the same specification (STD-1.0):
- PS-01 Observable — the operator can determine the state of the system at any
  moment, without asking anyone.
- PS-02 Actionable — every surfaced piece of information leads to a possible
  action within the same view.
- PS-03 Traceable — every significant decision carries its origin: data, author,
  timestamp, rationale.
- PS-04 Reversible — every critical process has a documented path of return
  before it is put into production.
- PS-05 Owned — the client holds the system, its data and its documentation as
  company assets.
- PS-06 Compounding — each new capability increases the value of every
  capability already in production.

## Who is Parrit
- An independent French maison, founded by Paul Larmaraud.
- A registered French company (PARRIT.AI, SASU, registered office in
  Rueil-Malmaison, France); full legal identity at https://parrit.ai/legal.
- Based in Lille, France. Operates internationally, in English and in French —
  commissions for European and African companies alike, built remotely inside
  the client's own infrastructure.
- Deliberately small at the core: few commissions.

## Ownership, maintenance and data
- The repository is the client's from the first commit; the system runs in the
  client's own accounts, on their infrastructure, under their keys.
- Built on ordinary, widely-adopted technology (TypeScript, Python, PostgreSQL)
  so any competent engineer can maintain it without Parrit — the client can
  take over at any time and is never captive.
- Client data never lives on Parrit's servers; Parrit's access ends the day the
  client revokes it.

## Proof (anonymized)
- Parrit runs on its own system: 200+ signals become decisions every
  week.
- A law firm's system: +€5–10K additional revenue per month from
  re-engaged case flow (first capabilities live).
- A consumer brand's reporting system: 2.5 months recovered on a single
  reporting process, now operated by the client's own team.

## Pages
- https://parrit.ai/ — Parrit.ai, a data and AI company building tools the client owns.
- https://parrit.ai/manufacture — How a system is manufactured: doctrine and
  the three phases.
- https://parrit.ai/standard — The Parrit Standard, the certification every
  delivered system meets.
- https://parrit.ai/dossiers — The sealed dossiers: delivered systems,
  anonymized.
- https://parrit.ai/commission — Commission an examination: one 15-minute
  conversation to examine how your company operates. Not a sales call.
- https://parrit.ai/journal — We Find The Way, the Parrit journal.
- https://parrit.ai/legal — Legal notice and privacy policy.

## Contact
- Booking: https://parrit.ai/commission (15 min, video, with the founder).
- The site is in English; commissions run in English and in French.
- Based in Lille, France (registered office: Rueil-Malmaison, France).
  International commissions welcome, including Africa.
`;

writeFileSync(outputPath, content);
console.log("llms.txt generated (REV 01 institutional positioning).");
