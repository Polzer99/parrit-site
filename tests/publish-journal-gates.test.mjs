import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { gateNoms, gateRepetition, gateSlug } from "../scripts/journal-gates.mjs";

test("publisher bloque une faute d'entité avant prooflint et build", (t) => {
  const root = mkdtempSync(path.join(tmpdir(), "entity-publisher-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const repo = fileURLToPath(new URL("..", import.meta.url));
  for (const directory of ["scripts", "tests", "src", "content/journal", "public", "docs", "home"]) {
    mkdirSync(path.join(root, directory), { recursive: true });
  }
  for (const file of ["scripts/publish-journal.mjs", "scripts/journal-gates.mjs", "scripts/entity-spelling.mjs", "tests/entity-spelling.test.mjs"]) {
    copyFileSync(path.join(repo, file), path.join(root, file));
  }
  symlinkSync(realpathSync(path.join(repo, "node_modules")), path.join(root, "node_modules"), "dir");
  writeFileSync(path.join(root, "content/journal/entity-proof.mdx"), [
    "---", "title: Entity proof", "date: '2026-09-26'", "description: A distinct article", "slug: entity-proof", "---", "Paul Lamaraud.",
  ].join("\n"));
  // Only a dry run in an isolated tree; HOME also isolates prooflint/registry
  // should the ordering regress. No git or external services are available.
  const env = { ...process.env, HOME: path.join(root, "home"), PATH: "" };
  // The publisher launches its own node --test process, not a nested test.
  delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(process.execPath, ["scripts/publish-journal.mjs", "entity-proof", "--dry-run"], {
    cwd: root,
    env,
    encoding: "utf8",
    timeout: 10_000,
  });
  assert.ifError(result.error);
  assert.equal(result.status, 1);
  const output = result.stdout + result.stderr;
  assert.match(output, /content\/journal\/entity-proof\.mdx:7: Lamaraud/);
  assert.doesNotMatch(output, /prooflint a bloqué|build Next|dry-run : gates vertes/);
});

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
