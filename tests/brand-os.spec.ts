import { localizedPath } from "../src/system/locale";
import { expectPopulated } from "./content-structure";
import { createHash } from "node:crypto";
import founderPhotos from "./fixtures/founder-photo.json";
import { mkdir } from "node:fs/promises";
import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const CAPTURE_PHASE = process.env.BRAND_CAPTURE_PHASE ?? "after";
if (!["before", "after"].includes(CAPTURE_PHASE)) throw new Error("Invalid BRAND_CAPTURE_PHASE");

test.use({ serviceWorkers: "block" });

const ROUTES = ["/", "/journal", "/legal", ...["harness-engineering", "ai-sprints", "integration-developpement", "conseil-transformation"].map(slug => `/journal/themes/${slug}`)].flatMap(route => [route, localizedPath(route, "fr")]);

test.beforeEach(async ({ page }) => {
  await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
  // Expected booking traffic is fulfilled locally; the shared deny-all remains active.
  await page.route("https://app.cal.com/**", (route) => route.fulfill({ contentType: "text/html", body: "" }));
  await page.route("https://cal.com/**", (route) => route.fulfill({ contentType: "text/html", body: "" }));
});

for (const width of [1440, 390]) {
  for (const route of ROUTES) {
    test(`Brand OS text contrast and capture ${route} at ${width}px`, async ({ page }, testInfo) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(`${BASE_URL}${route}`);
      expect(response?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      const name = `${route.slice(1).replaceAll("/", "-") || "home"}-${width}`;
      const directory = `.codex-handoffs/brand-os-p1/${CAPTURE_PHASE}`;
      await mkdir(directory, { recursive: true });
      await page.screenshot({ path: `${directory}/${name}.png`, fullPage: true, animations: "disabled" });
      // Capture phase only selects the output folder; it never disables a gate.
      if (width === 390) {
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        expect(await page.evaluate(() => document.body.scrollWidth)).toBeLessThanOrEqual(width);
      }
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/opengraph-image(?:[?.]|$)/);
      await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
      await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
      const image = await page.locator('meta[property="og:image"]').getAttribute("content");
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", image!);

      const measurements = await page.evaluate(measureContrast);
      await testInfo.attach(`contrast-${name}`, { body: JSON.stringify(measurements, null, 2), contentType: "application/json" });
      expect(measurements.length).toBeGreaterThan(0);
      expect(measurements.filter((item) => item.ratio < item.minimum)).toEqual([]);
    });
  }
}

