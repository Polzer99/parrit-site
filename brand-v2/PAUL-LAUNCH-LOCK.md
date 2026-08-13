# VERROU DE TRANCHE — lancement paul-larmaraud.com

**Ouvert le :** 12/08/2026 · **Propriétaire :** session Claude Code `68ce6077`
**État :** ouvert, en attente du gate humain M2

---

## Ce qui est verrouillé, et ce qui ne l'est pas

Le constat de départ imposait la prudence : **22 worktrees sur `parrit-site`**, dont deux dépôts
Codex actifs, **huit processus `claude` en parallèle**, un serveur `next dev` en cours, et un
worktree `parrit-site-ds` sur `ds/visual-reset-v2` qui travaille la direction visuelle de
parrit.ai. Quelques heures plus tôt, une autre session avait supprimé huit pages Figma
construites par celle-ci.

**Décision : ne rien verrouiller, tout déplacer.** Le site de Paul est construit dans un dépôt
neuf, `~/paul-larmaraud-site`, qui n'a aucune intersection de fichiers avec `parrit-site`. Il n'y
a donc pas de writer concurrent à suspendre, et aucun processus n'a été tué.

C'est plus solide qu'un verrou : un verrou est une convention que rien n'applique, une séparation
de dépôt est une frontière réelle.

| Surface | Périmètre | Qui écrit |
|---|---|---|
| `~/paul-larmaraud-site` | tout le site | cette session, exclusivement |
| `parrit-site/brand-output/paul/` | contrat, graphe, DNS | cette session |
| `parrit-site/brand-v2/` | artefacts de la tranche V2 | cette session |
| `parrit-site/docs/brand-v2/` | canon de marque relu par les agents | cette session |
| Figma, page `172:2` | page finale de Paul | cette session |
| Figma, toutes les autres pages | — | **personne, en lecture seule ici** |
| `parrit-site/src/` | site parrit.ai | **pas touché** |

## Ce qui n'a pas été touché, volontairement

- Aucune branche de `parrit-site` n'a été créée, ni mergée, ni poussée.
- Les 36 fichiers modifiés qui traînaient sur `brand-lab-v1` sont restés tels quels.
- Aucun worktree n'a été supprimé, y compris les 15 marqués `prunable`.
- Aucun processus n'a été arrêté.
- Aucune page Figma existante n'a été modifiée ou supprimée.

## Reprise

Rien à déverrouiller. La tranche se poursuit par le gate M2, décrit dans
`brand-output/paul/STATUS.md`.

Si une autre session doit intervenir sur `paul-larmaraud.com`, l'unique règle est celle qui manquait
partout ailleurs : **relire l'état réel avant d'écrire**, et pour Figma, relire
`figma.root.children` juste avant, jamais un inventaire vieux de quelques minutes.
