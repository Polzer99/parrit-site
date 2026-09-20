# CODEX-SPEC · 2026-09-20 · Réécriture éditoriale complète de `/systems`

Statut : **VALIDÉ PAR PAUL le 20/09/2026.** Le français publié sur `/systems` a été
**rejeté sur le plan éditorial** (jargon technique traduit mot à mot, phrases-slogans
empilées, identifiants de preuve visibles publiquement). Cette spec remplace
l'intégralité du texte FR et EN de la page, et restructure la section « vue
opérationnelle » (remplace 7 étapes abstraites par un récit concret unique). Elle ne
touche à aucune autre page.

Méthode suivie (à ne pas répéter, déjà faite) : lecture intégrale de
`~/parrit-os/docs/doctrine-communication/STYLE-MD-v9-carla-complet.txt` (2430 lignes)
et `THE-LOOP-v1-carla.txt` (344 lignes), puis deux passes de relecture à l'aveugle par
Codex sur le brouillon FR, confrontées aux règles du corpus. Ne pas rouvrir ce
travail : implémenter le texte final ci-dessous tel quel.

## 0. Périmètre

- Fichiers concernés : `src/app/(rev01)/systems/page.tsx`,
  `src/system/components/RegistrySnapshot.tsx`. Aucun autre fichier.
- Ne pas toucher `OfferCard.tsx` ni le contenu de la carte Build With You (section
  Offre) : copy déjà arbitrée séparément.
- Ne pas toucher `Examen`, `Construction`, `Capitalisation`, `Lire la Manufacture` /
  `Read the Manufacture` : copy canonique partagée avec `/manufacture`, hors scope.
- `Entrée`/`Traitement`/`Sortie`/`Limites` (et `Input`/`Process`/`Output`/`Limits`)
  restent les libellés du composant `SystemCard` : structure explicitement demandée
  par Paul, ne pas la renommer même si elle paraît technique.

## 1. Restructuration de la section « vue opérationnelle »

Actuellement : un titre, une ligne `<K>` de type diagramme (`signal → objet
identifié → …`), puis 7 `<div className="r2-phase">` numérotées (01 à 07) dans
`.r2-phases`, puis `<RegistrySnapshot>`, puis un paragraphe sur l'acquisition.

**Nouveau** : supprimer entièrement le bloc `.r2-phases` et sa boucle sur
`evidence.steps` (7 étapes), ainsi que la ligne `<K>{copy.chain}</K>` (le diagramme
`signal → objet → …`). Les remplacer par UN SEUL paragraphe narratif (`<p>`, style
`lineHeight: 1.8` comme les autres paragraphes de la page), contenant le récit
fourni en §3 ci-dessous. Garder le titre de section (retitré, voir §3), garder
`<RegistrySnapshot>` juste après ce paragraphe, garder le paragraphe acquisition
après le tableau, inchangé dans sa position.

Résultat : `evidence.steps` et `copy.chain`/`copy.stepNames` disparaissent du DICT
(ne plus les référencer). Le composant `RegistrySnapshot` n'a plus besoin d'un
`id="step-5"`/`id="step-6"` puisque les ancres de `garde-fous` qui pointaient vers
ces steps doivent être redirigées vers `#operating-view` (l'ancre de section
existante) pour les items 2 et 3 de `guards` (ceux qui pointaient vers
`#step-5`/`#step-6`) — garder `#operating-view` et `#capacites` pour les autres,
comme aujourd'hui pour les items 1 et 4.

## 2. `RegistrySnapshot.tsx` — nouveaux en-têtes et résumé en texte libre

- Remplacer les 4 en-têtes de colonnes (voir §3, table FR/EN) par les nouveaux
  libellés fournis.
- Remplacer la prop `summary: { cutover, migrating, notStarted, parityFail, total }`
  et son rendu template (`{summary.total} domaines · CUTOVER {summary.cutover} …`)
  par une nouvelle prop **`summaryText: string`** : une phrase entièrement composée
  et déjà localisée, passée directement par `page.tsx` (voir §3 pour le texte exact
  FR/EN). Le composant se contente de l'afficher dans un `<p>` (même style que
  l'actuel), sans recomposer de template. Mettre à jour le type `RegistrySnapshotProps`
  en conséquence et l'appel dans `page.tsx`.
- Les autres props (`asOf`, `rows`, `locale`) restent inchangées dans leur forme,
  seules leurs valeurs (voir §3) changent.
- Le rendu responsive sous 767px (cartes empilées, `data-label`) déjà en place reste
  inchangé structurellement — seuls les libellés de colonnes changent.