for (const width of [375, 1440]) {
  for (const route of ["/brand-os-missing-page", "/fr/brand-os-missing-page"]) {
    test(`Brand OS bilingual 404 ${route} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(`${BASE_URL}${route}`);
      expect(response?.status()).toBe(404);
      const heading = page.locator("h1");
      await expectPopulated(heading);
      await expectPopulated(heading.locator('[lang="fr"]'));
      expect(await heading.evaluate((element) => [...element.childNodes]
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent ?? "").join("").trim())).not.toBe("");
      await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toHaveCount(1);
      await expect(page.locator(".cmdbar")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
      for (const href of ["/", "/fr", "/journal"]) {
        const action = page.locator(`.not-found-actions a[href="${href}"]`);
        await expectPopulated(action);
        await expect(action).toHaveAttribute("href", href);
      }
      const fontFamily = await heading.evaluate((element) => getComputedStyle(element).fontFamily);
      expect(fontFamily).toContain("General Sans");
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      if (width === 1440) {
        await page.evaluate(() => document.fonts.ready);
        const actions = page.getByRole("navigation").and(page.locator(".not-found-actions"));
        await expect(actions).toHaveAccessibleName(/\S/);
        await expect(actions.locator(".exec")).toHaveCount(1);
        await expect(actions.locator(".ghost")).toHaveCount(2);
        const primary = actions.locator(".exec");
        const fill = await primary.evaluate((element) => {
          const probe = document.createElement("span");
          probe.style.backgroundColor = "var(--action-fill)";
          element.append(probe);
          const color = getComputedStyle(probe).backgroundColor;
          probe.remove();
          return color;
        });
        expect(fill).not.toBe("rgba(0, 0, 0, 0)");
        await expect(primary).toHaveCSS("background-color", fill);
        for (const secondary of await actions.locator(".ghost").all()) {
          await expect(secondary).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
        }
        const titleBox = await heading.boundingBox();
        const heroBox = await page.locator("main header").boundingBox();
        await expect(page.locator("main header .k")).toHaveCount(0);
        const footerBox = await page.locator("footer").boundingBox();
        expect(titleBox).not.toBeNull();
        expect(heroBox).not.toBeNull();
        expect(footerBox).not.toBeNull();
        expect(heroBox!.x).toBeCloseTo(titleBox!.x, 0);
        for (const link of await actions.getByRole("link").all()) {
          await expect(link).toBeInViewport({ ratio: 1 });
          const box = await link.boundingBox();
          expect(box).not.toBeNull();
          expect(box!.x).toBeCloseTo(titleBox!.x, 0);
          expect(box!.y + box!.height).toBeLessThanOrEqual(Math.min(900, footerBox!.y));
        }
      }
    });
  }
}

test("all four approved founder photo URLs serve the original bytes", async ({ page }) => {
  for (const [name, expected] of Object.entries(founderPhotos)) {
    const response = await page.goto(`${BASE_URL}/brand/founder/${name}`);
    expect(response?.status()).toBe(200);
    expect(response?.headers()["content-type"]).toContain(name.endsWith(".avif") ? "image/avif" : "image/webp");
    expect(createHash("sha256").update(await response!.body()).digest("hex")).toBe(expected.sha256);
  }
});

// Shared with the negative fixtures: they exercise the exact production-page audit.
function measureContrast() {
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
    // FIX2 explicitly requires readable disabled controls too.
    if (!element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) || element.closest(".sr-only")) return;
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
    if (!pseudo && element.matches(".rev-button")) {
      const border = paint(element, parse(style.backgroundColor === "rgba(0, 0, 0, 0)" ? style.borderTopColor : style.backgroundColor));
      const container = element.parentElement;
      if (!container) throw new Error("Disabled button has no container");
      const background = paint(container);
      const contrast = (color: Color) => {
        const [high, low] = [luminance(color), luminance(background)].sort((a, b) => b - a);
        return (high + .05) / (low + .05);
      };
      let silhouette = border;
      // An opaque button can be distinguished by its fill or a complete solid contour.
      // Use the weakest edge so one contrasting side cannot qualify the whole outline.
      const sides = ["top", "right", "bottom", "left"];
      if (parse(style.backgroundColor)[3] === 1 && sides.every(side =>
        style.getPropertyValue(`border-${side}-style`) === "solid" &&
        parseFloat(style.getPropertyValue(`border-${side}-width`)) >= 2
      )) {
        const outline = sides.map(side => paint(element, parse(style.getPropertyValue(`border-${side}-color`))))
          .sort((a, b) => contrast(a) - contrast(b))[0];
        if (contrast(outline) > contrast(silhouette)) silhouette = outline;
      }
      result.push({ element: `${label} border`, foreground: silhouette, background, ratio: contrast(silhouette), minimum: 3 });
    }
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
}

for (const [name, border, passes] of [
  ["no border", "border: none", false],
  ["solid 2px border", "border: 2px solid white", true],
  ["solid 1px border", "border: 1px solid white", false],
  ["dashed border", "border: 2px dashed white", false],
  ["incomplete border", "border: 2px solid white; border-bottom: none", false],
  ["transparent border", "border: 2px solid transparent", false],
] as const) {
  test(`Brand OS silhouette regression: ${name}`, async ({ page }) => {
    await page.setContent(`<body style="background: rgb(0, 111, 138)">
      <button class="rev-button" style="background: rgb(240, 142, 133); color: black; ${border}">Action</button>
    </body>`);
    const measurements = await page.evaluate(measureContrast);
    const silhouette = measurements.find(item => item.element.endsWith(" border"));
    expect(silhouette).toBeDefined();
    expect(silhouette?.minimum).toBe(3);
    const failures = measurements.filter(item => item.ratio < item.minimum);
    if (passes) {
      expect(failures).toEqual([]);
    } else {
      expect(silhouette?.ratio).toBeLessThan(3);
      expect(failures).toEqual([silhouette]);
      expect(() => expect(failures).toEqual([])).toThrow();
    }
  });
}
