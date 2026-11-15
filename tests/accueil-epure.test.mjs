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
  test(`complete initial HTML ${locale}: 17 objectives, results, 48 nodes, flows, measures and assistants`, () => {
    const html = render();
    assert.equal(HOME_GOALS.length, 17);
    assert.equal(new Set(HOME_GOALS.map(goal => goal.id)).size, 17);
    assert.deepEqual(GOAL_PLANES.map(plane => plane.nodes.length), [16, 16, 16]);
    // 17 objectives in the hero, plus the three tasks of the calculator (15/11).
    assert.equal((html.match(/<option\b/g) ?? []).length, 20);
    assert.equal((html.match(/<optgroup\b/g) ?? []).length, 3);
    assert.equal((html.match(/data-node=/g) ?? []).length, 48);
    // Every node keeps one label, shown or hidden: three active nodes and their three labels, counted apart.
    assert.equal((html.match(/<rect\b[^>]*\bdata-active="true"/g) ?? []).length, 3);
    assert.equal((html.match(/class="goal-node-label"[^>]*\bdata-active="true"/g) ?? []).length, 3);
    assert.equal((html.match(/data-active="true"/g) ?? []).length, 6);
    assert.equal((html.match(/class="goal-node-label"/g) ?? []).length, 48);
    // Décision de Paul du 15/11/2026 : calculateur à la place des moteurs et des trois mesures internes.
    assert.equal((html.match(/class="goal-flow"/g) ?? []).length, 0);
    assert.equal((html.match(/class="home-measure"/g) ?? []).length, 0);
    assert.equal((html.match(/class="calc-card"/g) ?? []).length, 2);
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
  test(`calculator ${locale}: SSR defaults, attributed booking, no promise`, () => {
    const html = render("utm_source=kept");
    const section = html.match(/<section[^>]*id="(?:en-production|in-production)"[\s\S]*?<\/section>/)[0];
    const fr = locale === "fr";
    const s = "[\\s\\u00a0\\u202f]";
    assert.match(section, fr ? new RegExp(`9${s}000${s}€`) : /€9,000/, "growth default: 20 × 15 % × 3 000");
    assert.ok(section.includes(">17 h<"), "time default: 40 × 6 min × 52 / 12 / 60");
    assert.match(section, fr ? new RegExp(`680${s}€`) : /€680/, "17 h × 40 €/h, computed on the displayed hours");
    assert.equal((section.match(/<label\b/g) ?? []).length, 7);
    assert.equal((section.match(/aria-live="polite"/g) ?? []).length, 2);
    assert.doesNotMatch(section, /gagnerez|économis|you will save|\bsave up to\b|[−-]\s?\d+\s?%/i);
    const href = section.match(/<a class="btn rev-button exec" href="([^"]+)"/)[1].replaceAll("&amp;", "&");
    const url = new URL(href, "https://parrit.ai");
    assert.equal(url.searchParams.get("source"), "accueil-calculateur");
    assert.equal(url.searchParams.get("utm_source"), "kept");
    assert.equal(url.hash, "#contact");
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

test("calculator arithmetic: defaults, rounding and invalid input fall back to zero", () => {
  const { quotesAtStake, taskCost, inputNumber, formatHours, formatEuros, TIME_TASKS, QUOTE_DEFAULTS, HOURLY_COST_DEFAULT } = loader("fr")("src/system/home-calculator.ts");
  assert.equal(quotesAtStake(QUOTE_DEFAULTS.quotes, QUOTE_DEFAULTS.signedShare, QUOTE_DEFAULTS.amount), 9000);
  // Cost on the displayed hours: the visitor can check the math (17 h × 40 € = 680 €).
  assert.deepEqual(taskCost(TIME_TASKS[0].perWeek, TIME_TASKS[0].minutes, HOURLY_COST_DEFAULT), { hours: 17, cost: 680 });
  assert.deepEqual(taskCost(TIME_TASKS[1].perWeek, TIME_TASKS[1].minutes, HOURLY_COST_DEFAULT), { hours: 7, cost: 280 });
  assert.deepEqual(taskCost(TIME_TASKS[2].perWeek, TIME_TASKS[2].minutes, HOURLY_COST_DEFAULT), { hours: 11, cost: 440 });
  // A small real task never reads « 0 h, 0 € » : one decimal under one hour (0,36 h → 0,4 h × 40 € = 16 €).
  assert.deepEqual(taskCost(1, 5, 40), { hours: 0.4, cost: 16 });
  assert.equal(formatHours(0.4, "fr"), "0,4 h");
  assert.equal(formatHours(17, "en"), "17 h");
  for (const bad of ["", "-3", "abc", "Infinity", null, undefined, Number.NaN]) assert.equal(inputNumber(bad), 0);
  assert.equal(inputNumber("2,5"), 2.5);
  // Thousands separators: plain space, no-break space (U+00A0), narrow no-break space (U+202F).
  for (const space of [" ", String.fromCharCode(0xa0), String.fromCharCode(0x202f)]) assert.equal(inputNumber(`3${space}000`), 3000);
  assert.match(formatEuros(1234567, "fr"), /^1[\s  ]234[\s  ]567[\s  ]€$/);
  assert.equal(formatEuros(1234567, "en"), "€1,234,567");
  assert.equal(quotesAtStake(10, 250, 100), 1000, "share is capped at 100 %");
  assert.deepEqual(taskCost("", "6", "40"), { hours: 0, cost: 0 });
});

test("the three internal measures stay off the home page (15/11)", () => {
  for (const locale of ["fr", "en"]) {
    const html = renderToStaticMarkup(React.createElement(loader(locale)("src/system/components/SinglePage.tsx").SinglePage, { locale, contactQuery: "" }));
    assert.doesNotMatch(html, /29 (?:\u00e0|to) 54|16 (?:sur|of) 34|1[ ,\u00a0\u202f]355|Ce que nous avons mesur\u00e9|What we measured/);
  }
});
