import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { HOME_LAYERS, HOME_SECTION_ORDER, homeSectionHeadings } from "../src/system/home-layers.ts";
import { getAllJournalEntrySummaries } from "../src/system/journal-data.ts";
import { getJournalThemes } from "../src/system/journal-themes.ts";
import { localizedPath } from "../src/system/locale.ts";
import { journalClientNames } from "./lib/public-clients.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(root, "public/llms.txt");
const themes = [
  ["harness-engineering", "Encadrer vos assistants IA : règles, droits et contrôles.", "Rules, permissions and checks for your AI assistants."],
  ["ai-sprints", "Un premier résultat en cycle court, avec des critères écrits à l'avance.", "A first result in a short cycle, with criteria written in advance."],
  ["integration-developpement", "Relier vos logiciels et construire ce qui manque.", "Connect your software and build what is missing."],
  ["conseil-transformation", "Choisir vos priorités et préparer vos équipes.", "Choose your priorities and prepare your teams."],
];
export function renderLlms(entries = getAllJournalEntrySummaries(), frenchEntries = getAllJournalEntrySummaries("fr")) {
  const order = locale => {
    const headings = homeSectionHeadings(locale);
    return HOME_SECTION_ORDER.map(id => headings[id].join(" ")).join(" ; ");
  };
  const faq = locale => HOME_LAYERS[locale].faq.map(([question, answer]) => `- ${question}\n  ${answer}`).join("\n");
  const published = entries.filter(entry => !entry.noindex).sort((left, right) =>
    right.date.localeCompare(left.date) || left.title.localeCompare(right.title, "en"));
  const frenchBySlug = new Map(frenchEntries.map(entry => [entry.slug, entry]));
  const articles = locale => published.map(original => {
    const entry = locale === "fr" ? frenchBySlug.get(original.slug) ?? original : original;
    const themes = getJournalThemes(entry.slug).map(theme => ` [${theme.label[locale]}]`).join("");
    return `- https://parrit.ai${localizedPath(`/journal/${entry.slug}`, locale)} : ${entry.title} (${entry.date}). ${entry.description}${themes}`;
  }).join("\n");
  const content = `# Parrit.ai

> Vos équipes prennent l'IA en main. Nous développons les logiciels qui leur manquent.
> Your teams take AI in hand. We build the software they are missing.

## Français

### La page d'accueil
- https://parrit.ai/fr
- Dans l'ordre : ${order("fr")}
- Réponses aux clients, relances, devis, comptes rendus : l'IA prépare, vos équipes relisent et décident.
- Paul Larmaraud, fondateur de Parrit.ai, accompagne les équipes dans la prise en main de l'IA et pilote les projets.
- Présence : Tourcoing et Paris. Zone d'intervention : toute la France.

### FAQ
${faq("fr")}

### Thèmes du Journal
${themes.map(([slug, fr]) => `- https://parrit.ai/fr/journal/themes/${slug} : ${fr}`).join("\n")}

### Journal
- https://parrit.ai/fr/journal : retours datés sur ce qui fonctionne et ce qui échoue dans les outils d'IA en entreprise.

### Articles
${articles("fr")}

### Mentions légales
- https://parrit.ai/fr/legal
- Siège social : Rueil-Malmaison, France.

### Contact
- https://parrit.ai/fr#contact : réservation intégrée à la page d'accueil.

## English

### The home page
- https://parrit.ai/
- In order: ${order("en")}
- Client replies, follow-ups, quotes, meeting notes: AI prepares them, your teams review and decide.
- Paul Larmaraud, founder of Parrit.ai, helps teams adopt AI and leads projects.
- Presence: Tourcoing and Paris. Service area: across France.

### FAQ
${faq("en")}

### Journal themes
${themes.map(([slug, , en]) => `- https://parrit.ai/journal/themes/${slug}: ${en}`).join("\n")}

### Journal
- https://parrit.ai/journal: dated accounts of what works and what fails in AI tools inside companies.

### Articles
${articles("en")}

### Legal notice
- https://parrit.ai/legal
- Registered office: Rueil-Malmaison, France.

### Contact
- https://parrit.ai/#contact: booking on the home page.
`;
  const clients = journalClientNames(content);
  if (clients.length) throw new Error(`Client names forbidden in llms.txt: ${clients.join(", ")}`);
  return content;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  // Validate the whole document before replacing the generated file.
  writeFileSync(outputPath, renderLlms());
  console.log("llms.txt generated (French and English home order, FAQ and published Journal articles).");
}
