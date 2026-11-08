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
// Locale matters: English 1,355 is 1355, French 1,355 is 1.355.
// Keep compound identifiers (dates, times, versions) intact. Grouping accepts
// ordinary, nonbreaking and narrow nonbreaking spaces, never newlines.
const normalizeNumber = (value, locale) => value.replace(/[ \u00a0\u202f]/g, "").replaceAll(",", locale === "fr" ? "." : "");
const numbers = (text, locale) => [...new Set((text.match(/\d{1,3}(?:[ \u00a0\u202f]\d{3})+(?:[.,]\d+)?|\d+(?:[.,:/-]\d+)*/g) ?? []).map(value => normalizeNumber(value, locale)))].sort();
const blocks = text => text.match(/^```[^\n]*\n[\s\S]*?^```[^\n]*$/gm) ?? [];
const inlineCode = text => text.match(/(?<!`)`[^`\n]+`(?!`)/g) ?? [];
const versions = text => text.match(/\b(?:GPT-|GLM-|STD-|Opus |Apache )\d+(?:\.\d+)+\b|\b\d+(?:\.\d+){2,}\b/g) ?? [];
const quotations = text => [...text.matchAll(/“([^”\n]+)”|"([^"\n]+)"|«\s*([^»\n]+?)\s*»/g)].map(match => match[1] ?? match[2] ?? match[3]);
const withoutQuotations = (text, original) => quotations(matter(original).content).reduce((value, quote) => value.replaceAll(quote, " "), text);
function frenchNumberProse(text, original) {
  const { data, content } = matter(text);
  let prose = withoutQuotations(`${data.title}\n${data.description}\n${content}`, original);
  for (const literal of [...blocks(prose), ...inlineCode(prose), ...versions(prose)]) prose = prose.replaceAll(literal, " ");
  return prose.replace(/https?:\/\/[^\s)]+/g, " ")
    // Calendar years and regulation references are identifiers, not quantities.
    .replace(/\b(?:en|fin(?: de)?|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre) +\d{4}\b/gi, " ")
    .replace(/\b\d{4}\/\d+\b/g, " ");
}
function assertFrenchNumbers(text, original) {
  const prose = frenchNumberProse(text, original);
  assert.doesNotMatch(prose, /\d\.\d/, "decimal comma in French prose");
  assert.doesNotMatch(prose, /\d[ \t]*%|\d[ \t]+pour cent/i, "nonbreaking space before %");
  assert.doesNotMatch(prose, /\b\d{4,}\b/, "space-separated thousands in quantities");
}
const links = text => [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]);
const h2s = text => (text.match(/^## /gm) ?? []).length;
const prices = (text, locale) => (text.match(/[$€£]\s*\d[\d.,]*|\d[\d.,]*\s*(?:€|\$|£|euros?|dollars?)/gi) ?? []).map(value => normalizeNumber(value, locale));

test("numeric fidelity normalizes locale without confusing thousands and decimals", () => {
  assert.deepEqual(numbers("12.5 1.36 1.17 83,960 99,703 10,000.25", "en"), numbers("12,5 1,36 1,17 83 960 99\u00a0703 10\u202f000,25", "fr"));
  assert.notDeepEqual(numbers("1,355", "en"), numbers("1,355", "fr"));
  assert.notDeepEqual(numbers("1.36", "en"), numbers("1,37", "fr"));
  assert.deepEqual(numbers("2026-10-13 21:52 0.14.0", "en"), numbers("2026-10-13 21:52 0.14.0", "fr"));
  assert.deepEqual(numbers("10\n000", "fr"), ["000", "10"], "do not join separate lines");
  assert.deepEqual(prices("$4.40 $1.40", "en"), prices("$4,40 $1,40", "fr"));
  assert.notDeepEqual(prices("$4.40", "en"), prices("€4,40", "fr"));
});

test("French numeric typography rejects regressions while preserving literal exceptions", () => {
  const document = prose => `---\ntitle: "Exemple"\ndescription: "Exemple"\n---\n${prose}`;
  for (const prose of ["12.5 %", "12,5%", "12,5 %", "12,5 pour cent", "10000 lignes", "1976 lignes"]) {
    assert.throws(() => assertFrenchNumbers(document(prose), document("Original")), undefined, prose);
  }
  for (const prose of ["12,5\u00a0%", "12,5\u202f%", "10 000 lignes", "1\u202f976 lignes", "en 2026", "fin de 2027", "juillet 2027", "2026/1744", "GPT-4.1, Opus 4.8, Apache 2.0, version 0.14.0", "`1.36`", "```js\nconst ratio = 1.36;\n```", "[source](https://example.org/1.36)"]) {
    assert.doesNotThrow(() => assertFrenchNumbers(document(prose), document("Original")), prose);
  }
  const quote = "Agents that fabricate facts: what a 1,355-row cleanup taught us";
  assert.doesNotThrow(() => assertFrenchNumbers(document(`« ${quote} » : 1 355 lignes.`), document(`“${quote}”`)));
  assert.throws(() => assertFrenchNumbers(document('"12.5"'), document("Original")), "new quotations cannot hide invalid French numbers");
});

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
    assert.deepEqual(inlineCode(fr.content), inlineCode(en.content), "inline code is byte-for-byte identical");
    assert.deepEqual(versions(translated(slug)), versions(source(slug)), "model and version identifiers are unchanged");
    assert.deepEqual(links(fr.content), links(en.content), "same links in the same order");
    for (const quotation of quotations(en.content)) {
      assert.ok(fr.content.includes(quotation), `verbatim original quotation: ${quotation}`);
    }
    assert.deepEqual(numbers(withoutQuotations(translated(slug), source(slug)), "fr"), numbers(withoutQuotations(source(slug), source(slug)), "en"), "same numeric values, including dates and versions; verbatim quotations checked above");
    assert.deepEqual(prices(translated(slug), "fr"), prices(source(slug), "en"), "no new prices; only GLM's original third-party model comparison is retained");
    assert.doesNotMatch(translated(slug), /[—–]|\b(?:de plus|en outre|par ailleurs|il est important de noter|dans un monde où|innovant\w*|puissant\w*|révolutionnaire\w*|en conclusion|pour résumer|en résumé|pour conclure)\b/iu);
    for (const client of PUBLIC_CLIENT_NAMES) assert.ok(!translated(slug).toLowerCase().includes(client.toLowerCase()), client);
    if (/\brollback\b/i.test(fr.content)) assert.match(fr.content.slice(0, fr.content.search(/\brollback\b/i) + 50), /retour arrière/i);
    if (/\b[hH]arnais\b/.test(fr.content)) assert.match(fr.content.slice(0, fr.content.search(/\b[hH]arnais\b/) + 30), /harnais \(harness\)/i);
  });
}

for (const slug of FRENCH_JOURNAL_SLUGS) {
  test(`French numeric typography: ${slug}`, () => assertFrenchNumbers(translated(slug), source(slug)));
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
