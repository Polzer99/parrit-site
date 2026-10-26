import { expectPopulated } from "./content-structure";
import { expect, test } from "./network-deny.setup";
import { PUBLIC_ROUTES } from "./public-routes";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
test.use({ serviceWorkers: "block" });
test.beforeEach(async ({ page }) => {
  await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const pattern of ["https://app.cal.com/**", "https://cal.com/**"]) {
    await page.route(pattern, route => route.fulfill({ contentType: "text/html", body: "" }));
  }
});

for (const path of PUBLIC_ROUTES) {
  const contact = path === "/fr" || path.startsWith("/fr/") ? "/fr#contact" : "/#contact";
  test(`doctrine booking destination and button typography ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}${path}`);
    await page.evaluate(() => document.fonts.ready);
    const actions = page.locator(`a.rev-button[href="${contact}"], main a.rev-button[href="#contact"]`);
    expect(await actions.count()).toBeGreaterThan(0);
    for (const action of await actions.all()) {
      await expectPopulated(action);
      expect(new URL((await action.getAttribute("href"))!, `${BASE_URL}${path}`).href).toBe(`${BASE_URL}${contact}`);
    }
    for (const button of await page.locator(".rev-button:visible").all()) {
      await expect(button).toHaveCSS("font-family", /General Sans/);
      await expect(button).toHaveCSS("font-weight", "600");
      await expect(button).toHaveCSS("text-transform", "none");
      await expect(button).toHaveCSS("letter-spacing", "normal");
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator(".mobile-menu summary").click();
    const mobile = page.locator(".single-header .rev-button");
    await expectPopulated(mobile);
    await expect(mobile).toHaveAttribute("href", contact);
    await expect(mobile).toHaveCSS("font-family", /General Sans/);
    await expect(mobile).toHaveCSS("text-transform", "none");
    await expect(page.locator(`.mobile-menu a[href="${contact}"]`)).toBeVisible();
  });

  for (const width of [1440, 390]) {
    test(`doctrine one pink accent in every viewport ${path} ${width}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`${BASE_URL}${path}`);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator(".single-header .rev-button")).toHaveClass(/\bghost\b/);
      if (width < 760) await page.locator(".mobile-menu summary").click();
      for (const link of await page.locator("main a:not(.rev-button)").all()) {
        expect(await link.evaluate(el => {
          const probe = document.createElement("span");
          probe.style.color = "var(--brand-core-rose)";
          el.append(probe);
          const pink = getComputedStyle(probe).color;
          probe.remove();
          return getComputedStyle(el).color === pink;
        }), "prose links do not add pink accents").toBe(false);
      }
      // Keep the exact interval comparison from HEAD: sampling scroll positions
      // could miss overlaps. Filled actions now count too, including warm pink.
      const accents = await page.evaluate(() => {
        const probe = document.createElement("span");
        document.body.append(probe);
        const pinks = ["--brand-core-rose", "--brand-accessible-warm", "--accent-on-dark"].map(token => {
          probe.style.color = `var(${token})`;
          return getComputedStyle(probe).color;
        });
        probe.remove();
        const painted = [...document.querySelectorAll("body *")].filter(element => {
          if (!element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return false;
          const bounds = element.getBoundingClientRect();
          if (!bounds.width || !bounds.height) return false;
          const style = getComputedStyle(element);
          return pinks.includes(style.backgroundColor) ||
            (element.matches("a") && pinks.includes(style.color)) ||
            (parseFloat(style.borderTopWidth) > 0 && pinks.includes(style.borderTopColor)) ||
            (getComputedStyle(element, "::before").content !== "none" &&
              parseFloat(getComputedStyle(element, "::before").borderTopWidth) > 0 &&
              pinks.includes(getComputedStyle(element, "::before").borderTopColor));
        });
        // Descendants painted as part of the same action are one accent.
        return painted.filter(element => !painted.some(other => other !== element && other.contains(element))).map(element => {
          const bounds = element.getBoundingClientRect();
          return { label: `${element.tagName}.${element.className}`, top: bounds.top + scrollY, bottom: bounds.bottom + scrollY };
        });
      });
      await testInfo.attach("pink-accents", { body: JSON.stringify(accents, null, 2), contentType: "application/json" });
      if (path === "/" || path === "/fr") expect(accents.length).toBeGreaterThan(0);
      for (let i = 0; i < accents.length; i++) {
        for (const other of accents.slice(i + 1)) {
          const gap = Math.max(accents[i].top, other.top) - Math.min(accents[i].bottom, other.bottom);
          expect(gap, `${accents[i].label} and ${other.label} share a viewport`).toBeGreaterThanOrEqual(844);
        }
      }
      if (width < 760) {
        await page.keyboard.press("Escape");
        await expect(page.locator(".mobile-menu nav")).not.toBeVisible();
      }
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await expect(page.locator(".single-header .rev-button")).toHaveClass(/\bghost\b/);
    });
  }
}

for (const locale of ["fr", "en"] as const) {
  const home = locale === "fr" ? "/fr" : "/";
  const contact = `${home}#contact`;
  test(`doctrine header accent without JavaScript ${locale}`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, serviceWorkers: "block", extraHTTPHeaders: { "Accept-Language": "en" } });
    const blocked: string[] = [];
    await context.route("**/*", async route => {
      if (["localhost", "127.0.0.1"].includes(new URL(route.request().url()).hostname)) return route.continue();
      blocked.push(route.request().url());
      await route.abort("blockedbyclient");
    });
    try {
      const page = await context.newPage();
      for (const path of PUBLIC_ROUTES.filter(path => locale === "fr" ? path.startsWith("/fr") : !path.startsWith("/fr"))) {
        await page.goto(`${BASE_URL}${path}`);
        await expect(page.locator(".single-header .rev-button")).toHaveClass(/\bghost\b/);
      }
    } finally {
      await context.close();
      expect(blocked, "No external requests without JavaScript").toEqual([]);
    }
  });

  test(`doctrine booking after capture success ${locale}`, async ({ page }) => {
    let submissions = 0;
    await page.route("**/api/**", async route => {
      expect(new URL(route.request().url()).pathname).toBe("/api/interet");
      expect(route.request().method()).toBe("POST");
      submissions += 1;
      await route.fulfill({ json: { ok: true } });
    });
    await page.goto(`${BASE_URL}${home}`);
    await page.locator(".contact-fallback summary").click();
    const capture = page.locator(".quick-capture");
    await capture.locator('input[type="email"]').fill("doctrine@example.invalid");
    await capture.locator('button[type="submit"]').click();
    await expect(capture).toHaveAttribute("data-state", "done");
    const booking = capture.getByRole("link");
    await expectPopulated(booking);
    await expect(booking).toHaveAttribute("href", contact);
    await expect(booking).toHaveCSS("font-family", /General Sans/);
    await expect(booking).toHaveCSS("text-transform", "none");
    expect(submissions).toBe(1);
  });

  for (const width of [1440, 768, 375, 390]) {
    test(`doctrine home composition and capture ${locale} ${width}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`${BASE_URL}${home}`);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("main > section")).toHaveCount(9);
      for (const heading of await page.locator("main h3").all()) await expect(heading).toHaveCSS("font-size", "22px");
      expect(await page.locator("main").innerText()).not.toMatch(/FormIA|Content Factor|usines? de contenu/i);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await expect(page.locator(".cal-instrument")).toHaveCSS("box-shadow", "none");
      await testInfo.attach(`doctrine-${locale}-${width}`, { body: await page.screenshot({ fullPage: true, animations: "disabled" }), contentType: "image/png" });
    });
  }
}
