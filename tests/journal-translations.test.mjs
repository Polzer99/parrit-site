import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import matter from "gray-matter";
import { FRENCH_JOURNAL_SLUGS } from "../src/system/journal-translations.ts";
import { getAllJournalEntries, getAllJournalEntrySummaries, getJournalEntry } from "../src/system/journal-data.ts";
import { journalReadingMinutes } from "../src/system/journal-reading.ts";
import { PUBLIC_CLIENT_NAMES } from "../src/system/public-clients.ts";
import { loader } from "./helpers/site-v1-render.mjs";

const directory = "content/journal";
const source = slug => readFileSync(`${directory}/${slug}.mdx`, "utf8");
const translated = slug => readFileSync(`${directory}/fr/${slug}.mdx`, "utf8");
const numbers = text => [...new Set(text.match(/\d+(?:[.,:/-]\d+)*/g) ?? [])].sort();
const blocks = text => text.match(/^```[^\n]*\n[\s\S]*?^```[^\n]*$/gm) ?? [];
const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]);
const h2s = text => (text.match(/^## /gm) ?? []).length;
const prices = text => text.match(/[$€£]\s*\d[\d.,]*|\d[\d.,]*\s*(?:€|\$|£|euros?|dollars?)/gi) ?? [];

test("exactly the 31 published, indexable originals have a registered French edition", () => {
  const published = getAllJournalEntries().filter(entry => !entry.noindex).map(entry => entry.slug).sort();
  const files = readdirSync(`${directory}/fr`).filter(file => file.endsWith(".mdx")).map(file => file.slice(0, -4)).sort();
  assert.equal(published.length, 31);
  assert.deepEqual(files, published);
  assert.deepEqual([...FRENCH_JOURNAL_SLUGS].sort(), published);
  assert.equal(getAllJournalEntries().filter(entry => entry.noindex).length, 9);
});

for (const slug of FRENCH_JOURNAL_SLUGS) {
  test(`French fidelity and editorial gates: ${slug}`, () => {
    const en = matter(source(slug));
    const fr = matter(translated(slug));
    assert.deepEqual(fr.data, { ...en.data, title: fr.data.title, description: fr.data.description, translationOf: slug });
    assert.notEqual(fr.data.title, en.data.title);
    assert.notEqual(fr.data.description, en.data.description);
    assert.equal(fr.data.title.endsWith("?"), en.data.title.endsWith("?"));
    assert.equal(h2s(fr.content), h2s(en.content));
    assert.deepEqual(blocks(fr.content), blocks(en.content), "code blocks are byte-for-byte identical");
    assert.deepEqual(links(fr.content), links(en.content), "same links in the same order");
    for (const quotation of en.content.matchAll(/“([^”\n]+)”|"([^"\n]+)"/g)) {
      assert.ok(fr.content.includes(quotation[1] ?? quotation[2]), `verbatim original quotation: ${quotation[0]}`);
    }
    assert.deepEqual(numbers(translated(slug)), numbers(source(slug)), "same numbers, including dates and versions");
    assert.deepEqual(prices(translated(slug)), prices(source(slug)), "no new prices; only GLM's original third-party model comparison is retained");
    assert.doesNotMatch(translated(slug), /[—–]|\b(?:de plus|en outre|par ailleurs|il est important de noter|dans un monde où|innovant\w*|puissant\w*|révolutionnaire\w*|en conclusion|pour résumer|en résumé|pour conclure)\b/iu);
    for (const client of PUBLIC_CLIENT_NAMES) assert.ok(!translated(slug).toLowerCase().includes(client.toLowerCase()), client);
    if (/\brollback\b/i.test(fr.content)) assert.match(fr.content.slice(0, fr.content.search(/\brollback\b/i) + 50), /retour arrière/i);
    if (/\b[hH]arnais\b/.test(fr.content)) assert.match(fr.content.slice(0, fr.content.search(/\b[hH]arnais\b/) + 30), /harnais \(harness\)/i);
  });
}

test("prooflint runs on every French file when installed; inherited quoted placeholders are explicit", () => {
  const prooflint = path.join(homedir(), "parrit-os/tools/prooflint.py");
  if (!existsSync(prooflint)) return; // The equivalent mandatory Node gates above still run.
  const inherited = { "ai-prospecting-weak-signals": "[specific topic]", "whatsapp-business-agent": "[your name]" };
  for (const slug of FRENCH_JOURNAL_SLUGS) {
    const result = spawnSync("python3", [prooflint, `${directory}/fr/${slug}.mdx`], { encoding: "utf8", timeout: 10000 });
    assert.ifError(result.error);
    if (result.status === 0) continue;
    // The spec requires these verbatim English quotations. Accept only the exact
    // inherited diagnostic, never new placeholders or any other prooflint error.
    const marker = inherited[slug];
    assert.ok(marker && source(slug).includes(marker) && translated(slug).includes(marker), `${slug}: ${result.stdout}${result.stderr}`);
    const errors = result.stdout.split("\n").filter(line => line.trim().startsWith("•")).map(line => line.trim());
    assert.deepEqual(errors, [`• crochet suspect (placeholder ?) : ${marker}`], slug);
    assert.equal(result.status, 1);
  }
});

test("translation metadata fails closed instead of publishing a mismatched or draft edition", () => {
  const slug = "one-card-one-action";
  const en = source(slug);
  const { data, content } = matter(translated(slug));
  for (const mutation of [{ translationOf: "other-article" }, { date: "2020-01-01" }, { draft: true }, { noindex: true }, { slug: "other-article" }]) {
    const fr = matter.stringify(content, { ...data, ...mutation });
    const read = loader("fr", { "node:fs": {
      existsSync: () => true,
      readdirSync: () => [`${slug}.mdx`],
      readFileSync: filename => path.dirname(filename).endsWith("/fr") ? fr : en,
    } })("src/system/journal-data.ts");
    assert.throws(() => read.getJournalEntry(slug, "fr"), /translationOf|publication metadata|frontmatter slug/);
    assert.throws(() => read.getAllJournalEntrySummaries("fr"), /translationOf|publication metadata|frontmatter slug/);
    assert.equal(read.getJournalEntry(slug, "en").title, matter(en).data.title);
  }
});

test("localized reader keeps the original order and computes reading time on the actual French text", () => {
  const en = getAllJournalEntries();
  const fr = getAllJournalEntries("fr");
  assert.deepEqual(fr.map(entry => entry.slug), en.map(entry => entry.slug));
  const summaries = getAllJournalEntrySummaries("fr");
  for (const [index, entry] of fr.entries()) {
    const { content, ...summary } = entry;
    assert.deepEqual(summaries[index], { ...summary, readingMinutes: journalReadingMinutes(content) });
    assert.deepEqual(getJournalEntry(entry.slug, "fr"), entry);
    if (entry.noindex) assert.deepEqual(entry, en[index], "noindex editions remain English");
    else assert.equal(content, matter(translated(entry.slug)).content.trim());
  }
  assert.equal(getJournalEntry("../fr/one-card-one-action", "fr"), undefined);
  assert.equal(getJournalEntry("not-a-real-article", "fr"), undefined);
});
