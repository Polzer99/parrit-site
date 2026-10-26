import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { test } from "node:test";

const read = (path) => readFileSync(path, "utf8");
test("generated llms copy has no forbidden dashes or defensive labels and respects the approved Standard claims", () => {
  execFileSync(process.execPath, ["scripts/generate-llms.mjs"]);
  const text = read("public/llms.txt");
  assert.doesNotMatch(text, /[—–€]/);
  assert.match(text, /Paul Larmaraud/);
  assert.doesNotMatch(text, /offert|gratuit|\bfree\b|forfait|fixed price|sur devis|custom quote|sans engagement|no commitment|pas un abonnement|not subscribed|\b1[05][\s-]?(min|minutes|heures|hours)\b|\b30[\s-]?min|à partir de|\bHT\b|excl\. VAT/i);
  assert.doesNotMatch(text, /\b(fictif|fictive|fictional|illustrati(f|ve)|illustrées?|non interactive|pas une analyse|not an analysis)\b/i);
  assert.doesNotMatch(text, /PS-0|STD-\d|commissioned, not subscribed|not a workshop|not a sales call/i);

});
test("examination notes use the shared locale contract, without price or duration qualifiers", () => {
  const shared = read("src/system/examination.ts");
  assert.match(shared, /fr: "[^"]+"/);
  assert.match(shared, /en: "[^"]+"/);
  for (const route of ["sketch/[id]/"]) {
    const source = read(`src/app/(rev01)/${route}page.tsx`);
    assert.match(source, /EXAM_NOTE\.fr/);
    assert.match(source, /EXAM_NOTE\.en/);
    assert.doesNotMatch(source, /15 (?:min|MIN) ·/);
  }
});
test("automatic sketch mail uses the same sober framing as the site", () => {
  const source = read("src/lib/server/interets.ts");
  assert.doesNotMatch(source, /illustrati(f|ve)|pas une analyse|not an analysis/i);
  assert.match(source, /const brouillon = fr/);
  assert.equal([...source.matchAll(/\$\{sketchUrl\}/g)].length, 2);
});

test("Journal articles and descriptions publish only the house identity", () => {
  for (const file of readdirSync("content/journal").filter((name) => name.endsWith(".mdx"))) {
    assert.doesNotMatch(read(`content/journal/${file}`), /\bPaul\b|Larmaraud|fondat(eur|rice)|fondée par|founder|founded by|quinze minutes|fifteen minutes/i, file);
  }
});
