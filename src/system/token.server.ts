import { readFileSync } from "node:fs";
import path from "node:path";

/** Resolve root aliases to literal colors: Satori cannot evaluate CSS variables. */
export function createTokenResolver(sources: readonly string[]): (name: string) => string {
  const values = new Map<string, string>();
  for (const source of sources) {
    const root = source.replace(/\/\*[\s\S]*?\*\//g, "").match(/:root\s*\{([^}]+)\}/);
    if (!root) throw new Error("Missing design token :root block.");
    for (const match of root[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      values.set(match[1], match[2].trim());
    }
  }
  function resolve(name: string, seen: Set<string>): string {
    if (seen.has(name)) throw new Error(`Cyclic design token ${name}.`);
    const value = values.get(name);
    if (!value) throw new Error(`Missing design token ${name}.`);
    const reference = value.match(/^var\((--[\w-]+)\)$/);
    if (!reference) {
      if (!/^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(value)) {
        throw new Error(`Unsupported design color ${name}: ${value}.`);
      }
      return value;
    }
    seen.add(name);
    return resolve(reference[1], seen);
  }
  return (name) => resolve(name, new Set());
}

let resolveToken: ((name: string) => string) | undefined;
export function token(name: string): string {
  resolveToken ??= createTokenResolver([
    readFileSync(path.join(process.cwd(), "src/system/brand-os.tokens.css"), "utf8"),
    readFileSync(path.join(process.cwd(), "src/system/tokens.css"), "utf8"),
  ]);
  return resolveToken(name);
}
