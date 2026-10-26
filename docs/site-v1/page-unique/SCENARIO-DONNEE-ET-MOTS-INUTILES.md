# Scénario « la donnée devient un résultat » + chasse aux mots inutiles (27/10/2026)

Décisions de Paul : animation demandée (« une data qui devient de l'or… ou du pétrole, une petite référence à l'histoire ») ; résultat final en **rose** (exception écrite à « un seul éclat rose par écran », validée par Paul le 27/10) ; « fais un check des mots inutiles ».

Référence visuelle validée : prototype `MAQUETTE-VALIDEE` étendu, film `Parrit-scenario-donnee.mp4` (bloc SVG ci-dessous).

## 1. Animation dans l'ontologie du haut de page (`SinglePage.tsx`, svg `.onto`)

Ajouter, dans le SVG existant, un groupe `story` qui raconte un cycle de 9 s en boucle :

1. Un libellé « E-mail client » apparaît au-dessus du nœud Clients (x 190, y 18), puis s'efface.
2. Un carré blanc de 12 px (le jeton) suit le chemin `M190 40 L310 130 L260 220 L520 220 L1010 130` : donnée → règle Validation → un agent → l'agent suivant → sortie à droite.
3. À l'arrivée, une case **rose** (`--accent-on-dark`, 140 × 36, centrée en x 1010, y 165) affiche « Relance prête » en encre, graisse 600. Libellé « Résultat » au-dessus (x 1010, y 122), même style que « Vos données ».
4. Le jeton disparaît, la case s'efface, le cycle recommence.

Code de référence (prototype, à porter en JSX, ids préfixés `onto-` comme les autres) :

```
<text x="1010" y="122" class="lab" text-anchor="middle">Résultat</text>
<path id="storyPath" d="M190 40 L310 130 L260 220 L520 220 L1010 130" class="edge ghost"/>
<rect width="12" height="12" x="-6" y="-6" class="token">
  <animateMotion dur="9s" repeatCount="indefinite" keyPoints="0;0;.18;.36;.62;1;1" keyTimes="0;.05;.25;.42;.6;.78;1" calcMode="linear"><mpath href="#storyPath"/></animateMotion>
  <animate attributeName="opacity" values="0;1;1;1;1;0;0" keyTimes="0;.05;.25;.42;.6;.78;1" dur="9s" repeatCount="indefinite"/>
</rect>
<g transform="translate(1010 165)">
  <rect x="-70" y="-18" width="140" height="36" class="gold"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.76;.8;.96;1" dur="9s" repeatCount="indefinite"/></rect>
  <text y="6" text-anchor="middle" class="goldt"><animate .../>Relance prête</text>
</g>
<text x="190" y="18" text-anchor="middle" class="nt in">E-mail client<animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;.04;.2;.26;1" dur="9s" repeatCount="indefinite"/></text>
```

Sous le SVG, une ligne visible (classe `humby`, 16 px, couleur `--on-canard`, marge haute 20 px) :
- FR : « La donnée est le nouveau pétrole », disait Clive Humby en 2006. Brute, elle ne sert à rien : nous la raffinons.
- EN : “Data is the new oil,” Clive Humby said in 2006. Raw, it is useless: we refine it.

(Source : ICO, « Data is the new oil », discours de Clive Humby, conférence ANA 2006. Seule la phrase courte lui est attribuée ; la suite est la nôtre.)

EN du SVG : « Client e-mail », « Follow-up ready », « Result ».

Contraintes :
- `prefers-reduced-motion: reduce` : pas de jeton, case rose et texte affichés en permanence (état final statique).
- À 390 px : si les libellés du SVG deviennent illisibles (< 11 px rendus), suivre le comportement mobile actuel de l'ontologie ; la ligne Humby reste visible.
- Rayon 0, pas d'ombre, pas de dégradé, pas de police mono.
- Si un test « un seul rose par écran » échoue, ajouter une exception **nommée et limitée** à `.onto .gold` (commentaire : « exception validée par Paul le 27/10/2026 »), ne pas désactiver le test.
- Ajouter à `tests/single-page.spec.ts` : la case « Relance prête » / « Follow-up ready » existe, son fond calculé est le rose d'action ; en mouvement réduit elle est visible (opacité 1) ; la ligne Humby est visible FR et EN.

## 2. Mots inutiles (FR, et l'équivalent EN dans `single-page-copy.ts`)

Ne pas toucher : le titre du haut, le sous-titre « matière première », la ligne Laparra des références, la case MIT, la mention sur les marques, « Scènes reconstituées sur données fictives… » (première phrase), les « Exemple illustratif ».

| Avant | Après | Pourquoi |
|---|---|---|
| Scènes reconstituées sur données fictives, fidèles aux systèmes en service. Rien ne part sans l'accord d'une personne. | Scènes reconstituées sur données fictives, fidèles aux systèmes en service. | « Rien ne part sans accord » est dit quatre fois sur la page ; on le garde dans Garde-fous. |
| Chez Parrit.ai, aucun message ne part sans l'accord d'une personne. | (supprimer) | Doublon de « Rien ne part sans validation. » juste au-dessus. |
| Un agent écrit le code, d'autres le vérifient. | (supprimer) | Répète les trois lignes au-dessus. |
| Forexpert, chaque matin. | Forexpert. | « chaque matin » déjà dans la phrase d'au-dessus. |
| Clevery Avocats, chaque matin. | Clevery Avocats. | « démarre sa journée » le dit déjà. |
| Choisir les priorités, puis mettre en place des solutions rapides et utiles. | Choisir les priorités, puis livrer des solutions rapides. | « mettre en place », « et utiles » : remplissage. |
| Plus de dix ingénieurs en IA appliquée, chacun sa spécialité : vision, agents, intégration. | Plus de dix, chacun sa spécialité : vision, agents, intégration. | Le titre dit déjà « Ingénieurs IA ». |
| Des experts de la conduite du changement et du pilotage de projet. | Conduite du changement et pilotage de projet. | « Des experts de » répété trois fois. |
| Des experts de l'image de marque, des contenus et de la vente. | Image de marque, contenus et vente. | Idem. |
| Une quinzaine de formateurs mobilisables, et un organisme certifié. | Une quinzaine de formateurs et un organisme certifié. | « mobilisables » n'apporte rien. |
| Il a fondé Parrit.ai en 2024, après deux ans chez Lime. | En 2024, après deux ans chez Lime. | La ligne d'au-dessus dit déjà « fondateur de Parrit.ai ». |
| Il met en place les garde-fous qui encadrent les agents. | Il pose les garde-fous qui les encadrent. | Plus court, « agents » déjà dans la phrase d'avant. |
| Une adresse e-mail suffit. Nous revenons vers vous personnellement, avec un exemple si votre besoin correspond à un cas déjà esquissé. | Une adresse e-mail suffit. Nous vous répondons nous-mêmes. | La fin est floue ; « personnelle » est déjà dans la ligne du bas. |
| PARRIT / COMMANDE | (supprimer, ou « Prendre rendez-vous » en casse normale si un titre est nécessaire) | Reste de l'ancien univers « geek », interdit par la charte (pas de surtitre en capitales). |
| VISIO, VOTRE DEMANDE | Visio, Votre demande (casse normale) | Pas de surtitres en capitales. |

Si un test fige un de ces libellés, adapter le test au nouveau libellé (ne pas garder l'ancien texte).

## Batterie

`npm run lint && npm test && (npm run build || npx next build --webpack) && npm run qa:brand:rev01 && npm run qa:claims:rev01 && npm run test:brand-os`. Le navigateur se teste sur l'hôte (Claude). Ni commit ni push.
