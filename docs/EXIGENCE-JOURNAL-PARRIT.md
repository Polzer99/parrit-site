# EXIGENCE-JOURNAL-PARRIT — la barre du rail parrit.ai

> v4 — 2026-09-13 (cliquet dimanche : référence de la semaine + slugs
> des références mis à jour après le passage en anglais + trois défauts
> promus du registre + premiers tics répétés bannis sur ce rail).
> v3 — 2026-09-06 (cliquet dimanche : référence de la semaine +
> discipline chiffres externes non recoupés).
> v2 — 2026-08-30 (cliquet dimanche : ajout référence de la semaine).
> v1 — 2026-08-29. Ce fichier est un cliquet : le run du dimanche
> l'augmente par PR docs, il ne descend jamais. Le moteur le lit à
> chaque run qui publie sur parrit.ai.

## La base (v1)

- **Langue** : anglais. Prose structurée en H2. Zéro liste à puces,
  zéro tiret cadratin, zéro mojibake (portes machines).
- **Voix** : « we ». Une position tranchée dans chaque section. La
  vision Parrit reprise sans devenir un pitch : agnostique par design,
  posséder le substrat, déployer la chose qui tourne.
- **Spécificité** (Paul, 29/08) : la question est une vraie question
  d'utilisateur, et la réponse contient ce que NOUS faisons réellement.
  Une généralité publiable par n'importe quel blog est un refus.
- **Interdits durs** : noms de clients et de tiers (porte machine),
  prix, chiffre non vérifié en ligne, matière personnelle, matière de
  RDV dans la fenêtre de carence de 7 jours, article qui échoue au
  test « c'est moi ».
- **Slug** = le sujet. Jamais de date, jamais de préfixe `journal-`.

## Références à égaler ou dépasser

