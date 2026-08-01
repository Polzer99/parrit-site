/**
 * AUDIT DE LA FONDATION — contrôles statiques sur le code de la grammaire.
 *
 *   node scripts/foundation-audit.mjs
 *
 * Neuf contrôles, tous sur le CODE (pas sur le rendu) : ils tournent sans
 * serveur et sans navigateur, donc ils sont branchables en CI sans dépendance.
 *
 * Périmètre : uniquement les fichiers de la fondation. La dette historique du
 * reste du dépôt est mesurée ailleurs (04-DESIGN-SYSTEM-CONSOLIDATION.md) et
 * n'a pas à faire échouer ce gate — sinon il est rouge dès le premier jour et
 * plus personne ne le regarde.
 */

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const PERIMETRE = [
  "src/components/templates",
  "src/components/shell",
  "src/lib/registry",
  "src/lib/video",
  "src/lib/seo",
  "src/app/template-grammar",
];

const HEX_PERIMES = ["#ffffff", "#f5f8ff", "#161616", "#aa0003", "#fefdf9", "#2e2d2b"];
const RAYONS_AUTORISES = ["var(--radius-none)", "var(--radius-round)", "0", "999rem", "50%"];

const echecs = [];
const ok = [];
const fail = (test, detail) => echecs.push(`${test} — ${detail}`);
const pass = (test, detail) => ok.push(`${test} : ${detail}`);

async function fichiers(racine) {
  const out = [];
  async function marche(p) {
    let entries;
    try {
      entries = await readdir(p, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const complet = path.join(p, e.name);
      if (e.isDirectory()) await marche(complet);
      else if (/\.(tsx?|css)$/.test(e.name)) out.push(complet);
    }
  }
  await marche(racine);
  return out;
}

const tous = (await Promise.all(PERIMETRE.map(fichiers))).flat();
const contenus = new Map();
for (const f of tous) contenus.set(f, await readFile(f, "utf8"));

/* ------------------------------------------------- 1. couleurs périmées */
{
  let trouves = 0;
  for (const [f, s] of contenus) {
    for (const hex of HEX_PERIMES) {
      const re = new RegExp(hex.replace("#", "#"), "gi");
      const m = s.match(re);
      // Les listes d'interdits dans les commentaires et les tests ne comptent pas.
      if (m) {
        const lignes = s.split("\n").filter((l) => new RegExp(hex, "i").test(l));
        const reelles = lignes.filter(
          (l) => !/^\s*(\*|\/\/|#)/.test(l) && !/périmé|interdit|retired|HEX_PERIMES/i.test(l),
        );
        if (reelles.length) {
          trouves += reelles.length;
          fail("couleurs-perimees", `${f} : ${hex} × ${reelles.length}`);
        }
      }
    }
  }
  if (!trouves) pass("couleurs-perimees", `aucune sur ${tous.length} fichiers`);
}

/* ------------------------------------------- 2. rayons et ombres hors canon */
{
  let trouves = 0;
  for (const [f, s] of contenus) {
    for (const m of s.matchAll(/borderRadius:\s*"([^"]+)"|border-radius:\s*([^;]+);/g)) {
      const v = (m[1] ?? m[2] ?? "").trim();
      if (!RAYONS_AUTORISES.includes(v)) {
        trouves++;
        fail("rayons", `${f} : border-radius ${v}`);
      }
    }
    for (const m of s.matchAll(/boxShadow:\s*"([^"]+)"|box-shadow:\s*([^;]+);/g)) {
      const v = (m[1] ?? m[2] ?? "").trim();
      if (v !== "var(--shadow-none)" && v !== "none" && !v.includes("--focus-ring")) {
        trouves++;
        fail("ombres", `${f} : box-shadow ${v}`);
      }
    }
  }
  if (!trouves) pass("rayons-ombres", "rayon 0 partout, aucune ombre");
}

/* --------------------------------- 3. imports directs des registres */
{
  const fautifs = [];
  for (const [f, s] of contenus) {
    if (f.includes("src/lib/registry")) continue; // le registre s'importe lui-même
    for (const m of s.matchAll(/from\s+"@\/lib\/registry\/([a-z]+)"/g)) {
      fautifs.push(`${f} → @/lib/registry/${m[1]}`);
    }
  }
  if (fautifs.length) {
    // Les imports de TYPES seuls sont tolérés : ils n'exécutent rien, donc ils
    // ne contournent pas la validation.
    for (const x of fautifs) fail("imports-registre", `${x} (passer par @/lib/registry)`);
  } else {
    pass("imports-registre", "tout passe par le baril @/lib/registry");
  }
}

