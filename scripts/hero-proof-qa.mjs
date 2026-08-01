/**
 * PRODUCT-LIVING-HERO-PROOF-V1 — contrôles du hero.
 *
 * Teste /art-direction-lab/product-living-hero-proof, dans ses deux
 * traitements Paper et Ink. Les harnais de Concept D et des scènes V1, V2 et
 * Premium restent séparés et inchangés.
 *
 * Le Retell Test n'est PAS ici : il se fait avec un humain qui n'a jamais vu
 * la scène, et il appartient à Paul.
 *
 * Usage : node scripts/hero-proof-qa.mjs
 */
import { chromium, webkit } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.PARRIT_BASE ?? "http://localhost:3000";
const OUT = "docs/design-system/qa/hero-proof";
const R = "/art-direction-lab/product-living-hero-proof";

const problems = [];
const note = (m) => problems.push(m);

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

const MOMENTS = ["signal", "comprehension", "travail", "arret", "decision", "action"];

/** Vocabulaire interdit à l'écran. La compréhension ne doit pas en dépendre. */
const JARGON = [
  "agent orchestration", "multi-agent", "multi agent", "LLM", "RAG",
  "policy", "memory", "provenance", "HumanGate", "human gate",
  "commit", "rollback", "POL-04", "R-014", "OPP-2041",
  "SGN", "CTX", "IDN", "REL", "HYP", "RSK", "ACT", "DEC",
  "orchestration", "agents coordonnés", "v0", "v1", "v2", "v3",
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

const moment = (page) => page.locator(".hp").getAttribute("data-moment");

async function attendre(page, cible, max = 16000) {
  await page
    .waitForFunction((c) => document.querySelector(".hp")?.getAttribute("data-moment") === c, cible, {
      timeout: max,
    })
    .catch(() => note(`le moment « ${cible} » n'est jamais atteint`));
}

/** Choisit un traitement sans toucher au reste. */
async function traitement(page, v) {
  await page.locator(".hp-lab-choix button", { hasText: v === "paper" ? "Paper" : "Ink" }).click();
  await page.waitForTimeout(150);
}

/** Contraste WCAG des textes visibles. C'est ce garde-fou qui manquait. */
const CONTRASTE = () => {
  const lum = (c) => {
    const [r, g, b] = c.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const rgb = (s) => (s.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);
  /* Les fonds semi-transparents doivent être COMPOSÉS sur ce qu'il y a
     derrière. Les lire comme opaques faisait passer un `rgba(255,255,255,.05)`
     posé sur de l'encre pour du blanc, et inventait des défauts inexistants. */
  const alpha = (s) => {
    const m = s.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(",").map((x) => parseFloat(x));
    return { c: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 };
  };
  const fond = (el) => {
    const couches = [];
    let n = el;
    while (n && n !== document.documentElement) {
      const v = alpha(getComputedStyle(n).backgroundColor);
      if (v && v.a > 0) {
        couches.push(v);
        if (v.a === 1) break;
      }
      n = n.parentElement;
    }
    if (!couches.length) return [255, 255, 255];
    // De la couche la plus profonde vers la plus proche.
    let base = couches[couches.length - 1].a === 1 ? couches.pop().c : [255, 255, 255];
    for (const c of couches.reverse()) {
      base = base.map((b, i) => c.c[i] * c.a + b * (1 - c.a));
    }
    return base;
  };
  const out = [];
  for (const el of document.querySelectorAll(".hp *")) {
    const propre = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!propre) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    if (parseFloat(cs.opacity) < 0.6) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const a = lum(rgb(cs.color));
    const b = lum(fond(el));
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const px = parseFloat(cs.fontSize);
    const gras = parseInt(cs.fontWeight, 10) >= 700;
    const seuil = px >= 24 || (px >= 18.66 && gras) ? 3 : 4.5;
    if (ratio < seuil) {
      out.push(`${el.className || el.tagName} ${ratio.toFixed(2)}:1 (seuil ${seuil}) « ${el.textContent.trim().slice(0, 30)} »`);
    }
  }
  return out;
};

const browser = await chromium.launch();
await mkdir(OUT, { recursive: true });

/* ===================== Structure, jargon, contraste ===================== */
{
  const { ctx, page, erreurs } = await open(browser, DESKTOP);

  /* ---- Hero Conversion Structure Test ---- */
  const structure = await page.evaluate(() => ({
    titre: document.querySelector(".hp-titre")?.textContent?.trim(),
    promesse: document.querySelector(".hp-promesse")?.textContent?.trim(),
    cta: document.querySelector(".hp-cta")?.textContent?.trim(),
    ctaHref: document.querySelector(".hp-cta")?.getAttribute("href"),
    preuve: Boolean(document.querySelector(".hp-proof")),
    demo: document.querySelector(".hp-demo")?.getAttribute("href"),
  }));
  for (const [cle, v] of Object.entries(structure)) {
    if (!v) note(`Hero Conversion Structure : ${cle} absent`);
  }
  if (structure.demo && !structure.demo.includes("product-living-scene")) {
    note("Hero Conversion Structure : le lien ne mène pas à la démonstration longue");
  }

  /* ---- La copy n'a pas bougé : comparaison au socle partagé ---- */
  const attendu = {
    eyebrow: "Direction IA opérationnelle · Mission de 3 mois",
    promesse:
      "On choisit le processus qui vous ralentit le plus, on construit le système d'agents qui l'exécute, puis on rend vos équipes autonomes.",
    cta: "Choisir le premier processus",
  };
  const eyebrow = (await page.locator(".hp-eyebrow").innerText()).trim();
  if (eyebrow.toLowerCase() !== attendu.eyebrow.toLowerCase()) note(`copy : eyebrow modifié — « ${eyebrow} »`);
  if (structure.promesse !== attendu.promesse) note("copy : la promesse a été modifiée");
  if (structure.cta !== attendu.cta) note(`copy : le CTA a été modifié — « ${structure.cta} »`);

  /* ---- Le ratio du hero ---- */
  const ratio = await page.evaluate(() => {
    const g = document.querySelector(".hp-grid");
    const l = document.querySelector(".hp-lede");
    const p = document.querySelector(".hp-preuve");
    if (!g || !p) return null;
    const total = g.getBoundingClientRect().width;
    return {
      editorial: (l?.getBoundingClientRect().width ?? 0) / total,
      preuve: p.getBoundingClientRect().width / total,
      hauteurPreuve: p.getBoundingClientRect().height,
    };
  });
  if (ratio) {
    if (ratio.preuve < 0.45 || ratio.preuve > 0.58) {
      note(`ratio : la preuve occupe ${Math.round(ratio.preuve * 100)}%, la cible est 48 à 55`);
    }
    if (ratio.hauteurPreuve < 380) note(`ratio : le panneau ne fait que ${Math.round(ratio.hauteurPreuve)}px, il devient décoratif`);
  }

  /* ---- Le premier viewport contient la promesse, le CTA et la preuve ---- */
  const premierEcran = await page.evaluate(() => {
    const dans = (s) => {
      const r = document.querySelector(s)?.getBoundingClientRect();
      return r ? r.top < window.innerHeight && r.bottom > 0 : false;
    };
    return { promesse: dans(".hp-promesse"), cta: dans(".hp-cta"), preuve: dans(".hp-proof") };
  });
  for (const [cle, v] of Object.entries(premierEcran)) {
    if (!v) note(`premier viewport : ${cle} hors écran`);
  }

  /* ---- No Jargon Test, sur le texte réellement affiché ---- */
  const texte = (await page.locator(".hp-hero").innerText()).toLowerCase();
  JARGON.filter((j) => new RegExp(`\\b${j.toLowerCase().replace(/[-]/g, "[- ]")}\\b`).test(texte)).forEach((j) =>
    note(`No Jargon : « ${j} » est affiché dans le hero`),
  );

  /* ---- Contraste ---- */
  for (const v of ["paper", "ink"]) {
    await traitement(page, v);
    await attendre(page, "action");
    await page.waitForTimeout(300);
    const faibles = await page.evaluate(CONTRASTE);
    faibles.slice(0, 4).forEach((f) => note(`contraste ${v} : ${f}`));
  }

  const over = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (over > 1) note(`débordement horizontal desktop de ${over}px`);
  erreurs.forEach((e) => note(`erreur console : ${e}`));
  await ctx.close();
}

/* ============ Six Moment · Human Stop · No Interaction Required ========== */
{
  const { ctx, page } = await open(browser, DESKTOP);

  /* On observe une boucle entière SANS jamais cliquer. */
  const suite = await page.evaluate(async () => {
    const vus = [];
    const t0 = Date.now();
    let arretDebut = null;
    let arretDuree = 0;
    while (Date.now() - t0 < 26000) {
      const m = document.querySelector(".hp")?.getAttribute("data-moment");
      if (m && vus[vus.length - 1] !== m) vus.push(m);
      if (m === "arret" && arretDebut === null) arretDebut = Date.now();
      if (m !== "arret" && arretDebut !== null && arretDuree === 0) {
        arretDuree = Date.now() - arretDebut;
      }
      if (vus.filter((x) => x === "signal").length >= 2) break;
      await new Promise((r) => setTimeout(r, 40));
    }
    return { vus, arretDuree };
  });

  /* ---- Six Moment Test : les six, dans l'ordre ---- */
  const cycle = suite.vus.slice(suite.vus.indexOf("signal"));
  const ordre = cycle.filter((m) => MOMENTS.includes(m));
  const attenduOrdre = MOMENTS.join(">");
  const obtenu = [...new Set(ordre)].join(">");
  if (!obtenu.startsWith(attenduOrdre)) {
    note(`Six Moment : ordre obtenu « ${obtenu} », attendu « ${attenduOrdre} »`);
  }
  if (!cycle.includes("respiration")) note("boucle : aucune respiration entre deux répétitions");

  /* ---- Human Stop Test ---- */
  if (suite.arretDuree < 1200) note(`Human Stop : l'arrêt ne dure que ${suite.arretDuree}ms, il faut au moins 1200`);

  /* ---- No Interaction Required Test ---- */
  if (![...new Set(ordre)].every((m) => MOMENTS.includes(m)) || new Set(ordre).size < 6) {
    note("No Interaction Required : la boucle n'atteint pas les six moments sans clic");
  }

  /* ---- Durée totale du cycle ---- */
  const duree = await page.evaluate(async () => {
    const lire = () => document.querySelector(".hp")?.getAttribute("data-moment");
    while (lire() !== "signal") await new Promise((r) => setTimeout(r, 30));
    const t0 = Date.now();
    while (lire() === "signal") await new Promise((r) => setTimeout(r, 30));
    while (lire() !== "signal") await new Promise((r) => setTimeout(r, 30));
    return Date.now() - t0;
  });
  if (duree < 8000 || duree > 12000) note(`boucle : ${duree}ms, la cible est 8 000 à 12 000`);

  /* ---- Pendant l'arrêt, aucune sortie n'est déjà visible ---- */
  await attendre(page, "arret");
  const pendant = await page.evaluate(() => ({
    arret: document.querySelector('.hp-arret[data-vu="oui"]') !== null,
    sortie: document.querySelector('.hp-sorties[data-vu="oui"]') !== null,
    decide: document.querySelector('.hp-arret[data-decide="oui"]') !== null,
  }));
  if (!pendant.arret) note("Human Stop : le bloc d'arrêt n'est pas visible pendant son moment");
  if (pendant.sortie) note("Human Stop : la sortie est déjà visible pendant l'arrêt");
  if (pendant.decide) note("Human Stop : la décision est marquée avant son moment");

  await ctx.close();
}

/* ================= Proof Not Decoration · Legibility ===================== */
{
  const { ctx, page } = await open(browser, DESKTOP);
  await attendre(page, "action");
  await page.waitForTimeout(400);

  const preuve = await page.evaluate(() => {
    const lignes = [
      ...document.querySelectorAll(
        ".hp-signal-objet, .hp-objet-ligne, .hp-effet-ligne, .hp-arret-raison, .hp-sortie-ligne",
      ),
    ].map((e) => e.textContent?.trim());
    const petits = [
      ...document.querySelectorAll(".hp-proof *"),
    ].filter((e) => {
      const propre = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      return propre && parseFloat(getComputedStyle(e).fontSize) < 13;
    }).length;
    const blocs = ["signal", "comprehension", "travail", "arret", "decision", "action"].map((b) => {
      const el = document.querySelector(`[data-bloc="${b}"]`);
      const r = el?.getBoundingClientRect();
      return { b, present: Boolean(el), aire: r ? Math.round(r.width * r.height) : 0 };
    });
    return { lignes: [...new Set(lignes.filter(Boolean))], petits, blocs };
  });

  if (preuve.lignes.length < 6) {
    note(`Proof Not Decoration : seulement ${preuve.lignes.length} informations métier distinctes`);
  }
  if (preuve.petits > 0) note(`Scene Legibility : ${preuve.petits} texte(s) sous 13px dans la preuve`);
  preuve.blocs.forEach((b) => {
    if (!b.present) note(`Six Moment : le bloc « ${b.b} » n'existe pas dans le balisage`);
    else if (b.aire < 2500) note(`Scene Legibility : le bloc « ${b.b} » ne fait que ${b.aire}px²`);
  });
  await ctx.close();
}

/* ===================== Paper / Ink Parity Test ========================== */
{
  const lire = async (v) => {
    const { ctx, page } = await open(browser, DESKTOP);
    await traitement(page, v);
    await attendre(page, "action");
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => ({
      texte: document.querySelector(".hp-hero")?.innerText.replace(/\s+/g, " ").trim(),
      blocs: [...document.querySelectorAll("[data-bloc]")].map((e) => e.getAttribute("data-bloc")).join(","),
    }));
    await ctx.close();
    return r;
  };
  const paper = await lire("paper");
  const ink = await lire("ink");
  if (paper.texte !== ink.texte) note("Paper / Ink Parity : les deux traitements n'affichent pas le même texte");
  if (paper.blocs !== ink.blocs) note("Paper / Ink Parity : les deux traitements n'ont pas la même structure");
}

