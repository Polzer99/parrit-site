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
      await expect(page.locator(".r2-phase .no")).toHaveCount(0);
      const steps = page.locator(".r2-phase .nm");
      await expect(steps).toHaveCount(3);
      for (const step of await steps.all()) {
        await expect(step).toBeVisible();
        await expect(step).toHaveCSS("font-family", /General Sans/);
      }
    });
  }

  for (const [path, selector, count] of [
    ["/fr/standard", ".doctrine-code .k", 6],
  ] as const) {
    test(`step numbers use canard on paper ${path} ${viewport.width}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE_URL}${path}`);
      await expect(page.locator(selector)).toHaveCount(0);
      const commitments = page.locator(".doctrine-name");
      await expect(commitments).toHaveCount(count);
      for (const commitment of await commitments.all()) {
        await expect(commitment).toBeVisible();
        await expect(commitment).toHaveCSS("font-family", /General Sans/);
      }
    });
  }

  for (const locale of ["fr", "en"] as const) {
    test(`section headings share a size and preserve exceptions ${locale} ${viewport.width}`, async ({ page }) => {
      const sectionSize = viewport.width <= 760 ? "32px" : "40px";
      const closingSize = viewport.width <= 760 ? "34px" : "54px";
      await page.setViewportSize(viewport);
      for (const [route, selector, count] of [
        ["/", "#H03 h2, #H05 h2, #H06 h2", 3],
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
      await expect(page.locator(".home-s-hero h1")).toHaveCSS("font-weight", "400");
      await expect(page.locator(".home-s-hero h1")).toHaveCSS("font-size", viewport.width <= 760 ? "40px" : "84px");
      const toggle = page.getByRole("group", { name: locale === "fr" ? "Langue" : "Language", exact: true });
      await expect(toggle).toHaveCount(1);
      const current = toggle.getByRole("button", { name: locale.toUpperCase(), exact: true });
      const other = toggle.getByRole("button", { name: locale === "fr" ? "EN" : "FR", exact: true });
      await expect(toggle.locator("[aria-current]")).toHaveCount(0);
      await expect(current).toHaveAttribute("aria-pressed", "true");
      await expect(current).toHaveCSS("text-decoration-line", "underline");
      await expect(current).toHaveCSS("color", await tokenColor(current, "--paper"));
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
        await expect(button).toHaveCSS("font-family", /General Sans/);
        for (const property of ["font-size"]) {
          await expect(button).toHaveCSS(property, await nav.evaluate((el, name) => getComputedStyle(el).getPropertyValue(name), property));
        }
      }
      const divider = await toggle.evaluate(el => {
        const style = getComputedStyle(el, "::before");
        return { content: style.content, width: style.borderLeftWidth };
      });
      expect(divider).toEqual({ content: '""', width: "1px" });
      if (viewport.width <= 760) {
        await expect(page.locator(".v1-mobile-menu summary")).toBeVisible();
        await expect(page.locator(".v1-mobile-menu summary")).toHaveCSS("border-top-width", "0px");
      }
      // Product-scene markers retain their separate pink-accent contract.
      for (const marker of await page.locator(".scene-marker").all()) {
        await expect(marker).toHaveCSS("background-color", await tokenColor(marker, "--brand-core-rose"));
      }
      const action = page.locator("#H03 .rev-button");
      await expect(action).toHaveCSS("padding", "14px 24px");
      const shadows = await page.locator("main *").evaluateAll(elements => elements
        .filter(el => getComputedStyle(el).boxShadow !== "none")
        .map(el => `${el.tagName}.${el.className}`));
      expect(shadows).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
    });

    test(`systems heading hierarchy, method target and aligned cards ${locale} ${viewport.width}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE_URL}${locale === "fr" ? "/fr" : ""}/systems`);
      await page.evaluate(() => document.fonts.ready);
      const headings = await page.locator("main :is(h1, h2, h3, h4, h5, h6)").evaluateAll(elements =>
        elements.map(el => ({ level: Number(el.tagName.slice(1)), text: el.textContent })));
      expect(headings[0].level).toBe(1);
      for (let index = 1; index < headings.length; index++) {
        expect(headings[index].level, `heading level: ${headings[index].text}`).toBeLessThanOrEqual(headings[index - 1].level + 1);
      }
      const proofTitle = page.locator(".systems-hero-proof-card").getByRole("heading", { level: 2 });
      await expect(proofTitle).toHaveCount(1);
      await expect(proofTitle).toHaveCSS("font-size", "22px");
      await expect(proofTitle).toHaveCSS("font-weight", "500");
      await expect(proofTitle).toHaveCSS("margin", "0px");
      await expect(page.locator(".systems-hero h1")).toHaveCSS("font-weight", "500");

      const method = page.locator("#method a");
      await expect(method).toHaveCount(1);
      await expect(method).toHaveAttribute("href", `${locale === "fr" ? "/fr" : ""}/manufacture`);
      const target = (await method.boundingBox())!;
      expect(target.height).toBeGreaterThanOrEqual(44);
      expect(target.width).toBeGreaterThanOrEqual(44);
      // Both the upper and lower padding must belong to the real hit target.
      await method.scrollIntoViewIfNeeded();
      expect(await method.evaluate(el => {
        const box = el.getBoundingClientRect();
        return [box.top + 1, box.bottom - 1].every(y => el.contains(document.elementFromPoint(box.x + box.width / 2, y)));
      })).toBe(true);

      const cards = page.locator("#capacites .system-card");
      await expect(cards).toHaveCount(4);
      const geometry = [];
      for (const card of await cards.all()) {
        await expect(card.locator("h3")).toHaveCount(1);
        await expect(card.locator("dt")).toHaveCount(4);
        await expect(card.locator("dd")).toHaveCount(4);
        const measures = await card.evaluate(el => {
          const box = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          const parts = [...el.querySelectorAll("h3, dt, dd, footer")].map(part => {
            const rect = part.getBoundingClientRect();
            return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right };
          });
          return {
            top: box.top, bottom: box.bottom,
            left: box.left + parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft),
            right: box.right - parseFloat(style.borderRightWidth) - parseFloat(style.paddingRight),
            parts,
          };
        });
        for (const part of measures.parts) {
          expect(Math.abs(part.left - measures.left), "card heading and definitions share the content edge").toBeLessThanOrEqual(1);
          expect(part.right).toBeLessThanOrEqual(measures.right + 1);
        }
        for (let index = 1; index < measures.parts.length; index++) {
          expect(measures.parts[index].top, "card content does not overlap").toBeGreaterThanOrEqual(measures.parts[index - 1].bottom - 1);
        }
        geometry.push(measures);
      }
      const proofEdge = (await proofTitle.boundingBox())!.x;
      expect(Math.abs(geometry[0].parts[0].left - proofEdge), "catalogue title aligns with the hero proof title").toBeLessThanOrEqual(1);
      if (viewport.width === 1440) {
        // Check both pairs: headings, all four dt/dd pairs and proof footers.
        for (const index of [0, 2]) {
          const left = geometry[index];
          const right = geometry[index + 1];
          expect(Math.abs(left.parts[0].left - proofEdge)).toBeLessThanOrEqual(1);
          expect(Math.abs(left.top - right.top)).toBeLessThanOrEqual(1);
          for (let part = 0; part < left.parts.length; part++) {
            expect(Math.abs(left.parts[part].top - right.parts[part].top), `cards ${index + 1}/${index + 2}, part ${part}`).toBeLessThanOrEqual(1);
          }
        }
      } else {
        for (let index = 1; index < geometry.length; index++) {
          expect(geometry[index].top).toBeGreaterThanOrEqual(geometry[index - 1].bottom);
          expect(Math.abs(geometry[index].left - geometry[0].left)).toBeLessThanOrEqual(1);
        }
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
    });
  }
}

test("section headings follow the mobile boundary and keep the tablet size", async ({ page }) => {
  for (const width of [760, 761, 1100]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${BASE_URL}/fr`);
    for (const heading of await page.locator("#H03 h2, #H05 h2, #H06 h2").all()) {
      await expect(heading).toHaveCSS("font-size", width <= 760 ? "32px" : "40px");
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});
