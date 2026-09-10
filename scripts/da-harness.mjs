#!/usr/bin/env node
/**
 * Banc de mesure de la direction artistique.
 *
 * Une porte CSS verte ne prouve rien sur une DA : elle dit que la règle qu'on a
 * su écrire tient, pas que la page inspire confiance. Ce banc capture le RENDU
 * et le réduit à un vecteur de nombres, pour qu'un AVANT et un APRÈS se
 * comparent par soustraction au lieu de se comparer à l'impression.
 *
 * Il ne juge rien. Il compte. Le jugement reste au-dessus.
 *
 *   node scripts/da-harness.mjs --label avant
 *   node scripts/da-harness.mjs --label apres --compare avant
 *
 * Sorties dans .da-snapshots/<label>/ : les PNG, plus metrics.json.
 */

import { chromium } from "playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const RACINE = path.resolve(process.cwd(), ".da-snapshots");

const VIEWPORTS = [
  { nom: "desktop", width: 1440, height: 900 },
  { nom: "tablet", width: 768, height: 1024 },
  { nom: "mobile", width: 390, height: 844 },
];

/** Les surfaces structurelles, plus un échantillon d'articles : le Journal a 20
 *  pages bâties sur un gabarit unique, en mesurer trois suffit à voir le gabarit
 *  et évite de noyer les totaux sous vingt fois le même défaut. */
const SURFACES = [
  "/",
  "/manufacture",
  "/standard",
  "/dossiers",
  "/commission",
  "/journal",
  "/legal",
  "/fr",
  "/fr/manufacture",
  "/fr/standard",
  "/fr/dossiers",
  "/fr/commission",
  "/fr/journal",
  "/fr/legal",
  "/journal/what-is-parrit-ai",
  "/journal/one-card-one-action",
  "/journal/frontier-as-fallback",
];

/** L'échelle fermée décidée le 09/09. Toute taille rendue hors de cette liste
 *  est une déviation, pas une nuance. */
const ECHELLE_FIXE = [14, 16, 18, 22, 26];

