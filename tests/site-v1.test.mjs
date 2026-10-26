import assert from "node:assert/strict";
import { test } from "node:test";
import { loader } from "./helpers/site-v1-render.mjs";
const load = loader("en");
const { SITE_EVIDENCE, evidencePublishable, evidenceReviewWarnings } = load("src/lib/registry/preuves.ts");
test("permissions fail closed for missing, denied, pending, invalid and out-of-scope evidence", () => {
  const evidence = SITE_EVIDENCE[0];
  assert.equal(evidencePublishable(evidence, "home"), true);
  for (const permission_status of [undefined, "pending", "denied"]) assert.equal(evidencePublishable({ ...evidence, permission_status }, "home"), false);
  for (const patch of [{ evidence_source: "" }, { permission_owner: "" }, { usage_scope: [] }, { page_ids: [] }, { last_verified: "" }, { last_verified: "0000" }, { expiration_or_review_date: "2027-99-99" }, { expiration_or_review_date: "2027-02-30" }]) assert.equal(evidencePublishable({ ...evidence, ...patch }, "home"), false);
  assert.ok(SITE_EVIDENCE.every(item => item.approved_assets.length === 0));
});
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
