import assert from "node:assert/strict";
import { test } from "node:test";
import * as React from "react";
import { loader } from "./helpers/site-v1-render.mjs";

function classes(initial = []) {
  const values = new Set(initial);
  return {
    contains: value => values.has(value),
    add: (...names) => names.forEach(name => values.add(name)),
    remove: (...names) => names.forEach(name => values.delete(name)),
    toggle: (name, on) => on ? values.add(name) : values.delete(name),
  };
}
function lifecycle(component, props) {
  let start;
  const load = loader("fr", {
    react: { ...React, useRef: () => ({ current: null }), useCallback: callback => callback },
    "./RevealOnView": { useMotionOnView: (_ref, callback) => { start = callback; } },
    "./MobileCarousel": { MobileCarousel: () => null },
  });
  load(`src/system/components/${component}.tsx`)[component](props);
  assert.equal(typeof start, "function");
  return start;
}

test("service lifecycle staggers, cycles all four cases and cancels pending transitions on cleanup", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const cards = Array.from({ length: 12 }, () => {
    const cases = Array.from({ length: 4 }, () => ({ classList: classes() }));
    const dots = Array.from({ length: 4 }, () => ({ classList: classes() }));
    return { dataset: {}, classList: classes(), cases, dots, querySelectorAll: selector => selector === ".case" ? cases : dots };
  });
  const start = lifecycle("ServiceTasks", { locale: "fr" });
  const stop = start({ querySelectorAll: () => cards });
  assert.deepEqual(cards.map(card => card.dataset.case), Array.from({ length: 12 }, (_, i) => String(i % 2)));
  t.mock.timers.tick(3500);
  assert.equal(cards[0].classList.contains("blink"), true);
  assert.equal(cards[1].classList.contains("blink"), false);
  t.mock.timers.tick(120);
  assert.equal(cards[0].dataset.case, "1");
  assert.deepEqual(cards[0].cases.map(item => item.classList.contains("visually-hidden")), [true, false, true, true]);
  t.mock.timers.tick(170);
  assert.equal(cards[1].classList.contains("blink"), true);
  t.mock.timers.tick(120);
  assert.equal(cards[1].dataset.case, "2");
  // Continue in small steps to exercise scheduled transition callbacks faithfully.
  const visited = new Set(["0", "1"]);
  for (let i = 0; i < 120; i++) { t.mock.timers.tick(100); visited.add(cards[0].dataset.case); }
  assert.equal(visited.size, 4);
  stop();
  for (let i = 0; i < 300; i++) t.mock.timers.tick(100);
  for (const card of cards) {
    assert.equal(card.dataset.case, "0");
    assert.equal(card.classList.contains("blink"), false);
    assert.deepEqual(card.cases.map(item => item.classList.contains("visually-hidden")), [false, true, true, true]);
  }
  // StrictMode's setup → cleanup → setup has the same starting state.
  const stopAgain = start({ querySelectorAll: () => cards });
  assert.equal(cards[1].dataset.case, "1");
  stopAgain();
});

test("partner lifecycle delivers every offer, never opens three faces and cancels a pending fade", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const cards = Array.from({ length: 7 }, (_, i) => {
    const offers = Array.from({ length: i === 6 ? 2 : 3 }, (_, j) => ({ textContent: `Offer ${i}/${j}` }));
    const output = { textContent: "" };
    return { classList: classes(), offers, output, querySelectorAll: () => offers, querySelector: () => output };
  });
  const start = lifecycle("ServiceGrid", { items: cards.map((_, i) => [`Type ${i}`, "Description"]), offers: cards.map(card => card.offers.map(offer => offer.textContent)), label: "Team", deliveryLabel: "Deliveries" });
  const stop = start({ querySelectorAll: () => cards });
  const visited = new Set();
  for (let i = 0; i < 620; i++) {
    t.mock.timers.tick(50);
    const active = cards.filter(card => card.classList.contains("flip"));
    assert.ok(active.length <= 2);
    for (const card of active) if (!card.classList.contains("blink")) visited.add(card.output.textContent);
  }
  assert.equal(visited.size, 20);
  // There is an active offer and potentially pending per-card timeouts at cleanup.
  stop();
  const before = cards.map(card => card.output.textContent);
  for (let i = 0; i < 600; i++) t.mock.timers.tick(50);
  assert.deepEqual(cards.map(card => card.output.textContent), before);
  assert.ok(cards.every(card => !card.classList.contains("flip") && !card.classList.contains("blink")));
});
