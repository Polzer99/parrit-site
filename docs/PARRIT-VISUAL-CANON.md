# PARRIT VISUAL CANON

```
DESIGN_CANON_VERSION = parrit-visual-canon/1.0
VERIFIED_AT          = 2026-09-10
SCOPE                = parrit.ai (site) + tout support Parrit.ai (deck, PDF, mail)
READY_FOR_PPT        = true
PPT_IMPACT           = major   (premiere publication : il n'existait aucun canon visuel Parrit.ai)
```

> **Ce document ne decrit pas une intention. Il decrit ce qui a ete MESURE sur le
> rendu reel**, 34 URLs x 3 viewports, 51 surfaces capturees, ~450 elements
> inspectes. Chaque regle porte son statut :
>
> - `TENUE` : verifiee au rendu, sans exception vivante. Reproductible ailleurs.
> - `TROUEE` : declaree quelque part, **cassee dans le rendu**. Ne pas la
>   reproduire telle quelle, elle est en cours de correction.
>
> Un canon qui listerait comme acquises des regles cassees ferait reproduire les
> defauts du site sur les autres supports. D'ou cette colonne.

---

## SOURCE OF TRUTH

```
CURRENT_BRAND_CANON = docs/brand-v2/  (branche brand-lab-v1, ~/parrit-site)
                      autorite de MARQUE : offre, voix, architecture, preuve, temperament.
                      ⚠ 04-VISUAL-DIRECTION.md y est celui de PAUL (paul-larmaraud.com),
                      PAS celui de parrit.ai. Ne jamais l'appliquer ici.
CURRENT_SITE        = src/system/tokens.css + src/app/(rev01)/  (les valeurs vivantes)
CURRENT_MAIN        = origin/main porte encore --red: #E10600.
                      La bascule bleue est commitee sur da/bleu-remplace-rouge, PR #250 OUVERTE.
SUPERSEDED_RULES    = DESIGN-SYSTEM.md (racine, --red #D1132F)
                      BRAND.md (Smoooth Studio, auto-marque mort le 14/08)
                      docs/design-system/VISUAL-SOURCE-OF-TRUTH.md (Concept D, REJECTED)
                      docs/site-prod-rev01/parrit-command-center-rev03.html
                        → autorite de MISE EN PAGE seulement, aucune autorite de couleur
```

**Le tempérament, qui tranche tout arbitrage** (source `docs/brand-v2/02-BRAND-ARCHITECTURE.md`,
pose explicitement comme regle de decision et non comme slogan) :

> **PARRIT.AI = OLD-SCHOOL TRUST, NEW-SCHOOL EXECUTION.**
> Institution, patrimoine, permanence, serieux, confidentialite, preuve,
> sophistication absorbee, execution moderne.
> « Ils executent comme une entreprise de demain, mais inspirent la confiance
> d'une institution. »

---

## DESIGN_PRINCIPLES

1. **La DA n'a pas pour mission de donner confiance. Elle doit supprimer tout ce
   qui empeche la competence reelle de Parrit.ai d'etre percue.** Tout le reste
   decoule de cette phrase.
2. **« BLEU = CONFIANCE » n'est pas une regle.** Le bleu est un accent, jamais une
   strategie. La confiance vient de la hierarchie, de la precision, de l'espace,
   de la coherence, de la typographie, du rythme, de la qualite des preuves et de
   l'absence de bruit.
