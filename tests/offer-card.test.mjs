import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

// Compile the real component with React's JSX runtime, without a browser or server.
const source = new URL("../src/system/components/OfferCard.tsx", import.meta.url);
const compiled = ts.transpileModule(readFileSync(source, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;
const componentModule = { exports: {} };
new Function("require", "module", "exports", compiled)(createRequire(source), componentModule, componentModule.exports);
const { OfferCard } = componentModule.exports;
const minimal = { name: "Test offer", audience: "Audience", outcome: "Outcome", cta: { label: "Start", href: "/commission" } };
const render = (props) => renderToStaticMarkup(createElement(OfferCard, { ...minimal, ...props }));

test("missing or empty optional facts produce no sections or inferred price", () => {
  for (const optional of [{}, { deliverables: [], exclusions: [] }]) {
    const html = render(optional);
    for (const absent of ["<ul", "offer-price", "Not included", "Custom quote", "Sur devis"]) assert.ok(!html.includes(absent));
    assert.equal(html.match(/<a /g).length, 1);
  }
});
test("provided facts render and the price precedes the only CTA", () => {
  const html = render({ locale: "fr", deliverables: ["Livrable réel"], exclusions: ["Licence"], format: "10 heures", priceNote: "Sur devis" });
  for (const fact of ["Livrable réel", "Licence", "Non inclus", "10 heures", "Sur devis"]) assert.ok(html.includes(fact));
  assert.ok(html.indexOf("Sur devis") < html.indexOf("<a "));
});
test("documented price is localized without changing its amount or basis", () => {
  for (const [locale, basis, expected] of [["fr", "forfait", "À partir de 3 200 € HT · forfait"], ["en", "fixed fee", "Starting at €3,200 excl. VAT · fixed fee"]]) {
    const html = render({ locale, price: { amountHt: 3200, currency: "EUR", basis } }).replace(/[\u00a0\u202f]/g, " ");
    assert.ok(html.includes(expected));
  }
});
test("two explicit price modes are rejected", () => {
  assert.throws(() => render({ price: { amountHt: 3200, currency: "EUR", basis: "forfait" }, priceNote: "Sur devis" }), /either price or priceNote/);
});
