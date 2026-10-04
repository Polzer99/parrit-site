# Rapport — corrections parrit.ai du 05/10/2026

Implémentation locale de la spec v1 fournie. Aucun commit, push, déploiement ou appel métier réel.
Le seul changement initial était la spec non suivie ; elle est préservée à l’identique.
Source des constats : checkout courant demandé par Paul, code inspecté pendant ce lot (pas une preuve de production).

## Modifications avant / après

- `src/app/(rev01)/page.tsx:188` : Méta FR : retrait de « depuis trois ans » ; suppression des deux entrées credential et de leur section/logo Qualiopi. Les autres blocs restent, image sur disque conservée.
- `src/app/(rev01)/manufacture/page.tsx:26` : Retrait des phrases de délai « Two to four weeks… » / « Deux à quatre semaines… », sans autre changement.
- `scripts/generate-llms.mjs:32` : « certified to » devient « checked against », avec précision que STD-1.0 est un référentiel interne. Retrait de la promesse systématique maintenance/évolution et des trois preuves chiffrées ; titre Proof supprimé car vide.
- `public/llms.txt:19` : Régénération par le script source, sans édition manuelle.
- `content/journal/what-is-a-company-operating-system.mdx:10` : Retrait ancienneté (ligne 10), résultat chiffré (ligne 36), et répétition du volume bloqué (ligne 44, contrôle §1.7). Articles et faits non chiffrés conservés.
- `content/journal/what-is-parrit-ai.mdx:4` : Retrait « For three years » (ligne 8), « certified to » devient « checked against » (ligne 22), volume de signaux et résultat reporting retirés (ligne 30). Les répétitions ont été corrigées pour satisfaire §1.7, sans nouvelle affirmation.
- `src/app/(rev01)/layout.tsx:19` : Injection retirée, constante dormante conservée et commentée avec la décision du 05/10/2026. JSON-LD intact.
- `src/lib/attribution.ts:45` : Persistance 90 jours remplacée par une variable mémoire du document. Capture idempotente de l’arrivée, initialisation possible au premier formulaire, first/last conservés pour compatibilité ; UTMs courantes sous leurs clés historiques. Reset au rechargement / nouvel onglet, maintien en navigation client. Aucune lecture/écriture/suppression de stockage ancien : les anciennes clés ne sont plus utilisées.
- `src/system/components/QuickCapture.tsx:48` : Collecteur propre au formulaire complété par getAttribution(), pour transmettre l’arrivée même après navigation client. Paramètres utm_ et source courants et référent conservés.
- `src/system/components/AnalyticsInit.tsx:7` : Commentaire actualisé : capture en mémoire, sans snippet analytique.
- `src/app/(rev01)/legal/page.tsx:15` : FR/EN : formulaire prototype uniquement, description facultative, langue, origine et attribution de visite ; esquisse locale sans LLM ; absence de mesure navigateur. Retrait n8n, Sheets, PostHog des prestataires. Vercel/Supabase/Telegram/Cal conservés. Date octobre 2026. Base légale, durée et droits inchangés.
- `tests/network-deny.setup.ts:21` : Suppression de la tolérance PostHog : une tentative est maintenant une fuite qui fait échouer le test, tout en restant bloquée.
- `tests/brand-os-render.test.mjs:65` : Ajout assertion absence PostHog dans le HTML des 18 rendus compilés FR/EN ; aucune assertion existante assouplie.
- `tests/privacy-corrections.test.mjs:10` : 7 nouveaux tests : mémoire/navigation sans stockage, nouvelle visite/SSR, interdiction statique stockage, track sans client, layout réellement rendu FR/EN sans PostHog et avec JSON-LD, textes publics corrigés. Layout testé isolément avec dépendances applicatives simulées ; ce test ne remplace pas le rendu Next compilé.
- `package.json:12` : Ajout commande des sept tests autonomes.
- `AI_CONTEXT.md:273` : État architectural et limites documentés.

Aucune version française des deux articles n’existe dans `content/journal/`.
Les titres, hero, prix, CTA, catégorie, photo, styles et paquet Brand OS ne sont pas modifiés.

## Flux vérifiés pour la confidentialité

- `src/system/components/QuickCapture.tsx:116` : POST local /api/interet : email, idée facultative limitée à 300 caractères, intérêt, langue, source, page, UUID, attribution.
- `src/app/api/interet/route.ts:71` : Validation puis écriture serveur ; aucun fournisseur LLM ni webhook n8n.
- `src/lib/server/interets.ts:126` : Description stockée dans metadata.interets_declares[].idee_prototype ; attribution dans la déclaration, prospects et touchpoints via Supabase.
- `src/lib/server/interets.ts:277` : Notification interne mise en file Supabase telegram_queue ; le transport final est extérieur à ce dépôt et n’a pas été exécuté.
- `src/lib/server/supabase.ts:73` : Transport REST vers Supabase, serveur uniquement.
- `src/system/components/AgentEsquisse.tsx:55` : Classification par regex locale ; texte transmis à QuickCapture comme initialIdee, puis uniquement au submit du formulaire.
- `src/lib/server/sketch.ts:53` : Lecture de la déclaration Supabase pour choisir un gabarit déterministe ; aucun appel de modèle.
- `src/app/(rev01)/sketch/[id]/page.tsx:28` : Gabarits localisés statiques.
- `src/system/components/CalInline.tsx:123` : Intégration effective Cal.com, laissée inchangée.
- `src/app/llms-full.txt/route.ts:26` : llms-full utilise l’introduction de llms.txt et les articles : les corrections MDX nettoient aussi ce flux.

