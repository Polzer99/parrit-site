# BRAND LAB V1

**Statut : atelier interne. Non public, non indexable.**
Date : 12/08/2026 · Dépôt : `parrit-site` · Auteur de la tranche : Claude, sous
la direction de Paul.

Ce document est la note de synthèse du Brand Lab. Il dit ce qui a été construit,
ce qui a été décidé, ce qui reste ouvert, et ce qui manque pour aller plus loin.

---

## 1. Ce que c'est, et ce que ce n'est pas

**C'est** un laboratoire de direction artistique en code, navigable, pour faire
émerger la marque par la réaction plutôt que par la description. Quatre routes,
un core partagé, trois températures.

**Ce n'est pas** le futur site, ni le Design System, ni une refonte de
`parrit.ai`. Rien de ce lab n'est branché sur le site public.

**Sens de circulation :** le lab explore, Paul et Maxime arbitrent, les
directions retenues remontent dans le Figma, et le vrai Design System se
construit là-bas. Le Figma ne redescend pas vers le code avant cette étape.

### Les quatre URL

**En ligne**, branche `brand-lab-v1`, preview Vercel. L'URL suit la branche :
chaque push la met à jour, et la production `parrit.ai` n'est pas touchée.

```
https://parrit-site-git-brand-lab-v1-parritai.vercel.app/brand-lab/inspirations
https://parrit-site-git-brand-lab-v1-parritai.vercel.app/brand-lab/paul
https://parrit-site-git-brand-lab-v1-parritai.vercel.app/brand-lab/maxime
https://parrit-site-git-brand-lab-v1-parritai.vercel.app/brand-lab/parrit
```

⚠️ **La protection de déploiement Vercel est active sur ce projet.** Paul ouvre
le lien directement, puisqu'il est connecté au compte. **Maxime ne le peut
pas** : il faut soit l'ajouter à l'équipe Vercel, soit générer un lien de
partage depuis le tableau de bord du déploiement. Le jeton de contournement
inscrit dans le registre des secrets ne fonctionne plus sur ce projet, il est à
reverifier. Je n'ai pas désactivé la protection : ça exposerait une
prévisualisation de tout le site, et c'est un réglage de compte, pas une
décision de designer.

**En local**

```
http://localhost:3000/brand-lab/{inspirations,paul,maxime,parrit}
```

`/brand-lab` redirige vers `inspirations`. La barre du haut permet de passer
d'une direction à l'autre sans délai : c'est la comparaison de mémoire courte
qui fait juger, pas la lecture séparée.

### Commandes

```bash
cd ~/parrit-site
npm run dev                             # sert le lab sur :3000

node scripts/brand-lab-capture.mjs      # (re)capture les références
node scripts/brand-lab-capture.mjs --force
node scripts/brand-lab-shots.mjs        # recette : captures desktop + mobile
                                        #  + contrôle débordement et révélation
```

Les captures de recette atterrissent dans `artifacts/brand-lab/`.

---

## 2. Isolation et confidentialité

| Mécanisme | Où |
|---|---|
| Layout racine séparé, n'importe **pas** `globals.css` | `src/app/brand-lab/layout.tsx` |
| `robots: { index: false, follow: false, nocache: true }` | idem, plus sur chaque page |
| `disallow: "/brand-lab"` | `src/app/robots.ts` |
| Exclu de l'i18n, pas de préfixe de langue | `src/proxy.ts`, matcher |
| Aucun composant du site public réutilisé ni modifié | par construction |

Le lab a son propre système dans `src/app/brand-lab/lab.css`. Rien de ce qu'il
fait ne peut fuir vers le site, et rien du site n'entre.

**Les captures de références** vivent dans `public/brand-lab/refs/`. Ce sont des
moodboards internes, datés du 12/08/2026. Elles ne sont pas publiées.

---

## 3. Doctrine tenue

### Une maison, trois températures

Le core ne change jamais : grille, échelle typographique, espacements base 8,
angles à zéro, filets 1 px, aucune ombre, grain papier, jeu de composants unique.

Les thèmes ne redéfinissent **que des variables**. Aucun composant n'est réécrit
par thème. La règle de non-régression est écrite en tête de `lab.css` : si un
composant a besoin d'une règle propre à un thème, c'est le composant qui est mal
découpé.

C'est exactement la règle posée dans le Figma : *« Do not make three skins of the
same website. Keep a shared core and change the emotional temperature. »*

