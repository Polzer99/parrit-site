# PARRIT DESIGN SYSTEM — source de vérité

**Version :** 1.0.0 · **Statut :** canonique · **Propriétaire :** Paul Larmaraud
**Dernière mise à jour :** 31 juillet 2026

> Ce fichier est conçu pour être **chargé en entier par un agent** avant toute tâche de design ou de frontend.
> Il porte les décisions. Les documents `01` à `12` portent le détail.
> Si tu n'as le budget que pour un seul fichier, c'est celui-ci.

## Ce document dépend du Brand OS

**`brand/` possède la doctrine. Ce document en est la traduction visuelle et technique.**

Le Design System **ne redéfinit pas le positionnement**. Identité, vision, positionnement, principes, voix, récit, publics, promesse, preuves et décisions de marque vivent dans `brand/`, et nulle part ailleurs.

- **Avant tout changement de marque** (promesse, positionnement, publics, voix, preuves), lire `brand/README.md` puis `brand/00_SOURCE_OF_TRUTH.md`. Un changement de marque ne se décide pas ici.
- **Pour une tâche purement UI** (un composant, un token, une grille, une correction de rendu), ce fichier suffit. Inutile de relire les dix documents historiques du Brand OS.

Chaîne de précédence complète :

```
brand/README.md  >  brand/00_SOURCE_OF_TRUTH.md  >  brand/01_DESIGN_TOKENS.md
  >  brand/02–06 (doctrine)  >  brand/07–09 (Figma, implémentation, ADR)
  >  PARRIT-DESIGN-SYSTEM.md  >  01–12  >  tokens et composants du code  >  pages
```

Hors de ce repository, `REGLES-DOR.md` puis `VISION.md` priment. Le site en ligne est une **sortie** du système, jamais la source.

**Règle de résolution :** en cas de contradiction, la décision la plus récente consignée dans un ADR prévaut. Les ADR suivent une **numérotation continue unique** sur deux journaux : `brand/09_GOVERNANCE.md` (marque) et `DECISIONS.md` (design system). Une implémentation ne peut jamais modifier le canon en silence.

---

## 1. Identité

Parrit.ai est un **partenaire opératoire** : on conçoit, on intègre et on déploie des agents et des systèmes internes dans de vrais workflows, puis on transmet le système aux équipes du client.

Parrit ne vend pas une intelligence abstraite. Parrit part d'une tâche réelle, définit l'input, l'output, les accès, le propriétaire humain et les conditions de contrôle, puis met en production.

**Promesse.** FR : *Passez d'une IA qui parle à des agents qui exécutent.* — EN : *Move from AI that talks to agents that execute.*

**Publics.** Dirigeants · directions des opérations · DSI · data et transformation · responsables métier quand un workflow concret est identifié.

**Ennemis.** Le théâtre de l'IA · les POC qui ne sortent jamais · les chatbots génériques · les dashboards sans action · les slides de conseil sans déploiement · les systèmes autonomes sans propriétaire ni trace.

**Ce que le site ne doit jamais évoquer :** une agence générique, un cabinet de conseil, un SaaS interchangeable, un template Webflow, une page générée automatiquement, une marque qui ne tient que par des images spectaculaires.

**Ce qu'il doit évoquer :** l'exécution, le terrain, la précision, la vitesse maîtrisée, la construction de systèmes, l'intelligence appliquée aux opérations, une entreprise incarnée par ses opérateurs.

---

## 2. Les deux couches — la règle qui gouverne tout le reste

### Couche structurelle — OBLIGATOIRE

Typographie · grille · hiérarchie · espacements · filets · index · labels · données · preuve · causalité visuelle · états · rouge fonctionnel · tension plein/vide · rythme vertical · structure éditoriale.

### Couche expressive — FACULTATIVE

Portraits · photographies · collages · plaques éditoriales · textures · scènes opératoires · illustrations narratives.

### Règle absolue

