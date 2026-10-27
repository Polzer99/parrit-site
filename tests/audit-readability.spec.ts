import { PUBLIC_ROUTES } from "./public-routes";
import { expect, test } from "./network-deny.setup";

async function tokenColor(element: import("@playwright/test").Locator, token: string) {
  return element.evaluate((el, name) => {
    const probe = document.createElement("span");
    probe.style.color = `var(${name})`;
    el.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, token);
}

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
test.use({ serviceWorkers: "block" });
test.beforeEach(async ({ page }) => {
  await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
  for (const pattern of ["https://app.cal.com/**", "https://cal.com/**"]) {
    await page.route(pattern, route => route.fulfill({ contentType: "text/html", body: "" }));
  }
});

for (const width of [375, 390, 1440]) {
  for (const path of PUBLIC_ROUTES) {
    test(`audit readability ${path} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`${BASE_URL}${path}`);
      await page.evaluate(() => document.fonts.ready);

      if (width < 760) {
        await page.locator(".mobile-menu summary").click();
        const mobileAction = page.locator(".single-header .mobile-menu .rev-button");
        await expect(mobileAction).toBeVisible();
        await expect(mobileAction).toHaveCSS("padding", "14px 24px");
        await expect(mobileAction).toHaveCSS("font-size", "16px");
        expect((await mobileAction.boundingBox())!.height).toBeGreaterThanOrEqual(48);
        await page.keyboard.press("Escape");
        await expect(page.locator(".mobile-menu")).not.toHaveAttribute("open", "");
      }
      if (width >= 760) {
        const header = page.locator(".single-header > .wrap > .rev-button");
        await expect(header).toHaveCSS("color", await tokenColor(header, "--white"));
        await expect(header).toHaveCSS("border-top-color", await tokenColor(header, "--white"));
        await expect(header).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      }
      if (path === "/" || path === "/fr") await expect(page.locator(".contact-fallback input[type=email]")).toBeVisible();
      const result = await page.evaluate(() => {
        const visible = (el: Element) => el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) && el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0;
        const actions = [...document.querySelectorAll(".rev-button, .single-header .rev-button, .fp-cta, .locale-toggle button")].filter(visible);
        const targets = [...document.querySelectorAll(".desktop-nav a, .mobile-menu a, .single-footer a, .languages a")].filter(visible);
        const h3 = [...document.querySelectorAll("main h3")].filter(visible);
        const prose = [...document.querySelectorAll("main p, main li, main dd")].filter(visible);
        return {
          actions: actions.map(el => ({ prominent: el.matches(".single-page .hero .btn.exec, .single-page .founder .btn.exec"), text: el.textContent, height: el.getBoundingClientRect().height, size: parseFloat(getComputedStyle(el).fontSize), weight: getComputedStyle(el).fontWeight })),
          targets: targets.map(el => ({ text: el.textContent, height: el.getBoundingClientRect().height })),
          h1: parseFloat(getComputedStyle(document.querySelector("h1")!).fontSize),
          h3: [...new Set(h3.map(el => getComputedStyle(el).fontSize))],
          smallProse: prose.filter(el => parseFloat(getComputedStyle(el).fontSize) < 16).map(el => el.textContent),
          tightProse: prose.filter(el => parseFloat(getComputedStyle(el).lineHeight) / parseFloat(getComputedStyle(el).fontSize) < 1.44).map(el => el.textContent),
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      expect(result.actions.length).toBeGreaterThan(0);
      for (const action of result.actions) {
        expect(action.height, action.text ?? "action").toBeGreaterThanOrEqual(48);
        // The validated addendum sets only these two actions to 22px.
        expect(action.size).toBe(action.prominent ? 22 : 16);
        expect(action.weight).toBe("600");
      }
      for (const target of result.targets) expect(target.height, target.text ?? "target").toBeGreaterThanOrEqual(44);
      expect(result.h1).toBeGreaterThanOrEqual(32);
      expect(result.h3.every(size => size === "22px")).toBe(true);
      expect(result.smallProse).toEqual([]);
      expect(result.tightProse).toEqual([]);
      expect(result.overflow).toBe(false);
      if (path === "/" || path === "/fr") {
        const actions = page.locator(".hero .actions");
        await expect(actions.locator("a")).toHaveCount(1);
        const hero = (await page.locator(".hero .wrap").boundingBox())!;
        const box = (await actions.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(hero.x);
        expect(box.x + box.width).toBeLessThanOrEqual(hero.x + hero.width);
        await expect(page.locator(".founder")).toHaveCount(1);
      }
    });
  }
}