### Ce qui n'a pas été produit

Aucun cerveau, réseau de neurones, constellation de nœuds, orbe, robot, chatbot
flottant, fond spatial, dégradé de startup IA, noir et violet, noir et or, photo
de banque d'images, poignée de main, tableau de bord fictif avec de faux chiffres,
logo client, métrique inventée. Aucun drapeau, globe, carte du monde ni
idéogramme pour dire international. Aucun logo : hors périmètre.

La liste est affichée telle quelle en bas de la page Inspirations, barrée. Elle
sert de contrat, pas de préférence de goût.

---

## 4. Les trois expressions

### Paul · Reason. Conquest. Systems.

**Direction :** Palantir et Linear pour la tenue, Wispr Flow pour la simplicité
de l'action.

**Choix visuels.** Fond encre (`#0e0e10`), contraste haut, densité tenue, corps
en mono à 14 px, rythme de section le plus serré des trois (6 rem), motion la
plus rapide (150 ms, révélation 280 ms), rouge de la maison éclairci (`#ef1d38`)
réservé au signal.

**Choix de composition.** Le visage arrive tard, petit, en niveaux de gris. Ce
qui porte la confiance, ce sont les critères de décision écrits, les interfaces
montrées en squelette, et les fiches de preuve avec leur niveau. Le prix est
au-dessus de la ligne de flottaison, sur desktop comme sur mobile.

**Sections :** hero, ce qu'on fait ensemble, votre matière, preuves, comment Paul
pense, les 10 heures, l'autonomie après, offre, CTA final, plus un bandeau
d'arbitrage des variantes de titre visible seulement dans le lab.

### Maxime · Heart. Confidence. Learning.

**Direction :** la mécanique des marques personnelles, le registre d'un
dirigeant. Deux références, et deux seulement, sur décision de Paul du 12/08 :
Matis Clouet pour le parcours et la lisibilité de l'offre, Iman Gadzhi pour le
niveau de production média.

**Choix visuels.** Papier plus chaud (`#fbf6ef`), encre plus douce, **le même
rouge Parrit que Paul** (la terre cuite reste un accent rare), corps à 16 px,
interlignage
1,62, cartes plus généreuses (padding 2 rem contre 1 rem chez Paul), rythme
plus large, motion plus ronde.

**Le garde-fou permanent :** un patron de PME de 52 ans doit pouvoir envoyer la
page à son associé sans avoir honte. La chaleur vient de la matière, jamais de
l'or. Zéro capture de revenus, zéro promesse financière, zéro esthétique de
gourou.

**Sections :** hero humain, l'état de départ dit dans ses mots, vidéo courte,
sujets reconnaissables, preuve, le chemin, contenu, offre, CTA humain.

### Parrit · Expansion. Mastery. Permanence.

**Direction :** Aman et Bang & Olufsen pour la retenue, Palantir pour la
profondeur, Apple comme étalon de simplicité produit, Aesop pour le luxe sans
noir ni or.

**Choix visuels.** Papier crème canon (`#FFFDFA`), rythme de section le plus
large des trois (12 rem), hero le plus pauvre en texte, motion la plus lente
(620 ms, révélation 720 ms), rouge devenu rare (teinte à 7 %).

**Deux règles structurelles tenues sans exception.**

1. **Aucun prix.** L'échelle de croissance se lit sans montant.
2. **Le vocabulaire IA est absent de la page.** Ni « IA », ni « intelligence
   artificielle », ni « agentique », ni « agent ». On parle travail, opérations,
   décisions, systèmes, résultats, capacité, autonomie.

**Sections :** hero, du signal au résultat avec la décision humaine au milieu,
domaines, preuve, échelle en quatre marches, Super App, puis seulement à la fin
les deux portes vers Paul et Maxime.

---

## 5. Tokens et thèmes

Fichier unique : `src/app/brand-lab/lab.css`.

