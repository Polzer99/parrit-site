# Spec Codex : parrit.ai parle en une seule marque, Parrit.ai (12/10/2026)

Décision de Paul (12/10/2026) : « L'idée, c'est d'uniformiser autour de la nouvelle image de marque, pas de mettre un mélange de Paul Larmaraud. Tout doit être dans la même image. » Option retenue : **tout en Parrit.ai**. Le nom de Paul ne reste que là où la loi l'exige (mentions légales).

Aucune refonte visuelle : on retire, on ne redessine pas. FR et EN ensemble. Lire `AGENTS.md` et `TRUTH.md` d'abord.

## 1. Retirer la marque personnelle du rendu public

Rien de ceci ne doit plus apparaître dans le rendu public (texte, meta, OG, JSON-LD, alt/aria, RSS, llms.txt), hors `/legal` et `/fr/legal` :
« Paul », « Larmaraud », « paul-larmaraud.com », « fondateur / fondée par », « founder / founded by ».

- **Pied de page** `src/system/components/RevFooter.tsx` : supprimer « Fondée par Paul Larmaraud » / « Founded by Paul Larmaraud » et le lien vers paul-larmaraud.com.
- **Accueil** `src/app/(rev01)/page.tsx` : supprimer la figure `.home-s-founder` (photo, légende `caption`) et le lien `bridge` (« Le fondateur : Paul Larmaraud » vers paul-larmaraud.com). La grille `.home-s-maison-grid` doit rester propre avec une seule colonne de texte (ajuster le CSS dans `rev01.css`, aucune valeur de palette recopiée). Ne pas supprimer les fichiers image de `public/brand/founder/` (ils restent au canon Brand OS), seulement leur usage sur le site.
- **Formulations « avec le fondateur »** (accueil, /systems, /build-with-you, /commission, /manufacture, /dossiers, `src/system/examination.ts`, `src/lib/server/interets.ts`, `src/lib/registry/cta.ts`, `src/lib/server/leads.ts`) : réécrire au nom de la maison, sans contraste rhétorique « X, pas Y ». Repères :
  - « Un premier échange avec le fondateur vous dit si… » → « Un premier échange avec Parrit.ai vous dit si un système vaut d'être construit. » / « A first conversation with Parrit.ai tells you whether a system is worth building. »
  - `EXAM_NOTE` → « En visio » / « Video call ».
  - /build-with-you : « Avec le fondateur, vous construisez un système qui tourne. » → « Avec Parrit.ai, vous construisez un système qui tourne. » ; « Construire avec le fondateur. » → « Construire ensemble. » ; étapes « Un examen du besoin. », « Les constats repris ensemble. », « La construction ensemble d'un système qui tourne. » (EN équivalents).
  - /systems : « Le fondateur décide, une catégorie d'information à la fois… » → « Parrit.ai décide… » ; FAQ « Par un premier échange avec Parrit.ai. ».
  - /dossiers : « arrive chez le fondateur » → « arrive chez le dirigeant » (c'est le dirigeant du client dont il s'agit ; vérifier le contexte).
- **CTA et formulaire** `src/system/components/QuickCapture.tsx`, `src/system/components/AgentEsquisse.tsx` : « Envoyer à Paul » → « Envoyer » / « Send » ; « Paul la regarde personnellement et vous répond » → « Parrit.ai l'étudie et vous répond par e-mail. » ; « Envoyez-la à Paul : il regarde… » → « Envoyez-la : Parrit.ai regarde… ». Le message d'erreur garde une adresse de contact (laisser l'adresse actuelle, signalé à Paul).
- `src/lib/registry/cta.ts` : libellés visibles sans « Paul » (« Réserver un échange »). Les identifiants internes (`rdv.paul`, colonne `paul_manual_followup_status`, commentaires) ne changent pas.
- **Durée en lettres oubliée** : /commission « Quinze minutes en visio avec le fondateur, pour nommer… » → « Un échange en visio, pour nommer… » ; /manufacture « Quinze minutes avec le fondateur, puis un périmètre écrit, ou un non clair. » → « Un premier échange, puis un périmètre écrit ou un refus motivé. » ; `sketch/[id]` « Quinze minutes transforment cette esquisse en périmètre. » / « Fifteen minutes turns… » → « Un premier échange transforme cette esquisse en périmètre. » / « A first conversation turns this sketch into a scope. ».
- **Données structurées et auteur** : `src/system/jsonld.ts` retire `founder` ; `src/system/auteur.ts` et ses usages (journal `[slug]` metadata `authors`, `journal/rss.xml`, sketch, préuves) passent à l'organisation Parrit.ai (`name: "Parrit.ai"`, `url: "https://parrit.ai"`). Le journal FR « founded by Paul Larmaraud » (texte de présentation) devient « Parrit.ai is a French manufacture: … ».
- **`scripts/generate-llms.mjs`** : « An independent French maison. » sans fondateur ; « Book a video call with Parrit.ai. ».
- **Ne pas toucher** : `/legal` (directeur de publication, obligation légale), `src/app/camp-costa-rica/`, la redirection `/paul` de `next.config.ts`, `src/system/brand-os.*.json` (vendorisés), le lien Cal.com `paul-larmaraud/audit` dans `site.config.ts` (compte Cal.com, geste de Paul).

## 2. Tests

- Adapter les tests qui exigent la photo ou la légende du fondateur (`tests/brand-os.spec.ts` « approved founder photo, caption and heading », `tests/founder-photo.test.mjs`, `tests/conformity-home.spec.ts`, etc.) : ils doivent désormais exiger l'ABSENCE de la figure fondateur sur le site. Si `founder-photo.test.mjs` contrôle les fichiers du canon, le garder pour ce rôle et retirer seulement ce qui exige leur affichage.
- Étendre `tests/anti-slop-copy.spec.ts` (toutes les routes sauf /legal, FR et EN) : le body ne contient pas `/\bPaul\b|Larmaraud|fondat(eur|rice)|fondée par|founder|founded by|quinze minutes|fifteen minutes/i`, et aucun lien `a[href*="paul-larmaraud.com"]`. Même contrôle sur `public/llms.txt` dans `tests/anti-slop-copy.test.mjs`.
- `TRUTH.md` et `AI_CONTEXT.md` : consigner la décision (« le site parle au nom de Parrit.ai ; aucun nom de personne hors mentions légales »).
- Batterie verte : `npm run build`, `npm test`, `npm run qa:brand:rev01`, `npm run lint`. Playwright `qa:network:rev01` est lancé par le relecteur sur :3210.

Ne pas commit, ne pas pousser.
