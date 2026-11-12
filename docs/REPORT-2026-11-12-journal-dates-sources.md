# Journal : datation des sources depuis les pages

## Mandat et état initial

Spec : `docs/CODEX-SPEC-2026-11-12-journal-dates-sources.md`, lue avec
`AGENTS.md`, `CLAUDE.md`, l'état récent de `AI_CONTEXT.md`, `TRUTH.md` et le
harnais récursif canonique. Le plan exécuté suit les quatre parties de la spec :
extracteur déterministe, récupération bornée, diagnostics, tests et vérification.

Référence locale explicitement demandée :
`fda6604930c42c663b678d7ed563a35c51099989`.
Seul changement préexistant : la spec non suivie. Son SHA256 est conservé :
`111b050a7361ef52584e5f45dc56475b68cf2e3e6dcbb973a0e4586526d8539a`.
Aucun commit, push, déploiement, envoi ou appel LLM réel.

Périmètre d'écriture : ce worktree local, scripts de la machine, tests associés,
fixtures, documentation et installation de Poppler dans son workflow quotidien.
Aucune table ou donnée distante écrite (0 ligne). Modifications réversibles par
le diff ; référence Git conservée, aucun fichier préexistant supprimé. Les
articles, la file des sujets, `ci.yml`, les modèles, le budget et l'armement de
publication restent inchangés. `llms.txt` régénéré par le build sans différence.
Boucle bornée : implémentation puis deux corrections issues de la revue adverse,
avec tests ciblés et batterie finale. Aucun coût de modèle externe.

## Modifications

- `scripts/journal-machine-gates.mjs` : `extractPublicationDate` applique
  JSON-LD (publication puis création), les dix métadonnées prescrites, time dans
  le premier article/en-tête, URL, texte FR/EN, PDF, soumission arXiv. Les dates
  invalides, futures ou antérieures à 1990 sont ignorées. `modified_at` conserve
  séparément `dateModified`, sans servir à rajeunir la publication. Absence de
  date : `null`, traduit en `sans_date` par la recherche.
- `fetchSource` conserve son retour texte par défaut ; le mode `details`
  retourne aussi la datation et l'URL finale. Le même extracteur est utilisé par
  la porte finale des articles, sans exiger une répétition visible de la date.
  Les métadonnées ne sont pas injectées dans le texte des faits. Limite de 5 Mo
  contrôlée pendant la lecture ; délai total de 15 s, y compris DNS, redirections,
  corps et processus PDF. Les contrôles de domaines/IP/redirections restent actifs.
- Les PDF passent par `pdfinfo -rawdates` et `pdftotext` : métadonnées de création,
  texte et séparation des pages. La datation de repli se limite aux deux premières
  pages ; les faits peuvent venir du texte récupéré du document. Fichier temporaire
  privé supprimé dans `finally`, processus bornés et arguments sans shell.
  L'extracteur reçoit pour un PDF l'objet décodé `{ creationDate, pages, text }`.
- `scripts/journal-machine-research.mjs` : les annotations autorisées deviennent
  candidates même avec JSON absent/invalide ou sans métadonnées correspondantes.
  Genre et éditeur sont inférés quand absents. La date réelle de la page remplace
  celle du modèle avant le contrôle de fraîcheur existant. Les faits proposés
  restent vérifiés exactement dans la page ; sans faits proposés, extraction de
  passages chiffrés du texte récupéré, en excluant les dates/horaires seuls.
  `numericFacts` et la porte des nombres des articles ne sont pas modifiés.
- Au plus 24 candidats sont récupérés, par groupes de quatre, dans l'ordre
  institutions, presse/éditeurs, contradiction ; les diagnostics gardent cet
  ordre malgré des réponses asynchrones. Les candidats excédentaires portent
  `limite_pages`. Seuils de trois sources et quatre faits distincts conservés.
- Diagnostics acceptés : URL, titre, éditeur, date, méthode et nombre de faits.
  Une interruption porte la passe et un message de 200 caractères maximum,
  nettoyé des secrets, y compris dans l'erreur ensuite persistée par la machine.
  Aucun extrait de page ajouté aux diagnostics.
- `scripts/journal-machine.mjs` : date du run transmise au contrôle des pages,
  et sources du dry-run munies de métadonnées synthétiques indépendantes des
  réponses modifiables du modèle.
