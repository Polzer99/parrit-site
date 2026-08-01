# PARRIT-COPY-RESET-V1

**Tranche du 1er août 2026.** Copywriting seul. Le diagnostic visuel de `PARRIT-VISUAL-RESET-V2` est confirmé, le diagnostic éditorial est corrigé.

---

## Problème initial

Le wording des trois concepts décrivait **ce que Parrit fabrique**. Il ne disait pas **ce que le client achète**.

| Ce que la page disait | Ce qu'elle ne disait pas |
|---|---|
| des agents, des systèmes, des fronts | la durée de la mission |
| des entrées et des sorties | le prix cible |
| deux cas d'usage de poids égal | le transfert d'autonomie |
| un opérateur qui tourne | la différence avec un prestataire vendu au temps |
| un propriétaire humain par ligne | la raison d'agir maintenant |

Le titre du concept A, « On ne vous rend pas un deck », se définissait **contre** un concurrent. Le concept C ouvrait sur « Une IA qui parle n'exécute rien », un constat, pas une offre. Le concept B annonçait « Chaque ligne a un propriétaire humain », une règle d'architecture.

Aucun des trois ne permettait de répondre en cinq secondes à : combien de temps, pour quel résultat, à quel prix, et ensuite quoi.

## Message canonique

**Parrit ne vend pas des agents. Parrit vend la transformation d'un processus opérationnel par un système d'agents mis en production.**

Parrit devient temporairement la direction IA opérationnelle de l'entreprise.

- **Promesse :** « On entre pour déployer. On vous laisse les clés quand ça tourne. »
- **Offre :** une mission de trois mois, à partir de 5 000 € par mois.
- **Résultat :** un premier système en production sur un processus prioritaire, et des équipes autonomes.
- **CTA :** « Choisir le premier processus », puis « Décrire le processus ». Les deux pointent vers `/diagnostic`, le parcours réellement implémenté. **Aucune destination créée.**

La réussite n'est pas que Parrit reste. C'est que le système tourne sans Parrit.

## Architecture de la page

**Identique dans les trois concepts.** Les trois ne défendent pas trois positionnements : le choix entre A, B et C reste un choix de direction artistique.

| # | Bloc | Rôle |
|---|---|---|
| 1 | Hero | eyebrow, promesse, méthode en une phrase, CTA, lien secondaire |
| 2 | Preuve immédiate | 3 mois · 5 000 € / mois · 1 premier système · vos équipes autonomes |
| 3 | Problème | l'IA parle, les opérations attendent |
| 4 | Cas d'usage | ce qui entre, ce que le système fait, ce qui sort, ce que l'humain décide |
| 5 | Méthode | choisir, déployer, transmettre |
| 6 | Hermes | il fait circuler, l'humain décide, tout laisse une trace |
| 7 | Offre | trois mois pour ne plus dépendre de nous, avec le prix |
| 8 | CTA final | quel processus vous coûte encore trop de temps |

Le socle est unique : `src/app/art-direction-lab/content.ts`. Un mot changé se répercute sur les trois concepts.

## Copy finale

**Eyebrow.** Direction IA opérationnelle · Mission de 3 mois

**Titre.** On entre pour déployer. On vous laisse les clés quand ça tourne.

**Texte.** On choisit le processus qui vous ralentit le plus, on construit le système d'agents qui l'exécute, puis on rend vos équipes autonomes.

**CTA.** Choisir le premier processus · **Lien secondaire.** Voir ce qu'on déploie

**Preuve immédiate.** 3 mois, du diagnostic à un premier système en production · 5 000 € / mois, un périmètre et un résultat, pas des heures vendues · 1 premier système, déployé dans les opérations réelles de l'entreprise · Vos équipes autonomes, contrôle, documentation et transmission inclus.

Aucun de ces éléments n'est présenté comme une garantie. Ils décrivent le contenu d'une mission, pas un résultat promis.

**Problème.** L'IA parle. Vos opérations attendent. Vous avez peut-être déjà testé ChatGPT, lancé des ateliers ou accumulé des prototypes. Mais les dossiers circulent encore à la main. Les informations restent dispersées. Les décisions attendent la bonne personne. Et les prototypes ne passent jamais vraiment en production. Parrit intervient à cet endroit précis.

