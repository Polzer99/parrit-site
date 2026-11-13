import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import { parse } from "node:url";
import { syncBuiltinESMExports } from "node:module";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import NextServerModule from "next/dist/server/next-server.js";
import { createRequestResponseMocks } from "next/dist/server/lib/mock-request.js";
import * as nextServer from "next/server.js";
import { unstable_getResponseFromNextConfig } from "next/dist/experimental/testing/server/config-testing-utils.js";
import { prepareDestination } from "next/dist/shared/lib/router/utils/prepare-destination.js";
import { stringifyQuery } from "next/dist/server/server-route-utils.js";
import { addRequestMeta } from "next/dist/server/request-meta.js";
import { loader } from "./helpers/site-v1-render.mjs";
import { getAllJournalEntries, getJournalEntry } from "../src/system/journal-data.ts";
import { FRENCH_JOURNAL_SLUGS } from "../src/system/journal-translations.ts";
import { localizedAlternates, localizedPath } from "../src/system/locale.ts";

const origin = "http://localhost:3210";
const load = loader("en", { "next/server": nextServer });
const { proxy } = load("src/proxy.ts");
const nextConfig = load("next.config.ts").default;

test("31 translated routes, 9 noindex redirects and every renamed French slug preserve attribution in one hop", async () => {
  const query = "source=journal-test&utm_source=mail&utm_custom=a%26b&utm_campaign=two";
  for (const entry of getAllJournalEntries()) {
    const pathname = `/fr/journal/${entry.slug}`;
    const response = await unstable_getResponseFromNextConfig({ url: `${origin}${pathname}?${query}`, nextConfig });
    assert.equal(response.status, entry.noindex ? 308 : 200, pathname);
    if (entry.noindex) {
      assert.equal(response.headers.get("location"), `${origin}/journal/${entry.slug}?${query}`);
      assert.equal(localizedPath(`/journal/${entry.slug}`, "fr"), `/journal/${entry.slug}`);
      assert.equal(localizedAlternates(`/journal/${entry.slug}`, "en").languages.fr, undefined);
    } else {
      const rewrite = proxy(new nextServer.NextRequest(`${origin}${pathname}?${query}`));
      assert.equal(rewrite.status, 200);
      assert.equal(rewrite.headers.get("x-middleware-rewrite"), null);
      assert.equal(rewrite.headers.get("location"), null);
      assert.equal(response.headers.get("location"), null);
      assert.equal(response.headers.get("x-middleware-rewrite"), null);
      assert.equal(rewrite.headers.get("x-middleware-request-x-parrit-locale"), "fr");
      assert.equal(rewrite.headers.get("x-middleware-request-x-parrit-pathname"), pathname);
    }
  }
  const aliases = (await nextConfig.redirects()).filter(rule => rule.source.startsWith("/fr/journal/") && !rule.source.includes(":"));
  assert.equal(aliases.length, 12);
  for (const rule of aliases) {
    const first = await unstable_getResponseFromNextConfig({ url: `${origin}${rule.source}?${query}`, nextConfig });
    assert.equal(first.status, 308);
    assert.equal(first.headers.get("location"), `${origin}${rule.destination}?${query}`);
    assert.ok(rule.destination.startsWith("/fr/journal/"));
    const final = await unstable_getResponseFromNextConfig({ url: first.headers.get("location"), nextConfig });
    assert.equal(final.status, 200);
  }
  // A new untranslated slug must keep its fallback, including a translated-prefix lookalike.
  for (const slug of ["future-untranslated-article", "one-card-one-action-extra"]) {
    const response = await unstable_getResponseFromNextConfig({ url: `${origin}/fr/journal/${slug}?${query}`, nextConfig });
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), `${origin}/journal/${slug}?${query}`);
  }
});

test("production redirect serialization preserves repeated UTM values", async () => {
  // The experimental config-testing utility uses URLSearchParams(object), which
  // collapses arrays to commas. Exercise the actual resolve-routes.js helpers
  // for repeated values, keeping the HTTP/browser regression as well.
  const queryText = "source=test&utm_custom=a%26b&utm_custom=two";
  const query = parse(`/?${queryText}`, true).query;
  const rules = (await nextConfig.redirects()).filter(rule => rule.source.startsWith("/fr/journal/"));
  for (const rule of rules) {
    const req = {};
    addRequestMeta(req, "initQuery", query);
    const { parsedDestination } = prepareDestination({ destination: rule.destination, params: { slug: "rgpd-llm-securite" }, query, appendParamsToQuery: false });
    assert.deepEqual([...new URLSearchParams(stringifyQuery(req, parsedDestination.query))], [...new URLSearchParams(queryText)]);
  }
});