| Famille | Core | `t-paul` | `t-maxime` | `t-parrit` |
|---|---|---|---|---|
| papier | `#FFFDFA` | `#0e0e10` | `#fbf6ef` | `#FFFDFA` |
| encre | `#0C0C0D` | `#f4f4f2` | `#171310` | `#0C0C0D` |
| signal | `#D1132F` | `#ef1d38` | `#D1132F` | `#D1132F` |
| filet | `#D0D8D7` | `#2a2b30` | `#ddd2c4` | `#ddddd6` |
| rythme de section | 8 rem | 6 rem | 8 rem | 12 rem |
| corps | 16 px | 14 px | 16 px | 16 px |
| interligne corps | 1,55 | 1,5 | 1,62 | 1,7 |
| padding de carte | 1,5 rem | 1 rem | 2 rem | 3 rem |
| transition | 260 ms | 150 ms | 280 ms | 620 ms |
| révélation | 520 ms | 280 ms | 520 ms | 720 ms |
| grain sombre | 0,06 | 0,14 | 0,07 | 0,05 |

Constantes non négociables, communes aux trois : rayon `0`, aucune ombre,
filets 1 px, espacements base 8, Geist et Geist Mono, grain papier à deux
couches.

**Le prix vit dans un seul fichier**, `_lib/offer.ts`. Aucun composant ne connaît
le montant. Deux ancrages sont câblés, `2 500 € HT` (retenu, conforme au Figma)
et `2 499 € HT`. Basculer se fait sur une ligne.

---

## 6. Les références, TAKE et AVOID

**Arbitrage de Paul du 12/08, appliqué.** Le jeu est passé de 17 à 13
références. Trois retraits, chacun pour une raison différente :

- **Bain, retirée.** La capture n'était pas le site mais un mur de vérification
  Cloudflare. Une référence qu'on n'a pas vue n'est pas une référence.
- **Amazon, sortie du moodboard visuel.** Leur interface est mauvaise et leur
  identité n'a rien à nous apprendre. La fiche reste, sans aucune capture, et
  ne porte plus que la doctrine : excellence opérationnelle, obsession du
  mécanisme, temps long. Aucune influence de forme.
- **Ali Abdaal, Ramit Sethi et Sahil Bloom, retirés.** Les références de Maxime
  se réduisent aux deux sites demandés : Matis Clouet et Iman Gadzhi.

Les onze références restantes sont capturées en desktop et en mobile, visibles
sur la page Inspirations avec ce qui a été observé et la décision de design
produite. Amazon est la seule fiche sans image, et la page dit pourquoi.

| Référence | TAKE | AVOID |
|---|---|---|
| **Palantir** | gravité, systèmes, autorité par le texte, densité assumée | jargon défense, froideur, complexité inexplicable |
| **Linear** | précision, artisanat, vitesse, produit montré | devenir un outil pour développeurs |
| **Uber** | mouvement, une seule action évidente, ambition | reprendre le branding actuel |
| **McKinsey** | autorité éditoriale, cadres de pensée, crédibilité dirigeant | site institutionnel froid, langage consultant |
| **Amazon** | exécution, mécanisme, efficacité, temps long | **toute** leur forme : DA, interface, parcours. Aucune capture affichée |
| **Wispr Flow** | compréhension instantanée, friction retirée, démontrer | ton de petit logiciel grand public |
| **Matis Clouet** | marque personnelle, offre lisible, parcours contenu vers accompagnement | codes 25 ans, hustle, captures de revenus |
| **Iman Gadzhi** | production média, personne comme canal, conviction | gourou, noir et or, train de vie, promesse |
| **Aman** | silence, espace, retenue, international sans drapeau | vide qui ne dit rien |
| **Bang & Olufsen** | ingénierie désirable, technique effacée, matière | fétichisme produit sans usage |
| **Apple** | complexité rendue simple, produit en marche, détail tenu | mimétisme de gabarit |
| **RIMOWA** | fonction devenue patrimoine, permanence, une forme | nostalgie décorative |
| **Aesop** | luxe sans noir ni or, matière, texte qui respecte le lecteur | raffinement illisible |

**Règle légale tenue :** on extrait composition, rythme, densité, architecture,
mouvement, relation texte/image, hiérarchie, mécanique de conversion. On ne
reproduit jamais logo, iconographie propriétaire, wording, combinaison
distinctive, composition au pixel ni identité commerciale.

Deux références ont demandé un rattrapage à la capture : McKinsey (protocole
HTTP rejeté sur la home, capturé sur `/featured-insights` via Firefox) et Iman
Gadzhi (`imangadzhi.com` ne résout plus, capturé sur `gadzhi.com`).

**Leçon de méthode :** une capture doit être REGARDÉE avant d'être publiée dans
un moodboard. Bain est passée en vert dans le rapport du script alors que
l'image était un mur anti-robot. Le script sait dire « j'ai reçu une image », il
ne sait pas dire « c'est bien le site ».

