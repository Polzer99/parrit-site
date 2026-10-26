# Étape 1 — plan du site, maquettes, textes, existant → cible (26/10/2026)

Superviseur : Claude. Sources : `PARRIT_SITE_SPEC_V1_2026-10-26.md`, `NOTE-CADRAGE.md`, et les trois relevés de `releves/` (audit du dépôt, étude de lecoledelia.com et galadrim.fr, registre des preuves de 44 entrées).

Règles d'écriture de tout texte ci-dessous : langage écrit, phrases complètes, vouvoiement, aucun tiret cadratin ni demi-cadratin, aucun chiffre sans source, aucun nom de personne hors `/legal`, aucun prix.

## 1. Découpage en deux lots

| Lot | Contenu | Pourquoi |
|---|---|---|
| **Lot 1 (maintenant)** | Navigation, accueil H01 à H07, H11 et H12, pages Conseil & Transformation, AI Sprints, Engineering & Intégration et Harness Engineering (FR et EN), retrait de Content Factory, registre de preuves branché (ce qui n'est pas autorisé ne s'affiche pas), adaptation des tests | Tout est publiable avec les preuves existantes |
| **Lot 2 (après tes réponses)** | Réalisations (index et gabarit d'étude de cas), Écosystème (FORMIA et Qualiopi), Partenaires scientifiques, Technologies (H08), H09 et H10 sur l'accueil | Bloqué par des permissions et des faits que toi seul peux trancher (section 7) |

## 2. Plan du site (lot 1 en gras)

| Route FR | Route EN | Statut | Remarque |
|---|---|---|---|
| **/fr** | **/** | refondue | ordre de la section 4 |
| **/fr/conseil-transformation** | **/consulting-transformation** | nouvelle | gabarit T1 |
| **/fr/ai-sprints** | **/ai-sprints** | nouvelle | gabarit T1 + fiche « En bref » |
| **/fr/engineering-integration** | **/engineering-integration** | nouvelle | gabarit T1 + module intégrer / construire / orchestrer |
| **/fr/harness-engineering** | **/harness-engineering** | nouvelle | gabarit T2, page « guide » avec sommaire |
| /fr/realisations, /fr/realisations/[slug] | /work, /work/[slug] | lot 2 | reprend `/dossiers` ; 301 décidée au lot 2 |
| /fr/ecosysteme | /ecosystem | lot 2 | FORMIA et Qualiopi |
| /fr/partenaires | /partners | lot 2 | n'existe pas tant qu'aucun chercheur n'est autorisé |
| **/fr/contact** | **/contact** | 301 vers `/commission` | la réservation reste sur `/commission`, aucun double parcours |
| /systems, /manufacture, /standard, /dossiers, /build-with-you, /journal, /legal | idem | conservées | accessibles par le pied de page ; Build With You inchangé ; aucune suppression au lot 1 |

Chaque nouvelle route entre dans `TRANSLATED_PATHS` (`src/system/locale.ts`), le matcher de `src/proxy.ts`, `src/app/sitemap.ts` et le générateur de `llms.txt`, avec hreflang FR/EN.

## 3. Navigation

Ordinateur : `Conseil & Transformation` · `AI Sprints` · `Engineering & Intégration ▾` (Harness Engineering, Logiciels & agents sur mesure, Intégrations & infrastructures privées) · `Journal` · bouton `Parler d'un projet` vers `/commission`.
« Réalisations » et « À propos ▾ » entrent au lot 2, avec leurs pages. Les deux sous-entrées « Logiciels & agents sur mesure » et « Intégrations & infrastructures privées » pointent vers des ancres de la page Engineering & Intégration au lot 1. « Go-to-Market Systems » n'apparaît pas tant qu'il n'est pas validé commercialement.

Mobile : liste plate sur un niveau en accordéon, une ligne de bénéfice sous chaque entrée, le bouton « Parler d'un projet » reste visible dans la barre après le hero sans couvrir le contenu.

## 4. Accueil, ordre et textes exacts (FR)

```
┌──────────────────────────────────────────────────────────────┐ 1440
│ [P.] PARRIT.AI   Conseil  Sprints  Engineering ▾  Journal [Parler d'un projet] │
├──────────────────────────────────────────────────────────────┤
│ CONSEIL · TRANSFORMATION · ENGINEERING                       │
│ Transformez votre entreprise.                 ┌─────────────┐ │
│ Pas simplement vos outils.                    │ processus   │ │
│ sous-titre (2 lignes)                         │ actuel → cible│
│ [Parlons de votre transformation] [Voir…]     └─────────────┘ │
├──────────────────────────────────────────────────────────────┤
│ Références : 5 noms en texte, chacun avec ce qui a été fait   │
├──────────────────────────────────────────────────────────────┤
│ Conseil & Transformation : Observer → Prioriser → Transformer → Mesurer │
│ Trois exemples (problème / intervention / système / statut)   │
│ AI Sprints : 4 cartes │ Engineering : 3 onglets │ Harness     │
│ Méthode │ Dernier appel                                      │
└──────────────────────────────────────────────────────────────┘
Mobile 390 : même ordre, une colonne, H1 sur 3 lignes, deux boutons empilés visibles sans défiler.
```

**H01 Hero**
- Surtitre : CONSEIL · TRANSFORMATION · ENGINEERING
- H1 : Transformez votre entreprise. Pas simplement vos outils.
- Sous-titre : De la stratégie à la mise en production, nous repensons vos opérations, intégrons les bonnes technologies et construisons les systèmes adaptés à votre métier.
- Boutons : « Parlons de votre transformation » (vers `/commission`) · « Voir nos réalisations » (vers `/dossiers` au lot 1, vers `/realisations` au lot 2).
- Visuel : schéma vectoriel en deux colonnes, « Aujourd'hui » (étapes manuelles d'un processus) et « Demain » (le même processus avec un système et une validation humaine). Composé avec les connecteurs VS-CONNECTOR existants. Pas de robot, pas de fausse interface.