**Cas d'usage.** Quatre, tous adossés à une entrée `status: "deployed"` de `content/agents/catalog.json`. Aucun n'est classé par technologie.

| Ce qui entre | Ce que le système fait | Ce qui sort | Ce que l'humain décide |
|---|---|---|---|
| Un message WhatsApp, un formulaire du site, un appel manqué | rapproche du bon dossier, complète la fiche, pose la relance | une fiche à jour, une relance datée | qui on rappelle en priorité |
| Un signal public daté, vérifié à la source | vérifie, enrichit, écrit un message pour une seule personne | une file de contacts, chacun avec la raison d'y être | ce qu'on envoie, et à qui |
| Une boîte mail de réclamations | classe, isole les urgences, rédige une réponse | un brouillon prêt à valider, les urgences remontées | ce qui part, et le geste commercial |
| Un devis signé | émet la facture, décompte les heures, relance les impayés | une facture émise, une échéance posée | quand on arrête de relancer |

**Méthode.** On commence par ce qui vous ralentit le plus. **Choisir :** un processus assez coûteux pour créer un vrai résultat, mais assez précis pour être déployé rapidement. **Déployer :** on connecte les données, les logiciels, les règles métier et les validations humaines nécessaires. **Transmettre :** on mesure, on fiabilise, on documente et on rend vos équipes capables de faire évoluer le système.

**Hermes.** Hermes fait circuler le travail. L'humain garde la décision. Hermes reçoit une entrée, exécute les étapes autorisées et produit une sortie vérifiable. Quand une décision humaine est nécessaire, il s'arrête, présente le contexte et demande une validation. Chaque action laisse une trace. Chaque erreur peut améliorer le système.

Attribution portée par les trois concepts, en pied de page : **Hermes Agent, open source by Nous Research, MIT License.** Jamais présenté comme une technologie Parrit.

**Offre.** Trois mois pour ne plus dépendre de nous. **Mois 1, choisir et connecter :** choisir le processus, cadrer le résultat et connecter l'existant. **Mois 2, déployer et mesurer :** mettre le premier système en production et le confronter aux opérations réelles. **Mois 3, fiabiliser et transmettre :** documenter, sécuriser et rendre les équipes autonomes. À partir de 5 000 € par mois pendant trois mois.

Aucune autre offre dans cette section.

**CTA final.** Quel processus vous coûte encore trop de temps ? En 45 minutes, on identifie celui qui mérite d'être accéléré et on définit ce que le système doit recevoir, produire et laisser à l'humain. **Décrire le processus.**

## Formulations rejetées

| Rejeté | Raison |
|---|---|
| « On ne vous rend pas un deck » | se définit contre un concurrent, ne dit pas ce qu'on achète |
| « Une IA qui parle n'exécute rien » | constat, pas offre. Aucune durée, aucun résultat, aucun prix |
| « Chaque ligne a un propriétaire humain » | règle d'architecture, illisible pour un dirigeant |
| « Parrit opère vos deux fronts critiques » | « fronts » est du vocabulaire interne |
| « Back-office automatisé » et « Business généré » | organise l'offre par catégorie Parrit, pas par problème client |
| « Les modèles et les données du cabinet deviennent une première version de contrat » | **forme proposée au cadrage, non retenue** : aucun cas `deployed` du catalogue ne l'adosse. La consigne interdisait de l'employer sans cas validé |
| « pipeline agentique », « multi-agent system », « solution intelligente » | jargon, interdits par la consigne |
| « transformation digitale », « excellence opérationnelle », « libérer le potentiel » | vocabulaire de cabinet, interdit par la consigne |

## Réserve signalée

`TRUTH.md` §6.1 est une règle dure : depuis le pivot 2026, **la home publique n'affiche aucun prix**, et les prix fermes antérieurs ont été retirés. La consigne de cette tranche impose au contraire « à partir de 5 000 € / mois » au moins une fois par page.