`git grep -n posthog src/app/api src/lib/server` : aucun résultat, donc aucune donnée personnelle envoyée à PostHog côté serveur dans ce code.
Recherche OPENROUTER_*, GROQ_*, PARRIT_LEAD_WEBHOOK, fetch et fournisseurs dans src : aucun appel LLM, n8n ou Google Sheets dans ces parcours. Les commentaires de projection n8n décrivent un consommateur externe, pas un appel du site. Son exécution réelle est UNKNOWN, non affirmée dans les mentions.
Vercel est l’hébergement déclaré dans le dépôt ; pas d’interrogation du compte de production.

## Vérifications et limites

- Baseline avant modification : claims vert. Lint et brand bloqués par les dépendances absentes. `npm ci --offline --ignore-scripts` a ensuite installé 462 paquets depuis le cache, sans modifier le lockfile.
- Candidat : lint, TypeScript (`npx tsc --noEmit`), claims, brand et `git diff --check` passent.
- `npm run test:privacy` : 7/7 passent.
- `npm run test:brand-os` : 9/12 passent ; les 3 échecs exigent `.next/server/app` ou `.next/required-server-files.json`, absents faute de build. Aucun seuil ou test n’a été relâché.
- `npm run qa:network:rev01 -- --list` : 128 tests dans 13 fichiers découverts. Exécution navigateur non réalisée : nécessite le build et le serveur hors sandbox.
- Build NON exécuté, conformément à l’interdiction explicite §4 de la spec. Aucun serveur lancé. Pas de preuve de production ni de capture navigateur revendiquée.
- Documentation locale Next consultée après installation (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md`) ; Context7 consulté pendant l’absence initiale de node_modules.
- Relecture indépendante : une faute d’accord corrigée dans la confidentialité FR ; aucun autre finding sur le diff produit. Tests nouveaux non couverts par cette relecture.

À reprendre par le script/hôte : `npm run build`, `npm run test:privacy`, `npm run test:brand-os`, démarrage local port 3210, puis `npm run qa:network:rev01` (deny-all). Preuve attendue : HTML sans injection PostHog et aucun appel PostHog lors de la navigation et du formulaire simulé. Les résultats locaux n’attestent pas le déploiement.

## Contrôle §1.7 — occurrences restantes et justification

Commande de la spec exécutée sur les fichiers suivis. Aucune occurrence dans les pages publiques actives, les articles ou llms.txt. Les occurrences de documentation / tests ajoutées par ce lot décrivent les corrections et ne sont pas rendues.

`src/lib/pillars.ts` reste inchangé : seuls des imports de types et `interet/couverture.ts` consomment le registre ; ce dernier lit slug/keyword, pas translations.title/intro. Aucun rendu public/flux des titres « 14 jours / 14 days » trouvé via git grep des usages getPillar/getPillars/PILLARS. Les cinq occurrences legacy restent donc volontairement.

Inventaire des fichiers et lignes restant dans le grep (hors présent rapport) :

- `AGENTS.md` lignes 48 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `AI_CONTEXT.md` lignes 202 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `design-source/PRODUCTION-HANDOFF.md` lignes 24, 25 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `design-source/offre-autonomie.html` lignes 29, 55, 100 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `design-source/offre-deployer.html` lignes 24, 27, 103 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `design-source/parrit-da.css` lignes 297, 309 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `design-source/site-home.html` lignes 22, 87, 88, 196 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `docs/CODEX-SPEC-2026-09-03-hero-ia-parritai.md` lignes 26 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `docs/CODEX-SPEC-2026-09-04-home-simple.md` lignes 32, 52 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `docs/CODEX-SPEC-2026-09-06-site-integral.md` lignes 42, 129, 148 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `docs/CODEX-SPEC-2026-09-07-geo-seo.md` lignes 20 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `docs/CODEX-SPEC-2026-09-07-journal-articles.md` lignes 40, 48, 65, 91, 99 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `docs/CODEX-SPEC-2026-09-16-copywriting-fd-engineer-realign.md` lignes 14, 29 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `docs/CODEX-SPEC-2026-09-21-home-systems-rewrite.md` lignes 190, 191, 199, 206, 216 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `docs/CODEX-SPEC-2026-09-23-revue-6-personas.md` lignes 32, 36, 334, 338, 343, 347 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `docs/REPORT-2026-10-04-brand-os-v1.md` lignes 11 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `docs/design-system/qa/homepage-seam/snapshot-off.json` lignes 14, 60, 106, 152 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `docs/design-system/qa/homepage-seam/snapshot-on.json` lignes 14, 60, 106, 152 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `docs/pivot-agents/SPEC.md` lignes 44 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `docs/seo-geo/PLAN-INDUSTRIALISATION.md` lignes 36, 37, 55, 60 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `docs/site-prod-rev01/CONFORMITY-REV01.md` lignes 131, 148 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `docs/site-prod-rev01/lots/LOT-B-CONFORMITY-STANDARD.md` lignes 8 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `docs/site-prod-rev01/lots/LOT-R2-HYBRIDE-BC.md` lignes 20 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `docs/site-prod-rev01/parrit-command-center-rev03.html` lignes 593, 784 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `docs/site-prod-rev01/parrit-command-system-rev02.jsx` lignes 468, 733 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `hermes/proposals/2026-07-13.md` lignes 10 : documentation, proposition, prototype ou capture historique hors routes publiques.
- `src/lib/pillars.ts` lignes 58, 66, 74, 84, 91 : registre legacy non rendu (voir preuve ci-dessus).
