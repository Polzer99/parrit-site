import { createHash } from "node:crypto";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { decodeNamedCharacterReference } from "decode-named-character-reference";

export const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const registry = "src/system/brand-os.forbidden-assets.json";

export function filesUnder(root) {
  if (!existsSync(root)) throw new Error(`Required scan directory missing: ${root}`);
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(root, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlink outside verified files: ${file}`);
    return entry.isDirectory() ? filesUnder(file) : [file];
  });
}

export function checkOrigin(root, origin) {
  const errors = [];
  for (const [file, expected] of Object.entries(origin.files)) {
    const actual = path.join(root, "src/system", file);
    if (!existsSync(actual) || sha256(readFileSync(actual)) !== expected) {
      errors.push(`fichier Brand OS édité à la main : ${file}`);
    }
  }
  const fonts = filesUnder(path.join(root, "public/fonts"));
  for (const [name, expected] of Object.entries(origin.canon_fonts)) {
    const matching = fonts.filter((file) => path.basename(file) === name);
    if (!matching.length) errors.push(`Police canonique absente : ${name}`);
    for (const file of matching) {
      if (sha256(readFileSync(file)) !== expected) errors.push(`Police canonique modifiée : ${path.relative(root, file)}`);
    }
  }
  return errors;
}

export function prerenderedPages(root) {
  const pages = filesUnder(path.join(root, ".next/server/app")).filter((file) => file.endsWith(".html"));
  if (!pages.length) throw new Error("No prerendered HTML: run npm run build before test:brand-os");
  return pages;
}

export function checkForbidden(root, contract, pages) {
  const patterns = [...contract.patterns, ...contract.rejected.flatMap(({ id, file }) => [id, file])];
  const hashes = new Set(contract.sha256);
  const files = ["src", "public", "content"].flatMap((directory) => filesUnder(path.join(root, directory)));
  files.push(path.join(root, "next.config.ts"), ...pages);
  const errors = [];
  for (const file of files) {
    const relative = path.relative(root, file).split(path.sep).join("/");
    // The immutable denylist necessarily contains its own forbidden names.
    // Only this exact, independently hash-checked registry is exempt.
    if (relative === registry) continue;
    const data = readFileSync(file);
    const content = `${relative}\n${data.toString("utf8")}`.toLowerCase();
    for (const pattern of patterns) {
      if (content.includes(pattern.toLowerCase())) errors.push(`Asset interdit ${pattern} : ${relative}`);
    }
    if (relative.startsWith("public/") && hashes.has(sha256(data))) errors.push(`Empreinte d'asset interdit : ${relative}`);
  }
  return errors;
}

export function visibleText(html) {
  // Strip markup before decoding entities: encoded < and > are visible text.
  const stripped = html.replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<[^>"']*(?:(?:"[^"]*"|'[^']*')[^>"']*)*>/g, " ");
  return stripped.replace(/&#(x[\da-f]+|\d+);?|&([a-z][a-z\d]+);/gi, (match, numeric, name) => {
    if (name) return decodeNamedCharacterReference(name) ?? match;
    const code = numeric[0].toLowerCase() === "x" ? parseInt(numeric.slice(1), 16) : Number(numeric);
    return code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff) ? String.fromCodePoint(code) : "\ufffd";
  });
}

export function checkGlyphs(html, page, glyphs, connectors) {
  const ranges = Object.values(glyphs.families).flat();
  const arrows = new Set(connectors.glyph_arrows_forbidden);
  const errors = [];
  for (const character of new Set(visibleText(html))) {
    const code = character.codePointAt(0);
    if (arrows.has(character) || (!/[\p{Z}\p{C}]/u.test(character) && !ranges.some(([start, end]) => start <= code && code <= end))) {
      errors.push(`Glyphe interdit ${JSON.stringify(character)} U+${code.toString(16).toUpperCase().padStart(4, "0")} : ${page}`);
    }
  }
  return errors;
}
