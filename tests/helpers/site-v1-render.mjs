import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
const native = createRequire(import.meta.url);
// Closed import allowlist: render real local components without Next server or network.
export function loader(locale) {
  const cache = new Map();
  function load(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file);
    const compiledModule = { exports: {} }; cache.set(file, compiledModule.exports);
    const code = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    new Function("require", "module", "exports", code)((id) => {
      if (["react", "react/jsx-runtime"].includes(id)) return native(id);
      if (id === "next/link") return function TestLink({ children, ...props }) { return React.createElement("a", props, children); };
      if (id === "@/lib/server/locale") return { getLocale: async () => locale };
      if (id === "@/system/components") return { K: ({ children }) => React.createElement("p", { className: "k" }, children) };
      if (id.startsWith("@/") || id.startsWith(".")) {
        const base = id.startsWith("@/") ? path.resolve("src", id.slice(2)) : path.resolve(path.dirname(file), id);
        const resolved = [base, `${base}.ts`, `${base}.tsx`].find(candidate => existsSync(candidate));
        if (resolved) return load(resolved);
      }
      throw new Error(`Unmocked dependency (network forbidden): ${id}`);
    }, compiledModule, compiledModule.exports);
    cache.set(file, compiledModule.exports); return compiledModule.exports;
  }
  return load;
}
export async function renderPage(locale, id = "home") {
  const load = loader(locale);
  const component = id === "home" ? await load("src/app/(rev01)/page.tsx").default() : await load("src/system/components/SiteV1Page.tsx").SiteV1Page({ id });
  return renderToStaticMarkup(component);
}
