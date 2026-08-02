/**
 * PRODUCT LIVING HERO PROOF — contrôles du hero.
 *
 * Teste /art-direction-lab/product-living-hero-proof dans ses deux
 * traitements, plus le mode présentation. Les harnais de Concept D et des
 * scènes longues restent séparés et inchangés.
 *
 * Ce harnais porte les standards produit du benchmark :
 * `docs/design-system/SILICON-VALLEY-AI-PRODUCT-STANDARDS.md`.
 *
 * Le Retell Test n'est PAS ici : il se fait avec un humain qui n'a jamais vu
 * la scène, en mode présentation, et il appartient à Paul.
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

/** Les cinq chapitres visibles. La logique interne en compte six. */
const CHAPITRES = ["signal", "verification", "manque", "decision", "sortie"];

/** Vocabulaire de niveau 3 et jargon : rien de tout cela dans le hero. */
const INTERDITS = [
  "agent orchestration", "multi-agent", "multi agent", "LLM", "RAG",
  "policy", "memory", "provenance", "HumanGate", "human gate", "guardrail",
  "commit", "rollback", "POL-04", "R-014", "OPP-2041", "workflow state",
  "SGN", "CTX", "IDN", "REL", "HYP", "RSK", "ACT", "DEC",
  "orchestration", "ingestion", "tool invocation", "agent run",
  "v0", "v1", "v2", "v3",
];

async function open(browser, viewport, opts = {}, suffixe = "") {
  const ctx = await browser.newContext({ viewport, ...opts });
  const page = await ctx.newPage();
  const erreurs = [];
  page.on("pageerror", (e) => erreurs.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") erreurs.push(m.text());
  });
  await page.goto(BASE + R + suffixe, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.mouse.move(2, 2);
  return { ctx, page, erreurs };
}

const chapitre = (page) => page.locator(".hp").getAttribute("data-chapitre");

async function attendre(page, cible, max = 22000) {
  await page
    .waitForFunction((c) => document.querySelector(".hp")?.getAttribute("data-chapitre") === c, cible, {
      timeout: max,
    })
    .catch(() => note(`le chapitre « ${cible} » n'est jamais atteint`));
}

async function traitement(page, v) {
  await page.locator(".hp-lab-choix button", { hasText: v === "paper" ? "Paper" : "Ink" }).click();
  await page.waitForTimeout(150);
}

const pose = (page, ms = 500) => page.waitForTimeout(ms);

/** Contraste WCAG, fonds semi-transparents composés. */
const CONTRASTE = () => {
  const lum = (c) => {
    const [r, g, b] = c.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const rgb = (s) => (s.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);
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
    let base = couches[couches.length - 1].a === 1 ? couches.pop().c : [255, 255, 255];
    for (const c of couches.reverse()) base = base.map((b, i) => c.c[i] * c.a + b * (1 - c.a));
    return base;
  };
  const out = [];
  for (const el of document.querySelectorAll(".hp *")) {
    const propre = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!propre) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.6) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const a = lum(rgb(cs.color));
    const b = lum(fond(el));
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const px = parseFloat(cs.fontSize);
    const seuil = px >= 24 || (px >= 18.66 && parseInt(cs.fontWeight, 10) >= 700) ? 3 : 4.5;
    if (ratio < seuil) {
      out.push(`${el.className || el.tagName} ${ratio.toFixed(2)}:1 « ${el.textContent.trim().slice(0, 28)} »`);
    }
  }
  return out;
};

const browser = await chromium.launch();
await mkdir(OUT, { recursive: true });

