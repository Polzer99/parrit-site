# Lot A — parrit.ai : harmonisation design (zéro changement de texte)

Date : 25/10/2026. Base : origin/main `c8dce63`. Rédigée par Claude (revue), implémentée par Codex (§25).

## Contexte

Audit du 25/10 mesuré dans Chromium (1920 / 1440 / 390 px) sur prod et local, plus réconciliation Brand OS
(export vendorisé `src/system/brand-os.*`, origine 112de90, à jour pour les valeurs). Le site est jugé beau ; on
**aligne**, on ne refait pas. Aucune nouvelle couleur, police, composant ou bibliothèque.

## Règles absolues

- **Aucun mot visible ne change** (ni FR ni EN, ni `alt`, ni `aria-label`, ni metadata). Ce lot est CSS + markup minimal.
- Aucune valeur de marque en dur : uniquement les variables existantes de `src/system/tokens.css` / `brand-os.tokens.css`.
- **Ne modifie aucun test existant.** Si un test existant échoue à cause d'un changement demandé ici, n'adapte pas le
  test : annule ce point précis et explique-le dans le compte rendu. Tu peux AJOUTER des tests.
- Ne touche pas `src/system/brand-os.*` (fichiers générés), ni `src/app/api/**`, ni le contenu du Journal.
- Ne committe pas de captures (`artifacts/`, `.codex-handoffs/**/*.png`).

## Changements demandés

### A1. Poids du titre d'accueil
`src/app/(rev01)/rev01.css` (~l.1757-1766, `.home-s-hero h1`) déclare `font-weight: 300`, poids non chargé
(General Sans 400/500/600 seulement, `src/system/fonts.css`). Le navigateur synthétise. Passer à **500**, le poids
des h1 des pages intérieures (`.rev-hero h1`, `.r2-hero h1`). Garder le centrage, le cadre et la taille actuels.

### A2. Une seule taille de titre de section (h2)
Mesuré à 1440 : h2 de section à 54 px (accueil, /dossiers) et 40 px (/systems, /build-with-you, /manufacture,
/legal). Canon (`visual/type-scale.json#web_mapping.title`) : `clamp(30px, 2.4vw + 21px, 48px)`.
- Introduire **un** token `--t-title: clamp(30px, 2.4vw + 21px, 48px)` dans `src/system/tokens.css` et l'appliquer à
  tous les h2 de **section** (accueil `home-s-*`, `.r2-section`/`.r2-shead`, `.rev-*`).
