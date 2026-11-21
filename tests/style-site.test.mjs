// Garde-fou de style du site, décision de Paul du 21/11/2026.
// « Il n'y a pas suffisamment de guardrails pour que ça soit respecté. […] Faut qu'à la fin des
// phrases, il y ait des points. Faut pas qu'il y ait des fois des phrases avec des points, des
// fois des phrases sans points, pareil en anglais qu'en français. »
// Le test lit le texte VISIBLE des pages publiques rendues, dans les deux langues, hors corps et
// titres des articles du Journal. Une exception s'écrit ici, avec sa raison, jamais dans le texte.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { loader, renderPage } from "./helpers/site-v1-render.mjs";
import { ancestors, clean, cls, hiddenFrom, parseHtml, walk } from "./helpers/html-tree.mjs";

const INTERDITS = JSON.parse(readFileSync("tests/fixtures/style-interdits.json", "utf8"));
const NOM = "Paul Larmaraud";
const RENDEZ_VOUS = { fr: "Prendre rendez-vous", en: "Book a call" };
const THEMES = ["harness-engineering", "ai-sprints", "integration-developpement", "conseil-transformation"];

// Étiquettes : jamais de point final. Ce sont des noms, pas des phrases.
const CLASSES_ETIQUETTES = new Set([
  "partner-offers", "tech-set", "offer-eyebrow", "goal-plane-title",
  "journal-entry-meta", "footer-links", "footer-group-label", "languages", "partner-type-label",
]);
// Titres et résumés d'articles : texte éditorial, hors de ce contrôle.
const CLASSES_ARTICLES = new Set(["journal-list", "journal-related", "journal-article", "theme-article-title"]);

const mots = texte => texte.split(/\s+/u).filter(Boolean);
const dans = (node, classes) => [node, ...ancestors(node)].some(n => cls(n).some(c => classes.has(c)));
const sous = (node, tags) => ancestors(node).some(n => tags.includes(n.tag));
const finit = (texte, signes) => signes.some(signe => texte.endsWith(signe));

async function pages(locale) {
  const load = loader(locale, { "next/navigation": { notFound() { throw new Error("thème manquant"); }, usePathname: () => (locale === "fr" ? "/fr" : "/"), useSearchParams: () => new URLSearchParams() } });
  const liste = [["accueil", await renderPage(locale)]];
  for (const theme of THEMES) {
    const route = load("src/system/pages/theme.tsx");
    liste.push([`theme/${theme}`, renderToStaticMarkup(await route.default({ params: Promise.resolve({ theme }) }, locale))]);
  }
  liste.push(["rendez-vous", renderToStaticMarkup(await load("src/system/pages/booking.tsx").default({ searchParams: Promise.resolve({}) }, locale))]);
  liste.push(["journal", renderToStaticMarkup(await load("src/system/pages/journal.tsx").default(locale))]);
  liste.push(["pied", renderToStaticMarkup(load("src/system/components/RevFooter.tsx").RevFooter({ locale }))]);
  // Le bloc de rendez-vous de fin d'article est du texte du site, pas le corps d'un article.
  liste.push(["bloc-rendez-vous/article", renderToStaticMarkup(load("src/system/components/BookingCall.tsx").BookingCall({ locale, source: "journal-test" }))]);
  return liste;
}

/** Les blocs de texte visibles d'une page, avec leur rôle. */
function blocs(html) {
  const sortie = [];
  for (const node of walk(parseHtml(html))) {
    if (!node.tag || node.tag.startsWith("#") || hiddenFrom(node) || dans(node, CLASSES_ARTICLES)) continue;
    const texte = clean(node);
    if (!texte) continue;
    const etiquette = dans(node, CLASSES_ETIQUETTES) || sous(node, ["nav", "footer", "label"]);
    if (["h1", "h2", "h3"].includes(node.tag)) sortie.push({ role: "titre", node, texte, etiquette });
    else if (["p", "dd", "figcaption"].includes(node.tag)) {
      // Un paragraphe qui finit par un lien se juge sur la phrase qui précède : le lien est une étiquette.
      const enfants = node.children.filter(child => child.tag !== "#text" || child.text.trim());
      const dernier = enfants.at(-1);
      const phrase = dernier?.tag === "a" ? enfants.slice(0, -1).map(child => clean(child)).join(" ").trim() : texte;
      if (phrase) sortie.push({ role: "phrase", node, texte: phrase, etiquette });
    }
    else if (node.tag === "li" && !node.children.some(child => ["p", "strong", "ul", "ol", "a"].includes(child.tag))) sortie.push({ role: "ligne", node, texte, etiquette });
    else if (node.tag === "summary") sortie.push({ role: "question", node, texte, etiquette });
    else if (["a", "button"].includes(node.tag) && (cls(node).some(c => ["rev-button", "btn", "mail", "booking-email"].includes(c)) || sous(node, ["nav", "footer"]))) sortie.push({ role: "bouton", node, texte, etiquette: true });
  }
  return sortie;
}

