# Handoff Codex : formulation juridique de la propriété, faiblesses du lot 1 (26/10/2026)

Ordre de Paul, 26/10/2026 au soir : « cherche les termes juridiques qui permettent de rester tranquilles, corrige les faiblesses et ajuste le contenu », puis « mets en prod ».

## 1. Propriété : une seule formulation, juridiquement tenable

**Pourquoi.** En droit français, une cession de droits d'auteur (le logiciel en est une œuvre) se prouve par écrit. L'article L131-3 du Code de la propriété intellectuelle exige que chaque droit cédé fasse l'objet d'une mention distincte, avec un domaine d'exploitation délimité. Une promesse générale (« vous êtes propriétaire de tout ») ne transfère rien, et elle est fausse pour les briques préexistantes du prestataire, les logiciels libres et les services tiers (modèles d'IA, hébergeurs), qui restent sous leur propre licence. Le site doit donc annoncer **une cession écrite, limitée à ce qui est développé pour le client**, et ne jamais promettre une propriété totale.

**Remplacements exacts** (FR puis EN, mot pour mot) :

| Fichier | Texte actuel | Nouveau texte |
|---|---|---|
| `src/app/(rev01)/page.tsx`, étape « 04 Prendre la main » (FR) | « Le code, les données et la documentation vous appartiennent. Votre équipe apprend à s'en servir à la livraison, et peut le faire évoluer seule, ou vous rappelez Parrit, selon la formule choisie. » | « Le contrat vous cède les droits sur le code et la documentation développés pour vous ; vos données restent les vôtres. Votre équipe apprend à s'en servir à la livraison, puis le fait évoluer seule, ou vous rappelez Parrit, selon la formule choisie. » |
| idem (EN, texte équivalent du même tableau) | (version anglaise actuelle) | « The contract assigns you the rights to the code and documentation built for you; your data remains yours. Your team learns to use it at delivery, then evolves it alone, or calls Parrit back, depending on the chosen formula. » |
| `src/app/(rev01)/standard/page.tsx`, critère 05 (FR), titre | « Vous restez propriétaire du système. » | « Ce qui est développé pour vous vous est cédé par écrit. » |
| idem, texte | « Code, données et documentation compris. Votre équipe peut le faire tourner sans nous. Si vous préférez nous garder en support, cet accès est votre choix, jamais une dépendance imposée. » | « Le contrat cède, droit par droit, les droits sur le code et la documentation développés pour votre projet. Vos données restent les vôtres. Les briques réutilisées, les logiciels libres et les services tiers restent sous leur propre licence et sont listés en annexe. Votre équipe peut faire tourner le système sans nous ; nous garder en support reste votre choix. » |
| idem, critère 05 (EN), titre et texte | (version anglaise actuelle) | Titre : « What is built for you is assigned to you in writing. » Texte : « The contract assigns, right by right, the rights to the code and documentation built for your project. Your data remains yours. Reused components, open-source software and third-party services stay under their own licences and are listed in an annex. Your team can run the system without us; keeping us for support remains your choice. » |
| idem, `metaDescription` FR | « …, propriété complète du client. » | « …, cession écrite de ce qui est développé pour vous. » |
| idem, `metaDescription` EN | « …, full client ownership. » | « …, written assignment of what is built for you. » |
| `src/app/(rev01)/build-with-you/page.tsx`, `outBody` (FR) | « … Le code, les données et la documentation vous appartiennent : pour cette formule, votre équipe le fait tourner sans nous. » | « … Le contrat vous cède les droits sur le code et la documentation produits ensemble ; vos données restent les vôtres. Pour cette formule, votre équipe le fait tourner sans nous. » |
| idem, `outBody` (EN) | phrase équivalente sur « belong to you » / « yours » | « … The contract assigns you the rights to the code and documentation built together; your data remains yours. With this formula, your team runs it without us. » |
| idem, `nextBody` (EN) | « You keep the system, and you keep the method: … » | « The system runs on your side, and the method stays with your team: … » (suite inchangée) ; la version FR équivalente, si elle dit « vous gardez le système », devient « Le système tourne chez vous, et la méthode reste à votre équipe : … » |
| `src/app/(rev01)/manufacture/page.tsx`, `phasesTitle` (FR) | « … en un système qui vous appartient. » | « … en un système qui tourne chez vous. » ; EN équivalent : « … into a system that runs on your side. » |
| idem, phrase finale (FR) | « Vous restez propriétaire de tout, code et données compris. » | « Le contrat vous cède les droits sur ce que nous développons pour vous ; vos données restent les vôtres. » |
| idem (EN) | « You keep ownership of everything, code and data included. » | « The contract assigns you the rights to what we build for you; your data remains yours. » |
| `src/system/site-v1-pages.ts`, 2 occurrences FR | « La propriété du code, l'hébergement, la réversibilité et la maintenance se décident pour chaque projet, par contrat. » | « La cession des droits sur ce que nous développons, l'hébergement, la réversibilité et la maintenance sont écrits dans le contrat de chaque projet. » |
| idem, 2 occurrences EN | « Code ownership, hosting, reversibility and maintenance are agreed for each project, by contract. » | « The assignment of rights to what we build, hosting, reversibility and maintenance are written into each project's contract. » |

