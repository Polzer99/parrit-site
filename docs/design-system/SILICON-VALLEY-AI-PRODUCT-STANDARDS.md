# Standards de produit — benchmark et modèle Parrit

**Écrit le 2 août 2026.** Document de référence interne, expérimental.
**Aucun ADR d'approbation n'est créé.**

---

## Ce que ce document est, et ce qu'il n'est pas

C'est un benchmark de **principes de produit**, écrit à partir de la connaissance de ces produits et de leur doctrine publique. **Ce n'est pas un audit fraîchement mené produit par produit.** Les fonctionnalités nommées ici bougent vite : avant de citer l'une d'elles à un client ou dans un artefact commercial, la revérifier.

Ce qui ne bouge pas, en revanche, ce sont les principes. C'est eux qui sont repris.

**On n'importe aucune esthétique.** Ni couleurs, ni composants, ni typographie, ni mise en page. La direction artistique Parrit — papier `#FFFDFA`, encre `#0C0C0D`, rouge `#D1132F`, Barlow Condensed rare, Geist, Geist Mono — reste intacte.

---

## 1. Benchmark

### ChatGPT

| | |
|---|---|
| **Point d'entrée** | une zone de saisie unique, vide, sans configuration préalable |
| **Objet principal** | la conversation ; le travail lourd est sorti dans un objet séparé, éditable |
| **Travail long** | rendu visible par un état d'avancement nommé plutôt que par un compteur |
| **Progression** | étapes textuelles, interruptibles à tout moment |
| **Complexité** | tout est masqué au départ, et se révèle à mesure que la demande se précise |
| **Rôle de l'humain** | il redirige en cours de route ; il ne configure pas avant |
| **Interruption** | arrêt immédiat de la génération, reformulation, reprise |
| **Versions** | historique des échanges, retour arrière sur une branche |
| **Erreurs** | annoncées en langage courant, avec une action de reprise |
| **Mobile** | même objet, même entrée, densité réduite |

**Applicable à Parrit** — l'entrée doit être triviale. Une demande arrive, rien à paramétrer. Le travail complexe se déporte dans un objet dédié plutôt que d'encombrer l'entrée.
**À ne pas copier** — la conversation comme interface principale. Parrit ne vend pas un chat, et un faux chatbot dans une démonstration serait un contresens.

### Claude

| | |
|---|---|
| **Point d'entrée** | conversation, mais l'artefact vit **à côté**, pas dedans |
| **Objet principal** | l'artefact : autonome, nommé, réutilisable, sorti du flux |
| **Travail long** | l'objet se construit pendant que la conversation continue |
| **Progression** | l'objet change à vue ; c'est la transformation qui fait la progression |
| **Complexité** | la conversation reste simple, l'objet porte la densité |
| **Rôle de l'humain** | il demande des modifications **ciblées**, pas une régénération complète |
| **Interruption** | reprise sur une version antérieure de l'objet |
| **Versions** | l'objet est versionné indépendamment de la conversation |
| **Erreurs** | visibles dans l'objet, corrigeables sans tout refaire |
| **Mobile** | l'objet reste lisible seul |

**Applicable à Parrit** — **c'est le modèle le plus proche du nôtre.** Séparer l'entrée, l'objet de travail et le livrable. Le dossier d'opportunité est notre artefact : il survit à la conversation qui l'a créé, il se transforme, il se version.
**À ne pas copier** — l'esthétique de l'éditeur, et l'idée qu'il faut converser pour obtenir un résultat.

### Linear

| | |
|---|---|
| **Point d'entrée** | un objet unique et nommé — l'issue |
| **Objet principal** | l'issue, avec un propriétaire, un état, un cycle |
| **Travail long** | découpé en états courts et nommés, jamais en pourcentages |
| **Progression** | fondée sur le travail réel, pas sur une barre décorative |
| **Complexité** | tout existe, presque rien n'est affiché ; les raccourcis remplacent les menus |
| **Rôle de l'humain** | **ownership explicite** : chaque objet a quelqu'un |
| **Interruption** | changer d'état est instantané et réversible |
| **Versions** | l'historique est une trace d'activité, pas un journal technique |
| **Erreurs** | rares, réversibles, jamais bloquantes |
| **Mobile** | un sous-ensemble assumé, pas une réduction de tout |

**Applicable à Parrit** — **simple first, powerful later.** Un vocabulaire court et constant. Un propriétaire nommé sur chaque décision. Réduire le bruit jusqu'à ce qu'il ne reste que le travail.
**À ne pas copier** — la densité pour utilisateurs experts, et le gris uniforme. Notre public en première lecture n'est pas technique.

### ElevenLabs

