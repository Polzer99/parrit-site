# Compte rendu : un seul système visuel sur tout le site

21/11/2026, soir. Branche `claude/coherence-visuelle-2026-11-21`, partie de `cf50cb8`.
Demande : `docs/CODEX-SPEC-2026-11-21-coherence-visuelle.md`. Mesures de départ et système cible : `docs/AUDIT-VISUEL-2026-11-21.md`.
Précision de Paul reçue en cours de route : « les CTA sont un coup à droite, un coup à gauche », « les alignements de texte, c'est n'importe quoi ». Elle est traitée à l'étape 3 et verrouillée à l'étape 9.

## Comment lire

- **Mesuré** : relevé dans Chromium sans fenêtre (bibliothèque Playwright du dépôt), mouvement réduit, réseau extérieur bloqué, sur le site construit et servi en local. « Avant » = le site construit depuis `cf50cb8` ; « après » = cette branche.
- **Jugé** : avis à l'œil sur les captures. Marqué « Jugement ».
- **Non vérifié** : dit en fin de document.

## Ce qui a changé, étape par étape

| Étape | Ce qui change | Écart avec l'audit |
|---|---|---|
| 1. Jetons | Sept jetons dans `src/system/tokens.css` : `--section-y`, `--stack`, `--inner`, `--card-pad`, `--measure`, `--title-max`, `--title-tracking`. | `--measure` vaut **52ch**, pas 58ch : voir étape 7. |
| 2. Titres | Une règle commune dans `src/system/system.css` : titre de page 54 px, titre de section 40 px (34 et 32 sur téléphone), titre de carte 22 px en 600. Règles locales retirées. Plus de gras dans les titres, sauf la seconde phrase du héros. | Le titre du héros garde sa coupe : sinon il passe à quatre lignes et le héros ne tient plus à 1440 × 800. |
| 3. Alignement | Photos de terrain, logos, pictogrammes du parcours, texte et bouton du contact, formulaire, pied de page : tout part du bord gauche. Contact : texte à gauche, portrait à droite. Rendez-vous : texte en haut à gauche, calendrier dessous sur toute la largeur. Sur téléphone, tout bouton hors de la barre prend la largeur du conteneur. | Sur téléphone, le contact garde son gabarit. Le bouton d'envoi du formulaire reste collé à son champ ; c'est le champ qui part du bord gauche. |
| 4. Rythme | 64 px autour de chaque section, sans `vh` ; 32 px du titre au contenu et entre colonnes ; 16 px dans un composant. Héros : 48 px. | Quand la fenêtre fait 720 px de haut ou moins (à partir de 761 px de large), la gouttière et la marge verticale des sept cartes des partenaires passent à 16 px pour garder un bloc par écran. |
| 5. Cartes, filets | Une carte (filet de 1 px, marge de 24 px) pour les offres, les partenaires, les étapes, les exemples de tâches, l'encadré des limites. Un gris de filet par fond. | Le cadre canard des technologies devient un filet gris de 1 px au lieu de disparaître : `tests/aeration.spec.ts` exige un contour à 3:1 autour d'une région atteignable au clavier. |
| 6. Boutons | Une définition : principal rose, filet de 2 px, flèche, taille normale (48 px de haut) ou grande ; secondaire en contour de 1 px, sans flèche. Le fond canard disparaît. | Aucun. |
| 7. Largeur de lecture | `max-width: var(--measure)` sur les paragraphes, listes et réponses ; `--title-max` sur les titres. | **52ch au lieu de 58ch.** Mesuré : à 58ch une ligne d'article atteignait 84 caractères. À 52ch le maximum relevé est 75. |
| 8. Repères | Pictogramme en tête des cartes d'offre et des sept cartes des partenaires ; numéros d'étape en 40 px ; chiffre de la presse lu au registre du Journal (31 en français) ; pages d'offre : étapes numérotées dans l'en-tête, exemples en cases avec pictogramme, coches, articles en titre et date. | Pas de flèches entre les trois étapes de l'accueil : le Brand OS limite à une flèche de séquence. Le choix des pictogrammes est un jugement. |
| 9. Garde-fou | `tests/coherence-visuelle.spec.ts` (28 cas) dans `qa:network:rev01` ; `DESIGN.md` ; décision datée en tête d'`AGENTS.md`. | La page d'erreur est ajoutée aux six gabarits demandés. |

Ajout après relecture des captures par Claude : le pied de page rangeait ses deux groupes de liens à droite et la mention de droits à gauche. Les groupes partent maintenant du bord gauche, la mention de droits vient dessous.

Suppressions : les 23 offres des partenaires et leur défilement, le cadre canard, le centrage des photos de terrain, le fond canard du bouton, le titre de 84 px, le bandeau en capitales et le pied « Visio » du calendrier, les extraits d'articles des pages d'offre, le filet de 2 px des mentions légales, `clamp(56px, 9vh, 112px)`.

## Corrections après relecture (six relecteurs, aucun bloquant)

