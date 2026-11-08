import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import path from "node:path";
import matter from "gray-matter";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loader, renderPage } from "./helpers/site-v1-render.mjs";
import { visibleText } from "../scripts/brand-os-contracts.mjs";

const load = loader("en", { "server-only": {}, "node:fs": fs, "node:path": path, "gray-matter": matter });
const { avecSource } = load("src/lib/registry/cta.ts");
const { journalReadingMinutes } = load("src/system/journal-reading.ts");
const { getJournalThemes, JOURNAL_THEMES } = load("src/system/journal-themes.ts");
const journal = load("src/system/journal.ts");
const contactExpectation = JSON.parse(fs.readFileSync("tests/fixtures/contact-expectation.json", "utf8"));
const approvedContact = {
  fr: "Premier échange de 15 minutes en visioconférence : vous présentez votre besoin, nous vous indiquons ce qui est réalisable.",
  en: "A first 15-minute video call: you present your needs, we tell you what is feasible.",
};
const supersededContact = {
  fr: "Vous décrivez un service ou un irritant, nous vous disons ce qui est faisable, et ce qui ne l'est pas.",
  en: "You describe a team or a pain point, we tell you what can be done, and what cannot.",
};

for (const locale of ["fr", "en"]) test(`contact copy matches correction 4 and rejects both superseded formulations (${locale})`, () => {
  assert.equal(contactExpectation[locale], approvedContact[locale]);
  // The shared suffix rejects both the original 30-minute and intermediate 15-minute copy.
  for (const root of ["src", "content/journal"]) {
    for (const relative of fs.readdirSync(root, { recursive: true }).filter(file => /\.(?:tsx?|mdx)$/.test(file))) {
      const file = path.join(root, relative);
      assert.ok(!fs.readFileSync(file, "utf8").includes(supersededContact[locale]), `${file}: superseded contact copy`);
    }
  }
});

test("avecSource keeps anchors after the query and replaces stale attribution without losing UTM", () => {
  for (const target of ["/#contact", "/fr#contact", "/fr?utm_source=mail&source=old&source=older#contact", "https://example.invalid/path?utm_content=a%26b#part?x"]) {
    const result = new URL(avecSource(target, "intention-formation-hero"), "https://example.invalid");
    const original = new URL(target, "https://example.invalid");
    assert.equal(result.pathname, original.pathname);
    assert.equal(result.hash, original.hash);
    assert.deepEqual(result.searchParams.getAll("source"), ["intention-formation-hero"]);
    for (const [key, value] of original.searchParams) if (key !== "source") assert.equal(result.searchParams.get(key), value);
  }
  for (const target of ["", "#capture", "mailto:hello@example.invalid"]) assert.equal(avecSource(target, "test"), target);
});

test("reading estimate counts article text, rounds minutes and ignores markup and destinations", () => {
  assert.equal(journalReadingMinutes(""), 1);
  assert.equal(journalReadingMinutes("word ".repeat(299)), 1);
  assert.equal(journalReadingMinutes("word ".repeat(300)), 2);
  assert.equal(journalReadingMinutes("word ".repeat(500)), 3);
  assert.equal(journalReadingMinutes("# Heading\n" + "[word](https://example.invalid/a-long-url) ".repeat(200)), 1);
  assert.equal(journalReadingMinutes("<!-- " + "hidden ".repeat(500) + " -->\nText"), 1);
  assert.equal(journalReadingMinutes("```ts\n" + "code ".repeat(400) + "\n```"), 2);
});

test("Journal summaries derive reading time from the real article body, without changing its fields", () => {
  const entries = journal.getAllJournalEntries();
  const summaries = journal.getAllJournalEntrySummaries();
  assert.equal(summaries.length, entries.length);
  for (const [i, { content, ...entry }] of entries.entries()) {
    assert.deepEqual(summaries[i], { ...entry, readingMinutes: journalReadingMinutes(content) });
  }
  assert.equal(Object.keys(JOURNAL_THEMES).length, 4);
  assert.deepEqual(getJournalThemes("unclassified-article"), []);
  assert.equal(getJournalThemes("the-claim-a-green-pipeline-never-makes").length, 2);
});

