# Spec L6 — Stopgap identité : un site qui reflète qui on est (avant la refonte Maxime)

*Repo : parrit-site. Objectif de Paul : « refaire le site propre en gardant la page Parrit et les camps du déclic tels quels — ça doit juste mieux refléter qui on est ». Pas une refonte : un stopgap chirurgical qui tienne la face en attendant que Maxime repasse dessus.*

## L'identité à refléter (source : appels Paul↔Maxime + canon)

- Parrit = **des humains réels qui ont déjà déployé pour de vrai** — pas « un énième truc qui fait de l'IA ».
- **L'ennemi nommé : Imova** (concurrent générique qui a déçu ses clients). Tout ce qui fait « générique IA » (visages fictifs, personas artificielles, hype) nous fait ressembler à l'ennemi.
- Décision actée par Paul & Maxime (21/07) : « les vidéos/visuels full IA manquent d'authenticité » → **contenu authentique et organique, vraies personnes**.
- Règle d'or Paul (§37 + doctrine site) : **JAMAIS de visages fictifs sur les agents. Vraies photos uniquement.**

## Constat sur `origin/main` (vérifié)

- `src/components/HomeDeux.tsx` affiche des **visages d'agents fictifs** : `hd-agent-face` ← `public/brand/agents/{amelie,chloe,julien}.png` + `public/brand/agents/friendly/*.png` (personas par métier). **C'est la violation principale.**
- Les **vraies photos existent déjà** dans le repo : `/team/paul-portrait.jpg`, `/team/yukun-portrait.jpg` (page `/fondateurs`), `/brand/terrain/*.jpg` (vraies photos d'ateliers/masterclass, déjà utilisées dans la section « Sur le terrain » de HomeDeux).

## Périmètre (STRICTEMENT ce lot)

1. **Supprimer les visages fictifs des agents** sur la home (`HomeDeux.tsx`) et partout où `public/brand/agents/*` avec visage humain est rendu :
   - Remplacer chaque `hd-agent-face` par une représentation **sobre non-humaine** conforme au design system existant du composant : pastille avec initiales du rôle OU pictogramme métier OU simple label typographié (réutiliser les styles existants du composant, angles nets, pas de nouveau langage visuel). AUCUNE nouvelle image générée.
   - Ne PAS supprimer les fichiers PNG du repo (hors scope) ; on cesse juste de les afficher.
2. **Mettre les vrais humains en avant** :
   - Remonter la section « Sur le terrain » (vraies photos) plus haut dans la page — juste après le hero ou la 1ʳᵉ section — pour que la première impression soit « des humains réels en action ».
   - Ajouter dans cette zone (ou juste après) un bloc court « Qui est derrière » : les portraits réels `/team/paul-portrait.jpg` + `/team/yukun-portrait.jpg`, nom + rôle d'une ligne chacun, et un lien vers `/fondateurs`. Réutiliser les styles de cartes existants.
3. **Une ligne d'identité** (pas un manifeste) : sous le hero existant (inchangé), une phrase sobre reprenant le positionnement déjà validé, par ex. le lede existant complété de « Des humains réels, qui ont déjà déployé pour de vrai. » — formulation exacte à reprendre du canon (`docs/canon/PRECOMMANDE-CANON.md` du repo growth) : ressenti n°1 « Ce mec l'a déjà fait pour de vrai » adapté à la marque. Pas de jargon, pas de tell IA (pas de tiret cadratin).
4. **4 langues** : répercuter les changements de copy dans les 4 langues du DICT de HomeDeux (fr/en/pt-BR/zh-CN), traductions sobres.

## À GARDER TEL QUEL (ne pas toucher)

- Le **hero** (badge, H1 « Passez de l'IA qui discute à l'IA qui agit », CTA, InputOutputFlow) — validé, on n'y touche pas (hors ajout de la ligne d'identité sous le lede si c'est propre).
- Les pages **camps** (`camp-costa-rica/*`) et tout ce qui touche au « déclic » (`Chemin.tsx`, parcours) : **intacts**.
- Les 3 pages offres (`croissance`, `deployer`, `transmettre`) : structure et prix (« sur devis ») inchangés.
- Aucun changement de prix, d'offre, de claim chiffré. Aucun nouveau texte marketing inventé : uniquement des formulations issues du canon.
- Le design system en place (tokens du site actuel) : aucun nouveau style global, aucune nouvelle dépendance.

## Critères d'acceptation

- Plus AUCUN visage humain fictif rendu sur le site (grep : aucun `<img>` ne pointe vers `brand/agents/*` contenant un visage ; les remplaçants sont typographiques/pictos).
- Les vraies photos (terrain + fondateurs) sont visibles dès le premier écran ou juste après.
- Le bloc « Qui est derrière » existe avec les 2 portraits réels + lien `/fondateurs`, dans les 4 langues.
- `npm run lint` et `npm run build` passent ; les tests Playwright existants restent verts (adapter si un test référence les visages d'agents).
- Zéro régression sur camps/déclic/offres (aucun diff sur ces fichiers).

## Contraintes

- Lire `AGENTS.md` + `TRUTH.md` avant. ⚠️ La palette décrite dans `AGENTS.md` est PÉRIMÉE sur certains points — ne pas « corriger » les couleurs existantes du site, réutiliser les styles en place tels quels.
- Modifications minimales et ciblées. Préserver le WIP. Aucun secret. Pas d'image générée par IA.
