# HOMEPAGE-LEVEL0-V1

**Tranche du 31 juillet 2026.** Premier écran commercial de la homepage française, derrière feature flag.
**État : implémentée, testée, non exposée.** Le flag est éteint par défaut.

---

## Problème initial

Le hero de `/fr` demandait au visiteur de choisir une porte commerciale avant de lui avoir montré quoi que ce soit : deux boutons de poids équivalent, « Réserver un diagnostic de faisabilité » et « Parler à Paul ». Aucune preuve n'apparaissait avant plusieurs sections de discours.

C'est la première friction relevée dans `brand/10_SITE_AUDIT_CURRENT.md` et reprise dans `08_CONVERSION_PATTERNS.md` : *le visiteur ne choisit pas d'abord une offre, il reconnaît d'abord un workflow douloureux.*

## Périmètre

**Dans la tranche :** le hero de `/fr`, le rail de preuve qui le suit immédiatement, le fond du variant, un CTA principal unique, l'instrumentation, le flag.

**Hors tranche, volontairement intact :** tout le reste de la homepage (terrain, équipe, input/output, catalogue, offres, newsletter, CTA final), la navigation, le footer, les trois autres langues, la page contact, les cas clients, les sections Hermès plus bas, `globals.css` au-delà d'un bloc scopé, la migration des anciens tokens.

## Décisions

| Décision | Raison |
|---|---|
| Hero **sans média**, définitivement | Le canon Figma lui-même est un hero sans photographie. Aucun emplacement n'est réservé pour une image future : le hero doit être valide tel quel. Le portrait reste autorisé ailleurs sur le site, pas ici. |
| **Un seul** CTA de poids principal | Supprime la double porte. Le lien secondaire est un lien texte, pas un second bouton plein. |
| Surcharge de **composition** du rythme vertical | Le rythme par défaut repoussait la preuve sous la ligne de flottaison. Les tokens canoniques ne sont pas modifiés : ils sont redéfinis par la cascade sur `.home-level0` uniquement. |
| Preuves **sans aucun chiffre** | La matière vérifiable manque. Trois workflows réels, déjà publiés, avec leur périmètre négatif, valent mieux qu'une métrique inventée. |

## Copy retenue

**Badge** : `Agents en production`

**H1** : « D'une IA qui parle à des agents qui **exécutent.** »

