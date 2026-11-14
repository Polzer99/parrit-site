import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
  test(`complete initial HTML ${locale}: 17 objectives, results, 48 nodes, flows, measures and assistants`, () => {
    const html = render();
    assert.equal(HOME_GOALS.length, 17);
    assert.equal(new Set(HOME_GOALS.map(goal => goal.id)).size, 17);
    assert.deepEqual(GOAL_PLANES.map(plane => plane.nodes.length), [16, 16, 16]);
    assert.equal((html.match(/<option\b/g) ?? []).length, 17);
    assert.equal((html.match(/<optgroup\b/g) ?? []).length, 3);
    assert.equal((html.match(/data-node=/g) ?? []).length, 48);
    // Three active nodes plus their three labels: every node keeps one label, shown or hidden.
    assert.equal((html.match(/data-active="true"/g) ?? []).length, 6);
    assert.equal((html.match(/class="goal-node-label"/g) ?? []).length, 48);
    assert.equal((html.match(/class="goal-flow"/g) ?? []).length, 9);
    assert.equal((html.match(/class="home-measure"/g) ?? []).length, 3);
    assert.equal((html.match(/target="_blank" rel="noopener"/g) ?? []).length, 4);
    for (const goal of HOME_GOALS) {
      assert.ok(html.includes(escape(goal.label[locale])));
      assert.ok(html.includes(escape(goal.result[locale])));
      assert.match(goal.id, /^[a-z0-9-]+$/);
      assert.ok(`accueil-${goal.id}`.length <= 80);
    }
    assert.doesNotMatch(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, ""), /[←-⇿⟵-⟿]/u);
    assert.doesNotMatch(html, /class="(?:phone|service-tasks|final-call|home-journal-list|onto-result)"/);
    assert.equal((html.match(/L&#x27;assistant prépare\. Vous validez\./g) ?? []).length, locale === "fr" ? 1 : 0);
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
    assert.deepEqual(calendars.at(-1).bookingParams, { "metadata[source]": `accueil-${goal.id}`, utm_source: "test", utm_custom: ["one", "two"] });
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
  test(`motor GET destinations clear stale attribution ${locale}`, () => {
    const html = render("source=accueil-agents&utm_source=kept");
    const links = [...html.matchAll(/class="goal-flow"[^>]*data-goal="([^"]+)" href="([^"]+)"/g)];
    assert.equal(links.length, 9);
    for (const [, id, href] of links) {
      const url = new URL(href.replaceAll("&amp;", "&"), "https://parrit.ai");
      assert.equal(url.searchParams.get("objectif"), id);
      assert.equal(url.searchParams.has("source"), false);
      assert.equal(url.searchParams.get("utm_source"), "kept");
      assert.ok(render(url.search.slice(1)).includes(`value="${id}" selected=""`));
    }
  });
  test(`assistant prompts ${locale} contain no visitor data and safe new-tab attributes`, () => {
    const html = render("objectif=contrats&utm_source=private&email=secret%40example.invalid");
    const links = [...html.matchAll(/href="([^"]+)" target="_blank" rel="noopener"/g)];
    assert.equal(links.length, 4);
    for (const [, href] of links) {
      const url = new URL(href.replaceAll("&amp;", "&"));
      const prompt = url.searchParams.get("q");
      assert.ok(prompt.includes("Parrit.ai (https://parrit.ai)"));
      assert.doesNotMatch(prompt, /private|secret|contrats|Paul|Larmaraud/);
      assert.equal(url.protocol, "https:");
    }
  });
  test(`existing ontology node translations are retained ${locale}`, () => {
    const { SINGLE_PAGE_EN } = load("src/system/single-page-copy.ts");
    for (const plane of GOAL_PLANES) for (const node of plane.nodes) assert.equal(goalNodeLabel(node, locale), locale === "fr" ? node.fr : SINGLE_PAGE_EN[node.fr] ?? node.en);
  });
}

test("measure values and dates have primary evidence in the prescribed French article", () => {
  const load = loader("fr");
  const { HOME_MEASURES } = load("src/system/components/HomeEvidence.tsx");
  const numbers = text => (text.match(/\d+(?:[ ,\u00a0\u202f]\d{3})*(?:[.,]\d+)?/g) ?? [])
    .map(number => number.replace(/[ ,\u00a0\u202f]/g, ""));
  for (const measure of HOME_MEASURES) {
    const article = readFileSync(`content/journal/fr/${measure.slug}.mdx`, "utf8");
    assert.ok(typeof measure.evidence === "string" && measure.evidence.trim().length > 0);
    assert.ok(article.includes(measure.evidence), `${measure.slug}: evidence must occur verbatim`);
    const evidenceNumbers = numbers(measure.evidence);
    for (const locale of ["fr", "en"]) {
      const displayedNumbers = numbers(measure.value[locale]);
      assert.ok(displayedNumbers.length > 0);
      for (const number of displayedNumbers) {
        assert.ok(evidenceNumbers.includes(number), `${measure.slug}/${locale}: ${number} must occur in evidence`);
      }
    }
    assert.ok(article.includes(`date: "${measure.date}"`));
  }
  assert.doesNotMatch(readFileSync("content/journal/fr/computer-use-what-it-can-undo.mdx", "utf8"), /97\s*%/);
  assert.equal(HOME_MEASURES.some(item => item.slug === "computer-use-what-it-can-undo"), false);
});
