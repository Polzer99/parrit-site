# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/parrit-premium-qa.spec.ts >> tablet 820x1180 >> home keeps Parrit DA runtime clean
- Location: tests/parrit-premium-qa.spec.ts:361:11

# Error details

```
Error: no public doctrine banned copy

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "POC",
+ ]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - img [ref=e5]
        - img "Parrit·ai" [ref=e6]
      - paragraph [ref=e7]: AI operating partners · on demand
      - heading "Passez de l'IA qui discute à l'IA qui agit." [level=1] [ref=e8]
      - paragraph [ref=e9]: Vos partenaires d'exploitation IA, à la demande. On installe des agents qui travaillent dans vos workflows. Vous gardez la main, ils font le travail. Des humains réels, qui ont déjà déployé pour de vrai.
      - generic [ref=e10]:
        - link "Réserver un diagnostic de faisabilité" [ref=e11] [cursor=pointer]:
          - /url: /diagnostic?source=home-diagnostic
          - text: Réserver un diagnostic de faisabilité
          - generic [ref=e12]: →
        - link "Parler à Paul" [ref=e13] [cursor=pointer]:
          - /url: /fr/rendez-vous?source=home-parler-paul
          - text: Parler à Paul
          - generic [ref=e14]: →
    - region "On déploie avec vos équipes, pas à distance." [ref=e15]:
      - generic [ref=e16]:
        - generic [ref=e17]:
          - paragraph [ref=e18]: 01 · Sur le terrain
          - heading "On déploie avec vos équipes, pas à distance." [level=2] [ref=e19]
          - paragraph [ref=e20]: "Cartographie des workflows, acculturation, prise de parole : on installe l'IA au contact de vos équipes, dans vos murs."
        - figure "Atelier · acculturation IA" [ref=e21]:
          - img "Atelier · acculturation IA" [ref=e22]
          - generic [ref=e23]: Atelier · acculturation IA
    - region "Qui est derrière" [ref=e24]:
      - generic [ref=e25]:
        - paragraph [ref=e26]: Paul + le réseau
        - heading "Qui est derrière" [level=2] [ref=e27]
      - generic [ref=e28]:
        - article [ref=e29]:
          - img "Paul Larmaraud" [ref=e30]
          - generic [ref=e31]:
            - heading "Paul Larmaraud" [level=3] [ref=e32]
            - paragraph [ref=e33]: Fondateur
            - paragraph [ref=e34]: Un agent en production lui prend une journée.
        - generic [ref=e35]:
          - paragraph [ref=e36]: Autour de lui, une vingtaine d'experts, moitié métier, moitié technique. Ils mettent l'IA entre les mains de vos équipes, règlent le harnais, et elle se met à bosser pour elles.
          - paragraph [ref=e37]: Le jour où vous n'avez plus besoin de nous, c'est gagné.
      - link "Rencontrer les fondateurs →" [ref=e38] [cursor=pointer]:
        - /url: /fondateurs
    - region "Vous posez le cas. On rend le résultat." [ref=e39]:
      - generic [ref=e40]:
        - paragraph [ref=e41]: Input → Output
        - heading "Vous posez le cas. On rend le résultat." [level=2] [ref=e42]
        - paragraph [ref=e43]: "On prend l'entrée, on rend la sortie. Faisabilité, cadrage, mise en œuvre : ça se passe derrière."
        - generic [ref=e44]:
          - generic [ref=e45]:
            - generic [ref=e46]: Input
            - paragraph [ref=e48]: Un CRM rempli à la main.
          - generic [ref=e52]: 速
          - generic [ref=e53]:
            - generic [ref=e54]: Output
            - paragraph
        - paragraph [ref=e56]: On prend le cas, on dit si c'est faisable et en combien de temps.
    - region "Pas des slides. Des agents qui tournent en production." [ref=e57]:
      - generic [ref=e58]:
        - paragraph [ref=e59]: 02 · Catalogue
        - heading "Pas des slides. Des agents qui tournent en production." [level=2] [ref=e60]
        - paragraph [ref=e61]: Des systèmes opérationnels sur vos fonctions clés, avec un périmètre défini, des accès encadrés et un responsable. Vous gardez le contrôle et la traçabilité.
      - generic [ref=e62]:
        - article [ref=e63]:
          - heading "Commercial & Ventes" [level=3] [ref=e66]
          - generic [ref=e67]:
            - generic [ref=e68]: Acquisition signal-first
            - generic [ref=e69]: signaux publics d'intention → séquences perso → RDV qualifiés, 24/7.
            - generic [ref=e70]: courtage énergie B2B
        - article [ref=e71]:
          - heading "Relation client & SAV" [level=3] [ref=e74]
          - generic [ref=e75]:
            - generic [ref=e76]: Capture multicanal
            - generic [ref=e77]: WhatsApp, site, appel, formulaire regroupés → CRM + relance auto.
            - generic [ref=e78]: artisanat
        - article [ref=e79]:
          - heading "Finance & Gestion" [level=3] [ref=e82]
          - generic [ref=e83]:
            - generic [ref=e84]: Facturation & suivi
            - generic [ref=e85]: factures émises, heures décomptées, relance des impayés automatisée.
            - generic [ref=e86]: services
        - article [ref=e87]:
          - heading "RH & Formation" [level=3] [ref=e90]
          - generic [ref=e91]:
            - generic [ref=e92]: Formation agentique
            - generic [ref=e93]: "session animée + toolkit : vos équipes deviennent autonomes."
            - generic [ref=e94]: cosmétique
      - link "Posez votre cas" [ref=e96] [cursor=pointer]:
        - /url: /diagnostic?source=home-catalog
        - text: Posez votre cas
        - generic [ref=e97]: →
    - region "Trois façons de mettre l'IA au travail chez vous." [ref=e98]:
      - generic [ref=e99]:
        - paragraph [ref=e100]: 03 · Nos offres
        - heading "Trois façons de mettre l'IA au travail chez vous." [level=2] [ref=e101]
      - generic [ref=e102]:
        - article [ref=e103]:
          - paragraph [ref=e104]:
            - generic [ref=e105]: "01"
            - generic [ref=e106]: Transformation IA
          - heading "Faire de l'IA un levier, pas des POC." [level=3] [ref=e107]
          - paragraph [ref=e108]: On cartographie, on déploie les agents qui comptent, on forme vos équipes. De bout en bout, jusqu'à ce que ça tourne sans nous.
          - list [ref=e109]:
            - listitem [ref=e110]: → Audit
            - listitem [ref=e111]: → Cas d'usage prioritaires
            - listitem [ref=e112]: → Déploiement
            - listitem [ref=e113]: → Passation
          - paragraph [ref=e114]: Pour les directions métiers.
          - link "Découvrir la Transformation →" [ref=e115] [cursor=pointer]:
            - /url: /fr/croissance
        - article [ref=e116]:
          - paragraph [ref=e117]:
            - generic [ref=e118]: "02"
            - generic [ref=e119]: Agent IA
          - heading "Un agent en production. Vite." [level=3] [ref=e120]
          - paragraph [ref=e121]: Votre cas, votre entrée, votre sortie. On prototype, on vous dit si c'est faisable et en combien de temps. Les premiers prototypes sont offerts.
          - list [ref=e122]:
            - listitem [ref=e123]: → Le cas
            - listitem [ref=e124]: → L'input
            - listitem [ref=e125]: → L'output
            - listitem [ref=e126]: → En production
          - paragraph [ref=e127]: Pour les DSI et les équipes ops.
          - link "Découvrir le déploiement d'agent →" [ref=e128] [cursor=pointer]:
            - /url: /fr/deployer
        - article [ref=e129]:
          - paragraph [ref=e130]:
            - generic [ref=e131]: "03"
            - generic [ref=e132]: Coaching & Formation
          - heading "Vos équipes prennent l'agentique en main." [level=3] [ref=e133]
          - paragraph [ref=e134]: "De la découverte au hands-on : prendre Claude Code en main, même sans profil technique. 100 % agentique. Certifié Qualiopi."
          - list [ref=e135]:
            - listitem [ref=e136]: → Claude Code + Codex
            - listitem [ref=e137]: → Ateliers hands-on
            - listitem [ref=e138]: → 100 % agentique
            - listitem [ref=e139]: → Qualiopi
          - paragraph [ref=e140]: Pour les DRH.
          - link "Découvrir la formation →" [ref=e141] [cursor=pointer]:
            - /url: /fr/transmettre
      - paragraph [ref=e142]: La bonne porte dépend de votre cas. On vous oriente.
    - generic [ref=e143]:
      - paragraph [ref=e144]: La veille
      - heading "Les news IA qui comptent, chaque semaine." [level=2] [ref=e145]
      - paragraph [ref=e146]: Ce qui sort, ce qui marche, et ce qu'on en fait chez nos clients. Décrypté simplement, sans hype.
      - generic [ref=e147]:
        - textbox "votre@email.pro" [ref=e148]
        - button "Recevoir la veille" [ref=e149]: Recevoir la veille →
    - generic [ref=e150]:
      - img [ref=e151]
      - heading "On en parle 15 minutes ?" [level=2] [ref=e152]
      - paragraph [ref=e153]: On part de votre cas concret. Le diagnostic établit ce qui est faisable, dans quel périmètre et en combien de temps.
      - link "Réserver un diagnostic de faisabilité" [ref=e154] [cursor=pointer]:
        - /url: /diagnostic?source=home-diagnostic
        - text: Réserver un diagnostic de faisabilité
        - generic [ref=e155]: →
    - generic [ref=e156]:
      - text: © 2026 SASU PARRIT.AI · Rueil-Malmaison ·
      - link "Mentions légales" [ref=e157] [cursor=pointer]:
        - /url: /fr/mentions-legales
      - text: ·
      - link "Confidentialité" [ref=e158] [cursor=pointer]:
        - /url: /fr/confidentialite
  - alert [ref=e159]
```

