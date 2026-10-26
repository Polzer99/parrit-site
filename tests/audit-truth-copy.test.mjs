import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (file) => readFileSync(file, "utf8");
const article = (slug) => read(`content/journal/${slug}.mdx`).replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
const page = (route = "") => read(`src/app/(rev01)/${route ? `${route}/` : ""}page.tsx`);

const contracts = [
  ["self-hosting-latency-cost", /propos[^.]*infrastructure[^.]*own/i, /We deploy models on infrastructure/],
  ["what-is-parrit-ai", /orders[^.]*SMEs/i, /We have built these systems|Every system we have delivered|Every system we ship|thirty-minute examination|thirty minutes with the founder|usually within a few weeks|Today that reporting assembles itself/],
  ["what-a-pilot-skips-to-look-finished", /when we can[^.]*database/i, /It reads from the client's live database, not/],
  ["what-you-rent-can-be-taken-back", /built to run[^.]*infrastructure/i, /A system we deliver runs on/],
  ["glm-5-2-sovereignty", /own systems[^.]*propose/i, /posture we deploy with our clients/],
  ["publishing-without-human-review", /own systems[^.]*propose/i, /posture we deploy with our clients/],
  ["what-a-rollback-takes-with-it", /pipeline[^.]*propose/i, /substrate we deploy for clients|client's invoice run and their website redesign/],
];
for (const [slug, required, forbidden] of contracts) {
  test(`audit truth: ${slug} states the bounded claim`, () => {
    assert.match(article(slug), required);
    assert.doesNotMatch(article(slug), forbidden);
  });
}
test("institutional article states examination, ownership and prospective Standard", () => {
  const text = article("what-is-parrit-ai");
  for (const rule of [/video call[^.]*Parrit\.ai/i, /written scope/i, /designed to be owned/i,
    /reporting[^.]*commissioned/i, /from now on[^.]*Standard/i, /not an accreditation/i]) assert.match(text, rule);

});
test("legal identity remains accurate", () => {
  assert.doesNotMatch(page("legal"), /SASU|Walnut|340 S Lemon/);
  assert.match(page("legal"), /société par actions simplifiée \(SAS\)/);
  assert.equal(page("legal").match(/440 N Barranca Ave/g)?.length, 2);
});
