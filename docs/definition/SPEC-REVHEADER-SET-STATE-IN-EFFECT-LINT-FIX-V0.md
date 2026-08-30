# SPEC — fix lint bloquant `react-hooks/set-state-in-effect` sur RevHeader.tsx (self-healing canary #2)

## Contexte

Le workflow GitHub Actions "CI" (job "lint and build") est actuellement ROUGE sur `main`
(constaté sur le run `33321424983` du 30/08/2026 16:04 UTC, déclenché par un commit
purement doc/journal — le fichier en cause n'a pas été touché par ce commit, la règle lint
était déjà violée avant, elle bloque maintenant tout commit qui déclenche CI sur `main`).

## Root cause (constatée)

`src/system/components/RevHeader.tsx` appelle `setState` de façon synchrone dans le corps
de deux `useEffect` :
- ligne 24 : `setMenuOpen(false)` dans un effet dépendant de `[pathname]`
- ligne 28 (composant voisin dans le même fichier) : `setMount(true)` dans un effet gardé
  par un check `if (!node || typeof IntersectionObserver === "undefined")`
- ligne 33 : `setPanelMounted(true)` dans un effet dépendant de `menuOpen`

La règle ESLint `react-hooks/set-state-in-effect` (react-hooks-eslint) interdit ce pattern :
« Calling setState synchronously within an effect can trigger cascading renders ». 3 erreurs
+ 1 warning, `exit code 1` sur le job `lint and build`.

## Fix demandé (minimal, chirurgical, ne change AUCUN comportement visuel)

Lire `src/system/components/RevHeader.tsx` en entier avant de toucher au fichier — il y a
plusieurs composants dans ce fichier, ne pas se fier aux seuls numéros de ligne ci-dessus
(ils peuvent avoir bougé). Pour CHACUN des 3 appels signalés par le lint :

1. Cas ligne ~24 (`setMenuOpen(false)` sur changement de `pathname`) : c'est un reset d'état
   dérivé du `pathname` — le pattern recommandé par la doc React (et par le message d'erreur
   lui-même) est d'utiliser une clé dérivée dans le rendu plutôt qu'un effet, OU si l'effet
   doit rester (ex. le composant a un état interne non entièrement dérivable), déplacer
   l'appel dans un `queueMicrotask`/callback ou restructurer pour que le calcul ne déclenche
   pas de synchronisation en cascade. Choisir la solution la MOINS invasive qui fait taire le
   lint sans changer le comportement observable (le menu doit toujour se fermer au changement
   de route, exactement comme avant).
2. Cas ligne ~28 (`setMount(true)` gardé par un check IntersectionObserver) : ce cas ressemble
   à un guard de montage — vérifier s'il peut se réécrire en `useLayoutEffect` avec le même
   guard, ou en état initial calculé directement (`useState(() => ...)`) si la valeur ne
   dépend pas du DOM réel à l'exécution.
3. Cas ligne ~33 (`setPanelMounted(true)` dans un effet dépendant de `menuOpen`, suivi d'un
   `requestAnimationFrame`) : ce pattern sert visiblement une animation d'ouverture (mount
   puis anime au frame suivant) — NE PAS casser cette séquence. Solution probable : garder le
   `requestAnimationFrame`/`cancelAnimationFrame` tel quel, et éviter seulement l'appel
   synchrone en tête d'effet (ex. combiner les deux `setState` en un seul, ou déplacer le
   premier dans le `requestAnimationFrame` si l'ordre d'affichage le permet — à vérifier par
   la lecture du fichier, ne pas deviner à l'aveugle).

**Contrainte dure** : après le fix, le comportement du header (ouverture/fermeture du menu
mobile, fermeture au changement de route, animation d'apparition du panneau) doit rester
visuellement identique — ce lot est un fix de warning de lint, pas un refactor UX.

## Tests / vérification attendus

1. `npm run lint` (ou la commande exacte utilisée par le job CI "lint and build" — vérifier
   dans `.github/workflows/` avant de lancer) doit passer avec 0 erreur sur ce fichier.
2. `npm run build` doit rester vert (le job CI fait "lint and build" en une étape — s'assurer
   que le build TypeScript/Next.js ne casse pas).
3. Si des tests existants (Playwright/Jest) couvrent le header/menu mobile, les faire passer.
   Sinon, ne pas en inventer de nouveaux pour ce lot minimal.

## Périmètre — ce que ce lot NE fait PAS

- Ne touche à aucun autre fichier que `src/system/components/RevHeader.tsx` (sauf si le lint
  révèle qu'un composant partagé doit changer — dans ce cas, documenter pourquoi dans la PR).
- Ne change aucun texte, aucune classe CSS, aucun comportement visible.
- Ne désactive PAS la règle ESLint (ni globalement, ni en commentaire `// eslint-disable`) —
  le but est de corriger le pattern réel, pas de faire taire l'alerte.
- Ce lot est un canary du chantier SELF_HEALING_INGESTION_AND_AGENT_MAIL_V0 : la preuve
  attendue est CI vert sur `main` après merge, pas une réécriture plus large du header.
