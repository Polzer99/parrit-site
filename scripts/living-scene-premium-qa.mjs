/**
 * PRODUCT-LIVING-SYSTEM-SCENE-V2-PREMIUM-V1 — contrôles de la variante.
 *
 * Teste /art-direction-lab/product-living-scene-v2-premium. La V1 et la V2
 * gardent leurs harnais, qui restent verts : les trois renderers sont
 * contrôlés séparément.
 *
 * Reprend les tests fonctionnels V1 et V2 — le moteur est le même, il doit
 * donc encore passer — et ajoute les tests de finition de la tranche.
 *
 * Le Premium Product Test se mesure PAR COMPARAISON avec la V2, sur la même
 * phase : moins de cadres et moins de texte simultané, sinon la finition
 * n'est qu'une déclaration.
 *
 * Le Desire Test n'est pas ici. Il appartient à Paul.
 *
 * Usage : node scripts/living-scene-premium-qa.mjs
 */
import { chromium, webkit } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.PARRIT_BASE ?? "http://localhost:3000";
const OUT = "docs/design-system/qa/living-scene-premium";
const R = "/art-direction-lab/product-living-scene-v2-premium";
const R_V2 = "/art-direction-lab/product-living-scene-v2";

const problems = [];
const note = (m) => problems.push(m);

const DESKTOP = { width: 1440, height: 900 };
const MOBILES = [
  ["390x844", { width: 390, height: 844 }],
  ["375x812", { width: 375, height: 812 }],
];

async function open(browser, viewport, opts = {}, route = R) {
  const ctx = await browser.newContext({ viewport, ...opts });
  const page = await ctx.newPage();
  const erreurs = [];
  page.on("pageerror", (e) => erreurs.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") erreurs.push(m.text());
  });
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // La souris hors du plateau : sinon un survol involontaire ouvre le niveau 3.
  await page.mouse.move(2, 2);
  return { ctx, page, erreurs };
}

const racine = (page, sel = ".pp") => page.locator(sel);
const phase = (page, sel = ".pp") => racine(page, sel).getAttribute("data-phase");
const version = (page, sel = ".pp") => racine(page, sel).getAttribute("data-version");

async function attendre(page, cible, sel = ".pp", max = 14000) {
  await page
    .waitForFunction(
      ([c, s]) => document.querySelector(s)?.getAttribute("data-phase") === c,
      [cible, sel],
      { timeout: max },
    )
    .catch(() => note(`la scène n'atteint pas la phase « ${cible} »`));
}

const pose = (page, ms = 560) => page.waitForTimeout(ms);

/** Mesure du bruit visible : cadres tracés et blocs de texte affichés. */
const BRUIT = () => {
  let cadres = 0;
  let textes = 0;
  const racine = document.querySelector(".pp") ?? document.querySelector(".pv2");
  if (!racine) return { cadres: 0, textes: 0 };
  for (const el of racine.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height || r.bottom < 0 || r.top > window.innerHeight) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || cs.opacity === "0") continue;
    const bords = ["Top", "Right", "Bottom", "Left"].filter(
      (c) => parseFloat(cs[`border${c}Width`]) > 0 && cs[`border${c}Style`] !== "none",
    ).length;
    if (bords >= 2) cadres += 1;
    const propre = [...el.childNodes].some(
      (n) => n.nodeType === 3 && n.textContent.trim().length > 1,
    );
    if (propre && parseFloat(cs.opacity) > 0.5) textes += 1;
  }
  return { cadres, textes };
};

const browser = await chromium.launch();
await mkdir(OUT, { recursive: true });

