import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
test.use({ serviceWorkers: "block" });
test.beforeEach(async ({ page }) => {
  await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  // Only the expected booking embed is simulated; all other external traffic fails.
  await page.route("https://app.cal.com/**", (route) => route.fulfill({ contentType: "text/html", body: "" }));
  await page.route("https://cal.com/**", (route) => route.fulfill({ contentType: "text/html", body: "" }));
});

for (const locale of ["fr", "en"] as const) {
  const prefix = locale === "fr" ? "/fr" : "";
  const label = locale === "fr" ? "Réserver l'examen" : "Book the examination";
  test(`doctrine header accent without JavaScript ${locale}`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, serviceWorkers: "block", extraHTTPHeaders: { "Accept-Language": "en" } });
    const blocked: string[] = [];
    await context.route("**/*", async (route) => {
      if (["localhost", "127.0.0.1"].includes(new URL(route.request().url()).hostname)) return route.continue();
      blocked.push(route.request().url());
      await route.abort("blockedbyclient");
    });
    try {
      const page = await context.newPage();
      await page.goto(`${BASE_URL}${prefix || "/"}`);
      await expect(page.locator(".cmd-cta")).toHaveClass(/\bghost\b/);
      await page.goto(`${BASE_URL}${prefix}/build-with-you`);
      await expect(page.locator(".cmd-cta")).toHaveClass(/\bexec\b/);
    } finally {
      await context.close();
      expect(blocked, "No external requests without JavaScript").toEqual([]);
    }
  });
  for (const route of ["", "/manufacture", "/standard", "/dossiers", "/systems", "/build-with-you", "/commission", "/journal", "/legal"]) {
    test(`doctrine booking label and button typography ${locale} ${route || "/"}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`${BASE_URL}${prefix}${route || (prefix ? "" : "/")}`);
      await page.evaluate(() => document.fonts.ready);
      const actions = page.locator('a.rev-button[href$="/commission"]');
      expect(await actions.count()).toBeGreaterThan(0);
      for (const action of await actions.all()) await expect(action).toHaveText(label);
      for (const button of await page.locator(".rev-button:visible").all()) {
        await expect(button).toHaveCSS("font-family", /General Sans/);
        await expect(button).toHaveCSS("font-weight", "600");
        await expect(button).toHaveCSS("text-transform", "none");
        await expect(button).toHaveCSS("letter-spacing", "normal");
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await page.locator(".cmd-menu-toggle").click();
      const mobile = page.locator(".cmd-panel-cta");
      await expect(mobile).toHaveText(label);
      await expect(mobile).toHaveCSS("font-family", /General Sans/);
      await expect(mobile).toHaveCSS("text-transform", "none");
    });
  }

  test(`doctrine booking after capture success ${locale}`, async ({ page }) => {
    let submissions = 0;
    await page.route("**/api/**", async (route) => {
      expect(new URL(route.request().url()).pathname).toBe("/api/interet");
      expect(route.request().method()).toBe("POST");
      submissions += 1;
      await route.fulfill({ json: { ok: true } });
    });
    await page.goto(`${BASE_URL}${prefix}/commission`);
    const capture = page.locator(".quick-capture");
    await capture.locator('input[type="email"]').fill("doctrine@example.invalid");
    await capture.locator('button[type="submit"]').click();
    await expect(capture).toHaveAttribute("data-state", "done");
    const booking = capture.getByRole("link", { name: label, exact: true });
    await expect(booking).toHaveAttribute("href", `${prefix}/commission`);
    await expect(booking).toHaveCSS("font-family", /General Sans/);
    await expect(booking).toHaveCSS("text-transform", "none");
    expect(submissions).toBe(1);
  });

  for (const width of [1440, 390]) {
    test(`doctrine home composition and language ${locale} ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`${BASE_URL}${prefix || "/"}`);
      await page.evaluate(() => document.fonts.ready);
      const journey = page.locator(".home-s-maison-copy");
      await expect(journey.locator("img")).toHaveCount(0);
      await expect(journey.locator(":scope > .k")).toHaveCount(1);
      await expect(journey).not.toContainText(locale === "fr" ? "Paul Larmaraud · Fondateur" : "Paul Larmaraud · Founder");
      await expect(journey.locator(".rev-button.ghost")).toHaveText(label);
      await expect(journey.locator('a[href="https://paul-larmaraud.com"]')).not.toHaveClass(/rev-button/);
      // AV-3 / FIX1: on desktop the photo and copy form one composition.
      // Preserve the original copy-only checks on mobile and without a photo.
      const grid = page.locator(".home-s-maison-grid");
      const hasPhoto = await grid.locator("img:visible").count() > 0;
      const composition = width > 859 && hasPhoto ? grid : journey;
      const geometry = await composition.evaluate((element) => {
        const parent = element.parentElement!.getBoundingClientRect();
        const box = element.getBoundingClientRect();
        return Math.abs(box.x + box.width / 2 - parent.x - parent.width / 2);
      });
      expect(geometry).toBeLessThanOrEqual(1);
      if (width === 1440) {
        const measure = await composition.evaluate((element) => {
          const heading = element.querySelector("h2")!;
          const build = document.querySelector(".home-s-build > .home-s-wrap")!;
          return {
            width: element.getBoundingClientRect().width,
            referenceWidth: build.getBoundingClientRect().width,
            lines: heading.getBoundingClientRect().height / parseFloat(getComputedStyle(heading).lineHeight),
          };
        });
        expect(Math.abs(measure.width - measure.referenceWidth)).toBeLessThanOrEqual(1);
        // AV-3 / FIX2: the photo narrows the copy; keep three lines without it.
        expect(measure.lines).toBeLessThanOrEqual(hasPhoto ? 4.01 : 3.01);
      }
      for (const paragraph of await journey.locator("p").all()) {
        const measure = await paragraph.evaluate((element) => {
          const probe = document.createElement("span");
          probe.style.cssText = "display:block;width:56ch;font:inherit";
          element.append(probe);
          const expectedWidth = parseFloat(getComputedStyle(probe).width);
          const maxWidth = parseFloat(getComputedStyle(element).maxWidth);
          probe.remove();
          return { expectedWidth, maxWidth };
        });
        // CSS serialization and layout round fractional pixels differently.
        expect(Math.abs(measure.maxWidth - measure.expectedWidth)).toBeLessThanOrEqual(1);
      }
      for (const prose of await page.locator(".home-s-proof-item span, .doctrine-note").all()) {
        await expect(prose).toHaveCSS("font-family", /General Sans/);
        await expect(prose).toHaveCSS("text-transform", "none");
        await expect(prose).toHaveCSS("letter-spacing", "normal");
        await expect(prose).toHaveCSS("font-size", await prose.evaluate((el) => el.matches(".home-s-proof-item span") ? "18px" : "14px"));
      }
      for (const kicker of await page.locator(".home-s-build .k, .home-s-maison .k").all()) {
        await expect(kicker).toHaveCSS("font-family", /IBM Plex Mono/);
      }
      await expect(page.locator(".home-s-offers .rev-button.ghost")).toHaveCount(2);
      const offerTitle = page.locator(".offer-card h3").first();
      for (const heading of await page.locator(".home-s-proof-item h3").all()) {
        for (const property of ["font-size", "line-height"]) {
          await expect(heading).toHaveCSS(property, await offerTitle.evaluate((el, prop) => getComputedStyle(el).getPropertyValue(prop), property));
        }
      }
      const journal = page.locator(".home-s-journal");
      await expect(journal.getByText("Articles en anglais.", { exact: true })).toHaveCount(locale === "fr" ? 1 : 0);
      expect(await journal.locator("li a").count()).toBeGreaterThan(0);
      for (const article of await journal.locator("li a").all()) {
        await expect(article).toHaveAttribute("hreflang", "en");
        await expect(article.locator("span")).toHaveAttribute("lang", "en");
      }
      await expect(page.locator(".home-s-close-note")).toHaveCSS("font-family", /General Sans/);
      await expect(page.locator(".home-s-close-note")).toHaveCSS("text-transform", "none");
    });

    for (const route of ["", "/build-with-you"]) {
      test(`doctrine one pink accent in every viewport ${locale} ${route || "/"} ${width}`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 844 });
        await page.goto(`${BASE_URL}${prefix}${route || (prefix ? "" : "/")}`);
        await page.evaluate(() => document.fonts.ready);
        const headerAction = page.locator(".cmd-cta");
        await expect(headerAction).toHaveClass(route ? /\bexec\b/ : /\bghost\b/);
        // Include the shared header and the hero frame, even though it is not a fill.
        // Check all possible vertical overlaps, not only selected scroll positions.
        const accents = await page.evaluate(() => {
          const probe = document.createElement("span");
          probe.style.backgroundColor = "var(--brand-core-rose)";
          document.body.append(probe);
          const pink = getComputedStyle(probe).backgroundColor;
          probe.remove();
          const markerGroups = new Map<Element, { label: string; top: number; bottom: number }>();
          const individual = [...document.querySelectorAll("body *")].flatMap((element) => {
            const style = getComputedStyle(element);
            const bounds = element.getBoundingClientRect();
            const frame = element.matches(".home-s-hero .frame") && getComputedStyle(element, "::before").borderColor === pink;
            if (!bounds.width || !bounds.height || style.visibility === "hidden" || style.display === "none" || Number(style.opacity) === 0) return [];
            if (!frame && style.backgroundColor !== pink) return [];
            // VS-PRODUCT-SCENE: only numbered markers within the same scene
            // form one accent. Keep their full extent to catch other pink fills.
            const scene = element.matches(".scene-marker") ? element.closest(".product-scene") : null;
            if (scene) {
              const previous = markerGroups.get(scene);
              markerGroups.set(scene, {
                label: `product-scene marker group ${[...document.querySelectorAll(".product-scene")].indexOf(scene)}`,
                top: Math.min(previous?.top ?? Infinity, bounds.top + scrollY),
                bottom: Math.max(previous?.bottom ?? -Infinity, bounds.bottom + scrollY),
              });
              return [];
            }
            return [{ label: `${element.tagName}.${element.className}`, top: bounds.top + scrollY, bottom: bounds.bottom + scrollY }];
          });
          return [...individual, ...markerGroups.values()];
        });
        await testInfo.attach("pink-accents", { body: JSON.stringify(accents, null, 2), contentType: "application/json" });
        expect(accents.length).toBeGreaterThan(0);
        for (let i = 0; i < accents.length; i++) {
          for (const other of accents.slice(i + 1)) {
            const gap = Math.max(accents[i].top, other.top) - Math.min(accents[i].bottom, other.bottom);
            expect(gap, `${accents[i].label} and ${other.label} share a viewport`).toBeGreaterThanOrEqual(844);
          }
        }
        if (!route) {
          // W-66: observe the whole hero, including when only its bottom remains.
          const heroBottom = await page.locator(".home-s-hero").evaluate((el) => el.getBoundingClientRect().bottom + scrollY);
          await page.evaluate((y) => window.scrollTo(0, y - 10), heroBottom);
          await expect(headerAction).toHaveClass(/\bghost\b/);
          await page.evaluate((y) => window.scrollTo(0, y + 1), heroBottom);
          await expect(headerAction).toHaveClass(/\bexec\b/);
          await page.evaluate(() => window.scrollTo(0, 0));
          await expect(headerAction).toHaveClass(/\bghost\b/);
          // Shared layouts survive client navigation; the observer must not leak.
          await page.locator('.home-s-offers a[href$="/build-with-you"]').click();
          await expect(page).toHaveURL(new RegExp(`${prefix}/build-with-you$`));
          await expect(headerAction).toHaveClass(/\bexec\b/);
          await page.locator(".wordmark").click();
          await expect(page.locator(".home-s-hero")).toBeVisible();
          await expect(headerAction).toHaveClass(/\bghost\b/);
        }
      });
    }
  }

  test(`doctrine Build With You booking is above the fold ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}${prefix}/build-with-you`);
    await page.evaluate(() => document.fonts.ready);
    const hero = page.locator(".build-with-you-hero");
    const button = hero.getByRole("link", { name: label, exact: true });
    await expect(button).toBeVisible();
    const bounds = await button.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(844);
    await expect(hero.locator(".doctrine-note")).toHaveText(locale === "fr" ? "Examen offert de 15 minutes, avec le fondateur" : "Free 15-minute examination with the founder");
    await expect(hero.locator(".doctrine-note")).toHaveCSS("font-size", "14px");
    await expect(hero.locator(".offer-price")).toHaveCount(0);
    await expect(page.locator(".r2-close .offer-price")).toHaveCount(1);
    await expect(page.locator('[aria-labelledby="build-next"] > a')).toHaveText(locale === "fr" ? "Réserver un examen pour un système sur mesure" : "Book an examination for a custom system");
  });
}

for (const width of [1440, 390]) {
  for (const route of ["/fr", "/fr/build-with-you", "/fr/commission"]) {
    test(`doctrine FR capture ${route} ${width}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`${BASE_URL}${route}`);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      if (route.endsWith("commission")) await expect(page.locator(".cal-instrument")).toHaveCSS("box-shadow", "none");
      await testInfo.attach(`doctrine-${route.replaceAll("/", "-")}-${width}`, {
        body: await page.screenshot({ fullPage: true, animations: "disabled" }), contentType: "image/png",
      });
    });
  }
}
