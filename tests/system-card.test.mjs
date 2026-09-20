import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

function loadComponent(name) {
  const source = new URL(`../src/system/components/${name}.tsx`, import.meta.url);
  const compiled = ts.transpileModule(readFileSync(source, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const componentModule = { exports: {} };
  const require = createRequire(source);
  new Function("require", "module", "exports", compiled)(
    (id) => id === "./K" ? loadComponent("K") : require(id), componentModule, componentModule.exports,
  );
  return componentModule.exports;
}
const { SystemCard } = loadComponent("SystemCard");
const props = { domain: "Domaine réel", name: "Capacité démontrée", input: "Entrée complète", process: "Traitement complet", output: "Sortie complète", limits: "Limite documentée", proofLabel: "Preuve datée" };
const render = (extra = {}) => renderToStaticMarkup(createElement(SystemCard, { ...props, ...extra }));

test("all supplied facts render verbatim, including long values", () => {
  const long = "Une entrée intégralement conservée. ".repeat(100);
  const html = render({ input: long });
  for (const value of Object.values({ ...props, input: long })) assert.ok(html.includes(value));
  assert.equal((html.match(/<dt>/g) ?? []).length, 4);
  assert.ok(html.startsWith("<article"));
});
test("the limits row remains present even for an empty or whitespace-only value", () => {
  for (const limits of ["", "   ", "\n"]) {
    const html = render({ limits });
    assert.match(html, />Limits<\/span><\/dt><dd[^>]*>/);
    assert.equal((html.match(/<dt>/g) ?? []).length, 4);
  }
});
test("limits is required by the public TypeScript contract", () => {
  const source = ts.createSourceFile("SystemCard.tsx", readFileSync(new URL("../src/system/components/SystemCard.tsx", import.meta.url), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const type = source.statements.find((node) => ts.isTypeAliasDeclaration(node) && node.name.text === "SystemCardProps");
  const limits = type.type.members.find((member) => member.name?.getText(source) === "limits");
  assert.ok(limits);
  assert.equal(limits.questionToken, undefined);
  assert.equal(limits.type.kind, ts.SyntaxKind.StringKeyword);
});
test("field labels are localized and missing non-limit facts are not fabricated", () => {
  const html = render({ locale: "fr", input: "", proofLabel: "" });
  for (const label of ["Traitement", "Sortie", "Limites"]) assert.ok(html.includes(label));
  assert.ok(!html.includes("Entrée"));
  assert.ok(!html.includes("<footer"));
});
test("untrusted text is escaped rather than interpreted as markup", () => {
  const html = render({ limits: '<script>alert("x")</script>' });
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("&lt;script&gt;"));
});
const { RegistrySnapshot } = loadComponent("RegistrySnapshot");
test("registry preserves its date, zero writers and exact historical totals", () => {
  const html = renderToStaticMarkup(createElement(RegistrySnapshot, {
    asOf: "2026-09-13", rows: [{ domain: "GTM.campaigns / outbound", source: "external:instantly", status: "NOT_STARTED", legacyWriters: 0 }],
    summary: { total: 25, cutover: 1, migrating: 8, notStarted: 12, parityFail: 4 },
  }));
  for (const value of ['dateTime="2026-09-13"', "GTM.campaigns / outbound", "external:instantly", "NOT_STARTED", ">0</td>", "25 domains", "CUTOVER 1", "MIGRATING 8", "NOT_STARTED 12", "PARITY_FAIL 4"]) assert.ok(html.includes(value), value);
});
