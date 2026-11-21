// Système visuel unique, décision de Paul du 21/11/2026 (soir).
// Source : docs/AUDIT-VISUEL-2026-11-21.md (partie 3) et docs/CODEX-SPEC-2026-11-21-coherence-visuelle.md.
// Ce fichier porte le relevé fait dans la page et la lecture de ce relevé : la spec Playwright et le
// script de mesure s'en servent tous les deux, pour que chaque valeur attendue soit une valeur mesurée.
// Les valeurs attendues sont écrites ici en clair : un jeton modifié ne doit pas faire passer le test.

export const COHERENCE_PAGES = [
  { nom: "accueil", chemin: "/" },
  { nom: "offre", chemin: "/journal/themes/ai-sprints" },
  { nom: "journal", chemin: "/journal" },
  { nom: "article", chemin: "/journal/permission-layer-for-coding-agents" },
  { nom: "rendez-vous", chemin: "/rendez-vous" },
  { nom: "legal", chemin: "/legal" },
  { nom: "erreur", chemin: "/coherence-visuelle-page-absente" },
] as const;
export const COHERENCE_VIEWPORTS = [{ width: 1440, height: 800 }, { width: 390, height: 700 }] as const;
export type CoherencePage = typeof COHERENCE_PAGES[number]["nom"];

type Titre = { texte: string; type: string; x: number; ecart: number };
type Bouton = {
  texte: string; principal: boolean; grand: boolean; envoi: boolean; taille: number; hauteur: number; filet: string; fond: string;
  fleches: number; x: number; ecart: number; largeur: number; largeurConteneur: number; champDroite: number | null; champEcart: number | null;
};
export type CoherenceReleve = {
  niveaux: Record<"page" | "section" | "intertitre" | "carte", Titre[]>;
  barreBas: number; premierTitreHaut: number | null; enTeteArticleHaut: number | null;
  boutons: Bouton[];
  lignes: { caracteres: number; texte: string }[];
  filets: Record<"clair" | "sombre", Record<string, string[]>>;
  jetons: { filetClair: string; filetSombre: string; rose: string };
  centres: string[];
  largeurPage: number;
};

