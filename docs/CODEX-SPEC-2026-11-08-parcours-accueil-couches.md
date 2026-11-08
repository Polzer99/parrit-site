# CODEX SPEC — Parcours de l'accueil par couches (inspiré d'Alegria, Studeria, AI Sisters)

Niveau de risque : moyen (ordre et sections de l'accueil). Aucune donnée, aucun prix, aucun envoi, aucun client nouveau.
À lancer **après la fusion de la PR #365** (boutons par intention), sur `origin/main`.

## Décision

Paul, 08/11/2026 : « que le parcours, l'UX, soit optimisé en allant copier les différentes couches présentes chez nos concurrents » (Alegria, Studeria, AI Sisters). Étude : `~/parrit-canon/docs/site-benchmark/ETUDE-CONCURRENTS-2026-11-08.md` et `PARCOURS-CIBLE-ACCUEIL.md`.

## Ordre cible de l'accueil

1. Hero (inchangé : H1, sous-titre, deux boutons de la PR #365)
2. **Références** : la section `#references` (« Ils travaillent avec nous. », logos en défilement) remonte juste sous le hero. Mêmes logos, mêmes contrôles `getSiteEvidence` / `publicationLogo`.
3. **Nouvelle section « Par où commencer »** (ancre `#offres` / `#offers`), trois cartes, chacune un lien `ghost` vers le contact avec sa `source` :
   - **Former vos équipes** : « Des formations pratiques sur vos outils et vos documents, du comité de direction aux équipes métier. » → « Former mes équipes », `intention-formation-offres`
   - **Grands groupes** : « Cadrage, choix des cas d'usage, pilotes et conformité, avec vos directions métier et votre DSI. » → « Parler d'un projet », `intention-grands-groupes-offres`
   - **PME et ETI** : « On part d'un service, on retire ce qui fait perdre du temps, vos équipes gardent la décision. » → « Parler d'un projet », `intention-pme-offres`
   EN : Train your teams / Large companies / SMEs and mid-sized companies, même sens.
4. « Quelques applications concrètes » (inchangé)
5. « Trois étapes » (inchangé, boutons de la PR #365)
6. « Ce que l'IA prépare dans chaque service » (inchangé)
7. Technologies, puis « Chaque projet a son équipe » (inchangés)
8. **Nouvelle section FAQ** (ancre `#questions`), accordéons natifs `<details>` accessibles au clavier, ouverts sans JS lisibles, données structurées `FAQPage` strictement issues du texte affiché, FR/EN :
   1. Par où commence-t-on ? — Par un premier échange de 15 minutes en visioconférence, puis un cadrage écrit, ou un refus motivé si nous ne sommes pas les bons interlocuteurs.
   2. Faut-il des équipes techniques ? — Non. Nous formons vos équipes sur leurs outils, puis nous construisons des assistants qu'elles relisent et valident.
   3. Que deviennent nos données ? — L'IA peut être installée sur vos serveurs, et nous contrôlons l'usage qu'en font vos équipes.
   4. Quelles technologies utilisez-vous ? — Pour chaque besoin, la plus adaptée : ChatGPT, Claude, Gemini, Mistral, Copilot, entre autres, sans dépendre d'un seul fournisseur.
   5. Travaillez-vous avec les grands groupes comme avec les PME ? — Oui. L'équipe se compose selon le diagnostic, parmi plus de vingt partenaires.
   6. Combien cela coûte-t-il ? — Le prix se fixe après le cadrage, selon le périmètre. Nous ne publions pas de grille.
9. **Nouvelle section « Derniers articles »** : les 3 articles les plus récents du Journal (titre, thème s'il existe, temps de lecture, date), une seule action par carte vers l'article, puis un lien vers le Journal. Mêmes composants que l'index du Journal (PR #365).
10. Fondateur et contact (inchangé)

**Retirer** la section « Ce que l'IA change dans votre entreprise » (doublon avec la démonstration). La définition « Un assistant, ou agent IA, … » est conservée : la déplacer en première phrase de « Quelques applications concrètes » (le contrat « le mot agent IA une seule fois » reste vrai). Mettre à jour la navigation : Applications, Offres, Le parcours, Services, Questions, Contact (l'ancre `#references` reste accessible).

## Contraintes

- Brand OS strict, aucun texte inventé hors de cette spec, aucun prix, aucun chiffre nouveau, aucun client hors `public-clients.ts`.
- « Un bloc = un écran », hero à 1440×800, stabilité, réseau deny-all : contrôles inchangés. Mettre à jour uniquement les contrats d'ordre des sections et de navigation, avec la mention « décision de Paul du 08/11/2026 » dans `AGENTS.md` et `TRUTH.md`.
- Anciennes ancres (`#ce-qui-change` / `#what-changes`) : redirection vers `#en-production` / `#in-production` si elles sont liées quelque part.

## Tests

Nouveaux tests FR/EN : ordre des sections, trois cartes d'offres (une action, bonne `source`), FAQ (6 questions, `FAQPage` identique au texte), 3 derniers articles (tri par date, une action par carte). Batterie : `npm ci --silent && npm run lint && npm run build -- --webpack && npm test`. Ne pas committer les PNG réécrits sous `.codex-handoffs/brand-os-p1/after/`.
