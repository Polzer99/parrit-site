# Bandeau « Agnostiques par nature » et retrait de l'architecture (Paul, 27/10/2026, soir)

Décision de Paul, maquette vue (film « Parrit-bandeau-technologies ») : « ça me va, le bandeau comme
ça ». Elle **remplace** la règle de la passe 4 « ne pas dévoiler la stack » : Parrit.ai est agnostique
par nature et propose à chaque client la meilleure technologie pour son besoin ; on montre donc un
maximum de modèles, les outils que les gens connaissent, et des briques pointues que peu connaissent.

Maquette (lecture seule) : `/private/tmp/claude-501/-Users-paullarmaraud/b2420e7f-18c7-4612-878e-b13d9a2a28d0/scratchpad/maquette-bas/frontiere.html`
(rendu) et `tech_band.py` (structure). Logos prêts, monochromes, sans couleur :
`/private/tmp/claude-501/-Users-paullarmaraud/b2420e7f-18c7-4612-878e-b13d9a2a28d0/scratchpad/tech-assets/` → à copier dans `public/tech/`.

## 1. Le bandeau

- Section `id="technologies"` (FR et EN), **juste après le hero**, fond `--ink`, texte blanc.
- Une ligne : « Agnostiques par nature : **pour chaque besoin, la meilleure technologie.** » /
  « Technology-agnostic by nature: **for every need, the best technology.** » (première partie en
  `--on-ink`, seconde en blanc gras).
- Dessous, une bande qui défile de droite à gauche (60 s par tour, `linear infinite`, pause au survol,
  seconde copie en `aria-hidden`), chaque élément = logo 26px en `mask-image` fond blanc + nom en
  18px gras. Élément sans logo : petit carré blanc 14px + nom. Aucun dégradé, aucun rose.
- Mouvement réduit : pas de défilement, une seule copie, éléments qui passent à la ligne.
- Liste, dans cet ordre (nom affiché · fichier) :
  - Modèles : Claude · claude, ChatGPT · openai, Gemini · gemini, Mistral · mistral, Llama · meta,
    Qwen · qwen, DeepSeek · deepseek, Kimi · kimi, MiniMax · minimax, GLM · zhipu, Grok · grok,
    Hermes · nousresearch, Cohere · cohere, Perplexity · perplexity, Gemma · gemma, Copilot · copilot,
    Instinct (sans logo) ;
  - Agents et outillage : Claude Code · claude, Codex · openai, MCP · mcp, OpenRouter · openrouter ;
  - Construction et données : n8n · n8n, Python · python, FastAPI · fastapi, Next.js · nextdotjs,
    Supabase · supabase, PostgreSQL · postgresql, Docker · docker, Playwright (sans logo) ;
  - Hébergement : OVH · ovh, Vercel · vercel, Cloudflare · cloudflare, GitHub · github ;
  - Là où travaillent les équipes : Google · google, Microsoft · microsoft, WhatsApp · whatsapp,
    Telegram · telegram ;
  - Briques pointues : Wispr Flow, Plaud, Phantombuster, Lemlist (sans logo).
- La liste vit dans un seul fichier de données (`src/system/technologies.ts`), pour être mise à jour
  sans toucher au composant.
- Mention sous le bandeau, en `--on-ink`, 16px : « Les marques citées appartiennent à leurs
  propriétaires. Nous les utilisons ; aucun partenariat n'est sous-entendu. » (texte existant, EN existant).
- `public/tech/SOURCES.md` : provenance (`@lobehub/icons-static-svg@1.60.0` et `simple-icons@15.16.1`,
  par fichier), date du 27/10/2026.

## 2. Retrait de la section architecture