## 3. Texte final — à recopier EXACTEMENT, aucune reformulation

### Hero

FR : kicker `Parrit / Systèmes` (inchangé) · H1 **« Nous montrons le système. Vous
jugez avant de vous engager. »** · sous-titre **« Voici le système qui organise nos
dossiers et nos décisions, tel qu'il fonctionne aujourd'hui, avec ce qui ne marche
pas encore. »**

EN : kicker `Parrit / Systems` (inchangé) · H1 **« We show the system. You judge
before you commit. »** · sous-titre **« Here is the system that runs our own files
and our own decisions, shown as it works today, including what doesn't work
yet. »**

CTA (inchangé) : `Parlons-en` / `Let's talk`.

### Section preuve courte

Titre FR **« Montré, pas revendiqué. »** / EN **« Shown, not claimed. »** (inchangés).

Intro FR : **« Voici trois méthodes que nous utilisons dans notre propre travail
avant de vous les proposer. »**
Intro EN : **« Here are three things we hold ourselves to before we offer them to
you. »**

Fait 1 — label FR **« La liste qui fait foi »** / EN **« The list that's trusted »** —
corps FR : **« Dans beaucoup d'entreprises, plusieurs fichiers prétendent chacun
être la bonne liste de clients, et personne ne sait lequel croire. Chez nous, pour
chaque type d'information (les contacts, les rendez-vous, les appels, les dossiers
en cours), une seule source fait foi, et l'ancien fichier n'est mis de côté que le
jour où l'on a vérifié que le nouveau contient tout. Au 13 septembre 2026, ce
travail n'est pas fini partout : sur 25 types d'information suivis, 15 ont encore
deux versions qui ne concordent pas. »**
corps EN : **« In a lot of companies, several files each claim to be the real
customer list, and nobody knows which one to believe. Here, for each type of
information (contacts, meetings, calls, open files), one source is trusted, and the
old file only gets retired once we've checked the new one holds everything. As of
September 13, 2026, that work isn't finished everywhere: of 25 types of information
we track, 15 still have two versions that don't match. »**

Fait 2 — label FR **« Deux regards avant chaque changement »** / EN **« Two sets of
eyes on every change »** — corps FR : **« Avant qu'un changement touche un de nos
systèmes, une autre personne que l'auteur le relit entièrement, dans un espace de
travail séparé. Puis nous relançons l'ensemble de nos tests. Un changement qui n'a
pas passé ces deux étapes n'est jamais mis en ligne. »**
corps EN : **« Before a change touches one of our systems, someone other than the
person who wrote it reads it in full, in a separate workspace. Then we rerun our
whole test suite. A change that hasn't passed both steps never goes live. »**

Fait 3 — label FR **« Une vérification qui peut bloquer une page »** / EN **« A
check that can block a page »** — corps FR : **« Avant qu'une page de ce site soit
mise en ligne, une vérification automatique relit le texte et la mise en page. Elle
bloque si un chiffre semble invérifiable, si une couleur sort de notre charte, ou si
le texte déborde sur un téléphone. Si elle bloque à tort, on corrige le texte
concerné. On ne désactive jamais la vérification elle-même. »**
corps EN : **« Before a page on this site goes live, an automatic check reads the
text and the layout. It blocks if a number looks unverifiable, if a colour breaks
our guidelines, or if the text overflows on a phone. If it blocks something
wrongly, we fix the text. We never turn the check off. »**

### Section vue opérationnelle (restructurée, §1)

Titre FR **« Comment nous repérons un écart, et ce qu'il se passe ensuite. »** / EN
**« How we catch a mismatch, and what happens next. »**

Récit FR (paragraphe unique, remplace les 7 étapes) : **« Prenons un exemple réel.
Un commercial enregistre un nouveau contact dans son outil habituel. Le système
vérifie aussitôt si cet outil est bien celui qui doit faire foi pour les contacts,
ou si un outil plus ancien s'en occupe encore en parallèle. Si les deux outils sont
encore utilisés, rien n'est corrigé tout seul : la situation est simplement
signalée. C'est le fondateur qui décide, un outil à la fois, du jour où l'ancien est
mis de côté. Une fois la décision prise, elle est appliquée directement dans le
système, et notée noir sur blanc : qui a décidé, et quand. Voilà pourquoi,
aujourd'hui même, 15 des 25 types d'information suivis attendent encore cette
décision. Nous ne le cachons pas. »**