> **Masque toutes les images de la page. Si la hiérarchie, le rythme, la tension, la preuve et l'action principale disparaissent, la page n'est pas conforme.**

La couche expressive enrichit. Elle ne sauve jamais une structure faible. Le **hero canonique par défaut est sans image** ; une image ne s'ajoute que si elle apporte une incarnation, une preuve, une démonstration ou un contexte que la structure ne peut pas transmettre.

Ce test est outillé : voir `10_VISUAL_QA.md` et la page specimen `/design-system` (bouton « Masquer les images »).

---

## 3. Tokens fondamentaux

Valeurs **vérifiées dans Figma** le 31/07/2026 (fichier `Direction-artistique`, `fileKey J8hieoaq5XwOxqtQJbiP0A`, variables `Noire #0c0c0d` · `Rouge #d1132f` · `Blanc #fffdfa`).

Détail complet : `03_COLOR_AND_TOKENS.md`. Implémentation : `src/styles/parrit-tokens.css`.

### Couleurs

| Token sémantique | Valeur | Rôle |
|---|---:|---|
| `--color-paper-default` | `#FFFDFA` | fond de page et de cartes, crème chaud |
| `--color-paper-alt` | `#F0F0F0` | fond de section derrière une carte |
| `--color-ink-default` | `#0C0C0D` | titres, texte fort, surfaces sombres |
| `--color-ink-muted` | `#6E7079` | corps mono atténué, métadonnées |
| `--color-ink-faint` | `#8987A1` | labels d'index, mentions faibles |
| `--color-ink-inverse` | `#FFFDFA` | texte sur fond sombre |
| `--color-signal-critical` | `#D1132F` | LE rouge Parrit : signal, action, causalité, état |
| `--color-signal-tint` | `rgba(209,19,47,.10)` | fond de badge |
| `--color-line-hairline` | `#D0D8D7` | filets et bordures 1px |
| `--color-accent-warm` | `#C67C60` | terracotta, RARE, liseré de coche uniquement |

Il n'y a **pas de blanc pur** dans le système. `#FFFFFF` est interdit comme fond ou comme encre : le papier est `#FFFDFA`.

### Typographie

| Rôle | Famille | Usage |
|---|---|---|
| `--font-display` | **Arpona** (Floodfonts), fallback Geist | titres, héros, chiffres monumentaux |
| `--font-ui` | Geist | navigation, contrôles, textes longs |
| `--font-mono` | Geist Mono | corps descriptif, labels, index, boutons, données, trace |

Arpona est **auto-hébergée** (`public/fonts/arpona/*.woff2`, 4 graisses, accents FR/PT complets) : utilisable en PDF, deck et page chiffrée. Graisse de titrage retenue par Paul : **SemiBold 600**.

Signature Arpona : les points des `i`/`j` et le point final sont des **losanges**. C'est une feature, pas un bug — le losange rouge rappelle le sceau.

Tracking display : `-0.04em`. Labels mono : UPPERCASE, `0.12em`, jamais plus d'une ligne.

**Interlignage display : `1.08`, jamais sous `1.04`.** Voir §6 (test français). C'est une contrainte de collision d'accents mesurée, pas une préférence esthétique.

### Géométrie, ombre, matière

- **Rayon par défaut `0`.** Angles à 90 degrés. `--radius-round` (999rem) est réservé au sceau, aux avatars et aux pastilles d'état. Aucun rayon intermédiaire n'existe.
- **Aucune ombre portée, nulle part.** `--shadow-none: none` est le seul token d'ombre.
- **Aucun dégradé décoratif.**
- **Grain papier 3 couches** = la seule texture de fond autorisée (grain sombre `multiply` .06 · grain blanc `screen` .05 · lueur ambiante radiale). Le halftone est une couche *explicative* appliquée aux images, il ne se cumule pas avec le grain sur une même surface.

### Espacement, conteneurs, mouvement

