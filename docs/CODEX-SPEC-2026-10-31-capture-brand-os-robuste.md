# Capture Brand OS robuste en CI (PR #357)

Constat de Claude, le 31/10/2026. Sur la PR #357, la CI `lint and build` échoue trois fois de suite dans `tests/brand-os.spec.ts:25` avec `page.screenshot: Protocol error (Page.captureScreenshot): Unable to capture screenshot`. Ce n'est jamais la même page : `/fr/journal/themes/conseil-transformation` 1440, `/fr` 390, `/fr/journal` 390. Les 39 tests du fichier passent sur l'hôte, et `main` repasse au vert au même moment. Les quatre tests ajoutés par la PR changent la répartition des 399 tests sur deux workers. Une capture pleine page tombe alors en concurrence avec un test lourd, et Chromium refuse la capture.

La capture n'est qu'un artefact : elle range un PNG dans `.codex-handoffs/brand-os-p1/`. Les contrôles (largeur, métadonnées OG et Twitter, contraste) viennent après.

## Correction attendue

Dans `tests/brand-os.spec.ts`, envelopper le seul appel `page.screenshot(...)` de ce test dans une petite fonction locale :

- elle réessaie **une seule fois**, après une attente de 500 ms ;
- seulement si le message d'erreur contient `Unable to capture screenshot` ;
- toute autre erreur est relancée telle quelle ;
- un second échec est relancé aussi : le test échoue comme aujourd'hui.

Aucune autre assertion, aucun seuil, aucun autre fichier de test ne change. Pas de `retries` global dans la configuration Playwright.

## Hors périmètre

Tout le reste de la PR #357. Ne pas committer, ne pas pousser : Claude s'en charge.