| | |
|---|---|
| **Point d'entrée** | un essai immédiat, sans compte ni configuration |
| **Objet principal** | l'agent, puis sa sortie |
| **Travail long** | quatre temps lisibles : configurer, déployer, surveiller, améliorer |
| **Progression** | des tests et des simulations avant la mise en production |
| **Complexité** | sans code d'abord, kit de développement ensuite |
| **Rôle de l'humain** | il pose les limites, écoute, corrige |
| **Interruption** | l'agent est arrêtable, ses limites sont déclarées |
| **Versions** | configurations comparables, historiques d'exécution |
| **Erreurs** | transcriptions et mesures pour comprendre ce qui a raté |
| **Mobile** | secondaire, l'outil est de bureau |

**Applicable à Parrit** — la boucle **déployer → surveiller → améliorer** est exactement notre promesse. Et les garde-fous se **démontrent par le comportement**, jamais par le mot.
**À ne pas copier** — l'éditeur de workflow visuel. Montrer un graphe de nœuds à un dirigeant, c'est lui montrer notre plomberie.

### Vercel

| | |
|---|---|
| **Point d'entrée** | un déploiement, tout de suite |
| **Objet principal** | le déploiement, immuable et adressable |
| **Travail long** | journaux en direct, mais résumé d'abord |
| **Progression** | états nets : en cours, prêt, en erreur |
| **Complexité** | **disponible, pas imposée** |
| **Rôle de l'humain** | il promeut, il annule, il compare |
| **Interruption** | retour arrière en un geste vers un état connu |
| **Versions** | chaque déploiement est une version consultable |
| **Erreurs** | traitées comme un état de première classe, pas comme un accident |
| **Mobile** | consultation, pas édition |

**Applicable à Parrit** — *complexity available, not required*, c'est la formulation la plus utile du lot. Et **traiter chaque état**, y compris l'échec et le vide.
**À ne pas copier** — la culture du journal d'exécution. Un journal dans un hero, c'est un debugger.

### Stripe

| | |
|---|---|
| **Point d'entrée** | un objet métier canonique — paiement, client, facture |
| **Objet principal** | l'objet financier, avec un cycle de vie strict |
| **Travail long** | états explicites et non ambigus |
| **Progression** | la chronologie d'un objet, pas une animation |
| **Complexité** | personnalisation volontairement limitée, patterns constants |
| **Rôle de l'humain** | rôles et permissions ; tout le monde ne peut pas tout faire |
| **Interruption** | les actions engageantes demandent une confirmation explicite |
| **Versions** | traçabilité complète, immuable |
| **Erreurs** | codées, documentées, actionnables |
| **Mobile** | consultation et alertes |

**Applicable à Parrit** — **les états ne se confondent jamais.** Préparé, validé, enregistré, envoyé, confirmé sont cinq choses différentes. Et une action engageante ne se déclenche pas par accident.
**À ne pas copier** — la sobriété administrative. Parrit doit rester singulier.

### Figma

| | |
|---|---|
| **Point d'entrée** | un fichier partagé |
| **Objet principal** | le cadre, et le prototype qui le fait vivre |
| **Travail long** | itération continue, pas de livraison unique |
| **Progression** | l'objet lui-même est la progression |
| **Complexité** | disponible dans les panneaux, absente de la toile |
| **Rôle de l'humain** | il compare des directions **côte à côte** avant de trancher |
| **Interruption** | historique de version, retour à un point nommé |
| **Versions** | nommées, comparables |
| **Erreurs** | réversibles par nature |
| **Mobile** | revue et commentaire |

**Applicable à Parrit** — **tester le comportement avant de construire**, avec des données réalistes, et **comparer deux directions au même instant**. C'est exactement la méthode de ces tranches : Paper contre Ink, V2 contre Premium, Concept D contre le hero.
**À ne pas copier** — la toile infinie et les panneaux d'outils.

---

## 2. Le modèle Parrit

### Object First

L'objet métier est au centre, en permanence : dossier, contrat, incident, campagne, demande, commande. **Les agents ne sont visibles que par leurs effets sur cet objet.** Jamais une liste d'agents, jamais un organigramme de la machine.

### Simple First

| Niveau | Contenu | Visibilité |
|---|---|---|
| **1** | objet · état · action · décision · résultat | toujours |
| **2** | source · propriétaire · confiance · permission | surfaces actives et contextuelles |
| **3** | journaux · versions détaillées · règles · provenance · événements techniques | **jamais par défaut** |

L'expérience doit être comprise **avec le seul niveau 1**.

### Progressive Disclosure

Le niveau 2 et le niveau 3 sont atteignables par survol, focus, inspection, ouverture, mode avancé ou démonstration longue. Ils n'encombrent jamais la lecture principale.

### Human Ownership

Toute décision sensible affiche **qui décide, pourquoi, quelle information manque, ce qui se produit après, et ce qui ne se produit pas**. Cette dernière ligne est la plus importante : c'est elle qui distingue un système contrôlé d'un système qui promet.

### Interruptibility

Toute opération longue expose progression, pause, correction, annulation, reprise, et retour arrière quand c'est possible. **Dans le hero, on montre l'arrêt ; dans la démonstration longue, on le pilote.**

### Concrete Output

