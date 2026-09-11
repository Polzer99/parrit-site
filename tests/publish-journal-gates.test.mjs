import assert from "node:assert/strict";
import test from "node:test";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { gateNoms, gateRepetition, gateSlug, gateTypographie } from "../scripts/journal-gates.mjs";

const ARTICLES = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "content", "journal");

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

test("gateTypographie refuse l'espace française devant une ponctuation haute", () => {
  for (const cas of [
    "Not a generic summary : a briefing targeted at your areas.",
    "It becomes a dead database ; nobody fills it in.",
    "Does it work ?",
    "Look at this !",
  ]) {
    const result = gateTypographie(cas);

    assert.equal(result.ok, false, `aurait dû refuser : ${cas}`);
    assert.match(result.motif, /typographie/i);
  }
});

test("gateTypographie laisse passer un horaire, une URL et une ponctuation anglaise correcte", () => {
  for (const cas of [
    "The result: an individual proficiency score, per module.",
    "The call starts at 10:30 and runs thirty minutes.",
    "Read it on https://parrit.ai/journal for the full argument.",
    "Excel, HubSpot, Axonaut: it doesn't matter.",
  ]) {
    assert.equal(gateTypographie(cas).ok, true, `aurait dû accepter : ${cas}`);
  }
});

/* La porte unitaire protège les articles à venir. Celle-ci balaie ceux qui sont
   déjà publiés : le défaut vivait dans le corpus, pas dans le prochain article,
   et une porte qui ne regarde que l'entrée n'aurait jamais rien trouvé.
   Les fichiers ne sont pas énumérés : on lit le dossier, pour qu'un article
   ajouté demain entre dans la porte sans que personne y pense. */
test("aucun article publié ne porte de typographie française", async () => {
  const fichiers = (await readdir(ARTICLES)).filter((nom) => nom.endsWith(".mdx"));

  assert.ok(fichiers.length >= 15, `le balayage doit voir le corpus, il a vu ${fichiers.length} articles`);

  const fautifs = [];
  for (const nom of fichiers) {
    const verdict = gateTypographie(await readFile(path.join(ARTICLES, nom), "utf8"));
    if (!verdict.ok) fautifs.push(`${nom} — ${verdict.motif}`);
  }

  assert.deepEqual(fautifs, [], `articles à reprendre :\n${fautifs.join("\n")}`);
});
