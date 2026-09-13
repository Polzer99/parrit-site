import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const ROOTS = ["src", "scripts"];
const EXTRA_FILES = ["public/llms.txt", "site.config.ts", "TRUTH.md"];
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
