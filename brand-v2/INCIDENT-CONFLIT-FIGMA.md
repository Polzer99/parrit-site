# INCIDENT · CONFLIT D'ÉCRITURE FIGMA

**Date :** 12/08/2026 · **Gravité :** bloquant · **Statut :** tranche arrêtée

---

## 1. Ce qui s'est passé

À 15h5x, après avoir construit et vérifié à l'écran l'essentiel de la V2, une
lecture de contrôle sur `figma.root.children` a renvoyé **un document que je ne
reconnais pas**. Mes huit pages `V2 —` avaient disparu, remplacées par sept
autres pages `V2 —`, toutes vides, portant une convention de nommage différente
de la mienne.

**Je n'ai supprimé aucune page.** Ma dernière écriture réussie était la page
funnel. L'appel suivant, un simple `getNodeByIdAsync('17:2')`, a renvoyé `null`.

## 2. Preuve du conflit

Les pages qui ont remplacé les miennes ne peuvent pas venir de moi :

| Page trouvée | ID | Pourquoi ce n'est pas moi |
|---|---|---|
| `V2 — FUNNEL ARCHITECTURE` | `18:2` | Nom que je n'ai jamais employé. ID créé juste après les miens |
| `V2 — NEW BRAND FOUNDATION` | `54:31` | Idem |
| `V2 — PAUL LANDING — FROM FUNNEL` | `54:32` | Suffixe « FROM FUNNEL » absent de ma commande |
| `V2 — MAXIME LANDING — FROM FUNNEL` | `54:33` | Idem |
| **`V2 — PARRIT.AI — FROM FUNNEL`** | `54:34` | **Parrit.ai est explicitement HORS PÉRIMÈTRE de ma tranche.** C'est la preuve la plus nette : un autre auteur travaille depuis un autre brief |
| `V2 — MOBILE — FROM FUNNEL` | `54:35` | Idem |
| `V2 — QA — FROM FUNNEL` | `54:36` | Idem |

**Conclusion :** une autre session écrit dans le même fichier Figma, avec un plan
différent, et a supprimé mes pages. Le `CLAUDE.md` de Paul le dit lui-même :
*« Plusieurs terminaux tournent en parallèle. »* Le fichier Figma était une
surface partagée sans verrou, et personne ne l'avait déclaré.

## 3. Ce qui a survécu, et ce qui est perdu

### Survit, parce que c'est au niveau du document et non de la page

| Élément | État |
|---|---|
| Collection `Primitives` | **intacte**, 31 variables |
| Collection `Semantic` | **intacte**, 12 variables, modes `Paul` et `Maxime` |
| Les 11 styles de texte Geist et Geist Mono | **intacts** |

### Perdu, parce que c'était sur mes pages

| Élément | Ce que c'était |
|---|---|
| 11 composants en Auto Layout | `Header / Minimal`, `CTA / Primary`, `Link / Secondary`, `Hero / Section`, `Card / Use-case`, `Card / Proof`, `Process / Step`, `Card / Offer`, `Quote / Testimonial`, `FAQ / Item`, `Footer / Minimal` |
| Landing Paul desktop 1440 | 8 sections, 4 696 px de haut, vérifiée à l'écran |
| Landing Maxime desktop 1440 | 8 sections, 5 318 px, en mode `Maxime`, vérifiée à l'écran |
| Mobile 390, Paul et Maxime | ordre et densité repensés, vérifiés à l'écran |
| Moodboard des 8 références | captures réelles téléversées, TAKE, AVOID, décision de design |
| Page funnel | tableau des 8 sections, deux parcours côte à côte |
| Les 8 images de référence téléversées | à re-téléverser, les URL d'upload sont à usage unique |

## 4. Pourquoi je n'ai pas reconstruit tout de suite

Trois raisons, dans cet ordre.

1. **Une guerre d'écriture détruirait les deux travaux.** Si je recrée mes pages
   pendant que l'autre session recrée les siennes, chacun écrase l'autre, et le
   fichier devient inexploitable pour tout le monde.
2. **La commande l'interdit.** Elle range « une écriture Figma en parallèle
   provoque des conflits » parmi les conditions d'échec immédiat. Elle exige
   aussi que deux agents ne modifient jamais le même périmètre sans gate de
   fusion. Il n'y a pas de gate entre ma session et l'autre.
3. **Je ne sais pas ce que vaut l'autre travail.** Peut-être qu'il répond mieux
   à ce que veut Paul. Ce n'est pas à moi de le supprimer pour reprendre la main.

## 5. Ce que la reconstruction coûte réellement

**Peu, et c'est le seul point rassurant.** Tout ce qui a été construit dans Figma
est entièrement spécifié sur disque, dans `brand-v2/` :

- `06-DESIGN-SYSTEM-PLAN.md` : les 11 composants, leur structure Auto Layout,
  leurs noms exacts, les fondations complètes.
- `07-MERGE-DECISIONS.md` : le funnel, les références, les preuves, le placement
  du prix, le CTA, les différences Paul et Maxime.
- `08-COPY-PAUL.md` et `09-COPY-MAXIME.md` : le copy complet des 16 sections,
  au mot près, avec les comptes de mots.
- `05-PROOF-INVENTORY.md` : ce qui a le droit d'être écrit, et ce qui ne l'a pas.

Les variables et les styles ayant survécu, la reconstruction est mécanique.
Compter une passe de composants, une passe par page, une passe de mobile, une de
moodboard et une de funnel.

## 6. Ce qu'il faut décider avant de relancer

1. **Qui écrit dans ce fichier Figma ?** Une seule session doit avoir le droit
   d'écrire. Tant que ce n'est pas tranché, toute reconstruction est jetable.
2. **Que fait-on de l'autre travail ?** Fusion, ou l'un des deux gagne.
3. **Faut-il un verrou ?** Une page `LOCK` dans le fichier, ou une ligne dans
   `CANON-DEPOTS.md` déclarant le propriétaire du fichier, éviterait la
   répétition. Une convention écrite vaut mieux qu'un accident.

## 7. Leçon de méthode

J'avais sérialisé mes propres écritures avec discipline, un seul intégrateur,
aucun sous-agent en écriture. **Cette sérialisation ne protège que de moi-même.**
Une surface partagée entre plusieurs sessions a besoin d'un verrou au niveau de
la surface, pas d'une règle interne à une session. C'est exactement le point du
`CLAUDE.md` de Paul sur les fichiers partagés : relire avant d'écrire, parce
qu'un autre terminal a pu changer les choses il y a deux minutes. Je l'appliquais
aux fichiers du dépôt. Je ne l'appliquais pas au fichier Figma.
