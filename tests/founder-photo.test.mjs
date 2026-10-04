import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";

// Fixture copied from the approved, read-only export manifest:
// /Users/paullarmaraud/parrit-canon-visual-system/brand/visual/sites/handoff/2026-10-05/photos/photos.manifest.json
const manifest = JSON.parse(readFileSync(new URL("./fixtures/founder-photo.json", import.meta.url), "utf8"));

test("only the four approved DSC00629 exports are shipped, byte for byte", () => {
  const directory = new URL("../public/brand/founder/", import.meta.url);
  assert.equal(Object.keys(manifest).length, 4);
  assert.deepEqual(readdirSync(directory).sort(), Object.keys(manifest).sort());
  for (const [name, expected] of Object.entries(manifest)) {
    const bytes = readFileSync(new URL(name, directory));
    assert.equal(bytes.length, expected.bytes, name);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), expected.sha256, name);
  }
});
