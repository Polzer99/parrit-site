import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loader, renderPage } from "./helpers/site-v1-render.mjs";
import { visibleText } from "../scripts/brand-os-contracts.mjs";

// Count natural-language words consistently, retaining apostrophes and hyphens.
const words = value => value.trim().split(/\s+/u).filter(Boolean).length;
const flatten = value => Array.isArray(value) ? value.flat(Infinity).join(" ") : value;
const content = copy => [copy.description, copy.cases.intro, ...copy.cases.items,
  ...copy.steps.items.flat(), ...copy.deliverables.items, ...copy.deliverables.note,
  ...copy.rules.paragraphs, ...copy.faq.flat()].join(" ");
const titles = copy => [copy.title, copy.cases.title, copy.steps.title,
  copy.deliverables.title, copy.rules.title].join(" ");

for (const locale of ["fr", "en"]) {
  const load = loader(locale, {
    "next/navigation": { notFound() { throw new Error("Unexpected missing theme"); } },
  });
  const { SITE_V1_PAGES } = load("src/system/site-v1-pages.ts");
  const { JOURNAL_THEMES } = load("src/system/journal-themes.ts");
  test(`all four guides share the same data shape (${locale})`, () => {
    assert.equal(Object.keys(SITE_V1_PAGES).length, 4);
    for (const page of Object.values(SITE_V1_PAGES)) {
      assert.deepEqual(Object.keys(page[locale]).sort(), ["name", "title", "description", "cases", "steps", "deliverables", "rules", "faq"].sort());
      assert.deepEqual(Object.keys(page[locale].cases).sort(), ["intro", "items", "title"]);
      assert.deepEqual(Object.keys(page[locale].steps).sort(), ["items", "title"]);
      assert.deepEqual(Object.keys(page[locale].deliverables).sort(), ["items", "note", "title"]);
      assert.deepEqual(Object.keys(page[locale].rules).sort(), ["paragraphs", "title"]);
    }
  });
  for (const [slug, config] of Object.entries(JOURNAL_THEMES)) {
    const copy = SITE_V1_PAGES[config.page][locale];
    test(`four developed steps and substantial sections (${locale}/${slug})`, () => {
      assert.equal(copy.steps.items.length, 4);
      for (const step of copy.steps.items) {
        assert.equal(step.length, 2);
        // A step is the [name, text] pair defined by GuideCopy.
        assert.ok(words(flatten(step)) >= 12, `${step[0]}: ${words(flatten(step))} words < 12`);
      }
      const sections = [
        ["cases", [copy.cases.intro, ...copy.cases.items], 40],
        ["steps", copy.steps.items, 80],
        ["deliverables", [...copy.deliverables.items, ...copy.deliverables.note], 50],
        ["rules", copy.rules.paragraphs, 25],
      ];
      for (const [name, values, minimum] of sections) assert.ok(words(flatten(values)) >= minimum, `${name}: ${words(flatten(values))} words < ${minimum}`);
      assert.ok(words(content(copy)) >= 6 * words(titles(copy)), `${words(content(copy))} content words / ${words(titles(copy))} title words < 6`);
    });
    test(`real theme rendering has developed sections, restrained headings and two booking actions (${locale}/${slug})`, async () => {
      const route = load("src/system/pages/theme.tsx");
      const html = renderToStaticMarkup(await route.default({ params: Promise.resolve({ theme: slug }) }, locale));
      const withoutBooking = html.replace(/<section class="booking-call"[^>]*>[\s\S]*?<\/section>/g, "");
      assert.doesNotMatch(visibleText(withoutBooking), /Paul Larmaraud/);
      assert.doesNotMatch(withoutBooking.split("</header>")[1], /<h3\b/);
      assert.ok((html.match(/<h2\b/g) ?? []).length <= 7);
      assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
      const steps = html.match(/<ol class="theme-steps">([\s\S]*?)<\/ol>/)?.[1];
      assert.ok(steps);
      assert.equal((steps.match(/<li\b/g) ?? []).length, 4);
      assert.equal((steps.match(/<strong\b/g) ?? []).length, 4);
      assert.equal((steps.match(/<p\b/g) ?? []).length, 4);
      assert.match(html, /<aside\b[^>]*><strong>[\s\S]*?<\/strong><p>/);
      assert.equal((html.match(/<details open="">/g) ?? []).length, 1);
      for (const source of [`theme-${slug}-haut`, `theme-${slug}`]) assert.ok(html.includes(`href="${locale === "fr" ? "/fr" : ""}/rendez-vous?source=${source}"`));
    });
    test(`empty Journal sections disappear (${locale}/${slug})`, async () => {
      const empty = loader(locale, {
        "next/navigation": { notFound() { throw new Error("Unexpected missing theme"); } },
        "@/system/journal": { getAllJournalEntrySummaries: () => [] },
      });
      const html = renderToStaticMarkup(await empty("src/system/pages/theme.tsx").default({ params: Promise.resolve({ theme: slug }) }, locale));
      assert.doesNotMatch(html, /class="journal-list"/);
      assert.equal((html.match(/<h2\b/g) ?? []).length, 6);
    });
  }
  test(`booking descriptions contain no repeated personal name (${locale})`, () => {
    const { BOOKING_COPY, BOOKING_CALL_COPY } = load("src/system/booking.ts");
    assert.doesNotMatch(JSON.stringify([BOOKING_COPY[locale], BOOKING_CALL_COPY[locale]]), /Paul Larmaraud/);
  });
  test(`home names Paul only in the portrait caption and keeps one press section without assistants (${locale})`, async () => {
    const html = await renderPage(locale);
    assert.equal((visibleText(html).match(/Paul Larmaraud/g) ?? []).length, 1);
    const caption = html.match(/<figcaption[^>]*>([^<]*Paul Larmaraud[^<]*)<\/figcaption>/)?.[1];
    assert.equal(caption, locale === "fr" ? "Paul Larmaraud mène le premier échange." : "Paul Larmaraud leads the first call.");
    assert.doesNotMatch(html, /<section[^>]*id="assistant"|class="teamcap"/);
    const press = html.match(/<section[^>]*id="(?:mesures|measurements)"[\s\S]*?<\/section>/)?.[0];
    assert.ok(press);
    // 21/11 (coherence-et-garde-fous B.1): the assistants block is gone, the press keeps one column.
    assert.doesNotMatch(html, /id="assistant"|assistant-links|chatgpt\.com|claude\.ai\/new|perplexity\.ai|chat\.mistral\.ai/);
    assert.equal((press.match(/<p\b/g) ?? []).length, 1);
    // 21/11/2026 (soir, décision 5) : le chiffre de la presse est le nombre d'articles publiés et indexables
    // du Journal dans la langue de la page, lu au registre, jamais écrit en dur.
    const journal = load("src/system/journal.ts").getAllJournalEntrySummaries(locale);
    const { hasFrenchJournalTranslation } = load("src/system/journal-translations.ts");
    const published = journal.filter(entry => !entry.noindex && (locale !== "fr" || hasFrenchJournalTranslation(entry.slug))).length;
    // Le chiffre ne dépasse jamais le nombre de cartes réellement rendues par la page du Journal.
    const index = renderToStaticMarkup(await load("src/system/pages/journal.tsx").default(locale));
    assert.ok(published <= (index.match(/<li\b/g) ?? []).length);
    assert.ok(published > 0);
    assert.equal(press.match(/<strong class="press-count"[^>]*>(\d+)<\/strong>/)?.[1], String(published));
    assert.match(press, locale === "fr" ? /<figcaption>articles publiés dans le Journal\.<\/figcaption>/ : /<figcaption>articles published in the Journal\.<\/figcaption>/);
    assert.equal((press.match(/target="_blank"/g) ?? []).length, 0);
    assert.doesNotMatch(visibleText(html), /Chroniques parues dans Le Monde Informatique\.|Ou demandez à votre assistant\.|interroger votre assistant|ask your assistant/);
  });
  test(`both menus have distinct section anchors in page order (${locale})`, () => {
    const home = locale === "fr" ? "/fr" : "/";
    const menuLoad = loader(locale, { "next/navigation": { usePathname: () => home, useSearchParams: () => new URLSearchParams() } });
    const { HOME_SECTION_ORDER } = menuLoad("src/system/home-layers.ts");
    const mapping = locale === "fr" ? { offres: "offers", partenaires: "team", parcours: "path", questions: "questions", contact: "contact" } : { offers: "offers", team: "team", path: "path", questions: "questions", contact: "contact" };
    const html = renderToStaticMarkup(createElement(menuLoad("src/system/components/RevHeader.tsx").RevHeader, { locale }));
    for (const [, nav] of html.matchAll(/<nav\b[^>]*>([\s\S]*?)<\/nav>/g)) {
      const urls = [...nav.matchAll(/href="([^"]+)"/g)].map(([, href]) => new URL(href.replaceAll("&amp;", "&"), "https://example.invalid"));
      const anchors = urls.filter(url => url.hash).map(url => url.hash.slice(1));
      assert.equal(new Set(anchors).size, anchors.length);
      const order = anchors.map(id => HOME_SECTION_ORDER.indexOf(mapping[id]));
      assert.ok(order.every(index => index >= 0));
      assert.deepEqual(order, [...order].sort((a, b) => a - b));
      assert.equal(urls.filter(url => url.pathname === `${locale === "fr" ? "/fr" : ""}/journal`).length, 1);
      assert.deepEqual(anchors.filter(id => id !== "contact"), Object.keys(mapping).filter(id => id !== "contact"));
    }
  });
}
