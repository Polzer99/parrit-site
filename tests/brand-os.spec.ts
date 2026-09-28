import { mkdir } from "node:fs/promises";
import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const CAPTURE_PHASE = process.env.BRAND_CAPTURE_PHASE ?? "after";
if (!["before", "after"].includes(CAPTURE_PHASE)) throw new Error("Invalid BRAND_CAPTURE_PHASE");

test.use({ serviceWorkers: "block" });

for (const width of [1440, 390]) {
  for (const route of ["/", "/legal", "/build-with-you", "/journal", "/systems", "/standard", "/manufacture", "/dossiers"]) {
    test(`Brand OS text contrast and capture ${route} at ${width}px`, async ({ page }, testInfo) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${BASE_URL}${route}`);
      await page.evaluate(() => document.fonts.ready);
      const name = `${route.slice(1) || "home"}-${width}`;
      const directory = `.codex-handoffs/brand-os-p1/${CAPTURE_PHASE}`;
      await mkdir(directory, { recursive: true });
      await page.screenshot({ path: `${directory}/${name}.png`, fullPage: true, animations: "disabled" });
      if (CAPTURE_PHASE === "before") return;

      const measurements = await page.evaluate(() => {
        type Color = [number, number, number, number];
        const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("Missing canvas parser");
        const parse = (value: string): Color => {
          ctx.clearRect(0, 0, 1, 1);
          ctx.fillStyle = value;
          ctx.fillRect(0, 0, 1, 1);
          return [...ctx.getImageData(0, 0, 1, 1).data].map((v) => v / 255) as Color;
        };
        const over = (a: Color, b: Color): Color => {
          const alpha = a[3] + b[3] * (1 - a[3]);
          if (!alpha) return [0, 0, 0, 0];
          return [0, 1, 2].map((i) => (a[i] * a[3] + b[i] * b[3] * (1 - a[3])) / alpha).concat(alpha) as Color;
        };
        const paint = (element: Element, foreground: Color = [0, 0, 0, 0]): Color => {
          let result = foreground;
          for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement) {
            const style = getComputedStyle(ancestor);
            if (style.backgroundImage !== "none") throw new Error("Text over image requires a separate contrast audit");
            result = over(result, parse(style.backgroundColor));
            result[3] *= Number(style.opacity);
          }
          return over(result, [1, 1, 1, 1]);
        };
        const luminance = (rgb: Color) => {
          const [r, g, b] = rgb.slice(0, 3).map((v) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
          return .2126 * r + .7152 * g + .0722 * b;
        };
        const result: { element: string; foreground: Color; background: Color; ratio: number; minimum: number }[] = [];
        const seen = new Set<string>();
        const measure = (element: Element, pseudo?: string) => {
          if (!element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) || element.closest(".sr-only, :disabled")) return;
          const style = getComputedStyle(element, pseudo);
          const pseudoBackground: Color = pseudo ? parse(style.backgroundColor) : [0, 0, 0, 0];
          const pseudoForeground = over(parse(style.color), pseudoBackground);
          if (pseudo) {
            if (style.backgroundImage !== "none") throw new Error("Pseudo-element image requires a separate contrast audit");
            pseudoForeground[3] *= Number(style.opacity);
            pseudoBackground[3] *= Number(style.opacity);
          }
          const fg = paint(element, pseudoForeground);
          const bg = paint(element, pseudoBackground);
          const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
          const minimum = parseFloat(style.fontSize) >= 24 ? 3 : 4.5;
          const label = `${element.tagName.toLowerCase()}.${[...element.classList].join(".")}${pseudo ?? ""}`;
          const key = `${label}:${fg}:${bg}:${minimum}`;
          if (seen.has(key)) return;
          seen.add(key);
          result.push({ element: label, foreground: fg, background: bg, ratio: (hi + .05) / (lo + .05), minimum });
        };
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
          if (!node.textContent?.trim() || !node.parentElement) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          if ([...range.getClientRects()].some((rect) => rect.width > 0 && rect.height > 0)) measure(node.parentElement);
        }
        for (const input of document.querySelectorAll("input, textarea, select")) {
          measure(input);
          if ((input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) && input.placeholder && !input.value) measure(input, "::placeholder");
        }
        for (const element of document.querySelectorAll("*")) {
          for (const pseudo of ["::before", "::after"]) {
            const style = getComputedStyle(element, pseudo);
            if (!["none", "normal", '\"\"', "''"].includes(style.content) && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0) measure(element, pseudo);
          }
        }
        return result;
      });
      await testInfo.attach(`contrast-${name}`, { body: JSON.stringify(measurements, null, 2), contentType: "application/json" });
      expect(measurements.length).toBeGreaterThan(0);
      expect(measurements.filter((item) => item.ratio < item.minimum)).toEqual([]);
    });
  }
}
