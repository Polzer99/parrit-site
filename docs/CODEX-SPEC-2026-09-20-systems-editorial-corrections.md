# SPEC — Corrections éditoriales ciblées `/systems` (post-PR #272)

Trois défauts factuels/éditoriaux relevés par Paul dans le texte livré en PR #272,
vérifiés contre `docs/data-canonical/SOURCE_OF_TRUTH_REGISTRY.json` (repo
`parrit-os-signals`, commit du 2026-09-13/16) avant correction. Aucune invention :
chaque remplacement ci-dessous est sourcé dans la section « Preuves » en bas de
fichier.

## Scope

Fichiers concernés, RIEN d'autre :
- `src/app/(rev01)/systems/page.tsx`
- `src/system/components/RegistrySnapshot.tsx`

Ne pas toucher : structure des sections, composants, routes, `OfferCard`,
`/manufacture`, labels `Entrée/Traitement/Sortie/Limites`, `Capacités démontrées`.
Remplacements de texte EXACTS, chaîne pour chaîne — ne pas reformuler au-delà de
ce qui est spécifié ici.

**Contrainte non négociable, inchangée depuis la spec précédente : zéro tiret
cadratin (—) dans tout texte FR ou EN de ce fichier.** Vérifier par
`grep -n "—" src/app/\(rev01\)/systems/page.tsx` après application : zéro résultat.

## Remplacement 1 — `RegistrySnapshot.tsx`, ligne des en-têtes (`headings`)

