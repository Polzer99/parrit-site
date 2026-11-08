# CODEX SPEC — Journal en français (31 articles publiés)

Niveau de risque : moyen (nouvelles routes, référencement, contenu public). Décision de Paul du 08/11/2026 : « Lance la traduction des articles en français. »
À lancer sur `origin/main` **après la fusion de la PR `llms.txt`** (`docs/CODEX-SPEC-2026-11-08-llms-txt-articles.md`).

## Pourquoi

Étude `~/parrit-canon/docs/site-benchmark/ETUDE-CONCURRENTS-2026-11-08.md` : les clients de Parrit cherchent en français, et les assistants IA répondent en français à partir de sources françaises. Aujourd'hui `/fr/journal/:slug` redirige en 308 vers l'article anglais : sur les sujets où Parrit est seul (sécurité des agents, fiabilité en production, AI Act pour les systèmes construits en interne, coûts, souveraineté), nous n'avons aucune page française.

## Périmètre

Les **31 articles publiés** de `content/journal/*.mdx` (les 9 en `noindex: true` restent hors périmètre, leur redirection actuelle est conservée).

## 1. Contenu

- Un fichier par article : `content/journal/fr/<slug>.mdx`, **même slug** que l'anglais (une seule clé, pas de slug traduit), même frontmatter avec `title`, `description` traduits, `date` identique, et `translationOf: "<slug>"`.
- Traduction **adaptée, pas littérale** : français professionnel, vouvoiement, phrases courtes, la voix d'un fondateur qui explique ce qu'il a vu. Les titres en forme de question restent des questions. Exemples à suivre : la copie FR déjà en ligne de l'accueil (`src/system/single-page-copy.ts` côté FR, FAQ).
- **Strictement identiques** : faits, chiffres, dates, versions, noms de produits, URL, blocs de code, citations (une citation en anglais reste en anglais, suivie de sa traduction entre parenthèses si elle est nécessaire au sens). Aucun ajout, aucune suppression d'idée.
- Termes techniques gardés tels que le marché français les emploie : MCP, LLM, RPA, Claude Code, ChatGPT, prompt, hook, rollback (avec « retour arrière » à la première occurrence), « agent IA » ; « harness » → « harnais » avec « harness » entre parenthèses à la première occurrence.
- **Interdits** : tiret cadratin et demi-cadratin (`—`, `–`), « de plus », « en outre », « par ailleurs », « il est important de noter », « dans un monde où », adjectifs creux (« innovant », « puissant », « révolutionnaire »), conclusion de résumé mécanique. Le Journal ne nomme **aucun client** (liste `public-clients.ts`). Aucun prix.
- Un test lance `python3 ~/parrit-os/tools/prooflint.py` s'il est présent, sinon une vérification équivalente en Node des interdits ci-dessus sur chaque fichier FR.

## 2. Routes et référencement

- `/fr/journal/<slug>` rend l'article FR (même gabarit que l'anglais, libellés d'interface en français : date, temps de lecture, thème, navigation). La redirection 308 `/fr/journal/:slug` → `/journal/:slug` ne s'applique plus qu'aux slugs **sans** traduction ; `RENOMMAGES_JOURNAL` reste en un seul saut vers la bonne langue.
- `hreflang` `fr`, `en` et `x-default` (anglais) sur les deux versions ; canonique propre à chaque langue ; données structurées `Article` avec `inLanguage` ; bascule de langue de l'article vers son équivalent.
- Index `/fr/journal` : liens vers les articles FR, titres FR ; mêmes thèmes et temps de lecture (calcul sur le texte FR).
- Sitemap : les deux langues, avec alternates. RSS FR si le RSS est déjà par langue, sinon ne rien ajouter.
- Accueil FR, section « Derniers articles » : liens et titres FR.
- `llms.txt` (générateur de la PR précédente) : côté français, URL et titres FR ; retirer la phrase « les articles restent en anglais ».
- Contrôles existants inchangés : Journal sans nom de client, une seule action par carte d'index, `source`/UTM conservés, deny-all réseau, Brand OS.

## 3. Tests

- 31 fichiers FR, un par article publié, slugs identiques, dates identiques, mêmes nombres de titres H2, de blocs de code (contenu identique octet pour octet), de liens (mêmes URL) et de chiffres (ensemble des nombres identique) que l'original.
- Aucun interdit de la section 1 ; aucun nom de `public-clients.ts`.
- `/fr/journal/<slug>` répond 200 en français pour les 31 ; 308 inchangé pour les 9 `noindex` ; `hreflang` réciproques ; sitemap complet ; bascule de langue.
- Batterie : `npm ci --silent && npm run lint && npm run build -- --webpack && npm test`. Ne pas committer les PNG réécrits sous `.codex-handoffs/brand-os-p1/after/`. Playwright sera rejoué par Claude sur l'hôte.
