# Calculateur de l'accueil : trois finitions (18/11/2026)

Suite des pistes laissées ouvertes par `CODEX-SPEC-2026-11-15-accueil-calculateur-roi.md`.
Finition visuelle du site, mode auto (Paul, 12/11 ; « Reprends go », 18/11).
Codée en direct : Codex sans crédit jusqu'au 19/11.

1. **Vide sous la carte la plus courte (mobile et tablette).** Mesure en ligne à 390 px :
   carte « devis » 337 px, carte « temps » 415 px, carrousel 415 px. La différence vient
   de la deuxième rangée (sous-titre 28 px contre choix de tâche 78 px).
   Correctif : les deux cartes partagent leurs quatre rangées par `subgrid`
   (titre, ligne 2, champs, résultat), comme `.scenes`. Les champs et les résultats
   s'alignent d'une carte à l'autre, et aucune carte n'est plus courte que le carrousel.
   Première mesure après sous-grille : le vide passait à l'intérieur de la carte « devis » (≈ 80 px).
   La deuxième rangée est donc égalisée à la source : le sous-titre « Devis restés sans relance »
   prend la hauteur du menu (48 px, centré), et l'étiquette visible « Tâche » / « Task » devient
   le nom accessible du menu (`aria-label`), sans texte caché. Aucun texte, aucune taille de police ni aucun seuil ne change.
2. **Code mort.** Le champ `flow` des objectifs (9 entrées sur 17) n'est plus lu depuis le 15/11 :
   retiré, avec son type. Les classes `home-measures` et `home-assistant` restent : la presse
   et les assistants les utilisent.
3. **Exemption « € » resserrée.** Elle couvrait toute la section du calculateur. Elle ne couvre plus
   que les deux paragraphes `.calc-result` et, là où le symbole seul est contrôlé, les deux libellés
   de champ marqués « (€) ». Le reste de la section (titres, note, pied) repasse sous le contrôle.

Tests : `accueil-epure.spec.ts` vérifie à 1440 et 390 px que les cartes ont la même hauteur
(±1 px), que champs et résultats sont alignés, et que le carrousel n'est pas plus haut que les cartes.