Le laboratoire n'est **pas publié** : aucun prix ne sort. Mais si un concept passe en production, l'arbitrage doit être rouvert et `TRUTH.md` mis à jour d'abord. La règle n'a pas été modifiée dans cette tranche.

## Ajustements imposés par le volume de texte

Le titre canonique fait 47 signes contre 40 pour les anciens. Trois ajustements, tous de **taille de bloc**, aucun de composition, de couleur, de grille, de proportion ou d'asset.

| Concept | Avant | Après | Effet |
|---|---|---|---|
| A | `clamp(2.75rem, 7.1vw, 7rem)`, 4 lignes | `clamp(2.5rem, 5.4vw, 5.2rem)`, 5 lignes | bloc de titre à hauteur constante, environ 390 px |
| B | `clamp(2.75rem, 7.4vw, 7rem)` | `clamp(2.5rem, 5.6vw, 5.4rem)` | le registre reste sous la ligne de flottaison, pas deux écrans plus bas |
| C | `clamp(3.5rem, 13.5vw, 13rem)` | `clamp(2.5rem, 7.2vw, 6.4rem)` | à 13,5vw le titre occupait **sept lignes et deux écrans**. À 6,4 rem il retrouve la silhouette d'affiche |

Deux ajouts CSS, imposés par des blocs qui n'existaient pas dans la tranche visuelle. Aucun n'introduit de couleur, de fonte, d'ombre, d'arrondi ni de forme nouvelle.

- **`.cta-link`** : le lien secondaire du hero. C'est le style `mono` déjà en place, souligné.
- **`.proof`** : les quatre éléments de preuve. Même grille à quatre colonnes, mêmes rôles typographiques et mêmes filets que les rangées existantes. Le prix est le seul à porter l'accent rouge.

Une ligne supplémentaire dans C, `.l4`, pour la quatrième ligne du titre en escalier. C'est un retour à la ligne, pas une composition.

## Tests

**Five Second Test.** Sur le premier écran des trois concepts, à 1440 et à 375 : la durée (« mission de 3 mois »), le problème (« le processus qui vous ralentit le plus »), le résultat (« on rend vos équipes autonomes ») et l'action suivante (« Choisir le premier processus ») sont tous visibles sans défiler. Captures `*-hero-*`.

**Offer Visibility Test.** Les quatre éléments sont dans le bloc de preuve, immédiatement sous le hero, dans les trois concepts. « À partir de 5 000 € par mois pendant trois mois » est répété dans la section offre.

**Dependency Test.** Trois formulations le portent : le titre lui-même (« on vous laisse les clés quand ça tourne »), le titre de l'offre (« trois mois pour ne plus dépendre de nous »), et l'élément de preuve (« un périmètre et un résultat, pas des heures vendues »).

**Jargon Test.** Le mot « agent » apparaît une fois par page, dans la phrase de méthode. Aucune occurrence de RAG, LLM, orchestration, pipeline, multi-agent, ni de « agentique » en adjectif décoratif. Les cas d'usage sont écrits en langage de travail : un mail, un devis, une facture, une relance.

**Visual Preservation Test.** `scripts/art-direction-lab-qa.mjs`, quatre largeurs, trois concepts, Chromium et WebKit : **aucun problème**. Zéro débordement horizontal, un seul `H1` par concept, zéro tiret cadratin, CTA présent partout, Barlow Condensed chargée en 800 et 900, marge d'accent 2,7 px, aucune compression de la chasse. Les portraits, les plaques, les couleurs, les filets, les grilles et les traitements responsive sont inchangés. Les seuls écarts visuels sont les trois tailles de titre du tableau ci-dessus.

## Captures

`docs/design-system/qa/visual-reset-v2/` : pour chaque concept, `*-hero-1440x900.png` (premier écran desktop), `*-1440x900.png` (pleine page desktop), `*-hero-375x812.png` (premier écran mobile), `*-375x812.png` (pleine page mobile). Les largeurs 768 et 1024 sont conservées.

## Hors périmètre

Brand OS · design system · homepage publique · autres langues · positionnement · direction artistique · choix du concept.
