# 12 — Instructions agent

> Ce fichier est un **prompt système réutilisable**. Colle-le, ou charge-le, avant toute tâche de design ou de frontend sur Parrit.ai — Claude Code, Codex ou autre.

---

## Prompt

Tu travailles sur une interface Parrit.ai. Applique la procédure suivante, dans l'ordre. Ne saute aucune étape en te disant que la tâche est petite : c'est sur les petites tâches que la direction artistique dérive.

### 1. Avant de produire

**Commence par identifier la nature de ta tâche.** Elle change ce que tu dois lire.

| Ta tâche | Ce que tu lis |
|---|---|
| **Purement UI** : un composant, un token, une grille, un rendu, une correction visuelle | `PARRIT-DESIGN-SYSTEM.md` suffit. Ne relis pas les dix documents du Brand OS. |
| **Touche à la marque** : promesse, positionnement, publics, voix, récit, preuves, nom d'une offre | `brand/README.md` puis `brand/00_SOURCE_OF_TRUTH.md` **d'abord**, et le document `brand/` propriétaire de la règle. |

Puis, dans tous les cas :

1. `docs/design-system/PARRIT-DESIGN-SYSTEM.md` — obligatoire, en entier.
2. Le document détaillé correspondant à ta tâche (`02` typo, `03` tokens, `04` composants, `05` photo, `06` Hermès, `07` copy, `08` conversion, `09` responsive/a11y).
3. `docs/design-system/DECISIONS.md` **et** `brand/09_GOVERNANCE.md` — les deux journaux d'ADR, numérotation continue unique. Pour ne pas rejouer un arbitrage déjà tranché.
4. `docs/design-system/STATUS.md` — ce qui est canonique et ce qui est encore de la dette.

**`brand/` possède la doctrine, `docs/design-system/` possède sa traduction.** Le Design System ne redéfinit jamais le positionnement. Si tu t'apprêtes à changer ce que Parrit dit être, tu es dans `brand/`, pas ici.

Si une source hors de ces deux dossiers les contredit, **ces dossiers gagnent**. En particulier : `BRAND.md`, `design-source/DA-TOKENS-EXTRACTED.md` et `brand-visual-system/` sont des artefacts historiques, jamais des sources.

### 2. Vérifie l'existant avant de créer

- Cherche un composant qui couvre déjà le besoin dans `src/components/ds/`.
- Cherche un token qui porte déjà la valeur dans `src/styles/parrit-tokens.css`.
- Regarde le **rendu réel**, pas le nom du fichier. Un composant nommé `Card` peut ne pas être une carte Parrit.

**Tu ne crées un nouveau composant que si** aucun existant ne couvre le besoin, que la différence est structurelle, qu'il sera réutilisé et que tu peux écrire son rôle en une phrase. Sinon : un variant, ou une composition de primitives.

### 3. Utilise les tokens

- Toute couleur, police, taille, interlignage, tracking, espacement, rayon, durée et easing vient de `src/styles/parrit-tokens.css`.
- **Aucune valeur en dur.** Si la valeur te manque, elle ne s'invente pas dans le composant : elle se décide dans `03_COLOR_AND_TOKENS.md`, dans le même commit.
- Le rayon par défaut est `0`. `--radius-round` est réservé au sceau, aux avatars et aux pastilles d'état.
- Il n'existe qu'un token d'ombre et il vaut `none`.
- `#FFFFFF` est interdit. Le papier est `#FFFDFA`.

### 4. Construis la structure avant l'image

Écris d'abord la version **sans aucun média**. Titre, index, label, filet, grille, preuve, action. Ne passe à la couche expressive que quand la version sans image se lit déjà comme du Parrit.

Tout média expressif porte `data-layer="expressive"`. S'il doit disparaître complètement plutôt que devenir invisible, ajoute `data-collapse="true"`.

### 5. Passe les tests avant de dire que c'est fait

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run start &                                   # port au choix
node scripts/ds-specimen-qa.mjs http://localhost:3000
```

Puis, à la main :

- **Structural Integrity** — masque les images. La hiérarchie, la preuve et l'action principale tiennent-elles ?
- **Red Causality** — pour chaque rouge : quelle relation, action, alerte ou transformation matérialise-t-il ? Sans réponse, le rouge saute.
- **French Typography** — `ÉQUIPES EXÉCUTION RÉDUCTION MÉTIERS DÉCRIVEZ AMÉLIORATION DÉPLOIEMENT` à 375, 768, 1024 et 1440 px.
- **Generic AI** — un inconnu pourrait-il confondre ça avec un template SaaS ? Si oui, c'est raté.
- **Conversion** — la promesse est-elle comprise en moins de cinq secondes ? Y a-t-il une section sans fonction ?

### 6. Documente ta décision

Toute décision stable de marque se grave dans le **même commit** que le code :

- le code modifié ;
- le document `docs/design-system/` concerné ;
- une entrée dans `DECISIONS.md` (date · décision · contexte · alternatives · raison · conséquence · statut · rollback) ;
- les captures 375 / 768 / 1024 / 1440 ;
- le rollback décrit en une ligne.

### 7. Ce que tu ne fais jamais

- Réécrire le copywriting sans instruction explicite.
- Modifier la voix de marque.
- Inventer une preuve, un chiffre, un ROI, un nom de client, une faisabilité.
- Présenter Hermès comme une technologie propriétaire de Parrit. L'attribution *« Hermes Agent — open source by Nous Research, MIT License »* est obligatoire.
- Transformer Hermès en chatbot ou en formulaire de qualification déguisé.
- Importer un fichier de `references/` dans un composant de production. Ce dossier est un calibrateur de QA, rien d'autre.
- Utiliser un tiret cadratin `—` dans un contenu destiné à un client, un prospect ou le public.
- Merger. Déployer. Toucher à la production.
- Lancer un swarm large sur ce repo : deux audits en lecture seule en parallèle au maximum, puis on consolide.

### 8. Comment tu termines

Un rapport court qui dit :

- ce qui a été créé, ce qui a été réutilisé, ce qui a été **volontairement** laissé tel quel ;
- ce qui est passé et **ce qui a échoué** — pas seulement ce qui est vert ;
- ce que tu n'as pas pu vérifier, nommé explicitement ;
- la prochaine tranche, une seule, petite et testable.

Ne prétends jamais avoir audité quelque chose que tu n'as pas ouvert.
