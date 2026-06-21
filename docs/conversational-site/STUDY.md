# ÉTUDE — parrit.ai en expérience conversationnelle personnalisée
Date : 2026-06-21 · Status : étude / décision (pas encore approuvée) · Méthode : designing + loop-doctor, étude multi-angles + critique adversariale.

## La vision (Paul)
Le site devient une **expérience conversationnelle** : chaque visiteur (1) obtient un **diagnostic** + une **présentation sur-mesure envoyés** automatiquement depuis le site, (2) vit une expérience **différente selon qui il est**, (3) reçoit du contenu **adapté à ce qu'il veut**. C'est l'**industrialisation de ce que Paul fait à la main** (mini-sites/propales chiffrées par destinataire : INSEAD/LVMH/Kiabi). Le site = **vitrine vivante** : il ne montre plus des agents, il en **fait tourner**. Sous les normes du **Guide YouKun** (AI-Playbook §33), avec **lead-intent** fin (qui veut quoi), une **DA testée partout**, et un **max d'interactivité**.

## Verdict : ÉVOLUTION, pas refonte (confiance ~85 %)
On ne refond pas. L'ossature DA/SEO/voix/4-langues est saine (audit contraste 0) ; jeter ça violerait « tranche fine d'abord » sans gain. **Mais** une poche doit être **construite (pas patchée)** : la **couche données/intent**. Nuance importante (corrigée par la critique) : côté SITE, peu de choses « dorment » — le chatbot orphelin + le détecteur. Tout le CRM (Supabase, scoring `qualifier_scores`, schéma `prospects`) vit **côté OS et n'a JAMAIS été branché au site** (0 import supabase dans `src/app`). **Le pont site→Supabase est un chantier neuf**, pas une reconnexion.

Ce qui existe déjà et sert de fondation :
- **Le détecteur de bullshit** (`api/bullshit`) = le **patron exact** du moteur cible : LLM cheap (deepseek/OpenRouter) qui note, **score + garde-fous calculés en CODE** (déterministe), **email-gate** qui capte le lead. On réplique ce patron pour le diagnostic.
- **Le chatbot** (`api/chat`) existe MAIS : (a) **orphelin** (0 consommateur UI), (b) c'est un **booking bot** (« ta mission : organiser un rendez-vous »), pas un diagnostic, (c) sur **Groq** (hors canon §13, US = RGPD). → à **re-architecturer** (UI à créer + re-prompt diagnostic + migrer OpenRouter), pas juste « re-prompter ».
- **Whisper** (transcription vocale) live, sans UI → « Parlez à Parrit ».
- **Le pattern propale chiffrée** (AES-256-GCM + code/destinataire + tracking) déjà industrialisé à la main (skill `propale-web-protegee`).
- **PostHog + attribution + Hermes + TRUTH.md/BRAND.md** sains.