for (const locale of ["fr", "en"]) {
  test(`SSR intent destinations and one action per step (${locale})`, async () => {
    const html = await renderPage(locale);
    const home = locale === "fr" ? "/fr" : "/";
    const hero = html.match(/<section class="hero">([\s\S]*?)<\/section>/)[1];
    const links = [...hero.matchAll(/<a class="([^\"]+)" href="([^\"]+)">/g)];
    assert.equal(links.length, 2);
    for (const [i, intent] of ["projet", "formation"].entries()) {
      assert.match(links[i][1], i === 0 ? /\bexec\b/ : /\bghost\b/);
      assert.equal(links[i][2], `${home}?source=intention-${intent}-hero#contact`);
    }
    const steps = [...html.matchAll(/<div class="step">([\s\S]*?)<\/div>/g)];
    assert.equal(steps.length, 3);
    for (const [i, intent] of ["formation", "priorites", "projet"].entries()) {
      const actions = [...steps[i][1].matchAll(/<a class="([^\"]+)" href="([^\"]+)">/g)];
      assert.equal(actions.length, 1);
      assert.match(actions[0][1], /\bghost\b/);
      assert.equal(actions[0][2], `${home}?source=intention-${intent}-parcours#contact`);
    }
    const { QuickCapture } = loader(locale)("src/system/components/QuickCapture.tsx");
    const form = renderToStaticMarkup(createElement(QuickCapture, { locale, variant: "contact" }));
    const note = form.match(/<button[^>]+>[\s\S]*?<\/button><\/div><p class="contact-expectation">([^<]+)<\/p>/);
    assert.ok(note, "contact explanation follows the submit button");
    assert.equal(visibleText(note[1]), contactExpectation[locale]);
    assert.doesNotMatch(renderToStaticMarkup(createElement(QuickCapture, { locale })), /contact-expectation/);
  });

  test(`same-home click uses history, keeps URL attribution and respects reduced motion (${locale})`, () => {
    const { ContactIntentLink } = loader(locale)("src/system/components/ContactIntentLink.tsx");
    const home = locale === "fr" ? "/fr" : "/";
    const location = new URL(`${home}?utm_campaign=keep&source=old`, "https://example.invalid");
    const calls = [];
    const previousWindow = globalThis.window;
    const previousDocument = globalThis.document;
    globalThis.window = { location, history: { pushState: (...args) => calls.push(["history", ...args]) }, matchMedia: () => ({ matches: true }) };
    globalThis.document = { getElementById: () => ({ scrollIntoView: arg => calls.push(["scroll", arg]), focus: arg => calls.push(["focus", arg]) }) };
    try {
      const link = ContactIntentLink({ locale, intent: "formation", placement: "hero", children: "Train" });
      const event = { button: 0, preventDefault: () => calls.push(["prevent"]) };
      for (const flag of ["ctrlKey", "metaKey", "shiftKey", "altKey", "defaultPrevented"]) link.props.onClick({ ...event, [flag]: true });
      link.props.onClick({ ...event, button: 1 });
      assert.deepEqual(calls, []);
      link.props.onClick(event);
      assert.deepEqual(calls, [["prevent"], ["history", null, "", `${home}?utm_campaign=keep&source=intention-formation-hero#contact`], ["scroll", { behavior: "instant", block: "start" }], ["focus", { preventScroll: true }]]);
      calls.length = 0;
      location.pathname = "/journal";
      link.props.onClick(event);
      assert.deepEqual(calls, [], "other pages retain native navigation");
    } finally {
      globalThis.window = previousWindow;
      globalThis.document = previousDocument;
    }
  });

  test(`Journal index renders only registered themes and localized reading time (${locale})`, async () => {
    const entries = journal.getAllJournalEntrySummaries();
    const page = loader(locale, { "@/system/journal": journal })("src/app/(rev01)/journal/page.tsx");
    const html = renderToStaticMarkup(await page.default());
    const rows = [...html.matchAll(/<li>([\s\S]*?)<\/li>/g)];
    assert.equal(rows.length, entries.length);
    for (const [i, { slug, readingMinutes }] of entries.entries()) {
      const row = rows[i][1];
      assert.equal((row.match(/<a /g) ?? []).length, 1);
      assert.ok(row.includes(`href="/journal/${slug}"`));
      assert.ok(row.includes(`${readingMinutes} ${locale === "fr" ? "min de lecture" : "min read"}`));
      const themes = getJournalThemes(slug);
      assert.equal((row.match(/class="journal-entry-theme"/g) ?? []).length, themes.length);
      for (const theme of themes) assert.ok(row.includes(theme.label[locale]));
    }
  });
}

