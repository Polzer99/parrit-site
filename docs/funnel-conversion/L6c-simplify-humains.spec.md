# Spec L6c — Simplifier la home + l'incarner : Paul en vrai, le réseau, les équipes hybrides

*Repo : parrit-site. Suite et fin du stopgap identité (après L6/L6b). Directives de Paul : « upgrade et simplifier, que ça reflète qui on est profondément » · « C'est Paul, il faut une vraie photo, pas une photo IA » · « mettre en avant le réseau d'une vingtaine de partenaires, des équipes hybrides, l'objectif est de rendre autonomes nos clients ».*

## Périmètre (STRICTEMENT `src/components/HomeDeux.tsx` + tests)

### 1. Le bloc « Qui est derrière » devient « Paul + le réseau »
- **Retirer Yukun de la home** (sa carte reste sur `/fondateurs`, page intouchée).
- **Photo de Paul = la vraie** : `/team/paul-reel.jpg` (asset déjà présent sur main — photo réelle, PAS générée). Ne plus référencer `/team/paul-portrait.jpg` sur la home.
- Copy du bloc (FR, adapter sobrement aux 4 langues) :
  - Titre : « Qui est derrière »
  - Paul Larmaraud — fondateur. Une ligne : « Il a déjà déployé pour de vrai, et il vous dira la vérité sur ce qui marche. »
  - **Le réseau** : « Autour de lui, un réseau d'une vingtaine de partenaires experts. Ensemble, on forme des équipes hybrides : vos équipes, nos experts, et les agents. »
  - **L'objectif** : « Un seul objectif : vous rendre autonomes. »
  - Lien conservé : « Rencontrer les fondateurs → /fondateurs ».
- Pas de tiret cadratin, pas de jargon.

### 2. Simplifier la page (9 sections → 6)
- **SUPPRIMER la section « Launches »** (build-in-public) de la home.
- **SUPPRIMER la section « Cas d'usage » (renvoi blog)** — doublon avec le catalogue.
- **Resserrer le catalogue à 4 cartes** (garder : Acquisition signal-first · Capture multicanal · Facturation & suivi · Formation agentique — supprimer les 4 autres). Les cartes restent « fonction + résultat », sans persona (L6b).
- Ordre final : Hero → Sur le terrain → Qui est derrière (Paul + réseau) → Input→Output → Catalogue (4) → Offres → CTA final.

### 3. Rien d'autre
- Hero, CTA (diagnostic de faisabilité / Parler à Paul), terrain, input→output, offres, camps/déclic, pages hors HomeDeux : INTACTS.
- Supprimer le code mort des sections retirées (props/types/DICT inutilisés) proprement dans les 4 langues.

## Critères d'acceptation
- La home n'affiche plus Yukun ni `/team/paul-portrait.jpg` ; elle affiche `/team/paul-reel.jpg`.
- Le copy réseau/équipes hybrides/autonomie est présent dans les 4 langues.
- Sections Launches et Cas d'usage absentes ; catalogue = 4 cartes.
- `npm run lint` + `npm run build` verts ; tests Playwright adaptés verts (adapter `home-identity.spec.ts` : vérifier photo réelle + absence des sections coupées).
- Diff limité à `HomeDeux.tsx` + tests + cette spec.

## Contraintes
- Lire `AGENTS.md` + `TRUTH.md`. Copy sobre, zéro tell IA. Traductions : EN « Around him, a network of about twenty expert partners. Together we form hybrid teams: your people, our experts, and the agents. One goal: making you autonomous. » ; décliner pt-BR/zh-CN.
- Modifs minimales, WIP préservé, aucun secret, aucune image générée.
