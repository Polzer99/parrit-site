# Référence SEO/GEO — synthèse des experts (2025-2026)

> Recherche multi-sources qui sous-tend `PLAN-INDUSTRIALISATION.md`. À consulter pour rédiger/réviser un article ou justifier une décision. Toutes les règles sont sourcées.

## Les 5 tactiques GEO validées (papier Princeton, KDD 2024 — 9 tactiques × 10 000 requêtes)
Ce qui **augmente** la visibilité dans les réponses IA (métrique PAWC) :
1. **Citer des sources externes attribuées** (+30–40 % ; +115 % pour les sites mal classés) — "Selon [Org], [année] : [stat]".
2. **Citations directes d'experts nommés** (+41 % sur impression subjective) — nom + rôle + organisation.
3. **Statistiques précises, chiffrées, datées** (+41 %) — "76 % des entreprises [source, année]", 1 stat /150–200 mots.
4. **Fluidité de lecture** (+15–30 %) — corriger les passages maladroits, garder sa voix (pas un style IA générique).
5. **Voix d'autorité, sans hedges inutiles** (+10–20 %) — affirmer quand on a une preuve.

Ce qui **échoue** : keyword stuffing, simplification excessive, padding (mots sans claims), persuasion sans preuve.
Source : Princeton GEO (ACM KDD 2024) https://dl.acm.org/doi/10.1145/3637528.3671900 · résumé https://derivatex.agency/blog/princeton-geo-paper-plain-english/

## Autres règles GEO/AEO clés
- 44,2 % des citations LLM viennent du **premier tiers** du texte → front-load les claims, réponse directe 40–60 mots sous chaque H2. (Averi.ai)
- Multimodal (texte + images + tableaux + structured data) = **+156 %** de sélection en AI Overview vs texte seul. (SEOcrawl.ai)
- Contenu mis à jour < 3 mois = **3× plus cité** ; 53 % des sources AI Overviews datent de < 6 mois. (Averi.ai, Citedify)
- Cohérence multi-plateforme : Reddit dans 68 % des réponses IA ; LinkedIn citations ×2 fin 2025→2026. (CMSWire)
- `llms.txt` : low-effort, à faire, mais **impact ranking non prouvé** (Google ne le lit pas — confirmé J. Mueller) ; utile surtout aux outils de code. (Semrush)

## Architecture topique (Ahrefs, Search Engine Land)
- Google mesure **site focus** + **site radius** : publier hors-sujet **dilue** activement l'autorité. (Ahrefs)
- 1 pilier par domaine, ≥10 clusters planifiés avant publication ; +40 % de trafic sur 12 mois en cluster soutenu. (Search Engine Land)
- Maillage **bidirectionnel** pilier↔cluster, ancres avec mot-clé ; max 3 clics depuis la home ; zéro page orpheline.
- Priorisation sujets = Demand × Difficulty × Strategic fit × SERP winability.

## Anatomie d'un article qui rank (SEO classique)
- Partir de l'**intention** (info/commercial/transactionnel/navigation), pas du mot-clé.
- 1 H1 = 1 topic ; H2 = la question réelle de l'utilisateur ; réponse directe dessous.
- 1 500–2 500 mots (cluster) / 3 000–5 000 (pilier) ; couvrir l'intention, pas un quota.
- ToC + jump links > 1 500 mots ; FAQ (vraies PAA) + `FAQPage` JSON-LD.
- `BlogPosting` (pas `Article`) : headline, datePublished, **dateModified réel**, author Person + sameAs, publisher+logo.
- Author box E-E-A-T : photo, fonction, crédentiels, lien LinkedIn ; `Person` + chaîne `sameAs`.
- Preuve **first-hand** (Experience) : captures, données propres, méthode vécue.

## Programmatic sans pénalité (Google "scaled content abuse")
- Google pénalise l'**intention** (pages pour manipuler le ranking), pas le volume. Humain fournit la substance (data first-hand, revue), IA fournit l'efficacité (structure, rédaction, FAQ).
- Chaque page = une donnée/entité unique qu'aucune autre n'a. Pas de template rempli de synonymes.
- Récupération d'une pénalité = 3–6 mois (aux core updates). Source : Digital Applied, Breakline Agency.

## Technique (Google Search Central, Next.js)
- Core Web Vitals "good" : LCP < 2,5 s · INP < 200 ms · CLS < 0,1. (FCP < 0,4 s corrèle avec + de citations IA.)
- Hreflang : URLs absolues, bidirectionnel, `x-default`, codes ISO corrects ; 75 % des implémentations ont des erreurs.
- Canonical self-referencing partout ; sitemap dynamique avec vrai `lastModified` ; pile JSON-LD BlogPosting > FAQPage > BreadcrumbList.

## Recherche de questions (ce que les gens tapent)
- AlsoAsked / Keywords People Use (People Also Ask, arbre par intention, ciblage France).
- Mining Reddit/Quora (r/ClaudeAI, r/artificial, topics "IA") : les titres de threads = des H2 parfaits + souvent cités par les LLM.
- Autocomplete Google.fr (seed + A→Z, "comment/pourquoi/quel/meilleur").

