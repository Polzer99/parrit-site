# 09 — Gouvernance, décisions et changelog

## Versioning

Utiliser SemVer :

- patch : correction sans changement de règle ;
- minor : nouveau composant, pattern ou règle compatible ;
- major : changement de positionnement, de système visuel ou de contrat incompatible.

## États des composants

- `experimental` : autorisé derrière un flag ou dans un contenu éditorial ;
- `stable` : approuvé pour réutilisation en production ;
- `deprecated` : conservé uniquement pour migration.

## Décisions acceptées

### ADR-001 — Repository comme source de vérité

Le repository contient la source canonique. Figma la reflète. Le code l’implémente. Le site en ligne n’est pas la source.

### ADR-002 — Editorial Operating System

Parrit utilise papier blanc cassé, encre noire, un rouge signal, trame, photographie documentaire, titres éditoriaux et fil rouge explicatif. Les esthétiques IA génériques sont exclues.

### ADR-003 — Le workflow comme objet de conversion

L’objet de conversion principal est une tâche concrète, pas une offre abstraite ni une demande de démo générique.

### ADR-004 — Amélioration continue supervisée

Hermès peut observer, proposer, coder derrière un flag et analyser. Une validation reste nécessaire pour la production et les changements stables de marque.

### ADR-005 — Séparation photo / traitement graphique

Les photos sources restent propres et réutilisables. Le rouge, la trame, la typographie et les diagrammes sont des couches contrôlées en Figma ou dans le code.

### ADR-006 — Tokens Figma du 04/07 conservés, tokens Brand OS v0.2 rejetés

- Date : 2026-07-30
- Statut : accepté
- Contexte : le pack Brand OS v0.2 proposait des tokens explicitement provisoires (`#F6F2EB`, Barlow Condensed, Inter, IBM Plex Mono, rayons `xs`/`sm`/`md`, `shadow.lift`), en attente d'un audit Figma. Trois palettes coexistaient alors dans l'entreprise : celle-ci, celle validée par Paul le 04/07 sur les frames Figma (`#FFFDFA` / `#0C0C0D` / `#D1132F`, Geist), et une troisième encore déclarée dans `AGENTS.md` depuis le 23/06 (`#F5F8FF` / `#161616` / `#AA0003`), qui marquait à tort `#D1132F` comme « retired ».
- Décision : le Brand OS entre comme canon de doctrine (00, 02 à 10). Sa section 01 est réécrite avec les valeurs du 04/07, qui font loi. La palette `#F5F8FF` et le fichier `design-source/DA-TOKENS-EXTRACTED.md` sont déclarés périmés. `BRAND.md` reste une archive.
- Conséquence : aucune régression sur les artefacts déjà produits (propales, decks, PDF, carousels). Le site conserve ses tokens `:root`, déjà conformes. La dette CSS relevée en `10_SITE_AUDIT_CURRENT.md` (ombres, arrondis, hex en dur, fond photo) reste ouverte.
- Fichiers concernés : `brand/*`, `AGENTS.md`, `DESIGN-SYSTEM.md`, `BRAND.md`, `design-source/DA-TOKENS-EXTRACTED.md`, `parrit-os/docs/design-system/*`, `~/.claude/skills/design-system/`.
- Rollback : restaurer la section 01 depuis le pack d'origine et retirer les bannières de péremption.

## Numérotation des ADR : un seul compteur, deux journaux

Depuis le 31/07/2026, les ADR de Parrit suivent **une numérotation continue unique**, répartie sur deux journaux selon le propriétaire de la décision.

| Plage | Journal | Portée |
|---|---|---|
| ADR-001 à ADR-006 | **ici**, `brand/09_GOVERNANCE.md` | décisions de marque, jusqu'au 30/07 |
| ADR-007 à ADR-013 | `docs/design-system/DECISIONS.md` | décisions de design system, 31/07 |
| ADR-014 à ADR-016 | **ici**, `brand/09_GOVERNANCE.md` | décisions de marque, 31/07 |
| ADR-017 | `docs/design-system/DECISIONS.md` | registre éditorial condensé, 31/07 |
| ADR-018 et suivants | **ici** ou `docs/design-system/DECISIONS.md` | selon le document propriétaire de la règle |