/* ===================== Parcours desktop, branche validation ============== */
{
  const { ctx, page, erreurs } = await open(browser, DESKTOP);

  const part = await page.evaluate(() => {
    const f = document.querySelector(".pp-field");
    return f ? f.getBoundingClientRect().height / window.innerHeight : 0;
  });
  if (part < 0.8) note(`la scène n'occupe que ${Math.round(part * 100)}% du viewport`);

  /* ---- Top Bar Product Test ---- */
  const top = await page.evaluate(() => {
    const t = document.querySelector(".pp-top");
    if (!t) return null;
    const textes = [...t.querySelectorAll("*")].filter((el) =>
      [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1),
    );
    const mono = textes.filter((el) => /mono|Mono/.test(getComputedStyle(el).fontFamily));
    return {
      hauteur: t.getBoundingClientRect().height,
      blocs: textes.length,
      mono: mono.length,
    };
  });
  if (!top) note("Top Bar Product : aucune barre haute");
  else {
    if (top.blocs > 6) note(`Top Bar Product : ${top.blocs} blocs de texte, c'est une console`);
    if (top.hauteur > 72) note(`Top Bar Product : ${Math.round(top.hauteur)}px de haut`);
    if (top.mono > 3) note(`Top Bar Product : ${top.mono} blocs en mono, ça fait vidage de métadonnées`);
  }

  await page.screenshot({ path: `${OUT}/desktop-01-initial.png` });
  await attendre(page, "signal");
  await pose(page, 300);
  await page.screenshot({ path: `${OUT}/desktop-02-signal.png` });

  await attendre(page, "orchestration");
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/desktop-03-parallele.png` });

  /* ---- Living Technology ---- */
  const actifs = await page.locator(".pp-agent.is-actif").count();
  if (actifs < 2) note(`travail parallèle : ${actifs} agent(s) actif(s), il en faut au moins 2`);
  if (actifs > 4) note(`travail parallèle : ${actifs} agents, la tranche en demande 2 à 4`);
  const pistes = await page.locator(".pp-piste-faite").count();
  if (pistes < 2) note(`trajectoires : ${pistes}, il en faut au moins 2`);

  /* ---- Information Hierarchy Test ---- */
  const hierarchie = await page.evaluate(() => {
    const visible = (el) => {
      const cs = getComputedStyle(el);
      return cs.display !== "none" && cs.visibility !== "hidden";
    };
    return {
      n3Visibles: [...document.querySelectorAll(".pp-n3")].filter(visible).length,
      n1: document.querySelectorAll(".pp-n1").length,
      etat: document.querySelector(".pp-statut")?.textContent?.trim(),
      valeurs: document.querySelectorAll(".pp-module-valeur").length,
    };
  });
  if (hierarchie.n3Visibles > 0) {
    note(`Information Hierarchy : ${hierarchie.n3Visibles} métadonnée(s) de niveau 3 visibles au repos`);
  }
  if (!hierarchie.etat) note("Information Hierarchy : l'état général n'est pas lisible");
  if (hierarchie.n1 < 3) note(`Information Hierarchy : ${hierarchie.n1} informations de niveau 1 seulement`);
  if (hierarchie.valeurs < 1) note("Information Hierarchy : aucun module ne porte de valeur métier");

  /* ---- Surface Focus Test, échantillonné sur toute la scène ---- */
  const focusOk = async (quand) => {
    const n = await page.locator('.pp-slot[data-niveau="active"]').count();
    if (n !== 1) note(`Surface Focus : ${n} surface(s) active(s) pendant « ${quand} », il en faut exactement 1`);
  };
  await focusOk("travail parallèle");

  /* ---- Niveaux de surface réellement distincts ---- */
  const niveaux = await page.evaluate(() => {
    const lire = (n) => {
      const el = document.querySelector(`.pp-slot[data-niveau="${n}"] .pp-surface`);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { fond: cs.backgroundColor, opacite: cs.opacity, ombre: cs.boxShadow !== "none" };
    };
    return { active: lire("active"), contextuelle: lire("contextuelle"), disponible: lire("disponible") };
  });
  if (!niveaux.active || !niveaux.contextuelle) note("les trois niveaux de surface ne coexistent pas");
  else if (niveaux.active.fond === niveaux.contextuelle.fond) {
    note("niveaux de surface : active et contextuelle ont exactement le même fond");
  }

  /* ---- Red Scarcity ---- */
  const rouge = await page.evaluate(() => {
    const est = (c) => /^rgb\(209, 19, 47/.test(c || "");
    let rouges = 0;
    let total = 0;
    for (const el of document.querySelectorAll(".pp *")) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      total += 1;
      const cs = getComputedStyle(el);
      if (est(cs.color) || est(cs.backgroundColor) || est(cs.borderTopColor)) rouges += 1;
    }
    const pistesRouges = [...document.querySelectorAll(".pp-piste, .pp-piste-faite")].filter((b) =>
      est(getComputedStyle(b).stroke),
    ).length;
    return { part: rouges / Math.max(1, total), pistesRouges };
  });
  if (rouge.pistesRouges > 0) note(`Red Scarcity : ${rouge.pistesRouges} trajectoire(s) en rouge`);
  if (rouge.part > 0.12) note(`Red Scarcity : ${Math.round(rouge.part * 100)}% d'éléments rouges en flux normal`);

  /* ---- Profondeur : ombres dures, rayons contenus ---- */
  const matiere = await page.evaluate(() => {
    const out = { molles: [], rayons: [], flous: 0 };
    for (const el of document.querySelectorAll(".pp *")) {
      const cs = getComputedStyle(el);
      if (cs.boxShadow && cs.boxShadow !== "none") {
        for (const m of cs.boxShadow.matchAll(/(-?[\d.]+)px (-?[\d.]+)px (-?[\d.]+)px/g)) {
          if (parseFloat(m[3]) > 5) out.molles.push(`${el.className} ${cs.boxShadow.slice(0, 40)}`);
        }
      }
      const r = Math.max(...cs.borderRadius.split(/[\s/]+/).map((v) => parseFloat(v) || 0));
      // Le seul rayon plein autorisé est la pastille de statut.
      if (r > 8 && !el.className.includes("statut")) out.rayons.push(`${el.className} ${cs.borderRadius}`);
      if (/blur/.test(cs.filter) || /blur/.test(cs.backdropFilter)) out.flous += 1;
    }
    return out;
  });
  [...new Set(matiere.molles)].slice(0, 3).forEach((m) => note(`profondeur : ombre molle, ${m}`));
  [...new Set(matiere.rayons)].slice(0, 3).forEach((m) => note(`profondeur : rayon supérieur à 8px, ${m}`));
  if (matiere.flous > 0) note(`profondeur : ${matiere.flous} élément(s) flouté(s)`);

  await attendre(page, "convergence");
  await pose(page, 300);
  await focusOk("convergence");
  await page.screenshot({ path: `${OUT}/desktop-04-convergence.png` });

  const remplis = await page.locator('.pp-module[data-etat="pose"], .pp-module[data-etat="bloque"]').count();
  if (remplis < 7) note(`Agent Usefulness : ${remplis} modules modifiés sur 7`);

  await attendre(page, "gate");
  await pose(page);
  await focusOk("décision");
  await page.screenshot({ path: `${OUT}/desktop-05-humangate.png` });

  /* ---- HumanGate Hierarchy Test ---- */
  const gate = await page.evaluate(() => {
    const g = document.querySelector(".pp-gate");
    const n = document.querySelector(".pp-noyau");
    if (!g || !n) return null;
    const rg = g.getBoundingClientRect();
    const rn = n.getBoundingClientRect();
    const inter =
      Math.max(0, Math.min(rg.right, rn.right) - Math.max(rg.left, rn.left)) *
      Math.max(0, Math.min(rg.bottom, rn.bottom) - Math.max(rg.top, rn.top));
    const princ = [...g.querySelectorAll('[data-poids="principal"]')];
    const alts = [...g.querySelectorAll('[data-poids="alternative"]')];
    const aire = (el) => {
      const r = el.getBoundingClientRect();
      return r.width * r.height;
    };
    return {
      couverture: (rg.width * rg.height) / (window.innerWidth * window.innerHeight),
      recouvrement: inter / (rn.width * rn.height),
      principales: princ.length,
      alternatives: alts.length,
      airePrincipale: princ.length ? aire(princ[0]) : 0,
      aireAlt: alts.length ? alts.reduce((a, e) => a + aire(e), 0) / alts.length : 0,
      question: Boolean(g.querySelector(".pp-gate-question")),
      manque: Boolean(g.querySelector(".pp-gate-manque")),
      action: Boolean(g.querySelector(".pp-gate-action")),
      comparer: Boolean(g.querySelector(".pp-comparer")),
      sourceBloquee: (() => {
        const b = document.querySelector('.pp-surface[data-etat="bloquee"]');
        return b ? parseFloat(getComputedStyle(b).opacity) > 0.9 : false;
      })(),
    };
  });
  if (!gate) note("HumanGate : introuvable");
  else {
    if (gate.principales !== 1) note(`HumanGate Hierarchy : ${gate.principales} action(s) principale(s), il en faut 1`);
    if (gate.alternatives !== 3) note(`HumanGate Hierarchy : ${gate.alternatives} alternatives, il en faut 3`);
    if (gate.airePrincipale < gate.aireAlt * 1.6) {
      note("HumanGate Hierarchy : l'action principale ne domine pas les alternatives");
    }
    if (!gate.question) note("HumanGate : la question n'est pas posée");
    if (!gate.manque) note("HumanGate : l'information manquante n'est pas montrée");
    if (!gate.action) note("HumanGate : l'action proposée n'est pas montrée");
    if (!gate.comparer) note("HumanGate : les conséquences ne sont pas comparables");
    if (!gate.sourceBloquee) note("HumanGate : la source bloquée n'est pas lisible");
    if (gate.couverture > 0.45) note(`HumanGate : couvre ${Math.round(gate.couverture * 100)}% de l'écran`);
    if (gate.recouvrement > 0.05) note(`HumanGate : recouvre ${Math.round(gate.recouvrement * 100)}% de l'objet`);
  }

  /* Les alternatives annoncent leur effet avant le clic ; le risque s'ouvre. */
  const sansEffet = await page.evaluate(() =>
    [...document.querySelectorAll(".pp-alt")].filter((o) => !o.querySelector(".pp-alt-effet")).length,
  );
  if (sansEffet > 0) note(`${sansEffet} alternative(s) sans conséquence annoncée`);
  await page.locator(".pp-comparer").click();
  await pose(page, 200);
  const risques = await page.evaluate(
    () =>
      [...document.querySelectorAll(".pp-alt-risque")].filter(
        (e) => getComputedStyle(e).display !== "none",
      ).length,
  );
  if (risques < 2) note("comparaison : les risques des alternatives ne s'ouvrent pas");
  await page.screenshot({ path: `${OUT}/desktop-06-comparaison.png` });

  /* ---- Human Control ---- */
  const vAvant = await version(page);
  await page.waitForTimeout(2500);
  if ((await phase(page)) !== "gate") note("Human Control : la scène a repris sans décision");
  if ((await version(page)) !== vAvant) note("Human Control : le dossier a évolué pendant l'arrêt");
  if ((await page.locator(".pp-out").count()) > 0) note("Human Control : une sortie est déposée avant décision");

  /* ---- Décision, commit ---- */
  await page.locator('[data-poids="principal"]').first().click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/desktop-07-commit.png` });

  /* ---- Commit Satisfaction Test ---- */
  const commit = await page.evaluate(() => {
    const gros = [...document.querySelectorAll(".pp *")]
      .filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))
      .filter((el) => parseFloat(getComputedStyle(el).fontSize) > 40)
      .map((el) => el.textContent.trim().slice(0, 20));
    return {
      gros,
      statut: document.querySelector(".pp-statut")?.textContent?.trim(),
      verrouilles: document.querySelectorAll('.pp-module[data-etat="verrouille"]').length,
      decision: document.querySelector('.pp-module[data-module="decision"]')?.dataset.etat,
      version: document.querySelector(".pp")?.dataset.version,
    };
  });
  commit.gros.forEach((g) => note(`Commit Satisfaction : texte géant « ${g} » au moment du commit`));
  if (!/Validé/.test(commit.statut ?? "")) note(`Commit Satisfaction : statut « ${commit.statut} » au lieu de Validé`);
  if (commit.verrouilles < 5) note(`Commit Satisfaction : ${commit.verrouilles} modules verrouillés seulement`);
  if (commit.decision !== "verrouille") note("Commit Satisfaction : le module Décision ne se verrouille pas");
  if (commit.version !== "v3") note(`Commit Satisfaction : version ${commit.version} au lieu de v3`);

  await attendre(page, "reprise");
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/desktop-08-sortie-distribuee.png` });

  const sorties = await page.evaluate(() =>
    [...document.querySelectorAll(".pp-surface")]
      .filter((s) => s.querySelector(".pp-out"))
      .map((s) => ({ surface: s.dataset.surface, titre: s.querySelector(".pp-out-titre")?.textContent?.trim() })),
  );
  if (sorties.length < 3) note(`Distributed Output : ${sorties.length} surface(s) modifiée(s)`);
  if (new Set(sorties.map((x) => x.surface)).size < sorties.length) {
    note("Distributed Output : deux sorties sur la même surface");
  }

  await attendre(page, "boucle");
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/desktop-09-feedback.png` });

  const feedback = await page.evaluate(() => ({
    avant: document.querySelector('.pp-regle-avant[data-remplacee="oui"]')?.textContent?.trim(),
    apres: document.querySelector(".pp-regle-neuve")?.textContent?.trim(),
    dansPolitique: Boolean(document.querySelector('.pp-surface[data-surface="knowledge"] .pp-regle-neuve')),
    occurrence: document.querySelector(".pp-occ-effet")?.textContent?.trim(),
  }));
  if (!feedback.apres) note("Living Feedback : aucune règle modifiée");
  if (feedback.avant && feedback.avant === feedback.apres) note("Living Feedback : règle identique avant et après");
  if (!feedback.dansPolitique) note("Living Feedback : la règle modifiée n'est pas dans la politique interne");
  if (!feedback.occurrence) note("Living Feedback : aucune occurrence suivante");

  const atteintes = await page.locator('.pp-cran[data-atteinte="oui"]').count();
  if (atteintes < 4) note(`Object Transformation : ${atteintes} versions atteintes sur 4`);

  const valider = {
    version: await version(page),
    sorties: sorties.map((x) => x.titre).join(" | "),
    regle: feedback.apres,
    occurrence: feedback.occurrence,
  };

  /* ---- Branch Test ---- */
  await page.locator(".pp-ctrl", { hasText: "Rejouer" }).click();
  await attendre(page, "gate");
  await page
    .locator(".pp-alt-btn")
    .filter({ has: page.locator(".pp-alt-label", { hasText: /^Rejeter$/ }) })
    .click();
  await attendre(page, "boucle");
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/desktop-10-branche-rejet.png` });

  const rejeter = await page.evaluate(() => ({
    sorties: [...document.querySelectorAll(".pp-out-titre")].map((x) => x.textContent?.trim()).join(" | "),
    regle: document.querySelector(".pp-regle-neuve")?.textContent?.trim(),
    occurrence: document.querySelector(".pp-occ-effet")?.textContent?.trim(),
  }));
  rejeter.version = await version(page);
  if (valider.sorties === rejeter.sorties) note("Branch : validation et rejet déposent la même sortie");
  if (valider.regle === rejeter.regle) note("Branch : validation et rejet écrivent la même règle");
  if (valider.version === rejeter.version) note("Branch : validation et rejet donnent la même version");
  if (valider.occurrence === rejeter.occurrence) note("Branch : même occurrence suivante dans les deux branches");

  const over = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (over > 1) note(`débordement horizontal desktop de ${over}px`);
  erreurs.forEach((e) => note(`erreur console : ${e}`));
  await ctx.close();
}

