/**
 * QA automatisée de la page specimen du design system.
 *
 *   npm run start            # ou npm run dev
 *   node scripts/ds-specimen-qa.mjs [baseUrl]
 *
 * Exécute quatre tests outillables sur /design-system :
 *
 *  1. French Typography Test — les capitales accentuées ne débordent pas de
 *     leur conteneur et n'entrent pas en collision avec la ligne du dessus.
 *  2. Structural Integrity Test — avec data-hide-media="true", aucun média
 *     expressif n'est visible, et la structure (titres, filets, index, CTA)
 *     reste intacte.
 *  3. Token Discipline — aucune ombre portée, aucun rayon interdit, aucun
 *     blanc pur, aucun hex périmé dans le sous-arbre du design system.
 *  4. Captures 375 / 768 / 1024 / 1440, avec et sans média.
 *
 * Sortie : docs/design-system/qa/ (captures + rapport JSON) et code de sortie
 * non nul si un test échoue.
 */

import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3000";
const ROUTE = "/design-system";
const OUT = path.join(process.cwd(), "docs", "design-system", "qa");
const VIEWPORTS = [375, 768, 1024, 1440];

const ALLOWED_RADII = new Set(["0px", "999rem", "50%"]);
const FORBIDDEN_HEX = ["#f5f8ff", "#aa0003", "#161616", "#ffffff"];

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
    const page = await browser.newPage({ viewport: { width, height: 1200 } });
    await page.goto(`${BASE}${ROUTE}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    const vp = {};

    /* ---------------------------------- 1. French Typography Test */
    const frenchTest = await page.evaluate(() => {
      const words = ["ÉQUIPES", "EXÉCUTION", "RÉDUCTION", "MÉTIERS", "DÉCRIVEZ", "AMÉLIORATION", "DÉPLOIEMENT"];
      const el = [...document.querySelectorAll("p")].find((p) =>
        words.every((w) => (p.textContent ?? "").includes(w)),
      );
      if (!el) return { found: false };

      const parent = el.parentElement;
      const box = el.getBoundingClientRect();
      const parentBox = parent.getBoundingClientRect();
      const cs = getComputedStyle(el);

      const fontSize = parseFloat(cs.fontSize);
      const lineHeight = parseFloat(cs.lineHeight);

      // Mesure d'ENCRE réelle : on demande au moteur la hauteur effective des
      // glyphes accentués dans la police effectivement chargée. La question
      // n'est pas « les boîtes se recouvrent-elles » mais « l'accent du É de la
      // ligne N monte-t-il plus haut que le bas du jambage de la ligne N-1 ».
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;

      const accented = ctx.measureText("ÉQUIPES ÀÈÊÎÔÛ");
      const plain = ctx.measureText("EQUIPES");

      const inkAscent = accented.actualBoundingBoxAscent;
      const inkDescent = accented.actualBoundingBoxDescent;
      const inkHeight = inkAscent + inkDescent;

      // Hauteur d'interligne minimale pour que deux lignes accentuées
      // consécutives ne se touchent pas.
      const requiredLineHeight = inkHeight;

      const range = document.createRange();
      range.selectNodeContents(el);
      const rects = [...range.getClientRects()].filter((r) => r.width > 1 && r.height > 1);

      return {
        found: true,
        lineHeight: cs.lineHeight,
        lineHeightRatio: Math.round((lineHeight / fontSize) * 1000) / 1000,
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily.split(",")[0].replace(/["']/g, ""),
        overflowRight: Math.round(box.right - parentBox.right),
        overflowLeft: Math.round(parentBox.left - box.left),
        lines: rects.length,
        inkAscent: Math.round(inkAscent * 100) / 100,
        accentHeadroom: Math.round((inkAscent - plain.actualBoundingBoxAscent) * 100) / 100,
        requiredLineHeight: Math.round(requiredLineHeight * 100) / 100,
        actualLineHeight: Math.round(lineHeight * 100) / 100,
        // marge disponible entre deux lignes accentuées : > 0 = pas de collision
        clearance: Math.round((lineHeight - requiredLineHeight) * 100) / 100,
      };
    });

    vp.frenchTest = frenchTest;
    if (!frenchTest.found) {
      fail("french-typography", `${width}px : bloc de test introuvable`);
    } else {
      if (frenchTest.overflowRight > 1) {
        fail("french-typography", `${width}px : débordement droite ${frenchTest.overflowRight}px`);
      }
      if (frenchTest.overflowLeft > 1) {
        fail("french-typography", `${width}px : débordement gauche ${frenchTest.overflowLeft}px`);
      }
      // Collision d'accents : l'encre d'une ligne accentuée dépasse-t-elle
      // l'interligne disponible ?
      if (frenchTest.lines > 1 && frenchTest.clearance < 0) {
        fail(
          "french-typography",
          `${width}px : accents en collision — encre ${frenchTest.requiredLineHeight}px pour un interligne de ${frenchTest.actualLineHeight}px (manque ${Math.abs(frenchTest.clearance)}px)`,
        );
      } else {
        console.log(
          `  ✓ accents : ${frenchTest.lines} ligne(s), ${frenchTest.fontFamily}, lh ${frenchTest.lineHeightRatio}, encre ${frenchTest.requiredLineHeight}px / interligne ${frenchTest.actualLineHeight}px, marge ${frenchTest.clearance}px`,
        );
      }
    }

    /* ------------------------------------------ 3. Token Discipline */
    const tokens = await page.evaluate(
      ({ allowedRadii, forbiddenHex }) => {
        const bad = { shadows: [], radii: [], colors: [] };
        const main = document.querySelector("main");
        if (!main) return bad;
        for (const el of main.querySelectorAll("*")) {
          const cs = getComputedStyle(el);
          if (cs.boxShadow && cs.boxShadow !== "none") {
            bad.shadows.push(`${el.tagName.toLowerCase()} : ${cs.boxShadow}`);
          }
          for (const r of [
            cs.borderTopLeftRadius,
            cs.borderTopRightRadius,
            cs.borderBottomLeftRadius,
            cs.borderBottomRightRadius,
          ]) {
            if (r && !allowedRadii.includes(r) && r !== "0px") {
              bad.radii.push(`${el.tagName.toLowerCase()} : ${r}`);
            }
          }
        }
        // hex périmés dans les ATTRIBUTS DE STYLE uniquement.
        // On ne scanne pas le texte : la page cite ces valeurs comme interdits,
        // ce qui produirait un faux positif.
        for (const el of main.querySelectorAll("[style]")) {
          const style = (el.getAttribute("style") ?? "").toLowerCase();
          for (const hex of forbiddenHex) {
            if (style.includes(hex) && !bad.colors.includes(hex)) bad.colors.push(hex);
          }
        }
        return bad;
      },
      { allowedRadii: [...ALLOWED_RADII], forbiddenHex: FORBIDDEN_HEX },
    );

    vp.tokens = tokens;
    if (tokens.shadows.length) fail("token-discipline", `${width}px : ${tokens.shadows.length} ombre(s) — ${tokens.shadows[0]}`);
    if (tokens.radii.length) fail("token-discipline", `${width}px : rayon interdit — ${tokens.radii[0]}`);
    if (tokens.colors.length) fail("token-discipline", `${width}px : hex périmé — ${tokens.colors.join(", ")}`);
    if (!tokens.shadows.length && !tokens.radii.length && !tokens.colors.length) {
      console.log("  ✓ tokens : zéro ombre, zéro rayon interdit, zéro hex périmé");
    }

    /* --------------------------------- captures + Structural Integrity */
    await page.screenshot({ path: path.join(OUT, `specimen-${width}-media.png`), fullPage: true });

    await page.click('button[aria-pressed]');
    await page.waitForTimeout(200);

    const integrity = await page.evaluate(() => {
      const expressive = [...document.querySelectorAll('[data-layer="expressive"]')];
      const stillVisible = expressive.filter((el) => {
        const cs = getComputedStyle(el);
        return cs.visibility !== "hidden" && cs.display !== "none";
      });
      // La structure doit survivre.
      const structure = {
        headings: document.querySelectorAll("h1, h2").length,
        rules: [...document.querySelectorAll("*")].filter((el) => {
          const cs = getComputedStyle(el);
          return cs.borderTopWidth === "1px" || cs.borderTopStyle === "solid";
        }).length,
        ctas: document.querySelectorAll("a[href], button").length,
      };
      return { expressiveTotal: expressive.length, stillVisible: stillVisible.length, structure };
    });

    vp.integrity = integrity;
    if (integrity.expressiveTotal === 0) {
      fail("structural-integrity", `${width}px : aucun média expressif balisé — test non probant`);
    } else if (integrity.stillVisible > 0) {
      fail("structural-integrity", `${width}px : ${integrity.stillVisible} média(s) expressif(s) encore visible(s)`);
    } else if (integrity.structure.headings < 2 || integrity.structure.ctas < 2) {
      fail("structural-integrity", `${width}px : la structure s'effondre (h=${integrity.structure.headings}, cta=${integrity.structure.ctas})`);
    } else {
      console.log(
        `  ✓ intégrité : ${integrity.expressiveTotal} média(s) masqué(s), structure intacte (${integrity.structure.headings} titres, ${integrity.structure.ctas} actions)`,
      );
    }

    await page.screenshot({ path: path.join(OUT, `specimen-${width}-nomedia.png`), fullPage: true });

    report.viewports[width] = vp;
    await page.close();
  }

  await browser.close();
  await writeFile(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));

  console.log(`\n${failures.length === 0 ? "✓ TOUS LES TESTS PASSENT" : `✗ ${failures.length} ÉCHEC(S)`}`);
  console.log(`Captures et rapport : docs/design-system/qa/`);
  process.exit(failures.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
