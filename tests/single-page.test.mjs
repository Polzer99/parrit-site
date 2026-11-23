import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loader, renderPage } from "./helpers/site-v1-render.mjs";
import { visibleText } from "../scripts/brand-os-contracts.mjs";
const anchors = { fr: ["haut", "references", "realisation", "offres", "partenaires", "parcours", "terrain", "technologies", "mesures", "questions", "contact"], en: ["haut", "references", "case-study", "offers", "team", "path", "in-the-field", "technologies", "measurements", "questions", "contact"] };
test("hero paths never depend on CSS d or responsive path variables", () => {
  const css = readFileSync("src/system/single-page.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  assert.doesNotMatch(css, /(?:^|[;{])\s*d\s*:/i);
  assert.doesNotMatch(css, /--(?:desktop|compact)-path/);
});

for (const locale of ["fr", "en"]) test(`goal SVG has a complete static path in SSR (${locale})`, async () => {
  const html = await renderPage(locale);
  assert.doesNotMatch(html, /--(?:desktop|compact)-path/);
  const diagram = html.match(/<svg[^>]*class="goal-diagram"[\s\S]*?<\/svg>/)?.[0];
  assert.ok(diagram);
  assert.equal((diagram.match(/data-node=/g) ?? []).length, 48);
  assert.equal((diagram.match(/data-active="true"/g) ?? []).length, 3);
  const path = diagram.match(/<polyline[^>]*points="([^"]+)"/);
  assert.ok(path);
  assert.equal(path[1].trim().split(/\s+/).length, 3);
});
// 21/11/2026 (soir): the calculator is removed; the anonymous block that must survive permission revocation is the offers section.
function applications(html, locale) {
  const section = html.match(new RegExp(`<section[^>]*id="${locale === "fr" ? "offres" : "offers"}"[^>]*>[\\s\\S]*?</section>`))?.[0];
  assert.ok(section, "the offers section is present");
  assert.doesNotMatch(html, /calc-card|home-calculator/);
  assert.equal((section.match(/<article /g) ?? []).length, 2);
  assert.equal((section.match(/<h[23]>/g) ?? []).length, 3);
  assert.doesNotMatch(section, /Laparra|Clevery|Forexpert|Joone|SNCF|data-evidence|class="who"|\/clients\//i);
  return section;
}
for (const locale of ["fr", "en"]) test(`final single-page sections and booking render without JS (${locale})`, async () => {
  // Décision de Paul du 08/11/2026 : Journal in the new articles layer and footer.
  const main = await renderPage(locale);
  const load = loader(locale, { "next/navigation": { usePathname: () => locale === "fr" ? "/fr" : "/", useSearchParams: () => new URLSearchParams() } });
  const { RevFooter } = load("src/system/components/RevFooter.tsx");
  const footer = renderToStaticMarkup(createElement(RevFooter, { locale }));
  const html = main + footer;
  const journalLink = new RegExp(`href="${locale === "fr" ? "/fr" : ""}/journal"`);
  assert.match(main, journalLink);
  assert.match(footer, journalLink);
  assert.equal((html.match(/<section\b/g) ?? []).length, 11);
  assert.deepEqual([...html.matchAll(/<section\b[^>]*id="([^"]+)"/g)].map(m => m[1]), anchors[locale]);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  // 7 objectives in the hero since 23/11/2026, nothing else (calculator removed 21/11/2026, evening).
  assert.equal((main.match(/<option\b/g) ?? []).length, 7);
  assert.equal((main.match(/data-result=/g) ?? []).length, 7);
  assert.doesNotMatch(main, /class="sub"|class="hero-reassurance"/);
  // The Journal can contain the English word "hidden"; check the HTML attribute.
  assert.doesNotMatch(html, /class="k"|v1-index|registry-line/);
  assert.doesNotMatch(visibleText(html), /Votre phrase indique|What you say tells/);
  const partners = html.match(new RegExp(`<section id="${locale === "fr" ? "partenaires" : "team"}">[\\s\\S]*?</section>`))?.[0];
  assert.ok(partners);
  assert.equal((partners.match(/class="s"/g) ?? []).length, 7);
  assert.match(visibleText(partners), /MIT/);
  // 21/11/2026 (soir, décision 2) : un pictogramme par carte, toujours aucune image ni logo.
  assert.doesNotMatch(partners, /<img/);
  assert.equal((partners.match(/<svg class="card-glyph"/g) ?? []).length, 7);
  assert.equal((partners.match(/<svg /g) ?? []).length, 7);
  assert.doesNotMatch(html, /href="#reservation"/);
  const contact = html.slice(html.indexOf('id="contact"'));
  assert.match(contact, /id="reservation"[\s\S]*data-booking-mock[\s\S]*data-capture-mock/);
  // Repasse de conversion du 21/11/2026 : le bloc de contact n'a plus d'image.
  assert.doesNotMatch(contact.slice(0, contact.indexOf('</section>')), /<picture|<img/);
  assert.doesNotMatch(contact, /paul-centre\.png/);
  assert.match(html, new RegExp(`href="${locale === "fr" ? "/fr" : ""}/journal"`));
  assert.equal((html.match(/class="phone"/g) ?? []).length, 0);
  applications(html, locale);
  const text = visibleText(html);
  const references = html.match(/<section id="references"[\s\S]*?<\/section>/)?.[0];
  assert.ok(references);
  assert.doesNotMatch(references, /class="reflines"|<p/);
  for (const client of ["Laparra", "Clevery", "Forexpert", "Joone", "SNCF"]) assert.match(references, new RegExp(`aria-label="${client}[^"]*"`));
  assert.doesNotMatch(text, /Arkel/);
  assert.match(text, locale === "fr" ? /Des assistants que vos équipes relisent et valident\./ : /Assistants your teams review and approve\./);
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
    assert.deepEqual(evidence.logo.accord, ["Carte Noire"].includes(evidence.id)
      ? { qui: "Paul Larmaraud, décision nominative sans accord écrit des clients", date: "2026-11-08" }
      : { qui: "Paul Larmaraud, décision d'affichage sans accord écrit du client", date: "2026-10-27" });
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
    assert.doesNotMatch(html, /Laparra|Clevery|Forexpert|Joone|SNCF|Toyotomi|Hiolle|Carte Noire/i);
    assert.doesNotMatch(text, /Our agents are already at work|They work with us|Nos agents travaillent déjà|Ils travaillent avec nous|Laparra|Clevery|Forexpert|Joone|SNCF/);
    assert.doesNotMatch(text, /We build with/);
    assert.doesNotMatch(text, /Les marques citées|The brands named/);
  } finally { SITE_EVIDENCE.forEach((e, i) => { e.permission_status = permissions[i]; }); }
});

for (const locale of ["fr", "en"]) test(`three levels and 7 complete goal results in static SSR (${locale})`, async () => {
  const html = await renderPage(locale);
  const hero = html.match(/<section class="hero"[^>]*>[\s\S]*?<\/section>/)?.[0];
  assert.ok(hero);
  assert.equal((hero.match(/data-node=/g) ?? []).length, 48);
  assert.equal((hero.match(/<optgroup\b/g) ?? []).length, 3);
  assert.equal((hero.match(/<option\b/g) ?? []).length, 7);
  assert.equal((hero.match(/data-result=/g) ?? []).length, 7);
  assert.match(hero, /aria-live="polite"/);
  assert.match(hero, /<title[^>]*>[^<]+<\/title>/);
  assert.doesNotMatch(hero, /ontocap|onto-approval|hero-reassurance|class="sub"|class="humby"/);
  assert.doesNotMatch(hero, /#[\da-f]{3,8}\b/i);
});

for (const locale of ["fr", "en"]) test(`public rendered HTML remains anonymous (${locale})`, async () => {
  // Décision de Paul du 08/11/2026, nuit: new names only in the reference band.
  const html = await renderPage(locale);
  assert.doesNotMatch(html, /atlas/i);
  assert.doesNotMatch(html.replace(/<section id="references"[\s\S]*?<\/section>/, ""), /toyotomi|hiolle|carte noire/i);
});

for (const locale of ["fr", "en"]) test(`passe 4 services, technologies, logos and final walker (${locale})`, async () => {
  const html = await renderPage(locale);
  const text = visibleText(html);
  assert.doesNotMatch(text, /Brésil|Brazil|Cameroun|Cameroon|métropole lilloise|Lille area|Exemples illustratifs|Illustrative examples/);
  assert.doesNotMatch(html, /id="confiance"|id="safeguards"|class="local-note"/);
  assert.match(html, /class="walk s1 s2 s3 withbot" viewBox="0 0 1080 130" aria-hidden="true"/);
  assert.match(html, /class="human" transform="translate\(900 120\)"/);
  assert.doesNotMatch(html, /calc-card/);
  assert.doesNotMatch(html, /id="architecture"|class="stage"/);
  assert.equal((html.match(/role="img"/g) ?? []).length, 7);
  const strip = html.match(/<section id="references">([\s\S]*?)<\/section>/)?.[1];
  assert.ok(strip);
  assert.equal((strip.match(/role="img"/g) ?? []).length, 6);
  assert.doesNotMatch(html, /Toyotomi Europe|Hiolle Technologies/i);
  assert.doesNotMatch(strip, /toyotomi|hiolle/i);
  assert.doesNotMatch(html, /mask-image:url\(https?:/);
  const founder = html.match(/<div class="founder-identity">\s*(<h2>[\s\S]*?<\/h2>)/)?.[1];
  assert.ok(founder);
  assert.equal(visibleText(founder).replace(/\s+/g, " ").trim(), locale === "fr"
    ? "Commencez par une tâche précise."
    : "Start with one specific task.");
});

for (const locale of ["fr", "en"]) test(`passe 4 complete SSR use cases, offers after architecture removal (${locale})`, async () => {
  const html = await renderPage(locale);
  const copy = loader(locale)("src/system/single-page-copy.ts");
  assert.equal(copy.SERVICE_CASES.length, 12);
  // 21/11/2026 (soir, décision 2) : les 23 offres des partenaires sortent de la page et du HTML ;
  // cette décision remplace le contrat du 27/10/2026. Sept cartes : un pictogramme, un titre, une phrase.
  assert.equal(copy.PARTNER_OFFERS, undefined);
  assert.doesNotMatch(html, /partner-offers|partner-delivery|offer-sizer/);
  assert.equal((html.match(/<div class="partner">/g) ?? []).length, 7);
  assert.doesNotMatch(visibleText(html), /Avec eux, nous livrons|With them, we deliver/);
  assert.equal((html.match(/data-result=/g) ?? []).length, 7);
  assert.doesNotMatch(html, /calc-card/);
  assert.doesNotMatch(html, /class="use-case"|class="tag bo"|class="tag new"/);
  // 21/11 (soir): the calculator carousel is gone, four swipe carousels remain.
  assert.equal((html.match(/class="swipe-dots"/g) ?? []).length, 4);
  assert.doesNotMatch(html, /id="architecture"|class="flowmap|\/tools\//);
  const { SITE_EVIDENCE } = loader(locale)("src/lib/registry/preuves.ts");
  assert.match(SITE_EVIDENCE.find(item => item.id === "Laparra").claim, /pilotage agentique/);
  assert.doesNotMatch(visibleText(html), /pilote sa base clients|runs its customer base|agents that manage the customer base/);
});
