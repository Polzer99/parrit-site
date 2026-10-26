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
for (const id of ["consulting-transformation", "ai-sprints", "engineering-integration", "harness-engineering"]) {
  test(`proxy serves and negotiates both languages for ${id}`, () => {
    const en = `/${id}`; const fr = locale.localizedPath(en, "fr");
    assert.ok(config.matcher.includes(en)); assert.ok(config.matcher.includes("/fr/:path*"));
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
test("contact redirects are explicit 301 destinations, before generic aliases", async () => {
  const rules = await compile("next.config.ts", {}).default.redirects();
  for (const prefix of ["", "/fr"]) {
    const rule = rules.find(rule => rule.source === `${prefix}/contact`);
    assert.deepEqual(rule, { source: `${prefix}/contact`, destination: `${prefix}/commission`, statusCode: 301 });
  }
});