/* ======================= Premium Product Test =========================== */
/* Mesuré, pas déclaré : à la même phase, la variante doit montrer moins de
   cadres et moins de blocs de texte que la V2. */
{
  const mesure = async (route, sel) => {
    const { ctx, page } = await open(browser, DESKTOP, {}, route);
    await attendre(page, "orchestration", sel);
    await page.waitForTimeout(1400);
    const m = await page.evaluate(BRUIT);
    await ctx.close();
    return m;
  };
  const v2 = await mesure(R_V2, ".pv2");
  const premium = await mesure(R, ".pp");
  if (premium.cadres >= v2.cadres) {
    note(`Premium Product : ${premium.cadres} cadres contre ${v2.cadres} en V2, le bruit n'a pas baissé`);
  }
  if (premium.textes >= v2.textes) {
    note(`Premium Product : ${premium.textes} blocs de texte contre ${v2.textes} en V2`);
  }
  console.log(
    `  bruit V2 : ${v2.cadres} cadres / ${v2.textes} textes — premium : ${premium.cadres} / ${premium.textes}`,
  );

  /* Aucun contrôle laissé au style navigateur par défaut. */
  const { ctx, page } = await open(browser, DESKTOP);
  await attendre(page, "gate");
  const bruts = await page.evaluate(() =>
    [...document.querySelectorAll(".pp button")].filter((b) => {
      const cs = getComputedStyle(b);
      return cs.appearance === "auto" && cs.backgroundColor === "rgb(239, 239, 239)";
    }).length,
  );
  if (bruts > 0) note(`Premium Product : ${bruts} contrôle(s) au style navigateur par défaut`);
  await ctx.close();
}