**H02 Références** (titre : « Ce que nous avons fait, et pour qui »)
Un nom par ligne, en texte, avec ce qui a été fait, tiré de la règle d'or n° 6 : Laparra, grossiste en fruits et légumes du MIN de Rungis : un CRM · Clevery Avocats : un agent pour le cabinet · Forexpert : un agent de prospection · Joone : un accompagnement des équipes à l'IA · SNCF : un programme de formation réalisé avec Arkel. Aucun logo.

**H03 Conseil & Transformation**
- H2 : Comprendre vos opérations avant de choisir une technologie.
- Texte : Nous commençons par regarder comment votre équipe travaille aujourd'hui. Nous repérons les tâches qui reviennent, celles qui coûtent du temps et celles qui portent un risque. Puis nous décidons avec vous de ce qui mérite d'être transformé, dans quel ordre, et comment vos équipes s'approprieront le changement.
- Quatre étapes : Observer (les tâches réelles, les outils, les données) · Prioriser (valeur, risque, faisabilité) · Transformer (processus et systèmes, une brique à la fois) · Mesurer (ce qui a changé, avec une méthode décidée au départ).
- Lien : Explorer notre approche conseil.

**H04 Exemples** (titre : « Trois façons dont nous travaillons »)
Trois cartes au format problème / intervention / système / statut, chacune avec son statut écrit en clair :
1. Une carte de visite devient une fiche CRM après validation. Statut : démonstration, données fictives.
2. Un CRM pour un grossiste du MIN de Rungis (Laparra). Statut : réalisé pour le client.
3. Un agent pour un cabinet d'avocats (Clevery Avocats). Statut : réalisé pour le client.
Aucun chiffre de résultat au lot 1 : aucun n'a de méthode ni de période sourcées. « En service » ne s'écrit que si le statut réel est vérifié au moment de publier (règle d'or n° 6).

**H05 AI Sprints**
- H2 : Un problème précis, un système testable, une décision fondée sur des preuves.
- Texte : Plutôt que des mois d'hypothèses, un cycle court sur un périmètre décidé ensemble. La durée dépend du problème et se fixe au cadrage.
- Quatre cartes : Cadrage (besoin, résultat attendu, données, critères de succès écrits avant de construire) · Construction (une brique qui tourne sur vos cas réels) · Évaluation (avec vos utilisateurs, contre les critères du cadrage) · Décision (passer en production, corriger ou arrêter, et pourquoi).
- Ce qui n'est pas livré : un système en production à grande échelle, une promesse de délai fixe.
- Lien : Cadrer un sprint.

**H06 Engineering & Intégration** (module à trois onglets, utilisable au clavier, sans animation obligatoire)
- H2 : Intégrer ce qui existe. Construire ce qui manque.
- Intégrer l'existant : vos outils actuels restent en place quand ils font le travail ; nous les relions entre eux et à vos données.
- Construire le manquant : un logiciel ou un agent sur mesure quand votre métier a un besoin qu'aucun outil ne couvre.
- Orchestrer l'ensemble : un système où chaque étape est tracée, supervisée et réversible.
- Phrase de bas de module : La propriété du code, l'hébergement, la réversibilité et la maintenance se décident pour chaque projet, par contrat.

**H07 Harness Engineering**
- H2 : Le modèle ne suffit pas. Il faut un système fiable autour.
- Texte : Un agent qui réussit une démonstration peut échouer dans vos opérations. Ce qui fait la différence se trouve autour du modèle : le contexte qu'on lui donne, les outils qu'il a le droit d'utiliser, les vérifications avant chaque action, la supervision humaine et le suivi des coûts.
- Lien : Optimiser notre système d'agents.
- Aucune mesure « avant / après » au lot 1 : aucun test n'est encore publiable.

**H11 Méthode** : Comprendre comment vos équipes travaillent · Prioriser · Construire une première brique mesurée · L'intégrer à vos outils · La tester avec vos équipes · L'adopter et la maintenir.

**H12 Dernier appel**
- H2 : Parlons de l'opération que vous voulez transformer.
- Bouton : Parler d'un projet (vers `/commission`, qui garde le calendrier existant).

## 5. Trois pages pivots (gabarit T1 ou T2)

**Conseil & Transformation** : Comprendre, décider, transformer. Problèmes réels (les tâches qui reviennent, les outils qui ne se parlent pas, les projets IA qui ne dépassent pas la démonstration) → ce que nous faisons (diagnostic des opérations et des outils, cartographie des opportunités, priorisation valeur, risque et faisabilité, architecture cible, gouvernance des données, conduite du changement) → livrables (état des lieux, matrice de priorisation, feuille de route, plan d'adoption et indicateurs) → méthode (Observer, Prioriser, Transformer, Mesurer) → contraintes et gouvernance → questions fréquentes → dernier appel.

**AI Sprints** : fiche « En bref » de six lignes (pour qui, point de départ, ce que vous obtenez, ce qui n'est pas livré, comment on décide, suite possible), puis les quatre étapes, les livrables (démonstrateur, critères d'évaluation, synthèse des écarts, décision et suite), les limites, les questions fréquentes. Aucun délai fixe, aucun prix.

**Harness Engineering** (page guide) : sommaire collant ; le problème (performant en démonstration, fragile en production) ; schéma du harnais (instructions, contexte, mémoire, outils, permissions, vérifications, supervision, coûts) ; deux cas d'intervention (construire un harnais neuf, auditer et corriger un système existant) ; protocole d'évaluation (mêmes tâches, critères écrits avant, résultats consignés) ; livrables (audit, liste de corrections priorisée, harnais refait, suite de tests, guide d'exploitation) ; limites ; date de mise à jour ; dernier appel.

**Engineering & Intégration** : le module à trois onglets, puis trois ancres : Logiciels & agents sur mesure, Intégrations & infrastructures privées (sans présumer qu'un fournisseur est souverain au sens contractuel), Harness Engineering (lien vers sa page).

## 6. Existant → cible

| Aujourd'hui | Cible lot 1 |
|---|---|
| H1 « Systèmes intelligents pour les opérations » (PR #322) | H1 « Transformez votre entreprise. Pas simplement vos outils. » |
| Six capacités, dont Content Factory | Trois portes d'entrée + Harness ; Content Factory retirée du site, de `llms.txt`, du JSON-LD et de `TRUTH.md` |
| Navigation à 2 liens (Journal, Systèmes) | 4 entrées + bouton |
| CTA « Réserver l'examen » | « Parlons de votre transformation » et « Parler d'un projet », même destination `/commission` |
| « FormIA, notre organisme de formation » | retiré au lot 1 (relation non tranchée) ; remplacé au lot 2 par la formulation vérifiée |
| Registre `src/lib/registry/preuves.ts` non branché | branché : toute entrée sans permission accordée ne s'affiche pas |

## 7. Questions bloquantes pour toi (lot 2 seulement)

1. Lèves-tu le blocage de la mention Qualiopi ? Les faits sont vérifiés : le certificat ATA 1926 2026 appartient à FORMIA, pas à Parrit.ai, pour les actions de formation, et il est valable jusqu'au 25/05/2029.
2. Orthographe publique : Formia, FormIA ou FORMIA ? Et peut-on écrire « organisme de formation lié à Parrit.ai » sans rien dire du capital ?
3. Quels logos clients as-tu en accord écrit ? Par défaut, aucun logo n'est affiché.
4. Chercheurs : quels noms, quelle affiliation vérifiable, quel rôle, quel consentement ? Sinon, pas de section. Faut-il retirer définitivement le MIT, comme sur les supports Act-On ?
5. Technologies : peut-on citer en texte, sans logo, Supabase, OpenRouter, n8n, Telegram, Claude, Codex et Gemini, avec la mention « intégré en production » ?
6. « Propriétaire » : qui détient le harnais et le CRM de Laparra ? D'ici là, le mot n'est pas employé.

## 8. Hypothèses non vérifiées

- Le délai de réponse à côté du bouton n'est pas affiché : aucun délai n'est engagé à ce jour.
- La mesure d'audience par persona attend une décision privacy-first : rien n'est ajouté au lot 1.
- Les textes anglais sont des traductions relues par Claude, à relire par toi.