function arg(nom, defaut) {
  const i = process.argv.indexOf(`--${nom}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : defaut;
}

/* ------------------------------------------------------------------ *
 * Mesure exécutée DANS la page.
 * Tout ce qui suit tourne dans le navigateur : pas de fermeture sur le
 * scope Node, tout passe par les arguments.
 * ------------------------------------------------------------------ */
function mesurer(echelleFixe) {
  const lum = (c) => {
    const v = c.map((x) => {
      const s = x / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  };
  const rgb = (s) => {
    const m = String(s).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(",").map((x) => parseFloat(x.trim()));
    return { c: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 };
  };
  const ratio = (a, b) => {
    const la = lum(a);
    const lb = lum(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };
  /** Le fond effectif n'est pas le background-color de l'élément, et ce n'est
   *  pas non plus le premier ancêtre « assez opaque ».
   *
   *  Une surface translucide ne se traverse pas, elle se COMPOSE. La barre de
   *  commandes du site est en rgba(10,11,12,.92) : un seuil qui exige 0.95
   *  passe au travers et mesure le texte contre le fond clair du body, ce qui
   *  rend un ratio de 1 sur un texte parfaitement lisible. On empile donc les
   *  couches jusqu'à la première franchement opaque, puis on les compose du
   *  fond vers la surface. */
  const fondEffectif = (el) => {
    const couches = [];
    let n = el;
    while (n && n !== document.documentElement) {
      const bg = rgb(getComputedStyle(n).backgroundColor);
      if (bg && bg.a > 0) {
        couches.push(bg);
        if (bg.a >= 0.999) break;
      }
      n = n.parentElement;
    }
    const html = rgb(getComputedStyle(document.documentElement).backgroundColor);
    const body = rgb(getComputedStyle(document.body).backgroundColor);
    let sortie = [255, 255, 255];
    if (body && body.a >= 0.999) sortie = body.c;
    if (html && html.a >= 0.999) sortie = html.c;
    for (let i = couches.length - 1; i >= 0; i--) {
      const l = couches[i];
      if (l.a >= 0.999) {
        sortie = l.c;
        continue;
      }
      sortie = [0, 1, 2].map((k) => l.c[k] * l.a + sortie[k] * (1 - l.a));
    }
    return sortie;
  };
  /** L'emprise du TEXTE, pas celle de la boîte. Un <p> occupe toute sa colonne,
   *  son texte non : mesurer la boîte fausse tout alignement et tout écart. */
  const rectTexte = (el) => {
    const r = document.createRange();
    r.selectNodeContents(el);
    const b = r.getBoundingClientRect();
    return b.width > 0 && b.height > 0 ? b : null;
  };

  const vu = (el) => {
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden" || parseFloat(s.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const tousLesElements = Array.from(document.querySelectorAll("body *")).filter(vu);

  /** Porteurs de texte : un élément dont au moins un enfant direct est du texte
   *  non vide. Compter les conteneurs ferait compter chaque mot plusieurs fois. */
  const porteurs = tousLesElements.filter((el) =>
    Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim().length > 0),
  );

  const typographies = new Set();
  const espacements = new Map();
  const contrastesEchoues = [];
  const deviations = [];
  let motsPremierEcran = 0;
  let encrePremierEcran = 0;

  const H = window.innerHeight;
  const W = window.innerWidth;

  for (const el of porteurs) {
    const s = getComputedStyle(el);
    const taille = Math.round(parseFloat(s.fontSize) * 10) / 10;
    const famille = s.fontFamily.split(",")[0].replace(/["']/g, "").trim();
    typographies.add([famille, taille, s.fontWeight, s.lineHeight, s.letterSpacing, s.textTransform].join("|"));

    // Échelle fermée : les pas fixes sont exacts, les pas fluides (clamp) sont
    // au-dessus de 26px. Une valeur intermédiaire n'est ni l'un ni l'autre.
    if (taille < 26 && !echelleFixe.includes(Math.round(taille))) {
      deviations.push({ type: "taille-hors-echelle", valeur: `${taille}px`, ou: el.tagName + "." + (el.className || "").toString().split(" ")[0] });
    }
    if (taille < 14) {
      deviations.push({ type: "sous-plancher-14", valeur: `${taille}px`, ou: el.tagName + "." + (el.className || "").toString().split(" ")[0] });
    }

    const fg = rgb(s.color);
    if (fg) {
      const bg = fondEffectif(el);
      const r = ratio(fg.c, bg);
      const gras = parseInt(s.fontWeight, 10) >= 700;
      const seuil = taille >= 24 || (taille >= 18.66 && gras) ? 3 : 4.5;
      if (r < seuil) {
        contrastesEchoues.push({
          ou: el.tagName.toLowerCase() + (el.className ? "." + String(el.className).split(" ")[0] : ""),
          mesure: Math.round(r * 100) / 100,
          seuil,
          taille,
          texte: el.textContent.trim().slice(0, 40),
        });
      }
    }

    const rt = rectTexte(el);
    if (rt && rt.top < H && rt.bottom > 0) {
      motsPremierEcran += el.textContent.trim().split(/\s+/).filter(Boolean).length;
      const hauteurVue = Math.min(rt.bottom, H) - Math.max(rt.top, 0);
      encrePremierEcran += Math.max(0, hauteurVue) * Math.min(rt.width, W);
    }
  }

  /** Les écarts verticaux entre frères de bloc successifs : c'est le rythme.
   *  Beaucoup de valeurs distinctes = pas de rythme, juste des marges posées
   *  au cas par cas. */
  for (const parent of tousLesElements) {
    const freres = Array.from(parent.children).filter((c) => {
      const d = getComputedStyle(c).display;
      return vu(c) && (d === "block" || d === "flex" || d === "grid");
    });
    for (let i = 1; i < freres.length; i++) {
      const a = freres[i - 1].getBoundingClientRect();
      const b = freres[i].getBoundingClientRect();
      const g = Math.round(b.top - a.bottom);
      if (g >= 4 && g <= 200) espacements.set(g, (espacements.get(g) || 0) + 1);
    }
  }

  /** Alignement : des frères de même rang doivent partager un bord gauche de
   *  TEXTE. Plus d'1px d'écart n'est pas perceptible isolément, mais l'accumu-
   *  lation de ces écarts est exactement ce qu'on lit comme « amateur ». */
  const erreursAlignement = [];
  for (const parent of tousLesElements) {
    const freres = Array.from(parent.children).filter(vu);
    if (freres.length < 2) continue;
    const rangs = new Map();
    for (const f of freres) {
      const cle = f.tagName + "|" + String(f.className || "").split(" ")[0];
      if (!rangs.has(cle)) rangs.set(cle, []);
      rangs.get(cle).push(f);
    }
    for (const [cle, groupe] of rangs) {
      if (groupe.length < 2) continue;
      const gauches = groupe.map((g) => {
        const r = rectTexte(g) || g.getBoundingClientRect();
        return r.left;
      });
      // Des colonnes côte à côte ont légitimement des gauches différentes : on
      // ne compare que des éléments empilés, donc de tops distincts.
      const tops = groupe.map((g) => g.getBoundingClientRect().top);
      const empiles = new Set(tops.map((t) => Math.round(t))).size === tops.length;
      if (!empiles) continue;
      const ecart = Math.max(...gauches) - Math.min(...gauches);
      /** Borne haute volontaire. Deux éléments de même rang décalés de 350px
       *  ne sont pas mal alignés : ce sont deux colonnes, une étiquette et sa
       *  valeur, un libellé et son chiffre. Le défaut d'alignement, celui qu'on
       *  lit comme un manque de métier, est le décalage PETIT — assez grand
       *  pour se voir, trop petit pour être voulu. */
      if (ecart > 1 && ecart <= 40) {
        erreursAlignement.push({ rang: cle, ecart: Math.round(ecart * 100) / 100, n: groupe.length });
      }
    }
  }

  /** Variantes de composant : la mesure de cohérence la plus parlante. Deux
   *  boutons qui diffèrent de 4px de padding sont deux composants, pas un. */
  const signature = (el) => {
    const s = getComputedStyle(el);
    return [s.paddingTop, s.paddingRight, s.paddingBottom, s.paddingLeft, s.borderWidth, s.borderStyle, s.borderRadius, s.backgroundColor].join("/");
  };
  const variantes = { bouton: new Set(), champ: new Set(), carte: new Set() };
  for (const el of tousLesElements) {
    const t = el.tagName.toLowerCase();
    const role = el.getAttribute("role");
    if (t === "button" || role === "button" || (t === "a" && getComputedStyle(el).backgroundColor !== "rgba(0, 0, 0, 0)")) {
      variantes.bouton.add(signature(el));
    } else if (t === "input" || t === "textarea" || t === "select") {
      variantes.champ.add(signature(el));
    } else if (t === "article" || t === "li" || el.className) {
      const s = getComputedStyle(el);
      const aUnFond = s.backgroundColor !== "rgba(0, 0, 0, 0)";
      const aUnContour = parseFloat(s.borderTopWidth) > 0 || parseFloat(s.borderLeftWidth) > 0;
      const r = el.getBoundingClientRect();
      if ((aUnFond || aUnContour) && r.width > 120 && r.height > 60) variantes.carte.add(signature(el));
    }
  }

  /** Rayons : le canon REV est à angle vif. Chaque rayon non nul rendu est soit
   *  une exception assumée, soit une fuite. Le banc les compte, il ne tranche pas. */
  const rayons = new Map();
  for (const el of tousLesElements) {
    const r = getComputedStyle(el).borderRadius;
    if (r && r !== "0px") rayons.set(r, (rayons.get(r) || 0) + 1);
  }

  const debordement = Math.max(0, document.documentElement.scrollWidth - W);
  const tropLarges = tousLesElements
    .filter((el) => el.getBoundingClientRect().width > W + 1)
    .map((el) => el.tagName.toLowerCase() + (el.className ? "." + String(el.className).split(" ")[0] : ""));

  return {
    TYPOGRAPHY_VARIANTS: typographies.size,
    SPACING_VARIANTS: espacements.size,
    ALIGNMENT_ERRORS: erreursAlignement.length,
    CONTRAST_FAILURES: contrastesEchoues.length,
    OVERFLOW: debordement,
    WORDS_VISIBLE_AT_FIRST_SCAN: motsPremierEcran,
    VISUAL_DENSITY: Math.round((encrePremierEcran / (W * H)) * 1000) / 10,
    COMPONENT_VARIANTS: {
      bouton: variantes.bouton.size,
      champ: variantes.champ.size,
      carte: variantes.carte.size,
      total: variantes.bouton.size + variantes.champ.size + variantes.carte.size,
    },
    BRAND_DEVIATIONS: deviations.length,
    detail: {
      contrastes: contrastesEchoues.slice(0, 25),
      alignements: erreursAlignement.slice(0, 25),
      deviations: deviations.slice(0, 25),
      rayons: Array.from(rayons.entries()),
      tropLarges: Array.from(new Set(tropLarges)).slice(0, 10),
      espacements: Array.from(espacements.entries()).sort((a, b) => b[1] - a[1]).slice(0, 12),
    },
  };
}

/* ------------------------------------------------------------------ */

async function capturer(label) {
  const dossier = path.join(RACINE, label);
  await mkdir(dossier, { recursive: true });

  const navigateur = await chromium.launch();
  const releve = { label, base: BASE, pages: {} };

  for (const vp of VIEWPORTS) {
    const contexte = await navigateur.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    // Rien ne sort vers l'extérieur pendant une mesure : un banc qui appelle le
    // réseau ne mesure plus la page, il mesure la météo du réseau.
    await contexte.route("**/*", (route) => {
      const h = new URL(route.request().url()).hostname;
      return h === "localhost" || h === "127.0.0.1" ? route.continue() : route.abort("blockedbyclient");
    });
    const page = await contexte.newPage();

    for (const surface of SURFACES) {
      const slug = surface === "/" ? "home" : surface.replace(/^\//, "").replace(/\//g, "_");
      try {
        await page.goto(`${BASE}${surface}`, { waitUntil: "networkidle", timeout: 30000 });
      } catch {
        await page.goto(`${BASE}${surface}`, { waitUntil: "domcontentloaded", timeout: 30000 });
      }
      await page.waitForTimeout(350);

      await page.screenshot({ path: path.join(dossier, `${slug}__${vp.nom}.png`), fullPage: true });
      const m = await page.evaluate(mesurer, ECHELLE_FIXE);
      releve.pages[`${surface}@${vp.nom}`] = m;
      process.stdout.write(`  ${vp.nom.padEnd(8)} ${surface.padEnd(34)} typo:${String(m.TYPOGRAPHY_VARIANTS).padStart(3)} esp:${String(m.SPACING_VARIANTS).padStart(3)} align:${String(m.ALIGNMENT_ERRORS).padStart(3)} contraste:${String(m.CONTRAST_FAILURES).padStart(3)} comp:${String(m.COMPONENT_VARIANTS.total).padStart(2)} dev:${String(m.BRAND_DEVIATIONS).padStart(3)}\n`);
    }
    await contexte.close();
  }
  await navigateur.close();

  releve.totaux = agreger(releve.pages);
  await writeFile(path.join(dossier, "metrics.json"), JSON.stringify(releve, null, 2));
  return releve;
}

function agreger(pages) {
  const t = {
    TYPOGRAPHY_VARIANTS: 0,
    SPACING_VARIANTS: 0,
    ALIGNMENT_ERRORS: 0,
    CONTRAST_FAILURES: 0,
    OVERFLOW: 0,
    COMPONENT_VARIANTS: 0,
    BRAND_DEVIATIONS: 0,
  };
  let n = 0;
  let densite = 0;
  let mots = 0;
  for (const m of Object.values(pages)) {
    // Les variantes se cumulent en MAXIMUM par page, pas en somme : additionner
    // 17 pages donnerait un nombre impressionnant qui ne dit rien. Ce qu'on veut
    // savoir, c'est combien de variantes un visiteur rencontre sur UNE page.
    t.TYPOGRAPHY_VARIANTS = Math.max(t.TYPOGRAPHY_VARIANTS, m.TYPOGRAPHY_VARIANTS);
    t.SPACING_VARIANTS = Math.max(t.SPACING_VARIANTS, m.SPACING_VARIANTS);
    t.COMPONENT_VARIANTS = Math.max(t.COMPONENT_VARIANTS, m.COMPONENT_VARIANTS.total);
    // Les défauts, eux, se somment : chacun est subi par quelqu'un.
    t.ALIGNMENT_ERRORS += m.ALIGNMENT_ERRORS;
    t.CONTRAST_FAILURES += m.CONTRAST_FAILURES;
    t.OVERFLOW += m.OVERFLOW > 0 ? 1 : 0;
    t.BRAND_DEVIATIONS += m.BRAND_DEVIATIONS;
    densite += m.VISUAL_DENSITY;
    mots += m.WORDS_VISIBLE_AT_FIRST_SCAN;
    n++;
  }
  t.VISUAL_DENSITY_MOYENNE = Math.round((densite / n) * 10) / 10;
  t.WORDS_AT_FIRST_SCAN_MOYENNE = Math.round(mots / n);
  t.surfaces_mesurees = n;
  return t;
}

async function comparer(apres, labelAvant) {
  const f = path.join(RACINE, labelAvant, "metrics.json");
  if (!existsSync(f)) {
    console.log(`\nPas de relevé « ${labelAvant} » : rien à comparer.`);
    return;
  }
  const avant = JSON.parse(await readFile(f, "utf8"));
  console.log(`\n╔══ BENCHMARK VISUEL · ${labelAvant} → ${apres.label} ══╗\n`);
  const cles = Object.keys(apres.totaux);
  for (const c of cles) {
    const a = avant.totaux[c];
    const b = apres.totaux[c];
    if (typeof a !== "number" || typeof b !== "number") continue;
    const d = b - a;
    const fleche = d === 0 ? "  =" : d < 0 ? "  ↓" : "  ↑";
    console.log(`  ${c.padEnd(32)} ${String(a).padStart(7)} → ${String(b).padStart(7)}  ${fleche} ${d > 0 ? "+" : ""}${d}`);
  }
  console.log(
    "\n  Un ↓ sur les défauts est un gain. Un ↓ sur WORDS_AT_FIRST_SCAN ou sur\n" +
      "  VISUAL_DENSITY peut être une perte d'information déguisée en aération :\n" +
      "  ces deux-là se lisent avec les captures, jamais seuls.\n",
  );
}

const label = arg("label", "courant");
const contre = arg("compare", null);
console.log(`\nBanc DA · ${BASE} · relevé « ${label} »\n`);
const releve = await capturer(label);
console.log(`\nTotaux (variantes = maximum par page, défauts = somme) :`);
for (const [k, v] of Object.entries(releve.totaux)) console.log(`  ${k.padEnd(32)} ${v}`);
if (contre) await comparer(releve, contre);
console.log(`\nCaptures et metrics.json dans .da-snapshots/${label}/\n`);
