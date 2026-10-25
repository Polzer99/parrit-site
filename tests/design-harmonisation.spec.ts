import type { Locator } from "@playwright/test";
import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
test.use({ serviceWorkers: "block" });
test.beforeEach(async ({ page }) => {
  await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

async function tokenColor(element: Locator, token: string) {
  return element.evaluate((el, name) => {
    const probe = document.createElement("span");
    probe.style.color = `var(${name})`;
    el.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, token);
}

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  for (const path of ["/fr/build-with-you", "/fr/manufacture"]) {
    test(`step numbers stay neutral on ink ${path} ${viewport.width}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE_URL}${path}`);
      await page.evaluate(() => document.fonts.ready);
      const numbers = page.locator(".r2-phase .no");
      await expect(numbers).toHaveCount(3);
      for (const number of await numbers.all()) {
        await expect(number).toBeVisible();
        await expect(number).not.toHaveCSS("color", await tokenColor(number, "--brand-core-rose"));
        await expect(number).toHaveCSS("color", await tokenColor(number, "--brand-derived-on-ink-2"));
        await expect(number).toHaveCSS("font-family", /IBM Plex Mono/);
      }
    });
  }

  for (const [path, selector, count] of [
    ["/fr", ".home-s-journey-steps .k", 4],
    ["/fr/standard", ".doctrine-code .k", 6],
  ] as const) {
    test(`step numbers use canard on paper ${path} ${viewport.width}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE_URL}${path}`);
      const numbers = page.locator(selector);
      await expect(numbers).toHaveCount(count);
      for (const number of await numbers.all()) {
        await expect(number).toHaveCSS("color", await tokenColor(number, "--brand-core-canard"));
        await expect(number).toHaveCSS("font-family", /IBM Plex Mono/);
      }
    });
  }

  for (const locale of ["fr", "en"] as const) {
    test(`section headings share a size and preserve exceptions ${locale} ${viewport.width}`, async ({ page }) => {
      const sectionSize = viewport.width <= 760 ? "32px" : "40px";
      const closingSize = viewport.width <= 760 ? "34px" : "54px";
      await page.setViewportSize(viewport);
      for (const [route, selector, count] of [
        ["/", ".home-s-maison h2, .product-scene-copy h2, .home-s-journal h2", 3],
        ["/manufacture", ".r2-shead h2", 1],
        ["/build-with-you", ".r2-shead h2", 4],
        ["/systems", ".r2-shead h2", 7],
        ["/legal", ".legal-document > h2", 2],
        // Dossiers has only a closing H2; Journal H2s are entry titles.
        ["/dossiers", ".r2-close h2", 1],
        ["/journal", ".journal-list h2", null],
      ] as const) {
        const path = locale === "en" ? route : `/fr${route === "/" ? "" : route}`;
        await page.goto(`${BASE_URL}${path}`);
        await page.evaluate(() => document.fonts.ready);
        const headings = page.locator(selector);
        if (count === null) expect(await headings.count()).toBeGreaterThan(0);
        else await expect(headings).toHaveCount(count);
        const expectedSize = route === "/journal" ? "22px" : route === "/dossiers" ? closingSize : sectionSize;
        for (const heading of await headings.all()) {
          await expect(heading).toBeVisible();
          await expect(heading).toHaveCSS("font-size", expectedSize);
        }
        for (const closing of await page.locator(".home-s-close h2, .r2-close h2").all()) {
          await expect(closing).toHaveCSS("font-size", closingSize);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
      }
    });

    test(`home title and text language selector ${locale} ${viewport.width}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE_URL}${locale === "fr" ? "/fr" : "/"}`);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator(".home-s-hero h1")).toHaveCSS("font-weight", "500");
      await expect(page.locator(".home-s-hero h1")).toHaveCSS("font-size", viewport.width <= 760 ? "40px" : "84px");
      const toggle = page.locator(".locale-toggle");
      const current = toggle.getByRole("button", { name: locale.toUpperCase(), exact: true });
      const other = toggle.getByRole("button", { name: locale === "fr" ? "EN" : "FR", exact: true });
      await expect(current).toHaveAttribute("aria-current", "true");
      await expect(current).toHaveAttribute("aria-pressed", "true");
      await expect(current).toHaveCSS("text-decoration-line", "underline");
      await expect(current).toHaveCSS("color", await tokenColor(current, "--paper"));
      await expect(other).not.toHaveAttribute("aria-current", "true");
      await expect(other).toHaveAttribute("aria-pressed", "false");
      await expect(other).toHaveCSS("color", await tokenColor(other, "--g2"));
      for (const element of [toggle, current, other]) {
        await expect(element).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
        for (const edge of ["top", "right", "bottom", "left"]) {
          await expect(element).toHaveCSS(`border-${edge}-width`, "0px");
        }
      }
      const nav = page.locator(".cmd-nav a").first();
      for (const button of [current, other]) {
        const bounds = await button.boundingBox();
        expect(bounds).not.toBeNull();
        expect(bounds!.width).toBeGreaterThanOrEqual(44);
        expect(bounds!.height).toBe(48);
        await expect(button).toHaveCSS("font-family", /IBM Plex Mono/);
        for (const property of ["font-size", "letter-spacing"]) {
          await expect(button).toHaveCSS(property, await nav.evaluate((el, name) => getComputedStyle(el).getPropertyValue(name), property));
        }
      }
      const divider = await toggle.evaluate(el => {
        const style = getComputedStyle(el, "::before");
        return { content: style.content, width: style.borderLeftWidth };
      });
      expect(divider).toEqual({ content: '""', width: "1px" });
      if (viewport.width <= 760) {
        await expect(page.locator(".cmd-menu-toggle")).toBeVisible();
        await expect(page.locator(".cmd-menu-toggle")).toHaveCSS("border-top-width", "1px");
      }
      // Product-scene markers retain their separate pink-accent contract.
      for (const marker of await page.locator(".scene-marker").all()) {
        await expect(marker).toHaveCSS("background-color", await tokenColor(marker, "--brand-core-rose"));
      }
      const action = page.locator(".home-s-journey-action");
      await expect(action).toHaveCSS("padding", "14px 24px");
      const shadows = await page.locator("main *").evaluateAll(elements => elements
        .filter(el => getComputedStyle(el).boxShadow !== "none")
        .map(el => `${el.tagName}.${el.className}`));
      expect(shadows).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
    });
  }
}

test("section headings follow the mobile boundary and keep the tablet size", async ({ page }) => {
  for (const width of [760, 761, 1100]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${BASE_URL}/fr`);
    for (const heading of await page.locator(".home-s-maison h2, .product-scene-copy h2, .home-s-journal h2").all()) {
      await expect(heading).toHaveCSS("font-size", width <= 760 ? "32px" : "40px");
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});
