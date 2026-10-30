# Hero : l'histoire « Une réclamation qualité arrive »

Décision de Paul, le 30/10/2026 (« Go » sur la proposition de couverture des cibles) : la home doit aussi parler à l'industrie. Dans le hero en trois plans, la quatrième histoire « La réunion se termine » est **remplacée** par « Une réclamation qualité arrive ». Elle utilise des cases qui existent déjà ; seuls trois liens sont ajoutés au schéma.

Rien d'autre ne change : titre, sous-titre, bouton, citation, trois autres histoires, durées, mise en page, couleurs.

## 1. Données (`src/system/ontology-hero-data.ts`)

Ajouter trois liens, sans toucher aux liens existants :

- dans `REL` : `["recl", "commande"]`, donc l'identifiant `rel_recl_commande` ;
- dans `UP` : `["procedures", "recl"]`, donc `up_procedures_recl` ;
- dans `TOP` : `["recl", "rech"]`, donc `top_recl_rech`.

Remplacer la quatrième entrée de `HERO_STORIES` par :

```ts
{ title: "Une réclamation qualité arrive", d: "mails", o1: "recl", o2: "commande", rel: "rel_recl_commande", r: "procedures", rl: "up_procedures_recl", out: "rech", top: "top_recl_rech", result: "Cause identifiée", act: "erp", al: "up_erp_commande", verb: "Vous décidez", side: "left", steps: ["un client signale un défaut", "le système le relie à sa commande", "un agent applique vos procédures qualité", "vous décidez, l'ERP lance la correction"] }
```

Le parcours allumé est donc : E-mails, puis Réclamation, puis Commande ; ensuite Procédures, puis Recherche documentaire avec la carte « Cause identifiée » ; enfin ERP en action. Les liens `up_mails_recl` et `up_erp_commande` existent déjà.

Si la géométrie des liens est dérivée de ces listes, les nouveaux tracés apparaissent d'eux-mêmes dans les deux groupes SVG (ordinateur et compact). Sinon, les ajouter dans les deux.

## 2. Traductions (`src/system/single-page-copy.ts`)

Retirer les quatre chaînes propres à l'ancienne histoire (« La réunion se termine », « la réunion se termine », « le système relie actions et équipe », « un agent suit vos procédures », « vous validez, l'agenda est à jour », « Qui fait quoi, pour quand »), **seulement si plus rien ne les utilise**. Ajouter :

| FR | EN |
|---|---|
| Une réclamation qualité arrive | A quality complaint comes in |
| un client signale un défaut | a client reports a defect |
| le système le relie à sa commande | the system links it to the order |
| un agent applique vos procédures qualité | an agent applies your quality procedures |
| vous décidez, l'ERP lance la correction | you decide, the ERP starts the fix |
| Cause identifiée | Cause identified |

Aucun tiret cadratin ni demi-cadratin. Le reste du texte public est inchangé.

## 3. Tests

- Mettre à jour tout test qui attend le titre, les étapes, les nœuds ou les liens de l'ancienne quatrième histoire.
- Les phrases attendues de `.onto-now` pour l'histoire 4, en FR et en EN : le titre, puis « Un client signale un défaut. », « Le système le relie à sa commande. », « Un agent applique vos procédures qualité. », « Vous décidez, l'ERP lance la correction. ».
- La réservation de hauteur couvre les nouvelles phrases et la nouvelle carte : hauteur de `.ontocap-stack` constante à toutes les étapes de toutes les histoires, de 320 à 1440 px, FR et EN.
- Les tests d'anonymat restent verts : aucun nom de client.
- `tests/stabilite.spec.ts` est inchangé, aucun seuil assoupli. Le hero entier tient toujours à 1440 × 800.

## 4. Documentation

Dans la section « Hero trois plans » d'`AGENTS.md` et dans `AI_CONTEXT.md` / `TRUTH.md` là où les histoires sont listées : la quatrième histoire est la réclamation qualité, et non plus la fin de réunion. Raison : la home doit parler à l'industrie.

## Hors périmètre

- Les nœuds Synthèse de réunion, Suivi des actions, Comptes rendus, Agenda, Équipe et Action restent dans le schéma, même si aucune histoire ne les allume.
- Aucune autre section de la page.
