# CONTRAT D'IMPLÉMENTATION — Paul V2, alignement de marque

**Gate M1.** 13/08/2026 · Branche `feat/paul-brand-alignment-v2`
**Nature de la tranche :** affinage d'un site en production. Rien n'est reconstruit.

---

## 1. Ce qui est préservé, explicitement

Le funnel en huit sections. L'offre, le prix `2 499 € HT`, la garantie première heure. Le CTA
unique « Réserver mon audit offert » vers le créneau de 15 minutes. La direction claire, chaude
et bleue du frame Figma `166:13`. Et **tout le travail UX déjà appliqué** : listes non encadrées,
plancher de 14 px, chapô court, contrôles automatisés.

## 2. Le hero, structure canonique

| Niveau | Contenu |
|---|---|
| Surtitre | ACCOMPAGNEMENT INDIVIDUEL · 10 HEURES |
| H1 | Mettez fin au chaos. / Retrouvez la clarté. |
| **Ligne descriptive** | **Appliquez l'IA à un problème réel de votre entreprise, directement avec Paul.** |
| Chapô | En 10 heures, vous choisissez le problème qui vous coûte le plus, vous voyez une première solution tourner sur votre travail réel, et vous repartez capable de continuer. |
| CTA | Réserver mon audit offert |
| Microcopy | 15 min avec Paul · sans engagement |

**Le titre porte l'émotion, la ligne descriptive porte la compréhension.** C'est la résolution
d'une tension réelle : le H1 est canonique mais ne dit pas de quoi on parle ; le rendre explicite
l'aurait aplati. La ligne descriptive répond à l'objection sans abîmer le titre.

**Journal, parce qu'il compte :** ce H1 avait été remplacé le 13/08 par « Arrêtez de tester l'IA.
Faites-la travailler. » sur instruction orale, puis rétabli le même jour par ce brief. Le site,
Figma `172:2` et `docs/brand-v2/03-VOICE-AND-COPY.md` sont réalignés. Les pages Figma
`V2 — COPY V6` et `166:13` portent la version canonique et n'ont jamais bougé.

## 3. Ce qui est ajouté

**Une section « Pourquoi Paul »**, placée entre la transformation et la méthode. La crédibilité
doit précéder la méthode, sinon la méthode n'a pas d'auteur. 108 mots, quatre phrases, aucune
liste d'entreprises, aucun CV. La citation détachée ferme le raisonnement :

> Mon métier n'est pas de connaître votre entreprise mieux que vous. C'est de voir ce qui bloque,
> décider ce qui mérite d'être traité, et le faire fonctionner avec vous.

**Une affirmation de transformation** avant la note de bas de section : « Vous arrivez avec un
problème flou. Vous repartez avec une décision, un premier résultat et une manière de continuer. »
La note devient « Les 10 heures sont le cadre. La transformation est le produit. »

**Une troisième dimension dans la méthode.** Les trois temps restent — ils sont mémorisables —
mais chacun dit désormais qui fait quoi : « Ce que vous me montrez », « Ce que je cherche »,
« Ce qu'on construit ensemble ». C'est ce qui sépare une méthode d'un schéma de cabinet.

**Une ligne de cadrage sur les preuves :** « Finance, vente, juridique, opérations ou contenu : je
ne place pas le même outil. J'utilise la même discipline pour comprendre, choisir et construire. »
La preuve démontre la capacité à changer de contexte, pas une collection de logos.

## 4. Le monogramme

**Direction A — IMPERIUM retenue**, depuis la page Figma `V2 — PAUL MONOGRAM — ROMAN P` (`226:2`).
Deux P dans un médaillon à double anneau, dessinés en Cinzel puis vectorisés. **Cinzel n'apparaît
nulle part ailleurs sur le site** : la typographie reste Instrument Sans.

**Règle de taille, établie sur un test réel et non sur un aperçu à 200 px.** La planche
`artifacts/qa/favicon-tailles-reelles.png` montre les deux marques à 16, 24, 32, 48 et 64, sur
fond clair et sur fond sombre. Verdict : **sous 32 px le double P se referme en tache.**

| Taille | Marque servie |
|---|---|
| 16 et 24 px | signet, P unique |
| 32 px et plus | sceau, double P |

Dans l'en-tête, le sceau fait 38 px, accompagné du wordmark « PAUL LARMARAUD » et du rôle
« Président de Parrit.ai », ce dernier masqué sous 780 px.

Le composant `Monogram.tsx` porte le tracé en ligne et hérite de `currentColor` : une seule
source pour le fond clair et le fond sombre, et aucune requête réseau.

**Contrôle de similarité, sans prétention juridique.** Le signe est un double P sérif dans un
double anneau. La forme « initiale dans un cercle » est extrêmement répandue et non appropriable
en soi ; la combinaison précise — Cinzel, deux P imbriqués, double anneau, bleu `#2E4DC2` — ne
m'évoque aucune marque connue. **Ceci n'est pas une recherche d'antériorité.** Une vérification
INPI reste à faire avant tout dépôt.

## 5. Boutons

Hauteur minimale 50 px, 44 px dans l'en-tête. Rayon 10 px. Libellé en semibold. Aucun dégradé,
aucune ombre, aucune pilule, aucun effet 3D. Survol, focus et état désactivé explicites.

**Le focus visible est désormais un contrôle bloquant**, pas une intention.

## 6. Ce que la QA vérifie, et fait échouer

Aux sept largeurs 1440, 1280, 1024, 768, 430, 390, 375 :

- un texte visible sous 14 px ;
- un contraste sous le seuil AA, en tenant compte de la transparence et de `color(srgb …)` ;
- un élément non interactif qui ressemble à un bouton ;
- un prix affiché avant la section offre ;
- un second libellé de CTA ;
- un débordement horizontal ;
- une cible tactile sous 40 px ;
- autre chose qu'un seul `h1`.

## 7. Ce qui n'a pas été touché

Aucun fichier, domaine, page Figma ou déploiement appartenant à Maxime. Le site Parrit.ai. Le DNS,
les MX, SPF, DKIM et DMARC. Aucune VSL, aucun emplacement vidéo ajouté à la composition — le champ
`media` existait déjà et reste vide.

## 8. Ce qui reste ouvert

**La page de réservation.** C'est un rendez-vous Google Calendar, `calendar.app.google/kkpaNisBa78BuuAj8`.
Son titre et sa description ne s'éditent pas par API : c'est un geste manuel dans Google Agenda.
Les libellés exacts à recopier sont dans `BRAND-ROLLOUT-BACKLOG.md`.

**Les noms de clients** restent en descripteurs de secteur, en attente des accords écrits.
