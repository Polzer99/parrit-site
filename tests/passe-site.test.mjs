import { parse, format } from "node:url";
import { prepareDestination } from "next/dist/shared/lib/router/utils/prepare-destination.js";
import { stringifyQuery } from "next/dist/server/server-route-utils.js";
import { addRequestMeta } from "next/dist/server/request-meta.js";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as nextServer from "next/server.js";
import { unstable_getResponseFromNextConfig } from "next/dist/experimental/testing/server/config-testing-utils.js";
import { loader } from "./helpers/site-v1-render.mjs";
import { getAllJournalEntries } from "../src/system/journal-data.ts";
import { hasFrenchJournalTranslation } from "../src/system/journal-translations.ts";
import { orgRef } from "../src/system/auteur.ts";
import { blogPostingJsonLd, personJsonLd } from "../src/system/jsonld.ts";

const origin = "http://localhost:3210";
const load = loader("en", { "next/server": nextServer });
const config = load("next.config.ts").default;
const { proxy } = load("src/proxy.ts");
const security = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "SAMEORIGIN",
  "content-security-policy": "frame-ancestors 'self'",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), browsing-topics=()",
};

for (const path of ["/", "/fr", "/journal/one-card-one-action", "/fr/journal/one-card-one-action", "/rendez-vous", "/fr/rendez-vous", "/journal/one-card-one-action/og", "/.well-known/security.txt"]) {
  test(`global security headers, without changing HSTS: ${path}`, async () => {
    const response = await unstable_getResponseFromNextConfig({ url: origin + path, nextConfig: config });
    for (const [name, value] of Object.entries(security)) assert.equal(response.headers.get(name), value);
    assert.equal(response.headers.get("strict-transport-security"), null);
  });
}

test("security contact is published, has a one-year expiry and both languages", () => {
  const text = readFileSync("public/.well-known/security.txt", "utf8");
  assert.match(text, /^Contact: mailto:paul\.larmaraud@parrit\.ai$/m);
  assert.match(text, /^Expires: 2027-11-12T00:00:00Z$/m);
  assert.match(text, /^Preferred-Languages: fr, en$/m);
});

for (const prefix of ["", "/fr"]) test(`formation redirects in one hop, preserving attribution: ${prefix}`, async () => {
  const query = "source=qa&utm_source=mail&utm_content=a%26b";
  const response = await unstable_getResponseFromNextConfig({ url: `${origin}${prefix}/formation`, nextConfig: config });
  assert.equal(response.status, 308);
  // Next's experimental helper appends query after fragments. Exercise the
  // production serializer as well, including repeated values.
  const input = parse(`/?${query}`, true).query;
  const req = {};
  addRequestMeta(req, "initQuery", input);
  const { parsedDestination } = prepareDestination({ destination: response.headers.get("location"), params: {}, query: input, appendParamsToQuery: false });
  const destinationQuery = parsedDestination.query;
  delete parsedDestination.query;
  parsedDestination.search = stringifyQuery(req, destinationQuery);
  const location = new URL(format(parsedDestination));
  assert.equal(location.pathname, prefix || "/");
  assert.equal(location.hash, "#offres");
  assert.equal(location.searchParams.toString(), query);
  assert.equal((await unstable_getResponseFromNextConfig({ url: location.href, nextConfig: config })).status, 200);
});

test("URL locale stays independent of spoofed headers and cookies; negotiation remains private", () => {
  for (const pathname of ["/legal", "/fr/legal", "/journal", "/fr/journal"]) {
    const response = proxy(new nextServer.NextRequest(origin + pathname, { headers: { cookie: "parrit_locale=fr", "accept-language": "fr", "x-parrit-locale": "fr", "x-parrit-pathname": "/fr/legal" } }));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("x-middleware-rewrite"), null);
    assert.equal(response.headers.get("x-middleware-request-x-parrit-pathname"), pathname);
    assert.equal(response.headers.get("x-middleware-request-x-parrit-locale"), pathname.startsWith("/fr") ? "fr" : "en");
  }
  const response = proxy(new nextServer.NextRequest(`${origin}/journal?utm_source=x`, { headers: { "accept-language": "fr" } }));
  assert.equal(response.status, 302);
  assert.equal(response.headers.get("location"), `${origin}/fr/journal?utm_source=x`);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.match(response.headers.get("vary"), /Accept-Language, Cookie, User-Agent/);
  for (const agent of ["Googlebot", "ChatGPT-User", "ClaudeBot"]) {
    assert.equal(proxy(new nextServer.NextRequest(origin + "/journal", { headers: { "accept-language": "fr", "user-agent": agent } })).headers.get("location"), null);
  }
});

