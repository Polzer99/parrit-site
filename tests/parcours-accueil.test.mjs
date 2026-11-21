import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loader, renderPage } from "./helpers/site-v1-render.mjs";
import { visibleText } from "../scripts/brand-os-contracts.mjs";

const anchors = {
  fr: ["haut", "references", "en-production", "offres", "partenaires", "parcours", "terrain", "technologies", "mesures", "questions", "contact"],
  en: ["haut", "references", "in-production", "offers", "team", "path", "in-the-field", "technologies", "measurements", "questions", "contact"],
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
    assert.equal((applications.match(/class="calc-card"/g) ?? []).length, 2);
    assert.match(visibleText(applications), locale === "fr" ? /L'assistant prépare\. Vous validez\./ : /The assistant prepares\. You approve\./);
    const home = locale === "fr" ? "/fr" : "/";
    const load = loader(locale, { "next/navigation": { usePathname: () => home, useSearchParams: () => new URLSearchParams() } });
    const { RevHeader } = load("src/system/components/RevHeader.tsx");
    const header = renderToStaticMarkup(createElement(RevHeader, { locale }));
    const nav = header.match(/<nav class="desktop-nav"[^>]*>([\s\S]*?)<\/nav>/)[1];
    const expected = locale === "fr" ? ["offres", "partenaires", "parcours", "questions"] : ["offers", "team", "path", "questions"];
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m => m[1]), [...expected.map(id => `${home}#${id}`), `${locale === "fr" ? "/fr" : ""}/journal`]);
  });

  test(`two craft cards, no contact action (${locale})`, async () => {
    // Décision de Paul du 08/11/2026, nuit : the cards explain the two crafts.
    const html = await renderPage(locale);
    const offers = section(html, locale === "fr" ? "offres" : "offers");
    const cards = [...offers.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)];
    assert.equal(cards.length, 2);
    for (const [, card] of cards) {
      assert.doesNotMatch(card, /<a\b|<button\b/);
      assert.equal((card.match(/<li>/g) ?? []).length, 3);
    }
  });

  test(`six native FAQ answers exactly match their localized structured data (${locale})`, async () => {
    const html = await renderPage(locale);
    const faq = section(html, "questions");
    const pairs = [...faq.matchAll(/<details(?: open="")?><summary>(.*?)<\/summary><p>(.*?)<\/p><\/details>/g)].map(m => m.slice(1).map(visibleText));
    assert.equal(pairs.length, 6);
    const graphs = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(m => JSON.parse(m[1])).filter(g => g["@type"] === "FAQPage");
    assert.equal(graphs.length, 1);
    assert.deepEqual(graphs[0], { "@context": "https://schema.org", "@type": "FAQPage", inLanguage: locale, mainEntity: pairs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) });
    assert.match(pairs[0][1], /15/);
    const opening = JSON.parse(fs.readFileSync("tests/fixtures/home-faq-opening.json", "utf8"));
    assert.equal(pairs[0][1], opening[locale]);
    assert.doesNotMatch(visibleText(faq), /\d\s*(?:€|\$|EUR|USD)/);
  });

  test(`press block keeps the localized Journal destination, no internal measure (${locale})`, async () => {
    // Décision de Paul du 15/11/2026 : les mesures internes quittent l'accueil.
    const html = await renderPage(locale);
    const measures = section(html, locale === "fr" ? "mesures" : "measurements");
    assert.doesNotMatch(measures, /\/journal\/|dateTime=|97\s*%/);
    assert.match(visibleText(measures), /Le Monde Informatique/);
    assert.ok(measures.includes(`href="${locale === "fr" ? "/fr" : ""}/journal"`));
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
