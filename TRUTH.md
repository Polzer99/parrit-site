# TRUTH.md — Source de vérité commune (site parrit.ai ↔ agent Hermes)

> **Ce fichier est le cerveau partagé.** Le site (`AGENTS.md` → ici) ET l'agent d'amélioration continue **Hermes** (`hermes/`) le lisent à chaque fois. Toute amélioration du site doit être *cohérente avec ce document*. Quand la réalité de Parrit change, on met à jour CE fichier d'abord (HITL) — pas le code en premier.
>
> Doctrine source (hors-repo, priment en cas de conflit) : `parrit-os/REGLES-DOR.md` · `parrit-os/VISION.md` · `parrit-os/docs/doctrine-communication/DOCTRINE-COMMUNICATION.md`. Doctrine visuelle : `BRAND.md` (ce repo).

---

## 1. Ce qu'est Parrit (positionnement)

Parrit.ai est une **boutique franco-chinoise** qui **construit ET opère** des outils sur-mesure avec des agents IA (Claude Code). **AI Operating Partner**, pas cabinet de conseil, pas programme hors-sol : on livre la chose qui tourne, on ne rend pas un deck.

**Deux cas d'usage de poids ÉGAL** (ne jamais réduire Parrit à la lead gen) :
1. **Back-office automatisé** — on opère les fronts critiques internes (gestion, capture multi-canal, facturation, veille, support…).
2. **Business généré** — on va chercher du revenu (signaux → outreach personnalisé → RDV qualifiés).

Phrase canon : *« Parrit opère vos deux fronts critiques. »*

Chaîne à deux mains : **Paul** fait naître le prototype (le zéro→un, il code tous les jours), **Yukun (冷宇坤)** le met en production sur les systèmes réels. « Ce qui tourne chez un client tourne d'abord chez moi. »

## 2. North stars (ce que la conversion doit servir)

1. **RDV qualifiés / semaine** (le site doit transformer un visiteur dirigeant en RDV).
2. **Cash hebdo** (les RDV deviennent des deals).

> Le rôle du SITE dans ce système = **transformer l'attention d'un dirigeant en RDV qualifié avec Paul.** C'est la métrique de conversion nord. Tout le reste (trafic, GEO, contenu) est en amont.

**CTA primaire du site** : « Parler à Paul » / réserver 15 min (visio ou présentiel). Surface : chatbot `QuickContact` → webhook n8n `parrit-lead` → fiche prospect → RDV.

## 3. ICP (à qui on parle)

