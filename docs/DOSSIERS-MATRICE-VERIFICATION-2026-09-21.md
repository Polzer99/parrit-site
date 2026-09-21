# Vérification /dossiers contre la matrice de preuve — 21/09/2026

Demande de Paul (audit funnel/copywriting, suite PR #277/#278, point 5) :
« Rapproche chaque dossier de la matrice actuelle. Documente la correspondance
et le statut dans le dossier interne. Si un cas n'est pas publiable, retire sa
présentation publique. »

## Méthode

Sources consultées : `~/parrit-os/00_CONSOLIDATION_GATE/PROOF_REGISTRY.md`,
`GATE_CLOSURE_REPORT.md`, et `src/lib/registry/preuves.ts` (registre de preuves
du site, déjà retenu comme source de vérité pour /dossiers depuis PR #277).

## Correspondance trouvée

| Dossier public | Contenu actuel avant correction | Correspondance dans la matrice |
|---|---|---|
| 26-001 · Parrit.ai, notre propre système | « Nous vendons le système qui nous fait tourner » | Backé par `/systems` lui-même (registre RegistrySnapshot, vérifié 13/09/2026). Aucune correction nécessaire. |
| 26-002 · Un cabinet d'avocats | « Les premières briques tournent déjà » (refonte intake + relances) | **Aucune entrée du registre ne correspond** à un client "cabinet d'avocats" avec une refonte d'intake/relances en service. Le seul client "avocat" du registre (`client:clevery`, niveau 4) a pour livrable un *bot Telegram de supervision de veille* — un objet totalement différent. Pas de correspondance. |
| 26-003 · Une marque grand public | « Le rapport s'assemble seul, l'équipe du client le fait tourner seule, aujourd'hui » | Aucune entrée du registre ne documente un reporting client autonome en production. Le registre indique explicitement (01/08/2026) : « Aucun niveau 5 » et « aucune métrique client n'est publiable ». Pas de correspondance. |

## Décision (Paul, 21/09/2026, en session)

Question posée : le registre est daté du 01/08 (7 semaines), peut-être
simplement périmé — Paul confirme-t-il l'état réel de 26-002 et 26-003
aujourd'hui ?

**Réponse de Paul : retirer les affirmations non confirmables pour l'instant.**

## Correction appliquée (PR « commercial-honesty »)

Pour 26-002 et 26-003 : le TITRE, le CORPS et le SCEAU sont réécrits pour ne
plus affirmer un état de livraison, d'autonomie ou d'absence de reprise
manuelle. Ils décrivent désormais le **mandat commandé** (ce qui a été demandé),
jamais un résultat atteint. Le sceau des deux passe à « Commandé »/« Commissioned »
— le seul fait que la page peut honnêtement afficher sans confirmation
supplémentaire, cohérent avec le kicker de la page elle-même (« Des systèmes
commandés par... »).

26-001 n'est pas touché : c'est le système interne de Parrit.ai, vérifiable
directement sur `/systems`, pas un cas client à confirmer.

## Suite

Si Paul confirme plus tard l'état réel de 26-002 et/ou 26-003 avec une source
vérifiable (capture, retour client écrit, mesure), le texte peut être renforcé
à nouveau — mais jamais avant cette confirmation explicite, conformément au
réflexe 5 (engagements clients, jamais sans Paul).
