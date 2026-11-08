import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loader, renderPage } from "./helpers/site-v1-render.mjs";
import { visibleText } from "../scripts/brand-os-contracts.mjs";

const themes = ["harness-engineering", "ai-sprints", "integration-developpement", "conseil-transformation"];
const forbiddenFr = /ontologie|objets reliés|sources de logique|systèmes d'action|agnostiques|harness|back-office|raffinons|matière première/i;
const forbiddenEn = /ontology|linked objects|logic sources|systems of action|technology-agnostic|harness engineering/i;

// Exact copy is the product contract for the decision of 08/11/2026.
for (const locale of ["fr", "en"]) test(`hero headline and descriptive subtitle are localized in SSR (${locale})`, async () => {
  const html = await renderPage(locale);
  const normal = locale === "fr" ? "Votre expertise est la matière première." : "Your expertise is the raw material.";
  const bold = locale === "fr" ? "Nous la mettons au travail." : "We put it to work.";
  const subtitle = locale === "fr"
    ? "Vos équipes prennent l'IA en main. Nous développons les logiciels qui leur manquent."
    : "Your teams take AI in hand. We build the software they are missing.";
  assert.equal((html.match(/<h1>/g) ?? []).length, 1);
  assert.equal(html.match(/<h1>(.*?)<\/h1>/s)?.[1], `${normal} <b>${bold}</b>`);
  assert.equal(visibleText(html.match(/class="sub"><p>(.*?)<\/p>/s)?.[1] ?? ""), subtitle);
  const action = html.match(/class="actions"><a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/s);
  // Decision of 08/11/2026: nuit: the same destination now carries rdv-hero.
  assert.equal(action?.[1], `${locale === "fr" ? "/fr" : "/"}?source=rdv-hero#contact`);
  // Correctif 2 adds a decorative SVG; stripping its tags leaves trailing spaces.
  assert.equal(visibleText(action?.[2] ?? "").trim(), locale === "fr" ? "Prendre rendez-vous" : "Book a call");
});

for (const locale of ["fr", "en"]) test(`home copy is understandable, complete in SSR and preserves human approval (${locale})`, async () => {
  const html = await renderPage(locale);
  const text = visibleText(html);
  // The new H1 above explicitly permits “matière première”; the rest keeps the plain-language gate.
  assert.doesNotMatch(visibleText(html.replace(/<h1>.*?<\/h1>/s, "")), locale === "fr" ? forbiddenFr : forbiddenEn);
  assert.equal((text.match(/\bagents?\b/gi) ?? []).length, 1);
  assert.doesNotMatch(text, /—|\d\s*(?:€|\$|EUR|USD)|, pas\b|, not\b/i);
  const definition = html.match(/class="muted change-definition">([^<]+)<\/p>/)?.[1];
  assert.ok(definition);
  assert.match(definition, locale === "fr" ? /assistant.*agent IA.*règles.*soumet.*avant/ : /assistant.*AI agent.*rules.*submits.*before/);
  assert.match(html, /<h2>[^<]+<b>[^<]+<\/b><\/h2><p class="muted change-definition">/);
  // Hero-conversion permits the same authorized marks in the hero proof.
  const outsideReferences = html.replace(/<link rel="preload" as="image"[^>]*>/g, "").replace(/<section (?:id="references"|class="hero")[\s\S]*?<\/section>/g, "");
  assert.doesNotMatch(outsideReferences, /Laparra|Clevery|Forexpert|Joone|SNCF/i);
  const { HERO_STORIES, LAYERS, ZONES } = loader(locale)("src/system/ontology-hero-data.ts");
  const { SINGLE_PAGE_EN } = loader(locale)("src/system/single-page-copy.ts");
  const t = value => locale === "fr" ? value : SINGLE_PAGE_EN[value];
  for (const value of [...Object.values(LAYERS).flat(), ...Object.values(ZONES).flat(), ...HERO_STORIES.flatMap(story => story.steps)]) {
    assert.ok(t(value), `Missing translation: ${value}`);
    assert.doesNotMatch(t(value), /\bagents?\b|ontolog|logic sources|sources de logique/i);
  }
  const tags = [...html.matchAll(/class="tag (?:bo|new)">([^<]+)<\/span>/g)].map(match => match[1]);
  assert.equal(tags.length, 48);
  assert.equal(new Set(tags).size, 2);
  assert.doesNotMatch(tags.join(" "), /back.office|\bNouveau\b|\bNew\b(?! capability)/i);
});

