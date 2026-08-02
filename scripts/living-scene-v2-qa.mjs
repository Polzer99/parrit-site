/**
 * PRODUCT-LIVING-SYSTEM-SCENE-V2 — contrôles du second renderer.
 *
 * Ce harnais teste UNIQUEMENT /art-direction-lab/product-living-scene-v2.
 * La V1 garde le sien, `living-scene-qa.mjs`, qui reste vert : les deux
 * renderers sont contrôlés séparément.
 *
 * Il reprend l'intégralité des tests fonctionnels de la V1 — le moteur est le
 * même, il doit donc encore passer — et ajoute les tests de représentation
 * demandés par la tranche.
 *
 * Le Desire Test n'est PAS ici. Il appartient à Paul.
 *
 * Usage : node scripts/living-scene-v2-qa.mjs
 */
import { chromium, webkit } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.PARRIT_BASE ?? "http://localhost:3000";
const OUT = "docs/design-system/qa/living-scene-v2";
const R = "/art-direction-lab/product-living-scene-v2";

const problems = [];
const note = (m) => problems.push(m);

const DESKTOP = { width: 1440, height: 900 };
const MOBILES = [
  ["390x844", { width: 390, height: 844 }],
  ["375x812", { width: 375, height: 812 }],
];

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

const attr = (page, a) => page.locator(".pv2").getAttribute(a);
const phase = (page) => attr(page, "data-phase");
const version = (page) => attr(page, "data-version");

async function attendre(page, cible, max = 14000) {
  await page
    .waitForFunction(
      (c) => document.querySelector(".pv2")?.getAttribute("data-phase") === c,
      cible,
      { timeout: max },
    )
    .catch(() => note(`la scène n'atteint pas la phase « ${cible} »`));
}

/** Laisse les transitions se poser : sinon on photographie un fondu à mi-course. */
const pose = (page, ms = 560) => page.waitForTimeout(ms);

/** Une option du gate, désignée par son intitulé exact. */
const option = (page, label) =>
  page
    .locator(".pv2-option-btn")
    .filter({ has: page.locator(".pv2-option-label", { hasText: new RegExp(`^${label}$`) }) });

const browser = await chromium.launch();
await mkdir(OUT, { recursive: true });

