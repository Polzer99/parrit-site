import { expect, test } from "./network-deny.setup";

/**
 * PORTE — le contraste se mesure contre le fond PEINT, jamais contre le registre ANNONCÉ.
 *
 * La règle, en compréhension :
 *
 *   Sur toute surface publiée du site, tout nœud de texte visible atteint le
 *   contraste WCAG 2.1 AA (1.4.3) contre le fond RÉELLEMENT PEINT sous lui :
 *   4,5:1, ramené à 3:1 pour du grand texte (>= 24px, ou >= 18,66px en graisse
 *   >= 700). Le fond réellement peint se calcule en remontant les ancêtres
 *   jusqu'à la première couche opaque, en compositant au passage les couches
 *   semi-transparentes rencontrées.
 *
 * Pourquoi cette formulation, et pas « vérifier que les tokens sont conformes » :
 *
 * 1. Un registre est un COUPLE (fond, encre), et une classe qui NOMME un registre
 *    ne prouve pas la couleur qui est PEINTE. `.ri-stage` portait `.r2-dark` —
 *    donc l'encre `--paper` du registre sombre — tout en remettant son fond à
 *    `transparent` dans une page claire. Résultat mesuré sur /journal et
 *    /fr/journal aux 3 viewports : deux phrases entières rendues à 1,00:1, soit
 *    INVISIBLES, sur la page même qui demande une adresse e-mail. Aucune porte
 *    lisant le CSS ne pouvait le voir : les deux déclarations étaient légitimes
 *    séparément. Seule la mesure du rendu l'attrape.
 *
 * 2. Symétriquement, `.quick-capture` est peinte carbone SANS porter `.r2-dark` :
 *    ses libellés restaient au gris du registre clair, à 2,59:1. Une porte
 *    écrite en liste de classes sombres serait passée à côté des deux cas, dans
 *    les deux sens.
 *
 * 3. Le fond composité n'est pas un détail : la command bar est
 *    `rgba(10,11,12,.92)`, donc son fond effectif dépend de la page en dessous.
 *    Au-dessus d'une page claire elle est la surface sombre la PLUS CLAIRE du
 *    site, et c'est elle qui fixe le plancher du gris secondaire `--g4`. Mesurer
 *    la couleur déclarée du conteneur aurait raté ses 170 nœuds.
 *
 * Les routes ne sont pas énumérées ici : elles sont lues dans le sitemap, pour
 * qu'une page ajoutée demain entre dans la porte sans que personne y pense.
 *
 * État prouvé ROUGE avant correction, par revert réel (git stash des deux
 * feuilles de style, rebuild, CSS servi vérifié à `--g4:#6f757b`) : 1 232 nœuds
 * en échec sur 5 544 mesurés (34 URL x 3 viewports). Répartition relevée dans
 * la sortie rouge, et non estimée — 948 `--g4` sur ink à 4,23:1, 170 sur la
 * command bar composée à 3,60:1, 84 sur carbon à 3,92:1, 12 à 1,00:1 (2 phrases
 * x 3 viewports x /journal et /fr/journal), 12 à 2,59:1 (2 libellés x 3
 * viewports x /commission et /fr/commission), 6 à 4,16:1. VERT après : 0 sur
 * 5 544, confirmé par un second instrument indépendant.
 */

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
];

/**
 * La porte balaie TOUTES les surfaces publiées, donc /commission, qui monte
 * l'embed Cal. Le deny-all coupe la requête dans tous les cas — rien ne sort
 * jamais d'un test. `expectBlockedRequest` ne change pas ce blocage : il dit
 * seulement si le test doit échouer parce qu'une sortie a été TENTÉE. Comme la
 * tentative est ici un comportement produit attendu (idiome déjà en place dans
 * conformity-commission.spec.ts), on l'accepte — mais plus strictement que
 * l'existant : l'assertion ci-dessous épingle l'hôte autorisé, si bien qu'une
 * NOUVELLE fuite vers un autre service ferait toujours rougir la porte.
 */
const HOTE_TENTE_ATTENDU = "app.cal.com";

test.use({ serviceWorkers: "block", expectBlockedRequest: true });
test.describe.configure({ mode: "serial" });

async function routesDuSitemap(request: import("@playwright/test").APIRequestContext) {
  const xml = await (await request.get(`${BASE_URL}/sitemap.xml`)).text();
  const routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .filter((p, i, all) => all.indexOf(p) === i);
  expect(routes.length, "le sitemap doit publier les surfaces à vérifier").toBeGreaterThan(20);
  return routes.sort();
}

