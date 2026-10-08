# parrit.ai : corrections de l'audit du 08/10 (vérité, lisibilité, CTA, badge Harness)

Ordre direct de Paul (08/10/2026) : corriger et déployer les deux sites. Faits et mesures : `docs/audits/2026-10-08/RAPPORT-A.md`
(visuel et CTA, mesures Playwright), `RAPPORT-B.md` (vérité, confidentialité, storytelling), `RAPPORT-C.md` (badge Harness).
Lis les trois avant de modifier. Chaque texte de remplacement ci-dessous est à recopier tel quel. Pour chaque page EN qui a son
équivalent sous `/fr`, applique la même correction en français (traduction fidèle du remplacement, vouvoiement, sans tiret cadratin).

## 1. Vérité (P0, puis P1) : textes à remplacer

1. `/journal/self-hosting-latency-cost` : « We deploy models on infrastructure our clients own » → « We propose models on
   infrastructure our clients own ». Le reste du paragraphe ne change pas. (L'hébergement local est PROPOSED_ONLY : CAP-07.)
2. `/journal/what-is-parrit-ai` :
   - « We have built these systems for large accounts, SMEs and mid-sized companies, one company at a time. » → « We have taken
     orders from large accounts, SMEs and mid-sized companies, one company at a time. »
   - « Every system we have delivered is owned this way, by the client, in full. » → « Every system we deliver is designed to be
     owned this way, by the client, in full. »
   - La phrase sur la marque grand public (« …Today that reporting assembles itself and ships on schedule, and no one at
     Parrit.ai touches it anymore. ») → « For a consumer brand, one dossier records a reporting process commissioned to assemble
     itself every month. »
   - « thirty-minute examination » / « thirty minutes with the founder, followed by a written diagnostic of where your flows
     break » → « fifteen-minute examination » / « fifteen minutes with the founder, then a written scope or a clear no ».
     Supprimer « usually within a few weeks » (et la proposition qui le porte, sans autre réécriture).
   - « Every system we ship is checked against the Standard » → « Each system we deliver from now on is checked against the
     Standard. STD-1.0 is not an accreditation. »
3. `public/llms.txt` (et son générateur `scripts/generate-llms.mjs` s'il le produit) : « The Standard, the certification every
   delivered system meets » → « The Standard, six commitments Parrit.ai applies to its systems. It is not an accreditation. » ;
   la phrase « Every delivered system is checked against the same specification (STD-1.0…) » → « Each system delivered from
   now on is checked against the same specification (STD-1.0, Parrit's own bar, not an accreditation). » ; « The repository is
   the client's from the first commit; the system runs in the client's own accounts » → « By design, the repository is the
   client's and the system runs in the client's own accounts. That is the engagement we sign, and the handover is where we
   check it. » ; « Based in Lille » → retirer la ville (l'adresse légale est à Rueil-Malmaison, registre public).
4. `/manufacture` : « EVERY SYSTEM CHECKED AGAINST THE STANDARD » → « EACH NEW SYSTEM CHECKED AGAINST THE STANDARD ».
5. Accueil EN et FR, bandeau « Systems commissioned by » : retirer « A cosmetics maison » et « A restaurant network » (aucune
   commande documentée). Texte EN : « Orders from: an industrial group · a law firm · a B2B energy broker · a consumer brand. Not
   published. Shared in person. » FR : « Commandes de : un groupe industriel · un cabinet d'avocats · un courtier en énergie B2B ·
   une marque grand public. Non publié. Montré en rendez-vous. »
6. `/dossiers`, dossier 26-002 : brief → EN « A law firm. A system commissioned to handle the firm's mailbox and act as a
   tailored assistant. » FR « Un cabinet d'avocats. Un système commandé pour traiter la boîte mail du cabinet et lui servir
   d'assistant sur mesure. » Statut inchangé (commissioned). Aucun autre détail.
7. `/journal/what-a-pilot-skips-to-look-finished` : « It reads from the client's live database, not a copied and cleaned
   export » → « When we can, it reads from the client's live database rather than from a copied export ».
   `/journal/what-you-rent-can-be-taken-back` : « A system we deliver runs on the client's own infrastructure » → « A system we
   deliver is built to run on the client's own infrastructure ».
8. `/journal/glm-5-2-sovereignty`, `/journal/publishing-without-human-review`, `/journal/what-a-rollback-takes-with-it` :
   « That is the posture we deploy with our clients » → « That is the posture we apply to our own systems, and the one we propose
   to clients. » ; la phrase sur « the substrate we deploy for clients… a client's invoice run and their website redesign » →
   « Because this is the shape of pipeline we propose to clients: one branch and one deploy for everything. »
9. `/systems` : la ligne « Outreach · External tool (Instantly) · Transfer not started » → « Outreach · External tool (Lemlist) ·
   Transfer under way » ; supprimer la phrase « Every automatic correction has been checked and logged by a person. »
10. Accueil EN/FR, sous-titre du Journal : EN « The Journal records what held and what broke on our own systems, and what we
    take from it for yours. » FR « Le Journal consigne ce qui a tenu et ce qui a cassé sur nos propres systèmes, et ce que nous en
    tirons pour les vôtres. »
11. Vocabulaire : partout où l'accueil dit « information sources » pour la mesure 15/25 → « 15 of the 25 types of information
    we track were still held in two places (measured September 13, 2026). » (FR : « 15 des 25 types d'information que nous
    suivons étaient encore tenus en double (mesuré le 13 septembre 2026). »)
12. `/build-with-you` EN/FR, promesse (vision : on vend l'autonomie) : ajouter sous le titre, sans retirer l'existant :
    EN « In 10 hours with the founder, you build a system that runs, and you leave able to build the next one without us. »
    FR « En 10 heures avec le fondateur, vous construisez un système qui tourne, et vous repartez capable de construire le suivant
    sans nous. »
13. `/legal` : forme juridique « société par actions simplifiée (SAS) » (registre : nature juridique 5710), au lieu de « SASU » ;
    hébergeur Vercel Inc., « 440 N Barranca Ave #4133, Covina, CA 91723, USA » (même adresse que paul-larmaraud.com).

## 2. Lisibilité et CTA (RAPPORT-A, correctifs systémiques)

1. Un jeton bouton unique : `min-height: 48px; font-size: 16px; font-weight: 600; padding: 14px 24px`, appliqué au CTA d'en-tête
   « Book the examination » (aujourd'hui 178x36, 14 px), au CTA du hero (aujourd'hui un lien souligné de 20 px de haut : en faire
   un bouton plein primaire), au bouton « Sketch » du hero (fond primaire plein, 48 px), au sélecteur de langue et aux autres
   `.rev-button`, `.cmd-cta`, `.fp-cta`. Une variante primaire pleine (couleur rose du Brand OS) et une secondaire en contour.
   Même libellé partout : « Book the examination » / « Réserver l'examen ».
2. Zone tactile : `a, button { min-block-size: 44px }` pour la navigation, le pied de page et les liens de langue (pas les liens
   en ligne dans un paragraphe). Boutons FR/EN (34x30) et lien « FOUNDED BY… » (245x18) à 44 px minimum.
3. Texte informatif à 14 px (tableaux, libellés mono, légendes, pieds de page) : 16 px minimum ; libellés 15 px minimum.
   Corps d'article 18 px (inchangé).
4. `p, li, dd { line-height: 1.45; max-width: 68ch }` (hors titres) : corrige l'interlignage 1,2 et les lignes de 114 à 154
   caractères de `/build-with-you`, `/commission`, `/fr/systems`.
5. Échelle de titres : 5 pas au plus ; un seul H3 ; H1 mobile 32 px minimum (aujourd'hui 26 px).
6. Couleurs hors jetons `rgb(70,80,72)` et `rgb(20,25,22)` : remplacer par les jetons texte du Brand OS les plus proches.
7. `/fr/journal` et la section Journal de `/fr` : étiquette « EN » sur chaque article en anglais (aucune traduction demandée).
8. Les valeurs de marque (couleurs, polices) se lisent depuis les jetons existants du dépôt (export Brand OS), jamais recopiées.

## 3. Badge Harness Certified (RAPPORT-C partie 2)

Le mécanisme sans aucun certificat publié dans cette PR (les certificats arrivent ensuite, un commit par article certifié).
1. `src/system/components/HarnessBadge.tsx` (+ export) et lecture dans `src/app/(rev01)/journal/[slug]/page.tsx` : si
   `public/certificates/<slug>.json` existe, a `status: "CERTIFIED"`, une `url` égale à l'URL canonique de l'article, et un
   `content_sha256` égal au sha256 du fichier source de l'article, afficher sous le titre : « Harness Certified ✓ » puis, en petit
   (16 px), « Parrit internal check, not an accreditation. See the proof » (lien vers le JSON). FR : « Contrôle interne Parrit,
   pas une accréditation. Voir la preuve ». Sinon : rien.
2. `scripts/verify-certificates.mjs` lancé dans la batterie : pour chaque JSON de `public/certificates/`, recalcule le sha256 du
   fichier source, vérifie statut et URL ; tout écart fait échouer la batterie.
3. `scripts/false-claims-check.mjs` : interdire « certified/certifié/certification » hors du libellé exact du badge et hors
   d'une phrase qui contient « not an accreditation » / « pas une accréditation ».
4. Tests : fixture d'un certificat valide (badge affiché), d'un certificat au sha256 faux (build en échec), d'un NOT_CERTIFIED
   (rien affiché).

## 4. Tests et preuve
- Mettre à jour les tests existants qui figent un texte remplacé ici, en conservant leur exigence (présence, unicité, langue).
- Ajouter un test de non-régression sur les phrases retirées (§1) et sur la taille minimale des CTA (48 px) si la batterie a
  déjà un test navigateur ; sinon un test sur les jetons CSS.
- Batterie : `npm run build && npm test`, plus `node scripts/false-claims-check.mjs` et `node scripts/brand-conformity-check.mjs`.
- Diffusion : PR. Fusion après relecture de Claude et batterie verte ; déploiement selon la décision de Paul.