# Test source

```ts
  338 | for (const locale of locales) {
  339 |   for (const redirect of legacyRedirects) {
  340 |     test(`${locale}${redirect.from} permanently redirects to ${locale}${redirect.to}`, async ({
  341 |       request,
  342 |     }) => {
  343 |       const response = await request.get(
  344 |         new URL(`/${locale}${redirect.from}`, BASE_URL).toString(),
  345 |         { maxRedirects: 0 },
  346 |       );
  347 | 
  348 |       expect(response.status(), "legacy redirect status").toBe(301);
  349 |       expect(response.headers().location, "legacy redirect target").toBe(
  350 |         `/${locale}${redirect.to}`,
  351 |       );
  352 |     });
  353 |   }
  354 | }
  355 | 
  356 | for (const viewport of viewports) {
  357 |   test.describe(`${viewport.slug} ${viewport.width}x${viewport.height}`, () => {
  358 |     test.use({ viewport });
  359 | 
  360 |     for (const route of pages) {
  361 |       test(`${route.slug} keeps Parrit DA runtime clean`, async ({ page, browserName }) => {
  362 |         const jsErrors: string[] = [];
  363 |         page.on("pageerror", (error) => jsErrors.push(error.message));
  364 |         page.on("console", (message) => {
  365 |           if (message.type() === "error") jsErrors.push(message.text());
  366 |         });
  367 | 
  368 |         await page.goto(new URL(route.path, BASE_URL).toString(), {
  369 |           waitUntil: "networkidle",
  370 |         });
  371 |         await page.evaluate(() => document.fonts.ready);
  372 |         await page.waitForTimeout(500);
  373 | 
  374 |         const audit = await page.evaluate(() => {
  375 |           const oldFontFamilies = Array.from(document.fonts)
  376 |             .map((font) => font.family)
  377 |             .filter((family) =>
  378 |               /DM Sans|Cormorant Garamond|Hanken Grotesk|JetBrains Mono|Poppins/i.test(
  379 |                 family,
  380 |               ),
  381 |             );
  382 | 
  383 |           const documentElement = document.documentElement;
  384 |           const horizontalOverflow =
  385 |             Math.max(documentElement.scrollWidth, document.body.scrollWidth) -
  386 |             documentElement.clientWidth;
  387 | 
  388 |           const bodyText = document.body.innerText;
  389 |           const bannedCopyMatches = [
  390 |             /\bPOCs?\b/iu,
  391 |             /\bchatbots?\b/iu,
  392 |             /\bjours-homme\b/iu,
  393 |             /\bprompts?\b/iu,
  394 |             /\bexp[ée]rimentations?\b/iu,
  395 |             /\bSur devis\b/iu,
  396 |             /—/u,
  397 |           ]
  398 |             .map((regex) => bodyText.match(regex)?.[0])
  399 |             .filter((value): value is string => Boolean(value));
  400 | 
  401 |           const metadata = {
  402 |             bodyFontFamily: getComputedStyle(document.body).fontFamily,
  403 |             ogUrl:
  404 |               document
  405 |                 .querySelector('meta[property="og:url"]')
  406 |                 ?.getAttribute("content") ?? "",
  407 |             ogImage:
  408 |               document
  409 |                 .querySelector('meta[property="og:image"]')
  410 |                 ?.getAttribute("content") ?? "",
  411 |             twitterImage:
  412 |               document
  413 |                 .querySelector('meta[name="twitter:image"]')
  414 |                 ?.getAttribute("content") ?? "",
  415 |           };
  416 | 
  417 |           const runtimeUrls = [
  418 |             location.href,
  419 |             ...Array.from(document.querySelectorAll("[href],[src],[action]"))
  420 |               .flatMap((node) => [
  421 |                 node.getAttribute("href"),
  422 |                 node.getAttribute("src"),
  423 |                 node.getAttribute("action"),
  424 |               ])
  425 |               .filter((value): value is string => Boolean(value)),
  426 |             ...performance.getEntriesByType("resource").map((entry) => entry.name),
  427 |           ];
  428 | 
  429 |           return {
  430 |             bannedCopyMatches,
  431 |             metadata,
  432 |             oldFontFamilies,
  433 |             horizontalOverflow,
  434 |             vercelUrls: runtimeUrls.filter((url) => /\.vercel\.app/i.test(url)),
  435 |           };
  436 |         });
  437 | 
> 438 |         expect(audit.bannedCopyMatches, "no public doctrine banned copy").toEqual([]);
      |                                                                           ^ Error: no public doctrine banned copy
  439 |         expect(audit.metadata.bodyFontFamily, "body uses Geist").toContain("Geist");
  440 |         expect(audit.metadata.ogUrl, "canonical social URL").toMatch(
  441 |           /^https:\/\/parrit\.ai(\/|$)/,
  442 |         );
  443 |         expect(audit.metadata.ogImage, "canonical Open Graph image").toBe(
  444 |           expectedSocialImage,
  445 |         );
  446 |         expect(audit.metadata.twitterImage, "canonical Twitter image").toBe(
  447 |           expectedSocialImage,
  448 |         );
  449 |         expect(audit.oldFontFamilies, "no old font families loaded").toEqual([]);
  450 |         expect(audit.horizontalOverflow, "no horizontal overflow").toBeLessThanOrEqual(1);
  451 |         expect(audit.vercelUrls, "no runtime *.vercel.app URL").toEqual([]);
  452 |         expect(jsErrors, "no JavaScript errors").toEqual([]);
  453 |         if (route.expectedText) {
  454 |           await expect(page.locator("body"), "expected localized body copy").toContainText(
  455 |             route.expectedText,
  456 |           );
  457 |         }
  458 | 
  459 |         await page.screenshot({
  460 |           path: `artifacts/qa/${browserName}-${route.slug}-${viewport.slug}.png`,
  461 |           fullPage: true,
  462 |         });
  463 | 
  464 |         if (
  465 |           browserName === "chromium" &&
  466 |           route.reviewArtifact &&
  467 |           (viewport.slug === "desktop" || viewport.slug === "mobile")
  468 |         ) {
  469 |           await page.screenshot({
  470 |             path: `artifacts/${route.slug}-${viewport.slug}-fr.png`,
  471 |             fullPage: true,
  472 |           });
  473 |         }
  474 |       });
  475 |     }
  476 |   });
  477 | }
  478 | 
```