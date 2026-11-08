import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loader, renderPage } from "./helpers/site-v1-render.mjs";
import { visibleText } from "../scripts/brand-os-contracts.mjs";

const preferred = ["Toyotomi Europe", "SNCF", "Hiolle Technologies", "Laparra"];
const ids = html => [...html.matchAll(/data-evidence="([^"]+)"/g)].map(m => m[1]);
const section = (html, name) => html.match(new RegExp(`<section class="${name}"[^>]*>[\\s\\S]*?</section>`))?.[0];

for (const locale of ["fr", "en"]) {
  test(`conversion hero has one attributed action, proof and eager real photo in SSR (${locale})`, async () => {
    const html = await renderPage(locale);
    const hero = section(html, "hero");
    assert.ok(hero);
    const sequence = ['class="hero-eyebrow"', "<h1>", 'class="sub"', 'source=rdv-hero', 'class="hero-proof"', 'class="hero-reassurance"', 'class="hero-trust-label"', 'class="hero-client-logos"', 'class="hero-photo"'];
    const positions = sequence.map(value => hero.indexOf(value));
    assert.ok(positions.every(p => p >= 0));
    assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
    assert.equal((hero.match(/<a\b/g) ?? []).length, 1);
    assert.equal((hero.match(/data-connector="VS-CONNECTOR"/g) ?? []).length, 1);
    assert.ok(visibleText(hero).includes(locale === "fr" ? "Transformation IA · Développement de logiciels" : "AI transformation · Software development"));
    assert.deepEqual(ids(hero), preferred);
    assert.doesNotMatch(hero, /onto-diagram|ontocap|humby|data-story/);
    const photo = hero.match(/<figure class="hero-photo"[\s\S]*?<\/figure>/)[0];
    assert.match(photo, /data-photo="formation-equipes"/);
    assert.match(photo, /width="960" height="1280" loading="eager" fetchPriority="high"/);
    assert.doesNotMatch(photo, /loading="lazy"/);
    assert.ok(visibleText(photo).includes(locale === "fr" ? "Prise en main par les équipes" : "Teams taking AI in hand"));
    const manifest = JSON.parse(readFileSync("tests/fixtures/session-photos.json", "utf8"))[0];
    for (const [, file] of photo.matchAll(/(?:src="|srcSet=")(\/photos\/session\/[^ "<]+)/g)) {
      assert.ok(manifest.files.some(item => item.file === file));
    }
    const registry = loader(locale)("src/lib/registry/preuves.ts");
    for (const id of ids(hero)) {
      const evidence = registry.getSiteEvidence(id, "home");
      assert.ok(evidence);
      assert.ok(hero.includes(`src="${registry.publicationLogo(evidence.logo)}"`));
    }
  });

  test(`three-plane illustration follows crafts, with all four stories and no booking action (${locale})`, async () => {
    const html = await renderPage(locale);
    const sections = [...html.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)].map(m => m[0]);
    const index = sections.findIndex(s => s.includes(`id="${locale === "fr" ? "offres" : "offers"}"`));
    const tools = sections[index + 1];
    assert.equal(tools, section(html, "ai-tools"));
    assert.ok(visibleText(tools).includes(locale === "fr" ? "Comment l'IA travaille avec vos outils." : "How AI works with your tools."));
    assert.equal((tools.match(/data-node=/g) ?? []).length, 33);
    assert.equal((tools.match(/class="ontocap-sizer"/g) ?? []).length, 4);
    assert.match(tools, /data-story="0" data-step="4"/);
    assert.match(tools, /class="humby"/);
    assert.doesNotMatch(tools, /<a\b|<h1\b/);
    assert.equal((html.match(/class="ontology-hero"/g) ?? []).length, 1);
  });

  for (const revoked of ["name", "logo", "all"]) test(`hero proof fails closed when ${revoked} permission is revoked (${locale})`, () => {
    const load = loader(locale);
    const { SITE_EVIDENCE } = load("src/lib/registry/preuves.ts");
    const { HeroClientLogos } = load("src/system/components/PublicEvidence.tsx");
    const evidence = SITE_EVIDENCE.find(e => e.id === "Toyotomi Europe");
    assert.ok(evidence);
    const permissions = SITE_EVIDENCE.map(e => e.permission_status);
    const logoPermission = evidence.logo.autorise;
    try {
      if (revoked === "name") evidence.permission_status = "denied";
      if (revoked === "logo") evidence.logo.autorise = false;
      if (revoked === "all") SITE_EVIDENCE.forEach(e => { e.permission_status = "denied"; });
      const html = renderToStaticMarkup(createElement(HeroClientLogos, { locale }));
      assert.deepEqual(ids(html), revoked === "all" ? [] : ["Laparra", "Clevery", "Forexpert", "Joone"]);
      assert.doesNotMatch(html, /Toyotomi/);
      if (revoked === "all") assert.equal(html, "");
    } finally {
      SITE_EVIDENCE.forEach((e, i) => { e.permission_status = permissions[i]; });
      evidence.logo.autorise = logoPermission;
    }
  });
}

test("new illustration anchor follows the language switch in both directions", () => {
  const { localizedHomeHash } = loader("fr")("src/system/home-anchors.ts");
  assert.equal(localizedHomeHash("#fonctionnement", "en"), "#how-it-works");
  assert.equal(localizedHomeHash("#how-it-works", "fr"), "#fonctionnement");
});
