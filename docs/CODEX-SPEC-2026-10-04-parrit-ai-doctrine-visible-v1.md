# CODEX SPEC — parrit.ai : la doctrine du Brand OS devient visible (composition, boutons, accent, langue)

Date : 04/10/2026 · Auteur : Claude (relecture, §25) · Base : `origin/main` (`26dcd26` = production).
Ordre de Paul du 04/10 : appliquer réellement le Brand OS aux sites, au-delà des tokens, en corrigeant les écarts aux
règles DÉJÀ APPROUVÉES. Audit source : `parrit-canon-visual-system/brand/visual/decisions/AUDIT-SITES-2026-10-04.md`
(lignes P2, P3, P4, P5, P6, P7, P9). Ce lot sera relu en préversion par Paul avant fusion.
**Hors lot, ne pas toucher** : hero de l'accueil (titre, surtitre « Systèmes d'exploitation d'entreprise », sous-ligne :
DV-01/DV-02 ouverts, PR #296), catégorie, prix, offres et leurs textes, mur « Des systèmes commandés par », pages
légales, Journal (contenu), `AgentEsquisse` et `QuickCapture` (comportement), tokens (`src/**/brand-os*`), polices,
routes et redirections. Ne pas reprendre ni modifier la PR #296.

**Préséance** : la section « Source de vérité visuelle = REV 03 » d'`AGENTS.md` est antérieure au Brand OS (décisions
P1/P3 du 24/09, REGLES-DOR §48 « un seul canon de marque ») et périmée sur la palette ; là où elle autorise une ombre
d'instrument ou impose le libellé « Parlons-en », ce lot l'emporte. Mettre à jour la puce correspondante d'`AGENTS.md`
(libellé de l'action du header ; boutons en General Sans ; zéro ombre) dans le même lot, sans réécrire le reste.

## FIX1 (04/10) — À FAIRE SUR LE TRAVAIL DÉJÀ PRÉSENT DANS CE WORKTREE (ne rien refaire, ne rien annuler)
Batterie hors sandbox : lint, claims, build, brand verts ; `test:brand-os` rouge sur un seul test.
1. `tests/brand-os-render.test.mjs:74` exige la légende « Paul Larmaraud · Fondateur/Founder » : elle gèle l'ancien
   rendu que le §3.1 change. Remplacer l'assertion par : la légende est rendue si et seulement si une photo est rendue
   dans la section (aujourd'hui : absente). Ne toucher à aucune autre assertion de ce fichier.
2. Arbitrage « un éclat par écran » dans le premier écran de l'accueil (cadre rose du hero + bouton rose du header) :
   le bouton du header suit la règle W-66 (APPROUVÉE) : variante contour (`.ghost`, sans fond rose) tant que le hero
   est visible, variante pleine rose dès que le hero sort de l'écran (IntersectionObserver ; sans JS : contour). Sur
   les pages sans hero à cadre (toutes sauf l'accueil), le bouton du header reste plein. Le test (c) du §8 reste exigé
   tel quel.
3. Ne pas ajouter de tests hors du périmètre du §8 ; si des tests d'esquisse privée ont été ajoutés sans lien avec ce
   lot, les retirer et le dire dans le rapport.

## 1. Un seul design de bouton, un seul nom pour l'action (W-65, W-67, W-48 ; W-25 mono réservée à l'appareil)
1. `.rev-button` (et variantes `.exec`, `.ghost`) : texte en General Sans 600, casse normale, sans espacement de
   lettres ajouté ; IBM Plex Mono et les capitales restent pour les surtitres, folios et étiquettes techniques, plus pour
   les boutons. Hauteur, rayon (0), couleurs : inchangés.
2. L'action « réserver l'examen de 15 minutes » porte un seul libellé partout :
   FR « Réserver l'examen » ; EN « Book the examination ».
   Remplace : « Parlons-en » / « Let's talk » (header, CTA final de l'accueil, `manufacture`, `standard`, `dossiers`,
   `systems`, `sketch/[id]`), « Réserver un examen » (accueil, déroulement et carte Système sur mesure), « Réserver
   l'examen offert » (build-with-you). Destination inchangée (`/commission`).
   Exception : `build-with-you` `nextLink` (« Réserver un examen pour un système sur mesure ») reste un lien de texte.
3. « Rencontrons-nous » / « Let's meet » (lien vers paul-larmaraud.com) devient un lien de texte FR « Le fondateur :
   Paul Larmaraud » ; EN « The founder: Paul Larmaraud », pas un bouton.
4. Au-dessus du bouton du CTA final de l'accueil, la note existante (« 15 min · Un examen, en visio, avec le fondateur »)
   reste le libellé : elle passe en General Sans `--text-note`, casse normale.

## 2. Un éclat rose par écran (W-32)
Dans l'écran « Pour commencer » de l'accueil, les deux cartes d'offre ont chacune un bouton rose : leurs boutons
deviennent la variante `.ghost` (contour) ; le rose reste réservé au CTA du header et au CTA final. Vérifier à 1440 et
390 px qu'aucun écran de l'accueil et de `/build-with-you` n'affiche plus d'un élément rose plein (le liseré du cadre
du hero compte comme l'éclat de son écran).

## 3. Accueil · section « déroulement » (W-12, W-09)
1. La légende « Paul Larmaraud · Fondateur » (`journey.caption`) n'est rendue que si une photo est rendue dans la
   section ; aujourd'hui aucune : elle disparaît (la PR #296 la rétablira avec la photo).
2. Sans photo, la grille `home-s-maison-grid` n'a qu'une colonne : la colonne de texte est centrée dans la largeur de
   section (même axe que les autres sections), mesure du texte inchangée.
3. Les deux liens sous les étapes : le premier devient le bouton unique de la section (§1, variante `.ghost` sur clair),
   le second est le lien de texte du §1.3.

## 4. Accueil · « La preuve » (W-24 échelle fermée, W-56)
Les deux affirmations (`proof.systems.title`, `proof.dossiers.title`) sont rendues plus grandes que le titre de section
précédent (58 px contre ~44 px). Les ramener au cran `h3` de l'échelle existante (le même que les titres de cartes
d'offre), interligne de l'échelle ; rien de plus grand que le titre de la section « Ce que nous construisons ».

## 5. Accueil FR · Journal (W-54)
Les articles n'existent qu'en anglais. Sur la page française, ajouter après le titre de la section la mention en
`--text-note` « Articles en anglais. » ; chaque lien d'article porte `hreflang="en"` et `lang="en"` sur son titre.
Aucun changement de sélection des articles (décision ouverte, voir l'audit P5).

## 6. /build-with-you · premier écran mobile (W-02 ; W-68 le prix n'est pas dans le hero)
Sous la promesse, ajouter le bouton unique (« Réserver l'examen », destination `/commission`) avec, au-dessus, le
libellé FR « Examen offert de 15 minutes, avec le fondateur » ; EN « Free 15-minute examination with the founder ».
À 390 × 844, le bouton est entièrement visible sans défiler. Le prix reste là où il est. Les deux boutons « Réserver
l'examen offert » plus bas deviennent « Réserver l'examen » (§1.2).

## 7. /commission · cadre de réservation (W-33)
Le cadre qui contient Cal.com porte une ombre portée : la retirer (zéro ombre, filet seul). Ne rien changer à
l'intégration Cal.com elle-même (langue et nom de l'événement se règlent dans le compte Cal.com, geste de Paul).

## 8. Tests et preuves
- Mettre à jour uniquement les tests qui GÈLENT un libellé ou un style que ce lot change (liste avant/après dans le
  rapport). Aucun seuil ne bouge.
- Nouveaux tests : (a) aucun `.rev-button` rendu en Plex Mono ni en capitales ; (b) l'action de réservation a le même
  libellé sur toutes les pages (FR et EN) ; (c) au plus un élément rose plein par écran sur l'accueil (1440 et 390) ;
  (d) la légende du fondateur n'est pas rendue sans photo ; (e) `/build-with-you` montre un bouton dans le premier écran
  à 390 × 844.
- Batterie hors sandbox : lint, claims, build, brand, `test:brand-os`, `qa:network:rev01`. Pas de build dans le sandbox.
- Rapport `docs/REPORT-2026-10-04-doctrine-visible.md` : avant/après de chaque libellé, captures 1440 et 390 de l'accueil,
  de `/build-with-you` et de `/commission` (FR).