Un numéro n'est jamais réutilisé. Avant d'en créer un, vérifier les deux journaux.

### Décisions du design system qui s'appliquent aux documents de marque

Ces trois ADR sont **propriété de `docs/design-system/DECISIONS.md`**. Elles ont imposé une correction dans `01_DESIGN_TOKENS.md` et `02_COMPONENTS.md`, signalée à l'endroit exact de chaque correction. Elles ne sont pas recopiées ici.

- **ADR-007** — la typographie display est **Arpona**, pas Geist. Corrige `01` et le contrat `EditorialHeadline` de `02`, qui disait « display condensed font ».
- **ADR-012** — le rouge dans un titre : **un seul segment porteur**, jamais un surlignage. Corrige `02`, qui autorisait « one red key word maximum ».
- **ADR-013** — interlignage display à **1.08**, plancher **1.04**, French Typography Test obligatoire. Corrige `02`, dont la fourchette 0.88 à 1.02 produisait une collision des capitales accentuées françaises.
- **ADR-017** — **le site adopte le registre éditorial condensé.** Corrige la portée de ADR-007 : Arpona reste la display du **registre commercial** (propales, decks, documents clients) et garde un rôle de stature dans l'éditorial, mais la display du **registre éditorial** (site, newsletter, manifestes, campagnes) devient **Barlow Condensed**, SIL OFL 1.1, auto-hébergée. ADR-007 et ADR-008 ne sont pas supprimées : elles restent l'historique de l'erreur de source. Décision réversible tant que Paul n'a pas comparé les trois concepts.

---

### ADR-014 — Positionnement transversal : la posture, pas le secteur

- Date : 2026-07-31
- Statut : accepté
- Contexte : Parrit s'adresse à des directions des opérations, des équipes marketing, des industriels, des cabinets, en France et à l'international. Aucun secteur, aucune taille et aucune géographie ne les relie. L'ICP était donc illisible, ce qui poussait à se décrire comme une agence généraliste, exactement ce que Parrit n'est pas.
- Décision : le point commun est une **posture**, reconnaissable à six comportements : vouloir prendre de l'avance · accepter de prototyper · chercher un avantage opératoire · vouloir mettre en production · préférer l'action mesurée à l'attente · accepter d'améliorer le système après son premier déploiement.
- Distinction obligatoire : la **relation** explique comment la confiance se crée, comment l'opportunité entre dans le pipeline et pourquoi une personne accepte d'écouter Parrit. La **posture** explique à qui Parrit parle, qui reconnaît la valeur et qui est prêt à agir. Il faut les deux : la relation sans la posture donne un interlocuteur bienveillant qui n'achètera jamais ; la posture sans la relation donne un bon prospect qu'on n'arrive pas à joindre.
- Formulation canonique : *l'ICP de Parrit n'est pas uniquement une fonction ou un secteur. C'est une relation de confiance avec une personne qui veut prendre de l'avance.*
- Conséquence : c'est un **filtre autant qu'une cible**, et c'est ce qui rend le discours transposable à l'international sans réécriture. La notion de « généraliste innovateur » de `VISION.md §1`, avec sa caution externe (Dan Priest, PwC, juin 2026), est conservée **comme insight, pas comme label public** : le mot « généraliste » a été rejeté le 23/06. Parrit est transversal dans les secteurs, spécifique dans la posture et dans la capacité de déploiement.
- Fichiers concernés : `00_SOURCE_OF_TRUTH.md`.
- Rollback : retirer la section. L'ICP redevient illisible.

### ADR-015 — Le Brand OS est versionné

