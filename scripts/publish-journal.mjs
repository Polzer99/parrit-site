#!/usr/bin/env node
// Contrat de publication Journal (famille C de la Content Factory).
// Usage : node scripts/publish-journal.mjs <slug|/chemin/absolu/article.mdx> [--dry-run]
//
// Une entrée ne part en prod que si TOUTES les gates passent :
//   1. front-matter complet (title, date, description, slug = nom du fichier)
//   2. slug, noms clients et répétition éditoriale
//   3. pièges MDX connus (indentation = code-block CommonMark, mojibake, tirets cadratins)
//   4. prooflint (anti-IA, ~/parrit-os/tools/prooflint.py)
//   5. build Next (régénère llms.txt via prebuild)
//   6. gate de conformité marque
// Puis : commit + push HEAD:main (deploy Vercel), attente de l'URL en
// prod, et ligne ajoutée au registre §4-C de CONTENT-FACTORY-PARRIT.md.
// --dry-run : gates seulement, aucune écriture git/registre.

import { execFileSync, execSync } from "node:child_process";
import {
  appendFileSync,
  constants,
  copyFileSync,
  existsSync,
  readFileSync,
  readdirSync,
} from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import matter from "gray-matter";

import { gateNoms, gateRepetition, gateSlug } from "./journal-gates.mjs";

const REPO = path.resolve(import.meta.dirname, "..");
const PROOFLINT = path.join(homedir(), "parrit-os/tools/prooflint.py");
const REGISTRE = path.join(homedir(), "parrit-os/docs/content-factory-parrit/CONTENT-FACTORY-PARRIT.md");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const slugArg = args.find((a) => !a.startsWith("--"));
if (!slugArg) {
  console.error("usage: node scripts/publish-journal.mjs <slug|/chemin/absolu/article.mdx> [--dry-run]");
  process.exit(2);
}

const fail = (msg) => {
  console.error(`✗ ${msg}`);
  process.exit(1);
};

const externalFile = path.isAbsolute(slugArg);
if (externalFile && path.extname(slugArg) !== ".mdx") {
  fail("mode moteur : le chemin absolu doit désigner un fichier .mdx");
}

const slug = path.basename(slugArg, ".mdx");
const file = path.join(REPO, "content/journal", `${slug}.mdx`);

if (externalFile) {
  if (!existsSync(slugArg)) fail(`mode moteur : introuvable : ${slugArg}`);
  const slugGate = gateSlug(slug);
  if (!slugGate.ok) fail(slugGate.motif);
  try {
    copyFileSync(slugArg, file, constants.COPYFILE_EXCL);
  } catch (error) {
    if (error?.code === "EEXIST") {
      fail(`mode moteur : la destination existe déjà : ${file}`);
    }
    throw error;
  }
  console.log(`✓ mode moteur : ${slugArg} copié vers content/journal/${slug}.mdx`);
} else if (!existsSync(file)) {
  fail(`introuvable : ${file}`);
}

// ── gate 1 · front-matter ────────────────────────────────────────────────────
const raw = readFileSync(file, "utf8");
const { data, content } = matter(raw);
for (const key of ["title", "date", "description", "slug"]) {
  if (!data[key]) fail(`front-matter : « ${key} » manquant`);
}
if (data.slug !== slug) fail(`front-matter : slug « ${data.slug} » ≠ fichier « ${slug} »`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.date))) fail(`front-matter : date « ${data.date} » (attendu YYYY-MM-DD)`);
console.log(`✓ front-matter : « ${data.title} » · ${data.date}`);

// ── gate 2 · contrat éditorial du moteur ────────────────────────────────────
const slugGate = gateSlug(slug);
if (!slugGate.ok) fail(slugGate.motif);
console.log("✓ slug : non daté et spécifique");

const nomsGate = gateNoms(raw);
if (!nomsGate.ok) fail(nomsGate.motif);
console.log("✓ noms clients : aucun");

