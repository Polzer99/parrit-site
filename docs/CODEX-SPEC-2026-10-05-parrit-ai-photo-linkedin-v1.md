# CODEX SPEC — parrit.ai : photo LinkedIn à la place de DSC00629

Date : 05/10/2026 · Auteur : Claude (relecture, §25) · Base : `origin/main` (`b4ecfd5`, scène produit incluse).
Décision de Paul du 05/10/2026 (terminal a7) : « il ne faut vraiment pas mettre la photo de Paul Larmaraud qui a été
publiée là. Il faut mettre une autre, qui est celle de LinkedIn ». Registre Brand OS : `gym-original` APPROVED,
`studio-dsc00629` REJECTED. **Ce lot sera fusionné et publié.**
**Ne pas toucher** : mise en page de la section déroulement (grille photo + texte, légende), hero, scène produit, offres,
Journal, tokens, polices.

1. Source, lecture seule : `/Users/paullarmaraud/parrit-canon-visual-system/brand/visual/sites/handoff/2026-10-04/photos-linkedin/`
   (`photos.manifest.json`). Vraie photo, cadrage identique à la photo LinkedIn de Paul, recadrage géométrique seul,
   AUCUNE retouche. Copier octet pour octet `parrit-ai-founder-linkedin-3x4-{340,680}.{avif,webp}` dans
   `public/brand/founder/`.
2. SUPPRIMER `public/brand/founder/parrit-ai-founder-dsc00629-3x4-*` (4 fichiers).
3. Accueil, section déroulement : la `<picture>` pointe vers les nouveaux fichiers ; mêmes `srcset`, `sizes`, dimensions
   (`width=340 height=453`), mêmes alt. La légende « Paul Larmaraud · Fondateur » reste.
4. Tests : fixture d'empreintes = les 4 nouveaux fichiers (manifeste) ; aucun fichier ni référence `dsc00629` dans `public/`
   ni `src/`. `test:brand-os` reste vert.
5. Batterie hors sandbox : lint, claims, build, brand, `test:brand-os`, `qa:network:rev01`. Rapport
   `docs/REPORT-2026-10-05-photo-linkedin.md`.
