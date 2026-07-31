# 08 — Conversion et architecture de homepage

## Principe

En moins de cinq secondes, le visiteur doit comprendre : **ce que fait Parrit · pour qui · ce qui est réellement déployé · pourquoi Parrit est différent · quelle action effectuer ensuite.**

L'objet de conversion est un **workflow concret**, pas une offre abstraite ni une demande de démo générique. Le visiteur ne choisit pas d'abord une offre : il décrit d'abord un workflow douloureux, et c'est ce qu'il décrit qui le route vers la bonne offre.

Action principale : **tester un cas avec Hermès**. Action secondaire : **parler à Paul**.

Aucune section sans fonction. Une section = une idée dominante.

---

## Architecture proposée

**Ne pas migrer la homepage d'un bloc.** Cette architecture est une proposition documentée, à valider par Paul avant toute implémentation. Elle prolonge l'ordre recommandé dans `brand/10_SITE_AUDIT_CURRENT.md`, qu'elle ne contredit pas.

### 1. Hero

- **Objectif :** poser la promesse et la nature de l'entreprise.
- **Question :** qu'est-ce que Parrit fait, et est-ce que ça me concerne ?
- **Contenu :** promesse (« passez d'une IA qui parle à des agents qui exécutent »), une phrase de qualification, l'entrée workflow.
- **Preuve :** ligne de conditions réelles (périmètre, format, contrainte) sous le titre.
- **Composant :** `HeroLevel0`. **Sans image.** Le Figma canon lui-même est un hero sans photographie.
- **CTA :** décrire un workflow.
- **Friction :** un champ libre fait peur. Proposer trois exemples cliquables qui pré-remplissent.
- **Mesure :** taux d'interaction avec le champ, profondeur de scroll au-delà du hero.

### 2. Preuves immédiates

- **Objectif :** répondre au doute avant qu'il ne se forme.
- **Question :** est-ce que ça tourne vraiment quelque part ?
- **Contenu :** trois cas `input → output`, avec propriétaire humain et périmètre.
- **Composant :** `ProofRailLevel0`. Le rouge marque le passage input → output.
- **CTA :** aucun. Cette section ne vend pas, elle prouve.
- **Friction :** aucun chiffre non vérifié. Un chiffre faux ici tue tout le reste.
- **Mesure :** temps passé, scroll complet du rail.

### 3. Problèmes reconnus

- **Objectif :** que le visiteur se reconnaisse.
- **Question :** est-ce qu'ils comprennent mon problème ?
- **Contenu :** trois à cinq situations de terrain, formulées comme le client les dit, pas comme un cabinet les reformule.
- **Composant :** `SectionHeader` + liste indexée.
- **Friction :** le piège est le ton « nous comprenons vos enjeux ». Écrire la situation, pas l'empathie.

### 4. Systèmes déployés

- **Objectif :** montrer l'objet réel du travail.
- **Question :** concrètement, vous livrez quoi ?
- **Contenu :** ce que l'agent reçoit, ce qu'il fait, ce qu'il renvoie, ce qui reste humain.
- **Composant :** `ProofRailLevel0` étendu, ou `EditorialFigure` si un schéma explique mieux qu'un texte.

### 5. Hermès

- **Objectif :** transformer la preuve en expérience.
- **Question :** je peux essayer ?
- **Contenu :** entrée de workflow, résumé de faisabilité, périmètre et limites affichés.
- **Composant :** `HermesTraceLevel0` + surface de qualification.
- **Attribution obligatoire dans la section.**
- **Friction :** Hermès ne doit pas ressembler à un chatbot de site. C'est un système dont on lit le journal.
- **Mesure :** workflows soumis, résumés générés, passage au RDV.

### 6. Cas d'usage

- **Objectif :** router vers le métier du visiteur.
- **Composant :** grille de cartes plates, angles nets.

### 7. Méthode Parrit

- **Objectif :** rendre le déroulé prévisible.
- **Question :** ça se passe comment, et combien de temps ?
- **Composant :** ladder indexée.

### 8. Résultats et traces

- **Objectif :** montrer l'exécution **et l'exception**.
- **Contenu :** une trace réelle, incluant un `blocked` et un `human-review`. Montrer un chemin d'échec est le signal de crédibilité le plus fort du site.
- **Composant :** `HermesTraceLevel0`.

### 9. Cas clients

- **Objectif :** preuve mesurée.
- **Composant :** `TestimonialShiftLevel0` (avant → après).
- **Contrainte :** pas de nom de client **dans le texte**. Le mur de logos visuel est autorisé.

### 10. CTA final

- **Composant :** `CTASectionLevel0`.
- **Contenu :** retour au workflow, pas à l'offre.
- **Friction :** la newsletter ne doit pas concurrencer ce CTA. Elle passe après, ou au pied de page.

---

## Ce qu'il faut supprimer

- La double porte commerciale en haut de page : deux CTA hero qui demandent au visiteur de choisir une offre avant d'avoir vu une preuve.
- La newsletter en milieu de parcours.
- Toute affirmation de performance sans trace derrière (« déployer un agent lui prend une journée » doit devenir « premier déploiement contrôlé, périmètre X, conditions Y »).

## Ce qu'il faut conserver

- La ligne centrale « d'une IA qui parle à des agents qui exécutent » : elle porte la tension, elle est ownable.
- Le modèle `input → output` : c'est le meilleur dispositif de vente du site.
- Le hero sans image du canon Figma.
- Le mur de logos clients visuel.

## Première tranche recommandée

**Une seule section, de bout en bout : le hero + le rail de preuve, en niveau 0, derrière un feature flag, sur `/fr` uniquement.**

C'est le plus petit changement qui prouve le système : il valide les tokens, le niveau 0, le test d'intégrité structurelle et le modèle de conversion, sans toucher aux neuf autres sections ni aux trois autres langues. On mesure, puis on décide de la suite.
