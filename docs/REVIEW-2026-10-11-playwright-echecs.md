# Échecs Playwright constatés par Claude sur la PR #313 (next start :3210)

```
## 1) [chromium] › tests/aeration.spec.ts:119:7 › at 390px all routes keep text clear and within the closed type scale 
    Error: Timeout 20000ms exceeded while waiting on the predicate
      145 |           await page.locator('.agent-esquisse-form button[type="submit"]').click();
      146 |           await expect(page.locator("#quick-idee")).toHaveValue("reporting");
    > 147 |         }).toPass({ timeout: 20_000 });
          |            ^
      148 |         // The click above leaves Chromium's focus-visible modality in "pointer" mode,
      149 |         // which suppresses the accent outline on the next programmatically focused
      150 |         // control even though a real keyboard user would still see it. A harmless Tab
        at /Users/paullarmaraud/codex-work/handoff-docs-CODEX-SPEC-2026-10-11-parrit-ai-alignement-an/tests/aeration.spec.ts:147:12
    Error Context: test-results/tests-aeration-at-390px-al-e9a67-ithin-the-closed-type-scale-chromium/error-context.md

## 2) [chromium] › tests/alignment-grid.spec.ts:7:7 › shared grid en /journal 1440 ──────────────────
    Error: expect(received).toBeLessThanOrEqual(expected)
    Expected: <= 24
    Received:    182.359375
      26 |     expect(box!.x).toBeCloseTo(left, 0);
      27 |     for (const element of await page.locator(".journal-list time, .doctrine-code .k").all()) {
    > 28 |       expect((await element.boundingBox())!.height).toBeLessThanOrEqual(24);
         |                                                     ^
      29 |     }
      30 |     if (!route) {
      31 |       const note = (await page.locator(".home-s-close-note").boundingBox())!;
        at /Users/paullarmaraud/codex-work/handoff-docs-CODEX-SPEC-2026-10-11-parrit-ai-alignement-an/tests/alignment-grid.spec.ts:28:53
    Error Context: test-results/tests-alignment-grid-shared-grid-en-journal-1440-chromium/error-context.md

## 3) [chromium] › tests/alignment-grid.spec.ts:7:7 › shared grid fr /journal 1440 ──────────────────
    Error: expect(received).toBeLessThanOrEqual(expected)
    Expected: <= 24
    Received:    182.359375
      26 |     expect(box!.x).toBeCloseTo(left, 0);
      27 |     for (const element of await page.locator(".journal-list time, .doctrine-code .k").all()) {
    > 28 |       expect((await element.boundingBox())!.height).toBeLessThanOrEqual(24);
         |                                                     ^
      29 |     }
      30 |     if (!route) {
      31 |       const note = (await page.locator(".home-s-close-note").boundingBox())!;
        at /Users/paullarmaraud/codex-work/handoff-docs-CODEX-SPEC-2026-10-11-parrit-ai-alignement-an/tests/alignment-grid.spec.ts:28:53
    Error Context: test-results/tests-alignment-grid-shared-grid-fr-journal-1440-chromium/error-context.md

## 4) [chromium] › tests/brand-os.spec.ts:25:9 › Brand OS text contrast and capture /manufacture at 375px 
    Error: expect(received).toBeLessThanOrEqual(expected)
    Expected: <= 375
    Received:    519
      36 |       if (width === 375) {
      37 |         expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    > 38 |         expect(await page.evaluate(() => document.body.scrollWidth)).toBeLessThanOrEqual(width);
         |                                                                      ^
      39 |       }
      40 |       await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/opengraph-image(?:[?.]|$)/);
      41 |       await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
        at /Users/paullarmaraud/codex-work/handoff-docs-CODEX-SPEC-2026-10-11-parrit-ai-alignement-an/tests/brand-os.spec.ts:38:70
    Error Context: test-results/tests-brand-os-Brand-OS-te-da351-apture-manufacture-at-375px-chromium/error-context.md

## 5) [chromium] › tests/brand-os.spec.ts:25:9 › Brand OS text contrast and capture /fr/manufacture at 375px 
    Error: expect(received).toBeLessThanOrEqual(expected)
    Expected: <= 375
    Received:    494
      36 |       if (width === 375) {
      37 |         expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    > 38 |         expect(await page.evaluate(() => document.body.scrollWidth)).toBeLessThanOrEqual(width);
         |                                                                      ^
      39 |       }
      40 |       await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/opengraph-image(?:[?.]|$)/);
      41 |       await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
        at /Users/paullarmaraud/codex-work/handoff-docs-CODEX-SPEC-2026-10-11-parrit-ai-alignement-an/tests/brand-os.spec.ts:38:70
    Error Context: test-results/tests-brand-os-Brand-OS-te-3d25e-ure-fr-manufacture-at-375px-chromium/error-context.md

## 6) [chromium] › tests/brand-os.spec.ts:136:9 › Brand OS approved founder photo, caption and heading / at 375px 
    Error: expect(locator).toHaveText(expected) failed
    Locator:  locator('h1').locator('.frame')
    Expected: "systems that work"
    Received: "systems that work."
    Timeout:  5000ms
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for locator('h1').locator('.frame')
        14 × locator resolved to <span class="frame">…</span>
           - unexpected value "systems that work."
      174 |       await expect(h1.locator(".frame")).toHaveCSS("display", "inline-block");
      175 |       await expect(h1.locator(".frame")).toHaveCSS("white-space", width <= 760 ? "normal" : "nowrap");
    > 176 |       await expect(h1.locator(".frame")).toHaveText(route === "/fr" ? "systèmes qui fonctionnent" : "systems that work");
          |                                          ^
      177 |       const ending = h1.locator(".home-s-hero-ending");
      178 |       await expect(ending).toHaveCSS("display", "block");
      179 |       const headingBox = await h1.boundingBox();

## 7) [chromium] › tests/brand-os.spec.ts:136:9 › Brand OS approved founder photo, caption and heading /fr at 375px 
    Error: expect(locator).toHaveText(expected) failed
    Locator:  locator('h1').locator('.frame')
    Expected: "systèmes qui fonctionnent"
    Received: "systèmes qui fonctionnent."
    Timeout:  5000ms
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for locator('h1').locator('.frame')
        14 × locator resolved to <span class="frame">…</span>
           - unexpected value "systèmes qui fonctionnent."
      174 |       await expect(h1.locator(".frame")).toHaveCSS("display", "inline-block");
      175 |       await expect(h1.locator(".frame")).toHaveCSS("white-space", width <= 760 ? "normal" : "nowrap");
    > 176 |       await expect(h1.locator(".frame")).toHaveText(route === "/fr" ? "systèmes qui fonctionnent" : "systems that work");
          |                                          ^
      177 |       const ending = h1.locator(".home-s-hero-ending");
      178 |       await expect(ending).toHaveCSS("display", "block");
      179 |       const headingBox = await h1.boundingBox();

## 8) [chromium] › tests/brand-os.spec.ts:136:9 › Brand OS approved founder photo, caption and heading / at 390px 
    Error: expect(locator).toHaveText(expected) failed
    Locator:  locator('h1').locator('.frame')
    Expected: "systems that work"
    Received: "systems that work."
    Timeout:  5000ms
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for locator('h1').locator('.frame')
        14 × locator resolved to <span class="frame">…</span>
           - unexpected value "systems that work."
      174 |       await expect(h1.locator(".frame")).toHaveCSS("display", "inline-block");
      175 |       await expect(h1.locator(".frame")).toHaveCSS("white-space", width <= 760 ? "normal" : "nowrap");
    > 176 |       await expect(h1.locator(".frame")).toHaveText(route === "/fr" ? "systèmes qui fonctionnent" : "systems that work");
          |                                          ^
      177 |       const ending = h1.locator(".home-s-hero-ending");
      178 |       await expect(ending).toHaveCSS("display", "block");
      179 |       const headingBox = await h1.boundingBox();

## 9) [chromium] › tests/brand-os.spec.ts:136:9 › Brand OS approved founder photo, caption and heading /fr at 390px 
    Error: expect(locator).toHaveText(expected) failed
    Locator:  locator('h1').locator('.frame')
    Expected: "systèmes qui fonctionnent"
    Received: "systèmes qui fonctionnent."
    Timeout:  5000ms
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for locator('h1').locator('.frame')
        14 × locator resolved to <span class="frame">…</span>
           - unexpected value "systèmes qui fonctionnent."
      174 |       await expect(h1.locator(".frame")).toHaveCSS("display", "inline-block");
      175 |       await expect(h1.locator(".frame")).toHaveCSS("white-space", width <= 760 ? "normal" : "nowrap");
    > 176 |       await expect(h1.locator(".frame")).toHaveText(route === "/fr" ? "systèmes qui fonctionnent" : "systems that work");
          |                                          ^
      177 |       const ending = h1.locator(".home-s-hero-ending");
      178 |       await expect(ending).toHaveCSS("display", "block");
      179 |       const headingBox = await h1.boundingBox();

## 10) [chromium] › tests/brand-os.spec.ts:136:9 › Brand OS approved founder photo, caption and heading / at 768px 
    Error: expect(locator).toHaveText(expected) failed
    Locator:  locator('h1').locator('.frame')
    Expected: "systems that work"
    Received: "systems that work."
    Timeout:  5000ms
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for locator('h1').locator('.frame')
        14 × locator resolved to <span class="frame">…</span>
           - unexpected value "systems that work."
      174 |       await expect(h1.locator(".frame")).toHaveCSS("display", "inline-block");
      175 |       await expect(h1.locator(".frame")).toHaveCSS("white-space", width <= 760 ? "normal" : "nowrap");
    > 176 |       await expect(h1.locator(".frame")).toHaveText(route === "/fr" ? "systèmes qui fonctionnent" : "systems that work");
          |                                          ^
      177 |       const ending = h1.locator(".home-s-hero-ending");
      178 |       await expect(ending).toHaveCSS("display", "block");
      179 |       const headingBox = await h1.boundingBox();

## 11) [chromium] › tests/brand-os.spec.ts:136:9 › Brand OS approved founder photo, caption and heading /fr at 768px 
    Error: expect(locator).toHaveText(expected) failed
    Locator:  locator('h1').locator('.frame')
    Expected: "systèmes qui fonctionnent"
    Received: "systèmes qui fonctionnent."
    Timeout:  5000ms
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for locator('h1').locator('.frame')
        14 × locator resolved to <span class="frame">…</span>
           - unexpected value "systèmes qui fonctionnent."
      174 |       await expect(h1.locator(".frame")).toHaveCSS("display", "inline-block");
      175 |       await expect(h1.locator(".frame")).toHaveCSS("white-space", width <= 760 ? "normal" : "nowrap");
    > 176 |       await expect(h1.locator(".frame")).toHaveText(route === "/fr" ? "systèmes qui fonctionnent" : "systems that work");
          |                                          ^
      177 |       const ending = h1.locator(".home-s-hero-ending");
      178 |       await expect(ending).toHaveCSS("display", "block");
      179 |       const headingBox = await h1.boundingBox();

## 12) [chromium] › tests/brand-os.spec.ts:136:9 › Brand OS approved founder photo, caption and heading / at 1440px 
    Error: expect(locator).toHaveText(expected) failed
    Locator:  locator('h1').locator('.frame')
    Expected: "systems that work"
    Received: "systems that work."
    Timeout:  5000ms
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for locator('h1').locator('.frame')
        14 × locator resolved to <span class="frame">…</span>
           - unexpected value "systems that work."
      174 |       await expect(h1.locator(".frame")).toHaveCSS("display", "inline-block");
      175 |       await expect(h1.locator(".frame")).toHaveCSS("white-space", width <= 760 ? "normal" : "nowrap");
    > 176 |       await expect(h1.locator(".frame")).toHaveText(route === "/fr" ? "systèmes qui fonctionnent" : "systems that work");
          |                                          ^
      177 |       const ending = h1.locator(".home-s-hero-ending");
      178 |       await expect(ending).toHaveCSS("display", "block");
      179 |       const headingBox = await h1.boundingBox();

## 13) [chromium] › tests/brand-os.spec.ts:136:9 › Brand OS approved founder photo, caption and heading /fr at 1440px 
    Error: expect(locator).toHaveText(expected) failed
    Locator:  locator('h1').locator('.frame')
    Expected: "systèmes qui fonctionnent"
    Received: "systèmes qui fonctionnent."
    Timeout:  5000ms
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for locator('h1').locator('.frame')
        14 × locator resolved to <span class="frame">…</span>
           - unexpected value "systèmes qui fonctionnent."
      174 |       await expect(h1.locator(".frame")).toHaveCSS("display", "inline-block");
      175 |       await expect(h1.locator(".frame")).toHaveCSS("white-space", width <= 760 ? "normal" : "nowrap");
    > 176 |       await expect(h1.locator(".frame")).toHaveText(route === "/fr" ? "systèmes qui fonctionnent" : "systems that work");
          |                                          ^
      177 |       const ending = h1.locator(".home-s-hero-ending");
      178 |       await expect(ending).toHaveCSS("display", "block");
      179 |       const headingBox = await h1.boundingBox();

## 14) [chromium] › tests/conformity-home.spec.ts:213:7 › dossier titles describe operations in en ──
    Error: expect(locator).toHaveText(expected) failed
    Locator: locator('.r2-registre-note')
    Expected: "They are read in a meeting, on request."
    Timeout: 5000ms
    Error: element(s) not found
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for locator('.r2-registre-note')
      224 |       "We sell the system we run on.",
      225 |     ]);
    > 226 |     await expect(page.locator(".r2-registre-note")).toHaveText(locale === "fr"
          |                                                     ^
      227 |       ? "Ils se lisent en rendez-vous, sur demande."
      228 |       : "They are read in a meeting, on request.");
      229 |     await testInfo.attach(`dossiers-copy-${locale}-1440`, {
        at /Users/paullarmaraud/codex-work/handoff-docs-CODEX-SPEC-2026-10-11-parrit-ai-alignement-an/tests/conformity-home.spec.ts:226:53
    Error Context: test-results/tests-conformity-home-doss-5b002-s-describe-operations-in-en-chromium/error-context.md

## 15) [chromium] › tests/conformity-home.spec.ts:213:7 › dossier titles describe operations in fr ──
    Error: expect(locator).toHaveText(expected) failed
    Locator: locator('.r2-registre-note')
    Expected: "Ils se lisent en rendez-vous, sur demande."
    Timeout: 5000ms
    Error: element(s) not found
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for locator('.r2-registre-note')
      224 |       "We sell the system we run on.",
      225 |     ]);
    > 226 |     await expect(page.locator(".r2-registre-note")).toHaveText(locale === "fr"
          |                                                     ^
      227 |       ? "Ils se lisent en rendez-vous, sur demande."
      228 |       : "They are read in a meeting, on request.");
      229 |     await testInfo.attach(`dossiers-copy-${locale}-1440`, {
        at /Users/paullarmaraud/codex-work/handoff-docs-CODEX-SPEC-2026-10-11-parrit-ai-alignement-an/tests/conformity-home.spec.ts:226:53
    Error Context: test-results/tests-conformity-home-doss-8b62b-s-describe-operations-in-fr-chromium/error-context.md

## 16) [chromium] › tests/conformity-journal.spec.ts:61:5 › journal article renders its registry-line footer 
    Error: expect(locator).toHaveText(expected) failed
    Locator: locator('.journal-article-footer .registry-line')
    Expected pattern: /^WE FIND THE WAY · \d{4}-\d{2}-\d{2} · PARRIT \/ JOURNAL$/
    Received string:  "PARRIT / JOURNAL · 2026"
    Timeout: 5000ms
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for locator('.journal-article-footer .registry-line')
        14 × locator resolved to <span class="k registry-line">PARRIT / JOURNAL · 2026</span>
           - unexpected value "PARRIT / JOURNAL · 2026"
      62 |   await page.goto(`${BASE_URL}/journal/one-card-one-action`);
      63 |
    > 64 |   await expect(page.locator(".journal-article-footer .registry-line")).toHaveText(
         |                                                                        ^
      65 |     /^WE FIND THE WAY · \d{4}-\d{2}-\d{2} · PARRIT \/ JOURNAL$/,
      66 |   );
      67 | });

## 17) [chromium] › tests/doctrine-visible.spec.ts:244:7 › doctrine Build With You booking is above the fold fr 
    Error: expect(locator).toHaveText(expected) failed
    Locator:  locator('.build-with-you-hero').locator('.doctrine-note')
    Expected: "Examen offert de 15 minutes, avec le fondateur"
    Received: "Examen offert · 15 min · En visio, avec le fondateur"
    Timeout:  5000ms
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for locator('.build-with-you-hero').locator('.doctrine-note')
        14 × locator resolved to <p class="doctrine-note">Examen offert · 15 min · En visio, avec le fondat…</p>
           - unexpected value "Examen offert · 15 min · En visio, avec le fondateur"
      253 |     expect(bounds!.y).toBeGreaterThanOrEqual(0);
      254 |     expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(844);
    > 255 |     await expect(hero.locator(".doctrine-note")).toHaveText(locale === "fr" ? "Examen offert de 15 minutes, avec le fondateur" : "Free 15-minute examination with the founder");
          |                                                  ^
      256 |     await expect(hero.locator(".doctrine-note")).toHaveCSS("font-size", "16px");
      257 |     await expect(hero.locator(".offer-price")).toHaveCount(0);
      258 |     await expect(page.locator(".r2-close .offer-price")).toHaveCount(1);

## 18) [chromium] › tests/doctrine-visible.spec.ts:244:7 › doctrine Build With You booking is above the fold en 
    Error: expect(locator).toHaveText(expected) failed
    Locator:  locator('.build-with-you-hero').locator('.doctrine-note')
    Expected: "Free 15-minute examination with the founder"
    Received: "Free examination · 15 min · Video call with the founder"
    Timeout:  5000ms
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for locator('.build-with-you-hero').locator('.doctrine-note')
        14 × locator resolved to <p class="doctrine-note">Free examination · 15 min · Video call with the f…</p>
           - unexpected value "Free examination · 15 min · Video call with the founder"
      253 |     expect(bounds!.y).toBeGreaterThanOrEqual(0);
      254 |     expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(844);
    > 255 |     await expect(hero.locator(".doctrine-note")).toHaveText(locale === "fr" ? "Examen offert de 15 minutes, avec le fondateur" : "Free 15-minute examination with the founder");
          |                                                  ^
      256 |     await expect(hero.locator(".doctrine-note")).toHaveCSS("font-size", "16px");
      257 |     await expect(hero.locator(".offer-price")).toHaveCount(0);
      258 |     await expect(page.locator(".r2-close .offer-price")).toHaveCount(1);

## 19) [chromium] › tests/product-scene.spec.ts:8:9 › product scene fr 375 ──────────────────────────
    Error: locator.evaluate: TypeError: Cannot read properties of null (reading 'getBoundingClientRect')
        at box (eval at evaluate (:303:30), <anonymous>:3:47)
        at eval (eval at evaluate (:303:30), <anonymous>:16:20)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at box (eval at evaluate (:303:30), <anonymous>:3:47)
        at eval (eval at evaluate (:303:30), <anonymous>:16:20)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at /Users/paullarmaraud/codex-work/handoff-docs-CODEX-SPEC-2026-10-11-parrit-ai-alignement-an/tests/product-scene.spec.ts:88:38
    Error Context: test-results/tests-product-scene-product-scene-fr-375-chromium/error-context.md

## 20) [chromium] › tests/product-scene.spec.ts:8:9 › product scene fr 768 ──────────────────────────
    Error: locator.evaluate: TypeError: Cannot read properties of null (reading 'getBoundingClientRect')
        at box (eval at evaluate (:303:30), <anonymous>:3:47)
        at eval (eval at evaluate (:303:30), <anonymous>:16:20)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at box (eval at evaluate (:303:30), <anonymous>:3:47)
        at eval (eval at evaluate (:303:30), <anonymous>:16:20)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at /Users/paullarmaraud/codex-work/handoff-docs-CODEX-SPEC-2026-10-11-parrit-ai-alignement-an/tests/product-scene.spec.ts:88:38
    Error Context: test-results/tests-product-scene-product-scene-fr-768-chromium/error-context.md

## 21) [chromium] › tests/product-scene.spec.ts:8:9 › product scene fr 1024 ─────────────────────────
    Error: locator.evaluate: TypeError: Cannot read properties of null (reading 'getBoundingClientRect')
        at box (eval at evaluate (:303:30), <anonymous>:3:47)
        at eval (eval at evaluate (:303:30), <anonymous>:16:20)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at box (eval at evaluate (:303:30), <anonymous>:3:47)
        at eval (eval at evaluate (:303:30), <anonymous>:16:20)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at /Users/paullarmaraud/codex-work/handoff-docs-CODEX-SPEC-2026-10-11-parrit-ai-alignement-an/tests/product-scene.spec.ts:88:38
    Error Context: test-results/tests-product-scene-product-scene-fr-1024-chromium/error-context.md

## 22) [chromium] › tests/product-scene.spec.ts:8:9 › product scene fr 1025 ─────────────────────────
    Error: locator.evaluate: TypeError: Cannot read properties of null (reading 'getBoundingClientRect')
        at box (eval at evaluate (:303:30), <anonymous>:3:47)
        at eval (eval at evaluate (:303:30), <anonymous>:16:20)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at box (eval at evaluate (:303:30), <anonymous>:3:47)
        at eval (eval at evaluate (:303:30), <anonymous>:16:20)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at /Users/paullarmaraud/codex-work/handoff-docs-CODEX-SPEC-2026-10-11-parrit-ai-alignement-an/tests/product-scene.spec.ts:88:38
    Error Context: test-results/tests-product-scene-product-scene-fr-1025-chromium/error-context.md

## 23) [chromium] › tests/product-scene.spec.ts:8:9 › product scene fr 1440 ─────────────────────────
    Error: locator.evaluate: TypeError: Cannot read properties of null (reading 'getBoundingClientRect')
        at box (eval at evaluate (:303:30), <anonymous>:3:47)
        at eval (eval at evaluate (:303:30), <anonymous>:16:20)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at box (eval at evaluate (:303:30), <anonymous>:3:47)
        at eval (eval at evaluate (:303:30), <anonymous>:16:20)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at /Users/paullarmaraud/codex-work/handoff-docs-CODEX-SPEC-2026-10-11-parrit-ai-alignement-an/tests/product-scene.spec.ts:88:38
    Error Context: test-results/tests-product-scene-product-scene-fr-1440-chromium/error-context.md

## 24) [chromium] › tests/product-scene.spec.ts:8:9 › product scene en 375 ──────────────────────────
    Error: locator.evaluate: TypeError: Cannot read properties of null (reading 'getBoundingClientRect')
        at box (eval at evaluate (:303:30), <anonymous>:3:47)
        at eval (eval at evaluate (:303:30), <anonymous>:16:20)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at box (eval at evaluate (:303:30), <anonymous>:3:47)
        at eval (eval at evaluate (:303:30), <anonymous>:16:20)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at /Users/paullarmaraud/codex-work/handoff-docs-CODEX-SPEC-2026-10-11-parrit-ai-alignement-an/tests/product-scene.spec.ts:88:38
    Error Context: test-results/tests-product-scene-product-scene-en-375-chromium/error-context.md

## 25) [chromium] › tests/product-scene.spec.ts:8:9 › product scene en 768 ──────────────────────────
    Error: locator.evaluate: TypeError: Cannot read properties of null (reading 'getBoundingClientRect')
        at box (eval at evaluate (:303:30), <anonymous>:3:47)
        at eval (eval at evaluate (:303:30), <anonymous>:16:20)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at box (eval at evaluate (:303:30), <anonymous>:3:47)
        at eval (eval at evaluate (:303:30), <anonymous>:16:20)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at /Users/paullarmaraud/codex-work/handoff-docs-CODEX-SPEC-2026-10-11-parrit-ai-alignement-an/tests/product-scene.spec.ts:88:38
    Error Context: test-results/tests-product-scene-product-scene-en-768-chromium/error-context.md

## 26) [chromium] › tests/product-scene.spec.ts:8:9 › product scene en 1024 ─────────────────────────
    Error: locator.evaluate: TypeError: Cannot read properties of null (reading 'getBoundingClientRect')
        at box (eval at evaluate (:303:30), <anonymous>:3:47)
        at eval (eval at evaluate (:303:30), <anonymous>:16:20)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at box (eval at evaluate (:303:30), <anonymous>:3:47)
        at eval (eval at evaluate (:303:30), <anonymous>:16:20)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at /Users/paullarmaraud/codex-work/handoff-docs-CODEX-SPEC-2026-10-11-parrit-ai-alignement-an/tests/product-scene.spec.ts:88:38
    Error Context: test-results/tests-product-scene-product-scene-en-1024-chromium/error-context.md

## 27) [chromium] › tests/product-scene.spec.ts:8:9 › product scene en 1025 ─────────────────────────
    Error: locator.evaluate: TypeError: Cannot read properties of null (reading 'getBoundingClientRect')
        at box (eval at evaluate (:303:30), <anonymous>:3:47)
        at eval (eval at evaluate (:303:30), <anonymous>:16:20)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at box (eval at evaluate (:303:30), <anonymous>:3:47)
        at eval (eval at evaluate (:303:30), <anonymous>:16:20)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at /Users/paullarmaraud/codex-work/handoff-docs-CODEX-SPEC-2026-10-11-parrit-ai-alignement-an/tests/product-scene.spec.ts:88:38
    Error Context: test-results/tests-product-scene-product-scene-en-1025-chromium/error-context.md

## 28) [chromium] › tests/product-scene.spec.ts:8:9 › product scene en 1440 ─────────────────────────
    Error: locator.evaluate: TypeError: Cannot read properties of null (reading 'getBoundingClientRect')
        at box (eval at evaluate (:303:30), <anonymous>:3:47)
        at eval (eval at evaluate (:303:30), <anonymous>:16:20)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at box (eval at evaluate (:303:30), <anonymous>:3:47)
        at eval (eval at evaluate (:303:30), <anonymous>:16:20)
        at UtilityScript.evaluate (<anonymous>:305:16)
        at UtilityScript.<anonymous> (<anonymous>:1:44)
        at /Users/paullarmaraud/codex-work/handoff-docs-CODEX-SPEC-2026-10-11-parrit-ai-alignement-an/tests/product-scene.spec.ts:88:38
    Error Context: test-results/tests-product-scene-product-scene-en-1440-chromium/error-context.md

## 29) [chromium] › tests/systems.spec.ts:9:9 › systems en at 375px ─────────────────────────────────
    Error: expect(locator).toHaveText(expected) failed
    Locator:  getByRole('table').locator('caption time')
    Expected: "2026-09-13"
    Received: "September 13, 2026"
    Timeout:  5000ms
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for getByRole('table').locator('caption time')
        14 × locator resolved to <time datetime="2026-09-13">September 13, 2026</time>
           - unexpected value "September 13, 2026"
      31 |       const table = page.getByRole("table");
      32 |       await expect(table).toBeVisible();
    > 33 |       await expect(table.locator("caption time")).toHaveText("2026-09-13");
         |                                                   ^
      34 |       await expect(table.locator("tbody tr")).toHaveCount(7);
      35 |       await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "Prospection commerciale" : "Outreach");
      36 |       await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "En cours de transfert" : "Being transferred");

## 30) [chromium] › tests/systems.spec.ts:9:9 › systems fr at 375px ─────────────────────────────────
    Error: expect(locator).toHaveText(expected) failed
    Locator:  getByRole('table').locator('caption time')
    Expected: "2026-09-13"
    Received: "13 septembre 2026"
    Timeout:  5000ms
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for getByRole('table').locator('caption time')
        14 × locator resolved to <time datetime="2026-09-13">13 septembre 2026</time>
           - unexpected value "13 septembre 2026"
      31 |       const table = page.getByRole("table");
      32 |       await expect(table).toBeVisible();
    > 33 |       await expect(table.locator("caption time")).toHaveText("2026-09-13");
         |                                                   ^
      34 |       await expect(table.locator("tbody tr")).toHaveCount(7);
      35 |       await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "Prospection commerciale" : "Outreach");
      36 |       await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "En cours de transfert" : "Being transferred");

## 31) [chromium] › tests/systems.spec.ts:9:9 › systems en at 767px ─────────────────────────────────
    Error: expect(locator).toHaveText(expected) failed
    Locator:  getByRole('table').locator('caption time')
    Expected: "2026-09-13"
    Received: "September 13, 2026"
    Timeout:  5000ms
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for getByRole('table').locator('caption time')
        14 × locator resolved to <time datetime="2026-09-13">September 13, 2026</time>
           - unexpected value "September 13, 2026"
      31 |       const table = page.getByRole("table");
      32 |       await expect(table).toBeVisible();
    > 33 |       await expect(table.locator("caption time")).toHaveText("2026-09-13");
         |                                                   ^
      34 |       await expect(table.locator("tbody tr")).toHaveCount(7);
      35 |       await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "Prospection commerciale" : "Outreach");
      36 |       await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "En cours de transfert" : "Being transferred");

## 32) [chromium] › tests/systems.spec.ts:9:9 › systems fr at 767px ─────────────────────────────────
    Error: expect(locator).toHaveText(expected) failed
    Locator:  getByRole('table').locator('caption time')
    Expected: "2026-09-13"
    Received: "13 septembre 2026"
    Timeout:  5000ms
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for getByRole('table').locator('caption time')
        14 × locator resolved to <time datetime="2026-09-13">13 septembre 2026</time>
           - unexpected value "13 septembre 2026"
      31 |       const table = page.getByRole("table");
      32 |       await expect(table).toBeVisible();
    > 33 |       await expect(table.locator("caption time")).toHaveText("2026-09-13");
         |                                                   ^
      34 |       await expect(table.locator("tbody tr")).toHaveCount(7);
      35 |       await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "Prospection commerciale" : "Outreach");
      36 |       await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "En cours de transfert" : "Being transferred");

## 33) [chromium] › tests/systems.spec.ts:9:9 › systems en at 768px ─────────────────────────────────
    Error: expect(locator).toHaveText(expected) failed
    Locator:  getByRole('table').locator('caption time')
    Expected: "2026-09-13"
    Received: "September 13, 2026"
    Timeout:  5000ms
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for getByRole('table').locator('caption time')
        14 × locator resolved to <time datetime="2026-09-13">September 13, 2026</time>
           - unexpected value "September 13, 2026"
      31 |       const table = page.getByRole("table");
      32 |       await expect(table).toBeVisible();
    > 33 |       await expect(table.locator("caption time")).toHaveText("2026-09-13");
         |                                                   ^
      34 |       await expect(table.locator("tbody tr")).toHaveCount(7);
      35 |       await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "Prospection commerciale" : "Outreach");
      36 |       await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "En cours de transfert" : "Being transferred");

## 34) [chromium] › tests/systems.spec.ts:9:9 › systems fr at 768px ─────────────────────────────────
    Error: expect(locator).toHaveText(expected) failed
    Locator:  getByRole('table').locator('caption time')
    Expected: "2026-09-13"
    Received: "13 septembre 2026"
    Timeout:  5000ms
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for getByRole('table').locator('caption time')
        14 × locator resolved to <time datetime="2026-09-13">13 septembre 2026</time>
           - unexpected value "13 septembre 2026"
      31 |       const table = page.getByRole("table");
      32 |       await expect(table).toBeVisible();
    > 33 |       await expect(table.locator("caption time")).toHaveText("2026-09-13");
         |                                                   ^
      34 |       await expect(table.locator("tbody tr")).toHaveCount(7);
      35 |       await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "Prospection commerciale" : "Outreach");
      36 |       await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "En cours de transfert" : "Being transferred");

## 35) [chromium] › tests/systems.spec.ts:9:9 › systems en at 1440px ────────────────────────────────
    Error: expect(locator).toHaveText(expected) failed
    Locator:  getByRole('table').locator('caption time')
    Expected: "2026-09-13"
    Received: "September 13, 2026"
    Timeout:  5000ms
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for getByRole('table').locator('caption time')
        14 × locator resolved to <time datetime="2026-09-13">September 13, 2026</time>
           - unexpected value "September 13, 2026"
      31 |       const table = page.getByRole("table");
      32 |       await expect(table).toBeVisible();
    > 33 |       await expect(table.locator("caption time")).toHaveText("2026-09-13");
         |                                                   ^
      34 |       await expect(table.locator("tbody tr")).toHaveCount(7);
      35 |       await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "Prospection commerciale" : "Outreach");
      36 |       await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "En cours de transfert" : "Being transferred");

## 36) [chromium] › tests/systems.spec.ts:9:9 › systems fr at 1440px ────────────────────────────────
    Error: expect(locator).toHaveText(expected) failed
    Locator:  getByRole('table').locator('caption time')
    Expected: "2026-09-13"
    Received: "13 septembre 2026"
    Timeout:  5000ms
    Call log:
      - Expect "toHaveText" with timeout 5000ms
      - waiting for getByRole('table').locator('caption time')
        14 × locator resolved to <time datetime="2026-09-13">13 septembre 2026</time>
           - unexpected value "13 septembre 2026"
      31 |       const table = page.getByRole("table");
      32 |       await expect(table).toBeVisible();
    > 33 |       await expect(table.locator("caption time")).toHaveText("2026-09-13");
         |                                                   ^
      34 |       await expect(table.locator("tbody tr")).toHaveCount(7);
      35 |       await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "Prospection commerciale" : "Outreach");
      36 |       await expect(table.locator("tbody tr").nth(2)).toContainText(locale === "fr" ? "En cours de transfert" : "Being transferred");
```
