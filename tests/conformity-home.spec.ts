import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";

test.use({ serviceWorkers: "block", viewport: { width: 1440, height: 900 } });

test("the home locks the approved display scale and surface rules", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${BASE_URL}/`);

  // Opening retiré sur décision Paul 06/09

  const h1FontSize = await page.getByRole("heading", { level: 1 }).evaluate((heading) =>
    Number.parseFloat(getComputedStyle(heading).fontSize),
  );
  // Approved scale comes from the simplified home in docs/CODEX-SPEC-2026-09-04-home-simple.md.
  expect(h1FontSize).toBeGreaterThanOrEqual(82);
  expect(h1FontSize).toBeLessThanOrEqual(86);

  const surfaceRules = await page.locator("*").evaluateAll((elements) =>
    elements.reduce(
      (result, element) => {
        const style = getComputedStyle(element);
        if (style.boxShadow !== "none") result.shadowCount += 1;
        // Canon exception: radius is allowed inside phone mockups only.
        const insidePhoneMockup = element.closest("[data-phone-mockup]") !== null;
        if (
          !insidePhoneMockup &&
          [
            style.borderTopLeftRadius,
            style.borderTopRightRadius,
            style.borderBottomRightRadius,
            style.borderBottomLeftRadius,
          ].some((radius) => Number.parseFloat(radius) > 0)
        ) {
          result.radiusCount += 1;
        }
        return result;
      },
      { shadowCount: 0, radiusCount: 0 },
    ),
  );

  // The only approved shadow came from Instrument, which left the simplified home (spec 2026-09-04).
  expect(surfaceRules.shadowCount).toBe(0);
  expect(surfaceRules.radiusCount).toBe(0);
});

test("sketch panel transition stays readable on carbon", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${BASE_URL}/`);
  await page.locator("#agent-operation").fill("relance client");
  await page.locator('.agent-esquisse-form button[type="submit"]').click();

  const link = page.locator(".agent-esquisse-transition");
  await expect(link).toBeVisible();
  const color = await link.evaluate((element) => getComputedStyle(element).color);
  expect(color).toBe("rgb(199, 203, 207)");
});

test("home journal section stays a direct article list without an idle capture", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${BASE_URL}/`);

  await expect(page.locator(".home-s-journal ol > li")).toHaveCount(3);
  await expect(page.locator(".home-s-journal form")).toHaveCount(0);
});

test("command bar nav items share one text baseline", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${BASE_URL}/`);
  const centres = await page.evaluate(() =>
    [...document.querySelectorAll(".cmd-nav a")].map((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const rect = range.getBoundingClientRect();
      range.detach();
      return rect.top + rect.height / 2;
    }),
  );
  expect(centres.length).toBe(2);
  expect(Math.max(...centres) - Math.min(...centres)).toBeLessThanOrEqual(1);
});

test.describe("command bar", () => {
  // The /commission stop loads the Cal embed, which the deny-all fixture blocks by design.
  test.use({ expectBlockedRequest: true });

  test("the command bar keeps the approved height and sits in normal flow on every core page", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const path of ["/", "/standard", "/commission", "/journal"]) {
      await page.goto(`${BASE_URL}${path}`);

      const commandBar = page.locator(".cmdbar");
      await expect(commandBar).toBeVisible();
      await expect(commandBar).not.toHaveCSS("position", "fixed");
      await expect(commandBar).toHaveCSS("height", "64px");
    }
  });
});

