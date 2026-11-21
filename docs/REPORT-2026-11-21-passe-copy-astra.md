# Passe de copy du 21/11/2026

## Périmètre et état initial

- Demande : appliquer `docs/CODEX-SPEC-2026-11-21-passe-copy-astra.md` dans le dépôt courant, sans commit, push ni déploiement.
- Référence : branche `codex/docs-CODEX-SPEC-2026-11-21-passe-copy-astra-md`, HEAD `a1ab61ad383d178b3a257d223bd5cc04f5f1c1b6`.
- Seul changement initial : la spec non suivie. Fichier conservé à l'identique, SHA256 `bd1e8dc7499e26798dd1d9a228c39d7d4683d618529ddff19be27746e7012ff1`.
- Instructions lues : `AGENTS.md`, contexte courant `AI_CONTEXT.md`, `TRUTH.md`, `DESIGN.md`, spec et guide Next installé sur les métadonnées.
- Écritures : fichiers locaux de texte, tests et documentation ; aucune donnée métier, aucun système client. Changements réversibles par diff, référence Git disponible, spec préexistante préservée.

## Modifications

- `src/system/home-goals.ts` : objectifs, résultats et libellés des nœuds FR/EN ; chemins et nœuds renommés ensemble, identifiants des objectifs conservés.
- `src/system/home-layers.ts` : métiers, bénéfice de gouvernance, trois réponses FAQ et fragments des titres technologies/contact. La FAQ visible et le FAQPage utilisent toujours le même registre.
- `src/system/single-page-copy.ts` : traductions des étapes, partenaires et titres ; suppression des deux clés biographiques.
- `src/system/components/SinglePage.tsx` : textes français exacts ; contact avec son nouveau titre et un seul paragraphe de travail en équipe. Portrait, action, e-mail, calendrier et formulaire conservés.
- `src/system/components/QuickCapture.tsx` : phrase sous le formulaire FR/EN.
- `src/system/booking.ts`, `src/system/pages/booking.tsx` : titre visible, description et titre de métadonnées distinct, pour obtenir « Premier échange, 15 minutes · Parrit.ai » dans l'onglet.
- `src/system/pages/journal.tsx` : en-tête FR/EN et description partagée avec les métadonnées du Journal.
- `scripts/generate-llms.mjs`, `public/llms.txt` : présentation de l'équipe/contact alignée ; ordre et FAQ régénérés par le script.
- `AGENTS.md`, `TRUTH.md`, `AI_CONTEXT.md` : décision et état de livraison documentés.

Aucun changement de CSS, dépendance, verrou de dépendances, contenu d'article, `src/system/pages/home.tsx` ou `src/system/jsonld.ts`. H1 et métadonnées de l'accueil conservés. Aucune reprise de la PR #389.

## Tests

Ajout de `tests/passe-copy.test.mjs` : quatre tests FR/EN sur le rendu du contact (titre assemblé, unique paragraphe d'équipe, absence de biographie, portrait et actions), le titre technologies et l'en-tête/métadonnées du Journal. Imports externes non simulés interdits par le chargeur existant.

Assertions de texte actualisées dans :

- `tests/action-unique.test.mjs` ; étiquette « Chercheurs du MIT » et contrôles FAQ conservés.
- `tests/booking.test.mjs`, `tests/booking-render.test.mjs`, `tests/booking.spec.ts` ; ajout du contrôle du titre de métadonnées, du titre HTML compilé et du titre d'onglet.
- `tests/intentions.test.mjs`, `tests/fixtures/contact-expectation.json`, `tests/fixtures/home-faq-opening.json`.
- `tests/single-page.test.mjs`, `tests/technologies.test.mjs` : nouveaux titres exacts.
- `tests/brand-os-render.test.mjs` : reconnaissance exclusive de la phrase imposée « Nous construisons votre outil à partir de votre métier. ». Elle contient « à partir de », mais ne décrit aucun prix. Le garde-fou général des offres et prix reste identique ; aucune exception générique ajoutée.

Aucun test supprimé ni seuil géométrique, de contraste ou de stabilité modifié. `doctrine-visible` et le script `false-claims-check` restent inchangés.

## Résultats d'exécution

| Vérification | Résultat |
|---|---|
| `npm ci` | Réussi, 462 paquets installés ; lock inchangé |
| Référence : lint, build Webpack, `npm test` | Réussis ; 803/803 tests |
| Tests ciblés avant batterie complète | 92/92 |
| Nouveaux tests et réservation | 12/12 |
| Candidat : `npm run lint` | Réussi |
| Candidat : `npm run build -- --webpack` | Réussi, 96 pages générées |
| Candidat : `npm test` | 807/807, aucun ignoré |
| `npm run test:brand-os` | 19/19 |
| `npm run qa:brand:rev01` | Réussi |
| `npm run qa:claims:rev01` | Réussi |
| Audit des 34 lignes de la spec dans le rendu FR accueil/formulaire/rendez-vous/Journal | Tous les nouveaux textes présents, tous les anciens absents des surfaces visées |
| `git diff --check` | Réussi |

Premier passage complet candidat : 802/807. Les cinq échecs provenaient du titre contact, du titre technologies et de la phrase « à partir de votre métier ». Seules les attentes de ces textes autorisés ont été adaptées ; deuxième passage 807/807.

Les tests de pages compilées rendent le vrai build Next sans ouvrir de socket, avec blocage des accès réseau. Ils prouvent le HTML et les métadonnées, pas la géométrie ni l'hydratation dans un navigateur.

## Limites et occurrence résiduelle

- Node utilisé : **26.12.1**, npm **11.20.0**. Node 24, demandé par `.nvmrc`, ne démarre pas sur cet hôte : `libsimdjson.33.dylib` manque. Rejeu Node 24 requis sur un hôte fonctionnel.
- `npx next start -p 3210` échoue avec `listen EPERM`. Le lancement de `tests/booking.spec.ts` échoue avant navigation : Chromium `MachPortRendezvous`, permission refusée, `SIGTRAP` ; 1 échec de lancement, 15 cas non exécutés. Aucune validation visuelle, géométrique ou CLS revendiquée. Batterie réseau navigateur à rejouer sur hôte autorisé.
- La collecte complémentaire Playwright (`--list`) a été rejetée par le contrôle automatique d'approbation : le garde WhatsApp a identifié à tort une touche simulée dans cette commande de tests. Aucun message n'a été envoyé ; aucun contournement entrepris.
- Le scan littéral des 34 anciennes phrases dans tout `src/` et `public/` retrouve une seule occurrence : « Paul Larmaraud, fondateur de Parrit.ai » dans `src/system/components/JournalMachineBody.tsx`, signature des articles automatiques. Elle est conservée : le remplacement est spécifié pour le titre du contact et le Journal n'est visé qu'en son en-tête. La consigne globale de recherche entre donc en tension avec ce périmètre ; cette exception est signalée, sans prétendre à zéro occurrence dans tout le dépôt. Une clarification facultative a été proposée ; en l'absence de réponse, la signature existante et ses tests sont préservés.

Aucun commit, push, déploiement ni modification de l'index Git. Aucun secret consulté. La preuve en production n'a pas été recherchée : elle relève du script et de la validation après livraison.