- Page de rendez-vous : retour à une colonne, calendrier sur toute la largeur. L'ordre de tabulation suit de nouveau l'ordre visuel.
- Titre « Trois étapes, vous commencez où vous voulez. » : le retour à la ligne (`<br/>`) reste seul entre les deux phrases. Les lecteurs d'écran et les outils de conversion en texte le lisent comme une coupure ; ajouter une espace doublait celle que `llms.txt` pose déjà (test `llms-articles`).
- Chiffre de la presse : définition de la spec conservée (articles publiés et indexables dans la langue de la page, 31 en français comme en anglais aujourd'hui). La page anglaise du Journal liste aussi neuf articles en `noindex` qui ne sont pas comptés : le chiffre ne dépasse jamais la liste, et un test le vérifie. Rien n'est affiché à zéro, et la légende passe au singulier à un.
- Page d'offre : la liste d'étapes du bandeau est un rappel visuel, masqué aux lecteurs d'écran, qui lisent la version complète juste après.
- CSS mort retiré : `.offer-stack`, `.offer-sizer`, `.cal-bar`, `.cal-bar-footer`.
- Mentions légales : le fichier de la page revient à l'état de la branche principale. Le contrôle qualité classe toute modification de ce fichier en risque élevé ; le retrait du second « Dernière mise à jour » sort donc de ce lot et attend l'accord de Paul. Seule la feuille de style de la page change.
- Garde-fou : bornes basses explicites sur les boutons et sur les titres de section ; le contrôle « rien de centré » couvre aussi le pied de page ; les exclusions portent leur raison.

## Captures

`docs/captures/2026-11-21-coherence-visuelle/` : l'accueil avant et après côte à côte (quatre tranches, 1440 px de large) et la page d'offre après.

## Mesures

### Hauteur des blocs de l'accueil, avant → après (premier enfant de chaque section)

Le héros entier finit à 757 px avant et après (limite 800).

| Bloc (FR) | 1440 × 800 | 1280 × 720 | 390 × 700 |
|---|---|---|---|
| Références | 204,4 → 182 | 204,4 → 182 | 391 → 394,2 |
| Offres | 433,7 → 472 | 433,7 → 472 | 526,4 → 559 |
| Partenaires | 727,5 → 748,6 (marge 51) | 707,5 → 668,6 (marge 51) | 566 → 502 |
| Parcours | 551 → 559,3 | 551 → 559,3 | 521,1 → 583,8 |
| Terrain | 606,3 → 643,8 | 556,7 → 594,2 | 442,8 → 449,2 |
| Technologies | 116 → 112 | 116 → 112 | 192 → 196 |
| Presse | 192,8 → 270,4 | 192,8 → 270,4 | 265,2 → 414,8 |
| Questions | 496,5 → 554,1 | 496,5 → 554,1 | 563,3 → 570,5 |

### Bord gauche des boutons (bord du conteneur : x = 180 à 1440 px, x = 20 à 390 px)

| Page | Bouton | x avant, 1440 | x après, 1440 | Largeur à 390, avant → après |
|---|---|---|---|---|
| Accueil | Prendre rendez-vous (héros) | 180 | 180 | 350 → 350 |
| Accueil | Lire nos retours de terrain | 180 | 180 | 296 → 350 |
| Accueil | Prendre rendez-vous (contact) | **583** | 180 | 350 → 350 |
| Accueil | Demander un échange (collé à son champ) | **1040** | 504, champ à 180 | 220 → 220 |
| Page d'offre | Prendre rendez-vous (haut et bas) | 180 | 180 | 350 → 350 |
| Article | Prendre rendez-vous (bas) | 180 | 180 | 350 → 350 |
| Page d'erreur | boutons | 180 | 180 | 177 à 221 → 350 |

Titres : « Sur le terrain » était à x = 310 (centré) et le titre du contact à x = 583 ; tous les titres de page et de section sont maintenant à x = 180.

### Garde-fou rejoué

Les relevés de `tests/coherence-visuelle.spec.ts` ont été rejoués par un script qui importe le même fichier d'aide : 28 cas conformes sur cette branche, 28 cas en échec (234 écarts) sur le site d'avant.

## Tests

- Adaptés : `single-page.spec`, `intentions.spec`, `stabilite.spec`, `audit-readability.spec` (le grand bouton inclut le héros des pages d'offre, seuils inchangés), `action-unique`, `passe-copy`, `home-visual-layers`, `brand-os-render`, `single-page.test`, `densite-pages`, `style-site` (la classe `theme-path` rejoint les étiquettes, avec sa raison).
- Supprimés : les deux tests du défilement des offres des partenaires, sans objet.
- Ajoutés : `tests/coherence-visuelle.spec.ts` et `tests/helpers/coherence-visuelle.ts`.
- Batterie locale : lint, build, `npm test` (943/943), `qa:claims:rev01`, `qa:brand:rev01`, `tsc` : verts.

## Ce qui n'a pas pu être vérifié

- Les specs Playwright n'ont pas été lancées en local. Les assertions les plus exposées ont été rejouées à la main par script : aucune n'échoue. La CI fait foi.
- Le vrai calendrier Cal.com n'a pas pu être chargé en capture. Pour cette raison, la page de rendez-vous garde le calendrier sur toute la largeur du conteneur, comme en ligne aujourd'hui.
- Les états au survol et au focus, et les largeurs intermédiaires (761 à 1100 px).

## Encore imparfait (jugement)

- La bande des technologies reste encadrée d'un filet.
- Le chiffre de la presse paraît isolé à droite.
- La moitié droite de plusieurs sections est vide, parce que le texte est plafonné à 75 caractères.
- Un vide subsiste sous le bouton du contact, à gauche du portrait.
