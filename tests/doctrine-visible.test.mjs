import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

// Render the actual private page with a synthetic record, never a live database.
// Every import is explicitly allowed; an unexpected server dependency fails closed.
const nativeRequire = createRequire(import.meta.url);
function loadSketch(lang, interet) {
  const source = readFileSync(new URL("../src/app/(rev01)/sketch/[id]/page.tsx", import.meta.url), "utf8");
  const code = ts.transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const wrap = ({ children }) => React.createElement("span", null, children);
  const imports = {
    "react/jsx-runtime": nativeRequire("react/jsx-runtime"),
    "next/link": ({ children, ...props }) => React.createElement("a", props, children),
    "next/navigation": { notFound: () => { throw new Error("Unexpected notFound"); } },
    "@/lib/server/sketch": { lireEsquisse: async () => ({ lang, interet, entreprise: "Fixture", declareLe: "2026-10-04T00:00:00Z" }) },
    "@/system/locale": { localizedPath: (path, locale) => `${locale === "fr" ? "/fr" : ""}${path}` },
    "@/system/components": { K: wrap, St: wrap, RegistryLine: () => null, Instrument: () => null },
  };
  const compiledPage = { exports: {} };
  const require = (id) => {
    assert.ok(Object.hasOwn(imports, id), `Unmocked import: ${id}`);
    return imports[id];
  };
  new Function("require", "module", "exports", code)(require, compiledPage, compiledPage.exports);
  return compiledPage.exports.default;
}

for (const locale of ["fr", "en"]) {
  for (const interest of ["reporting", "client-flow", "mail-followups", "full-os", "unknown-fixture"]) {
    test(`private sketch booking label and destination ${locale}/${interest}`, async () => {
      const Page = loadSketch(locale, interest);
      const html = renderToStaticMarkup(await Page({ params: Promise.resolve({ id: "synthetic-fixture" }) }));
      const link = html.match(/<a class="rev-button exec" href="([^"]+)">([^<]+)<\/a>/);
      assert.ok(link, "Private sketch must render its booking action");
      assert.equal(link[1], `${locale === "fr" ? "/fr" : ""}/commission`);
      assert.equal(link[2], locale === "fr" ? "Réserver l&#x27;examen" : "Book the examination");
    });
  }
}
