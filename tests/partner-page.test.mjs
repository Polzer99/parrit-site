import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest, NextResponse } from "next/server.js";
import { renderToStaticMarkup } from "react-dom/server";
import { loader, renderPage } from "./helpers/site-v1-render.mjs";
import { visibleText } from "../scripts/brand-os-contracts.mjs";

const FORM = "https://docs.google.com/forms/d/e/1FAIpQLSeNVPnXs_ji3QJSC8WHGs6UPtOgO1GPdTfs6jc6T1S5cpB9aw/viewform";
const paths = { fr: "/fr/devenir-partenaire", en: "/become-a-partner" };
const origin = "http://localhost:3210";

for (const lang of ["fr", "en"]) {
  test(`partner SSR content, metadata and home destination (${lang})`, async () => {
    const load = loader(lang);
    const page = load("src/app/(rev01)/become-a-partner/page.tsx");
    const html = renderToStaticMarkup(await page.default());
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.match(html, /<h1>[^<]+<b>[^<]+<\/b><\/h1>/);
    assert.equal((html.match(/<h2\b/g) ?? []).length, 3);
    const actions = [...html.matchAll(/<a\b[^>]*class="[^"]*\bexec\b[^>]*"[^>]*>/g)];
    assert.equal(actions.length, 1);
    assert.ok(actions[0][0].includes(`href="${FORM}"`));
    assert.match(actions[0][0], /target="_blank" rel="noopener noreferrer"/);
    assert.match(html, /href="mailto:paul\.larmaraud@parrit\.ai"/);
    assert.doesNotMatch(html, /<iframe|<form|<img|<script/);
    const text = visibleText(html);
    assert.equal(text.includes("The form is in French."), lang === "en");
    assert.doesNotMatch(text, /SNCF|Laparra|Clevery|Forexpert|Joone|€|\bPaul\b|Larmaraud|[—–]/);
    assert.match(text, lang === "fr" ? /L'inscription ne garantit pas de mission/ : /Signing up does not guarantee an assignment/);
    assert.match(text, lang === "fr" ? /sans votre accord/ : /without your consent/);
    const meta = await page.generateMetadata();
    assert.equal(meta.title.absolute, lang === "fr" ? "Devenir partenaire · Parrit.ai" : "Become a partner · Parrit.ai");
    const introduction = visibleText(html.match(/class="partner-introduction">([^<]+)<\/p>/)[1]);
    assert.equal(meta.description, introduction);
    assert.equal(meta.openGraph.description, introduction);
    assert.equal(meta.openGraph.url, paths[lang]);
    assert.equal(meta.openGraph.images[0].url, "/opengraph-image?v=2026-10-27");
    assert.deepEqual(meta.alternates, { canonical: paths[lang], languages: { ...paths, "x-default": paths.en } });
    const home = await renderPage(lang);
    const section = home.match(new RegExp(`<section id="${lang === "fr" ? "partenaires" : "team"}">[\\s\\S]*?</section>`))[0];
    assert.ok(section.includes(`class="btn rev-button ghost" href="${paths[lang]}"`));
    assert.doesNotMatch(section, /\bexec\b|docs\.google\.com/);
  });
}

test("partner language mapping and proxy keep locale, query and canonical destinations", () => {
  const load = loader("en", { "next/server": { NextRequest, NextResponse } });
  const locale = load("src/system/locale.ts");
  for (const from of Object.values(paths)) for (const lang of ["fr", "en"]) {
    assert.equal(locale.localizedPath(`${from}?source=partner#information`, lang), `${paths[lang]}?source=partner#information`);
    assert.equal(locale.barePathname(from), paths.en);
  }
  const { proxy, config } = load("src/proxy.ts");
  assert.ok(config.matcher.includes(paths.en));
  const request = (path, headers = {}) => proxy(new NextRequest(`${origin}${path}`, { headers }));
  const french = request(`${paths.fr}?source=partner`, { "accept-language": "en" });
  assert.equal(french.headers.get("location"), null);
  assert.equal(french.headers.get("x-middleware-rewrite"), `${origin}${paths.en}?source=partner`);
  assert.equal(french.headers.get("x-middleware-request-x-parrit-locale"), "fr");
  assert.equal(french.headers.get("x-middleware-request-x-parrit-pathname"), paths.fr);
  const negotiation = request(`${paths.en}?source=partner`, { "accept-language": "fr" });
  assert.equal(negotiation.status, 302);
  assert.equal(negotiation.headers.get("location"), `${origin}${paths.fr}?source=partner`);
  for (const headers of [{ "user-agent": "Googlebot" }, { cookie: "parrit_locale=en" }]) {
    const response = request(paths.en, { "accept-language": "fr", "x-parrit-locale": "fr", ...headers });
    assert.equal(response.headers.get("location"), null);
    assert.equal(response.headers.get("x-middleware-request-x-parrit-locale"), "en");
  }
  for (const lang of ["fr", "en"]) {
    const from = paths[lang === "fr" ? "en" : "fr"];
    const response = request(`${from}?lang=${lang}&source=partner`);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("location"), `${origin}${paths[lang]}?source=partner`);
  }
});

test("partner sitemap has exactly the two reciprocal canonical URLs", () => {
  const load = loader("en", { "@/system/journal": { getAllJournalEntrySummaries: () => [] } });
  const sitemap = load("src/app/sitemap.ts").default();
  for (const path of Object.values(paths)) {
    const entries = sitemap.filter(entry => new URL(entry.url).pathname === path);
    assert.equal(entries.length, 1);
    const site = new URL(entries[0].url).origin;
    assert.deepEqual(entries[0].alternates.languages, { fr: `${site}${paths.fr}`, en: `${site}${paths.en}`, "x-default": `${site}${paths.en}` });
  }
  assert.ok(!sitemap.some(entry => entry.url.includes("/fr/become-a-partner")));
});
