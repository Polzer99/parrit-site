import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const ROOTS = ["src/system", "src/app/(rev01)", "public/brand"];
// Standalone public/brand/*.svg files cannot consume CSS tokens. This exception
// applies only to the generic hex-location rule, never to the anti-red scan.
const HEX_OUTSIDE_TOKENS_EXCEPTIONS = [/^public\/brand\/[^/]+\.svg$/i];
const TEXT_EXTENSIONS = new Set([".css", ".html", ".js", ".jsx", ".json", ".md", ".mjs", ".txt", ".ts", ".tsx", ".svg"]);
const RED_CSS_NAMES = new Map([
  ["crimson", [220, 20, 60]],
  ["darkred", [139, 0, 0]],
  ["firebrick", [178, 34, 34]],
  ["indianred", [205, 92, 92]],
  ["lightcoral", [240, 128, 128]],
  ["lightsalmon", [255, 160, 122]],
  ["maroon", [128, 0, 0]],
  ["orangered", [255, 69, 0]],
  ["red", [255, 0, 0]],
  ["salmon", [250, 128, 114]],
  ["tomato", [255, 99, 71]],
]);
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

function isReddish([red, green, blue]) {
  return red > 90 && red >= 1.8 * green && red >= 1.8 * blue;
}

function hexToRgb(hex) {
  const value = hex.replace(/^#/, "");
  if (value.length <= 4) {
    return [...value.slice(0, 3)].map((digit) => parseInt(digit + digit, 16));
  }
  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16));
}

function parseRgbChannels(value) {
  const channels = value
    .trim()
    .replace(/\s*\/\s*[^,)\s]+$/, "")
    .split(/[,\s]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((channel) => {
      if (channel.endsWith("%")) return Math.round(Number.parseFloat(channel) * 2.55);
      return Number.parseFloat(channel);
    });
  if (channels.length !== 3 || channels.some((channel) => !Number.isFinite(channel))) return null;
  return channels.map((channel) => Math.max(0, Math.min(255, Math.round(channel))));
}

function hslToRgb(hue, saturation, lightness) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const segment = (((hue % 360) + 360) % 360) / 60;
  const x = chroma * (1 - Math.abs((segment % 2) - 1));
  const [r1, g1, b1] =
    segment < 1 ? [chroma, x, 0] :
    segment < 2 ? [x, chroma, 0] :
    segment < 3 ? [0, chroma, x] :
    segment < 4 ? [0, x, chroma] :
    segment < 5 ? [x, 0, chroma] :
    [chroma, 0, x];
  const match = lightness - chroma / 2;
  return [r1, g1, b1].map((channel) => Math.round((channel + match) * 255));
}

function parseHslChannels(value) {
  const channels = value
    .trim()
    .replace(/\s*\/\s*[^,)\s]+$/, "")
    .split(/[,\s]+/)
    .filter(Boolean)
    .slice(0, 3);
  if (channels.length !== 3) return null;
  const hue = Number.parseFloat(channels[0].replace(/deg$/i, ""));
  const saturation = channels[1].endsWith("%") ? Number.parseFloat(channels[1]) / 100 : Number.parseFloat(channels[1]);
  const lightness = channels[2].endsWith("%") ? Number.parseFloat(channels[2]) / 100 : Number.parseFloat(channels[2]);
  if (![hue, saturation, lightness].every(Number.isFinite)) return null;
  return hslToRgb(hue, saturation, lightness);
}

function reportReddishColors(file, line, lineNumber, allowModernSpaces) {
  for (const match of line.matchAll(/#([\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})\b/gi)) {
    const rgb = hexToRgb(match[0]);
    if (isReddish(rgb)) report(file, lineNumber, "reddish color", match[0]);
  }

  for (const match of line.matchAll(/\brgba?\(\s*([^)]+)\)/gi)) {
    const rgb = parseRgbChannels(match[1]);
    if (rgb && isReddish(rgb)) report(file, lineNumber, "reddish color", match[0]);
  }

  for (const match of line.matchAll(/\bhsla?\(\s*([^)]+)\)/gi)) {
    const rgb = parseHslChannels(match[1]);
    if (rgb && isReddish(rgb)) report(file, lineNumber, "reddish color", match[0]);
  }

  for (const match of line.matchAll(/\b(?:oklch|oklab|lab|lch)\(\s*[^)]+\)/gi)) {
    if (!allowModernSpaces) report(file, lineNumber, "modern color space outside tokens.css", match[0]);
  }

  for (const match of line.matchAll(/(?<![\p{L}-])(?:crimson|darkred|firebrick|indianred|lightcoral|lightsalmon|maroon|orangered|red|salmon|tomato)(?![\p{L}-])/giu)) {
    const rgb = RED_CSS_NAMES.get(match[0].toLowerCase());
    if (rgb && isReddish(rgb)) report(file, lineNumber, "reddish color", match[0]);
  }
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

const NO_RED_ROOTS = ["src", "public"];
const NO_RED_EXCEPTIONS = [
  "src/app/camp-costa-rica/", // Voluntary archived legacy palette retained by Paul's decision.
  "archive/camp-costa-rica/",
];

for (const root of NO_RED_ROOTS) {
  for (const file of await filesUnder(root)) {
    const relativeFile = relative(process.cwd(), file);
    if (NO_RED_EXCEPTIONS.some((prefix) => relativeFile.startsWith(prefix))) continue;
    const bytes = await readFile(file);
    if (bytes.includes(0)) continue; // Binary assets are covered by pixel QA.
    const lines = bytes.toString("utf8").split(/\r?\n/);
    lines.forEach((line, index) => {
      reportReddishColors(file, line, index + 1, relativeFile.endsWith("src/system/tokens.css"));
    });
  }
}

if (violations.length > 0) {
  console.error("Brand conformity failed:\n" + violations.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Brand conformity passed (${ROOTS.join(", ")}; no reddish colors in src/ or public text assets).`);
