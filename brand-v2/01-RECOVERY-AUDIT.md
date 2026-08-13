# G0 · RECOVERY AUDIT

**Nœud :** G0 · **Mode :** série · **Owner :** orchestrateur · **Date :** 12/08/2026

Ce document classe l'existant avant reconstruction. Il ne produit ni copy, ni
design, ni preuve. Il dit ce qu'on garde, ce qu'on jette, ce qu'on refait.

---

## 1. Ce qui a été inspecté

| Source | État constaté |
|---|---|
| Figma `Zs3WuVBkAT9Iq6S9c3XsYG` | **6 pages**, dont 5 vides. Voir §2 |
| `parrit-site/src/app/brand-lab/**` | 17 fichiers, 4 routes, un core CSS + 3 thèmes |
| `parrit-site/BRAND-LAB-V1.md` | note de synthèse V1 |
| `public/brand-lab/refs/*.jpg` | 24 captures de références sur disque |
| `parrit-os/canon/PUBLICATION-GATE-ET-PAQUET-EDITORIAL.md` | 453 lignes, 6 règles P1 à P6 |
| `parrit-os/canon/CASE-STUDIES-EVIDENCE-MATRIX.md` | V3, 13 réalisations `R-*` |

### Correction d'une affirmation fausse de la tranche précédente

Lors de la V1, l'inspection Figma avait été faite avec `get_metadata` **sans
`nodeId`**, qui ne renvoie que la première page. J'en avais conclu, et déclaré à
Paul, que *« le fichier ne contient qu'une seule page »*. **C'est faux.**

Une sonde en lecture par `use_figma` sur `figma.root.children` renvoie **six
pages**. Le squelette de travail existait, il était simplement vide.

**Leçon de méthode, applicable au-delà de ce dossier :** `get_metadata` sans
`nodeId` liste les pages de haut niveau mais son rendu ne doit pas être lu comme
un inventaire complet du document. Pour un inventaire, interroger
`figma.root.children` directement.

---

## 2. État réel du fichier Figma, avant écriture V2

| ID | Page | Enfants | Contenu |
|---|---|---:|---|
| `0:1` | `00 — START HERE` | 1 | frame `3:2` « Brand brief — start here », **texte seul**, 6 blocs de doctrine |
| `1:2` | `01 — INSPIRATIONS` | 0 | vide |
| `1:3` | `02 — PAUL LANDING` | 0 | vide |
| `1:4` | `03 — MAXIME LANDING` | 0 | vide |
| `1:5` | `04 — PARRIT.AI` | 0 | vide |
| `1:6` | `05 — CONTENT + PROOF` | 0 | vide |

**Aucune de ces pages n'est modifiée ni supprimée par la V2.** Huit pages
`V2 — ...` ont été créées à côté (IDs `17:2` à `17:9`). La V1 Figma est donc
intégralement préservée, et le brief de `00 — START HERE` reste la référence
amont.

### Ce que le brief Figma impose, et qui est repris tel quel

- Prix d'entrée : **2 500 € HT** pour 10 heures de « Build With You ».
- Règle de design : *« Do not make three skins of the same website. Keep a
  shared core and change the emotional temperature. »*
- Paul = operator, raison, 0 vers 1. Maxime = guide, cœur, pédagogie.
- Étalon UX : Wispr Flow, compréhension immédiate, une action évidente.

---

## 3. Les cinq griefs, vérifiés un par un

Chaque grief de la commande a été vérifié sur pièce avant d'être accepté.

| # | Grief | Vérifié | Constat |
|---|---|---|---|
| 1 | Le livrable est devenu un localhost | **fondé** | Le livrable V1 est une app Next locale, puis une preview Vercel derrière SSO. Aucune écriture Figma n'a eu lieu. Le §23 du brief V1 disait de commencer par le code, il ne disait pas de finir là |
| 2 | Le prix avant la valeur | **fondé** | Sur `/brand-lab/paul`, le prix est dans le premier viewport, au-dessus de la preuve et de la méthode. C'était même revendiqué comme une décision |
| 3 | Pas de funnel de conversion | **fondé** | Les pages sont des expositions de marque enchaînées, pas une progression mentale. Aucun document ne décrivait le parcours |
| 4 | Trop de texte, trop de complexité | **fondé** | Paul : 9 sections, environ 1 500 mots. Maxime : 9 sections. La cible V2 est 8 sections et 750 mots |
| 5 | Identités diluées dans une UI générique | **partiellement fondé** | Les températures existent et se voient (fond encre contre papier chaud). Mais la structure est identique section par section, ce qui produit deux variantes d'un même gabarit plutôt que deux personnalités |

---

## 4. KEEP

Ce qui a coûté du travail, qui est vrai, et qui entre en V2.