/* ============ Structure, standards de lecture, contraste ================ */
{
  const { ctx, page, erreurs } = await open(browser, DESKTOP);

  /* ---- Hero Conversion Structure · One Primary Action ---- */
  const structure = await page.evaluate(() => ({
    titre: document.querySelector(".hp-titre")?.textContent?.trim(),
    promesse: document.querySelector(".hp-promesse")?.textContent?.trim(),
    cta: document.querySelector(".hp-cta")?.textContent?.trim(),
    preuve: Boolean(document.querySelector(".hp-proof")),
    demo: document.querySelector(".hp-demo")?.getAttribute("href"),
    ctasPrincipaux: document.querySelectorAll(".hp-cta").length,
    boutonsDansPreuve: document.querySelectorAll(".hp-proof button, .hp-proof a").length,
  }));
  for (const cle of ["titre", "promesse", "cta", "preuve", "demo"]) {
    if (!structure[cle]) note(`Hero Conversion Structure : ${cle} absent`);
  }
  if (structure.ctasPrincipaux !== 1) note(`One Primary Action : ${structure.ctasPrincipaux} appels à l'action principaux`);
  if (structure.boutonsDansPreuve > 0) {
    note(`One Primary Action : ${structure.boutonsDansPreuve} élément(s) cliquable(s) dans la preuve`);
  }

  /* ---- Complexity Available : le lien mène au même scénario ---- */
  if (structure.demo && !structure.demo.includes("product-living-scene")) {
    note("Complexity Available : le lien ne mène pas à la démonstration longue");
  }

  /* ---- La copy commerciale n'a pas bougé ---- */
  const attendu = {
    eyebrow: "Direction IA opérationnelle · Mission de 3 mois",
    promesse:
      "On choisit le processus qui vous ralentit le plus, on construit le système d'agents qui l'exécute, puis on rend vos équipes autonomes.",
    cta: "Choisir le premier processus",
  };
  const eyebrow = (await page.locator(".hp-eyebrow").innerText()).trim();
  if (eyebrow.toLowerCase() !== attendu.eyebrow.toLowerCase()) note(`copy : eyebrow modifié — « ${eyebrow} »`);
  if (structure.promesse !== attendu.promesse) note("copy : la promesse a été modifiée");
  if (structure.cta !== attendu.cta) note(`copy : l'appel à l'action a été modifié — « ${structure.cta} »`);

  /* ---- Demo Honesty ---- */
  const specimen = await page.locator(".hp-specimen").innerText();
  if (!/démonstration/i.test(specimen)) note(`Demo Honesty : mention de démonstration absente — « ${specimen} »`);

  /* ---- Object First : l'objet avant les agents, et aucun agent nommé ---- */
  const objet = await page.evaluate(() => ({
    present: Boolean(document.querySelector(".hp-objet")),
    titre: document.querySelector(".hp-objet-titre")?.textContent?.trim(),
  }));
  if (!objet.present || !objet.titre) note("Object First : aucun objet métier permanent");
  const texteHero = (await page.locator(".hp-hero").innerText()).toLowerCase();
  ["agent ", "agents", "orchestrateur"].forEach((m) => {
    // « système d'agents » appartient à la promesse commerciale : on ne compte
    // que ce qui est écrit dans la preuve elle-même.
    if (m !== "agents" && texteHero.includes(m)) note(`Object First : « ${m} » nommé dans le hero`);
  });
  const textePreuve = (await page.locator(".hp-proof").innerText()).toLowerCase();
  if (/agent/.test(textePreuve)) note("Object First : un agent est nommé dans la preuve");

  /* ---- Progressive Disclosure · No Jargon ---- */
  INTERDITS.filter((j) =>
    new RegExp(`\\b${j.toLowerCase().replace(/-/g, "[- ]")}\\b`).test(textePreuve),
  ).forEach((j) => note(`Progressive Disclosure : « ${j} » affiché dans la preuve`));
  if (/\d{1,2}:\d{2}|\bil y a \d/.test(textePreuve.replace(/mar 09:30/g, ""))) {
    note("Progressive Disclosure : un horodatage est affiché dans la preuve");
  }

  /* ---- Contraste, dans les deux traitements ---- */
  for (const v of ["ink", "paper"]) {
    await traitement(page, v);
    await attendre(page, "sortie");
    await pose(page, 400);
    (await page.evaluate(CONTRASTE)).slice(0, 4).forEach((f) => note(`contraste ${v} : ${f}`));
  }
  await traitement(page, "ink");

  erreurs.forEach((e) => note(`erreur console : ${e}`));
  await ctx.close();
}

