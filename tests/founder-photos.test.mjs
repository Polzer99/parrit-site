import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";

// Frozen from /Users/paullarmaraud/parrit-canon-visual-system/brand/visual/sites/handoff/2026-10-05/photos/photos.manifest.json
// Source: DSC00629.JPG, studio 08/04/2025, geometric crop only. Never regenerate photos.
const hashes = JSON.parse(readFileSync(new URL("./fixtures/founder-photos.json", import.meta.url), "utf8"));
const directory = new URL("../public/brand/founder/", import.meta.url);

test("only the four approved founder photos are shipped, byte for byte", () => {
  assert.equal(Object.keys(hashes).length, 4);
  assert.deepEqual(readdirSync(directory).sort(), Object.keys(hashes).sort());
  for (const [file, expected] of Object.entries(hashes)) {
    const actual = createHash("sha256").update(readFileSync(new URL(file, directory))).digest("hex");
    assert.equal(actual, expected, file);
  }
});
