/**
 * PARRIT-TECH-TRUST-V1 — contrôles propres au concept D.
 *
 * Le harnais général couvre les quatre concepts. Celui-ci ajoute ce que D
 * seul exige : détails à 200 %, états hover et focus, version reduced motion,
 * et la comparaison ancien site / B / D.
 *
 * Usage : node scripts/concept-d-qa.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.PARRIT_BASE ?? "http://localhost:3000";
const OUT = "docs/design-system/qa/visual-reset-v2";
const D = "/art-direction-lab/concept-d";

const problems = [];
const note = (m) => problems.push(m);

const browser = await chromium.launch();
await mkdir(OUT, { recursive: true });

/* --- Détails à 200 %. On rend à deviceScaleFactor 2 puis on cadre. ------- */
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + D, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  await page.locator(".d-panel").screenshot({ path: `${OUT}/d-detail-panel-200.png` });
  await page.locator(".d-gate").screenshot({ path: `${OUT}/d-detail-gate-200.png` });
  await page.locator(".d-hero-lede").screenshot({ path: `${OUT}/d-detail-hero-200.png` });
  await page
    .locator(".d-cases")
    .screenshot({ path: `${OUT}/d-detail-trace-200.png` });
  await ctx.close();
}

/* --- Hover et focus. Aucun composant ne doit rester à l'état navigateur. -- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + D, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  const cta = page.locator("a.d-cta").first();
  const before = await cta.evaluate((el) => getComputedStyle(el).backgroundColor);
  await cta.hover();
  await page.waitForTimeout(320);
  const after = await cta.evaluate((el) => getComputedStyle(el).backgroundColor);
  if (before === after) note("CTA principal : aucun changement au survol");
  await page.locator(".d-actions").first().screenshot({ path: `${OUT}/d-state-hover.png` });

  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const outline = await page.evaluate(() => {
    const el = document.activeElement;
    const cs = getComputedStyle(el);
    return { tag: el.tagName, cls: el.className, w: cs.outlineWidth, c: cs.outlineColor };
  });
  if (outline.w === "0px") note(`focus sans contour visible sur ${outline.tag}.${outline.cls}`);
  await page.locator(".d-hero-lede").screenshot({ path: `${OUT}/d-state-focus.png` });

  const caseHover = page.locator(".d-case").first();
  const cb = await caseHover.evaluate((el) => getComputedStyle(el).backgroundColor);
  await caseHover.hover();
  await page.waitForTimeout(260);
  const ca = await caseHover.evaluate((el) => getComputedStyle(el).backgroundColor);
  if (cb === ca) note("ligne de cas : aucun retour au survol");

  await ctx.close();
}

/* --- Reduced motion. Aucune animation ne doit survivre. ------------------ */
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(BASE + D, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  const moving = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll(".cD *")) {
      const cs = getComputedStyle(el);
      if (cs.animationName !== "none" && cs.animationDuration !== "0s") {
        out.push(`${el.className} ${cs.animationName}`);
      }
    }
    return out;
  });
  moving.forEach((m) => note(`reduced-motion : animation encore active, ${m}`));

  // La flèche des cas est dessinée par animation : elle doit rester visible.
  const drawn = await page.evaluate(() => {
    const el = document.querySelector(".d-case-mid");
    return getComputedStyle(el, "::before").transform;
  });
  if (/matrix\(0/.test(drawn)) note("reduced-motion : la relation rouge reste invisible");

  await page.screenshot({ path: `${OUT}/d-reduced-motion-1440x900.png` });
  await ctx.close();
}

/* --- Comparaison : ancien site, concept B, concept D. ------------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  for (const [id, path] of [
    ["old", "/fr"],
    ["b", "/art-direction-lab/concept-b"],
    ["d", D],
  ]) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/compare-${id}.png` });
  }
  await ctx.close();
}

/* --- Probité : tout bloc de démonstration porte son label. --------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + D, { waitUntil: "networkidle" });
  const txt = await page.evaluate(() => document.body.innerText.toLowerCase());
  for (const label of ["exemple de trace", "interface de démonstration", "flux type", "specimen"]) {
    if (!txt.includes(label)) note(`label de démonstration absent : ${label}`);
  }
  // Aucun chiffre de résultat ne doit apparaître dans la page.
  const claims = txt.match(/\b\d+\s?(%|x|fois plus|heures gagnées)\b/g);
  if (claims) note(`chiffre de résultat non vérifié : ${claims.join(", ")}`);
  await ctx.close();
}

await browser.close();
console.log(problems.length ? `PROBLÈMES (${problems.length})` : "Aucun problème.");
problems.forEach((p) => console.log("  ✗ " + p));
process.exit(problems.length ? 1 : 0);
