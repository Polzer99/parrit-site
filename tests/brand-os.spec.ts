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

for (const width of [375, 768, 1440]) {
  for (const route of ["/", "/fr"]) {
    test(`Brand OS founder caption precedes journey kicker ${route} at ${width}px`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${BASE_URL}${route}`);
      await page.evaluate(() => document.fonts.ready);
      const labels = page.locator(".home-s-maison-copy > .k");
      await expect(labels).toHaveCount(2);
      await expect(labels.nth(0)).toContainText(route === "/fr" ? "Fondateur" : "Founder");
      const caption = await labels.nth(0).boundingBox();
      const kicker = await labels.nth(1).boundingBox();
      expect(caption).not.toBeNull();
      expect(kicker).not.toBeNull();
      expect(kicker!.y).toBeGreaterThan(caption!.y);
      expect(kicker!.y - caption!.y - caption!.height).toBeCloseTo(24, 0);
      expect(kicker!.x).toBeCloseTo(caption!.x, 0);
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
