import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { visibleText } from "../scripts/brand-os-contracts.mjs";

const require = createRequire(import.meta.url);
const read = (file) => readFileSync(file, "utf8");
function load(file, mocks, expose = "") {
  const compiled = ts.transpileModule(read(file) + expose, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const loaded = { exports: {} };
  new Function("require", "module", "exports", compiled)((id) => {
    if (Object.hasOwn(mocks, id)) return mocks[id];
    if (id === "react/jsx-runtime") return require(id);
    throw new Error(`Unmocked dependency (network forbidden): ${id}`);
  }, loaded, loaded.exports);
  return loaded.exports;
}
const localeModule = load("src/system/locale.ts", {});
const homePath = "src/app/(rev01)/page.tsx";
const forbidden = /[€$£¥\d—–]|\b(?:EUR|USD|GBP|prix|price|tarif|costs?\s+\d)\b|https?:|www\.|<a\b|\]\(/i;
const dictionaries = [];
for (const locale of ["fr", "en"]) {
  const mocks = {
    "@/lib/server/locale": { getLocale: async () => locale },
    "@/system/locale": localeModule,
    "@/system/examination": { EXAM_NOTE: { fr: "Note", en: "Note" } },
    "@/system/journal": { getAllJournalEntrySummaries: () => [] },
    "@/system/components": { K: ({ children }) => createElement("p", null, children) },
    "@/system/components/ProductScene": { ProductScene: () => null },
    "@/system/components/AgentEsquisse": { AgentEsquisse: () => null },
    "next/link": { default: ({ children, ...props }) => createElement("a", props, children) },
  };
  const home = load(homePath, mocks, "\nexport const testDictionary = DICT;");
  dictionaries.push(home.testDictionary[locale].capacites);
  test(`six capabilities and localized footer link render (${locale})`, async () => {
    const copy = home.testDictionary[locale].capacites;
    assert.equal(copy.items.length, 6);
    for (const item of copy.items) {
      assert.equal(item.length, 2);
      for (const text of item) {
        assert.equal(typeof text, "string");
        assert.ok(text.trim());
        assert.doesNotMatch(text, forbidden);
      }
    }
    const html = renderToStaticMarkup(await home.default());
    const sections = [...html.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)].map(([section]) => section);
    const index = sections.findIndex((section) => section.includes('id="capacites"'));
    assert.ok(index > 0);
    assert.match(sections[index - 2], /home-s-parcours/);
    assert.match(sections[index - 1], /home-s-maison/);
    assert.match(sections[index + 1], /home-s-build/);
    assert.equal(sections.filter((section) => /class="home-s-parcours"/.test(section)).length, 1);
    const section = sections[index];
    assert.match(section, /class="home-s-capacites"/);
    assert.doesNotMatch(section, /home-s-parcours/);
    assert.equal((section.match(/<h3\b/g) ?? []).length, 6);
    assert.equal((section.match(/<h2\b/g) ?? []).length, 1);
    assert.doesNotMatch(section, /<(?:a|button)\b|\shref=/);
    assert.doesNotMatch(visibleText(section), forbidden);
    const href = localeModule.localizedPath("/build-with-you", locale);
    assert.ok(!html.includes(`href="${href}"`));
    const maison = sections[index - 1];
    assert.equal((maison.match(/<a\b/g) ?? []).length, 1);
    assert.ok(maison.includes(`href="${localeModule.localizedPath("/commission", locale)}"`));
    const footer = load("src/system/components/RevFooter.tsx", mocks);
    const footerHtml = renderToStaticMarkup(createElement(footer.RevFooter, { locale }));
    assert.ok(footerHtml.includes(`href="${href}"`));
    const secondary = footerHtml.match(new RegExp(`<a[^>]*href="${href}"[^>]*>`))?.[0];
    assert.ok(secondary);
    assert.doesNotMatch(secondary, /rev-button|\bexec\b|\bghost\b/);
    const metadata = await home.generateMetadata();
    assert.equal(metadata.description, home.testDictionary[locale].hero.sub.split(". ")[0] + ".");
  });
}
test("capabilities share the same structure across locales", () => {
  assert.deepEqual(Object.keys(dictionaries[0]), Object.keys(dictionaries[1]));
  assert.deepEqual(dictionaries[0].items.map(Object.keys), dictionaries[1].items.map(Object.keys));
});
test("machine-readable positioning drops maison and matches the organization", () => {
  const llms = read("public/llms.txt");
  assert.doesNotMatch(llms, /\bmaison\b/i);
  const org = load("src/system/jsonld.ts", { "./auteur.ts": { orgRef: () => ({}) } }).organizationJsonLd();
  assert.ok(llms.includes(org.description));
});

test("offer guards accept the approved operations phrase but still reject pricing", () => {
  for (const file of ["tests/brand-os-render.test.mjs", "tests/anti-slop-copy.spec.ts"]) {
    const expression = read(file).match(/\/offert\|([^\n]+?)\/i/);
    assert.ok(expression, file);
    const guard = new RegExp("offert|" + expression[1], "i");
    assert.doesNotMatch("Choisir les cas d'usage à partir de vos opérations, les chiffrer et les ordonner.", guard);
    for (const price of ["à partir de 500 euros", "à partir de cinq cents euros", "à partir de vos opérations : forfait 500 euros", "fixed price", "sur devis"]) {
      assert.match(price, guard, file);
    }
  }
});
