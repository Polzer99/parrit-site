# Correctifs PR #313, passe 3 (CI Linux, 12/10/2026)

CI `lint and build` rouge : `tests/alignment-grid.spec.ts:35`, 20 échecs, tous à 375 px (FR et EN, toutes les routes).
Un contrôle du header mesure 49 px au lieu de 48 sous Linux (rendu des polices différent de macOS) :
les contrôles n'ont qu'un `min-height: var(--button-min-height)`, donc leur contenu peut les agrandir.

Correctif attendu, dans `src/app/(rev01)/rev01.css` uniquement (bloc de fin de fichier, après la ligne
`.cmdbar .wordmark { height: var(--button-min-height); … }`) :
pour `.cmdbar .cmd-nav a`, `.cmdbar .locale-toggle`, `.cmdbar .locale-toggle button`, `.cmdbar .cmd-menu-toggle`,
`.cmdbar .cmd-cta`, poser `height: var(--button-min-height); box-sizing: border-box;` avec un centrage vertical
(`display: inline-flex; align-items: center;` si l'élément n'est pas déjà en flex), sans changer largeurs, couleurs,
padding horizontal ni typographie. Ne pas assouplir le test. Rien d'autre.
