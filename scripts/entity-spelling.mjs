import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

// This specification deliberately lists forbidden spellings as test examples.
// Keep exclusions exact: future specs and all published content remain scanned.
export const EXCLUDED_FILES = new Set([
  "docs/CODEX-SPEC-2026-09-26-entity-identity-v0.md",
]);
const ROOTS = ["src", "content", "public", "docs"];
const EXCLUDED_DIRECTORIES = new Set(["node_modules", ".next"]);
const CANONICAL = "larmaraud";

export function levenshtein(left, right) {
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i++) {
    const current = [i];
    for (let j = 1; j <= right.length; j++) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + Number(left[i - 1] !== right[j - 1]),
      );
    }
    previous = current;
  }
  return previous[right.length];
}

export function spellingErrors(text, file) {
  const errors = [];
  text.split(/\r?\n/).forEach((line, index) => {
    // Match whole alphabetic tokens, never substrings of a longer word.
    for (const [variant] of line.matchAll(/\p{L}+/gu)) {
      const normalized = variant.toLowerCase();
      if (variant.length < 6 || variant.length > 12 || !normalized.startsWith("la")) continue;
      // Correct spelling is case-insensitive here, including URL/email tokens.
      if (normalized !== CANONICAL && levenshtein(normalized, CANONICAL) <= 2) {
        errors.push(`${file}:${index + 1}: ${variant}`);
      }
    }
  });
  return errors;
}

export function scanEntitySpelling(root) {
  const errors = [];
  function visit(relative) {
    for (const entry of readdirSync(path.join(root, relative), { withFileTypes: true })) {
      const file = `${relative}/${entry.name}`;
      if (entry.isDirectory()) {
        if (!EXCLUDED_DIRECTORIES.has(entry.name)) visit(file);
      } else if (entry.isFile() && !EXCLUDED_FILES.has(file)) {
        const bytes = readFileSync(path.join(root, file));
        // Public contains fonts/images: only decode valid UTF-8 text, without
        // an extension allowlist that could silently omit a new text format.
        if (bytes.includes(0)) continue;
        let text;
        try {
          text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
        } catch {
          continue;
        }
        errors.push(...spellingErrors(text, file));
      }
    }
  }
  for (const directory of ROOTS) visit(directory);
  return errors;
}
