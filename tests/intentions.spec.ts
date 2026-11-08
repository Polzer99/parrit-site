import { test, expect } from "./network-deny.setup";
import { mkdir } from "node:fs/promises";
import contactExpectation from "./fixtures/contact-expectation.json";

const BASE = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const local = (path: string) => {
  const url = new URL(path, BASE);
  expect(["localhost", "127.0.0.1"]).toContain(url.hostname);
  return url.href;
};
test.beforeEach(async ({ page }) => {
  await page.route("**/embed/embed.js", async route => {
    expect(new URL(route.request().url()).hostname).toBe("app.cal.com");
    await route.fulfill({ contentType: "application/javascript", body: "/* offline Cal loader */" });
  });
  // Local POST must also be mocked: it otherwise calls the real downstream service.
  await page.route("**/api/interet", route => route.fulfill({ json: { ok: true } }));
});
const actions = [
  [".hero .exec", "intention-projet-hero"],
  [".hero .ghost", "intention-formation-hero"],
  [".step:nth-child(1) a", "intention-formation-parcours"],
  [".step:nth-child(2) a", "intention-priorites-parcours"],
  [".step:nth-child(3) a", "intention-projet-parcours"],
] as const;

for (const locale of ["fr", "en"] as const) {
  const home = locale === "fr" ? "/fr" : "/";
  for (const [selector, source] of actions) test(`intent attribution survives click and reaches mocked form ${locale} ${source}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(local(`${home}?utm_source=test&utm_campaign=kept&utm_custom=custom&source=old`));
    const input = page.locator('#single-contact input[type="email"]');
    await input.fill("visitor@example.invalid");
    await page.evaluate(() => { document.documentElement.dataset.documentSentinel = "same-document"; });
    const navigations: string[] = [];
    page.on("request", request => { if (request.isNavigationRequest()) navigations.push(request.url()); });
    await page.locator(selector).click();
    await expect(page).toHaveURL(new RegExp(`source=${source}#contact$`));
    await expect(page.locator("#contact")).toBeFocused();
    await expect(page.locator("#contact h2")).toBeInViewport();
    await expect(input).toHaveValue("visitor@example.invalid");
    expect(await page.locator("html").getAttribute("data-document-sentinel")).toBe("same-document");
    expect(navigations).toEqual([]);
    const request = page.waitForRequest(request => new URL(request.url()).pathname === "/api/interet" && request.method() === "POST");
    await page.locator('#single-contact button[type="submit"]').click();
    expect((await request).postDataJSON()).toMatchObject({
      source: "site:quick-capture", lang: locale, pageOrigine: home,
      attribution: { source, utm_source: "test", utm_campaign: "kept", utm_custom: "custom" },
    });
  });

  for (const javaScriptEnabled of [true, false]) test.describe(`intent layout ${locale} JS=${javaScriptEnabled}`, () => {
    test.use({ javaScriptEnabled });
    for (const [width, height] of [[1440, 800], [390, 844], [375, 844]]) test(`SSR geometry and captures ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(local(home));
      await page.evaluate(() => document.fonts.ready);
      const buttons = page.locator(".hero .actions a");
      await expect(buttons).toHaveCount(2);
      await expect(buttons.nth(0)).toHaveClass(/\bexec\b/);
      await expect(buttons.nth(1)).toHaveClass(/\bghost\b/);
      await expect(buttons.nth(1)).toHaveCSS("font-size", "16px");
      await expect(buttons.nth(0)).toHaveCSS("font-size", width >= 1200 ? "19px" : "18px");
      for (const [selector, source] of actions) await expect(page.locator(selector)).toHaveAttribute("href", `${home}?source=${source}#contact`);
      const boxes = await buttons.evaluateAll(nodes => nodes.map(node => { const r = node.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }));
      expect(Math.abs(boxes[0].height - boxes[1].height)).toBeLessThanOrEqual(1);
      const group = (await page.locator(".hero .actions").boundingBox())!;
      const gap = await page.locator(".hero .actions").evaluate(node => parseFloat(getComputedStyle(node).getPropertyValue("--brand-s2")));
      if (width === 1440) {
        expect(Math.abs(boxes[0].y - boxes[1].y)).toBeLessThanOrEqual(1);
        const baselines = await buttons.evaluateAll(nodes => nodes.map(node => {
          const marker = document.createElement("span");
          marker.style.cssText = "display:inline-block;width:0;height:0;padding:0;border:0;vertical-align:baseline";
          node.append(marker);
          const baseline = marker.getBoundingClientRect().top;
          marker.remove();
          return baseline;
        }));
        expect(Math.abs(baselines[0] - baselines[1])).toBeLessThanOrEqual(1);
        expect(boxes[1].x - boxes[0].x - boxes[0].width).toBeCloseTo(gap, 0);
        expect(boxes[1].x + boxes[1].width).toBeLessThanOrEqual(group.x + group.width + 1);
        const diagram = (await page.locator(".onto-diagram").boundingBox())!;
        expect(boxes[1].x + boxes[1].width).toBeLessThanOrEqual(diagram.x);
        const hero = (await page.locator(".hero").boundingBox())!;
        expect(hero.y + hero.height).toBeLessThanOrEqual(800);
      } else {
        expect(boxes[1].y - boxes[0].y - boxes[0].height).toBeCloseTo(gap, 0);
        for (const box of boxes) expect(box.width).toBeCloseTo(group.width, 0);
      }
      const steps = page.locator(".steps .step");
      await expect(steps).toHaveCount(3);
      for (const step of await steps.all()) await expect(step.locator("a")).toHaveCount(1);
      const rows = await steps.evaluateAll(nodes => nodes.map(node => ({
        top: node.getBoundingClientRect().top,
        number: node.querySelector(".n")!.getBoundingClientRect().top,
        action: node.querySelector("a")!.getBoundingClientRect().bottom,
      })));
      for (const field of ["top", "number", "action"] as const) expect(Math.max(...rows.map(row => row[field])) - Math.min(...rows.map(row => row[field]))).toBeLessThanOrEqual(1);
      const note = page.locator(".contact-expectation");
      await expect(note).toHaveText(contactExpectation[locale]);
      expect((await note.boundingBox())!.y).toBeGreaterThanOrEqual((await page.locator("#single-contact .quick-fields").boundingBox())!.y + (await page.locator("#single-contact .quick-fields").boundingBox())!.height);
      await expect(page.locator(".logo-track")).toHaveCSS("animation-name", "none");
      expect(await page.locator(".logo-strip").evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
      const logoSet = page.locator(".logo-set:not([aria-hidden])");
      await expect(logoSet.getByRole("img")).toHaveCount(5);
      const centered = await logoSet.evaluate(el => {
        const parent = el.closest(".logo-strip")!.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        return { middle: r.x + r.width / 2, parentMiddle: parent.x + parent.width / 2, overflow: el.scrollWidth - el.clientWidth };
      });
      expect(Math.abs(centered.middle - centered.parentMiddle)).toBeLessThanOrEqual(1);
      expect(centered.overflow).toBeLessThanOrEqual(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      if (process.env.CTA_CAPTURE === "1" && javaScriptEnabled) {
        const directory = process.env.CTA_CAPTURE_DIR ?? "/tmp/cta-intentions-captures";
        await mkdir(directory, { recursive: true });
        for (const [name, selector] of [["hero", ".single-header"], ["parcours", ".parcours"], ["references", "#references"]]) {
          await page.locator(selector).evaluate(el => el.scrollIntoView({ block: "start", behavior: "instant" }));
          await page.screenshot({ path: `${directory}/${locale}-${width}-${name}.png` });
        }
        await page.goto(local(`${locale === "fr" ? "/fr" : ""}/journal`));
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({ path: `${directory}/${locale}-${width}-journal.png` });
      }
    });

    test("logos loop continuously in CSS, pause on hover/focus and stop on reduced motion", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto(local(home));
      const strip = page.locator(".logo-strip");
      const track = page.locator(".logo-track");
      await strip.scrollIntoViewIfNeeded();
      await expect(track).toHaveCSS("animation-duration", "28s");
      await expect(track).toHaveCSS("animation-iteration-count", "infinite");
      await expect(track).toHaveCSS("animation-play-state", "running");
      await strip.hover();
      await expect(track).toHaveCSS("animation-play-state", "paused");
      await page.mouse.move(0, 0);
      await strip.focus();
      await expect(track).toHaveCSS("animation-play-state", "paused");
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(track).toHaveCSS("animation-name", "none");
      expect(await strip.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
    });
  });

  for (const width of [1440, 1100, 1099, 390]) test(`Journal reading time, themes and column breakpoint ${locale} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(local(`${locale === "fr" ? "/fr" : ""}/journal`));
    const cards = page.locator(".journal-index > li");
    expect(await cards.count()).toBeGreaterThan(0);
    for (const card of await cards.all()) {
      await expect(card.locator("a")).toHaveCount(1);
      await expect(card.locator(".journal-reading-time")).toHaveText(locale === "fr" ? /^[1-9]\d* min de lecture$/ : /^[1-9]\d* min read$/);
    }
    await expect(page.locator('a[href="/journal/one-card-one-action"] .journal-entry-theme')).toHaveCount(0);
    await expect(page.locator('a[href="/journal/the-claim-a-green-pipeline-never-makes"] .journal-entry-theme')).toHaveCount(2);
    const columns = await page.locator(".journal-index").evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length);
    expect(columns).toBe(width >= 1100 ? 2 : 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}