## Comment CHAQUE moteur choisit ses sources (ils ne sont PAS un bloc unique)
- **ChatGPT** = consensus. Wikipedia ≈ 7,8 % des citations (1ʳᵉ source), comparatifs/roundups tiers (G2, PCMag, Forbes). FCP < 0,4 s → 6,7 citations vs 2,1 si lent.
- **Claude** = profondeur + structure. Définitions claires + bullets → +30 % de sélection ; aime whitepapers, docs techniques, specs ; préfère UNE source exhaustive au consensus ; ton formel + citations explicites.
- **Perplexity** = temps réel + communauté. **Reddit ≈ 46,7 %** des top citations (≈2× Wikipedia) ; récompense fraîcheur (citation possible en **heures**), réponse-d'abord, structure.
- **Google AI Overviews** = sémantique > rang pur. 54 % de recouvrement top-20 organique MAIS **48 % des citations hors top-100** ; 78 % des sources sont **multimodales** (texte+image+vidéo+schema, r=0,92).
- **Le "mention-source divide"** : **82,9 % des citations B2B viennent de sources TIERCES.** Optimiser uniquement son site est insuffisant → présence Reddit / G2 / listicles / annuaires nécessaire. (Off-site, hors repo, mais à planifier côté distribution.)
Sources : discoveredlabs.com, tryprofound.com, Yext 2025 AI Citation Study.

## Spécifs additionnelles (essaim de recherche 28/06)
- **Answer-first chiffré** : capsule 40–60 mots sous chaque H2 → +40 % de citation ; format Q&A/réponse directe → 55 % en top-3 (vs 31 %). Hiérarchie Hx séquentielle (H2>H3>H4) → **×2,8** de citation. FAQPage → cité ~47 % de plus par Perplexity.
- **Author schema précis** : `Person` imbriqué dans `BlogPosting`, **même `@id` sur tous les articles** d'un auteur (entity recognition), + `knowsAbout` (3–5 thèmes), `sameAs` (LinkedIn/GitHub/Wikidata), `jobTitle`, `url` (page auteur). `headline` < 110 car. ; `image` ≥ 1200 px (1:1, 4:3, 16:9) ; logo publisher ~600×60. Pas de headshot IA (casse E-E-A-T).
- **HCU = score au niveau DOMAINE entier**, pas par page : un hub de pages faibles peut **plomber** les bonnes. → ne pas industrialiser du thin "pour faire du volume".
- **Fausse fraîcheur pénalisée** : Google distingue vraie MAJ (info/insight nouveau) de simple changement de date. ⚠️ Notre champ `updatedAt` ne doit bouger QUE sur une vraie mise à jour de fond.
- **Programmatic, 8 règles dures** : 1 intention/URL · publier seulement les lignes "éligibles" (gate de complétude) · **≥3 blocs d'unicité matérielle/URL** · pas de doorway · hooks de preuve/source · écriture "constraint-first" (mener par le cas d'usage précis, pas le bénéfice générique) · quality gates avant publi (+ échantillon humain 5–10 % si IA) · **pruning 60–90 j** (noindex/supprime ce qui a 0 impression). Thin ≠ court : c'est l'absence de gain d'information.
- **llms.txt — format exact** : H1 `# Nom` ; blockquote `>` résumé 1 ligne ; sections `##` par type (API/How-to/Concepts/Pricing) ; 1 lien/ligne `[Titre](url): description` ; section `## Optional` = ce que l'IA peut sauter. Pluriel obligatoire (`llms.txt`).

## Marché FR — momentum à surfer (angle keywords)
- Claude Code : ×10 en 3 mois (depuis mai 2025), run-rate > 2,5 Md$ ; postes "AI coding tools" +340 % janv-25→janv-26, rôles d'implémentation pure −17 %. APEC : emplois IA/ML +72 % 2023→2025.
- Long-tail FR à miner (AlsoAsked FR + `site:reddit.com/r/IntelligenceArtificielle` + autocomplete a→z) : "comment créer un agent IA", "c'est quoi un agent IA", "combien coûte un agent IA", "agent IA vs automatisation", "créer un agent IA sans code", "former ses équipes à l'IA", "créer un logiciel IA en X jours", "Claude Code c'est quoi / comment utiliser", "les 8 étapes pour créer un agent IA".
- Concurrents qui rankent déjà (angles à dépasser) : jedha.co, data-bird.co, impli.fr — fortement "no-code (Make/n8n/Dust)". **Différenciateur Parrit = Claude Code hands-on / "au-delà de ChatGPT" + preuve first-hand de déploiements réels.**

## Sources principales
Princeton GEO (KDD 2024) · Ahrefs (Topical Authority, AI Overview Citations) · Search Engine Land (Topic Clusters) · Google Search Central (Core Web Vitals, SEO Starter) · Semrush (llms.txt) · Averi.ai, Citedify, SEOcrawl.ai (AI Overviews) · Geneo.app, Search Engine Zine (schema) · Digital Applied, Breakline Agency (scaled content) · Lead-Gen Economy, Keywords Everywhere (E-E-A-T) · AlsoAsked, JetLearn (keyword research) · Build with Matija, Frida Marketing (Next.js hreflang/canonical).
