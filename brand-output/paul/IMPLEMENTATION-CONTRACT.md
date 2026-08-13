# CONTRAT D'IMPLÉMENTATION — paul-larmaraud.com

**Gate M1.** Établi le 12/08/2026, avant écriture de code visuel.
**Source visuelle qui fait foi :** Figma `Zs3WuVBkAT9Iq6S9c3XsYG`,
page `V2 — PAUL LANDING — ASSISTANT CONCEPT`, frames `166:13` (desktop 1440) et `171:2` (mobile 390).
**Source de copy :** la même maquette, alignée sur la page `V2 — COPY V6 — SIMPLE + CTA` (`141:2`).

Le code reproduit la maquette. Il ne s'en inspire pas.

---

## 1. Tokens, relevés dans Figma et non inventés

Chaque valeur ci-dessous a été lue sur le frame `166:13`.

| Rôle | Valeur | Où |
|---|---|---|
| Surface principale | `#F8F7F3` | fond de page, hero, transformation, preuves |
| Surface secondaire | `#EEEEEA` | section offre, panneau du hero |
| Surface profonde | `#0E1117` | méthode, CTA final, pied de page |
| Blanc | `#FFFFFF` | carte de prix, CTA sur fond sombre |
| Encre | `#11131A` | titres, texte fort |
| Encre atténuée | `#5C616E` | chapôs, corps secondaires |
| Action | `#2E4DC2` | CTA, surtitres, puces, chiffres |
| Action survol | `#24409F` | ajouté, absent de la maquette statique |
| Teinte d'action | `#E3E8FC` | carte « après », transition, garantie |
| Trait | `#D1D0C9` | filets, contours de cartes |

Typographie : **Instrument Sans**, graisses 400 / 500 / 600. Servie par `next/font`, donc
auto-hébergée : aucune requête vers Google au chargement.

Rayons : 8 · 9 · 10 · 18 px. Grille : conteneur 1280, gouttière 80 en desktop, 20 en mobile.
Rythme vertical des sections : 104 px en haut, 112 en bas ; 64 px en mobile.

## 2. Les sections, dans l'ordre

Sept sections dans la maquette. Une huitième a été ajoutée, la FAQ, et c'est le seul écart
structurel — motivé plus bas.

| # | Section | Fond | Prix | CTA |
|---:|---|---|---|---|
| 1 | Hero, avec le panneau « vous arrivez avec / vous repartez avec » | `#F8F7F3` | **interdit** | oui |
| 2 | Transformation, avant et après | `#F8F7F3` | interdit | non |
| 3 | Méthode Parrit.ai, trois étapes | `#0E1117` | interdit | non |
| 4 | Résultats concrets | `#F8F7F3` | interdit | non |
| 5 | Offre | `#EEEEEA` | **oui, ici seulement** | oui |
| 6 | Questions | `#F8F7F3` | rappel autorisé | non |
| 7 | CTA final | `#0E1117` | interdit | oui |

**La FAQ, section 6, est un ajout.** Trois raisons : elle traite les objections qui restaient sans
réponse après l'offre, elle produit un balisage `FAQPage` que les moteurs de réponse citent
directement, et elle tient l'engagement du brief — « toute section doit répondre à une objection ou
augmenter le désir ». Elle est placée **après** l'offre, jamais avant.

## 3. Les invariants, vérifiés automatiquement

`scripts/qa-shots.mjs` échoue si l'un de ces points cède, aux cinq largeurs 1440, 1280, 768, 390, 375 :

- le prix apparaît **avant** la section offre ;
- un second libellé de CTA apparaît quelque part ;
- la page déborde horizontalement ;
- un CTA descend sous 40 px de hauteur ;
- il y a autre chose qu'un seul `h1`.

Le CTA est unique et non négociable : **« Réserver mon audit offert »**, vers
`https://calendar.app.google/kkpaNisBa78BuuAj8`, créneau de 15 minutes. Il apparaît quatre fois,
en 1, 5, 7 et dans l'en-tête. Quatre rappels d'une seule porte, pas quatre portes.