- **Cœur** : dirigeants de **PME/ETI françaises** (résistants au changement, pragmatiques, allergiques au jargon).
- **Haut de gamme** : **C-level de grands groupes** (adoption de l'agentique sur leurs couches logicielles internes propriétaires). Voix distincte, plus « démocratiser l'agentique en grand groupe ».
- Marché Afrique (Cameroun) : premium CEOs + grand public formations — géré à l'humain, hors site public.

## 4. Offres (ce qu'on vend)

Familles : **Transformation IA · Management d'agents IA · Formation au management d'agents IA.**
Home 2026 (pivot) : funnel **recruter des collaborateurs virtuels** pour DG et Directeurs métiers PME/ETI. Le site présente **trois offres, toutes sur devis** (périmètre et prix cadrés après diagnostic), plus **La Veille** comme produit d'appel basse friction :
- **Transformation IA** (`/[lang]/croissance`) — advisory COMEX/DSI, transformation de bout en bout.
- **Agent IA / Sprint agentique** (`/[lang]/deployer`) — un agent en production contrôlée.
- **Formation agentique** (`/[lang]/transmettre`) — rendre les équipes autonomes (finançable OPCO).
**La home n'affiche AUCUN prix** ; les prix fermes anciens (Sprint 5 000 €, Abonnement 99 €/mois, Évolution 250 €/h) sont **retirés** au pivot 2026.
Surfaces produit sur le site : `/[lang]` (home = `HomeDeux.tsx`, catalogue agents SANS prix), `deployer`, `croissance`, `transmettre`, `academy` (grand public, tutoiement), `fondateurs`, `auteur/paul-larmaraud`, `blog`, `glossaire`, **`outils/detecteur-bullshit`** (outil public = lead magnet). Landings héritées (`audit`, `masterclass-*`, `optimisation-flotte`, `sessions-mcp`, `remote`, `setup-claude-code`) = maturity ladder, toutes sur devis.

## 5. Voix (DOCTRINE-COMMUNICATION — « LE TAMIS »)

- **Operating Partner / artisan-opérateur.** Autorité **démontrée** (Enargeia : volumes, durées, le COMMENT), jamais décrétée.
- **Sobriété** (−20 % de mots), anti-LinkedIn-performatif, **zéro pathos**, zéro hook fabriqué, zéro CTA mendiant.
- **Bannis** : jargon IA creux, « je me permets », « n'hésitez pas », superlatifs, **tiret cadratin `—`**.
- Greeting contacts chauds = « Hello [Prénom] ». Cold = « Bonjour ».
- Toute copie publique passe **LE TAMIS** (8 filtres) avant publication.

## 6. Règles dures (non négociables — un changement qui les viole est REJETÉ)

1. **Prix** : depuis le pivot 2026, les offres sont **sur devis** (périmètre et prix cadrés après diagnostic) et **la home n'affiche AUCUN prix**. Interdit : ré-afficher les anciens prix fermes (Sprint 5 000 €, Abonnement 99 €/mois, Évolution 250 €/h) — ils sont retirés. Pas de devis personnalisé hors propale privée, pas de promesse de ROI garanti. « sur devis » est la formulation validée pour le prix public.
2. **Pas de noms de clients** en texte (anonymisé ; mur de logos visuel autorisé, override Paul `BRAND.md §6`).
3. **Palette stricte (canon design-system, validé Paul 14/07)** : crème chaud `#FFFDFA` · encre `#0C0C0D` · rouge `#D1132F` · terracotta rare `#C67C60` · muted `#6E7079`. Interdits (périmés, bloqués par `qa:doctrine`) : ancien fond froid `#F5F8FF`, ancienne encre `#161616`, ancien rouge `#AA0003`, violet, brun. Variables `:root` de `globals.css` = source unique ; ne pas coder ces hex en dur.
4. **Polices** : Geist pour body/heading (`--font-body`, `--font-heading`) · Geist Mono pour labels/chips/coords (`--font-mono`). Interdits : DM Sans, Cormorant comme typo de page, Hanken Grotesk, JetBrains Mono.
5. **Jamais d'appel runtime à `*.vercel.app`** dans une livraison (le site EST sur Vercel — ça vise les ressources chargées au runtime).
6. **Pas de tiret cadratin**, pas de superlatifs creux.
7. **i18n** : 4 langues `fr · en · pt-BR · zh-CN`. Éditer une langue = répliquer dans les 4 (home `HomeDeux.tsx` DICT). Pages hors `[lang]` (academy/fondateurs/outils) = FR.
8. **Déploiement** : push `main` → CD Vercel. Jamais de merge prod sans les **3 feux** (review APPROVE + CD/batterie vert + Paul a COMPRIS) — RÈGLES-DOR §22/§25.

## 7. Architecture du site (où agir)

- Stack : Next.js 16 / React 19 / TS / Tailwind v4, Vercel, 4 langues. Analytics **PostHog** (`eu.i.posthog.com`, autocapture + session replay).
- Home = `src/app/[lang]/HomeDeux.tsx` (contenu inline dans `DICT`, un bloc par langue). `HomeClient.tsx` ne sert plus que `/os-classic` (noindex).
- Landing pages partagées : `src/components/LandingPage.tsx` + `src/app/[lang]/dictionaries/*.json`.
- Capture lead : `src/components/QuickContact.tsx` + `/api/chat` (chatbot Groq) + `/api/chat/lead` → webhook n8n `parrit-lead`.
- Garde-fous avant push : `scripts/contrast-audit.py` (WCAG) + skill `qa-playwright`. Toujours `npm run build` (4 langues SSG).

## 8. Définition d'une « amélioration » (le filtre de Hermes)

Une amélioration valable :
- **sert une north star** (plus de RDV qualifiés, ou un funnel moins fuyard, ou un meilleur signal/bruit pour le dirigeant cible) ;
- **passe LE TAMIS** (sobre, Enargeia, pas de pathos) ;
- **respecte les 7 règles dures** (§6) ;
- est **falsifiable** : on nomme la métrique qui devra bouger (taux de soumission `QuickContact`, scroll-depth sur les offres, clics CTA, démarrages de chat, RDV/sem) ;
- est **réversible** (une PR, un rollback possible).

Anti-objectifs : faire « plus joli » sans hypothèse de conversion ; ajouter du trafic vanity ; tout ce qui sent le growth-hack performatif (ça trahit la voix).

## 9. Hypothèses de conversion ouvertes (backlog vivant — Hermes entretient ceci)

- Le CTA « Parler à Paul » est-il assez tôt / assez clair au-dessus de la ligne de flottaison ?
- Le concept « desktop-OS » est-il un coût cognitif pour un dirigeant pressé (vs clarté de l'offre) ?
- Les preuves (Enargeia) sont-elles assez concrètes et chiffrées (sans violer §6) pour créer la confiance ?
- Le détecteur de bullshit (`/outils/detecteur-bullshit`) ramène-t-il des leads qualifiés (action `bullshit_detector_lead`) ? Quel est son taux de gate-email ?
- Mobile : le funnel de contact tient-il sur mobile ?

> Hermes met à jour cette section à chaque cycle (ce qui a été testé, ce qui a bougé). Voir `hermes/PROGRESS.md`.
