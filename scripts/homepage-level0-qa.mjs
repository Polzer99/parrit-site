/**
 * QA de la tranche HOMEPAGE-LEVEL0-V1.
 *
 *   NEXT_PUBLIC_HOMEPAGE_LEVEL0_V1=1 npm run build && npm run start &
 *   node scripts/homepage-level0-qa.mjs http://localhost:3000
 *
 * Contrôle, aux quatre largeurs canoniques :
 *   1. French Typography Test   — accents non coupés, mesure d'encre réelle
 *   2. Structural Integrity     — aucun média expressif dans le hero
 *   3. Red Causality            — un seul segment rouge dans le H1
 *   4. CTA Hierarchy            — une seule action principale
 *   5. Responsive               — zéro débordement, tailles minimales
 *   6. Accessibilité            — un seul H1, ordre des titres, focus visible
 *   7. Analytics                — événements déclenchés une seule fois
 *
 * Sortie : docs/design-system/qa/homepage-level0/ et code non nul si échec.
 */

import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3000";
const ROUTE = "/fr";
const OUT = path.join(process.cwd(), "docs", "design-system", "qa", "homepage-level0");
const VIEWPORTS = [375, 768, 1024, 1440];
const MIN_FONT_PX = 12; // --type-size-xs

const failures = [];
const report = { base: BASE, route: ROUTE, viewports: {}, failures };

