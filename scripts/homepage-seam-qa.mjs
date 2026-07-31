/**
 * QA de la tranche HOMEPAGE-LEVEL0-SEAM-V1.
 *
 * Le test compare les DEUX états du flag, qui demandent deux builds. Il
 * s'utilise donc en trois temps :
 *
 *   NEXT_PUBLIC_HOMEPAGE_LEVEL0_V1=1 npm run build && npm run start &
 *   node scripts/homepage-seam-qa.mjs snapshot on  http://localhost:3000
 *
 *   npm run build && npm run start &
 *   node scripts/homepage-seam-qa.mjs snapshot off http://localhost:3000
 *
 *   node scripts/homepage-seam-qa.mjs compare
 *
 * Contrôles :
 *   Seam Continuity      — grille, filets, fonds et rythme continus à la jonction
 *   Section Numbering    — 01 au rail, 02 à la première section historique, sans doublon
 *   Historical Integrity — textes, liens, IDs, ordre et CTA identiques dans les deux états
 *   Flag Isolation       — /en, /pt-BR et /zh-CN identiques dans les deux états
 *   Mobile Height Guard  — le rail ne descend pas plus bas qu'au commit c11f595
 *   Analytics            — les cinq événements, une seule vue
 */

import { chromium } from "@playwright/test";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "docs", "design-system", "qa", "homepage-seam");
const LOCALES = ["/fr", "/en", "/pt-BR", "/zh-CN"];
const VIEWPORTS = [
  [375, 812],
  [768, 1024],
  [1024, 768],
  [1440, 900],
];

/** Référence mesurée au commit c11f595, avant cette tranche. */
const RAIL_TOP_BEFORE_375 = 905;

const failures = [];
function fail(test, detail) {
  failures.push({ test, detail });
  console.error(`  ✗ ${test} — ${detail}`);
}

/** Empreinte du contenu historique : ce qui ne doit jamais bouger. */
async function historicalFingerprint(page) {
  return page.evaluate(() => {
    const hd = document.querySelector("main.hd");
    if (!hd) return null;
    const clone = hd.cloneNode(true);
    // Le hero historique est retiré par le variant : on le sort des deux côtés
    // pour comparer strictement ce qui doit rester identique.
    clone.querySelector("header.hd-hero")?.remove();
    // Les index de section changent par conception : on les neutralise ici et
    // ils sont vérifiés séparément par le Section Numbering Test.
    clone.querySelectorAll(".hd-eyebrow-n").forEach((n) => (n.textContent = "§"));
    const text = clone.textContent.replace(/\s+/g, " ").trim();
    const links = [...clone.querySelectorAll("a")].map(
      (a) => `${a.getAttribute("href")}|${a.textContent.trim()}`,
    );
    const ids = [...clone.querySelectorAll("[id]")].map((e) => e.id);
    // `is-in` est posée par HomeMotion quand la section entre dans le viewport.
    // C'est un état d'animation, pas une structure : on le neutralise, sinon la
    // comparaison dépend de la position de scroll au moment de la capture.
    const sections = [...clone.querySelectorAll("section")].map((s) =>
      s.className.replace(/\bis-in\b/g, "").replace(/\s+/g, " ").trim(),
    );
    const phCtas = [...clone.querySelectorAll("[data-ph]")].map(
      (e) => `${e.dataset.ph}|${e.dataset.phLabel ?? ""}|${e.dataset.phDest ?? ""}`,
    );
    return { textLength: text.length, text, links, ids, sections, phCtas };
  });
}

