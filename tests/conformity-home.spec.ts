import { expect, test } from "./network-deny.setup";
import { PUBLIC_CLIENT_NAMES, publicClientName } from "../src/system/public-clients";
const BASE = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
for (const width of [375, 390, 1023, 1024, 1440]) for (const locale of ["en", "fr"]) {
  test(`home structure, references and geometry ${locale} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 }); await page.goto(`${BASE}${locale === "fr" ? "/fr" : "/"}`); await page.evaluate(() => document.fonts.ready);
    expect(await page.locator("main > section").evaluateAll(els => els.map(el => el.id))).toEqual(["H01", "H02", "H03", "H04", "H05", "H06", "H07", "H11", "H12"]);
    const refs = page.locator("#H02 li"); await expect(refs).toHaveCount(5);
    expect((await refs.locator("strong").allTextContents()).map(publicClientName).sort()).toEqual([...PUBLIC_CLIENT_NAMES].sort());
    await expect(page.locator("#H02 img, #H02 svg, #H02 a, #H02 button")).toHaveCount(0);
    for (const row of await refs.all()) {
      await expect(row.locator("strong")).toHaveCSS("font-weight", "600");
      await expect(row.locator("span")).toHaveCSS("font-weight", "400");
      const surface = await row.evaluate(el => {
        const probe = document.createElement("span");
        probe.style.backgroundColor = "var(--brand-surf)";
        el.append(probe);
        const color = getComputedStyle(probe).backgroundColor;
        probe.remove();
        return color;
      });
      await expect(row).toHaveCSS("background-color", surface);
      await expect(row).toHaveCSS("border-radius", "0px");
      await expect(row).toHaveCSS("box-shadow", "none");
      for (const side of ["top", "right", "bottom", "left"]) {
        await expect(row).toHaveCSS(`border-${side}-width`, "0px");
      }
    }
    const boxes = await refs.evaluateAll(els => els.map(el => {
      const { left, top, right, bottom } = el.getBoundingClientRect();
      return { left, top, right, bottom };
    }));
    const columns = width > 760 ? 2 : 1;
    for (let index = 0; index < boxes.length; index++) {
      const box = boxes[index];
      expect(box.left).toBeCloseTo(boxes[index % columns].left, 0);
      expect(box.top).toBeCloseTo(boxes[index - index % columns].top, 0);
      if (index >= columns) expect(box.top).toBeGreaterThanOrEqual(boxes[index - columns].bottom);
      if (index % columns) expect(box.left).toBeGreaterThanOrEqual(boxes[index - 1].right);
    }
    const headings = page.locator("#H03 h2, #H05 h2, #H06 h2, #H07 h2");
    const lefts = await headings.evaluateAll(els => els.map(el => el.getBoundingClientRect().left)); expect(Math.max(...lefts) - Math.min(...lefts)).toBeLessThanOrEqual(1);
    const closing = page.locator("#H12 a"); await expect(closing).toHaveAttribute("href", `${locale === "fr" ? "/fr" : ""}/commission`);
    await closing.focus(); await expect(closing).toBeFocused(); await expect(closing).toHaveCSS("outline-width", "2px");
    const surfaces = await page.locator("*").evaluateAll(els => els.filter(el => { const s = getComputedStyle(el); return s.boxShadow !== "none" || [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomLeftRadius, s.borderBottomRightRadius].some(r => parseFloat(r) > 0); }).map(el => el.tagName)); expect(surfaces).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await expect(page.locator(".cmdbar")).not.toHaveCSS("position", "fixed");
    if (width === 1440) {
      await expect(page.locator("h1")).toHaveCSS("font-size", "84px");
      const centers = await page.locator(".cmd-nav > .v1-nav-entry > a").evaluateAll(els => els.map(el => { const r = document.createRange(); r.selectNodeContents(el); const b = r.getBoundingClientRect(); return b.top + b.height / 2; }));
      expect(centers).toHaveLength(4); expect(Math.max(...centers) - Math.min(...centers)).toBeLessThanOrEqual(1);
    }
  });
}