/* ========================= Product First Test =========================== */
{
  const { ctx, page } = await open(browser, DESKTOP);
  await attendre(page, "orchestration");
  await page.waitForTimeout(1300);
  await page.evaluate(() => document.querySelector(".pp")?.classList.add("is-nu"));
  await pose(page, 300);
  await page.screenshot({ path: `${OUT}/desktop-11-product-first.png` });

  const nu = await page.evaluate(() => ({
    condensee: [...document.querySelectorAll(".pp *")].filter((el) =>
      /Barlow/.test(getComputedStyle(el).fontFamily),
    ).length,
    surfaces: document.querySelectorAll(".pp-surface").length,
    modules: document.querySelectorAll(".pp-module").length,
    agents: document.querySelectorAll(".pp-agent.is-actif").length,
    pistes: document.querySelectorAll(".pp-piste-faite").length,
    grain: document.querySelector(".pp-grain")
      ? getComputedStyle(document.querySelector(".pp-grain")).display
      : "none",
  }));
  if (nu.condensee > 0) note(`Product First : ${nu.condensee} élément(s) encore en Barlow Condensed`);
  if (nu.grain !== "none") note("Product First : la texture éditoriale est encore là");
  if (nu.surfaces < 6 || nu.modules < 8 || nu.agents < 1 || nu.pistes < 1) {
    note(
      `Product First : sans signature il reste ${nu.surfaces} surfaces, ${nu.modules} modules, ${nu.agents} agents, ${nu.pistes} trajectoires`,
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
    trouve = await page.evaluate(
      () => document.activeElement?.getAttribute("data-poids") === "principal",
    );
  }
  if (!trouve) note("clavier : l'action principale n'est pas atteignable au Tab");
  const contour = await page.evaluate(() => getComputedStyle(document.activeElement).outlineWidth);
  if (contour === "0px") note("clavier : focus sans contour visible");
  await page.screenshot({ path: `${OUT}/desktop-12-clavier.png` });
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
  await page.screenshot({ path: `${OUT}/desktop-13-reduced-motion.png` });

  const longues = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll(".pp *")) {
      const cs = getComputedStyle(el);
      if ((parseFloat(cs.transitionDuration) || 0) > 0.2 || (parseFloat(cs.animationDuration) || 0) > 0.2) {
        out.push(`${el.className} ${cs.transitionDuration}/${cs.animationDuration}`);
      }
    }
    return [...new Set(out)].slice(0, 4);
  });
  longues.forEach((l) => note(`reduced-motion : durée longue restante, ${l}`));

  await page.locator('[data-poids="principal"]').first().click();
  await attendre(page, "boucle");
  await page.waitForTimeout(700);
  if ((await page.locator(".pp-regle-neuve").count()) === 0) note("reduced-motion : la boucle n'est plus atteignable");
  if ((await page.locator(".pp-out").count()) < 3) note("reduced-motion : la sortie n'est plus distribuée");
  if ((await page.locator(".pp-occurrence").count()) === 0) note("reduced-motion : pas d'occurrence suivante");
  await ctx.close();
}

