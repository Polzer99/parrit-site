# Plan SEO/GEO — Industrialiser le blog Parrit sur des bases saines

> Canon partagé Codex ↔ Claude. Codex implémente lot par lot, Claude relit + merge (3 feux). Source de vérité contenu/positionnement = `TRUTH.md`, visuel = `globals.css` + `BRAND.md`. Ce plan ne reconstruit rien : il assainit les fondations pour que la production d'articles devienne mécanique et rankable (Google **et** moteurs de réponse IA).

Date : 2026-06-28. Audits : Hermes (état réel), structure SEO/GEO du site, recherche experts (Princeton GEO KDD 2024, Ahrefs, Search Engine Land, Google Search Central, Semrush…).

---

## 0. Verdicts d'audit (l'état réel, sans broderie)

### Hermes — LIVE mais boucle non fermée, et **zéro contenu/SEO**
- **Tourne réellement** : cron `hermes-weekly.yml` (lundi 07:00 UTC), 3 cycles réussis, `proposals/*.md` horodatés, `PROGRESS.md` tické, issues `hermes` auto-ouvertes avec bloc Codex. Observe le site live + PostHog, propose des changements ICE-scorés ancrés `TRUTH.md`, autonomie L2 (propose, n'applique rien).
- **Trous** : (1) la boucle d'apprentissage n'est **pas fermée** — aucune proposition mergée+mesurée, pas de "effet avant/après → leçon" ; (2) il est câblé **conversion** (hero/CTA/funnel), il **n'observe pas le blog**, n'a aucun signal SEO (pas de Google Search Console), et **ne sait pas créer d'article**. Pour l'acquisition organique, il faut un **second mode** (voir Lot 5), pas le détourner.
- Fichiers : `hermes/hermes.mjs`, `hermes/LOOP.md`, `hermes/PROGRESS.md`, `.github/workflows/hermes-weekly.yml`.

### Structure SEO/GEO — base **saine**, quelques trous précis (pas une refonte)
Déjà bon : metadata + hreflang 4 langues sur toutes les routes, sitemap dynamique, robots avec whitelist bots LLM (GPTBot/ClaudeBot/PerplexityBot/Google-Extended), `llms.txt`, JSON-LD riche (Organization/Service/WebSite/HowTo, Article+BreadcrumbList sur articles, FAQPage sur glossaire), SSG + `next/font`, H1 unique + sémantique correcte, `getRelatedPosts()`.

Trous confirmés (vérifiés dans le code) :
- **P0** `og-image.png` référencé 6× mais **absent** (`layout.tsx:265`, `blog/[slug]/page.tsx:120,135`, `actualite/[slug]/page.tsx:140,160`) → tous les `Article.image`/`publisher.logo` du JSON-LD pointent vers un 404. *La route `/opengraph-image` existe et rend un PNG 1200×630 valide → pointer dessus.*
- **P0** `dateModified = post.date` (jamais de vraie date de MAJ) ; schema `Article` générique au lieu de `BlogPosting` ; `author` inline sans `@id` cross-référencé à la page auteur (E-E-A-T cassé).
- **P1** Pas de **pages pilier / topic clusters** (les catégories existent comme texte mais aucune page d'agrégation) → c'est LE levier SEO manquant. Pas de maillage landing offres → articles. Pas de ToC. `lastModified` du sitemap = heure de build, pas la vraie date.
- **P1** `hreflang="zh-CN"` émis sur les articles alors que le contenu servi est EN (déclaration trompeuse).
- **P2/GEO** Pas de blocs "réponse directe" sous les H2, pas de stats sourcées ni citations (les tactiques GEO les plus fortes), pas de `llms-full.txt`, pas de FAQ sur les articles blog.
- **Friction de production** : un article = du HTML brut inline dans un `.ts` → pénible à écrire en série. Il faut un **contrat d'article** (champs structurés) pour industrialiser.

---

## 1. Architecture cible : 3 piliers, hub-and-spoke

Principe expert (Ahrefs "topical authority", Search Engine Land "topic clusters") : **site focus** = concentrer le contenu autour d'un centre ; publier hors-sujet **dilue** l'autorité. Donc 3 piliers alignés ICP/offres, chacun avec ≥10 articles cluster, maillage **bidirectionnel** pilier ↔ cluster.

| Pilier (pillar page) | URL | Mot-clé tête | Aligné offre |
|---|---|---|---|
| **Claude Code & agents IA agentiques** | `/[lang]/blog/sujet/agents-ia` | "agent IA", "Claude Code", "code agentique" | OS Opérations / Fractional AI Operator |
| **Se former aux agents IA** | `/[lang]/blog/sujet/formation-agents-ia` | "comment se former aux agents IA", "formation IA équipes" | Transformation + training (Qualiopi) |
| **Créer un logiciel IA sur-mesure** | `/[lang]/blog/sujet/logiciel-ia-sur-mesure` | "créer un logiciel IA", "couche logiciel / MVP IA en 14 jours" | Prototypage rapide |

### Cartographie des clusters (intentions = ce que les gens tapent réellement)
Chaque ligne = 1 article cluster. Intention : **I**nformationnelle / **C**ommerciale / **T**ransactionnelle.

**Pilier 1 — Agents IA & Claude Code**
- (I) C'est quoi un agent IA / le "code agentique" ? — définition citable AEO
- (I) Comment créer un agent IA (guide pas-à-pas, avec captures réelles)
- (C) Claude Code vs Cursor vs Copilot vs Codex : lequel pour quoi
- (C) Quel agent IA pour une PME / une ETI
- (I) MCP, outils, mémoire : comment un agent agit vraiment
- (I/C) Automatiser [tâche métier : CRM, veille, SAV, prospection] avec un agent
- (I) Sécurité & garde-fous des agents IA en entreprise

**Pilier 2 — Se former aux agents IA**
- (I) Comment apprendre à créer des agents IA quand on ne code pas
- (C) Programme de formation "opérateur IA" : à quoi ça ressemble
- (I) Former ses équipes à l'IA : par où commencer
- (C) Formation IA certifiante / finançable (OPCO, Qualiopi)
- (I) Claude Code pour débutants : premier agent en une journée

**Pilier 3 — Créer un logiciel IA sur-mesure**
- (C) Créer un logiciel IA rapidement : combien de temps, combien ça coûte
- (T) MVP IA / "couche logiciel en 14 jours" : la méthode
- (I) Développer une app IA sans équipe technique
- (C) Build vs Buy : développer son outil IA ou acheter un SaaS
- (I) Du prototype à la production : ce qui change vraiment

> Découverte de nouveaux sujets en continu : People Also Ask (AlsoAsked), autocomplete Google.fr, mining Reddit/Quora (r/ClaudeAI, r/artificial, topics "intelligence artificielle"). À brancher dans Hermes mode contenu (Lot 5).

---

## 2. Le contrat d'article (clé de l'industrialisation)

Tout futur article (et idéalement les 12 existants, migrés progressivement) respecte ce contrat. C'est ce qui rend la production **mécanique** et garantit que chaque article est rankable **par construction** (SEO) et citable (GEO).

Champs ajoutés à `BlogPostSource` (`src/lib/blog.ts`) :
```ts
keyword: string;            // mot-clé tête ciblé
searchIntent: 'informational' | 'commercial' | 'transactional';
pillar: 'agents-ia' | 'formation-agents-ia' | 'logiciel-ia-sur-mesure';
updatedAt?: string;        // vraie date de MAJ (≠ date) → dateModified
tldr: string;              // réponse directe 40–60 mots (bloc citable AEO, affiché en tête + meta)
faq?: { q: string; a: string }[];   // 3–8 Q&A (vraies questions PAA) → rendu + FAQPage JSON-LD
sources?: { label: string; url: string }[]; // sources citées (chiffres/quotes) → liées en bas
// toc : généré automatiquement depuis les <h2> du content (pas un champ)
```

Règles de rédaction (issues de la recherche, à mettre dans le prompt de génération) :
- **Answer-first** : sous chaque `<h2>`, une réponse directe de 40–60 mots (44 % des citations LLM viennent du 1er tiers du texte).
- **Stats + citations sourcées** : ≥1 stat datée + sourcée tous les ~150–200 mots ; citations d'experts avec attribution complète (nom + rôle + organisation). Ce sont les tactiques GEO #1 du papier Princeton (+30–40 %).
- **Preuve first-hand** (anti-pénalité "scaled content" + E-E-A-T "Experience") : captures réelles, vrais chiffres de nos déploiements, méthode vécue. L'IA rédige autour de la substance ; elle n'invente pas l'expérience.
- **Longueur** : 1 500–2 500 mots (cluster) / 3 000–5 000 (pilier). Couvrir l'intention, pas un quota.
- **Maillage** : 3–5 liens internes contextuels dans les 300 premiers mots, lien retour vers le pilier (ancre = mot-clé du pilier), 2–3 cross-links cluster.
- **Voix** : LE TAMIS / Operating Partner (`TRUTH.md`, `BRAND.md §6bis`). **Pas de tiret cadratin.** Pas de jargon creux.

---

## 3. Séquence de déploiement Codex (lot par lot, feature-par-feature)

Ordre = hygiène d'abord (foundations first), structure ensuite, contenu enfin. Chaque lot = 1 PR, batterie + `npm run build` + contrast-audit verts, merge 3 feux. Les blocs prêts-à-coller des Lots 1 et 2 sont en §4.

| Lot | Objet | Risque | Dépend de |
|---|---|---|---|
| **1 — Hygiène JSON-LD** | og-image → `/opengraph-image` ; `BlogPosting` ; `updatedAt`→`dateModified` ; author `@id` cross-ref ; fix hreflang zh-CN (retirer zh des `alternates.languages` blog/actualité tant que non traduit) ; sitemap `lastModified` réel | Faible | — |
| **2 — Piliers & clusters** | Champ `pillar` sur les posts ; route `/[lang]/blog/sujet/[pillar]` (pillar page : intro 300–500 mots + liste des articles du cluster + JSON-LD `CollectionPage`+`BreadcrumbList`) ; bidir pilier↔article ; lien piliers depuis le hub blog | Moyen | Lot 1 |
| **3 — Anatomie article rankable+GEO** | Champs `keyword/searchIntent/tldr/faq/sources` ; rendu ToC auto (depuis `<h2>`), bloc TL;DR, section FAQ + `FAQPage` JSON-LD, bloc Sources, author box E-E-A-T liée par `@id` | Moyen | Lot 1 |
| **4 — Maillage & fichiers GEO** | Bloc "Articles liés" sur les landing offres (`deploiement-agents`, `audit`, `setup-claude-code`, `croissance`…) ; `llms-full.txt` + `llms-sitemap.txt` générés depuis les articles ; mentions de sources dans les 12 articles existants | Faible | Lots 2–3 |
| **5 — Hermes mode contenu** | Second mode `hermes content` : observe `/blog/*` + (futur) Google Search Console, propose des sujets d'articles depuis la carte clusters + gaps, **génère un brouillon d'article au contrat §2** en PR ; ferme la boucle mesure (impressions/positions à J+30/60/90) | Élevé | Lots 2–3 + accès GSC |

> **Décision Paul (28/06) : Lot 5 DIFFÉRÉ.** On finit les Lots 1–4 et on publie 1–2 articles gabarits **à la main** au contrat §2 d'abord. On n'automatise Hermès sur du contenu qu'une fois la chaîne saine (automatiser une chaîne bancale = amplifier le bancal). Accès Google Search Console à brancher au moment du Lot 5.

**Garde-fous transverses (REGLES-DOR §33 / Ai-Playbook)** : plan validé avant code ; secrets serveur-only ; pas d'appel runtime `*.vercel.app` ; `ci.yml` = checkout→ci→lint→build ; pas de contenu "scaled" sans substance first-hand (Google pénalise l'intention, pas le volume).

---

## 4. Blocs Codex prêts à coller

> Convention ping-pong §25 : Paul ouvre une issue, colle le bloc, lance Codex ; Claude relit la PR (sécu/archi/bugs/dette) + valide clone PAUL_TWIN + merge.

### LOT 1 — Hygiène JSON-LD & metadata (à lancer en premier)

```
Repo : Polzer99/parrit-site. Lis d'abord AGENTS.md + docs/seo-geo/PLAN-INDUSTRIALISATION.md.

Objectif : assainir les signaux SEO sans changer le design ni le contenu. 6 corrections.

1. og-image 404 → pointer vers la route OG dynamique existante.
   Dans src/app/[lang]/layout.tsx, src/app/[lang]/blog/[slug]/page.tsx et
   src/app/[lang]/actualite/[slug]/page.tsx, remplace toutes les occurrences de
   `${SITE_URL}/og-image.png` par `${SITE_URL}/opengraph-image`
   (l'image par défaut ; garde le fallback post.ogImage quand il existe).

2. Schema Article → BlogPosting.
   Dans blog/[slug]/page.tsx (JSON-LD ~ligne 109) et actualite/[slug]/page.tsx,
   change "@type": "Article" en "@type": "BlogPosting".

3. Vraie date de modification.
   Dans src/lib/blog.ts : ajoute `updatedAt?: string;` à BlogPostSource et au type
   exposé ; propage-le (défaut = date). Idem src/lib/actualite.ts.
   Dans le JSON-LD des deux templates : dateModified = post.updatedAt ?? post.date.

4. Author E-E-A-T cross-référencé.
   Dans blog/[slug]/page.tsx + actualite/[slug]/page.tsx, le JSON-LD author doit être
   { "@type": "Person", "@id": `${SITE_URL}/${lang}/auteur/paul-larmaraud#person`, "name": post.author }
   et la ProfilePage (src/app/[lang]/auteur/paul-larmaraud/page.tsx) doit exposer ce même @id
   sur son Person. (Cross-ref knowledge graph.)

5. hreflang zh-CN non trompeur.
   Tant que le contenu blog/actualité n'est pas traduit en zh-CN (il sert de l'EN),
   retire 'zh-CN' des alternates.languages dans generateMetadata de blog/[slug], blog/page,
   actualite/[slug], actualite/page (garde fr/en/pt-BR + x-default fr). Ne touche pas au
   glossaire (qui, lui, est traduit par langue). Laisse generateStaticParams inchangé.

