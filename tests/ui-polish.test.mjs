import assert from "node:assert/strict";
import { test } from "node:test";
import { servedCss } from "./helpers/served-css.mjs";

test("served transitions always name properties", () => {
  const css = servedCss().replace(/\/\*[\s\S]*?\*\//g, "");
  // Only the original universal 1ms reset in reduced motion may omit properties.
  const reducedMotionResets = new Set(
    [...css.matchAll(/(@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{\s*\*\s*)\{\s*animation-duration:\s*1ms\s*!important;\s*transition-duration:\s*1ms\s*!important;\s*\}\s*\}/g)]
      .map((match) => match.index + match[1].length),
  );
  for (const match of css.matchAll(/\{([^{}]*)\}/g)) {
    const [, block] = match;
    for (const [, value] of block.matchAll(/(?:^|;)\s*transition(?:-property)?\s*:\s*([^;}]*)/g)) {
      assert.doesNotMatch(value, /\ball\b/, value);
      // A shorthand containing only a duration/easing also defaults to all.
      for (const part of value.split(/,(?![^()]*\))/)) {
        assert.match(part.trim(), /^(?:none|[a-z][a-z-]*\s)/, `implicit all: ${value}`);
      }
    }
    if (/\btransition-duration\s*:/.test(block) && !reducedMotionResets.has(match.index)) {
      assert.match(block, /(?:^|;)\s*transition(?:-property)?\s*:/, "duration alone implicitly transitions all properties");
    }
  }
});
