import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = resolve(root, "content/agents/catalog.json");
const outputPath = resolve(root, "public/llms.txt");
const siteUrl = "https://parrit.ai";

const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));

function deployedCases() {
  return catalog.cases
    .filter((agentCase) => agentCase.status === "deployed" || agentCase.featured)
    .sort((a, b) => {
      if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
      return b.date.localeCompare(a.date);
    });
}

function personaName(dept) {
  const persona = catalog.personas[dept];
  return persona ? `${persona.name}, ${persona.label}` : dept;
}

const lines = [
  "# Parrit.ai",
  "",
  "> Parrit.ai aide les DG et Directeurs métiers de PME/ETI à recruter des collaborateurs virtuels qui travaillent sur leurs vrais workflows : acquisition, veille, opérations, données, contenu et formation.",
  "",
  "## Positionnement",
  "- Boutique franco-chinoise qui construit et opère des agents IA sur mesure.",
  "- Promesse : un agent avec une fiche de poste, un périmètre, des accès limités et un responsable humain.",
  "- Cible : DG, dirigeants et Directeurs métiers de PME/ETI qui veulent un système en production, pas un audit.",
  "- Données et exécution : déploiement sur les systèmes du client, avec logs, secrets serveur et validation humaine sur les actions sensibles.",
  "",
  "## Offres",
  "Trois offres, toutes sur devis (périmètre et prix cadrés après un diagnostic). La home n'affiche pas de prix.",
  "- Transformation IA : advisory COMEX/DSI, transformation de bout en bout. Sur devis.",
  "- Agent IA (Sprint agentique) : un agent en production contrôlée sur un workflow prioritaire. Sur devis.",
  "- Formation agentique : rendre les équipes autonomes sur les agents (ateliers hands-on, finançable OPCO). Sur devis.",
  "- La Veille : produit d'appel basse friction, un mail exploitable des sources utiles d'un dirigeant.",
  "",
  "## Méthode de déploiement",
  "- Diagnostic du workflow prioritaire.",
  "- VPS sécurisé et accès limités.",
  "- Premier agent en production, validation humaine sur les actions sensibles.",
  "- Passation aux équipes et documentation.",
  "",
  "## Catalogue public des agents",
  ...deployedCases().flatMap((agentCase) => [
    `- ${agentCase.title} (${personaName(agentCase.dept)}) : ${agentCase.desc} Secteur : ${agentCase.sector}.`,
  ]),
  "",
  "## La Veille",
  "La Veille est le produit d'appel : toutes les sources utiles d'un dirigeant ou d'une équipe condensées dans un mail exploitable, sans engagement lourd.",
  "",
  "## Ressources",
  `- Home : ${siteUrl}/fr`,
  `- Catalogue complet et index éditorial : ${siteUrl}/llms-full.txt`,
  `- Blog cas d'usage : ${siteUrl}/fr/blog`,
  `- Launches : ${siteUrl}/fr/launches`,
  "",
  "## Guides et ressources",
  `- L'architecture CLAUDE.md — les 4 couches d'un agent qui pilote (socle, mémoire atomique, garde-fous, compétences) ; parti pris Parrit vs le mythe des « 7 fichiers » : ${siteUrl}/architecture-claude-md`,
  `- Démarrer avec Claude Code — guide pas à pas pour dirigeants, sans code : ${siteUrl}/demarrer-claude-code`,
  "",
  "## Contact",
  "- Email : paul.larmaraud@parrit.ai",
  "- WhatsApp : +33 7 59 66 56 87",
  `- Rendez-vous : ${siteUrl}/fr/rendez-vous?source=llms`,
  "",
];

writeFileSync(outputPath, `${lines.join("\n")}\n`);
