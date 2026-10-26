// Site V1 replaces the six-card catalogue with three entry points and Harness.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { renderPage, loader } from "./helpers/site-v1-render.mjs";
import { visibleText } from "../scripts/brand-os-contracts.mjs";
const read = file => readFileSync(file, "utf8");
for (const locale of ["fr", "en"]) test(`three entry points and Harness render in the specified order (${locale})`, async () => {
  const html = await renderPage(locale);
  assert.deepEqual([...html.matchAll(/<section\b[^>]*id="(H\d+)"/g)].map(m => m[1]), ["H01", "H02", "H03", "H04", "H05", "H06", "H07", "H11", "H12"]);
  const localize = loader(locale)("src/system/locale.ts").localizedPath;
  for (const path of ["/consulting-transformation", "/ai-sprints", "/engineering-integration", "/harness-engineering", "/commission", "/dossiers"]) assert.ok(html.includes(`href="${localize(path, locale)}"`), path);
  assert.doesNotMatch(visibleText(html), /Content Factor|usines? de contenu|FormIA|Qualiopi|\bMIT\b|[—–]/i);
  assert.equal((html.match(/class="v1-case"/g) ?? []).length, 3);
  assert.ok(html.includes(locale === "fr" ? "Démonstration, données fictives." : "Demonstration in French, fictional data."));
  assert.equal((html.match(/<img\b/g) ?? []).length, 3);
  for (const [, src] of html.matchAll(/<img[^>]*src="([^"]+)"/g)) assert.match(src, /^\/brand\/scenes\/scene-carte-visite-(photo|fiche-crm)\.png$/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
});
test("machine-readable positioning matches the organization", () => {
  const definition = read("src/system/jsonld.ts").match(/description:\s*"([^"]+)"/)[1];
  assert.ok(read("public/llms.txt").includes(definition));
});
test("offer guards still reject pricing", () => {
  for (const file of ["tests/brand-os-render.test.mjs", "tests/anti-slop-copy.spec.ts"]) {
    const expression = read(file).match(/\/offert\|([^\n]+?)\/i/);
    assert.ok(expression, file);
    const guard = new RegExp("offert|" + expression[1], "i");
    for (const price of ["à partir de 500 euros", "à partir de cinq cents euros", "à partir de vos opérations : forfait 500 euros", "fixed price", "sur devis"]) assert.match(price, guard, file);
  }
});
