import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { test } from "node:test";

const read = (path) => readFileSync(path, "utf8");
test("generated llms copy has no forbidden dashes or defensive labels and mirrors the Standard", () => {
  execFileSync(process.execPath, ["scripts/generate-llms.mjs"]);
  const text = read("public/llms.txt");
  assert.doesNotMatch(text, /[—–]/);
  assert.doesNotMatch(text, /\b(fictif|fictive|fictional|illustrati(f|ve)|illustrées?|non interactive|pas une analyse|not an analysis)\b/i);
  assert.doesNotMatch(text, /PS-0|STD-\d|commissioned, not subscribed|not a workshop|not a sales call/i);
  const standard = read("src/app/(rev01)/standard/page.tsx").split('  "fr":')[0];
  const statements = [...standard.matchAll(/"0[1-6]",\s*"([^"]+)"/g)].map((match) => match[1]);
  assert.equal(statements.length, 6);
  for (const statement of statements) assert.ok(text.includes(statement), statement);
});
test("examination notes use the shared locale contract, retaining the free BWY qualifier", () => {
  const shared = read("src/system/examination.ts");
  assert.ok(shared.includes("15 min · En visio, avec le fondateur"));
  assert.ok(shared.includes("15 min · Video call with the founder"));
  for (const route of ["", "standard/", "manufacture/", "dossiers/", "build-with-you/", "sketch/[id]/"]) {
    const source = read(`src/app/(rev01)/${route}page.tsx`);
    assert.match(source, /EXAM_NOTE\.fr/);
    assert.match(source, /EXAM_NOTE\.en/);
    assert.doesNotMatch(source, /15 (?:min|MIN) ·/);
  }
  assert.match(read("src/app/(rev01)/build-with-you/page.tsx"), /Examen offert · \$\{EXAM_NOTE.fr\}/);
});
test("automatic sketch mail uses the same sober framing as the site", () => {
  const source = read("src/lib/server/interets.ts");
  assert.doesNotMatch(source, /illustrati(f|ve)|pas une analyse|not an analysis/i);
  assert.ok(source.includes("Voici une esquisse qui part d'un cas proche de votre besoin"));
  assert.ok(source.includes("Here is a sketch starting from a case close to your need"));
});
