import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { loader, renderPage } from "./helpers/site-v1-render.mjs";
import { visibleText } from "../scripts/brand-os-contracts.mjs";
import { PUBLIC_CLIENT_NAMES } from "../src/system/public-clients.ts";
import { renderLlms } from "../scripts/generate-llms.mjs";

const output = () => readFileSync("public/llms.txt", "utf8");
const language = (text, locale) => locale === "fr" ? text.split("## Français\n")[1].split("## English\n")[0] : text.split("## English\n")[1];
const articles = text => [...text.matchAll(/^- (https:\/\/parrit\.ai\/(?:fr\/)?journal\/[^\s/]+) : (.+) \((\d{4}-\d{2}-\d{2})\)\. (.+)$/gm)];
// Inline emphasis adds no text node. Remove its tags before decoding entities;
// visibleText alone inserts a synthetic space on either side of every tag.
const text = html => visibleText(html.replace(/<\/?b>/g, "")).trim();

for (const locale of ["fr", "en"]) {
  test(`llms section order and labels equal the actual rendered home (${locale})`, async () => {
    const html = await renderPage(locale);
    const headings = [...html.matchAll(/<section\b[^>]*>([\s\S]*?)<\/section>/g)].map(([, section]) => {
      const heading = section.match(/<h[12](?:\s[^>]*)?>([\s\S]*?)<\/h[12]>/)?.[1]
        ?? section.match(/<p id="technologies-title"[^>]*>([\s\S]*?)<\/p>/)?.[1];
      assert.ok(heading, "every section has its existing heading");
      return text(heading);
    });
    assert.equal(headings.length, 13);
    const prefix = locale === "fr" ? "- Dans l'ordre : " : "- In order: ";
    assert.equal(language(output(), locale).split("\n").find(line => line.startsWith(prefix)), prefix + headings.join(" ; "));
  });

  test(`llms includes exactly the six displayed FAQ pairs, verbatim (${locale})`, async () => {
    const html = await renderPage(locale);
    const pairs = [...html.matchAll(/<details><summary>(.*?)<\/summary><p>(.*?)<\/p><\/details>/g)].map(match => match.slice(1).map(text));
    assert.equal(pairs.length, 6);
    const faq = language(output(), locale).split("### FAQ\n")[1]?.split("\n### ")[0].trim();
    assert.equal(faq, pairs.map(([question, answer]) => `- ${question}\n  ${answer}`).join("\n"));
  });

  test(`llms articles equal sitemap and RSS with localized metadata and registered themes (${locale})`, async () => {
    const load = loader(locale);
    const entries = load("src/system/journal.ts").getAllJournalEntrySummaries(locale).filter(entry => !entry.noindex);
    const prefix = locale === "fr" ? "/fr" : "";
    const sitemap = load("src/app/sitemap.ts").default().map(entry => new URL(entry.url).pathname).filter(url => new RegExp(`^${prefix}/journal/[^/]+$`).test(url));
    const rss = await load("src/app/(rev01)/journal/rss.xml/route.ts").GET().text();
    const links = [...rss.matchAll(/<item>[\s\S]*?<link>(.*?)<\/link>/g)].map(match => new URL(match[1]).pathname);
    const listed = articles(language(output(), locale));
    assert.ok(entries.length > 0);
    assert.equal(listed.length, sitemap.length);
    assert.equal(listed.length, entries.length);
    assert.equal(new Set(listed.map(match => match[1])).size, listed.length);
    assert.deepEqual(listed.map(match => new URL(match[1]).pathname), sitemap);
    assert.deepEqual(listed.map(match => new URL(match[1]).pathname), links.map(link => `${prefix}${link}`));
    assert.ok(links.every(link => link.startsWith("/journal/")), "the existing RSS remains English");
    assert.deepEqual(listed.map(match => match[3]), listed.map(match => match[3]).sort().reverse());
    const { getJournalThemes } = load("src/system/journal-themes.ts");
    for (const [index, entry] of entries.entries()) {
      const suffix = getJournalThemes(entry.slug).map(theme => ` [${theme.label[locale]}]`).join("");
      assert.equal(listed[index][0], `- https://parrit.ai${prefix}/journal/${entry.slug} : ${entry.title} (${entry.date}). ${entry.description}${suffix}`);
    }
    for (const client of PUBLIC_CLIENT_NAMES) assert.ok(!listed.map(match => match[0]).join("\n").toLowerCase().includes(client.toLowerCase()), client);
    assert.doesNotMatch(language(output(), locale), /les articles restent en anglais/);
    if (locale === "fr") {
      const originals = load("src/system/journal.ts").getAllJournalEntrySummaries("en").filter(entry => !entry.noindex);
      for (const [index, entry] of entries.entries()) {
        assert.notEqual(entry.title, originals[index].title, entry.slug);
        assert.notEqual(entry.description, originals[index].description, entry.slug);
      }
    }
    const builtSitemap = readFileSync(".next/server/app/sitemap.xml.body", "utf8");
    for (const match of listed) assert.ok(builtSitemap.includes(`<loc>${match[1]}</loc>`), match[1]);
  });
}