- Supprimer `#architecture` (« Le trajet d'une donnée »), son composant `DataArchitecture.tsx` s'il
  n'est plus utilisé, ses textes et son CSS, et les icônes de `public/tools/` devenues inutiles.
- `next.config.ts` : `/standard` et `/systems` → 308 vers `/#technologies` et `/fr#technologies`.
- Ordre des sections : hero, technologies, applications, ce qui change, parcours, services,
  partenaires, références, fondateur et contact. Navigation « Applications » selon l’amendement §4.

## 3. Documents et tests

- `AGENTS.md` et `TRUTH.md` : remplacer la règle « Ne pas dévoiler la stack interne » de la passe 4 par
  la décision ci-dessus (bandeau agnostique, liste dans `technologies.ts`), et mettre à jour l'ordre.
- Tests : structure (section `technologies` juste après le hero, tous les noms de la liste présents
  dans le HTML serveur, copie de boucle en `aria-hidden`, aucune `#architecture`), redirections,
  mouvement réduit sans animation, « un bloc = un écran » (le bandeau tient aux trois tailles),
  aucune couleur littérale dans les SVG de `public/tech/`, contraste du texte sur `--ink`.
- Batterie : `npm ci && npm run lint && npm run build && npm test && npm run qa:brand:rev01 &&
  npm run qa:claims:rev01 && npm run test:brand-os` ; navigateur rejoué par Claude sur l'hôte.

## 4. Amendement du 27/10, soir (Paul)

1. **Section des trois téléphones conservée, présentée comme des applications concrètes** (Paul : « on
   n'a rien à prouver », « juste des cas en quelques applications concrètes »). Dans `#en-production` /
   `#in-production` (identifiants inchangés) :
   - titre « Quelques applications **concrètes.** » / « A few **real-world applications.** » au lieu de
     « Nos agents travaillent déjà chez nos clients. » ;
   - retirer les lignes de nom de client sous chaque téléphone (« Clevery Avocats. », « Forexpert. »,
     « Laparra, sur le téléphone de l'équipe. ») ; garder le titre de chaque scène et la note
     « Scènes reconstituées sur données fictives, fidèles aux systèmes en service. » ;
   - la section ne dépend plus de la permission de publication des clients pour s'afficher (elle ne
     nomme plus personne) ; les noms et logos clients restent dans `#references` avec leurs règles ;
   - navigation : « En production » / « In production » devient « Applications » / « Applications »
     (même ancre).
2. **Bouton rose du hero** : sur ordinateur, « Parlons de votre transformation » tient sur **une seule
   ligne** (largeur de contenu, `white-space: nowrap`), placé sous la phrase d'accroche et aligné sur son
   bord gauche ; hauteur et rembourrage des boutons `exec` existants, plus de boîte étirée. Sur
   téléphone, comportement actuel (pleine largeur) inchangé. Le hero tient toujours en 1440×800.
3. Ordre final : hero, technologies, applications, ce qui change, parcours, services, partenaires,
   références, fondateur et contact. Mettre à jour AGENTS.md, TRUTH.md et les tests de structure en
   conséquence, sans assouplir aucun contrôle (le test « révoquer toutes les permissions masque les
   noms clients » reste vrai : plus aucun nom dans la section applications).

### Contrôles de l’amendement

- FR/EN, HTML serveur : les trois téléphones, titres de scène et note restent
  identiques après révocation de toutes les permissions ; aucun nom, logo ou
  attribut de preuve client dans les applications. Les références nominatives
  et leurs logos disparaissent après révocation, sans changer les règles du registre.
- Navigation ordinateur et mobile : « Applications » mène à l’ancre existante.
- À 1440×800 et 1280×720 : une seule ligne de texte dans le bouton, largeur de
  contenu sans étirement, sous l’accroche et sur son bord gauche ; rembourrage
  `exec` conservé. À 390×700 : bouton pleine largeur, retour à la ligne autorisé.
- Le contrôle du hero entier à 1440×800, les contrôles « un bloc = un écran »,
  de contraste, de mouvement réduit et de réseau restent intacts.

## 5. Tour 1 de la nuit du 27/10 (retours de Paul + revue)

1. **Trois téléphones de taille identique** (`#en-production`) : même largeur, même hauteur d'écran
   (hauteur fixe commune ; les messages s'alignent en haut ; aucun texte coupé, aucune barre de
   défilement visible), à toutes les tailles et dans le carrousel téléphone.
2. **Références** : retirer les lignes de texte sous le bandeau des logos (`reflines` : nom en gras +
   phrase). Le bandeau des logos reste ; chaque logo garde son `aria-label` (nom du client). Les
   contrôles de permission (`getSiteEvidence`, `publicationLogo`) restent la condition d'affichage.
   Les tests qui cherchent les noms dans le texte visible les cherchent désormais dans les
   `aria-label` du bandeau.
3. **Retirer la mention « Les marques citées appartiennent à leurs propriétaires… »** sous le bandeau
   des technologies (décision de Paul). Corrige du même coup l'échec actuel du test « technology band
   … reduced motion, full contents, contrast and screen » (couleur attendue de cette mention) : le test
   ne doit plus chercher cette mention, sans retirer ses autres contrôles.
4. **Offres des partenaires** (`PARTNER_OFFERS`, FR/EN) :
   - Ingénieurs IA : Des agents sur mesure · Des outils sur mesure · Le harness engineering ·
     L'intégration à vos logiciels / Custom agents · Custom tools · Harness engineering · Integration
     with your software ;
   - Automatisation et assistants : Des automatisations sur mesure · Des assistants écrits ·
     Des assistants vocaux · Des vidéos générées / Custom automations · Written assistants · Voice
     assistants · Generated videos ;
   - Chercheurs du MIT : Les déploiements exigeants · La revue d'architecture · L'évaluation des
     modèles / Demanding deployments · Architecture review · Model evaluation ;
   - les autres inchangées.
5. **Règle de lecture (neurosciences de la lecture, Paul : « que l'œil puisse saisir de quoi il
   s'agit partout »)**, appliquée à **tout texte qui change seul** (offres partenaires, cas des
   services, légende et étiquettes du hero) : durée d'affichage = 1 200 ms + 300 ms par mot, jamais
   moins de 3 000 ms ; une seule fonction partagée calcule cette durée (`readingMs(text)`), testée.
   Les cadences fixes actuelles (2,2 s, 3,5 s…) sont remplacées par cette fonction ; les départs
   restent décalés pour que deux textes voisins ne changent pas en même temps. Mettre à jour les tests
   de timing en conséquence (ils lisent la durée via la même fonction, pas une constante).
6. Ne pas toucher : le hero (« c'est canon »), les boutons, le contact, Cal.com.
