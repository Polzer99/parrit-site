/**
 * PRODUCT-LIVING-SYSTEM-SCENE-V1 — contrôles de la scène.
 *
 * Ce harnais teste UNIQUEMENT la route `/art-direction-lab/product-living-scene`.
 * Il ne juge aucune autre direction et ne déclare rien d'approuvé.
 *
 * Le Desire Test n'est PAS ici : il appartient à Paul et ne peut pas être
 * marqué automatiquement comme réussi.
 *
 * Usage : node scripts/living-scene-qa.mjs
 */
import { chromium, webkit } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.PARRIT_BASE ?? "http://localhost:3000";
const OUT = "docs/design-system/qa/living-scene";
const R = "/art-direction-lab/product-living-scene";

const problems = [];
const note = (m) => problems.push(m);

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };
const MOBILE_2 = { width: 375, height: 812 };

async function open(browser, viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport, ...opts });
  const page = await ctx.newPage();
  const erreurs = [];
  page.on("pageerror", (e) => erreurs.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") erreurs.push(m.text());
  });
  await page.goto(BASE + R, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return { ctx, page, erreurs };
}

const phase = (page) => page.locator(".pls").getAttribute("data-phase");
const version = (page) => page.locator(".pls").getAttribute("data-version");

/** Attend une phase, sans jamais dépasser : le gate ne doit pas être franchi. */
async function attendre(page, cible, max = 12000) {
  await page
    .waitForFunction(
      (c) => document.querySelector(".pls")?.getAttribute("data-phase") === c,
      cible,
      { timeout: max },
    )
    .catch(() => note(`la scène n'atteint pas la phase « ${cible} »`));
}

/** Laisse les transitions d'entrée se poser avant de capturer : sinon on
 *  photographie un fondu à mi-course et on croit à un défaut de rendu. */
async function pose(page, ms = 520) {
  await page.waitForTimeout(ms);
}

const browser = await chromium.launch();
await mkdir(OUT, { recursive: true });

