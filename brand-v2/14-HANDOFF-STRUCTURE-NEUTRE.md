# HANDOFF · LA STRUCTURE, SANS DIRECTION ARTISTIQUE

**Date :** 12/08/2026 · **Pour :** la session qui écrit dans Figma
**Statut de l'auteur :** lecture seule sur Figma, sur décision de Paul

---

## 0. Pourquoi ce document existe

Deux décisions de Paul du 12/08 le rendent nécessaire.

1. **La DA « Smoooth » est abandonnée.** La nouvelle se construit en parallèle.
   Tout ce qui portait des couleurs, une typographie ou une texture est donc
   périmé, quelle que soit sa qualité.
2. **Une seule session écrit dans Figma, et ce n'est pas moi.**

Ce document ne contient donc **aucune valeur visuelle**. Il contient ce qui
survit à un changement de peau : le parcours, les mots, les preuves autorisées,
et le contrat de chaque composant. C'est la partie coûteuse à produire, et la
seule qui n'est pas à refaire quand la DA change.

**Règle de lecture :** partout où ce document dit « surface primaire » ou
« accent d'action », il désigne un RÔLE. La nouvelle DA lui donnera une valeur.
Ne jamais recoller les anciennes valeurs dessus.

---

## 1. Ce qui est prêt et validé, sur disque

| Fichier | Ce qu'il contient | Dépendant d'une DA ? |
|---|---|---|
| `02-FUNNEL.md` | le parcours en 8 sections, question, émotion, preuve, CTA, interdits | **non** |
| `05-PROOF-INVENTORY.md` | ce qui a le droit d'être écrit, et ce qui ne l'a pas, avec les sources | **non** |
| `07-MERGE-DECISIONS.md` | funnel définitif, CTA, placement du prix, différences Paul et Maxime | **non** |
| `08-COPY-PAUL.md` | 578 mots, les 8 sections, au mot près | **non** |
| `09-COPY-MAXIME.md` | 656 mots, les 8 sections, au mot près | **non** |
| `10-COPY-MERGE.md` | la comparaison des deux copies, mesurée | **non** |
| `03-REFERENCES-PAUL.md` | 4 références, TAKE, AVOID, captures sur disque | partiellement |
| `04-REFERENCES-MAXIME.md` | idem | partiellement |
| `06-DESIGN-SYSTEM-PLAN.md` | 11 composants **et** les anciennes valeurs | **oui, à filtrer** |

**Les captures de références sont sur disque**, `parrit-site/public/brand-lab/refs/`,
en desktop et en mobile, et chacune a été ouverte et regardée. Elles restent
valables : une référence de composition ne dépend pas de notre DA.

---

## 2. Le funnel, en 8 sections

Aucune section en plus, aucune en moins.

| # | Section | Ce qu'elle fait | Prix | CTA |
|---:|---|---|---|---|
| 1 | Hero | le visiteur se reconnaît et voit l'action | **interdit** | oui |
| 2 | Reconnaissance | il se reconnaît dans ses propres mots | interdit | non |
| 3 | Trois usages | ça devient tangible, trois exemples maximum | interdit | non |
| 4 | Preuve | un cas, passé par la porte de publication | interdit | non |
| 5 | Méthode | trois étapes visibles, jamais cinq | interdit | non |
| 6 | Ce que vous saurez faire après | la capacité, jamais un résultat prouvé | interdit | non |
| 7 | Offre | 10 heures, 2 500 € HT, **ici et nulle part ailleurs** | **oui** | oui |
| 8 | Conversion | réserver l'échange | interdit | oui |

**Le CTA apparaît trois fois, en 1, 7 et 8, avec le même libellé et la même
destination.** Ce n'est pas trois portes, c'est une porte rappelée.

- Paul : **« Cadrer mon premier cas »**
- Maxime : **« Trouver par où commencer »**

**Jamais sur ces pages :** newsletter, lead magnet, communauté, formation
gratuite, webinaire, démo détachée, formulaire de contact général, seconde
offre, palier de prix, compte à rebours, nombre de places restantes.

---

## 3. Les 11 composants, décrits par leur CONTRAT

Aucune couleur, aucune taille de police, aucune valeur d'espacement. Uniquement
ce que le composant doit faire, et ce qu'il n'a pas le droit de faire.