/* ===================== Parcours desktop, branche validation ============== */
{
  const { ctx, page, erreurs } = await open(browser, DESKTOP);

  /* ---- La scène occupe au moins 80 % du premier viewport. ---- */
  const part = await page.evaluate(() => {
    const f = document.querySelector(".pv2-field");
    return f ? f.getBoundingClientRect().height / window.innerHeight : 0;
  });
  if (part < 0.8) note(`la scène n'occupe que ${Math.round(part * 100)}% du viewport, il en faut 80`);

  await page.screenshot({ path: `${OUT}/desktop-01-initial.png` });
  await attendre(page, "signal");
  await pose(page, 300);
  await page.screenshot({ path: `${OUT}/desktop-02-signal.png` });

  await attendre(page, "orchestration");
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/desktop-03-parallele.png` });

  /* ---- Living Technology : plusieurs interventions simultanées. ---- */
  const actifs = await page.locator(".pv2-agent.is-actif").count();
  if (actifs < 2) note(`travail parallèle : ${actifs} agent(s) actif(s), il en faut au moins 2`);
  if (actifs > 4) note(`travail parallèle : ${actifs} agents affichés, la tranche en demande 2 à 4`);
  const beams = await page.locator(".pv2-beam").count();
  if (beams < 2) note(`faisceaux de travail : ${beams}, il en faut au moins 2`);

  /* ---- Red Scarcity Test : en flux normal, le rouge reste rare. ---- */
  const rouge = await page.evaluate(() => {
    const est = (c) => /^rgba?\(20[6-9]|^rgb\(209, 19, 47/.test(c || "");
    let rouges = 0;
    let total = 0;
    for (const el of document.querySelectorAll(".pv2 *")) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      total += 1;
      const cs = getComputedStyle(el);
      if (
        est(cs.color) ||
        est(cs.backgroundColor) ||
        est(cs.borderTopColor) ||
        est(cs.borderLeftColor)
      ) {
        rouges += 1;
      }
    }
    const beamsRouges = [...document.querySelectorAll(".pv2-beam")].filter((b) =>
      est(getComputedStyle(b).stroke),
    ).length;
    return { rouges, total, beamsRouges };
  });
  if (rouge.beamsRouges > 0) note(`Red Scarcity : ${rouge.beamsRouges} faisceau(x) tracé(s) en rouge`);
  const partRouge = rouge.rouges / Math.max(1, rouge.total);
  if (partRouge > 0.12) {
    note(`Red Scarcity : ${Math.round(partRouge * 100)}% des éléments sont rouges en flux normal`);
  }

  /* ---- Document Metaphor Test : le noyau n'est pas un document. ---- */
  const forme = await page.evaluate(() => {
    const g = document.querySelector(".pv2-grille");
    const cs = g ? getComputedStyle(g) : null;
    return {
      colonnes: cs ? cs.gridTemplateColumns.split(" ").length : 0,
      rangees: cs ? cs.gridTemplateRows.split(" ").length : 0,
      formulaires: document.querySelectorAll(".pv2 form, .pv2 input, .pv2 textarea, .pv2 select").length,
      tables: document.querySelectorAll(".pv2 table, .pv2 tr").length,
      modules: document.querySelectorAll(".pv2-module").length,
    };
  });
  if (forme.colonnes < 3) note(`Document Metaphor : le noyau n'a que ${forme.colonnes} colonne(s), c'est une liste`);
  if (forme.rangees < 3) note(`Document Metaphor : le noyau n'a que ${forme.rangees} rangée(s)`);
  if (forme.formulaires > 0) note(`Document Metaphor : ${forme.formulaires} champ(s) de formulaire dans la scène`);
  if (forme.tables > 0) note(`Non-Report : ${forme.tables} élément(s) de tableau`);
  if (forme.modules < 8) note(`Document Metaphor : ${forme.modules} modules, il en faut 8`);

  /* ---- Surface Reality Test : six surfaces, six intérieurs distincts. ---- */
  const interieurs = await page.evaluate(() => {
    const out = {};
    for (const s of document.querySelectorAll(".pv2-surface")) {
      const corps = s.querySelector(".pv2-surface-body")?.firstElementChild;
      out[s.dataset.surface] = corps ? corps.className : null;
    }
    return out;
  });
  const attendus = ["email", "crm", "web", "knowledge", "internal", "calendar"];
  for (const id of attendus) {
    if (!interieurs[id]) note(`Surface Reality : la surface ${id} n'a pas d'intérieur propre`);
  }
  const signatures = new Set(Object.values(interieurs).filter(Boolean));
  if (signatures.size < attendus.length) {
    note(`Surface Reality : ${signatures.size} intérieurs distincts pour ${attendus.length} surfaces`);
  }

  /* ---- Profondeur : ombres dures uniquement, rayons contenus. ---- */
  const matiere = await page.evaluate(() => {
    const out = { molles: [], rayons: [], flous: 0 };
    for (const el of document.querySelectorAll(".pv2 *")) {
      const cs = getComputedStyle(el);
      if (cs.boxShadow && cs.boxShadow !== "none") {
        // Le flou est la 3e longueur d'une ombre. Au-delà de 5 px, c'est mou.
        for (const m of cs.boxShadow.matchAll(/(-?[\d.]+)px (-?[\d.]+)px (-?[\d.]+)px/g)) {
          if (parseFloat(m[3]) > 5) out.molles.push(`${el.className} ${cs.boxShadow.slice(0, 40)}`);
        }
      }
      const r = Math.max(...cs.borderRadius.split(/[\s/]+/).map((v) => parseFloat(v) || 0));
      if (r > 8) out.rayons.push(`${el.className} ${cs.borderRadius}`);
      if (/blur/.test(cs.filter) || /blur/.test(cs.backdropFilter)) out.flous += 1;
    }
    return out;
  });
  [...new Set(matiere.molles)].slice(0, 3).forEach((m) => note(`profondeur : ombre molle, ${m}`));
  [...new Set(matiere.rayons)].slice(0, 3).forEach((m) => note(`profondeur : rayon supérieur à 8px, ${m}`));
  if (matiere.flous > 0) note(`profondeur : ${matiere.flous} élément(s) flouté(s), interdit dans cette tranche`);

  await attendre(page, "convergence");
  await pose(page, 300);
  await page.screenshot({ path: `${OUT}/desktop-04-convergence.png` });

  /* ---- Agent Usefulness : chaque agent a modifié un module. ---- */
  const remplis = await page.locator('.pv2-module[data-etat="pose"], .pv2-module[data-etat="bloque"]').count();
  if (remplis < 7) note(`Agent Usefulness : seuls ${remplis} modules sur 7 ont été modifiés par un agent`);

  await attendre(page, "gate");
  await pose(page);
  await page.screenshot({ path: `${OUT}/desktop-05-humangate.png` });

  /* ---- HumanGate Integration Test ---- */
  const gate = await page.evaluate(() => {
    const g = document.querySelector(".pv2-gate");
    const n = document.querySelector(".pv2-noyau");
    const b = document.querySelector('.pv2-surface[data-etat="bloquee"]');
    if (!g || !n) return null;
    const rg = g.getBoundingClientRect();
    const rn = n.getBoundingClientRect();
    const inter =
      Math.max(0, Math.min(rg.right, rn.right) - Math.max(rg.left, rn.left)) *
      Math.max(0, Math.min(rg.bottom, rn.bottom) - Math.max(rg.top, rn.top));
    return {
      couverture: (rg.width * rg.height) / (window.innerWidth * window.innerHeight),
      recouvrementNoyau: inter / (rn.width * rn.height),
      sourceBloqueeVisible: b ? parseFloat(getComputedStyle(b).opacity) > 0.9 : false,
      actionVisible: Boolean(document.querySelector('.pv2-module[data-propose="oui"]')),
      problemeDetache: Boolean(document.querySelector('.pv2-module[data-probleme="oui"]')),
    };
  });
  if (!gate) note("HumanGate Integration : le gate ou le noyau est introuvable");
  else {
    if (gate.couverture > 0.45) {
      note(`HumanGate Integration : le gate couvre ${Math.round(gate.couverture * 100)}% de l'écran, c'est une modale`);
    }
    if (gate.recouvrementNoyau > 0.05) {
      note(`HumanGate Integration : le gate recouvre ${Math.round(gate.recouvrementNoyau * 100)}% de l'objet`);
    }
    if (!gate.sourceBloqueeVisible) note("HumanGate Integration : la source manquante n'est pas montrée");
    if (!gate.actionVisible) note("HumanGate Integration : l'action proposée n'est plus visible");
    if (!gate.problemeDetache) note("HumanGate Integration : le module problématique ne se détache pas");
  }

  /* ---- Chaque décision montre sa conséquence AVANT le clic. ---- */
  const sansConsequence = await page.evaluate(() =>
    [...document.querySelectorAll(".pv2-option")]
      .filter((o) => !o.querySelector(".pv2-option-effet"))
      .map((o) => o.textContent?.slice(0, 24)),
  );
  sansConsequence.forEach((o) => note(`décision sans conséquence annoncée : ${o}`));
  const choixPrecis = await page.locator(".pv2-choix-btn").count();
  if (choixPrecis < 2) note("décision : « Corriger » ne propose aucun choix précis");

  /* ---- Human Control Test : la scène s'arrête RÉELLEMENT. ---- */
  const vAvant = await version(page);
  await page.waitForTimeout(2500);
  if ((await phase(page)) !== "gate") note("Human Control : la scène a repris sans décision humaine");
  if ((await version(page)) !== vAvant) note("Human Control : le dossier a évolué pendant l'arrêt");
  if ((await page.locator(".pv2-surface-out").count()) > 0) {
    note("Human Control : une sortie est déposée avant toute décision");
  }

  /* ---- Branche validation ---- */
  await option(page, "Valider").click();
  await attendre(page, "reprise");
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/desktop-06-sortie-distribuee.png` });

  /* ---- Distributed Output Test : au moins trois surfaces changent. ---- */
  const sorties = await page.evaluate(() =>
    [...document.querySelectorAll(".pv2-surface")]
      .filter((s) => s.querySelector(".pv2-surface-out"))
      .map((s) => ({
        surface: s.dataset.surface,
        titre: s.querySelector(".pv2-out-titre")?.textContent?.trim(),
      })),
  );
  if (sorties.length < 3) {
    note(`Distributed Output : ${sorties.length} surface(s) modifiée(s), il en faut au moins 3`);
  }
  if (new Set(sorties.map((x) => x.surface)).size < sorties.length) {
    note("Distributed Output : deux sorties sur la même surface");
  }

  /* ---- Le commit verrouille réellement des modules. ---- */
  const verrouilles = await page.locator('.pv2-module[data-etat="verrouille"]').count();
  if (verrouilles < 5) note(`commit : seuls ${verrouilles} modules se verrouillent`);

  await attendre(page, "boucle");
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/desktop-07-feedback.png` });

  /* ---- Living Feedback Test ---- */
  const feedback = await page.evaluate(() => ({
    regleAvant: document.querySelector('.pv2-regle-texte[data-remplacee="oui"]')?.textContent?.trim(),
    regleApres: document.querySelector(".pv2-regle-neuve")?.textContent?.trim(),
    proprietaire: document.querySelector(".pv2-regle-sign")?.textContent?.trim(),
    dansPolitique: Boolean(document.querySelector('.pv2-surface[data-surface="knowledge"] .pv2-regle-neuve')),
    occurrence: document.querySelector(".pv2-occ-effet")?.textContent?.trim(),
  }));
  if (!feedback.regleApres) note("Living Feedback : aucune règle modifiée après le retour humain");
  if (feedback.regleAvant && feedback.regleAvant === feedback.regleApres) {
    note("Living Feedback : la règle après retour est identique à la règle avant");
  }
  if (!feedback.dansPolitique) note("Living Feedback : la règle modifiée n'est pas dans la politique interne");
  if (!feedback.proprietaire) note("Living Feedback : la modification n'a pas de propriétaire humain");
  if (!feedback.occurrence) note("Living Feedback : la règle corrigée n'est appliquée à aucune occurrence suivante");

  /* ---- Object Transformation Test ---- */
  const atteintes = await page.locator('.pv2-cran[data-atteinte="oui"]').count();
  if (atteintes < 4) note(`Object Transformation : ${atteintes} versions atteintes sur 4`);

  const valider = {
    version: await version(page),
    sorties: sorties.map((x) => x.titre).join(" | "),
    regle: feedback.regleApres,
    occurrence: feedback.occurrence,
  };

  /* ---- Branch Test : le rejet produit autre chose ---- */
  await page.locator(".pv2-ctrl", { hasText: "Rejouer" }).click();
  await attendre(page, "gate");
  await option(page, "Rejeter").click();
  await attendre(page, "boucle");
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/desktop-08-branche-rejet.png` });

  const rejeter = await page.evaluate(() => ({
    sorties: [...document.querySelectorAll(".pv2-out-titre")].map((x) => x.textContent?.trim()).join(" | "),
    regle: document.querySelector(".pv2-regle-neuve")?.textContent?.trim(),
    occurrence: document.querySelector(".pv2-occ-effet")?.textContent?.trim(),
  }));
  rejeter.version = await version(page);

  if (valider.sorties === rejeter.sorties) note("Branch : validation et rejet déposent la même sortie");
  if (valider.regle === rejeter.regle) note("Branch : validation et rejet écrivent la même règle");
  if (valider.version === rejeter.version) note("Branch : validation et rejet donnent la même version");
  if (valider.occurrence === rejeter.occurrence) {
    note("Branch : la prochaine occurrence est identique dans les deux branches");
  }

  /* ---- Comparaison de versions : ajouté, modifié, inchangé. ---- */
  await page.locator('.pv2-cran[data-atteinte="oui"]').nth(1).click();
  await pose(page, 250);
  const diffs = await page.evaluate(
    () => new Set([...document.querySelectorAll(".pv2-module[data-diff]")].map((m) => m.dataset.diff)).size,
  );
  if (diffs < 2) note("comparaison de versions : aucun écart n'est marqué entre deux versions");

  /* ---- Aucun débordement, aucune erreur ---- */
  const over = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (over > 1) note(`débordement horizontal desktop de ${over}px`);
  erreurs.forEach((e) => note(`erreur console : ${e}`));
  await ctx.close();
}

/* ========================= Product First Test =========================== */
{
  const { ctx, page } = await open(browser, DESKTOP);
  await attendre(page, "orchestration");
  await page.waitForTimeout(1300);
  // On retire la condensée, la texture, la photographie et les annotations.
  await page.evaluate(() => document.querySelector(".pv2")?.classList.add("is-nu"));
  await pose(page, 300);
  await page.screenshot({ path: `${OUT}/desktop-09-product-first.png` });

  const nu = await page.evaluate(() => {
    const condensee = [...document.querySelectorAll(".pv2 *")].filter((el) =>
      /Barlow/.test(getComputedStyle(el).fontFamily),
    ).length;
    return {
      condensee,
      surfaces: document.querySelectorAll(".pv2-surface").length,
      modules: document.querySelectorAll(".pv2-module").length,
      agents: document.querySelectorAll(".pv2-agent.is-actif").length,
      beams: document.querySelectorAll(".pv2-beam").length,
      texture: document.querySelector(".pv2-texture")
        ? getComputedStyle(document.querySelector(".pv2-texture")).display
        : "none",
    };
  });
  if (nu.condensee > 0) note(`Product First : ${nu.condensee} élément(s) encore en Barlow Condensed`);
  if (nu.texture !== "none") note("Product First : la texture éditoriale est encore là");
  if (nu.surfaces < 6 || nu.modules < 8 || nu.beams < 1 || nu.agents < 1) {
    note(
      `Product First : sans la signature il reste ${nu.surfaces} surfaces, ${nu.modules} modules, ${nu.agents} agents, ${nu.beams} faisceaux`,
    );
  }
  await ctx.close();
}

/* ============================== Clavier ================================= */
{
  const { ctx, page } = await open(browser, DESKTOP);
  await attendre(page, "gate");
  let trouve = false;
  for (let i = 0; i < 60 && !trouve; i += 1) {
    await page.keyboard.press("Tab");
    trouve = await page.evaluate(() =>
      document.activeElement?.classList.contains("pv2-option-btn"),
    );
  }
  if (!trouve) note("clavier : aucune décision atteignable au Tab");
  const contour = await page.evaluate(() => getComputedStyle(document.activeElement).outlineWidth);
  if (contour === "0px") note("clavier : focus sans contour visible");
  await page.screenshot({ path: `${OUT}/desktop-10-clavier.png` });
  if (trouve) {
    await page.keyboard.press("Enter");
    await attendre(page, "reprise");
    if ((await phase(page)) === "gate") note("clavier : la décision au clavier ne relance pas la scène");
  }
  await ctx.close();
}

/* ========================== Reduced Motion ============================== */
{
  const { ctx, page } = await open(browser, DESKTOP, { reducedMotion: "reduce" });
  await attendre(page, "gate");
  await pose(page, 200);
  await page.screenshot({ path: `${OUT}/desktop-11-reduced-motion.png` });

  const longues = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll(".pv2 *")) {
      const cs = getComputedStyle(el);
      const d = parseFloat(cs.transitionDuration) || 0;
      const a = parseFloat(cs.animationDuration) || 0;
      if (d > 0.2 || a > 0.2) out.push(`${el.className} ${cs.transitionDuration}/${cs.animationDuration}`);
    }
    return [...new Set(out)].slice(0, 4);
  });
  longues.forEach((l) => note(`reduced-motion : durée longue restante, ${l}`));

  // Le scénario reste entier : décision, sortie distribuée et boucle.
  await option(page, "Valider").click();
  await attendre(page, "boucle");
  await page.waitForTimeout(600);
  if ((await page.locator(".pv2-regle-neuve").count()) === 0) {
    note("reduced-motion : la boucle d'amélioration n'est plus atteignable");
  }
  if ((await page.locator(".pv2-surface-out").count()) < 3) {
    note("reduced-motion : la sortie n'est plus distribuée");
  }
  if ((await page.locator(".pv2-occurrence").count()) === 0) {
    note("reduced-motion : l'occurrence suivante n'apparaît pas");
  }
  await ctx.close();
}

/* ====================== Pause, pas à pas, rejouer ======================= */
{
  const { ctx, page } = await open(browser, DESKTOP);
  await attendre(page, "orchestration");
  await page.locator(".pv2-ctrl", { hasText: "Pause" }).click();
  const p1 = await page.locator(".pv2-piste-fill").getAttribute("style");
  await page.waitForTimeout(900);
  const p2 = await page.locator(".pv2-piste-fill").getAttribute("style");
  if (p1 !== p2) note("pause : la scène continue d'avancer");

  await page.locator(".pv2-ctrl", { hasText: "Pas à pas" }).click();
  const p3 = await page.locator(".pv2-piste-fill").getAttribute("style");
  if (p2 === p3) note("pas à pas : aucun avancement");

  await page.locator(".pv2-ctrl", { hasText: "Rejouer" }).click();
  await page.waitForTimeout(150);
  if ((await version(page)) !== "v0") note("rejouer : le dossier ne revient pas à v0");
  await ctx.close();
}

/* ===================== Mobile Experience Test =========================== */
for (const [nom, vp] of MOBILES) {
  const { ctx, page, erreurs } = await open(browser, vp);
  await pose(page, 400);

  const chapitres = await page.locator(".pv2-chapitre").count();
  if (chapitres !== 7) note(`mobile ${nom} : ${chapitres} chapitres au lieu de 7`);

  // Chaque chapitre occupe l'écran : ce n'est pas une page longue.
  const courts = await page.evaluate(() =>
    [...document.querySelectorAll(".pv2-chapitre")].filter(
      (c) => c.getBoundingClientRect().height < window.innerHeight * 0.6,
    ).length,
  );
  if (courts > 0) note(`mobile ${nom} : ${courts} chapitre(s) n'occupent pas l'écran`);

  await page.screenshot({ path: `${OUT}/mobile-${nom}-01-signal.png` });
  await page.waitForFunction(
    () => document.querySelector(".pv2")?.getAttribute("data-chapitre") === "parallele",
    null,
    { timeout: 14000 },
  ).catch(() => note(`mobile ${nom} : le chapitre « travail parallèle » n'est pas atteint`));
  await pose(page, 400);
  await page.screenshot({ path: `${OUT}/mobile-${nom}-02-parallele.png` });

  await attendre(page, "gate");
  await pose(page, 700);
  await page.screenshot({ path: `${OUT}/mobile-${nom}-03-decision.png` });

  /* Le gate occupe l'écran, mais l'objet reste visible. */
  const vue = await page.evaluate(() => {
    const chap = document.querySelector('.pv2-chapitre[data-actif="oui"]');
    const noyau = chap?.querySelector(".pv2-noyau-compact");
    const gate = chap?.querySelector(".pv2-gate-mobile");
    const r = noyau?.getBoundingClientRect();
    return {
      gate: Boolean(gate),
      objetVisible: r ? r.top < window.innerHeight && r.bottom > 0 : false,
      cibles: [...(chap?.querySelectorAll(".pv2-option-btn") ?? [])].filter(
        (b) => b.getBoundingClientRect().height < 44,
      ).length,
    };
  });
  if (!vue.gate) note(`mobile ${nom} : le HumanGate n'est pas dans le chapitre de décision`);
  if (!vue.objetVisible) note(`mobile ${nom} : l'objet n'est plus visible pendant la décision`);
  if (vue.cibles > 0) note(`mobile ${nom} : ${vue.cibles} cible(s) tactile(s) sous 44px`);

  await option(page, "Valider").click();
  await attendre(page, "reprise");
  await pose(page, 1400);
  await page.screenshot({ path: `${OUT}/mobile-${nom}-04-commit.png` });
  await attendre(page, "boucle");
  await pose(page, 1400);
  await page.screenshot({ path: `${OUT}/mobile-${nom}-05-amelioration.png` });

  const over = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (over > 1) note(`mobile ${nom} : débordement horizontal de ${over}px`);

  // Aucun microtexte : rien sous 12 px.
  const petits = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll(".pv2 *")) {
      if (!el.textContent?.trim() || el.children.length) continue;
      const px = parseFloat(getComputedStyle(el).fontSize);
      if (px < 12) out.push(`${el.className || el.tagName} ${px}px`);
    }
    return [...new Set(out)].slice(0, 5);
  });
  petits.forEach((p) => note(`mobile ${nom} : microtexte ${p}`));
  erreurs.forEach((e) => note(`mobile ${nom}, erreur console : ${e}`));
  await ctx.close();
}

