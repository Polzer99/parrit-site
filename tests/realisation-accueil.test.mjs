// Décision de Paul du 23/11/2026 : « Ok lançons les réalisations […] On peut montrer la réalisation. »
// Spec : docs/CODEX-SPEC-2026-11-23-realisation-metier.md.
// Une réalisation montrée entre les logos et les offres, le métier dit sous le titre du héros,
// la ligne des 15 minutes sous le bouton, et sept besoins au lieu de dix-sept.
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loader } from "./helpers/site-v1-render.mjs";
import { visibleText } from "../scripts/brand-os-contracts.mjs";

const GARDES = ["rendez-vous", "relances", "commandes", "reponses-client", "logiciel", "formation", "priorites"];
const RETIRES = ["contenu", "appels-offres", "clients-reactives", "factures", "comptes-rendus", "contrats", "agents", "developpeurs", "ia-interne", "prototype"];
const TEXTES = {
  fr: {
    id: "realisation", offres: "offres",
    metier: "Des audits pour choisir où agir. Des logiciels conçus autour de votre métier.",
    note: "15 minutes pour présenter votre besoin et parler de ce qui est réalisable.",
    etiquette: "Logiciel pour le marché du négoce", titre: "Votre façon de travailler devient un logiciel.",
    phrases: ["Chacun voit les mêmes informations, à jour."],
    legende: "Démonstration, données fictives.", bouton: "Prendre rendez-vous",
  },
  en: {
    id: "case-study", offres: "offers",
    metier: "Audits to decide where to act. Software built around your business.",
    note: "15 minutes to present your need and discuss what is feasible.",
    etiquette: "Software for trading companies", titre: "The way you work becomes software.",
    phrases: ["Everyone sees the same information, up to date."],
    legende: "Demonstration, fictional data.", bouton: "Book a call",
  },
};
const section = (html, id) => html.match(new RegExp(`<section[^>]*\\bid="${id}"[\\s\\S]*?</section>`))?.[0];
const decode = text => text.replaceAll("&#x27;", "'").replaceAll("&amp;", "&");