const entreesExistantes = readdirSync(path.join(REPO, "content/journal"), { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx") && entry.name !== `${slug}.mdx`)
  .map((entry) => {
    const existingRaw = readFileSync(path.join(REPO, "content/journal", entry.name), "utf8");
    const existingData = matter(existingRaw).data;
    return {
      slug: path.basename(entry.name, ".mdx"),
      title: String(existingData.title ?? ""),
      description: String(existingData.description ?? ""),
    };
  });
const repetitionGate = gateRepetition(String(data.title), String(data.description), entreesExistantes);
if (!repetitionGate.ok) fail(repetitionGate.motif);
console.log("✓ répétition : aucune collision ≥ 0.6");

// ── gate 3 · pièges MDX gravés (session 15/08) ───────────────────────────────
const traps = [];
content.split("\n").forEach((line, i) => {
  if (/^ {4,}\S/.test(line) && !/^\s*[-*\d]/.test(line.trimStart()))
    traps.push(`ligne ${i + 1} : indentée ≥4 espaces → CommonMark la rend en bloc de code`);
});
if (/Ã¢|â/.test(content)) traps.push("mojibake UTF-8 détecté (séquence â…)");
if (/—/.test(content)) traps.push("tiret cadratin — présent (tell IA, doctrine voix)");
if (traps.length) fail(`pièges MDX :\n   • ${traps.join("\n   • ")}`);
console.log("✓ pièges MDX : aucun");

// ── gate 4 · prooflint (anti-IA) ─────────────────────────────────────────────
try {
  const out = execFileSync("python3", [PROOFLINT, file], { encoding: "utf8" });
  process.stdout.write(out);
} catch (e) {
  process.stdout.write(e.stdout ?? "");
  fail("prooflint a bloqué la publication");
}

// ── gates 5-6 · build + marque (exit vérifié seul, jamais dans un pipe) ──────
console.log("… build Next (llms.txt régénéré en prebuild)");
execSync("npm run build", { cwd: REPO, stdio: ["ignore", "ignore", "inherit"] });
console.log("✓ build");
execSync("npm run qa:brand:rev01", { cwd: REPO, stdio: ["ignore", "ignore", "inherit"] });
console.log("✓ conformité marque");

if (dryRun) {
  console.log("— dry-run : gates vertes, rien n'a été poussé.");
  process.exit(0);
}

// ── publication ──────────────────────────────────────────────────────────────
const dirty = execSync("git status --porcelain", { cwd: REPO, encoding: "utf8" })
  .split("\n").filter((l) => l.trim() && !l.includes(`content/journal/${slug}.mdx`) && !l.includes("public/llms.txt"));
if (dirty.length) fail(`le worktree porte d'autres modifications, publier séparément :\n${dirty.join("\n")}`);

console.log("… synchronisation de l'état distant de main");
execFileSync("git", ["fetch", "origin", "main:refs/remotes/origin/main"], {
  cwd: REPO,
  stdio: "inherit",
});
try {
  execFileSync("git", ["merge-base", "--is-ancestor", "origin/main", "HEAD"], {
    cwd: REPO,
    stdio: "ignore",
  });
} catch {
  fail("HEAD n'est pas descendant de origin/main ; republier depuis un worktree frais créé sur origin/main");
}
console.log("✓ HEAD descend de origin/main");

execSync(`git add "content/journal/${slug}.mdx" public/llms.txt`, { cwd: REPO });
execSync(
  `git commit -m "Journal: publish ${slug}" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"`,
  { cwd: REPO },
);
execFileSync("git", ["push", "origin", "HEAD:main"], { cwd: REPO, stdio: "inherit" });
console.log("✓ poussé vers main (deploy Vercel)");

// ── vérification en prod réelle (un 200 sur la page, pas sur la home) ────────
const url = `https://parrit.ai/journal/${slug}`;
let live = false;
for (let i = 0; i < 30; i++) {
  execSync("sleep 10");
  const code = execSync(`curl -s -o /dev/null -w "%{http_code}" "${url}"`, { encoding: "utf8" });
  if (code === "200" && execSync(`curl -s "${url}"`, { encoding: "utf8" }).includes(String(data.title).slice(0, 40))) {
    live = true;
    break;
  }
}
if (!live) fail(`la page ${url} ne répond pas avec le bon contenu après 5 min — vérifier le deploy Vercel`);
console.log(`✓ en prod : ${url}`);

// ── registre Content Factory §4-C ────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
appendFileSync(REGISTRE, `| Journal parrit.ai · ${data.title} | publish-journal.mjs | publié ${today} · ${url} |\n`);
console.log(`✓ registre Content Factory : ligne ajoutée (${REGISTRE})`);
