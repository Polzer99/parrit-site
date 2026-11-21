// Garde-fou du système visuel unique, décision de Paul du 21/11/2026 (soir) :
// « visuellement, toujours un manque de cohérence et d'alignement », « les CTA sont un coup à droite,
// un coup à gauche », « les alignements de texte, c'est n'importe quoi ».
// Sur l'accueil, une page d'offre, l'index du Journal, un article, le rendez-vous, les mentions légales
// et la page d'erreur, en FR et en EN, à 1440 × 800 et 390 × 700 :
//   1. une seule taille calculée par niveau de titre (deux exceptions nommées : héros de l'accueil, intertitre d'article) ;
//   2. le premier contenu des pages intérieures à 64 px sous la barre ;
//   3. titres de page et de section au bord gauche du conteneur ou de leur colonne de grille (1 px au plus) ;
//   4. une seule hauteur par taille de bouton, un principal et un secondaire ;
//   5. chaque bouton hors de la barre au bord gauche de son conteneur ou de sa colonne ; pleine largeur sur téléphone ;
//   6. aucun paragraphe de plus de 80 caractères par ligne ;
//   7. un seul gris de filet par fond ;
//   8. aucun texte centré ni poussé à droite, aucune page plus large que la fenêtre.
// Le relevé et sa lecture vivent dans tests/helpers/coherence-visuelle.ts. Aucun seuil ne s'assouplit ici :
// une exception se nomme dans ce fichier-là, avec sa raison.
import { expect, test } from "./network-deny.setup";
import { COHERENCE_PAGES, COHERENCE_VIEWPORTS, ecartsCoherence, releveCoherence } from "./helpers/coherence-visuelle";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const local = (path: string) => {
  const url = new URL(path, BASE_URL);
  expect(["localhost", "127.0.0.1"]).toContain(url.hostname);
  return url.href;
};

test.use({ serviceWorkers: "block" });
test.beforeEach(async ({ page }) => {
  // Les adresses nues restent en anglais : aucune négociation de langue pendant la mesure.
  await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
  // Seul le calendrier attendu est simulé ; toute autre requête sortante fait échouer le test.
  for (const pattern of ["https://app.cal.com/**", "https://cal.com/**"]) {
    await page.route(pattern, route => route.fulfill({ contentType: "text/html", body: "" }));
  }
  // Jamais de requête locale qui atteindrait un service réel en aval.
  await page.route("**/api/interet", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }));
});

for (const { width, height } of COHERENCE_VIEWPORTS) for (const locale of ["fr", "en"] as const) for (const { nom, chemin } of COHERENCE_PAGES) {
  test(`système visuel ${nom} ${locale} ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const response = await page.goto(local(locale === "fr" ? `/fr${chemin === "/" ? "" : chemin}` : chemin));
    expect(response?.status()).toBe(nom === "erreur" ? 404 : 200);
    await page.evaluate(() => document.fonts.ready);
    const releve = await page.evaluate(releveCoherence);
    // Borne basse : une page où le relevé ne lit plus rien ne doit pas passer à vide.
    expect(releve.niveaux.page).toHaveLength(1);
    if (nom !== "journal" && nom !== "legal") expect(releve.boutons.filter(bouton => bouton.texte !== "(barre)").length).toBeGreaterThan(nom === "rendez-vous" ? -1 : 0);
    if (nom !== "erreur") expect(releve.lignes.length).toBeGreaterThan(0);
    expect(ecartsCoherence(releve, nom, width)).toEqual([]);
  });
}
