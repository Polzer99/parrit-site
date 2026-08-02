# 06 — Langage visuel Hermès

## Attribution — obligatoire

Partout où Hermès est nommé, visible par un tiers :

> **Hermes Agent — open source by Nous Research, MIT License.**

Parrit.ai **conçoit** les systèmes, **adapte** les agents, les **intègre**, les **déploie**, les **connecte** aux opérations, **construit** les interfaces et **organise** les boucles de contrôle.

**Formulations interdites :** « notre technologie Hermes » · « Hermes développé par Parrit » · « Hermes, notre IA propriétaire » · toute tournure qui laisse entendre une propriété intellectuelle sur le modèle.

Cette attribution fait partie du composant `HermesTraceLevel0` : elle n'est pas une mention légale reléguée en pied de page, elle est dans le bloc.

---

## Ce qu'Hermès est, visuellement

Hermès est un **système opératoire**, pas un chatbot décoratif. Il se représente par ce qu'il produit, pas par une bulle de conversation :

ses actions · ses traces · ses décisions · ses entrées · ses sorties · ses connexions · ses états · ses interventions · ses validations humaines · ses boucles d'amélioration.

Hermès ne doit **jamais** être présenté comme un collègue humain. Il rend visibles son périmètre, ses limites et son niveau de confiance. Il ne parle pas à la première personne.

---

## Les états

Treize états canoniques. Chacun porte un **libellé** et un **symbole** — jamais une couleur seule.

| État | Libellé | Symbole | Rouge |
|---|---|---|---|
| `success` | Exécuté | ● | non |
| `failure` | Échec | × | **oui** |
| `waiting` | En attente | ○ | non |
| `blocked` | Bloqué | ▪ | **oui** |
| `human-review` | Revue humaine | ◆ | **oui** |
| `improvement-proposed` | Amélioration proposée | △ | non |
| `improvement-accepted` | Amélioration retenue | ▲ | non |
| `improvement-rejected` | Amélioration écartée | ▽ | non |

`agent status`, `action card`, `decision`, `signal` et `source` sont rendus par composition : `HermesStatus` porte l'état, `TraceStep` porte l'action, la source et l'horodatage.

### Pourquoi pas de vert

**Seul ce qui demande une intervention porte du rouge.** Un succès n'est pas vert : il est en encre atténuée. Le système ne code pas la réussite par la couleur, pour trois raisons : le vert n'est pas dans la palette ; un mur de vert transforme la trace en tableau de bord décoratif ; et l'œil doit tomber sur ce qui bloque, pas sur ce qui marche.

C'est l'application directe du Red Causality Test : le rouge matérialise l'**exception** et le **point de contrôle**.

---

## La trace

Une trace crédible **contient un échec**.

Une trace 100 % verte est le signal le plus sûr qu'on regarde une démo. Montrer un `blocked` (« accès CRM refusé par le périmètre déclaré ») et un `human-review` (« message ambigu, aucune règle applicable ») est le meilleur argument de vente du site : cela prouve que le périmètre existe et qu'il tient.

Chaque trace affiche son **périmètre déclaré** en en-tête, y compris ce que l'agent ne fait pas.

---

## Hermès comme surface de conversion

Hermès est à la fois une interface de qualification, une preuve de la méthode, un générateur de résumé de faisabilité, un orchestrateur d'expériences supervisées et un bibliothécaire de la source de vérité.

L'objet de conversion est un **workflow concret**. Le visiteur décrit un workflow douloureux ; Hermès renvoie une lecture de faisabilité avec son périmètre et son incertitude ; le routage vers l'offre vient **après**.

**Interdits de conception :** transformer Hermès en formulaire de qualification déguisé · lui faire promettre un résultat · masquer son incertitude · lui faire produire un chiffre qu'aucun humain n'a vérifié.

**Vie privée.** Ce qu'un visiteur écrit dans une entrée de workflow ne sort pas du périmètre déclaré et n'alimente aucune proposition d'amélioration nominative. Voir `HERMES-CONTINUOUS-IMPROVEMENT.md`.

---

## Boucle d'amélioration

Le langage d'états ci-dessus sert aussi à la boucle d'amélioration continue du site : `improvement-proposed`, `improvement-accepted`, `improvement-rejected` sont les trois états de ce cycle, et le journal des propositions se lit avec `HermesTraceLevel0`.

La boucle d'amélioration du site est elle-même un système Parrit : elle se montre comme tel, avec ses traces et ses points de contrôle humains.