/** Exécuté dans la page (page.evaluate) : aucun accès au reste du module. */
export function releveCoherence(): CoherenceReleve {
  const visible = (el: Element) => el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
    && el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0 && !el.closest(".sr-only");
  const q = (selector: string) => [...document.querySelectorAll<HTMLElement>(selector)].filter(visible);
  const arrondi = (value: number) => Math.round(value * 10) / 10;
  const bordGauche = (box: Element) => { const c = getComputedStyle(box); return box.getBoundingClientRect().left + parseFloat(c.borderLeftWidth) + parseFloat(c.paddingLeft); };
  const largeurUtile = (box: Element) => { const c = getComputedStyle(box); return box.getBoundingClientRect().width - parseFloat(c.borderLeftWidth) - parseFloat(c.borderRightWidth) - parseFloat(c.paddingLeft) - parseFloat(c.paddingRight); };
  const colonnes = (grid: Element) => {
    const c = getComputedStyle(grid);
    const pistes = c.gridTemplateColumns.split(" ").map(parseFloat).filter(Number.isFinite);
    const gouttiere = parseFloat(c.columnGap) || 0;
    let x = bordGauche(grid);
    return pistes.map(piste => { const debut = x; x += piste + gouttiere; return debut; });
  };
  const CONTENEUR = ".wrap, .rev-wrap, .r2-wrap, .journal-article";
  // Bords permis : le bord gauche du conteneur de la section, ou le début d'une colonne de grille qui contient l'élément.
  const bords = (el: Element) => {
    const conteneur = el.closest(CONTENEUR);
    if (!conteneur) return [];
    const liste = [bordGauche(conteneur)];
    for (let parent = el.parentElement; parent && conteneur.contains(parent); parent = parent.parentElement) {
      if (/grid/.test(getComputedStyle(parent).display)) liste.push(...colonnes(parent));
      if (parent === conteneur) break;
    }
    return liste;
  };
  const ecart = (el: Element) => { const left = el.getBoundingClientRect().left; return arrondi(Math.min(9999, ...bords(el).map(x => Math.abs(x - left)))); };
  const type = (el: Element) => { const c = getComputedStyle(el); return `${c.fontSize}/${c.fontWeight}/${(parseFloat(c.letterSpacing) / parseFloat(c.fontSize) || 0).toFixed(2)}`; };
  const titre = (el: Element): Titre => ({ texte: (el.textContent ?? "").trim().slice(0, 40), type: type(el), x: arrondi(el.getBoundingClientRect().left), ecart: ecart(el) });
  const sonde = (jeton: string) => { const s = document.createElement("span"); s.style.color = `var(${jeton})`; document.body.append(s); const couleur = getComputedStyle(s).color; s.remove(); return couleur; };

  const titresPage = q("main h1");
  const niveaux = {
    page: titresPage.map(titre),
    section: q("main h2").filter(el => !el.closest(".journal-list, .journal-body")).map(titre),
    intertitre: q(".journal-body h2").map(titre),
    carte: q("main h3, .journal-list h2, .theme-steps strong, .theme-deliverables aside strong, .services .s, .theme-article-title").map(titre),
  };
  const enTeteArticle = document.querySelector(".journal-article .journal-header > :first-child");

  const boutons = q(".rev-button").filter(el => !el.closest("header.single-header")).map((el): Bouton => {
    const c = getComputedStyle(el);
    const conteneur = el.closest(CONTENEUR);
    const envoi = el.matches('[type="submit"]');
    const champ = envoi ? el.parentElement?.querySelector("input") ?? null : null;
    return {
      texte: (el.textContent ?? "").trim().slice(0, 30), principal: el.classList.contains("exec"), grand: el.classList.contains("large"), envoi,
      taille: parseFloat(c.fontSize), hauteur: arrondi(el.getBoundingClientRect().height), filet: c.borderTopWidth, fond: c.backgroundColor,
      fleches: el.querySelectorAll("svg[data-connector]").length, x: arrondi(el.getBoundingClientRect().left), ecart: ecart(el),
      largeur: arrondi(el.getBoundingClientRect().width), largeurConteneur: conteneur ? arrondi(largeurUtile(conteneur)) : -1,
      champDroite: champ ? arrondi(champ.getBoundingClientRect().right) : null, champEcart: champ ? ecart(champ) : null,
    };
  });
  const barre = q("header.single-header .rev-button").map(el => arrondi(el.getBoundingClientRect().height));
  for (const hauteur of barre) boutons.push({ texte: "(barre)", principal: false, grand: false, envoi: false, taille: 16, hauteur, filet: "1px", fond: "rgba(0, 0, 0, 0)", fleches: 0, x: 0, ecart: 0, largeur: 0, largeurConteneur: -1, champDroite: null, champEcart: null });

  // Longueur de ligne : chaque mot est rangé sur sa ligne (haut de sa boîte), espaces compris.
  const lignes = q("main p, main li, main dd, main figcaption, main summary")
    .filter(el => !el.closest("pre, table, .goal-result-sizer, .tech-set") && !el.querySelector("p, li"))
    .map(el => {
      const range = document.createRange();
      const parLigne = new Map<number, number>();
      const marcheur = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      for (let noeud = marcheur.nextNode(); noeud; noeud = marcheur.nextNode()) {
        for (const mot of (noeud.textContent ?? "").matchAll(/\S+\s*/g)) {
          range.setStart(noeud, mot.index); range.setEnd(noeud, mot.index + mot[0].trimEnd().length);
          const boite = range.getClientRects()[0];
          if (!boite) continue;
          const cle = Math.round(boite.top / 4);
          parLigne.set(cle, (parLigne.get(cle) ?? 0) + mot[0].replace(/\s+/g, " ").length);
        }
      }
      return { caracteres: Math.max(0, ...parLigne.values()), texte: (el.textContent ?? "").trim().slice(0, 50) };
    }).sort((a, b) => b.caracteres - a.caracteres).slice(0, 5);

  // Filets : couleur des bordures des éléments non interactifs, rangées par registre de fond (clair ou sombre).
  const luminance = (rgb: string) => { const [r, g, b] = (rgb.match(/[\d.]+/g) ?? []).map(Number); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };
  const fond = (el: Element) => {
    for (let a: Element | null = el; a; a = a.parentElement) {
      const couleur = getComputedStyle(a).backgroundColor;
      const canaux = (couleur.match(/[\d.]+/g) ?? []).map(Number);
      if (canaux.length < 4 || canaux[3] > 0.5) return couleur;
    }
    return "rgb(255, 255, 255)";
  };
  const filets: CoherenceReleve["filets"] = { clair: {}, sombre: {} };
  const note = (registre: "clair" | "sombre", couleur: string, nom: string) => { const liste = (filets[registre][couleur] ??= []); if (liste.length < 6 && !liste.includes(nom)) liste.push(nom); };
  for (const el of q("main *, footer *")) {
    if (el.closest("a, button, input, select, textarea, svg, .goal-form")) continue;
    const c = getComputedStyle(el);
    for (const cote of ["Top", "Right", "Bottom", "Left"] as const) {
      if (parseFloat(c[`border${cote}Width`]) <= 0 || c[`border${cote}Style`] === "none") continue;
      const couleur = c[`border${cote}Color`];
      if (/, 0\)$/.test(couleur)) continue;
      note(luminance(fond(el)) > 0.5 ? "clair" : "sombre", couleur, `${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]}`);
    }
  }
  const pied = document.querySelector(".single-footer .wrap");
  if (pied) note("sombre", getComputedStyle(pied, "::before").borderTopColor, "footer .wrap::before");

  // Texte centré ou poussé à droite, par text-align ou par la boîte qui le porte.
  const textes = q("main :is(h1,h2,h3,p,li,figcaption,summary,dd,dt,label,time,strong,span,a)")
    .filter(el => [...el.childNodes].some(n => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim()) && !el.closest("svg, .goal-schema, .rev-button"));
  const nom = (el: Element) => `${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]} « ${(el.textContent ?? "").trim().slice(0, 30)} »`;
  const centres = new Set<string>();
  for (const el of textes) {
    const style = getComputedStyle(el);
    const parent = el.parentElement ? getComputedStyle(el.parentElement) : null;
    if (!["start", "left"].includes(style.textAlign)) centres.add(`${nom(el)} : text-align ${style.textAlign}`);
    if (parent && /flex|grid/.test(parent.display) && /center|end/.test(`${parent.justifyContent} ${parent.justifyItems}`)) centres.add(`${nom(el)} : centré par sa boîte`);
    if (/center|end/.test(style.justifySelf)) centres.add(`${nom(el)} : justify-self ${style.justifySelf}`);
  }

  return {
    niveaux,
    barreBas: arrondi(document.querySelector("header.single-header")!.getBoundingClientRect().bottom + scrollY),
    premierTitreHaut: titresPage[0] ? arrondi(titresPage[0].getBoundingClientRect().top + scrollY) : null,
    enTeteArticleHaut: enTeteArticle ? arrondi(enTeteArticle.getBoundingClientRect().top + scrollY) : null,
    boutons, lignes, filets,
    jetons: { filetClair: sonde("--brand-accessible-line"), filetSombre: sonde("--brand-derived-on-ink-line"), rose: sonde("--brand-core-rose") },
    centres: [...centres],
    largeurPage: document.documentElement.scrollWidth,
  };
}

