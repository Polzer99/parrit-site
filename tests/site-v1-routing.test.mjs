import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
import { loader } from "./helpers/site-v1-render.mjs";
const require = createRequire(import.meta.url);
const { NextRequest } = require("next/server");
const locale = loader("en")("src/system/locale.ts");
function compile(file, imports) {
  const compiled = { exports: {} };
  const code = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  new Function("require", "module", "exports", code)(id => {
    assert.ok(Object.hasOwn(imports, id), `Unexpected import ${id}`); return imports[id];
  }, compiled, compiled.exports);
  return compiled.exports;
}
const { proxy, config } = compile("src/proxy.ts", { "next/server": require("next/server"), "@/system/locale": locale });
for (const id of ["conseil-transformation", "ai-sprints", "integration-developpement", "harness-engineering"]) {
  test(`proxy serves and negotiates both languages for ${id}`, () => {
    const en = `/journal/themes/${id}`; const fr = locale.localizedPath(en, "fr");
    assert.ok(config.matcher.includes("/journal/:path*")); assert.ok(config.matcher.includes("/fr/:path*"));
    const request = (path, headers = {}) => new NextRequest(`https://parrit.ai${path}`, { headers });
    const french = proxy(request(`${fr}?source=qa`));
    const rewrite = new URL(french.headers.get("x-middleware-rewrite"));
    assert.equal(rewrite.pathname, en); assert.equal(rewrite.search, "?source=qa");
    assert.equal(french.headers.get("x-middleware-request-x-parrit-locale"), "fr");
    const negotiated = proxy(request(`${en}?source=qa`, { "accept-language": "fr" }));
    assert.equal(negotiated.status, 302); assert.equal(new URL(negotiated.headers.get("location")).pathname, fr);
    for (const headers of [{ "user-agent": "Googlebot", "accept-language": "fr" }, { cookie: "parrit_locale=en", "accept-language": "fr" }]) assert.equal(proxy(request(en, headers)).headers.get("location"), null);
    const legacy = proxy(request(`${fr}?lang=en&utm_source=qa`)); assert.equal(legacy.status, 301);
    assert.equal(new URL(legacy.headers.get("location")).pathname, en);
    assert.equal(new URL(legacy.headers.get("location")).search, "?utm_source=qa");
  });
}
test("old routes resolve directly to themes or single-page anchors with permanent status", async () => {
  const rules = await compile("next.config.ts", {}).default.redirects();
  const themes = { "consulting-transformation": "conseil-transformation", "ai-sprints": "ai-sprints", "engineering-integration": "integration-developpement", "harness-engineering": "harness-engineering" };
  for (const [old, theme] of Object.entries(themes)) for (const prefix of ["", "/fr"]) {
    const rule = rules.find(rule => rule.source === `${prefix}/${old}`);
    assert.deepEqual(rule, { source: `${prefix}/${old}`, destination: `${prefix}/journal/themes/${theme}`, statusCode: 308 });
  }
  const sections = { manufacture: ["path", "parcours"], "build-with-you": ["path", "parcours"], standard: ["technologies", "technologies"], systems: ["technologies", "technologies"], dossiers: ["references", "references"], commission: ["contact", "contact"], contact: ["contact", "contact"] };
  for (const [old, anchors] of Object.entries(sections)) for (const [index, prefix] of ["", "/fr"].entries()) {
    const rule = rules.find(rule => rule.source === `${prefix}/${old}`);
    assert.deepEqual(rule, { source: `${prefix}/${old}`, destination: `${prefix || "/"}#${anchors[index]}`, statusCode: 308 });
  }
  assert.deepEqual(rules.find(rule => rule.source === "/fr/conseil-transformation"), { source: "/fr/conseil-transformation", destination: "/fr/journal/themes/conseil-transformation", statusCode: 308 });
  // Next preserves source queries when a redirect has no explicit destination query.
  for (const rule of rules.filter(rule => rule.statusCode === 308 && !rule.source.includes(":"))) assert.ok(!rule.destination.includes("?"));
  for (const rule of rules) assert.ok(!/^\/(?:fr\/)?(?:commission|manufacture|systems|standard|dossiers|build-with-you)(?:[?#]|$)/.test(rule.destination), `${rule.source} would create a chain`);
});