for (const locale of ["fr", "en"]) {
  for (const [nom, html] of await pages(locale)) {
    const page = `${locale}/${nom}`;
    const liste = blocs(html);
    const contenu = liste.filter(bloc => !bloc.etiquette && bloc.role !== "bouton");

    // Borne basse : une page dont l'analyseur ne lit plus rien ne doit pas passer à vide.
    test(`la page est bien lue (${page})`, () => assert.ok(nom === "pied" ? liste.length > 0 : contenu.length > 0, `${page} : aucun bloc de texte lu`));

    test(`ponctuation par rôle (${page})`, () => {
      const fautes = [];
      for (const { role, node, texte, etiquette } of liste) {
        const n = mots(texte).length;
        if (role === "bouton" || etiquette) { if (texte.endsWith(".") && role !== "phrase") fautes.push(`${node.tag} étiquette avec un point : « ${texte} »`); continue; }
        if (role === "question" && !texte.endsWith("?")) fautes.push(`question sans « ? » : « ${texte} »`);
        // Tout titre de page ou de section (h1, h2) finit par un point. Un h3 de trois mots ou plus aussi ;
        // un h3 d'un ou deux mots est un nom d'étape, sans point.
        const majeur = ["h1", "h2"].includes(node.tag);
        if (role === "titre" && (majeur || n >= 3) && !finit(texte, [".", "?"])) fautes.push(`${node.tag} sans point final : « ${texte} »`);
        if (role === "titre" && !majeur && n < 3 && texte.endsWith(".")) fautes.push(`${node.tag} d'un ou deux mots avec un point : « ${texte} »`);
        if (role === "phrase" && n >= 3 && !finit(texte, [".", "?", ":"])) fautes.push(`${node.tag} sans point final : « ${texte} »`);
        if (role === "ligne" && !finit(texte, [".", "?"])) fautes.push(`ligne de liste sans point final : « ${texte} »`);
      }
      assert.deepEqual(fautes, [], `${page} : ${fautes.length} faute(s) de ponctuation`);
    });

    test(`listes homogènes (${page})`, () => {
      const parListe = new Map();
      for (const { role, node, texte } of liste) if (role === "ligne") parListe.set(node.parent, [...(parListe.get(node.parent) ?? []), texte]);
      for (const lignes of parListe.values()) {
        const fins = new Set(lignes.map(ligne => ligne.endsWith(".")));
        assert.equal(fins.size, 1, `${page} : liste où certaines lignes ont un point et d'autres non : ${lignes.join(" | ")}`);
      }
    });

    test(`aucune phrase en double, aucune formule ressassée (${page})`, () => {
      const phrases = new Map();
      for (const { texte } of contenu) for (const phrase of texte.split(/(?<=[.?])\s+/u)) {
        if (mots(phrase).length >= 5) phrases.set(phrase, (phrases.get(phrase) ?? 0) + 1);
      }
      const doubles = [...phrases].filter(([, compte]) => compte > 1).map(([phrase]) => phrase);
      assert.deepEqual(doubles, [], `${page} : phrase écrite deux fois`);
      const suites = new Map();
      for (const [index, { texte }] of contenu.entries()) {
        const liste = texte.toLowerCase().match(/[\p{L}\p{N}'’-]+/gu) ?? [];
        for (let i = 0; i + 4 <= liste.length; i++) {
          const suite = liste.slice(i, i + 4).join(" ");
          suites.set(suite, (suites.get(suite) ?? new Set()).add(index));
        }
      }
      const ressassees = [...suites].filter(([, vus]) => vus.size > 3).map(([suite, vus]) => `${suite} (${vus.size} blocs)`);
      assert.deepEqual(ressassees, [], `${page} : même suite de quatre mots dans plus de trois blocs`);
    });

    test(`le nom, les mots refusés, les signes, une seule langue (${page})`, () => {
      const texte = liste.map(bloc => bloc.texte).join("\n");
      const occurrences = texte.split(NOM).length - 1;
      // Une seule mention sur l'accueil : la légende de la photo. Aucune ailleurs.
      assert.ok(occurrences <= (nom === "accueil" ? 1 : 0), `${page} : « ${NOM} » apparaît ${occurrences} fois`);
      for (const interdit of INTERDITS[locale]) {
        const motif = new RegExp(`(?<![\\p{L}])${interdit.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}])`, "iu");
        assert.doesNotMatch(texte, motif, `${page} : mot ou tournure refusé « ${interdit} »`);
      }
      assert.doesNotMatch(texte, /[—–!…]|\.\.\.|\p{Extended_Pictographic}/u, `${page} : tiret long, point d'exclamation, points de suspension ou émoji`);
      const etrangers = locale === "fr" ? ["the", "your", "with", "and", "we", "our"] : ["le", "les", "vos", "avec", "nous", "votre"];
      for (const { texte: bloc } of contenu) {
        const liste = bloc.toLowerCase().match(/[\p{L}']+/gu) ?? [];
        const intrus = etrangers.filter(mot => liste.includes(mot));
        assert.ok(liste.length < 3 || intrus.length < 2, `${page} : bloc dans l'autre langue (${intrus.join(", ")}) : « ${bloc} »`);
      }
    });

    test(`un bouton de rendez-vous, un seul nom (${page})`, () => {
      for (const { role, node, texte } of liste) {
        if (role !== "bouton" || !cls(node).includes("rev-button")) continue;
        const destination = node.attrs.href ?? "";
        if (/rendez-vous|#contact|#reservation/.test(destination)) assert.equal(texte, RENDEZ_VOUS[locale], `${page} : bouton de rendez-vous « ${texte} »`);
      }
    });
  }
}