---

## 7. Preuves : ce qui est affiché, et sur quelle source

Source unique : `~/parrit-os/canon/CASE-STUDIES-EVIDENCE-MATRIX.md` (V3,
11/08/2026). Aucun nom de client, conformément à la décision du 25/05/2026.
Aucun chiffre absent de la source primaire. Chaque fiche porte son niveau réel.

| Réf | Formulation affichée | Niveau | Ce que la page dit de l'écart |
|---|---|---|---|
| R-10 | « une marque de soin qui rend des comptes à ses investisseurs » | L5 | l'usage récurrent n'est pas encore constaté |
| R-02 | « un cabinet d'avocats » | L5 | rien de masqué |
| R-09 | « un dirigeant en recherche de poste » | L4 | rien de masqué |
| R-07 | Parrit en propre, chronique publiée | L6 | seule preuve publiable nommément |

**Aucune preuve n'a été inventée, aucun résultat non mesuré n'est affiché,
aucun démonstrateur interne n'est présenté comme un cas client.**

### Ce qui manque, affiché tel quel dans les prototypes

Cinq emplacements portent la mention explicite plutôt que du copy de
remplissage. Ce sont des commandes de travail.

| Où | Ce qu'il faut |
|---|---|
| Paul · Selected builds | une capture réelle d'un système en fonctionnement, autorisée ou floutée |
| Maxime · Hero | **portrait et vidéo de Maxime.** Le dépôt n'en contient aucun. C'est le manque le plus bloquant du lab |
| Maxime · Stories | un verbatim écrit, daté, avec accord de citation anonymisée |
| Maxime · Contenu | les vrais titres publiés, en remplacement des trois directions de sujet |
| Parrit · Watch it work | un enregistrement d'écran, du signal au résultat, sans donnée lisible |
| Parrit · Super App | les captures de l'application mobile déployée, qui vivent hors de ce dépôt |

---

## 8. Décisions prises dans cette tranche

1. **Une seule famille typographique pour les trois expressions**, Geist et
   Geist Mono. La distinction se fait par l'échelle, le poids, l'approche, la
   casse, la densité et la couleur, pas par une troisième police. Ça protège le
   « même maison » (G3). Voir §10 pour l'alternative non tranchée.
2. **Paul passe sur fond encre, Maxime et Parrit restent sur papier.** C'est le
   marqueur de température le plus lisible en une seconde, et il ne coûte aucun
   composant.
3. **Un seul rouge pour la maison, trois intensités.** Première version : Paul
   en rouge vif, Maxime en terre cuite. Corrigé le 12/08 sur demande de Paul,
   parce qu'un rouge d'un côté et un orange de l'autre faisaient deux marques et
   cassaient G3. Les trois portent maintenant le rouge Parrit `#D1132F`, celui
   de Paul simplement éclairci (`#ef1d38`) pour tenir sur fond encre. Ce qui
   distingue Maxime, c'est la chaleur du papier, pas la couleur du signal. La
   terre cuite du canon redevient ce qu'elle est : un accent rare.
4. **Le prix est affiché sur Paul et Maxime, jamais sur Parrit.** Voir la
   réserve du §11.
5. **Les 10 heures n'apparaissent sur Parrit qu'à la toute fin**, comme deux
   portes d'entrée. Parrit montre la destination, il ne vend pas l'entrée.
6. **Le mobile est composé, pas empilé.** Sur Maxime, le prix et l'action
   remontent avant les trois repères, sans jamais passer avant la promesse.

## 9. Défauts corrigés en cours de tranche

Trois, tous mesurés à l'écran, tous documentés dans le code à l'endroit du
correctif.

1. **Noir sur noir.** `.lab-section--deep` posait `--ink: var(--ink-inverse)`.
   Sur un thème déjà sombre, l'inverse de l'inverse redonne du sombre, et des
   sections entières de la page Paul étaient illisibles. Une section sombre
   déclare désormais son propre couple `--deep-bg` / `--deep-ink`.
2. **Révélations effacées.** `Reveal` ajoutait la classe `is-in` en impératif
   sur un `className` géré par React. Au premier re-render, React la réécrivait
   et le bloc repassait invisible. L'état est maintenant un état React.
3. **Recette faussée.** Le script de captures utilisait `scrollTo` alors que la
   page pose `scroll-behavior: smooth` : le défilement n'atteignait jamais le
   bas et les dernières sections sortaient à `opacity 0` sur les images. Le
   lissage est neutralisé le temps de la recette, et le script compte désormais
   les blocs non révélés comme un défaut.

