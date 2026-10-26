import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { renderPage, loader } from "./helpers/site-v1-render.mjs";
import { visibleText } from "../scripts/brand-os-contracts.mjs";
const load = loader("en");
const { SITE_EVIDENCE, evidencePublishable } = load("src/lib/registry/preuves.ts");
const localeModule = load("src/system/locale.ts");
const pageIds = ["consulting-transformation", "ai-sprints", "engineering-integration", "harness-engineering"];
test("permissions fail closed for missing, denied, pending, stale and out-of-scope evidence", () => {
  const evidence = SITE_EVIDENCE[0];
  assert.equal(evidencePublishable(evidence, "home", "2026-10-26"), true);
  for (const permission_status of [undefined, "pending", "denied"]) assert.equal(evidencePublishable({ ...evidence, permission_status }, "home", "2026-10-26"), false);
  for (const patch of [{ evidence_source: "" }, { permission_owner: "" }, { usage_scope: [] }, { page_ids: [] }, { expiration_or_review_date: "2026-10-25" }, { last_verified: "2026-10-27" }, { last_verified: "" }, { last_verified: "0000" }, { expiration_or_review_date: "2027-99-99" }, { expiration_or_review_date: "2027-02-30" }]) assert.equal(evidencePublishable({ ...evidence, ...patch }, "home", "2026-10-26"), false);
  assert.ok(SITE_EVIDENCE.every(item => item.approved_assets.length === 0));
});
test("removing a permission removes the entire public card", () => {
  const evidence = SITE_EVIDENCE.find(item => item.id === "Laparra");
  const card = load("src/system/components/CaseStudyCard.tsx").CaseStudyCard;
  const before = evidence.permission_status;
  try { evidence.permission_status = "denied"; assert.equal(renderToStaticMarkup(createElement(card, { id: "Laparra", locale: "en" })), ""); }
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
    assert.doesNotMatch(text.replace(/MIT License/g, ""), /Content Factor|usines? de contenu|FormIA|Qualiopi|\bMIT\b|[—–]|\d+\s*%|\bROI\b/i);
    // Dates are editorial timestamps, not results. No other numeric claim is allowed.
    assert.doesNotMatch(visibleText(html.replace(/<time\b[^>]*>[\s\S]*?<\/time>/g, "")), /\d/);
    assert.doesNotMatch(html, /<img\b|<svg\b[^>]*(?:logo|client)/i);
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