- `.github/workflows/journal-quotidien.yml` : installation explicite de
  `poppler-utils` avant la machine ; aucune modification de l'armement.
  Documentation Poppler consultée via Context7 pour les options utilisées.

## Tests

42 tests supplémentaires : 41 dans `tests/journal-machine-dates.test.mjs` et
un test de confidentialité dans `tests/journal-machine.test.mjs`.

Couverture : fixtures JSON-LD/meta/time/URL/FR/arXiv et PDF décodé ; dix noms de
métadonnées, ordre de priorité, dates invalides/futures/pré-1990, modification
séparée, formats FR/EN, vrai PDF compressé, limite des deux pages, annotation
absente du JSON, désaccord modèle/page, faits inventés, nombres balisés inline,
dates/horaires seuls, inférence des genres, plafond 24, concurrence 4, ordre des
passes, interruption sans secret, porte finale sans date visible, délai DNS/corps,
limite de taille et redirection vers une URL datée. Réseau réel interdit dans les
tests ; fetch/DNS simulés, Poppler local testé réellement.

Fixtures ajoutées : `tests/fixtures/journal-machine/dates/` et
`tests/fixtures/journal-machine/source-response.mjs`.
Les tests existants modifiés se limitent à `tests/journal-machine*` : leurs
sources simulées portent désormais une date propre dans les métadonnées ; les
anciennes assertions rejetant une date du modèle dès la recherche sont remplacées
par la candidature suivie de la vérification de page, conformément au nouveau
contrat. Aucun test historique hors machine modifié.

## Vérifications

| Vérification | Résultat |
| --- | --- |
| Référence ciblée avant modification | 145/145 tests machine |
| Candidat ciblé | 187/187 tests machine (+42) |
| `npm ci --silent` | réussi, versions du lockfile conservées |
| `npm run lint` | réussi ; rejoué après le dernier correctif |
| `npm run build -- --webpack` | réussi, Next.js 16.3.4, TypeScript inclus |
| `npm test` après build | 519/519 réussis, aucun ignoré |
| `npm run qa:brand:rev01` | réussi |
| `npm run qa:claims:rev01` | réussi |
| `npm run test:brand-os` | 19/19 réussis |
| `node scripts/journal-machine.mjs --dry-run --fixtures` | réussi, `issue=pr`, `simulation=true` ; aucune PR réelle |
| `git diff --check` | réussi |
| SHA256 de la spec préexistante | identique |

La première tentative de suite complète avant build avait donné 468/477 : neuf
échecs faute d'artefacts `.next` dans ce worktree. Aucun test n'a été modifié pour
les contourner ; les 519 tests passent après construction, dans l'ordre prescrit.
Les comparaisons avant/après de la machine portent sur la même commande
`node --test tests/journal-machine*.test.mjs`.

Avertissements préexistants non bloquants : `MODULE_TYPELESS_PACKAGE_JSON` et
`metadataBase` absent. Aucun blocage d'exécution restant. Aucun changement de page
ou de rendu livré ; pas de campagne navigateur ajoutée à la batterie spécifique
aux scripts demandée par cette spec.

Journaux locaux : `/tmp/journal-dates-baseline.log`,
`/tmp/journal-dates-baseline-full.log`, `/tmp/journal-dates-targeted.log`,
`/tmp/journal-dates-final-lint.log`, `/tmp/journal-dates-final-tests.log`,
`/tmp/journal-dates-brand.log`, `/tmp/journal-dates-dry-run.log`.

## Revue indépendante et limites

Revue adverse indépendante en lecture seule demandée par le harnais du dépôt.
Trois défauts reproduits ont été corrigés et couverts : erreur brute encore
persistée, phrases chiffrées coupées par le balisage inline, dates/horaires seuls
comptés comme faits de repli. Recontrôle indépendant des corrections réussi ;
aucun défaut bloquant restant identifié dans le périmètre revu.

Preuve en production : non acquise, conformément à l'interdiction de déployer.
Le prochain run réel devra montrer des annotations absentes du JSON acceptées
avec méthode de datation, puis le franchissement de la porte de matériau.
Aucun résultat live ni amélioration quantitative du run distant n'est affirmé.
Poppler est requis sur tout hôte exécutant des sources PDF ou leurs tests ; son
installation est explicitement prévue dans le workflow quotidien.
