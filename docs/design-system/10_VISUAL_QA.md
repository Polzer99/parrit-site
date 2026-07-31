# 10 — QA visuelle

## Outillage

```bash
npm run build && npm run start &
node scripts/ds-specimen-qa.mjs http://localhost:3000
```

Le script tourne sur 375, 768, 1024 et 1440 px, produit les captures **avec et sans média** dans `docs/design-system/qa/`, écrit `report.json` et **sort en code non nul** si un test échoue.

Il automatise trois des cinq tests. Les deux autres (Generic AI, Conversion) demandent un œil humain.

---

## 1. Structural Integrity Test — automatisé

Masquer photos, portraits, collages, illustrations, textures expressives et plaques média.

Conforme si :

- la hiérarchie reste claire ;
- l'identité reste reconnaissable comme Parrit ;
- la preuve reste visible ;
- la progression reste compréhensible ;
- l'action principale reste évidente ;
- le rythme reste fort.

**Implémentation.** Le bouton « Masquer les images » pose `data-hide-media="true"` sur `<html>`. Tout élément portant `data-layer="expressive"` passe en `visibility: hidden` (ou `display: none` avec `data-collapse="true"`).

Le script vérifie qu'il existe au moins un média balisé (sinon le test n'est pas probant), qu'aucun n'est visible après bascule, et que la structure survit (titres et actions toujours présents).

> **Si ta page devient illisible quand ce sélecteur s'applique, la page est non conforme. Ce n'est pas le test qui est trop dur.**

## 2. French Typography Test — automatisé

Chaîne obligatoire :

```
ÉQUIPES · EXÉCUTION · RÉDUCTION · MÉTIERS · DÉCRIVEZ · AMÉLIORATION · DÉPLOIEMENT
```

**Méthode.** Le script ne regarde pas les boîtes CSS : il mesure l'**encre réelle** via `TextMetrics` dans la police effectivement chargée (`actualBoundingBoxAscent` + `actualBoundingBoxDescent` sur `ÉQUIPES ÀÈÊÎÔÛ`), et compare au `line-height` calculé. Un résultat négatif signifie que l'accent de la ligne N mord sur le jambage de la ligne N−1.

**Référence mesurée le 31/07/2026** — Arpona SemiBold : l'encre occupe **1.038 em**. Le plancher d'interlignage display est donc **1.04**. Le token est à `1.05`, marge +0,38 px à 375 px et +0,58 px à 1440 px.

Vérifier aussi : aucun débordement horizontal du conteneur (contrôlé automatiquement), et le rendu sur Safari lorsque c'est possible — **la QA actuelle tourne sur Chromium seul**.

## 3. Token Discipline — automatisé

Dans le sous-arbre du design system :

- aucune `box-shadow` autre que `none` ;
- aucun rayon hors `0`, `999rem`, `50%` ;
- aucun hex périmé (`#F5F8FF`, `#AA0003`, `#161616`) ni blanc pur (`#FFFFFF`) dans un attribut de style.

Le scan porte sur les **attributs de style**, pas sur le texte : une page qui cite ces valeurs comme interdits ne doit pas se faire recaler pour ça.

## 4. Red Causality Test — humain

Pour chaque usage notable du rouge, répondre :

> « Quelle relation, action, alerte ou transformation ce rouge matérialise-t-il ? »

Sans réponse claire, le rouge saute. Une section doit fonctionner **en niveaux de gris** avant que le rouge n'y soit ajouté.

Cas légitimes : le passage input → output · un état qui demande une intervention · l'action principale · une exception · le sujet d'un titre. Cas illégitimes : un aplat de fond · un mot souligné pour l'effet · une icône décorative · une bordure de carte sans signification.

## 5. Generic AI Test — humain

Le rendu **échoue** s'il pourrait être confondu avec une startup générative générique, un template SaaS, une landing générée automatiquement, ou une marque qui utilise les clichés habituels de l'IA.

Rejets automatiques, sans discussion, si l'un de ces éléments constitue le **langage dominant** :

hero SaaS centré standard · grille de cartes arrondies identiques · verre, blur, glassmorphism · dégradé bleu, violet ou cyan · glow · robot, avatar, mascotte · faux terminal · faux dashboard décoratif · photo stock corporate · grand titre en fonte UI non éditoriale · rouge en simple surlignage · trame sans rôle de composition · arrondi supérieur à 4 px sur un composant éditorial.

**Rappel de fidélité.** Ne jamais traduire ce système par « blanc + noir + rouge ». La fidélité tient à cinq éléments simultanés : hiérarchie typographique éditoriale · composition asymétrique alignée · photographie documentaire ou détourée · rouge causal · texture imprimée maîtrisée. Une page propre mais sans ces cinq éléments n'est pas une page Parrit.

## 6. Conversion Test — humain

Pour toute page commerciale :

- promesse comprise en moins de cinq secondes ;
- cible identifiable ;
- preuve visible ;
- différenciation claire ;
- CTA évident ;
- **aucune section sans fonction**.

## 7. Contraste

```bash
PARRIT_BASE=http://localhost:3000 python3 scripts/contrast-audit.py /design-system
```

Cible : `TOTAL = 0`. **Non exécuté sur la page specimen au 31/07** — voir `STATUS.md`.

---

## Scoring

| Bloc | Points |
|---|---:|
| Structural Integrity | 25 |
| French Typography | 15 |
| Token Discipline | 15 |
| Red Causality | 15 |
| Generic AI | 15 |
| Conversion | 15 |

**Une implémentation est terminée seulement si** le score est ≥ 85/100, qu'aucun rejet automatique n'est déclenché, que les captures 375/768/1024/1440 existent, que le responsive est **recomposé** et pas seulement empilé, que la couche Hermès respecte `06_HERMES_UI.md`, et qu'aucun texte n'a été modifié sans instruction explicite.

Rapporter ce qui a échoué, pas seulement ce qui est passé.
