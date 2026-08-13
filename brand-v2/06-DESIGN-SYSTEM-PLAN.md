# 06 : Plan du Design System, landings Paul et Maxime

**Nœud :** G5 · **Owner :** Design System Architect · **Date :** 12/08/2026

Ce document ne contient ni copy, ni maquette. Il définit le strict nécessaire pour construire deux landing pages Figma qui partagent une même maison : Paul (l'opérateur) et Maxime (le guide). Rien n'est ajouté qui ne serve pas directement ces deux pages.

Sources lues : `brand/01_DESIGN_TOKENS.md` (canon verrouillé, valeurs qui font loi), `src/app/brand-lab/lab.css` (socle d'exploration V1, dont on garde le principe core + thèmes), `brand-v2/01-RECOVERY-AUDIT.md` (griefs et arbitrages du 12/08).

Fait technique vérifié : Geist et Geist Mono sont disponibles dans Figma, avec les styles exacts `Thin`, `ExtraLight`, `Light`, `Regular`, `Medium`, `SemiBold`, `Bold`, `ExtraBold`, `Black`. Ces noms sont repris tels quels ci-dessous, ils servent directement au code Plugin API.

---

## 1. Fondations

### 1.1 Grille desktop, 1440 px

12 colonnes.

| Paramètre | Valeur | Calcul |
|---|---:|---|
| Largeur de frame | `1440px` | fixe |
| Marge | `96px` (`space.9`) | de chaque côté |
| Largeur de contenu | `1248px` | `1440 − 2×96` |
| Gouttière | `24px` (`space.5`) | entre colonnes |
| Colonnes | `12` | |
| Largeur de colonne | `82px` | `(1248 − 11×24) / 12` |

### 1.2 Grille mobile, 390 px

4 colonnes.

| Paramètre | Valeur | Calcul |
|---|---:|---|
| Largeur de frame | `390px` | fixe |
| Marge | `24px` (`space.5`) | de chaque côté |
| Largeur de contenu | `342px` | `390 − 2×24` |
| Gouttière | `16px` (`space.4`) | entre colonnes |
| Colonnes | `4` | |
| Largeur de colonne | `73,5px` | `(342 − 3×16) / 4` |

Les deux grilles se déclarent comme des styles de grille Figma nommés `Grid / Desktop 1440` et `Grid / Mobile 390`, réutilisés tels quels sur les deux pages.

### 1.3 Échelle d'espacement, base 8

Reprise exacte des tokens du canon, aucune valeur ajoutée.

| Token | Valeur |
|---|---:|
| `space.0` | `0` |
| `space.1` | `4px` |
| `space.2` | `8px` |
| `space.3` | `12px` |
| `space.4` | `16px` |
| `space.5` | `24px` |
| `space.6` | `32px` |
| `space.7` | `48px` |
| `space.8` | `64px` |
| `space.9` | `96px` |
| `space.10` | `128px` |
| `space.11` | `160px` |
| `space.12` | `192px` |

Ces valeurs deviennent des variables `number` dans la collection Primitives, utilisées comme espacement d'Auto Layout partout.

### 1.4 Palette primitive puis couleurs sémantiques

**Primitives** (valeurs brutes, jamais utilisées directement dans un composant) :

| Primitive | Valeur |
|---|---:|
| `primitive.paper` | `#FFFDFA` |
| `primitive.paperAlt` | `#F0F0F0` |
| `primitive.ink` | `#0C0C0D` |
| `primitive.inkMuted` | `#6E7079` |
| `primitive.signal` | `#D1132F` |
| `primitive.signalTint` | `rgba(209,19,47,.10)` |
| `primitive.line` | `#D0D8D7` |
| `primitive.terra` | `#C67C60` |
| `primitive.paperMaxime` | `#FBF6EF` |
| `primitive.paperAltMaxime` | `#F2EAE0` |
| `primitive.inkPaul` | `#F4F4F2` |
| `primitive.paperPaul` | `#0E0E10` |

Les deux dernières lignes existent parce que Paul est un thème sombre (fond encre) et Maxime un thème clair chaud. Ce ne sont pas de nouvelles couleurs de marque, ce sont les mêmes rôles inversés ou réchauffés.

**Sémantiques**, nommées par rôle et non par teinte. Deux modes dans la même collection : `Paul` et `Maxime`.

| Token sémantique | Mode Paul | Mode Maxime |
|---|---|---|
| `surface/default` | `primitive.paperPaul` (`#0E0E10`) | `primitive.paperMaxime` (`#FBF6EF`) |
| `surface/alt` | `#17171A` | `primitive.paperAltMaxime` (`#F2EAE0`) |
| `surface/inverse` | `primitive.paper` (`#FFFDFA`) | `primitive.ink` (`#0C0C0D`) |
| `text/primary` | `primitive.inkPaul` (`#F4F4F2`) | `#171310` |
| `text/secondary` | `#8F9199` | `#6B6259` |
| `text/inverse` | `primitive.ink` (`#0C0C0D`) | `primitive.paper` (`#FFFDFA`) |
| `action/primary` | `#EF1D38` | `primitive.signal` (`#D1132F`) |
| `action/primaryTint` | `rgba(239,29,56,.14)` | `rgba(209,19,47,.09)` |
| `border/default` | `#2A2B30` | `#DDD2C4` |
| `accent/rare` | non utilisé | `primitive.terra` (`#C67C60`), liseré uniquement |

Le rouge reste une seule famille chromatique dans les deux modes, seule sa luminosité s'ajuste pour tenir le contraste sur fond encre. Ce n'est jamais une couleur différente.

### 1.5 Rayons

Le canon dit `0` partout. Un seul token intermédiaire existe pour l'exception documentée.

| Token | Valeur | Usage |
|---|---:|---|
| `radius.none` | `0` | tous les composants : boutons, cartes, champs, images |
| `radius.round` | `999px` | réservé aux avatars et aux pastilles d'état uniquement |

### 1.6 Typographie

Deux familles, Geist et Geist Mono. Titres en Geist avec approche `-4%` (`-0.04em`). Corps, labels et boutons en Geist Mono.

| Style de texte | Famille | Style Figma | Taille | Interligne | Approche |
|---|---|---|---:|---:|---:|
| `Display/Hero` | Geist | `SemiBold` | `clamp 40–72px`, ancré `56px` | `102%` | `-4%` |
| `Display/H1` | Geist | `SemiBold` | `44px` | `102%` | `-4%` |
| `Display/H2` | Geist | `SemiBold` | `36px` | `104%` | `-4%` |
| `Display/H3` | Geist | `Medium` | `22px` | `115%` | `-3%` |
| `Body/Lead` | Geist Mono | `Regular` | `22px` | `145%` | `-1%` |
| `Body/Default` | Geist Mono | `Regular` | `16px` | `155%` | `-1%` |
| `Body/Small` | Geist Mono | `Regular` | `14px` | `150%` | `-1%` |
| `Label/Uppercase` | Geist Mono | `Medium` | `12px` | `135%` | `12%` |
| `Button/Default` | Geist Mono | `Medium` | `14px` | `100%` | `2%` |
| `Caption/Meta` | Geist Mono | `Regular` | `12px` | `135%` | `1%` |

`Display/Hero` porte le poids `SemiBold` par défaut, avec une variante `Medium` disponible pour Maxime (voir §3, la chaleur passe aussi par un poids de titre légèrement plus léger).

### 1.7 Principes de motion

Deux vitesses, une par expression, même courbe standard.

| Token | Paul | Maxime |
|---|---:|---:|
| `motion.fast` | `90ms` | `160ms` |
| `motion.base` | `150ms` | `280ms` |
| `motion.slow` | `320ms` | `560ms` |
| `ease.standard` | `cubic-bezier(0.2, 0.7, 0.2, 1)` | `cubic-bezier(0.2, 0.7, 0.2, 1)` |

Paul est sec et rapide, l'opérateur ne fait pas attendre. Maxime est plus ample, la matière respire. La courbe ne change jamais, seule la durée porte la différence.

### 1.8 Règles de densité

| Paramètre | Paul | Maxime |
|---|---|---|
| Rythme de section | `space.9` (`96px`) | `space.10` (`128px`) |
| Rythme de bloc | `space.6` (`32px`) | `space.7` (`48px`) |
| Padding interne des cartes | `space.4` (`16px`) | `space.6` (`32px`) |
| Poids du corps | `Body/Small` par défaut | `Body/Default` par défaut |
| Grain de fond | plus marqué, `0,14` | plus discret, `0,07` |

Paul tient plus d'information par écran, à densité maîtrisée. Maxime respire davantage, moins d'éléments simultanés.

---

## 2. Les 11 composants, pas un de plus

Convention de nommage Figma : slash, `Famille / Variante`.

### 2.1 Header minimal : `Header / Minimal`
À quoi il sert : identifier la page et donner un seul accès de sortie (CTA ou lien de retour), rien d'autre.
Structure : Auto Layout horizontal, `space-between`, hauteur `hug`, largeur `fill`, padding horizontal aligné sur la marge de grille, `1` filet `border-bottom` hairline.
Variantes : `Persona` (Paul/Maxime), `HasCTA` (true/false).
Propriétés exposées : `Logotype` (instance swap, asset SVG jamais retapé), `CTA label` (texte, visible si `HasCTA`).
Desktop / mobile : hauteur `64px` desktop, `56px` mobile ; sur mobile le CTA se réduit à une icône ou disparaît si `HasCTA=false`.

### 2.2 Primary CTA : `CTA / Primary`
À quoi il sert : l'unique action de conversion de la page.
Structure : Auto Layout horizontal, `hug` largeur et hauteur, padding inline `space.5` (`md`) ou `space.6` (`lg`), gap `space.3`, fond `action/primary`, angle `radius.none`.
Variantes : `Size` (`md`/`lg`), `State` (`default`/`hover`/`active`).
Propriétés exposées : `Label` (texte), `HasIcon` (booléen), `Icon` (instance swap).
Desktop / mobile : `lg` en hero desktop, `md` partout ailleurs ; sur mobile largeur `fill` dans les rangées de CTA isolées.

### 2.3 Secondary text link : `Link / Secondary`
À quoi il sert : action secondaire, jamais concurrente du CTA primaire.
Structure : Auto Layout horizontal, `hug`, `border-bottom` hairline en `border/default`, pas de fond.
Variantes : `State` (`default`/`hover`).
Propriétés exposées : `Label` (texte).
Desktop / mobile : identique, cible tactile minimum `40px` de hauteur sur mobile via padding invisible.

### 2.4 Hero : `Hero / Section`
À quoi il sert : premier écran, pose le problème reconnu et l'action principale, jamais le prix.
Structure : Auto Layout, `Layout=Split-desktop` en horizontal deux colonnes `fill` égales (texte / média), `Layout=Stacked-mobile` en vertical ; bloc texte = label, `Display/Hero`, `Body/Lead`, rangée de CTA.
Variantes : `Layout` (`Split-desktop`/`Stacked-mobile`), `Persona` (Paul/Maxime).
Propriétés exposées : `Eyebrow` (texte), `Titre` (texte), `Lead` (texte), `Média` (instance swap ou emplacement explicite type `lab-slot`).
Desktop / mobile : sur Paul le média est secondaire (diagramme ou interface), sur Maxime le média est central (visage) ; sur mobile le bloc média de Maxime passe avant le texte, celui de Paul reste après.

### 2.5 Use-case card : `Card / Use-case`
À quoi il sert : montrer un cas concret court, en grille.
Structure : Auto Layout vertical, `fill` en largeur dans une grille, `hug` en hauteur, filet hairline, padding `card-pad` (piloté par §1.8), gap `space.3`.
Variantes : `Densité` (`Compact`/`Généreuse`).
Propriétés exposées : `Index` (texte), `Titre` (texte), `Corps` (texte), `HasLink` (booléen), `Lien` (instance de `Link / Secondary`).
Desktop / mobile : grille 3 colonnes desktop, 1 colonne mobile, la carte passe de `fill` de colonne à `fill` de frame.

### 2.6 Proof card : `Card / Proof`
À quoi il sert : porter une preuve avec son niveau, jamais une preuve inventée.
Structure : Auto Layout vertical, en-tête horizontal `space-between` (nom anonymisé + niveau de preuve), liste de faits verticale, filet hairline complet.
Variantes : `Level` (`L1`…`L5`, cf. matrice de preuves).
Propriétés exposées : `Nom anonymisé` (texte), `Faits` (liste de textes, 2 à 4 lignes), `Niveau` (texte lié à `Level`).
Desktop / mobile : identique en structure, largeur `fill` dans les deux cas.

### 2.7 Process step : `Process / Step`
À quoi il sert : dérouler la méthode en étapes numérotées, jamais plus de 5 sur une page.
Structure : Auto Layout horizontal, deux zones (`index` largeur fixe `64px`, `contenu` `fill`), filet `border-bottom` hairline sauf dernier élément.
Variantes : `State` (`default`/`current`).
Propriétés exposées : `Numéro` (texte), `Titre` (texte), `Description` (texte).
Desktop / mobile : sur mobile la zone `index` passe au-dessus du contenu (`grid-template-columns` devient vertical).

### 2.8 Offer card : `Card / Offer`
À quoi il sert : présenter l'offre unique de la page, après la preuve et la méthode, jamais dans le hero.
Structure : Auto Layout vertical, en-tête (titre + badge optionnel), corps (liste de ce qui est inclus), pied (CTA primaire).
Variantes : `Emphasis` (`default`/`highlighted`).
Propriétés exposées : `Titre` (texte), `Inclus` (liste de textes), `Prix` (texte, masquable via `HasPrice`), `CTA` (instance de `CTA / Primary`).
Desktop / mobile : largeur maximale `container.text` centrée desktop, `fill` mobile.

### 2.9 Testimonial ou quote : `Quote / Testimonial`
À quoi il sert : une preuve incarnée, courte, jamais un avis générique.
Structure : Auto Layout vertical, `border-left` `2px` en `action/primary`, padding-left `space.5`, texte en `Display/H3`, attribution en `Label/Uppercase`.
Variantes : aucune, un seul rendu.
Propriétés exposées : `Citation` (texte), `Attribution` (texte).
Desktop / mobile : largeur `container.text`, identique aux deux tailles.

### 2.10 FAQ item : `FAQ / Item`
À quoi il sert : lever les objections listées dans le positionnement externe, sans surcharger la page.
Structure : Auto Layout vertical, en-tête horizontal `space-between` (question + icône d'état), réponse repliable en dessous, filet `border-bottom` hairline.
Variantes : `State` (`Closed`/`Open`).
Propriétés exposées : `Question` (texte), `Réponse` (texte).
Desktop / mobile : identique, pas de colonne sur mobile.

### 2.11 Footer : `Footer / Minimal`
À quoi il sert : fermer la page, wordmark et mentions, aucun réseau social superflu.
Structure : Auto Layout horizontal `space-between` desktop, `border-top` hairline, padding vertical `space.6`.
Variantes : aucune.
Propriétés exposées : `Wordmark` (instance swap, asset SVG), `Mentions` (texte).
Desktop / mobile : horizontal desktop, vertical empilé mobile avec `gap: space.3`.

---

## 3. Les deux expressions

| Token / paramètre | Paul (opérateur) | Maxime (guide) |
|---|---|---|
| `surface/default` | Encre `#0E0E10`, fond sombre | Crème chaud `#FBF6EF`, fond clair |
| Poids du titre hero | `SemiBold` | `Medium` |
| Rythme de section | `96px` | `128px` |
| Padding carte | `16px` | `32px` |
| Motion | `90/150/320ms`, sec | `160/280/560ms`, ample |
| Grain de fond | `0,14`, marqué | `0,07`, discret |
| Rôle du média en hero | secondaire, interface ou diagramme | central, visage |
| Densité de contenu | plus haute, précision | plus basse, respiration |
| Sensation visée | opérateur, 0→1, systèmes | guide, pédagogie, confiance |

**Ce qui ne change jamais**, la structure qui prouve que les deux pages appartiennent à la même maison :

- La famille typographique : Geist pour les titres, Geist Mono pour tout le reste.
- Le rouge Parrit `#D1132F` (ou sa variante éclaircie pour tenir sur fond encre côté Paul), qui reste la seule couleur de signal dans les deux cas.
- Les angles à zéro partout, sauf avatars et pastilles.
- L'absence totale d'ombre.
- La base d'espacement 8.
- La structure interne des 11 composants : mêmes zones, mêmes règles d'Auto Layout, seules les variables changent de valeur selon le mode.

Le lecteur doit voir deux personnes d'une même entreprise, jamais deux gabarits achetés séparément. Le test : si une différence entre Paul et Maxime ne peut pas s'exprimer comme la valeur d'une variable existante, elle sort du système.

---

## 4. Plan d'exécution Figma

Écrit pour un intégrateur qui pilote la Plugin API. Chaque étape porte sa vérification avant de passer à la suivante.

### Étape 1 : Collections de variables
Créer une collection `Primitives` (couleurs et espacements en valeurs brutes, un seul mode). Créer une collection `Semantic` avec deux modes nommés exactement `Paul` et `Maxime`, dont chaque variable est un alias vers une variable de `Primitives`.
**Vérifier avant de continuer :** chaque token du §1.4 existe, dans les deux modes, sans valeur codée en dur ; changer le mode de la collection sur une frame de test doit suffire à faire basculer tous les alias.

### Étape 2 : Styles de texte
Créer les 10 styles du §1.6, avec les noms de famille et de style Figma exacts (`Geist` / `SemiBold`, `Medium`, `Regular`, jamais `Semi Bold`). Nommer les styles `Display/Hero`, `Display/H1`, etc., en reprenant la colonne `Style de texte` du tableau.
**Vérifier avant de continuer :** chaque style s'applique sans avertissement de police manquante ; l'approche `-4%` est bien un `letter-spacing` négatif sur les styles `Display`, pas un artefact visuel du zoom Figma.

### Étape 3 : Styles de grille et d'effet
Créer les deux styles de grille du §1.1 et §1.2 (`Grid / Desktop 1440`, `Grid / Mobile 390`). Aucun style d'ombre à créer, `shadow.none` est la seule valeur du canon.
**Vérifier avant de continuer :** appliquer chaque grille sur une frame vide et confirmer visuellement marge, gouttière et nombre de colonnes avant de poser le premier composant dessus.

### Étape 4 : Composants atomiques
Construire dans l'ordre `Header / Minimal`, `CTA / Primary`, `Link / Secondary`. Ce sont les seuls composants sans dépendance à un autre composant du système.
**Vérifier avant de continuer :** chaque composant respecte `hug`/`fill` tel que décrit au §2, bascule proprement entre les deux modes `Paul`/`Maxime`, et n'a aucune valeur de couleur, rayon ou espacement qui ne soit pas une variable liée.

### Étape 5 : Composants de contenu
Construire dans l'ordre `Hero / Section`, `Card / Use-case`, `Card / Proof`, `Process / Step`, `Card / Offer`, `Quote / Testimonial`, `FAQ / Item`, `Footer / Minimal`. Chacun peut réutiliser les instances de l'étape 4 (`CTA / Primary` dans `Hero` et `Card / Offer`, `Link / Secondary` dans `Card / Use-case`).
**Vérifier avant de continuer, à chaque composant :** toutes les variantes déclarées au §2 existent réellement dans le panneau de variantes ; le comportement desktop contre mobile est testé sur les deux grilles de l'étape 3 ; le composant tient dans les deux modes sans réglage manuel de couleur.

### Étape 6 : Assemblage de contrôle
Instancier les 11 composants sur deux frames de test, une à `1440px` en mode `Paul`, une à `390px` en mode `Maxime`, puis l'inverse (`1440` Maxime, `390` Paul) pour confirmer que le système n'est pas câblé en dur à une seule combinaison.
**Vérifier avant de clore :** aucune couleur codée en dur détectée sur les 4 frames ; la lecture globale montre deux expressions d'une même maison, pas deux gabarits différents ; aucun composant utilisé sur une seule des deux pages ne subsiste, sinon il sort du système.

---

## Contraintes tenues

- Jamais plus de 11 composants.
- Aucun composant non utilisé par les deux pages.
- Pas de kit générique recoloré, chaque composant est construit pour ce funnel.
- Pas d'ombre, pas d'arrondi hors avatar/pastille, pas de dégradé décoratif.
- Le système reste au service du funnel, il ne devient pas un projet indépendant.
