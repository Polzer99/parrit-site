# DÉCISIONS DE SITE — paul-larmaraud.com

`ACTIVE` · 13/08/2026
Dépôt : `~/paul-larmaraud-site`. Le site est en production.

---

## Le hero, dans l'ordre

```
ACCOMPAGNEMENT INDIVIDUEL · 10 HEURES

Mettez fin au chaos.
Retrouvez la clarté.

Appliquez l'IA à un problème réel de votre entreprise, directement avec Paul.

En 10 heures, vous choisissez le problème qui vous coûte le plus, vous voyez une
première solution tourner sur votre travail réel, et vous repartez capable de continuer.

[ Réserver mon audit offert ]   15 min avec Paul · sans engagement
```

**Le titre porte l'émotion, la ligne descriptive porte la compréhension.** Toucher au titre pour
le rendre explicite l'aplatit ; c'est la ligne du dessous qui doit répondre à l'objection
« je ne comprends pas ce que tu fais ».

Le prix est interdit dans le hero. Deux lignes d'environ vingt caractères pour le titre : au-delà,
il passe à trois lignes et écrase le premier écran.

## L'ordre des sections

1. Hero
2. Transformation, avant et après, puis l'affirmation
3. **Pourquoi Paul** — la crédibilité précède la méthode, sinon la méthode n'a pas d'auteur
4. La méthode Parrit.ai, trois temps
5. Des résultats concrets
6. L'offre — **le seul endroit où le prix existe**
7. Questions
8. Conversion

## Les règles qui ne se négocient plus

**Vocabulaire visuel.** Un élément non cliquable ne ressemble jamais à un bouton, à un champ de
saisie ou à une carte interactive. Les listes de douleurs et de résultats sont des listes, pas des
pastilles. Le CTA se répète, mais reste le seul objet à porter l'apparence du cliquable.

**Accessibilité.** Plancher absolu de 14 px sur tout texte visible, 16 à 18 px pour le corps.
Contraste AA. Focus visible sur tout élément interactif.

**Un seul CTA, et un seul VISIBLE à la fois.** « Réserver mon audit offert », même destination,
même dessin, partout. Aucune action concurrente : ni newsletter, ni aimant à prospects, ni démo,
ni second palier.

La nuance compte, et elle a coûté un aller-retour. La doctrine autorise de **rappeler** le CTA plus
bas dans la page — elle n'autorise pas deux boutons identiques **dans le même écran**. Celui de
l'en-tête n'apparaît donc qu'une fois celui du hero sorti du champ, puis reste disponible jusqu'en
bas. Deux boutons identiques côte à côte ne doublent pas la conversion, ils divisent l'attention.

Le contrôle balaye la page par pas d'un demi-écran et échoue si deux CTA sont visibles ensemble.

Ces règles sont **mécanisées** dans `scripts/qa-shots.mjs`, qui échoue aux sept largeurs 1440,
1280, 1024, 768, 430, 390 et 375. Une règle sans mécanisme n'est pas une règle.

## L'indexation

Elle dépend du **domaine**, jamais de l'environnement. `robots.txt` décide sur l'hôte de la
requête, et un en-tête `x-robots-tag: noindex` couvre tout hôte non canonique. Leçon apprise :
Vercel avait promu un premier déploiement en production, et l'URL `*.vercel.app` servait un
`robots.txt` permissif.

## La mesure

PostHog, projet Parrit.ai, hôte EU. Un seul objectif : la réservation de l'audit.
`audit_cta_clicked` · `audit_booking_opened` · `scroll_50` · `scroll_90`.

⚠️ **PostHog met les résultats de requête en cache, et filtre les navigateurs automatisés.**
Un harnais Playwright ne peut pas valider des analytics : ses événements n'arrivent jamais. Le
`$pageview` a été confirmé depuis un vrai navigateur, en changeant la forme de la requête.

## Faire évoluer

Une vidéo : remplir `media` dans la section concernée de `src/content/landing.ts`. Le layout ne
bouge pas. Une note : un fichier Markdown dans `src/content/posts/`. Le prix, le lien de RDV, la
garantie : `src/content/site.ts`, nulle part ailleurs.