/* ===================== Captures desktop, deux traitements =============== */
for (const v of ["paper", "ink"]) {
  const { ctx, page } = await open(browser, DESKTOP);
  await traitement(page, v);
  await attendre(page, "signal");
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/${v}-desktop-01-initial.png` });
  await attendre(page, "arret");
  await page.waitForTimeout(450);
  await page.screenshot({ path: `${OUT}/${v}-desktop-02-arret.png` });
  await attendre(page, "action");
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/${v}-desktop-03-sortie.png` });

  /* Séquence des six moments, timing identique pour les deux traitements. */
  for (const m of MOMENTS) {
    await attendre(page, m);
    await page.waitForTimeout(m === "travail" ? 1800 : 350);
    await page.locator(".hp-proof").screenshot({ path: `${OUT}/${v}-moment-${MOMENTS.indexOf(m) + 1}-${m}.png` });
  }
  await ctx.close();
}

/* ========================= Reduced Motion =============================== */
{
  const { ctx, page } = await open(browser, DESKTOP, { reducedMotion: "reduce" });
  const vus = await page.evaluate(async () => {
    const out = [];
    const t0 = Date.now();
    while (Date.now() - t0 < 14000) {
      const m = document.querySelector(".hp")?.getAttribute("data-moment");
      if (m && out[out.length - 1] !== m) out.push(m);
      await new Promise((r) => setTimeout(r, 40));
    }
    return out;
  });
  MOMENTS.forEach((m) => {
    if (!vus.includes(m)) note(`reduced-motion : le moment « ${m} » n'apparaît plus`);
  });
  const longues = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll(".hp *")) {
      const cs = getComputedStyle(el);
      if ((parseFloat(cs.transitionDuration) || 0) > 0.25) out.push(`${el.className} ${cs.transitionDuration}`);
    }
    return [...new Set(out)].slice(0, 3);
  });
  longues.forEach((l) => note(`reduced-motion : durée longue restante, ${l}`));
  await attendre(page, "arret");
  await page.waitForTimeout(200);
  if ((await page.locator('.hp-arret[data-vu="oui"]').count()) === 0) {
    note("reduced-motion : l'arrêt humain n'est plus visible");
  }
  await page.screenshot({ path: `${OUT}/reduced-motion.png` });
  await ctx.close();
}

