# Positionnement et deux parcours : compte rendu du 25/10/2026

Implémentation de la spec, révisions 1 à 3, terminée. Les changements existants
ont été conservés et complétés. Les 109 tests Node et les 24 tests Brand OS passent ;
la validation navigateur reste bloquée par le sandbox macOS. Aucun commit, push,
merge ou déploiement effectué. La publication reste soumise à la revue de Paul.

## Modifications et fichiers

Instructions lues avant modification : AI_CONTEXT.md, AGENTS.md, TRUTH.md et le handoff,
y compris sa révision 3. Guides Next installés consultés : page et generateMetadata.
Plan : [positionnement-deux-parcours/plan.md](positionnement-deux-parcours/plan.md).
Le fichier de spec est resté intact.

| Fichiers | Résultat |
| --- | --- |
| `src/app/(rev01)/page.tsx` | Hero et métadonnées logiciels métier/IA FR/EN ; section parcours entre brands et maison ; FormIA ; Laparra dans les deux listes et les deux descriptions PME/ETI, textes prescrits mot pour mot. |
| `src/app/(rev01)/layout.tsx` | Titre anglais par défaut : Business software and AI. |
| `src/app/opengraph-image.tsx` | Deux mentions visibles et alt : SOFTWARE AND AI ; composition conservée. |
| `src/app/(rev01)/rev01.css` | Styles preuve partagés, une colonne à 760 px, note ; retour à la ligne des références clients pour accueillir la longue entrée Laparra sans débordement mobile. |
| `src/system/public-clients.ts` | Liste canonique publique et commentaire daté : Laparra uniquement. |
| `scripts/lib/public-clients.mjs` | Contrôle commun des noms privés connus, exceptions lues dans la liste canonique ; analyse AST du DICT de l'accueil pour les noms nouveaux dans les listes et attributions Chez/At. |
| `scripts/false-claims-check.mjs` | Contrôle clients intégré à la gate ; prose des pages et du Journal contrôlée. |
| `scripts/journal-gates.mjs` | Même règle d'autorisation pour le publisher, sans deuxième liste d'autorisations. |
| `scripts/publish-journal.mjs` | Journal de contrôle corrigé : noms conformes à la liste publique, au lieu de « aucun ». |
| `TRUTH.md`, `AGENTS.md`, `AI_CONTEXT.md` | Passages contradictoires remplacés par les décisions datées : positionnement, rôle du site, prix, clients, Brand OS, polices, audience, marque, CTA, tests. Les autres sections sont conservées. |
| `CLAUDE.md` | Inchangé : importe déjà AGENTS.md, sans règle contradictoire répétée. |
| `src/app/(rev01)/journal/[slug]/page.tsx` | Notice française identifiée par `data-language-note`, sans changement de texte ou de rendu. Le même repère identifie la notice Journal de la home. |
| `tests/journal-language-note.test.mjs` | Quatre cas ajoutés en R3 : rendu réel FR/EN avec et sans badge, notice unique uniquement en FR, description et corps anglais toujours présents. |
| `tests/content-structure.ts` | Assertion commune de cardinalité et texte non vide. |
| `tests/public-clients.test.mjs` | Trois tests de liste publique, mutations de noms fictifs et client privé dans une autre zone du DICT. |
| Tests existants ci-dessous | Assertions de formulations remplacées ; protections de fond conservées. |

H1, libellés et destinations CTA conservés. Aucun lien ni bouton dans parcours,
aucun logo ni lien tiers ajouté. Aucun nouveau token, couleur, police ou rayon.
Le découpage des cinq références reste effectué sur ` · `, jamais sur les virgules.
Aucun changement de dépendance, de schéma, de contenu Journal ou de fichier vendorisé.

## Tests et assertions

Inventaire exhaustif des assertions **avant → après**, avec les expressions qui les
alimentaient : [assertions.md](positionnement-deux-parcours/assertions.md).