/* ================= Living Technology Test + captures desktop ============= */
{
  const { ctx, page, erreurs } = await open(browser, DESKTOP);

  await page.screenshot({ path: `${OUT}/desktop-01-initial.png` });

  await attendre(page, "signal");
  await page.screenshot({ path: `${OUT}/desktop-02-signal.png` });

  await attendre(page, "orchestration");
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/desktop-03-parallele.png` });

  // Plusieurs interventions simultanées : c'est ce qui fait « vivant ».
  const simultanes = await page.locator(".pls-agent.is-actif").count();
  if (simultanes < 2) note(`travail parallèle : ${simultanes} agent(s) actif(s), il en faut au moins 2`);
  const faisceaux = await page.locator(".pls-beam").count();
  if (faisceaux < 2) note(`faisceaux d'exécution : ${faisceaux}, il en faut au moins 2`);

  await attendre(page, "convergence");
  await page.screenshot({ path: `${OUT}/desktop-04-convergence.png` });

  await attendre(page, "gate");
  await pose(page);
  await page.screenshot({ path: `${OUT}/desktop-05-humangate.png` });

  /* ---- Human Control Test : la scène s'arrête RÉELLEMENT. ---- */
  const vAvant = await version(page);
  await page.waitForTimeout(2500);
  if ((await phase(page)) !== "gate") note("Human Control : la scène a repris sans décision humaine");
  if ((await version(page)) !== vAvant) note("Human Control : le dossier a évolué pendant l'arrêt");
  if ((await page.locator(".pls-sortie.is-visible").count()) > 0) {
    note("Human Control : une sortie est visible avant toute décision");
  }

  /* ---- Branche validation ---- */
  await page.getByRole("button", { name: "Valider" }).click();
  await attendre(page, "boucle");
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/desktop-06-sortie-validation.png` });
  await page.locator(".pls-boucle").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/desktop-07-boucle.png` });

  const valider = {
    version: await version(page),
    sortie: (await page.locator(".pls-sortie-titre").innerText().catch(() => "")).trim(),
    regle: (await page.locator(".pls-regle.is-apres").innerText().catch(() => "")).trim(),
  };

  /* ---- Feedback Test ---- */
  if (!valider.regle) note("Feedback : aucune règle modifiée après le retour humain");
  const avant = (await page.locator(".pls-regle.is-avant").innerText().catch(() => "")).trim();
  if (avant && avant === valider.regle) note("Feedback : la règle après retour est identique à la règle avant");

  /* ---- Object Transformation Test ---- */
  const versionsAtteintes = await page.locator(".pls-version.is-atteinte").count();
  if (versionsAtteintes < 4) note(`Object Transformation : seules ${versionsAtteintes} versions atteintes sur 4`);

  /* ---- Branch Test : rejet doit produire autre chose ---- */
  await page.locator(".pls-ctrl", { hasText: "Replay" }).click();
  await attendre(page, "gate");
  await page.getByRole("button", { name: "Rejeter" }).click();
  await attendre(page, "boucle");
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/desktop-08-branche-rejet.png` });

  const rejeter = {
    version: await version(page),
    sortie: (await page.locator(".pls-sortie-titre").innerText().catch(() => "")).trim(),
    regle: (await page.locator(".pls-regle.is-apres").innerText().catch(() => "")).trim(),
  };
  if (valider.sortie === rejeter.sortie) note("Branch : validation et rejet produisent la même sortie");
  if (valider.regle === rejeter.regle) note("Branch : validation et rejet produisent la même règle");
  if (valider.version === rejeter.version) note("Branch : validation et rejet donnent la même version de dossier");

  /* ---- Agent Usefulness Test : aucun agent décoratif. ---- */
  const inutiles = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll(".pls-agent")) {
      const barre = el.querySelector(".pls-agent-barre span");
      const geste = el.querySelector(".pls-agent-geste")?.textContent?.trim();
      if (!barre || !geste) out.push(el.textContent?.slice(0, 30) ?? "?");
    }
    return out;
  });
  inutiles.forEach((a) => note(`Agent Usefulness : agent sans intervention observable, ${a}`));

  /* ---- Non-Dashboard / Non-Report Test ---- */
  const formes = await page.evaluate(() => {
    const out = { tables: 0, cartes: 0, ombres: 0, rayons: 0, lignesTableau: 0 };
    out.tables = document.querySelectorAll(".pls table").length;
    for (const el of document.querySelectorAll(".pls *")) {
      const cs = getComputedStyle(el);
      if (cs.boxShadow !== "none") out.ombres += 1;
      if (cs.borderRadius !== "0px" && cs.borderRadius !== "") out.rayons += 1;
    }
    // Un rapport se reconnaît à ses rangées de tableau répétées.
    out.lignesTableau = document.querySelectorAll(".pls [class*='row'], .pls tr").length;
    return out;
  });
  if (formes.tables > 0) note(`Non-Report : ${formes.tables} tableau(x) dans la scène`);
  if (formes.ombres > 0) note(`Non-Dashboard : ${formes.ombres} ombre(s) de carte`);
  if (formes.rayons > 0) note(`Non-Dashboard : ${formes.rayons} rayon(s) arrondi(s)`);
  if (formes.lignesTableau > 0) note(`Non-Report : ${formes.lignesTableau} rangée(s) de tableau`);

  /* ---- Aucun débordement, aucune erreur ---- */
  const over = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (over > 1) note(`débordement horizontal desktop de ${over}px`);
  erreurs.forEach((e) => note(`erreur console : ${e}`));

  await ctx.close();
}

/* ================= Clavier ================= */
{
  const { ctx, page } = await open(browser, DESKTOP);
  await attendre(page, "gate");
  // La décision doit être atteignable et déclenchable au clavier seul.
  let trouve = false;
  for (let i = 0; i < 40 && !trouve; i += 1) {
    await page.keyboard.press("Tab");
    trouve = await page.evaluate(() =>
      document.activeElement?.classList.contains("pls-btn"),
    );
  }
  if (!trouve) note("clavier : aucune action du HumanGate atteignable au Tab");
  const contour = await page.evaluate(() => getComputedStyle(document.activeElement).outlineWidth);
  if (contour === "0px") note("clavier : focus sans contour visible");
  await page.screenshot({ path: `${OUT}/desktop-09-clavier.png` });
  if (trouve) {
    await page.keyboard.press("Enter");
    await attendre(page, "reprise");
    if ((await phase(page)) === "gate") note("clavier : la validation au clavier ne relance pas la scène");
  }
  await ctx.close();
}

/* ================= Reduced motion ================= */
{
  const { ctx, page } = await open(browser, DESKTOP, { reducedMotion: "reduce" });
  await attendre(page, "gate");
  await pose(page, 200);
  await page.screenshot({ path: `${OUT}/desktop-10-reduced-motion.png` });

  const longues = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll(".pls *")) {
      const cs = getComputedStyle(el);
      const d = parseFloat(cs.transitionDuration) || 0;
      const a = parseFloat(cs.animationDuration) || 0;
      if (d > 0.2 || a > 0.2) out.push(`${el.className} ${cs.transitionDuration}/${cs.animationDuration}`);
    }
    return out.slice(0, 4);
  });
  longues.forEach((l) => note(`reduced-motion : durée longue restante, ${l}`));

  // Le scénario doit rester complet : la décision reste possible et efficace.
  await page.getByRole("button", { name: "Valider" }).click();
  await attendre(page, "boucle");
  if ((await page.locator(".pls-regle.is-apres").count()) === 0) {
    note("reduced-motion : la boucle d'amélioration n'est plus atteignable");
  }
  await ctx.close();
}

/* ================= Pause, step, replay ================= */
{
  const { ctx, page } = await open(browser, DESKTOP);
  await attendre(page, "orchestration");
  await page.locator(".pls-ctrl", { hasText: "Pause" }).click();
  const p1 = await page.locator(".pls-progress span").getAttribute("style");
  await page.waitForTimeout(900);
  const p2 = await page.locator(".pls-progress span").getAttribute("style");
  if (p1 !== p2) note("pause : la scène continue d'avancer");

  await page.locator(".pls-ctrl", { hasText: "Step" }).click();
  const p3 = await page.locator(".pls-progress span").getAttribute("style");
  if (p2 === p3) note("step : aucun avancement");

  await page.locator(".pls-ctrl", { hasText: "Replay" }).click();
  await page.waitForTimeout(120);
  if ((await version(page)) !== "v0") note("replay : le dossier ne revient pas à v0");
  await ctx.close();
}

/* ================= Mobile ================= */
for (const [nom, vp] of [["390x844", MOBILE], ["375x812", MOBILE_2]]) {
  const { ctx, page } = await open(browser, vp);
  await page.screenshot({ path: `${OUT}/mobile-${nom}-01-signal.png`, fullPage: true });
  await attendre(page, "orchestration");
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/mobile-${nom}-02-orchestration.png`, fullPage: true });
  await attendre(page, "gate");
  await pose(page);
  await page.screenshot({ path: `${OUT}/mobile-${nom}-03-humangate.png` });

  // Le gate doit occuper l'écran : c'est l'action majeure de cet écran.
  const couverture = await page.evaluate(() => {
    const g = document.querySelector(".pls-gate");
    if (!g) return 0;
    const r = g.getBoundingClientRect();
    return (r.width * r.height) / (window.innerWidth * window.innerHeight);
  });
  if (couverture < 0.9) note(`mobile ${nom} : le HumanGate ne couvre que ${Math.round(couverture * 100)}% de l'écran`);

  await page.getByRole("button", { name: "Valider" }).click();
  await attendre(page, "boucle");
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/mobile-${nom}-04-sortie.png`, fullPage: true });
  await page.locator(".pls-boucle").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/mobile-${nom}-05-feedback.png`, fullPage: true });

  const over = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (over > 1) note(`mobile ${nom} : débordement horizontal de ${over}px`);

  // Aucun microtexte : rien sous 12 px en mobile.
  const petits = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll(".pls *")) {
      if (!el.textContent?.trim() || el.children.length) continue;
      const px = parseFloat(getComputedStyle(el).fontSize);
      if (px < 12) out.push(`${el.className || el.tagName} ${px}px`);
    }
    return [...new Set(out)].slice(0, 5);
  });
  petits.forEach((p) => note(`mobile ${nom} : microtexte ${p}`));
  await ctx.close();
}

