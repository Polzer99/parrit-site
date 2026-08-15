#!/usr/bin/env node
// Lot 2 Content Factory — proposer une entrée Journal à la validation super app.
// Usage : node scripts/propose-journal.mjs <slug>
//
// Fait tourner les gates de publication en dry-run (publish-journal.mjs), puis
// enfile une carte `telegram_queue` (card_type `journal_publication`). La
// publication N'A PAS lieu ici : elle s'exécute après le swipe ✅ de Paul,
// par tools/journal-publish-watcher.py (parrit-os). §19 : l'humain déclenche.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import matter from "gray-matter";

const REPO = path.resolve(import.meta.dirname, "..");
const ENV_FILE = path.join(homedir(), "parrit-os/signals/.env");
// le workspace Parrit déjà utilisé par les cartes existantes de la file
const WORKSPACE_ID = "3cd72035-f601-4946-94be-9baae74e3388";

const slug = path.basename(process.argv[2] ?? "", ".mdx");
if (!slug) {
  console.error("usage: node scripts/propose-journal.mjs <slug>");
  process.exit(2);
}

const env = (name) => {
  const line = readFileSync(ENV_FILE, "utf8").split("\n").find((l) => l.startsWith(`${name}=`));
  if (!line) throw new Error(`variable ${name} absente de signals/.env`);
  return line.slice(name.length + 1).trim().replace(/^"|"$/g, "");
};

// 1 · gates en dry-run — une carte ne se propose que si tout est vert
execFileSync("node", [path.join(REPO, "scripts/publish-journal.mjs"), slug, "--dry-run"], {
  stdio: "inherit",
});

// 2 · la carte
const { data } = matter(readFileSync(path.join(REPO, "content/journal", `${slug}.mdx`), "utf8"));
const carte = {
  workspace_id: WORKSPACE_ID,
  card_type: "journal_publication",
  card_text: `Publier « ${data.title} » sur parrit.ai ?`,
  category: "prod", // enum card_category sans valeur éditoriale — §47, on ne l'étend pas seul
  priority: 50,
  status: "pending",
  dedup_key: `parrit-site:journal:publication:${slug}`,
  metadata: {
    action: "publish_journal",
    slug,
    titre: data.title,
    date: String(data.date),
    gates: "vertes (dry-run)",
    commande: `node ${REPO}/scripts/publish-journal.mjs ${slug}`,
  },
};

const base = env("SUPABASE_URL");
const key = env("SUPABASE_SERVICE_ROLE_KEY");
const entetes = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

// idempotence applicative : `dedup_key` n'a pas de contrainte unique en base
// (§47 — on ne la crée pas seul), donc on regarde avant d'insérer
const existante = await (await fetch(
  `${base}/rest/v1/telegram_queue?select=id,status&dedup_key=eq.${encodeURIComponent(carte.dedup_key)}`,
  { headers: entetes },
)).json();
if (existante.length > 0) {
  console.log(`— carte déjà en file (${existante[0].id}, statut ${existante[0].status}), rien à faire`);
  process.exit(0);
}

const reponse = await fetch(`${base}/rest/v1/telegram_queue`, {
  method: "POST",
  headers: entetes,
  body: JSON.stringify(carte),
});
const corps = await reponse.json();
if (!reponse.ok) {
  console.error("✗ insertion carte refusée :", JSON.stringify(corps).slice(0, 300));
  process.exit(1);
}
console.log(`✓ carte en file (${corps[0]?.id}) — la publication attend le swipe ✅ dans la super app`);
