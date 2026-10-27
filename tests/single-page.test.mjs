import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loader, renderPage } from "./helpers/site-v1-render.mjs";
import { visibleText } from "../scripts/brand-os-contracts.mjs";
const anchors = { fr: ["technologies", "en-production", "ce-qui-change", "parcours", "services", "partenaires", "references", "contact"], en: ["technologies", "in-production", "what-changes", "path", "services", "team", "references", "contact"] };
function applications(html, locale) {
  const section = html.match(new RegExp(`<section class="live" id="${locale === "fr" ? "en-production" : "in-production"}">[\\s\\S]*?</section>`))?.[0];
  assert.ok(section, "applications remain present");
  assert.equal((section.match(/class="phone"/g) ?? []).length, 3);
  assert.equal((section.match(/<h3>/g) ?? []).length, 3);
  assert.match(section, /<h2>[^<]+ <b>[^<]+<\/b><\/h2>/);
  assert.match(visibleText(section), locale === "fr" ? /données fictives/ : /fictional data/);
  assert.doesNotMatch(section, /Laparra|Clevery|Forexpert|Joone|SNCF|data-evidence|class="who"|\/clients\//i);
  return section;
}
for (const locale of ["fr", "en"]) test(`final single-page sections and booking render without JS (${locale})`, async () => {
  const html = await renderPage(locale);
  assert.equal((html.match(/<section\b/g) ?? []).length, 9);
  assert.deepEqual([...html.matchAll(/<section\b[^>]*id="([^"]+)"/g)].map(m => m[1]), anchors[locale]);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(visibleText(html), locale === "fr" ? /Nous allons à la frontière du possible/ : /We go to the frontier of what is possible/);
  assert.doesNotMatch(html, /\shidden[=> ]|class="k"|v1-index|registry-line/);
  assert.doesNotMatch(visibleText(html), /Votre phrase indique|What you say tells/);
  const partners = html.match(new RegExp(`<section id="${locale === "fr" ? "partenaires" : "team"}">[\\s\\S]*?</section>`))?.[0];
  assert.ok(partners);
  assert.equal((partners.match(/class="s"/g) ?? []).length, 7);
  assert.match(visibleText(partners), /MIT/);
  assert.doesNotMatch(partners, /<img|<svg/);
  assert.match(html, /href="#reservation"/);
  const contact = html.slice(html.indexOf('id="contact"'));
  assert.match(contact, /id="reservation"[\s\S]*data-booking-mock[\s\S]*data-capture-mock/);
  const picture = contact.match(/<picture>[\s\S]*?<\/picture>/)?.[0];
  assert.ok(picture);
  assert.deepEqual([...picture.matchAll(/<source type="([^"]+)"/g)].map(m => m[1]), ["image/avif", "image/webp"]);
  for (const format of ["avif", "webp"]) {
    assert.ok(picture.includes(`srcSet="/brand/founder/parrit-ai-founder-linkedin-buste-3x4-340.${format} 340w, /brand/founder/parrit-ai-founder-linkedin-buste-3x4-680.${format} 680w"`));
  }
  assert.match(picture, /src="\/brand\/founder\/parrit-ai-founder-linkedin-buste-3x4-680.webp"/);
  assert.match(picture, /alt="Paul Larmaraud" width="600" height="800" loading="lazy"/);
  assert.doesNotMatch(contact, /paul-centre\.png/);
  assert.match(html, new RegExp(`href="${locale === "fr" ? "/fr" : ""}/journal"`));
  assert.equal((html.match(/class="phone"/g) ?? []).length, 3);
  applications(html, locale);
  const text = visibleText(html);
  for (const client of ["Laparra", "Clevery", "Forexpert", "Joone", "SNCF"]) assert.ok(text.includes(client));
  assert.doesNotMatch(text, /Arkel/);
  assert.match(text, locale === "fr" ? /données fictives/ : /fictional data/);
  for (const [, label] of html.matchAll(/<a class="[^"]*rev-button[^\"]*"[^>]*>(.*?)<\/a>/g)) assert.doesNotMatch(visibleText(label), /\.$/);
});
test("previous portrait remains intact in the repository after the founder photo change", () => {
  const { portrait } = JSON.parse(readFileSync("src/system/single-page-assets.json", "utf8"));
  assert.equal(portrait.reference, "person.paul.primary_portrait");
  assert.equal(portrait.sha256, "b5537ffe836e6933a11e2ff6b81b617e5ccab24213462bfc41c27aae0e182733");
  assert.equal(createHash("sha256").update(readFileSync(`public${portrait.file}`)).digest("hex"), portrait.sha256);
});
test("client logos fail closed without permission, file, source and a dated named decision", () => {
  const load = loader("en");
  const { SITE_EVIDENCE, publicationLogo, RESEARCH_PARTNER } = load("src/lib/registry/preuves.ts");
  const { ClientReference, ClientLogoStrip, ResearchPartner } = load("src/system/components/PublicEvidence.tsx");
  assert.equal(renderToStaticMarkup(createElement(ClientReference, { id: "Unknown client" }, "Description")), "");
  const valid = { autorise: true, fichier: "/approved.svg", source: "Written consent", accord: { qui: "Rights owner", date: "2026-10-27" } };
  assert.equal(publicationLogo(valid), "/approved.svg");
  for (const patch of [{ autorise: false }, { fichier: null }, { fichier: "//external/logo.svg" }, { source: null }, { accord: null }, { accord: { qui: "", date: "2026-10-27" } }, { accord: { qui: "Owner", date: "2026-02-30" } }]) assert.equal(publicationLogo({ ...valid, ...patch }), null);
  assert.equal(publicationLogo(undefined), null);
  for (const evidence of SITE_EVIDENCE.filter(e => e.category === "client")) {
    assert.equal(evidence.logo.autorise, true);
    assert.ok(publicationLogo(evidence.logo));
    assert.ok(readFileSync(`public${evidence.logo.fichier}`).length > 0);
    assert.ok(evidence.logo.source);
    assert.deepEqual(evidence.logo.accord, { qui: "Paul Larmaraud, décision d'affichage sans accord écrit du client", date: "2026-10-27" });
    assert.doesNotMatch(renderToStaticMarkup(createElement(ClientReference, { id: evidence.id }, "Description")), /<img/);
  }
  const logoEvidence = SITE_EVIDENCE.find(e => e.id === "Laparra");
  const savedLogo = logoEvidence.logo;
  try {
    logoEvidence.logo = { ...savedLogo, autorise: false };
    assert.doesNotMatch(renderToStaticMarkup(createElement(ClientLogoStrip)), /clients\/laparra|aria-label="Laparra"/);
    assert.match(renderToStaticMarkup(createElement(ClientReference, { id: "Laparra" }, "Description")), /Laparra/);
  } finally { logoEvidence.logo = savedLogo; }
  assert.equal(RESEARCH_PARTNER.logo.autorise, false);
  assert.equal(renderToStaticMarkup(createElement(ResearchPartner)), "");
  const evidence = SITE_EVIDENCE.find(e => e.id === "Laparra");
  const permission = evidence.permission_status;
  try {
    evidence.permission_status = "denied";
    assert.equal(renderToStaticMarkup(createElement(ClientReference, { id: "Laparra" }, "Description")), "");
    const html = renderToStaticMarkup(createElement(load("src/system/components/SinglePage.tsx").SinglePage, { locale: "en" }));
    assert.doesNotMatch(visibleText(html), /Laparra/);
    assert.doesNotMatch(html, /clients\/laparra|data-evidence="Laparra"/);
  } finally { evidence.permission_status = permission; }
});
for (const locale of ["fr", "en"]) test(`revoking every permission hides client names but retains anonymous applications (${locale})`, () => {
  const load = loader(locale);
  const { SITE_EVIDENCE } = load("src/lib/registry/preuves.ts");
  const permissions = SITE_EVIDENCE.map(e => e.permission_status);
  const SinglePage = load("src/system/components/SinglePage.tsx").SinglePage;
  const before = applications(renderToStaticMarkup(createElement(SinglePage, { locale })), locale);
  try {
    SITE_EVIDENCE.forEach(e => { e.permission_status = "denied"; });
    const html = renderToStaticMarkup(createElement(SinglePage, { locale }));
    const text = visibleText(html);
    assert.equal(applications(html, locale), before, "all scenes and captions survive permission revocation unchanged");
    assert.doesNotMatch(html, /class="reflines"|data-evidence|\/clients\//);
    assert.doesNotMatch(html, /Laparra|Clevery|Forexpert|Joone|SNCF/i);
    assert.doesNotMatch(text, /Our agents are already at work|They work with us|Nos agents travaillent déjà|Ils travaillent avec nous|Laparra|Clevery|Forexpert|Joone|SNCF/);
    assert.doesNotMatch(text, /We build with/);
    assert.match(text, locale === "fr" ? /aucun partenariat/ : /no partnership is implied/);
  } finally { SITE_EVIDENCE.forEach((e, i) => { e.permission_status = permissions[i]; }); }
});

for (const locale of ["fr", "en"]) test(`six-story ontology with four static results and translated copy (${locale})`, async () => {
  const html = await renderPage(locale);
  const figure = html.match(/<svg class="onto"[\s\S]*?<\/svg>/)?.[0];
  assert.ok(figure);
  assert.match(figure, /aria-hidden="true"/);
  assert.match(figure, /viewBox="0 0 1080 360"/);
  for (const [kind, count] of [["layer", 3], ["edge", 16], ["edge talk", 5], ["node", 5], ["node r", 4], ["ag", 6], ["eye", 12], ["res on", 3], ["res on hot", 1], ["feed static-feed", 1]]) {
    assert.equal((figure.match(new RegExp(`class="${kind}"`, "g")) ?? []).length, count, kind);
  }
  const ids = [...figure.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, 21);
  assert.doesNotMatch(figure, /<animate|class="token"|class="trail"|class="ontology-motion"/);
  assert.equal((figure.match(/width="250" height="50"/g) ?? []).length, 4);
  assert.match(html, /class="ontocap" aria-live="off"/);
  const outputs = locale === "fr" ? ["Relance prête", "Commande fournisseur prête", "Trésorerie à jour", "Commande saisie"] : ["Follow-up ready", "Supplier order ready", "Cash position updated", "Order entered"];
  assert.deepEqual([...figure.matchAll(/class="rest">([\s\S]*?)<\/text>/g)].map(m => visibleText(m[1]).replace(/\s+/g, " ").trim()), outputs);
  assert.deepEqual([...figure.matchAll(/transform="translate\(820 (\d+)\)" opacity="([^"]+)"/g)].map(m => [Number(m[1]), Number(m[2])]), [[70, 1], [132, 1], [194, 1], [256, 1]]);
  const caption = html.match(/class="ontocap" aria-live="off">([^<]+)<\/p>/)?.[1];
  assert.equal(caption, locale === "fr" ? "Un client écrit. L&#x27;agent commercial le reconnaît, l&#x27;agent de relance prépare la réponse." : "A client writes. The sales agent recognizes them; the follow-up agent drafts the reply.");
  assert.match(html, /class="humby">[^<]*Clive Humby[^<]*2006/);
  assert.doesNotMatch(figure, /rose|pink|#[\da-f]{3,8}\b|style=/i);
  assert.doesNotMatch(html, /class="stairs"/);
  for (const label of locale === "fr" ? ["Vos données", "Clients", "Commandes", "Stocks", "Factures", "Vos règles", "Validation", "Droits", "Échéances", "Vos agents"] : ["Your data", "Customers", "Orders", "Stock", "Invoices", "Your rules", "Approval", "Permissions", "Deadlines", "Your agents"]) assert.ok(visibleText(figure).includes(label), label);
  assert.ok(visibleText(html).includes(locale === "fr" ? "Votre expertise est la matière première. Nous en faisons des systèmes qui en multiplient l'impact." : "Your expertise is the raw material. We turn it into systems that multiply its impact."));
});

for (const locale of ["fr", "en"]) test(`passe 4 services, technologies, logos and final walker (${locale})`, async () => {
  const html = await renderPage(locale);
  const text = visibleText(html);
  assert.doesNotMatch(text, /Brésil|Brazil|Cameroun|Cameroon|métropole lilloise|Lille area|Exemples illustratifs|Illustrative examples/);
  assert.doesNotMatch(html, /id="confiance"|id="safeguards"|class="local-note"|<details/);
  assert.match(html, /class="walk s1 s2 s3 withbot" viewBox="0 0 1080 130" aria-hidden="true"/);
  assert.match(html, /class="human" transform="translate\(900 120\)"/);
  assert.equal((html.match(/class="use-case"/g) ?? []).length, 12);
  assert.doesNotMatch(html, /id="architecture"|class="stage"/);
  assert.equal((html.match(/role="img"/g) ?? []).length, 10);
  const strip = html.match(/class="logo-track">([\s\S]*?)<div class="logo-set" aria-hidden="true">/)?.[1];
  assert.ok(strip);
  assert.equal((strip.match(/role="img"/g) ?? []).length, 5);
  assert.doesNotMatch(html, /mask-image:url\(https?:/);
  const founder = html.match(/<h2>Paul Larmaraud,[\s\S]*?<\/h2>/)?.[0];
  assert.ok(founder);
  assert.doesNotMatch(visibleText(founder), /\.$/);
});

for (const locale of ["fr", "en"]) test(`passe 4 complete SSR use cases, offers after architecture removal (${locale})`, async () => {
  const html = await renderPage(locale);
  const { SERVICE_CASES, PARTNER_OFFERS, SINGLE_PAGE_EN } = loader(locale)("src/system/single-page-copy.ts");
  const t = value => locale === "fr" ? value : SINGLE_PAGE_EN[value];
  assert.equal(SERVICE_CASES.length, 12);
  assert.equal(PARTNER_OFFERS.flat().length, 20);
  for (const [name, cases] of SERVICE_CASES) {
    assert.ok(t(name), name);
    assert.equal(cases.length, 4);
    for (const value of cases) { assert.ok(t(value), value); assert.ok(visibleText(html).includes(t(value)), value); }
  }
  for (const offer of PARTNER_OFFERS.flat()) { assert.ok(t(offer), offer); assert.ok(visibleText(html).includes(t(offer)), offer); }
  assert.equal((html.match(/class="case"/g) ?? []).length, 12);
  assert.equal((html.match(/class="case visually-hidden"/g) ?? []).length, 36);
  assert.equal((html.match(/class="use-case"[^>]*aria-live="off" data-case="0"/g) ?? []).length, 12);
  assert.equal((html.match(/class="tag bo"/g) ?? []).length, 24);
  assert.equal((html.match(/class="tag new"/g) ?? []).length, 24);
  assert.equal((html.match(/class="swipe-dots"/g) ?? []).length, 5);
  assert.doesNotMatch(html, /id="architecture"|class="flowmap|\/tools\//);
  const { SITE_EVIDENCE } = loader(locale)("src/lib/registry/preuves.ts");
  assert.match(SITE_EVIDENCE.find(item => item.id === "Laparra").claim, /pilotage agentique/);
  assert.doesNotMatch(visibleText(html), /pilote sa base clients|runs its customer base|agents that manage the customer base/);
});
