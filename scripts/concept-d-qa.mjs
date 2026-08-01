/**
 * CONCEPT D REGRESSION TEST — contrôles propres au prototype Concept D.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * PORTÉE. Ce harnais teste UNIQUEMENT le prototype Concept D, sur sa seule
 * route. Ce n'est PAS un test de conformité du futur site.
 *
 * Concept D n'est pas la direction finale de Parrit.ai (ADR-019). Une
 * direction future qui utilise une autre composition, donne plus de
 * profondeur au produit, réduit la place de Barlow Condensed, modifie la
 * grille, représente autrement les agents, change le rythme des sections ou
 * abandonne certains composants de D **ne peut pas faire échouer ce test** :
 * il ne regarde jamais ailleurs que `/art-direction-lab/concept-d`.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Ce qu'il vérifie : la reproductibilité du prototype, la présence de ses
 * composants, son accessibilité, et l'absence de régression involontaire.
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

/* --- Non-régression du prototype. Ces contrôles décrivent l'état connu de
       Concept D, pas une règle imposée à une direction future. Ils servent à
       repérer une casse involontaire du prototype, rien d'autre. --- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + D, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  // Les composants du prototype, par leur ancre structurelle. Leur absence
  // signale une casse de D, pas une infraction à un canon.
  const COMPOSANTS = {
    TechHero: ".d-hero .d-panel",
    ExecutionTrace: ".d-steps .d-step",
    HumanGate: ".d-gate",
    "Registre de mission": ".d-mission-row",
    "Cas d'usage": ".d-case",
    SystemTopology: ".d-node",
    "Méthode en séquence": ".d-seq-step",
    BeforeAfterFlow: ".d-ba-row",
    HermesActivity: ".d-journal-row",
    ProofLedger: ".d-ledger-row",
    FounderValidation: ".d-founder-fig img",
    TrustRail: ".d-trust-inner p",
  };
  for (const [nom, sel] of Object.entries(COMPOSANTS)) {
    if ((await page.locator(sel).count()) === 0) note(`régression D : ${nom} absent (${sel})`);
  }

  // Palette, grille et fontes telles que le prototype les a figées pour
  // LUI-MÊME. Une direction future est libre de toutes les changer.
  const canon = await page.evaluate(() => {
    const cs = getComputedStyle(document.querySelector(".cD"));
    const titre = getComputedStyle(document.querySelector(".d-title")).fontFamily;
    const mono = getComputedStyle(document.querySelector(".d-mono")).fontFamily;
    return {
      paper: cs.getPropertyValue("--paper").trim(),
      ink: cs.getPropertyValue("--ink").trim(),
      red: cs.getPropertyValue("--red").trim(),
      grille: getComputedStyle(document.querySelector(".d-hero-grid"))
        .gridTemplateColumns.split(" ").length,
      titre,
      mono,
    };
  });
  if (canon.paper !== "#fffdfa") note(`régression D : papier ${canon.paper}, le prototype utilise #fffdfa`);
  if (canon.ink !== "#0c0c0d") note(`régression D : encre ${canon.ink}, le prototype utilise #0c0c0d`);
  if (canon.red !== "#d1132f") note(`régression D : rouge ${canon.red}, le prototype utilise #d1132f`);
  if (canon.grille !== 12) note(`régression D : grille à ${canon.grille} colonnes, le prototype en a 12`);
  if (!/Barlow Condensed/.test(canon.titre)) note("régression D : les grands titres du prototype ne sont plus en Barlow Condensed");
  if (!/Mono/.test(canon.mono)) note("régression D : la couche technique du prototype n'est plus en Geist Mono");

  // Le prototype ne comporte ni rayon ni ombre. C'est un parti pris de D.
  const chrome = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll(".cD *")) {
      const cs = getComputedStyle(el);
      if (cs.borderRadius !== "0px" && cs.borderRadius !== "") out.push(`rayon ${cs.borderRadius} sur ${el.className}`);
      if (cs.boxShadow !== "none") out.push(`ombre sur ${el.className}`);
    }
    return out.slice(0, 5);
  });
  chrome.forEach((c) => note(`régression D : ${c}`));

  // L'attribution Hermes est une obligation permanente, indépendante de toute
  // direction : elle reste vérifiée quoi qu'il arrive.
  // `innerText` renvoie le texte APRÈS text-transform : la comparaison doit
  // ignorer la casse, l'attribution est rendue en capitales.
  const txt = await page.evaluate(() => document.body.innerText);
  if (!/nous research/i.test(txt) || !/mit license/i.test(txt)) {
    note("attribution Hermes absente, obligation permanente");
  }

  // La photographie du fondateur doit rester réelle : règle de fond, elle
  // survivra à Concept D.
  const src = await page.locator(".d-founder-fig img").getAttribute("src");
  if (/branded/.test(src ?? "")) note("portrait brandé câblé, la photographie doit rester réelle");

  // Accessibilité du prototype.
  const a11y = await page.evaluate(() => {
    const out = [];
    if (document.querySelectorAll("h1").length !== 1) out.push("il faut exactement un H1");
    for (const img of document.querySelectorAll(".cD img")) {
      if (!img.getAttribute("alt")) out.push(`image sans alt : ${img.getAttribute("src")}`);
    }
    // Les niveaux de titre ne doivent pas sauter.
    const niveaux = [...document.querySelectorAll(".cD h1, .cD h2, .cD h3")].map((h) =>
      Number(h.tagName[1]),
    );
    for (let i = 1; i < niveaux.length; i += 1) {
      if (niveaux[i] - niveaux[i - 1] > 1) out.push(`saut de niveau h${niveaux[i - 1]} vers h${niveaux[i]}`);
    }
    // Toute cible interactive doit être atteignable au clavier.
    for (const a of document.querySelectorAll(".cD a")) {
      if (a.getAttribute("tabindex") === "-1") out.push("lien retiré de la navigation clavier");
    }
    return out;
  });
  a11y.forEach((m) => note(`accessibilité D : ${m}`));

  await ctx.close();
}

await browser.close();
console.log(problems.length ? `PROBLÈMES (${problems.length})` : "Aucun problème.");
problems.forEach((p) => console.log("  ✗ " + p));
process.exit(problems.length ? 1 : 0);
