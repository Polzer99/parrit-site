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

for (const width of [375, 390, 1440]) {
  for (const path of ["/", "/fr", "/build-with-you", "/fr/build-with-you", "/fr/systems", "/journal", "/manufacture", "/fr/manufacture"]) {
    test(`audit readability ${path} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`${BASE_URL}${path}`);
      await page.evaluate(() => document.fonts.ready);
      const home = path === "/" || path === "/fr";
      if (width < 760) {
        await page.locator(".v1-mobile-menu summary").click();
        await expect(page.locator(".cmd-cta")).toBeHidden();
        if (home) {
        const mobileAction = page.locator("#H01 .rev-button.exec");
        await expect(mobileAction).toBeVisible();
        await expect(mobileAction).toHaveCSS("padding", "14px 24px");
        await expect(mobileAction).toHaveCSS("font-size", "16px");
        expect((await mobileAction.boundingBox())!.height).toBeGreaterThanOrEqual(48);
        }
        await expect(page.locator(".v1-mobile-menu nav a")).toHaveCount(7);
        await page.keyboard.press("Escape");
        await expect(page.locator(".v1-mobile-menu")).not.toHaveAttribute("open", "");
      }
      if (width >= 760) {
        const header = page.locator(".cmd-cta");
        await expect(header).toHaveCSS("color", await tokenColor(header, home ? "--paper" : "--accent-on-dark"));
        await expect(header).toHaveCSS("border-top-color", await tokenColor(header, home ? "--paper" : "--accent-on-dark"));
        await expect(header).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      }
      const result = await page.evaluate(() => {
        const visible = (el: Element) => el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0;
        const actions = [...document.querySelectorAll(".rev-button, .cmd-cta, .fp-cta, .locale-toggle button")].filter(visible);
        const targets = [...document.querySelectorAll(".cmd-nav a, .v1-mobile-menu a, .home-s-footer a, .locale-toggle button")].filter(visible);
        const h3 = [...document.querySelectorAll("main h3")].filter(visible);
        const prose = [...document.querySelectorAll("main p, main li, main dd")].filter(visible);
        return {
          actions: actions.map(el => ({ text: el.textContent, height: el.getBoundingClientRect().height, size: parseFloat(getComputedStyle(el).fontSize), weight: getComputedStyle(el).fontWeight })),
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
        expect(action.size).toBe(16);
        expect(action.weight).toBe("600");
      }
      for (const target of result.targets) expect(target.height, target.text ?? "target").toBeGreaterThanOrEqual(44);
      expect(result.h1).toBeGreaterThanOrEqual(32);
      expect(result.h3.length).toBeLessThanOrEqual(1);
      expect(result.smallProse).toEqual([]);
      expect(result.tightProse).toEqual([]);
      expect(result.overflow).toBe(false);
      if (path.endsWith("/build-with-you")) {
        const link = page.locator(".build-with-you-next-link");
        await expect(link).toBeVisible();
        expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
        await expect(link).toHaveCSS("font-size", "18px");
        await expect(link).toHaveCSS("color", await link.evaluate(el => getComputedStyle(el.parentElement!).color));
        await expect(link).toHaveAttribute("href", path.startsWith("/fr") ? "/fr/commission" : "/commission");
      }
      if (path === "/" || path === "/fr") {
        const actions = page.locator(".v1-actions");
        const hero = (await page.locator(".v1-hero-summary").boundingBox())!;
        const box = (await actions.boundingBox())!;
        expect(Math.abs(box.x + box.width / 2 - hero.x - hero.width / 2)).toBeLessThanOrEqual(1);
        await expect(actions.locator("a")).toHaveCount(2);
        await expect(page.locator(".home-s-founder")).toHaveCount(0);
      }
    });
  }
}
