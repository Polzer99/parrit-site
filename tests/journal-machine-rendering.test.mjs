import assert from "node:assert/strict";
import { after, test } from "node:test";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import { syncBuiltinESMExports } from "node:module";
import path from "node:path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { renderToStaticMarkup } from "react-dom/server";
import { loader } from "./helpers/site-v1-render.mjs";
import { journalMarkdownBlocks } from "../src/system/journal-markdown.ts";
import { unstable_getResponseFromNextConfig } from "next/dist/experimental/testing/server/config-testing-utils.js";

const network = [globalThis.fetch, http.request, http.get, https.request, https.get, net.Socket.prototype.connect];
const attempts = [];
const deny = () => { attempts.push("network"); throw new Error("Network forbidden in Journal rendering tests"); };
globalThis.fetch = http.request = http.get = https.request = https.get = net.Socket.prototype.connect = deny;
syncBuiltinESMExports();
after(() => {
  [globalThis.fetch, http.request, http.get, https.request, https.get, net.Socket.prototype.connect] = network;
  syncBuiltinESMExports();
  assert.deepEqual(attempts, []);
});

const slug = "daily-journal-render-fixture";
const manifestPath = "../../content/plan/journal-translations.json";
const body = "Une réponse directe avant tout titre.\n\n## La règle précède le choix\n\n| Critère | Choix |\n| --- | --- |\n| Contrôle | **Humain** |\n\n## La preuve permet une décision\n\nSelon Insee, le contrôle précède la décision.";
const base = {
  slug, title: "Comment choisir un outil ?", description: "Une méthode pour décider.",
  date: "2026-01-01", updatedAt: "2026-01-02", pilier: "audit-pme", requete: "choisir un outil IA",
  author: "Paul Larmaraud", sources: [{ label: "Source publique", url: "https://example.org/report", publisher: "Insee", published_at: "2026-01-01" }],
  faq: [
    { q: "Quel besoin ?", a: "Commencez par un besoin précis." },
    { q: "Qui décide ?", a: "La personne responsable du processus." },
    { q: "Quelle preuve ?", a: "Comparez le résultat au travail attendu." },
  ],
};
function setup(locale = "fr", mutation = {}, manifest = [slug]) {
  const files = {
    en: matter.stringify(body, base),
    fr: matter.stringify(body, { ...base, translationOf: slug, ...mutation }),
  };
  const load = loader(locale, {
    [manifestPath]: manifest,
    "node:fs": {
      existsSync: () => true,
      readdirSync: () => [`${slug}.mdx`],
      readFileSync: filename => path.dirname(filename).endsWith("/fr") ? files.fr : files.en,
    },
    "react-markdown": ReactMarkdown,
    "next/navigation": { notFound: () => assert.fail("unexpected 404") },
    "@/system/components": { HarnessBadge: () => null },
  });
  return load;
}

test("new content-only manifest enables French reading, language links and one-hop routing", async () => {
  const load = setup();
  const read = load("src/system/journal-data.ts");
  const entry = read.getJournalEntry(slug, "fr");
  for (const field of ["updatedAt", "pilier", "requete", "author", "sources", "faq"]) assert.deepEqual(entry[field], base[field]);
  assert.equal(entry.draft, undefined);
  assert.equal(read.getAllJournalEntrySummaries("fr")[0].updatedAt, base.updatedAt);
  const locale = load("src/system/locale.ts");
  assert.equal(locale.localizedPath(`/journal/${slug}`, "fr"), `/fr/journal/${slug}`);
  assert.equal(locale.localizedAlternates(`/journal/${slug}`, "fr").languages.en, `/journal/${slug}`);
  const config = load("next.config.ts").default;
  const response = await unstable_getResponseFromNextConfig({ url: `https://parrit.ai/fr/journal/${slug}?source=test`, nextConfig: config });
  assert.equal(response.status, 200);
  const sitemap = load("src/app/sitemap.ts").default();
  for (const prefix of ["", "/fr"]) {
    const item = sitemap.find(item => item.url === `https://parrit.ai${prefix}/journal/${slug}`);
    assert.ok(item);
    assert.equal(item.lastModified.toISOString().slice(0, 10), base.updatedAt);
  }
});

for (const mutation of [
  { updatedAt: "2026-02-30" }, { updatedAt: "2025-12-31" }, { author: 42 },
  { sources: [{ label: "Bad", url: "javascript:alert(1)" }] },
  { sources: [{ label: "Bad", url: "https://user:password@example.org" }] },
  { faq: [{ q: "Missing answer" }] },
]) test(`optional Journal metadata fails closed: ${JSON.stringify(mutation)}`, () => {
  assert.throws(() => setup("fr", mutation)("src/system/journal-data.ts").getJournalEntry(slug, "fr"), /invalid/);
});

