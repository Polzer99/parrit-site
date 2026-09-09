import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const ROOTS = ["src/system", "src/app/(rev01)", "public/brand"];
// Standalone public/brand/*.svg assets cannot consume CSS tokens: keep literal hex values.
// This exception applies ONLY to hex outside tokens, never to the anti-red scan below.
const HEX_OUTSIDE_TOKENS_EXCEPTIONS = [/^public\/brand\/[^/]+\.svg$/i];
const TEXT_EXTENSIONS = new Set([".css", ".js", ".jsx", ".md", ".mjs", ".ts", ".tsx", ".svg"]);
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

for (const root of ROOTS) {
  for (const file of await filesUnder(root)) {
    if (!TEXT_EXTENSIONS.has(extname(file))) continue;
    const source = await readFile(file, "utf8");
    const lines = source.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      if (!file.endsWith("tokens.css") && !HEX_OUTSIDE_TOKENS_EXCEPTIONS.some((pattern) => pattern.test(file))) {
        const hex = line.match(/#[\da-f]{3,8}\b/i);
        if (hex) report(file, lineNumber, "hex outside tokens.css", hex[0]);
      }

      const radius = line.match(/border-radius\s*:\s*([^;]+)/i);
      // Canon: radius 0 everywhere EXCEPT phone mockups — such lines carry "mockup" inline.
      if (radius && !/mockup/i.test(line) && !/^0(?:px|rem|em|%)?$/i.test(radius[1].trim())) {
        report(file, lineNumber, "border-radius", radius[1]);
      }

      if (/(?:linear|radial)-gradient\s*\(/i.test(line)) {
        report(file, lineNumber, "gradient", line);
      }

      const shadow = line.match(/box-shadow\s*:\s*([^;]+)/i);
      const instrumentShadow = "0 40px 80px -40px rgba(10, 11, 12, .4)";
      if (shadow && shadow[1].trim() !== instrumentShadow) {
        report(file, lineNumber, "box-shadow", shadow[1]);
      }

      const banned = line.match(/\b(?:unlock|revolutionize|supercharge|AI-powered|cutting-edge)\b/i);
      if (banned) report(file, lineNumber, "PC-10 banned word", banned[0]);
    });
  }
}

// Paul, 09/09/2026: no reddish hexadecimal colors in source or public SVGs.
const NO_RED_ROOTS = ["src", "public"];
const NO_RED_EXCEPTIONS = [
  "src/app/camp-costa-rica/", // Voluntary legacy palette retained by Paul's decision.
  "docs/", // Historical archives, outside the active source/assets scan.
];

for (const root of NO_RED_ROOTS) {
  for (const file of await filesUnder(root)) {
    if (NO_RED_EXCEPTIONS.some((prefix) => file.startsWith(prefix))) continue;
    if (root === "public" && extname(file).toLowerCase() !== ".svg") continue;
    const bytes = await readFile(file);
    if (bytes.includes(0)) continue; // Binary assets (including PNGs) need pixel QA.
    const lines = bytes.toString("utf8").split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const match of line.matchAll(/#([\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})\b/gi)) {
        const hex = match[1];
        const rgb = hex.length <= 4
          ? [...hex.slice(0, 3)].map((digit) => parseInt(digit + digit, 16))
          : [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
        const [red, green, blue] = rgb;
        if (red > 90 && red >= 1.8 * green && red >= 1.8 * blue) {
          report(file, index + 1, "reddish color", match[0]);
        }
      }
    });
  }
}

if (violations.length > 0) {
  console.error("Brand conformity failed:\n" + violations.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Brand conformity passed (${ROOTS.join(", ")}; no reddish hex in src/ or public SVGs).`);
