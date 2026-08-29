import assert from "node:assert/strict";
import test from "node:test";

import { gateNoms, gateRepetition, gateSlug } from "../scripts/journal-gates.mjs";

test("gateSlug refuse un slug daté", () => {
  const result = gateSlug("infrastructure-ia-2026-08-29");

  assert.equal(result.ok, false);
  assert.match(result.motif, /date/i);
});

test("gateSlug refuse le préfixe journal-", () => {
  const result = gateSlug("journal-modeles-souverains");

  assert.equal(result.ok, false);
  assert.match(result.motif, /journal-/i);
});

test("gateSlug accepte un slug sain", () => {
  assert.deepEqual(gateSlug("modeles-souverains-en-production"), { ok: true });
});

test("gateNoms refuse un nom client sans tenir compte de la casse", () => {
  const result = gateNoms("---\ntitle: naval group déploie un système\n---");

  assert.equal(result.ok, false);
  assert.match(result.motif, /Naval Group/);
});

test("gateNoms ne déclenche pas sur une sous-chaîne", () => {
  assert.deepEqual(gateNoms("Clevernesse is not a client name."), { ok: true });
});

test("gateRepetition refuse une similarité Jaccard exactement égale à 0.6", () => {
  const result = gateRepetition(
    "deploy model safely today",
    "A distinct description",
    [
      {
        slug: "deployer-systeme-ia",
        title: "deploy model safely tomorrow",
        description: "Another summary",
      },
    ],
  );

  assert.equal(result.ok, false);
  assert.match(result.motif, /deployer-systeme-ia/);
});

test("gateRepetition compare aussi les descriptions", () => {
  const result = gateRepetition("A unique title", "models route work by risk", [
    {
      slug: "routage-par-risque",
      title: "A disjoint heading",
      description: "models route work by cost",
    },
  ]);

  assert.equal(result.ok, false);
  assert.match(result.motif, /routage-par-risque/);
});

test("gateRepetition accepte des titres et descriptions disjoints", () => {
  assert.deepEqual(
    gateRepetition("Model routing at scale", "Choose infrastructure by workload", [
      {
        slug: "securite-agents",
        title: "Securing autonomous agents",
        description: "Bound permissions before deployment",
      },
    ]),
    { ok: true },
  );
});