/* ------------------------- 4. aucune taxonomie d'offre en dur dans un template */
{
  const interdits = /\b(croissance|deployer|transmettre|palier|N[1-7]\b|masterclass-|sessions-mcp|optimisation-flotte)/i;
  let trouves = 0;
  for (const [f, s] of contenus) {
    if (!f.includes("src/components/templates")) continue;
    const lignes = s.split("\n");
    lignes.forEach((l, i) => {
      if (interdits.test(l) && !/^\s*(\*|\/\/)/.test(l)) {
        trouves++;
        fail("taxonomie-offre", `${f}:${i + 1} ${l.trim().slice(0, 70)}`);
      }
    });
  }
  if (!trouves) pass("taxonomie-offre", "aucun template ne nomme une offre");
}

/* ------------------------- 5. aucun CSS de page complet, aucun token parallèle */
{
  const css = tous.filter((f) => f.endsWith(".css"));
  if (css.length) {
    for (const f of css) fail("css-parallele", `${f} : feuille de style ajoutée dans la fondation`);
  } else {
    pass("css-parallele", "aucune feuille de style ajoutée");
  }

  let tokens = 0;
  for (const [f, s] of contenus) {
    // Une DÉCLARATION de variable CSS hors du fichier de tokens = jeu parallèle.
    for (const m of s.matchAll(/^\s*--[a-z-]+\s*:/gm)) {
      tokens++;
      fail("tokens-paralleles", `${f} : déclaration ${m[0].trim()}`);
    }
  }
  if (!tokens) pass("tokens-paralleles", "aucune variable CSS déclarée hors parrit-tokens.css");
}

/* ---------------------------------------- 6. le contrat vidéo reste neutre */
{
  const contrat = await readFile("src/lib/video/contract.ts", "utf8");
  const providersEnDur = contrat.match(/youtube|vimeo|dailymotion|wistia|mux|cloudflare/gi);
  if (providersEnDur) {
    fail("video-neutre", `hébergeur nommé dans le contrat : ${[...new Set(providersEnDur)].join(", ")}`);
  } else {
    pass("video-neutre", "aucun hébergeur nommé dans le contrat");
  }

  const t2 = contenus.get("src/components/templates/T2Video.tsx") ?? "";
  if (/provider\s*===|switch\s*\(\s*[a-z.]*provider/i.test(t2)) {
    fail("video-neutre", "T2Video teste `provider` pour changer son rendu");
  } else {
    pass("video-neutre", "T2Video ne teste jamais `provider`");
  }
}

/* ------------------- 7. aucun template n'exige un nom ou un logo client */
{
  let trouves = 0;
  for (const [f, s] of contenus) {
    if (!f.includes("src/components/templates")) continue;
    // Un template ne doit jamais lire `nominatif` en direct : il passe par
    // libelleOrganisation() / logoAutorise(), qui appliquent la permission.
    if (/\.nominatif\b/.test(s)) {
      trouves++;
      fail("preuve-nominative", `${f} lit .nominatif en direct`);
    }
  }
  if (!trouves) pass("preuve-nominative", "aucun template ne lit .nominatif en direct");
}

/* --------------- 8. aucune ressource ne promet une livraison non configurée */
{
  const src = await readFile("src/lib/registry/ressources.ts", "utf8");
  const blocs = src.split(/\n  \{\n/).slice(1);
  let trouves = 0;
  for (const b of blocs) {
    const slug = /slug:\s*"([^"]+)"/.exec(b)?.[1] ?? "?";
    const verifiee = /livraisonVerifiee:\s*true/.test(b);
    const livrable = /livrable:\s*"([^"]*)"/.exec(b)?.[1] ?? "";
    if (verifiee && !livrable) {
      trouves++;
      fail("livraison", `${slug} : livraison déclarée vérifiée sans livrable`);
    }
  }
  if (!trouves) pass("livraison", `${blocs.length} ressources, aucune promesse sans livrable`);
}

/* ------------------------------------------------------------- rapport */
console.log("\nAUDIT DE LA FONDATION\n");
for (const l of ok) console.log(`  ✓ ${l}`);
for (const l of echecs) console.error(`  ✗ ${l}`);
console.log(`\n${ok.length} contrôle(s) vert(s), ${echecs.length} échec(s)\n`);
process.exit(echecs.length === 0 ? 0 : 1);
