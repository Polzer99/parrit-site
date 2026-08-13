# STATUS · PARRIT PERSONAL LANDINGS V2

Dernière mise à jour : 12/08/2026, après le lancement de la voie parallèle.

**Fichier Figma cible :** `Zs3WuVBkAT9Iq6S9c3XsYG`
**Règle de sérialisation :** un seul intégrateur écrit dans Figma, l'orchestrateur.
Aucun sous-agent n'a d'accès en écriture au fichier. Les cinq agents de la voie
parallèle écrivent chacun UN fichier Markdown distinct, sans recouvrement.

---

## 1. Le graphe

```
G0 Recovery Audit
 │
 ├──► G1 Funnel ──────────┐
 ├──► G2 Refs Paul ───────┤
 ├──► G3 Refs Maxime ─────┼──► M1 Merge Decisions
 ├──► G4 Proof Inventory ─┤
 └──► G5 Design System ───┘
                            │
                            ├──► G6 Copy Paul ──┐
                            └──► G7 Copy Maxime ┴──► M2 Copy Merge
                                                       │
                                    ┌──────────────────┤
                                    │  ECRITURES FIGMA SERIALISEES
                                    ▼
                              G8 Moodboards
                              G9 Funnel
                              G10 Shared System
                                    │
                              ┌─────┴─────┐
                              ▼           ▼
                          G11 Paul    G12 Maxime
                              └─────┬─────┘
                                    ▼
                                G13 Mobile
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
              G14 QA convers. G15 QA marque   G16 QA visuelle
```

**Ce qui est réellement parallélisé :** G1 à G5 (cinq agents simultanés), puis
G6 et G7 (deux agents), puis G14 et G15 (deux relecteurs indépendants).

**Ce qui est strictement sériel :** toutes les écritures Figma, G8 à G13 et les
corrections de G16. Un seul écrivain, jamais deux.

---

## 2. État des nœuds

| Nœud | Statut | Artefact |
|---|---|---|
| G0 Recovery Audit | **done** | `01-RECOVERY-AUDIT.md` |
| G1 Conversion Architecture | **running** | `02-FUNNEL.md` |
| G2 Visual Research Paul | **running** | `03-REFERENCES-PAUL.md` |
| G3 Visual Research Maxime | **running** | `04-REFERENCES-MAXIME.md` |
| G4 Proof Inventory | **running** | `05-PROOF-INVENTORY.md` |
| G5 Shared Design System Plan | **running** | `06-DESIGN-SYSTEM-PLAN.md` |
| M1 Merge Gate 1 | blocked | `07-MERGE-DECISIONS.md` |
| G6 Copy Paul | blocked | `08-COPY-PAUL.md` |
| G7 Copy Maxime | blocked | `09-COPY-MAXIME.md` |
| M2 Merge Gate 2 | blocked | `10-COPY-MERGE.md` |
| G8 à G13 Figma | blocked | pages Figma |
| G14 à G16 QA | blocked | `11` à `13` |

---

## 3. IDs Figma créés ou modifiés

**Aucune page existante n'a été modifiée ni supprimée.**

### Pages préexistantes, intactes

| ID | Nom | Enfants |
|---|---|---:|
| `0:1` | `00 — START HERE` | 1 (frame `3:2`, texte du brief) |
| `1:2` | `01 — INSPIRATIONS` | 0 |
| `1:3` | `02 — PAUL LANDING` | 0 |
| `1:4` | `03 — MAXIME LANDING` | 0 |
| `1:5` | `04 — PARRIT.AI` | 0 |
| `1:6` | `05 — CONTENT + PROOF` | 0 |

### Pages créées par la V2

| ID | Nom |
|---|---|
| `17:2` | `V2 — 00 RECOVERY` |
| `17:3` | `V2 — 01 VISUAL REFERENCES` |
| `17:4` | `V2 — 02 FUNNEL` |
| `17:5` | `V2 — 03 SHARED SYSTEM` |
| `17:6` | `V2 — 04 PAUL LANDING` |
| `17:7` | `V2 — 05 MAXIME LANDING` |
| `17:8` | `V2 — 06 MOBILE` |
| `17:9` | `V2 — 07 QA` |

Ces huit pages ont été créées avant M1, volontairement et pour une seule
raison : **prouver que l'accès en écriture Figma fonctionne avant d'engager
toute la tranche.** La commande exige d'arrêter la tranche si l'écriture est
impossible. Ce sont des conteneurs vides, pas de la production.

---

## 4. Décisions prises

1. **La destination est Figma, le code redevient un outil.** La V1 avait fait
   du code sa destination. Les captures de références produites en V1 sont
   réutilisées comme matière, la sortie web n'est plus un livrable.
2. **Les six pages existantes ne sont pas touchées.** La V2 vit sur huit pages
   séparées, préfixées `V2 —`.
3. **Geist et Geist Mono sont utilisables dans Figma**, vérifié par
   `listAvailableFontsAsync`. Le canon typographique tient, sans substitut.
   Attention : le style est `SemiBold` en un mot pour Geist.
4. **Le prix descend en section offre.** 2 500 € HT, valeur du brief Figma, et
   plus aucun second ancrage.
5. **Parrit.ai est hors périmètre.** Deux landings personnelles, rien d'autre.

---

## 5. Erreurs et causes

| Erreur | Cause | Correction |
|---|---|---|
| « Le fichier Figma ne contient qu'une page », affirmé en V1 | `get_metadata` sans `nodeId` ne renvoie que la première page, et son rendu a été lu comme un inventaire | Interroger `figma.root.children` par `use_figma`. Six pages, pas une |
| Le prix affiché dans le hero en V1 | Décision prise pour la lisibilité de l'offre, sans funnel pour arbitrer | Le funnel de G1 fixe la position du prix, après preuve et méthode |
| Captures de références supprimées en cours de route | Trois références retirées sur arbitrage, images effacées | G3 doit déclarer les captures manquantes plutôt que décrire une image qu'il n'a pas vue |

---

## 6. Prochains nœuds autorisés

Aucun tant que G1 à G5 ne sont pas tous `done`. M1 est le prochain gate, et il
est bloquant : aucune production Figma ne commence avant lui.