| Nom | Contrat | Interdits |
|---|---|---|
| `Header / Minimal` | le nom, et le CTA. Rien d'autre | aucune navigation, aucun prix, aucun menu |
| `CTA / Primary` | un libellé, une destination. Pleine largeur en mobile | ne porte jamais un prix ni un second libellé |
| `Link / Secondary` | un lien texte de service | ne doit jamais concurrencer le CTA |
| `Hero / Section` | 5 éléments maximum : nom, titre, sous-titre, CTA, un visuel | **le prix est interdit** |
| `Card / Use-case` | un label de départ, un titre de situation, deux phrases | jamais une fonctionnalité, jamais un quatrième exemplaire |
| `Card / Proof` | qui, anonymisé · ce qui a été construit · la limite de la preuve | jamais un nom de client, jamais un résultat non mesuré |
| `Process / Step` | un numéro, un verbe, une phrase | jamais plus de trois instances |
| `Card / Offer` | le montant, la durée, ce qui est inclus, le CTA | **seul composant autorisé à porter le prix** |
| `Quote / Testimonial` | une citation attribuée | **reste VIDE**, aucun verbatim n'a d'accord. Porte un `PROOF SLOT` |
| `FAQ / Item` | une objection, une réponse courte | jamais un argumentaire déguisé |
| `Footer / Minimal` | mentions et rien de plus | aucun lien concurrent du CTA |

### Les rôles de couleur dont les composants ont besoin

La nouvelle DA doit fournir **neuf rôles**, pas neuf couleurs choisies pour leur
beauté. Les noms sont ceux à conserver.

`surface/default` · `surface/alt` · `surface/inverse` · `text/primary` ·
`text/secondary` · `text/inverse` · `action/primary` · `border/default` ·
`accent/rare`

Plus trois rôles de densité, qui portent la différence de tempérament entre les
deux expressions : `density/section`, `density/block`, `density/cardPad`.

⚠️ **Ces variables existent déjà dans le fichier Figma, avec les valeurs de
l'ANCIENNE DA.** Collections `Primitives` (31 variables) et `Semantic` (12,
modes `Paul` et `Maxime`), plus 11 styles de texte. Elles ont survécu à la
suppression de mes pages parce qu'elles vivent au niveau du document.
**Décision à prendre : les vider et les réutiliser comme squelette, ou les
supprimer.** Le squelette est bon, les valeurs sont mortes. Je ne touche à rien,
je ne suis plus l'écrivain de ce fichier.

---

## 4. Les deux expressions, sans valeurs

Ce qui doit rester COMMUN, quelle que soit la DA : les 11 composants et leur
structure, la grille, le funnel en 8 sections, la position du prix, le CTA
unique, l'échelle d'espacement, l'absence d'ombre.

Ce qui doit DIVERGER, et par quel levier :

| Levier | Paul, l'opérateur | Maxime, le guide |
|---|---|---|
| Contraste | élevé | doux |
| Densité | serrée, plus d'information par écran | aérée, moins d'éléments simultanés |
| Place du visage | secondaire, une fois, documentaire | **centrale, dès le premier écran** |
| Nature de la preuve | un artefact de travail, un document | une histoire d'accompagnement, une personne |
| Rythme du mouvement | rapide et sec | plus ample |
| Registre des mots | décision, système, exécution | permission, compréhension, progression |

**Le test qui arbitre :** un lecteur qui voit les deux pages côte à côte doit
reconnaître la même entreprise, et deux personnes différentes.

---

## 5. Ce qui ne doit jamais être écrit, quelle que soit la DA

Extrait contraignant de `05-PROOF-INVENTORY.md`, dont le §5 fait loi.

- Aucun gain de temps, aucun ROI, aucun taux, aucun pourcentage, aucun « x fois ».
- Aucun nombre de clients.
- **Aucun nom de client**, sur aucune surface, y compris une landing personnelle.
- Aucun témoignage ni verbatim client. Aucun n'a d'accord de citation.
- Une preuve interne se déclare comme interne **dans la phrase**, pas en note.
- « Autonome » jamais comme résultat prouvé, jamais comme propriété d'un système.
  Uniquement comme capacité visée, au futur, à la deuxième personne.
- Forexpert et « Julien » : **aucune source primaire**, non utilisables.

### Les deux preuves autorisées

- **Page Paul** : le reporting mensuel d'une PME anonymisée, niveau L5. Les
  chiffres de la situation de DÉPART sont sourcés et citables. Aucun résultat.
- **Page Maxime** : le dispositif de veille d'un dirigeant anonymisé, niveau L4.
  Système livré décrit, **aucun effet prêté**.

⚠️ **Aucune source du canon ne rattache Maxime à une réalisation.** Sa page
s'appuie sur des preuves de Parrit sous un angle pédagogique, et porte un
`PROOF SLOT` pour une preuve qui lui soit propre. Elle est **à produire, pas à
trouver**.

⚠️ **Il n'existe aucune image de Maxime dans le dépôt.** Son hero ne fonctionne
pas sans portrait. C'est le manque le plus bloquant des deux pages.

---

## 6. Ce que j'attends pour reprendre

1. **La clé du fichier Figma** qui contient le funnel V2 validé. Je le lirai et
   j'alignerai `02-FUNNEL.md` dessus, ou je documenterai l'écart.
2. **La nouvelle DA**, même partielle. Une palette et une famille typographique
   suffisent pour rebrancher les 9 rôles et les 11 styles.
3. **La décision sur les variables héritées** dans le fichier partagé.