/** Lit un relevé et rend la liste des écarts au système. Une liste vide = page conforme. */
export function ecartsCoherence(releve: CoherenceReleve, page: CoherencePage, width: number): string[] {
  const telephone = width <= 760;
  const fautes: string[] = [];
  const uniques = (titres: { type: string }[]) => [...new Set(titres.map(t => t.type))];

  // 1. Une seule taille calculée par niveau de titre (taille / graisse / interlettrage en em).
  //    Deux exceptions nommées dans l'audit, pas d'autre : le titre du héros de l'accueil et l'intertitre d'article.
  const attendu = {
    page: page === "accueil" ? (telephone ? "38px/500/-0.01" : "46px/500/-0.01") : (telephone ? "34px/500/-0.03" : "54px/500/-0.03"),
    section: telephone ? "32px/500/-0.03" : "40px/500/-0.03",
    intertitre: "26px/600/-0.01",
    carte: "22px/600/-0.01",
  } as const;
  for (const niveau of ["page", "section", "intertitre", "carte"] as const) {
    const vus = uniques(releve.niveaux[niveau]);
    if (vus.some(type => type !== attendu[niveau])) fautes.push(`titres « ${niveau} » : ${vus.join(", ")} au lieu de ${attendu[niveau]} seul`);
  }
  if (releve.niveaux.page.length !== 1) fautes.push(`${releve.niveaux.page.length} titre(s) de page au lieu d'un`);

  // 2. Le premier titre des pages intérieures tombe à 64 px sous la barre ; dans l'article, la date le précède.
  if (page !== "accueil") {
    const haut = page === "article" ? releve.enTeteArticleHaut : releve.premierTitreHaut;
    if (haut === null || Math.abs(haut - releve.barreBas - 64) > 1) fautes.push(`premier contenu à ${haut === null ? "?" : haut - releve.barreBas} px sous la barre au lieu de 64`);
  }

  // 3. Titres de page et de section : bord gauche du conteneur, ou de leur colonne de grille. Écart de 1 px au plus.
  for (const titre of [...releve.niveaux.page, ...releve.niveaux.section]) {
    if (titre.ecart > 1) fautes.push(`titre « ${titre.texte} » à x = ${titre.x}, à ${titre.ecart} px de son bord`);
  }

  // 4. Boutons : une hauteur par taille, un principal (rose, filet de 2 px, une flèche), un secondaire (contour de 1 px, sans flèche).
  for (const bouton of releve.boutons) {
    const hauteur = bouton.taille === 22 ? 78.8 : 48;
    if (![16, 22].includes(bouton.taille)) fautes.push(`bouton « ${bouton.texte} » en ${bouton.taille} px`);
    if (bouton.grand !== (bouton.taille === 22)) fautes.push(`bouton « ${bouton.texte} » : taille ${bouton.taille} px sans la classe de grande taille, ou l'inverse`);
    if (Math.abs(bouton.hauteur - hauteur) > 0.5) fautes.push(`bouton « ${bouton.texte} » haut de ${bouton.hauteur} px au lieu de ${hauteur}`);
    if (bouton.texte === "(barre)") continue;
    if (bouton.principal) {
      if (bouton.filet !== "2px" || bouton.fond !== releve.jetons.rose || bouton.fleches !== 1) fautes.push(`bouton principal « ${bouton.texte} » : filet ${bouton.filet}, fond ${bouton.fond}, ${bouton.fleches} flèche(s)`);
    } else if (bouton.filet !== "1px" || bouton.fond !== "rgba(0, 0, 0, 0)" || bouton.fleches !== 0) fautes.push(`bouton secondaire « ${bouton.texte} » : filet ${bouton.filet}, fond ${bouton.fond}, ${bouton.fleches} flèche(s)`);

    // 5. Précision de Paul du 21/11/2026 (soir) : aucun bouton centré ni poussé à droite.
    if (bouton.envoi) {
      // Le champ et son bouton d'envoi forment un seul bloc : le champ part du bord gauche, le bouton le touche.
      if (bouton.champEcart === null || bouton.champEcart > 1) fautes.push(`champ du bouton « ${bouton.texte} » à ${bouton.champEcart} px de son bord`);
      if (bouton.champDroite === null || Math.abs(bouton.x - bouton.champDroite) > 1) fautes.push(`bouton d'envoi « ${bouton.texte} » détaché de son champ`);
      continue;
    }
    if (bouton.ecart > 1) fautes.push(`bouton « ${bouton.texte} » à x = ${bouton.x}, à ${bouton.ecart} px du bord gauche de son conteneur`);
    // Sur téléphone : toute la largeur du conteneur, le même choix partout.
    if (telephone && Math.abs(bouton.largeur - bouton.largeurConteneur) > 1) fautes.push(`bouton « ${bouton.texte} » large de ${bouton.largeur} px dans un conteneur de ${bouton.largeurConteneur}`);
  }

  // 6. Aucun paragraphe au-delà de 80 caractères par ligne.
  for (const ligne of releve.lignes) if (ligne.caracteres > 80) fautes.push(`ligne de ${ligne.caracteres} caractères : « ${ligne.texte} »`);

  // 7. Un seul gris de filet par fond.
  for (const [registre, jeton] of [["clair", releve.jetons.filetClair], ["sombre", releve.jetons.filetSombre]] as const) {
    for (const [couleur, elements] of Object.entries(releve.filets[registre])) {
      if (couleur !== jeton) fautes.push(`filet ${couleur} sur fond ${registre} (${elements.join(", ")}) au lieu de ${jeton}`);
    }
  }

  // 8. Aucun texte centré ni poussé à droite ; aucune page plus large que la fenêtre.
  for (const centre of releve.centres) fautes.push(`texte non aligné à gauche : ${centre}`);
  if (releve.largeurPage !== width) fautes.push(`page large de ${releve.largeurPage} px dans une fenêtre de ${width}`);
  return fautes;
}
