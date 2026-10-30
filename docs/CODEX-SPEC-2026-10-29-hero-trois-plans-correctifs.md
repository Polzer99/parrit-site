# Correctifs de relecture, PR #355 (hero en trois plans)

Relecture de Claude, le 29/10/2026. Sur l'hôte, les 163 tests Playwright `single-page` et `stabilite` passent. Trois défauts restent, à corriger **sur cette même branche**, sans rien changer d'autre.

## 1. Bloquant : Safari ne prend pas en charge la propriété CSS `d`

`single-page.css` bascule la géométrie des chemins SVG avec `d: var(--compact-path)` et `d: var(--desktop-path)`. Safari, macOS comme iOS, **n'accepte pas `path()` dans la propriété CSS `d`** (source : https://caniuse.com/mdn-css_types_basic-shape_path_d). Sous 1200 px, sur iPhone, les plans et les liens gardent donc leur géométrie d'ordinateur dans le cadre du téléphone, et le schéma est cassé.

Correction attendue :

- Supprimer toute utilisation de la propriété CSS `d` ainsi que les variables `--desktop-path` et `--compact-path`.
- Rendre **deux groupes SVG statiques** dans le HTML serveur :
  - `<g class="onto-geo onto-geo-desktop">` reçoit les chemins de l'ordinateur dans leur attribut `d` ;
  - `<g class="onto-geo onto-geo-compact">` reçoit les chemins du téléphone dans leur attribut `d`.
- N'en afficher qu'un, par `display`, avec le même point de bascule de 1200 px qu'aujourd'hui. Aucune mesure en JavaScript, aucun saut de mise en page.
- Les états allumés (`is-lit`, `is-action`) s'appliquent aux liens des deux groupes, avec le même `data-link`.
- Les nœuds HTML positionnés par variables CSS ne changent pas : ils fonctionnent déjà dans Safari.
- Ajouter un test Node qui échoue si :
  - `single-page.css` contient une déclaration `d:` ;
  - ou le HTML rendu n'a pas exactement un groupe `onto-geo-desktop` et un groupe `onto-geo-compact`, chacun avec ses chemins renseignés dans leur attribut `d`.

## 2. Libellés barrés par les liens (ordinateur)

À 1440 px, les liens traversent les noms des nœuds (« Devis », « Client », « Réclamation »…), qui deviennent difficiles à lire.

Correction attendue : un détourage couleur fond derrière chaque `.onto-label` et chaque `.onto-zone`. Utiliser par exemple `paint-order` sur du texte SVG, ou un fond `var(--canard)` serré en HTML (rembourrage de 0 à 2 px, sans rayon).

Les deux interdits du Brand OS restent : **pas de `text-shadow` ni de `box-shadow`** (zéro ombre), et aucun hex.

Test : à 1440 × 800, pour chaque histoire à l'étape 4, la couleur d'arrière-plan calculée de chaque `.onto-label` est celle du fond du hero.

## 3. Bouton du hero en pleine largeur sur tablette

À 1024 × 768, le bouton « Parlons de votre transformation » prend toute la largeur. `AGENTS.md` impose qu'au-dessus de 760 px, le bouton rose du hero tienne sur une ligne, à la largeur de son contenu, aligné à gauche.

Correction attendue : rétablir cette règle entre 761 et 1199 px. Le bouton reste en pleine largeur à 760 px et en dessous.

Test : à 800 et à 1024 px, en FR et en EN, le bouton fait moins de 60 % de la largeur du hero et tient sur une ligne.

## Hors périmètre

- Textes, durées, histoires, couleurs et mise en page téléphone : inchangés.
- `tests/stabilite.spec.ts` : inchangé, aucun seuil assoupli.
- Ne pas committer, ne pas pousser : Claude s'en charge après la batterie.