**Balayage obligatoire** : après remplacement, plus aucune occurrence publique de « vous appartien », « propriétaire du système », « propriétaire de tout », « propriété complète », « you keep ownership », « full client ownership », « belong to you » dans `src/app/(rev01)` et `src/system` (hors `/legal` et hors commentaires). Ajouter ce contrôle au script de fausses promesses existant (`scripts/false-claims-check.mjs`, ou le contrôle appelé par `qa:claims:rev01`) pour qu'une réintroduction bloque la CI.

Ne pas toucher : `/legal`, les pages `sketch/[id]` (démonstration non indexée), le Journal.

## 2. Schéma du haut de page (faiblesse : trop pauvre)

Composant `src/system/components/ProcessDiagram.tsx`. Aujourd'hui : deux colonnes de deux étapes. Cible : **la même opération, quatre étapes par colonne**, pour qu'on voie ce qui change :

- Aujourd'hui / Today : « Demande reçue » / « Request received » → « Saisie à la main » / « Typed in by hand » → « Vérifiée à la main » / « Checked by hand » → « Relance oubliée » / « Follow-up forgotten »
- Demain / Tomorrow : « Demande reçue » / « Request received » → « Le système prépare » / « The system prepares » → « Une personne valide » / « A person approves » → « Trace consignée » / « Record kept »

Règles : connecteurs `ProcessConnector` existants (VS-CONNECTOR, aucune flèche-caractère) entre chaque étape ; la colonne « Demain » marquée par le jeton d'accent du registre sombre (filet ou repère), aucune couleur littérale ; radius 0, aucune ombre, aucun dégradé ; échelle typographique existante, aucune taille nouvelle ; à 375 px, les deux colonnes s'empilent sans débordement. `figure` garde son `aria-label` ; les étapes restent en texte lisible (pas d'image).

## 3. Dernier appel à l'action (faiblesse : lien texte)

- Accueil, section `H12` : remplacer le lien texte de `.v1-close-rows` par un bouton `rev-button exec` (même libellé, même destination `/commission` ou `/fr/commission`, `avecSource()` si la page l'utilise déjà pour ses autres CTA).
- `src/system/components/SiteV1Page.tsx`, section de clôture : `rev-button ghost` → `rev-button exec`. Le bouton du haut de ces pages reste `ghost`.

## 4. Bande de grain (remarques de relecture de la PR #328)

- Tuile portée de 256 à **512 px** (même grain de 2 px, même densité, même graine), pour que la répétition ne se devine plus sur la largeur de la colonne. Seuil de poids du contrôle : moins de 8 Ko par tuile. Adapter `generate-grain.mjs`, `check-grain.mjs` et leurs tests sans affaiblir les autres assertions.
- Ajouter une respiration de `var(--brand-s6)` au-dessus de la bande (elle est aujourd'hui collée au bloc sombre du haut de page).

## Interdits

- Toucher au positionnement, aux offres, aux prix, aux noms de clients, à `/legal`.
- Toute nouvelle couleur littérale, taille de police, ombre, radius ou dégradé.
- Supprimer ou affaiblir une assertion de test existante ; adapter seulement celles qui portaient sur l'ancien texte ou l'ancienne structure, et le dire dans le rapport.

## Critères d'acceptation

1. Batterie : `npm run lint`, `npm test`, `npm run build`, `npm run qa:brand:rev01`, `npm run qa:claims:rev01`, `npm run test:brand-os` verts ; `npm run qa:network:rev01` sera rejoué intégralement par Claude sur l'hôte.
2. Le balayage de la section 1 est vide et bloquant en CI.
3. Le schéma, le bouton final et la bande sont couverts par au moins un test de structure (pas de libellé figé).

## Branche et PR

Branche dédiée depuis `main`, PR vers `main`, pas de fusion par Codex. Paul a ordonné la mise en production : Claude fusionne après relecture et suite complète verte sur l'hôte.
