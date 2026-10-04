# Doctrine visible — rapport d’implémentation

Date : 04/10/2026. Base locale : `26dcd2695a8c07c2576e9dc9304b2dbf6e2cf964`,
identique à la base de la spec. **Validation partielle ; ne pas considérer la batterie verte.**

## Mandat, sources et préservation

Lecture préalable : `AGENTS.md`, `AI_CONTEXT.md`, `TRUTH.md`, la spec du lot,
`~/parrit-os/RECURSIVE-AGENT-HARNESS.md`. Documentation Link installée dans
`node_modules/next/dist/docs/01-app/03-api-reference/02-components/link.md` et
vérification Context7 de la transmission des attributs HTML par Link.

La première passe avait la spec comme seul fichier non suivi. À la reprise FIX1, les
20 fichiers modifiés et les quatre fichiers non suivis (spec, rapport, tests navigateur
et Node) étaient déjà présents ; ils ont été conservés. La spec reste inchangée.
Référence de cette reprise : worktree demandé, HEAD `26dcd2695a8c07c2576e9dc9304b2dbf6e2cf964`.
Aucun commit, push, merge, déploiement, accès à une base ou écriture distante.
Cible : checkout local ; modifications réversibles par fichier, base Git comme référence.
Aucune donnée métier concernée. Les intégrations Cal et les comportements de capture
ne sont pas modifiés. Aucun fichier `brand-os*`, police, route, redirection, article,
contenu légal, prix ou texte d’offre hors CTA n’a été changé. PR #296 non reprise.

Plan exécuté : état initial et contrôles → copy/styles ciblés → tests → relecture
indépendante → contrôles identiques → rapport. Le conflit W-32 de la première passe est résolu par l’arbitrage FIX1.
La reprise est bornée au correctif et à une relecture indépendante. Aucune preuve de production revendiquée.

## Fichiers et résultat

| Fichiers | Modification |
|---|---|
| `src/app/(rev01)/page.tsx` | Légende non rendue sans photo ; action déroulement en contour ; lien fondateur explicite ; offres de réservation et CTA final renommés ; Journal signalé anglais, `hrefLang` sur les liens et `lang` sur les titres ; note finale en paragraphe. |
| `src/app/(rev01)/build-with-you/page.tsx` | Ajout note + bouton en contour sous la promesse ; deux anciens CTA renommés ; prix et lien `nextLink` conservés. |
| `src/app/(rev01)/{manufacture,standard,dossiers,systems,sketch/[id]}/page.tsx` | Libellés des boutons de réservation uniquement. |
| `src/system/components/RevHeader.tsx` | Libellés desktop et menu mobile ; action desktop en contour sur l’accueil tant que le hero intersecte le viewport, pleine après sa sortie (IntersectionObserver). Sans JS ou sans observer : contour. Autres pages : pleine. Composant réinitialisé par chemin et observer déconnecté au démontage. |
| `src/system/components/QuickCapture.tsx` | Libellé de réservation après succès uniquement ; aucun comportement changé. |
| `src/system/components/OfferCard.tsx` | Variante `ghost` pour les deux cartes. |
| `src/app/(rev01)/rev01.css` | General Sans 600, casse normale, espacement normal ; CTA du menu mobile et lien fondateur cohérents ; colonne déroulement centrée, mesure 56ch conservée ; preuves `--t-xl` et interligne hérité comme les offres ; note finale et Journal `--text-note` ; ouverture mobile Build With You moins espacée, titre utilisant sa colonne. |
| `src/system/tokens.css` | Alias sémantique `--text-note: var(--t-s)` (16px), absent du dépôt initial ; aucune valeur canon vendorisée modifiée. |
| `src/system/system.css` | Suppression de l’ombre de `.cal-instrument` ; filet conservé. |
| `AGENTS.md`, `AI_CONTEXT.md` | Doctrine des boutons, du libellé header et de l’ombre ; état et limites du lot. |
| `package.json` | Commande `test:doctrine` ; nouvelle spec navigateur dans `qa:network:rev01`. |

