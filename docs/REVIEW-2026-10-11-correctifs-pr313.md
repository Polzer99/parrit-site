# Correctifs demandés sur la PR #313 (revue Claude, 11/10/2026)

Lis d'abord `docs/CODEX-SPEC-2026-10-11-parrit-ai-alignement-anti-slop-v1.md` (la spec reste la référence) puis
`docs/REVIEW-2026-10-11-playwright-echecs.md` : 36 échecs Playwright constatés en local sur ta branche (244 passent).

## A. Vrais défauts à corriger dans le code (pas dans les tests)
1. `/manufacture` et `/fr/manufacture` à 375 px : `document.body.scrollWidth` = 519 > 375. Trouver l'élément qui déborde
   (probable : chaîne insécable créée par le remplacement « · » → espaces insécables dans `K.tsx`, ou registry line / pied
   de page en `nowrap`). Aucun débordement horizontal toléré, sur aucune page, à 375 px.
2. `/journal` à 1440 : `.journal-list time` mesure 182 px de haut (attendu ≤ 24). La date doit tenir sur une ligne, colonne
   `max-content`, `white-space: nowrap`, et le `li` ne doit pas étirer le `time`.
3. Pied d'article du journal : le format d'origine était `WE FIND THE WAY · AAAA-MM-JJ · PARRIT / JOURNAL` (date de
   l'article). Le restaurer (il ne contenait aucun code REV) ; ne pas le remplacer par « PARRIT / JOURNAL · 2026 ».
4. `tests/aeration.spec.ts:147` : à 390 px, le clic sur `.agent-esquisse-form button[type="submit"]` ne remplit plus
   `#quick-idee` avec « reporting » en 20 s. Vérifier que le bouton reste cliquable et visible (pas recouvert, pas sorti du
   flux après les changements CSS de l'en-tête du panneau Sketch) ; corriger le code, pas le test.
5. Accueil, section preuve : le titre « Three dossiers are summarised here. The others are presented in a meeting. » /
   « Trois dossiers sont résumés ici… » est FAUX sur l'accueil (les dossiers sont sur `/dossiers`). Sur l'accueil :
   FR « Trois dossiers sont consultables en ligne. Les autres se présentent en rendez-vous. » · EN « Three dossiers are
   available online. The others are presented in a meeting. ». Sur `/dossiers`, garder « résumés ici », mais en EN écrire
   « summarized » (orthographe US, cohérente avec « anonymize »).
6. `/build-with-you` : la meta description est devenue « You also leave able to build the next one without us. » /
   « Vous repartez aussi capable… » (le « aussi » n'a pas de sens hors contexte). Meta description : FR « En 10 heures
   avec le fondateur, vous construisez un système qui tourne, et vous repartez capable de construire le suivant sans
   nous. » · EN « In 10 hours with the founder, you build a system that runs, and you leave able to build the next one
   without us. » (texte d'origine de `autonomy`, sans antithèse). Le rendu visible garde la version « aussi ».

## B. Tests qui figent l'ancien contrat (mettre à jour, sans baisser l'exigence)
- `brand-os.spec.ts:176` : le cadre du H1 contient maintenant le point final (« systems that work. » / « systèmes qui
  fonctionnent. »), voulu par la spec (défaut visuel n° 3). Adapter l'attendu et la vérification `.home-s-hero-ending`.
- `conformity-home.spec.ts:226` : la section « registre » de /dossiers a été supprimée (doublon) ; adapter.
- `doctrine-visible.spec.ts:255` : nouvelle note « Examen offert · 15 min · En visio, avec le fondateur » / « Free
  examination · 15 min · Video call with the founder ».
- `product-scene.spec.ts:88` : la mention `.product-scene-mention` n'existe plus ; retirer ses mesures, garder toutes les
  autres assertions géométriques de la scène.
- `systems.spec.ts:33` : la date du tableau s'affiche « September 13, 2026 » / « 13 septembre 2026 », `datetime` reste
  `2026-09-13` : asserter l'attribut `datetime` ET le texte localisé.
- Tout autre échec de la liste : corriger le code si c'est un défaut, le test seulement si c'est l'ancien contrat.

Ne committe pas, ne pousse pas : Claude s'en charge. Termine par la liste des fichiers modifiés et, pour chaque échec de
la liste, « code corrigé » ou « test mis à jour (raison) ».
