import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const ROOTS = ["src", "scripts"];
const EXTRA_FILES = ["public/llms.txt"];
const TEXT_EXTENSIONS = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx", ".txt"]);
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
  ["Pas", " d'un", " modèle", " tout", " fait"],
  ["not", " from", " a", " template"],
].map((parts) => parts.join(""));

const forbidden = [
  ...exactClaims.map((claim) => ({
    rule: claim,
    pattern: new RegExp(claim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
  })),
  {
    rule: "call duration",
    pattern: new RegExp(
      String.raw`\b(?:${["3", "0"].join("")}[ -]?min(?:ute)?s?|` +
        `${["thir", "ty"].join("")} minutes|` +
        `${["tren", "te"].join("")} minutes)\\b`,
      "i",
    ),
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
  const lines = source.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const { rule, pattern } of forbidden) {
      const match = line.match(pattern);
      if (match) report(file, index + 1, rule, match[0]);
    }
  });
}

if (violations.length > 0) {
  console.error("False-claims check failed:\n" + violations.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log("False-claims check passed.");
