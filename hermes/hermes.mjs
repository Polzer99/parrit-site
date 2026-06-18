#!/usr/bin/env node
/**
 * Hermes — boucle d'amelioration continue du site parrit.ai + conversion.
 *
 * Doctrine : loop-doctor (REGLES-DOR §28) + designing. Source de verite commune = ../TRUTH.md.
 * Autonomie DECLAREE = L2 : Hermes OBSERVE + PROPOSE + DRAFT (issue Codex / PR). Il n'applique
 * RIEN en prod tout seul. Le merge vers main (= prod) exige les 3 feux (§22/§25). Human-triggered (§30).
 *
 * Boucle : observe (site live + leads + PostHog si cle) -> propose (OpenRouter, grounded TRUTH)
 *          -> emet proposals/<date>.md + tick PROGRESS.md + brouillon issue Codex
 *          -> [humain : merge] -> mesure l'effet au run suivant -> apprend (PROGRESS).
 *
 * Usage :
 *   node hermes/hermes.mjs                 # cycle : observe + propose + ecrit proposals/PROGRESS
 *   node hermes/hermes.mjs --open-issue    # + ouvre l'issue Codex GitHub de la proposition #1 (gh)
 *   node hermes/hermes.mjs --max 6         # nb max de propositions (defaut 5)
 *   HERMES_MODEL=... node hermes/hermes.mjs
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

// ---------- config ----------
const args = process.argv.slice(2);
const OPEN_ISSUE = args.includes("--open-issue");
const MAX_PROPOSALS = Number(args[args.indexOf("--max") + 1]) || 5;
const SCORE_THRESHOLD = 120; // stop condition : aucune proposition >= seuil => rien a faire
const MAX_TOKENS = Number(process.env.HERMES_MAX_TOKENS) || 4000; // garde-fou tokens
const BASE = process.env.HERMES_SITE_BASE || "https://parrit.ai";
const SURFACES = ["/fr", "/fr/sprint", "/academy", "/outils/detecteur-bullshit", "/fondateurs"];
const REPO = "Polzer99/parrit-site";

function loadEnv() {
  const out = { ...process.env };
  const f = join(ROOT, ".env.local");
  if (existsSync(f)) {
    for (const line of readFileSync(f, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !out[m[1]]) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return out;
}
const ENV = loadEnv();
const MODEL = process.env.HERMES_MODEL || ENV.HERMES_MODEL || "deepseek/deepseek-v3.2";
const today = new Date().toISOString().slice(0, 10);

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 3500);
}

// ---------- OBSERVE ----------
async function observe() {
  const truth = existsSync(join(ROOT, "TRUTH.md"))
    ? readFileSync(join(ROOT, "TRUTH.md"), "utf8")
    : "(TRUTH.md absent)";

  const progressPath = join(HERE, "PROGRESS.md");
  const progress = existsSync(progressPath)
    ? readFileSync(progressPath, "utf8").slice(-4000)
    : "(aucune memoire)";

  const pages = [];
  for (const path of SURFACES) {
    try {
      const r = await fetch(BASE + path, { headers: { "user-agent": "HermesBot/1 (+parrit.ai)" } });
      pages.push({ path, status: r.status, text: r.ok ? stripHtml(await r.text()) : "" });
    } catch (e) {
      pages.push({ path, status: "ERR", text: String(e).slice(0, 80) });
    }
  }

  // PostHog quantitatif : seulement si une cle PERSONNELLE (Query API) est cablee.
  let analytics = "(PostHog non cable : pas de cle Query API. Observation = audit qualitatif du contenu live. Gap declare LOOP.md.)";
  let analyticsMode = "qualitatif";
  const phKey = ENV.POSTHOG_PERSONAL_API_KEY;
  const phProj = ENV.POSTHOG_PROJECT_ID;
  if (phKey && phProj) {
    const host = ENV.POSTHOG_HOST || "https://eu.posthog.com";
    const phQuery = async (sql) => {
      const r = await fetch(`${host}/api/projects/${phProj}/query/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${phKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query: { kind: "HogQLQuery", query: sql } }),
      });
      if (!r.ok) throw new Error(`PostHog ${r.status} ${(await r.text()).slice(0, 120)}`);
      return (await r.json()).results || [];
    };
    try {
      const views = await phQuery(
        "SELECT properties.$current_url AS url, count() AS n FROM events WHERE event = '$pageview' AND timestamp > now() - INTERVAL 14 DAY GROUP BY url ORDER BY n DESC LIMIT 20",
      );
      const conv = await phQuery(
        "SELECT properties.form AS form, count() AS n FROM events WHERE event = 'form_submitted' AND timestamp > now() - INTERVAL 30 DAY GROUP BY form ORDER BY n DESC",
      );
      const total = views.reduce((a, r) => a + (Number(r[1]) || 0), 0);
      analytics =
        `PostHog REEL. Pageviews 14j (total ${total}) :\n` +
        views.map((r) => `  ${r[1]}  ${r[0]}`).join("\n") +
        `\nConversions form_submitted 30j (signal lead/RDV) :\n` +
        (conv.length
          ? conv.map((r) => `  ${r[1]}  ${r[0] || "(form non tague)"}`).join("\n")
          : "  aucune conversion captee");
      analyticsMode = "PostHog quantitatif";
    } catch (e) {
      analytics = "(PostHog erreur : " + String(e).slice(0, 120) + ")";
    }
  }

  return { truth, progress, pages, analytics, analyticsMode };
}

// ---------- PROPOSE ----------
const SYSTEM = `Tu es Hermes, l'agent d'amelioration continue du site parrit.ai. Ta mission unique : faire que le SITE transforme davantage de dirigeants en RDV qualifies avec Paul (north star conversion), sans jamais trahir la voix ni les regles dures de Parrit.

Tu raisonnes EXCLUSIVEMENT a partir de la source de verite fournie (TRUTH.md), de la doctrine, de la memoire des cycles passes (PROGRESS) et de l'etat reel des pages. Tu ne proposes que des ameliorations qui : (1) servent une north star, (2) passent LE TAMIS (sobre, Enargeia, zero pathos, pas de hook fabrique, pas de tiret cadratin), (3) respectent les 7 regles dures, (4) sont FALSIFIABLES (tu nommes la metrique qui doit bouger), (5) sont reversibles (1 PR).

Tu ne refais pas ce que PROGRESS dit deja teste sans nouvel angle. Tu privilegies les fuites de conversion (funnel, clarte de l'offre, CTA, preuve) avant le cosmetique. Pour chaque proposition tu donnes un score ICE (impact, confidence, ease : 1-10 chacun).

Reponds UNIQUEMENT en JSON valide :
{"summary":"<2 phrases : etat de conversion percu + theme du cycle>","proposals":[{"title":"<court>","surface":"<route ou composant precis, ex: /fr home hero, QuickContact, /outils/detecteur-bullshit>","hypothesis":"<si on change X alors la metrique Y s'ameliore parce que Z>","change":"<le changement concret, precis, implementable>","metric":"<metrique falsifiable a suivre>","rationale":"<pourquoi, ancre sur TRUTH>","ice":{"impact":<1-10>,"confidence":<1-10>,"ease":<1-10>},"doctrine_ok":"<comment ca passe LE TAMIS + regles dures>","risk":"<risque + rollback>"}]}`;

async function propose(obs) {
  const key = ENV.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY manquant (.env.local ou env)");
  const user = `SOURCE DE VERITE COMMUNE (TRUTH.md) :
${obs.truth}

MEMOIRE DES CYCLES PASSES (PROGRESS.md, extrait) :
${obs.progress}

ANALYTICS : ${obs.analytics}

ETAT REEL DES PAGES (texte rendu, live) :
${obs.pages.map((p) => `### ${p.path} [${p.status}]\n${p.text}`).join("\n\n")}

Propose au maximum ${MAX_PROPOSALS} ameliorations, classees de la plus a la moins prometteuse (score ICE = impact*confidence*ease). Concentre-toi sur la CONVERSION (visiteur dirigeant -> RDV qualifie).`;

  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://parrit.ai",
      "X-Title": "Parrit Hermes",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: user },
      ],
      temperature: 0.3,
      max_tokens: MAX_TOKENS,
      response_format: { type: "json_object" },
    }),
  });
  if (!r.ok) throw new Error(`OpenRouter ${r.status} : ${(await r.text()).slice(0, 200)}`);
  const raw = (await r.json())?.choices?.[0]?.message?.content || "{}";
  const m = raw.match(/\{[\s\S]*\}/);
  const parsed = JSON.parse(m ? m[0] : raw);
  const proposals = (parsed.proposals || [])
    .map((p) => {
      const i = p.ice || {};
      const score = (Number(i.impact) || 0) * (Number(i.confidence) || 0) * (Number(i.ease) || 0);
      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_PROPOSALS);
  return { summary: parsed.summary || "", proposals };
}

// ---------- EMIT ----------
function codexIssueBody(p) {
  return `## Contexte (Hermes ${today})
Source de verite : \`TRUTH.md\`. Hypothese de conversion : ${p.hypothesis}

## Surface
${p.surface}

## Changement demande
${p.change}

## Rationale (ancre TRUTH)
${p.rationale}

## Critere d'acceptation (testable)
- [ ] Le changement est implemente sur la surface indiquee, dans les 4 langues si c'est la home.
- [ ] Metrique a suivre apres mise en ligne : **${p.metric}**.
- [ ] Respecte LE TAMIS + les 7 regles dures de TRUTH.md (palette, polices, pas de prix/clients, pas de tiret cadratin, pas de \`*.vercel.app\` runtime).
- [ ] \`npm run build\` vert + \`scripts/contrast-audit.py\` = 0.

## Contraintes (REGLES-DOR §25)
Codex = codeur (ouvre la PR). Claude = relecteur + merge avec les 3 feux (review APPROVE + CD vert + Paul a COMPRIS). Jamais d'auto-merge. Repo : ${REPO}.

---
### Prompt pret a coller pour Codex
\`\`\`
Repo ${REPO}, issue Hermes "${p.title}". Lis TRUTH.md puis implemente : ${p.change}
Surface : ${p.surface}. Respecte LE TAMIS + les 7 regles dures (TRUTH.md §6). Si c'est la home, replique dans les 4 langues du DICT de HomeClient.tsx. Ouvre une PR. Gate : npm run build vert + scripts/contrast-audit.py = 0. Ne touche ni aux prix ni aux noms clients. Pas de tiret cadratin.
\`\`\``;
}

function emit(cycle) {
  const { summary, proposals } = cycle;
  mkdirSync(join(HERE, "proposals"), { recursive: true });

  const md = `# Hermes — cycle ${today}

> ${summary}

Modele : ${MODEL} · autonomie : **L2 (propose + draft, humain merge)** · ${proposals.length} propositions.

${proposals
  .map(
    (p, i) => `## ${i + 1}. ${p.title}  \`ICE ${p.score}\`
- **Surface** : ${p.surface}
- **Hypothese** : ${p.hypothesis}
- **Changement** : ${p.change}
- **Metrique** : ${p.metric}
- **Rationale** : ${p.rationale}
- **ICE** : impact ${p.ice?.impact} · confidence ${p.ice?.confidence} · ease ${p.ice?.ease}
- **Doctrine** : ${p.doctrine_ok}
- **Risque** : ${p.risk}`,
  )
  .join("\n\n")}
`;
  const outPath = join(HERE, "proposals", `${today}.md`);
  writeFileSync(outPath, md, "utf8");

  const top = proposals[0];
  const tick = `\n### ${today} — cycle Hermes\n- inputs : ${SURFACES.length} surfaces live, memoire OK, analytics ${cycle.analyticsMode || "qualitatif"}\n- ${proposals.length} propositions (top : "${top?.title}" ICE ${top?.score})\n- statut : propose, en attente merge HITL → \`proposals/${today}.md\`\n`;
  appendFileSync(join(HERE, "PROGRESS.md"), tick, "utf8");

  return { outPath, top };
}

// ---------- RUN ----------
(async () => {
  console.log(`\nHermes — cycle ${today} (modele ${MODEL}, autonomie L2)\n`);
  const obs = await observe();
  console.log(`observe : ${obs.pages.map((p) => p.path + "=" + p.status).join(", ")}`);
  console.log(`analytics : ${obs.analyticsMode}`);
  const cycle = await propose(obs);
  cycle.analyticsMode = obs.analyticsMode;

  if (!cycle.proposals.length || cycle.proposals[0].score < SCORE_THRESHOLD) {
    console.log(`\nSTOP : aucune proposition >= seuil ${SCORE_THRESHOLD} (top = ${cycle.proposals[0]?.score || 0}). Rien a pousser ce cycle.`);
    return;
  }

  const { outPath, top } = emit(cycle);
  console.log(`\n${cycle.proposals.length} propositions -> ${outPath}`);
  console.log(`\nTOP : "${top.title}" (ICE ${top.score})`);
  console.log(`  surface : ${top.surface}`);
  console.log(`  change  : ${top.change}`);
  console.log(`  metrique: ${top.metric}\n`);
  console.log("--- BROUILLON ISSUE CODEX (top) ---\n" + codexIssueBody(top) + "\n--- fin ---");

  if (OPEN_ISSUE) {
    const title = `[Hermes] ${top.title}`;
    const bodyFile = join(HERE, "proposals", `.issue-${today}.md`);
    writeFileSync(bodyFile, codexIssueBody(top), "utf8");
    try {
      const url = execSync(
        `gh issue create --repo ${REPO} --title ${JSON.stringify(title)} --body-file ${JSON.stringify(bodyFile)} --label hermes`,
        { encoding: "utf8" },
      ).trim();
      console.log(`\nIssue Codex ouverte : ${url}`);
      appendFileSync(join(HERE, "PROGRESS.md"), `- issue Codex ouverte : ${url}\n`, "utf8");
    } catch (e) {
      console.log(`\n(gh issue create a echoue : ${String(e).slice(0, 160)}. Le brouillon est ci-dessus, ouvre l'issue a la main.)`);
    }
  } else {
    console.log("\n(ajoute --open-issue pour ouvrir l'issue Codex automatiquement)");
  }
})().catch((e) => {
  console.error("Hermes erreur :", e.message);
  process.exit(1);
});
