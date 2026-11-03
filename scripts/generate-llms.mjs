import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(root, "public/llms.txt");
const themes = [
  ["harness-engineering", "Encadrer vos assistants IA : règles, droits et contrôles.", "Rules, permissions and checks for your AI assistants."],
  ["ai-sprints", "Un premier résultat en cycle court, avec des critères écrits à l'avance.", "A first result in a short cycle, with criteria written in advance."],
  ["integration-developpement", "Relier vos logiciels et construire ce qui manque.", "Connect your software and build what is missing."],
  ["conseil-transformation", "Choisir vos priorités et préparer vos équipes.", "Choose your priorities and prepare your teams."],
];
const content = `# Parrit.ai

> Nous formons vos équipes à l'IA et construisons les outils qui leur manquent.
> We train your teams in AI and build the tools they need.

## Français

### La page d'accueil
- https://parrit.ai/fr
- Dans l'ordre : présentation, applications concrètes, ce que l'IA change dans votre entreprise, parcours, cas d'usage par service, technologies, équipe, références, fondateur et contact.
- Réponses aux clients, relances, devis, comptes rendus : l'IA prépare, vos équipes relisent et décident.
- Paul Larmaraud, fondateur de Parrit.ai, forme les équipes et pilote les projets.
- Zone d'intervention : Lille, Métropole européenne de Lille, Hauts-de-France et toute la France.

### Thèmes du Journal
${themes.map(([slug, fr]) => `- https://parrit.ai/fr/journal/themes/${slug} : ${fr}`).join("\n")}

### Journal
- https://parrit.ai/fr/journal : retours datés sur ce qui fonctionne et ce qui échoue dans les outils d'IA en entreprise.
- L'index est en français ; les articles restent en anglais, à une seule adresse sous https://parrit.ai/journal/.

### Mentions légales
- https://parrit.ai/fr/legal
- Siège social : Rueil-Malmaison, France.

### Contact
- https://parrit.ai/fr#contact : réservation intégrée à la page d'accueil.

## English

### The home page
- https://parrit.ai/
- In order: introduction, real-world applications, what AI changes in your company, the path, use cases by department, technologies, team, references, founder and contact.
- Client replies, follow-ups, quotes, meeting notes: AI prepares them, your teams review and decide.
- Paul Larmaraud, founder of Parrit.ai, trains teams and leads projects.
- Service area: Lille, Métropole européenne de Lille, Hauts-de-France and across France.

### Journal themes
${themes.map(([slug, , en]) => `- https://parrit.ai/journal/themes/${slug}: ${en}`).join("\n")}

### Journal
- https://parrit.ai/journal: dated accounts of what works and what fails in AI tools inside companies.
- Articles have a single English URL under https://parrit.ai/journal/.

### Legal notice
- https://parrit.ai/legal
- Registered office: Rueil-Malmaison, France.

### Contact
- https://parrit.ai/#contact: booking on the home page.
`;
writeFileSync(outputPath, content);
console.log("llms.txt generated (French and English home page and Journal themes).");