Les nouveaux boutons en contour du déroulement, des offres et du hero Build With You
utilisent une bordure `currentColor`, donc la couleur contextuelle de leur texte.
Cela évite de créer des contrôles aux bordures sous 3:1 avec les filets décoratifs
`--rule-l`/`--rule-d`. Aucun seuil ou registre de dette des tests n’a été modifié.
Les variantes existantes ailleurs gardent leurs couleurs, dimensions et rayon.

## Libellés avant / après

| Emplacement | Avant FR / EN | Après FR / EN |
|---|---|---|
| Header desktop/mobile ; clôture accueil ; Manufacture ; Standard ; Dossiers ; Systems ; sketch | Parlons-en / Let's talk | Réserver l'examen / Book the examination |
| Déroulement accueil ; carte Système sur mesure | Réserver un examen / Book an examination | Réserver l'examen / Book the examination |
| Deux CTA Build With You | Réserver l'examen offert / Book the free examination | Réserver l'examen / Book the examination |
| Capture, état succès | Réserver un examen de 15 minutes / Book a 15-minute examination | Réserver l'examen / Book the examination |
| Lien personnel | Rencontrons-nous / Let's meet | Le fondateur : Paul Larmaraud / The founder: Paul Larmaraud |
| Hero Build With You | Aucun bouton ni note | Examen offert de 15 minutes, avec le fondateur / Free 15-minute examination with the founder ; bouton commun |
| Journal accueil FR | Pas de mention | Articles en anglais. |
| Légende déroulement | Paul Larmaraud · Fondateur / Paul Larmaraud · Founder | Non rendue, puisqu’aucune photo n’est rendue |

La note de clôture « 15 min · Un examen, en visio, avec le fondateur » et sa version
anglaise gardent leur texte. Le lien `nextLink` conserve « Réserver un examen pour un
système sur mesure » / « Book an examination for a custom system ». Le lien alternatif
rédigé dans le hero accueil est conservé dans le périmètre protégé de ce hero.

## Tests ajoutés

- `tests/doctrine-visible.spec.ts` : **42 cas** FR/EN, deny-all partagé et service workers
  bloqués. Réservation et typographie sur neuf routes publiques et dans le menu mobile ;
  état succès de QuickCapture (API locale simulée, sans écriture), absence de légende,
  centrage, offres en contour, taille/interligne des preuves,
  langue du Journal, CTA Build With You entièrement dans 390×844, prix hors hero.
  Six captures FR prévues à 1440 et 390 sur accueil, Build With You et Commission,
  avec contrôle du débordement et de l’absence d’ombre Cal. Trafic Cal attendu simulé
  localement, toute autre sortie réseau fait échouer le test.
- Le test d’accent mesure les fonds roses visibles et compte aussi le cadre du hero,
  header inclus. Il vérifie les intervalles verticaux de tous les éléments : deux
  accents séparés de moins d’une hauteur de fenêtre peuvent partager un écran.
  **Le seuil de 844 px, le comptage du cadre et les assertions strictes restent inchangés.**
  FIX1 ajoute dans ces cas le contrôle contour/plein au défilement dans les deux sens
  et après navigation client ; deux cas FR/EN supplémentaires contrôlent le rendu sans JS.
- `tests/doctrine-visible.test.mjs` : **10 cas** de rendu réel du composant sketch
  avec dépendances explicitement simulées, FR/EN × quatre modèles + repli inconnu.
  Vérification du libellé et de la destination ; aucun appel à une base réelle.
  Conservés après FIX1 §3 : ils couvrent exclusivement §8(b), pour la page privée
  explicitement citée au §1.2. Aucun test de métier ou de comportement d’esquisse
  hors lot n’a été ajouté ; aucun test hors périmètre à retirer.

## Tests existants adaptés au contrat changé

