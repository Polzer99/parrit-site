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