for (const locale of ["fr", "en"]) test(`home metadata and Organization/Person JSON-LD follow the requested locale (${locale})`, async () => {
  const load = loader(locale);
  const metadata = await load("src/app/(rev01)/page.tsx").generateMetadata();
  for (const value of [metadata.title.absolute, metadata.description]) {
    assert.match(value, locale === "fr" ? /\bIA\b/ : /\bAI\b/);
    assert.match(value, /Tourcoing/);
    assert.match(value, /Paris/);
    assert.doesNotMatch(value, /Lille/);
  }
  assert.equal(metadata.openGraph.title, metadata.title.absolute);
  assert.equal(metadata.openGraph.description, metadata.description);
  assert.equal(metadata.alternates.canonical, locale === "fr" ? "/fr" : "/");
  const layout = loader(locale, {
    "@/system/components": { AnalyticsInit: () => null, RevHeader: () => null, RevFooter: () => null },
  })("src/app/(rev01)/layout.tsx");
  const html = renderToStaticMarkup(await layout.default({ children: createElement("main") })) + await renderPage(locale);
  const graphs = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  const organization = graphs.find(item => item["@type"] === "Organization");
  const founder = graphs.find(item => item["@type"] === "Person");
  assert.ok(organization);
  assert.ok(founder);
  assert.equal(organization["@context"], "https://schema.org");
  assert.equal(founder.worksFor["@id"], organization["@id"]);
  assert.match(organization.description, locale === "fr" ? /équipes.*IA.*logiciels/ : /teams.*AI.*software/);
  assert.equal(founder.jobTitle, locale === "fr" ? "Fondateur" : "Founder");
  // An unconfirmed company profile must not be invented or replaced by a personal one.
  assert.deepEqual(organization.sameAs, []);
});

for (const locale of ["fr", "en"]) test(`shared footer links to six existing destinations plus the language switch (${locale})`, () => {
  for (const pathname of [locale === "fr" ? "/fr" : "/", locale === "fr" ? "/fr/journal" : "/journal", "/journal/agent-ia-entreprise"]) {
    const load = loader(locale, { "next/navigation": { usePathname: () => pathname, useSearchParams: () => new URLSearchParams() } });
    const { RevFooter } = load("src/system/components/RevFooter.tsx");
    const html = renderToStaticMarkup(createElement(RevFooter, { locale }));
    const links = [...html.matchAll(/<a href="([^"]+)"/g)].map(match => match[1]);
    assert.equal(links.length, 7);
    const prefix = locale === "fr" ? "/fr" : "";
    assert.deepEqual(links.slice(0, 6), [...themes.map(slug => `${prefix}/journal/themes/${slug}`), `${prefix}/journal`, `${prefix}/legal`]);
    assert.doesNotMatch(visibleText(html), locale === "fr" ? forbiddenFr : forbiddenEn);
  }
});

test("French theme introductions use plain language while their addresses and sitemap alternates stay stable", async () => {
  const load = loader("fr", {
    "next/navigation": { notFound: () => { throw new Error("unexpected missing theme"); } },
    "@/system/journal": { getAllJournalEntrySummaries: () => [] },
  });
  const route = load("src/app/(rev01)/journal/themes/[theme]/page.tsx");
  for (const theme of themes) {
    const props = { params: Promise.resolve({ theme }) };
    const metadata = await route.generateMetadata(props);
    const html = renderToStaticMarkup(await route.default(props));
    const intro = visibleText(html.match(/<header[\s\S]*?<\/header>/)?.[0] ?? "");
    assert.ok(intro.length > 100);
    assert.doesNotMatch(intro + metadata.title.absolute, /harness|orchestrer|adoption|engineering|système supervisé/i);
    assert.ok(metadata.title.absolute.includes(visibleText(html.match(/<h1>(.*?)<\/h1>/)?.[1] ?? "")));
    assert.equal(metadata.alternates.canonical, `/fr/journal/themes/${theme}`);
  }
  const sitemap = load("src/app/sitemap.ts").default();
  for (const path of ["/", ...themes.map(theme => `/journal/themes/${theme}`)]) {
    for (const locale of ["fr", "en"]) {
      const localized = locale === "fr" ? `/fr${path === "/" ? "" : path}` : path;
      const entry = sitemap.find(item => item.url === `https://parrit.ai${localized}`);
      assert.ok(entry, localized);
      assert.equal(entry.alternates.languages[locale], entry.url);
      assert.equal(entry.lastModified, "2026-11-03");
    }
  }
  assert.equal(sitemap.filter(item => new URL(item.url).pathname.startsWith("/fr")).length, 7);
});

test("llms.txt is reproducible, bilingual and describes only current sections and routes", () => {
  const before = readFileSync("public/llms.txt", "utf8");
  execFileSync(process.execPath, ["scripts/generate-llms.mjs"], { stdio: "pipe" });
  assert.equal(readFileSync("public/llms.txt", "utf8"), before);
  assert.match(before, /## Français/);
  assert.match(before, /## English/);
  // 08/11: the order now uses the actual headings, and the Journal metadata is
  // included verbatim. Retired home concepts stay forbidden in the home copy;
  // a historical article may discuss architecture. Exact order/labels and all
  // article metadata are checked against their rendered sources in llms-articles.
  for (const [heading, prefix] of [["Français", "Dans l'ordre :"], ["English", "In order:"]]) {
    const section = before.split(`## ${heading}`)[1].split("\n## ")[0];
    const home = section.split("### FAQ")[0];
    assert.doesNotMatch(home, /how data travels|architecture|agents in production|ontolog|manufacture|#safeguards/i);
    assert.ok(home.includes(prefix), heading);
  }
  for (const slug of themes) for (const prefix of ["", "/fr"]) assert.ok(before.includes(`https://parrit.ai${prefix}/journal/themes/${slug}`));
});
