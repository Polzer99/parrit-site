# Journal de décisions — design system Parrit.ai

Format : date · décision · contexte · alternatives · raison · conséquence · statut.

Les décisions antérieures à ADR-007 vivent dans `brand/09_GOVERNANCE.md` (ADR-001 à ADR-006) et y restent. Elles ne sont pas recopiées ici.

---

## ADR-007 — La typographie de titrage est Arpona, pas Geist

- **Date :** 2026-07-31
- **Statut :** accepté
- **Contexte :** `brand/01_DESIGN_TOKENS.md`, écrit le 30/07, déclare « Display / titres : `Geist` » et présente cette valeur comme verrouillée par Paul le 04/07. C'est une régression documentaire. Le 16/07, après lecture directe du nœud H1 `1:225` du Figma `Direction-artistique` (`fileKey J8hieoaq5XwOxqtQJbiP0A`), le titrage a été identifié comme **Arpona** (fonderie Floodfonts), la famille a été livrée par Smoooth, convertie OTF→woff2, auto-hébergée et mise en production par le commit `1da446d`. La production sert Arpona depuis cette date : vérifié le 31/07 sur `https://parrit.ai/_next/static/chunks/02e3-ue_oi0y9.css` (14 références, `--font-heading:"Arpona", var(--font-body)`).
- **Alternatives :** (a) suivre `brand/01` et repasser les titres en Geist — casse la DA livrée par l'agence et déjà payée ; (b) laisser les deux documents se contredire — c'est l'état actuel, qui produit une régression à chaque session.
- **Raison :** le Figma et la production sont d'accord entre eux ; c'est le document qui a dérivé.
- **Conséquence :** `--type-display-primary: "Arpona", "Geist", …`. Geist devient le **fallback gracieux** et la famille UI, pas la police de titrage. `brand/01_DESIGN_TOKENS.md` doit être corrigé dans le même mouvement. Aucun impact sur les artefacts déjà livrés en Arpona.
- **Rollback :** repointer `--type-display-primary` sur Geist.

---

## ADR-008 — Doctrine v1.1 adoptée, valeurs v1.1 rejetées

- **Date :** 2026-07-31
- **Statut :** accepté
- **Contexte :** `brand-visual-system/v1.1/` (déposé le 31/07) apporte une doctrine forte et nouvelle : les deux couches structurelle/expressive, le Structural Integrity Test, `references/` réduit au rôle de calibrateur QA, la grammaire générative, l'attribution Hermès. Mais son `01_TOKENS` propose une **troisième palette** (`#F8F5EF` papier, `#161616` encre, `#D0202E` rouge) et une **troisième typographie** (Barlow Condensed en display), plus des ombres d'impression et des rayons jusqu'à 4 px.
- **Alternatives :** (a) tout adopter — introduit une quatrième palette dans une entreprise qui en a déjà trois de trop et contredit les variables Figma ; (b) tout rejeter — perd la meilleure doctrine produite jusqu'ici.
- **Raison :** la doctrine v1.1 répond à un vrai problème (des pages qui ne tiennent que par leurs images). Ses valeurs, elles, ne sont adossées à rien : aucune police fournie, aucune source Figma. Les variables Figma lues le 31/07 (`Noire #0c0c0d` · `Rouge #d1132f` · `Blanc #fffdfa`) tranchent.
- **Conséquence :** la doctrine v1.1 entre dans `PARRIT-DESIGN-SYSTEM.md` §2, §5, §7 et §12. Ses tokens sont écartés. `brand-visual-system/` est conservé comme artefact d'entrée, jamais comme source.
- **Rollback :** documenté ; aucune valeur v1.1 n'ayant été implémentée, il n'y a rien à défaire.

---

## ADR-009 — Interlignage display porté à 1.05, sur mesure