/** Rendu dans la page : chaque nœud à texte direct, son contraste réel. */
const RELEVE = () => {
  const nombre = (v: string) => Number.parseFloat(v) || 0;
  const lire = (couleur: string) => {
    const m = couleur.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  type Couleur = { r: number; g: number; b: number; a: number };
  const luminance = ({ r, g, b }: Couleur) => {
    const c = (v: number) => {
      const x = v / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
  };
  const contraste = (a: Couleur, b: Couleur) => {
    const [haut, bas] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (haut + 0.05) / (bas + 0.05);
  };
  // Le fond PEINT : on remonte jusqu'à la première couche opaque et on
  // composite les couches semi-transparentes traversées, dans cet ordre.
  const fondPeint = (element: Element): Couleur => {
    const couches: Couleur[] = [];
    for (let n: Element | null = element; n; n = n.parentElement) {
      const fond = lire(getComputedStyle(n).backgroundColor);
      if (fond && fond.a > 0) {
        couches.push(fond);
        if (fond.a >= 1) break;
      }
    }
    if (!couches.length || couches[couches.length - 1].a < 1) {
      couches.push({ r: 255, g: 255, b: 255, a: 1 });
    }
    let sortie = couches[couches.length - 1];
    for (let i = couches.length - 2; i >= 0; i--) {
      const t = couches[i];
      sortie = {
        r: t.r * t.a + sortie.r * (1 - t.a),
        g: t.g * t.a + sortie.g * (1 - t.a),
        b: t.b * t.a + sortie.b * (1 - t.a),
        a: 1,
      };
    }
    return sortie;
  };
  // Le texte lu par un écran de lecture n'est pas peint : il n'a pas de contraste
  // à tenir. Même exclusion que la porte d'aération.
  const peint = (element: Element) => {
    if (!element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return false;
    for (let n: Element | null = element; n; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (s.clip !== "auto" || s.clipPath === "inset(50%)") return false;
    }
    return true;
  };

  const echecs: string[] = [];
  let mesures = 0;
  for (const element of document.querySelectorAll("body *")) {
    const texte = [...element.childNodes]
      .filter((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim())
      .map((n) => n.textContent!.trim())
      .join(" ");
    if (!texte || !peint(element)) continue;

    // On mesure le TEXTE, jamais la boîte : un <p> occupe sa colonne, son texte non.
    const plage = document.createRange();
    plage.selectNodeContents(element);
    const emprise = plage.getBoundingClientRect();
    if (emprise.width < 1 || emprise.height < 1) continue;

    const style = getComputedStyle(element);
    const encre = lire(style.color);
    if (!encre) continue;

    const taille = nombre(style.fontSize);
    const graisse =
      style.fontWeight === "normal" ? 400 : style.fontWeight === "bold" ? 700 : Number.parseInt(style.fontWeight, 10) || 400;
    const grandTexte = taille >= 24 || (taille >= 18.66 && graisse >= 700);
    const seuil = grandTexte ? 3 : 4.5;
    const mesure = contraste(encre, fondPeint(element));
    mesures += 1;

    if (mesure < seuil) {
      const hex = (c: Couleur) =>
        "#" + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
      const nom = `${element.tagName.toLowerCase()}${[...element.classList].map((c) => "." + c).join("")}`;
      echecs.push(
        `${nom} · ${hex(encre)} sur ${hex(fondPeint(element))} = ${mesure.toFixed(2)}:1 ` +
          `(seuil ${seuil}, ${taille}px/${graisse}) · ${JSON.stringify(texte.slice(0, 48))}`,
      );
    }
  }
  return { echecs, mesures };
};

test("tout texte peint tient le contraste AA contre son fond réel, aux 3 viewports", async ({
  page,
  request,
  blockedRequests,
}) => {
  test.setTimeout(600_000);
  const routes = await routesDuSitemap(request);
  await page.emulateMedia({ reducedMotion: "reduce" });

  const echecs: string[] = [];
  let mesures = 0;
  for (const route of routes) {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);
    // Une seule navigation, trois largeurs. Équivalence VÉRIFIÉE, pas supposée :
    // relevé (sélecteur, encre, fond peint, taille, graisse) comparé entre
    // « une navigation par viewport » et « une navigation, trois resize » sur
    // les 34 routes x 3 viewports — 102/102 relevés identiques, 5 544 nœuds de
    // part et d'autre. Seul le texte de l'horloge live diffère, et il ne porte
    // aucun contraste. Trois fois moins de charge sur le serveur, qui est
    // partagé avec le reste de la batterie : une porte qui affame les autres
    // tests jusqu'au timeout n'en est plus une.
    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport);
      const releve = await page.evaluate(RELEVE);
      mesures += releve.mesures;
      echecs.push(...releve.echecs.map((e) => `${route} @${viewport.width}px · ${e}`));
    }
  }

  // Un relevé vide voudrait dire que la porte ne regarde rien : elle serait
  // verte pour de mauvaises raisons.
  expect(mesures, "la porte doit avoir réellement mesuré du texte").toBeGreaterThan(3000);
  expect(echecs, `nœuds de texte sous le plancher WCAG AA (sur ${mesures} mesurés)`).toEqual([]);

  // Seul l'embed Cal a le droit d'être tenté. Toute autre sortie est une fuite.
  const hotesTentes = [...new Set(blockedRequests.map((u) => new URL(u).hostname))].sort();
  expect(hotesTentes, "aucune sortie réseau hors de l'embed Cal attendu").toEqual([HOTE_TENTE_ATTENDU]);
});
