import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import ts from "typescript";

function load(path, overrides = {}) {
  const source = new URL(path, import.meta.url);
  const compiled = ts.transpileModule(readFileSync(source, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const compiledModule = { exports: {} };
  const require = createRequire(source);
  new Function("require", "module", "exports", compiled)(
    (name) => overrides[name] ?? require(name), compiledModule, compiledModule.exports,
  );
  return compiledModule.exports;
}
const locale = load("../src/system/locale.ts");
const { proxy } = load("../src/proxy.ts", { "@/system/locale": locale });
const { NextRequest } = createRequire(import.meta.url)("next/server");
const origin = "http://localhost:3210";
const article = "/journal/one-card-one-action";
const request = (path, headers) => proxy(new NextRequest(`${origin}${path}`, { headers }));

test("French article aliases have one configured 308 before the proxy, retaining queries", () => {
  const { redirects } = load("../next.config.ts").default;
  return redirects().then(rules => {
    const rule = rules.find(item => item.source === "/fr/journal/:slug");
    assert.equal(rule.statusCode, 308);
    assert.equal(rule.destination, "/journal/:slug");
    const response = request(`${article}?source=test`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("location"), null);
    assert.equal(response.headers.get("x-middleware-request-x-parrit-locale"), "en");
    assert.equal(response.headers.get("x-middleware-request-x-parrit-pathname"), article);
  });
});

test("English articles do not negotiate or trust a forged French hint", () => {
  const response = request(article, { "accept-language": "fr", "x-parrit-locale": "fr", "x-parrit-pathname": `/fr${article}` });
  assert.equal(response.headers.get("location"), null);
  assert.equal(response.headers.get("x-middleware-request-x-parrit-locale"), "en");
  assert.equal(response.headers.get("x-middleware-request-x-parrit-pathname"), article);
});

test("French feed, OG, private and unrelated aliases keep their original redirects", () => {
  for (const path of ["/journal/rss.xml", `${article}/og`, "/sketch/private-id", "/unknown", "/journal/article/unknown"]) {
    const response = request(`/fr${path}?source=test`);
    assert.equal(response.status, 301, path);
    assert.equal(response.headers.get("location"), `${origin}${path}?source=test`);
  }
});

test("article language switches keep the English canonical and preserve the suffix", () => {
  assert.equal(locale.localizedPath(`${article}?source=test#body`, "fr"), `${article}?source=test#body`);
  assert.equal(locale.localizedPath(`/fr${article}?source=test#body`, "en"), `${article}?source=test#body`);
  const response = request(`${article}?lang=fr&source=test`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("location"), null);
  assert.equal(response.headers.get("x-middleware-request-x-parrit-locale"), "en");
});
