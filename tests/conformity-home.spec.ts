import { expectPopulated } from "./content-structure";
import { expect, test } from "./network-deny.setup";
import { PUBLIC_CLIENT_NAMES, publicClientName } from "../src/system/public-clients";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";

test.use({ serviceWorkers: "block", viewport: { width: 1440, height: 900 } });

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  for (const locale of ["en", "fr"] as const) {
    test(`home parcours presents two audiences without actions at ${viewport.width}px in ${locale}`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`${BASE_URL}${locale === "fr" ? "/fr" : "/"}`);
      await page.evaluate(() => document.fonts.ready);

      const section = page.locator(".home-s-parcours");
      await expect(section).toHaveCount(1);
      await expect(section).toBeVisible();
      await expect(section.locator("h3")).toHaveCount(2);
      await expect(section.locator("a, [role='link']")).toHaveCount(0);
      await expect(section.locator("button, [role='button']")).toHaveCount(0);
      await expectPopulated(section.locator("h2"));
      await expectPopulated(section.locator("h3"), 2);
      await expectPopulated(section.locator(".doctrine-note"));

      const geometry = await section.evaluate((element) => {
        const previous = element.previousElementSibling;
        const next = element.nextElementSibling;
        if (!previous?.classList.contains("home-s-brands") || !next?.classList.contains("home-s-maison")) {
          throw new Error("Parcours must sit directly between brands and maison");
        }
        const heading = element.querySelector("h2")!.getBoundingClientRect();
        const maisonHeading = next.querySelector("h2")!.getBoundingClientRect();
        const columns = [...element.querySelectorAll("h3")].map((column) => column.getBoundingClientRect());
        const paragraphs = [...element.querySelectorAll(".home-s-proof-item p")].map((paragraph) => paragraph.getBoundingClientRect());
        return {
          left: heading.left,
          offset: Math.abs(heading.left - maisonHeading.left),
          sameRow: Math.abs(columns[0].top - columns[1].top),
          sameColumn: Math.abs(columns[0].left - columns[1].left),
          overflow: element.scrollWidth - element.clientWidth,
          headingSize: getComputedStyle(element.querySelector("h2")!).fontSize,
          maisonHeadingSize: getComputedStyle(next.querySelector("h2")!).fontSize,
          firstColumnOffset: Math.abs(columns[0].left - heading.left),
          paragraphOffsets: paragraphs.map((paragraph, index) => Math.abs(paragraph.left - columns[index].left)),
        };
      });
      expect(geometry.offset).toBeLessThanOrEqual(1);
      expect(Math.abs(geometry.left - (viewport.width === 1440 ? 180 : 20))).toBeLessThanOrEqual(1);
      expect(geometry.overflow).toBeLessThanOrEqual(1);
      expect(geometry.headingSize).toBe(geometry.maisonHeadingSize);
      expect(geometry.firstColumnOffset).toBeLessThanOrEqual(1);
      for (const offset of geometry.paragraphOffsets) expect(offset).toBeLessThanOrEqual(1);
      if (viewport.width === 1440) expect(geometry.sameRow).toBeLessThanOrEqual(1);
      else expect(geometry.sameColumn).toBeLessThanOrEqual(1);
      await testInfo.attach(`parcours-${locale}-${viewport.width}`, {
        body: await section.screenshot({ animations: "disabled" }),
        contentType: "image/png",
      });
    });
  }
}

for (const width of [1440, 1024, 1023, 390, 375]) {
  for (const locale of ["en", "fr"] as const) {
    test(`home client references preserve attribution and layout at ${width}px in ${locale}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${BASE_URL}${locale === "fr" ? "/fr" : "/"}`);
      await page.evaluate(() => document.fonts.ready);
      const section = page.locator(".home-s-brands");
      const rows = section.locator("li");
      await expectPopulated(rows, PUBLIC_CLIENT_NAMES.length);
      await expect(section.locator("a, button, img, svg")).toHaveCount(0);
      await expectPopulated(section.locator(".home-s-brands-list + p"));
      const names = await rows.locator("strong").allTextContents();
      expect(names.map(publicClientName).sort()).toEqual([...PUBLIC_CLIENT_NAMES].sort());
      for (const row of await rows.all()) {
        await expectPopulated(row.locator("strong"));
        await expectPopulated(row.locator("span"));
        await expect(row.locator("strong")).toHaveCSS("font-weight", "600");
        await expect(row.locator("span")).toHaveCSS("font-weight", "400");
        await expect(row).toHaveCSS("border-bottom-width", "1px");
        expect(await row.locator("strong").evaluate((el) => getComputedStyle(el).fontFamily)).toBe(
          await row.locator("span").evaluate((el) => getComputedStyle(el).fontFamily),
        );
      }
      const geometry = await rows.evaluateAll((elements) => {
        const boxes = elements.map((el) => el.getBoundingClientRect());
        return { sameRow: Math.abs(boxes[0].top - boxes[1].top), sameColumn: Math.abs(boxes[0].left - boxes[1].left) };
      });
      if (width >= 1024) expect(geometry.sameRow).toBeLessThanOrEqual(1);
      else expect(geometry.sameColumn).toBeLessThanOrEqual(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    });
  }
}

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
  expect(color).toBe("rgb(169, 194, 199)");
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
    test(`maison has one booking action without personal branding at ${width}px in ${locale}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`${BASE_URL}${locale === "fr" ? "/fr" : "/"}`);
      await page.evaluate(() => document.fonts.ready);

      const maison = page.locator(".home-s-maison");
      const primary = maison.getByRole("link");
      await expect(maison.getByRole("link")).toHaveCount(1);
      await expect(primary).toHaveAttribute("href", locale === "fr" ? "/fr/commission" : "/commission");
      await expect(maison.locator("figure, figcaption, picture")).toHaveCount(0);
      await expect(page.locator('a[href*="paul-larmaraud.com"]')).toHaveCount(0);
      const bounds = await primary.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      await page.keyboard.press("Tab");
      await primary.focus();
      await expect(primary).toBeFocused();
      await expect(primary).toHaveCSS("outline-style", "solid");
      await expect(primary).toHaveCSS("outline-width", "2px");
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

      await expectPopulated(page.locator(".home-s-hero-sub"));
      await expectPopulated(page.locator(".home-s-maison h2"));

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

    await expect(page.locator(".home-s-metrics")).toHaveCount(0);
    await expect(page.getByText(/200\+|2[.,]5 (?:months|mois)|100\s*%|02·09·2026/)).toHaveCount(0);
    await expectPopulated(page.locator(".home-s-brands-list + p"));
    const clients = await page.locator(".home-s-brands-list > li > strong").allTextContents();
    expect(clients.map(publicClientName).sort()).toEqual([...PUBLIC_CLIENT_NAMES].sort());
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
    await expectPopulated(page.locator(".r2-dossier h3"), 3);
    await expect(page.locator(".r2-registre-note")).toHaveCount(0);
    await expectPopulated(page.locator("h1"));
    await testInfo.attach(`dossiers-copy-${locale}-1440`, {
      body: await page.screenshot({ fullPage: true, animations: "disabled" }),
      contentType: "image/png",
    });
  });
}
