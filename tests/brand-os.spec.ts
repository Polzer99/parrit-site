import { createHash } from "node:crypto";
import founderPhotos from "./fixtures/founder-photo.json";
import { mkdir } from "node:fs/promises";
import connectorContract from "../src/system/brand-os.connectors.json";
import { expect, test } from "./network-deny.setup";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const CAPTURE_PHASE = process.env.BRAND_CAPTURE_PHASE ?? "after";
if (!["before", "after"].includes(CAPTURE_PHASE)) throw new Error("Invalid BRAND_CAPTURE_PHASE");

test.use({ serviceWorkers: "block" });

const ROUTES = ["/", "/build-with-you", "/systems", "/commission", "/manufacture", "/dossiers", "/standard", "/journal", "/legal"]
  .flatMap((route) => [route, route === "/" ? "/fr" : `/fr${route}`]);

test.beforeEach(async ({ page }) => {
  await page.setExtraHTTPHeaders({ "Accept-Language": "en" });
  // Expected booking traffic is fulfilled locally; the shared deny-all remains active.
  await page.route("https://app.cal.com/**", (route) => route.fulfill({ contentType: "text/html", body: "" }));
  await page.route("https://cal.com/**", (route) => route.fulfill({ contentType: "text/html", body: "" }));
});

for (const width of [1440, 375]) {
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
      if (width === 375) {
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        expect(await page.evaluate(() => document.body.scrollWidth)).toBeLessThanOrEqual(width);
      }
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/opengraph-image(?:[?.]|$)/);
      await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
      await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
      const image = await page.locator('meta[property="og:image"]').getAttribute("content");
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", image!);

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
          if (!pseudo && element.matches("button.rev-button.exec:disabled")) {
            const border = paint(element, parse(style.borderTopColor));
            const container = element.parentElement;
            if (!container) throw new Error("Disabled button has no container");
            const background = paint(container);
            const [high, low] = [luminance(border), luminance(background)].sort((a, b) => b - a);
            result.push({ element: `${label} border`, foreground: border, background, ratio: (high + .05) / (low + .05), minimum: 3 });
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
      });
      await testInfo.attach(`contrast-${name}`, { body: JSON.stringify(measurements, null, 2), contentType: "application/json" });
      expect(measurements.length).toBeGreaterThan(0);
      expect(measurements.filter((item) => item.ratio < item.minimum)).toEqual([]);
    });
  }
}

