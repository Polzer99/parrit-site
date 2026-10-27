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

const { readingMs } = loader("fr")("src/system/reading.ts");
const { SERVICE_CASES, PARTNER_OFFERS, SINGLE_PAGE_EN } = loader("fr")("src/system/single-page-copy.ts");

for (const locale of ["fr", "en"]) test(`service lifecycle grants full reading time, staggers and cleans up (${locale})`, t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const translate = text => locale === "fr" ? text : SINGLE_PAGE_EN[text];
  const cards = SERVICE_CASES.map(([, texts]) => {
    const cases = texts.map((text, i) => ({ textContent: `${translate(text)} ${translate(i % 2 ? "Nouveau" : "Back-office")}`, classList: classes() }));
    const dots = cases.map(() => ({ classList: classes() }));
    return { dataset: {}, classList: classes(), cases, dots, querySelectorAll: selector => selector === ".case" ? cases : dots };
  });
  const start = lifecycle("ServiceTasks", { locale });
  const stop = start({ querySelectorAll: () => cards });
  assert.deepEqual(cards.map(card => card.dataset.case), cards.map((_, i) => String(i % 2)));
  const shownAt = cards.map(() => 0), firstChange = [], visited = cards.map((card) => new Set([card.dataset.case]));
  const lastCase = cards.map(card => card.dataset.case), wasBlinking = cards.map(() => false);
  const limit = Math.max(...cards.map(card => card.cases.reduce((sum, c) => sum + readingMs(c.textContent) + 240, 0))) * 2 + 4000;
  for (let now = 10; now <= limit; now += 10) {
    t.mock.timers.tick(10);
    cards.forEach((card, i) => {
      const blinking = card.classList.contains("blink");
      if (blinking && !wasBlinking[i]) {
        assert.ok(now - shownAt[i] >= readingMs(card.cases[Number(lastCase[i])].textContent), `short reading time: ${locale} service ${i}`);
        firstChange[i] ??= now;
      }
      if (card.dataset.case !== lastCase[i]) {
        shownAt[i] = now + 120; // The fade-in must finish before reading time starts.
        lastCase[i] = card.dataset.case;
        visited[i].add(card.dataset.case);
      }
      wasBlinking[i] = blinking;
    });
  }
  cards.forEach((card, i) => {
    assert.equal(visited[i].size, 4);
    assert.equal(firstChange[i], readingMs(card.cases[i % 2].textContent) + i * 290);
  });
  stop();
  for (let i = 0; i < 3000; i++) t.mock.timers.tick(10);
  for (const card of cards) {
    assert.equal(card.dataset.case, "0");
    assert.equal(card.classList.contains("blink"), false);
    assert.deepEqual(card.cases.map(item => item.classList.contains("visually-hidden")), [false, true, true, true]);
  }
  const stopAgain = start({ querySelectorAll: () => cards });
  assert.equal(cards[1].dataset.case, "1");
  stopAgain();
});

for (const locale of ["fr", "en"]) test(`partner lifecycle delivers every offer for its reading time, at most two faces, and cleans up (${locale})`, t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const translate = text => locale === "fr" ? text : SINGLE_PAGE_EN[text];
  const cards = PARTNER_OFFERS.map((texts, i) => {
    const offers = texts.map(text => ({ textContent: translate(text) }));
    const output = { textContent: "" };
    const front = [{ textContent: `Type ${i}` }, { textContent: "A deliberately long description that must remain visible before the first delivery" }];
    return { classList: classes(), offers, output, front, querySelectorAll: selector => selector === ".partner-offers li" ? offers : front, querySelector: () => output };
  });
  const start = lifecycle("ServiceGrid", { items: cards.map((card) => card.front.map(node => node.textContent)), offers: cards.map(card => card.offers.map(offer => offer.textContent)), label: "Team", deliveryLabel: "Deliveries" });
  const stop = start({ querySelectorAll: () => cards });
  const visited = new Set(), previous = cards.map(() => null), shownAt = cards.map(() => 0), fading = cards.map(() => false);
  const firstStarts = [], lastStarts = [];
  for (let now = 10; now <= 160000; now += 10) {
    t.mock.timers.tick(10);
    const active = cards.filter(card => card.classList.contains("flip"));
    assert.ok(active.length <= 2);
    cards.forEach((card, i) => {
      const opened = card.classList.contains("flip"), blink = card.classList.contains("blink");
      if (previous[i] && !fading[i] && (blink || !opened)) {
        assert.ok(now - shownAt[i] >= readingMs(previous[i]), `offer truncated: ${previous[i]}`);
      }
      if (opened && !blink && (!previous[i] || card.output.textContent !== previous[i])) {
        shownAt[i] = now + (previous[i] ? 150 : 0);
        if (!previous[i]) { firstStarts[i] ??= now; lastStarts[i] = now; }
        previous[i] = card.output.textContent;
        visited.add(`${i}/${card.output.textContent}`);
      }
      if (!opened) previous[i] = null;
      fading[i] = blink;
    });
  }
  assert.equal(visited.size, 23);
  assert.equal(firstStarts[0], readingMs(cards[0].front.map(node => node.textContent).join(" ")));
  assert.ok(firstStarts.every((start, i) => i === 0 || start > firstStarts[i - 1]));
  assert.ok(lastStarts.every((start, i) => start > firstStarts[i]), "every card starts a second full cycle");
  // Stop in a pending fade, then verify no stale timeout mutates the output.
  for (let i = 0; i < 2000 && !cards.some(card => card.classList.contains("blink")); i++) t.mock.timers.tick(10);
  assert.ok(cards.some(card => card.classList.contains("blink")));
  stop();
  const before = cards.map(card => card.output.textContent);
  for (let i = 0; i < 3000; i++) t.mock.timers.tick(10);
  assert.deepEqual(cards.map(card => card.output.textContent), before);
  assert.ok(cards.every(card => !card.classList.contains("flip") && !card.classList.contains("blink")));
});
