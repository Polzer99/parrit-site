# Parrit.ai — Refonte site : BRIEF DE PRODUCTION (handoff Codex)
**23/06/2026.** Objet : remplacer le site live `parrit.ai` par le nouveau design (DA « Parrit Template » Smoooth, validé par Paul « ok good »). Document destiné à la phase prod **Codex + Claude** ([[project_codex_claude_pingpong_github]], REGLES-DOR §25).

---
## 0. État (ce qui est FAIT, prêt à porter)
Le **design + le contenu sont figés et validés** dans `docs/refonte-offre-2026-06/resources/` :
- `site-home.html` — **la home, source de vérité** (copy validée par Paul, structure finale).
- `parrit-da.css` — **la feuille de style canon** (tokens + composants).
- `offre-deployer.html` · `offre-croissance.html` · `offre-autonomie.html` — pages offre (même DA + CTA).
- `interne-personas.html` · `interne-catalogue.html` — **INTERNES équipe, NE PAS publier** sur le site public.
- `carousel-template.html` (+ `carousel-png/`) — gabarit carousel LinkedIn (hors site).
- `brand-kit/` — tous les assets : `parrit-lockup-red.svg` (logotype), `parrit-seal.svg`, `fonts/` (woff2 locaux), `tool-logos/` (claude/openai/mcp/whatsapp), `client-logos/` (7), `qualiopi/` (marianne + atalya).
- `fonts/` — archive Smoooth initiale (**Hanken Grotesk + JetBrains Mono** en woff2 local). Le site actif utilise désormais Geist + Geist Mono via `next/font/google` (#58).
- `DA-TOKENS-EXTRACTED.md` — les tokens exacts (mesurés sur le SVG vectoriel Smoooth).

## 1. DA / TOKENS (exacts, vecteur SVG — ne pas dévier)
- Fond `#F5F8FF` · encre `#161616` · sombre `#2E2D2B` · **rouge `#AA0003`** · terracotta `#C67C60` (rare : tag « format phare » uniquement) · muted `#6E7079` · faint/labels `#8987A1`.
- **Polices actives site** : **Geist** (body/heading) + **Geist Mono** (labels/coords/eyebrows), chargées via `next/font/google` et self-hostées au build par Next. ⚠️ PAS DM Sans, PAS Cormorant comme typo de page, PAS Hanken/JetBrains dans le code public.
- **Logo = asset** `parrit-lockup-red.svg` (PARRIT·AI + sceau 速 rouge). JAMAIS retaper « Parrit.ai » en texte.
- Look : **plat/soft** (cartes bord 1px + ombre douce), chips pilules blanches, grilles à séparateurs pointillés, sceau 速 watermark pâle. PAS de néo-brutalisme, PAS d'orange/noir hors tag.
- Type : H1 `clamp(28px,6.6vw,62px)` · H2 `clamp(26px,4.6vw,42px)` · corps mono ~13-14px.

## 2. CONTENU (validé Paul — ne pas réécrire sans lui)
Structure home : Nav (logotype + « Écrire à Paul ») → Hero centré (« Au-delà de l'IA qui discute. L'IA qui agit pour vous, en 14 jours », chips Claude Code/Codex/MCP avec **vrais logos**) → **mur de logos clients** (séparé) → « Ce qu'on fait » (Gagner du temps / Faire plus de business) → « Comment ça se passe » (On regarde / On construit / On vous rend autonome) → **échelle d'offre** → **cas d'usage par fonction** (Agent mail, Agent de veille, CRM piloté par agents, Outil propriétaire, Alertes intelligentes, Formation agentique — cliquables, réfs discrètes ex. Clevery/Laparra/Joone, **JAMAIS de logo client dans les cartes de cas**) → CTA (form + WhatsApp) → badge Qualiopi → footer (Paul & Yukun + réseau d'experts).
- **Pricing (ordre croissant, prix « calculés » sans zéros terminaux)** : Audit = point d'entrée · Sprint à impact = **1 197 €** · Déploiement d'agents IA = **2 994 €** · Formation agentique (non-tech) = **3 497 €** (Qualiopi, OPCO) · Accompagnement · Operating Partner = **247 €/h**.

## 3. CTA & LEAD CAPTURE (à brancher en prod — le cœur de la conversion)
- **Form lead** (dans la carte CTA + hero scrolle vers `#contact`) : champs **email + téléphone** → bouton **« Être rappelé »**. Aujourd'hui `action="#"` + `data-webhook="TODO-prod"`.
- **À CÂBLER** : POST du form → endpoint backend qui (a) **enregistre le lead dans Supabase** (table prospects/leads), (b) **alerte Paul immédiatement** (Telegram bot Baoluo OU email), (c) déclenche le rappel. → puis Paul rappelle.
- **CTA WhatsApp** : `https://wa.me/33683762219` (bouton vert, déjà en place).
- **RDV** : objectif final = prise de RDV. V1 = lead form → rappel. V2 (option) = lien booking (Cal.com/Calendar) — à trancher avec Paul.
- ⚠️ **Backend = Supabase + FastAPI VPS** (stack canon §13), **PAS de route serverless Vercel** ; **aucune URL `*.vercel.app` runtime** dans mails/redirects (REGLES-DOR §13, incident connu).

