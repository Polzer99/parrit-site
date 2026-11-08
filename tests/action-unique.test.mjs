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
  test(`header booking label and attribution are present before JavaScript (${locale})`, () => {
    const home = locale === "fr" ? "/fr" : "/";
    const query = new URLSearchParams("utm_custom=header&source=old&source=older");
    const load = loader(locale, { "next/navigation": { usePathname: () => home, useSearchParams: () => query } });
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
  });

  test(`one home action, two crafts, eight authorized references (${locale})`, async () => {
    const html = await renderPage(locale);
    const actions = [...html.matchAll(/<a class="([^"]*rev-button[^"]*)" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    const booking = actions.filter(([, , href]) => new URL(href, "https://example.invalid").hash === "#contact");
    assert.equal(booking.length, 2, "hero and banner; header tested separately");
    for (const [i, [, classes, href, label]] of booking.entries()) {
      const url = new URL(href, "https://example.invalid");
      assert.match(classes, /\bexec\b/);
      assert.equal(visibleText(label).trim(), locale === "fr" ? "Prendre rendez-vous" : "Book a call");
      assert.equal(url.searchParams.get("source"), `rdv-${i === 0 ? "hero" : "bandeau"}`);
      assert.equal(url.pathname, locale === "fr" ? "/fr" : "/");
    }
    assert.equal(actions.length, 3, "only two booking actions and the Journal content link in main");
    assert.doesNotMatch(html, /source=intention-|href="#reservation"/);
    const offers = html.match(/<section id="(?:offres|offers)"[\s\S]*?<\/section>/)[0];
    assert.equal((offers.match(/<article /g) ?? []).length, 2);
    assert.equal((offers.match(/<li>/g) ?? []).length, 6);
    assert.doesNotMatch(offers, /<a\b|<button\b/);
    assert.ok(visibleText(offers).includes(locale === "fr" ? "Pour les PME, les ETI et les grands groupes." : "For SMEs, mid-sized companies and large groups."));
    assert.doesNotMatch(visibleText(html.replace(/<section id="articles">[\s\S]*?<\/section>/, "")), /\b(?:formations?|former|formons|forme|formateurs?|training|train|trains|trainers)\b|parler d'un projet|talk about a project|conseil et outils|[—–]|afin de/i);
    const refs = html.match(/<section id="references"[\s\S]*?<\/section>/)[0];
    const { PUBLIC_CLIENT_NAMES } = loader(locale)("src/system/public-clients.ts");
    assert.equal(PUBLIC_CLIENT_NAMES.length, 8);
    for (const name of PUBLIC_CLIENT_NAMES) assert.ok(refs.includes(`data-evidence="${name}"`), name);
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
  for (const name of ["Toyotomi Europe", "Hiolle Technologies", "Carte Noire"]) {
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
