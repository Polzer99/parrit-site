import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (file) => readFileSync(file, "utf8");
const article = (slug) => read(`content/journal/${slug}.mdx`).replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
const page = (route = "") => read(`src/app/(rev01)/${route ? `${route}/` : ""}page.tsx`);

const contracts = [
  ["self-hosting-latency-cost", "We propose models on infrastructure our clients own", /We deploy models on infrastructure/],
  ["what-is-parrit-ai", "We have taken orders from large accounts, SMEs and mid-sized companies, one company at a time.", /We have built these systems|Every system we have delivered|Every system we ship|thirty-minute examination|thirty minutes with the founder|usually within a few weeks|Today that reporting assembles itself/],
  ["what-a-pilot-skips-to-look-finished", "When we can, it reads from the client's live database rather than from a copied export", /It reads from the client's live database, not/],
  ["what-you-rent-can-be-taken-back", "A system we deliver is built to run on the client's own infrastructure", /A system we deliver runs on/],
  ["glm-5-2-sovereignty", "That is the posture we apply to our own systems, and the one we propose to clients.", /posture we deploy with our clients/],
  ["publishing-without-human-review", "That is the posture we apply to our own systems, and the one we propose to clients.", /posture we deploy with our clients/],
  ["what-a-rollback-takes-with-it", "Because this is the shape of pipeline we propose to clients: one branch and one deploy for everything.", /substrate we deploy for clients|client's invoice run and their website redesign/],
];
for (const [slug, required, forbidden] of contracts) {
  test(`audit truth: ${slug} states the bounded claim`, () => {
    assert.ok(article(slug).includes(required));
    assert.doesNotMatch(article(slug), forbidden);
  });
}
test("institutional article states examination, ownership and prospective Standard", () => {
  const text = article("what-is-parrit-ai");
  for (const required of [
    "fifteen-minute examination", "fifteen minutes with the founder, then a written scope or a clear no",
    "Every system we deliver is designed to be owned this way, by the client, in full.",
    "For a consumer brand, one dossier records a reporting process commissioned to assemble itself every month.",
    "Each system we deliver from now on is checked against the Standard. STD-1.0 is not an accreditation.",
  ]) assert.ok(text.includes(required), required);
});
test("home EN/FR uses documented orders, dated information types and own-system Journal", () => {
  const source = page();
  assert.doesNotMatch(source, /cosmetics maison|restaurant network|maison de cosmétique|réseau de restauration|15 of 25 information sources|15 sources d'information sur 25/);
  for (const required of [
    "an industrial group · a law firm · a B2B energy broker · a consumer brand.",
    "un groupe industriel · un cabinet d'avocats · un courtier en énergie B2B · une marque grand public.",
    "15 of the 25 types of information we track were still held in two places (measured September 13, 2026).",
    "15 des 25 types d'information que nous suivons étaient encore tenus en double (mesuré le 13 septembre 2026).",
    "The Journal records what held and what broke on our own systems, and what we take from it for yours.",
    "Le Journal consigne ce qui a tenu et ce qui a cassé sur nos propres systèmes, et ce que nous en tirons pour les vôtres.",
  ]) assert.ok(source.includes(required), required);
});
test("dossier 26-002 keeps commissioned status and confines scope to mailbox assistant", () => {
  const source = page("dossiers");
  assert.doesNotMatch(source, /re-engaged case files|rebuild client intake|dossiers relancés|refondre l'arrivée des clients/);
  assert.match(source, /A system commissioned to handle the firm's mailbox and act as a tailored assistant/);
  assert.match(source, /Un système commandé pour traiter la boîte mail du cabinet et lui servir d'assistant sur mesure/);
  for (const status of ['"seal": "Commissioned"', '"seal": "Commandé"']) assert.ok(source.includes(status));
});
test("systems EN/FR names Lemlist transfer and removes unsupported universal human review", () => {
  const source = page("systems");
  assert.doesNotMatch(source, /Instantly|Every automatic correction has been checked|Toute correction a été validée/);
  assert.match(source, /External tool \(Lemlist\)[\s\S]*?Transfer under way/);
  assert.match(source, /Outil externe \(Lemlist\)[\s\S]*?Transfert en cours/);
});
test("new systems and autonomy promise are explicit in both languages", () => {
  assert.match(page("manufacture"), /EACH NEW SYSTEM CHECKED AGAINST THE STANDARD/);
  assert.match(page("manufacture"), /CHAQUE NOUVEAU SYSTÈME VÉRIFIÉ AU STANDARD/);
  const source = page("build-with-you");
  for (const phrase of [
    "In 10 hours with the founder, you build a system that runs, and you leave able to build the next one without us.",
    "En 10 heures avec le fondateur, vous construisez un système qui tourne, et vous repartez capable de construire le suivant sans nous.",
    "You want to leave with something that runs, built with you.",
    "Vous voulez repartir avec quelque chose qui tourne, construit avec vous.",
  ]) assert.ok(source.includes(phrase), phrase);
  assert.match(source, /<h1>\{copy.title\}<\/h1>\s*<p[^>]*>\{copy.autonomy\}<\/p>/);
});
test("legal identity and generated machine-readable claims stay consistent", () => {
  assert.doesNotMatch(page("legal"), /SASU|Walnut|340 S Lemon/);
  assert.match(page("legal"), /société par actions simplifiée \(SAS\)/);
  assert.equal(page("legal").match(/440 N Barranca Ave/g)?.length, 2);
  for (const path of ["scripts/generate-llms.mjs", "public/llms.txt"]) {
    const text = read(path);
    assert.doesNotMatch(text, /Based in Lille|SASU|certification every|Every delivered system|from the first commit/);
    for (const required of ["The Standard, six commitments Parrit.ai applies to its systems. It is not an accreditation.", "Each system delivered from now on is checked", "That is the engagement we sign, and the handover is where we check it."]) assert.ok(text.includes(required), `${path}: ${required}`);
  }
});