Prix : **2 499 € HT**, jamais 2 500. Garantie : satisfait ou remboursé après la première heure.

## 4. Les preuves — la décision la plus lourde de cette tranche

La maquette affiche quatre noms de clients : JOONE, LAPARRA, CLEVERY AVOCATS, FOREXPERT.

**FOREXPERT est retiré.** Aucune source primaire ne documente ce dossier ; l'inventaire de preuves
l'avait déjà classé inutilisable. Publier une ligne sans source, c'est exactement la condition
d'échec « preuves non validées ».

**Les trois autres sont affichés, et c'est une décision qui reste ouverte.** Elle repose sur la
précédence posée par le MASTER RESET, qui place la maquette validée et la Copy V6 au-dessus du canon
de preuve. Mais la règle d'or §6 interdit d'afficher un nom de client publiquement, et la Copy V6
elle-même porte la réserve « soumises à l'accord des clients ». **Cet accord n'est documenté nulle
part.**

Trois garde-fous ont donc été posés :

1. Les trois lignes décrivent un **travail réalisé**, jamais un résultat. Aucun chiffre, aucun
   pourcentage, aucun gain de temps, aucun retour sur investissement.
2. Un interrupteur existe : `proof.named` dans `src/content/landing.ts`. À `false`, les trois cartes
   passent en descripteurs de secteur — cabinet de gestion, PME industrielle, cabinet d'avocats — et
   la page reste vraie. Le basculement prend dix secondes.
3. **L'indexation est fermée tant que le domaine canonique ne répond pas.** Les noms ne sont donc
   publics qu'au moment où Paul branche le DNS, pas avant.

**C'est un gate pour Paul, pas une décision technique.** Trois accords écrits, ou l'interrupteur à
`false`.

## 5. Écarts assumés par rapport à la maquette

| Écart | Pourquoi |
|---|---|
| FAQ ajoutée en section 6 | objections non traitées, et balisage lisible par les moteurs de réponse |
| FOREXPERT retiré | aucune source primaire |
| CTA de l'en-tête resserré sous 780 px | il passait sur deux lignes et écrasait la barre. Le **libellé ne change pas**, seule la barre se resserre |
| Couleur de survol du CTA | une maquette statique n'a pas d'état de survol |
| Ancres `#methode`, `#resultats`, `#offre` | la navigation de la maquette ne pointait nulle part |

## 6. Ce que la page ne fait pas, et ne doit jamais faire

Aucune popup, aucun aimant à prospects, aucune inscription à une newsletter, aucun second CTA,
aucun agent conversationnel, aucun simulateur de prix, aucun compte à rebours, aucun nombre de
places restantes, aucun logo client, aucun témoignage.

Le mot « autonome » n'apparaît pas comme résultat prouvé ni comme propriété d'un système.

## 7. Ce qui a été bâti pour la suite, sans l'afficher aujourd'hui

- **Un emplacement média par section.** Remplir `media` dans `src/content/landing.ts` insère une
  vidéo — YouTube, Vimeo ou fichier — sans toucher au layout.
- **Un blog file-based.** Un fichier Markdown dans `src/content/posts/` crée l'article, l'entrée de
  liste, le sitemap, la ligne dans `llms.txt` et le lien du pied de page. Zéro article publié à ce
  jour : la voix publique de Paul ne s'écrit pas sans lui.
- **`/llms.txt`**, généré depuis le même contenu que la page. Rien à tenir en double.
- **Données structurées** `Person`, `Service` avec le prix, `FAQPage`, `WebSite`, `BlogPosting`.
- **PostHog**, inerte tant que `NEXT_PUBLIC_POSTHOG_KEY` est absent. Événements :
  `audit_cta_clicked`, `audit_booking_opened`, `scroll_50`, `scroll_90`.
