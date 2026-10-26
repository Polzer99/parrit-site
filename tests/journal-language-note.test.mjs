import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

// Render the actual page without a build or network. The badge is varied to prove
// that a notice is identified by its purpose, never by its position after h1.
const require = createRequire(import.meta.url);
const source = readFileSync("src/app/(rev01)/journal/[slug]/page.tsx", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const entry = { slug: "test-article", title: "Article title", description: "An ordinary deck.", content: "Article body.", date: "2026-10-25" };

for (const locale of ["en", "fr"]) {
  for (const certified of [false, true]) {
    test(`language notice is independent of deck and badge (${locale}, certified=${certified})`, async () => {
      const mocks = {
        "@/lib/server/locale": { getLocale: async () => locale },
        "@/system/auteur": { AUTEUR: { nom: "Parrit.ai", url: "https://parrit.ai" } },
        "@/system/jsonld": { blogPostingJsonLd: () => ({ "@type": "BlogPosting" }) },
        "@/system/journal": { getJournalEntry: () => entry, getAllJournalEntrySummaries: () => [entry] },
        "@/system/components": {
          K: ({ children }) => children,
          RegistryLine: () => null,
          HarnessBadge: () => certified ? createElement("aside", { className: "harness-badge" }, "Certificate") : null,
        },
        "next/link": { default: () => null },
        "next/navigation": { notFound: () => { throw new Error("Unexpected 404"); } },
        "react-markdown": { default: ({ children }) => createElement("p", null, children) },
      };
      const loaded = { exports: {} };
      new Function("require", "module", "exports", compiled)((id) => {
        if (Object.hasOwn(mocks, id)) return mocks[id];
        if (id === "react/jsx-runtime") return require(id);
        throw new Error(`Unmocked dependency (network forbidden): ${id}`);
      }, loaded, loaded.exports);
      const html = renderToStaticMarkup(await loaded.exports.default({ params: Promise.resolve({ slug: entry.slug }) }));
      const header = html.match(/<header class="journal-header">([\s\S]*?)<\/header>/)?.[1];
      assert.ok(header);
      assert.equal((header.match(/class="harness-badge"/g) ?? []).length, Number(certified));
      assert.match(header, /<p class="journal-deck" lang="en">An ordinary deck\.<\/p>/);
      const notes = [...header.matchAll(/<p data-language-note="">([^<]*)<\/p>/g)];
      assert.equal(notes.length, locale === "fr" ? 1 : 0);
      if (locale === "fr") assert.ok(notes[0][1].trim());
      else assert.doesNotMatch(html, /data-language-note/);
      assert.match(html, /<div class="journal-body" lang="en"><p>Article body\.<\/p><\/div>/);
    });
  }
}
