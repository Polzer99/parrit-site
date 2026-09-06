# CODEX-SPEC · 2026-09-07 · GEO/SEO (audit 7 dimensions du 06/09 soir)

Contexte : mandat Paul « que ça ranke, GEO à fond, référencé en anglais
aussi ». Audit complet fait (7 agents, live + code). Deux lots : A part en
prod cette nuit (technique, zéro changement visuel), B part en PR OUVERTE
(migration d'URLs, GO Paul au réveil).

## LOT A · Correctifs techniques (zéro changement de rendu visible)

1. **Journal : retirer le hreflang menteur.** Dans
   src/app/(rev01)/journal/(route slug)/page.tsx, ne plus appeler
   localizedAlternates() : garder un canonical auto-référent + hreflang
   en + x-default uniquement (le corps des 25 entrées est en anglais ;
   aucune traduction n'existe). Même traitement sur la page /journal si
   elle annonce fr-FR pour des contenus non traduits, NON : /journal a un
   chrome réellement traduit, la garder telle quelle.
2. **Home : métadonnées localisées.** Ajouter generateMetadata() à
   src/app/(rev01)/page.tsx sur le modèle des autres pages (getLocale) :
   FR title « Parrit.ai · Systèmes d'exploitation d'entreprise »,
   description FR « Parrit.ai construit des systèmes IA depuis trois ans,
   chez des grands comptes, des PME et des ETI : votre entreprise,
   examinée, reconstruite opération par opération, à vous pour de bon. » ;
   EN inchangé (celui du layout). Conserver alternates existants.
3. **BlogPosting enrichi** (la page article du journal) : ajouter image (URL de
   l'opengraph-image de l'entrée), dateModified (= date), inLanguage
   « en », publisher Organization « Parrit.ai » avec logo ImageObject
   (https://parrit.ai/icon.png).
4. **openGraph + twitter des articles** (generateMetadata de la page article) :
   openGraph { title, description, type "article", publishedTime
   entry.date, siteName "Parrit.ai", url canonical } · twitter { card
   "summary_large_image" }.
5. **RSS découvrable** : alternates.types application/rss+xml →
   /journal/rss.xml (titre « Parrit Journal ») dans generateMetadata de
   /journal ET du layout (rev01).
6. **Sémantique citable** : sur /standard, chaque principe PS-0x passe de
   div stylée à un vrai titre (h3 avec le constat) sans AUCUN changement
   de rendu (adapter les sélecteurs CSS existants aux h3, mêmes tailles,
   mêmes graisses) ; idem /manufacture pour les 3 noms de phase. Ajouter
   sur /standard un JSON-LD ItemList des six engagements (position, name,
   description).
7. **llms-full.txt** : nouvelle route src/app/llms-full.txt/route.ts qui
   concatène en texte brut toutes les entrées non-noindex
   (getAllJournalEntries, titre + date + description + corps markdown
   dépouillé), triées par date décroissante, précédées de l'en-tête du
   llms.txt existant. Cache s-maxage 1h.
8. **hreflang générique** : dans src/system/locale.ts, fr-FR devient fr
   (partout où le cluster est généré).
9. **sitemap lastmod honnête** : dans src/app/sitemap.ts, remplacer new
   Date() par une table de dates par route : / , /manufacture, /standard,
   /dossiers, /commission = 2026-09-06 ; /legal = 2026-09-02 ; /journal =
   date de l'entrée la plus récente. Les entrées gardent leur date.
10. **Meta descriptions étoffées** (DICT des pages, invisible à l'écran) :
    - /standard FR « Six engagements sur chaque système livré : état
      lisible à tout moment, décisions cadrées et chiffrées, retour
      arrière écrit d'avance, propriété complète du client. » / EN « Six
      commitments on every system we deliver: state readable at any
      moment, framed decisions, the way back written in advance, full
      client ownership. »
    - /commission FR « Toute commande commence par un examen : trente
      minutes en visio avec le fondateur, un périmètre écrit ou un non
      clair. Choisissez un créneau. » / EN « Every commission begins with
      an examination: thirty minutes on a video call with the founder, a
      written scope or a clear no. Select a time. »
    - /dossiers FR « Des systèmes commandés par des grands comptes, des
      PME et des ETI, anonymisés par principe. Les chiffres se vérifient
      en direct, dossier par dossier. » / EN « Systems commissioned by
      large accounts, SMEs and mid-sized companies, anonymized on
      principle. Figures verified live, dossier by dossier. »
11. **Cache interim** : ajouter l'en-tête Vary: Accept-Language, Cookie
    aux réponses des pages localisées (via proxy.ts) ; dans
    next.config.ts, images.minimumCacheTTL = 2678400 (31 jours) et un
    header Cache-Control long (public, max-age=31536000, immutable) pour
    /founder-portrait.jpg.
12. **Code mort** : supprimer RegisterInterest.tsx + son export (plus
    rendu nulle part depuis PR#229) et purger du catalogue EventName les
    événements jamais émis nulle part dans le dépôt (vérifier par grep
    chacun : resource_requested, meeting_requested, conversation_started,
    opportunity_created, deal_linked, persona_inferred, problem_viewed,
    page_viewed ; n'en retirer un que si zéro émission).

Qualité LOT A : lint · tsc · qa:brand:rev01 (le build et qa:network chez
l'hôte). Verrous de conformité recalés si besoin, jamais supprimés.
Rapport .codex-report-geo-a.md.

## LOT B · Migration /fr (BRANCHE SÉPARÉE, PR ouverte, pas de merge)

Objectif : une langue = une URL. L'anglais reste sur les URLs nues
(canonical auto-référent, hreflang en + x-default). Le français vit sous
/fr/* (canonical auto-référent /fr/..., hreflang fr), contenu identique aux
rendus FR actuels.

- Routing : segment ou rewrite via src/proxy.ts : les chemins /fr et
  /fr/<page> servent le rendu FR des pages (rev01) SANS dupliquer les
  composants (le proxy pose la locale fr pour ces chemins ; getLocale lit
  d'abord le chemin, puis le cookie, puis Accept-Language).
- Négociation : sur URL nue, PLUS de variation de contenu par en-tête :
  l'URL nue sert TOUJOURS l'anglais. Un visiteur dont Accept-Language
  préfère le français et qui arrive sur une URL nue est redirigé 302 vers
  /fr/<chemin> (redirection de négociation, jamais appliquée aux bots
  connus ni quand un cookie de choix existe). La bascule FR/EN du header
  navigue entre /chemin et /fr/chemin et pose le cookie de choix.
- ?lang=fr → 301 vers /fr/<chemin> ; ?lang=en → 301 vers <chemin> nu.
- hreflang : chaque paire se référence mutuellement + s'auto-référence ;
  x-default = URL nue. Journal : PAS de /fr (contenu EN), donc pas
  d'alternate fr sur les articles.
- sitemap : les deux jeux d'URLs (nues + /fr pour les 6 pages traduites).
- metadata : title/description/OG localisés par chemin.
- Aucun changement visuel : mêmes rendus qu'aujourd'hui.

Qualité LOT B : mêmes gates + un test Playwright nouveau
tests/conformity-i18n.spec.ts : /fr sert le FR (html lang=fr, H1 FR,
canonical /fr auto-référent), URL nue sert l'EN même avec Accept-Language
fr en présence du user-agent Googlebot, ?lang=fr redirige 301, hreflang
réciproques présents. Rapport .codex-report-geo-b.md.

## Interdits (les deux lots)

Aucune commande git. Aucun changement de schéma de base. Aucun secret.
content/journal/*.mdx INTACTS (le chantier contenu (traductions, tags,
maillage) est un lot éditorial séparé, pas celui-ci). Zéro cadratin.
