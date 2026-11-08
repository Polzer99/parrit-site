# Appel de 15 minutes : un seul bloc en fin d'article et de thème, et une page `/rendez-vous` qui fonctionne

Niveau de risque : élevé (texte public sous le nom de Paul, tunnel de rendez-vous). Spec validée par Paul le 08/11/2026 (« go appel »). Paul relit le résultat avant la fusion.

Source : `~/parrit-canon/docs/machine-contenu/SPEC-APPEL-15-MIN-ET-FORMIA.md`, lot A seulement. FormIA, la mise en page des articles et les contrôles de publication feront l'objet de lots suivants : ne pas y toucher ici.

## Constaté en ligne le 08/11/2026

- `https://parrit.ai/rendez-vous` répond 404 ; `https://parrit.ai/fr/rendez-vous` répond 301 vers `/rendez-vous`, donc 404.
- Les CTA `rdv.*` et `prototype.demander` de `src/lib/registry/cta.ts` visent `/{lang}/rendez-vous`, et `buildRdvHref` (`src/lib/attribution.ts`) construit `/${lang}/rendez-vous`. Les deux mènent au 404, et `/en/...` n'existe pas : l'anglais vit sur des URL nues.
- `BOOKING_URL` (`calendar.app.google/...`) est un lien mort.
- Un article (`src/app/(rev01)/journal/[slug]/page.tsx`) finit sur « À lire ensuite », sans aucun moyen de prendre rendez-vous.
- Une page thème (`src/app/(rev01)/journal/themes/[theme]/page.tsx`) finit sur le bouton « Parler d'un projet » vers `/#contact`, à l'autre bout de l'accueil.
- Le calendrier existant est `ParritCalInline` (`src/system/components/CalInline.tsx`) : `paul-larmaraud/audit` en français, `paul-larmaraud/ai-strategy-meeting` en anglais (`site.config.ts`). On le garde tel quel.

## Changements

### 1. La page `/rendez-vous` (FR : `/fr/rendez-vous`)

- Nouvelle route dans `src/app/(rev01)/`, bilingue selon le mécanisme existant de `src/system/locale.ts` et `src/proxy.ts` (`TRANSLATED_PATHS`, `localizedPath`). Elle remplace le 404 sur les deux URL, et `src/proxy.ts` doit la couvrir (matcher).
- Contenu, dans cet ordre : un H1, une phrase, le calendrier `ParritCalInline` dans la langue de la page, puis le repli e-mail.
  - FR : H1 « Entretien stratégique IA, 15 minutes ». Phrase : « 15 minutes avec Paul Larmaraud pour clarifier votre sujet. Vous repartez avec une première piste, et vous décidez de la suite. » Repli : « Vous préférez écrire ? paul.larmaraud@parrit.ai » (lien `mailto:`).
  - EN : H1 « AI strategy call, 15 minutes ». Phrase : « 15 minutes with Paul Larmaraud to clarify your topic. You leave with a first lead, and you decide what comes next. » Repli : « Prefer to write? paul.larmaraud@parrit.ai ».
- `robots` : `noindex, follow`. La page n'entre pas au sitemap.
- Construite avec `src/system/` uniquement : aucun hex, aucun nouveau style hors jetons, aucun rayon, aucune ombre.

### 2. L'origine du rendez-vous jusqu'à Cal.com

- La page lit `source` et les `utm_*` de sa chaîne de requête et les transmet au calendrier, sans cookie ni stockage.
- Mécanisme attendu : les paramètres de configuration de l'intégration Cal.com sont passés en paramètres de l'URL de réservation. Utiliser `metadata[source]` pour `source` et garder les `utm_*` tels quels. **À vérifier dans `node_modules/@calcom/embed-react` et `@calcom/embed-core`, ne pas supposer.** Si le paquet ne permet pas de transmettre ces paramètres, s'arrêter et le dire dans le compte rendu, sans contournement.
- Une valeur de `source` est filtrée : `[a-z0-9-]{1,80}`, sinon elle est ignorée.
- `ParritCalInline` accepte une prop optionnelle pour ces paramètres. Sans elle, l'accueil garde exactement le comportement actuel.

### 3. Les liens vers `/rendez-vous`

- Dans `cta.ts`, la cible des CTA `rdv.*` et `prototype.demander` devient `/rendez-vous`, langue appliquée par `localizedPath` : `/rendez-vous` en anglais, `/fr/rendez-vous` en français. La même correction s'applique à `buildRdvHref`. `avecSource()` reste l'unique point qui pose `?source=`.
- `BOOKING_URL` est supprimé s'il n'a plus d'usage, sinon il pointe sur `/rendez-vous`. Corriger le commentaire qui le dit canonique.

