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
test("registry preserves its date, zero writers and supplied localized summary verbatim", () => {
  for (const locale of ["fr", "en"]) {
    const summaryText = locale === "fr"
      ? "25 types d'information suivis au total. Pour 1, le transfert est terminé. Pour 8, il est en cours. Pour 4, les deux versions ne concordent pas. Pour 12, il n'a pas encore commencé."
      : "25 types of information tracked in total. For 1, the transfer is complete. For 8, it's underway. For 4, the two versions don't match. For 12, it hasn't started.";
    const html = renderToStaticMarkup(createElement(RegistrySnapshot, {
      locale, asOf: "2026-09-13", rows: [{ domain: "Outreach", source: "External tool (Instantly)", status: "Transfer not started", legacyWriters: 0 }], summaryText,
    }));
    for (const value of ['dateTime="2026-09-13"', "Outreach", "External tool (Instantly)", "Transfer not started", ">0</td>", renderToStaticMarkup(createElement("p", null, summaryText)).slice(3, -4)]) assert.ok(html.includes(value), value);
    const headings = locale === "fr"
      ? ["Type d'information", "Où l'information est enregistrée", "Situation", "Anciens outils encore utilisés en parallèle"]
      : ["Type of information", "Where it's recorded", "Status", "Legacy tools still in parallel use"];
    for (const heading of headings) {
      const escaped = renderToStaticMarkup(createElement("span", null, heading)).slice(6, -7);
      assert.ok(html.includes(`scope="col">${escaped}</th>`));
      assert.ok(html.includes(`data-label="${escaped}"`));
    }
    assert.doesNotMatch(html, /CUTOVER|MIGRATING|NOT_STARTED|PARITY_FAIL/);
  }
});

test("registry summary is escaped as plain text", () => {
  const html = renderToStaticMarkup(createElement(RegistrySnapshot, { asOf: "2026-09-13", rows: [], summaryText: "<script>bad()</script>" }));
  assert.ok(html.includes("&lt;script&gt;bad()&lt;/script&gt;"));
  assert.ok(!html.includes("<script>"));
});

test("editorial sources contain no em dash or retired step anchors", () => {
  for (const path of ["../src/app/(rev01)/systems/page.tsx", "../src/system/components/RegistrySnapshot.tsx"]) {
    const source = readFileSync(new URL(path, import.meta.url), "utf8");
    assert.doesNotMatch(source, /—|#step-|evidence\.steps|copy\.chain|copy\.stepNames/);
  }
});