| Suite modifiée | Ancien contrôle → nouveau contrôle |
| --- | --- |
| `conformity-home.spec.ts` | Sous-titre, titres et notes exacts → éléments uniques/non vides ; trois titres de dossiers non vides ; action maison repérée par sa section et destination localisée. Quatre cas parcours conservés. |
| `brand-os-render.test.mjs` | Titres, metadata, descriptions, scène, badge, notice Journal, 404 figés → structure non vide, cardinalités, cohérence metadata et balisage bilingue. Contrôle SSR parcours FR/EN ajouté. |
| `doctrine-visible.spec.ts` | Libellés CTA, notes, notice Journal → structure, destinations, cardinalités ; cinq références et texte contenu dans leurs limites au lieu de quatre références insécables. |
| `doctrine-visible.test.mjs` | Libellé CTA exact → action unique, non vide, destination localisée sur les dix scénarios. |
| `audit-truth-copy.test.mjs` | Phrases complètes → propriétés structurelles et assertions sémantiques conservant les limites des affirmations, dates, comptes et clients autorisés. |
| `anti-slop-copy.test.mjs` | Notes et phrase de mail exactes → deux locales renseignées, branche bilingue et liens d'esquisse ; interdictions conservées. |
| `brand-os.spec.ts` | H1, texte du Frame, 404, noms des liens → contenu non vide, langues, actions et destinations. |
| `conformity-commission.spec.ts`, `conformity-standard.spec.ts` | Titres/énoncés exacts → titres accessibles, six engagements renseignés, numéros conservés. |
| `conformity-i18n.spec.ts` | H1 et notice Journal figés → présence et structure ; égalité dynamique de l'article EN/FR conservée. |
| `conformity-journal.spec.ts` | Badge et signature figés → contenu renseigné, date et structure ; certificat et empreinte conservés. |
| `product-scene.spec.ts` | Titre, messages et libellés figés → structure non vide et cardinalités ; marqueurs, heures, anonymisation hors autorisations et géométrie conservés. |
| `systems.spec.ts` | Titres, en-têtes, textes longs → structure ; labels mobiles comparés aux vrais en-têtes ; chiffres, absence de résultats commerciaux, limites et liens conservés. |
| `system-card.test.mjs`, `dossier.test.mjs` | Libellés de champs/sections figés → lignes, sections et valeurs présentes/absentes ; restitution des données et échappement conservés. |
| `harness-certificates.test.mjs` | Badge et lien nommés → balisage renseigné, destination de preuve, absence d'accréditation externe ; validations de certificat conservées. |
| `privacy-corrections.test.mjs` | Paragraphe légal exact → divulgation Cloudflare, cookies/stockage, agrégats, base légale et prestataires. |
| `publish-journal-gates.test.mjs` | Fixture isolée complétée avec les nouvelles dépendances de la gate ; assertions de sécurité inchangées. |

### Relecture des substitutions, révision 3

Tous les diffs d'assertions R2 ont été relus, y compris les fichiers de composants,
les contrôles de données, les métadonnées, la scène produit et les formulaires.
Les substituts ambigus suivants ont été corrigés :

- Notice d'article : `h1 + p` et son équivalent SSR remplacés par
  `[data-language-note]`. Le paragraphe descriptif reste explicitement attendu en
  EN et FR. La bascule de langue conserve ses quatre contrôles de présence/absence.
- Notice Journal de l'accueil : `.doctrine-note` générique remplacé par le même
  repère ; présence FR, absence EN, contenu non vide et contrôle SSR.
- Dossier 26-002 : compter six statuts ne prouvait pas son statut. Les deux objets
  concernés sont maintenant contrôlés : titre limité à la boîte mail, statut de
  commande et absence de statut de production.
- Registre Lemlist : nom et zéro cherchés séparément pouvaient provenir de lignes
  différentes. Les deux lignes localisées associent maintenant nom, transfert en
  cours et zéro ancien point d'écriture. Playwright cible la ligne par sa source,
  puis contrôle ses cellules de statut et de compteur.
- Autonomie : deux champs non vides ne garantissaient pas la promesse. Chaque
  champ doit évoquer la construction suivante sans Parrit, sans épingler la phrase.
- Vie privée : le mot cookie seul pouvait accepter une affirmation contraire.
  La divulgation Cloudflare est unique et doit dire « ni/aucun/no cookie » ; les
  contrôles d'absence de stockage, d'agrégats et de base légale sont conservés.