Le mot « encore utilisés en parallèle » / « still in parallel use » affirme une
activité actuelle non garantie : le registre source contient des entrées
explicitement INACTIVES ou DÉSACTIVÉES dans ce même compte (voir Preuves #3).

- FR, remplacer `"Anciens outils encore utilisés en parallèle"` par
  `"Anciens points d'écriture recensés"`
- EN, remplacer `"Legacy tools still in parallel use"` par
  `"Legacy write points on record"`

## Remplacement 2 — `page.tsx`, `DICT.fr.summaryText` et `DICT.en.summaryText`

Remplacer la valeur exacte de `DICT.fr.summaryText` :

Ancien :
```
"25 types d'information suivis au total. Pour 1, le transfert est terminé. Pour 8, il est en cours. Pour 4, les deux versions ne concordent pas. Pour 12, il n'a pas encore commencé."
```
Nouveau :
```
"25 types d'information suivis au total. Pour 1, le transfert est terminé. Pour 8, il est en cours. Pour 4, une vérification a trouvé un désaccord entre les deux versions. Pour 12, le transfert n'a pas encore commencé. Le compte des anciens outils inclut des points déjà mis en pause ou en échec, gardés au registre jusqu'à fermeture actée."
```

Remplacer la valeur exacte de `DICT.en.summaryText` :

Ancien :
```
"25 types of information tracked in total. For 1, the transfer is complete. For 8, it's underway. For 4, the two versions don't match. For 12, it hasn't started."
```
Nouveau :
```
"25 types of information tracked in total. For 1, the transfer is complete. For 8, it's underway. For 4, a check found a disagreement between the two versions. For 12, the transfer hasn't started. The legacy-tool count includes points already paused or failing, kept on record until formally closed."
```

## Remplacement 3 — `DICT.fr.facts[0][1]` et `DICT.en.facts[0][1]` (FAIT 1 / La liste qui fait foi)

Le chiffre « 15 » (domaines en split-brain, champ `split_brain: true` du
registre) et le chiffre « 4 » (sous-ensemble `PARITY_FAIL`, une vérification
directe a mesuré un désaccord) sont deux mesures différentes, pas une somme à
faire concorder avec `1+8+4+12=25` (qui répond à une autre question : la
répartition par `cutover_status`). Les deux chiffres sont réels et coexistent.

FR — remplacer tout le second élément du premier tableau `facts` :

Ancien :
```
"Dans beaucoup d'entreprises, plusieurs fichiers prétendent chacun être la bonne liste de clients, et personne ne sait lequel croire. Chez nous, pour chaque type d'information (les contacts, les rendez-vous, les appels, les dossiers en cours), une seule source fait foi, et l'ancien fichier n'est mis de côté que le jour où l'on a vérifié que le nouveau contient tout. Au 13 septembre 2026, ce travail n'était pas fini partout : sur 25 types d'information suivis, un seul était réglé, et 4 avaient deux versions qui se contredisaient directement."
```
Nouveau :
```
"Dans beaucoup d'entreprises, plusieurs fichiers prétendent chacun être la bonne liste de clients, et personne ne sait lequel croire. Chez nous, pour chaque type d'information (les contacts, les rendez-vous, les appels, les dossiers en cours), une seule source doit faire foi, et l'ancienne n'est mise de côté que le jour où l'on a vérifié que la nouvelle contient tout. Au 13 septembre 2026, ce travail n'était pas fini partout : sur 25 types d'information suivis, 15 avaient encore deux sources en présence, et pour 4 d'entre eux, une vérification directe avait déjà trouvé un désaccord entre elles."
```

EN — même remplacement :

Ancien :
```
"In a lot of companies, several files each claim to be the real customer list, and nobody knows which one to believe. Here, for each type of information (contacts, meetings, calls, open files), one source is trusted, and the old file only gets retired once we've checked the new one holds everything. As of September 13, 2026, that work wasn't finished everywhere: of 25 types of information we track, only 1 was settled, and 4 had two versions directly contradicting each other."
```
Nouveau :
```
"In a lot of companies, several files each claim to be the real customer list, and nobody knows which one to believe. Here, for each type of information (contacts, meetings, calls, open files), one source is meant to be trusted, and the old one only gets retired once we've checked the new one holds everything. As of September 13, 2026, that work wasn't finished everywhere: of the 25 types of information we track, 15 still had two sources in place, and for 4 of them, a direct check had already found a disagreement between them."
```

## Remplacement 4 — `DICT.fr.facts[1]` et `DICT.en.facts[1]` (FAIT 2 / la relecture indépendante)

Le texte actuel dit « une autre personne » / « someone other than the person »,
ce qui laisse croire à une relecture humain-à-humain. En réalité : celui qui
écrit une modification (Codex) n'est jamais celui qui la relit (Claude), et la
mise en ligne reste une décision humaine distincte des deux (§25 de la
doctrine interne). Ne pas nommer les outils sur la page publique — décrire le
principe, pas les noms.

FR — remplacer tout l'élément `facts[1]` :

Ancien :
```
["Deux regards avant chaque changement", "Avant qu'un changement touche un de nos systèmes, une autre personne que l'auteur le relit entièrement, dans un espace de travail séparé. Puis nous relançons l'ensemble de nos tests. Un changement qui n'a pas passé ces deux étapes n'est jamais mis en ligne."]
```
Nouveau :
```
["Deux vérifications avant chaque changement", "Celui qui écrit une modification n'est jamais celui qui la valide. Une modification est d'abord préparée dans un espace de travail séparé, puis un second système, distinct de celui qui l'a écrite, la relit en entier. Nos tests sont ensuite rejoués intégralement. Une personne décide seule de la mise en ligne finale. Une modification qui n'a pas passé ces étapes n'est jamais publiée."]
```

EN — remplacer tout l'élément `facts[1]` :

Ancien :
```
["Two sets of eyes on every change", "Before a change touches one of our systems, someone other than the person who wrote it reads it in full, in a separate workspace. Then we rerun our whole test suite. A change that hasn't passed both steps never goes live."]
```
Nouveau :
```
["Two checks before every change", "Whoever writes a change is never the one who approves it. A change is first built in a separate workspace, then a second system, distinct from the one that wrote it, reviews it in full. We then rerun our whole test suite. A single person decides alone whether it goes live. A change that hasn't passed these steps is never published."]
```

## Remplacement 5 — `EVIDENCE.fr.cards[0].limits` et `EVIDENCE.en.cards[0].limits` (Carte 1)

FR — ancien :
```
"Au 13 septembre 2026, un seul type d'information sur 25 avait une source unique stabilisée. Les autres étaient en cours de transfert, pas encore commencés, ou avaient deux versions actives en parallèle."
```
FR — nouveau :
```
"Au 13 septembre 2026, 15 types d'information sur 25 avaient encore deux sources en présence, et pour 4, une vérification directe avait trouvé un désaccord entre elles. Aucune ancienne source n'est retirée tant qu'elle n'a pas été vérifiée comme redondante."
```

EN — ancien :
```
"As of September 13, 2026, only 1 of 25 types of information had a single stable source. The rest were being transferred, not started, or had two active versions in parallel."
```
EN — nouveau :
```
"As of September 13, 2026, 15 of the 25 types of information still had two sources in place, and for 4, a direct check had found a disagreement between them. No old source is retired until it's been confirmed redundant."
```

## Remplacement 6 — `EVIDENCE.fr.cards[1]` et `EVIDENCE.en.cards[1]` (Carte 2, mêmes raisons que le remplacement 4)

FR — remplacer `"name"`, `"process"`, `"output"` (garder `"domain"`, `"input"`,
`"limits"`, `"proofLabel"` inchangés) :

- `"name"` ancien `"Deux regards avant chaque changement"` → nouveau
  `"Deux systèmes, une décision humaine"`
- `"process"` ancien
  `"la modification est préparée dans un espace de travail séparé, une autre personne que l'auteur la relit entièrement, puis nous relançons l'ensemble de nos tests"`
  → nouveau
  `"la modification est préparée dans un espace de travail séparé, un second système, distinct de celui qui l'a écrite, la relit en entier, puis nous relançons l'ensemble de nos tests"`
- `"output"` ancien
  `"une modification acceptée ou refusée, jamais mise en ligne sans être passée par ces deux vérifications"`
  → nouveau
  `"une modification acceptée ou refusée ; la mise en ligne reste une décision humaine, jamais automatique"`

EN — mêmes trois champs :

- `"name"` ancien `"Two sets of eyes on every change"` → nouveau
  `"Two systems, one human decision"`
- `"process"` ancien
  `"the change is prepared in a separate workspace, someone other than the author reads it in full, then we rerun our whole test suite"`
  → nouveau
  `"the change is built in a separate workspace, a second system, distinct from the one that wrote it, reviews it in full, then we rerun our whole test suite"`
- `"output"` ancien
  `"a change accepted or refused, never put live without passing both checks"`
  → nouveau
  `"a change accepted or refused; going live stays a human decision, never automatic"`

## Remplacement 7 — `DICT.fr.guards[3]` et `DICT.en.guards[3]` (même raison)

FR — ancien :
```
"Avant qu'un changement touche le site ou nos outils, quelqu'un d'autre que son auteur le relit, et on peut toujours revenir en arrière."
```
FR — nouveau :
```
"Avant qu'un changement touche le site ou nos outils, un second système, distinct de celui qui l'a écrit, le relit, et une personne décide seule de le mettre en ligne. On peut toujours revenir en arrière."
```

EN — ancien :
```
"Before a change touches the site or our tools, someone other than its author reads it, and it can always be rolled back."
```
EN — nouveau :
```
"Before a change touches the site or our tools, a second system, distinct from the one that wrote it, reviews it, and a person decides alone whether to ship it. It can always be rolled back."
```

## Remplacement 8 — `EVIDENCE.fr.narrative` et `EVIDENCE.en.narrative` (section « Comment nous repérons un écart »)

Le texte actuel affirme une vérification « aussitôt » (temps réel, à chaque
création de contact) : non prouvé. Le remplacement s'appuie sur deux mécanismes
réels et datés (voir Preuves #4 et #5) : le verrou CI qui bloque tout nouveau
point d'écriture legacy non déclaré, et un audit ponctuel daté qui a mesuré un
écart concret. Le chiffre « onze » et « 114 » viennent du domaine
`GTM.contacts_identity` du registre (Preuves #1 et #2).

FR — remplacer toute la valeur de `narrative` :

Ancien :
```
"Prenons un exemple réel. Un commercial enregistre un nouveau contact dans son outil habituel. Le système vérifie aussitôt si cet outil est bien celui qui doit faire foi pour les contacts, ou si un outil plus ancien s'en occupe encore en parallèle. Si les deux outils sont encore utilisés, rien n'est corrigé tout seul : la situation est simplement signalée. C'est le fondateur qui décide, un outil à la fois, du jour où l'ancien est mis de côté. Une fois la décision prise, elle est appliquée directement dans le système, et notée noir sur blanc : qui a décidé, et quand. Voilà pourquoi, au 13 septembre 2026, 4 des 25 types d'information suivis avaient encore deux outils actifs en parallèle, comme dans cet exemple, et un seul était réglé sur les 25. Nous ne le cachons pas."
```
Nouveau :
```
"Prenons l'exemple le plus net : l'identification de nos contacts. Onze anciens outils y écrivent encore aujourd'hui, certains automatiquement, comme une synchronisation qui tourne toutes les 15 minutes. Une comparaison directe des deux sources, menée le 11 septembre 2026, a trouvé 114 fiches présentes uniquement dans l'ancien système. Rien n'est corrigé tout seul : la situation est signalée, et un contrôle automatique interdit désormais d'ajouter un nouveau point d'écriture vers l'ancien système sans le déclarer ici. C'est le fondateur qui décide, un type d'information à la fois, du jour où une ancienne source est mise de côté. Cette décision a déjà été prise et datée pour plusieurs d'entre elles. Voilà pourquoi, au 13 septembre 2026, 15 des 25 types d'information suivis avaient encore deux sources en présence, dont 4 où une vérification directe avait trouvé un désaccord, comme dans cet exemple. Nous ne le cachons pas."
```

EN — remplacer toute la valeur de `narrative` :

Ancien :
```
"Take a real example. A salesperson enters a new contact in the tool they normally use. The system immediately checks whether that tool is the one meant to hold contacts, or whether an older tool is still handling them too. If both tools are still in use, nothing gets fixed on its own: the situation is simply flagged. It's the founder who decides, one tool at a time, when the old one is retired. Once that decision is made, it's applied directly in the system, and written down in plain terms: who decided, and when. That is why, as of September 13, 2026, 4 of the 25 types of information we track still had two active tools in parallel, as in this example, and only 1 out of 25 was settled. We do not hide it."
```
Nouveau :
```
"Take the clearest example: contact identification. Eleven legacy tools still write to it today, some automatically, including a sync job that runs every 15 minutes. A direct comparison of both sources, run on September 11, 2026, found 114 records that existed only in the old system. Nothing gets fixed on its own: the mismatch is flagged, and an automatic gate now blocks any new write path into the old system unless it's declared here first. It's the founder who decides, one type of information at a time, when an old source gets retired. That decision has already been made and dated for several of them. That is why, as of September 13, 2026, 15 of the 25 types of information we track still had two sources in place, 4 of which had a directly measured disagreement, as in this example. We do not hide it."
```

## Vérification à livrer dans la PR

1. `grep -n "—" src/app/\(rev01\)/systems/page.tsx` → aucun résultat.
2. `grep -n "aussitôt\|immediately checks" src/app/\(rev01\)/systems/page.tsx` → aucun résultat.
3. `grep -n "une autre personne\|someone other than" src/app/\(rev01\)/systems/page.tsx` → aucun résultat.
4. `npm run build && npm run qa:brand:rev01` verts.
5. `npx next start -p 3210 &` puis `npm run qa:network:rev01` vert (74/74 attendu, comme PR #272).

## Preuves (sourcing des remplacements, ne pas publier ces lignes sur la page)

Toutes issues de `docs/data-canonical/SOURCE_OF_TRUTH_REGISTRY.json`,
repo `parrit-os-signals`, commit `origin/main` au 2026-09-20 (`generated_at`
2026-09-13T11:25:00Z, dernières mises à jour de domaines au 2026-09-16) :

1. Domaine `GTM / contacts_identity` : `legacy_writers` = 11 entrées listées,
   dont une regroupe deux scripts explicitement marqués
   `(INACTIFS, figés par le cliquet)`. `cutover_status: PARITY_FAIL`,
   `parity_status: FAIL`.
2. `parity_evidence` du même domaine : `"cockpit-dual-read.mjs 2026-09-11 : booking LEGACY 252 / CANON 359 / MATCHED 132 / ONLY_LEGACY 114 [...]"`.
3. Domaine `TRANSCRIPTS / transcripts` : un des 6 `legacy_writers`
   est marqué `(timer parrit-rush-pipeline DÉSACTIVÉ, mesuré 11:15Z)`. Domaine
   `CLOSING / next_actions` : l'unique `legacy_writer` est qualifié
   `CONDITIONNEL [...] 0 déclenchement sur 72 h`.
4. `relationship_to_other_registries.guards.parrit-os-signals` :
   `"scripts/source_registry_scan.py --check + supervision/parritos_writer_baseline.json [...] 175 fichiers / 481 sites figés, GROW/CHANGED = échec."` et
   `guards.parrit-super-app` : ratchet équivalent, 30 sites figés.
5. Historique git `parrit-os-signals` (`git log --oneline -- docs/data-canonical/SOURCE_OF_TRUTH_REGISTRY.json`) :
   commit `a2132b2`/`d2dc180` : `"docs(registre) : journal-publish-watcher coupé le 14/09 (décision Paul)"` — exemple réel de décision de fermeture datée et journalisée.
6. Comptage direct du fichier JSON (`python3 -c "import json; ... Counter(...)"`,
   exécuté le 2026-09-20) : `cutover_status` = `{NOT_STARTED: 12, MIGRATING: 8,
   PARITY_FAIL: 4, CUTOVER: 1}` (total 25) ; `split_brain: true` sur 15 des 25
   domaines — deux mesures indépendantes du même jeu de 25 domaines, pas une
   somme à faire concorder entre elles.