## 4. INTÉGRATION dans `parrit-site` (Next.js) — CARTO REPO
- **Repo** : `https://github.com/Polzer99/parrit-site.git` · deploy **Vercel** auto sur push `main` · Node 24 · `npm run build` (SSG 4 locales).
- **Home** : `src/app/[lang]/HomeClient.tsx` (~3900 lignes, ancien « desktop-OS ») + `src/app/[lang]/page.tsx`. **À remplacer** par le nouveau design.
- **Tokens** : `src/app/globals.css` `:root` porte désormais la DA active (`#F5F8FF/#161616/#AA0003/#2E2D2B/#C67C60/#8987A1`). Ne pas réintroduire l'ancienne DA `#FEFDF9/#0C0C0D/#D1132F`.
- **Polices** : chargées via **`next/font/google`** dans `src/app/[lang]/layout.tsx` (Next les **self-host au build** → fiable). Standard actif #58 : **Geist** + **Geist Mono**, variables `--font-body` et `--font-mono`.
- **i18n** : 4 locales `fr/en/pt-BR/zh-CN`. ⚠️ le contenu home est **embarqué dans un objet `COPY` quadruple-répliqué** dans HomeClient.tsx (éditer = répliquer × 4). Contenu validé = **FR** → décision Paul : porter FR d'abord puis traduire, ou tout de suite ×4.
- **LEAD FORM = DÉJÀ EXISTANT** : `src/components/QuickContact.tsx` POST → `PARRIT_LEAD_WEBHOOK` (n8n `https://n8n.srv1115145.hstgr.cloud/webhook/parrit-lead`, ingère le lead côté serveur + UTM/PostHog). **→ réutiliser** ce composant pour notre form (email+tel) au lieu de recréer un backend. Le « on vous rappelle » est déjà branché via n8n.
- **Assets** : `public/brand/` contient déjà lockup/seal/logo-system. **Ajouter** : `parrit-lockup-red.svg`, tool-logos (claude/openai/mcp/whatsapp), client-logos (7), qualiopi (marianne + atalya) depuis `brand-kit/`.
- **Garde-fous repo** : `npm run build` zéro erreur · `scripts/contrast-audit.py` cible 0 · pas de route dynamique sans `generateStaticParams()`.
- ⚠️ **REGLES-DOR §5 AMENDÉ (23/06)** : les **prix « à partir de » SONT autorisés** sur le site (ancrages) + **logos clients autorisés** (override 12/06) + **réfs discrètes dans les cas** (décision Paul 23/06). NE PAS appliquer l'ancienne règle « zéro prix / zéro nom client » à ce design (elle est superseded ici).
- **Accès Codex à la source design** : le design vit dans `parrit-os/docs/refonte-offre-2026-06/resources/` (hors repo parrit-site). **Avant de lancer Codex**, copier la source dans le repo : `cp -R ~/parrit-os/docs/refonte-offre-2026-06/resources ~/Parrit.ai/Projets-Dev/parrit-site/design-source` sur une branche dédiée → Codex lit `design-source/`. (Claude le fait au GO de Paul ; pas de push prod en autonomie.)

## 5. QA — état
- ✅ Tous les assets locaux présents (0 manquant). ✅ 0 chemin `file://` absolu (tout relatif, portable).
- ✅ Responsive : media queries (880/520) + **type fluide `clamp()`** + `overflow-x:hidden` → pas de débordement horizontal mobile par construction.
- ✅ Polices locales (chargement fiable). ✅ Vrais logos partout.
- ⚠️ **RESTE (prod)** : QA cross-navigateur + vrais devices via **Playwright** (skill `qa-playwright`) — mon rendu headless `--window-size` n'émule pas les devices de façon fiable. À lancer après intégration Next.js.

## 6. CONTRAINTES (non négociables)
- **§25 ping-pong** : Codex code via PR ; Claude review (sécu/archi/bugs/dette) + merge 3 feux (APPROVE + CI verte + Paul a compris) ; zéro secret aux agents ; repo pilote ≠ prod sensible.
- **§33 AI Playbook** : filet de sécurité (CI 4 portes), plan validé avant code, secrets serveur-only, `npm ci`. Batterie de livraison avant « fait ».
- **§13 stack** : Supabase · FastAPI VPS · pas de Vercel runtime en sortie (mail/redirect) · Telegram pour alertes.
- **Anonymat** : mur de logos = OK (override Paul 12/06) ; cartes de cas = par fonction, réfs discrètes, **jamais de logo client dans une carte de cas**.

## 7. RÉPARTITION & ÉTAPES
- **Phase A (Codex)** : porter la home (design + tokens + polices locales + assets) dans `parrit-site`, build vert, preview. → PR.
- **Phase B (Codex)** : lead-capture (form → Supabase + alerte Telegram/email Paul) + WhatsApp + (option) booking. → PR.
- **Phase C (Codex)** : porter les 3 pages offre.
- **Phase D** : QA Playwright (responsive + multi-navigateur), corrections, puis **remplacer le live** + vérifier redirections/webhooks.
- **Claude** : review chaque PR (3 feux), merge, vérif live.

**Prompts Codex prêts à coller** : voir `CODEX-PROMPTS.md` (même dossier).
