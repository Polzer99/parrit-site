import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { loader } from "./helpers/site-v1-render.mjs";
import { visibleText } from "../scripts/brand-os-contracts.mjs";
import { privateClientNames } from "../scripts/lib/public-clients.mjs";
import { PUBLIC_CLIENT_NAMES } from "../src/system/public-clients.ts";

const themes = ["harness-engineering", "ai-sprints", "integration-developpement", "conseil-transformation"];
const routeFile = "src/app/(rev01)/journal/themes/[theme]/page.tsx";
const overrides = {
  "next/navigation": { notFound() { throw new Error("Unexpected missing theme"); } },
  "@/system/journal": { getAllJournalEntrySummaries: () => [] },
};
const scripts = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(match => JSON.parse(match[1]));
const text = html => visibleText(html).trim();

test("robots has one universal group, protects internal paths and allows rendering assets", () => {
  const robots = loader("en")("src/app/robots.ts").default();
  assert.deepEqual(robots.rules, [{ userAgent: "*", allow: "/", disallow: ["/os", "/api"] }]);
  assert.equal("host" in robots, false);
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://parrit.ai";
  assert.equal(robots.sitemap, `${site}/sitemap.xml`);
  // Verify the actual Next metadata route output, not just the source object.
  const output = readFileSync(".next/server/app/robots.txt.body", "utf8");
  assert.deepEqual(output.trim().split(/\r?\n/).filter(Boolean), [
    "User-Agent: *", "Allow: /", "Disallow: /os", "Disallow: /api", `Sitemap: ${site}/sitemap.xml`,
  ]);
});

for (const locale of ["fr", "en"]) test(`Organization distinguishes presence from the unchanged registered office (${locale})`, () => {
  const org = loader(locale)("src/system/jsonld.ts").organizationJsonLd(locale);
  assert.deepEqual(org.address, { "@type": "PostalAddress", addressLocality: "Rueil-Malmaison", addressCountry: "FR" });
  assert.deepEqual(org.location, ["Tourcoing", "Paris"].map(addressLocality => ({
    "@type": "Place", address: { "@type": "PostalAddress", addressLocality, addressCountry: "FR" },
  })));
  assert.deepEqual(org.areaServed, ["Tourcoing", "Paris", "Métropole européenne de Lille", "Hauts-de-France", "France"]);
  assert.deepEqual(org.sameAs, []);
});

test("llms publishes both locations and retains the registered office in both languages", () => {
  const content = readFileSync("public/llms.txt", "utf8");
  assert.ok(content.includes("Présence : Tourcoing et Paris. Zone d'intervention : toute la France."));
  assert.ok(content.includes("Presence: Tourcoing and Paris. Service area: across France."));
  assert.ok(content.includes("Siège social : Rueil-Malmaison, France."));
  assert.ok(content.includes("Registered office: Rueil-Malmaison, France."));
  assert.doesNotMatch(content, /Lille/);
});

for (const locale of ["fr", "en"]) for (const theme of themes) {
  test(`theme JSON-LD matches the visible localized content and sitemap (${locale}/${theme})`, async () => {
    const load = loader(locale, overrides);
    const route = load(routeFile);
    const props = { params: Promise.resolve({ theme }) };
    const html = renderToStaticMarkup(await route.default(props));
    const metadata = await route.generateMetadata(props);
    const graphs = scripts(html);
    const article = graphs.filter(item => item["@type"] === "Article");
    assert.equal(article.length, 1);
    const { orgRef } = load("src/system/auteur.ts");
    const canonical = `https://parrit.ai${metadata.alternates.canonical}`;
    const sitemap = load("src/app/sitemap.ts").default().find(item => item.url === canonical);
    assert.ok(sitemap);
    assert.deepEqual(article[0], {
      "@context": "https://schema.org", "@type": "Article",
      headline: text(html.match(/<h1>([\s\S]*?)<\/h1>/)[1]),
      description: text(html.match(/<header[\s\S]*?<p>([\s\S]*?)<\/p>/)[1]),
      inLanguage: locale, author: orgRef(), publisher: orgRef(),
      mainEntityOfPage: canonical, dateModified: sitemap.lastModified,
    });
    // Read only the visible FAQ section; scripts cannot satisfy these assertions.
    const faqHtml = html.match(/<section><h2>(?:Questions fréquentes|Frequently asked questions)<\/h2>([\s\S]*?)<\/section>/)?.[1] ?? "";
    const pairs = [...faqHtml.matchAll(/<div><h3>([\s\S]*?)<\/h3><p>([\s\S]*?)<\/p><\/div>/g)].map(([, question, answer]) => [text(question), text(answer)]);
    const faqs = graphs.filter(item => item["@type"] === "FAQPage");
    assert.equal(faqs.length, pairs.length ? 1 : 0);
    assert.equal(graphs.length, pairs.length ? 2 : 1);
    if (pairs.length) assert.deepEqual(faqs[0], {
      "@context": "https://schema.org", "@type": "FAQPage", inLanguage: locale,
      mainEntity: pairs.map(([name, answer]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text: answer } })),
    });
    const serialized = JSON.stringify(graphs);
    assert.doesNotMatch(serialized, /\d\s*(?:€|\$|EUR|USD)|\b(?:price|offers)\b/i);
    assert.deepEqual(privateClientNames(serialized), []);
    for (const name of PUBLIC_CLIENT_NAMES) assert.ok(!serialized.toLowerCase().includes(name.toLowerCase()), name);
  });
}

test("theme date changes propagate to Article and sitemap from the same constant", () => {
  const date = { JOURNAL_THEMES_LAST_MODIFIED: "2030-01-02" };
  const load = loader("en", { ...overrides, "./journal-themes.ts": date, "@/system/journal-themes": date });
  const graph = load("src/system/jsonld.ts").journalThemeJsonLd({ title: "Title", description: "Description", faq: [] }, "en", "https://parrit.ai/journal/themes/ai-sprints");
  const entries = load("src/app/sitemap.ts").default().filter(entry => entry.url.includes("/journal/themes/"));
  assert.equal(entries.length, 8);
  for (const entry of entries) assert.equal(entry.lastModified, graph[0].dateModified);
  assert.equal(graph[0].dateModified, date.JOURNAL_THEMES_LAST_MODIFIED);
  assert.equal(graph.length, 1);
});

test("theme JSON-LD escapes script terminators while preserving the exact content", async () => {
  const original = loader("en")("src/system/site-v1-pages.ts").SITE_V1_PAGES;
  const payload = '</script><script>alert("injected")</script><>&';
  const copy = { ...original["ai-sprints"].en, title: payload, description: payload, faq: [[payload, payload]] };
  const pages = { ...original, "ai-sprints": { ...original["ai-sprints"], en: copy } };
  const load = loader("en", { ...overrides, "@/system/site-v1-pages": { SITE_V1_PAGES: pages } });
  const html = renderToStaticMarkup(await load(routeFile).default({ params: Promise.resolve({ theme: "ai-sprints" }) }));
  assert.equal((html.match(/<script\b/g) ?? []).length, 1);
  const graphs = scripts(html);
  assert.equal(graphs[0].headline, payload);
  assert.equal(graphs[0].description, payload);
  assert.equal(graphs[1].mainEntity[0].name, payload);
  assert.equal(graphs[1].mainEntity[0].acceptedAnswer.text, payload);
  assert.doesNotMatch(html, /<script>alert/);
  assert.ok(html.includes("\\u003c/script>"));
});