| Élément | Où | Pourquoi on garde |
|---|---|---|
| **24 captures de références** | `public/brand-lab/refs/*.jpg` | Desktop et mobile, réelles, datées. Elles alimentent directement G8. Elles évitent de refaire une passe de capture |
| **Le socle de tokens** | `brand/01_DESIGN_TOKENS.md` + `lab.css` | Crème `#FFFDFA`, encre `#0C0C0D`, rouge `#D1132F`, Geist et Geist Mono, angles à zéro, zéro ombre, base 8. **Geist et Geist Mono sont disponibles dans Figma**, vérifié |
| **La règle un core, trois températures** | `lab.css` | C'est la règle du Figma lui-même. Elle survit, réduite à deux expressions |
| **L'inventaire de preuves anonymisées** | `_lib/proof.ts` | R-10, R-02, R-09, R-07 avec leurs niveaux réels. À revalider par G4 contre la porte de publication, pas à réutiliser tel quel |
| **Les emplacements de preuve manquante** | `_lib/proof.ts` | La discipline `PROOF SLOT` est bonne et reste obligatoire |
| **Le vocabulaire des 10 heures** | `_lib/offer.ts` | Comprendre, choisir, construire, utiliser, continuer. Sera réduit à 3 étapes visibles |
| **Les lectures TAKE et AVOID** | `_lib/inspirations.ts` | Le travail d'interprétation est fait. G2 et G3 le réduisent à 4 références par personne |
| **La correction du rouge unique** | `lab.css` | Décision du 12/08 : une seule famille de rouge pour la maison. Elle tient en V2 |

## 5. REMOVE

Ce qui disparaît de la V2, et ne doit pas y revenir.

| Élément | Raison |
|---|---|
| **Le prix dans le hero, sur les deux pages** | Grief 2. Le prix descend en section offre, après preuve et méthode |
| **La page `/brand-lab/parrit`** | Hors périmètre V2 explicite. Le travail reste en V1, il n'est pas détruit |
| **La page `/brand-lab/inspirations` comme livrable** | Le moodboard devient une page Figma. Les captures survivent, la page web non |
| **Les 9 sections par page** | Plafond V2 : 8 sections majeures |
| **Le bandeau des variantes de titre** | On ne présente plus trois directions faibles. Une seule décision, documentée |
| **Les deux ancrages de prix** | `2 499 €` disparaît. Le Figma dit 2 500 € HT, c'est arrêté |
| **La section « comment Paul pense » à six critères** | Trop dense pour une landing de conversion. Le discernement se montre par un exemple, pas par une grille |
| **La section contenu de Maxime** | Trois titres inventés comme directions de sujet. Rien de publié ne les soutient. Une macro-conversion unique interdit d'ouvrir une deuxième porte |
| **La sortie localhost et la preview SSO comme livrable** | Le livrable est Figma. Le code redevient un outil, pas une destination |

## 6. REBUILD

Ce qui doit être refait, et pas amélioré à la marge.

| Élément | Ce qui change |
|---|---|
| **Le funnel** | N'existait pas. G1 le construit : perdu, reconnaissance, exemples, preuve, méthode, autonomie, offre, conversion |
| **Les deux structures de page** | Elles étaient parallèles section par section. Elles doivent diverger là où la personnalité l'exige, et se rejoindre sur le funnel |
| **Le copy** | Réécrit sous contrainte dure : 12 mots de titre, 35 de sous-titre, 70 mots par paragraphe, 750 mots au total |
| **Le Design System** | Passe d'un CSS d'exploration à 11 composants Figma nommés, en Auto Layout, réellement instanciés |
| **Le mobile** | Repensé, pas dérivé. Ordre, densité et longueur des titres décidés pour 390 px |
| **La preuve** | Repassée par la porte de publication P1 à P6, pas seulement par la matrice |

---

## 7. Ce qui n'est pas touché

- Le site public `parrit.ai` et tout `src/app/` hors `brand-lab`.
- Les 6 pages Figma existantes.
- La branche `brand-lab-v1` et son historique. Elle reste la sauvegarde de la V1.
- Les documents du canon, lus en seule lecture.

## 8. Gate G0

| Critère | Résultat |
|---|---|
| Le fichier Figma a été inspecté, pages listées avec IDs | **PASS**, 6 pages, tableau §2 |
| Aucune page existante supprimée ni écrasée | **PASS**, 8 pages V2 créées à côté |
| Les bonnes décisions précédentes sont identifiées | **PASS**, §4 |
| Les preuves ne sont pas reconstruites ni inventées | **PASS**, G4 les revalide en source primaire |

**G0 : PASS.** Les nœuds G1 à G5 sont autorisés.
