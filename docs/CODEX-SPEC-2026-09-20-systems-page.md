# CODEX-SPEC · 2026-09-20 · Page `/systems`

Statut : **VALIDÉ PAR PAUL le 20/09/2026** (master brief « Construire et déployer la
page Systems de Parrit.ai », arbitré ensuite : catalogue de **capacités démontrées**,
pas de cas clients affichés — un seul cas central, Parrit sur elle-même).

**Déploiement autorisé pour cette tranche** : ouvrir la PR, faire tourner tous les
gates, et **si tout est vert et qu'aucune affirmation n'est en `NEEDS_APPROVAL`
bloquant, merger et déployer**. Ne pas mélanger avec `/build-with-you` ou
`/commission` : ne pas y toucher.

## 0. Périmètre — ce qui ne bouge PAS

- Ne pas toucher `commission/page.tsx`, `build-with-you/page.tsx`, `Dossier.tsx`,
  `dossiers/page.tsx`, `manufacture/page.tsx`, la home (`page.tsx`) — aucune de ces
  pages n'est dans le scope de cette spec.
- Pas de bloc « aperçu systems » sur la home dans cette tranche (décision Claude,
  scope volontairement resserré — Paul pourra demander ce lien plus tard).
- Pas de deuxième design system, pas de nouveau token couleur/typo. Réutiliser
  `src/system/tokens.css`, les classes `.rev-page`, `.r2-*` déjà en usage
  (`manufacture/page.tsx`, `build-with-you/page.tsx`) et les composants de
  `@/system/components`.
- Aucun cas client nommé, aucune capture fabriquée, aucun chiffre inventé. Toute
  donnée affichée doit être sourcée dans ce document.
