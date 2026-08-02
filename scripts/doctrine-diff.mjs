/**
 * QA DOCTRINE COMPARATIVE — la dette existante ne doit pas servir de cachette.
 *
 *   npm run qa:doctrine:diff
 *
 * `public-doctrine-audit.mjs` échoue déjà sur la base : 58 signalements, très
 * majoritairement des tirets cadratins dans `art-direction-lab`. Un gate rouge
 * en permanence ne protège de rien — plus personne ne le regarde, et un vrai
 * défaut se noie dans le bruit.
 *
 * Ce script compare le run courant à une baseline figée et bloque sur :
 *   1. tout FICHIER qui n'était pas déjà signalé ;
 *   2. tout TYPE de violation nouveau dans un fichier déjà signalé ;
 *   3. tout total supérieur à la baseline.
 *
 * Autrement dit : la dette a le droit d'exister, pas de grandir.
 *
 * Quand une session assainit un fichier, le total baisse et le script le dit.
 * Régénérer la baseline se fait alors À LA BAISSE, jamais à la hausse.
 */

import { execSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const baseline = JSON.parse(await readFile("scripts/doctrine-baseline.json", "utf8"));

let sortie = "";
try {
  sortie = execSync("node scripts/public-doctrine-audit.mjs", { encoding: "utf8" });
} catch (e) {
  sortie = (e.stdout ?? "") + (e.stderr ?? "");
}

const entrees = sortie
  .split("\n")
  .filter((l) => l.startsWith("- "))
  .map((l) => {
    const m = /^- ([^:]+):(\d+) \[([^\]]+)\]/.exec(l);
    return m ? { fichier: m[1], ligne: m[2], type: m[3], texte: l } : null;
  })
  .filter(Boolean);

const echecs = [];

for (const e of entrees) {
  const connu = baseline.parFichier[e.fichier];
  if (!connu) {
    echecs.push(`NOUVEAU FICHIER signalé — ${e.fichier}:${e.ligne} [${e.type}]`);
  } else if (connu[e.type] === undefined) {
    echecs.push(`NOUVEAU TYPE dans un fichier connu — ${e.fichier}:${e.ligne} [${e.type}]`);
  }
}

if (entrees.length > baseline.total) {
  echecs.push(`Le total augmente : ${entrees.length} contre ${baseline.total} en baseline.`);
}

console.log(`\nQA DOCTRINE COMPARATIVE`);
console.log(`  baseline : ${baseline.total} signalements sur ${Object.keys(baseline.parFichier).length} fichiers`);
console.log(`  courant  : ${entrees.length} signalements`);

if (entrees.length < baseline.total) {
  console.log(
    `\n  ↓ ${baseline.total - entrees.length} signalement(s) en moins. ` +
      `Régénère la baseline pour verrouiller le gain.`,
  );
}

if (echecs.length === 0) {
  console.log(`\n  ✓ aucun nouveau chemin, aucun nouveau type\n`);
  process.exit(0);
}

console.error(`\n  ${echecs.length} régression(s) :`);
for (const l of echecs) console.error(`  ✗ ${l}`);
console.error(
  `\n  La dette existante n'est pas une cachette. Corrige ta ligne, ` +
    `n'ajoute pas à la baseline.\n`,
);
process.exit(1);