Base 8 px : `--space-1` … `--space-12` (0.25rem → 12rem). Le whitespace est massif ; la hiérarchie repose sur l'espace, la typo et les filets, jamais sur l'ombre.

Conteneurs : `--container-text` 46rem · `--container-content` 80rem · `--container-wide` 90rem.

Mouvement : `--motion-fast` 120ms · `--motion-base` 220ms · `--motion-slow` 420ms · `--ease-standard` `cubic-bezier(.2,.8,.2,1)`. Le mouvement explique une direction, un état ou un passage. Pas de boucle décorative, pas de glow au survol. Respecter `prefers-reduced-motion`.

---

## 4. Le rouge

Le rouge Parrit n'est pas une couleur de remplissage. **Il indique quelque chose** : un passage, une relation, une alerte, une action, une progression, une transformation, une causalité, une preuve, un état actif.

Toute section doit fonctionner **en niveaux de gris** avant que le rouge n'y soit ajouté.

**Red Causality Test** — pour chaque usage notable du rouge, répondre : *« quelle relation, action, alerte ou transformation ce rouge matérialise-t-il ? »* Sans réponse claire, le rouge saute.

### Le rouge dans un titre — règle tranchée le 31/07/2026

Un segment de titre peut passer en rouge **uniquement** s'il porte l'un de ces cinq rôles :

**une cause · un problème · une transformation · un résultat · le sujet principal.**

Quatre contraintes, toutes obligatoires :

1. **Un seul segment rouge par titre.** Deux segments rouges annulent la hiérarchie qu'ils prétendent créer.
2. **Aucun mot rouge décoratif.** Le rouge ne souligne jamais un mot choisi pour le rythme ou pour « casser » une ligne.
3. **Le titre doit rester compréhensible entièrement en noir.** Si retirer le rouge change le sens, l'information reposait sur la couleur seule : c'est un défaut d'accessibilité autant qu'un défaut de marque.
4. **Chaque usage passe le Red Causality Test** ci-dessus, comme n'importe quel autre rouge.

Cette règle clôt la tension entre le canon Figma, qui met un segment de H1 en rouge, et l'interdiction générale du rouge en surlignage de mot. Les deux tiennent : ce qui est interdit, c'est le surlignage ; ce qui est autorisé, c'est le segment porteur.

---

## 5. Interdits

### Visuels

Dégradés bleu-violet de startup tech · néons, cyberpunk, hologrammes · robots humanoïdes, avatars, mascottes · cerveaux lumineux, circuits électroniques génériques · blobs 3D · glassmorphism, verre, blur comme langage · glow · accumulation de cartes arrondies identiques · faux terminal, faux dashboard décoratif · photos de stock corporate · icônes décoratives sans rôle · trame sans rôle de composition · visage de mannequin à la place de Paul · tout rendu qu'on confondrait avec une génération automatique.

### Structurants

Réduire la DA à « blanc + noir + rouge » · utiliser une image générée comme substitut au layout · poser une photo dans une colonne et considérer le travail terminé · **importer les références de calibration en production** · saturer toutes les sections de trame et de collage · un grand titre dans une fonte UI non éditoriale.

### Une page Parrit n'est pas « propre »

La fidélité tient à cinq éléments **simultanés** : hiérarchie typographique éditoriale radicale · composition asymétrique alignée · photographie documentaire ou détourée · rouge causal · texture imprimée maîtrisée. Une page propre mais dépourvue de ces cinq éléments n'est pas une page Parrit.

---

## 6. Test typographique français — non négociable

Le système doit encaisser les capitales accentuées. Chaîne de test obligatoire :

```
ÉQUIPES · EXÉCUTION · RÉDUCTION · MÉTIERS · DÉCRIVEZ · AMÉLIORATION · DÉPLOIEMENT
```

Aucun accent capital ne doit être coupé, entrer en collision avec la ligne du dessus, sortir de son conteneur ni casser le rythme vertical.

