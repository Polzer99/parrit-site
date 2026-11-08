# CODEX SPEC — `llms.txt` à jour et liste des articles (visibilité dans les assistants IA)

Niveau de risque : faible (fichier généré, aucun texte visible du site modifié). À lancer sur `origin/main` (PR #367 fusionnée, 4490653).

## Constat (08/11/2026, https://parrit.ai/llms.txt en ligne)

1. La ligne « Dans l'ordre : présentation, applications concrètes, ce que l'IA change dans votre entreprise, parcours… » (et son équivalent EN) décrit l'ANCIEN accueil : « Ce que l'IA change » n'existe plus ; « Sur le terrain », « Par où commencer », FAQ et derniers articles manquent. Le texte est écrit en dur dans `scripts/generate-llms.mjs`.
2. Le Journal compte 31 articles (`content/journal/*.mdx`), et **aucun** n'est listé : un assistant IA ne voit que l'index.

Étude source : `~/parrit-canon/docs/site-benchmark/ETUDE-CONCURRENTS-2026-11-08.md` (lot GEO).

## À faire

1. **Ordre de l'accueil dérivé, plus jamais en dur** : `generate-llms.mjs` construit la ligne « Dans l'ordre : … » / « In order: … » depuis la même source que la page (`src/system/home-layers.ts` ou l'équivalent qui fixe l'ordre des sections), avec les libellés FR/EN existants des sections. Un test échoue si la ligne et l'ordre rendu divergent.
2. **Section FAQ** : sous l'accueil, ajouter les six questions de la FAQ, chacune avec sa réponse affichée, mot pour mot, issues de la même source que la FAQ rendue (FR et EN). Aucun texte nouveau.
3. **Liste des articles** : nouvelle sous-section « Articles » / « Articles » dans chaque langue, tous les articles publiés (même filtre que le sitemap et le RSS : brouillons et articles futurs exclus), triés du plus récent au plus ancien : `- https://parrit.ai/journal/<slug> : <titre> (<AAAA-MM-JJ>). <description du frontmatter>`. Les articles sont en anglais : côté FR, garder le titre et la description d'origine et conserver la phrase existante « les articles restent en anglais ». Thème entre crochets s'il existe dans `journal-themes.ts`.
4. Aucun nom de client, aucun prix, aucun chiffre nouveau (le Journal ne nomme aucun client : vérifier que la sortie n'en contient pas, avec la liste de `public-clients.ts`).
5. `public/llms.txt` reste généré au `prebuild`, jamais édité à la main.

## Tests

Test Node : ligne d'ordre = ordre rendu (FR/EN) ; 6 questions FAQ identiques au texte rendu ; nombre d'articles listés = nombre d'articles publiés du sitemap ; tri par date ; aucune URL absente du sitemap ; aucun nom de `public-clients.ts` dans la liste des articles. Batterie : `npm ci --silent && npm run lint && npm run build -- --webpack && npm test`. Ne pas committer les PNG réécrits sous `.codex-handoffs/brand-os-p1/after/`.
