import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { certificationClaims, sourceProse } from "./lib/certification-claims.mjs";
import { ownershipClaims } from "./lib/ownership-claims.mjs";

import { homeClientViolations, privateClientNames, journalClientNames } from "./lib/public-clients.mjs";

const ROOTS = ["src", "scripts", "content/journal"];
const EXTRA_FILES = ["public/llms.txt", "site.config.ts", "TRUTH.md"];
const TEXT_EXTENSIONS = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx", ".txt", ".md", ".mdx"]);
const SELF = "scripts/false-claims-check.mjs";

const exactClaims = [
  ["measured", " in", " client", " systems"],
  ["mesurés", " dans", " les", " systèmes", " des", " clients"],
  ["verified", " live"],
  ["se", " vérifient", " en", " direct"],
  ["tw", "enty", " engineers"],
  ["steered", " by", " its", " part", "ners"],
  ["Un", " asso", "cié", " construit"],
  ["A", " part", "ner", " builds"],
  ["arrive", " par", " e-mail"],
  ["goes", " out", " by", " e-mail"],
  ["Désabonnement", " en", " un", " clic"],
  ["désinscription"],
  ["Pas", " d'un", " modèle", " tout", " fait"],
  ["not", " from", " a", " template"],
  ["what", " you", " just", " told", " us"],
  ["ce", " que", " vous", " venez", " de", " nous", " dire"],
  ["à", " partir", " de", " votre", " description"],
].map((parts) => parts.join(""));

const forbidden = [
  ...exactClaims.map((claim) => ({
    rule: claim,
    pattern: new RegExp(claim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
  })),
  {
    rule: "call duration",
    pattern: new RegExp(
      String.raw`(?:` +
        String.raw`\b(?:${["3", "0"].join("")}[ -]?min(?:ute)?s?|${["3", "0"].join("")}\s*mn|${["3", "0"].join("")}\s*[’']|` +
        `${["thir", "ty"].join("")} minutes|${["thir", "ty"].join("")}-minute|` +
        `${["tren", "te"].join("")} min(?:utes)?|half an hour|half-hour|demi-heure)` +
        String.raw`(?=\s|$|[·,.;:!?"'»)]).{0,48}(?:examination|exam|examen|visio|video call|founder|fondateur|booking|turns this sketch)|` +
        String.raw`\b(?:examination|exam|examen|booking)\b.{0,48}\b(?:${["3", "0"].join("")}[ -]?min(?:ute)?s?|${["3", "0"].join("")}\s*mn|${["3", "0"].join("")}\s*[’']|` +
        `${["thir", "ty"].join("")} minutes|${["thir", "ty"].join("")}-minute|` +
        `${["tren", "te"].join("")} min(?:utes)?|half an hour|half-hour|demi-heure)` +
        String.raw`(?=\s|$|[·,.;:!?"'»)]))`,
      "i",
    ),
  },
  {
    rule: "verified in person",
    pattern: /\bverified in person\b/i,
  },
  {
    rule: "verified in appointment",
    pattern: /\bvérifiés?\s+en\s+rendez-vous\b/i,
  },
  {
    rule: "measured at clients",
    pattern: /\bmesurés?\s+chez\s+(?:nos|les)\s+clients\b/i,
  },
  {
    rule: "team size",
    pattern: /\b(?:20 engineers|vingt ingénieurs)\b/i,
  },
  {
    rule: "partner-led",
    pattern: /\bpartners?\s+leads?\b|\bassociés?\s+(?:mène|construi)/i,
  },
  {
    rule: "journal email delivery",
    pattern: /\b(?:journal|entry|entrée)\b.{0,60}\b(?:arrives?\s+by\s+e-?mail|goes\s+out\s+by\s+e-?mail|par\s+e-?mail|par\s+mail|désinscription)\b|\b(?:arrives?\s+by\s+e-?mail|goes\s+out\s+by\s+e-?mail|par\s+e-?mail|par\s+mail|désinscription)\b.{0,60}\b(?:journal|entry|entrée)\b/i,
  },
  {
    rule: "sketch idea source",
    pattern: /(?:part de là|starts there|prepared by hand|préparé à la main|modèle préfabriqué)/i,
  },
];

const violations = [];

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? filesUnder(path) : [path];
    }),
  );
  return nested.flat();
}

function report(file, line, rule, value) {
  violations.push(`${relative(process.cwd(), file)}:${line} [${rule}] ${value.trim()}`);
}

const files = [
  ...(await Promise.all(ROOTS.map(filesUnder))).flat(),
  ...EXTRA_FILES,
];

for (const file of files) {
  const relativePath = relative(process.cwd(), file);
  if (relativePath === SELF) continue;
  if (!TEXT_EXTENSIONS.has(extname(file))) continue;

  const source = await readFile(file, "utf8");
  for (const value of ownershipClaims(source, relativePath)) {
    report(file, value.line, "unsupported ownership", value.text);
  }
  if (relativePath === "src/app/(rev01)/page.tsx") {
    for (const { line, name } of homeClientViolations(source)) report(file, line, "private client", name);
  }
  if (relativePath.startsWith("content/journal/") || relativePath.startsWith("src/app/(rev01)/") || ["src/system/components/SinglePage.tsx", "src/system/single-page-copy.ts"].includes(relativePath)) {
    const checkNames = relativePath.startsWith("content/journal/") ? journalClientNames : privateClientNames;
    for (const value of relativePath.startsWith("content/") ? [{ text: source, line: 1 }] : sourceProse(source, file)) {
      for (const name of checkNames(value.text)) report(file, value.line, "unauthorized client", name);
    }
  }
  // Check published prose, not enum values, implementation comments or tooling.
  // TS/TSX strings are checked independently so another dictionary entry cannot
  // supply a disclaimer to an unrelated claim.
  if (relativePath !== "scripts/lib/certification-claims.mjs" &&
      (relativePath.startsWith("content/") || relativePath === "scripts/generate-llms.mjs" || EXTRA_FILES.includes(relativePath) ||
       /\.(?:tsx|ts)$/.test(relativePath))) {
    const prose = /\.(?:tsx|ts|mjs)$/.test(file)
      ? sourceProse(source, file)
      : [{ text: source, line: 1 }];
    for (const value of prose) {
      // Exact copy approved in HANDOFF-PAGE-UNIQUE.md §0, shortened by
      // SCENARIO-DONNEE-ET-MOTS-INUTILES.md §2 (27/10/2026).
      // This does not authorize any other certification or any Journal claim.
      if (["src/system/components/SinglePage.tsx", "src/system/single-page-copy.ts"].includes(relativePath)
          && ["Une quinzaine de formateurs et un organisme certifié.", "Around fifteen trainers and a certified training organization."].includes(value.text)) continue;
      for (const claim of certificationClaims(value.text, relativePath === "src/system/components/HarnessBadge.tsx")) {
        report(file, value.line, "unsupported certification", claim);
      }
    }
  }
  const lines = source.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const { rule, pattern } of forbidden) {
      // The Cal.com slug is historical; the event behind it is now 15 minutes.
      const checkedLine = rule === "call duration" ? line.replaceAll("paul-larmaraud/30min", "") : line;
      const match = checkedLine.match(pattern);
      if (match) report(file, index + 1, rule, match[0]);
    }
  });
}

if (violations.length > 0) {
  console.error("False-claims check failed:\n" + violations.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log("False-claims check passed.");
