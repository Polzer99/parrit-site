# Spec L6b — Corriger le CONCEPT de la home : humains réels + diagnostic de faisabilité (pas un casting d'agents)

*Repo : parrit-site. Retour de Paul sur la home actuelle : « pas du tout aligné ». Diagnostic : le concept « recruter des agents » (pivot #137 de juin) est celui de l'ennemi (Imova) — des employés virtuels à prénoms qu'on « embauche ». L'identité réelle (canon + appels fondateurs) : des HUMAINS réels, un cerveau rationnel qui dit la vérité, qui rend AUTONOME. Le CTA historique validé (TRUTH.md) était le DIAGNOSTIC, pas l'embauche d'agent.*

## Les 3 corrections (périmètre STRICT, uniquement `src/components/HomeDeux.tsx` + tests)

### 1. CTA hero
- CTA primaire : « Embaucher un agent » → **« Réserver un diagnostic de faisabilité »**, lien vers `/diagnostic` (la page diagnostic conversationnelle existante ; conserver un `?source=home-diagnostic` OU les attributs `data-ph` existants avec `placement="home-diagnostic"`).
- CTA secondaire : « Réserver une démo » → **« Parler à Paul »**, lien vers `/${lang}/rendez-vous?source=home-parler-paul` (mêmes attributs `data-ph`, placement `home-parler-paul`).
- Le CTA du footer (« CTA FINAL ») suit la même logique : primaire = diagnostic de faisabilité.
- H1, badge, lede (avec la ligne « Des humains réels… ») : INCHANGÉS.

### 2. Tuer le casting d'agents à prénoms
- La section « 02 · Catalogue » présente des agents nommés comme des personnes (Mateo, Ava, Priya, Kenji, Amara, Noah, Yuki, Omar) = le pattern « employés virtuels » à supprimer.
- REMPLACER par une présentation par RÉSULTATS déployés, sans prénom ni persona : chaque carte = **la fonction + ce qui tourne réellement** (réutiliser les données existantes du catalogue : fonction, description, badge secteur — supprimer uniquement les prénoms/personas et les initiales `roleInitials`).
  - Ex. : « Commercial & ventes — Acquisition signal-first : signaux publics d'intention → séquences perso → RDV qualifiés, 24/7 » (le contenu descriptif existe déjà ; on enlève « Mateo »).
- Titre de section : garder « Pas des slides. Des agents qui tournent en production. » (aligné identité) mais l'intro dit « des systèmes », pas des collègues : adapter la phrase d'intro si elle personnifie.
- 4 langues (fr/en/pt-BR/zh-CN) : mêmes changements partout.

### 3. Cohérence du reste de la page
- Aucune autre section ne doit personnifier les agents (vérifier « Vous posez le cas », offres, launches : ne pas toucher sauf occurrence de prénom d'agent).
- AUCUN changement sur : hero H1/badge/lede, section terrain, bloc fondateurs, input→output, offres, camps/déclic, pages hors HomeDeux.

## Contexte technique

- Hermès (workflow `hermes-weekly.yml`) n'écrit pas directement la home — pas de conflit. Ne pas toucher `hermes/`.
- La page `/diagnostic` existe (`src/app/diagnostic/`) et capte les leads de manière fiable (lot L1). C'est la destination du CTA primaire. Vérifier que le lien fonctionne pour les 4 langues (la page est hors `[lang]` : lien absolu `/diagnostic`).
- Tests : adapter `tests/instrumentation-e2e.spec.ts` (placements des CTA changent : `home-diagnostic`, `home-parler-paul`, etc.) et `tests/home-identity.spec.ts` si besoin. Ajouter une assertion : plus aucun prénom d'agent (Mateo|Ava|Priya|Kenji|Amara|Noah|Yuki|Omar) rendu sur la home.

## Critères d'acceptation

- CTA hero primaire = « Réserver un diagnostic de faisabilité » → `/diagnostic` ; secondaire = « Parler à Paul » → rendez-vous. Tracking `cta_click` conservé avec les nouveaux placements.
- Zéro prénom d'agent sur la home (les 4 langues) ; les cartes catalogue présentent fonction + résultat, sans persona.
- `npm run lint` + `npm run build` verts ; tests Playwright adaptés verts.
- Diff limité à `HomeDeux.tsx` + tests (+ ce fichier spec).

## Contraintes

- Lire `AGENTS.md` + `TRUTH.md`. Copy sobre, zéro tell IA, pas de tiret cadratin dans le copy.
- Traductions des nouveaux CTA : EN « Book a feasibility check » / « Talk to Paul » ; pt-BR « Reservar um diagnóstico de viabilidade » / « Falar com Paul » ; zh-CN « 预约可行性诊断 » / « 与 Paul 交流 ».
- Modifs minimales, WIP préservé, aucun secret.
