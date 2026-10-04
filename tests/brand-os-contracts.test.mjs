import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { checkOrigin, checkForbidden, checkGlyphs, prerenderedPages, sha256, visibleText } from "../scripts/brand-os-contracts.mjs";

const root = path.resolve(import.meta.dirname, "..");
const json = (name) => JSON.parse(readFileSync(path.join(root, `src/system/brand-os.${name}.json`), "utf8"));

test("vendor files and every canonical font match the exported SHA-256", () => {
  assert.deepEqual(checkOrigin(root, json("origin")), []);
});
test("forbidden assets are absent from sources, public files and built HTML", () => {
  assert.deepEqual(checkForbidden(root, json("forbidden-assets"), prerenderedPages(root)), []);
});
test("all prerendered text uses supported glyphs and no font arrows", () => {
  const errors = prerenderedPages(root).flatMap((file) => checkGlyphs(readFileSync(file, "utf8"), path.relative(root, file), json("glyphs"), json("connectors")));
  assert.deepEqual(errors, []);
});

test("contracts reject tampered vendor bytes, renamed banned binaries, filenames and references", () => {
  const fixture = mkdtempSync(path.join(tmpdir(), "brand-os-contracts-"));
  const write = (file, value) => writeFileSync(path.join(fixture, file), value);
  try {
    for (const directory of ["src/system", "public/fonts", "content", ".next/server/app"]) mkdirSync(path.join(fixture, directory), { recursive: true });
    write("next.config.ts", "export default {}");
    write("src/system/brand-os.tokens.css", "canon");
    write("public/fonts/font.woff2", "font");
    const origin = { files: { "brand-os.tokens.css": sha256("canon") }, canon_fonts: { "font.woff2": sha256("font") } };
    assert.deepEqual(checkOrigin(fixture, origin), []);
    write("src/system/brand-os.tokens.css", "edited");
    assert.match(checkOrigin(fixture, origin).join("\n"), /édité à la main/);
    write("public/fonts/font.woff2", "edited");
    assert.match(checkOrigin(fixture, origin).join("\n"), /Police canonique modifiée/);
    rmSync(path.join(fixture, "public/fonts/font.woff2"));
    assert.match(checkOrigin(fixture, origin).join("\n"), /Police canonique absente/);
    const contract = { patterns: ["rejected-crop"], rejected: [{ id: "rejected-id", file: "portrait.jpg" }], sha256: [sha256("banned binary")] };
    write("src/system/brand-os.forbidden-assets.json", JSON.stringify(contract));
    assert.deepEqual(checkForbidden(fixture, contract, []), []);
    for (const [file, value, expected] of [
      ["public/renamed.jpg", "banned binary", /Empreinte/],
      ["public/portrait.jpg", "different binary", /portrait.jpg/],
      ["content/article.mdx", "![photo](/rejected-crop.png)", /rejected-crop/],
      ["src/component.tsx", 'const image = "PORTRAIT.JPG"', /portrait.jpg/],
      [".next/server/app/index.html", '<img src="/portrait.jpg">', /portrait.jpg/],
    ]) {
      write(file, value);
      assert.match(checkForbidden(fixture, contract, file.endsWith(".html") ? [path.join(fixture, file)] : []).join("\n"), expected);
      rmSync(path.join(fixture, file));
    }
    assert.throws(() => prerenderedPages(fixture), /run npm run build/);
    rmSync(path.join(fixture, ".next"), { recursive: true });
    assert.throws(() => prerenderedPages(fixture), /Required scan directory missing/);
  } finally { rmSync(fixture, { recursive: true, force: true }); }
});

test("glyph scan decodes named/numeric entities and excludes markup, scripts and styles", () => {
  const glyphs = json("glyphs");
  const connectors = json("connectors");
  assert.equal(visibleText('<p title="a > →">A &amp; B</p>'), " A & B ");
  assert.deepEqual(checkGlyphs('<script>"→😀"</script><style>/* → */</style><!-- → --><p title="→">Bonjour é €</p>', "ok.html", glyphs, connectors), []);
  for (const arrow of ["→", "&#8594;", "&#x2192;", "&rarr;", "&RightArrow;", "↓"]) {
    assert.match(checkGlyphs(`<p>${arrow}</p>`, "route.html", glyphs, connectors).join("\n"), /U\+219[23].*route.html/);
  }
  assert.match(checkGlyphs("😀", "emoji.html", glyphs, connectors).join("\n"), /U\+1F600.*emoji.html/);
  assert.deepEqual(checkGlyphs("\u200b\u202f", "spaces.html", glyphs, connectors), []);
});