6. sitemap lastModified réel.
   Dans src/app/sitemap.ts : pour chaque article, lastModified = updatedAt ?? publishedAt ?? date
   (Date réelle du contenu), au lieu de new Date(). Les routes statiques peuvent garder new Date().

Contraintes : TypeScript strict (pas de any), ESLint strict. `npm run lint` + `npm run build`
(4 langues SSG) doivent passer. Valide chaque template au Google Rich Results Test mentalement
(champs requis BlogPosting : headline, datePublished, dateModified, author, publisher+logo).
Une PR unique "fix(seo): hygiène JSON-LD + hreflang + sitemap dates". Pas de changement visuel.
```

### LOT 2 — Pages piliers & topic clusters (après merge du Lot 1)

```
Repo : Polzer99/parrit-site. Lis AGENTS.md + docs/seo-geo/PLAN-INDUSTRIALISATION.md (§1, §2).

Objectif : créer l'ossature topic-cluster hub-and-spoke. 3 piliers, maillage bidirectionnel.

1. Modèle pilier.
   Crée src/lib/pillars.ts exportant :
   export type PillarSlug = 'agents-ia' | 'formation-agents-ia' | 'logiciel-ia-sur-mesure';
   export interface Pillar { slug: PillarSlug; keyword; translations: Record<'fr'|'en'|'pt-BR',
     { title; description; intro /* 300-500 mots HTML, voix LE TAMIS */ }>; }
   export const PILLARS: Pillar[] = [...trois piliers de §1...];
   + helpers getPillar(slug), getPillars().

