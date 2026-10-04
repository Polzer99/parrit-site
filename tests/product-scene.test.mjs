import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import sharp from "sharp";

// Approved read-only manifest:
// /Users/paullarmaraud/parrit-canon-visual-system/brand/visual/sites/handoff/2026-10-04/scene-agent-crm/manifest.json
const manifest = JSON.parse(readFileSync(new URL("./fixtures/product-scene.json", import.meta.url), "utf8"));
for (const [file, expected] of Object.entries(manifest).filter(([file]) => file.endsWith(".png"))) {
  test(`scene source is byte-identical: ${file}`, async () => {
    const bytes = readFileSync(new URL(`../public/brand/scenes/${file}`, import.meta.url));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), expected.sha256);
    assert.equal(bytes.length, expected.bytes);
    const metadata = await sharp(bytes).metadata();
    assert.deepEqual([metadata.width, metadata.height], expected.size);
  });
  test(`scene derivatives preserve aspect ratio and alpha: ${file}`, async () => {
    const widths = file.includes("messagerie") ? [480, 960] : [430, 860];
    for (const width of widths) for (const format of ["avif", "webp"]) {
      const bytes = readFileSync(new URL(`../public/brand/scenes/${file.replace(".png", `-${width}.${format}`)}`, import.meta.url));
      const metadata = await sharp(bytes).metadata();
      assert.equal(metadata.width, width);
      assert.equal(metadata.height, Math.round(expected.size[1] * width / expected.size[0]));
      assert.equal(metadata.hasAlpha, true);
      assert.ok(bytes.length < expected.bytes, "responsive file is lighter than PNG");
    }
  });
}
