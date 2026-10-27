# Devenir partenaire, 27/10/2026

Source : `PAGE-DEVENIR-PARTENAIRE.md`, décision de Paul du 27/10/2026.
Dépôt `parrit-site`, branche `feat/devenir-partenaire`, baseline
`dbfaa0066aae60671e3f70bd9653ae8e900e94ab`.

## Livraison

`/become-a-partner` et `/fr/devenir-partenaire` partagent un composant serveur
dans `src/system`, le layout, l'en-tête et le pied de l'accueil. Le proxy
réécrit l'URL française vers la page commune. Canonical, hreflang, Open Graph,
sitemap et bascule utilisent le même contrat de langue ; paramètres et fragment
sont conservés par la bascule. L'accueil mène à la page de sa langue via un
bouton ghost sous la légende de l'équipe.

Une seule action rose, lien exact vers le formulaire, nouvel onglet avec
`noopener noreferrer`, aucun paramètre ni formulaire embarqué. Couleurs,
tailles de texte et espacements ajoutés reposent sur les jetons existants.
Trois colonnes sur ordinateur, pile sur téléphone. H1 à 40 px sur ordinateur,
32 px sur téléphone ; corps et notes à 16 px. La note de confidentialité se
place à côté du bouton sur ordinateur et après celui-ci sur téléphone pour
tenir dans un écran, pied inclus. La mention anglaise reste sous le bouton.

## Écarts de texte imposés par les contrôles existants

Aucun motif, seuil ou exception anti-slop/claims n'a été assoupli.

| Élément | Spec | Texte livré | Contrôle déclenché |
|---|---|---|---|
| Durée FR | `7 à 10 minutes` | `sept à dix minutes` | `noOffer` relève `10 minutes` |
| Qualiopi FR | `La certification Qualiopi n'est pas exigée.` | `Qualiopi n'est pas exigée.` | `certificationClaims` relève aussi une négation |
| Qualiopi EN | `Qualiopi certification is not required.` | `Qualiopi is not required.` | Même contrôle |
| Responsable FR/EN | `Paul Larmaraud (Parrit.ai)` | `Parrit.ai` | Identité personnelle interdite hors accueil/légal |
| Adresse visible FR/EN | `paul.larmaraud@parrit.ai` | `nous contacter` / `contact us` | Même contrôle, y compris dans une adresse visible |

Le lien conserve exactement `mailto:paul.larmaraud@parrit.ai`. La note conserve
les droits de consultation, correction et suppression. Les autres textes,
notamment les titres, l'accroche, les limites de mission et de transmission,
sont ceux de la spec. La durée EN reste telle que spécifiée.

## Validation

| Contrôle | Résultat |
|---|---|
| `npm ci` | Réussi, lockfile inchangé |
| Baseline build Webpack + `npm test` | 113/113 tests |
| `npm run lint` | Réussi |
| `npm run build -- --webpack` | Réussi, TypeScript strict |
| `npm test` | 117/117 tests |
| `npm run qa:brand:rev01` | Réussi |
| `npm run qa:claims:rev01` | Réussi |
| `npm run test:brand-os` | 19/19 tests |
| Découverte Playwright dédiée | 18 tests, aucun navigateur lancé |
| Revue adverse indépendante | Aucun défaut bloquant identifié |

Les audits anti-slop et contraste, qui détenaient encore des listes séparées,
utilisent désormais `public-routes.ts`. Le rendu compilé sans socket couvre
aussi la nouvelle page dans les deux langues, avec blocage de toute sortie
réseau. Les assertions existantes sont conservées. Une première extension du
mock de chemin avait supprimé le contexte du test d'alias d'article français :
le mock a été corrigé, sans toucher à son assertion ni au Journal.

Les quatre nouveaux tests Node vérifient rendu serveur, limites de publication,
URL exacte du formulaire, métadonnées, lien accueil, proxy, négociation,
paramètres, hints falsifiés et sitemap réciproque. Les tests Playwright couvrent
les réponses HTTP, langues avec/sans JS, cookies, géométrie, captures 1440/375,
et section partenaires à 1440×800, 1280×720 et 390×700. Ils emploient le deny-all
global ; le lien externe n'est jamais chargé. Ils rejoignent `qa:network:rev01`.

## Preuve encore requise sur l'hôte

Conformément au mandat, aucun serveur à l'écoute ni navigateur n'a été lancé.
La géométrie, les captures, le contraste calculé et la navigation réelle ne sont
donc pas déclarés validés. Sur l'hôte, lancer le serveur du build sur le port
3210 puis `npm run qa:network:rev01` ; la nouvelle spec y est incluse.
Vérifier en particulier la page entière à 1280×720 et les partenaires FR sur
téléphone en mouvement réduit, toutes les offres présentes.

Écritures limitées au worktree local et à ce périmètre ; aucune donnée métier,
aucun service externe, aucun envoi. Réversible par revert du commit unique.
La spec préexistante non suivie est incluse sans modification. Aucun push,
aucun déploiement ; aucune preuve de production revendiquée.