/* ================= Démontage : aucun timer survivant ================= */
{
  const { ctx, page } = await open(browser, DESKTOP);
  await attendre(page, "orchestration");
  const restants = await page.evaluate(async () => {
    let actifs = 0;
    const vraiSetInterval = window.setInterval;
    window.setInterval = (...a) => {
      actifs += 1;
      return vraiSetInterval(...a);
    };
    const vraiClear = window.clearInterval;
    window.clearInterval = (id) => {
      actifs -= 1;
      return vraiClear(id);
    };
    // Démonter la scène en vidant la racine React.
    document.querySelector(".pls")?.remove();
    await new Promise((r) => setTimeout(r, 400));
    return actifs;
  });
  if (restants > 0) note(`${restants} timer(s) encore actif(s) après démontage`);
  await ctx.close();
}

await browser.close();

/* ================= WebKit : rendu et scénario ================= */
{
  const wk = await webkit.launch();
  const { ctx, page, erreurs } = await open(wk, DESKTOP);
  await attendre(page, "gate");
  await pose(page);
  await page.screenshot({ path: `${OUT}/webkit-humangate.png` });
  await page.getByRole("button", { name: "Valider" }).click();
  await attendre(page, "boucle");
  if ((await page.locator(".pls-regle.is-apres").count()) === 0) {
    note("webkit : la boucle d'amélioration n'apparaît pas");
  }
  erreurs.forEach((e) => note(`webkit, erreur console : ${e}`));
  await ctx.close();
  await wk.close();
}

console.log(problems.length ? `PROBLÈMES (${problems.length})` : "Aucun problème.");
problems.forEach((p) => console.log("  ✗ " + p));
console.log("\nDesire Test : arbitrage humain, non marqué automatiquement.");
process.exit(problems.length ? 1 : 0);
