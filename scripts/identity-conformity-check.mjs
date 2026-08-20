import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const ROOT = process.cwd();
const PUBLIC_ROOTS = [
  "src",
  "content",
  "public",
  "brand/00_SOURCE_OF_TRUTH.md",
  "docs/brand-v2",
  "docs/conversational-site",
  "docs/sales",
  "COPY-V2-CLAUDE-CODE.md",
  "TRUTH.md",
  "next.config.ts",
  "scripts/generate-llms.mjs",
];
const TEXT_EXTENSIONS = new Set([
  ".css",
  ".html",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".mdx",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
]);
const BANNED_IDENTITY = [
  ["former collaborator presented as current", /Yukun|冷宇坤|yukun-leng|yukun-portrait/i],
  ["unverified expert network", /vingt experts|20 experts|twenty experts/i],
  ["unverified tenure", /10 ans d['’ ]expérience|dix ans d['’ ]expérience|10 years|ten years/i],
  ["obsolete positioning", /boutique franco-chinoise/i],
];
const violations = [];

async function filesUnder(path) {
  let entries;
  try {
    entries = await readdir(path, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOTDIR") return [path];
    if (error.code === "ENOENT") return [];
    throw error;
  }

  const nested = await Promise.all(
    entries.map((entry) => {
      const child = join(path, entry.name);
      return entry.isDirectory() ? filesUnder(child) : [child];
    }),
  );
  return nested.flat();
}

function report(file, line, rule, value) {
  violations.push(`${relative(ROOT, file)}:${line} [${rule}] ${value}`);
}

for (const root of PUBLIC_ROOTS) {
  for (const file of await filesUnder(join(ROOT, root))) {
    if (!TEXT_EXTENSIONS.has(extname(file))) continue;
    const source = await readFile(file, "utf8");
    source.split(/\r?\n/).forEach((line, index) => {
      for (const [rule, pattern] of BANNED_IDENTITY) {
        const match = line.match(pattern);
        if (match) report(file, index + 1, rule, match[0]);
      }
    });
  }
}

for (const llmsPath of ["public/llms.txt", "scripts/generate-llms.mjs"]) {
  const file = join(ROOT, llmsPath);
  const source = await readFile(file, "utf8");
  source.split(/\r?\n/).forEach((line, index) => {
    const monetaryAmount = line.match(/(?:[€$£]\s?\d|\d\s?(?:€|EUR|USD|GBP)\b)/i);
    if (monetaryAmount) report(file, index + 1, "price in crawler content", monetaryAmount[0]);
  });
}

const nextConfig = await readFile(join(ROOT, "next.config.ts"), "utf8");
if (!/source:\s*["']\/fondateurs["'][\s\S]{0,80}statusCode:\s*301/.test(nextConfig)) {
  report(join(ROOT, "next.config.ts"), 1, "legacy founder route", "missing explicit 301");
}

if (violations.length > 0) {
  console.error("Public identity conformity failed:\n" + violations.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log("Public identity conformity passed.");