2. Rattacher les articles à un pilier.
   Ajoute `pillar?: PillarSlug` à BlogPostSource (src/lib/blog.ts) + helper
   getPostsByPillar(pillar, locale) trié par date desc. Renseigne `pillar` sur les
   articles existants dont le sujet correspond (laisse les autres à undefined pour l'instant).

3. Route pillar page : src/app/[lang]/blog/sujet/[pillar]/page.tsx (SSG, 4 langues × 3 piliers).
   - generateStaticParams sur locales × PILLARS.
   - generateMetadata : title/description du pilier, canonical, hreflang fr/en/pt-BR + x-default,
     og type website.
   - Rendu : header (label + h1 = pillar.title + intro), puis grille des articles du cluster
     (réutilise les classes .blog-list / .blog-card existantes), fil d'Ariane.
   - JSON-LD : CollectionPage + BreadcrumbList (Accueil > Blog > [Pilier]).

4. Maillage bidirectionnel.
   - blog/[slug]/page.tsx : si post.pillar, affiche en tête de l'article un lien
     "← [Titre du pilier]" vers /[lang]/blog/sujet/[pillar] (ancre = mot-clé pilier).
   - Hub blog (blog/page.tsx) : ajoute une rangée "Les grands sujets" listant les 3 piliers
     (cartes), au-dessus de la liste d'articles.
   - Ajoute les 3 piliers au sitemap (src/app/sitemap.ts), priorité 0.8.

Contraintes : DA inchangée (réutilise les classes existantes, tokens globals.css), TS strict,
ESLint strict, npm run lint + build verts, contrast-audit = 0 sur les nouvelles routes.
PR "feat(seo): pages piliers + topic clusters (hub-and-spoke)".
```

> Lots 3, 4, 5 : blocs détaillés à produire après merge du Lot 2 (méthode feature-par-feature). Le présent doc fixe leur périmètre et leur ordre.

---

## 5. Définition de "fait" pour ce chantier
- [ ] Lot 1 mergé : 0 ref `og-image.png`, `BlogPosting`, `dateModified` réel, author `@id`, hreflang zh-CN retiré du blog, sitemap dates réelles. Rich Results Test OK.
- [ ] Lot 2 mergé : 3 pillar pages live (12 URLs), articles rattachés, maillage bidir, sitemap à jour.
- [ ] Lot 3 mergé : contrat d'article complet rendu (TL;DR, ToC, FAQ+JSON-LD, sources, author box).
- [ ] Lot 4 mergé : maillage offres→articles, `llms-full.txt`.
- [ ] Lot 5 : Hermes mode contenu propose des sujets + brouillons au contrat §2, boucle mesure branchée (GSC).
- [ ] Premier vrai article de cluster publié au contrat §2 comme gabarit de référence.