for (const manifest of [["../unsafe"], [slug, slug], ["one-card-one-action"], [42], {}]) test(`translation manifest fails closed: ${JSON.stringify(manifest)}`, () => {
  assert.throws(() => setup("fr", {}, manifest)("src/system/journal-translations.ts"), /manifest/);
});

for (const locale of ["fr", "en"]) test(`new article renders answer, optional table, structured-only FAQ, dated sources and matching schema (${locale})`, async () => {
  const page = setup(locale)("src/app/(rev01)/journal/[slug]/page.tsx");
  const props = { params: Promise.resolve({ slug }) };
  const html = renderToStaticMarkup(await page.default(props));
  assert.match(html, /<p>Une réponse directe avant tout titre\.<\/p>/);
  assert.match(html, /<table class="journal-machine-table"><thead><tr><th scope="col">Critère<\/th>/);
  assert.match(html, /<td><strong>Humain<\/strong><\/td>/);
  assert.ok(html.includes('<a href="https://example.org/report">Source publique</a>'));
  const data = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  const article = data.find(item => item["@type"] === "Article");
  assert.equal(article.dateModified, base.updatedAt);
  assert.deepEqual(article.author, { "@type": "Person", "@id": "https://parrit.ai/#paul-larmaraud", name: base.author, jobTitle: locale === "fr" ? "Fondateur" : "Founder", worksFor: { "@id": "https://parrit.ai/#organization" } });
  const faq = data.find(item => item["@type"] === "FAQPage");
  assert.equal(faq.inLanguage, locale);
  assert.deepEqual(faq.mainEntity.map(item => ({ q: item.name, a: item.acceptedAnswer.text })), base.faq);
  for (const { q, a } of base.faq) assert.ok(!html.includes(`<h3>${q}</h3><p>${a}</p>`));
  assert.doesNotMatch(html, /journal-faq-title|booking-call-title/);
  assert.ok(html.includes('· Insee'));
  assert.ok(html.includes('<time dateTime="2026-01-01">') || html.includes('<time datetime="2026-01-01">'));
  assert.ok(html.includes(locale === "fr" ? "Paul Larmaraud, fondateur de Parrit.ai" : "Paul Larmaraud, founder of Parrit.ai"));
  const booking = `${locale === "fr" ? "/fr" : ""}/rendez-vous?source=journal-${slug}`;
  assert.equal(html.split(`href="${booking}"`).length - 1, 1);
  const signature = html.indexOf('Paul Larmaraud, ');
  const deck = '<p>Une réponse directe avant tout titre.</p>';
  assert.ok(html.indexOf(deck) < signature);
  assert.ok(html.includes(`${deck}<p class="journal-byline">`));
  assert.ok(signature < html.indexOf('<h2>La règle précède le choix</h2>'));
  assert.ok(signature < html.indexOf('journal-sources-title'));
  assert.equal(article.publisher['@type'], 'Organization');
  assert.equal(article.publisher['@id'], article.author.worksFor['@id']);
  const metadata = await page.generateMetadata(props);
  assert.equal(metadata.openGraph.modifiedTime, base.updatedAt);
  assert.equal(metadata.authors[0].name, base.author);
});

test("FAQ strings and table cells cannot inject executable HTML", async () => {
  const faq = [{ q: "</script><script>alert(1)</script>", a: "<img src=x onerror=alert(1)>" }];
  const page = setup("fr", { faq })("src/app/(rev01)/journal/[slug]/page.tsx");
  const html = renderToStaticMarkup(await page.default({ params: Promise.resolve({ slug }) }));
  assert.doesNotMatch(html, /<script>alert|<img src=x/);
  const component = setup()("src/system/components/JournalMachineBody.tsx");
  const rendered = renderToStaticMarkup(component.JournalMachineBody({ content: "| Test | Link |\n| --- | --- |\n| <img src=x onerror=alert(1)> | [click](javascript:alert) |" }));
  assert.doesNotMatch(rendered, /<img|href="javascript:/);
});

test("table dialect preserves fenced code and rejects ambiguous columns", () => {
  const table = "| A | B |\n| --- | --- |\n| C | D |";
  for (const fence of ["```", "~~~"]) assert.deepEqual(journalMarkdownBlocks(`${fence}\n${table}\n${fence}`), [{ kind: "markdown", text: `${fence}\n${table}\n${fence}` }]);
  assert.equal(journalMarkdownBlocks(table)[0].kind, "table");
  assert.throws(() => journalMarkdownBlocks(table.replace("| C | D |", "| C | D | E |")), /table row/);
  assert.throws(() => journalMarkdownBlocks(table.replace("| C | D |", "| C\\| | D |")), /table row/);
  assert.throws(() => journalMarkdownBlocks(table.replace("| C | D |", "| `C | D` |")), /table row/);
  assert.throws(() => journalMarkdownBlocks("| A | B |\n| --- | --- |"), /data row/);
});