- **Date :** 2026-07-31
- **Statut :** accepté
- **Contexte :** le défaut « A1 » traînait depuis le 31/07 matin : les capitales accentuées françaises (É, À, È) collident avec la ligne du dessus quand l'interlignage display est serré. Il avait été corrigé au jugé à `1.0`, valeur déclarée « hors fourchette du système, à arbitrer ».
- **Mesure :** `scripts/ds-specimen-qa.mjs` mesure l'encre réelle des glyphes via `TextMetrics` dans la police effectivement chargée. Sur Arpona SemiBold, la chaîne `ÉQUIPES ÀÈÊÎÔÛ` occupe **1.038 em** (accent du É en haut, jambage du Q en bas). À `0.95`, il manque 2,82 px à 32 px ; à `1.0`, il manque encore. Le plancher réel est **1.04**.
- **Alternatives :** (a) garder 0.9 comme le Figma — le Figma est dessiné en anglais (« Your teams prototype their own AI agents »), sans capitale accentuée ; (b) réduire la taille des titres — traite le symptôme.
- **Raison :** une valeur mesurée bat une valeur choisie. Le site est d'abord francophone.
- **Conséquence :** `--type-leading-display: 1.05` (marge mesurée : +0,38 px à 375 px, +0,58 px à 1440 px). `--type-leading-display-tight: 0.9` reste disponible **uniquement** pour une chaîne sans capitale accentuée, et seulement si la QA passe sur cette chaîne. Le rendu des titres est légèrement plus aéré que la maquette Figma : c'est assumé et documenté.
- **Rollback :** repasser `--type-leading-display` à `0.95` et accepter la collision.
- **Suite :** la marge à 1.05 s'est révélée trop fine. Arbitrée par ADR-013.

---

## ADR-010 — `docs/design-system/` devient le point d'entrée canonique

- **Date :** 2026-07-31
- **Statut :** accepté
- **Contexte :** au 31/07, la doctrine visuelle Parrit vit dans au moins cinq endroits : `brand/` (11 docs), `brand-visual-system/` (deux versions), `DESIGN-SYSTEM.md`, `BRAND.md`, `design-source/DA-TOKENS-EXTRACTED.md`, plus `AGENTS.md` et la skill `design-system`. Trois d'entre eux portent des palettes contradictoires.
- **Décision :** `docs/design-system/PARRIT-DESIGN-SYSTEM.md` devient la source de vérité unique et le seul fichier qu'un agent doit charger avant d'agir. `brand/` reste la **doctrine détaillée** dont il hérite, et n'est pas supprimé. `brand-visual-system/`, `BRAND.md` et `design-source/DA-TOKENS-EXTRACTED.md` restent des artefacts historiques, jamais des sources.
- **Raison :** on ne supprime pas l'historique, mais il ne doit rester qu'une porte d'entrée.
- **Conséquence :** `AGENTS.md` doit pointer ici. La chaîne de précédence est réécrite. **Non fait dans cette tranche** — voir `STATUS.md`.
- **Rollback :** supprimer `docs/design-system/` ; rien d'autre n'a été modifié.

---

## ADR-011 — Les tokens n'écrasent pas `globals.css` dans cette tranche

- **Date :** 2026-07-31
- **Statut :** accepté
- **Contexte :** `src/styles/parrit-tokens.css` introduit des noms sémantiques (`--color-signal-critical`) là où `globals.css` a des alias historiques (`--red`, `--accent`, `--parrit-red`, `--accent-hover`, `--red-hover` : cinq noms pour une valeur).
- **Décision :** le nouveau fichier est **additif**. Il n'écrase aucun alias existant et n'est chargé que par la page specimen. Aucune page publique ne change.
- **Raison :** remplacer les alias touche 59 fichiers et change visiblement la production. Ce n'est pas un nettoyage mécanique, c'est une migration qui se valide avec des captures avant/après.
- **Conséquence :** la dette d'aliasing reste ouverte, chiffrée dans `STATUS.md`.
- **Rollback :** supprimer l'import dans `src/app/design-system/layout.tsx`.

---

## ADR-012 — Le rouge dans un titre : autorisé sur un segment porteur, interdit en surlignage

