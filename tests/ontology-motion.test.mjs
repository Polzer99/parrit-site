import assert from "node:assert/strict";
import { test } from "node:test";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loader } from "./helpers/site-v1-render.mjs";

for (const locale of ["fr", "en"]) test(`four stories light their exact nodes and links; one timer, cleanup and restart (${locale})`, context => {
  let state = { story: 0, step: 4 };
  let start;
  let serial = 0;
  const timers = new Map();
  context.mock.method(globalThis, "setTimeout", (callback, delay) => {
    const id = ++serial;
    timers.set(id, { callback, delay });
    assert.equal(timers.size, 1, "at most one active hero timer");
    return id;
  });
  context.mock.method(globalThis, "clearTimeout", id => timers.delete(id));
  const load = loader(locale, {
    react: { ...React, useState: () => [state, value => { state = value; }], useRef: () => ({ current: null }), useCallback: callback => callback },
    "./RevealOnView": { useMotionOnView: (_ref, callback) => { start = callback; } },
  });
  const { OntologyHero } = load("src/system/components/OntologyHero.tsx");
  const { HERO_STORIES } = load("src/system/ontology-hero-data.ts");
  const { SINGLE_PAGE_EN } = load("src/system/single-page-copy.ts");
  const render = () => renderToStaticMarkup(React.createElement(OntologyHero, { locale }, ""));
  const advance = delay => {
    assert.equal(timers.size, 1);
    const [id, timer] = [...timers][0];
    assert.equal(timer.delay, delay);
    timers.delete(id);
    timer.callback();
  };
  const staticHTML = render();
  assert.equal(timers.size, 0, "SSR/reduced state never starts a timer");
  const stop = start();
  for (let index = 0; index < 4; index++) {
    const story = HERO_STORIES[index];
    for (let step = 0; step <= 4; step++) {
      assert.deepEqual(state, { story: index, step });
      const html = render();
      const nodes = [...html.matchAll(/data-node="([^\"]+)"[^>]*class="onto-node is-lit/g)].map(m => m[1]).sort();
      const expected = [...(step >= 1 ? [story.d, story.o1] : []), ...(step >= 2 ? [story.o2] : []), ...(step >= 3 ? [story.r, story.out] : []), ...(step >= 4 ? [story.act] : [])].sort();
      assert.deepEqual(nodes, expected);
      const links = [...html.matchAll(/data-link="([^\"]+)" class="onto-link is-lit/g)].map(m => m[1]).sort();
      assert.deepEqual(links, [...(step >= 1 ? [`up_${story.d}_${story.o1}`] : []), ...(step >= 2 ? [story.rel] : []), ...(step >= 3 ? [story.rl, story.top] : []), ...(step >= 4 ? [story.al] : [])].sort());
      assert.equal((html.match(/class="onto-badge onto-number is-visible"/g) ?? []).length, step);
      const caption = html.split('class="ontocap"')[1].split('class="ontocap-sizer"')[0];
      assert.ok(caption.includes(locale === "fr" ? story.title.replaceAll("'", "&#x27;") : SINGLE_PAGE_EN[story.title]));
      assert.equal(caption.includes('class="onto-result is-visible"'), step >= 3);
      assert.equal(caption.includes('class="onto-approval is-visible"'), step >= 4);
      advance(step === 0 && index > 0 ? 900 : step === 4 ? 3600 : 2700);
    }
  }
  assert.deepEqual(state, { story: 0, step: 0 }, "loop returns to first story");
  const pendingCallback = [...timers.values()][0].callback;
  stop();
  assert.equal(timers.size, 0);
  assert.equal(render(), staticHTML, "cleanup restores complete static HTML");
  pendingCallback();
  assert.equal(timers.size, 0, "late callback cannot restart a stopped loop");
  assert.equal(render(), staticHTML);
  const stopAgain = start();
  assert.deepEqual(state, { story: 0, step: 0 });
  advance(2700);
  assert.deepEqual(state, { story: 0, step: 1 });
  stopAgain();
  assert.equal(timers.size, 0);
  assert.equal(render(), staticHTML);
});
