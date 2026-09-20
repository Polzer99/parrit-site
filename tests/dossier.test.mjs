import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

// Use the existing Node runner and TypeScript compiler to import real TSX.
// No browser, server, external requests, or product test route is needed.
const components = new URL("../src/system/components/", import.meta.url).href;
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL?.startsWith(components) && specifier.startsWith("./")) {
      return nextResolve(`${specifier}.tsx`, context);
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith(components) && url.endsWith(".tsx")) {
      const { outputText } = ts.transpileModule(readFileSync(new URL(url), "utf8"), {
        compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext },
      });
      return { format: "module", source: outputText, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});
const { Dossier } = await import("../src/system/components/Dossier.tsx");
hooks.deregister();

const base = {
  title: "Documented system",
  client: "An organisation",
  systemId: "SYS-001",
  commissionedYear: 2026,
  status: "Operational",
  problem: "Manual processing",
};
const render = (props = {}) => renderToStaticMarkup(createElement(Dossier, { ...base, ...props }));
const label = (name) => new RegExp(`>${name}</span>`);

test("required facts render without optional metadata or empty sections", () => {
  const html = render();
  for (const value of Object.values(base)) assert.ok(html.includes(String(value)));
  for (const name of ["Client", "System", "Commissioned", "Status"]) assert.match(html, label(name));
  for (const name of ["Domain", "Rev", "Capabilities built", "Measured change"]) assert.ok(!html.includes(name));
  assert.equal((html.match(/<section/g) ?? []).length, 1);
  assert.doesNotMatch(html, /<dd>.*?<strong><\/strong>|N\/A|TBD|—/);
});

for (const side of ["after", "before"]) {
  test(`${side} alone renders one full-width change block`, () => {
    const html = render({ [side]: ["Documented fact"] });
    assert.match(html, /03 · Measured change<\/strong>/);
    assert.match(html, label(side === "after" ? "After" : "Before"));
    assert.doesNotMatch(html, label(side === "after" ? "Before" : "After"));
    assert.match(html, /<li>Documented fact<\/li>/);
    assert.equal((html.match(/<ul>/g) ?? []).length, 1);
    assert.match(html, /grid-template-columns:minmax\(0, 1fr\)/);
  });
}

test("empty optional arrays and empty metadata produce no empty sections or rows", () => {
  const html = render({ domain: "", revision: "", capabilities: [], before: [], after: [], measurementPeriod: "30 days" });
  for (const name of ["Domain", "Rev", "Capabilities built", "Measured change", "30 days"]) assert.ok(!html.includes(name));
  assert.equal((html.match(/<section/g) ?? []).length, 1);
});

test("all supplied facts render verbatim with both change blocks and period", () => {
  const html = render({ domain: "Operations", revision: "R2", capabilities: ["Routing"], before: ["Manual"], after: ["Automated"], measurementPeriod: "30 days" });
  for (const value of ["Operations", "R2", "Routing", "Manual", "Automated"]) assert.ok(html.includes(value));
  assert.match(html, label("Domain"));
  assert.match(html, label("Rev"));
  assert.match(html, /02 · Capabilities built/);
  assert.match(html, /03 · Measured change · 30 days/);
  assert.match(html, label("Before"));
  assert.match(html, label("After"));
  assert.equal((html.match(/<section/g) ?? []).length, 3);
  assert.doesNotMatch(html, /grid-template-columns/);
});
