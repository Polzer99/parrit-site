# CODEX-SPEC 2026-11-12 · Polissage UX/UI de parrit.ai selon cinq skills de design

Niveau de risque : moyen

Demande de Paul (12/11/2026) : appliquer au site le polissage que proposent cinq skills de
design publiques (frontend-design d'Anthropic, Impeccable, emil-design-eng, create-design-md,
UI UX Pro Max). Audit fait par Claude sur le site en ligne (captures 1440 et 390 px, FR et EN)
et sur `origin/main` (d7da52b). Le monde visuel ne change pas : couleurs, polices, logo, photos,
textes et offres restent tels quels.

## Règle de préséance

La charte gagne : Brand OS P1/P3 et les décisions datées d'`AGENTS.md`. Ne modifier aucune
valeur de couleur, de police, de graisse, de rayon ou d'ombre, ni aucun seuil de test.

## Lot A · Un fichier de règles visuelles qui dit la vérité (create-design-md)

Constat : `AGENTS.md` désigne bien le Brand OS comme source visuelle, mais `DESIGN-SYSTEM.md`
(racine) et `docs/design-system/PARRIT-DESIGN-SYSTEM.md` (marqué « canonique ») décrivent encore
le monde crème et rouge, sans aucun bandeau. Un agent qui les ouvre produit le mauvais rendu.

1. Écrire `DESIGN.md` à la racine **à partir du code servi**, sans inventer de valeur : jetons
   (`src/system/tokens.css`, `src/system/brand-os.tokens.css`), typographie, espacements, filets,
   rayons, états (hover, focus-visible, active, disabled), mouvement existant, composants
   récurrents (boutons `exec` et `ghost`, bandeaux, grille de services, téléphones, FAQ, bloc
   rendez-vous). Citer les variables CSS, aucune valeur hexadécimale recopiée. Chaque entrée
   renvoie à son fichier source. Format de la skill create-design-md (Couleur, Typographie,
   Mise en page, Composants, Mouvement, À faire / À éviter), en français. Renvoyer vers les
   décisions datées d'`AGENTS.md` au lieu de les réécrire.
2. En tête de `DESIGN-SYSTEM.md` et de `docs/design-system/PARRIT-DESIGN-SYSTEM.md` : bandeau
   « Historique : remplacé pour le site par `DESIGN.md` et le Brand OS (D1 du 24/09/2026) ».
   Ne rien supprimer.
3. Dans la section « Source de vérité visuelle » d'`AGENTS.md`, ajouter une ligne : `DESIGN.md`
   résume les règles servies, le Brand OS reste la source.
4. Test `tests/design-md-truth.test.mjs` : chaque variable CSS citée dans `DESIGN.md` existe dans
   les CSS servis ; aucune valeur hexadécimale dans `DESIGN.md`.

## Lot B · Mise en page (Impeccable)

1. Bandeau « Ils travaillent avec nous » : à 1440 px, les logos se rangent en 5 + 1 et le dernier
   reste seul au centre, alors que le correctif 2 du 08/11 (`AGENTS.md`) demande une ligne dans
   1060 px. Rétablir la ligne unique à l'ordinateur sans changer la taille des logos (jouer sur
   l'espacement `--brand-s*`) ; mobile inchangé. Test : à 1440×800 FR et EN, tous les logos ont
   le même sommet à 1 px près.
2. Bandeau des technologies : le cadre touche les bords de la fenêtre (filets verticaux collés à
   x = 0 et x = largeur). Garder le défilement, retirer les filets latéraux ou contenir le cadre
   dans la largeur de page.

## Lot C · Détails (emil-design-eng, plancher Impeccable)

1. Article du Journal : le chapeau et « 4 min de lecture » sont collés. Ajouter l'espace du
   système entre les deux.
2. Bloc rendez-vous (Cal.com intégré) : sur `/fr` les créneaux s'affichent au format 12 h
   (« 2:00pm »). Imposer le format 24 h sur les pages françaises si l'intégration Cal.com
   l'expose (option d'interface de l'embed ou paramètre d'URL documenté). Si aucune option
   documentée n'existe, ne rien bricoler et le noter dans le compte rendu.
3. Transitions : aucune transition sur `all` ; un état `:active` sur chaque bouton public
   (déjà le cas pour `.rev-button`, étendre aux autres s'il en manque). Pas de nouvelle animation.

## Hors périmètre

Apparition des sections au défilement et badge « Préparé, vous validez » par service : décisions
de Paul du 08/11, ne pas y toucher. Couleurs, polices, logos, photos, textes, offres, prix,
ontologie du hero, articles du Journal, `llms.txt`. Aucune dépendance nouvelle. Aucun `npx`.

## Contrôles

`npm ci && npm run lint && npm run build && npm test && npm run test:brand-os && npm run qa:brand:rev01`
au vert, puis `qa:network:rev01` sur l'hôte. Les tests de marque ne sont ni retirés ni
assouplis. Compte rendu : fichiers modifiés, tests ajoutés ou changés, résultat de chaque
commande, et pour C2 la source documentaire utilisée.