Récit EN : **« Take a real example. A salesperson enters a new contact in the tool
they normally use. The system immediately checks whether that tool is the one
meant to hold contacts, or whether an older tool is still handling them too. If
both tools are still in use, nothing gets fixed on its own: the situation is simply
flagged. It's the founder who decides, one tool at a time, when the old one is
retired. Once that decision is made, it's applied directly in the system, and
written down in plain terms: who decided, and when. That's why, right now, 15 of
the 25 types of information we track are still waiting on that decision. We don't
hide it. »**

Tableau — en-têtes FR : `Type d'information` / `Où l'information est enregistrée` /
`Situation` / `Anciens outils encore utilisés en parallèle`. En-têtes EN : `Type of
information` / `Where it's recorded` / `Status` / `Legacy tools still in parallel
use`.

Lignes (domain | source | status | legacyWriters), identiques dans l'ordre et les
nombres à l'implémentation actuelle, seuls les libellés changent :

FR :
1. Identification des contacts | Notre application interne | Deux versions qui ne concordent pas | 11
2. Liste des personnes à ne pas recontacter | Notre application interne | En cours de transfert | 1
3. Prospection commerciale | Outil externe (Instantly) | Le transfert n'a pas commencé | 0
4. Échéances commerciales | Notre application interne | Deux versions qui ne concordent pas | 1
5. Affaires commerciales en cours | Notre application interne | Deux versions qui ne concordent pas | 2
6. Comptes rendus d'appels | Notre application interne | En cours de transfert | 6
7. Historique des actions internes | Notre application interne | En cours de transfert | 6

EN :
1. Contact identification | Our internal application | Two versions that don't match | 11
2. Do-not-contact list | Our internal application | Being transferred | 1
3. Outreach | External tool (Instantly) | Transfer not started | 0
4. Sales deadlines | Our internal application | Two versions that don't match | 1
5. Open deals | Our internal application | Two versions that don't match | 2
6. Call transcripts | Our internal application | Being transferred | 6
7. Internal activity log | Our internal application | Being transferred | 6

`summaryText` FR : **« 25 types d'information suivis au total. Pour 1, le transfert
est terminé. Pour 8, il est en cours. Pour 4, les deux versions ne concordent pas.
Pour 12, il n'a pas encore commencé. »**
`summaryText` EN : **« 25 types of information tracked in total. For 1, the
transfer is complete. For 8, it's underway. For 4, the two versions don't match.
For 12, it hasn't started. »**

Paragraphe acquisition FR (position inchangée, après le tableau) : **« Ce même
travail de vérification s'applique aussi à notre prospection commerciale. Notre
outil fonctionne : il repère, dans des informations publiques, des indices qu'une
entreprise pourrait avoir besoin de nous. Mais nous ne l'avons pas encore branché
sur notre système principal. Cet outil n'a encore débouché sur aucun rendez-vous.
Et aucune vente ne lui est due : nos clients viennent de personnes que nous
connaissons déjà. »**
EN : **« The same check applies to our own outreach. Our tool works: it looks for
public signs that a company might need us. But we haven't connected it to our main
system yet. That tool hasn't led to a single meeting so far. And no sale is owed to
it: our clients come from people we already know. »**

### Section capacités démontrées

Titre inchangé : **« Capacités démontrées. »** / **« Demonstrated capabilities. »**

CARTE 1 — FR : domain **« Vos informations, une seule version qui compte »**, name
**« La liste qui fait foi »**, input **« une information créée ou modifiée n'importe
où dans l'entreprise (un contact, un rendez-vous, un dossier) »**, process
**« vérifie si l'outil utilisé est bien celui qui doit faire foi, et repère si un
autre outil, plus ancien, contient encore une version différente »**, output
**« une situation claire pour chaque type d'information, et un signal si deux
versions se contredisent »**, limits **« Au 13 septembre 2026, 15 types
d'information sur 25 ont encore deux versions différentes. Aucune n'est retirée
tant que la nouvelle version n'a pas été vérifiée comme complète. »**, proofLabel
**« Le système que nous utilisons nous-mêmes, tous les jours. »**

CARTE 1 — EN : domain **« Your information, one version that counts »**, name
**« The list that's trusted »**, input **« a piece of information created or
changed anywhere in the company (a contact, a meeting, a file) »**, process
**« checks whether the tool used is the one meant to hold it, and flags whether an
older tool still holds a different version »**, output **« a clear status for each
type of information, and a flag if two versions disagree »**, limits **« As of
September 13, 2026, 15 of 25 types of information still have two different
versions. None is retired until the new version has been checked as complete. »**,
proofLabel **« The system we use ourselves, every day. »**

