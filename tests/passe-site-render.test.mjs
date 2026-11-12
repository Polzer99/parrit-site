import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { withCompiledSite } from "./helpers/compiled-site.mjs";
import { getAllJournalEntries } from "../src/system/journal-data.ts";
import { FRENCH_JOURNAL_SLUGS } from "../src/system/journal-translations.ts";
import { JOURNAL_THEMES } from "../src/system/journal-themes.ts";
import { localizedAlternates } from "../src/system/locale.ts";

const entries = getAllJournalEntries();
const paths = ["/journal", "/legal", ...Object.keys(JOURNAL_THEMES).map(theme => `/journal/themes/${theme}`)];
const staticPaths = [...paths, ...paths.map(path => `/fr${path}`), ...entries.map(entry => `/journal/${entry.slug}`), ...FRENCH_JOURNAL_SLUGS.map(slug => `/fr/journal/${slug}`)];

test("all mandatory public routes are prerendered; home, booking and sketch remain dynamic", () => {
  const manifest = JSON.parse(readFileSync(".next/prerender-manifest.json", "utf8"));
  for (const path of staticPaths) assert.ok(Object.hasOwn(manifest.routes, path), path);
  for (const path of ["/", "/fr", "/rendez-vous", "/fr/rendez-vous", "/sketch/test"]) assert.ok(!Object.hasOwn(manifest.routes, path), path);
});

test("production renderer returns cacheable URL-localized HTML with identical metadata, Person and related dates", { timeout: 90000 }, async () => {
  await withCompiledSite(async render => {
    for (const path of staticPaths) {
      const locale = path.startsWith("/fr/") ? "fr" : "en";
      // Try to poison both language hints and client choice. Neither may affect cached content.
      const response = await render(`${path}?utm_source=qa`, { "x-parrit-locale": locale === "fr" ? "en" : "fr", "x-parrit-pathname": locale === "fr" ? "/legal" : "/fr/legal", cookie: `parrit_locale=${locale === "fr" ? "en" : "fr"}`, "accept-language": locale === "fr" ? "en" : "fr" });
      assert.equal(response.status, 200, path);
      assert.match(response.headers["cache-control"], /s-maxage=\d+/, path);
      assert.doesNotMatch(response.headers["cache-control"], /private|no-store|no-cache/, path);
      assert.match(response.html, new RegExp(`<html lang="${locale}"`), path);
      assert.ok(response.html.includes(`rel="canonical" href="https://parrit.ai${path}"`), path);
      assert.equal(response.headers["set-cookie"], undefined, path);
      if (!/^\/(?:fr\/)?journal\/[^/]+$/.test(path)) continue;
      const slug = path.split("/").at(-1);
      const entry = entries.find(entry => entry.slug === slug);
      const data = [...response.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
      const article = data.find(item => item["@type"] === "Article");
      assert.equal(article.author["@id"], "https://parrit.ai/#paul-larmaraud");
      assert.equal(article.author.worksFor["@id"], article.publisher["@id"]);
      assert.equal(article.datePublished, entry.date);
      assert.ok(response.html.includes(locale === "fr" ? "Paul Larmaraud, fondateur de Parrit.ai" : "Paul Larmaraud, founder of Parrit.ai"));
      for (const [language, href] of Object.entries(localizedAlternates(`/journal/${slug}`, locale).languages)) assert.ok(response.html.includes(`hrefLang="${language}" href="https://parrit.ai${href}"`));
      const related = response.html.match(/<nav class="journal-related"[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? "";
      for (const [, date, label] of related.matchAll(/<time dateTime="([^"]+)">([^<]+)<\/time>/g)) {
        assert.equal(label, new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(date)));
      }
      if (locale === "fr") for (const [, linkedSlug] of related.matchAll(/href="\/fr\/journal\/([^"]+)"/g)) assert.ok(FRENCH_JOURNAL_SLUGS.includes(linkedSlug));
    }
  });
});

test("compiled booking anchors and French homepage attribution survive without JavaScript", async () => {
  await withCompiledSite(async render => {
    const query = "source=journal-test&utm_source=x&utm_custom=one&utm_custom=two";
    for (const prefix of ["", "/fr"]) {
      const booking = await render(`${prefix}/rendez-vous?${query}`);
      assert.equal(booking.status, 200);
      const header = booking.html.match(/<header\b[^>]*class="cmdbar single-header"[^>]*>([\s\S]*?)<\/header>/)?.[1];
      assert.ok(header);
      assert.equal((header.match(/href="#reservation"/g) ?? []).length, 2);
      assert.ok(booking.html.includes('id="reservation"'));
      assert.match(booking.headers["cache-control"], /private|no-store/);
      const home = await render(`${prefix || "/"}?${query}`);
      assert.equal(home.status, 200);
      for (const placement of ["hero", "bandeau", "contact"]) {
        assert.ok(home.html.includes(`source=rdv-${placement}&amp;utm_source=x&amp;utm_custom=one&amp;utm_custom=two#contact`));
      }
      const section = home.html.match(/<section id="articles"[\s\S]*?<\/section>/)?.[0];
      if (prefix) for (const [, slug] of (section ?? "").matchAll(/href="\/fr\/journal\/([^"]+)"/g)) assert.ok(FRENCH_JOURNAL_SLUGS.includes(slug));
    }
  });
});