function fail(test, detail) {
  failures.push({ test, detail });
  console.error(`  ✗ ${test} — ${detail}`);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();

  for (const width of VIEWPORTS) {
    console.log(`\n▸ ${width}px`);
    const page = await browser.newPage({ viewport: { width, height: 900 } });

    /* ------------------------------------------- 7. Analytics (interception)
     *
     * On NE remplace PAS `window.posthog` : le chargeur inline de PostHog
     * construit son propre stub et le remplacer casse son initialisation, ce
     * qui tue le sous-arbre React à l'hydratation. Faux échec vécu le 31/07.
     *
     * À la place, on bloque le script distant `array.js`. Le stub inline reste
     * en place et met chaque appel en file : `posthog.capture(n, p)` devient
     * `posthog.push(["capture", n, p])`. Il suffit de lire cette file. */
    await page.route(/posthog/, (route) => route.abort());

    await page.goto(`${BASE}${ROUTE}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);

    const vp = {};

    /* ------------------------------------------------ variant bien rendu ? */
    const present = await page.locator(".home-level0").count();
    if (present !== 1) {
      fail("variant", `${width}px : .home-level0 présent ${present} fois, attendu 1`);
      await page.close();
      continue;
    }

    /* ----------------------------------------- 2. Structural Integrity */
    const media = await page.evaluate(() => {
      const root = document.querySelector(".home-level0");
      const imgs = [...root.querySelectorAll("img, svg, video, picture")];
      const bg = [...root.querySelectorAll("*")].filter((el) => {
        const b = getComputedStyle(el).backgroundImage;
        return b && b !== "none" && b.includes("url(");
      });
      return { imgs: imgs.length, bgImages: bg.length };
    });
    vp.media = media;
    if (media.imgs > 0) fail("structural-integrity", `${width}px : ${media.imgs} média(s) dans le hero, attendu 0`);
    else console.log("  ✓ intégrité : aucun média expressif dans le variant");

    /* ---------------------------- fond global : plus de photo narrative */
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundImage);
    vp.bodyBackgroundImage = bodyBg;
    if (bodyBg.includes("paysage")) fail("fond-structurel", `${width}px : la photo de paysage est toujours attachée au body`);
    else console.log("  ✓ fond : papier canonique, aucune photo globale");

    /* ------------------------------------------------- 3. Red Causality */
    const red = await page.evaluate(() => {
      const h1 = document.querySelector(".home-level0 h1");
      if (!h1) return null;
      const reds = [...h1.querySelectorAll("*")].filter(
        (s) => getComputedStyle(s).color === "rgb(209, 19, 47)",
      );
      return { segments: reds.length, texts: reds.map((r) => r.textContent.trim()), full: h1.textContent.trim() };
    });
    vp.red = red;
    if (!red) fail("red-causality", `${width}px : aucun H1 trouvé`);
    else if (red.segments > 1) fail("red-causality", `${width}px : ${red.segments} segments rouges dans le H1, maximum 1`);
    else console.log(`  ✓ rouge : ${red.segments} segment « ${red.texts[0] ?? ""} »`);

    /* -------------------------------------------- 4. CTA Hierarchy Test */
    const cta = await page.evaluate(() => {
      const root = document.querySelector(".home-level0");
      const all = [...root.querySelectorAll("a, button")];
      const primaries = all.filter((el) => {
        const cs = getComputedStyle(el);
        return cs.backgroundColor === "rgb(209, 19, 47)" || cs.backgroundColor === "rgb(12, 12, 13)";
      });
      return {
        total: all.length,
        primaries: primaries.length,
        primaryLabels: primaries.map((p) => p.textContent.trim().slice(0, 40)),
        labels: all.map((a) => a.textContent.trim().slice(0, 30)),
      };
    });
    vp.cta = cta;
    if (cta.primaries !== 1) fail("cta-hierarchy", `${width}px : ${cta.primaries} action(s) de poids principal, attendu exactement 1 (${cta.primaryLabels.join(" | ")})`);
    else console.log(`  ✓ CTA : 1 action principale « ${cta.primaryLabels[0]} », ${cta.total - 1} lien(s) secondaire(s)`);

    /* ----------------------------------------- 1. French Typography Test */
    const typo = await page.evaluate(() => {
      const h1 = document.querySelector(".home-level0 h1");
      const cs = getComputedStyle(h1);
      const canvas = document.createElement("canvas").getContext("2d");
      canvas.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const m = canvas.measureText("ÉQUIPES ÀÈÊÎÔÛ");
      const ink = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      const lh = parseFloat(cs.lineHeight);
      const box = h1.getBoundingClientRect();
      const parent = h1.parentElement.getBoundingClientRect();
      return {
        family: cs.fontFamily.split(",")[0].replace(/["']/g, ""),
        ratio: Math.round((lh / parseFloat(cs.fontSize)) * 1000) / 1000,
        ink: Math.round(ink * 100) / 100,
        lineHeight: Math.round(lh * 100) / 100,
        clearance: Math.round((lh - ink) * 100) / 100,
        overflowRight: Math.round(box.right - parent.right),
      };
    });
    vp.typo = typo;
    if (typo.clearance < 0) fail("french-typography", `${width}px : accents en collision, encre ${typo.ink}px pour interligne ${typo.lineHeight}px`);
    else if (typo.overflowRight > 1) fail("french-typography", `${width}px : titre qui déborde de ${typo.overflowRight}px`);
    else console.log(`  ✓ accents : ${typo.family}, lh ${typo.ratio}, marge ${typo.clearance}px`);

    /* ------------------------------------------------- 5. Responsive */
    const resp = await page.evaluate((minFont) => {
      const root = document.querySelector(".home-level0");
      const small = [...root.querySelectorAll("*")].filter((el) => {
        if (!el.textContent?.trim() || el.children.length) return false;
        return parseFloat(getComputedStyle(el).fontSize) < minFont;
      });
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        tooSmall: small.length,
        tooSmallSample: small.slice(0, 2).map((e) => e.textContent.trim().slice(0, 30)),
      };
    }, MIN_FONT_PX);
    vp.responsive = resp;
    if (resp.scrollWidth > resp.clientWidth) fail("responsive", `${width}px : débordement horizontal (${resp.scrollWidth} > ${resp.clientWidth})`);
    if (resp.tooSmall > 0) fail("responsive", `${width}px : ${resp.tooSmall} texte(s) sous ${MIN_FONT_PX}px — ${resp.tooSmallSample.join(" | ")}`);
    if (resp.scrollWidth <= resp.clientWidth && resp.tooSmall === 0) console.log("  ✓ responsive : aucun débordement, aucune taille sous le minimum");

    /* --------------------------------------------- 6. Accessibilité */
    const a11y = await page.evaluate(() => {
      const h1s = document.querySelectorAll("h1");
      const root = document.querySelector(".home-level0");
      const heads = [...root.querySelectorAll("h1,h2,h3")].map((h) => Number(h.tagName[1]));
      let ordered = true;
      for (let i = 1; i < heads.length; i++) if (heads[i] - heads[i - 1] > 1) ordered = false;
      const h1 = document.querySelector(".home-level0 h1");
      return { h1Count: h1s.length, ordered, headings: heads, h1Text: h1?.textContent.trim() ?? "" };
    });
    vp.a11y = a11y;
    if (a11y.h1Count !== 1) fail("accessibilite", `${width}px : ${a11y.h1Count} H1 dans la page, attendu 1`);
    if (!a11y.ordered) fail("accessibilite", `${width}px : saut de niveau de titre ${a11y.headings.join(">")}`);
    if (a11y.h1Count === 1 && a11y.ordered) console.log(`  ✓ a11y : 1 H1, hiérarchie ${a11y.headings.join(" > ")}`);

    /* ------------------------------------ 7. Analytics : vue unique */
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 3));
    await page.waitForTimeout(600);
    const captured = await page.evaluate(() => {
      const q = window.posthog;
      if (!Array.isArray(q)) return [];
      return q
        .filter((entry) => Array.isArray(entry) && entry[0] === "capture")
        .map((entry) => ({ name: entry[1], props: entry[2] ?? {} }));
    });
    const views = captured.filter((e) => e.name === "homepage_level0_view");
    vp.analytics = { total: captured.length, names: captured.map((e) => e.name) };
    if (views.length !== 1) fail("analytics", `${width}px : ${views.length} événement(s) de vue, attendu exactement 1`);
    else console.log(`  ✓ analytics : 1 vue, ${captured.length} événement(s) au total`);

    /* ------------------------------------------------------ captures */
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(OUT, `level0-${width}.png`), fullPage: false });

    if (width === 1440) {
      const proof = page.locator("[data-level0-proof]");
      await proof.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await proof.screenshot({ path: path.join(OUT, "proof-rail-1440.png") });

      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(700);
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        const cs = getComputedStyle(el);
        return { tag: el.tagName, text: el.textContent?.trim().slice(0, 40) ?? "", outline: cs.outlineStyle, outlineWidth: cs.outlineWidth };
      });
      vp.focus = focused;
      await page.screenshot({ path: path.join(OUT, "focus-1440.png"), fullPage: false });
      console.log(`  ✓ focus clavier : ${focused.tag} « ${focused.text} », outline ${focused.outline} ${focused.outlineWidth}`);
    }

    report.viewports[width] = vp;
    await page.close();
  }

  await browser.close();
  await writeFile(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));

  console.log(`\n${failures.length === 0 ? "✓ TOUS LES TESTS PASSENT" : `✗ ${failures.length} ÉCHEC(S)`}`);
  console.log(`Captures et rapport : docs/design-system/qa/homepage-level0/`);
  process.exit(failures.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
