import assert from "node:assert/strict";
import { test } from "node:test";
import { loader } from "./helpers/site-v1-render.mjs";
const { readingMs } = loader("fr")("src/system/reading.ts");

test("reading duration includes orientation, 300ms per word and a 3s floor", () => {
  for (const text of ["", "   ", "Agent", "Des agents sur mesure", "one two three four five six"]) assert.equal(readingMs(text), 3000);
  assert.equal(readingMs("one two three four five six seven"), 3300);
  assert.equal(readingMs("  Un\nagent\tprépare une réponse à relire ensemble.  "), 3600);
  assert.equal(readingMs("L'évaluation des modèles, pour les déploiements les plus exigeants."), 3900);
  assert.equal(readingMs("A real-world example\u00a0for each team to read."), 3600);
});
