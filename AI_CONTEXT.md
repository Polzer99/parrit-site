# AI Context

## Architecture actuelle

Site public Parrit.ai : Next.js 16.2.2 (App Router), React 19, TypeScript strict, Tailwind v4. Déploiement Vercel depuis `main`, Node.js 24.x (`.nvmrc`). Lire `AGENTS.md`, puis `TRUTH.md` avant tout changement de contenu ou de conversion. La spec validée `docs/CODEX-SPEC-2026-09-06-site-integral.md` décrit les lots du 06/09/2026.

L'application publique canonique vit dans `src/app/(rev01)/` : `/`, `/manufacture`, `/standard`, `/dossiers`, `/commission`, `/journal`, `/journal/[slug]`, `/journal/rss.xml`, `/legal` et `/sketch/[id]`. Le layout du groupe charge les polices, tokens, styles et la command bar. La home simplifiée porte `QuickCapture` hero et `AgentEsquisse`, puis les métriques et les sections éditoriales. `Opening` reste dans le code mais n’est plus rendu (décision Paul 06/09/2026). Les cinq pages intérieures ont leur copy FR/EN dédié.

Le copy vit dans des dictionnaires `DICT` par page et dans les composants localisés. `src/proxy.ts` choisit `fr` ou `en` via `?lang=`, puis cookie persistant, puis `Accept-Language` (français pour un navigateur français, anglais sinon). Il transmet la langue via l'en-tête défini dans `src/system/locale.ts` ; `src/lib/server/locale.ts` la lit côté serveur. Aucun préfixe de route n'est nécessaire ; les anciennes routes préfixées sont redirigées dans `next.config.ts`. Les articles du Journal conservent leur langue d'origine.

## Canon visuel

Le prototype REV 03 `docs/site-prod-rev01/parrit-command-center-rev03.html` fait autorité ; `src/system/tokens.css` porte les valeurs et `src/system/` les composants. General Sans pour le corps/UI, JetBrains Mono pour le registre technique, Fraunces pour les grands titres éditoriaux. Polices auto-hébergées dans `public/fonts/rev02/` ; polices OG dans `src/og-assets/`.

`BRAND.md`, `docs/design-system/` et `design-source/` sont historiques. Ne pas restaurer la palette crème, les anciens logos, Geist ou IBM Plex. Les images OG lisent les couleurs via `token()` ; `next.config.ts` inclut le CSS et les polices dans leurs bundles. CalInline résout les variables CSS du parent avant de les transmettre à l'iframe externe.

## Conversion et données

`QuickCapture` poste vers `/api/interet`. Sa variante hero propose `idee` optionnelle (300 caractères) ; `src/lib/server/interets.ts` la range dans `metadata.interets_declares[].idee_prototype`. Les écritures métier passent par le serveur ; aucun secret côté client. `RegisterInterest` reste disponible dans le code mais n'est plus utilisé sur les pages.

`AgentEsquisse` est un échange déterministe local, sans backend ni LLM, avec un événement analytique au premier envoi. `/commission` porte `ParritCalInline` puis une capture standard. `NewsletterCapture` porte l'abonnement sur le Journal et la home. Les esquisses privées `/sketch/[id]` restent noindex et dynamiques ; leur UUID est le jeton d'accès.

## Journal et zones sensibles

Les entrées sont dans `content/journal/*.mdx`, lues par `src/system/journal.ts`. Ne pas modifier ces articles dans une purge d'identité. Le publisher `scripts/publish-journal.mjs` passe les gates de `scripts/journal-gates.mjs` puis le contrat de validation. Sa publication hors dry-run utilise git et pousse sur `main` : ne pas l'exécuter pendant un lot interdisant git.

Les registres `src/lib/registry/` restent des données legacy : éviter les transformations larges. L'entrée de ressource du détecteur dont la route n'existait plus a été retirée au lot 3. Aucun changement de schéma de base dans ce lot.

## Surfaces retirées

`src/app-rev01/` et la route de debug `src/app/system/` sont supprimés ; `/system` répond 404. Le microsite et ses assets dédiés sont archivés dans `archive/camp-costa-rica/`, hors routing Next et hors `public/`. L'archive est exclue de TypeScript et ESLint. La redirection permanente `/camp-costa-rica/:path*` vers `/` vit dans `next.config.ts` ; le proxy ne contient plus de rewrite de domaine camp. `/paul` et `/maxime` restent redirigées vers `/`.

## Vérification

Pour chaque lot : `npm run lint`, `npx tsc --noEmit`, `npm run qa:brand:rev01`. La gate de marque parcourt les deux arbres actifs `src/system` et `src/app/(rev01)` et interdit les hex hors tokens, y compris dans CalInline. L'hôte exécute `npm run build` et `npm run qa:network:rev01` avec le serveur sur le port 3210 ; ne pas lancer de serveur dans ce sandbox. Tous les tests e2e doivent utiliser le deny-all réseau partagé. La spec `tests/rev01-system.spec.ts` verrouille désormais la 404 et conserve l'autotest de blocage réseau.

Aucun appel runtime à `*.vercel.app`. Aucun changement de schéma sans migration. Aucun secret committé. Le lot 3 interdit toute commande git ; Paul reste responsable du merge.
