import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";

// Fixture copied from the approved, read-only export manifest:
// /Users/paullarmaraud/parrit-canon-visual-system/brand/visual/sites/handoff/2026-10-05/photos-linkedin-buste/photos.manifest.json
const manifest = JSON.parse(readFileSync(new URL("./fixtures/founder-photo.json", import.meta.url), "utf8"));

test("only the four approved LinkedIn bust exports are shipped, byte for byte", () => {
  const directory = new URL("../public/brand/founder/", import.meta.url);
  assert.equal(Object.keys(manifest).length, 4);
  assert.deepEqual(readdirSync(directory).sort(), Object.keys(manifest).sort());
  for (const [name, expected] of Object.entries(manifest)) {
    const bytes = readFileSync(new URL(name, directory));
    assert.equal(bytes.length, expected.bytes, name);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), expected.sha256, name);
  }
});

test("superseded LinkedIn exports have no file or reference in src or public", () => {
  const superseded = /parrit-ai-founder-linkedin-3x4-/i;
  for (const root of ["src", "public"]) {
    const directory = new URL(`../${root}/`, import.meta.url);
    for (const name of readdirSync(directory, { recursive: true, withFileTypes: true })) {
      const path = `${name.parentPath}/${name.name}`;
      assert.doesNotMatch(path, superseded, path);
      if (name.isFile()) assert.doesNotMatch(readFileSync(path).toString("utf8"), superseded, path);
    }
  }
});

// Scan both paths and file bytes so a renamed asset/reference cannot hide in public.
test("the rejected DSC00629 photo has no file or reference in src or public", () => {
  for (const root of ["src", "public"]) {
    const directory = new URL(`../${root}/`, import.meta.url);
    for (const name of readdirSync(directory, { recursive: true, withFileTypes: true })) {
      const path = `${name.parentPath}/${name.name}`;
      assert.doesNotMatch(path, /dsc00629/i, path);
      if (name.isFile()) assert.doesNotMatch(readFileSync(path).toString("utf8"), /dsc00629/i, path);
    }
  }
});
