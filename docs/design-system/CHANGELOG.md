# Changelog — design system Parrit.ai

SemVer. `patch` : correction sans changement de règle. `minor` : nouveau composant, pattern ou règle compatible. `major` : changement de positionnement, de système visuel ou de contrat incompatible.

---

## 1.0.0 — 2026-07-31

Première version canonique. Consolidation de cinq sources contradictoires en une seule.

### Ajouté

- `docs/design-system/` — 16 documents, dont `PARRIT-DESIGN-SYSTEM.md` comme source de vérité unique et compacte.
- `src/styles/parrit-tokens.css` — tokens sémantiques, source unique, additive.
- `src/components/ds/primitives.tsx` — 8 primitives structurelles.
- `src/components/ds/level0.tsx` — les 5 composants de niveau 0, les 8 états Hermès, `MediaPlate`.
- `src/app/design-system/` — page specimen noindex avec le bouton « Masquer les images ».
- `scripts/ds-specimen-qa.mjs` — QA automatisée sur 4 viewports : test typographique français par mesure d'encre, Structural Integrity Test, Token Discipline, captures avec et sans média.
- `HERMES-CONTINUOUS-IMPROVEMENT.md` — architecture du site auto-améliorant, avec deux verrous humains non automatisables.

### Décidé

- **ADR-007** — le titrage est **Arpona**, pas Geist. `brand/01` avait régressé sur une décision du 16/07 déjà en production.
- **ADR-008** — la doctrine v1.1 (deux couches, Structural Integrity Test, `references/` en QA seule) est adoptée ; ses tokens (`#F8F5EF`, Barlow Condensed, ombres d'impression, rayons 4 px) sont écartés.
- **ADR-009** — interlignage display porté à `1.05`, **sur mesure** : l'encre des capitales accentuées occupe 1.038 em en Arpona SemiBold. Clôt le défaut « A1 ».
- **ADR-010** — `docs/design-system/` devient le point d'entrée canonique. `brand/` reste la doctrine détaillée, rien n'est supprimé.
- **ADR-011** — les nouveaux tokens sont additifs et ne touchent pas `globals.css`. Aucune page publique ne change.

### Corrigé

- L'audit de dette de `brand/10_SITE_AUDIT_CURRENT.md` avait été mesuré sur une branche **72 commits derrière `origin/main`**. Chiffres réels de production consignés dans `STATUS.md` : la dette de rayons est déjà résorbée (53 `border-radius: 0`), il reste 4 ombres et 6 hex périmés, pas 30 et 61.
- `brand/07_FIGMA_SYNC.md` déclarait `file_key: pending` : le `fileKey` est `J8hieoaq5XwOxqtQJbiP0A`.

### Constaté, non corrigé

- **Il n'existe aucun design system Parrit dans Figma** : 3 variables de couleur, zéro composant, zéro style, zéro bibliothèque Parrit.
- `design-source/figma-template/` est cité comme « vérité pixel » par `brand/01` et **n'existe pas** dans le repository.
- La production sert un `body` avec une photo de paysage et un dégradé `#F5F8FF` périmé.
- QA sur Chromium seul ; `contrast-audit.py` non exécuté sur la page specimen.

### Non fait, volontairement

Aucune page publique modifiée. Aucun merge, aucun déploiement. `AGENTS.md` non repointé vers ce dossier — c'est la tranche suivante.

---

## 1.1.0 — 2026-07-31

Tranche `HOMEPAGE-LEVEL0-V1`. Premier écran commercial de `/fr`, derrière feature flag éteint par défaut.

### Ajouté

- `src/lib/flags.ts` — premier mécanisme de feature flag du repository. Variable d'environnement lue au build, garde `lang !== "fr"` dans la fonction elle-même. Le rendu statique des quatre langues est préservé.
- `src/components/HomeLevel0.tsx` — composition du variant. Ne redéfinit aucun style, compose les composants canoniques.
- `scripts/homepage-level0-qa.mjs` — harnais dédié : intégrité structurelle, rouge causal, hiérarchie de CTA, typographie française, responsive, accessibilité, analytics.
- `docs/design-system/HOMEPAGE-LEVEL0-V1.md` — document de tranche.
- 5 événements dans `src/lib/analytics.ts`, sur le système PostHog existant. Aucune nouvelle base, aucune donnée personnelle.
- Un bloc scopé dans `globals.css` : fond structurel du variant et surcharge de composition du rythme vertical.

### Modifié

- `HeroLevel0` : `secondaryLink` (lien texte discret, distinct de `secondaryCta`), `primaryCtaProps`, `secondaryLinkProps`. Optionnels, comportement par défaut inchangé.
- `ProofRailLevel0` : `index`, `label`, `title`, `lede`, `itemProps` surchargeables, avec les valeurs du specimen par défaut.
- `HomeDeux` : prop `hideHero`, par défaut `false`.

### Corrigé

- `ProofRailLevel0` rendait le propriétaire et le périmètre dans un `Label`, `nowrap` par contrat. Une phrase dans un `Label` débordait horizontalement à 375 px. Le libellé reste un `Label`, la valeur devient du texte courant qui se replie.
- **Erreur d'audit corrigée dans `STATUS.md`** : la photo de fond n'est pas servie « sur toutes les pages ». `/fr` et `/en` ont `background-image: none`. Elle est active uniquement sur les pages portant `.home-template`.
- **Erreur de harnais** : la première version du QA remplaçait `window.posthog`, ce qui cassait le chargeur PostHog et tuait le sous-arbre React à l'hydratation. Quatre faux échecs. Le harnais bloque désormais le script distant et lit la file du stub natif.

### Non fait, volontairement

Aucune page publique exposée. Le reste de la homepage, la navigation, le footer et les trois autres langues sont intacts.

---

## 1.2.0 — 2026-07-31

Tranche `HOMEPAGE-LEVEL0-SEAM-V1`. Jonction entre le variant Level0 et la homepage historique, derrière le même flag.

### Ajouté

- `scripts/homepage-seam-qa.mjs` — harnais en trois temps (instantané `on`, instantané `off`, comparaison), parce que les deux états du flag demandent deux builds. Couvre la continuité de couture, la numérotation, l'intégrité du contenu historique, l'isolation du flag, la non-régression analytics et la garde de hauteur mobile.
- `docs/design-system/HOMEPAGE-LEVEL0-SEAM-V1.md` — document de tranche.
- `NUMBERED_SECTIONS` et `sectionIndex()` dans `HomeDeux` : source unique locale pour les index de section, décalée par `hideHero`.

### Modifié

- `.home-level0-inner` : grille alignée sur celle de la page (1120 px, gouttière 24 px) au lieu de 1280 px et 64 px.
- Filets du rail de preuve tirés jusqu'au bord de l'élément, pour rejoindre la largeur du filet des sections historiques sans déplacer le texte.
- `ProofRailLevel0` sur la homepage porte l'index `01` au lieu d'être non numéroté.
- Respiration de sortie du variant réduite, jonction à 16 px avant le filet.

### Retiré

- Le fond propre du variant : il laisse voir celui de la page, une seule surface peinte.
- La couche `.parrit-grain` du variant : le grain appartient à la page, pas à une section.

### Corrigé

- **Doublon de numérotation.** La première section historique reprenait à « 01 » juste après le rail, qui restait non numéroté pour l'éviter.
- **Deux faux positifs de harnais.** Le premier comparait la classe d'animation `is-in`, dépendante de la position de scroll. Le second comparait le fond propre des éléments (`#FFFDFA` déclaré contre `transparent` hérité) au lieu du fond effectif ; il a aussi révélé le vrai défaut, le variant n'ayant pas à peindre son fond.

### Non fait, volontairement

Copy, offres, navigation, footer, autres langues, ordre des sections, couleur de l'eyebrow historique, layout interne de la section terrain, dette de hauteur mobile.
