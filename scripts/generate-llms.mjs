import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(root, "public/llms.txt");
const themes = [
  ["harness-engineering", "Design or correct the system around your agents: context, tools, permissions, checks and supervision."],
  ["ai-sprints", "A short cycle with an agreed scope, criteria written before building and a documented decision."],
  ["integration-developpement", "Integrate what exists, build what is missing and orchestrate a supervised system suited to your operations."],
  ["conseil-transformation", "Start from your operations to decide priorities, build a roadmap and prepare adoption."],
];
const content = `# Parrit.ai

> We turn operational problems into systems that work.

## The single page
- https://parrit.ai/ (English)
- https://parrit.ai/fr (French)
- Agents in production, what AI changes, the path, departments, how data travels through our systems, the team, references, and founder and contact.
- Parrit.ai trains your teams, builds with them and puts software made for your company into production.
- Paul Larmaraud, founder of Parrit.ai. Based in the Lille area, he also works in Paris.
- Service area: Lille, Métropole européenne de Lille, Hauts-de-France, France.

## Journal themes
${themes.map(([slug, description]) => `- https://parrit.ai/journal/themes/${slug} (FR: https://parrit.ai/fr/journal/themes/${slug}): ${description}`).join("\n")}

## Journal
- https://parrit.ai/journal (FR: https://parrit.ai/fr/journal): what held and what broke on AI systems inside companies, dated and on the record.
- Articles have a single English URL under https://parrit.ai/journal/.

## Legal notice
- https://parrit.ai/legal (FR: https://parrit.ai/fr/legal).
- Registered office: Rueil-Malmaison, France.

## Contact
- https://parrit.ai/#contact (FR: https://parrit.ai/fr#contact): booking on the single page.
`;
writeFileSync(outputPath, content);
console.log("llms.txt generated (single page and Journal themes).");
