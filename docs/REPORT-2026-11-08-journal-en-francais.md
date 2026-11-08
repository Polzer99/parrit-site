# Journal en français : correctif 1 du 08/11/2026

La traduction des 31 articles, le lecteur bilingue, les routes et le référencement
étaient déjà implémentés dans le checkout demandé, à
`2e070801e735c1b454ae3bf1ea8fc4f40fd4bae0`, branche
`codex/docs-CODEX-SPEC-2026-11-08-journal-en-francais-md`.
Le seul changement préexistant était l'amendement « Correctif 1 » de la spec.
Il est conservé intégralement.

Cette passe applique cet amendement et revalide les contrats existants.
Plan exécuté : référence avant modification, nouveaux tests en échec, correction
du corpus, même batterie après, relecture indépendante. Écritures uniquement dans
ce dépôt local, réversibles par le diff de cette passe ; aucune donnée métier
ni aucun système externe modifié. Aucun commit, push ou déploiement.

## Fichiers modifiés

Les 31 éditions françaises ont été parcourues et contrôlées. Onze nécessitaient
une correction, sous `content/journal/fr/` :

- `agents-that-fabricate-facts.mdx` : milliers dans le titre et le corps.
- `ai-act-compliance-register.mdx` : pourcentages.
- `ai-act-marking-deadline-systems-you-built.mdx` : pourcentage.
- `ai-cost-french-vs-english-tokens.mdx` : décimales, milliers, pourcentages et
  singulier « 1,36 token par mot ».
- `ai-prospecting-weak-signals.mdx` : pourcentages.
- `automated-crm-for-smes.mdx` : pourcentage.
- `computer-use-what-it-can-undo.mdx` : milliers dans la prose.
- `glm-5-2-sovereignty.mdx` : scores et montants décimaux, pourcentages.
- `permission-layer-for-coding-agents.mdx` : milliers et pourcentages.
- `what-a-pilot-skips-to-look-finished.mdx` : pourcentages, description comprise.
- `whatsapp-business-agent.mdx` : pourcentages.

Les séparateurs de milliers sont des espaces ; les pourcentages utilisent
l'espace insécable U+00A0. Les titres anglais cités contenant `1,355-row`, les
versions et modèles (`GPT-4.1`, `0.14.0`, etc.), les URL et le code sont préservés.
Les faits et valeurs numériques ne changent pas.

Autres fichiers :

- `tests/journal-translations.test.mjs` : nombres et prix comparés après
  normalisation par langue ; contrôles explicites des versions, extraits de
  code et citations ; 33 nouveaux tests.
- `public/llms.txt` : régénéré par le prebuild, quatre lignes françaises mises
  à jour à partir des titres/descriptions corrigés, sans édition manuelle.
- `AI_CONTEXT.md` : état et validation de ce correctif.
- Ce rapport.

## Tests et résultats

| Vérification | Avant | Après |
| --- | --- | --- |
| `npm ci --silent` | Réussi | Réussi |
| `npm run lint` | Réussi | Réussi, aucun avertissement ESLint |
| `npm run build -- --webpack` | Réussi | Réussi |
| `npm test` | 278/278 | 311/311 |
| `npx tsc --noEmit` | Non rejoué séparément | Réussi |
| `npm run qa:brand:rev01` | Non rejoué séparément | Réussi |
| `npm run qa:claims:rev01` | Non rejoué séparément | Réussi |
| `npm run test:brand-os` | Inclus dans npm test | 19/19 |
| `git diff --check` | Sans objet | Réussi |

Les 33 ajouts sont deux tests de garde-fous numériques et un test de typographie
par article. Ils couvrent notamment la distinction entre `1,355` anglais
(mille trois cent cinquante-cinq) et français (un virgule trois cent
cinquante-cinq), les trois espaces de groupement, les changements de valeurs et
de devises, les décimales, pourcentages, années, références, code et citations.
Les versions et extraits de code sont comparés à l'identique dans les 31 tests
de fidélité existants. L'égalité brute des nombres est remplacée conformément
au nouveau contrat, sans assouplir les autres contrôles.

Avant correction du contenu, les nouvelles attentes produisaient 13 échecs sur
68 tests ciblés. Après correction, un faux positif sur « fin de 2027 » a été
résolu en reconnaissant ce contexte de date, avec un cas positif explicite.
Résultat ciblé final : 68/68, également rejoué par la revue indépendante.

La suite complète vérifie notamment les 62 rendus compilés FR/EN sans réseau,
les 31 routes traduites, les neuf redirections noindex, les renommages, les
alternates réciproques, canonicals, Article/inLanguage, sitemap, navigation,
attribution, cartes et génération llms. `prooflint.py` a été exécuté sur les
31 fichiers ; les deux exceptions préexistantes restent limitées aux placeholders
des citations anglaises imposées par les originaux. Aucun nouveau diagnostic.

## Préservation et limites

La spec conserve son SHA256 de début de session :
`9a25a244ea84824af00de77f064027d4cd919d6200c1d895534bb013cc294ac9`.
Les originaux anglais, certificats et PNG de `.codex-handoffs/brand-os-p1/after/`
n'ont pas été modifiés. Aucun changement de route, composant, CSS, seuil
géométrique, stabilité ou deny-all réseau.

Aucun blocage technique. Playwright est réservé à Claude sur l'hôte par la spec :
pas d'exécution navigateur ni de nouvelles captures dans cette passe. Le rendu
réel, les interactions et l'effet en production restent à vérifier après ce
handoff ; les tests serveur ne constituent pas cette preuve.

Les avertissements Next `metadataBase` et Node `MODULE_TYPELESS_PACKAGE_JSON`
sont présents avant et après. Ils ne bloquent pas les commandes.

L'ambiguïté déjà documentée entre « aucun prix » et la conservation stricte des
faits/chiffres de l'original GLM reste inchangée : ses seuls tarifs tiers sont
conservés, avec virgule française (`$4,40`, `$1,40`). Aucun prix nouveau ni tarif
Parrit ajouté. La relecture indépendante n'a identifié aucun défaut restant
dans le périmètre de ce correctif.
