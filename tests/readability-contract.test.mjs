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

test("booking action stays outlined with or without JavaScript and scroll observers", () => {
  const header = read("src/system/components/RevHeader.tsx");
  assert.match(header, /className="cmd-cta rev-button ghost"/);
  assert.match(header, /className="cmd-panel-cta rev-button ghost"/);
  assert.doesNotMatch(header, /IntersectionObserver/);
});