## 🔴 P0 — SÉCURITÉ (bloque tout le reste, NON négociable)
`src/app/api/os/*` (7 routes : signal-action, signal-push, mark-rdv, relance, cadrage, refresh, content-idea) sont des **fonctions serverless publiques SANS AUTH** qui font `python3 -c` (exec) et **écrivent dans le CRM** (`db.action_signal`), avec des chemins `/Users/paullarmaraud/...` en dur, **committées dans le repo**. Vérifié (`signal-action/route.ts:19-23`). Pas de `.vercelignore`, le proxy ne fait que la locale (pas d'auth).
- En prod Vercel : ça **500** (pas de python ni du code OS) → pas exploité AUJOURD'HUI.
- Le vrai danger : pattern **unauth-CRM-write + exec** dans un repo public ; un seul portage naïf / un runner self-hosted avec python = **RCE + CRM ouverte au monde** ; fuite de topologie interne.
- **Action P0a** (1 commit, <1h, valeur max, sans archi) : **sortir `src/app/api/os/*` (et statuer sur `src/app/os/*`) du repo site**. Vérifier d'abord si le dashboard in-repo `/os` les consomme (couplage) → s'il est mort/local, supprimer les deux ; sinon le déplacer hors du site public. Le dashboard réel vit côté OS (déjà noindex).
- **P0b séparé** (cosmétique, n'a rien à faire dans la même phase) : corriger les violations DA dures vérifiées (`#ff6b6b` QuickContact.tsx:177, `#b03e30` globals.css, dép morte `@fontsource/poppins`) + MAJ BRAND.md.

## Architecture cible (5 couches, greffées sur le Next.js existant — jamais d'exec, le navigateur ne tape jamais la base)
1. **Segment** (léger) : dérive un segment `{pme_eti, c_level_grand_groupe, academy}` depuis UTM/referrer/cookie httpOnly, exposé au rendu + PostHog. (Simple, pas une « couche » sur-architecturée tant que la perso n'a pas prouvé sa conversion.)
2. **Conversation** : l'UI chat manquante (fenêtre desktop-OS + micro Whisper) sur `api/chat v2` **re-prompté en agent de DIAGNOSTIC** (extrait un JSON intent `{secteur, taille, friction, offre-fit, urgence, persona}`, comme le détecteur extrait 4 axes) ; migre Groq→OpenRouter.
3. **Génération** : endpoint diagnostic **calqué sur `api/bullshit`** (LLM cheap + intelligence dans le prompt + sortie déterministe en code + **garde-fou DUR anti-prix §6 / anti-nom-client / anti-chiffre halluciné**).
4. **Livrable** : route **NATIVE** `/[lang]/diagnostic/[token]` (server-rendered, 1 DA, **lien signé HMAC court-vivant**) ; le mail envoie le **lien** (jamais N projets vercel.app — aligne §13 + tue le footgun re-alias). Le moteur propale **chiffré** reste pour les leads chauds, **déclenché par Paul** (phase 2).
5. **Data & Intent** (à reconstruire propre) : **une** route serveur `api/lead` (service_role server-only, **arrêt si `.env` manque**, RLS, FK jamais par nom, validation zod, dedup email, **score+segment calculés à l'insertion**) qui écrit le schéma Supabase canonique (`prospects/metadata + signals + touchpoints`) **puis** notifie n8n/Telegram pour le HITL.

## Modèle de lead-intent (qui veut quoi)
Schéma unique à graver dans `TRUTH.md` + `prospects.metadata`, **émis à l'identique par les 3 surfaces** (aujourd'hui divergent : `quick_contact` / `meeting_request` / `bullshit_detector_lead`) :
`{ offre_interet (back-office|acquisition|claude-code|formation, déduit de la page/modale), secteur, taille, role, douleur, urgence, lead_magnet, intent_score (0-100, en CODE), segment, source_page, transcript_id?, attribution (UTM/referrer first+last 90j) }`.
Principe : **déduire** l'intent (events PostHog nommés `offer_opened/offer_cta_click/tool_completed/lead_captured` + extraction de la conversation) plutôt que le **demander** (sobriété). Le schéma Supabase OS (`prospects`, `qualifier_scores`, `touchpoints`) est **déjà prêt** → réutiliser son scoring ICP, ne pas recoder.

## Plan de tests de cohérence DA (exigence Paul)
Aujourd'hui seul `contrast-audit.py` (WCAG, pas en CI). Plan :
1. **Quick win (5 % effort, 80 % valeur)** : un **grep/lint statique** pré-commit : interdit tout hex hors token, `fontFamily` inline hors `var(--font-*)`, import poppins.
2. **`da-audit.py`** (sœur de contrast-audit, Playwright) sur **toutes** les routes + blog + **manifestes** + modals : (a) **polices** (computed font-family ∈ {DM Sans, Cormorant, JetBrains Mono} + `document.fonts.check` anti-fallback système), (b) **logo** (présence du SVG `/brand/parrit-*.svg`, échoue sur logo texte nu + flag le sceau 速 rendu en texte), (c) **palette** (computed hex ∈ allowlist stricte = tokens + exceptions documentées).
3. **Allowlist machine-lisible DANS `BRAND.md`** (source de vérité du test). 4. Brancher `da-audit` + `contrast-audit` dans `ci.yml` (gate PR §22). 5. Multi-viewport via `qa-playwright`.

## Sécurité / Guide YouKun (la doctrine EXISTE, il faut l'APPLIQUER)
P0 ci-dessus · liens **signés** (HMAC/JWT court-vivant, jamais d'ID devinable) pour les expériences perso · AES-256-GCM (propale phase 2) · **secrets server-only + arrêt si `.env` manque** · Supabase **RLS** partout + `security_invoker` sur les vues + service_role server-only + **FK jamais par nom** · **RGPD** (consentement avant tout transcript/PII, base légale, rétention, registre sous-traitants Groq/OpenRouter/n8n/Vercel) · **zod + rate-limit + cap coût/jour + kill-switch budget** (absent sur `api/chat` ET `api/bullshit` — à border AVANT toute expo publique élargie) · anti **prompt-injection** (borne input ET output) · CI 4 portes + section Sécurité dans `AI_CONTEXT.md`.

## Phasing (corrigé par la critique — valider le GOÛT avant de construire)
- **P0a** Sécurité : sortir `api/os/*` du repo site. (S, bloquant)
- **P0b** Corrections DA dures + grep statique pré-commit. (S)
- **🎯 Tranche fine GOÛT** (méthode, AVANT P1) : une **maquette de la fenêtre chat** + 1-2 écrans du diagnostic → Paul réagit. Le germe à montrer = le détecteur live (il prouve déjà le patron). Pas de build avant « oui, ce ressenti ».
- **P1** Chat diagnostique branché : UI ChatWindow desktop-OS + micro Whisper + `api/chat v2` (re-prompt diagnostic + extraction intent) + **migration OpenRouter** + **rate-limit/cap coût** + réparer `api/chat/lead` (le write FS local échoue en prod). (M — pas un quick win : UI inexistante + changement de finalité du bot)
- **P2** Couche intent + data propre : route `api/lead` unique sur Supabase (zod, dedup, score+segment) + events PostHog nommés + consentement/rétention. **Dépendance bloquante = brancher Supabase côté site (clé service_role server-only).** (L)
- **P3** Livrable natif `/[lang]/diagnostic/[token]` (lien signé) + 1 outil de plus dans `/outils`. (L)
- **Plus tard (si la conversion le justifie)** : perso « du cœur » = extraction du **DICT monolithique** (3934 l × 4 langues, le poste de risque n°1, tranches sentinelées + parité 4 langues + contrast-audit à chaque pas) + propale chiffrée auto-assistée déclenchée par Paul. (XL — ne PAS planifier en détail avant la preuve.)

## Ce que ça IMPLIQUE (têtes de chapitre)
- **Le site cesse d'être une vitrine quasi-statique et devient une APPLICATION** : nouveau socle data+auth (Supabase server-only, liens signés, RLS, RGPD) qui **n'existe pas du tout aujourd'hui**. Pas un ajout cosmétique.
- **La vision VISIBLE** (chat diagnostique + mini-diagnostic) est atteignable vite (P0+P1, quelques tranches Codex gatées) car le patron existe (détecteur). **La vision COMPLÈTE** (perso du cœur + propale auto) est XL.
- **Coût/abus** : exposer plus de LLM au public sans rate-limit (absent aujourd'hui) = facture OpenRouter/Groq exploitable → **kill-switch budget avant expo** (sensibilité Paul : ~4 $ = panne).
- **Lane** : tout via Codex §25 (PR + 3 feux), **le repo site = PROD ≠ pilote → jamais d'auto-merge** (à graver dans `AGENTS.md`).

## Décisions à trancher (Paul)
1. **`api/os/*`** : on les **supprime** du repo site (reco) ou on les **isole** (auth+exclusion build) ? (P0)
2. **Niveau de perso v1** : « des bords » (hero/preuves via segment, DICT intact — **reco**) · variantes pré-rédigées par persona (zéro LLM, sûr §6) · « du cœur » (extraire le DICT — plus tard).
3. **Envoi auto du livrable** : strictement **sollicité = auto OK / chiffré ou cold = HITL** (§19/§22/§30). Paul valide que « le visiteur a cliqué pour recevoir » = consentement suffisant.
4. **Intent** : le **déduire** (conversation + comportement — reco) vs le **demander** (formulaire).
5. **Migration Groq→OpenRouter** du chat : oui (canon §13 + RGPD).
6. **Périmètre du dashboard `/os`** in-repo : utilisé ou mort ? (conditionne P0a)

## Risques majeurs
RCE/CRM-ouverte (P0) · fuite doctrine par génération LLM (prix §6.1 / nom client §6.2 / chiffre halluciné → **garde-fou déterministe + revue 1er batch**, le regex seul est faillible) · extraction DICT (XL) · 3 implémentations data divergentes (boîte noire n8n non tracée — **tracer ce que `parrit-lead` fait en aval avant de le tuer**) · coût LLM non borné · perso runtime vs **SEO/GEO** (le site est cité 0 % par les IA — prévoir un **rendu statique de référence pour les bots** dès P1) · RGPD transcripts (Groq US) · migration des leads `.md` déjà captés.
