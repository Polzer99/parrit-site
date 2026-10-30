# Hero trois plans allégé, PR #355

Décision de Paul, le 29/10/2026 : le texte sous le bouton « Parlons de votre transformation » est « compliqué et trop chargé ». Il a choisi la variante B de `docs/hero-trois-plans/` : **une seule phrase qui change à chaque étape, puis la carte du résultat**. Plus de liste d'étapes, plus de pastilles numérotées sur le schéma.

À faire **sur cette même branche**, sans rien changer d'autre. Ne pas committer, ne pas pousser : Claude s'en charge après la batterie.

## 1. Légende : une phrase, puis la carte

Dans `src/system/components/OntologyHero.tsx`, la légende (`.ontocap`) ne contient plus que deux rangées :

1. **La phrase du moment** (`.onto-now`), 18 px / 26 px, graisse 600, couleur blanche.
   - Étape 0 : le titre de l'histoire (`story.title`), tel quel.
   - Étapes 1 à 4 : `story.steps[step - 1]`, traduite par `t()`, **première lettre en majuscule** et un point final. Exemple FR étape 1 : « Un client écrit. » ; EN : « A client writes. »
   - Changement de phrase : fondu d'opacité de 250 ms au plus, aucun déplacement. Sous `prefers-reduced-motion`, aucun fondu.
2. **La carte du résultat** (`.onto-result`), inchangée : PRÊT, résultat, pastille sauge du verbe ; mêmes règles d'apparition (carte à l'étape 3, verbe à l'étape 4).

À supprimer :

- la liste `<ol>` des quatre étapes et ses classes `is-done`, `is-current`, `is-future` ;
- le titre en gras séparé `.onto-story-title` (le titre ne vit plus que dans la phrase de l'étape 0) ;
- les quatre pastilles `.onto-badge` posées sur le schéma ;
- la classe `.onto-number` et toutes les règles CSS devenues mortes.

État statique (sans JavaScript, hors écran, mouvement réduit) : histoire 1, étape 4, donc « Vous validez, la réponse part. » puis la carte complète.

Accessibilité : `aria-live` reste à `off` sur la phrase. Ajouter, pour les lecteurs d'écran seulement, la liste ordonnée des quatre étapes de l'histoire courante (classe masquée visuellement, à créer si le dépôt n'en a pas : `position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap`). Elle n'occupe aucune place et n'entre pas dans le calcul des hauteurs.

## 2. Aucun saut de mise en page

La réservation de hauteur reste rendue dès le SSR, comme aujourd'hui avec `.ontocap-sizer` :

- la grille passe de 6 rangées à **2** (phrase, carte) ;
- le dimensionneur empile, dans la rangée de la phrase, **les cinq phrases possibles de chacune des quatre histoires** (titre + quatre étapes), dans la langue de la page, pour que la plus longue fixe la hauteur ; et dans la rangée de la carte, les quatre cartes complètes ;
- la hauteur de `.ontocap-stack` est donc identique à toutes les étapes de toutes les histoires, à toutes les largeurs de 320 à 1440 px, en FR et en EN.

`tests/stabilite.spec.ts` reste **inchangé**, aucun seuil assoupli. Le hero entier tient toujours à 1440 × 800.

## 3. Fond des libellés : la couleur du plan, pas celle de la page

Le correctif précédent a mis `background:var(--canard)` derrière `.onto-label` et `.onto-zone`. Or ces libellés sont posés sur les plans, plus sombres que la page : on voit de petits rectangles clairs autour de « Trésorerie », « Facture »…

Correction : le fond des libellés prend la couleur **effective** de la surface du plan. `.onto-surface` vaut `color-mix(in srgb,var(--canard),var(--ink) 60%)` à `fill-opacity:.8` sur le fond `--canard`, soit `color-mix(in srgb,var(--canard),var(--ink) 48%)`. Utiliser cette valeur, de préférence via une variable CSS partagée (par exemple `--onto-plane`) déclarée une fois et réutilisée par `.onto-surface` pour qu'elles ne divergent jamais. Aucun hex, aucune ombre, aucun rayon.

Test : à 1440 × 800, la couleur d'arrière-plan calculée de chaque `.onto-label` visible est égale à celle de la surface du plan sur laquelle il est posé (remplace l'assertion « égale au fond du hero » du correctif précédent).

## 4. Tests à mettre à jour

- `tests/single-page.spec.ts` : remplacer les comptages de `.onto-badge.is-visible` et les boucles sur `.onto-number` / `.onto-badge` par :
  - aucun élément `.onto-badge`, `.onto-number` ni `.ontocap ol` dans le HTML rendu ;
  - pour chaque histoire et chaque étape 0 à 4, en FR et en EN, le texte de `.onto-now` est exactement la phrase attendue (titre, puis étapes capitalisées avec point) ;
  - la hauteur de `.ontocap-stack` est constante sur toutes les étapes de toutes les histoires à 1440, 1280, 1024, 390 et 320 px.
- `tests/aeration.spec.ts` et `tests/audit-readability.spec.ts` : retirer les exceptions de taille pour `.onto-badge`, `.onto-number` et `.ontocap li` ; ajouter `.onto-now` à 18 px.
- Tests Node (`tests/single-page.test.mjs`, `tests/ontology-motion.test.mjs`) : mettre à jour ce qui portait sur la liste et les pastilles ; garder intacts le minuteur unique, les durées 2700 / 3600 / 900 ms, le nettoyage et le redémarrage.
- Garder tous les autres tests du hero (plans, nœuds, liens, anonymat, Safari, bouton tablette).

## 5. Documentation

Mettre à jour la section « Hero trois plans, 29/10/2026 » de `AGENTS.md`, et les lignes correspondantes de `AI_CONTEXT.md` et `TRUTH.md` : légende = une phrase par étape + carte ; plus de liste ni de pastilles ; fond des libellés = couleur du plan. Le rose reste au seul bouton.

## Hors périmètre

- Titre, sous-titre, bouton, citation, histoires, textes des étapes, durées, géométrie du schéma et sections après le hero : inchangés.
- Aucun nouveau texte public en dehors de la mise en majuscule et du point final des phrases existantes.