3. **Aucun token ne sert les deux fonds.** Chaque registre a une valeur papier et
   une valeur carbone, et elles ne s'echangent jamais. Un token qui pretend
   servir les deux est une anomalie, pas une economie. (Demontre deux fois : sur
   l'accent le 09/09, sur le gris `--g4` le 10/09.)
4. **Une action remplie est toujours l'objet le plus contraste de son fond.**
5. **L'accent est reserve a la decision, a l'action qui s'execute, a l'etat
   critique, a l'objet selectionne. Jamais decoratif.** Ouvrir un menu n'est pas
   une decision. Numeroter une phase n'en est pas une.
6. **Le sens vient du libelle, pas du glyphe.** Un statut est une forme pleine
   plus un mot, jamais un pictogramme a decoder.
7. **La preuve doit peser plus que la decoration.** C'est le principe le moins
   tenu du site aujourd'hui : voir ANTI_PATTERNS.
8. **Un seuil se derive d'une mesure, jamais d'une valeur raisonnable. Une porte
   mesure le resultat, pas le moyen.**

## ANTI_PATTERNS

Interdits, quel que soit le support :

- degrade, glow, ombre decorative, coin arrondi
- cerveau, circuit, robot, galaxie, tableau de bord fictif
- icone de bibliotheque, emoji, clipart, pictogramme decoratif
- bleu corporate employe comme bequille de credibilite
- grille de trois cartes qui riment, sections de meme rythme interchangeables
- un element graphique qui MIME le serieux (sceau, badge, tampon, numero de
  revision) sans rien certifier de reel
- une affirmation mise en avant sans preuve visible a cote
- deux composants presque identiques mais pas tout a fait

---

## TYPOGRAPHY

| statut | regle | mesure |
|---|---|---|
| `TENUE` | 3 familles seulement, jamais de repli systeme visible | `document.fonts` sur 102 chargements = exactement {JetBrains Mono, General Sans, Fraunces} |
| `TENUE` | Toute capitale est en JetBrains Mono **14px**, sans exception | 20 declarations `text-transform:uppercase`, toutes en `--mono` + `--t-k` ; 0 contre-exemple au rendu |
| `TENUE` | Echelle **fermee a 9 valeurs**, plancher 14px absolu | 0 violation de plancher, 0 taille hors echelle sur 102 chargements |
| `TENUE` | H1 a 3 paliers selon le type de page, jamais 2 H1 sur une page | flagship 84px · legal 68px · standard/commission/journal 54px |
| `TENUE` | Corps 18px principal, 16px secondaire, interligne 1,60 a 1,70 | 18px sur 30/34 URLs, 496 occurrences |
| `TENUE` | Grands titres a interligne serre, jamais au-dessus de 1,10 | ratio 0,98 a 1,08 mesure sur 9 combinaisons |
| `TROUEE` | Le mono est reserve au registre fonctionnel, jamais un titre ni un paragraphe narratif | une exception vivante |
| `TROUEE` | Un meme role visuel porte un meme reglage | **10 valeurs de letter-spacing** distinctes pour le seul role « mono + capitales + 14px » |
| `TROUEE` | Un composant nomme identique se rend identique | badge date `time` : **3 implementations**, dont une a 18px au lieu de 14px (`.journal-related time`, 20/20 articles, +28,6%) |
| `TROUEE` | Un H1 a une recette | **5 recettes CSS pour H1** ; a 84px, deux graisses differentes (300 / tracking -.045em sur la home contre 500 / -.035em ailleurs) |

**Valeurs**

```
--t-k 14px   capitales mono, plancher absolu
--t-s 16px   corps secondaire, legendes, notes
--t-m 18px   corps principal (base du <body>)
--t-l 22px   h3, titres de carte
--t-xl 26px  h2 de sous-section, poids 600, interligne 1,20
--d-s clamp(30,4vw,44)   --d-m clamp(34,5vw,54)
--d-l clamp(38,6.4vw,68) --d-xl clamp(40,6.8vw,84)
```

**Fraunges (`--ed`) est quasi morte** : 4 rendus sur 102 chargements (3,9 %), 2 pages,
2 tailles, 1 poids. La doctrine la presente comme la troisieme voix du systeme.
Arbitrage a rendre : la reinstaller ou la retirer du canon. Voir OPEN_VISUAL_QUESTIONS.

**Longueur de ligne : le piege du `ch`.** La colonne d'article est declaree `66ch`
(cible Bringhurst) et rend **87 caracteres par ligne en moyenne** (min 73, max 94).
Cause mesuree : en General Sans le glyphe `0`, qui definit `1ch`, est **31 % plus
large** que le caractere moyen d'un texte courant (0,582em contre 0,443em).
**Regle utilisable partout, y compris hors web : pour viser N caracteres en
General Sans, declarer environ N x 0,76 ch.** 66ch visait 66, il faut viser 50ch.

## COLOR_SYSTEM

```
--ink     #0A0B0C     --paper   #F1F2F3
--carbon  #131518     --paper2  #FAFAFB
--carbon2 #1A1D21
--rule-l  #DDE0E3  (filets sur fond clair)    --rule-d  #24282D  (filets sur fond sombre)
--body-l  #26282B  (corps sur clair)          --label-d #C7CBCF  (labels sur sombre)
--g3      #55595E  (secondaire CLAIR)         --g2      #9CA1A6  (secondaire SOMBRE)
--steel   #3A3F47  (interface sombre, sur clair)
```

| statut | regle | mesure |
|---|---|---|
| `TENUE` | Une page a **un** registre de fond, et tout changement se fait en bloc plein, jamais en degrade ni en bande fine | 34 URLs |
| `TENUE` | Le rouge est integralement absent, sous toute forme | porte de marque + porte pixels sur les 5 icones |
| `TENUE` | La hierarchie de plan se signale par un glissement tonal du meme registre, jamais par une ombre | 34 URLs |
| `TENUE` | Les pages de lecture longue ne portent aucun accent hors bandeau fixe | 22 des 34 pages |
| `TROUEE` | `--g4 #6F757B` : **a supprimer.** Echoue AA sur les **cinq** fonds | papier 4,16 · paper2 4,47 · ink 4,23 · carbon 3,92 · carbon2 3,63, seuil 4,5. **715 des 745 echecs de contraste du site** |

## ACCENT_USAGE

```
sur fond CLAIR  (paper, paper2) : --accent       #0047B3   presse --accent-p       #00368A
sur fond SOMBRE (ink, carbon, carbon2) : --accent-clair #79ACF7   presse --accent-clair-p #6399E6
```

Une action remplie sur fond sombre prend le **fond clair** et le **texte encre**
(7,89 contre la page, 8,50 texte sur fond). Sur fond clair elle garde le profond
(7,34 dans les deux sens).

| statut | regle | mesure |
|---|---|---|
| `TENUE` | Les deux couples ne s'echangent jamais, y compris survole et presse | verifie au pixel sur le rendu |
| `TENUE` | L'accent ne colore jamais un chiffre de preuve | 0 occurrence |
| `TROUEE` | L'accent suit le registre de la surface qui le porte | **5 violations mesurees**, voir ANTI_PATTERNS mesures |
| `TROUEE` | L'accent est reserve a la decision ou a l'action | les numeros de phase 01/02/03 le portent en permanence : etiquetage de liste, pas decision |

Discipline reelle, et c'est l'actif a transporter : sur **94 occurrences d'accent**
recensees, **90 % servent une vraie decision ou action**, et 22 des 34 pages n'en
portent aucune hors bandeau fixe.

## BACKGROUND_SYSTEM

Deux registres seulement, jamais melanges dans une meme section :
**documents blanc-froid** (l'institution) et **instruments carbone** (le produit).

## GRID

| statut | regle | mesure |
|---|---|---|
| `TENUE` | Grille de contenu unique : `max-width 1160px` + marge de bord `40px` au-dessus de 760px, `20px` en dessous. Le kicker et le H1 partagent toujours le meme bord gauche | 12 des 14 URLs structurelles |
| `TROUEE` | « UNE seule grille sur tout le site » (commentaire du depot, rev01.css:264) | **4 systemes de conteneur**. Le pied de page a sa propre formule et son propre point de bascule a 859px, soit 99px d'ecart avec les 760px des pages. Bord gauche du footer a 140px contre 180px pour le contenu : **40px d'ecart mesure** a 1440 |
| `TROUEE` | Le corps d'article suit la grille | 4e systeme : 66ch centre, bord gauche a 374px contre 180px ailleurs, **234px d'ecart** |

## SPACING

| statut | regle | mesure |
|---|---|---|
| `TENUE` | Le rythme vertical est fige en px absolus, identique a tous les viewports | hero 98px, section 110px, close 130/120px |
| `TROUEE` | Echelle 8pt (`--s1` 8 a `--s8` 64) | **44 valeurs d'espacement distinctes dans rev01.css, 35 hors grille (79,5 %)**. Les tokens couvrent 18 % du reel. `40px`, valeur la plus repandue (17 occurrences, c'est la marge de bord), **n'a pas de token** : l'echelle saute de 32 a 48 |

Consequence mecanique mesuree : la marge horizontale se comprime au mobile
(40 vers 20px) mais le rythme vertical jamais. La densite du premier ecran grimpe
donc fortement du desktop au mobile, sans decision editoriale par page.

## BORDERS · RADIUS · DIVIDERS

| statut | regle | mesure |
|---|---|---|
| `TENUE` | **Rayon 0 partout. Zero exception vivante.** | ~450 elements sur 34 URLs x 3 viewports |
| `TENUE` | Epaisseur fermee a 2 valeurs : **1px** interne, **2px** reserve aux bornes de page, toujours en `--ink` | jamais melangees |
| `TENUE` | La couleur du filet suit le registre du fond : `--rule-l` sur clair, `--rule-d` sur sombre | jamais croise |
| `TENUE` | Une bordure ne se lit comme forme, donc comme commande, qu'a partir de **3 cotes** ; en dessous c'est un filet de separation | verifie sur cartes, boutons, champs |
| `TENUE` | **Une seule ombre existe** : `0 40px 80px -40px rgba(10,11,12,.4)`, un seul composant, 2 des 34 URLs | tout le CSS vivant |
| `TROUEE` | Le motif « cadre exterieur + separateurs internes » a une implementation | **2 techniques CSS** pour un rendu identique |

## CARDS

`TROUEE`. **4 cartes rendues, 4 recettes differentes**, sans classe commune :
bordure presente sur 3 sur 4, padding porte par le conteneur sur 1 sur 4 seulement.
Paddings mesures hors echelle : 30/28/26px, 36/30px, 18/22px, 16/22px.

## ICONOGRAPHY

| statut | regle |
|---|---|
| `TENUE` | **Aucune iconographie classique.** 0 pictogramme, 0 symbole d'UI illustre, 0 degrade, 0 glow. 0 balise `<svg>` inline dans le DOM rendu, sur 68 rendus |
| `TENUE` | Un marqueur d'etat est un point ou un carre plein colore, le sens vient du libelle adjacent |
| `TENUE` | Le Parrit Frame (crochets 14x14, bordure 2px) n'entoure jamais plus d'un mot, et seulement dans le H1 de la home |
| `TROUEE` | Un point d'accent suit le registre de son fond. **7 implementations independantes** du meme point ; la valeur papier est employee sur fond carbone dans 5 fichiers de marque sur 5 |

**C'est l'actif le plus distinctif du systeme.** L'absence totale d'iconographie
est ce qui separe le plus nettement Parrit d'une page de startup IA generique.
Ne jamais l'entamer « pour illustrer ».

## IMAGERY

`TENUE` mais **quasi vide** : une seule photographie sur tout le site, le portrait
du fondateur (source 600x900), rendue sur 2 des 34 pages. Jamais recadree.

## LOGO_USAGE

- Wordmark `PARRIT.AI` : **live-text**, JetBrains Mono, point a l'accent. Sur les
  34 pages. Jamais un fichier image dans le corps de page.
- Mark `[P.]` : favicon et cartes OG uniquement.
- **2 dessins distincts pour la meme marque.** Arbitrage a rendre.
- 4 exports raster (32/180/192/512), RGB identiques, mais **le point devient
  quasi invisible a 32px**.

## PROOF_PRESENTATION · NUMBER_TREATMENT

**C'est le point le plus faible du systeme, et il touche directement le
temperament.** Une marque qui revendique la preuve doit la montrer.

| mesure | valeur |
|---|---|
| visualisations de donnees sur le site | **0** |
| captures produit | **0** |
| logos clients | **0** |
| diagrammes | **0** |
| balises `<img>` dans tout le code | **1** (portrait du fondateur) |
| poids du texte H1 de la home | 131 760 px² |
| poids cumule des 3 chiffres de preuve | 33 660 px² |
| **rapport** | **le titre pese 3,9 fois toute la preuve de la page** |

- Les resultats des dossiers (« 2.5 months recovered », « €5K to €10K more per
  month », « More than 200 signals ») sont noyes dans un h3 a 22px, le traitement
  de n'importe quel autre texte.
- Les chiffres cites dans les articles sont a 18px/400 dans un `<p>` nu, sans
  aucune distinction typographique.
- `tabular-nums` n'est jamais applique a un chiffre de preuve. Sa seule occurrence
  sert l'horloge decorative.
- Le seul traitement de chiffre reserve n'apparait qu'a **un endroit** du site.
  Deux autres classes existent en CSS et ne sont **jamais rendues** (67 % de code
  mort sur ce systeme).

`TENUE` et a garder : le H1 reste toujours l'element le plus grand, un chiffre ne
le depasse jamais. L'accent ne colore jamais un chiffre.

## MOTION

| statut | regle |
|---|---|
| `TENUE` | Sous `prefers-reduced-motion`, tout tombe a 1ms. Couverture 100 %, une seule regle globale |
| `TENUE` | Les deux couples d'accent ne s'echangent pas, meme survole ou presse |
| `TROUEE` | Les tokens de mouvement sont utilises. **Aucun des 5 n'atteint jamais un visiteur.** `--micro` a 0 usage dans tout le depot. Chaque composant code sa duree en dur |
| `TROUEE` | Le focus est toujours catalogue. **5 signatures d'anneau** sur 144 elements ; **61 % (88/144) n'ont ni survol, ni focus, ni pression propres** |
| `TROUEE` | Deux listes visuellement identiques reagissent pareil. L'une souligne au survol, l'autre est inerte (23 occurrences) |

**La courbe de marque `--ease` n'est jamais ce que le visiteur ressent** : tout
micro-mouvement vecu utilise la courbe par defaut du navigateur.

## DENSITY

Mesures de reference, 51 surfaces : occupation du premier ecran **27,3 %** en
moyenne, **112 mots** visibles sans defiler.

---

## CROSS-MEDIA · ce qui transpose, ce qui ne transpose pas

Une regle n'est robuste que si elle survit a `WEB_DESKTOP`, `WEB_MOBILE`,
`PRESENTATION_16_9` et `PROJECTION_DISTANCE`. **Memes principes, valeurs
possiblement differentes par medium : meme hierarchie ne veut pas dire meme
taille de police.**

**Transpose tel quel**

- Rayon 0 absolu, filet a 2 epaisseurs (1px interne, 2px pour les bornes), couleur
  du filet suivant le registre du fond. En deck : trait net 0,75 a 1pt, jamais
  d'arrondi.
- Les deux registres opposes : une slide claire suit la regle papier, une slide
  sombre suit la regle carbone. **Un seul accent par slide.**
- L'absence totale d'iconographie. Aucune icone de bibliotheque, aucun emoji,
  aucun clipart.
- Le logo en texte reel, jamais une image bitmap : il reste net a toute taille de
  projection.
- Les **relations** entre niveaux typographiques : jamais plus de 3 a 4 niveaux
  de taille sur un meme ecran, jamais de texte de contenu sous le niveau kicker.
- Le rythme vertical fige en valeurs absolues, qui est un defaut de reactivite sur
  le web et devient le comportement voulu sur un master de diapositives.

**Ne transpose pas**

- **Le plancher de 14px est un plancher d'ECRAN.** Sur une planche 1280x720 vue de
  loin, 14px ne se lit pas. Plancher deck : voir le handoff.
- **Le rapport de dominance du titre sur le chiffre.** A l'ecran il est de 1,56x
  en faveur du titre ; en salle, un chiffre a 54px projete est illisible bien
  avant qu'un titre a 84px ne le devienne. **Un deck qui prouve par un chiffre
  doit lui donner un traitement plus dominant qu'a l'ecran.**
- La fragmentation des grilles : le deck n'a qu'un seul format, donc une seule
  marge de securite, assumee, jamais renegociee element par element.
- Tout ce qui est mouvement.

---

## CONTRAT DE HANDOFF VERS LE TERMINAL POWERPOINT

```
DESIGN_CANON_VERSION = parrit-visual-canon/1.0
PPT_IMPACT           = major
READY_FOR_PPT        = true

CHANGED              = premiere publication, aucun predecesseur
NEW_RULES            = les 8 DESIGN_PRINCIPLES ci-dessus
                       le tableau CROSS-MEDIA
                       la regle du ch en General Sans (viser N x 0,76 ch pour N caracteres)
UNCHANGED_INVARIANTS = rayon 0 · echelle fermee 9 valeurs · 3 familles ·
                       capitales = mono 14px · zero rouge · zero iconographie ·
                       les 2 valeurs d'accent qui ne s'echangent jamais ·
                       filets a 2 epaisseurs · une seule ombre
SUPERSEDED_RULES     = DESIGN-SYSTEM.md · BRAND.md · VISUAL-SOURCE-OF-TRUTH.md
                       et, pour parrit.ai uniquement, brand-v2/04-VISUAL-DIRECTION.md

DO_NOT_DO            = ne pas reprendre --g4 comme gris secondaire (il sera supprime)
                       ne pas reprendre les 10 valeurs de letter-spacing du registre capitales
                       ne pas reprendre le rapport titre/chiffre du site : il est trop faible pour une salle
                       ne pas ajouter d'icone pour illustrer
                       ne pas utiliser le bleu comme signal de confiance

OPEN_VISUAL_QUESTIONS =
  1. Fraunces : 3,9 % de presence reelle. On la reinstalle ou on la retire du canon ?
  2. Le mark [P.] et le wordmark sont deux dessins de la meme marque. On en garde un ?
  3. Plancher typographique pour un support projete : le 14px web ne tient pas en salle.
     Valeur a arreter avec le terminal PowerPoint, derivee d'une mesure de lisibilite,
     pas d'une valeur raisonnable.
  4. Le site n'a aucune preuve visuelle. Un deck peut-il en montrer que le site n'a pas ?
     Question de fond, pas de mise en page : elle remonte a Paul.
```

**Feedback attendu du terminal PowerPoint**, dans ce format :

```
PPT_FINDING= · CANON_VERSION= · SLIDE_CONTEXT= · PROBLEM= · MEASUREMENT=
WHY_CANON_FAILS_HERE= · PROPOSED_GENERAL_RULE=
```

Reponse du terminal Site : `ACCEPT_GENERAL_RULE` · `REJECT` ·
`PPT_SPECIFIC_EXCEPTION` · `NEEDS_MORE_TESTING`. Un besoin PowerPoint n'est
jamais generalise automatiquement au site.

---

## Comment ce canon se verifie

```bash
npm run qa:brand:rev01                  # tokens, ombres, radius, absence de rouge
npx next start -p 3210 &
npm run qa:network:rev01                # portes de conformite
node scripts/da-harness.mjs --label X   # le banc : 51 surfaces, vecteur de mesures + captures
```

Le banc `scripts/da-harness.mjs` est l'instrument de ce canon. Il ne juge pas, il
compte, et il permet de comparer un AVANT et un APRES par soustraction plutot que
par impression. **Un test CSS vert sans rendu reel n'est pas une validation de
direction artistique.**
