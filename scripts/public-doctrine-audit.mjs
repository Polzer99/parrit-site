import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const targets = ["src/app", "src/components", "src/lib", "content"];
const extensions = new Set([".css", ".json", ".ts", ".tsx"]);
const excludedPathFragments = [`src${path.sep}app${path.sep}api${path.sep}`];

const bannedPatterns = [
  { label: "POC", regex: /\bPOCs?\b/iu },
  { label: "chatbot", regex: /\bchatbots?\b/iu },
  { label: "jours-homme", regex: /\bjours-homme\b/iu },
  { label: "prompt", regex: /\bprompts?\b/iu },
  { label: "experimentation", regex: /\bexp[ée]rimentations?\b/iu },
  { label: "Sur devis", regex: /\bSur devis\b/iu },
  { label: "em dash", regex: /—/u },
];

const findings = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = path.relative(root, absolutePath);

    if (excludedPathFragments.some((fragment) => relativePath.includes(fragment))) {
      continue;
    }

    if (entry.isDirectory()) {
      await walk(absolutePath);
      continue;
    }

    if (!entry.isFile() || !extensions.has(path.extname(entry.name))) {
      continue;
    }

    await auditFile(absolutePath, relativePath);
  }
}

async function auditFile(absolutePath, relativePath) {
  const content = await readFile(absolutePath, "utf8");
  const lines = content.split(/\r?\n/u);

  lines.forEach((line, index) => {
    for (const pattern of bannedPatterns) {
      if (pattern.regex.test(line)) {
        findings.push({
          file: relativePath,
          line: index + 1,
          label: pattern.label,
          snippet: line.trim(),
        });
      }
    }
  });
}

for (const target of targets) {
  const absoluteTarget = path.join(root, target);

  try {
    if ((await stat(absoluteTarget)).isDirectory()) {
      await walk(absoluteTarget);
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

if (findings.length > 0) {
  console.error("Public doctrine audit failed:");
  for (const finding of findings) {
    console.error(
      `- ${finding.file}:${finding.line} [${finding.label}] ${finding.snippet}`,
    );
  }
  process.exit(1);
}

console.log("Public doctrine audit passed.");
