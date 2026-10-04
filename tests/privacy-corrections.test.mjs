import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(file, globals = {}, mocks = {}) {
  const source = readFileSync(file, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const loaded = { exports: {} };
  runInNewContext(compiled, {
    module: loaded, exports: loaded.exports, URLSearchParams, Date,
    fetch: () => { throw new Error("Network forbidden"); },
    require: (id) => {
      if (Object.hasOwn(mocks, id)) return mocks[id];
      if (id.endsWith(".css")) return {};
      if (id.startsWith("@/")) throw new Error(`Missing mock: ${id}`);
      return require(id);
    },
    ...globals,
  });
  return loaded.exports;
}
function browser(search = "?utm_source=arrival&utm_campaign=launch") {
  const deny = () => { throw new Error("Browser storage forbidden"); };
  const window = { location: { search, pathname: "/fr" } };
  const document = { referrer: "https://example.org/article" };
  for (const key of ["localStorage", "sessionStorage"]) Object.defineProperty(window, key, { get: deny });
  Object.defineProperty(document, "cookie", { get: deny, set: deny });
  return { window, document };
}

test("attribution captures arrival once, survives client navigation, never touches storage", () => {
  const globals = browser();
  const api = load("src/lib/attribution.ts", globals);
  const first = api.getAttribution(); // before AnalyticsInit's effect
  assert.equal(first.first_touch_utm_source, "arrival");
  assert.equal(first.first_touch_referrer, "https://example.org/article");
  globals.window.location = { search: "?utm_source=later", pathname: "/commission" };
  api.captureTouch();
  const next = api.getAttribution();
  assert.equal(next.first_touch_landing_page, "/fr");
  assert.equal(next.first_touch_timestamp, first.first_touch_timestamp);
  assert.equal(next.last_touch_utm_source, "arrival");
  assert.equal(next.utm_source, "later");
  assert.equal(api.getFirstTouchOnly().first_touch_utm_source, "arrival");
});
test("fresh document loses prior attribution; SSR and direct visits remain safe", () => {
  const ssr = load("src/lib/attribution.ts");
  ssr.captureTouch();
  assert.equal(Object.keys(ssr.getAttribution()).length, 0);
  assert.equal(Object.keys(ssr.getFirstTouchOnly()).length, 0);
  const globals = browser("");
  globals.document.referrer = "";
  const direct = load("src/lib/attribution.ts", globals).getAttribution();
  assert.equal(direct.first_touch_utm_source, undefined);
  assert.equal(direct.first_touch_referrer, undefined);
  assert.equal(direct.first_touch_landing_page, "/fr");
});
test("attribution source forbids persistent browser storage, including future additions", () => {
  assert.doesNotMatch(readFileSync("src/lib/attribution.ts", "utf8"), /localStorage|sessionStorage|cookie/i);
});
test("track is harmless without a PostHog client", () => {
  const { track } = load("src/lib/analytics.ts", browser(), {
    "@/lib/attribution": { getAttribution: () => { throw new Error("Should not be called"); } },
  });
  assert.doesNotThrow(() => track("form_completed"));
});
for (const locale of ["en", "fr"]) {
  test(`actual layout renders no PostHog script (${locale}), retaining JSON-LD`, async () => {
    const { default: Layout } = load("src/app/(rev01)/layout.tsx", {}, {
      "@/lib/server/locale": { getLocale: async () => locale },
      "@/system/components": { AnalyticsInit: () => null, RevHeader: () => null, RevFooter: () => null },
      "@/system/jsonld": { organizationJsonLd: () => ({ "@type": "Organization" }) },
      "@/system/locale": {},
    });
    const html = renderToStaticMarkup(await Layout({ children: "Page" }));
    assert.doesNotMatch(html, /posthog/i);
    assert.match(html, /application\/ld\+json/);
    assert.match(html, new RegExp(`lang="${locale}"`));
  });
}
test("public claim corrections stay absent from pages, articles and generated feed", () => {
  for (const file of ["src/app/(rev01)/page.tsx", "src/app/(rev01)/manufacture/page.tsx", "scripts/generate-llms.mjs", "public/llms.txt", "content/journal/what-is-a-company-operating-system.mdx", "content/journal/what-is-parrit-ai.mdx"]) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /depuis trois ans|three years|certified to|200\+? signals|5–10K|2\.5 months|Two to four weeks|Deux à quatre semaines|ATA 1926|Qualiopi|maintenance and evolution/i, file);
  }
});