**Cause connue (défaut A1) :** un `line-height` display serré « pour l'effet » (0.82–0.86) fait collider É/À/È. C'est pour cela que l'interlignage display est plafonné à `0.95` minimum. Un interlignage serré n'est jamais une raison suffisante.

À tester sur desktop, tablette, mobile, Chromium et Safari.

---

## 7. Photographie

Trois familles. Détail : `05_PHOTOGRAPHY_AND_MEDIA.md`.

- **A — Fondateur et opérateurs.** Paul doit paraître sympathique, accessible, concentré, ambitieux, élégant sans être figé. **Opérateur, pas influenceur ; dirigeant de terrain, pas mannequin.** Lumière naturelle ou cinématographique réaliste, grain discret, contraste éditorial, sourire léger et sincère, regard vivant, espace pour les titres. Règle d'or Parrit : **vraie photo de Paul + costume**, jamais un visage 100 % IA.
- **B — Scènes opératoires.** Travail sur un système, analyse, coordination, atelier, architecture de workflow, échange client, décision, production en équipe.
- **C — Plaques éditoriales.** Collages, schémas, cartes d'agents, tension humain/machine, flux, trajectoires, boucles, preuves, avant/après.

**`references/` est un outil de calibration et de QA, exclusivement.** Ces fichiers ne sont jamais servis, jamais copiés, jamais importés dans un composant de production. Le rendu doit tenir si le dossier disparaît.

Les photos sources restent propres et réutilisables ; le rouge, la trame et la typographie sont des couches ajoutées en code ou en Figma.

---

## 8. Hermès

**Attribution obligatoire, partout où Hermès est nommé :**

> Hermes Agent — open source by Nous Research, MIT License.

Parrit conçoit les systèmes, adapte les agents, les intègre, les déploie, les connecte aux opérations, construit les interfaces et organise les boucles de contrôle. **Ne jamais présenter Hermès comme une technologie propriétaire de Parrit.** Formulations interdites : « notre technologie Hermes », « Hermes développé par Parrit ».

Hermès se représente par ses **actions, traces, décisions, entrées, sorties, connexions, états, validations humaines et boucles d'amélioration** — jamais comme un chatbot décoratif ni comme un collègue humain. Il rend visibles son périmètre, ses limites et son niveau de confiance.

États canoniques : `agent status` · `action card` · `trace` · `decision` · `signal` · `source` · `human review` · `success` · `failure` · `waiting` · `blocked` · `improvement proposed` · `improvement accepted` · `improvement rejected`.

Détail : `06_HERMES_UI.md`. Boucle d'amélioration du site : `HERMES-CONTINUOUS-IMPROVEMENT.md`.

---

## 9. Composants canoniques

Contrats complets : `04_COMPONENTS.md`.

**Niveau 0 — figé, fonctionne sans aucune photographie :**

`HeroLevel0` · `ProofRailLevel0` · `TestimonialShiftLevel0` · `HermesTraceLevel0` · `CTASectionLevel0`

Primitives : `SectionHeader` · `Label` · `IndexMark` · `Badge` · `Metric` · `Divider` · `Button` · `Link`.

Couche expressive : `MediaPlate` · `EditorialFigure` · `HeroWithMedia`.

Un composant ne peut **jamais** introduire une couleur, une police, un rayon, un pas d'espacement ou une durée absents de `03_COLOR_AND_TOKENS.md`, ni poser une ombre.

**On ne crée un composant que si** aucun existant ne couvre le besoin, que la différence est structurelle, qu'il sera réutilisé et que son rôle est documentable. Sinon : un variant, ou une composition.

---

## 10. Contenu

Détail : `07_CONTENT_AND_COPY.md`.

Phrases courtes. Une idée par ligne. Langage concret. Verbes d'action. Preuves. Situations de terrain. Première personne quand Paul s'exprime.

