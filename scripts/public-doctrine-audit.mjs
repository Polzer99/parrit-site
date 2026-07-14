import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const targets = ["src/app", "src/components", "src/lib", "content"];
const extensions = new Set([".css", ".json", ".ts", ".tsx"]);
const excludedPathFragments = [`src${path.sep}app${path.sep}api${path.sep}`];

// NB pivot 2026 : « sur devis » est la formulation de prix public validée (cf. TRUTH.md §6.1)
// et « pas des POC » est du positionnement anti-POC assumé — donc ni l'un ni l'autre n'est banni.
// L'em dash reste interdit dans la COPIE mais toléré dans les commentaires de code (voir isCommentLine).
const bannedPatterns = [
  { label: "chatbot", regex: /\bchatbots?\b/iu },
  { label: "jours-homme", regex: /\bjours-homme\b/iu },
  { label: "prompt", regex: /\bprompts?\b/iu },
  { label: "experimentation", regex: /\bexp[ée]rimentations?\b/iu },
  { label: "em dash", regex: /—/u, skipComments: true },
  { label: "retired font Hanken Grotesk", regex: /\bHanken Grotesk\b/iu },
  { label: "retired font JetBrains Mono", regex: /\bJetBrains Mono\b/iu },
  { label: "retired font DM Sans", regex: /\bDM Sans\b/iu },
  { label: "retired font Cormorant", regex: /\bCormorant\b/iu },
];

const findings = [];
const zhCriticalDictionaryPaths = [
  "meta.title",
  "meta.description",
  "approach.title",
  "approach.description",
  "blog.headerLabel",
  "blog.headerSubtitle",
  "actualite.headerLabel",
  "actualite.headerSubtitle",
  "quickContact.submit",
  "setup.hero.titleMain",
  "setup.hero.quickAnswer",
  "setup.audience.title",
  "setup.deliverables.title",
  "remote.hero.titleMain",
  "remote.hero.quickAnswer",
  "remote.audience.title",
  "author.title",
  "author.bioP1",
];

function getByPath(value, keyPath) {
  return keyPath.split(".").reduce((current, key) => current?.[key], value);
}

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

  const isCommentLine = (line) => {
    const t = line.trim();
    return (
      t.startsWith("//") ||
      t.startsWith("/*") ||
      t.startsWith("*") ||
      t.startsWith("{/*") ||
      t.startsWith("<!--")
    );
  };

  lines.forEach((line, index) => {
    for (const pattern of bannedPatterns) {
      if (pattern.skipComments && isCommentLine(line)) {
        continue;
      }
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

const zhDictionaryPath = path.join(root, "src/app/[lang]/dictionaries/zh-CN.json");
try {
  const zhDictionary = JSON.parse(await readFile(zhDictionaryPath, "utf8"));
  if (zhDictionary.meta?.ogLocale !== "zh_CN") {
    findings.push({
      file: "src/app/[lang]/dictionaries/zh-CN.json",
      line: 1,
      label: "zh-CN ogLocale",
      snippet: `Expected meta.ogLocale to be zh_CN, got ${zhDictionary.meta?.ogLocale}`,
    });
  }

  for (const keyPath of zhCriticalDictionaryPaths) {
    const value = getByPath(zhDictionary, keyPath);
    if (typeof value !== "string" || !/[\u3400-\u9fff]/u.test(value)) {
      findings.push({
        file: "src/app/[lang]/dictionaries/zh-CN.json",
        line: 1,
        label: "zh-CN critical copy",
        snippet: `${keyPath} must contain Simplified Chinese copy`,
      });
    }
  }
} catch (error) {
  findings.push({
    file: "src/app/[lang]/dictionaries/zh-CN.json",
    line: 1,
    label: "zh-CN dictionary",
    snippet: error instanceof Error ? error.message : String(error),
  });
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