CARTE 2 — FR : domain **« Comment nous vérifions notre propre travail »**, name
**« Deux regards avant chaque changement »**, input **« une idée de changement,
écrite noir sur blanc avant de commencer »**, process **« la modification est
préparée dans un espace de travail séparé, une autre personne que l'auteur la relit
entièrement, puis nous relançons l'ensemble de nos tests »**, output **« une
modification acceptée ou refusée, jamais mise en ligne sans être passée par ces
deux vérifications »**, limits **« C'est notre propre façon de travailler,
appliquée à notre propre système avant de l'être au vôtre. »**, proofLabel **« Vous
pouvez le vérifier à chaque mise à jour du site. »**

CARTE 2 — EN : domain **« How we check our own work »**, name **« Two sets of eyes
on every change »**, input **« an idea for a change, written down before we
start »**, process **« the change is prepared in a separate workspace, someone
other than the author reads it in full, then we rerun our whole test suite »**,
output **« a change accepted or refused, never put live without passing both
checks »**, limits **« This is our own way of working, applied to our own system
before it's applied to yours. »**, proofLabel **« You can verify it on every update
to this site. »**

CARTE 3 — FR : domain **« Qualité avant publication »** (inchangé), name **« Une
vérification automatique qui peut bloquer une page »**, input **« une page prête à
être publiée sur le site »**, process **« une vérification automatique relit le
texte, les couleurs et l'affichage sur téléphone »**, output **« la mise en ligne
est bloquée si quelque chose ne va pas, sans attendre qu'un humain le remarque »**,
limits **« Si elle bloque à tort, on corrige le texte concerné. On ne désactive
jamais la vérification elle-même. »**, proofLabel **« Vérifiable à chaque mise à
jour du site. »**

CARTE 3 — EN : domain **« Quality before publishing »**, name **« An automatic
check that can block a page »**, input **« a page ready to be published »**,
process **« an automatic check reads the text, the colours, and the mobile
layout »**, output **« publishing is blocked if something is wrong, without
waiting for a person to notice »**, limits **« If it blocks something wrongly, we
fix the text. We never turn the check off. »**, proofLabel **« Verifiable on every
update to this site. »**

CARTE 4 — FR : domain **« Prendre une décision depuis un téléphone »**, name
**« Un prototype pour décider depuis son téléphone »**, input **« un dossier ou une
tâche en attente d'une décision »**, process **« l'information est présentée
simplement, et une personne décide directement depuis son téléphone »**, output
**« la décision est enregistrée, avec le nom de la personne qui l'a prise »**,
limits **« C'est encore un usage interne : aucun client ne l'utilise aujourd'hui,
et nous n'avons pas encore mesuré la fréquence d'utilisation de ce prototype. »**,
proofLabel **« Un prototype interne, pas un produit livré à un client. »**

CARTE 4 — EN : domain **« Deciding from a phone »**, name **« A prototype for
deciding from your phone »**, input **« a file or task waiting on a decision »**,
process **« the information is shown simply, and a person decides directly from
their phone »**, output **« the decision is logged, with the name of the person
who made it »**, limits **« Still internal use only: no client uses it today, and
we haven't yet measured how often it's used. »**, proofLabel **« An internal
prototype, not a product delivered to a client. »**

### Section cas central

Titre FR **« Le premier client de ce système, c'est nous. »** / EN **« The first
client of this system is us. »**

Métadonnées (caption `<K>`) FR **« Usage interne · vérifié le 13 septembre 2026 »**
/ EN **« Internal use · observed 2026-09-13 »**

Liste FR : **« 25 types d'information suivis dans l'entreprise »** ·
**« 1 réglé, 8 en cours de transfert, 4 avec deux versions différentes, 12 pas
encore commencés »** · **« Toute correction a été validée et notée par une
personne. »**
Liste EN : **« 25 types of information tracked across the company »** · **« 1
settled, 8 being transferred, 4 with two different versions, 12 not started »** ·
**« Every automatic correction has been checked and logged by a person. »**

Récit FR : **« Toutes nos informations importantes (les contacts, les rendez-vous,
les appels, les dossiers en cours) doivent avoir une seule source qui fait foi. Ce
travail n'est pas terminé partout. Nous montrons où il en est vraiment. »**
Récit EN : **« Every piece of information Parrit depends on (a contact, a
deadline, a call, an open deal) needs one trusted source. That work isn't finished
everywhere. We show where it actually stands. »**

Lien FR **« Revenir à l'explication détaillée, plus haut »** / EN **« Back to the
detailed explanation, above »**, ancre inchangée (`#operating-view`).