for (const width of [375, 1440]) {
  for (const locale of ["en", "fr"] as const) {
    test(`founder bridge is secondary and keyboard accessible at ${width}px in ${locale}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`${BASE_URL}${locale === "fr" ? "/fr" : "/"}`);
      await page.evaluate(() => document.fonts.ready);

      const maison = page.locator(".home-s-maison");
      const primary = maison.getByRole("link", { name: locale === "fr" ? "Réserver un examen" : "Book an examination", exact: true });
      const name = locale === "fr"
        ? "Rencontrez Paul (ouvre paul-larmaraud.com dans un nouvel onglet)"
        : "Meet Paul (opens paul-larmaraud.com in a new tab)";
      const bridge = maison.getByRole("link", { name, exact: true });
      await expect(maison.getByRole("link")).toHaveCount(2);
      await expect(primary).toHaveAttribute("href", locale === "fr" ? "/fr/commission" : "/commission");
      await expect(bridge).toHaveText(locale === "fr" ? "Rencontrez Paul →" : "Meet Paul →");
      await expect(bridge).toHaveAttribute("href", "https://paul-larmaraud.com");
      await expect(bridge).toHaveAttribute("target", "_blank");
      await expect(bridge).toHaveAttribute("rel", "noopener noreferrer");
      await expect(bridge).toHaveCSS("color", "rgb(85, 89, 94)");
      await expect(primary).toHaveCSS("color", "rgb(10, 11, 12)");
      const primaryBounds = await primary.boundingBox();
      const bridgeBounds = await bridge.boundingBox();
      expect(primaryBounds).not.toBeNull();
      expect(bridgeBounds).not.toBeNull();
      expect(bridgeBounds!.y - primaryBounds!.y - primaryBounds!.height).toBeGreaterThanOrEqual(12);
      expect(bridgeBounds!.x + bridgeBounds!.width).toBeLessThanOrEqual(width);

      await primary.focus();
      await page.keyboard.press("Tab");
      await expect(bridge).toBeFocused();
      await expect(bridge).toHaveCSS("outline-style", "solid");
      await expect(bridge).toHaveCSS("outline-width", "2px");
      await testInfo.attach(`maison-${locale}-${width}`, {
        body: await maison.screenshot({ animations: "disabled" }),
        contentType: "image/png",
      });
    });

    test(`hero capture stays centred at ${width}px in ${locale}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`${BASE_URL}${locale === "fr" ? "/fr" : "/"}`);
      await page.evaluate(() => document.fonts.ready);

      await expect(page.locator(".home-s-hero-sub")).toHaveText(locale === "fr"
        ? "La facture que personne ne suit avant qu'elle traîne. Le rapport recomposé à la main chaque lundi. On code chez vous, avec vos données, jusqu'à ce que ça tourne."
        : "The invoice nobody owns until it's overdue. The report stitched together by hand every Monday. We build inside your systems, on your data, until it runs.");
      await expect(page.locator(".home-s-maison h2")).toHaveText(locale === "fr"
        ? "Vous parlez à celui qui construit."
        : "You talk to the person who builds.");

      await expect(page.locator(".home-s-quick-capture")).toHaveCount(0);
      await expect(async () => {
        await page.locator("#agent-operation").fill("reporting");
        await page.locator('.agent-esquisse-form button[type="submit"]').click();
        await expect(page.locator("#quick-idee")).toHaveValue("reporting");
      }).toPass({ timeout: 10_000 });
      const capture = page.locator(".home-s-quick-capture");
      await expect(capture).toHaveCSS("text-align", "center");
      await expect(capture.locator("form > .k")).toHaveCSS("text-align", "center");
      const geometry = await capture.evaluate((element) => {
        const fields = element.querySelector(".quick-fields")!;
        const input = fields.querySelector("input")!.getBoundingClientRect();
        const button = fields.querySelector("button")!.getBoundingClientRect();
        const bounds = fields.getBoundingClientRect();
        const hero = element.closest(".home-s-hero")!.getBoundingClientRect();
        return {
          centreOffset: Math.abs(bounds.x + bounds.width / 2 - hero.x - hero.width / 2),
          inputLeft: Math.abs(input.left - bounds.left),
          buttonRight: Math.abs(button.right - bounds.right),
          gap: Math.abs(input.right - button.left),
        };
      });
      expect(geometry.centreOffset).toBeLessThanOrEqual(1);
      expect(geometry.inputLeft).toBeLessThanOrEqual(1);
      expect(geometry.buttonRight).toBeLessThanOrEqual(1);
      if (width === 1440) expect(geometry.gap).toBeLessThanOrEqual(1);
      await testInfo.attach(`hero-${locale}-${width}`, {
        body: await page.locator(".home-s-hero").screenshot({ animations: "disabled" }),
        contentType: "image/png",
      });
    });
  }
}

for (const locale of ["en", "fr"] as const) {
  test(`home has no metric badges and flows into brands in ${locale}`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE_URL}${locale === "fr" ? "/fr" : "/"}`);
    await page.evaluate(() => document.fonts.ready);

    await expect(page.getByRole("region", { name: "Metrics", exact: true })).toHaveCount(0);
    await expect(page.getByText(/200\+|2[.,]5 (?:months|mois)|100\s*%|02·09·2026/)).toHaveCount(0);
    await expect(page.locator(".home-s-brands-list + p")).toHaveText(locale === "fr"
      ? "Pas publiés. Partagés en rendez-vous."
      : "Not published. Shared in person.");
    const gap = await page.locator(".home-s-brands").evaluate((brands) => {
      const previous = brands.previousElementSibling;
      if (!previous?.classList.contains("home-s-hero")) throw new Error("Hero containing the agent must precede brands");
      return brands.getBoundingClientRect().top - previous.getBoundingClientRect().bottom;
    });
    expect(Math.abs(gap)).toBeLessThanOrEqual(1);
    await testInfo.attach(`home-copy-${locale}-1440`, {
      body: await page.screenshot({ fullPage: true, animations: "disabled" }),
      contentType: "image/png",
    });
  });

  test(`dossier titles describe operations in ${locale}`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE_URL}${locale === "fr" ? "/fr/dossiers" : "/dossiers"}`);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".r2-dossier h3")).toHaveText(locale === "fr" ? [
      "Le reporting qui s'assemble seul et part à l'heure.",
      "Les dossiers relancés ne retombent plus dans l'oubli.",
      "Nous vendons le système qui nous fait tourner.",
    ] : [
      "The reporting that assembles itself and ships on time.",
      "Re-engaged case files stop falling through again.",
      "We sell the system we run on.",
    ]);
    await expect(page.locator(".r2-registre-note")).toHaveText(locale === "fr"
      ? "Ils se lisent en rendez-vous, sur demande."
      : "They are read in a meeting, on request.");
    await testInfo.attach(`dossiers-copy-${locale}-1440`, {
      body: await page.screenshot({ fullPage: true, animations: "disabled" }),
      contentType: "image/png",
    });
  });
}
