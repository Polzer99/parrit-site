# CODEX SPEC — parrit.ai : photo du fondateur en buste

Date : 05/10/2026 · Auteur : Claude (relecture, §25) · Base : `origin/main` (`b1ec1d4`).
Décision de Paul du 05/10/2026 (terminal a7) : « Buste » — même photo LinkedIn, recadrage plus serré, sans retouche.
**Ce lot sera fusionné et publié.** Ne pas toucher : mise en page de la section, légende, autres sections.

1. Source, lecture seule : `/Users/paullarmaraud/parrit-canon-visual-system/brand/visual/sites/handoff/2026-10-05/photos-linkedin-buste/`
   (`photos.manifest.json`). Copier octet pour octet `parrit-ai-founder-linkedin-buste-3x4-{340,680}.{avif,webp}` dans
   `public/brand/founder/` ; SUPPRIMER `parrit-ai-founder-linkedin-3x4-*` (4 fichiers).
2. Accueil, section déroulement : la `<picture>` pointe vers les nouveaux fichiers (mêmes `srcset`, `sizes`, dimensions
   `width=340 height=453`, alt, légende).
3. Tests : fixture d'empreintes = les 4 nouveaux fichiers ; plus aucune référence aux anciens.
4. Batterie hors sandbox : lint, claims, build, brand, `test:brand-os`, `qa:network:rev01`.