- Mobile (≤ 760 px) : h2 de section à 32 px partout (aujourd'hui 34 ou 32).
- Ne change PAS : les h1, les titres d'entrées du Journal (22 px), les titres de cartes, la note de clôture si son
  test d'alignement mesure une taille fixe (dans ce cas, laisse-la et signale-le).

### A3. Un seul éclat rose par écran
Doctrine testée dans `tests/doctrine-visible.*` : rose = un éclat par écran. Mesuré : numéros d'étape `01 02 03`
(`.no`) en rose sur /build-with-you (3 dans le premier écran) et /manufacture (3 + le bouton plein dans un écran).
- Les numéros d'étape (`.no` et équivalents de listes numérotées) passent à la couleur secondaire sur fond sombre
  (variable existante de gris clair sur encre, ex. `--g3`/`--brand-derived-on-ink-2` selon ce que `tokens.css`
  expose) et à la couleur de marque canard sur fond clair. Plex Mono conservé.
- Ne touche pas aux marqueurs numérotés de la scène produit (`ProductScene`, `.scene-marker`) : ils sont couverts
  par `tests/product-scene.*`. Ne touche pas au point du logo ni au bouton d'action principal.
- Ajoute un test (Playwright, même harnais que `doctrine-visible.spec.ts`) qui vérifie sur /fr/build-with-you et
  /fr/manufacture, 1440×900 et 390×844, qu'aucun numéro d'étape n'a la couleur rose calculée.

### A4. Zéro ombre
`src/system/system.css` (~l.120 et ~l.135) : `box-shadow` sur `.instrument` / `.register.instrument`. Règle canon :
aucune ombre, aucun halo. Supprimer ces `box-shadow` (le filet existant suffit). Vérifie qu'aucune autre
`box-shadow` décorative ne reste dans `src/` (hors focus visible d'accessibilité).

### A5. Sélecteur de langue allégé (desktop et mobile)
`src/system/components/RevHeader.tsx` + `rev01.css` (~l.109-250). Aujourd'hui FR et EN sont deux boîtes encadrées,
la langue active en **boîte blanche pleine** : c'est l'élément le plus lourd de la barre, plus fort que le CTA.
Sur mobile, trois boîtes encadrées côte à côte (FR · EN · MENU).
- Rendre FR / EN en **texte** (Plex Mono, mêmes taille et espacement que les liens de nav), séparés par un filet ou un
  point médian, sans cadre ni fond. Langue active : couleur pleine + **soulignement** (l'état ne repose pas sur la
  couleur seule) + `aria-current="true"` ; inactive : couleur secondaire.
- Cible tactile ≥ 44 px conservée (padding, pas de cadre).
- Le bouton MENU mobile garde son cadre actuel. Le CTA desktop garde son style actuel.
- Ne change pas les libellés, les URLs, ni la logique de bascule de langue.

### A6. Padding des boutons = token
`.rev-button` (~l.387, padding 12px 18px) diverge de `--button-padding` (14px 24px, `tokens.css` ~l.82). Utiliser
le token. Si `alignment-grid` ou `aeration` mesure la hauteur au pixel et casse, annule ce point et signale-le.

## Vérifications à exécuter
`npm run lint && npm test && npm run test:brand-os && npm run qa:claims:rev01 && npm run build && npm run qa:brand:rev01 && npm run qa:network:rev01`

## Compte rendu attendu
Fichiers modifiés (avec lignes), test ajouté, résultat de chaque commande, et la liste des points annulés avec la
raison. Pas de capture d'écran : la vérification visuelle est faite côté Claude.


---

# RÉVISION 2 (25/10/2026, 23h30)

Ton travail est dans ce worktree ; garde-le. Ton annulation de A2 était juste (48 px hors de l'échelle fermée
d'`aeration.spec.ts`). Décision de Paul du 25/10 : les tests contrôlent le fond et la structure, ils ne figent pas
des libellés ; tu peux donc modifier un test quand il bloque sur un présupposé et non sur une règle de fond, en le
justifiant dans le compte rendu.

## A2 bis. Une taille de titre de section, dans l'échelle existante
Tous les h2 de **section** passent à `var(--d-s)` (40 px desktop) et 32 px sous 760 px, valeurs déjà dans l'échelle
fermée. Concerné à 1440 : accueil (`home-s-*`, aujourd'hui 54) et /dossiers (54). Les pages déjà à 40 ne bougent pas.
Ne change pas `--d-m`/`--d-l` (utilisés ailleurs) : applique la taille aux sélecteurs de h2 de section.
Exceptions inchangées : titres d'entrées du Journal, titres de cartes, h2 de la note de clôture (`.home-s-close h2`,
`.r2-close h2`) qui restent à leur taille actuelle.

## Batterie précédente : 2 échecs dans `tests/aeration.spec.ts`
1. 1440 px : « the geometry audit must measure filled actions » (actionCount = 0). Cause probable : la langue active
   n'est plus un bouton plein (A5, voulu). Corrige le **présupposé** de l'audit : il doit compter les actions
   visibles, pleines ou au contour, et continuer à mesurer l'écart texte/action de 12 px. Ne relâche ni le plancher
   de 16 px, ni les chevauchements, ni l'échelle fermée.
2. 390 px : `measureInvalidFormStates` dépasse 20 s (clic sur `.agent-esquisse-form button[type="submit"]`, attente de
   `#quick-idee` = "reporting"). Détermine si c'est causé par ce lot (ex. header mobile plus large, élément qui
   recouvre le bouton, padding) en comparant avec origin/main ; corrige la cause si elle vient de ce lot. Ne modifie
   pas ce test.