for (const width of [375, 390, 768, 1440]) {
  for (const route of ["/", "/fr"]) {
    test(`Brand OS approved founder photo, caption and heading ${route} at ${width}px`, async ({ page }, testInfo) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${BASE_URL}${route}`);
      await page.evaluate(() => document.fonts.ready);
      const labels = page.locator(".home-s-maison-copy > .k");
      const photo = page.locator(".home-s-maison figure img");
      await expect(photo).toHaveCount(1);
      await expect(photo).toHaveAttribute("src", "/brand/founder/parrit-ai-founder-linkedin-3x4-340.webp");
      await expect(photo).toHaveAttribute("alt", route === "/fr" ? "Paul Larmaraud, fondateur de Parrit.ai" : "Paul Larmaraud, founder of Parrit.ai");
      await expect(photo).toHaveAttribute("width", "340");
      await expect(photo).toHaveAttribute("height", "453");
      await expect(photo).toHaveAttribute("loading", "lazy");
      await expect(photo).toHaveAttribute("decoding", "async");
      await photo.scrollIntoViewIfNeeded();
      await expect(photo).toBeVisible();
      await expect.poll(() => photo.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
      await expect(page.locator(".home-s-maison figcaption")).toHaveText(`Paul Larmaraud · ${route === "/fr" ? "Fondateur" : "Founder"}`);
      const sources = page.locator(".home-s-maison picture source");
      await expect(sources).toHaveCount(2);
      for (const [index, format] of ["avif", "webp"].entries()) {
        await expect(sources.nth(index)).toHaveAttribute("type", `image/${format}`);
        await expect(sources.nth(index)).toHaveAttribute("sizes", "(max-width: 859px) min(340px, 100vw), 340px");
        await expect(sources.nth(index)).toHaveAttribute("srcset", `/brand/founder/parrit-ai-founder-linkedin-3x4-340.${format} 340w, /brand/founder/parrit-ai-founder-linkedin-3x4-680.${format} 680w`);
      }
      const figureBox = await page.locator(".home-s-maison figure").boundingBox();
      const copyBox = await page.locator(".home-s-maison-copy").boundingBox();
      expect(figureBox).not.toBeNull();
      expect(copyBox).not.toBeNull();
      expect(figureBox!.width).toBeLessThanOrEqual(340);
      if (width > 859) {
        expect(figureBox!.x + figureBox!.width).toBeLessThan(copyBox!.x);
        expect(Math.abs(figureBox!.y + figureBox!.height / 2 - copyBox!.y - copyBox!.height / 2)).toBeLessThanOrEqual(1);
      } else {
        expect(figureBox!.y + figureBox!.height).toBeLessThan(copyBox!.y);
      }
      const h1 = page.locator("h1");
      await expect(h1).toHaveText(route === "/fr" ? "Nous transformons des problèmes opérationnels en systèmes qui fonctionnent." : "We turn operational problems into systems that work.");
      await expect(h1.locator(".frame")).toHaveCSS("display", "inline-block");
      await expect(h1.locator(".frame")).toHaveCSS("white-space", "nowrap");
      await expect(h1.locator(".frame")).toHaveText(route === "/fr" ? "systèmes qui fonctionnent" : "systems that work");
      const ending = h1.locator(".home-s-hero-ending");
      await expect(ending).toHaveCSS("display", "block");
      const headingBox = await h1.boundingBox();
      const endingBox = await ending.boundingBox();
      expect(headingBox).not.toBeNull();
      expect(endingBox).not.toBeNull();
      expect(Math.abs(endingBox!.x + endingBox!.width / 2 - headingBox!.x - headingBox!.width / 2)).toBeLessThanOrEqual(1);
      const frameGeometry = await h1.locator(".frame").evaluate((frame) => {
        const bounds = frame.getBoundingClientRect();
        const fx = frame.querySelector(".fx");
        if (!fx) throw new Error("Missing bottom corners");
        const textRects: { left: number; right: number; top: number; bottom: number }[] = [];
        const walker = document.createTreeWalker(frame, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
          if (!node.textContent?.trim()) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          for (const rect of range.getClientRects()) {
            textRects.push({ left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom });
          }
        }
        // FIX6: include every non-whitespace glyph, even outside the frame.
        const heading = frame.closest("h1");
        if (!heading) throw new Error("Missing heading");
        const glyphs: { left: number; right: number; top: number; bottom: number; framed: boolean; word: boolean }[] = [];
        const headingWalker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
        while ((node = headingWalker.nextNode())) {
          for (const match of (node.textContent ?? "").matchAll(/\S/gu)) {
            const range = document.createRange();
            range.setStart(node, match.index!);
            range.setEnd(node, match.index! + match[0].length);
            for (const rect of range.getClientRects()) {
              glyphs.push({ left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom,
                framed: frame.contains(node), word: /\p{L}/u.test(match[0]) });
            }
          }
        }
        // Pseudo-elements have no DOMRect API. Reconstruct their border boxes
        // from computed sizes/insets in their positioned containing block.
        const corners = [frame, fx].flatMap((owner) => ["::before", "::after"].map((pseudo) => {
          const style = getComputedStyle(owner, pseudo);
          if (style.position !== "absolute" || style.transform !== "none") {
            throw new Error("Frame geometry contract changed");
          }
          const width = parseFloat(style.width) + (style.boxSizing === "border-box" ? 0 :
            parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth));
          const height = parseFloat(style.height) + (style.boxSizing === "border-box" ? 0 :
            parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth));
          const left = style.left !== "auto" ? bounds.left + parseFloat(style.left) : bounds.right - parseFloat(style.right) - width;
          const top = style.top !== "auto" ? bounds.top + parseFloat(style.top) : bounds.bottom - parseFloat(style.bottom) - height;
          return { left, right: left + width, top, bottom: top + height };
        }));
        const style = getComputedStyle(frame);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const descender = context.measureText("yq").actualBoundingBoxDescent;
        return { textRects, corners, glyphs, descender, bottomPadding: parseFloat(style.paddingBottom) };
      });
      expect(frameGeometry.textRects).toHaveLength(1);
      expect(frameGeometry.corners).toHaveLength(4);
      const text = frameGeometry.textRects[0];
      const left = Math.min(...frameGeometry.corners.map((c) => c.left));
      const right = Math.max(...frameGeometry.corners.map((c) => c.right));
      expect(Math.abs((text.left - left) - (right - text.right)), "frame centered on its text").toBeLessThanOrEqual(2);
      expect(frameGeometry.bottomPadding, "descenders remain inside the frame").toBeGreaterThanOrEqual(frameGeometry.descender);
      for (const corner of frameGeometry.corners) {
        expect(corner.right - corner.left).toBe(14);
        expect(corner.bottom - corner.top).toBe(14);
      }
      expect(frameGeometry.glyphs.some((glyph) => !glyph.framed && glyph.word)).toBe(true);
      // No unframed word may share the framed group's line (punctuation may).
      for (const glyph of frameGeometry.glyphs.filter((glyph) => !glyph.framed && glyph.word)) {
        for (const text of frameGeometry.textRects) {
          expect(Math.abs(glyph.top - text.top)).toBeGreaterThan(1);
        }
      }
      for (const corner of frameGeometry.corners) {
        expect(corner.right).toBeGreaterThan(corner.left);
        expect(corner.bottom).toBeGreaterThan(corner.top);
        expect(corner.left).toBeGreaterThanOrEqual(0);
        expect(corner.right).toBeLessThanOrEqual(width);
        // FIX5: screen inset, independent of the section's responsive gutter.
        expect(corner.left).toBeGreaterThanOrEqual(16);
        expect(corner.right).toBeLessThanOrEqual(width - 16);
        for (const glyph of frameGeometry.glyphs) {
          const intersects = corner.left < glyph.right && corner.right > glyph.left && corner.top < glyph.bottom && corner.bottom > glyph.top;
          expect(intersects, JSON.stringify({ corner, glyph })).toBe(false);
        }
        for (const text of frameGeometry.textRects) {
          const intersects = corner.left < text.right && corner.right > text.left && corner.top < text.bottom && corner.bottom > text.top;
          expect(intersects, JSON.stringify({ corner, text })).toBe(false);
          const horizontalGap = Math.max(text.left - corner.right, corner.left - text.right);
          expect(horizontalGap, JSON.stringify({ corner, text })).toBeGreaterThanOrEqual(12);
        }
      }
      const lines = await h1.evaluate((element) => {
        const lines: Record<string, string[]> = {};
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
          for (const match of (node.textContent ?? "").matchAll(/\S+/g)) {
            if (!/\p{L}/u.test(match[0])) continue;
            const range = document.createRange();
            range.setStart(node, match.index!);
            range.setEnd(node, match.index! + match[0].length);
            const top = Math.round(range.getBoundingClientRect().top);
            (lines[top] ??= []).push(match[0]);
          }
        }
        return Object.values(lines);
      });
      expect(lines.length).toBeGreaterThan(0);
      expect(lines.filter((line) => line.length === 1), JSON.stringify(lines)).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await h1.scrollIntoViewIfNeeded();
      await testInfo.attach(`photo-dv-${route === "/fr" ? "fr" : "en"}-${width}`, { body: await page.screenshot({ fullPage: true }), contentType: "image/png" });
      await expect(labels).toHaveCount(1);
      await expect(labels).not.toContainText(route === "/fr" ? "Fondateur" : "Founder");
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
      await expect(heading).toContainText("This page does not exist.");
      await expect(heading).toContainText("Cette page n'existe pas.");
      await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toHaveCount(1);
      await expect(page.locator(".cmdbar")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
      for (const [name, href] of [
        ["Back to the home page", "/"],
        ["Revenir à l'accueil", "/fr"],
        ["Read the Journal", "/journal"],
      ]) await expect(page.getByRole("link", { name, exact: true })).toHaveAttribute("href", href);
      const fontFamily = await heading.evaluate((element) => getComputedStyle(element).fontFamily);
      expect(fontFamily).toContain("General Sans");
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      if (width === 1440) {
        await page.evaluate(() => document.fonts.ready);
        const actions = page.getByRole("navigation", { name: "Page not found", exact: true });
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
        const kickerBox = await page.locator("main header .k").boundingBox();
        const footerBox = await page.locator("footer").boundingBox();
        expect(titleBox).not.toBeNull();
        expect(kickerBox).not.toBeNull();
        expect(footerBox).not.toBeNull();
        expect(kickerBox!.x).toBeCloseTo(titleBox!.x, 0);
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

for (const width of [1440, 375]) {
  test(`Brand OS connector geometry at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${BASE_URL}/systems`);
    const arrows = page.locator(".mechanism-diagram-arrow");
    await expect(arrows).toHaveCount(2);
    for (const arrow of await arrows.all()) {
      await expect(arrow).toHaveAttribute("aria-hidden", "true");
      await expect(arrow).toHaveText("");
      const geometry = await arrow.evaluate((element) => {
        const shaft = getComputedStyle(element, "::before");
        const head = getComputedStyle(element, "::after");
        const target = element.nextElementSibling;
        if (!target) throw new Error("Connector has no destination");
        return {
          stroke: parseFloat(shaft.width),
          shaft: parseFloat(shaft.height),
          headLength: parseFloat(head.height),
          headWidth: parseFloat(head.width),
          headShape: head.clipPath,
          headFill: head.backgroundColor,
          color: getComputedStyle(element).color,
          gap: target.getBoundingClientRect().top - element.getBoundingClientRect().bottom,
        };
      });
      expect(geometry.stroke).toBe(connectorContract.px.stroke);
      expect(geometry.shaft).toBeGreaterThanOrEqual(connectorContract.px.min_shaft);
      expect(geometry.headLength).toBe(connectorContract.px.head_len);
      expect(geometry.headWidth).toBe(connectorContract.px.head_w);
      expect(geometry.headShape).toBe("polygon(0px 0px, 100% 0px, 50% 100%)");
      expect(geometry.headFill).toBe(geometry.color);
      expect(Math.abs(geometry.gap - connectorContract.px.endpoint_gap)).toBeLessThanOrEqual(connectorContract.px.tolerance);
    }
  });
}

// Exercise the native disabled state and hydration without submitting a lead.
for (const width of [1440, 375]) {
  for (const route of ["/", "/fr"]) {
    test(`Brand OS sketch disabled and active states ${route} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${BASE_URL}${route}`);
      const button = page.locator(".agent-esquisse-form button");
      const input = page.locator("#agent-operation");
      const disabled = async () => {
        await expect(button).toBeDisabled();
        await expect(button).toHaveCSS("opacity", "1");
        await expect(button).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
        await expect(button).toHaveCSS("cursor", "not-allowed");
        await expect(button).toHaveCSS("border-top-style", "solid");
        expect(await button.evaluate((element) => parseFloat(getComputedStyle(element).borderTopWidth))).toBeGreaterThan(0);
        const expected = await button.evaluate((element) => {
          const probe = document.createElement("span");
          probe.style.color = "var(--g4-d)";
          element.append(probe);
          const expected = getComputedStyle(probe).color;
          probe.remove();
          return expected;
        });
        await expect(button).toHaveCSS("color", expected);
        await expect(button).toHaveCSS("border-top-color", expected);
      };
      await disabled();
      await button.hover();
      await disabled();
      await expect(async () => {
        await input.fill("Une opération à examiner");
        await expect(button).toBeEnabled();
      }).toPass({ timeout: 5000 });
      const activeFill = await button.evaluate((element) => {
        const probe = document.createElement("span");
        probe.style.color = "var(--accent-on-dark)";
        element.append(probe);
        const expected = getComputedStyle(probe).color;
        probe.remove();
        return expected;
      });
      await expect(button).toHaveCSS("background-color", activeFill);
      await input.fill("   ");
      await disabled();
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