/* ================= Onglet caché · démontage ============================= */
{
  const { ctx, page } = await open(browser, DESKTOP);
  await attendre(page, "travail");
  const veille = await page.evaluate(async () => {
    Object.defineProperty(document, "hidden", { value: true, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    const avant = document.querySelector(".hp")?.getAttribute("data-moment");
    await new Promise((r) => setTimeout(r, 1500));
    return { avant, apres: document.querySelector(".hp")?.getAttribute("data-moment") };
  });
  if (veille.avant !== veille.apres) note("veille : la boucle continue alors que l'onglet est caché");

  const restants = await page.evaluate(async () => {
    let actifs = 0;
    const vrai = window.setInterval;
    window.setInterval = (...a) => {
      actifs += 1;
      return vrai(...a);
    };
    const clear = window.clearInterval;
    window.clearInterval = (id) => {
      actifs -= 1;
      return clear(id);
    };
    document.querySelector(".hp")?.remove();
    await new Promise((r) => setTimeout(r, 400));
    return actifs;
  });
  if (restants > 0) note(`${restants} timer(s) encore actif(s) après démontage`);
  await ctx.close();
}

/* ===================== Mobile First View Test =========================== */
for (const v of ["paper", "ink"]) {
  const { ctx, page, erreurs } = await open(browser, MOBILE);
  await traitement(page, v);
  await attendre(page, "signal");
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/${v}-mobile-01-initial.png` });

  const vue = await page.evaluate(() => {
    const p = document.querySelector(".hp-proof")?.getBoundingClientRect();
    const cta = document.querySelector(".hp-cta")?.getBoundingClientRect();
    if (!p) return null;
    const visible = Math.max(0, Math.min(p.bottom, window.innerHeight) - Math.max(p.top, 0));
    return { haut: Math.round(p.top), visible: Math.round(visible), ecran: window.innerHeight, ctaApres: cta ? cta.top > p.top : false };
  });
  if (!vue) note(`mobile ${v} : pas de bloc de preuve`);
  else {
    if (vue.haut > vue.ecran * 0.75) {
      note(`Mobile First View ${v} : la preuve commence à ${vue.haut}px, trop bas`);
    }
    if (vue.visible < 200) note(`Mobile First View ${v} : seulement ${vue.visible}px de preuve visibles`);
    if (!vue.ctaApres) note(`mobile ${v} : l'appel à l'action n'est pas sous la preuve`);
  }

  await attendre(page, "arret");
  await page.waitForTimeout(450);
  await page.screenshot({ path: `${OUT}/${v}-mobile-02-arret.png` });

  const over = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (over > 1) note(`mobile ${v} : débordement horizontal de ${over}px`);

  const petits = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll(".hp *")) {
      if (!el.textContent?.trim() || el.children.length) continue;
      if (getComputedStyle(el).display === "none") continue;
      const px = parseFloat(getComputedStyle(el).fontSize);
      if (px < 12) out.push(`${el.className || el.tagName} ${px}px`);
    }
    return [...new Set(out)].slice(0, 4);
  });
  petits.forEach((p) => note(`mobile ${v} : microtexte ${p}`));
  erreurs.forEach((e) => note(`mobile ${v}, erreur console : ${e}`));
  await ctx.close();
}

await browser.close();

/* ============================== WebKit ================================== */
{
  const wk = await webkit.launch();
  const { ctx, page, erreurs } = await open(wk, DESKTOP);
  await attendre(page, "arret");
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/webkit-arret.png` });
  await attendre(page, "action");
  await page.waitForTimeout(500);
  if ((await page.locator('.hp-sorties[data-vu="oui"]').count()) === 0) {
    note("webkit : la sortie n'apparaît pas");
  }
  erreurs.forEach((e) => note(`webkit, erreur console : ${e}`));
  await ctx.close();
  await wk.close();
}

console.log(problems.length ? `PROBLÈMES (${problems.length})` : "Aucun problème.");
problems.forEach((p) => console.log("  ✗ " + p));
console.log("\nRetell Test : humain, non marqué automatiquement.");
process.exit(problems.length ? 1 : 0);