/* ==================== Démontage : aucun timer survivant ================== */
{
  const { ctx, page } = await open(browser, DESKTOP);
  await attendre(page, "orchestration");
  const restants = await page.evaluate(async () => {
    let actifs = 0;
    const vraiSet = window.setInterval;
    window.setInterval = (...a) => {
      actifs += 1;
      return vraiSet(...a);
    };
    const vraiClear = window.clearInterval;
    window.clearInterval = (id) => {
      actifs -= 1;
      return vraiClear(id);
    };
    document.querySelector(".pv2")?.remove();
    await new Promise((r) => setTimeout(r, 400));
    return actifs;
  });
  if (restants > 0) note(`${restants} timer(s) encore actif(s) après démontage`);
  await ctx.close();
}

await browser.close();

/* ============================== WebKit ================================== */
{
  const wk = await webkit.launch();
  const { ctx, page, erreurs } = await open(wk, DESKTOP);
  await attendre(page, "gate");
  await pose(page);
  await page.screenshot({ path: `${OUT}/webkit-humangate.png` });
  await option(page, "Valider").click();
  await attendre(page, "boucle");
  await page.waitForTimeout(1200);
  if ((await page.locator(".pv2-regle-neuve").count()) === 0) {
    note("webkit : la boucle d'amélioration n'apparaît pas");
  }
  if ((await page.locator(".pv2-surface-out").count()) < 3) {
    note("webkit : la sortie n'est pas distribuée");
  }
  erreurs.forEach((e) => note(`webkit, erreur console : ${e}`));
  await ctx.close();
  await wk.close();
}

console.log(problems.length ? `PROBLÈMES (${problems.length})` : "Aucun problème.");
problems.forEach((p) => console.log("  ✗ " + p));
console.log("\nDesire Test : arbitrage humain, non marqué automatiquement.");
process.exit(problems.length ? 1 : 0);
