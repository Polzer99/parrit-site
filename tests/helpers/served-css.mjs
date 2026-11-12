import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";

// Follow local imports from public App Router entries, not archived stylesheets.
export function servedCssFiles() {
  const visited = new Set();
  const sheets = new Set();
  function visit(file) {
    file = path.resolve(file);
    if (visited.has(file)) return;
    visited.add(file);
    const source = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    if (file.endsWith(".css")) sheets.add(file);
    for (const [, specifier] of source.matchAll(/(?:\bimport\s*(?:[^;]*?\sfrom\s*)?|\bexport\s+[^;]*?\sfrom\s*|@import\s+)["']([^"']+)["']/g)) {
      const base = specifier.startsWith("@/") ? path.resolve("src", specifier.slice(2))
        : specifier.startsWith(".") ? path.resolve(path.dirname(file), specifier) : null;
      if (!base) continue;
      const resolved = [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`]
        .find(candidate => /\.(?:tsx?|css)$/.test(candidate) && existsSync(candidate));
      if (resolved) visit(resolved);
    }
  }
  const root = "src/app/(rev01)";
  for (const file of readdirSync(root, { recursive: true })) {
    if (/(?:^|\/)(?:layout|page)\.tsx$/.test(file)) visit(path.join(root, file));
  }
  return [...sheets].sort();
}

export function servedCss() {
  return servedCssFiles().map(file => readFileSync(file, "utf8")).join("\n");
}