test("compiled bilingual articles render the complete correct edition and reciprocal metadata without network", { timeout: 90000 }, async () => {
  const attempts = [];
  const originals = [globalThis.fetch, http.request, http.get, https.request, https.get, net.Socket.prototype.connect];
  const deny = () => { attempts.push("unexpected network"); throw new Error("Network forbidden"); };
  globalThis.fetch = http.request = http.get = https.request = https.get = net.Socket.prototype.connect = deny;
  syncBuiltinESMExports();
  const conf = JSON.parse(readFileSync(".next/required-server-files.json", "utf8")).config;
  const server = new NextServerModule.default({ dir: process.cwd(), dev: false, conf, hostname: "localhost", port: 3210 });
  try {
    await server.prepare();
    for (const slug of FRENCH_JOURNAL_SLUGS) for (const locale of ["en", "fr"]) {
      const bare = `/journal/${slug}`;
      const publicPath = localizedPath(bare, locale);
      const query = "source=journal-test&utm_source=mail&utm_custom=a%26b";
      const request = new nextServer.NextRequest(`${origin}${publicPath}?${query}`);
      const rewritten = proxy(request);
      assert.equal(rewritten.status, 200);
      assert.equal(rewritten.headers.get("x-middleware-rewrite"), null);
      assert.equal(rewritten.headers.get("location"), null);
      assert.equal(request.nextUrl.pathname, publicPath);
      assert.equal(request.nextUrl.search, `?${query}`);
      const chunks = [];
      const { req, res } = createRequestResponseMocks({
        url: `${publicPath}?${query}`,
        headers: { host: "localhost:3210", "x-parrit-pathname": rewritten.headers.get("x-middleware-request-x-parrit-pathname"), "x-parrit-locale": rewritten.headers.get("x-middleware-request-x-parrit-locale") },
        resWriter: chunk => { chunks.push(Buffer.from(chunk)); return true; },
      });
      await server.getRequestHandler()(req, res);
      if (!res.finished) await new Promise(resolve => res.once("finish", resolve));
      assert.equal(res.statusCode, 200, publicPath);
      assert.equal(res.getHeader("location"), undefined);
      assert.equal(res.getHeader("x-middleware-rewrite"), undefined);
      const html = Buffer.concat(chunks).toString();
      const entry = getJournalEntry(slug, locale);
      assert.ok(html.includes(`<html lang="${locale}"`), publicPath);
      assert.doesNotMatch(html, /data-language-note/);
      assert.ok(html.includes(`rel="canonical" href="https://parrit.ai${publicPath}"`), publicPath);
      for (const [language, href] of Object.entries(localizedAlternates(bare, locale).languages)) {
        assert.ok(html.includes(`hrefLang="${language}" href="https://parrit.ai${href}"`), `${publicPath}: ${language}`);
      }
      const body = html.match(/<div class="journal-body" lang="([^"]+)">([\s\S]*?)<\/div>/);
      assert.equal(body?.[1], locale, publicPath);
      assert.equal(body?.[2].replaceAll("<!-- -->", ""), renderToStaticMarkup(React.createElement(ReactMarkdown, null, entry.content)), `${publicPath}: complete edition, including code and citations`);
      const article = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1])).find(data => data["@type"] === "Article");
      assert.equal(article?.inLanguage, locale, publicPath);
      assert.equal(article?.headline, entry.title);
      assert.equal(article?.description, entry.description);
      assert.equal(article?.mainEntityOfPage, `https://parrit.ai${publicPath}`);
      assert.equal(article?.datePublished, entry.date);
      assert.equal(article?.image, `https://parrit.ai${bare}/og`, "existing OG remains directly reachable");
      assert.ok(html.includes(`href="${locale === "fr" ? "/fr" : ""}/rendez-vous?source=journal-${slug}"`));
    }
  } finally {
    await server.close();
    [globalThis.fetch, http.request, http.get, https.request, https.get, net.Socket.prototype.connect] = originals;
    syncBuiltinESMExports();
  }
  assert.deepEqual(attempts, []);
});

test("every bilingual server bundle traces all French editions", () => {
  for (const route of ["page", "journal/page", "journal/[slug]/page", "journal/themes/[theme]/page"]) {
    const trace = JSON.parse(readFileSync(`.next/server/app/(rev01)/${route}.js.nft.json`, "utf8")).files.join("\n");
    for (const slug of FRENCH_JOURNAL_SLUGS) assert.ok(trace.includes(`/content/journal/fr/${slug}.mdx`), `${route}: ${slug}`);
  }
});
