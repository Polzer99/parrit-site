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
  test(`proxy serves and negotiates both languages for ${id}`, async () => {
    const en = `/journal/themes/${id}`; const fr = locale.localizedPath(en, "fr");
    assert.ok(config.matcher.includes("/journal/:path*")); assert.ok(config.matcher.includes("/fr/:path*"));
    const request = (path, headers = {}) => new NextRequest(`https://parrit.ai${path}`, { headers });
    const query = "?source=qa&utm_source=mail&utm_custom=a%26b&utm_custom=two";
    const frenchRequest = request(`${fr}${query}`);
    const french = proxy(frenchRequest);
    assert.equal(french.status, 200);
    assert.equal(french.headers.get("x-middleware-rewrite"), null);
    assert.equal(french.headers.get("location"), null);
    assert.equal(frenchRequest.nextUrl.pathname, fr);
    assert.equal(frenchRequest.nextUrl.search, query);
    await withCompiledSite(async render => {
      for (const [language, pathname] of [["fr", fr], ["en", en]]) {
        const response = await render(`${pathname}${query}`);
        assert.equal(response.status, 200, pathname);
        assert.equal(response.headers.location, undefined);
        assert.equal(response.headers["x-middleware-rewrite"], undefined);
        assert.ok(response.html.includes(`<html lang="${language}"`));
        assert.ok(response.html.includes(`rel="canonical" href="https://parrit.ai${pathname}"`));
        for (const [alternate, target] of [["fr", fr], ["en", en], ["x-default", en]]) {
          assert.ok(response.html.includes(`hrefLang="${alternate}" href="https://parrit.ai${target}"`));
        }
      }
    });
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
  const rules = await compile("next.config.ts", { "./src/system/journal-translations.ts": loader("en")("src/system/journal-translations.ts") }).default.redirects();
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

import { withCompiledSite } from "./helpers/compiled-site.mjs";

// 12/11: enumerate the entire configured table against the compiled renderer.
test("every configured redirect destination resolves without a 404 and every fragment exists", { timeout: 90000 }, async () => {
  const { getAllJournalEntries } = await import("../src/system/journal-data.ts");
  const rules = await compile("next.config.ts", { "./src/system/journal-translations.ts": loader("en")("src/system/journal-translations.ts") }).default.redirects();
  await withCompiledSite(async render => {
    const cache = new Map();
    for (const rule of rules) {
      // Wildcard redirects can only promise reachability for existing resources.
      const targets = rule.destination.includes(":slug")
        ? getAllJournalEntries().map(entry => rule.destination.replace(":slug", entry.slug))
        : [rule.destination];
      for (const target of targets) {
        assert.ok(!target.includes(":"), `unexpanded destination: ${target}`);
        const url = new URL(target, "http://localhost:3210");
        if (!cache.has(url.pathname)) cache.set(url.pathname, await render(url.pathname));
        const response = cache.get(url.pathname);
        assert.equal(response.status, 200, `${rule.source} → ${target}`);
        if (url.hash) assert.ok(response.html.includes(`id="${url.hash.slice(1)}"`), `${target}: missing fragment`);
      }
    }
  });
});
