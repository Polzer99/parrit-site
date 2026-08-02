/**
 * PARRIT-VISUAL-RESET-V2 — captures et contrôles du laboratoire.
 *
 * Trois choses seulement :
 *   1. captures pleine page des trois concepts, aux quatre largeurs
 *   2. test typographique français sur Barlow Condensed 800 et 900
 *   3. contrôles durs : débordement horizontal, un seul H1, tiret cadratin
 *
 * Ce harnais ne juge PAS la direction artistique. Il vérifie qu'aucun concept
 * n'est disqualifié par un défaut technique avant que Paul ne les compare.
 *
 * Usage : node scripts/art-direction-lab-qa.mjs
 */
import { chromium, webkit } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const BASE = process.env.PARRIT_BASE ?? "http://localhost:3000";
const OUT = "docs/design-system/qa/visual-reset-v2";

const PAGES = [
  { id: "index", path: "/art-direction-lab" },
  { id: "concept-a", path: "/art-direction-lab/concept-a" },
  { id: "concept-b", path: "/art-direction-lab/concept-b" },
  { id: "concept-c", path: "/art-direction-lab/concept-c" },
  { id: "concept-d", path: "/art-direction-lab/concept-d" },
];

const SIZES = [
  { w: 375, h: 812 },
  { w: 390, h: 844 },
  { w: 768, h: 1024 },
  { w: 1024, h: 768 },
  { w: 1440, h: 900 },
];

// Les chaînes imposées par la commande : accents, apostrophe, mots longs.
const STRINGS = [
  "PRISE DE CONSCIENCE",
  "EXÉCUTION",
  "ÉQUIPES",
  "DÉPLOIEMENT",
  "MÉTIERS",
  "AMÉLIORATION",
  "RÉDUCTION",
  "D’UNE IA QUI PARLE À DES AGENTS QUI EXÉCUTENT",
];

const problems = [];
const note = (m) => problems.push(m);

async function shots(browser) {
  for (const p of PAGES) {
    for (const s of SIZES) {
      const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h } });
      const page = await ctx.newPage();
      await page.goto(BASE + p.path, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `${OUT}/${p.id}-${s.w}x${s.h}.png`, fullPage: true });

      // PARRIT-COPY-RESET-V1 : le premier écran est le test des cinq secondes.
      // Il se juge à la hauteur du viewport, pas sur la page entière.
      if (s.w === 1440 || s.w === 375 || s.w === 390) {
        await page.screenshot({ path: `${OUT}/${p.id}-hero-${s.w}x${s.h}.png` });
      }

      // Débordement horizontal : disqualifiant, quel que soit le concept.
      const over = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (over > 1) note(`${p.id} @${s.w} : débordement horizontal de ${over}px`);

      if (s.w === 1440) {
        const h1 = await page.locator("h1").count();
        if (p.id !== "index" && h1 !== 1) note(`${p.id} : ${h1} H1, il en faut exactement 1`);

        const emdash = await page.evaluate(() =>
          (document.body.innerText.match(/—/g) || []).length,
        );
        if (emdash) note(`${p.id} : ${emdash} tiret(s) cadratin dans le texte visible`);

        // Le concept D a son propre préfixe de classes : les deux comptent.
        const cta = await page.locator("a.cta, a.d-cta").count();
        if (p.id !== "index" && cta < 1) note(`${p.id} : aucun CTA`);
      }
      await ctx.close();
    }
  }
}

/**
 * Test typographique. On mesure l'encre réelle des accents plutôt que la boîte
 * de ligne : c'est la seule mesure qui dit si un accent touche le jambage du
 * dessus. Même méthode que le harnais du design system.
 */
async function typo(browser, label) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/art-direction-lab/concept-a", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  const rows = await page.evaluate(
    async ({ strings }) => {
      const out = [];
      for (const weight of [800, 900]) {
        for (const size of [48, 96, 160]) {
          const font = `${weight} ${size}px "Barlow Condensed"`;
          await document.fonts.load(font);
          const c = document.createElement("canvas").getContext("2d");
          c.font = font;
          for (const s of strings) {
            const m = c.measureText(s);
            out.push({
              weight,
              size,
              s,
              width: m.width,
              // Hauteur d'encre au-dessus de la ligne de base : contient l'accent.
              ascent: m.actualBoundingBoxAscent,
              // Distance libre avant la ligne du dessus, à interlignage 0,92.
              slack: size * 0.92 - m.actualBoundingBoxAscent,
              loaded: document.fonts.check(font),
            });
          }
        }
      }
      return out;
    },
    { strings: STRINGS },
  );

  for (const r of rows) {
    if (!r.loaded) note(`${label} : Barlow Condensed ${r.weight} non chargée à ${r.size}px`);
    // Marge négative = l'accent monte dans la ligne précédente.
    if (r.slack < 0) {
      note(
        `${label} : « ${r.s} » ${r.weight}/${r.size}px, accent au-dessus de la ligne (${r.slack.toFixed(1)}px)`,
      );
    }
  }

  // Aucune compression artificielle de la chasse.
  const bad = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll(".disp, .cta, h1, h2, h3")) {
      const cs = getComputedStyle(el);
      if (cs.transform !== "none" && /matrix\(\s*(?!1[,)])/.test(cs.transform)) {
        out.push(`${el.className} transform=${cs.transform}`);
      }
      if (cs.fontStretch !== "100%" && cs.fontStretch !== "normal") {
        out.push(`${el.className} font-stretch=${cs.fontStretch}`);
      }
    }
    return out;
  });
  bad.forEach((b) => note(`${label} : compression artificielle, ${b}`));

  await ctx.close();
  return rows;
}

const browser = await chromium.launch();
await mkdir(OUT, { recursive: true });
await shots(browser);
const rows = await typo(browser, "chromium");
await browser.close();

// Safari : la condensée et les accents s'y comportent différemment.
const wk = await webkit.launch();
const wkRows = await typo(wk, "webkit");
await wk.close();

await writeFile(
  `${OUT}/typo-report.json`,
  JSON.stringify({ chromium: rows, webkit: wkRows }, null, 2),
);

const worst = [...rows, ...wkRows].sort((a, b) => a.slack - b.slack)[0];
console.log(
  `Marge d'accent la plus serrée : ${worst.slack.toFixed(2)}px  (${worst.weight}/${worst.size}px, « ${worst.s} »)`,
);
console.log(problems.length ? `\nPROBLÈMES (${problems.length})` : "\nAucun problème.");
problems.forEach((p) => console.log("  ✗ " + p));
process.exit(problems.length ? 1 : 0);