**Dire :** ce que l'agent reçoit · ce qu'il fait · ce qu'il renvoie · ce qui reste contrôlé par l'humain · ce qui change concrètement · le temps économisé · les erreurs évitées · le système déployé · la prochaine étape.

**Bannir :** « révolutionner » · « transformer votre business grâce à l'IA » · « libérer le potentiel » · « solution innovante » · « futur du travail » · « puissance de l'intelligence artificielle » · « automatisation intelligente de bout en bout » · le jargon corpo · les adjectifs creux · les transitions artificielles.

**Le tiret cadratin `—` est interdit** dans tout contenu qui sort chez un client, un prospect ou le public. C'est le tell IA n°1.

**Jamais inventer** une preuve, un ROI, une métrique, un nom de client, une faisabilité. Jamais décrire un agent comme un employé magique.

---

## 11. Conversion

Détail : `08_CONVERSION_PATTERNS.md`.

En moins de cinq secondes, le visiteur doit comprendre : **ce que fait Parrit · pour qui · ce qui est réellement déployé · pourquoi Parrit est différent · quelle action effectuer ensuite.**

L'objet de conversion est un **workflow concret**, pas une offre abstraite ni une demande de démo générique. Le visiteur ne choisit pas d'abord une offre : il décrit d'abord un workflow douloureux.

Action principale : tester un cas avec Hermès. Action secondaire : parler à Paul.

Aucune section sans fonction.

---

## 12. Tests de conformité

Checklist exploitable : `10_VISUAL_QA.md`.

| Test | Critère de succès |
|---|---|
| **Structural Integrity** | images masquées → hiérarchie, identité, preuve, progression et action principale intactes |
| **Red Causality** | chaque rouge notable répond à « quelle relation matérialise-t-il ? » |
| **French Typography** | les 7 mots accentués tiennent à 375, 768, 1024, 1440 px, Chromium et Safari |
| **Generic AI** | le rendu ne peut pas être confondu avec un template SaaS ou une landing générée |
| **Conversion** | promesse < 5 s, cible identifiable, preuve visible, différenciation, CTA évident |
| **Contraste** | `scripts/contrast-audit.py` → TOTAL = 0 |

Une implémentation est terminée seulement si le score QA ≥ 85/100, qu'aucun rejet automatique n'est déclenché, que les captures 375/768/1024/1440 existent, que le responsive est **recomposé** et pas seulement empilé, et qu'aucun texte n'a été modifié sans instruction explicite.

---

## 13. Documents détaillés

| Fichier | Contenu |
|---|---|
| `01_BRAND_FOUNDATIONS.md` | mission, positionnement, personnalité, tensions, concept visuel |
| `02_TYPOGRAPHY_AND_GRID.md` | familles, échelle, grilles, accents français, asymétrie |
| `03_COLOR_AND_TOKENS.md` | tokens techniques complets, format d'export, synchronisation |
| `04_COMPONENTS.md` | contrats de composants, niveau 0, états |
| `05_PHOTOGRAPHY_AND_MEDIA.md` | trois familles, traitement, règle `references/` |
| `06_HERMES_UI.md` | langage visuel Hermès, états, attribution |
| `07_CONTENT_AND_COPY.md` | voix, mots bannis, patterns éditoriaux |
| `08_CONVERSION_PATTERNS.md` | patterns de conversion, blueprint homepage |
| `09_RESPONSIVE_AND_ACCESSIBILITY.md` | breakpoints, recomposition, a11y, clavier, motion |
| `10_VISUAL_QA.md` | checklist de conformité et scoring |
| `11_FIGMA_CODE_MAPPING.md` | état réel du Figma, écarts, sens de synchronisation |
| `12_AGENT_INSTRUCTIONS.md` | prompt système réutilisable par Claude Code / Codex |
| `HERMES-CONTINUOUS-IMPROVEMENT.md` | architecture du site auto-améliorant supervisé |
| `DECISIONS.md` · `STATUS.md` · `CHANGELOG.md` | journal, état, versions |
