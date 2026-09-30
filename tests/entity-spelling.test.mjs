import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { levenshtein, scanEntitySpelling, spellingErrors } from "../scripts/entity-spelling.mjs";

test("détecte les variantes prescrites, la casse et la position exacte", () => {
  const variants = ["Lamaraud", "Larmarau", "Larmeraud", "Larmaroud", "Lamarraud", "Larmarraud", "Larmaraux"];
  for (const variant of variants.flatMap((value) => [value, value.toUpperCase(), value.toLowerCase()])) {
    assert.deepEqual(spellingErrors(`Correct\r\nPaul ${variant}.`, "article.mdx"), [`article.mdx:2: ${variant}`]);
  }
});

test("distance réelle, seuil inclusif, tokens entiers et orthographe canonique", () => {
  assert.equal(levenshtein("larmaraud", "lamaraux"), 2);
  assert.equal(levenshtein("larmaraud", "lamarxxx"), 4);
  assert.deepEqual(spellingErrors("Lamaraux", "f"), ["f:1: Lamaraux"]);
  assert.deepEqual(spellingErrors("Paul Larmaraud LARMARAUD https://paul-larmaraud.com lamarxxx xLamaraud Lamaraudxxxxxx la lampe", "f"), []);
});

test("scan récursif des quatre racines, exclusion exacte et fichiers binaires", (t) => {
  const root = mkdtempSync(path.join(tmpdir(), "entity-spelling-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const directory of ["src", "content", "public", "docs"]) {
    mkdirSync(path.join(root, directory, "nested"), { recursive: true });
    writeFileSync(path.join(root, directory, "nested", "new.format"), "Lamaraud\nLarmaraux");
    for (const excluded of ["node_modules", ".next"]) {
      mkdirSync(path.join(root, directory, excluded));
      writeFileSync(path.join(root, directory, excluded, "ignored.txt"), "Lamaraud");
    }
  }
  writeFileSync(path.join(root, "docs/CODEX-SPEC-2026-09-26-entity-identity-v0.md"), "Lamaraud");
  writeFileSync(path.join(root, "public/binary.png"), Buffer.from([0, 255, 254]));
  writeFileSync(path.join(root, "public/invalid.bin"), Buffer.from([255, 254]));
  assert.deepEqual(scanEntitySpelling(root), ["src", "content", "public", "docs"].flatMap((directory) => [
    `${directory}/nested/new.format:1: Lamaraud`, `${directory}/nested/new.format:2: Larmaraux`,
  ]));
});

test("aucune variante interdite dans src, content, public et docs", () => {
  const errors = scanEntitySpelling(fileURLToPath(new URL("..", import.meta.url)));
  assert.equal(errors.length, 0, `Orthographe d'entité invalide :\n${errors.join("\n")}`);
});
