#!/usr/bin/env node
/**
 * Captures de recette du Brand Lab, desktop et mobile.
 * Usage : node scripts/brand-lab-shots.mjs [baseUrl]
 * Sortie : artifacts/brand-lab/<page>-<desktop|mobile>.jpg
 *
 * Sert deux choses : la revue visuelle par Paul et Maxime, et le contrôle que
 * le mobile est une composition tenue, pas un desktop écrasé.
 */
import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.argv[2] || "http://localhost:3000";
const OUT = path.join(process.cwd(), "artifacts", "brand-lab");
const PAGES = ["inspirations", "paul", "maxime", "parrit"];

const VIEWS = [
  { key: "desktop", opts: { viewport: { width: 1440, height: 900 } }, full: true },
  {
    key: "mobile",
    opts: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
    full: true,
  },
];

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const problems = [];
  for (const view of VIEWS) {
    const ctx = await browser.newContext({ ...view.opts, locale: "fr-FR" });
    for (const p of PAGES) {
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(String(e).slice(0, 140)));
      const res = await page.goto(`${BASE}/brand-lab/${p}`, {
        waitUntil: "networkidle",
        timeout: 40000,
      });
      // Force la révélation au scroll avant la capture pleine page.
      //
      // Piège mesuré le 12/08 : la page pose scroll-behavior:smooth, donc
      // window.scrollTo ANIME au lieu de sauter. Un pas toutes les 90 ms ne
      // laisse jamais le défilement atteindre le bas, et les dernières sections
      // sortaient à opacity 0 sur les captures. On neutralise le lissage le
      // temps de la recette, puis on le rend.
      await page.evaluate(async () => {
        const root = document.documentElement;
        const previous = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        const step = Math.round(window.innerHeight * 0.7);
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 110));
        }
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((r) => setTimeout(r, 300));
        window.scrollTo(0, 0);
        root.style.scrollBehavior = previous;
      });
      await page.waitForTimeout(1400);

      // Une section restée invisible est un défaut, pas un détail de capture.
      const hidden = await page.evaluate(
        () =>
          [...document.querySelectorAll(".lab-reveal")].filter(
            (el) => getComputedStyle(el).opacity !== "1"
          ).length
      );
      if (hidden) problems.push(`${p}/${view.key} : ${hidden} bloc(s) non révélé(s)`);

      // débordement horizontal : le mobile ne doit jamais scroller de côté
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1
      );
      if (overflow) problems.push(`${p}/${view.key} : débordement horizontal`);
      if (res && res.status() !== 200) problems.push(`${p}/${view.key} : HTTP ${res.status()}`);
      errors.forEach((e) => problems.push(`${p}/${view.key} : ${e}`));

      const buf = await page.screenshot({ type: "jpeg", quality: 76, fullPage: view.full });
      await writeFile(path.join(OUT, `${p}-${view.key}.jpg`), buf);
      console.log(`captured ${p}-${view.key}${overflow ? "  (DEBORDEMENT)" : ""}`);
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  if (problems.length) {
    console.log("\nPROBLEMES :");
    problems.forEach((p) => console.log("  " + p));
    process.exitCode = 1;
  } else {
    console.log("\nAucun débordement, aucune erreur de page.");
  }
}

main();
