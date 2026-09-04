import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";

test.use({ viewport: { width: 1440, height: 900 } });

test("the opening plays on every arrival and dismisses on input", async ({ page }) => {
  await page.goto(`${BASE_URL}/`);
  await expect(page.getByTestId("opening")).toBeVisible();

  await page.mouse.click(720, 450);
  await expect(page.getByTestId("opening")).toHaveCount(0);

  await page.reload();
  await expect(page.getByTestId("opening")).toBeVisible();
});

test("the home locks the approved display scale and surface rules", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${BASE_URL}/`);

  await expect(page.getByTestId("opening")).toHaveCount(0);

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

test.describe("command bar", () => {
  // The /commission stop loads the Cal embed, which the deny-all fixture blocks by design.
  test.use({ expectBlockedRequest: true });

  test("the command bar is fixed at the approved height on every core page", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const path of ["/", "/standard", "/commission", "/journal"]) {
    await page.goto(`${BASE_URL}${path}`);

      const commandBar = page.locator(".cmdbar");
      await expect(commandBar).toBeVisible();
      await expect(commandBar).toHaveCSS("position", "fixed");
      await expect(commandBar).toHaveCSS("height", "52px");
    }
  });
});
