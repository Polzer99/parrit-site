import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { renderPage, loader } from "./helpers/site-v1-render.mjs";
import { privateClientNames } from "../scripts/lib/public-clients.mjs";
import { PUBLIC_CLIENT_NAMES } from "../src/system/public-clients.ts";
import { visibleText } from "../scripts/brand-os-contracts.mjs";
const load = loader("en");
const { SITE_EVIDENCE, evidencePublishable, evidenceReviewWarnings } = load("src/lib/registry/preuves.ts");
const localeModule = load("src/system/locale.ts");
const pageIds = ["consulting-transformation", "ai-sprints", "engineering-integration", "harness-engineering"];
test("permissions fail closed for missing, denied, pending, invalid and out-of-scope evidence", () => {
  const evidence = SITE_EVIDENCE[0];
  assert.equal(evidencePublishable(evidence, "home"), true);
  for (const permission_status of [undefined, "pending", "denied"]) assert.equal(evidencePublishable({ ...evidence, permission_status }, "home"), false);
  for (const patch of [{ evidence_source: "" }, { permission_owner: "" }, { usage_scope: [] }, { page_ids: [] }, { last_verified: "" }, { last_verified: "0000" }, { expiration_or_review_date: "2027-99-99" }, { expiration_or_review_date: "2027-02-30" }]) assert.equal(evidencePublishable({ ...evidence, ...patch }, "home"), false);
  assert.ok(SITE_EVIDENCE.every(item => item.approved_assets.length === 0));
});
test("removing a permission removes the entire public card", () => {
  const evidence = SITE_EVIDENCE.find(item => item.id === "Laparra");
  const card = load("src/system/components/CaseStudyCard.tsx").CaseStudyCard;
  const before = evidence.permission_status;
  try { evidence.permission_status = "denied"; assert.equal(renderToStaticMarkup(createElement(card, { id: "Laparra", locale: "en", pageId: "home" })), ""); }
  finally { evidence.permission_status = before; }
});
test("EvidenceBadge is absent from public rendering", () => {
  const badge = load("src/system/components/EvidenceBadge.tsx").EvidenceBadge;
  assert.equal(renderToStaticMarkup(createElement(badge, { evidence: SITE_EVIDENCE[0] })), "");
});
test("localized paths roundtrip with query and fragment, including asymmetric consulting slug", () => {
  for (const id of pageIds) {
    const en = `/${id}`; const fr = localeModule.localizedPath(en, "fr");
    assert.equal(localeModule.localizedPath(`${fr}?source=test&utm_source=qa#evaluation`, "en"), `${en}?source=test&utm_source=qa#evaluation`);
    const alternates = localeModule.localizedAlternates(fr, "fr");
    assert.equal(alternates.canonical, fr); assert.equal(alternates.languages.en, en); assert.equal(alternates.languages.fr, fr); assert.equal(alternates.languages["x-default"], en);
  }
  assert.equal(localeModule.localizedPath("/consulting-transformation", "fr"), "/fr/conseil-transformation");
});
for (const locale of ["fr", "en"]) {
  test(`metadata is unique and reciprocal (${locale})`, async () => {
    const component = loader(locale)("src/system/components/SiteV1Page.tsx");
    const metadata = await Promise.all(pageIds.map(id => component.siteV1Metadata(id)));
    assert.equal(new Set(metadata.map(m => m.title.absolute)).size, 4);
    assert.equal(new Set(metadata.map(m => m.description)).size, 4);
    metadata.forEach((m, i) => assert.equal(m.alternates.canonical, localeModule.localizedPath(`/${pageIds[i]}`, locale)));
  });
  for (const id of ["home", ...pageIds]) test(`publication proof and no-JS content ${locale}/${id}`, async () => {
    const html = await renderPage(locale, id); const text = visibleText(html);
    assert.deepEqual(privateClientNames(text), [], `${locale}/${id}: private clients`);
    assert.doesNotMatch(text, /\bPaul\b|Larmaraud|fondat(eur|rice)|founder/i);
    assert.doesNotMatch(text.replace(/MIT License/g, ""), /Content Factor|usines? de contenu|FormIA|Qualiopi|\bMIT\b|[—–]|\d+\s*%|\bROI\b/i);
    // Dates and approved scene markers/chat times are not business result claims.
    assert.doesNotMatch(visibleText(html.replace(/<time\b[^>]*>[\s\S]*?<\/time>/g, "").replace(/<span class="scene-marker"[^>]*>\d<\/span>/g, "").replace(/<span class="scene-chat-time">[\s\S]*?<\/span>/g, "")), /\d/);
    assert.doesNotMatch(html, /<svg\b[^>]*(?:logo|client)/i);
    for (const [, src] of html.matchAll(/<img[^>]*src="([^"]+)"/g)) assert.ok(["/brand/scenes/scene-carte-visite-photo.png", "/brand/scenes/scene-carte-visite-fiche-crm.png"].includes(src), "Only approved scene assets");
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    if (id !== "home") assert.ok(new Set([...html.matchAll(/href="(\/[^"#]+)"/g)].map(m => m[1])).size >= 7);
    if (["home", "engineering-integration"].includes(id)) {
      assert.ok(html.includes('data-enhanced="false"')); assert.doesNotMatch(html, /\shidden[=> ]/);
      for (const word of locale === "fr" ? ["Intégrer l&#x27;existant", "Construire le manquant", "Orchestrer l&#x27;ensemble"] : ["Integrate what exists", "Build what is missing", "Orchestrate the whole"]) assert.ok(html.includes(word));
    }
  });
}
test("legacy registry also refuses entries without an explicit grant", () => {
  const registry = load("src/lib/registry/preuves.ts");
  assert.deepEqual(registry.preuvesPubliables(registry.toutesLesPreuves()), []);
  const entry = { ...registry.toutesLesPreuves()[0], nominatif: { organisation: "Example", publicationPermission: true, logo: "/logo.svg" } };
  assert.equal(registry.libelleOrganisation(entry), null);
  assert.equal(registry.logoAutorise(entry), null);
});

test("review deadline warns at 30 days without expiring publication", () => {
  const evidence = SITE_EVIDENCE.map(item => ({ ...item, last_verified: "2026-10-26", expiration_or_review_date: "2027-01-26" }));
  assert.deepEqual(evidenceReviewWarnings(evidence, "2026-12-26"), []);
  for (const today of ["2026-12-27", "2027-01-26", "2027-01-27", "2030-01-01"]) {
    const warnings = evidenceReviewWarnings(evidence, today);
    assert.equal(warnings.length, evidence.length);
    assert.ok(warnings.every(message => /editorial review required.*2027-01-26/.test(message)));
    assert.ok(evidence.every(item => evidencePublishable(item, "home")));
  }
  assert.throws(() => evidenceReviewWarnings(evidence, "2027-02-30"), /Invalid/);
});
test("CI warning: review granted evidence at least 30 days before its deadline", () => {
  const today = new Date().toISOString().slice(0, 10);
  assert.deepEqual(evidenceReviewWarnings(SITE_EVIDENCE, today), [], "Review evidence sources and permissions, then update last_verified and review date. Production must not hide evidence on this date.");
});
test("every client ID in evidence and case cards is explicitly public", () => {
  for (const item of SITE_EVIDENCE.filter(item => item.category === "client")) assert.ok(PUBLIC_CLIENT_NAMES.includes(item.id), item.id);
  const { CASE_STUDY_COPY } = load("src/system/components/CaseStudyCard.tsx");
  for (const copy of Object.values(CASE_STUDY_COPY)) for (const id of Object.keys(copy)) {
    const evidence = SITE_EVIDENCE.find(item => item.id === id);
    assert.ok(evidence, id);
    if (evidence.category === "client") assert.ok(PUBLIC_CLIENT_NAMES.includes(id), id);
  }
});
test("case cards respect the consuming page permission scope", () => {
  const { CaseStudyCard } = load("src/system/components/CaseStudyCard.tsx");
  assert.match(renderToStaticMarkup(createElement(CaseStudyCard, { id: "Laparra", locale: "en", pageId: "home" })), /Laparra/);
  assert.equal(renderToStaticMarkup(createElement(CaseStudyCard, { id: "Laparra", locale: "en", pageId: "unapproved-page" })), "");
});
test("empty references and cases remove their section and heading", async () => {
  const state = SITE_EVIDENCE.map(item => item.permission_status);
  try {
    SITE_EVIDENCE.forEach(item => { item.permission_status = "denied"; });
    const html = renderToStaticMarkup(await load("src/app/(rev01)/page.tsx").default());
    assert.doesNotMatch(html, /id="H0[24]"|What we have done|Three ways we work/);
  } finally { SITE_EVIDENCE.forEach((item, index) => { item.permission_status = state[index]; }); }
});
test("all eight guide metadata titles are unique across languages", async () => {
  const titles = [];
  for (const locale of ["fr", "en"]) for (const id of pageIds) titles.push((await loader(locale)("src/system/components/SiteV1Page.tsx").siteV1Metadata(id)).title.absolute);
  assert.equal(new Set(titles).size, 8);
});
test("harness components are a set without directional connectors", async () => {
  for (const locale of ["fr", "en"]) {
    const html = await renderPage(locale, "harness-engineering");
    const diagram = html.match(/<ol class="v1-harness-diagram"[\s\S]*?<\/ol>/)?.[0];
    assert.ok(diagram); assert.equal((diagram.match(/<li/g) ?? []).length, 8);
    assert.doesNotMatch(diagram, /<svg|[→←]/);
  }
});
