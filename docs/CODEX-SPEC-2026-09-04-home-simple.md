# CODEX-SPEC · 2026-09-04 · Home simplifiée « Parrit Simple » (FR+EN)

Statut : VALIDÉ PAR PAUL (« l'idée, c'est d'avoir la nouvelle version », 04/09,
après itérations sur le prototype artifact beed1e71). Copy embarqué ci-dessous
= source de vérité (passe premium registre manifeste Carla, vérifiée en
adverse). Ne pas réécrire une chaîne.

## 1. Périmètre

REMPLACER le contenu de la home rev01 (`src/app/(rev01)/page.tsx`) par la
structure simplifiée ci-dessous, dans les DEUX langues (dictionnaires DICT
existants). Les pages Manufacture / Standard / Dossiers / Commission /
Journal / Legal restent EN LIGNE et inchangées ; elles sortent de la nav
principale et vivent dans le footer. AUCUNE suppression de route.

## 2. Nav (RevHeader)

- Liens : Journal · Commande (FR) / Journal · Commission (EN)
- Pill rouge (fond #E10600, mono uppercase) : « Votre prototype » /
  « Your prototype » → ancre #prototype (la capture du hero)
- Bascule FR/EN + horloge : inchangées. Wordmark inchangé.

## 3. Structure de la home (ordre exact)

1. Opening (boot screen) : inchangé, hero du boot = H1 actuel.
2. HERO plein écran, centré :
   - kicker : « Parrit / Systèmes d'exploitation d'entreprise » /
     « Parrit / Company operating systems »
   - H1 (inchangé, live) : « Le système IA qui fait tourner votre
     entreprise. » / « The AI system your company operates on. »
     (cadre animé conservé : « entreprise. » / « operates »)
   - sub FR : « Parrit.ai construit des systèmes IA depuis trois ans, chez
     des grands comptes, des PME et des ETI. Une entreprise à la fois. »
   - sub EN : « Parrit.ai has built AI systems for three years, for large
     accounts, SMEs and mid-sized companies. One company at a time. »
   - CAPTURE E-MAIL inline (id="prototype") : un champ e-mail
     (« vous@entreprise.fr » / « you@company.com ») + bouton rouge
     « Recevez votre prototype » / « Get your prototype now ».
     Réutiliser la mécanique QuickCapture existante (POST /api/interet,
     interet "full-os", source "site:quick-capture", idempotence, états,
     tracking PostHog form:"quick-capture"). Les états succès/erreur FR/EN
     = chaînes QuickCapture actuelles.
   - note mono : « Un prototype par entreprise · Préparé à la main » /
     « One prototype per company · Prepared by hand »
   - ligne alt : « Ou parlons-en : un examen de 30 minutes, en visio, avec
     le fondateur. » (lien → /commission) / « Or talk it through: a
     30-minute examination, on video, with the founder. »
3. BANDE DE MÉTRIQUES (3, fond panel, filets) :
   - 200+ · « signaux deviennent des décisions chaque semaine, sur notre
     propre système » / « signals become decisions every week, on our own
     system »
   - 2,5 mois / 2.5 months · « gagnés sur un seul processus de reporting,
     chez une marque grand public » / « recovered on a single reporting
     process, at a consumer brand »
   - 100 % / 100% · « des systèmes livrés appartiennent au client, code et
     données compris » / « of delivered systems owned by the client, code
     and data included »
   - pied mono : « Chiffres mesurés dans les systèmes des clients · À jour
     au 02·09·2026 » / « Figures measured in client systems · Current as of
     02·09·2026 »
4. MARQUES (bande centrée, mono uppercase) :
   - kicker : « Des systèmes commandés par » / « Systems commissioned by »
   - liste : « Un grand groupe industriel · Une maison de cosmétique · Un
     cabinet d'avocats · Un courtier énergie B2B · Un réseau de restauration
     · Une marque grand public » / « An industrial group · A cosmetics
     maison · A law firm · A B2B energy broker · A restaurant network · A
     consumer brand »
   - ligne : « Les noms se donnent en rendez-vous, avec l'accord de chaque
     client. » / « Names are given in person, with each client's consent. »
5. LA MAISON (grille portrait 340px + texte) :
   - image : `/founder-portrait.jpg` (asset fourni dans public/, déposé par
     l'hôte avant le run), alt « Portrait du fondateur » / « Portrait of
     the founder », ratio 3/4, object-fit cover, légende mono dessous :
     « Paul Larmaraud · Fondateur » / « Paul Larmaraud · Founder »
   - kicker : « La maison » / « The maison »
   - H2 : « Nous acceptons peu de commandes. » / « We take few
     commissions. »
   - p1 : « Trois ans à construire ces systèmes. Ce qui tourne chez un
     client tourne d'abord chez nous. » (« Trois ans à construire ces
     systèmes. » en gras) / « Three years building these systems. What runs
     at a client's runs at ours first. »
   - p2 : « Un associé construit chaque commande en personne. L'examen de
     30 minutes se tient avec le fondateur, en direct. » / « A partner
     builds each commission personally. The 30-minute examination is held
     with the founder, live. »
   - lien : « Réserver un examen » → /commission / « Book an examination »
6. TRIPTYQUE :
   - kicker « Ce que nous construisons » / « What we build »
   - H2 : « Votre entreprise, sur un seul système. » / « Your company, on
     one system. »
   - 01 Comprendre / Understand : « Tout ce qui se passe, lisible à tout
     moment. Vous ouvrez, vous savez. » / « Everything that happens,
     readable at any moment. You open it, you know. »
   - 02 Décider / Decide : « Seules les décisions remontent jusqu'à vous.
     Cadrées et chiffrées, sur une carte. » / « Only decisions reach you.
     Framed and quantified, on a card. »
   - 03 Agir / Act : « L'action s'exécute dans le même système. Consignée
     au journal, réversible. Le système vous appartient. » / « The action
     executes in the same system. Journaled, reversible. The system belongs
     to you. »
   - verdict mono sous la grille : « Trois gestes. Le reste tourne sans
     vous. » / « Three moves. The rest runs without you. »
7. LE JOURNAL : titre « Le Journal » / « The Journal », kicker « Ce que
   les chantiers nous apprennent » / « What the work teaches us », les 3
   dernières
   entrées réelles (getAllJournalEntrySummaries, lignes titre+date), puis
   CAPTURE NEWSLETTER : champ e-mail + bouton « Recevoir le journal » /
   « Receive the journal ». POST /api/interet avec interet "journal",
   source "site:journal-newsletter" : AJOUTER "journal" à INTERETS
   (lib/server/interets.ts) sans toucher au schéma de base (le stockage
   passe par metadata comme les autres). États succès FR/EN : « Bien reçu.
   Le journal arrive par e-mail. » / « Noted. The journal arrives by
   e-mail. »
8. CLOSE (fond panel) : H2 « Une conversation. Votre système
   d'exploitation, examiné. » / « One conversation. Your operating system,
   examined. » · ligne mono « 30 min · Un examen, en visio, avec le
   fondateur » / « 30 min · An examination, on video, with the founder » ·
   bouton « Parlons-en » / « Let's talk » → /commission
9. FOOTER : liens vers les routes existantes, chacun avec un descripteur
   fonctionnel atténué (couleur faint) à la suite du nom, séparé par « · » :
   - « La Manufacture · la méthode » / « The Manufacture · the method »
   - « Le Standard · nos engagements » / « The Standard · our commitments »
   - « Les Dossiers · références » / « The Dossiers · references »
   - « Mentions légales » / « Legal » (sans descripteur)
   Puis : « Fondée par Paul Larmaraud » → paul-larmaraud.com / « Founded by
   Paul Larmaraud » · « Une commande, pas un abonnement » / « Commissioned,
   not subscribed » · © 2026 Parrit.ai

## 4. Style

Tokens rev01 existants (carbon/panel/paper/#E10600, General Sans + JetBrains
Mono). Hero géant graisse 300, bicolore (début dim, fin paper). Angles nets,
zéro arrondi, zéro dégradé. CSS dans rev01.css, préfixe de classes home-s.
Responsive : colonnes empilées <860px, champs+boutons pleine largeur, aucun
débordement horizontal.

## 5. Sections retirées de la home

L'instrument, la démo téléphone, l'extrait Standard, l'extrait Manufacture,
la FAQ 8 questions et le formulaire long RegisterInterest QUITTENT la home
(le composant RegisterInterest reste utilisé sur /journal, inchangé). Aucun
composant supprimé du code.

## 6. Qualité

npm run lint · npx tsc --noEmit · npm run qa:brand:rev01 · npm run build
(le build peut échouer dans le sandbox sur le bind de port : le signaler,
l'hôte le relancera). Zéro cadratin dans les nouvelles chaînes. Rapport
.codex-report-home.md : structure produite, chaînes par section, résultats.

## 7. Interdits

Aucune commande git. Aucun changement de schéma de base. Aucun secret.
content/journal/*.mdx intacts. Pas d'appel runtime *.vercel.app.

## 8. Lot annexe : invisibles hérités (même PR)

Balayer les chaînes NON visibles qui disent encore « Parrit » seul et les
passer à « Parrit.ai » (§4) : aria-labels, description JSON-LD dans
src/app/layout.tsx, og:image:alt. L'og:image:alt contient AUSSI un cadratin
hérité « — » : le remplacer par « · ». Ne pas toucher au wordmark PARRIT.AI
ni aux kickers « Parrit / » (sanctionnés). Lister chaque remplacement dans le
rapport.
