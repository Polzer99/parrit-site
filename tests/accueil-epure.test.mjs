import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loader } from "./helpers/site-v1-render.mjs";

const escape = text => text.replaceAll("&", "&amp;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
for (const locale of ["fr", "en"]) {
  const calendars = [];
  const load = loader(locale, { "./CalInline": { ParritCalInline: props => { calendars.push(props); return React.createElement("div", { "data-cal-mock": true }); } } });
  const { HOME_GOALS, GOAL_PLANES, homeGoal, goalNodeLabel } = load("src/system/home-goals.ts");
  const { SinglePage } = load("src/system/components/SinglePage.tsx");
  const render = (query = "") => renderToStaticMarkup(React.createElement(SinglePage, { locale, contactQuery: query }));
  test(`complete initial HTML ${locale}: 7 objectives, results, 48 nodes, flows, measures and no assistants section`, () => {
    const html = render();
    assert.equal(HOME_GOALS.length, 7);
    assert.equal(new Set(HOME_GOALS.map(goal => goal.id)).size, 7);
    assert.deepEqual(GOAL_PLANES.map(plane => plane.nodes.length), [16, 16, 16]);
    // 7 objectives in the hero since 23/11/2026 (Paul: seven needs instead of seventeen), nothing else: the calculator was removed on 21/11/2026 (evening).
    assert.equal((html.match(/<option\b/g) ?? []).length, 7);
    assert.equal((html.match(/<optgroup\b/g) ?? []).length, 3);
    assert.equal((html.match(/data-node=/g) ?? []).length, 48);
    // Every node keeps one label, shown or hidden: three active nodes and their three labels, counted apart.
    assert.equal((html.match(/<rect\b[^>]*\bdata-active="true"/g) ?? []).length, 3);
    assert.equal((html.match(/class="goal-node-label"[^>]*\bdata-active="true"/g) ?? []).length, 3);
    assert.equal((html.match(/data-active="true"/g) ?? []).length, 6);
    assert.equal((html.match(/class="goal-node-label"/g) ?? []).length, 48);
    // Décisions de Paul : 15/11 les trois mesures internes quittent l'accueil ; 21/11 au soir le calculateur est supprimé.
    assert.equal((html.match(/class="goal-flow"/g) ?? []).length, 0);
    assert.equal((html.match(/class="home-measure"/g) ?? []).length, 0);
    assert.doesNotMatch(html, /calc-card|home-calculator|home-motors|data-calculator/);
    // Décision de Paul du 21/11/2026 (spec 2, B.1) : la section des assistants est supprimée.
    assert.equal((html.match(/target="_blank" rel="noopener"/g) ?? []).length, 0);
    assert.doesNotMatch(html, /id="assistant"|chatgpt\.com|perplexity\.ai|chat\.mistral\.ai/);
    for (const goal of HOME_GOALS) {
      assert.ok(html.includes(escape(goal.label[locale])));
      assert.ok(html.includes(escape(goal.result[locale])));
      assert.match(goal.id, /^[a-z0-9-]+$/);
      assert.ok(`accueil-${goal.id}`.length <= 80);
    }
    assert.doesNotMatch(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, ""), /[←-⇿⟵-⟿]/u);
    assert.doesNotMatch(html, /class="(?:phone|service-tasks|final-call|home-journal-list|onto-result)"/);
    assert.doesNotMatch(html, /assistant prépare|assistant prepares/);
  });
  for (const goal of HOME_GOALS) test(`GET objective ${locale}/${goal.id}: result, path, source and calendar agree`, () => {
    const html = render(`objectif=${goal.id}&utm_source=test&utm_custom=one&utm_custom=two`);
    assert.ok(html.includes(`value="${goal.id}" selected=""`));
    assert.ok(html.includes(`<p data-result="${goal.id}">${escape(goal.result[locale])}</p>`));
    assert.ok(html.includes(`data-path="${goal.id}"`));
    for (let p = 0; p < 3; p++) {
      const label = goal.path[2-p];
      assert.ok(GOAL_PLANES[p].nodes.some(node => node.fr === label));
      assert.ok(html.includes(`data-node="${escape(label)}" data-active="true"`));
    }
    const destination = html.match(/<div class="actions"><a [^>]*href="([^"]+)"/)[1].replaceAll("&amp;", "&");
    const url = new URL(destination, "https://parrit.ai");
    assert.equal(url.searchParams.get("source"), `accueil-${goal.id}`);
    assert.equal(url.hash, "#contact");
    assert.deepEqual(url.searchParams.getAll("utm_custom"), ["one", "two"]);
    assert.deepEqual(calendars.at(-1).bookingParams, { "metadata[source]": `accueil-${goal.id}`, utm_source: "test", utm_content: `accueil-${goal.id}` });
    assert.match(html, /<form class="goal-form"[^>]*method="get"/);
    assert.match(html, /<noscript><button[^>]*type="submit"/);
    assert.ok(html.includes(`name="objectif"`));
  });
  test(`invalid objectives ${locale} use a safe default without propagating user copy`, () => {
    for (const input of [null, "", "__proto__", "<script>", "agents&source=bad"]) assert.equal(homeGoal(input).id, "rendez-vous");
    const html = render("objectif=%3Cscript%3E&source=bad&email=secret%40example.invalid");
    assert.ok(html.includes('data-path="rendez-vous"'));
    assert.equal(calendars.at(-1).bookingParams["metadata[source]"], "accueil-rendez-vous");
    assert.equal(calendars.at(-1).bookingParams.email, undefined);
  });
  test(`booking source restores selection in new tabs and after reload ${locale}`, () => {
    for (const goal of HOME_GOALS) {
      const html = render(`source=accueil-${goal.id}&objectif=priorites`);
      assert.ok(html.includes(`value="${goal.id}" selected=""`));
      assert.equal(calendars.at(-1).bookingParams["metadata[source]"], `accueil-${goal.id}`);
    }
  });
  test(`historical anchors stay reachable ${locale} at the head of the offers section`, () => {
    const html = render();
    const offers = html.match(/<section[^>]*id="(?:offres|offers)"[\s\S]*?<\/section>/)[0];
    for (const id of ["en-production", "in-production", "services", "ce-qui-change", "what-changes"]) {
      assert.equal((html.match(new RegExp(`id="${id}"`, "g")) ?? []).length, 1, id);
      assert.ok(offers.includes(`id="${id}"`), `${id} is inside the offers section`);
    }
    assert.doesNotMatch(html, /<section[^>]*id="(?:en-production|in-production)"/);
  });
  test(`existing ontology node translations are retained ${locale}`, () => {
    const { SINGLE_PAGE_EN } = load("src/system/single-page-copy.ts");
    for (const plane of GOAL_PLANES) for (const node of plane.nodes) assert.equal(goalNodeLabel(node, locale), locale === "fr" ? node.fr : SINGLE_PAGE_EN[node.fr] ?? node.en);
  });
}

test("the three internal measures stay off the home page (15/11)", () => {
  for (const locale of ["fr", "en"]) {
    const html = renderToStaticMarkup(React.createElement(loader(locale)("src/system/components/SinglePage.tsx").SinglePage, { locale, contactQuery: "" }));
    assert.doesNotMatch(html, /29 (?:\u00e0|to) 54|16 (?:sur|of) 34|1[ ,\u00a0\u202f]355|Ce que nous avons mesur\u00e9|What we measured/);
  }
});