/* ====== Five Chapter · Human Pace · One Focus · budget de texte ========== */
{
  const { ctx, page } = await open(browser, DESKTOP);

  /* Un cycle entier observé SANS jamais cliquer, avec les temps réels. */
  const suite = await page.evaluate(async (chaps) => {
    const vus = [];
    const durees = {};
    /* On ne commence à chronométrer qu'APRÈS être entré dans un chapitre :
       sinon le premier observé est mesuré depuis le début de l'observation,
       donc tronqué, et le test accuse le produit d'un défaut qui n'existe pas. */
    let demarre = false;
    let courant = null;
    let debut = Date.now();
    let arret = 0;
    let arretDebut = null;
    const t0 = Date.now();
    const focus = new Set();
    let actives = 0;

    while (Date.now() - t0 < 45000) {
      const el = document.querySelector(".hp");
      const c = el?.getAttribute("data-chapitre");
      const f = el?.getAttribute("data-focus");
      if (f) focus.add(f);
      // Une seule surface active à la fois : le chapitre courant.
      actives = Math.max(actives, document.querySelectorAll(".hp-chapitre").length);
      if (c !== courant) {
        if (demarre && courant) {
          durees[courant] = Math.max(durees[courant] ?? 0, Date.now() - debut);
        }
        if (c === "signal") demarre = true;
        courant = c;
        debut = Date.now();
        vus.push(c);
      }
      const bloque = el?.getAttribute("data-focus");
      if (bloque === "missing_information" && arretDebut === null) arretDebut = Date.now();
      if (arretDebut !== null && !document.querySelector('.hp-proof[data-arrete="oui"]') && arret === 0) {
        arret = Date.now() - arretDebut;
      }
      /* On sort au TROISIÈME passage : le deuxième cycle est alors complet et
         chronométré de bout en bout, celui-là seul fait foi. */
      if (demarre && vus.filter((x) => x === "signal").length >= 3) break;
      await new Promise((r) => setTimeout(r, 40));
    }
    return { vus, durees, arret, focus: [...focus], actives };
  }, CHAPITRES);

  /* ---- Five Chapter Test ---- */
  const cycle = suite.vus.slice(suite.vus.indexOf("signal"));
  const ordre = [...new Set(cycle.filter((c) => CHAPITRES.includes(c)))];
  if (ordre.join(">") !== CHAPITRES.join(">")) {
    note(`Five Chapter : ordre obtenu « ${ordre.join(">")} », attendu « ${CHAPITRES.join(">")} »`);
  }
  if (!cycle.includes("respiration")) note("Five Chapter : aucune respiration avant la répétition");

  /* ---- Human Pace Test ---- */
  for (const c of CHAPITRES) {
    const d = suite.durees[c] ?? 0;
    if (d < 1800) note(`Human Pace : le chapitre « ${c} » ne tient que ${d}ms, il en faut 1800`);
  }
  if (suite.arret < 2000) note(`Human Pace : l'arrêt ne dure que ${suite.arret}ms, il en faut 2000`);
  const respiration = suite.durees.respiration ?? 0;
  if (respiration < 1000) note(`Human Pace : respiration de ${respiration}ms, il en faut 1000`);

  /* ---- Durée totale ---- */
  const total = CHAPITRES.reduce((s, c) => s + (suite.durees[c] ?? 0), 0) + respiration;
  if (total < 11000 || total > 15000) note(`boucle : ${total}ms au total, la cible est 12 000 à 14 000`);

  /* ---- One Focus Test ---- */
  if (suite.actives > 1) note(`One Focus : ${suite.actives} chapitres rendus simultanément`);
  if (suite.focus.length !== 5) note(`One Focus : ${suite.focus.length} valeurs de focus au lieu de 5`);

  /* ---- State Legibility : budget de texte, chapitre par chapitre ---- */
  for (const c of CHAPITRES) {
    await attendre(page, c);
    await pose(page, 300);
    const b = await page.evaluate(() => ({
      titre: document.querySelector(".hp-chap-titre")?.textContent?.trim() ?? "",
      info: document.querySelector(".hp-chap-info")?.textContent?.trim() ?? "",
      lignes: document.querySelectorAll(".hp-chap-corps li, .hp-chap-corps p").length,
      rouges: [...document.querySelectorAll(".hp-proof *")].filter((el) => {
        const cs = getComputedStyle(el);
        const propre = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        return propre && /rgb\(209, 19, 47/.test(cs.color);
      }).length,
    }));
    const mt = b.titre.split(/\s+/).filter(Boolean).length;
    const mi = b.info.split(/\s+/).filter(Boolean).length;
    if (mt < 2 || mt > 5) note(`State Legibility : titre de « ${c} » = ${mt} mots, budget 2 à 5`);
    if (mi > 12) note(`State Legibility : information de « ${c} » = ${mi} mots, budget 12`);
    if (b.lignes > 3) note(`One Focus : ${b.lignes} éléments dans le corps de « ${c} », maximum 3`);
    if (b.rouges > 0) note(`One Focus : ${b.rouges} texte(s) secondaire(s) en rouge dans « ${c} »`);
  }

  /* ---- Human Ownership · Concrete Output ---- */
  await attendre(page, "decision");
  await pose(page, 1700);
  const decision = await page.evaluate(() => ({
    acte: document.querySelector(".hp-decision-acte")?.textContent?.trim(),
    visage: Boolean(document.querySelector(".hp-photo")),
    action: document.querySelector(".hp-decision-action")?.textContent?.trim(),
    sortieVisible: document.querySelectorAll(".hp-sorties li").length,
  }));
  if (!decision.acte || !/humain/i.test(decision.acte)) note("Human Ownership : la décision n'est pas attribuée à un humain");
  if (!decision.visage) note("Human Ownership : aucune incarnation de la décision");
  if (!decision.action) note("Human Ownership : l'action proposée n'est pas montrée avant la décision");
  if (decision.sortieVisible > 0) note("Human Stop : une sortie est visible pendant la décision");
  await page.screenshot({ path: `${OUT}/ink-desktop-04-decision.png` });

  await attendre(page, "sortie");
  await pose(page, 900);
  const sortie = await page.locator(".hp-proof").innerText();
  if (!/prépar/i.test(sortie)) note("Concrete Output : l'état « préparé » n'est pas nommé");
  if (/\benvoyé\b/i.test(sortie) && !/rien n'a été envoyé/i.test(sortie)) {
    note("Concrete Output : « envoyé » est employé pour une action seulement préparée");
  }
  await page.screenshot({ path: `${OUT}/ink-desktop-05-sortie.png` });
  await ctx.close();
}

/* ================= Captures desktop, deux traitements =================== */
for (const v of ["ink", "paper"]) {
  const { ctx, page } = await open(browser, DESKTOP);
  await traitement(page, v);
  for (const c of CHAPITRES) {
    await attendre(page, c);
    await pose(page, c === "decision" ? 1700 : 800);
    await page.screenshot({ path: `${OUT}/${v}-desktop-${CHAPITRES.indexOf(c) + 1}-${c}.png` });
  }
  await ctx.close();
}

/* ============================ No Overflow =============================== */
{
  const VIEWPORTS = [
    [320, 568], [375, 812], [390, 844], [768, 1024],
    [1024, 768], [1280, 720], [1440, 900], [1728, 1117],
  ];
  for (const [w, h] of VIEWPORTS) {
    const { ctx, page } = await open(browser, { width: w, height: h });
    await attendre(page, "decision");
    await pose(page, 1700);
    const deborde = await page.evaluate(() => {
      const doc = document.documentElement;
      const hors = [];
      const cadre = document.querySelector(".hp-proof")?.getBoundingClientRect();
      for (const el of document.querySelectorAll(".hp *")) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (r.right > doc.clientWidth + 1 || r.left < -1) {
          hors.push(`${el.className || el.tagName} → ${Math.round(r.right)}`);
        }
        // Rien ne sort du panneau de preuve.
        if (cadre && el.closest(".hp-proof") && (r.right > cadre.right + 1 || r.bottom > cadre.bottom + 1)) {
          hors.push(`hors panneau : ${el.className || el.tagName}`);
        }
      }
      return { page: doc.scrollWidth - doc.clientWidth, hors: [...new Set(hors)].slice(0, 3) };
    });
    if (deborde.page > 1) note(`No Overflow ${w}×${h} : débordement de ${deborde.page}px`);
    deborde.hors.forEach((x) => note(`No Overflow ${w}×${h} : ${x}`));
    if (w === 320 || w === 1280) {
      await page.screenshot({ path: `${OUT}/overflow-${w}x${h}.png` });
    }
    await ctx.close();
  }

  /* Zoom 200 % : on double la taille de base plutôt que le facteur d'échelle,
     c'est ce que fait réellement le zoom texte des navigateurs. */
  const { ctx, page } = await open(browser, { width: 1440, height: 900 });
  await page.addStyleTag({ content: ".hp { font-size: 32px }" });
  await attendre(page, "decision");
  await pose(page, 800);
  const zoom = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (zoom > 1) note(`No Overflow zoom 200% : débordement de ${zoom}px`);
  await ctx.close();
}

