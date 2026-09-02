# CODEX-SPEC · 2026-09-02 · Site FR natif + capture prototype + notification lead

Statut : **VALIDÉ PAR PAUL le 02/09/2026 (« go » puis « mettre en prod »).**
Arbitrages tranchés (recommandations acceptées) : (1) langue par détection
navigateur + bascule FR/EN dans la cmdbar ; (2) « We Find The Way. » reste en
anglais sur la page FR ; (3) notification lead = e-mail dans la boîte de Paul
ET carte Telegram Baoluo ; (4) aucun prix affiché, statu quo ; (5) titre EN du
dossier 26-002 inchangé (« An operating system for a law firm. »).
Merge uniquement aux 3 feux (§25) : review Claude APPROVE + CD/batterie verte
+ validation Paul (acquise ce jour).
Rédigé par Claude (session copywriting Carla, workflow 21 agents, revue
adverse). Copy final embarqué en fin de spec : il fait foi, ne pas réécrire.

## 1. Objectif

1. Le site parrit.ai (rev01, anglais) existe en version française pensée
   nativement (copy embarqué, section 8). Un dirigeant de PME française qui
   arrive depuis la carte de visite de Paul lit le site en français.
2. Une capture d'e-mail éclair (un champ, un bouton) apparaît haut dans la
   home, en plus du formulaire complet existant.
3. Chaque lead déclenche une notification qui atteint réellement Paul, pour
   qu'il réponde avec une esquisse/prototype et une proposition de créneau.
4. L'anglais reçoit 4 retouches + les mêmes ajouts (section 9).

## 2. Architecture i18n (décision à confirmer par Paul, arbitrage n°1)

