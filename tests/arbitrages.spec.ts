import { createHash } from "node:crypto";
import { mkdir } from "node:fs/promises";
import hashes from "./fixtures/founder-photos.json";
import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const CAPTURES = "docs/qa/2026-10-05-arbitrages";
test.use({ serviceWorkers: "block" });

for (const width of [375, 768, 1440]) {
  for (const path of ["/", "/fr", "/build-with-you", "/fr/build-with-you", "/legal", "/fr/legal"]) {
    test(`arbitrages: ${path} at ${width}px`, async ({ page }, testInfo) => {
      await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      expect((await page.goto(`${BASE_URL}${path}`))?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      const french = path.startsWith("/fr");
      if (path === "/" || path === "/fr") {
        await expect(page.locator("h1")).toHaveText(french
          ? "Nous transformons des problèmes opérationnels en systèmes qui fonctionnent."
          : "We turn operational problems into systems that work.");
        await expect(page.locator("h1 br")).toHaveCount(0);
        const lines = await page.locator("h1").evaluate((heading) => {
          // Range measures real words after font loading, including nested Frame spans.
          const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
          const rows = new Map<number, string[]>();
          let node: Node | null;
          while ((node = walker.nextNode())) {
            for (const match of (node.textContent ?? "").matchAll(/\S+/g)) {
              const range = document.createRange();
              range.setStart(node, match.index);
              range.setEnd(node, match.index + match[0].length);
              const rect = range.getBoundingClientRect();
              const top = Math.round(rect.top);
              rows.set(top, [...(rows.get(top) ?? []), match[0]]);
            }
          }
          return [...rows.values()];
        });
        await testInfo.attach("h1-lines", { body: JSON.stringify(lines), contentType: "application/json" });
        expect(lines.length).toBeGreaterThan(0);
        expect(lines.filter((line) => line.length < 2), JSON.stringify(lines)).toEqual([]);

        const photo = page.locator(".home-s-maison figure img");
        await photo.scrollIntoViewIfNeeded();
        await expect(photo).toHaveAttribute("alt", french ? "Paul Larmaraud, fondateur de Parrit.ai" : "Paul Larmaraud, founder of Parrit.ai");
        await expect(photo).toHaveAttribute("width", "340");
        await expect(photo).toHaveAttribute("height", "453");
        await expect(photo).toHaveAttribute("loading", "lazy");
        await expect(photo).toHaveAttribute("decoding", "async");
        await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
        const photoBox = await photo.boundingBox();
        const copyBox = await page.locator(".home-s-maison-copy").boundingBox();
        expect(photoBox).not.toBeNull();
        expect(copyBox).not.toBeNull();
        if (width > 859) {
          expect(photoBox!.width).toBe(340);
          expect(photoBox!.x + photoBox!.width).toBeLessThanOrEqual(copyBox!.x);
          expect(Math.abs(photoBox!.y + photoBox!.height / 2 - copyBox!.y - copyBox!.height / 2)).toBeLessThanOrEqual(1);
        } else {
          expect(photoBox!.width).toBeLessThanOrEqual(Math.min(340, width));
          expect(photoBox!.y + photoBox!.height).toBeLessThan(copyBox!.y);
        }
        // Verify each served file via page fetch, under the same deny-all policy.
        for (const [name, hash] of Object.entries(hashes)) {
          const asset = await page.evaluate(async (file) => {
            const response = await fetch(`/brand/founder/${file}`, { redirect: "error" });
            return { status: response.status, bytes: Array.from(new Uint8Array(await response.arrayBuffer())) };
          }, name);
          expect(asset.status).toBe(200);
          expect(createHash("sha256").update(Buffer.from(asset.bytes)).digest("hex")).toBe(hash);
        }
        const sources = page.locator(".home-s-maison picture source");
        await expect(sources).toHaveCount(2);
        for (const [index, format] of ["avif", "webp"].entries()) {
          await expect(sources.nth(index)).toHaveAttribute("type", `image/${format}`);
          await expect(sources.nth(index)).toHaveAttribute("srcset", `/brand/founder/parrit-ai-founder-dsc00629-3x4-340.${format} 340w, /brand/founder/parrit-ai-founder-dsc00629-3x4-680.${format} 680w`);
          await expect(sources.nth(index)).toHaveAttribute("sizes", "(max-width: 859px) min(340px, 100vw), 340px");
        }
      }
      if (path.endsWith("/legal")) {
        await expect(page.locator("main")).toContainText(french ? "Lorsque vous utilisez le formulaire prototype" : "When you use the prototype form");
        await expect(page.locator("main")).not.toContainText(french ? "formulaires prototype ou journal" : "prototype or journal forms");
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.evaluate(() => window.scrollTo(0, 0));
      await mkdir(CAPTURES, { recursive: true });
      await page.screenshot({ path: `${CAPTURES}/${path.slice(1).replaceAll("/", "-") || "home"}-${width}.png`, fullPage: true, animations: "disabled" });
    });
  }
}