Sept états qui ne se confondent jamais : **préparé · validé · enregistré · envoyé · confirmé · échoué · annulé.**

Un système qui dit « fait » sans préciser lequel de ces sept est un système auquel on ne peut pas faire confiance.

---

## 3. Application

### Le hero — `/art-direction-lab/product-living-hero-proof`

Cinq chapitres, un seul visible à la fois, 12,5 secondes :

1. **Demande reçue** · 2 000 ms
2. **Informations vérifiées** · 2 500 ms
3. **Contexte manquant** · 2 000 ms
4. **Validation humaine** · 2 300 ms
5. **Action préparée** · 2 300 ms

Puis 1 400 ms de respiration. La boucle précédente tenait en 9,3 s : trop rapide pour quelqu'un qui découvre.

À chaque chapitre : **une surface active, un focus, une transformation.** Le contrat `focus` — `signal`, `verification`, `missing_information`, `human_decision`, `output` — est la seule chose qui décide de ce qui domine.

**Séparation des cinq rôles**, perceptible sans explication :

| Rôle | Dans le hero |
|---|---|
| L'entrée | la demande reçue, une phrase |
| L'objet métier | le dossier d'opportunité, permanent en bas du panneau |
| Le workspace | les deux vérifications du chapitre 2 |
| La décision humaine | le chapitre 4, avec un visage réel et une attribution |
| Le livrable | les trois destinations du chapitre 5 |

**Concrete Output tenu au mot** : le chapitre 5 dit *« Rien n'a été envoyé sans vous »* et le message est *« Préparé, prêt à partir »*. Préparé n'est pas envoyé.

### La démonstration longue

Elle porte tout ce que le hero refuse : provenance, sources, versions, branches, règles, permissions, retour arrière, mémoire, pause, pas à pas. Le lien y mène, secondaire, et **le même objet métier et le même scénario s'y retrouvent**.

### Mobile

*Complexity available, not required.* Un chapitre par écran, la preuve dans le premier parcours, l'appel à l'action sous elle. Les paires clé / valeur passent en colonne sous 360 px plutôt que de comprimer la valeur jusqu'au débordement.

### Appel à l'action

Un seul, dominant. **Aucun bouton à l'intérieur de la preuve** : la scène est une preuve, pas une seconde navigation. Le lien vers la démonstration longue est visiblement secondaire.

### Confiance

Le système montre par son comportement ce qu'il peut faire, ce qu'il ne peut pas, quand il s'arrête et qui décide. **Le mot *garde-fou* n'apparaît nulle part.**

---

## 4. Tests

`node scripts/hero-proof-qa.mjs`

| Test | Ce qu'il vérifie |
|---|---|
| **Object First** | l'objet métier est présent dès le premier chapitre, et aucun agent n'est nommé |
| **Progressive Disclosure** | aucun terme de niveau 3 affiché — identifiants, règles, versions, horodatages, provenance |
| **State Legibility** | chaque chapitre porte un titre de 2 à 5 mots et une information de 12 mots maximum |
| **Human Ownership** | la décision est attribuée, et la conséquence négative est dite |
| **Concrete Output** | *préparé* et *envoyé* ne sont jamais confondus |
| **One Primary Action** | un seul appel à l'action commercial, aucun bouton dans la preuve |
| **Complexity Available** | le lien vers la démonstration longue existe et pointe vers le même scénario |
| **Mobile One Moment** | une seule transformation majeure par écran |
| **Demo Honesty** | la mention de démonstration est visible en permanence |
| **Five Chapter** | les cinq chapitres, dans l'ordre, plus la respiration |
| **Human Pace** | chaque chapitre tient au moins 1,8 s, l'arrêt au moins 2 s |
| **One Focus** | un seul focus, une seule surface active à chaque échantillon |
| **No Overflow** | huit viewports, de 320 × 568 à 1728 × 1117 |

Plus les contrôles historiques : structure de conversion, copy inchangée, absence de jargon, contraste WCAG, mouvement réduit, veille de l'onglet, démontage, WebKit.

**Retell Test — il appartient à Paul.** Mode présentation : `?presentation=1`. Une boucle, puis « qu'est-ce que tu viens de voir ». Réponse attendue : une demande arrive, le système vérifie, une information manque, un humain décide, une action est préparée.

---

## 5. Ce qu'on refuse d'importer

- La conversation comme interface principale.
- L'éditeur de graphe de nœuds.
- Le journal d'exécution en façade.
- La densité pour experts en première lecture.
- Le gris uniforme et la sobriété administrative.
- Toute couleur, tout composant, toute typographie de ces produits.

## 6. Arbitrages restant humains

1. **Le Retell Test.** Rien d'autre ne dit si la boucle est comprise.
2. **Paper ou Ink** — Ink est le traitement principal depuis cette passe, Paper reste comparable.
3. **La durée** : 12,5 s est-il encore trop long pour un premier écran.
4. **Le visage au chapitre 4** : garder, agrandir, retirer.