function fixtureLoader(extra = {}) {
  const today = new Date().toISOString().slice(0, 10);
  const fixture = {
    older: { date: "2020-01-01" }, today: { date: today },
    future: { date: "9999-01-01" }, draft: { date: "2020-01-01", draft: true },
    hidden: { date: "2020-01-01", noindex: true }, ...extra,
  };
  const files = Object.fromEntries(Object.entries(fixture).map(([slug, fields]) => [`${slug}.mdx`, `---\n${JSON.stringify({ title: slug, slug, description: "Original description", ...fields })}\n---\nBody.`]));
  return loader("en", { "node:fs": {
    existsSync: () => true, readdirSync: () => Object.keys(files),
    readFileSync: filename => { const source = files[path.basename(filename)]; assert.ok(source); return source; },
  } });
}

test("Journal, sitemap and RSS exclude draft/future entries and share the noindex rule", async () => {
  const load = fixtureLoader();
  const journal = load("src/system/journal.ts");
  assert.deepEqual(journal.getAllJournalEntries().map(entry => entry.slug), ["today", "hidden", "older"]);
  assert.equal(journal.getJournalEntry("draft"), undefined);
  assert.equal(journal.getJournalEntry("future"), undefined);
  assert.ok(journal.getJournalEntry("hidden"), "noindex is still directly readable");
  const urls = load("src/app/sitemap.ts").default().map(entry => entry.url).filter(url => /\/journal\/[^/]+$/.test(url));
  assert.deepEqual(urls.map(url => url.split("/").at(-1)), ["today", "older"]);
  const rss = await load("src/app/(rev01)/journal/rss.xml/route.ts").GET().text();
  assert.doesNotMatch(rss, /\/journal\/(draft|future|hidden)</);
  assert.match(rss, /\/journal\/today</);
  assert.deepEqual(articles(language(renderLlms(journal.getAllJournalEntrySummaries()), "en")).map(match => match[1]), urls);
});

test("invalid publication flags fail closed", () => {
  for (const field of ["draft", "noindex"]) {
    assert.throws(() => fixtureLoader({ invalid: { date: "2020-01-01", [field]: "true" } })("src/system/journal.ts").getAllJournalEntries(), new RegExp(field));
  }
});

test("generation is deterministic and the prebuild artifact is current", () => {
  assert.equal(renderLlms(), output());
  assert.equal(renderLlms(), renderLlms());
});

test("client names in article titles, descriptions or URLs fail generation", () => {
  for (const client of PUBLIC_CLIENT_NAMES) for (const field of ["title", "description", "slug"]) {
    const entry = { title: "Title", description: "Description", slug: "safe-slug", date: "2020-01-01", noindex: false, [field]: client.toLowerCase() };
    assert.throws(() => renderLlms([entry]), /Client names forbidden/);
  }
});

test("equal-date articles sort by original English title without mutating the input", () => {
  const entries = ["Zulu", "Alpha"].map(title => ({ title, slug: title.toLowerCase(), description: "Original", date: "2020-01-01", noindex: false }));
  const before = structuredClone(entries);
  for (const locale of ["fr", "en"]) assert.deepEqual(articles(language(renderLlms(entries), locale)).map(match => match[2]), ["Alpha", "Zulu"]);
  assert.deepEqual(entries, before);
});

test("noindex articles never enter llms, including their confidential metadata", () => {
  const content = renderLlms([{ title: PUBLIC_CLIENT_NAMES[0], description: "Hidden metadata", slug: "hidden", date: "2020-01-01", noindex: true }]);
  for (const locale of ["fr", "en"]) assert.equal(articles(language(content, locale)).length, 0);
  assert.doesNotMatch(content, /Hidden metadata|\/journal\/hidden/);
  for (const name of PUBLIC_CLIENT_NAMES) assert.ok(!content.toLowerCase().includes(name.toLowerCase()));
});
