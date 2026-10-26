import { homeClientViolations, homeClientReferences } from "../scripts/lib/public-clients.mjs";
import { PUBLIC_CLIENT_NAMES, publicClientName } from "../src/system/public-clients.ts";
import { sourceProse } from "../scripts/lib/certification-claims.mjs";
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
test("home EN/FR uses documented orders, dated information types and own-system Journal", () => {
  const source = page();
  assert.doesNotMatch(source, /cosmetics maison|restaurant network|maison de cosmétique|réseau de restauration|15 of 25 information sources|15 sources d'information sur 25/);
  assert.deepEqual(homeClientViolations(source), []);
  const prose = sourceProse(source, "page.tsx").map(({ text }) => text);
  const references = homeClientReferences(source);
  assert.deepEqual(references.map(({ locale }) => locale).sort(), ["en", "fr"]);
  for (const { clients, kicker } of references) {
    assert.equal(clients.length, PUBLIC_CLIENT_NAMES.length);

    assert.ok(kicker.trim());
    assert.deepEqual(clients.map(({ name }) => publicClientName(name)).sort(), [...PUBLIC_CLIENT_NAMES].sort());
    for (const { name, description } of clients) {
      assert.ok(description.trim(), name);
      if (publicClientName(name) === "SNCF") {
        assert.match(description, /Arkel/);
        assert.match(description, /formation|training/i);
        assert.doesNotMatch(description, /direct|CRM|syst[eè]m/i);
      }
      if (publicClientName(name) === "Joone") {
        assert.match(description, /accompagnement|support|helping the teams adopt AI/i);
        assert.doesNotMatch(description, /syst[eè]m/i);
      }
    }
  }
  // Dated counts and first-party evidence remain required facts, not slogans.
  for (const text of prose.filter((text) => /15.*25/.test(text))) {
    assert.match(text, /2026/);
    assert.match(text, /own|propre/);
  }
  assert.equal(prose.filter((text) => /15.*25/.test(text)).length, 0);
  assert.match(source, /id="H07"/);

});
test("dossier 26-002 keeps commissioned status and confines scope to mailbox assistant", () => {
  const source = page("dossiers");
  assert.doesNotMatch(source, /re-engaged case files|rebuild client intake|dossiers relancés|refondre l'arrivée des clients/);
  const dossiers = [...source.matchAll(/\{\s*"ref": "Dossier 26-002[^"]*"[\s\S]*?\}/g)].map(([entry]) => JSON.parse(entry));
  assert.equal(dossiers.length, 2, "mailbox dossier in both locales");
  for (const dossier of dossiers) {
    assert.match(dossier.title, /commissioned[^.]*mailbox|commandé[^.]*boîte mail/i);
    assert.match(dossier.seal, /commissioned|commandé/i);
    assert.doesNotMatch(dossier.seal, /production|operational|opérationnel/i);
  }
});
test("systems EN/FR names Lemlist transfer and removes unsupported universal human review", () => {
  const source = page("systems");
  assert.doesNotMatch(source, /Instantly|Every automatic correction has been checked|Toute correction a été validée/);
  const rows = [...source.matchAll(/\{\s*"domain": "[^"]*",\s*"source": "[^"]*Lemlist[^"]*"[\s\S]*?\}/g)].map(([row]) => JSON.parse(row));
  assert.equal(rows.length, 2, "Lemlist row in each locale");
  for (const row of rows) {
    assert.match(row.status, /(?:being|underway|in progress).*transfer|transfer.*(?:underway|in progress)|en cours.*transfert/i);
    assert.equal(row.legacyWriters, 0);
  }
});
test("new systems and autonomy promise are explicit in both languages", () => {
  assert.match(page("manufacture"), /new system[^"]*standard/i);
  assert.match(page("manufacture"), /nouveau système[^"]*standard/i);
  const source = page("build-with-you");
  const autonomy = [...source.matchAll(/autonomy: "([^"]+)"/g)].map((match) => match[1]);
  assert.equal(autonomy.length, 2);
  for (const promise of autonomy) assert.match(promise, /build[^.]*without us|construire[^.]*sans nous/i);
  assert.match(source, /<h1>\{copy.title\}<\/h1>\s*<p[^>]*>\{copy.autonomy\}<\/p>/);
});
test("legal identity and generated machine-readable claims stay consistent", () => {
  assert.doesNotMatch(page("legal"), /SASU|Walnut|340 S Lemon/);
  assert.match(page("legal"), /société par actions simplifiée \(SAS\)/);
  assert.equal(page("legal").match(/440 N Barranca Ave/g)?.length, 2);
  for (const path of ["scripts/generate-llms.mjs", "public/llms.txt"]) {
    const text = read(path);
    assert.doesNotMatch(text, /Based in Lille|SASU|certification every|Every delivered system|from the first commit/);
    for (const rule of [/no external accreditation/i, /from now on/i, /handover[^.]*check/i]) assert.match(text, rule, path);
  }
  for (const path of ["src/system/jsonld.ts", "scripts/generate-llms.mjs", "public/llms.txt"]) {
    const text = read(path);
    assert.doesNotMatch(text, /maison (?:française indépendante )?de données|data and AI firm|Données et IA/i, path);
    const definition = read("src/system/jsonld.ts").match(/description:\s*"([^"]+)"/)?.[1];
    assert.ok(definition?.trim());
    assert.ok(text.includes(definition), `${path}: canonical organization description`);

  }
});

test("FIX3 dossier titles describe the operation and home retains the French disclosure", () => {
  const source = page("dossiers");
  const titles = [...source.matchAll(/"title": "([^"]+)"/g)].map((match) => match[1]);
  assert.ok(titles.length > 0);
  assert.equal(new Set(titles).size, titles.length);
  assert.deepEqual(homeClientViolations(page()), []);
  const references = homeClientReferences(page());
  assert.equal(references.length, 2);
  for (const { clients, kicker } of references) {

    assert.ok(kicker.trim());
    for (const { name } of clients) assert.ok(publicClientName(name), name);
  }

});
