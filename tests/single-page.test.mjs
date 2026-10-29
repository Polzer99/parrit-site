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
  // Tour 2 moves the Journal entry to the real footer: retain the link assertion
  // on the complete public surface instead of restoring the removed main link.
  const main = await renderPage(locale);
  const load = loader(locale, { "next/navigation": { usePathname: () => locale === "fr" ? "/fr" : "/" } });
  const { RevFooter } = load("src/system/components/RevFooter.tsx");
  const footer = renderToStaticMarkup(createElement(RevFooter, { locale }));
  const html = main + footer;
  const journalLink = new RegExp(`href="${locale === "fr" ? "/fr" : ""}/journal"`);
  assert.doesNotMatch(main, journalLink);
  assert.match(footer, journalLink);
  assert.equal((html.match(/<section\b/g) ?? []).length, 9);
  assert.deepEqual([...html.matchAll(/<section\b[^>]*id="([^"]+)"/g)].map(m => m[1]), anchors[locale]);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(visibleText(html), locale === "fr" ? /Votre expertise est la matière première/ : /Your expertise is the raw material/);
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
  const references = html.match(/<section id="references"[\s\S]*?<\/section>/)?.[0];
  assert.ok(references);
  assert.doesNotMatch(references, /class="reflines"|<p/);
  for (const client of ["Laparra", "Clevery", "Forexpert", "Joone", "SNCF"]) assert.match(references, new RegExp(`aria-label="${client}[^"]*"`));
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
    assert.doesNotMatch(text, /Les marques citées|The brands named/);
  } finally { SITE_EVIDENCE.forEach((e, i) => { e.permission_status = permissions[i]; }); }
});

for (const locale of ["fr", "en"]) test(`three planes, 33 nodes and four complete translated stories in static SSR (${locale})`, async () => {
  const html = await renderPage(locale);
  const hero = html.match(/<section class="hero">[\s\S]*?<\/section>/)?.[0];
  assert.ok(hero);
  const { HERO_STORIES, NODES, ZONES, LAYERS, UP, REL, TOP } = loader(locale)("src/system/ontology-hero-data.ts");
  const { SINGLE_PAGE_EN } = loader(locale)("src/system/single-page-copy.ts");
  const t = text => locale === "fr" ? text : SINGLE_PAGE_EN[text];
  assert.equal(HERO_STORIES.length, 4);
  assert.equal((hero.match(/data-node=/g) ?? []).length, 33);
  assert.deepEqual([...hero.matchAll(/data-plane="([^"]+)"/g)].map(m => m[1]), ["bot", "mid", "top"]);
  assert.equal((hero.match(/data-link=/g) ?? []).length, UP.length + REL.length + TOP.length);
  assert.ok(hero.indexOf('data-plane="bot"') < hero.indexOf('data-link="up_'));
  assert.ok(hero.indexOf('data-link="up_') < hero.indexOf('data-plane="mid"'));
  assert.ok(hero.indexOf('data-plane="mid"') < hero.indexOf('data-link="rel_'));
  assert.ok(hero.indexOf('data-link="top_') < hero.indexOf('data-plane="top"'));
  assert.match(hero, /tabindex="0" role="region"/);
  assert.ok(hero.includes(`aria-label="${locale === "fr" ? "Des sources aux résultats" : "From sources to results"}"`));
  assert.match(hero, /data-story="0" data-step="4"/);
  assert.match(hero, /<svg class="onto"[^>]*aria-hidden="true"/);
  assert.equal((hero.match(/class="ontocap-sizer"/g) ?? []).length, 4);
  assert.match(hero, /class="ontocap" aria-live="off"/);
  assert.equal((hero.match(/class="onto-badge onto-number is-visible"/g) ?? []).length, 4);
  for (const id of ["mails", "client", "commande", "cgv", "rep", "messagerie"]) {
    assert.match(hero, new RegExp(`data-node="${id}"[^>]*class="onto-node is-lit`));
  }
  const labels = [...Object.values(NODES).flat().map(node => node[1]), ...Object.values(ZONES).flat(), ...Object.values(LAYERS).flat(), ...HERO_STORIES.flatMap(story => [story.title, ...story.steps, story.result, story.verb]), "PRÊT"];
  for (const label of labels) {
    assert.ok(SINGLE_PAGE_EN[label], `English missing: ${label}`);
    assert.ok(visibleText(hero).includes(t(label)), label);
  }
  assert.match(hero, /class="humby">[^<]*Clive Humby[^<]*2006/);
  assert.doesNotMatch(hero, /<animate|class="token"|class="trail"|toklab|static-feed|ontology-motion/);
  assert.doesNotMatch(hero, /#[\da-f]{3,8}\b/i);
});

for (const locale of ["fr", "en"]) test(`public rendered HTML remains anonymous (${locale})`, async () => {
  assert.doesNotMatch(await renderPage(locale), /toyotomi|hiolle|atlas/i);
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
  assert.equal(PARTNER_OFFERS.flat().length, 23);
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
