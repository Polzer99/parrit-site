import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// REV 01 (14/08/2026): llms.txt states the institutional positioning of the live
// site: business transformation and the systems that make it possible. The previous
// generator emitted the pre-REV01 positioning (virtual collaborators catalog),
// which contradicted every page served. Content is static by design: it must
// only change when the site's positioning changes.

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(root, "public/llms.txt");

const content = `# Parrit

> Parrit.ai supports business transformation and builds the systems that make it possible.

## Positioning
- Three entry points: Consulting & Transformation, AI Sprints, Engineering & Integration.
- Harness Engineering designs or corrects the system around agents: context, tools, permissions, checks, human supervision and cost tracking.
- Each engagement starts with an examination of how the company actually operates: flows, decisions and failure points documented as an engineering brief.


## The Parrit Standard
Each system delivered from now on is checked against the Standard, Parrit.ai's internal check, with no external accreditation.
- 01: State is readable at any moment.
- 02: Every signal carries its decision.
- 03: A decision always keeps its origin.
- 04: Rolling back is written in advance.
- 06: Each new capability reuses what already exists.

## Who is Parrit
- Parrit.ai supports business transformation and builds the systems that make it possible.
- A registered French company (PARRIT.AI, SAS, registered office in
  Rueil-Malmaison, France); full legal identity at https://parrit.ai/legal.
- Operates internationally, in English and in French :
  projects for European and African companies alike.
- Deliberately small at the core: few commissions.

## Ownership, maintenance and data
- The assignment of rights to what we build, hosting, reversibility and maintenance are written into each project's contract.
- The handover is where we check the agreed scope and operating documentation.

## Pages
- https://parrit.ai/consulting-transformation (FR: https://parrit.ai/fr/conseil-transformation): understand operations, prioritize and prepare adoption.
- https://parrit.ai/ai-sprints (FR: https://parrit.ai/fr/ai-sprints): a precise problem, a testable system and a documented decision. Duration is agreed during scoping.
- https://parrit.ai/engineering-integration (FR: https://parrit.ai/fr/engineering-integration): integrate what exists, build what is missing and orchestrate the whole.
- https://parrit.ai/harness-engineering (FR: https://parrit.ai/fr/harness-engineering): a guide to reliable supervised agents and evaluation on the same tasks.
- https://parrit.ai/ : Parrit.ai supports business transformation and builds the systems that make it possible.
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
