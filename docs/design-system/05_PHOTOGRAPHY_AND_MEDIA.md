# 05 — Photographie et médias

La photographie appartient à la **couche expressive**. Elle est facultative. Elle enrichit une interface ; elle ne sauve jamais une structure faible.

> Une page qui ne fonctionne plus quand les images sont masquées n'est pas conforme au design system Parrit.

Tout média expressif porte `data-layer="expressive"` dans le code.

---

## La règle `references/`

**`references/` est exclusivement un outil de calibration et de QA.**

Les fichiers qui s'y trouvent :

- ne sont **jamais** utilisés comme assets live ;
- ne sont **jamais** servis sur le site ;
- ne sont **jamais** copiés tels quels ;
- ne sont **jamais** importés dans un composant de production.

Ils servent à une seule chose : évaluer si une **nouvelle** création est conforme. Le résultat doit tenir si le dossier disparaît.

C'est la correction majeure apportée par le canon v1.1 : les images de référence avaient commencé à servir d'assets, ce qui produisait des pages qui ne tenaient que par des visuels empruntés.

---

## Famille A — Fondateur et opérateurs

**Objectif :** incarner la marque, inspirer confiance, montrer de la proximité, rester exigeant et crédible.

Paul doit paraître : sympathique · accessible · concentré · ambitieux · élégant sans être figé · **opérateur, pas influenceur** · **dirigeant de terrain, pas mannequin corporate**.

**Traitement :** lumière naturelle ou cinématographique réaliste · grain discret · contraste éditorial · noir et blanc ou couleurs fortement contrôlées · expression chaleureuse · sourire léger et sincère · regard vivant · espace disponible pour les titres quand nécessaire.

**Règle d'or Parrit, non négociable :** une photo de Paul part d'une **vraie photo de Paul**. Jamais un visage 100 % généré. Le costume et l'habillage peuvent être retravaillés ; le visage, non. Un visage de mannequin à la place de Paul est un rejet automatique.

## Famille B — Scènes opératoires

Travail sur un système · analyse · coordination · atelier · architecture de workflow · échange avec un client · prise de décision · production en équipe.

**Ce qu'on montre :** des gens qui travaillent sur quelque chose de réel, avec des objets qui existent. **Ce qu'on ne montre pas :** une réunion souriante autour d'un ordinateur fermé, une poignée de main sur fond de gratte-ciel, un doigt qui touche un hologramme.

## Famille C — Plaques éditoriales

Collages · schémas · cartes d'agents · tensions humain / machine · flux · trajectoires · boucles · preuves · avant / après.

C'est la famille la plus proprement Parrit, et la plus sous-exploitée. Une plaque éditoriale **explique** : si on peut la retirer sans perdre de compréhension, ce n'était pas une plaque, c'était une décoration.

---

## Traitement graphique

**La photo source reste propre et réutilisable.** Le rouge, la trame, la typographie et les diagrammes sont des couches **ajoutées** en code ou en Figma, jamais cuites dans le fichier source. C'est ce qui permet de réutiliser une même photo dans un deck, une propale et le site sans la re-shooter.

- Traitement de fusion : `mix-blend-mode: soft-light` sur les plaques.
- Angles nets. Aucun arrondi, aucune ombre.
- Halftone : couche **explicative**, appliquée aux images. Ne se cumule pas avec le grain papier sur une même surface.
- Le sceau 速 en outline rouge peut se poser en overlay sur une photo de CTA.

## Interdits

Dégradés bleu-violet · néons, cyberpunk, hologrammes · robots humanoïdes, avatars, mascottes · cerveaux lumineux · circuits électroniques génériques · blobs 3D glacés · glassmorphism · photos de stock trop parfaites · faux dashboards décoratifs avec de fausses données · bruit visuel sans rôle explicatif · toute image qui se lit immédiatement comme une génération automatique.

## Avant de poser une image, trois questions

1. La page tient-elle **sans** elle ? Si non, corriger la structure d'abord.
2. Apporte-t-elle une **incarnation, une preuve, une démonstration ou un contexte** que la structure ne peut pas transmettre ? Si non, la retirer.
3. Vient-elle de `references/` ? Si oui, **elle n'a rien à faire là**.

## État des assets

| Emplacement | Statut |
|---|---|
| `public/brand/*.svg` | assets de marque, invariants |
| `public/brand/client-logos/` | mur de logos visuel, autorisé |
| `public/brand/agents/` | portraits du catalogue d'agents |
| `public/brand/paysage-lo-y-wa.jpg` | **utilisé en fond de `body` en production — non conforme**, voir `STATUS.md` |
| `brand-visual-system/references/` | calibration QA **uniquement** |
| `design-source/figma-template/` | **référencé mais inexistant** — référence morte |
