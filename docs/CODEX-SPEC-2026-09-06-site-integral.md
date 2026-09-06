# CODEX-SPEC · 2026-09-06 · Site intégral « Parrit Simple » (5 pages + capture v2 + agent V1 + e-mails + purge)

Statut : VALIDÉ PAR PAUL (« Vas-y, on est parti », 06/09, après prototype
vérifié en adverse par 23 agents). Copy embarqué = source de vérité, ne pas
réécrire une chaîne. Police : INCHANGÉE (General Sans, décision Paul).
Travail en 3 LOTS livrés dans cet ordre ; chaque lot doit laisser l'arbre
compilable (tsc + lint verts).

## LOT 1 · Les 5 pages intérieures (copy FR+EN)

Chaque page garde sa structure de composants rev01 (K, RegistryLine,
rev-button, tokens) ; seuls le copy et les coupes changent. DICT par page
comme sur la home. Zéro cadratin. « Parrit / X » dans les kickers = forme
sanctionnée.

### /manufacture (src/app/(rev01)/manufacture/page.tsx)

- meta title « La Manufacture » / « The Manufacture » ; meta description
  « La méthode de Parrit.ai : comment une commande se construit, de l'Examen
  à la Capitalisation. » / « How Parrit.ai builds a company operating
  system, from Examination to Compounding. »
- kicker « Parrit / La Manufacture » / « Parrit / The Manufacture »
- H1 « Un système se fabrique. Il ne s'installe pas. » / « Manufactured,
  not installed. »
- sous-titre « Comment Parrit.ai construit un système d'exploitation
  d'entreprise : vos opérations, reconstruites une par une, de l'Examen à
  la Capitalisation. » / « How Parrit.ai builds a company operating system:
  your operations, rebuilt one by one, from Examination to Compounding. »
- 3 phases (blocs .r2-phase existants, numéro + nom + description) :
  - 01 « L'Examen » / « Examination » : « Trente minutes avec le fondateur,
    puis un diagnostic écrit : vos flux, vos points de défaillance, la
    première opération à reconstruire. Avant tout engagement. » / « Thirty
    minutes with the founder, then a written diagnostic: your flows, your
    failure points, the first operation to rebuild. Before any
    commitment. »
  - 02 « La Construction » / « Construction » : « Une opération critique,
    reconstruite de bout en bout dans vos comptes, avec vos clés. Elle
    tourne en production, devant de vrais utilisateurs, puis elle est
    certifiée selon le Standard. Quelques semaines, en général. Ensuite
    seulement, le reste. » / « One critical operation, rebuilt end-to-end
    in your accounts, under your keys. It runs in production, with real
    users, then it is certified to the Standard. A few weeks, usually.
    Only then, the rest. »
  - 03 « La Capitalisation » / « Compounding » : « Chaque nouvelle brique
    rejoint le système et augmente la valeur des précédentes : celle qui
    détecte le signal passe la main à celle qui relance le client. Vous
    restez propriétaire de tout, code et données compris. » / « Each new
    capability joins the system and raises the value of every previous
    one: the one that detects the signal hands over to the one that
    follows up with the client. You keep ownership of everything, code and
    data included. »
- note sous les phases : « Les trois phases répondent au même Standard.
  Six critères, identiques pour tout système livré. » + lien
  « Lire le Standard » → /standard / « All three phases answer to the same
  Standard. Six criteria, identical for any system delivered. » + « Read
  the Standard »
- close : H2 « Tout commence par un Examen. » / « The Examination comes
  first. » · ligne mono « 30 min · En visio, avec le fondateur » /
  « 30 min · On a video call, with the founder » · bouton « Parlons-en » /
  « Let's talk » → /commission
- footer : RegistryLine « PARRIT / MANUFACTURE · REV 02 · 2026 », statut
  mono « CHAQUE SYSTÈME CERTIFIÉ AU STANDARD » / « EVERY SYSTEM CERTIFIED
  TO THE STANDARD », lien Mentions légales / Legal, © 2026 Parrit.ai
- SUPPRIMÉ de la page : la section doctrine 5 principes entière, « Et
  pourquoi il ne s'achète pas sur étagère », « UN EXAMEN, PAS UN
  RENDEZ-VOUS COMMERCIAL », le statut « UNE COMMANDE, PAS UN ABONNEMENT »
  (la charnière vit sur la home).