- **Date :** 2026-07-31
- **Statut :** accepté (arbitrage Paul)
- **Contexte :** deux sources canoniques s'opposaient. Le canon Figma met un segment du H1 en rouge (« AI agents » dans la frame `Parrit Template 1`). `brand-visual-system/CLAUDE.md` liste « le rouge utilisé comme simple surlignage de mot » parmi les rejets automatiques. Sans arbitrage, chaque page rejouait le débat, et le mot rouge devenait un tic de composition.
- **Décision :** un segment de titre peut passer en rouge **uniquement** s'il porte une **cause**, un **problème**, une **transformation**, un **résultat** ou le **sujet principal**. Quatre contraintes cumulatives : un seul segment rouge par titre · aucun mot rouge décoratif · le titre reste pleinement compréhensible lu en noir · l'usage passe le Red Causality Test.
- **Alternatives :** (a) interdire tout rouge dans les titres, ce qui contredit le canon dessiné et payé ; (b) laisser libre, ce qui produit exactement le surlignage décoratif que le système rejette.
- **Raison :** les deux sources disaient vrai sur des objets différents. Ce qui est interdit, c'est le **surlignage** ; ce qui est autorisé, c'est le **segment porteur**. La distinction est opérationnelle, pas rhétorique : elle se teste.
- **Conséquence :** le troisième contrôle (« le titre garde son sens en noir ») est aussi un contrôle d'accessibilité : il interdit qu'une information repose sur la seule couleur. Inscrit dans `PARRIT-DESIGN-SYSTEM.md` §4, `03_COLOR_AND_TOKENS.md`, `07_CONTENT_AND_COPY.md`, `10_VISUAL_QA.md`.
- **Rollback :** retirer le sous-test de `10_VISUAL_QA.md` et revenir à la règle provisoire « le segment rouge doit être le sujet ».

---

## ADR-013 — Interlignage display porté de 1.05 à 1.08

- **Date :** 2026-07-31
- **Statut :** accepté (arbitrage Paul), remplace la valeur retenue par ADR-009
- **Contexte :** ADR-009 avait fixé `--type-leading-display` à `1.05` sur la base d'une mesure d'encre : la chaîne `ÉQUIPES ÀÈÊÎÔÛ` occupe **1.038 em** en Arpona SemiBold. À `1.05`, la QA passait aux quatre largeurs, mais la marge mesurée était de **0,38 px à 375 px** et **0,58 px à 1440 px**.
- **Décision :** la valeur canonique devient **`1.08`**.
- **Raison :** `1.05` était techniquement valide et pratiquement fragile. **Une marge inférieure au pixel n'est pas une marge.** Elle tombe au premier changement de graisse, au premier repli sur la fonte de substitution, au premier moteur de rendu qui arrondit autrement. Un test qui passe à 0,38 px près ne prouve pas que le système tient, il prouve qu'il n'a pas encore cassé.
- **Alternatives :** (a) garder `1.05` et vivre avec un seuil non tenable ; (b) réduire la taille des titres, ce qui traite le symptôme et abîme la silhouette éditoriale.
- **Conséquence :** marge portée à environ **1,3 px à 375 px** et **4,6 px à 1440 px**. Les titres sont légèrement plus aérés que la maquette Figma, dessinée à `0.9` **en anglais**, sans capitale accentuée. Écart assumé et documenté. Plancher absolu inchangé : **jamais sous 1.04**.
- **Rollback :** repasser le token à `1.05`. La QA continue de passer, la fragilité revient.

---

## ADR-014 · ADR-015 · ADR-016 — décisions de marque, propriété de `brand/09_GOVERNANCE.md`

Ces trois décisions ont été prises le 31/07/2026 dans la tranche `BRAND-CANON-V1`. Elles portent sur la **marque**, pas sur le design system : leur document propriétaire est `brand/09_GOVERNANCE.md`, et elles n'y sont pas recopiées ici.

