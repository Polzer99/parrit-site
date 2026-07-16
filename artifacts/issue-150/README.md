# Issue #150 — audit performance et parité visuelle

Date : 2026-07-15  
Branche : `codex/issue-150`  
Baseline : `origin/main` (`bc5cbbc`)

## Résultat Lighthouse mobile

Mesure locale sur la build de production (`npm run build && npm start`), Lighthouse 13.4.0, profil mobile par défaut.

| Mesure | Avant | Après |
| --- | ---: | ---: |
| Performance | 78 | **95** |
| LCP | 6,0 s | **2,8 s** |
| CLS | 0 | **0** |
| FCP | 0,9 s | **0,9 s** |
| TBT | 70 ms | **70 ms** |
| Speed Index | 1,5 s | **1,1 s** |
| Poids total | 2 075 Kio | **528 Kio** |
| Économies images encore signalées | 1 629 Kio | **12 Kio** |

Rapports complets :

- [`before-fr-mobile.report.html`](lighthouse/before-fr-mobile.report.html)
- [`after-fr-mobile.report.html`](lighthouse/after-fr-mobile.report.html)
- Les exports JSON correspondants sont conservés dans le même dossier.

Le LCP est le `<h1>` textuel, pas une image. Aucune image n'a donc reçu de `priority`; toutes les images de la home restent en chargement différé explicite.

## Parité visuelle

Captures Chromium de builds de production distinctes, avec `prefers-reduced-motion: reduce`, polices chargées et mêmes viewports. Les dimensions de page avant/après sont strictement identiques.

| Route / viewport | Dimensions avant = après | Pixels avec delta > 8 | Delta moyen |
| --- | ---: | ---: | ---: |
| `/fr` desktop 1440×900 | 1440×5940 | 0,4141 % | 0,158 |
| `/en` desktop 1440×900 | 1440×5850 | 0,1902 % | 0,121 |
| `/fr` mobile 390×844 | 390×9665 | 0,3652 % | 0,125 |
| `/en` mobile 390×844 | 390×9537 | 0,2318 % | 0,101 |

Les deltas résiduels sont localisés au rendu compressé AVIF/WebP des mêmes images. Aucun déplacement de layout, changement de texte ou changement de token DA n'est constaté.

Planches avant/après :

- [`planche-fr-desktop-1440.png`](planche-fr-desktop-1440.png)
- [`planche-fr-mobile-390.png`](planche-fr-mobile-390.png)
- [`planche-en-desktop-1440.png`](planche-en-desktop-1440.png)
- [`planche-en-mobile-390.png`](planche-en-mobile-390.png)

## Vérifications

- `npm ci` : vert
- `npm run lint` : 0 erreur, 1 warning historique hors scope dans `src/app/[lang]/ressources/page.tsx`
- `npm run build` : vert, 182 pages statiques générées
- Smoke HTTP : `/fr`, `/en`, `/pt-BR`, `/zh-CN` répondent toutes `200`
- Audit contraste : 0 défaut sur `/fr`, `/en`, `/pt-BR`, `/zh-CN`
- Home : aucun `<img>` brut ni suppression ESLint `no-img-element` restant
- Copy et tokens DA : aucune modification
