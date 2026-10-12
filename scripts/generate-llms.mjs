import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// REV 01 (14/08/2026): llms.txt states the institutional positioning of the live
// site : data and AI, commissioned not subscribed. The previous
// generator emitted the pre-REV01 positioning (virtual collaborators catalog),
// which contradicted every page served. Content is static by design: it must
// only change when the site's positioning changes.

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(root, "public/llms.txt");

const content = `# Parrit

> Parrit.ai is an independent French data and AI firm. We turn a company's data into tools it owns, built in its own accounts and documented.

## Positioning
- Parrit builds systems as owned infrastructure:
  the client holds the code, the data and the documentation as company assets.
- Each engagement starts with an examination of how the company actually operates: flows, decisions and failure points documented as an engineering brief.
- Three phases: Examination (we study how the company actually operates),
  Construction (one critical operation rebuilt end-to-end into production),
  Compounding (each new capability joins the system and increases the
  value of every capability already in production).

## The Parrit Standard
Each system delivered from now on is checked against the Standard, Parrit.ai's internal check, with no external accreditation.
- 01: State is readable at any moment.
- 02: Every signal carries its decision.
- 03: A decision always keeps its origin.
- 04: Rolling back is written in advance.
- 05: The system belongs to you.
- 06: Each new capability reuses what already exists.

## Who is Parrit
- An independent French maison.
- A registered French company (PARRIT.AI, SAS, registered office in
  Rueil-Malmaison, France); full legal identity at https://parrit.ai/legal.
- Operates internationally, in English and in French :
  commissions for European and African companies alike, built remotely inside
  the client's own infrastructure.
- Deliberately small at the core: few commissions.

## Ownership, maintenance and data
- By design, the repository is the client's and the system runs in the client's own accounts. That is the engagement we sign, and the handover is where we check it.
- Built on ordinary, widely-adopted technology (TypeScript, Python, PostgreSQL)
  so any competent engineer can maintain it without Parrit : the client can
  take over at any time and is never captive.
- Client data never lives on Parrit's servers; Parrit's access ends the day the
  client revokes it.

## Pages
- https://parrit.ai/ : Parrit, data and AI.
- https://parrit.ai/manufacture : How a system is manufactured: doctrine and
  the three phases.
- https://parrit.ai/standard : The Standard, six commitments Parrit.ai applies to its systems. It is an internal check, with no external accreditation.
- https://parrit.ai/dossiers : The sealed dossiers: delivered systems,
  anonymized.
- https://parrit.ai/commission : Book a video call with Parrit.ai.
- https://parrit.ai/journal : We Find The Way, the Parrit journal.
- https://parrit.ai/legal : Legal notice and privacy policy.

## Contact
- Booking: https://parrit.ai/commission (a video call with Parrit.ai).
- The site is in English and French; commissions run in English and in French.
- Registered office: Rueil-Malmaison, France.
  International commissions welcome, including Africa.
`;

writeFileSync(outputPath, content);
console.log("llms.txt generated (REV 01 institutional positioning).");
