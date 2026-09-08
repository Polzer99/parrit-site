# SPEC · Contraste du lien « Laisser mon e-mail » dans le panneau esquisse

Date : 2026-09-08. Signalement utilisateur réel (contact de Paul) : le
lien « LAISSER MON E-MAIL » est illisible, noir sur fond gris.

## Constat prouvé

- `src/system/components/AgentEsquisse.tsx` ligne 101 : le lien de
  clôture de l'échange utilise `className="home-s-text-link"`.
- `src/app/(rev01)/rev01.css` ligne ~1715 : `.home-s-text-link` force
  `color: var(--ink)` (#0A0B0C) — style conçu pour les sections
  CLAIRES (usage : section maison, `page.tsx` ligne 201, fond paper).
- Le panneau `.agent-esquisse` (rev01.css ligne ~1436) a
  `background: var(--carbon)` (#131518). Ink sur carbon ≈ ratio de
  contraste 1,03:1 : le lien est invisible.

## Modification (CSS uniquement + 1 test)

1. Dans `src/app/(rev01)/rev01.css`, juste après le bloc
   `.home-s-text-link { ... }` (ligne ~1715), ajouter une règle scopée :

   ```css
   .agent-esquisse .home-s-text-link {
     color: var(--paper);
   }
   ```

   NE PAS toucher au bloc `.home-s-text-link` existant : l'usage de la
   section maison (fond clair) doit rester `var(--ink)`.

2. Dans `tests/conformity-home.spec.ts`, ajouter un test qui verrouille
   le contraste : ouvrir la home, remplir l'input
   `#agent-operation` (n'importe quelle phrase, ex. « relance client »),
   soumettre le formulaire `.agent-esquisse-form`, attendre le lien
   `.agent-esquisse .home-s-text-link`, et asserter que son
   `getComputedStyle(...).color` vaut `rgb(241, 242, 243)` (--paper).
   Nom du test explicite, en anglais comme les voisins, par exemple :
   `sketch panel e-mail link stays readable on carbon`.

Ne rien changer d'autre : ni le composant, ni les tokens, ni l'usage
maison.

## Preuve attendue

Build OK ; suite Playwright complète verte, y compris le nouveau test.
