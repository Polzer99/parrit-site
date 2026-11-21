# Compte rendu : alignement des pages et garde-fous de style (21/11/2026)

Specs : `docs/CODEX-SPEC-2026-11-21-alignement-pages-partenaires.md` (spec 1) et `docs/CODEX-SPEC-2026-11-21-coherence-et-garde-fous.md` (spec 2). PR 397.

## Qui a écrit quoi

- Codex a implémenté l'essentiel de la spec 1 (35 fichiers), puis a épuisé son forfait (« usage limit », reprise le 26/11/2026 à 6 h 10).
- Le pont officiel a constaté la panne. La suite (tests de la spec 1, spec 2, garde-fou) a été écrite en direct par Claude et par des agents Sonnet, selon la règle du 14/11/2026.
- Les textes français et anglais ont été rédigés par Claude Fable 5.2, sur décision de Paul du 21/11/2026 (forfait OpenAI épuisé).

## Ce qui a changé

| Zone | Fichiers principaux |
|---|---|
| Gabarit commun des quatre pages thèmes | `src/system/site-v1-pages.ts`, `src/system/pages/theme.tsx`, `src/system/journal-themes.css`, `src/system/journal-themes.ts` ; `src/system/integration-copy.ts` supprimé |
| Accueil : ordre, partenaires, presse, contact | `src/system/home-layers.ts`, `src/system/components/SinglePage.tsx`, `HomeEvidence.tsx`, `AppointmentLink.tsx`, `SessionPhotos.tsx`, `src/system/single-page-copy.ts`, `src/system/single-page.css` |
| Menu et pied de page | `src/system/components/RevHeader.tsx`, `RevFooter.tsx` |
| Blocs de rendez-vous et `/rendez-vous` | `src/system/booking.ts`, `src/system/booking.css`, `src/system/pages/booking.tsx` |
| Articles : thème lié, « À lire ensuite », dates | `src/system/pages/article.tsx`, `src/system/components/JournalCard.tsx`, `src/app/(rev01)/rev01.css` |
| Robots | `src/system/pages/booking.tsx` (noscript), métadonnées françaises, `scripts/generate-llms.mjs`, `public/llms.txt`, `src/app/sitemap.ts` |
| Calculateur retiré (décision de Paul, 21/11 au soir) | `src/system/components/HomeGoals.tsx`, `SinglePage.tsx`, `SectionEntrance.tsx`, `AppointmentLink.tsx`, `src/system/home-layers.ts`, `src/system/single-page.css` ; `src/system/home-calculator.ts` supprimé ; ancres historiques déplacées en tête des offres ; bouton du haut des pages thèmes au style standard (`journal-themes.css`) |
| Consignes | `AGENTS.md`, `TRUTH.md`, `AI_CONTEXT.md`, `DESIGN.md` |

## Écarts décidés par rapport aux specs

1. Tout titre `h1` ou `h2` finit par un point, sans seuil de mots. La spec 2 disait « trois mots ou plus » : « Questions fréquentes » sans point au-dessus de « À lire dans le Journal. » se voyait.
2. FAQ anglaise des thèmes : « Common questions. ».
3. Second calculateur en anglais : « Get time back. ». Le contrôle anti-offre refuse le mot « free ».
4. Page `ai-sprints` : « Les résultats des tests vous servent à décider de la suite. » et « Préparer une réponse à un client en lisant son dossier. ». Le contrôle anti-prix refuse « à partir de ». Le texte a changé, pas le contrôle.
5. Bloc contact : aucune liste d'étapes (précision de Paul : la marche à suivre se fait sentir, elle ne s'écrit pas).
6. Titre de la section presse : « Nous publions ce que nos missions nous apprennent. », pour ne pas répéter « sur le terrain » dans deux titres voisins (remarque de relecture).
7. Le lien sans JavaScript de `/rendez-vous` ne transmet pas la source ni les `utm_*` : l'attribution n'est pas gérée sans JavaScript.
8. Le calculateur de l'accueil est supprimé (Paul, 21/11/2026 au soir : « le calculateur ressemble à rien, que du texte, aucun élément visuel marketing probant »). La spec 1 le gardait en deuxième position ; l'accueil compte dix sections. Les tests propres au calculateur sont supprimés, les autres adaptés, aucune regex de garde assouplie : l'exemption des résultats du calculateur et des libellés « (€) » du contrôle anti-prix est retirée, ce qui durcit le contrôle.

## Tests

- Ajoutés : `tests/style-site.test.mjs` (garde-fou de style), `tests/densite-pages.test.mjs`, `tests/helpers/html-tree.mjs`, `tests/fixtures/style-interdits.json`, un test du noscript et un test de l'`alt` français.
- Supprimé : le test « assistant prompts » de `tests/accueil-epure.test.mjs`, avec la section qu'il vérifiait.
- Adaptés : les assertions d'ordre des sections, de libellés du menu, du titre du contact, des titres anglais et des données structurées des thèmes. Aucune regex de garde modifiée, aucun seuil abaissé.
- Preuve du garde-fou : dix défauts réintroduits à la main (point final retiré, titre de carte en double, nom dans un bloc de rendez-vous, libellé du bouton changé, mot refusé, tiret long, phrase triplée, segment anglais dans le français, section d'un thème réduite, légende sans point). Tous détectés.

## Vérifié et non vérifié

- Vérifié en local : `npm run lint`, `npm run build -- --webpack`, `npm test`, `qa:claims:rev01`, `qa:brand:rev01`.
- Non vérifié en local : les specs Playwright (navigateur absent du poste). La CI fait foi.
- Non vérifié : le rendu sur téléphone par capture (Chrome sans fenêtre ne descend pas sous 500 px de large).

## Reste à faire, hors de cette PR

- La cohérence visuelle : échelle des titres, alignement, un seul style de carte et de bouton, éléments visuels dans les blocs de texte. Audit en cours le 21/11/2026 au soir.
- La page d'erreur, qui affiche les deux langues à la fois.
- L'article `what-is-parrit-ai`, qui décrit l'ancien positionnement : à traiter avec la passe des articles.
- `AGENTS.md` pèse plus de 40 000 caractères et coûte cher à chaque passage de Codex : à alléger.