- SystemCard : une différence entre deux HTML entiers pouvait provenir d'ailleurs.
  Chaque libellé est comparé entre locales ; les valeurs des trois lignes restantes
  sont exactement les données de traitement, sortie et limites fournies au composant.
- 404 : un h1 non vide pouvait ne contenir que sa partie française. Le texte direct
  anglais est exigé aussi ; le conteneur d'actions conserve son rôle navigation et
  un nom accessible, sans imposer ce nom.

Les quatre cas parcours utilisent le même harnais deny-all, FR/EN et 1440×900/390×844 :
section unique, deux h3, aucun lien/bouton, titres et note renseignés, ordre immédiat,
alignement avec maison à ±1 px, grille à 180/20 px, colonnes et absence de débordement.
Les captures sont prévues mais n'ont pas pu être produites ici.

Le test de mutation remplace chaque occurrence du client autorisé dans le DICT
(deux listes et deux descriptions) par `ClientTemoinInterdit` : les quatre variantes
sont rejetées. Un client privé connu injecté dans le kicker est également rejeté.
Les noms autorisés restent acceptés par l'accueil et le publisher.

Aucun test entier supprimé. Les comparaisons exactes conservées concernent les données
ou la cohérence : fixtures, identité juridique, dates, nombres, destinations, langues,
certificats et contenu comparé entre deux rendus. Elles ne figent pas le texte éditorial.

## Résultats d'exécution

Les erreurs intermédiaires des tests en cours de conversion ont été corrigées.
Ces résultats ont été obtenus de nouveau pendant la reprise R3 ; le build a été
exécuté avant les suites Node/Brand OS, qui lisent ses artefacts.
Les résultats ci-dessous correspondent à l'état final ; les tests SSR ont été rejoués
après le build Webpack, car ils consomment `.next`.

| Commande | Résultat |
| --- | --- |
| `npm run lint` | Réussi. |
| `npx tsc --noEmit` | Réussi. |
| `npm test` | 109/109 réussis, aucun test ignoré. |
| `npm run test:brand-os` | 24/24 réussis, ancien blocage du titre supprimé par R2. |
| `npm run qa:claims:rev01` | Réussi, contrôle clients inclus. |
| `npm run build` | Turbopack interrompu après absence de progression en compilation ; non validé. |
| `npm run build -- --webpack` | Réussi, 58 pages générées. |
| `npm run qa:brand:rev01` | Réussi. |
| `npm run qa:network:rev01 -- --max-failures=1 --workers=1` | Chromium bloqué avant navigation : 1 échec d'infrastructure, 315 cas non exécutés. |
| `npx playwright test tests/conformity-home.spec.ts --grep 'home parcours' --list` | Quatre cas reconnus. |
| `git diff --check` | Réussi. |

## Limites et suite de validation

- Chromium échoue au lancement : `bootstrap_check_in ... Permission denied (1100)`.
  Géométrie, contraste et captures ne peuvent donc pas être annoncés validés. Rejouer
  la batterie navigateur sur l'hôte autorisé, avec son serveur de test sur 3210.
  Aucun serveur n'a été lancé manuellement ; ce checkout ne déclare pas de `webServer`
  Playwright. La préparation du serveur reste à la batterie externe annoncée dans le handoff.
- Le build Turbopack reste non validé ; Webpack réussit sans changement du script build.
  Next émet ses avertissements `metadataBase` pendant la génération. Les métadonnées
  des routes sont ensuite contrôlées par le rendu serveur. Node émet un avertissement
  non bloquant de détection ESM pour l'import du fichier TypeScript public-clients.
- Le contrôle de noms nouveaux couvre les listes clients du DICT et les attributions
  explicites Chez/At ; les noms privés déjà connus sont détectés ailleurs dans la prose.
  Il ne prétend pas reconnaître automatiquement toute entreprise inconnue dans du texte libre.

Les captures `.codex-handoffs/**/*.png` étaient déjà modifiées à l'arrivée :
elles n'ont été ni réécrites ni supprimées pendant R3. Aucun commit n'a été créé.
Le script de reprise doit les exclure de son commit, conformément au handoff.

Aucune modification fonctionnelle prescrite n'est laissée de côté. La revue visuelle
et l'exécution complète des tests navigateur restent nécessaires avant publication.