### /standard (src/app/(rev01)/standard/page.tsx)

- meta « Le Standard » / « The Standard » ; description « Six engagements
  sur chaque système livré. » / « Six commitments on every system we
  deliver. »
- kicker « Parrit / Le Standard » / « Parrit / The Standard »
- H1 « Six engagements. Chaque système livré les tient. » / « Six
  commitments. Every system we deliver keeps them. »
- en-tête du tableau : « STD-1.0 · 2026 » (identique FR/EN)
- 6 lignes (code + constat + scène), les labels d'avant (Observable, etc.)
  DISPARAISSENT :
  - PS-01 « L'état se lit à tout moment. » · « L'état du pipeline, les
    relances parties, l'incident d'hier. Un écran. » / « The state is
    readable at any moment. » · « Pipeline state, follow-ups sent,
    yesterday's incident. One screen. »
  - PS-02 « Chaque signal porte sa décision. » · « La facture bloquée
    remonte cadrée et chiffrée, sur une carte. » / « Every signal carries
    its decision. » · « A blocked invoice surfaces framed and quantified,
    on a card. »
  - PS-03 « Chaque décision garde son origine. » · « Auteur, heure,
    source, motif. Le journal est l'audit. » / « Every decision keeps its
    origin. » · « Author, time, source, rationale. The journal is the
    audit. »
  - PS-04 « Le retour arrière est écrit d'avance. » · « Une relance partie
    par erreur : un clic l'annule et restaure l'état d'avant. » / « The
    way back is written in advance. » · « A follow-up sent by mistake: one
    click undoes it and restores the state before. »
  - PS-05 « Le système vous appartient. » · « Code, données et
    documentation compris. Votre équipe le fait tourner sans nous. » /
    « The system belongs to you. » · « Code, data and documentation
    included. Your team runs it without us. »
  - PS-06 « La brique suivante augmente la valeur des précédentes. » ·
    « Le reporting construit d'abord alimente les relances construites
    ensuite. » / « The next brick raises the value of the ones before. » ·
    « The reporting built first feeds the follow-ups built next. »
- pied du tableau : « Recette signée par votre équipe, à la livraison » /
  « Sign-off by your team, at delivery »
- note : « STD-1.0 n'est pas une accréditation. C'est l'exigence de
  Parrit.ai. Demandez-nous des comptes. » / « STD-1.0 is not an
  accreditation. It is Parrit.ai's own bar. Hold us to it. »
- action : ligne mono « 30 min · En visio, avec le fondateur » / « 30 min ·
  On a video call, with the founder » + bouton « Parlons-en » / « Let's
  talk » → /commission
- footer RegistryLine par défaut.

### /dossiers (src/app/(rev01)/dossiers/page.tsx)

- kicker « Parrit / Les dossiers » / « Parrit / The Dossiers » ; meta title
  « Les dossiers » / « The Dossiers » ; description « Systèmes commandés,
  anonymisés par principe. Les chiffres se vérifient en direct. » /
  « Commissioned systems, anonymized on principle. Figures verified live. »
- H1 « Les dossiers s'ouvrent de vive voix. » / « The dossiers open in
  conversation. »
- sous-titre « Des systèmes commandés par des grands comptes, des PME et
  des ETI. Anonymisés par principe. Les chiffres se vérifient en direct. »
  / « Systems commissioned by large accounts, SMEs and mid-sized
  companies. Anonymized on principle. The figures are verified live. »