- **ADR-014** — positionnement transversal : le point commun de tous les interlocuteurs de Parrit est une **posture**, pas un secteur. Distinction obligatoire entre la **relation** (comment la confiance se crée, comment l'opportunité entre) et la **posture** (à qui Parrit parle, qui est prêt à agir).
- **ADR-015** — le Brand OS est versionné. Il n'avait jamais été commité. Le partage d'autorité devient explicite : `brand/` possède la doctrine, `docs/design-system/` possède sa traduction visuelle et technique.
- **ADR-016** — `fileKey` Figma `J8hieoaq5XwOxqtQJbiP0A` renseigné, autorité partagée entre repository (tokens et règles) et Figma (compositions validées).

---

## ADR-017 — Le site adopte le registre éditorial condensé

- **Date :** 2026-07-31
- **Statut :** accepté (arbitrage Paul), **supersède ADR-007 et ADR-008 pour le registre éditorial**. ADR-007 et ADR-008 ne sont pas supprimées : elles restent l'historique de l'erreur de source.
- **Contexte :** les onze images de référence canoniques (`brand-visual-system/references/canonical/`) et les templates commerciaux Figma (`1:208`, `1:255`) ne partagent aucun langage visuel. Les références éditoriales sont construites sur une **grotesque condensée lourde en capitales**, de la photographie noir et blanc détourée, des champs de trame rouge et un fil rouge de causalité. Les templates commerciaux sont en Arpona et Geist Mono sur papier crème, avec des placeholders gris.

  **Le design system du 31/07 a été dérivé du second.** ADR-007 a déclaré la display en Arpona, ADR-008 a rejeté Barlow Condensed comme « non sourcé ». Ces deux décisions étaient correctes **pour le registre commercial**, et fausses pour le site. C'est la cause racine de `HOMEPAGE-LEVEL0-V1` : reproduire fidèlement un template commercial ne pouvait produire qu'une version nettoyée de l'ancien site.

- **Décision :**
  1. **Deux registres coexistent légitimement**, et le document doit toujours dire lequel il habite.
     - **Registre éditorial** : site, newsletter, articles, manifestes, pages Hermes, campagnes, contenus de prise de conscience.
     - **Registre commercial** : propales, decks personnalisés, documents clients formels, supports de rendez-vous.
  2. **Le site appartient désormais au registre éditorial.** Il n'est plus dérivé des templates commerciaux Figma.
  3. **La display du registre éditorial est Barlow Condensed** (Black 900 pour les titres-manifestes, ExtraBold 800 quand Black devient trop massif), auto-hébergée, **SIL Open Font License 1.1**, licence conservée dans `public/fonts/barlow-condensed/OFL.txt`. Aucun chargement Google Fonts au runtime.
  4. **Arpona n'est pas remplacée.** Elle reste la display du registre commercial, et garde dans l'éditorial le rôle de **stature** : citations, textes de posture, registre institutionnel. Geist tient la lecture, Geist Mono tient les index, métadonnées, traces et états Hermes.
  5. **Aucune compression artificielle de la chasse.** Barlow Condensed est dessinée condensée : ni `transform: scaleX()`, ni `font-stretch`. Vérifié par `scripts/art-direction-lab-qa.mjs`.
  6. La palette n'est pas touchée : `#FFFDFA` · `#0C0C0D` · `#D1132F` restent le canon.

- **Réversibilité :** la décision est **réversible après comparaison des trois concepts**. Elle vit pour l'instant dans un laboratoire isolé (`src/app/art-direction-lab/`), qui n'importe ni `globals.css` ni `parrit-tokens.css`. Aucune migration du code public n'a été engagée. Supprimer le dossier et retirer `art-direction-lab` du matcher de `src/proxy.ts` annule la totalité de la tranche.

- **Ce que les trois concepts doivent trancher :** le **rôle exact de chaque famille**. A donne l'impact à la condensée et la chaleur à Arpona. B donne l'impact à la condensée et toute la preuve à Geist Mono, Arpona réduite à une seule citation. C confie presque toute la page à la condensée, Arpona ne tenant que le verdict. Ces trois répartitions ne peuvent pas toutes être canoniques.

- **Interlignage :** `0.94` pour la condensée en capitales, mesuré sur l'encre réelle et non sur la boîte de ligne. À `0.92`, la marge sous « EXÉCUTION » en 800/48px tombe à **1,8 px**, sous le seuil que ADR-013 a posé après l'incident du `1.05`. Le plancher de ADR-013 (`1.04`) reste valable **pour Arpona** : ce sont deux fontes, deux métriques, deux valeurs.

- **Conséquence :** le design system n'est **pas** migré dans cette tranche. Les quinze documents restent tels quels et deviennent partiellement caducs sur le seul point de la display éditoriale. Ils seront réécrits à partir du concept retenu, ou d'une combinaison explicitement validée par Paul.

- **Rollback :** supprimer `src/app/art-direction-lab/`, `public/fonts/barlow-condensed/`, `public/brand/editorial/`, `design-source/editorial/`, et l'exclusion `art-direction-lab` dans `src/proxy.ts`. ADR-007 et ADR-008 redeviennent la règle unique. Le site n'a jamais changé.

---

---

## ADR-018 — Concept D poli devient la source visuelle de vérité

- **Date :** 2026-08-01
- **Statut :** accepté (validation Paul). **Clôt l'exploration de directions artistiques ouverte par ADR-017.**
- **Contexte :** trois directions ont été comparées (`PARRIT-VISUAL-RESET-V2`), puis alignées sur un message unique (`PARRIT-COPY-RESET-V1`), puis synthétisées en un concept D (`PARRIT-TECH-TRUST-V1`) et finies (`PARRIT-TECH-TRUST-POLISH-V2`). Continuer à explorer produirait des variantes, plus des décisions.
- **Décision :** **Concept D poli est la source visuelle de vérité de Parrit.ai**, sous le statut `APPROVED PENDING FINAL COPY`. Il n'y aura pas de concept E. A, B et C restent dans le laboratoire comme historique de décision, pas comme options.
- **Ce qui est figé :** la direction Editorial Operating System · Barlow Condensed pour les grands titres · Geist Mono pour les traces et métadonnées · la palette encre, papier et rouge · la grille de 12 colonnes · les filets · le HumanGate · ExecutionTrace · SystemTopology · ProofLedger et sa colonne limite · le registre de mission · la méthode montrant le transfert de responsabilité · HermesActivity · la photographie documentaire non générative · la recomposition mobile · les règles de mouvement et de reduced motion.
- **Ce qui n'est pas figé :** les retours à la ligne, la quantité exacte de rouge dans les titres, les hauteurs dépendantes du texte, la densité des blocs éditoriaux, l'ordre final des sections commerciales. Ces points bougeront avec la copy définitive et ne sont pas des écarts au canon.
- **Point d'entrée de la copy :** `src/app/art-direction-lab/concept-d/copy.ts`, seul et unique. Il porte le contrat `CopyContract`, qui décrit une forme et non un contenu. Une livraison incomplète ne compile pas. **Aucune copy n'est écrite ni réécrite tant que Paul n'a pas livré le wording validé.**
- **Garde-fou :** `scripts/concept-d-qa.mjs` contient un test de gel du canon. Il échoue si un composant canonique disparaît, si la palette, la grille ou les fontes changent, si un rayon ou une ombre apparaît, si l'attribution Hermes disparaît, ou si un portrait brandé est câblé à la place de la photographie réelle. Il ne juge pas le texte.
- **Conséquence :** le design system n'est **toujours pas migré**, et la homepage publique n'est **pas** touchée. Les quinze documents seront réécrits à partir de Concept D une fois la copy définitive reçue. Jusque-là, `docs/design-system/VISUAL-SOURCE-OF-TRUTH.md` fait autorité sur la question visuelle.
- **Rollback :** rétrograder le statut dans `VISUAL-SOURCE-OF-TRUTH.md` et rouvrir la comparaison. Rien n'est en production, le coût est nul.

---

**Numérotation.** Les ADR de Parrit suivent un **compteur unique** réparti sur deux journaux : ADR-001 à 006 dans `brand/09_GOVERNANCE.md`, ADR-007 à 013 ici, ADR-014 et suivants dans le journal du document propriétaire de la règle. Un numéro n'est jamais réutilisé : vérifier les deux journaux avant d'en créer un.
