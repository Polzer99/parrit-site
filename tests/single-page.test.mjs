import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loader, renderPage } from "./helpers/site-v1-render.mjs";
import { visibleText } from "../scripts/brand-os-contracts.mjs";
const anchors = { fr: ["en-production", "ce-qui-change", "parcours", "services", "confiance", "partenaires", "references", "contact"], en: ["in-production", "what-changes", "path", "services", "safeguards", "team", "references", "contact"] };
for (const locale of ["fr", "en"]) test(`final single-page sections and booking render without JS (${locale})`, async () => {
  const html = await renderPage(locale);
  assert.equal((html.match(/<section\b/g) ?? []).length, 9);
  assert.deepEqual([...html.matchAll(/<section\b[^>]*id="([^"]+)"/g)].map(m => m[1]), anchors[locale]);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(visibleText(html), locale === "fr" ? /Nous allons à la frontière du possible/ : /We go to the frontier of what is possible/);
  assert.doesNotMatch(html, /\shidden[=> ]|class="k"|v1-index|registry-line/);
  assert.doesNotMatch(visibleText(html), /\bMIT\b|Votre phrase indique|What you say tells/);
  assert.match(html, /href="#reservation"/);
  const contact = html.slice(html.indexOf('id="contact"'));
  assert.match(contact, /id="reservation"[\s\S]*data-booking-mock[\s\S]*data-capture-mock/);
  assert.match(contact, /src="\/photos\/paul-centre.png"/);
  assert.match(html, new RegExp(`href="${locale === "fr" ? "/fr" : ""}/journal"`));
  assert.equal((html.match(/class="phone"/g) ?? []).length, 3);
  for (const tool of ["ChatGPT", "Claude Code", "Codex", "OpenCode", "Gemini", "n8n", "Supabase", "Telegram", "GitHub", "Vercel"]) assert.ok(visibleText(html).includes(tool));
  const text = visibleText(html);
  for (const client of ["Laparra", "Clevery", "Forexpert", "Joone", "SNCF"]) assert.ok(text.includes(client));
  assert.match(text, /Arkel/);
  assert.match(text, locale === "fr" ? /données fictives/ : /fictional data/);
  for (const [, label] of html.matchAll(/<a class="[^"]*rev-button[^\"]*"[^>]*>(.*?)<\/a>/g)) assert.doesNotMatch(visibleText(label), /\.$/);
});
test("portrait matches the approved registry checksum and is not retouched", () => {
  const { portrait } = JSON.parse(readFileSync("src/system/single-page-assets.json", "utf8"));
  assert.equal(portrait.reference, "person.paul.primary_portrait");
  assert.equal(portrait.sha256, "b5537ffe836e6933a11e2ff6b81b617e5ccab24213462bfc41c27aae0e182733");
  assert.equal(createHash("sha256").update(readFileSync(`public${portrait.file}`)).digest("hex"), portrait.sha256);
});
test("client logos fail closed until file, source and dated named consent are all present", () => {
  const load = loader("en");
  const { SITE_EVIDENCE, publicationLogo, RESEARCH_PARTNER } = load("src/lib/registry/preuves.ts");
  const { ClientReference, ResearchPartner } = load("src/system/components/PublicEvidence.tsx");
  assert.equal(renderToStaticMarkup(createElement(ClientReference, { id: "Unknown client" }, "Description")), "");
  const valid = { autorise: true, fichier: "/approved.svg", source: "Written consent", accord: { qui: "Rights owner", date: "2026-10-27" } };
  assert.equal(publicationLogo(valid), "/approved.svg");
  for (const patch of [{ autorise: false }, { fichier: null }, { fichier: "//external/logo.svg" }, { source: null }, { accord: null }, { accord: { qui: "", date: "2026-10-27" } }, { accord: { qui: "Owner", date: "2026-02-30" } }]) assert.equal(publicationLogo({ ...valid, ...patch }), null);
  assert.equal(publicationLogo(undefined), null);
  for (const evidence of SITE_EVIDENCE.filter(e => e.category === "client")) {
    assert.deepEqual(evidence.logo, { autorise: false, fichier: null, source: null, accord: null });
    assert.doesNotMatch(renderToStaticMarkup(createElement(ClientReference, { id: evidence.id }, "Description")), /<img/);
  }
  assert.equal(RESEARCH_PARTNER.logo.autorise, false);
  assert.equal(renderToStaticMarkup(createElement(ResearchPartner)), "");
  const evidence = SITE_EVIDENCE.find(e => e.id === "Laparra");
  const permission = evidence.permission_status;
  try {
    evidence.permission_status = "denied";
    assert.equal(renderToStaticMarkup(createElement(ClientReference, { id: "Laparra" }, "Description")), "");
    const html = renderToStaticMarkup(createElement(load("src/system/components/SinglePage.tsx").SinglePage, { locale: "en" }));
    assert.doesNotMatch(visibleText(html), /Laparra/);
  } finally { evidence.permission_status = permission; }
});
test("revoking every permission hides production and client headings, retaining tool disclosures", () => {
  const load = loader("en");
  const { SITE_EVIDENCE } = load("src/lib/registry/preuves.ts");
  const permissions = SITE_EVIDENCE.map(e => e.permission_status);
  try {
    SITE_EVIDENCE.forEach(e => { e.permission_status = "denied"; });
    const html = renderToStaticMarkup(createElement(load("src/system/components/SinglePage.tsx").SinglePage, { locale: "en" }));
    const text = visibleText(html);
    assert.doesNotMatch(html, /id="in-production"|class="refs"/);
    assert.doesNotMatch(text, /Our agents already work|They work with us|Laparra|Clevery|Forexpert|Joone|SNCF/);
    assert.match(text, /The tools we build with/);
    assert.match(text, /no partnership is implied/);
  } finally { SITE_EVIDENCE.forEach((e, i) => { e.permission_status = permissions[i]; }); }
});

for (const locale of ["fr", "en"]) test(`addendum ontology structure and translated copy (${locale})`, async () => {
  const html = await renderPage(locale);
  const figure = html.match(/<svg class="onto"[\s\S]*?<\/svg>/)?.[0];
  assert.ok(figure);
  assert.match(figure, /aria-hidden="true"/);
  assert.match(figure, /viewBox="0 0 1080 260"/);
  for (const [kind, count] of [["layer", 3], ["edge", 11], ["node", 4], ["node r", 3], ["ag", 3], ["eye", 6], ["pulse", 11]]) {
    assert.equal((figure.match(new RegExp(`class="${kind}"`, "g")) ?? []).length, count, kind);
  }
  const ids = [...figure.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, 11);
  assert.deepEqual([...figure.matchAll(/<mpath href="#([^"]+)"/g)].map(m => m[1]), ids);
  assert.doesNotMatch(figure, /rose|pink|#[\da-f]{3,8}\b|style=/i);
  assert.doesNotMatch(html, /class="stairs"/);
  for (const label of locale === "fr" ? ["Vos données", "Clients", "Commandes", "Stocks", "Factures", "Vos règles", "Validation", "Droits", "Échéances", "Vos agents"] : ["Your data", "Customers", "Orders", "Stock", "Invoices", "Your rules", "Approval", "Permissions", "Deadlines", "Your agents"]) assert.ok(visibleText(figure).includes(label), label);
  assert.ok(visibleText(html).includes(locale === "fr" ? "Votre expertise est la matière première. Nous en faisons des systèmes qui en multiplient l'impact." : "Your expertise is the raw material. We turn it into systems that multiply its impact."));
});
