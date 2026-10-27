# Passe 3 — compte rendu du 27/10/2026

La passe 3 est implémentée en français et en anglais sur `feat/passe-3-page`,
à partir de `3ccc069829b750b591f6ec3276edde87d058b425`. La spec fournie était
le seul fichier non suivi au démarrage. Aucun push ni déploiement.

## Périmètre réalisé

- Maquette §0 initialement copiée à l'identique dans `maquette/`, sauf le MP4 demandé.
  Après nettoyage, seuls `index.html`, `hero.js`, `hero.css` et le dossier
  `icons/` sont conservés au dépôt.
  Logos et huit icônes copiés sans modification depuis les assets fournis.
  Vérification byte-identical des 56 fichiers fournis réussie au moment de la copie.
  La source `hero.js` a ensuite été constatée différente de la version lue en
  début de session (flux continu de quatre résultats au lieu des trois histoires).
  L'archive `hero.js` est figée sur les octets de la lecture initiale, récupérés
  depuis le journal de cette session, conformes au §2 : SHA256
  `3e808af1e0630df29dab824d4c4dda7fd8c4e48fa38c12fce089affd6b24a96d`.
  Aucun changement concurrent hors dépôt n'a été écrasé.
- Hero : cinq données, quatre règles, six agents, seize arêtes et cinq échanges,
  trois histoires (4,2 s, pauses 1,6/3,2 s), résultats et légende bilingues.
- Parcours : humain et agent, décors et durées du `seq` fourni ; trois étapes
  alignées sur fond clair comme la maquette, ligne « Déjà équipés ? » conservée.
- Douze services, progression décalée, sept partenaires et sélection séquentielle.
- Cinq logos en masque local, deuxième copie masquée aux lecteurs d'écran,
  boucle de 28 s et pause au survol ; références textuelles inchangées.
- Architecture en cinq cartes, rail de 12 s, résultats roses successifs,
  outils et mention de marques ; une colonne sous 960 px.
- Contact : titre sans point, localisation retirée, variante visible de
  QuickCapture avec bouton ghost ; endpoint et charge utile inchangés.
- Garde-fous retirés ; navigation, langue, redirections 308 et llms régénéré.
  Cal.com, texte des téléphones/panneaux, portrait et Journal conservés.
- AGENTS, TRUTH, AI_CONTEXT, provenances et tests actualisés. Aucun seuil de
  marque, contraste ou anti-slop abaissé ; aucun secret ajouté.

## Arbitrages par rapport à la maquette

1. Les 13/14/15/17/24 px de la maquette deviennent des valeurs de l'échelle
   canonique 16/18/22/26 px selon leur rôle. H1 et boutons principaux gardent
   leurs tailles existantes ; H3 reste à 22 px. Le contrôle d'aération impose
   un plancher de 16 px, plus strict que les 15 px du §9.
2. Les couleurs littérales de la maquette deviennent des tokens. Le fond
   discret des résultats du hero emploie un mélange de tokens, blanc 8 % sur
   canard, plutôt que `rgba` : contraste blanc/fond mesuré à 4,93:1.
   Blanc sur `--line` aurait échoué au contraste.
3. OpenCode garde son PNG local en image, comme auparavant : son alpha opaque
   donne un carré plein en mask-image. Les autres nouvelles icônes sont des
   masques de 16 px. Aucun téléchargement externe au runtime.
4. Le surlignage des partenaires couvre une seule case à la fois (2 s par case,
   cycle 14 s). Le CSS de la maquette superposait plusieurs sélections ; le
   texte normatif du §5 exige une seule case. Même priorité pour les trois
   résultats d'architecture : un seul rose à la fois, neutres au repos.
5. RevealOnView observe l'entrée du titre au seuil 0,25 pour les longues
   sections : 25 % de toute la grille mobile ne tiendrait jamais à l'écran.
   Un second observateur coupe les animations quand le bloc sort de l'écran.
   Le déclenchement des téléphones/panneaux est adapté au §9 ; leurs séquences
   et contenus restent identiques. Tous les RAF, minuteurs et observateurs
   sont nettoyés ; mouvement réduit rétablit les états complets.

Les modifications des tests suivent le changement de contrat produit : ancres,
logos autorisés, nouveau SVG, services et formulaire visible. Les cas négatifs
sur les permissions et publicationLogo restent présents et sont renforcés.
Les anciens clics sur summary deviennent des assertions de champ déjà visible,
sans retirer les audits transverses ni le déni réseau. Les statuts pluriels
retirés de la page quittent l'allowlist ; les statuts singuliers restent.

## Vérification

Baseline avant changement applicatif : `npm ci` réussi ; `npm test` 102/105,
les trois échecs dépendant du build absent dans le worktree. Le build Turbopack
initial est resté sur « Creating an optimized production build » et a été
interrompu. La commande exacte du candidat a aussi été bornée à 90 secondes.

| Commande du §13 | Résultat candidat |
|---|---|
| `npm ci` | Réussi, 462 paquets ; lockfile inchangé |
| `npm run lint` | Réussi, aucun avertissement ESLint |
| `npm run build` | Turbopack ne termine pas ; interrompu à 90 s |
| `npm run build -- --webpack` | Repli réussi, TypeScript et 52 pages |
| `npm test` | 107/107 réussis |
| `npm run qa:brand:rev01` | Réussi |
| `npm run qa:claims:rev01` | Réussi |
| `npm run test:brand-os` | 19/19 réussis |
| `npx next start -p 3210` | Échec système `listen EPERM 0.0.0.0:3210`, processus terminé |
| `QA_BASE_URL=http://127.0.0.1:3210 npm run qa:network:rev01` | Lancé ; 247 cas en échec d'environnement, Chromium refusé avant navigation et serveur inaccessible |

Vérification complémentaire : `npx tsc --noEmit` et contrôle du diff applicatif
réussis. L'archive `maquette/index.html` conserve un espace final préexistant
à la ligne 317 pour rester identique à la source ; `git diff --check` le signale.
Revue indépendante : contraste des résultats, alpha OpenCode et état des tâches
pendant leur délai corrigés. Rendu serveur du build testé sans accès réseau.

La batterie complète n'est donc **pas verte** : aucun résultat navigateur,
capture candidate ni preuve de production ne peut être annoncé. Les deux
blocages sont ceux du sandbox macOS (`EPERM` sur l'écoute et
`MachPortRendezvousServer: Permission denied` pour Chromium). Aucun contournement
ni modification de configuration de test. Aucun serveur de cette session ne
reste en cours après l'échec de démarrage. Validation visuelle et batterie
navigateur à rejouer dans un environnement autorisant ces opérations.

Journaux de session : `/private/tmp/passe3-{npm-ci,build-final,webpack-final,
lint-final,tests-final,brand-final,claims-final,brand-os-final,server,network}.log`.