### Méthode — inchangé (canonique), ne pas toucher.

### Garde-fous

Titre FR **« Garde-fous. »** / EN **« Guardrails. »**

FR :
1. « Pour chaque type d'information, un seul outil fait foi. Il n'est jamais choisi
   par hasard ni par habitude. » (lien → `#operating-view`)
2. « Tout changement de système et toute correction automatique doivent être
   validés par une personne. » (lien → `#operating-view`)
3. « Chaque décision est notée : qui a décidé, et quand. Rien ne se passe sans
   laisser de trace. » (lien → `#operating-view`)
4. « Avant qu'un changement touche le site ou nos outils, quelqu'un d'autre que son
   auteur le relit, et on peut toujours revenir en arrière. » (lien → `#capacites`)
5. « Le choix d'un outil d'intelligence artificielle dépend du besoin et du coût,
   jamais d'un seul fournisseur imposé. » (pas de lien, comme aujourd'hui)

EN :
1. « For each type of information, a single tool is trusted. It's never chosen by
   default or by habit. » (link → `#operating-view`)
2. « Every system change and every automatic correction must be validated by a
   person. » (link → `#operating-view`)
3. « Every decision is logged: who decided, and when. Nothing happens silently. »
   (link → `#operating-view`)
4. « Before a change touches the site or our tools, someone other than its author
   reads it, and it can always be rolled back. » (link → `#capacites`)
5. « The choice of AI model depends on the need and the cost, never on a single
   imposed provider. » (no link, as today)

Note : les items 1-3 pointaient auparavant vers `#operating-view`/`#step-5`/
`#step-6` — comme les ancres `step-*` disparaissent (§1), les 3 premiers pointent
maintenant tous vers `#operating-view`. L'item 4 garde `#capacites`.

### Offre — inchangé, ne pas toucher.

### FAQ

FR :
- Q « Formation ou système livré ? » R **« Un système. Vous apprenez à vous en
  servir en cours de route, mais ce que nous livrons, c'est quelque chose qui
  fonctionne, pas un cours. »**
- Q « Où vont nos données ? » R **« Dans vos comptes, avec vos propres accès. Nous
  n'en gardons pas de copie ailleurs. »**
- Q « Qui maintient le système ensuite ? » R **« Vous, ou nous sur devis : le choix
  se fait après l'Examen, jamais avant. »**
- Q « Par où commence-t-on ? » R **« Un Examen de 15 minutes, sans engagement. »**
  (inchangé)

EN :
- Q « Is this training or a delivered system? » A **« A system. You learn to use it
  along the way, but what we deliver is something that runs, not a course. »**
- Q « Where does our data go? » A **« Into your own accounts, with your own
  access. We don't keep a copy elsewhere. »**
- Q « Who maintains the system afterward? » A **« You, or us on a quote: the choice
  is made after the Examination, never before. »**
- Q « Where do we start? » A **« A 15-minute Examination, no commitment. »**
  (inchangé)

CTA final inchangé.

## 4. Contrainte non négociable : zéro tiret cadratin (—)

Vérifier qu'aucun tiret cadratin (—) ne subsiste nulle part dans les deux fichiers
après édition (règle du dépôt, `TRUTH.md` §6, et règle STYLE.MD de Carla). Le texte
ci-dessus n'en contient aucun ; ne pas en réintroduire en éditant.

## 5. QA avant PR

- `npm run lint` + `npx tsc --noEmit` + `npm run build` + `npm run qa:brand:rev01` +
  `npm run qa:claims:rev01` + `npm run qa:network:rev01` (adapter
  `tests/systems.spec.ts` et `tests/system-card.test.mjs` si leurs assertions
  citaient l'ancien texte ou les anciennes ancres `#step-*` — mettre à jour les
  textes attendus, pas la logique de test).
- `grep -rn "—" src/app/\(rev01\)/systems/page.tsx src/system/components/RegistrySnapshot.tsx`
  doit être vide.
- Captures desktop 1440px + mobile 375px, FR + EN, de la page complète.
- `git diff --stat` : seuls `src/app/(rev01)/systems/page.tsx`,
  `src/system/components/RegistrySnapshot.tsx`, et les fichiers de test adaptés le
  cas échéant, doivent apparaître.

## 6. Livraison

Branche dédiée → PR vers `main`. Si tous les gates sont verts, Claude relit et
merge (même autorisation que la spec précédente de `/systems`, cette PR est une
correction éditoriale de contenu déjà en production, pas une nouvelle fonctionnalité).