for (const locale of ["fr", "en"]) test(`incoming UTM survive in SSR links and modified-click destinations (${locale})`, async () => {
  const home = locale === "fr" ? "/fr" : "/";
  const page = loader(locale)("src/app/(rev01)/page.tsx");
  const html = renderToStaticMarkup(await page.default({ searchParams: Promise.resolve({ utm_campaign: "campaign & test", utm_custom: "custom", source: "old" }) }));
  const intents = [...html.matchAll(/href="([^"]*source=intention-[^"]+)"/g)];
  assert.equal(intents.length, 11); // Décision de Paul du 08/11/2026 : terrain + deux actions du bandeau.
  for (const [, href] of intents) {
    const url = new URL(href.replaceAll("&amp;", "&"), "https://example.invalid");
    assert.equal(url.pathname, home);
    assert.equal(url.hash, "#contact");
    assert.equal(url.searchParams.get("utm_campaign"), "campaign & test");
    assert.equal(url.searchParams.get("utm_custom"), "custom");
    assert.equal(url.searchParams.getAll("source").length, 1);
  }
});

for (const locale of ["fr", "en"]) test(`claims gate accepts 15 minutes and rejects stale durations everywhere (${locale})`, t => {
  const root = fs.mkdtempSync(path.join(tmpdir(), "contact-claims-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const directory of ["src/system/components", "scripts", "content/journal", "public"]) fs.mkdirSync(path.join(root, directory), { recursive: true });
  for (const file of ["public/llms.txt", "site.config.ts", "TRUTH.md"]) fs.writeFileSync(path.join(root, file), "");
  const text = contactExpectation[locale];
  const check = () => spawnSync(process.execPath, [path.resolve("scripts/false-claims-check.mjs")], { cwd: root, encoding: "utf8", timeout: 10_000 });
  for (const relativeFile of ["src/system/components/QuickCapture.tsx", "src/system/copy.ts"]) {
    const file = path.join(root, relativeFile);
    fs.writeFileSync(file, `const note = ${JSON.stringify(text)};`);
    const allowed = check();
    assert.equal(allowed.status, 0, allowed.stderr);
    // Both the original paragraph and a wrong duration in the current copy must fail.
    const former = `${locale === "fr" ? "30 minutes en visio." : "30 minutes by video call."} ${supersededContact[locale]}`;
    for (const stale of [former, text.replace(/15([ -])minute/, "30$1minute"), text + " Free booking in 30 minutes."]) {
      fs.writeFileSync(file, `const note = ${JSON.stringify(stale)};`);
      const rejected = check();
      assert.equal(rejected.status, 1, rejected.stderr);
      assert.ok(rejected.stderr.includes(relativeFile), rejected.stderr);
      assert.match(rejected.stderr, /call duration/);
    }
    fs.unlinkSync(file);
  }
});