| Test | Avant | Après et justification |
|---|---|---|
| `brand-os-render.test.mjs` | Légende fondatrice toujours présente | Présence de la légende équivalente à celle d’une image dans la section déroulement ; FIX1 §1. Aucune autre assertion de ce fichier modifiée. |
| `brand-os.spec.ts` | Deux labels, légende fondatrice puis kicker à 24px | Aucune photo, un seul kicker, aucune légende ; §3. |
| `conformity-home.spec.ts` | Ancien nom de réservation et lien Rencontrons-nous / Let's meet | Nouveaux textes et noms accessibles ; contrôles clavier et destinations conservés ; §1. |
| `conformity-home.spec.ts` | Action texte couleur `rgb(6, 38, 46)` | Variante contour couleur `rgb(73, 97, 103)` existante ; §3. Aucun seuil de contraste changé. |
| `conformity-commission.spec.ts` | Une ombre | Zéro ombre ; §7. |
| `offer-cards.spec.ts` | Trois liens dans Build With You | Quatre liens avec le nouveau CTA hero ; mêmes vérifications de destinations ; §6. |

## Résultats d’exécution — reprise FIX1

Baseline de reprise : lint, claims et brand verts ; `test:brand-os` à 11/12,
unique échec sur l’ancienne assertion de légende, reproduit avant modification.
Un build `.next` fourni par l’hôte est présent à cette reprise.

| Contrôle candidat | Résultat |
|---|---|
| `npm run lint` | Pass. |
| `npx --no-install tsc --noEmit` | Pass. |
| `npm run qa:claims:rev01` | Pass. |
| `npm run qa:brand:rev01` | Pass. |
| `npm run test:doctrine` | 10/10. |
| `npm run test:brand-os` | 12/12, sur le build existant de l’hôte. Corrige l’échec de légende ; ne prouve pas le nouveau JS/CSS du header, absent de ce build. |
| `npm run qa:network:rev01 -- --workers=1 --max-failures=1` | 170 tests collectés ; Chromium bloqué dès le lancement : `MachPortRendezvousServer: Permission denied (1100)`. Un échec d’environnement, 169 tests non exécutés. |
| `git diff --check` | Pass. |
| `npm run build` | Non lancé : interdiction explicite de la spec §8 dans ce sandbox. Aucun serveur lancé. |

## Relecture indépendante FIX1

Une passe en lecture seule n’a identifié aucun défaut bloquant. Son observation sur
le test de légende a été traitée : l’extraction de la section est obligatoire, afin
qu’une section introuvable ne valide pas accidentellement `false === false`.
Cette revue reste statique ; elle ne remplace pas les tests navigateur.

## Blocages et captures

L’arbitrage W-66 de FIX1 est implémenté : plus de question d’arbitrage en attente.
Le test strict d’accent est conservé, complété par les transitions de l’observer.
Le hero et le comportement du formulaire ne sont pas modifiés.

Les six captures FR 1440/390 ne peuvent pas être produites ici : Chromium est refusé
par le sandbox. Le build existant précède FIX1 ; il faut reconstruire sur l’hôte
avant de vérifier le header. La visibilité mobile, le rendu du nouveau contour,
la navigation client et le comptage d’accent attendent cette exécution navigateur.
Aucune preuve visuelle ou de production n’est revendiquée.

À rejouer sur l’hôte :

```bash
npm run lint
npm run test:doctrine
npm run qa:claims:rev01
npm run build
npm run qa:brand:rev01
npm run test:brand-os
npx next start -p 3210
# Dans un second terminal, serveur local disponible :
npm run qa:network:rev01
```

Les captures sont prévues comme pièces jointes des six tests `doctrine FR capture`
dans `test-results/`. La sortie attendue reste une batterie complète verte,
les six captures examinées et le premier écran mobile mesuré, puis la relecture
préversion de Paul prévue par la spec. Aucun commit, push ni déploiement effectué.