Recommandation : locale par détection `Accept-Language` sur `/` (FR pour
navigateurs français, EN sinon) + bascule FR/EN visible dans la cmdbar
(à côté de l'horloge). Routes : `/` reste la home localisée ; contenu FR et
EN servis depuis des dictionnaires par page (pattern DICT déjà connu du repo,
cf. ancien HomeDeux) plutôt que dupliquer les pages. `<html lang>` suit la
locale. `hreflang` alternates dans les metadata. Journal : les articles .mdx
gardent leur langue d'origine (hors périmètre).

Fichiers touchés (rev01) :
- `src/app/(rev01)/layout.tsx` (lang, metadata, hreflang)
- `src/app/(rev01)/page.tsx` + `manufacture|standard|dossiers|commission|journal|legal/page.tsx`
- `src/system/components/RevHeader.tsx` (nav + toggle), `Opening.tsx`,
  `RegisterInterest.tsx` (i18n + nouveau CTA), `DecisionCard.tsx` (labels via
  props, déjà le cas), `CalInline.tsx` (libellés)
- Nouveau : composant `QuickCapture.tsx` (capture éclair) + dictionnaires
- `src/app/api/interet/route.ts` : accepte les soumissions sans champ
  `interet` explicite (défaut `full-os`, source `site:quick-capture`),
  `lang` fr|en déjà supporté
- Legal : page FR (mentions légales + confidentialité, trad juridique
  standard), route inchangée `/legal`, libellé affiché « Mentions légales »

## 3. Capture éclair (nouveau)

Placement : home, sous le bandeau de métriques (au-dessus de la section
L'interface). Un champ e-mail + un bouton + une ligne de promesse + la note
anti-spam (copy exact section 8, bloc « Capture éclair »). POST sur
`/api/interet` avec `interet: "full-os"`, `source: "site:quick-capture"`,
même idempotence `submissionId` que le formulaire complet. Succès : même état
« esquisse en assemblage » + lien sketch. Tracking PostHog : réutiliser
`form_started` / `form_completed` / `prototype_requested` avec
`form: "quick-capture"`.

## 4. Notification lead → Paul (à PROUVER, pas seulement à câbler)

Constat code : `/api/interet` poste déjà sur `PARRIT_LEAD_WEBHOOK` (n8n)
après persistance Supabase. Non prouvé : la variable est-elle posée en prod
Vercel, et où atterrit le workflow n8n. Exigence :
1. Vérifier `PARRIT_LEAD_WEBHOOK` en prod ; vérifier le workflow n8n
   `parrit-lead` (le MCP n8n de la session était expiré, re-auth nécessaire).
2. Atterrissage : e-mail dans la boîte de Paul (règle §32 : envoyé, pas
   brouillon) avec e-mail du lead, entreprise, intérêt, page d'origine,
   lien esquisse, et un lien direct pour proposer un créneau. Carte Telegram
   Baoluo en plus si l'arbitrage n°3 le confirme.
3. Preuve de bout en bout obligatoire avant fermeture : une soumission de
   test réelle → notification reçue et montrée. Un 200 n'est pas une preuve.

## 5. TRUTH.md — remise à niveau (obligatoire dans la même PR)

Périmé (à réécrire) : §1 « boutique franco-chinoise » et chaîne à deux mains
(à faire re-trancher par Paul : la FAQ live dit « maison française
indépendante… associés ») ; §4 offres/landings de l'ancien site ; §6 règles
3-4 (palette #D1132F/Geist : le rev01 utilise les tokens rev02
carbon/paper/#E10600, General Sans + JetBrains Mono) ; §6 règle 7 (4 langues
et HomeDeux : devient fr·en sur rev01) ; §7 architecture (HomeDeux,
QuickContact/Groq : remplacés par rev01, RegisterInterest, Cal.com).
À conserver : north stars (RDV qualifiés/sem, cash hebdo), ICP, §5 voix/LE
TAMIS, pas de noms clients, « sur devis »/pas de prix affiché, 3 feux avant
merge. Ne PAS modifier une vérité business sans Paul : lister, proposer,
faire valider.

## 6. QA avant PR

- `npm run build` vert.
- `python3 ~/parrit-os/tools/prooflint.py` sur chaque dictionnaire de copy
  (zéro cadratin, zéro placeholder).
- Batterie qa-playwright : desktop/mobile, FR et EN, chaque page ; vérifier
  que les textes FR tiennent dans les composants (héros, seals, boutons,
  cmdbar mobile) ; captures d'écran des 6 pages × 2 langues jointes à la PR.
- Soumission test capture éclair ET formulaire complet (les deux langues) →
  ligne Supabase + notification reçue (section 4.3).
- Aucun appel runtime `*.vercel.app` ; PostHog inchangé.

## 7. Livraison

Branche dédiée → PR vers main. NE PAS MERGER : review Claude (APPROVE) +
CD/batterie verte + Paul a compris et validé le copy = les 3 feux (§25).
Rollback : revert de la PR (aucune migration de données).

## 8. COPY FRANÇAIS (source de vérité, ne pas réécrire)

# PARRIT.AI · COPY FRANÇAIS COMPLET (rev01 FR)

Synthèse finale. Base : 2 jets indépendants + 3 rédacteurs + 9 verdicts adverses.
Chaque chaîne du site live a son équivalent, dans l'ordre des pages.
(AJOUT) signale un élément qui n'existe pas sur le site live.

## NAV (barre de commande)

- Système · Manufacture · Standard · Dossiers · Journal · Commande
- Menu / Fermer
- HH:MM:SS · LOCAL

## OPENING (écran de démarrage)

- PARRIT / SITE · REV 01
- CHARGEMENT DU MODÈLE DE L'ENTREPRISE ........ TERMINÉ
- CONNEXION DES OPÉRATIONS ................... 14 SYSTÈMES
- RECHERCHE D'EXCEPTIONS ..................... 2 TROUVÉES
- PRÊT.
- Hero : Le système qui fait tourner votre entreprise.
- Parrit conçoit et construit des systèmes d'exploitation d'entreprise.
- Un seul système pour comprendre, décider et agir, à l'échelle de
  l'entreprise. Une entreprise à la fois. Une commande, pas un abonnement.

## HOME (/)

Meta title : Parrit · Le système qui fait tourner votre entreprise
Meta description : Parrit conçoit et construit des systèmes d'exploitation
d'entreprise : un seul système pour comprendre, décider et agir. Une
entreprise à la fois. Une commande, pas un abonnement.

### Hero
- Kicker : Parrit / Systèmes d'exploitation d'entreprise
- H1 : Le système qui fait tourner votre entreprise.
- Sous-titre : Un seul endroit pour voir ce qui se passe, décider ce qui
  compte, et agir. Conçu et construit pour une entreprise à la fois.
- Bouton primaire : Parlons-en
- Bouton secondaire : Examiner le Standard

### Instrument (écran sous le hero)
- Chrome : PARRIT / OS · LIVE · Mar 09:14
- Ligne 1 : 3 / décisions attendent le dirigeant ce matin / Aujourd'hui
- Ligne 2 : 1,2 M€ / en jeu sur des commandes bloquées. Dossier complet,
  prêt à trancher / Décision attendue
- Ligne 3 : 7 / actions exécutées cette nuit, toutes consignées au journal,
  toutes réversibles / Journal
- Légende 1 : SOUS CET ÉCRAN, TOUT TOURNE. SEULES LES DÉCISIONS REMONTENT
  JUSQU'À VOUS.
- Légende 2 : SCÉNARIO ILLUSTRATIF. LES CHIFFRES RÉELS, MESURÉS CHEZ NOS
  CLIENTS, SONT DANS LES DOSSIERS CI-DESSOUS.

### Bandeau de métriques
- 3 / systèmes d'exploitation en construction ou en production, dont le nôtre
- 1 / entreprise à la fois. Chaque système se construit sur son
  fonctionnement réel
- 100 % / des systèmes livrés appartiennent au client : code, données,
  documentation

### (AJOUT) Capture éclair (sous les métriques)
- Label : VOTRE PROTOTYPE
- Ligne : Une adresse e-mail suffit. Vous recevez l'esquisse de votre premier
  système, puis un créneau pour l'examiner ensemble.
- Champ : vous@entreprise.fr
- Bouton : Recevez votre prototype
- Note : Un prototype par entreprise · Aucune séquence automatique

### Section L'interface
- Titre : L'interface.
- Kicker : Ce que le dirigeant voit vraiment
- Téléphone, chrome : PARRIT / OS · SCÉNARIO · 09:14
- Fil : Système · Aujourd'hui
- Message système 1 : Bonjour. Trois décisions vous attendent. Tout le reste
  a été traité cette nuit. La première :
- Carte : Débloquer la commande / 480 K€ suspendus à une signature. Client
  validé, stock réservé, marge vérifiée. / Appui long pour débloquer /
  Débloquée
- Ligne journal : 07:12 · 7 actions exécutées · journal à jour
- Message utilisateur : Du nouveau sur le compte Milan ?
- Message système 2 : Paiement encaissé hier, deux commandes parties en
  production. Rien qui ait besoin de vous.
- Point 1 : La conversation comme interface / Vous parlez à votre
  entreprise. / L'interface, c'est la conversation : vous demandez, le
  système répond par des décisions cadrées. Pas des tableaux de bord à
  interpréter.
- Point 2 : Une carte, une action / Chaque décision tient sur une carte. /
  Cadrée, sourcée, chiffrée. Un appui long pour valider ; l'action s'exécute
  dans le même système, consignée au journal, réversible. Essayez la carte
  ci-contre : c'est le vrai composant.
- Point 3 : Jusqu'à votre téléphone / Toute l'entreprise, dans votre poche. /
  Le même système d'exploitation tourne de l'atelier à votre téléphone. Un
  seul endroit pour comprendre, décider, agir.

### Section Dossiers scellés
- Titre : Dossiers scellés.
- Kicker : Systèmes livrés · Vérifiés en direct

DOSSIER 26-001 · PARRIT
- Titre : Nous vendons le système qui nous fait tourner.
- Corps : Parrit tourne sur son propre système d'exploitation : un seul
  endroit où les signaux, les clients et les campagnes deviennent des
  décisions, qui arrivent en cartes sur le téléphone du fondateur. Construit
  pour nous d'abord. Depuis, la valeur s'accumule.
- Chiffre : 200+ / signaux deviennent des décisions chaque semaine
- Sceau : En production · La valeur s'accumule

DOSSIER 26-002 · UN CABINET D'AVOCATS
- Titre : Un système d'exploitation pour un cabinet d'avocats.
- Corps : L'arrivée des nouveaux clients, les relances et la circulation des
  dossiers, refondues en un seul système sur l'infrastructure du cabinet.
  Les premières briques sont certifiées et en service. Le système grandit
  dossier après dossier.
- Chiffre : +5 à 10 K€ / de chiffre d'affaires en plus chaque mois, sur des
  dossiers relancés
- Sceau : En construction · Premières briques en service

DOSSIER 26-003 · UNE MARQUE GRAND PUBLIC
- Titre : Le reporting que personne ne rédige.
- Corps : Le reporting s'assemble seul à partir des systèmes sources et part
  à l'heure. L'équipe du client le fait tourner aujourd'hui, sans nous.
  Documenté, transmis. À eux.
- Chiffre : 2,5 mois / gagnés sur un seul processus de reporting
- Sceau : Livré · Aux mains du client

- Note : Les dossiers contiennent aussi : un CRM qu'une agence ne touche
  jamais à la main, une infrastructure de prospection de bout en bout, des
  systèmes commandés par des marques de cosmétique et de commerce artisanal.
  Les chiffres sont mesurés dans les systèmes du client, pas dans les nôtres,
  et vérifiés en direct, à l'écran, pendant l'examen. Les dossiers, et des
  références avec l'accord du client, s'ouvrent de vive voix. Pas sur un site.

### Section Standard (extrait)
- Titre : Certifié selon le Standard.
- Kicker : STD-1.0 · 2026
- Bandeau : LE STANDARD PARRIT · CHAQUE SYSTÈME, MÊME SPÉCIFICATION / 6 critères
- PS-01 · Observable / En pratique : L'opérateur lit l'état d'un dossier en
  cours à tout moment : pas de réunion, pas d'export, personne à interroger.
- PS-03 · Traçable / En pratique : Le journal consigne l'auteur, l'heure, la
  source et le motif de chaque décision. Le journal est l'audit.
- PS-05 · Propriété du client / En pratique : Le code, les données et la
  documentation entrent au patrimoine de l'entreprise. L'équipe du client
  fait tourner le système sans nous.
- Lien : Lire le Standard complet

### Section La Manufacture (extrait)
- Titre : La Manufacture.
- Kicker : Comment un système se construit
- Intro : Un système d'exploitation d'entreprise ne s'installe pas. Il se
  fabrique à partir de vos flux, de vos décisions, de vos exceptions.
- Col. 1 : Nous travaillons pour une entreprise à la fois. Le système épouse
  la façon dont la vôtre fonctionne réellement, pas celle que les éditeurs de
  logiciels lui prêtent.
- Col. 2 : Tout est livré selon le Standard, et tout ce que vous recevez vous
  appartient. Une commande, pas un abonnement.
- Phase 01 · L'Examen : Un diagnostic des flux, des décisions et des points
  de rupture. Un cahier des charges d'ingénieur, pas un atelier.
- Phase 02 · La Construction : Une opération critique, reconstruite de bout
  en bout et certifiée avant toute autre chose.
- Phase 03 · La Capitalisation : Chaque brique rejoint le système. La valeur
  de toutes les précédentes augmente.

### FAQ
- Titre : Avant de passer commande.
- Kicker : Les questions que posent les dirigeants

Q1 : Qui est Parrit ?
R1 : Une maison française indépendante, fondée par Paul Larmaraud et menée
par ses associés, avec vingt ingénieurs et opérateurs autour du projet. Une société immatriculée, dont l'identité légale complète est à un clic,
sous Mentions légales. Volontairement resserrée : nous acceptons peu de
commandes, et un associé construit chacune en personne. Notre réflexion est
publique : elle se lit dans le Journal.

Q2 : Qu'est-ce qui nous appartient à la fin ?
R2 : Tout, dès le départ. Le dépôt de code est à vous dès la première ligne ;
le système tourne dans vos comptes, sur votre infrastructure, avec vos clés.
Il repose sur des technologies ordinaires et largement répandues (TypeScript,
Python, PostgreSQL) : n'importe quel ingénieur compétent peut le maintenir
sans nous. C'est ce qui garantit PS-05. Un mécanisme, pas une promesse. Si Parrit
disparaît demain, votre système ne s'en aperçoit pas.

Q3 : Où vivent nos données ?
R3 : Chez vous. Parrit construit dans vos comptes et sur votre infrastructure
dès le premier jour. Vos données ne passent jamais par les serveurs de
Parrit, et notre accès s'arrête le jour où vous le coupez. La conformité RGPD
en découle : rien ne change de mains, rien ne peut se perdre.

Q4 : Qui maintient le système après la livraison ?
R4 : Nous. La maintenance existe. Un système vivant n'est jamais terminé, et
nous portons ce que nous livrons : chaque commande prévoit la maintenance et
l'évolution, pour que le système continue de tourner et de grandir. Vous
restez propriétaire de tout. Et parce qu'il repose sur des technologies
ordinaires, votre équipe peut le reprendre quand vous le décidez, comme la
marque grand public du dossier 26-003. La maintenance est une clause
explicite de la commande, chiffrée à part. Pas un abonnement déguisé : vous
l'arrêtez quand vous voulez, le système reste à vous et continue de tourner.

Q5 : Qu'est-ce que cela demande à mon équipe ?
R5 : Moins qu'un projet informatique, plus qu'un abonnement. L'Examen demande
quelques heures de conversation avec les personnes qui font tourner
l'opération au quotidien. Pendant la Construction, votre équipe travaille
comme avant. Nous construisons autour du flux réel, pas en atelier. Utiliser
le système fini ne demande aucune formation : si une carte a besoin d'un
manuel, nous avons échoué.

Q6 : D'où travaillez-vous ?
R6 : Depuis la France et à l'international. Installés à Lille, siège social
près de Paris. Les commandes se mènent en français et en anglais, pour des
entreprises européennes comme africaines. Le système se construit à distance,
dans votre propre infrastructure ; l'examen est une visio, où que vous soyez.

Q7 : Combien de temps avant que le premier système tourne ?
R7 : La Construction vise une opération critique, en production et certifiée,
en quelques semaines le plus souvent. Pas un chantier au long cours.
L'Examen fixe le périmètre avant tout engagement.

Q8 : Et si ça ne tient pas ?
R8 : Chaque processus critique est livré avec sa procédure de retour arrière,
documentée (PS-04). Rien n'entre en production sans porte de sortie.

### Section Journal
- Titre : Extraits du journal.
- Kicker : Comment nous pensons vraiment
- Note : Des notes de terrain sur les systèmes que nous examinons,
  construisons et faisons tourner. Publiées sous nos noms, datées. Et quand nous
  nous trompons, ça se voit. / Lire le journal

### Section formulaire
- Titre : Ou commencez par un prototype.
- Kicker : L'entrée par le prototype
- Label : Demandez votre esquisse
- H3 : En 10 heures, votre entreprise tient son premier système. Ça commence
  ici.
- Intro : Dites-nous où ça coince. Nous répondons par une esquisse de votre
  système d'exploitation : un prototype construit pour votre entreprise,
  livré dans votre boîte mail. Pas de newsletter, pas de séquence
  automatique.
- Champs : E-mail professionnel (vous@entreprise.fr) · Ce qui coince le plus
  (Reporting et visibilité / Flux clients et CRM / E-mails et relances / Le
  système d'exploitation complet) · Entreprise (facultatif) (Nom ou site web)
- Case : Un examen de 30 minutes m'intéresse aussi.
- Bouton : Recevez votre prototype / Envoi en cours…
- Erreur serveur : L'envoi a échoué (…). Écrivez-nous directement :
  paul.larmaraud@parrit.ai
- Erreur e-mail : Indiquez un e-mail professionnel valide pour recevoir votre
  esquisse.
- Note : Un prototype par entreprise · Aucune séquence automatique
- Succès : Bien reçu. / C'est noté. La première esquisse de votre système
  d'exploitation part en assemblage, à partir de ce que vous venez de nous
  dire. Pas d'un modèle tout fait. / Voir l'esquisse s'assembler

### Close
- H2 : Une conversation. Votre système d'exploitation, examiné.
- Bandeau : 30 MIN · UN EXAMEN, PAS UN RENDEZ-VOUS COMMERCIAL · LES CHIFFRES
  DES DOSSIERS VÉRIFIÉS EN DIRECT
- Bouton : Parlons-en

### Footer
- FONDÉE PAR PAUL LARMARAUD · UNE COMMANDE, PAS UN ABONNEMENT ·
  /Mentions légales · © 2026 Parrit.ai

## MANUFACTURE (/manufacture)

Meta title : La Manufacture
Meta description : Comment Parrit conçoit et construit un système
d'exploitation d'entreprise : examen, construction, capitalisation. Une
entreprise à la fois, chaque système certifié selon le Standard Parrit.

- Kicker : Parrit / La Manufacture
- H1 : Un système se fabrique. Il ne s'installe pas.
- Sous-titre : Comment se construit un système d'exploitation d'entreprise.
  Et pourquoi il ne s'achète pas sur étagère.

### La doctrine (5 principes)
1. Une entreprise à la fois · Un système se construit sur la réalité de
   votre entreprise : ses flux, ses décisions, ses exceptions. Pas sur l'idée
   que les éditeurs de logiciels se font d'une entreprise. Chaque commande
   est menée en personne par un associé. Nous en acceptons donc peu.
2. La production avant les promesses · La Construction vise une opération
   critique, reconstruite de bout en bout et certifiée en production avant
   d'aller plus loin. Un système qui ne vit que dans une présentation n'est
   pas un système.
3. Le dirigeant décide, le système exécute · Ne remonte au dirigeant que ce
   qui a besoin de lui : cadré, sourcé, chiffré. La décision s'exécute
   ensuite dans le système même qui l'a fait remonter, tracée et réversible,
   consignée au journal.
4. Construit chez vous · Le système est construit dans vos comptes, sur
   votre infrastructure, avec vos clés. Dès le premier jour, pas à la
   livraison. Vos données ne passent jamais par les serveurs de Parrit, et
   notre accès s'éteint le jour où vous le coupez. La sécurité n'est pas une
   clause de contrat : c'est là, physiquement, que le système tourne.
5. Votre propriété, pas une location · Tout ce que vous recevez vous
   appartient : le code, les données, la documentation entrent au patrimoine
   de votre entreprise. Le dépôt de code est à vous dès la première ligne, et
   le système repose sur des technologies courantes et largement adoptées
   (TypeScript, Python, PostgreSQL) : n'importe quel ingénieur compétent peut
   le maintenir sans nous. Une commande, pas un abonnement : si Parrit
   disparaît demain, votre système, lui, continue de tourner.

### Trois phases
- Kicker : Examen → Construction → Capitalisation
- 01 · L'Examen : Un diagnostic des flux, des décisions et des points de
  défaillance, consigné dans un cahier des charges d'ingénieur. Il fixe le périmètre,
  la première opération à reconstruire et les critères de réussite. Avant
  tout engagement.
- 02 · La Construction : On reconstruit la première opération critique de
  bout en bout, sur votre infrastructure, et on la certifie selon le Standard
  Parrit. Elle tourne en production, avec de vrais utilisateurs et de vrais
  enjeux. Ensuite seulement, la suite.
- 03 · La Capitalisation : Chaque nouvelle brique rejoint le système
  d'exploitation et augmente la valeur de toutes les précédentes. (AJOUT)
  Les briques se parlent entre elles : celle qui détecte passe la main à
  celle qui relance. Le système grandit avec l'entreprise. L'entreprise,
  elle, reste propriétaire de tout.
- Note : Chaque phase répond au Standard Parrit. Six critères, les mêmes pour
  chaque système que nous livrons.

### Close
- H2 : Tout commence par un Examen. Passez commande.
- Bandeau : 30 MIN · UN EXAMEN, PAS UN RENDEZ-VOUS COMMERCIAL
- Bouton : Parlons-en

## STANDARD (/standard)

Meta title : Le Standard Parrit
Meta description : Les six principes de fonctionnement qui régissent chaque
système commandé et construit par Parrit.

- Kicker : Parrit / Spécification
- H1 : Une seule spécification. Chaque système livré y répond.
- Table : Le Standard Parrit / Spécification · STD-1.0 · 2026 / En pratique

PS-01 · Observable · L'opérateur connaît l'état du système à tout moment,
sans rien demander à personne. / En pratique : L'opérateur lit l'état d'un
dossier en cours à tout moment : pas de réunion, pas d'export, personne à
interroger.

PS-02 · Actionnable · Toute information remontée ouvre sur une action
possible, dans la même vue. / En pratique : Une commande bloquée remonte avec
sa cause, le montant en jeu et la seule décision à prendre. Le tout sur une
même carte.

PS-03 · Traçable · Chaque décision significative porte son origine :
données, auteur, horodatage, motif. / En pratique : Le journal consigne
l'auteur, l'heure, la source et le motif de chaque décision. Le journal est
l'audit.

PS-04 · Réversible · Chaque processus critique a sa procédure de retour
arrière, écrite avant la mise en production. / En pratique : Une action
automatisée peut être arrêtée, puis ramenée à la dernière décision humaine.
La procédure de retour est documentée avant la mise en service.

PS-05 · Propriété du client · Le client détient le système, ses données et
sa documentation comme des actifs de son entreprise. / En pratique : Le code,
les données et la documentation entrent au patrimoine de l'entreprise.
L'équipe du client fait tourner le système sans nous.

PS-06 · Capitalisation · Chaque nouvelle brique augmente la valeur de toutes
celles déjà en production. / En pratique : Le reporting construit en premier
alimente les relances construites ensuite. Chaque ajout augmente la valeur du
précédent.

- Sceau : Certifié · Construit selon le Standard Parrit
- Note : Soyons clairs : STD-1.0 est notre exigence, pas une accréditation
  délivrée par un tiers. Nous la publions pour que vous puissiez nous
  demander des comptes. Chaque critère est vérifié en production, chez vous :
  sur vos données, sur vos flux réels. Et validé par vous, pas par nous. La
  seule certification qui vaille : celle que votre équipe délivre après avoir
  fait tourner le système.
- Bouton : Parlons-en

## DOSSIERS (/dossiers)

Meta title : Les dossiers
Meta description : Archives scellées : des systèmes d'exploitation commandés
par des entreprises, leurs secteurs, leurs résultats vérifiés. Les dossiers
s'ouvrent de vive voix.

- Kicker : Parrit / Les dossiers
- H1 : Dossiers scellés.
- Sous-titre : Les archives des systèmes commandés, anonymisées par principe.
  Chaque chiffre ci-dessous se vérifie en direct, de vive voix.
- 3 dossiers : mêmes textes que la home.
- Note (variante sans la phrase des chiffres) : Les dossiers contiennent
  aussi : un CRM qu'une agence ne touche jamais à la main, une infrastructure
  de prospection de bout en bout, des systèmes commandés par des marques de
  cosmétique et de commerce artisanal. Les dossiers, et des références avec
  l'accord du client, s'ouvrent de vive voix. Pas sur un site.
- Close : Le prochain dossier pourrait être le vôtre.
- Bandeau : 30 MIN · UN EXAMEN, PAS UN RENDEZ-VOUS COMMERCIAL
- Bouton : Parlons-en

## COMMISSION (/commission · libellé « Commande »)

Meta title : Passez commande de votre système d'exploitation
Meta description : Une conversation pour examiner comment votre entreprise
fonctionne. D'abord un examen. Pas un rendez-vous commercial.

- Kicker : Parrit / Commande
- H1 : Passez commande de votre système d'exploitation.
- Sous-titre : Une conversation pour examiner comment votre entreprise
  fonctionne. D'abord un examen. Pas un rendez-vous commercial.
- Bloc 1 : Votre interlocuteur. Paul Larmaraud, le fondateur, celui qui
  construit les systèmes. Pas une équipe commerciale. Les chiffres des
  dossiers se vérifient en direct, à l'écran.
- Bloc 2 : Ce que vous emportez. Un regard lucide sur vos opérations : soit
  un périmètre écrit pour un Examen, soit un non clair et net si nous ne
  sommes pas la bonne maison pour le faire.
- Bloc 3 : À quoi cela vous engage. À rien. Le périmètre et les conditions se
  fixent par écrit après la conversation, avant tout engagement. Renoncer ne
  coûte rien et ne demande aucune justification.
- Calendrier : PARRIT / COMMANDE · CHOISISSEZ UN CRÉNEAU / CHARGEMENT DES
  CRÉNEAUX… · OUVERTURE DU CALENDRIER · QUELQUES SECONDES · 30 MIN · VISIO ·
  UNE COMMANDE, PAS UN ABONNEMENT

## JOURNAL (/journal)

Meta title : Journal
Meta description : Notes de terrain sur la construction et l'exploitation de
systèmes d'entreprise.

- H1 : We Find The Way. (devise de la maison, conservée en anglais)
- Sous-titre : Notes de terrain sur les systèmes que nous examinons,
  construisons et faisons tourner.
- Kicker d'entrée : Journal / Entrée
- Formulaire : identique à la home.

## LEGAL (/mentions-legales ou /legal)

Traduction juridique standard des mentions légales et de la politique de
confidentialité (SASU PARRIT.AI, Rueil-Malmaison, RCS Nanterre 928 503 218,
hébergeur Vercel, PostHog). Périmètre d'implémentation : pas de créativité.

## 9. COPY ANGLAIS (retouches + ajouts, le reste du live confirmé tel quel)

# PARRIT.AI · FINAL ENGLISH COPY (rev01 EN, polished)

The live English already carries the voice. Result of the pass: 4 changes +
2 additions; everything else is confirmed as it stands. (CHANGE) marks an
edit to live copy, (AJOUT) a new element. Unmarked = live copy, kept.

## NAV
System · Manufacture · Standard · Dossiers · Journal · Commission
Menu / Close · HH:MM:SS · LOCAL

## OPENING
PARRIT / SITE · REV 01 / LOADING COMPANY MODEL … DONE / CONNECTING
OPERATIONS … 14 SYSTEMS / SCANNING FOR EXCEPTIONS … 2 FOUND / READY.
The system your company operates on.
Parrit designs and builds company operating systems.
One system to understand, decide and act across the company. Built for one
company at a time. Commissioned, not subscribed.

## HOME (/)

Meta: Parrit · Company Operating Systems / Parrit examines how a company
operates, builds its first production system and compounds it as owned
infrastructure.

### Hero
Kicker: Parrit / Company operating systems
H1: The system your company operates on.
Sub: One place to understand what is happening, decide what matters, and
act. Designed and built for one company at a time.
Buttons: Let's talk · Examine the Standard

### Instrument
PARRIT / OS · LIVE · Tue 09:14
3 / decisions require the executive this morning / Today
€1.2M / at risk on blocked orders, framed, sourced, quantified / Action required
7 / actions executed overnight, each one journaled and reversible / Journal
EVERYTHING BELOW THIS SCREEN RUNS THE COMPANY. ONLY DECISIONS REACH YOU.
AN ILLUSTRATIVE SCENARIO. MEASURED CLIENT FIGURES LIVE IN THE DOSSIERS BELOW.

### Metrics
3 / operating systems in construction or production, including our own
1 / company at a time. Every system is built against how it actually operates
100% / of delivered systems owned by the client: code, data, documentation

### (AJOUT) Quick capture (below the metrics band)
Label: YOUR PROTOTYPE
Line: One e-mail address is enough. You receive the first sketch of your
system, then a time to examine it together.
Field: you@company.com
Button: Get your prototype now
Note: One prototype per company · No automated sequence

### The interface / Sealed dossiers / Certified to the Standard /
### The Manufacture / FAQ / From the journal
All live copy confirmed as it stands, including:
- "€480K waiting on one signature. Client cleared, stock reserved, margin
  verified."
- "The system we sell is the system we run." / "An operating system for a
  law firm." (kept; see arbitrage) / "Reporting nobody writes."
- The full 8-question FAQ, with ONE change:
  (CHANGE) Q6, first sentence: "From France, based in Lille with the
  registered office near Paris, and internationally." → "From France and
  internationally. Based in Lille, registered office near Paris." (written
  for the ear; no information added or removed)
- Close: "One conversation. Your operating system, examined." + footer,
  unchanged.

### Form section (home + journal)
Section title: Or start smaller. (kept)
(CHANGE) Eyebrow: "The prototype funnel" → "A prototype before a commission"
(the only insider word on the site; every other eyebrow speaks to the reader)
K label: Register your interest (kept)
H3: In 10 focused hours, your company gets its first system. Start here. (kept)
Intro: Tell us where it hurts. We answer with a sketch of your operating
system: a prototype built for your company, in your inbox. No newsletter, no
sequence. (kept)
Fields and options: kept.
(CHANGE) Button: "Register your interest" / "Registering…" → "Get your
prototype now" / "Sending…" (CTA fixed by Paul, 02/09)
Errors + "One prototype per company · No automated sequence": kept.
(CHANGE) Done message (live typo): "…is being assembled right now. from what
you just told us, not from a template." → "…is being assembled right now.
From what you just told us, not from a template."
"Watch your sketch being assembled": kept.

## MANUFACTURE (/manufacture)
All live copy confirmed. Optional (AJOUT) mirroring the FR, phase 03: after
"Each new capability joins the operating system and increases the value of
every previous one.", add: "The capabilities talk to each other: the one that
detects hands over to the one that follows up." (business consequence of
agent-to-agent; strike if it reads as too much)

## STANDARD, DOSSIERS, COMMISSION, JOURNAL, LEGAL
All live copy confirmed as it stands. No changes.
