import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const ROOTS = ["src/system", "src/app-rev01", "src/app/system"];
const TEXT_EXTENSIONS = new Set([".css", ".js", ".jsx", ".md", ".mjs", ".ts", ".tsx"]);
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
      if (!file.endsWith("tokens.css")) {
        const hex = line.match(/#[\da-f]{3,8}\b/i);
        if (hex) report(file, lineNumber, "hex outside tokens.css", hex[0]);
      }

      const radius = line.match(/border-radius\s*:\s*([^;]+)/i);
      if (radius && !/^0(?:px|rem|em|%)?$/i.test(radius[1].trim())) {
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

if (violations.length > 0) {
  console.error("Brand conformity failed:\n" + violations.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Brand conformity passed (${ROOTS.join(", ")}).`);
