# PARRIT-VISUAL-RESET-V2

**Tranche du 31 juillet 2026.** Laboratoire de direction artistique, isolé, non publié.
**État : trois concepts composés, aucun retenu.** L'arbitrage appartient à Paul.

---

## Diagnostic accepté

`HOMEPAGE-LEVEL0-V1` ressemblait à l'ancien site. Le diagnostic de Paul est retenu sans discussion, et la cause racine est identifiée : **le design system a été dérivé du mauvais registre.**

Le Figma contient deux familles qui ne partagent aucun langage visuel.

| | Templates commerciaux Figma | Références éditoriales canoniques |
|---|---|---|
| Display | Arpona | grotesque condensée lourde, capitales |
| Image | placeholders gris | photographie noir et blanc détourée |
| Matière | aucune | trame rouge, fil de causalité |
| Usage | propales, decks, rendez-vous | newsletter, manifeste, campagne |

Le design system du 31/07, ADR-007 et ADR-008 comprises, a été construit sur la **première** colonne. Reproduire fidèlement un template commercial ne pouvait produire qu'une version nettoyée de l'ancien site. Ce n'est pas un défaut d'exécution, c'est une erreur de source.

**Abandonné :** la composition Level 0, le rythme de la page specimen, l'idée qu'une couche structurelle seule porte l'identité.
**Conservé :** palette, logo, accessibilité, contenus factuels, attribution Hermes, flag, analytics, harnais QA.

## Typographie

| | |
|---|---|
| Famille | **Barlow Condensed** |
| Graisses | ExtraBold 800, Black 900 |
| Licence | **SIL Open Font License 1.1**, conservée dans `public/fonts/barlow-condensed/OFL.txt` |
| Source | dépôt officiel Google Fonts, `ofl/barlowcondensed/` |
| Hébergement | **auto-hébergé**, `public/fonts/barlow-condensed/*.woff2`, converti TTF vers woff2 par `fontTools`. Aucun chargement Google Fonts au runtime. |
| Poids servis | 39 ko (800) et 38 ko (900) |

**Répartition mise à l'épreuve dans les trois concepts.** Ce n'est pas encore un système figé : c'est précisément ce que la comparaison doit trancher.

| Famille | Rôle |
|---|---|
| Barlow Condensed 900 / 800 | manifeste, impact, prise de conscience, grands titres |
| Arpona | stature : citations, textes de posture, registre institutionnel |
| Geist | corps et interfaces |
| Geist Mono | index, métadonnées, traces, légendes, états Hermes |

### Tests français

