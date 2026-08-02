/**
 * ABAISSER LA BASELINE DOCTRINE — la seule commande autorisée à l'écrire.
 *
 *   npm run qa:doctrine:baseline
 *
 * Deux règles, et elles sont appliquées par le code :
 *
 *   UNE BASELINE NE MONTE JAMAIS.
 *   UNE BASELINE NE BAISSE JAMAIS SILENCIEUSEMENT.
 *
 * `qa:doctrine:diff` est strictement en LECTURE SEULE : il constate, il ne
 * corrige pas. Lui laisser le droit d'écrire ferait de chaque régression une
 * mise à jour automatique de la référence, c'est-à-dire un gate qui s'auto-valide
 * — exactement le mécanisme qui a produit ailleurs un `catch` vide et une facture
 * qui monte pendant que tout reste vert.
 *
 * Cette commande-ci écrit, mais elle refuse :
 *   — d'augmenter le total ;
 *   — d'ajouter un fichier absent de la baseline ;
 *   — d'ajouter un type absent d'un fichier connu.
 *
 * Elle affiche ce qu'elle retire, ligne par ligne, pour que le commit qui
 * s'ensuit soit relisible. Ce commit doit être relu : la baisse est une
 * information, pas une formalité.
 */

import { execSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";

const CHEMIN = "scripts/doctrine-baseline.json";
const baseline = JSON.parse(await readFile(CHEMIN, "utf8"));

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
    return m ? { fichier: m[1], ligne: m[2], type: m[3] } : null;
  })
  .filter(Boolean);

const parFichier = {};
for (const e of entrees) {
  parFichier[e.fichier] = parFichier[e.fichier] ?? {};
  parFichier[e.fichier][e.type] = (parFichier[e.fichier][e.type] ?? 0) + 1;
}

/* --------------------------------------------------- refus : ça monterait */

const refus = [];

if (entrees.length > baseline.total) {
  refus.push(`le total monterait : ${entrees.length} contre ${baseline.total}`);
}

for (const [fichier, types] of Object.entries(parFichier)) {
  const connu = baseline.parFichier[fichier];
  if (!connu) {
    refus.push(`nouveau fichier signalé : ${fichier}`);
    continue;
  }
  for (const [type, n] of Object.entries(types)) {
    if (connu[type] === undefined) {
      refus.push(`nouveau type dans ${fichier} : [${type}]`);
    } else if (n > connu[type]) {
      refus.push(`${fichier} [${type}] : ${n} contre ${connu[type]} en baseline`);
    }
  }
}

if (refus.length > 0) {
  console.error(`\nREFUS D'ÉCRITURE — une baseline ne monte jamais.\n`);
  for (const r of refus) console.error(`  ✗ ${r}`);
  console.error(
    `\nCorrige la ligne fautive. La baseline n'est pas là pour absorber ` +
      `une régression.\n`,
  );
  process.exit(1);
}

/* --------------------------------------------------------- rien à faire */

if (entrees.length === baseline.total) {
  console.log(
    `\nRien à abaisser : ${entrees.length} signalements, identique à la baseline.\n`,
  );
  process.exit(0);
}

/* ----------------------------------------------- écriture, et seulement ici */

const retires = [];
for (const [fichier, types] of Object.entries(baseline.parFichier)) {
  for (const [type, n] of Object.entries(types)) {
    const maintenant = parFichier[fichier]?.[type] ?? 0;
    if (maintenant < n) {
      retires.push(`${fichier} [${type}] : ${n} → ${maintenant}`);
    }
  }
}

console.log(`\nBAISSE DE LA BASELINE`);
console.log(`  ${baseline.total} → ${entrees.length} signalements\n`);
for (const r of retires) console.log(`  ↓ ${r}`);

await writeFile(
  CHEMIN,
  JSON.stringify(
    {
      _doc:
        "Baseline du public doctrine audit. Dette PREEXISTANTE. " +
        "Ecrite UNIQUEMENT par scripts/doctrine-baseline-lower.mjs, qui refuse " +
        "toute hausse. qa:doctrine:diff est en lecture seule. " +
        "Une baseline ne monte jamais, et ne baisse jamais silencieusement.",
      total: entrees.length,
      parFichier,
    },
    null,
    2,
  ) + "\n",
);

console.log(
  `\n  ${CHEMIN} mis à jour.\n` +
    `  Commite-le séparément, avec ce que tu as assaini. Ce commit se relit.\n`,
);
