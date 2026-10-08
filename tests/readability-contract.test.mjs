import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the audit action and informative-text floors are explicit shared tokens", () => {
  const tokens = read("src/system/tokens.css");
  for (const declaration of ["--button-min-height: 48px", "--button-font-size: 16px", "--button-font-weight: 600", "--button-padding: 14px 24px", "--t-k: 16px"]) {
    assert.ok(tokens.includes(declaration), `Missing contract: ${declaration}`);
  }
});

test("product scene text uses Brand OS colors rather than the audit's off-palette values", () => {
  const css = read("src/system/components/ProductScene.css");
  assert.doesNotMatch(css, /rgb\(\s*(?:20[ ,]+25[ ,]+22|70[ ,]+80[ ,]+72)\s*\)/);
  assert.match(css, /--chat-ink:\s*var\(--brand-accessible-ink\)/);
  assert.match(css, /--chat-muted:\s*var\(--brand-accessible-ink2\)/);
});

test("home booking restores the canonical observer and neutral initial accent", () => {
  const header = read("src/system/components/RevHeader.tsx");
  assert.match(header, /home && heroOutside \? "exec" : "ghost"/);
  assert.match(header, /IntersectionObserver/);
  assert.match(header, /observer\.disconnect\(\)/);
  assert.match(header, /\? "cmd-panel-cta" : "cmd-panel-cta rev-button ghost"/);
  const css = read("src/app/(rev01)/rev01.css");
  assert.match(css, /\.cmdbar \.cmd-cta\.ghost\[data-home="true"\]\s*\{[^}]*color: var\(--paper\)/);
});