Chaînes imposées, mesurées sur **l'encre réelle** des glyphes (`TextMetrics`), pas sur la boîte de ligne : `PRISE DE CONSCIENCE` · `EXÉCUTION` · `ÉQUIPES` · `DÉPLOIEMENT` · `MÉTIERS` · `AMÉLIORATION` · `RÉDUCTION` · `D'UNE IA QUI PARLE À DES AGENTS QUI EXÉCUTENT`.

Chaque chaîne testée en **800 et 900**, à **48, 96 et 160 px**, sur **Chromium et WebKit**, aux quatre largeurs.

| Interlignage | Marge la plus serrée | Verdict |
|---|---|---|
| `0.92` | **1,8 px** sous `EXÉCUTION`, 800/48px | rejeté, sous le seuil posé par ADR-013 |
| **`0.94`** | **2,7 px**, positif à tous les corps et sur les deux moteurs | **retenu** |

Le plancher `1.04` de ADR-013 reste valable **pour Arpona uniquement** : deux fontes, deux métriques, deux valeurs. Rapport brut : `docs/design-system/qa/visual-reset-v2/typo-report.json`.

**Aucune compression artificielle de la chasse.** Ni `transform: scaleX()`, ni `font-stretch`. Vérifié automatiquement sur tous les titres et CTA des trois concepts.

## Imagerie

Toute l'imagerie part de **vraies photographies**. Aucun visage généré, aucune scène client fabriquée, aucun faux logo, aucune banque d'images. Aucun texte n'est cuit dans les images : les légendes se composent en HTML, en Geist Mono, en français.

### Photos sources utilisées

| Fichier | Rôle | Choix |
|---|---|---|
| `refs/paul/paul-frontal-01.jpg` | manifeste | regard direct, posture posée |
| `refs/paul/paul-roses.jpg` | chaleureux | sourire réel, non posé |
| `public/brand/terrain/atelier-cartographie.jpg` | plaque 1 | atelier réel, en mission |
| `public/brand/terrain/masterclass-acculturation.jpg` | plaque 2 | salle réelle |
| `public/brand/terrain/pleniere-prise-parole.jpg` | plaque 2 | prise de parole réelle |

`paul-frontal-01.jpg` et `paul-terrasse-brascroises.jpg` sont **le même fichier**, octet pour octet. Signalé, non corrigé : c'est le dossier de Paul, hors périmètre d'écriture.

### Détourage

Détourage réel avec couche alpha (`rembg`, modèle `isnet-general-use`, alpha matting), suivi d'une **décontamination de frange** : sur les pixels partiellement opaques, le fond clair d'origine est soustrait analytiquement. Sans elle, la chevelure claire laisse un liseré blanc sur fond noir.

Le facteur de décontamination a été calibré à l'œil, à 100 % et à 200 % : à `0,15` la frange virait au gris sale sur papier, à `0,40` les deux fonds sont propres. **Inspecté sur papier crème, sur encre et sur rouge.**

### Variantes produites

| Sortie web | Traitement | Poids |
|---|---|---|
| `paul-cutout.png` | détourée, couleur d'origine | 175 ko |
| `paul-warm.png` | chaleureuse : saturation 0,42, densité relevée, dérive papier | 173 ko |
| `paul-bw.png` | noir et blanc documentaire, contraste 1,42 | 110 ko |
| `paul-manifesto.png` | noir et blanc extrême, presque une sérigraphie | 109 ko |
| `paul-halftone.png` | trame à l'encre, cellule 7 px, grille à 45° | 105 ko |
| `paul-halftone-inverse.png` | trame couleur papier, pour les compositions en négatif | 91 ko |

La version chaleureuse **conserve la couleur**. On ne fabrique pas une sympathie absente de la photo ; on évite seulement de la détruire en passant en noir et blanc dur. Aucun lissage de peau, aucune retouche de morphologie, aucune tenue inventée.

### Plaques

Deux plaques **composées, pas générées** : aucun modèle d'image n'intervient. Elles empruntent aux références leurs **principes** (noir et blanc documentaire, un seul rouge, fil rouge à nœuds, champ de trame, blocs de document), jamais leur composition ni leur texte.

| Plaque | Sujet |
|---|---|
| `plate-decision.jpg` | une décision prise en atelier devient une règle qui tourne seule |
| `plate-repetition.jpg` | le même geste répété, et l'endroit où la boucle se referme |

Le générateur d'origine, `gen_plates.py`, appelait un modèle Gemini et déclarait le papier `#F8F5EF`, valeur **rejetée** par le canon. Il n'a pas été réutilisé tel quel.

### Assets volontairement non publiés

- Les **11 références canoniques** restent de la calibration QA. Elles montrent des personnes qui ne sont ni clients ni salariés de Parrit. Jamais servies.
- Les **photos sources** ne sont pas copiées dans `public/`. Elles vivent dans `design-source/editorial/originals/`, jamais écrasées.
- Masques alpha, exports pleine résolution et variantes intermédiaires restent dans `design-source/editorial/`.

### Reproductibilité

`design-source/editorial/recipes/build_portraits.py` · `build_plates.py`. Déterministes : graine de grain fixe, aucun appel réseau au moment de la composition, paramètres commentés à l'endroit où ils comptent.

## Concept A — Editorial Field Report

**Captures :** `qa/visual-reset-v2/concept-a-{375x812,768x1024,1024x768,1440x900}.png`

**Rôle du portrait : principal.** La page est un compte rendu de terrain, et son sujet est quelqu'un. Le portrait chaleureux occupe la moitié droite du premier écran, posé sur un champ rouge qui lui donne un sol. Sans ce champ, la silhouette claire flottait sur le papier : c'est une correction mesurée, pas une décoration.

**Parti pris :** la condensée donne l'autorité, Arpona donne la chaleur, la plaque donne la preuve. Titre en quatre lignes imposées, dont deux en rouge. Les deux fronts sont côte à côte, à poids strictement égal, chacun avec son entrée et sa sortie. **Ce que le concept cherche : donner envie de travailler avec Paul.**

## Concept B — Agent Operating System

**Captures :** `qa/visual-reset-v2/concept-b-*.png`

**Langage Hermes :** une ligne se lit toujours pareil, `entrée → sortie → propriétaire → état`. Le rouge ne signale **qu'une** chose : une décision humaine est requise. Aucun autre usage du rouge sur la page.

**Contrainte tenue : aucun tableau de bord SaaS.** Pas de carte, pas d'ombre, pas de rayon, pas de graphique, pas de badge coloré, pas de chiffre inventé. Le système est rendu en typographie de presse, comme un registre imprimé. En mobile, la chaîne bascule à la verticale sans qu'aucune donnée disparaisse.

**Parti pris :** le portrait est secondaire, en bas, en noir et blanc. L'humain est **au bout** de la chaîne, il n'est pas la promesse. Arpona n'apparaît qu'une fois, sur la citation.

## Concept C — Manifesto in Production

**Captures :** `qa/visual-reset-v2/concept-c-*.png`