### 4. Le bloc d'appel : un composant unique

Nouveau composant dans `src/system/components/`, utilisé en fin d'article et de page thème. Il comporte quatre éléments, et rien d'autre : pas de fenêtre surgissante, pas de compte à rebours, pas de rareté, pas de témoignage, pas de prix, pas de mot « offert » ni « gratuit ».

- FR :
  - titre (H2) : « Si vous souhaitez en savoir plus, rencontrons-nous. »
  - phrase : « 15 minutes avec Paul Larmaraud pour clarifier votre sujet. Vous repartez avec une première piste, et vous décidez de la suite. »
  - bouton `.rev-button.exec` : « Choisir un créneau », vers `/fr/rendez-vous?source=<origine>`
  - repli : « Vous préférez écrire ? paul.larmaraud@parrit.ai », en lien `mailto:` neutre
- EN :
  - titre : « If you'd like to know more, let's meet. »
  - phrase : « 15 minutes with Paul Larmaraud to clarify your topic. You leave with a first lead, and you decide what comes next. »
  - bouton : « Pick a time », vers `/rendez-vous?source=<origine>`
  - repli : « Prefer to write? paul.larmaraud@parrit.ai »
- `<origine>` vaut `journal-<slug>` pour un article et `theme-<theme>` pour une page thème.
- Langue : celle de l'interface de la page (`getLocale()`), avec `lang` posé sur le bloc. Le contenu anglais d'un article garde son `lang="en"`.
- Placement : dans un article, après le corps et avant « À lire ensuite ». Dans une page thème, il remplace la dernière section, le bouton « Parler d'un projet » vers `/#contact`.
- Le bouton reste le seul `exec` de la page (un seul éclat rose par écran). Règles du tour 1 des boutons : largeur de contenu dès 600 px, pas de point final.

### 5. Règles du dépôt, amendées dans le même geste

- `AGENTS.md` : ajouter en tête une section datée « Appel de 15 minutes, décision de Paul du 08/11/2026 ». Elle résume les points 1 à 4 et précise que, hors de l'accueil, la destination de rendez-vous est `/rendez-vous`. Les règles « Parler d'un projet » de l'accueil et du hero restent inchangées.
- `TRUTH.md` : là où le rôle du site dit « rendez-vous possible sans maximisation », écrire que la prise de rendez-vous est l'objectif mesuré, par `source`, sans pression ni promesse.
- Une PR concurrente (#363) touche aussi `AGENTS.md` et `TRUTH.md`. Modifier seulement les passages cités ici, pour qu'une fusion reste simple.

## Banc (tests à ajouter)

Respecter la règle réseau du dépôt : deny-all, aucune requête réelle vers Cal.com, SDK et iframe servis localement comme dans `tests/stabilite.spec.ts`.

- `/rendez-vous` et `/fr/rendez-vous` répondent 200, avec un H1 unique dans la bonne langue, le repli `mailto:` et `noindex`.
- `/fr/rendez-vous?source=journal-test&utm_source=x` : l'URL du calendrier demandée (iframe ou requête interceptée) porte `metadata[source]=journal-test` et `utm_source=x`. Une `source` invalide (`<script>`, plus de 80 caractères) n'est pas transmise.
- Un article et une page thème, en FR et en EN :
  - le bloc est présent une seule fois, après le corps ;
  - le lien du bouton vaut `…/rendez-vous?source=journal-<slug>` ou `theme-<theme>`, et sa destination répond 200 ;
  - la page n'a qu'un seul `.exec` ;
  - le texte du bloc ne contient ni « offert », ni « gratuit », ni « € », ni compte à rebours.
- Tous les CTA du registre qui visent le rendez-vous résolvent vers une route qui existe, en FR et en EN.
- L'accueil est inchangé : le calendrier de `#reservation` et ses tests existants passent sans modification.
- Captures 1440 et 375 du bloc et de `/rendez-vous`, sans débordement horizontal (contrôles existants de marque et de géométrie).

## Vérification

`npm ci`, `npm run lint`, build Webpack, `npm test`, `npm run qa:brand:rev01`. Le navigateur est refusé par le bac à sable de Codex : Claude rejoue `qa:network:rev01` sur l'hôte. Ne rien revendiquer de réel côté Cal.com.

## Bornes

Une relecture et une correction au plus, puis retour à Paul avec les captures. Ne pas toucher l'accueil, FormIA, `llms.txt`, la mise en page des articles ni la chaîne de publication du Journal.
