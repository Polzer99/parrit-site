# EXIGENCE-SITE-PARRIT v1 — la barre de qualité de parrit.ai

> Posée le 09/09/2026 sur demande de Paul : « un check de cohérence et
> d'alignement sur toutes les pages une par une, pour atteindre les standards
> de présentation grand compte. Mis à plat par Bénédicte et par toutes les
> présentations qu'on délivre en ce moment. »
>
> parrit.ai est un livrable client, pas une vitrine. Il passe la même barre
> qu'un deck qui circule chez un grand compte. Ce document est à **CLIQUET** :
> la barre monte, jamais ne descend. Chaque règle vérifiable par une machine
> l'est par un gate — une règle sans mécanisme n'est pas une règle, c'est un
> souvenir.

## D'où viennent ces règles

Elles ne sont pas inventées ici. C'est la traduction, pour parrit.ai, de
`docs/EXIGENCE-SITE.md` du site paul-larmaraud.com, lui-même tiré des doctrines
éprouvées sur les decks : DECK QUALITY GATE (01/09), exigences Bénédicte
(08/09), §53 ANTI-SLOP, et le corpus de cognition visuelle.

Une différence assumée avec paul-larmaraud.com : le canon de parrit.ai compte
**trois** familles typographiques aux rôles fixes (General Sans pour ce qui se
lit, JetBrains Mono pour le registre technique, Fraunces pour les grands titres
éditoriaux), et non deux.

## Les règles

### 1. Rien ne touche rien
Aucun texte ne touche un bouton, un filet ou un autre texte. Écart minimal de
**12 px** entre un texte et un élément d'action. Vérifié par
`tests/aeration.spec.ts`, aux largeurs 1440 et 390.

*Écart relevé le 09/09 : la ligne de preuve et le bouton d'action à **0,00 px**
sur six pages.*

### 2. L'espace après un titre croît avec le titre
L'écart entre un titre et ce qui le suit vaut au moins **0,6 fois** sa taille.
Un écart fixe de 21 px sous un titre de 54 px ne sépare rien.

### 3. Un titre ne casse pas au milieu d'un terme
`text-wrap: balance` sur les titres, `text-wrap: pretty` sur les chapôs. Aucune
veuve, aucun terme composé scindé par un retour à la ligne.

### 4. Une rangée d'objets s'aligne sur sa ligne de base
Trois cartes côte à côte alignent leurs pastilles de statut, quel que soit le
nombre de lignes de leur texte. La règle vaut pour toute grille d'objets de même
nature.

### 5. Échelle typographique fermée
*(à instruire — 25 crans distincts mesurés le 09/09 sur l'ensemble du site, dont
des demi-pixels issus de tailles fluides non arrondies. Lot séparé.)*

### 6. Plancher de lisibilité
*(arbitrage Paul du 09/09 : **14 px partout**, sans exception. 551 textes sous
14 px mesurés ce jour-là, dont 30 à 9 px. Lot séparé : ce qui ne mérite pas
14 px ne mérite pas d'être sur la page, on coupe le contenu, jamais la police.)*

### 7. Contraste AA sur tout texte
Ratio ≥ 4,5:1 pour le corps, ≥ 3:1 au-delà de 24 px. *238 textes sous le seuil
mesurés le 09/09, dont tout le registre mono gris à 4,23. Lot séparé.*

### 8. Un registre typographique encode une différence
Fraunces ne cohabite avec General Sans sur une même page que si la différence
porte une information. *Relevé le 09/09 sur `/dossiers` : H1 en General Sans,
deux titres de section en Fraunces, sans que rien ne distingue leurs rôles.*

### 9. Rien d'infondé, aucune promesse gratuite
Toute promesse chiffrée ou nominative affichée est tenable et tenue. Une
promesse d'envoi implique un envoi qui fonctionne. *Relevé le 09/09 :
« Chaque entrée arrive par e-mail le jour où elle paraît » alors qu'aucun code
n'envoie quoi que ce soit.*

### 10. Parallélisme des listes
Dans une liste, deux entrées consécutives ne commencent jamais par le même mot.
*Relevé le 09/09 sur `/standard` : PS-02 « Chaque signal… » suivi de PS-03
« Chaque décision… ».*

## Definition of Done

- [ ] `npm run build` vert ; `qa:brand:rev01` vert ;
- [ ] `qa:network:rev01` vert, **lu par le code de sortie**, jamais par un
      extrait de log ;
- [ ] captures réelles à 1440 et 390 — **regardées**, pas seulement produites ;
- [ ] preuve que la PRODUCTION sert le changement (mesure sur le domaine), pas
      seulement que le déploiement a répondu.

## Journal du cliquet

- **v1 — 09/09/2026** : création, après un passage page par page. Défauts
  constatés le jour même en production : texte collé au bouton à 0,00 px sur six
  pages ; 21,6 px sous un titre de 54 px ; trois titres cassés au milieu d'un
  terme composé ; une veuve sur `/standard` ; trois pastilles de statut
  désalignées sur `/dossiers` ; une colonne du Standard si étroite qu'un intitulé
  y tombe sur cinq lignes ; 25 crans de taille ; 551 textes sous 14 px ; 238 sous
  le seuil AA ; deux registres typographiques croisés sur `/dossiers`.
