# CODEX SPEC — parrit.ai : lot de corrections (formulations interdites, mesure d'audience, confidentialité)

Date : 05/10/2026 · Auteur : Claude (relecture et merge, §25) · Base : `origin/main` (1fc8995 = production).
**Ce lot sera fusionné et publié** (déploiement automatique). Il ne dépend d'aucun arbitrage ouvert. Décision de Paul du
05/10 : retirer les formulations interdites par le canon, désactiver temporairement PostHog dans le navigateur faute de
justification d'exemption, corriger les informations de confidentialité selon les traitements réels.
**Hors lot, ne pas toucher** : hero, titres, sous-titres, catégorie « company operating system(s) » / « systèmes
d'exploitation d'entreprise » et « Une commande, pas un abonnement » (arbitrages DV-01 à DV-03 ouverts), photo (aucune),
prix, CTA, couleurs. La PR #296 (candidats) ne doit pas être reprise ni modifiée.

## 1. Formulations interdites (`/Users/paullarmaraud/parrit-canon-visual-system/brand/verbal/claims.json`, `blocked`)
Supprimer ou réécrire au plus court, sans ajouter de nouvelle affirmation :
1. `src/app/(rev01)/page.tsx:195` méta FR : retirer « depuis trois ans, » → « Parrit.ai construit des systèmes IA chez
   des grands comptes, des PME et des ETI : votre entreprise, examinée, reconstruite opération par opération, à vous pour
   de bon. »
2. Accueil `page.tsx:97` (EN) et `:184` (FR) : retirer l'élément de preuve Qualiopi / Formia (« ATA 1926 2026, valable
   jusqu'en mai 2029 » : numéro non vérifié, entité tierce) et son logo `page.tsx:321` (`/brand/qualiopi-formia.png`).
   Les autres éléments du même bloc restent ; si le bloc devient vide, le retirer. Ne pas supprimer le fichier image.
3. `src/app/(rev01)/manufacture/page.tsx:26` (EN) et son équivalent FR : retirer la phrase « Two to four weeks,
   usually. » et sa traduction.