- Ne pas afficher `~/parrit-canon/client-decks/cases.registry.json` ni aucune de ses
  entrées, sous aucune forme — fichier explicitement disqualifié
  (`CASE-STUDIES-EVIDENCE-MATRIX.md` §7, questions #11/#25/#26).

## 1. Sources (à citer telles quelles, ne pas reformuler les faits)

- `~/parrit-os/canon/CASE-STUDIES-EVIDENCE-MATRIX.md` — registre de preuves. Seul
  système publiable sans réserve : **R-06** (« Parrit gouverne son propre canon »).
  R-13 (Super App) publiable **avec la réserve explicite** « démonstrateur interne
  en staging ». Tous les autres cas (R-01, R-02, R-03, R-04, R-05, R-07, R-08, R-09,
  R-10, R-12) restent **hors de cette page** : accord client manquant, litige
  ouvert, ou résultat non prouvé.
- `~/parrit-os/docs/data-canonical/SOURCE_OF_TRUTH_REGISTRY.json` (repo
  `parrit-os-signals`) — l'artefact réel de R-06. État constaté le **2026-09-13**
  (`generated_at`), pas « en direct » : 25 domaines suivis, `CUTOVER` 1 ·
  `MIGRATING` 8 · `NOT_STARTED` 12 · `PARITY_FAIL` 4. Extrait des 7 domaines `P0`
  à reproduire tel quel (aucun nom de client, aucune donnée sensible) :

  | Domaine | Source canonique | État | Écrivains historiques encore actifs |
  |---|---|---|---|
  | GTM.contacts_identity | superapp | PARITY_FAIL | 11 |
  | GTM.do_not_contact | superapp | MIGRATING | 1 |
  | GTM.campaigns / outbound | external:instantly | NOT_STARTED | 0 |
  | CLOSING.next_actions | superapp | PARITY_FAIL | 1 |
  | CLOSING.opportunities | superapp | PARITY_FAIL | 2 |
  | TRANSCRIPTS.transcripts | superapp | MIGRATING | 6 |
  | SYSTEM_STATE.events | superapp | MIGRATING | 6 |

  Politique citable telle quelle : *« ParritOS = source de récupération historique,
  lecture seule. Canon = SuperApp. Pas de bascule sans parité rejouable, un domaine
  à la fois. »*

- **Distinction obligatoire, sourcée `CASE-STUDIES-EVIDENCE-MATRIX.md` §7
  interdiction 10** : le domaine `GTM.campaigns / outbound` est `NOT_STARTED` —
  aucun système d'acquisition canonique n'est encore basculé. Le document interdit
  explicitement toute affirmation de rendez-vous ou de résultat d'acquisition
  attribuable à la machine : *« Parrit vend de l'acquisition et n'a aucune preuve
  d'acquisition par la machine. »* et *« les premiers deals viennent tous du réseau
  personnel »* (interdiction §7.8). La page DOIT distinguer noir sur blanc, sans
  arrondir : signaux traités par le pipeline (le pipeline existe, canon non
  basculé) ≠ rendez-vous obtenus par ce canal (aucun constaté) ≠ ventes attribuées
  à ce canal (aucune — réseau personnel). Ne pas fusionner ces trois faits dans une
  phrase qui donnerait l'impression d'un résultat commercial de la machine.
- Preuves engineering (auto-référentielles, vérifiables en temps réel par Paul,
  aucune approbation requise car ce sont les propres pratiques de livraison de
  Parrit, pas un cas client) :
  - Revue à trois passes Codex ↔ Claude : `~/paul-larmaraud-landing/scripts/codex-handoff.sh`,
    doctrine REGLES-DOR §25. Limite réelle à citer : une commande de batterie par
    défaut mal configurée peut donner un faux rouge (rencontré 3 fois le
    20/09/2026 sur ce même dépôt, PR #266/#267/#268) — corrigé à la main, jamais en
    assouplissant le contrôle.
  - Gates de qualité déterministes : `npm run qa:brand:rev01`, `npm run
    qa:claims:rev01`, `npm run qa:network:rev01` (fichiers `scripts/*.mjs`,
    `package.json`). Limite réelle à citer : `qa:claims:rev01` a bloqué une PR le
    20/09/2026 sur un faux positif de vocabulaire (« examine » contient « exam »),
    corrigé par reformulation, gate inchangé (`docs/CODEX-SPEC-2026-09-20-fix-30min-claims-gate.md`).
  - R-13 Super App (`CASE-STUDIES-EVIDENCE-MATRIX.md` #R-13) : PWA de décision
    mobile, 18 batteries de test, déployée en staging. Citer avec la réserve
    imposée par le registre de preuves : « démonstrateur interne en staging »,
    jamais « produit livré à un client ».
- Prix Build With You (section Offre) : `off.build-with-you`
  (`commercial-graph-v1.json`), déjà publié sur `/build-with-you` et la home
  (PR #268, mergée). Ne pas re-sourcer différemment ici — réutiliser
  `formatOfferPrice` et les mêmes montants (3200 € HT, forfait).

## 2. Ce qui reste `SOURCE_MISSING` — ne pas y prétendre répondre

- Alignement avec « Eyal » et « Antti » : aucune source trouvée dans le canon au
  20/09/2026. Ne rien écrire qui prétende s'aligner sur eux.
- Transcript du podcast fourni (« Fichier markdown.md collé ») : introuvable sur le
  poste. Le texte de cette page ne cite donc aucun timestamp du podcast — les
  mécaniques de persuasion utilisées viennent de `docs/research/ai-advantage.md`
  et `docs/research/ai-acquisition.md` (lecture DOM directe des deux sites), pas du
  podcast.
- Inspection visuelle réelle de palantir.com, aiacquisition.com, aiadvantage.com,
  bros-agency.com : impossible cette session (pas de rendu navigateur disponible).
  Toute mécanique reprise de ces références vient de `docs/research/*.md`
  (`STRUCTURE_VERIFIED`, jamais `VISUAL_VERIFIED`) — la direction visuelle de cette
  page vient uniquement du canon Parrit (tokens, composants existants), jamais
  d'une déduction visuelle sur ces sites.

## 3. Nouveaux composants

### `src/system/components/SystemCard.tsx`

Même discipline evidence-driven que `Dossier.tsx`/`OfferCard.tsx` : un champ non
fourni ne s'affiche pas, aucun placeholder.

```tsx
export type SystemCardProps = {
  domain: string;          // ex. "Gouvernance de la donnée"
  name: string;             // nom de la capacité
  input: string;             // ce qui entre
  process: string;           // ce qui est fait
  output: string;            // ce qui sort
  limits: string;            // limite réelle, jamais omise
  proofLabel: string;        // ex. "R-06 · preuve publiable" ou "R-13 · démonstrateur interne en staging"
};
```

Rendu : `<article>` avec `domain` en kicker (`<K>`), `name` en `<h3>`, puis quatre
lignes label/valeur (`Entrée`/`Input`, `Traitement`/`Process`, `Sortie`/`Output`,
`Limites`/`Limits`) — **`limits` est toujours affiché, jamais optionnel** (c'est le
point qui distingue une capacité démontrée d'un argumentaire commercial). `proofLabel`
en pied de carte, style `<K>` discret.

### `src/system/components/RegistrySnapshot.tsx`

Rend le tableau de la section 1 (domaines P0) tel quel — pas de graphique
proportionnel (interdit §53/anti-slop : une barre suggérerait une mesure
quantitative qui n'existe pas ici), une table sobre `IBM Plex Mono`. Props :
`asOf: string` (date de constat, obligatoire — jamais de présent sans date, cf.
interdiction #14 de la matrice), `rows: readonly { domain: string; source: string;
status: string; legacyWriters: number }[]`, `summary: { cutover: number;
migrating: number; notStarted: number; parityFail: number; total: number }`.

## 4. Page `src/app/(rev01)/systems/page.tsx`

Registre `r2-dark` (système/architecture, cohérent avec l'arbitrage §10.2 du Brand
OS). Réutiliser `K`, `RegistryLine`, `Frame` si utile, `.rev-button`/`.exec`,
`.r2-hero`/`.r2-section`/`.r2-shead`/`.r2-phases`/`.r2-phase`/`.r2-close`/`.r2-footer`
déjà en usage sur `manufacture`/`build-with-you`. Importer `OfferCard`,
`formatOfferPrice` depuis `@/system/components/OfferCard`.

### 4.1 Hero

- kicker : `Parrit / Systems` · `Parrit / Systèmes`
- H1 EN : **"What Parrit actually builds."** FR : **"Ce que Parrit construit,
  réellement."**
- sub EN : "Not a pitch. The objects, the decisions, and the humans who validate
  them — shown as they run, with their real limits." FR : "Pas un pitch. Les
  objets, les décisions et les humains qui les valident — montrés tels qu'ils
  tournent, avec leurs vraies limites."
- CTA primaire : réutiliser exactement le CTA déjà canonique (`Let's talk` /
  `Parlons-en`) vers `/commission` localisé.
- Lien secondaire : ancre vers la section catalogue (`#capacites`).

### 4.2 Section preuve courte (`aria-labelledby="evidence-heading"`)

Titre EN : "Shown, not claimed." FR : "Montré, pas revendiqué." Une ligne de texte
introductive puis 3 lignes factuelles courtes (format `K` + phrase), sourcées
section 1 : le registre de vérité (25 domaines suivis, état daté), la revue à trois
passes (limite du faux rouge citée), les gates déterministes (limite du faux
positif citée). Aucun chiffre décoratif, aucune icône.

### 4.3 Section vue opérationnelle (`id="operating-view"`)

Titre EN : "How a decision actually moves." FR : "Comment une décision se déplace
réellement." Sous-titre kicker : la chaîne Palantir traduite (section 1 du master
brief) : `signal → objet identifié → état calculé → décision préparée → validation
humaine → écriture retour → résultat`.

Rendu en 7 lignes façon `.r2-phases`/`.r2-phase` (numérotées 01-07, réutilise le
motif visuel déjà en usage sur `/manufacture`, pas un nouveau composant) :

01. Signal — EN "A candidate write lands on a business domain (contact, campaign,
    deadline, transcript)." FR "Une écriture candidate arrive sur un domaine
    métier (contact, campagne, échéance, transcript)."
02. Objet identifié — EN "The domain is checked against the registry: which table
    is canonical, who still writes elsewhere." FR "Le domaine est vérifié contre
    le registre : quelle table fait foi, qui écrit encore ailleurs."
03. État calculé — EN "The registry computes a state: cut over, migrating, not
    started, or parity failed if two sources disagree." FR "Le registre calcule un
    état : basculé, en migration, non démarré, ou parité en échec si deux sources
    ne se recoupent pas."
04. Décision préparée — EN "A cutover or a write-block is proposed. Never
    executed alone." FR "Une bascule ou un blocage d'écriture est proposé. Jamais
    exécuté seul."
05. Validation humaine — EN "The founder arbitrates: no cutover without replayable
    parity, one domain at a time." FR "Le fondateur arbitre : pas de bascule sans
    parité rejouable, un domaine à la fois."
06. Écriture retour — EN "The registry is updated in the same move as the
    decision, never after the fact." FR "Le registre est mis à jour dans le même
    geste que la décision, jamais après coup."
07. Résultat observé — EN "15 of 25 domains still split-brain today, visible
    through this same mechanism, not hidden." FR "15 domaines sur 25 encore en
    double écriture aujourd'hui, visibles par ce même mécanisme, pas cachés."

Sous cette séquence, insérer `<RegistrySnapshot>` avec les 7 lignes P0 de la
section 1 et `asOf="2026-09-13"`.

Puis un paragraphe distinct et visuellement séparé (pas dans le tableau) reprenant
mot pour mot l'esprit de la distinction obligatoire de la section 1 : EN "This same
registry governs the acquisition domain. Three separate facts, never merged:
signals the pipeline can process (the pipeline exists; the canonical acquisition
system itself is not yet cut over), meetings obtained through that channel (none
recorded), sales attributed to that channel (none — clients come from personal
relationships, not the machine). We say this here instead of hiding it." FR
"Ce même registre gouverne aussi le domaine acquisition. Trois faits distincts,
jamais confondus : signaux que le pipeline peut traiter (le pipeline existe, le
système d'acquisition canonique lui-même n'est pas encore basculé), rendez-vous
obtenus par ce canal (aucun constaté), ventes attribuées à ce canal (aucune — nos
clients viennent de relations personnelles, pas de la machine). Nous le disons ici
plutôt que de le cacher."

### 4.4 Catalogue de capacités démontrées (`id="capacites"`)

Titre EN "Demonstrated capabilities." FR "Capacités démontrées." Grille 2 colonnes
desktop / 1 mobile (même filet que `.home-s-offers-grid`, réutiliser la classe ou
une variante `.systems-grid` avec les mêmes règles). 4 `<SystemCard>` :

1. domain "Gouvernance de la donnée"/"Data governance", name "Registre de vérité
   multi-domaines"/"Multi-domain truth registry", input "une écriture ou lecture
   candidate sur un domaine métier"/"a candidate read or write on a business
   domain", process "vérification de la source canonique déclarée, détection des
   écritures encore faites ailleurs"/"checks the declared canonical source,
   detects writes still happening elsewhere", output "un état par domaine et un
   blocage d'écriture vers la source historique si nécessaire"/"a per-domain state,
   and a write-block toward the legacy source when needed", limits "15 domaines
   sur 25 encore en double écriture au 13/09/2026 ; aucune bascule sans parité
   rejouable"/"15 of 25 domains still split-brain as of 2026-09-13; no cutover
   without replayable parity", proofLabel "R-06 · preuve publiable"/"R-06 ·
   publishable evidence".
2. domain "Discipline de livraison"/"Delivery discipline", name "Revue à trois
   passes Codex ↔ Claude"/"Three-pass Codex ↔ Claude review", input "une
   spécification écrite"/"a written specification", process "implémentation
   isolée dans un chantier dédié, relecture indépendante, rejeu de la batterie de
   tests"/"isolated implementation in a dedicated workspace, independent review,
   re-run of the existing test suite", output "une revue mergée ou bloquée, jamais
   un commit direct"/"a merged or blocked review, never a direct commit", limits
   "une commande de batterie mal configurée peut donner un faux rouge — corrigé à
   la main, jamais en assouplissant le contrôle (rencontré 3 fois le
   20/09/2026)"/"a misconfigured default test command can produce a false red —
   fixed by hand, never by loosening the check (hit 3 times on 2026-09-20)",
   proofLabel "Pratique vérifiable en direct"/"Verifiable in real time".
3. domain "Qualité avant publication"/"Quality before publishing", name "Gates
   déterministes"/"Deterministic gates", input "du code prêt à fusionner"/"code
   ready to merge", process "vérification automatique des tokens de marque, des
   affirmations chiffrées à risque, du rendu responsive"/"automatic check of brand
   tokens, risky numeric claims, and responsive rendering", output "un blocage
   mécanique, pas un rappel à la mémoire"/"a mechanical block, not a reminder",
   limits "un gate peut se déclencher sur un faux positif de vocabulaire ; la
   correction reste humaine, le gate ne s'assouplit pas (rencontré le
   20/09/2026)"/"a gate can fire on a vocabulary false positive; the fix stays
   human, the gate itself is not loosened (hit on 2026-09-20)", proofLabel
   "Pratique vérifiable en direct"/"Verifiable in real time".
4. domain "Décision mobile"/"Mobile decision", name "Boucle de décision (staging
   interne)"/"Decision loop (internal staging)", input "une fiche ou une tâche en
   attente"/"a pending record or task", process "présentation compacte, décision
   humaine sur mobile"/"compact presentation, human decision on mobile", output
   "une action tracée au journal"/"an action logged to the journal", limits
   "démonstrateur interne en staging ; aucun compteur d'usage constaté à ce
   jour"/"internal demonstrator in staging; no usage counter observed to date",
   proofLabel "R-13 · démonstrateur interne en staging"/"R-13 · internal
   demonstrator in staging".

### 4.5 Section cas central — R-06 (déroulé + preuves fusionnés, `id="r06"`)

Rythme éditorial Bros.Agency (nom → métadonnées → palmarès de preuves réelles →
récit → fonctionnement → résultat/limites → action), sans portrait ni personnalité
héroïque — le sujet est le système, pas Paul.

- kicker : "Parrit / Cas central" · "Parrit / Central case"
- H2 EN "Parrit runs on Parrit." FR "Parrit tourne sur Parrit."
- métadonnées (ligne `K`) : "Interne · gouvernance de données · constaté le
  13/09/2026" / "Internal · data governance · observed 2026-09-13"
- palmarès (liste courte, chiffres réels uniquement, PAS de mise en forme
  proportionnelle) : "25 domaines métier suivis" / "1 domaine basculé, 8 en
  migration, 4 en échec de parité, 12 non démarrés" / "0 réécriture vers la source
  historique sans validation humaine documentée"
- récit (un paragraphe, ton sobre, pas de pathos) EN : "Every business object
  Parrit relies on — contacts, deadlines, transcripts, opportunities — has to
  declare which system tells the truth about it. Most haven't finished the move
  yet. We show that state instead of rounding it up." FR : "Chaque objet métier
  dont Parrit dépend — contacts, échéances, transcripts, opportunités — doit
  déclarer quel système fait foi sur lui. La plupart n'ont pas fini la bascule.
  Nous montrons cet état plutôt que de l'arrondir."
- renvoi (lien d'ancre, pas de répétition) : "Voir le mécanisme complet ci-dessus"
  / "See the full mechanism above" → `#operating-view`.
- action suivante : le même CTA que le hero (`/commission`), pas un CTA différent.

### 4.6 Méthode (teaser, pas de duplication — règle d'index du 02/08)

Un court paragraphe + lien unique vers `/manufacture` (déjà la ressource
canonique des trois phases Examen/Construction/Capitalisation). Ne pas reproduire
les phases ici.

EN : "Every system above is built the same way: Examination, Construction,
Compounding." → lien "Read the Manufacture" → `/manufacture`.
FR : "Chaque système ci-dessus se construit de la même façon : Examen,
Construction, Capitalisation." → lien "Lire la Manufacture" → `/manufacture`.

### 4.7 Garde-fous opérationnels (`id="garde-fous"`)

Titre EN "Operating guardrails." FR "Garde-fous opérationnels." Liste courte
(pas un tableau — interdiction §53 anti-tableau-pour-du-simple) :
- source de vérité par domaine, jamais une table choisie par défaut (renvoi
  section 4.3) ;
- validation humaine avant toute bascule ou tout write-back (renvoi 4.3, étape 05) ;
- journal des décisions, pas d'action silencieuse (renvoi 4.3, étape 06) ;
- rollback : chaque changement passe par une revue réversible avant fusion
  (renvoi 4.4, capacité 2) ;
- modèle choisi selon le besoin, jamais un seul fournisseur imposé — routage par
  coût et charge de travail, pas de lock-in.

### 4.8 Offre (`id="offre"`)

Titre EN "Where to start." FR "Par où commencer." Une seule `<OfferCard>` Build
With You, mêmes données que `page.tsx`/`build-with-you/page.tsx` (name, audience,
outcome, deliverables, format, price `{ amountHt: 3200, currency: "EUR", basis:
"forfait"/"fixed fee" }`, cta vers `/build-with-you` localisé). Ne pas dupliquer de
deuxième carte "sur mesure" ici (déjà sur la home) — cette section renvoie
uniquement vers l'offre d'entrée.

### 4.9 FAQ + CTA final (`id="faq"`)

4 questions courtes, réponses sourcées `TRUTH.md` (aucune invention) :
- EN "Is this training or a delivered system?" → "A system. Any skill transfer
  happens along the way — the deliverable is something that runs, not a course."
  FR "Formation ou système livré ?" → "Un système. Le transfert de compétence se
  fait en chemin — le livrable est quelque chose qui tourne, pas un support de
  cours."
- EN "Where does our data go?" → "Into your own accounts, under your own keys. We
  do not replicate it elsewhere." FR "Où vont nos données ?" → "Dans vos comptes,
  sous vos clés. Nous ne les répliquons pas ailleurs."
- EN "Who maintains the system afterward?" → "You, or us on a quote — the choice
  is made after the Examination, never before." FR "Qui maintient le système
  ensuite ?" → "Vous, ou nous sur devis — le choix se fait après l'Examen, jamais
  avant."
- EN "Where do we start?" → "A 15-minute Examination, no commitment." FR "Par où
  commence-t-on ?" → "Un Examen de 15 minutes, sans engagement."

CTA final identique au hero (`Let's talk`/`Parlons-en` → `/commission`).
Footer : `<RegistryLine value="PARRIT / SYSTEMS · 2026" />`, lien `/legal`.

## 5. Enregistrement de la route (même geste que `/build-with-you`, PR #268)

- `src/app/sitemap.ts` : ajouter `{ path: "/systems", lastModified: "2026-09-20",
  changeFrequency: "monthly" as const, priority: 0.8 }`.
- `src/proxy.ts` : ajouter `"/systems"` au même matcher que `/build-with-you`.
- `src/system/locale.ts` : ajouter `"/systems"` à `TRANSLATED_PATHS`.
- `package.json`, script `qa:network:rev01` : ajouter `tests/systems.spec.ts`.

## 6. Tests

Nouveau fichier `tests/systems.spec.ts` (Playwright, même structure que
`tests/offer-cards.spec.ts`) : FR/EN × 375/768/1440px. Vérifier : H1 présent,
les 4 `SystemCard` visibles avec leurs 4 champs (aucun `limits` vide/masqué), le
tableau `RegistrySnapshot` présent avec sa date, le paragraphe de distinction
signaux/rendez-vous/ventes présent en texte (pas juste dans le DOM caché), un
seul `OfferCard` en section Offre, tous les CTA pointent vers une destination
localisée valide, aucun débordement horizontal, grille catalogue passe à 1 colonne
sous 768px.

Nouveau test unitaire `tests/system-card.test.mjs` (`node --test`, même style que
`tests/offer-card.test.mjs`) : `limits` toujours rendu même vide en apparence
(le composant ne doit jamais permettre son omission — pas de prop optionnelle),
`domain`/`name`/`input`/`process`/`output` rendus tels quels sans troncature.

## 7. QA avant PR

- `npm run lint` + `npx tsc --noEmit` + `npm run build` + `npm run qa:brand:rev01`
  + `npm run qa:claims:rev01` + `npm run qa:network:rev01` : tous verts.
- Captures desktop (1440px) et mobile (375px), FR et EN, de chaque section de la
  page (hero, preuve courte, vue opérationnelle + tableau, catalogue, cas central,
  méthode, garde-fous, offre, FAQ).
- `git diff --stat` : seuls les fichiers listés en §3/§4/§5/§6 doivent apparaître.
  `commission/page.tsx`, `build-with-you/page.tsx`, `Dossier.tsx`,
  `dossiers/page.tsx`, `manufacture/page.tsx`, `page.tsx` (home) ne doivent PAS
  apparaître dans le diff.

## 8. Livraison

Branche dédiée → PR vers `main` avec compte rendu (composants créés/réutilisés,
provenance de chaque fait, captures). **Si tous les gates du §7 sont verts et
qu'aucune affirmation de la page n'est en `NEEDS_APPROVAL`** (aucune ne l'est ici :
seuls R-06 et R-13-avec-réserve sont utilisés, tous deux `PUBLISHABLE`/
`publicly_authorized: true` dans le registre de preuves), **Claude relit puis
merge et laisse le déploiement Vercel suivre le push sur `main`**, conformément à
l'autorisation du master brief §11. Rollback : revert de la PR, page nouvelle donc
aucun impact sur les pages existantes.