## 10. Ce qui reste volontairement exploratoire

- **Les variantes de titre de Paul.** Trois directions sont câblées, la A est
  affichée, les trois sont listées en bas de page pour l'arbitrage.
- **L'ancrage de prix.** `2 500 €` retenu, `2 499 €` câblé.
- **Une seconde famille typographique.** Non testée dans cette tranche, par
  discipline. Si vous voulez la tester, l'endroit est `--font-display` dans le
  thème concerné, et le risque à surveiller est G3.
- **Le grain sur fond sombre.** Réglé à 0,14 chez Paul, ce qui est fort. À juger
  sur écran réel, pas sur capture.
- **La densité de Paul.** Corps à 14 px : tenu et précis, à vérifier sur un
  lecteur de 55 ans.

## 11. Points à arbitrer, et une réserve à lever

1. **Quelle direction pousse-t-on dans Figma ?** C'est la question de la tranche.
2. **Le portrait et la vidéo de Maxime.** Rien ne peut avancer sur cette page
   sans ça.
3. **Réserve de doctrine sur le prix.** `AGENTS.md` et `00B` interdisent tout
   prix public. Le lab est interne et non indexable, donc le montant y est
   légitime en registre `INTERNAL`. **Mais si une de ces pages devait devenir
   publique en l'état, la règle « aucun prix sur le site » s'applique et doit
   être tranchée par Paul, pas contournée par un designer.**
4. **Le statut de Maxime.** `00A` §9 note que son périmètre et son engagement
   restent hors du public tant qu'un accord écrit manque. Une page publique à
   son nom touche ce point.
5. **La clé Figma était `pending` dans le dépôt.** Elle est maintenant écrite
   dans `brand/07_FIGMA_SYNC.md`, avec l'état réel du fichier.

---

## 12. Fichiers créés ou modifiés

**Créés**

```
src/app/brand-lab/layout.tsx
src/app/brand-lab/page.tsx
src/app/brand-lab/lab.css
src/app/brand-lab/_components/LabNav.tsx
src/app/brand-lab/_components/Reveal.tsx
src/app/brand-lab/_components/kit.tsx
src/app/brand-lab/_lib/offer.ts
src/app/brand-lab/_lib/proof.ts
src/app/brand-lab/_lib/inspirations.ts
src/app/brand-lab/inspirations/page.tsx
src/app/brand-lab/inspirations/inspirations.css
src/app/brand-lab/paul/page.tsx
src/app/brand-lab/paul/paul.css
src/app/brand-lab/maxime/page.tsx
src/app/brand-lab/maxime/maxime.css
src/app/brand-lab/parrit/page.tsx
src/app/brand-lab/parrit/parrit.css
scripts/brand-lab-capture.mjs
scripts/brand-lab-shots.mjs
public/brand-lab/refs/*.jpg          (34 captures, moodboard interne)
artifacts/brand-lab/*.jpg            (captures de recette)
BRAND-LAB-V1.md
```

**Modifiés**

```
src/app/robots.ts            disallow /brand-lab
src/proxy.ts                 brand-lab hors i18n
brand/07_FIGMA_SYNC.md       clé du fichier Figma et état réel
```

Aucun fichier du site public n'a été touché au-delà de ces trois lignes de
routage. `globals.css`, `HomeClient.tsx` et les composants du site sont intacts.

## 13. Portes de qualité passées

| Porte | Résultat |
|---|---|
| `npx tsc --noEmit` | passe |
| `npx eslint` sur le périmètre | passe |
| `npm run qa:doctrine` | passe, y compris l'interdiction du tiret cadratin |
| `npm run build` | passe, les 4 routes prérendues en statique |
| `node scripts/brand-lab-shots.mjs` | aucun débordement horizontal, aucune erreur de page, aucun bloc non révélé, en 1440 et en 390 |
| `scripts/contrast-audit.py` sur les 4 routes | **0 texte sous le seuil**, les quatre routes propres |

Non fait, et à faire avant tout usage plus large : revue clavier et focus
visible, revue `prefers-reduced-motion` sur machine réelle (la règle CSS est
posée mais n'a pas été vérifiée avec le réglage système activé), et jugement sur
écran plutôt que sur capture, en particulier pour le grain de Paul.