- Date : 2026-07-31
- Statut : accepté
- Contexte : les 11 documents du Brand OS, écrits le 30/07, **n'avaient jamais été commités**. `git ls-files brand/` renvoyait zéro. Ils vivaient en fichiers non suivis dans un worktree, donc sans aucune sauvegarde : un `git clean`, un changement de branche mal maîtrisé ou une panne de disque les effaçait. C'est le canon de marque de toute l'entreprise.
- Décision : import dans le repository sur la branche `ds/canon-v1`, **sans aucune écriture dans le worktree source**. Copie conforme octet pour octet, dates de modification préservées.
- Conséquence : le partage d'autorité devient explicite. Le **Brand OS possède la doctrine** : identité, vision, positionnement, principes, voix, récit, publics, promesse, preuves, décisions de marque. Le **Design System possède la traduction** visuelle et technique : tokens, composants, grille, typographie, photographie, UI Hermès, patterns de conversion, QA, implémentation. Le repository reste la source de vérité versionnée, et le site en ligne une sortie.
- Rollback : supprimer `brand/` de la branche. Les fichiers d'origine restent intacts dans le worktree de Paul, qui n'a jamais été écrit.

### ADR-016 — fileKey Figma renseigné et autorité partagée

- Date : 2026-07-31
- Statut : accepté
- Contexte : `07_FIGMA_SYNC.md` déclarait `file_key: pending` alors que le fichier était identifié depuis le 16/07. Sans clé, sa propre règle d'audit rendait tout travail Figma non auditable.
- Décision : `J8hieoaq5XwOxqtQJbiP0A`, fichier `Direction-artistique`. Le **repository** est la source canonique des tokens et des règles ; **Figma** est la référence des compositions explicitement validées, les 6 frames `Parrit Template`.
- Conséquence : audit effectif du 31/07 : **3 variables de couleur** (`Noire #0c0c0d`, `Rouge #d1132f`, `Blanc #fffdfa`, conformes au canon), zéro variable de spacing ou de typographie, zéro composant publié, zéro style, aucune bibliothèque Parrit, aucun Code Connect. Les seules bibliothèques attachées sont Material 3, Simple Design System et les kits Apple. La création des composants Figma et du Code Connect est une **tranche future**, pas un prérequis. Inverser le sens d'autorité serait une régression.
- Fichiers concernés : `07_FIGMA_SYNC.md`, `01_DESIGN_TOKENS.md` (référence morte `design-source/figma-template/` signalée), `docs/design-system/11_FIGMA_CODE_MAPPING.md`.
- Rollback : sans objet, c'est un constat vérifiable.

---

## Procédure pour toute décision stable

Le même pull request doit :

1. modifier le code ;
2. modifier le document canonique concerné ;
3. ajouter une entrée ci-dessous ;
4. fournir tests et captures ;
5. préciser le rollback.

## Journal des décisions

Ajouter sous cette forme :

```md
### ADR-XXX — Titre

- Date : YYYY-MM-DD
- Statut : proposé | accepté | remplacé | rejeté
- Contexte :
- Décision :
- Conséquence :
- Fichiers concernés :
- Rollback :
```

## Changelog

### 0.2.0 — 2026-07-30

- Pack converti en Markdown uniquement pour Claude Code.
- Ajout d’un `CLAUDE.md` concis et persistant.
- Ajout d’un prompt de lancement.
- Conversion des tokens en contrat Markdown avec CSS copiable.
- Ajout d’un blueprint canonique de homepage.
- Renforcement de la règle : aucun audit Figma sans fichier et nodes effectivement lus.
- Maintien d’une amélioration Hermès supervisée.

### 0.2.1 — 2026-07-30

- Pack éclaté en 11 documents dans `brand/`, avec un index `README.md` et une chaîne de précédence explicite.
- ADR-006 : tokens Figma du 04/07 conservés, tokens provisoires du pack rejetés.
- Section 01 réécrite (couleurs, Geist, rayon 0, aucune ombre, grain papier 3 couches, assets de marque).
- `AGENTS.md` corrigé : il déclarait encore la palette périmée `#F5F8FF` et interdisait le rouge canon.
- `BRAND.md` et `design-source/DA-TOKENS-EXTRACTED.md` marqués périmés.
- Dette d'implémentation CSS chiffrée et consignée en `10_SITE_AUDIT_CURRENT.md`.

### En attente pour 0.3.0

- audit du fichier Figma exact ;
- inventaire de la stack et des hardcodes du repository ;
- validation des polices réelles ;
- validation WCAG des états ;
- ajout de preuves clients et métriques vérifiées ;
- définition de la première expérience Hermès en production.
