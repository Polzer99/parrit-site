import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import ts from "typescript";
import { renderToStaticMarkup } from "react-dom/server";
import { loader } from "./helpers/site-v1-render.mjs";
import { unstable_getResponseFromNextConfig } from "next/dist/experimental/testing/server/config-testing-utils.js";

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

test("Next resolves French Journal aliases in one 308 with source and UTM intact", async () => {
  const nextConfig = load("../next.config.ts").default;
  for (const slug of ["one-card-one-action", "une-carte-une-action"]) {
    for (const query of ["source=test", "lang=fr&source=test&utm_source=mail&utm_campaign=a%26b&utm_custom=custom"]) {
      const response = await unstable_getResponseFromNextConfig({ url: `${origin}/fr/journal/${slug}?${query}`, nextConfig });
      assert.equal(response.status, 308);
      const destination = new URL(response.headers.get("location"));
      assert.equal(destination.pathname, article);
      assert.deepEqual([...destination.searchParams], [...new URLSearchParams(query)]);
      const final = await unstable_getResponseFromNextConfig({ url: destination.href, nextConfig });
      assert.equal(final.status, 200);
      assert.equal(request(destination.pathname + destination.search).headers.get("location"), null);
    }
  }
});

for (const target of ["fr", "en"]) test(`language link retains attribution before hydration (${target})`, () => {
  for (const pathname of [article, "/fr/journal", "/legal"]) {
    for (const query of ["", "lang=fr&source=test&utm_source=mail&utm_custom=a%26b&utm_custom=second"]) {
      const params = new URLSearchParams(query);
      const { LanguageLink } = loader("en", { "next/navigation": {
        usePathname: () => pathname, useSearchParams: () => params,
      } })("src/system/components/LanguageLink.tsx");
      const html = renderToStaticMarkup(LanguageLink({ locale: target, children: target }));
      const href = html.match(/href="([^"]+)"/)[1].replaceAll("&amp;", "&");
      const destination = new URL(href, origin);
      assert.equal(destination.pathname, locale.localizedPath(pathname, target));
      const expected = new URLSearchParams(query);
      expected.delete("lang");
      assert.deepEqual([...destination.searchParams], [...expected]);
      assert.equal(params.toString(), new URLSearchParams(query).toString(), "router params are not mutated");
      if (!query) assert.equal(href, destination.pathname, "no empty question mark");
    }
  }
});

test("static error pages retain a language link while query data is unavailable", () => {
  const { LanguageLink } = loader("en", { "next/navigation": {
    usePathname: () => "/", useSearchParams: () => { throw new Promise(() => {}); },
  } })("src/system/components/LanguageLink.tsx");
  assert.match(renderToStaticMarkup(LanguageLink({ locale: "fr", children: "FR" })), /<a href="\/fr" hrefLang="fr">FR<\/a>/);
});

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
