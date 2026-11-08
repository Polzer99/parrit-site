# Correctif passe 2 — 08/11/2026

Mandat : implémentation intégrale de la spec amendée demandée par Paul.
Source de travail explicitement demandée : checkout courant, HEAD `bb28ce9`.
Les deux passes précédentes sont intégrées ; préserver la spec et les six PNG
préexistants modifiés (empreintes sauvegardées dans /private/tmp).

1. Capturer npm ci, lint, build Webpack et tests Node avant modification.
2. Corriger la mosaïque pleine largeur 2:1, cadrages CSS vérifiés sur les trois
   sources, sans réencoder les assets ; renforcer l'éclairage des logos.
3. Déplacer le bandeau avant la FAQ ; corriger les couleurs des contrôles et
   les sommets des pistes mobiles sans changer les seuils.
4. Investiguer les échecs articles/hero depuis les traces hôte et le code ;
   corriger les causes prouvées, garder visibles les causes non reproduites.
5. Ajouter les régressions FR/EN, adapter uniquement les contrats amendés,
   rejouer la même batterie et marque/claims/Brand OS ; revue indépendante.
6. Mettre à jour les consignes et le rapport, avec résultats et limites.

Écriture : dépôt local de développement, code/styles/tests/docs uniquement.
Réversible par diff sur HEAD ; sauvegarde des modifications préexistantes par
empreintes, aucun système externe ni donnée métier (0 ligne). Aucun commit,
push ni déploiement. Une implémentation et deux passes correctives maximum ;
arrêt des relances identiques en cas de blocage d'environnement.
Preuve attendue : rendu FR/EN avec/sans JS, géométrie/contrastes/CLS, puis
rejeu Playwright par Claude sur l'hôte comme prévu par la spec.

---

# Plan d’exécution — parcours de l’accueil

## Passe 2, 08/11/2026

Mandat : spec locale amendée, implémentation intégrale demandée par Paul.
Source actuelle : checkout demandé, HEAD `f2f1abafefe8769bae1779d6ceac7245d524e0b6`.
La passe 1 est déjà intégrée ; seule la spec est modifiée à l'entrée.

1. Baseline : installation, lint, build Webpack, tests Node ; conserver les HTML
   FR/EN dans `/private/tmp/couches-passe2-baseline-{fr,en}.html`.
2. Photos : vérifier les trois sources avec sharp, convertir sans recadrage ni
   agrandissement en AVIF/WebP, retirer les métadonnées et tracer la provenance.
3. Ajouter terrain et bandeau final, enrichir les offres, adapter les fonds et
   remplacer les masques clients par les images couleur autorisées. Conserver
   les permissions, l'attribution et la géométrie interne des sections existantes.
4. Apparition progressive unique, via un observateur dédié, sans modifier les
   observateurs qui pilotent déjà les animations internes. SSR et mouvement réduit
   restent visibles. Tests FR/EN, images, couleurs/contraste, alignements et motion.
5. Rejouer les contrôles de la spec, marque/claims, Brand OS et réseau. Revue
   adverse indépendante, corrections bornées, rapport avec limites de preuve.

Écritures : dépôt local, environnement de développement ; sources photos externes
en lecture seule. Code/assets/tests/docs uniquement, zéro ligne métier. Réversible
par le diff sur HEAD ; spec sauvegardée dans `/private/tmp`, non modifiée.
Limite : implémentation puis au plus deux passes de correction, pas de relance
identique d'un blocage environnemental. Pas de commit/push/déploiement.
Preuve attendue : rendu et interactions FR/EN, cadrages entiers, aucun EXIF/GPS,
aucune régression des seuils géométriques/CLS. Production hors mandat.

## Passe 1 (historique)

Source : `CODEX-SPEC-2026-11-08-parcours-accueil-couches.md`, décision de Paul du
08/11/2026, implémentation explicitement demandée. Baseline : `f335989`, fusion
de la PR #365, checkout courant demandé par Paul. Spec non suivie conservée.

1. Capturer lint, build Webpack et tests Node avant modification. Ajouter les
   contrats FR/EN d’ordre, navigation, offres, FAQ et derniers articles.
2. Extraire la carte Journal partagée, conserver son rendu d’index et charger
   les trois dernières entrées côté serveur. Ajouter offres et FAQ localisées,
   JSON-LD dérivé des mêmes paires question/réponse, sans dépendance nouvelle.
3. Réordonner l’accueil, déplacer la définition, retirer le doublon, adapter
   navigation et anciennes ancres. Conserver hero, parcours, services, preuves,
   outils, partenaires et contact. Adapter seulement les contrats devenus caducs.
4. Vérifier les liens et l’attribution, les accordéons natifs avec/sans JS,
   les cartes et la géométrie aux tailles existantes. Rejouer lint/build/tests,
   marque/claims, Brand OS et batterie navigateur avec deny-all.
5. Revue indépendante en lecture seule, corrections ciblées et rapport des
   résultats. Aucun commit, push ou déploiement.

Écritures : dépôt local uniquement ; code, styles, tests et documentation.
Réversibles par diff sur `f335989` ; sauvegarde Git et HTML de référence dans
`/tmp/parcours-before-{fr,en}.html`. Aucune donnée métier, zéro ligne distante.
Boucle bornée : une implémentation, une revue indépendante, au plus deux passes
de correction. Arrêt des relances si un même blocage d’environnement persiste.
Preuve attendue : rendu SSR + interactions navigateur FR/EN, géométrie inchangée,
FAQ visible égale au JSON-LD et articles égaux au Journal. Production hors mandat.