Slugs mis à jour le 13/09 : les entrées françaises ont reçu un slug
anglais le 08/09 (PR #241, 301 en un saut depuis l'ancien slug).

- `glm-5-2-sovereignty` (ex `glm-5-2-souverainete`) — analyse
  chiffrée, sourcée, avec un mode d'emploi concret en trois voies.
- `the-draft-that-knows-when-to-stay-silent` (ex
  `le-brouillon-qui-sait-se-taire`) — savoir refuser d'écrire ; le
  silence comme sortie utile.
- `publishing-without-human-review` (ex `publier-sans-relecture-humaine`,
  29/08/2026, premier article du rail) — la doctrine du moteur lui-même
  mise en prose : des portes qui savent refuser plutôt qu'un humain qui
  approuve, la discrétion posée comme porte et non comme habitude, la
  boucle qui referme sur la vision Parrit sans jamais citer de client ni
  de chiffre inventé.
- `what-a-rollback-takes-with-it` (03/09) — matière vécue le jour même
  (incident de déploiement réel), aucun tiers, aucun chiffre : la
  généralité qu'aucun autre blog n'aurait pu écrire parce qu'elle sort
  d'un fait daté, pas d'une thèse.
- `self-hosting-latency-cost` (10/09, référence de la semaine du 07 au
  11/09) — l'article qui argumente contre notre propre intérêt apparent :
  nous défendons l'hébergement chez le client, et le texte chiffre ce
  que ça coûte (l'attente avant le premier mot) au lieu de le taire.
  Chaque nombre est tenu par deux sources (seuils de Nielsen, vitesse de
  lecture de Brysbaert, ratio du tokenizer, définitions TTFT/ITL de
  vLLM et NVIDIA), et le mécanisme technique a été revérifié en ligne
  comme un chiffre après que le panel l'a trouvé à l'envers. La demande
  au lecteur est trois mesures qu'il prend seul avec un chronomètre.
  L'aphorisme a été refusé en H1 et gardé pour la chute. Préféré à
  `computer-use-what-it-can-undo` (08/09), très solide aussi, parce
  qu'il met notre position à l'épreuve au lieu de la confirmer.

## Discipline chiffres externes (cliquet 06/09)

- Deux articles de la semaine (31/08 → 01/09) ont écarté ou neutralisé
  des chiffres trouvés en veille faute de recoupement suffisant :
  `ai-act-compliance-register` a rejeté le « 78 % non conformes » du
  mail de veille (une seule source, non recoupée) ; `frontier-as-
  fallback` a neutralisé deux chiffres rhétoriques avant publication.
  Ce comportement devient une règle explicite, pas seulement un bon
  réflexe : **un chiffre externe cité dans un article parrit.ai exige
  au moins deux sources indépendantes qui se recoupent**, sans quoi il
  est reformulé en position qualitative ou retiré.

## Défauts promus du registre (cliquet 13/09, trois occurrences ou plus)

Mêmes règles que sur le rail paul-larmaraud.com : la structure empêche
en amont ce que le panel attrapait en aval.

- **Borrowed number** (`borrowed_number`, 07/09, 09/09, 10/09 sur deux
  tours) : an illustrative figure never coincides with a factual figure
  in the same article. Before the panel, list EVERY number in the text
  in one sweep. Fixing a collision sentence by sentence moves it instead
  of removing it (`self-hosting-latency-cost`, 10/09 : « four seconds
  per item » against « four words a second », then « waits behind four
  others » reopening the same collision).
- **Scope kept with the source** (`overclaimed_stat` 09/09,
  `scope_stretch` 11/09 twice) : a figure keeps its subgroup and a
  quotation keeps its scope INSIDE the sentence that cites it. Any
  extension to another audience or product is ours, signed, in a
  separate sentence.
- **Behavioural absolutes** (`absolute_none`, 09/09, 10/09, 11/09) :
  « nobody », « always », « never », « everyone » applied to what people
  do are replaced by a stated frequency or cut. Précédent : « nobody in
  the building is going to lower it », relevé par deux lecteurs du panel
  le 10/09.

## Tics bannis

- (un seul article publié sur ce rail la semaine du 29/08 — rien de
  répété à bannir sur cette période. Semaine du 31/08 au 05/09 (4
  articles) : aucune formule de clôture ou charnière recopiée d'un
  article à l'autre relevée à ce stade — à revérifier plus finement au
  prochain dimanche sur un corpus plus large.)
- **Cliquet 13/09, relecture du texte complet des trois articles du
  07 au 10/09** (`multi-provider-redundancy`, `computer-use-what-it-
  can-undo`, `self-hosting-latency-cost`) :
- **Le titre de la section-demande au même gabarit** : « The test to
  run this week », « The list to make this week », « Three measurements
  to take this week », trois articles d'affilée. La demande au lecteur
  reste obligatoire (critère de retour du panel depuis le 08/09) ; son
  H2 ne se construit plus sur « … this week », et deux articles
  consécutifs ne titrent pas leur demande sur le même moule.
- **« rather than » en charnière réflexe** : six occurrences dans
  `multi-provider-redundancy`, quatre dans `computer-use-what-it-can-
  undo`. Deux au plus par article ; au-delà, c'est une mécanique de
  contraste qui remplace l'argument.
- **L'autonomie commentée au lieu d'être montrée** : « it does not
  require buying anything or talking to us » (08/09), « No purchase
  order, no pilot, no vendor in the room » (10/09), et le même geste en
  français le 09/09 sur le rail paul. La porte de fond exige que le
  lecteur reparte plus capable ; elle n'exige pas qu'on le lui dise.
  Formule gelée sur les deux rails.
- **La chute en diptyque antithétique** : « Capability arrives on a
  release date. Permission is something you write down. » (08/09) puis
  « Sovereignty is worth a wait. It is not worth an unmeasured one. »
  (10/09). Deux articles consécutifs ne ferment pas sur la même forme
  (deux phrases courtes qui s'opposent terme à terme) ; la phrase-slogan
  unique en chute reste permise, sa forme doit changer.
- **« honest / honestly » en auto-certification** : deux ou trois
  occurrences dans chacun des trois articles (« the honest version of
  that argument », « answer honestly », « dishonest to state more
  precisely »). Une au plus par article : l'honnêteté se lit dans la
  source citée, pas dans l'adjectif.
