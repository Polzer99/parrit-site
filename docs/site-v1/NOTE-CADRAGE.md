# Note de cadrage — spec site V1 (26/10/2026)

Superviseur : Claude. Décisions de Paul datées ; le reste est à trancher.

## Arbitrages de Paul
- 26/10 : « Calypie » dans la spec = **Qualiopi** (dictée), pas Calliope. Le bloc H10 porte sur Formia et la certification Qualiopi. Contrôle bloquant : entité titulaire, validité, catégories d'actions ; aucune certification portée par Formia attribuée à Parrit.ai.

## Écarts avec l'existant à résoudre dans le lot
- La spec remplace le titre et la section « six capacités » fusionnés le 26/10 (PR #322). La définition canonique `parrit-canon/positioning/POSITIONNEMENT-CANONIQUE-2026-10-26.md` sera mise à jour dans le même geste.
- `AGENTS.md` fige une barre de navigation à 2 liens (Journal, Systèmes) et le CTA « Réserver l'examen » ; la spec demande un menu à 5 entrées et « Parler d'un projet ». Les tests de conformité concernés seront adaptés à la règle de fond (destination, accessibilité, géométrie), pas aux libellés.
- Clients publiables : uniquement `src/system/public-clients.ts` (règle du 25/10). Aucun logo ajouté sans preuve et permission.

## Contrôles du lot (5, raison : site public, voix de marque, attributions juridiques)
1. Batterie du dépôt (build, qa:brand, test:brand-os, qa:network) verte sur l'hôte.
2. Tests de preuve : aucun logo non autorisé, aucune attribution MIT institutionnelle, aucune certification attribuée à tort, aucun chiffre non sourcé.
3. Captures 360 / 390 / 768 / 1024 / 1440, clavier, contraste, mouvement réduit.
4. Revue Claude du diff et des textes (langage écrit, zéro tiret cadratin, zéro promesse).
5. Validation de Paul avant toute fusion ou mise en ligne.