- 3 cartes, DANS CET ORDRE D'AFFICHAGE (le chiffre monte dans le titre) :
  1. « Dossier 26-003 · Une marque grand public » / « …A consumer brand » ·
     titre « 2,5 mois gagnés sur un seul processus de reporting. » /
     « 2.5 months recovered on a single reporting process. » · corps « Le
     reporting s'assemble et part à l'heure. L'équipe du client le fait
     tourner aujourd'hui. » / « The reporting assembles itself and ships
     on schedule. The client's own team runs it today. » · statut
     « Livré · Aux mains du client » / « Delivered · In the client's
     hands »
  2. « Dossier 26-002 · Un cabinet d'avocats » / « …A law firm » · titre
     « De 5 à 10 K€ de plus par mois, sur des dossiers relancés. » /
     « €5K to €10K more per month, from re-engaged case files. » · corps
     « L'arrivée des clients et les relances, refondues sur
     l'infrastructure du cabinet. Chiffre mesuré sur les briques en
     service. » / « Client intake and follow-ups, rebuilt on the firm's
     own infrastructure. Measured on the capabilities already live. » ·
     statut « En construction · Premières briques en service » / « Under
     construction · First capabilities live »
  3. « Dossier 26-001 · Parrit.ai, notre propre système » / « …Parrit.ai,
     our own system » · titre « Nous vendons le système qui nous fait
     tourner. » / « We sell the system we run on. » · corps « Plus de 200
     signaux deviennent des décisions chaque semaine, reçus et arbitrés
     par le fondateur. » / « More than 200 signals become decisions every
     week, received and arbitrated by the founder. » · statut « En
     production · La valeur s'accumule » / « In production · Compounding »
- registre : kicker « Le registre » / « The registry » · titre « D'autres
  dossiers restent scellés. » / « Other dossiers remain sealed. » · ligne
  « Ils se lisent en rendez-vous, avec l'accord du client. » / « They are
  read in a meeting, with the client's consent. »
- close : « Le prochain dossier pourrait être le vôtre. » / « The next
  dossier could be yours. » · mono « 30 min · Un examen, avec le
  fondateur » / « 30 min · An examination, with the founder » ·
  « Parlons-en » / « Let's talk » → /commission
- SUPPRIMÉ : l'énumération du registre, « Pas sur un site », « PAS UN
  RENDEZ-VOUS COMMERCIAL », « UNE COMMANDE, PAS UN ABONNEMENT », les corps
  longs des cartes.

### /commission (src/app/(rev01)/commission/page.tsx)

- kicker « Parrit / Commande » / « Parrit / Commission »
- H1 « Toute commande commence par un examen. » / « Every commission
  begins with an examination. »
- sous-titre « Trente minutes en visio avec le fondateur. » / « Thirty
  minutes on a video call with the founder. »
- le calendrier ParritCalInline reste directement sous le header,
  inchangé : c'est l'action principale.
- UNE note sous le calendrier (les 3 notes actuelles disparaissent) :
  titre « Vous repartez avec un verdict. » / « You leave with a verdict. »
  · corps « Un périmètre écrit, ou un non clair. Rien ne se signe pendant
  l'appel ; les conditions se fixent après, noir sur blanc. » / « A
  written scope, or a clear no. Nothing is signed during the call; terms
  are set afterwards, in black and white. »
- capture : ligne mono « Pas de créneau ? Laissez votre e-mail » / « No
  slot that works? Leave your e-mail » + QuickCapture (variante standard,
  id="commission") en bas de page.
- meta : title = H1 ; description « Trente minutes en visio avec le
  fondateur. Choisissez un créneau. » / « Thirty minutes on a video call
  with the founder. Select a time. »

### /journal (src/app/(rev01)/journal/page.tsx)

- header : RegistryLine « PARRIT / JOURNAL · REV 01 · 2026 » (header ET
  footer, même valeur) · H1 « Ce journal s'écrit sur les chantiers. » /
  « This journal is written on the job. » · sous-titre « Ce qui a tenu, ce
  qui a cassé, sur des systèmes IA en entreprise. Daté et consigné. » /
  « What held and what broke, on AI systems inside companies. Dated and on
  the record. »
- le H1 slogan codé en dur « We Find The Way. » DISPARAÎT.
- liste des entrées : inchangée (getAllJournalEntrySummaries, tous les
  items).
- abonnement (remplace le formulaire RegisterInterest sur cette page ; le
  composant RegisterInterest reste dans le code, plus utilisé ici) :
  kicker « Journal / Abonnement » / « Journal / Subscription » · ligne
  « Chaque entrée arrive par e-mail le jour où elle paraît. » / « Every
  entry goes out by e-mail the day it appears. » · ligne « Une adresse
  suffit. Désabonnement en un clic. » / « One address is enough.
  Unsubscribe in one click. » · NewsletterCapture (composant existant).
- meta description à aligner sur le sous-titre.

### Balayage EN « on video »