**Traitement manifeste :** fond encre pleine page, portrait en trame inverse à fond perdu, débordant de 14 % sur le titre. Les trois lignes du titre ne s'alignent pas entre elles : le rythme est volontairement discontinu. Une bande rouge coupe la composition à l'horizontale.

**Parti pris :** la typographie porte presque toute la page. Le risque assumé est qu'un manifeste devienne une déclaration sans objet. La contrainte tenue est donc qu'on comprenne l'offre en cinq secondes et que le CTA reste évident malgré la radicalité : les deux fronts, les trois offres et « Parler à Paul » sont tous présents, dans le même ordre que dans A et B.

**Un défaut corrigé en cours de route :** la plaque était passée en `filter: invert(1)`, ce qui virait le rouge éditorial au **cyan**. L'inversion a été retirée : la plaque reste une impression sur papier, insérée dans une page en négatif.

## Comparaison

Les trois concepts portent **exactement les mêmes faits**, depuis un socle unique (`content.ts`). Si l'un convainc plus qu'un autre, c'est sa direction artistique, pas son contenu.

| | A · Field Report | B · Operating System | C · Manifesto |
|---|---|---|---|
| Rupture avec l'ancien site | forte | forte | maximale |
| Filiation avec la newsletter | directe | partielle, la trame manque | directe |
| Compréhension business en 5 s | l'offre est explicite | **la preuve est explicite, l'offre arrive tard** | l'offre est explicite, le ton peut détourner |
| Sympathie et confiance | **la plus haute**, le visage est là | basse, volontairement | froide, assumée |
| Singularité | haute | **la plus haute**, personne ne présente son offre ainsi | haute, mais c'est un registre déjà vu ailleurs |
| Capacité de conversion | CTA deux fois, très visible | CTA une fois, en bas | CTA une fois, très contrasté |
| Risque principal | dépend d'une seule photo | peut passer pour un document interne | peut passer pour de la posture |

**Ce que la comparaison doit trancher, au-delà du goût :** le rôle exact de chaque famille typographique. A partage impact et chaleur entre condensée et Arpona. B donne toute la preuve à Geist Mono. C confie presque tout à la condensée. **Ces trois répartitions ne peuvent pas toutes devenir canoniques.**

**Aucun concept n'est recommandé.** Ni ici, ni sur l'index du laboratoire, ni dans l'ordre d'affichage.

## Gouvernance

- **ADR-017 créé** dans `docs/design-system/DECISIONS.md`.
- **ADR-007 et ADR-008 supersédées** pour le registre éditorial, **non supprimées** : elles restent l'historique de l'erreur de source.
- **Design system non migré.** Les quinze documents restent tels quels. Deux bandeaux de correction posés : `brand/01_DESIGN_TOKENS.md` et `brand/09_GOVERNANCE.md`.
- **Homepage publique inchangée.** Le laboratoire n'importe ni `globals.css` ni `parrit-tokens.css`, ne partage aucun composant avec le site, et n'est lié depuis nulle part.
- Une seule modification hors laboratoire : `art-direction-lab` ajouté au matcher de `src/proxy.ts`, exactement comme `design-system`. Sans elle, la route est redirigée vers `/fr/`.

## Tests

Harnais : `scripts/art-direction-lab-qa.mjs`.

| Test | Résultat |
|---|---|
| Débordement horizontal, 4 largeurs × 4 pages | ✅ 0 px |
| Un seul `H1` par concept | ✅ |
| Tiret cadratin dans le texte visible | ✅ 0 |
| CTA présent sur chaque concept | ✅ |
| Barlow Condensed chargée, 800 et 900 | ✅ Chromium et WebKit |
| Accents français, 8 chaînes × 2 graisses × 3 corps × 2 moteurs | ✅ marge minimale 2,7 px |
| Compression artificielle de la chasse | ✅ aucune |
| `tsc --noEmit` | ✅ |

**Trois défauts réels trouvés par le harnais et l'œil, corrigés :** la barre de comparaison élargissait la page de 71 px à 375 px ; les attributs `width`/`height` figeaient la hauteur des images faute du reset Tailwind, déformant le portrait de B ; l'inversion de la plaque de C virait le rouge au cyan.

## Rollback

Supprimer `src/app/art-direction-lab/`, `public/fonts/barlow-condensed/`, `public/brand/editorial/`, `design-source/editorial/`, `scripts/art-direction-lab-qa.mjs`, et l'exclusion `art-direction-lab` de `src/proxy.ts`. ADR-007 et ADR-008 redeviennent la règle unique. **Le site n'a jamais changé.**

## Hors périmètre, explicitement

Migration du design system · homepage publique · autres langues · `globals.css` · `parrit-tokens.css` · composants `ds/level0` · flag `NEXT_PUBLIC_HOMEPAGE_LEVEL0_V1` · choix du concept gagnant.