for (const locale of ["en", "fr"]) {
  const prefix = locale === "fr" ? "/fr" : "";
  test(`Journal navigation, active state, and native booking query preservation: ${locale}`, () => {
    const query = "source=journal-test&utm_custom=one&utm_custom=two&utm_content=a%26b";
    for (const path of [`${prefix}/journal`, `${prefix}/journal/one-card-one-action`, `${prefix}/rendez-vous`]) {
      const { RevHeader } = loader(locale, { "next/navigation": { usePathname: () => path, useSearchParams: () => new URLSearchParams(query) } })("src/system/components/RevHeader.tsx");
      const html = renderToStaticMarkup(React.createElement(RevHeader, { locale }));
      for (const nav of html.matchAll(/<nav\b[^>]*>([\s\S]*?)<\/nav>/g)) {
        assert.ok(nav[1].includes(`href="${prefix}/journal"`));
        assert.ok(nav[1].indexOf(`#questions`) < nav[1].indexOf(`href="${prefix}/journal"`));
      }
      assert.equal((html.match(/aria-current="page"/g) ?? []).length, path.includes("/journal") ? 2 : 0);
      if (path.endsWith("/rendez-vous")) {
        assert.equal((html.match(/href="#reservation"/g) ?? []).length, 2);
        const destination = new URL("#reservation", `${origin}${path}?${query}`);
        assert.equal(destination.pathname, path);
        assert.equal(destination.search.slice(1), query);
        assert.doesNotMatch(html, /source=rdv-nav/);
      } else assert.match(html, /source=rdv-nav/);
    }
  });

  test(`displayed Journal cards all have a matching language: ${locale}`, async () => {
    const page = loader(locale)("src/app/(rev01)/journal/page.tsx");
    const html = renderToStaticMarkup(await page.default());
    const links = [...html.matchAll(/href="([^\"]*\/journal\/([^\"/?#]+))"/g)];
    const entries = getAllJournalEntries().filter(entry => locale === "en" || hasFrenchJournalTranslation(entry.slug));
    assert.equal(links.length, entries.length);
    for (const [, href, slug] of links) {
      assert.equal(href, `${prefix}/journal/${slug}`);
      if (locale === "fr") assert.ok(hasFrenchJournalTranslation(slug));
    }
  });

  test(`Article keeps Organization and home retains Person identity: ${locale}`, () => {
    const entry = getAllJournalEntries()[0];
    const article = blogPostingJsonLd(entry, locale);
    const { "@context": context, ...person } = personJsonLd(locale);
    assert.equal(context, "https://schema.org");
    assert.deepEqual(article.author, orgRef());
    assert.equal(person["@id"], "https://parrit.ai/#founder");
    assert.equal(person["@type"], "Person");
    assert.equal(person.name, "Paul Larmaraud");
    assert.equal(person.worksFor["@id"], article.publisher["@id"]);
  });
}

for (const locale of ["en", "fr"]) for (const machine of [false, true]) for (const updatedAt of [undefined, "2026-11-01", "2026-11-02"]) {
  test(`article header has no signature and keeps distinct localized dates: ${locale}, machine=${machine}, updated=${updatedAt}`, async () => {
    const { default: ReactMarkdown } = await import("react-markdown");
    const entry = {
      slug: "one-card-one-action", title: "Titre", date: "2026-11-01", updatedAt,
      description: "Chapeau de test.", content: "Chapeau de test.\n\n## Suite\n\nTexte du corps.",
      ...(machine ? { pilier: "audit-pme", author: "Paul Larmaraud" } : {}),
    };
    const page = loader(locale, {
      "react-markdown": ReactMarkdown,
      "next/navigation": { notFound: () => assert.fail("unexpected 404") },
      "@/system/journal": { getJournalEntry: () => entry, getAllJournalEntrySummaries: () => [entry] },
      "@/system/components": { HarnessBadge: () => null },
    })("src/system/pages/article.tsx");
    const html = renderToStaticMarkup(await page.default({ params: Promise.resolve({ slug: entry.slug }) }));
    const header = html.match(/<header class="journal-header">([\s\S]*?)<\/header>/)?.[1];
    assert.ok(header);
    assert.doesNotMatch(header, /Paul|Larmaraud|fondateur|founder/i);
    assert.doesNotMatch(html, /journal-byline/);
    const metadata = await page.generateMetadata({ params: Promise.resolve({ slug: entry.slug }) });
    assert.deepEqual(metadata.authors, [{ name: entry.author ?? "Parrit.ai", ...(entry.author ? {} : { url: "https://parrit.ai" }) }]);
    assert.equal(header.includes(locale === "fr" ? "Mis à jour le " : "Updated on "), Boolean(updatedAt && updatedAt !== entry.date));
    assert.equal((header.match(/<time /g) ?? []).length, updatedAt && updatedAt !== entry.date ? 2 : 1);
    const dateLabel = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(entry.date));
    assert.ok(header.includes(dateLabel));
    if (!machine) assert.match(header, /class="journal-deck"[^>]*>Chapeau de test\.<\/p><div class="journal-entry-meta">/);
    assert.ok(html.includes("<h2>Suite</h2>"));
    const booking = `${locale === "fr" ? "/fr" : ""}/rendez-vous?source=journal-${entry.slug}`;
    assert.equal(html.split(`href="${booking}"`).length - 1, 1);
  });
}
