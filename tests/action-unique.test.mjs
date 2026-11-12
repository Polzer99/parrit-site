import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loader, renderPage } from "./helpers/site-v1-render.mjs";
import { visibleText } from "../scripts/brand-os-contracts.mjs";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import sharp from "sharp";

// Décision de Paul du 08/11/2026, nuit : the form submits; every other
// home action books the same call. Content links retain their destinations.
for (const locale of ["fr", "en"]) {
  for (const route of ["", "/journal", "/journal/themes/ai-sprints", "/journal/what-is-parrit-ai", "/legal"]) test(`header ${route || "/"} booking label and attribution are present before JavaScript (${locale})`, () => {
    const home = locale === "fr" ? "/fr" : "/";
    const query = new URLSearchParams("utm_custom=header&source=old&source=older");
    const load = loader(locale, { "next/navigation": { usePathname: () => `${home === "/" ? "" : home}${route}` || "/", useSearchParams: () => query } });
    const { RevHeader } = load("src/system/components/RevHeader.tsx");
    const html = renderToStaticMarkup(createElement(RevHeader, { locale }));
    // Desktop and native mobile menu render the same logical action. CSS exposes
    // exactly one copy; the browser matrix verifies this with and without JS.
    const links = [...html.matchAll(/<a class="[^"]*rev-button[^"]*" href="([^"]+)"[^>]*>([^<]+)<\/a>/g)];
    assert.equal(links.length, 2);
    for (const [, href, label] of links) {
      const url = new URL(href.replaceAll("&amp;", "&"), "https://example.invalid");
      assert.equal(url.pathname, home);
      assert.equal(url.hash, "#contact");
      assert.deepEqual(url.searchParams.getAll("source"), ["rdv-nav"]);
      assert.equal(url.searchParams.get("utm_custom"), "header");
      assert.equal(label, locale === "fr" ? "Prendre rendez-vous" : "Book a call");
    }
    // Correctif 2 : navigation ghost explicitly approved, with no large connector.
    assert.equal((html.match(/class="[^"]*rev-button ghost"/g) ?? []).length, 2);
    assert.doesNotMatch(html, /data-connector=/);
  });

  test(`one home action, two crafts, six authorized references (${locale})`, async () => {
    const html = await renderPage(locale);
    const actions = [...html.matchAll(/<a class="([^"]*rev-button[^"]*)" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    const booking = actions.filter(([, , href]) => new URL(href, "https://example.invalid").hash === "#contact");
    assert.equal(booking.length, 3, "hero, banner and restored contact; header tested separately (correctif 4)");
    for (const [i, [, classes, href, label]] of booking.entries()) {
      const url = new URL(href, "https://example.invalid");
      assert.match(classes, /\bexec\b/);
      assert.equal(visibleText(label).trim(), locale === "fr" ? "Prendre rendez-vous" : "Book a call");
      assert.equal(url.searchParams.get("source"), `rdv-${["hero", "bandeau", "contact"][i]}`);
      assert.equal(url.pathname, locale === "fr" ? "/fr" : "/");
      assert.equal((label.match(/data-connector="VS-CONNECTOR"/g) ?? []).length, i < 2 ? 1 : 0);
      if (i < 2) assert.match(label, /aria-hidden="true" focusable="false"/);
    }
    assert.equal(actions.length, 4, "three booking actions and the Journal content link in main");
    assert.doesNotMatch(html, /source=intention-|href="#reservation"/);
    const offers = html.match(/<section id="(?:offres|offers)"[\s\S]*?<\/section>/)[0];
    assert.equal((offers.match(/<article /g) ?? []).length, 2);
    assert.equal((offers.match(/<li>/g) ?? []).length, 6);
    assert.doesNotMatch(offers, /<a\b|<button\b/);
    assert.doesNotMatch(visibleText(html), /Former mes équipes|Train my teams|Par où commencer|Where to start/);
    assert.ok(visibleText(html).includes(locale === "fr" ? "Chercheurs du MIT" : "MIT researchers"));
    assert.ok(visibleText(offers).includes(locale === "fr" ? "Pour les PME, les ETI et les grands groupes." : "For SMEs, mid-sized companies and large groups."));
    assert.doesNotMatch(visibleText(html.replace(/<section id="articles">[\s\S]*?<\/section>/, "")), /\b(?:formations?|former|formons|forme|formateurs?|training|train|trains|trainers)\b|parler d'un projet|talk about a project|conseil et outils|[—–]|afin de/i);
    const refs = html.match(/<section id="references"[\s\S]*?<\/section>/)[0];
    const { PUBLIC_CLIENT_NAMES } = loader(locale)("src/system/public-clients.ts");
    assert.equal(PUBLIC_CLIENT_NAMES.length, 6);
    assert.doesNotMatch(PUBLIC_CLIENT_NAMES.join("|"), /Toyotomi Europe|Hiolle Technologies/i);
    assert.equal((refs.match(/data-evidence=/g) ?? []).length, 6);
    for (const name of PUBLIC_CLIENT_NAMES) assert.ok(refs.includes(`data-evidence="${name}"`), name);
    assert.doesNotMatch(html, /Toyotomi Europe|Hiolle Technologies/i);
  });

  test(`reassurance, accountability and initially open FAQ survive SSR (${locale})`, async () => {
    const html = await renderPage(locale);
    const fr = locale === "fr";
    const reassurance = fr ? "Vos équipes gardent la décision. Aucune relance automatique." : "Your teams keep the final say. No automated follow-up.";
    const hero = html.match(/<section class="hero">[\s\S]*?<\/section>/)[0];
    assert.equal((html.match(/class="hero-reassurance"/g) ?? []).length, 1);
    assert.ok(visibleText(hero).includes(reassurance));
    assert.ok(hero.indexOf('source=rdv-hero') < hero.indexOf('class="hero-reassurance"'));
    const services = html.match(/<section id="services">[\s\S]*?<\/section>/)[0];
    const tags = [...services.matchAll(/<span class="tag bo">(.*?)<\/span>/g)];
    assert.equal(tags.length, 24, "all existing prepared tasks retain a human approval label");
    for (const [, tag] of tags) assert.equal(visibleText(tag), fr ? "Préparé, vous validez" : "Prepared, you approve");
    assert.doesNotMatch(visibleText(html), /Tâche reprise|Task taken over/);
    assert.ok(visibleText(html).includes(fr
      ? "Un seul interlocuteur, responsable de bout en bout. Selon le besoin, il s'entoure de spécialistes parmi plus de vingt partenaires."
      : "One point of contact, accountable from start to finish. When needed, they bring in specialists from more than twenty partners."));
    assert.ok(visibleText(html).includes(fr ? "Inspirées de nos missions. Les données affichées sont fictives." : "Drawn from our projects. The data shown is fictitious."));
    const details = [...html.matchAll(/<details([^>]*)><summary>(.*?)<\/summary><p>(.*?)<\/p><\/details>/g)];
    assert.equal(details.length, 6);
    assert.deepEqual(details.filter(([, attributes]) => /\bopen(?:=|\s|$)/.test(attributes)).map(([, , question]) => visibleText(question)), fr
      ? ["Que deviennent nos données ?", "Combien cela coûte-t-il ?"]
      : ["What happens to our data?", "How much does it cost?"]);
    const structured = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(([, json]) => JSON.parse(json)).find(item => item["@type"] === "FAQPage");
    assert.deepEqual(structured.mainEntity.map(item => [item.name, item.acceptedAnswer.text]), details.map(([, , question, answer]) => [visibleText(question), visibleText(answer)]));
  });

  test(`booking link keeps UTM, native modified clicks and same-home form state (${locale})`, () => {
    const { AppointmentLink } = loader(locale)("src/system/components/AppointmentLink.tsx");
    const home = locale === "fr" ? "/fr" : "/";
    const link = AppointmentLink({ locale, placement: "hero", query: "utm_source=mail&source=old&source=older&utM=x&edge=a%26b" });
    const url = new URL(link.props.href, "https://example.invalid");
    assert.equal(url.pathname, home);
    assert.equal(url.hash, "#contact");
    assert.deepEqual(url.searchParams.getAll("source"), ["rdv-hero"]);
    assert.equal(url.searchParams.get("utm_source"), "mail");
    assert.equal(url.searchParams.get("edge"), "a&b");
    assert.ok(renderToStaticMarkup(createElement(AppointmentLink, { locale, placement: "bandeau" })).includes("source=rdv-bandeau"));
    const calls = [];
    const oldWindow = globalThis.window, oldDocument = globalThis.document;
    globalThis.window = { location: new URL(`${home}?utm_campaign=live&source=intention-formation-hero`, "https://example.invalid"), history: { pushState: (...args) => calls.push(["history", ...args]) }, matchMedia: () => ({ matches: true }) };
    globalThis.document = { getElementById: () => ({ scrollIntoView: arg => calls.push(["scroll", arg]), focus: arg => calls.push(["focus", arg]) }) };
    try {
      const event = { button: 0, preventDefault: () => calls.push(["prevent"]) };
      for (const flag of ["ctrlKey", "metaKey", "shiftKey", "altKey", "defaultPrevented"]) link.props.onClick({ ...event, [flag]: true });
      link.props.onClick({ ...event, button: 1 });
      assert.deepEqual(calls, []);
      link.props.onClick(event);
      assert.deepEqual(calls, [["prevent"], ["history", null, "", `${home}?utm_campaign=live&source=rdv-hero#contact`], ["scroll", { behavior: "instant", block: "start" }], ["focus", { preventScroll: true }]]);
    } finally { globalThis.window = oldWindow; globalThis.document = oldDocument; }
  });
}

test("new client permissions are independently dated, scoped and fail closed", () => {
  const { getSiteEvidence, evidencePublishable, publicationLogo } = loader("fr")("src/lib/registry/preuves.ts");
  for (const name of ["Carte Noire"]) {
    const evidence = getSiteEvidence(name, "home");
    assert.ok(evidence, name);
    assert.equal(evidence.last_verified, "2026-11-08");
    assert.match(evidence.evidence_source, /action-unique-et-wording/);
    assert.match(evidence.permission_owner, /08\/11\/2026.*sans accord écrit/);
    assert.equal(evidence.logo.accord.date, "2026-11-08");
    assert.ok(publicationLogo(evidence.logo));
    assert.equal(publicationLogo({ ...evidence.logo, autorise: false }), null);
    assert.equal(evidencePublishable({ ...evidence, permission_status: "denied" }, "home"), false);
    assert.equal(getSiteEvidence(name, "journal"), undefined);
  }
});

test("three new logo exports keep reviewed bytes, alpha masks and optical source height", async () => {
  const fixtures = JSON.parse(readFileSync("tests/fixtures/new-client-logos.json", "utf8"));
  assert.equal(fixtures.length, 3);
  const provenance = readFileSync("public/clients/SOURCES.md", "utf8");
  for (const asset of fixtures) {
    const bytes = readFileSync(asset.file);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256);
    assert.ok(provenance.includes(asset.sourceSha256));
    assert.ok(provenance.includes(asset.sha256));
    const meta = await sharp(bytes).metadata();
    assert.equal(meta.width, asset.width);
    assert.equal(meta.height, 120);
    assert.equal(meta.hasAlpha, true);
    for (const key of ["exif", "xmp", "iptc", "icc"]) assert.equal(meta[key], undefined);
    const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(info.channels, 4);
    const alphas = new Set();
    for (let i = 0; i < data.length; i += 4) {
      assert.equal(data[i] + data[i + 1] + data[i + 2], 0, "black ink only");
      alphas.add(data[i + 3]);
    }
    assert.ok(alphas.has(0) && alphas.has(255), "transparent background and solid foreground");
  }
});

for (const locale of ["fr", "en"]) test(`contact action preserves attribution and the French Journal integration (${locale})`, () => {
  const load = loader(locale);
  const { SinglePage } = load("src/system/components/SinglePage.tsx");
  const { getAllJournalEntrySummaries } = load("src/system/journal-data.ts");
  const entries = getAllJournalEntrySummaries(locale).filter(entry => !entry.noindex).slice(0, 3);
  const html = renderToStaticMarkup(createElement(SinglePage, { locale, contactQuery: "utm_campaign=a%26b&utm_custom=one&utm_custom=two&source=old", latestEntries: entries }));
  const contact = html.match(/<section class="founder"[\s\S]*?<\/section>/)[0];
  const href = contact.match(/<a class="btn rev-button exec" href="([^"]+)"/)[1].replaceAll("&amp;", "&");
  const target = new URL(href, "https://example.invalid");
  assert.equal(target.pathname, locale === "fr" ? "/fr" : "/");
  assert.equal(target.hash, "#contact");
  assert.deepEqual(target.searchParams.getAll("source"), ["rdv-contact"]);
  assert.deepEqual(target.searchParams.getAll("utm_custom"), ["one", "two"]);
  assert.equal(target.searchParams.get("utm_campaign"), "a&b");
  const articles = html.match(/<section id="articles"[\s\S]*?<\/section>/)[0];
  assert.doesNotMatch(articles, /Articles en anglais/);
  for (const entry of entries) {
    assert.ok(articles.includes(`href="${locale === "fr" ? "/fr" : ""}/journal/${entry.slug}"`));
    assert.ok(visibleText(articles).includes(entry.title));
  }
});

