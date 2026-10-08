import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
test.use({ serviceWorkers: "block" });

for (const width of [375, 390, 1440]) {
  for (const path of ["/", "/fr", "/build-with-you", "/fr/build-with-you", "/fr/systems", "/journal"]) {
    test(`audit readability ${path} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`${BASE_URL}${path}`);
      await page.evaluate(() => document.fonts.ready);
      if (width < 760) {
        await page.locator(".cmd-menu-toggle").click();
        await expect(page.locator(".cmd-panel-cta")).toHaveCSS("padding", "14px 24px");
        await expect(page.locator(".cmd-panel-cta")).toHaveCSS("font-size", "16px");
        await page.keyboard.press("Escape");
        await expect(page.locator(".cmd-panel")).toHaveCount(0);
      }
      const result = await page.evaluate(() => {
        const visible = (el: Element) => el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0;
        const actions = [...document.querySelectorAll(".rev-button, .cmd-cta, .fp-cta, .locale-toggle button")].filter(visible);
        const targets = [...document.querySelectorAll(".cmd-nav a, .cmd-panel a, .home-s-footer a, .locale-toggle button")].filter(visible);
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
        await expect(link).toHaveAttribute("href", path.startsWith("/fr") ? "/fr/commission" : "/commission");
      }
      if (path === "/" || path === "/fr") {
        const booking = page.locator(".home-s-alternative .rev-button");
        const hero = await page.locator(".home-s-hero h1").boundingBox();
        const sketch = await page.locator(".agent-esquisse").boundingBox();
        const button = await booking.boundingBox();
        expect(hero).not.toBeNull();
        expect(sketch).not.toBeNull();
        expect(button).not.toBeNull();
        for (const reference of [hero!, sketch!]) {
          expect(Math.abs(button!.x + button!.width / 2 - reference.x - reference.width / 2)).toBeLessThanOrEqual(1);
        }
        const founder = page.locator(".home-s-text-link--secondary");
        await expect(founder).toBeVisible();
        expect((await founder.boundingBox())!.height).toBeGreaterThanOrEqual(44);
        await expect(founder).toHaveCSS("font-size", "16px");
        for (const selector of [".home-s-hero .rev-button.exec", ".agent-esquisse button"]) {
          const action = page.locator(selector).first();
          await expect(action).toBeVisible();
          expect(await action.evaluate(el => {
            const probe = document.createElement("span");
            probe.style.color = "var(--brand-core-rose)";
            el.append(probe);
            const rose = getComputedStyle(probe).color;
            probe.remove();
            return getComputedStyle(el).backgroundColor === rose;
          })).toBe(true);
        }
      }
    });
  }
}