Part de la formulation canonique de `brand/03_CONTENT_SYSTEM.md` (« Passez d'une IA qui parle à des agents qui exécutent »). Ajustement : suppression de « Passez de », qui allongeait la ligne sans rien ajouter, et resserrement pour la lecture mobile. **Le sens est inchangé.**

**Chapô** : « **Vous décrivez une tâche qui vous coûte du temps.** On définit l'entrée, la sortie, le périmètre et le propriétaire humain, puis on met le système en production avec vos équipes. »

Répond aux quatre questions : ce que fait Parrit, dans quel contexte, en quoi c'est différent d'un assistant conversationnel (entrée, sortie, périmètre, propriétaire), et quelle est la prochaine action.

**Bandeau de conditions** : `Périmètre défini · Accès encadrés · Trace d'exécution · Propriétaire nommé`
Repris mot pour mot de la ligne de preuve de `brand/03_CONTENT_SYSTEM.md`.

**Cible.** La posture n'est pas expliquée dans le hero, elle le guide. Aucune formulation du type « pour toutes les entreprises » ou « transformez votre entreprise grâce à l'IA ».

## Preuves utilisées

Trois couples `input → output`, **déjà publiés** sur la homepage actuelle (bloc « Input → Output » de `HomeDeux`, `DICT.fr.io.cases`). Ils sont donc validés et en ligne, pas inventés pour l'occasion.

| Input | Output | Propriétaire | Périmètre |
|---|---|---|---|
| Un CRM rempli à la main | Un CRM à jour tout seul | l'équipe commerciale | l'agent propose, personne n'écrit sans validation |
| Des sources de veille éparpillées | Un mail, chaque matin | le dirigeant | lecture seule, aucun envoi automatique |
| Des devis tapés un par un | Des devis prêts en un clic | l'administration des ventes | brouillon uniquement, la signature reste humaine |

**Aucun chiffre, aucune durée, aucun nom de client.** Le périmètre dit ce que l'agent **ne fait pas** : c'est la promesse opératoire du canon, et elle se vérifie, contrairement à une métrique. Aucune expérimentation n'est présentée comme un déploiement client. La formule « un agent déployé en une journée » n'apparaît nulle part.

Le rail est **lisible sans logo ni image** : il n'en contient aucun.

## CTA

**Principal** : « Décrire un workflow » → `/diagnostic?source=home-level0`.
La route existe et le parcours est implémenté. Le libellé est orienté workflow concret, pas promesse vague.

**Secondaire** : « Voir des exemples » → `#catalogue-agents`, ancre existante de la même page. Besoin distinct, poids visuel volontairement faible (lien texte souligné en gris).

## Feature flag

| | |
|---|---|
| **Emplacement** | `src/lib/flags.ts`, fonction `isHomepageLevel0Enabled(lang)` |
| **Variable** | `NEXT_PUBLIC_HOMEPAGE_LEVEL0_V1` |
| **Valeur par défaut** | **éteint**. Toute valeur autre que `1` laisse le variant désactivé. |
| **Activation** | `NEXT_PUBLIC_HOMEPAGE_LEVEL0_V1=1`, puis build |
| **Rollback** | retirer la variable ou la passer à `0`, puis build |
| **Routes affectées** | `/fr` uniquement. Le garde `lang !== "fr"` est dans la fonction elle-même : même avec la variable active, les autres langues ne peuvent pas basculer. |

**Limite assumée.** Le flag est lu au build, pas au runtime. Lire `searchParams` ou un cookie ferait basculer `/[lang]` du rendu statique au rendu dynamique, pour les quatre langues, au bénéfice d'un seul variant. La bascule demande donc un redéploiement. Vérifié : `/[lang]` reste marqué `●` (SSG) dans les deux états du flag.

## Analytics

Réutilise `src/lib/analytics.ts` et PostHog, déjà en place. **Aucune nouvelle base, aucun nouveau service, aucune donnée personnelle supplémentaire.**

| Événement | Déclencheur | Propriétés | Finalité | Critère associé |
|---|---|---|---|---|
| `homepage_level0_view` | montage du variant, **une seule fois** | `variant`, `route`, `locale` | dénominateur de tous les autres taux | exposition réelle |
| `homepage_level0_primary_cta_click` | clic sur le CTA principal | + `label`, `destination`, `element` | mesurer la porte unique | taux de clic vers le diagnostic |
| `homepage_level0_secondary_link_click` | clic sur le lien secondaire | + `label`, `destination`, `element` | vérifier qu'il ne cannibalise pas | doit rester très inférieur au principal |
| `homepage_level0_proof_interaction` | rail de preuve visible à 50 % | + `element`, `interaction` | la preuve est-elle atteinte | part des visiteurs qui voient la preuve |
| `homepage_level0_scroll_to_next_section` | fin du variant visible à 50 % | + `element` | le premier écran donne-t-il envie de continuer | part qui dépasse le premier écran |

Chaque événement hérite en plus de `page`, `lang` et de l'attribution, ajoutés par `track()`.

**Contrôles de déclenchement.** L'événement de vue est protégé par une `ref` : un nouveau rendu React ne le rejoue pas. Les deux événements de scroll passent par un `IntersectionObserver` avec un verrou par événement. Les clics passent par **un seul** écouteur délégué sur la racine du variant, pas par un handler par élément.

## Composants

**Réutilisés sans duplication** : `HeroLevel0`, `ProofRailLevel0`, `Label`, `IndexMark`, `SectionHeader`, `Badge`, et les tokens de `src/styles/parrit-tokens.css`.

**Trois extensions rétrocompatibles** apportées aux composants canoniques, toutes optionnelles et sans changement de comportement par défaut :

1. `HeroLevel0.secondaryLink` — lien texte discret, distinct de `secondaryCta` qui reste un bouton. Nécessaire pour supprimer la double porte sans perdre le besoin secondaire.
2. `HeroLevel0.primaryCtaProps` / `secondaryLinkProps` et `ProofRailLevel0.itemProps` — attributs `data-*` pour l'instrumentation, sans coupler le design system à l'analytics.
3. `ProofRailLevel0` accepte `index`, `label`, `title`, `lede`. Les valeurs par défaut sont celles du specimen, qui est donc inchangé.

**Une correction de fond** dans `ProofRailLevel0` : le propriétaire et le périmètre étaient rendus dans un `Label`, qui est `nowrap` par contrat (« jamais plus d'une ligne »). Une phrase dans un `Label` produit un débordement horizontal en mobile. Le libellé reste un `Label`, la valeur devient du texte courant qui se replie. Corrige un bug réel trouvé à 375 px.

## Fond

Le variant porte `.parrit-grain` (papier `#FFFDFA` plus grain trois couches) et une règle scopée `body:has(.home-level0)` qui neutralise tout fond narratif global.

**Constat à corriger dans l'audit précédent.** `STATUS.md` affirmait que la production servait une photo de paysage sur toutes les pages. **C'est faux pour la homepage.** Mesuré le 31/07 : `/fr` et `/en` ont `background-image: none`, parce que la règle existante `body:not(:has(.home-template))` la neutralise déjà, et que la home pivot ne porte pas cette classe. La photo est bien active, mais sur les pages qui portent `.home-template`, comme `/fr/deployer`.

La règle ajoutée ici est donc une **garantie**, pas un correctif : elle ne change rien de visible sur `/fr` aujourd'hui, et elle empêche toute réintroduction. Le retrait réel du fond photo concerne les pages offres et reste hors périmètre.

## Captures

`docs/design-system/qa/homepage-level0/`

`level0-375.png` · `level0-768.png` · `level0-1024.png` · `level0-1440.png` · `proof-rail-1440.png` · `focus-1440.png` · `control-1440.png` (variant désactivé).

## Tests

Harnais : `scripts/homepage-level0-qa.mjs`. Sortie non nulle si un test échoue.

| Test | Résultat |
|---|---|
| `npm run lint` | 0 erreur, 0 warning |
| `npx tsc --noEmit` | 0 erreur |
| `npm run build`, flag éteint **et** allumé | vert, `/[lang]` reste SSG dans les deux cas |
| Five Second Test | activité, nature opérationnelle, CTA et preuve identifiables sur la capture |
| Structural Integrity | 0 média dans le variant, aux 4 largeurs |
| Red Causality | 1 segment rouge, « exécutent. » |
| CTA Hierarchy | 1 action de poids principal, 1 lien secondaire |
| French Typography | Arpona, interligne 1.08, marge 1,85 px à 375 px, 3,02 px à 1440 px |
| Responsive | aucun débordement, aucune taille sous 12 px, aux 4 largeurs |
| Accessibilité | 1 seul H1, hiérarchie `1 > 2`, focus clavier visible |
| Contraste | `contrast-audit.py` sur `/fr` et `/design-system` : TOTAL = 0 |
| Rollback | flag éteint : variant absent, ancien hero restauré, `/en` et `/pt-BR` inchangés |
| Analytics | 1 vue exactement, 5 événements au total, aux 4 largeurs |
| Non-régression design system | `ds-specimen-qa.mjs` passe aux 4 largeurs |

### Le rôle du rouge, documenté

Le segment rouge est **« exécutent. »**. Il porte la **transformation** annoncée par la phrase : le passage de l'IA qui parle à l'agent qui agit. C'est la causalité centrale de la promesse, pas un mot mis en valeur pour le rythme. Le titre garde tout son sens lu entièrement en noir. Conforme à ADR-012.

## Critères de succès

| Critère | État |
|---|---|
| Promesse comprise en moins de cinq secondes | à valider par un test à froid sur trois personnes hors contexte, **non fait** |
| CTA principal identifiable | ✅ une seule action de poids principal, mesuré |
| Preuve visible sans scroll excessif | ✅ à 1440x900 le rail commence à 711 px, à 1024x768 à 688 px. ⚠️ à 375x812 il commence à 905 px, soit un scroll court |
| Page reconnaissable sans image | ✅ le variant ne contient aucun média |
| Aucune régression responsive | ✅ aux 4 largeurs |
| Rollback immédiat | ✅ bascule du flag, vérifiée |

## Méthode de rollback

1. Retirer `NEXT_PUBLIC_HOMEPAGE_LEVEL0_V1` de l'environnement, ou la passer à `0`.
2. Rebuild.

Effets vérifiés : le variant disparaît de `/fr`, le hero historique et ses deux CTA reviennent, la règle de fond scopée cesse de s'appliquer faute de correspondance, aucune autre langue et aucune autre section n'est touchée. Aucun fichier n'est à modifier.

## Écarts connus

- **Numérotation.** Le rail de preuve est rendu **sans numéro d'index**, parce que la section « Sur le terrain » juste en dessous porte déjà « 01 » et n'est pas dans le périmètre. Renuméroter la page entière viendra avec la tranche suivante.
- **Couture visuelle.** Sous le variant, la homepage historique reprend avec sa propre direction artistique. Les deux se succèdent sans transition dessinée. C'est le prix d'une tranche fine, et c'est assumé.
- **Preuve sous la ligne de flottaison en mobile** : 905 px à 375x812. Un hero complet et une preuve sur un même écran de téléphone n'est pas réaliste.
- **CSS mort.** Les règles `.hd-hero` restent dans la feuille de style quand le variant est actif. Aucune conséquence visuelle, nettoyage à la dépose du flag.
- **Flag au build**, pas au runtime. Voir la section Feature flag.

## Explicitement reporté

Renumérotation des sections · transition entre le variant et le reste de la page · traduction du variant dans les trois autres langues · retrait du fond photo sur les pages `.home-template` · migration des alias de `globals.css` · portrait du fondateur dans une section d'incarnation · test à froid des cinq secondes.
