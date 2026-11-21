import assert from "node:assert/strict";
import { test } from "node:test";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { visibleText } from "../scripts/brand-os-contracts.mjs";
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
const { SERVICE_CASES } = loader("fr")("src/system/single-page-copy.ts");

for (const locale of ["fr", "en"]) test(`service lifecycle grants full reading time, staggers and cleans up (${locale})`, t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const { ServiceTasks } = loader(locale)("src/system/components/ServiceTasks.tsx");
  const html = renderToStaticMarkup(React.createElement(ServiceTasks, { locale }));
  const renderedCases = [...html.matchAll(/<div class="case(?: visually-hidden)?"[^>]*>([\s\S]*?)<\/div>/g)].map(match => visibleText(match[1]).replace(/\s+/g, " ").trim());
  assert.equal(renderedCases.length, 48);
  const cards = SERVICE_CASES.map(([, texts], cardIndex) => {
    const cases = texts.map((_, i) => ({ textContent: renderedCases[cardIndex * 4 + i], classList: classes() }));
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