for (const locale of ["fr", "en"]) {
  const load = loader(locale);
  const { SinglePage } = load("src/system/components/SinglePage.tsx");
  const { SITE_EVIDENCE, REALISATION_ASSETS, getSiteEvidence } = load("src/lib/registry/preuves.ts");
  const { HOME_GOALS, GOAL_GROUPS, homeGoal } = load("src/system/home-goals.ts");
  const { HOME_SECTION_ORDER } = load("src/system/home-layers.ts");
  const { localizedHomeHash } = load("src/system/home-anchors.ts");
  const render = (query = "") => renderToStaticMarkup(createElement(SinglePage, { locale, contactQuery: query }));
  const copy = TEXTES[locale];

  test(`la réalisation est montrée entre les logos et les offres, sans lien ni bouton (${locale})`, () => {
    const html = render();
    const ids = [...html.matchAll(/<section[^>]*\bid="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(ids.slice(ids.indexOf("references"), ids.indexOf("references") + 3), ["references", copy.id, copy.offres]);
    assert.equal(HOME_SECTION_ORDER[HOME_SECTION_ORDER.indexOf("references") + 1], "realisation");
    const bloc = section(html, copy.id);
    assert.ok(bloc, "section présente");
    assert.equal((html.match(new RegExp(`id="${copy.id}"`, "g")) ?? []).length, 1);
    assert.doesNotMatch(bloc, /<a\b|<button\b|rev-button/);
    assert.equal((bloc.match(/<h2>/g) ?? []).length, 1);
    const texte = decode(visibleText(bloc));
    for (const attendu of [copy.etiquette, copy.titre, ...copy.phrases, copy.legende]) assert.ok(texte.includes(attendu), attendu);
    // Le lien d'ancre suit la langue dans les deux sens.
    assert.equal(localizedHomeHash("#realisation", "en"), "#case-study");
    assert.equal(localizedHomeHash("#case-study", "fr"), "#realisation");
  });

  test(`la réalisation ne nomme aucun client et n'avance aucun chiffre de gain (${locale})`, () => {
    const bloc = section(render(), copy.id);
    assert.doesNotMatch(bloc, /Laparra|Clevery|Forexpert|Joone|SNCF|Carte Noire|Toyotomi|Hiolle|Agrolog|GESLOT/i);
    // Correction de Paul du 23/11/2026 : la section ne dit ni le métier ni le lieu d'un client.
    assert.doesNotMatch(bloc, /grossiste|Rungis|wholesale/i);
    assert.doesNotMatch(readFileSync("public/realisations/SOURCES.md", "utf8"), /grossiste|Rungis|wholesale|Laparra/i);
    assert.doesNotMatch(bloc, /\/clients\//);
    // Aucun chiffre dans le texte : ni pourcentage, ni montant, ni durée gagnée.
    assert.doesNotMatch(visibleText(bloc), /\d/);
    const preuve = SITE_EVIDENCE.find(item => item.id === "realisation-negoce");
    assert.ok(preuve);
    assert.doesNotMatch(`${preuve.id} ${preuve.display_name} ${preuve.claim}`, /Laparra|grossiste|Rungis|wholesale/i);
    assert.equal(preuve.category, "demonstration");
    assert.equal(preuve.logo.autorise, false);
    assert.match(preuve.permission_owner, /Paul Larmaraud, décision du 23\/11\/2026/);
    assert.deepEqual([...preuve.usage_scope], ["text", "image"]);
  });

  test(`l'écran est un fichier local, dimensionné, décrit et inscrit au registre (${locale})`, () => {
    const bloc = section(render(), copy.id);
    const image = bloc.match(/<img\b[^>]*>/)?.[0];
    assert.ok(image);
    assert.match(image, /src="\/realisations\/pilotage-ventes-1600\.webp"/);
    assert.match(image, /width="1600"/);
    assert.match(image, /height="937"/);
    assert.match(image, /loading="lazy"/);
    const alt = image.match(/alt="([^"]*)"/)?.[1] ?? "";
    assert.ok(alt.length > 20, "texte alternatif présent");
    // Le contrôle navigateur des textes publics n'admet « fictives » que dans une ligne d'état approuvée.
    assert.doesNotMatch(alt, /ficti/i);
    assert.equal(visibleText(bloc.match(/<figcaption>([\s\S]*?)<\/figcaption>/)[1]).trim(), copy.legende);
    const fichiers = new Set([...bloc.matchAll(/\/realisations\/[a-z0-9.-]+/g)].map(match => match[0]));
    assert.deepEqual([...fichiers].sort(), [...REALISATION_ASSETS].sort());
    assert.equal(REALISATION_ASSETS.length, 4);
    const preuve = getSiteEvidence("realisation-negoce", "home");
    assert.deepEqual([...preuve.approved_assets].sort(), [...REALISATION_ASSETS].sort());
    for (const fichier of REALISATION_ASSETS) {
      assert.ok(existsSync(`public${fichier}`), fichier);
      // Un écran, pas une photo : chaque export reste léger.
      assert.ok(statSync(`public${fichier}`).size < 120_000, fichier);
    }
    assert.match(readFileSync("public/realisations/SOURCES.md", "utf8"), /données fictives/);
    assert.equal((bloc.match(/<figcaption>/g) ?? []).length, 1);
    // Les deux sources annoncent la largeur d'affichage : sans cela le téléphone télécharge le grand export.
    const sizes = [...bloc.matchAll(/<source\b[^>]*\bsizes="([^"]+)"/g)].map(match => match[1]);
    assert.equal(sizes.length, 2);
    for (const value of sizes) assert.match(value, /^\(max-width: 760px\) calc\(100vw - 40px\), \(max-width: 1100px\) calc\(100vw - 96px\), 620px$/);
    assert.match(bloc, /^<section[^>]*data-evidence="realisation-negoce"/);
  });

  test(`la réalisation disparaît entièrement si sa preuve n'est plus accordée (${locale})`, () => {
    const preuve = SITE_EVIDENCE.find(item => item.id === "realisation-negoce");
    const permission = preuve.permission_status;
    try {
      preuve.permission_status = "denied";
      const html = render();
      assert.equal(section(html, copy.id), undefined);
      assert.doesNotMatch(html, /\/realisations\/|realisation-window/);
      assert.ok(section(html, copy.offres), "les autres sections restent");
    } finally { preuve.permission_status = permission; }
    assert.ok(section(render(), copy.id));
  });

  test(`le héros dit le métier et les 15 minutes, et garde un seul bouton (${locale})`, () => {
    const hero = section(render(), "haut");
    const texte = decode(visibleText(hero));
    assert.ok(texte.includes(copy.metier), copy.metier);
    assert.ok(texte.includes(copy.note), copy.note);
    assert.equal((hero.match(/class="hero-metier"/g) ?? []).length, 1);
    assert.equal((hero.match(/class="hero-note"/g) ?? []).length, 1);
    // Ordre de lecture : titre, métier, sélecteur, résultat, bouton, puis la ligne des 15 minutes.
    const ordre = ["<h1>", 'class="hero-metier"', 'class="goal-form"', 'class="goal-results"', 'class="actions"', 'class="hero-note"'].map(repere => hero.indexOf(repere));
    assert.ok(ordre.every(position => position >= 0), ordre.join(","));
    assert.deepEqual([...ordre].sort((a, b) => a - b), ordre);
    const boutons = [...hero.matchAll(/<a class="[^"]*rev-button[^"]*"[^>]*>([\s\S]*?)<\/a>/g)];
    assert.equal(boutons.length, 1);
    assert.equal(visibleText(boutons[0][1]).trim(), copy.bouton);
    assert.equal((hero.match(/<h1>/g) ?? []).length, 1);
  });

  test(`le sélecteur garde sept besoins, dans les trois groupes (${locale})`, () => {
    assert.deepEqual(HOME_GOALS.map(goal => goal.id), GARDES);
    assert.deepEqual(GOAL_GROUPS.map(group => HOME_GOALS.filter(goal => goal.group === group.id).length), [2, 2, 3]);
    const html = render();
    const options = [...html.match(/<select id="objectif"[\s\S]*?<\/select>/)[0].matchAll(/<option value="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(options, GARDES);
    // Un ancien lien vers un besoin retiré retombe sur le premier, comme toute valeur inconnue.
    for (const id of RETIRES) {
      assert.equal(homeGoal(id).id, "rendez-vous", id);
      assert.ok(render(`objectif=${id}`).includes('data-path="rendez-vous"'), id);
      assert.ok(render(`source=accueil-${id}`).includes('value="rendez-vous" selected=""'), id);
    }
  });
}