4. `scripts/generate-llms.mjs` (source de `public/llms.txt` et de `llms-full.txt`) :
   - l.32 « Every delivered system is certified to the same specification (STD-1.0): » → « Every delivered system is
     checked against the same specification (STD-1.0, Parrit's own bar, not an accreditation): » ;
   - l.58-59 : retirer « every commission includes maintenance and evolution — Parrit carries what it delivers » ;
   - l.67-72 : retirer les trois lignes « 200+ signals become decisions every week », « +€5–10K additional revenue per
     month », « 2.5 months recovered » ; si la section des preuves devient vide, retirer son titre.
5. Journal (`content/journal/*.mdx`) — phrases seulement, les articles restent publiés :
   - `what-is-a-company-operating-system.mdx:10` : retirer « after three years of building these systems for large
     accounts, SMEs and mid-sized companies, » en gardant une phrase correcte ; l.36 : retirer le chiffre bloqué de la
     ligne (« 2.5 months » ou équivalent) en gardant le reste du fait ;
   - `what-is-parrit-ai.mdx:22` : « Every system we ship is certified to the Standard » → « Every system we ship is
     checked against the Standard » ; l.30 : retirer « more than 200 signals become decisions every week on our own
     infrastructure » en gardant une phrase correcte ;
   - chercher les mêmes formulations dans les versions FR des articles, s'il en existe, et appliquer la même correction.
6. `src/lib/pillars.ts:84,91` « du prototype en 14 jours » / « from prototype in 14 days » : seulement si ces titres sont
   rendus sur une page publique ou dans un flux (`git grep` des usages) ; alors « du prototype à la production » /
   « from prototype to production ». Sinon, le signaler sans modifier.
7. Contrôle final : `git grep -nE "depuis trois ans|three years of|certified to|200\+? signals|5–10K|2\.5 months|Two to four weeks|ATA 1926|Qualiopi|maintenance and evolution|14 jours|14 days"`
   ne renvoie plus rien de rendu publiquement (lister ce qui reste avec la raison).

## 2. PostHog désactivé dans le navigateur (temporaire) et attribution sans stockage
Motif : rejeu de session, cartes de chaleur, clics morts et capture de la console sont actifs, sans consentement ; aucune
exemption n'est possible avec ces fonctions. L'attribution (`src/lib/attribution.ts`) garde 90 jours dans `localStorage`
des données de campagne rattachées ensuite aux formulaires : c'est un traceur hors mesure d'audience.
1. `src/app/(rev01)/layout.tsx` : ne plus injecter `POSTHOG_SNIPPET` (garder la constante, commentée « désactivé le
   05/10/2026, décision de Paul, en attente d'une justification d'exemption ou d'un consentement »). Aucun script ni
   requête vers `posthog.com` depuis le navigateur. `track()` (`src/lib/analytics.ts`) reste inoffensif sans `window.posthog`.
2. `src/lib/attribution.ts` : plus aucune lecture ni écriture de `localStorage` / `sessionStorage` / cookie. Garder
   l'attribution en mémoire pour la visite en cours (paramètres d'URL et référent de la page d'arrivée), transmise comme
   aujourd'hui avec un formulaire soumis. Adapter les tests d'attribution à ce comportement.
3. Envois serveur vers PostHog, s'il en existe (`git grep -n posthog src/app/api src/lib/server`) : les lister ; s'ils
   portent une donnée personnelle (email, nom, texte libre), le signaler dans le rapport sans modifier.
4. Tests : mettre à jour ceux qui exigent PostHog ; ajouter un test qui échoue si le HTML rendu contient un script PostHog
   ou si `attribution.ts` touche un stockage du navigateur.

## 3. Mentions légales et confidentialité (`src/app/(rev01)/legal/page.tsx`, FR l.20 et EN l.15)
Réécrire la partie confidentialité à partir des traitements VÉRIFIÉS dans le code (citer fichier:ligne dans le rapport) :
- **Données collectées** : formulaire prototype (`QuickCapture`, `/api/interet`) : email, description facultative de
  l'opération, langue, page d'origine, attribution de la visite en cours. Retirer « ou journal » (aucun formulaire
  Journal sur parrit.ai). Esquisse d'agent (`AgentEsquisse`, route d'esquisse) : vérifier si le texte saisi est envoyé à
  un fournisseur de modèle de langage (variables `OPENROUTER_*`, `GROQ_*`) ; si oui, le dire. Cal.com : inchangé.
- **Mesure d'audience** : « Le site ne mesure plus l'audience dans votre navigateur. » (PostHog désactivé). Si un envoi
  serveur vers PostHog subsiste (§2.3), le décrire sans donnée personnelle.
- **Destinataires et sous-traitants** : ne lister que ceux qu'un chemin de code utilise : hébergement (Vercel), base de
  données (Supabase), notifications internes (Telegram, via `telegram_queue`), automatisation (n8n) seulement si
  `PARRIT_LEAD_WEBHOOK` ou un autre appel n8n est effectivement appelé, Google Sheets seulement si un appel existe,
  fournisseurs de modèles de langage si le §3 le montre, Cal.com. Retirer « mesure d'audience (PostHog…) ».
- **Base légale, durée de conservation, droits** : inchangés.
Mettre à jour la date « Septembre 2026 » → « Octobre 2026 ».

## 4. Preuves attendues
- Batterie hors sandbox (lint, claims, build, brand, `test:brand-os`, `qa:network:rev01`). Ne pas lancer de build dans le
  sandbox (il laisse `.next/lock`).
- `docs/REPORT-2026-10-05-corrections.md` : chaque modification avant/après (fichier:ligne), résultats du contrôle §1.7,
  liste des envois serveur PostHog (§2.3), flux vérifiés pour le §3, tests modifiés et pourquoi.
