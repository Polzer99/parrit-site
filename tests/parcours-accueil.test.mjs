import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loader, renderPage } from "./helpers/site-v1-render.mjs";
import { visibleText } from "../scripts/brand-os-contracts.mjs";

const anchors = {
  fr: ["references", "terrain", "offres", "en-production", "parcours", "services", "technologies", "partenaires", "bandeau", "questions", "articles", "contact"],
  en: ["references", "in-the-field", "offers", "in-production", "path", "services", "technologies", "team", "bandeau", "questions", "articles", "contact"],
};
const section = (html, id) => {
  const result = html.match(new RegExp(`<section\\b[^>]*id="${id}"[^>]*>([\\s\\S]*?)</section>`))?.[1];
  assert.ok(result, id);
  return result;
};

for (const locale of ["fr", "en"]) {
  test(`layered home order, definition and navigation (${locale})`, async () => {
    const html = await renderPage(locale);
    assert.deepEqual([...html.matchAll(/<section\b[^>]*id="([^"]+)"/g)].map(m => m[1]), anchors[locale]);
    assert.doesNotMatch(html, /<section[^>]*id="(?:ce-qui-change|what-changes)"/);
    const applications = section(html, locale === "fr" ? "en-production" : "in-production");
    assert.match(applications, /<h2>[\s\S]*?<\/h2><p class="muted change-definition">[^<]+<\/p>/);
    assert.equal((visibleText(html).match(locale === "fr" ? /agent IA/g : /AI agent/g) ?? []).length, 1);
    const home = locale === "fr" ? "/fr" : "/";
    const load = loader(locale, { "next/navigation": { usePathname: () => home, useSearchParams: () => new URLSearchParams() } });
    const { RevHeader } = load("src/system/components/RevHeader.tsx");
    const header = renderToStaticMarkup(createElement(RevHeader, { locale }));
    const nav = header.match(/<nav class="desktop-nav"[^>]*>([\s\S]*?)<\/nav>/)[1];
    const expected = locale === "fr" ? ["en-production", "offres", "parcours", "services", "questions", "contact"] : ["in-production", "offers", "path", "services", "questions", "contact"];
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]), expected.map(id => `${home}#${id}`));
  });

  test(`three offer cards each carry one attributed contact action (${locale})`, async () => {
    const page = loader(locale)("src/app/(rev01)/page.tsx");
    const html = renderToStaticMarkup(await page.default({ searchParams: Promise.resolve({ source: "old", utm_campaign: "a & b" }) }));
    const offers = section(html, locale === "fr" ? "offres" : "offers");
    const cards = [...offers.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)];
    assert.equal(cards.length, 3);
    for (const [i, intent] of ["formation", "grands-groupes", "pme"].entries()) {
      const actions = [...cards[i][1].matchAll(/<a class="([^"]+)" href="([^"]+)"/g)];
      assert.equal(actions.length, 1);
      assert.match(actions[0][1], /\bghost\b/);
      const url = new URL(actions[0][2].replaceAll("&amp;", "&"), "https://example.invalid");
      assert.equal(url.pathname, locale === "fr" ? "/fr" : "/");
      assert.equal(url.hash, "#contact");
      assert.deepEqual(url.searchParams.getAll("source"), [`intention-${intent}-offres`]);
      assert.equal(url.searchParams.get("utm_campaign"), "a & b");
    }
  });

  test(`six native FAQ answers exactly match their localized structured data (${locale})`, async () => {
    const html = await renderPage(locale);
    const faq = section(html, "questions");
    const pairs = [...faq.matchAll(/<details><summary>(.*?)<\/summary><p>(.*?)<\/p><\/details>/g)].map(m => m.slice(1).map(visibleText));
    assert.equal(pairs.length, 6);
    const graphs = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(m => JSON.parse(m[1])).filter(g => g["@type"] === "FAQPage");
    assert.equal(graphs.length, 1);
    assert.deepEqual(graphs[0], { "@context": "https://schema.org", "@type": "FAQPage", inLanguage: locale, mainEntity: pairs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) });
    assert.match(pairs[0][1], /15/);
    const opening = JSON.parse(fs.readFileSync("tests/fixtures/home-faq-opening.json", "utf8"));
    assert.equal(pairs[0][1], opening[locale]);
    assert.doesNotMatch(visibleText(faq), /\d\s*(?:€|\$|EUR|USD)/);
  });

  test(`latest articles match date-sorted Journal cards with one final destination (${locale})`, async () => {
    const load = loader(locale, { "server-only": {}, "node:fs": fs, "node:path": path, "gray-matter": matter });
    const entries = load("src/system/journal.ts").getAllJournalEntrySummaries(locale);
    const html = await renderPage(locale);
    const articles = section(html, "articles");
    const cards = [...articles.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)];
    assert.equal(cards.length, 3);
    assert.deepEqual(entries.map(e => e.date), entries.map(e => e.date).sort().reverse());
    for (const [i, entry] of entries.slice(0, 3).entries()) {
      const card = cards[i][1];
      assert.equal((card.match(/<a /g) ?? []).length, 1);
      const contentLocale = locale === "fr" && !entry.noindex ? "fr" : "en";
      assert.match(card, new RegExp(`href="${contentLocale === "fr" ? "/fr" : ""}/journal/${entry.slug}"`));
      assert.match(card, new RegExp(`hrefLang="${contentLocale}"`));
      assert.ok(visibleText(card).includes(entry.title));
      assert.ok(card.includes(`dateTime="${entry.date}"`));
      assert.ok(card.includes(`${entry.readingMinutes} ${locale === "fr" ? "min de lecture" : "min read"}`));
      const themes = load("src/system/journal-themes.ts").getJournalThemes(entry.slug);
      for (const theme of themes) assert.ok(visibleText(card).includes(theme.label[locale]));
      assert.equal((card.match(/class="journal-entry-theme"/g) ?? []).length, themes.length);
    }
    assert.match(articles, new RegExp(`href="${locale === "fr" ? "/fr" : ""}/journal"`));
  });
}

test("FAQ serialization escapes script terminators without changing the displayed answer", () => {
  const load = loader("fr");
  const { HOME_LAYERS } = load("src/system/home-layers.ts");
  const { SinglePage } = load("src/system/components/SinglePage.tsx");
  const original = HOME_LAYERS.fr.faq[0][1];
  const hostile = '</script><script>alert("test")</script>';
  try {
    HOME_LAYERS.fr.faq[0][1] = hostile;
    const html = renderToStaticMarkup(createElement(SinglePage, { locale: "fr" }));
    const faq = section(html, "questions");
    const structured = faq.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1];
    assert.ok(!structured.includes("<"));
    assert.ok(!html.includes(hostile));
    assert.equal(JSON.parse(structured).mainEntity[0].acceptedAnswer.text, hostile);
  } finally {
    HOME_LAYERS.fr.faq[0][1] = original;
  }
});

test("legacy hashes and offer anchors localize without modifying unrelated fragments", () => {
  const { localizedHomeHash } = loader("fr")("src/system/home-anchors.ts");
  for (const old of ["#ce-qui-change", "#what-changes"]) {
    assert.equal(localizedHomeHash(old, "fr"), "#en-production");
    assert.equal(localizedHomeHash(old, "en"), "#in-production");
  }
  assert.equal(localizedHomeHash("#offres", "en"), "#offers");
  assert.equal(localizedHomeHash("#offers", "fr"), "#offres");
  for (const locale of ["fr", "en"]) for (const hash of ["", "#questions", "#articles", "#references", "#contact", "#unrelated"]) {
    assert.equal(localizedHomeHash(hash, locale), hash);
  }
});