Partout où l'EN dit « on video » (home : ligne alt du hero + note du
close ; et toute autre occurrence), remplacer par « on a video call ».
Le FR « en visio » ne bouge pas.

## LOT 2 · Capture v2 + Agent V1 + e-mails

### Capture v2 (idée du prototype)

- QuickCapture, variante hero UNIQUEMENT : un champ texte OPTIONNEL
  au-dessus du champ e-mail. Texte d'invite du champ : « Votre process à
  reconstruire, en une phrase (facultatif) » / « The process to rebuild,
  in one sentence (optional) ». Nom du champ : idee. Longueur max 300
  caractères (tronquer côté client, revalider côté serveur).
- POST /api/interet : accepter le champ optionnel `idee` (string ≤ 300,
  sinon ignorer silencieusement).
- lib/server/interets.ts : ranger `idee` dans la déclaration
  (metadata.interets_declares, champ idee_prototype de la déclaration) :
  AUCUN changement de schéma. L'inclure dans le texte de la carte Telegram
  et dans le payload du webhook lead.
- Styles : le champ idée au-dessus de la ligne e-mail+bouton, pleine
  largeur, mêmes tokens que l'input existant.

### Agent V1 (déterministe, zéro LLM, zéro backend)

- Nouveau composant client src/system/components/AgentEsquisse.tsx +
  section home-s-agent sur la home, PLACÉE JUSTE APRÈS le hero (avant les
  métriques).
- Panneau type chat aux tokens canon : en-tête mono « Votre agent ·
  esquisse » / « Your agent · sketch » (rouge) + à droite « Esquisse
  déterministe » / « Deterministic sketch ». Message d'ouverture :
  « Décrivez l'opération qui vous coûte le plus de temps. J'esquisse le
  système qui la reprend. » / « Describe the operation that costs you the
  most time. I'll sketch the system that takes it over. »
- L'utilisateur tape une phrase → correspondance par mots-clés (regex
  insensible casse) → réponse : « Voici la première esquisse de votre
  système : » / « Here is the first sketch of your system: » + 3 cellules
  Signal / Décision / Action :
  - relance|client|suivi / follow|chase|client : « Dossier sans réponse
    depuis 12 jours » · « Relancer · ton direct · modèle B » · « Brouillon
    prêt, journalisé, réversible » / « File silent for 12 days » ·
    « Follow up · direct tone · template B » · « Draft ready, journaled,
    reversible »
  - report|chiffre|kpi|tableau / report|number|kpi|dashboard : « Les
    chiffres de la semaine, collectés seuls » · « Deux écarts à trancher,
    sur une carte » · « Le rapport part à l'heure, sans vous » / « The
    week's numbers, collected on their own » · « Two gaps to arbitrate, on
    a card » · « The report ships on time, without you »
  - factur|paiement|encaiss / invoice|payment|collect : « Facture bloquée
    détectée au jour 1 » · « Relance cadrée et chiffrée, à valider » ·
    « Encaissement suivi jusqu'au solde » / « Blocked invoice caught on
    day 1 » · « Framed, quantified follow-up, for your approval » ·
    « Collection tracked to the balance »
  - défaut / default : « Votre opération, observée en continu » · « Seuls
    les arbitrages remontent à vous » · « Le reste s'exécute et se
    consigne » / « Your operation, observed continuously » · « Only the
    arbitrations reach you » · « The rest executes and gets recorded »
- Ligne de clôture sous les cellules : « La version complète se construit
  après l'Examen. Laissez votre e-mail ci-dessus : le prototype arrive
  préparé à la main. » / « The full version is built after the
  Examination. Leave your e-mail above: the prototype arrives prepared by
  hand. » + lien texte « Laisser mon e-mail » / « Leave my e-mail » →
  ancre #prototype.
- PostHog : track("agent_esquisse_used", { scenario }) au premier envoi
  (ajouter agent_esquisse_used au catalogue EventName).
- Un seul échange conservé à l'écran (le nouveau remplace l'ancien).
  Aucune requête réseau.

### E-mails au canon

- Graver le gabarit : créer docs/emails/gabarit-parrit-2026-09-06.html en
  copiant EXACTEMENT le fichier fourni par l'hôte à
  ../email-journal-template.html (chemin relatif au clone :
  /private/tmp/claude-501/-Users-paullarmaraud/8aa6a95c-1e70-42b9-affd-eeff7fd0ffd9/scratchpad/email-journal-template.html).
