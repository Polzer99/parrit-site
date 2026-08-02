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

### ADR-007 — Trois registres de positionnement

Le positionnement se lit sur trois registres, avec des rythmes d'évolution distincts. `00A_POSITIONING_INTERNAL` est `living` et évolue avec les missions, les systèmes et les apprentissages. `00B_POSITIONING_EXTERNAL` est `approved` en v1.0.0 : c'est le contrat stable avec le marché, il n'évolue que sur décision explicite de Paul, sans date de fin fixée. `00C_COMMERCIAL_NARRATIVE` est `adaptable-within-guardrails` et approfondit `00B` en rendez-vous sans jamais le contredire.

`00_SOURCE_OF_TRUTH` devient l'index des trois registres et porte les quatre hiérarchies de précédence. Ses blocs de mission, positionnement, publics, ennemi et promesse du 30/07 sont conservés en annexe historique.

Conséquences : une évolution interne ne modifie pas automatiquement le public · une formulation commerciale ne devient pas une phrase canonique · les agents doivent identifier leur registre avant de produire.

### ADR-008 — Aucun prix public, aucun prix commercial générique

PUBLIC et COMMERCIAL générique ne contiennent aucun prix. INTERNAL les autorise. Un contexte commercial nominatif les autorise uniquement dans un devis ou une proposition dédiée, transmis volontairement.

L'autorisation générique « à partir de X € » qui figurait dans `AGENTS.md` est supprimée. Les bundles public et commercial échouent s'ils contiennent un symbole monétaire, un montant associé à une devise ou une règle tarifaire interne. Le prototype commercial gratuit sélectif reste `INTERNAL STRICT` et n'apparaît jamais dans un bundle commercial générique.

### ADR-009 — Documents retirés de toute position canonique

`TRUTH.md`, `MATURITE-SOT.md`, `BRAND.md`, `DESIGN-SYSTEM.md` et `design-source/DA-TOKENS-EXTRACTED.md` passent en `status: historical`. Leur contenu est conservé sans réécriture et exclu des trois bundles.

### ADR-010 — Deux triades, jamais concurrentes

Les capacités de Parrit se lisent Transformer, Construire, Déployer, et structurent `00B`. La maturité du client se lit Commencer, Transformer, Piloter, et sert au diagnostic dans `00C`. Les deux ne sont jamais présentées comme des architectures concurrentes.

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

### 1.0.0 — 2026-08-02

- Positionnement séparé en trois registres : `00A` interne `living`, `00B` externe `approved` v1.0.0, `00C` commercial `adaptable-within-guardrails`.
- `00_SOURCE_OF_TRUTH` transformé en index canonique, avec quatre hiérarchies de précédence.
- `positioning-os/` importé dans le dépôt, 22 documents, aucune réécriture.
- `brand/` versionné.
- `TRUTH.md` et `MATURITE-SOT.md` marqués `historical`.
- `03_CONTENT_SYSTEM` requalifié en guide d'exécution subordonné.
- ADR-007 à ADR-010.