/* ====================== Pause, pas à pas, rejouer ======================= */
{
  const { ctx, page } = await open(browser, DESKTOP);
  await attendre(page, "orchestration");
  await page.locator(".pp-ctrl", { hasText: "Pause" }).click();
  const p1 = await page.locator(".pp-piste-fill").getAttribute("style");
  await page.waitForTimeout(900);
  const p2 = await page.locator(".pp-piste-fill").getAttribute("style");
  if (p1 !== p2) note("pause : la scène continue d'avancer");

  await page.locator(".pp-ctrl", { hasText: "Pas à pas" }).click();
  const p3 = await page.locator(".pp-piste-fill").getAttribute("style");
  if (p2 === p3) note("pas à pas : aucun avancement");

  await page.locator(".pp-ctrl", { hasText: "Rejouer" }).click();
  await page.waitForTimeout(150);
  if ((await version(page)) !== "v0") note("rejouer : le dossier ne revient pas à v0");
  await ctx.close();
}

/* ======================= Mobile Premium Test ============================ */
for (const [nom, vp] of MOBILES) {
  const { ctx, page, erreurs } = await open(browser, vp);
  await pose(page, 400);

  const chapitres = await page.locator(".pp-chapitre").count();
  if (chapitres !== 7) note(`mobile ${nom} : ${chapitres} chapitres au lieu de 7`);

  /* Chaque chapitre est un écran autonome : un titre, l'objet, une surface. */
  const autonomes = await page.evaluate(() =>
    [...document.querySelectorAll(".pp-chapitre")].map((c) => ({
      titre: Boolean(c.querySelector(".pp-chap-titre")),
      objet: Boolean(c.querySelector(".pp-bande")),
      surfaces: c.querySelectorAll(".pp-chap-surface").length,
      plein: c.getBoundingClientRect().height >= window.innerHeight * 0.6,
    })),
  );
  autonomes.forEach((c, i) => {
    if (!c.titre || !c.objet) note(`mobile ${nom} : chapitre ${i + 1} sans titre ou sans objet`);
    if (c.surfaces > 1) note(`mobile ${nom} : chapitre ${i + 1} montre ${c.surfaces} surfaces`);
    if (!c.plein) note(`mobile ${nom} : chapitre ${i + 1} n'occupe pas l'écran`);
  });

  /* Le rail de lecture doit rester atteignable. */
  const rail = await page.evaluate(() => {
    const r = document.querySelector(".pp-rail")?.getBoundingClientRect();
    const permanents = [...document.querySelectorAll(".pp-rail .pp-ctrl")].filter(
      (b) => b.offsetParent !== null,
    ).length;
    return r ? { visible: r.bottom <= window.innerHeight + 1 && r.top < window.innerHeight, permanents } : null;
  });
  if (!rail?.visible) note(`mobile ${nom} : le rail de lecture n'est pas visible`);
  if (rail && rail.permanents > 2) {
    note(`mobile ${nom} : ${rail.permanents} commandes permanentes, la tranche en demande moins`);
  }

  await page.screenshot({ path: `${OUT}/mobile-${nom}-01-signal.png` });
  await page
    .waitForFunction(() => document.querySelector(".pp")?.getAttribute("data-chapitre") === "parallele", null, {
      timeout: 14000,
    })
    .catch(() => note(`mobile ${nom} : chapitre « travail parallèle » non atteint`));
  await pose(page, 400);
  await page.screenshot({ path: `${OUT}/mobile-${nom}-02-parallele.png` });

  await attendre(page, "gate");
  await pose(page, 800);
  await page.screenshot({ path: `${OUT}/mobile-${nom}-03-decision.png` });

  const gateM = await page.evaluate(() => {
    const chap = document.querySelector('.pp-chapitre[data-actif="oui"]');
    const bande = chap?.querySelector(".pp-bande");
    const r = bande?.getBoundingClientRect();
    const alts = chap?.querySelector(".pp-gate-mobile .pp-alternatives");
    return {
      principale: chap?.querySelectorAll('[data-poids="principal"]').length ?? 0,
      objetVisible: r ? r.top < window.innerHeight && r.bottom > 0 : false,
      alternativesCachees: alts ? getComputedStyle(alts).display === "none" : false,
      /* Une cible masquée n'est pas une cible : on ne mesure que le visible. */
      petites: [...(chap?.querySelectorAll('[data-poids="principal"], .pp-alt-btn') ?? [])]
        .filter((b) => b.offsetParent !== null)
        .filter((b) => b.getBoundingClientRect().height < 44).length,
    };
  });
  if (gateM.principale !== 1) note(`mobile ${nom} : ${gateM.principale} action principale au gate`);
  if (!gateM.objetVisible) note(`mobile ${nom} : l'objet n'est plus visible pendant la décision`);
  if (!gateM.alternativesCachees) note(`mobile ${nom} : toutes les branches sont affichées d'un coup`);
  if (gateM.petites > 0) note(`mobile ${nom} : ${gateM.petites} cible(s) tactile(s) sous 44px`);

  await page.locator(".pp-comparer").click();
  await pose(page, 250);
  const ouvertes = await page.locator(".pp-gate-mobile .pp-alt-btn").count();
  if (ouvertes < 3) note(`mobile ${nom} : les autres suites ne se révèlent pas`);
  await page.screenshot({ path: `${OUT}/mobile-${nom}-04-suites.png` });

  await page.locator('[data-poids="principal"]').first().click();
  await attendre(page, "reprise");
  await pose(page, 1400);
  await page.screenshot({ path: `${OUT}/mobile-${nom}-05-commit.png` });
  await attendre(page, "boucle");
  await pose(page, 1400);
  await page.screenshot({ path: `${OUT}/mobile-${nom}-06-amelioration.png` });

  const over = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (over > 1) note(`mobile ${nom} : débordement horizontal de ${over}px`);

  const petits = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll(".pp *")) {
      if (!el.textContent?.trim() || el.children.length) continue;
      if (getComputedStyle(el).display === "none") continue;
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
    document.querySelector(".pp")?.remove();
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
  await page.locator('[data-poids="principal"]').first().click();
  await attendre(page, "boucle");
  await page.waitForTimeout(1200);
  if ((await page.locator(".pp-regle-neuve").count()) === 0) note("webkit : la boucle n'apparaît pas");
  if ((await page.locator(".pp-out").count()) < 3) note("webkit : la sortie n'est pas distribuée");
  erreurs.forEach((e) => note(`webkit, erreur console : ${e}`));
  await ctx.close();
  await wk.close();
}

console.log(problems.length ? `PROBLÈMES (${problems.length})` : "Aucun problème.");
problems.forEach((p) => console.log("  ✗ " + p));
console.log("\nDesire Test : arbitrage humain, non marqué automatiquement.");
process.exit(problems.length ? 1 : 0);