- Réécrire le brouillon machine de lib/server/interets.ts (texte poussé
  dans la carte Telegram) : zéro cadratin, signature Parrit.ai, selon la
  langue du lead :
  - FR : objet « Votre système d'exploitation · première esquisse » ;
    corps : « Bonjour,

    Vous avez laissé votre adresse sur parrit.ai. Voici la première
    esquisse de votre système : {sketchUrl}

    Un examen de 30 minutes, en visio, la précise :
    https://parrit.ai/commission

    Paul Larmaraud · Parrit.ai »
  - EN : objet « Your operating system · first sketch » ; corps : « Hello,

    You left your address on parrit.ai. Here is the first sketch of your
    system: {sketchUrl}

    A 30-minute examination, on a video call, sharpens it:
    https://parrit.ai/commission

    Paul Larmaraud · Parrit.ai »
  - Si le lead a laissé une idée (idee_prototype), insérer après la
    première phrase : « Vous parliez de : "{idee}". L'esquisse part de
    là. » / « You mentioned: "{idee}". The sketch starts there. »

## LOT 3 · Purge des anciennes identités

1. src/app/opengraph-image.tsx : le texte rendu en pixels devient
   « PARRIT.AI · COMPANY OPERATING SYSTEMS » ; remplacer les hex en dur
   par le helper token(), même approche que l'opengraph-image de la route
   slug du journal rev01.
2. src/system/components/CalInline.tsx : hex en dur → var(--…) des tokens.
3. Supprimer (vérifier 0 référence par grep avant CHAQUE suppression ;
   si une référence existe, la traiter d'abord) : public/brand/
   parrit-mark-*.svg, parrit-reversed.svg, parrit-seal*.svg,
   parrit-stacked.svg, parrit-wordmark*.svg, parrit-lockup-red.svg,
   logo-system/ entier, editorial/ entier, client-logos/, tool-logos/,
   qualiopi/, terrain/, paysage-lo-y-wa.jpg.
4. Supprimer src/app-rev01/ entier (dossier mort, non routé).
5. Supprimer la route src/app/system/ (surface de debug, décision Paul).
6. Sortir le microsite : déplacer src/app/camp-costa-rica/ vers
   archive/camp-costa-rica/ (racine du dépôt, hors routing Next) ; ajouter
   dans next.config.ts une redirection permanente /camp-costa-rica/:path*
   → / ; retirer ses assets dédiés de public/ s'ils existent (fonts Geist,
   images du camp) UNIQUEMENT s'ils ne sont référencés nulle part ailleurs.
7. src/lib/registry/ressources.ts : retirer l'entrée
   res.detecteur-bullshit (route inexistante).
8. TRUTH.md : réécrire la section CTA (hero = QuickCapture + idee, agent
   esquisse, /commission ; journal = NewsletterCapture ; RegisterInterest
   plus utilisé sur les pages) ; ajouter un paragraphe décrivant la home
   simplifiée et les 5 pages réécrites (référencer cette spec) ; clore
   l'hypothèse desktop-OS (tranchée par Paul, retrait de l'instrument,
   04/09) ; retirer la ligne detecteur-bullshit ; noter le retrait de
   /system et de camp-costa-rica.
9. AI_CONTEXT.md : réécrire pour décrire la réalité src/app/(rev01)
   (routes réelles, DICT par page, i18n fr/en via proxy).

## Qualité (à chaque lot)

npm run lint · npx tsc --noEmit · npm run qa:brand:rev01. Le build et
qa:network tournent chez l'hôte (bind de port interdit dans le sandbox :
le signaler, ne pas bloquer). Si un test tests/conformity-*.spec.ts
verrouille une valeur que cette spec change, RECALER le verrou sur la
nouvelle valeur avec un commentaire (jamais supprimer le test). Rapport
par lot : .codex-report-integral-<lot>.md (structure, chaînes, résultats,
suppressions listées une à une).

## Interdits

Aucune commande git. Aucun changement de schéma de base. Aucun secret.
content/journal/*.mdx intacts. Ne pas toucher aux polices (General Sans
reste). Ne pas réécrire les chaînes de la home hors balayage « on video »
et ajout capture v2/agent.
