# Le contrat d'article — un contenu se décline en article rankable + vidéo

> Canon partagé `parrit-site` (rendu) ↔ `parrit-os/signals` (moteur content-factory). **Tout article** publié sur le blog respecte ce contrat, qu'il soit écrit à la main ou produit par le daily-blog-engine. C'est ce qui rend la production **mécanique** : un contenu produit (semaine Claude Code, transcript, post, idée) se décline en article SEO/GEO **+ vidéo** sans retravail de structure.

## 1. La forme (BlogPostSource, `src/lib/blog.ts`)

Un article = un objet `BlogPostSource`. Champs (★ = requis pour un article au contrat) :

| Champ | Niveau | Rôle |
|---|---|---|
| ★ `slug` | top | URL (kebab-case, sans accent) |
| ★ `date` / `publishedAt` | top | création / mise en ligne (drip). `updatedAt?` = vraie MAJ de fond uniquement |
| ★ `author` | top | « Paul Larmaraud » (author box E-E-A-T relié par `@id`) |
| ★ `pillar` | top | `agents-ia` \| `formation-agents-ia` \| `logiciel-ia-sur-mesure` → rattache au cluster, maillage bidirectionnel auto |
| ★ `keyword` | top | mot-clé tête ciblé |
| ★ `searchIntent` | top | `informational` \| `commercial` \| `transactional` |
| `sources?` | top | `{label,url}[]` — sources citées (chiffres/quotes). **Tactique GEO #1** |
| `videoUrl?` | top | embed vidéo (Argil/loupe → **Supabase**, jamais `*.vercel.app` §13) |
| `tags?` / `relatedSlugs?` | top | maillage |
| ★ `translations.{fr,en,pt-BR}` | — | par langue : `title`, `description`, `category`, `readingTime`, **`tldr`**, **`content`**, `faq?` |

Par traduction :
- ★ `title` : formulé comme la requête réelle (souvent une question).
- ★ `description` : meta, ~150 car.
- ★ `tldr` : **réponse directe 40–60 mots** (answer-first). Rendue en encart « En bref » + citable par les IA (44 % des citations viennent du 1er tiers).
- ★ `content` : `<p>` et `<h2>` uniquement. **Pas de `<ul>/<li>` dans le flux narratif**, pas de tiret cadratin `—`, pas du mot « chatbot » (gate CI `qa:doctrine`). Chaque `<h2>` = une question/outcome, suivi d'une réponse directe. Sommaire auto-généré depuis les `<h2>`.
- `faq?` : `{q,a}[]` (3–8 vraies questions PAA) → section FAQ rendue **+ `FAQPage` JSON-LD** (le schéma le plus cité par les IA).

Le rendu (TL;DR, sommaire, FAQ+JSON-LD, sources, author box, embed vidéo) est **automatique** dès que les champs sont présents (`src/app/[lang]/blog/[slug]/page.tsx`). L'auteur/le moteur ne fournit que la **substance**.

## 2. Les règles de fond (voix + GEO)
- **Answer-first** sous chaque `<h2>`. **≥1 stat datée + sourcée** tous les ~150–200 mots ; citations d'experts attribuées (nom + rôle + organisation). Cf. `RESEARCH-EXPERTS.md`.
- **Preuve first-hand** (E-E-A-T « Experience » + anti scaled-content) : vrais chiffres de déploiements, méthode vécue. L'IA rédige autour de la substance, elle ne l'invente pas (§20 : chiffres vérifiés en ligne).
- **Voix LE TAMIS** (Operating Partner, sobre, `docs/doctrine-communication`). Vision Parrit reprise sans la réciter.
- **Longueur** : 1 500–2 500 mots (cluster). Couvrir l'intention, pas un quota.

## 3. La déclinaison (un contenu → article + vidéo)

```
CONTENU PRODUIT (semaine Claude Code · transcript · post · idée · trend)
        │
        ▼  daily-blog-engine (signals/draft_blog_post.py) — émet AU CONTRAT
   BlogPostSource { slug, pillar, keyword, searchIntent,
                    translations.{fr,en,pt-BR}{ title, tldr, content<p/h2>, faq } , sources }
        │
        ├─▶ VIDÉO : script ≤500c → Argil (avatar Paul) OU loupe loop (Higgsfield)
        │        → compress 1080p → Supabase Storage → `videoUrl` (jamais vercel)
        │
        ▼  site_publisher.py → blog-generated.ts (entre sentinelles) → PR parrit-site
   RENDU AUTO : TL;DR · sommaire · FAQ+FAQPage · sources · author box · embed vidéo
        │        + rattachement pilier/cluster + maillage bidirectionnel + sitemap + llms.txt
        ▼
   Paul merge la PR (§19) = publié. Diffusion : LinkedIn (+vidéo) / TikTok → pointent vers l'article.
```

**Le blog est le HUB.** La vidéo vit en tête de l'article ; les réseaux pointent vers l'article ; l'article rattache au cluster du pilier ; les IA le citent (FAQPage + sources + answer-first). Une pièce de contenu = un actif SEO/GEO + un actif vidéo, par construction.

## 4. Ce qu'il reste à câbler (moteur)
Le rendu (parrit-site) **supporte déjà tout le contrat** (Lots 1–3 mergés). Côté moteur `signals`, le daily-blog-engine doit **émettre** ces champs :
- `draft_blog_post.py` : prompt système/utilisateur → exiger `tldr`, `faq[]`, `sources[]`, `keyword`, `searchIntent`, `pillar` ; `validate_draft` les rend requis ; bannir « chatbot » et `—`.
- `site_publisher.py` `normalize_blog_post` : faire transiter `tldr/faq/sources/keyword/searchIntent/pillar/videoUrl` vers le TS.
- Choix du `pillar` : depuis la question détectée / le sujet (mapping thématique).

→ Lot moteur confié à Codex sur `Polzer99/parrit-os-signals` (bloc fourni en chat). Une fois mergé : tout contenu produit le dimanche atterrit en article au contrat, prêt à recevoir sa vidéo.
