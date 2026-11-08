# Appel de 15 minutes, lot A : seconde reprise sur `main` à jour

Niveau de risque : élevé (même contenu que le lot A, validé par Paul le 08/11/2026 ; PR #366 relue, 434 tests navigateur verts sur l'hôte). Aucun changement de fond.

## Pourquoi

La PR #366 (branche `codex/docs-appel-15-min-REPRISE-SUR-MAIN-md`, commit `faee226`) est en conflit avec `main` depuis la fusion de #367 (accueil par couches) et #365 (boutons par intention), sur `AGENTS.md`, `AI_CONTEXT.md`, `package.json` et `tests/anti-slop-copy.spec.ts`. Le bac à sable ne permet pas de fusion git : on rejoue le diff sur `main`.

## Travail

1. Lire le diff de référence, en lecture seule : `git diff f124fae86 faee226 -- . ':(exclude).codex-handoffs'`.
2. Le reproduire dans le dépôt courant, basé sur `main` à jour : `/rendez-vous` et `/fr/rendez-vous`, `src/system/booking.ts`, `BookingCall`, `booking.css`, registre des CTA, `buildRdvHref`, proxy, blocs en fin d'article et de thème, tests (`tests/booking.spec.ts` et les autres), documents du lot A.
3. Fichiers en conflit : partir de leur version sur `main`, y ajouter l'apport du lot A, sans rien retirer de `main` :
   - `AGENTS.md` : la section « Appel de 15 minutes, décision de Paul du 08/11/2026 » en tête, telle quelle, au-dessus des sections de `main` ;
   - `AI_CONTEXT.md` : le paragraphe du lot A en fin ;
   - `package.json` : garder les scripts de `main` et ajouter ceux du lot A ;
   - `tests/anti-slop-copy.spec.ts` : garder les contrôles de `main` et ajouter ceux du lot A.
4. Interaction avec #365 et #367 : les boutons par intention de l'accueil (sources `intention-*`) et l'ordre des sections de #367 restent tels quels. Les règles du lot A ne s'appliquent qu'hors de l'accueil (articles, thèmes, `/rendez-vous`), comme dans la spec du lot A. Si un CTA du registre que le lot A pointait vers `/rendez-vous` a été modifié par #365, garder la version de #365 sur l'accueil et appliquer `/rendez-vous` seulement hors de l'accueil. Signaler tout cas douteux dans le compte rendu, sans trancher le fond.
5. Aucun fichier sous `.codex-handoffs/`, aucune copie de la spec sous `tmp/`.

## Vérification

`npm ci`, `npm run lint`, build Webpack, `npm test`, `npm run qa:brand:rev01`. Claude rejoue la suite navigateur complète sur l'hôte.