/* ===================== Mobile One Moment ================================ */
for (const v of ["ink", "paper"]) {
  const { ctx, page, erreurs } = await open(browser, MOBILE);
  await traitement(page, v);
  await attendre(page, "signal");
  await pose(page, 400);
  await page.screenshot({ path: `${OUT}/${v}-mobile-1-signal.png` });

  const vue = await page.evaluate(() => {
    const p = document.querySelector(".hp-proof")?.getBoundingClientRect();
    const cta = document.querySelector(".hp-cta")?.getBoundingClientRect();
    if (!p) return null;
    return {
      haut: Math.round(p.top),
      visible: Math.round(Math.max(0, Math.min(p.bottom, window.innerHeight) - Math.max(p.top, 0))),
      ecran: window.innerHeight,
      ctaApres: cta ? cta.top > p.top : false,
      chapitres: document.querySelectorAll(".hp-chapitre").length,
    };
  });
  if (!vue) note(`mobile ${v} : pas de preuve`);
  else {
    if (vue.haut > vue.ecran * 0.75) note(`Mobile First View ${v} : la preuve commence à ${vue.haut}px`);
    if (vue.visible < 200) note(`Mobile First View ${v} : ${vue.visible}px de preuve visibles seulement`);
    if (!vue.ctaApres) note(`mobile ${v} : l'appel à l'action n'est pas sous la preuve`);
    if (vue.chapitres !== 1) note(`Mobile One Moment ${v} : ${vue.chapitres} chapitres à l'écran`);
  }

  await attendre(page, "manque");
  await pose(page, 500);
  await page.screenshot({ path: `${OUT}/${v}-mobile-3-manque.png` });
  await attendre(page, "sortie");
  await pose(page, 900);
  await page.screenshot({ path: `${OUT}/${v}-mobile-5-sortie.png` });

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

/* ======================= Mode présentation ============================== */
{
  const { ctx, page } = await open(browser, DESKTOP, {}, "?presentation=1");
  const chrome = await page.evaluate(() => ({
    lab: document.querySelectorAll(".hp-lab").length,
    boutons: document.querySelectorAll(".hp-lab-choix button").length,
    cta: document.querySelectorAll(".hp-cta").length,
    preuve: document.querySelectorAll(".hp-proof").length,
    demo: document.querySelectorAll(".hp-demo").length,
  }));
  if (chrome.lab > 0 || chrome.boutons > 0) note("mode présentation : le mobilier de laboratoire est encore visible");
  if (chrome.cta !== 1 || chrome.preuve !== 1 || chrome.demo !== 1) {
    note("mode présentation : le hero n'est pas complet");
  }
  await attendre(page, "decision");
  await pose(page, 1700);
  await page.screenshot({ path: `${OUT}/presentation-decision.png` });
  await ctx.close();
}

/* ========================= Reduced Motion =============================== */
{
  const { ctx, page } = await open(browser, DESKTOP, { reducedMotion: "reduce" });
  const vus = await page.evaluate(async () => {
    const out = [];
    const t0 = Date.now();
    while (Date.now() - t0 < 16000) {
      const c = document.querySelector(".hp")?.getAttribute("data-chapitre");
      if (c && out[out.length - 1] !== c) out.push(c);
      await new Promise((r) => setTimeout(r, 40));
    }
    return out;
  });
  CHAPITRES.forEach((c) => {
    if (!vus.includes(c)) note(`reduced-motion : le chapitre « ${c} » n'apparaît plus`);
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
  await page.screenshot({ path: `${OUT}/reduced-motion.png` });
  await ctx.close();
}

/* ================= Veille onglet · démontage ============================ */
{
  const { ctx, page } = await open(browser, DESKTOP);
  await attendre(page, "verification");
  const veille = await page.evaluate(async () => {
    Object.defineProperty(document, "hidden", { value: true, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    const avant = document.querySelector(".hp")?.getAttribute("data-chapitre");
    await new Promise((r) => setTimeout(r, 1500));
    return { avant, apres: document.querySelector(".hp")?.getAttribute("data-chapitre") };
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

await browser.close();

/* ============================== WebKit ================================== */
{
  const wk = await webkit.launch();
  const { ctx, page, erreurs } = await open(wk, DESKTOP);
  await attendre(page, "decision");
  await pose(page, 1700);
  await page.screenshot({ path: `${OUT}/webkit-decision.png` });
  await attendre(page, "sortie");
  await pose(page, 900);
  if ((await page.locator('.hp-sorties li[data-vu="oui"]').count()) === 0) {
    note("webkit : la sortie n'apparaît pas");
  }
  erreurs.forEach((e) => note(`webkit, erreur console : ${e}`));
  await ctx.close();
  await wk.close();
}

console.log(problems.length ? `PROBLÈMES (${problems.length})` : "Aucun problème.");
problems.forEach((p) => console.log("  ✗ " + p));
console.log("\nRetell Test : humain, en mode présentation, non marqué automatiquement.");
process.exit(problems.length ? 1 : 0);
