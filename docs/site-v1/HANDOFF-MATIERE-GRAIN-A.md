# Handoff Codex : matière granuleuse, option A (26/10/2026)

Décision de Paul, 26/10/2026 : option A du relevé `docs/site-v1/releves/RAPPORT-METALAB.md`, section 9 (aplat à densité constante, deux jetons Brand OS, zones sans texte). L'option B (densité variable) n'est pas retenue.

## Objectif

Ajouter au site une matière granuleuse **uniforme**, produite depuis les jetons Brand OS, sur une seule zone décorative de l'accueil. Rien d'autre ne change.

## Ce qui est livré

1. **Générateur au prebuild** : `scripts/generate-grain.mjs`, appelé par `prebuild` après les scripts existants.
   - Lit `src/system/brand-os.tokens.css` et extrait les valeurs de `--brand-core-off`, `--brand-core-canard` et `--brand-accessible-ink`. **Aucune valeur de couleur écrite dans le script.** Jeton absent ou illisible = échec du build (pas de valeur de repli).
   - Produit deux tuiles carrées de 256 x 256 px, grain de 2 x 2 px, tirage pseudo-aléatoire à graine fixe (sortie identique d'un build à l'autre) :
     - `public/matiere/grain-clair.png` : fond `--brand-core-off`, grain `--brand-accessible-ink`, densité 6 % ;
     - `public/matiere/grain-canard.png` : fond `--brand-core-canard`, grain `--brand-accessible-ink`, densité 10 %.
   - Exactement deux couleurs par tuile. PNG sans perte. Poids cible : moins de 4 Ko par tuile.
   - Dépendance : réutiliser une bibliothèque déjà présente dans `package.json` si elle sait écrire un PNG ; sinon écrire le PNG à la main (zlib de Node). Aucune nouvelle dépendance sans le signaler dans la PR.
2. **Composant** `src/system/components/Matiere.tsx`, exporté par `index.ts` :
   - `<Matiere tone="clair" | "canard" />` ; rend un `<div aria-hidden="true">` vide, **sans aucun enfant**, hauteur `var(--brand-s6)`, pleine largeur de la colonne, `background-image` en répétition de la tuile, `image-rendering: pixelated`.
   - Radius 0, aucune ombre, aucun dégradé, aucune animation.
3. **Une seule utilisation** : sur l'accueil (FR et EN), entre la section d'ouverture et la section suivante, ton `clair` en registre clair. Aucune autre page.
4. **Contrôles ajoutés** :
   - `scripts/brand-conformity-check.mjs` : chaque fichier de `public/matiere/` contient exactement deux couleurs, et ces deux couleurs sont des valeurs du fichier vendorisé ;
   - test Playwright (dans la suite deny-all existante) : l'élément `Matiere` n'a aucun nœud texte, porte `aria-hidden="true"`, n'élargit pas la page à 375 et 1440 px ;
   - aucun texte ne se superpose à la matière (boîte de l'élément sans intersection avec un nœud texte visible).

## Interdits

- Densité variable, dégradé, flou, transparence, animation du grain.
- Texte posé sur la matière.
- Tout hex littéral hors `brand-os.tokens.css`.
- Toute reprise d'image, de code ou de composition de Metalab.
- Modifier une autre page, un autre composant ou l'échelle typographique.

## Critères d'acceptation

1. `npm run build`, `npm run qa:brand:rev01`, `npm run test:brand-os` et `npm run qa:network:rev01` verts sur la machine hôte (Playwright avec Chromium : Codex ne peut pas le lancer, Claude rejoue toute la suite sur l'hôte).
2. Deux builds successifs produisent des tuiles identiques à l'octet près.
3. Captures 375 et 1440 px de l'accueil FR et EN jointes à la PR.
4. Modifier une valeur de jeton dans une copie locale change la tuile au build suivant (preuve que rien n'est recopié).

## Branche et PR

Branche dédiée depuis `main`, PR vers `main`, **pas de fusion par Codex**. Relecture par Claude, fusion par Paul (règle du dépôt).