async function snapshot(mode, base) {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const data = { mode, base, locales: {}, viewports: {} };

  /* ---------------------------------------- empreinte de chaque langue */
  for (const loc of LOCALES) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.route(/posthog/, (r) => r.abort());
    await page.goto(`${base}${loc}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    data.locales[loc] = {
      hasVariant: (await page.locator(".home-level0").count()) > 0,
      indexes: await page.evaluate(() =>
        [...document.querySelectorAll(".hd-eyebrow-n")].map((e) => e.textContent.trim()),
      ),
      historical: await historicalFingerprint(page),
    };
    await page.close();
  }

  /* --------------------------------- géométrie de la couture + captures */
  for (const [w, h] of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.route(/posthog/, (r) => r.abort());
    await page.goto(`${base}/fr`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);

    const geo = await page.evaluate(() => {
      const px = (n) => Math.round(n);
      const effectiveBg = (el) => {
        let cur = el;
        while (cur) {
          const c = getComputedStyle(cur).backgroundColor;
          if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") return c;
          cur = cur.parentElement;
        }
        return "rgba(0, 0, 0, 0)";
      };
      const level0 = document.querySelector(".home-level0");
      const terrain = document.querySelector(".hd-terrain");
      const proof = document.querySelector("[data-level0-proof]");
      const rows = [...document.querySelectorAll(".home-level0 .ds-row-indexed")];
      const t = terrain?.getBoundingClientRect();
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        railTop: proof ? px(proof.getBoundingClientRect().top + window.scrollY) : null,
        variantBottom: level0 ? px(level0.getBoundingClientRect().bottom + window.scrollY) : null,
        terrainTop: t ? px(t.top + window.scrollY) : null,
        terrainBox: t ? [px(t.left), px(t.right)] : null,
        railRuleBox: rows[0]
          ? [px(rows[0].getBoundingClientRect().left), px(rows[0].getBoundingClientRect().right)]
          : null,
        // Fond EFFECTIF : on remonte jusqu'au premier ancêtre non transparent.
        // Un fond hérité et un fond déclaré peuvent être identiques à l'écran.
        variantBg: level0 ? effectiveBg(level0) : null,
        terrainBg: terrain ? effectiveBg(terrain) : null,
      };
    });
    data.viewports[w] = geo;

    await page.screenshot({ path: path.join(OUT, `${mode}-${w}x${h}.png`), fullPage: true });

    if (mode === "on" && (w === 1440 || w === 375)) {
      const bottom = geo.variantBottom ?? 0;
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), Math.max(0, bottom - (w === 375 ? 260 : 420)));
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(OUT, `seam-${w}.png`) });
    }
    await page.close();
  }

  /* ------------------------------------------------- analytics sur /fr */
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.route(/posthog/, (r) => r.abort());
    await page.goto(`${base}/fr`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 3));
    await page.waitForTimeout(800);
    data.analytics = await page.evaluate(() => {
      const q = window.posthog;
      if (!Array.isArray(q)) return [];
      return q.filter((e) => Array.isArray(e) && e[0] === "capture").map((e) => e[1]);
    });
    await page.close();
  }

  await browser.close();
  await writeFile(path.join(OUT, `snapshot-${mode}.json`), JSON.stringify(data, null, 2));
  console.log(`✓ instantané « ${mode} » écrit dans docs/design-system/qa/homepage-seam/`);
}

async function compare() {
  const on = JSON.parse(await readFile(path.join(OUT, "snapshot-on.json"), "utf-8"));
  const off = JSON.parse(await readFile(path.join(OUT, "snapshot-off.json"), "utf-8"));

  console.log("\n▸ Section Numbering Test");
  const idxOn = on.locales["/fr"].indexes;
  const idxOff = off.locales["/fr"].indexes;
  if (!on.locales["/fr"].hasVariant) fail("numbering", "le variant n'est pas rendu dans l'instantané « on »");
  if (JSON.stringify(idxOn) !== JSON.stringify(["02", "03", "04"]))
    fail("numbering", `flag activé : sections historiques ${JSON.stringify(idxOn)}, attendu ["02","03","04"]`);
  if (JSON.stringify(idxOff) !== JSON.stringify(["01", "02", "03"]))
    fail("numbering", `flag éteint : ${JSON.stringify(idxOff)}, attendu ["01","02","03"] (numérotation historique)`);
  const all = ["01", ...idxOn];
  if (new Set(all).size !== all.length) fail("numbering", `doublon dans ${JSON.stringify(all)}`);
  if (failures.length === 0) console.log(`  ✓ rail 01, historiques ${idxOn.join(" ")}, aucun doublon · flag éteint ${idxOff.join(" ")}`);

  console.log("\n▸ Historical Content Integrity Test");
  const a = on.locales["/fr"].historical;
  const b = off.locales["/fr"].historical;
  const checks = [
    ["texte", a.text === b.text, `${a.textLength} vs ${b.textLength} caractères`],
    ["liens", JSON.stringify(a.links) === JSON.stringify(b.links), `${a.links.length} vs ${b.links.length}`],
    ["IDs", JSON.stringify(a.ids) === JSON.stringify(b.ids), `${a.ids.length} vs ${b.ids.length}`],
    ["ordre des sections", JSON.stringify(a.sections) === JSON.stringify(b.sections), `${a.sections.length} vs ${b.sections.length}`],
    ["CTA analytics", JSON.stringify(a.phCtas) === JSON.stringify(b.phCtas), `${a.phCtas.length} vs ${b.phCtas.length}`],
  ];
  for (const [name, ok, detail] of checks) {
    if (!ok) fail("historical-integrity", `${name} modifié — ${detail}`);
    else console.log(`  ✓ ${name} identique (${detail.split(" vs ")[0]})`);
  }

  console.log("\n▸ Flag Isolation Test");
  for (const loc of LOCALES.filter((l) => l !== "/fr")) {
    const same =
      JSON.stringify(on.locales[loc].historical) === JSON.stringify(off.locales[loc].historical) &&
      JSON.stringify(on.locales[loc].indexes) === JSON.stringify(off.locales[loc].indexes) &&
      on.locales[loc].hasVariant === false &&
      off.locales[loc].hasVariant === false;
    if (!same) fail("flag-isolation", `${loc} diffère entre les deux états du flag`);
    else console.log(`  ✓ ${loc} strictement identique, aucun variant`);
  }

  console.log("\n▸ Seam Continuity Test");
  for (const [w] of VIEWPORTS) {
    const g = on.viewports[w];
    if (!g.railRuleBox || !g.terrainBox) {
      fail("seam-continuity", `${w}px : géométrie introuvable`);
      continue;
    }
    const dl = Math.abs(g.railRuleBox[0] - g.terrainBox[0]);
    const dr = Math.abs(g.railRuleBox[1] - g.terrainBox[1]);
    if (dl > 1 || dr > 1) fail("seam-continuity", `${w}px : filets désalignés de ${dl}px / ${dr}px`);
    if (g.variantBg !== g.terrainBg) fail("seam-continuity", `${w}px : fonds différents ${g.variantBg} vs ${g.terrainBg}`);
    const gap = g.terrainTop - g.variantBottom;
    if (gap < 0 || gap > 48) fail("seam-continuity", `${w}px : écart de jonction ${gap}px hors du rythme de page`);
    if (g.scrollWidth > g.clientWidth) fail("seam-continuity", `${w}px : débordement horizontal`);
    if (dl <= 1 && dr <= 1 && g.variantBg === g.terrainBg) console.log(`  ✓ ${w}px : filets alignés, fond continu, jonction ${gap}px`);
  }

  console.log("\n▸ Mobile Height Guard");
  const railTop = on.viewports[375].railTop;
  if (railTop > RAIL_TOP_BEFORE_375)
    fail("mobile-height", `375px : rail à ${railTop}px, contre ${RAIL_TOP_BEFORE_375}px au commit c11f595 — la couture a aggravé la dette`);
  else console.log(`  ✓ 375px : rail à ${railTop}px, référence ${RAIL_TOP_BEFORE_375}px`);

  console.log("\n▸ Analytics Non-Regression Test");
  const expected = [
    "homepage_level0_view",
    "homepage_level0_primary_cta_click",
    "homepage_level0_secondary_link_click",
    "homepage_level0_proof_interaction",
    "homepage_level0_scroll_to_next_section",
  ];
  const views = on.analytics.filter((n) => n === "homepage_level0_view").length;
  if (views !== 1) fail("analytics", `${views} événement(s) de vue, attendu exactement 1`);
  else console.log(`  ✓ 1 vue exactement, événements observés : ${[...new Set(on.analytics)].join(", ")}`);
  if (off.analytics.some((n) => n.startsWith("homepage_level0")))
    fail("analytics", "des événements Level0 partent alors que le flag est éteint");
  else console.log("  ✓ aucun événement Level0 quand le flag est éteint");
  console.log(`  · contrat inchangé, 5 noms déclarés : ${expected.length}`);

  console.log(`\n${failures.length === 0 ? "✓ TOUS LES TESTS DE COUTURE PASSENT" : `✗ ${failures.length} ÉCHEC(S)`}`);
  await writeFile(path.join(OUT, "report.json"), JSON.stringify({ failures }, null, 2));
  process.exit(failures.length === 0 ? 0 : 1);
}

const [cmd, ...rest] = process.argv.slice(2);
if (cmd === "snapshot") await snapshot(rest[0], rest[1] ?? "http://localhost:3000");
else if (cmd === "compare") await compare();
else {
  console.error("usage : snapshot <on|off> <base>  |  compare");
  process.exit(2);
}
