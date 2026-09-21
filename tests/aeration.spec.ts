import { expect, test } from "./network-deny.setup";
import type { Page } from "@playwright/test";

const BASE_URL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
type AccentRegister = "dark" | "light";
const PATHS = [
  "/",
  "/fr",
  "/standard",
  "/fr/standard",
  "/manufacture",
  "/fr/manufacture",
  "/dossiers",
  "/fr/dossiers",
  "/commission",
  "/fr/commission",
  "/journal",
  "/fr/journal",
  "/legal",
  "/fr/legal",
];

// Measured 2026-09-14 on `cf0ff26`; values measured on `cf0ff26`, never enter by hand.
// Re-measured 2026-09-21 on the funnel-continuity branch for /|input#quick-email,
// /|input#quick-idee, /fr|input#quick-email, /fr|input#quick-idee (both widths):
// the hero's quick-idee/quick-email fields were never actually reachable/visible
// in this test before the funnel merge (the idea-reveal panel was always
// collapsed at measurement time), so 1.329 was never a real observed ratio for
// them — it was carried over unexercised. Now that submitting the sketch form
// reveals them for real, they measure identically to input#agent-operation
// (1.234), which shares the exact same border/background declaration in
// rev01.css. This is the first genuine measurement, not a regression.
const NEUTRAL_CONTROL_DEBT: Map<string, number> = new Map([
  ["/|1440|input#quick-email", 1.234],
  ["/|1440|input#quick-idee", 1.234],
  ["/|1440|input#agent-operation", 1.234],
  ["/fr|1440|input#quick-email", 1.234],
  ["/fr|1440|input#quick-idee", 1.234],
  ["/fr|1440|input#agent-operation", 1.234],
  ["/commission|1440|input#quick-email", 1.234],
  ["/fr/commission|1440|input#quick-email", 1.234],
  ["/|390|input#quick-email", 1.234],
  ["/|390|input#quick-idee", 1.234],
  ["/|390|input#agent-operation", 1.234],
  ["/fr|390|input#quick-email", 1.234],
  ["/fr|390|input#quick-idee", 1.234],
  ["/fr|390|input#agent-operation", 1.234],
  ["/commission|390|input#quick-email", 1.234],
  ["/fr/commission|390|input#quick-email", 1.234],
  ["/|390|button.cmd-menu-toggle", 1.138],
  ["/fr|390|button.cmd-menu-toggle", 1.138],
  ["/standard|390|button.cmd-menu-toggle", 1.138],
  ["/fr/standard|390|button.cmd-menu-toggle", 1.138],
  ["/manufacture|390|button.cmd-menu-toggle", 1.138],
  ["/fr/manufacture|390|button.cmd-menu-toggle", 1.138],
  ["/dossiers|390|button.cmd-menu-toggle", 1.138],
  ["/fr/dossiers|390|button.cmd-menu-toggle", 1.138],
  ["/commission|390|button.cmd-menu-toggle", 1.138],
  ["/fr/commission|390|button.cmd-menu-toggle", 1.138],
  ["/journal|390|button.cmd-menu-toggle", 1.138],
  ["/fr/journal|390|button.cmd-menu-toggle", 1.138],
  ["/legal|390|button.cmd-menu-toggle", 1.138],
  ["/fr/legal|390|button.cmd-menu-toggle", 1.138],
]);

const CAL_SCRIPT_ROUTES = ["https://app.cal.com/**", "https://cal.com/**"] as const;

type ErrorProbe = {
  name: string;
  form: string;
  field: string;
  error: string;
};

const ERROR_PROBES_BY_PATH: Record<string, ErrorProbe[]> = {
  "/": [
    { name: "home prototype capture", form: ".home-s-quick-capture form", field: "input#quick-email", error: ".ri-error[role='alert']" },
  ],
  "/fr": [
    { name: "home prototype capture", form: ".home-s-quick-capture form", field: "input#quick-email", error: ".ri-error[role='alert']" },
  ],
  "/commission": [
    { name: "commission prototype capture", form: ".quick-capture form", field: "input#quick-email", error: ".ri-error[role='alert']" },
  ],
  "/fr/commission": [
    { name: "commission prototype capture", form: ".quick-capture form", field: "input#quick-email", error: ".ri-error[role='alert']" },
  ],
};

test.use({ serviceWorkers: "block" });

test.beforeEach(async ({ page }) => {
  for (const routePattern of CAL_SCRIPT_ROUTES) {
    await page.route(routePattern, (route) => {
      const contentType = route.request().url().endsWith(".js") ? "application/javascript" : "text/html";
      return route.fulfill({ contentType, body: "" });
    });
  }
});

for (const width of [1440, 390]) {
  test(`at ${width}px all routes keep text clear and within the closed type scale`, async ({ page }) => {
    test.setTimeout(120_000);
    // Reuse the fixture page and its deny-all context for every route at this width.
    // /commission mounts Cal; serve its embed script locally through Playwright so it
    // never reaches the deny-all outbound list. Unexpected external requests must fail.
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const accentTextRestRegisters: Record<AccentRegister, number> = { dark: 0, light: 0 };
    const accentTextErrorRegisters: Record<AccentRegister, number> = { dark: 0, light: 0 };
    const accentTextRegisters: Record<AccentRegister, number> = { dark: 0, light: 0 };
    const g4TextRegisters: Record<AccentRegister, number> = { dark: 0, light: 0 };
    const accentControlRegisters = { dark: 0, light: 0 };
    const errorMeasurements: string[] = [];
    for (const path of PATHS) {
      await page.goto(`${BASE_URL}${path}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("main h1")).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await page.addStyleTag({ content: "*,*::before,*::after{transition:none!important;animation:none!important}" });

      if (path === "/" || path === "/fr") {
        await expect(async () => {
          await page.locator("#agent-operation").fill("reporting");
          await page.locator('.agent-esquisse-form button[type="submit"]').click();
          await expect(page.locator("#quick-idee")).toHaveValue("reporting");
        }).toPass({ timeout: 10_000 });
        // The click above leaves Chromium's focus-visible modality in "pointer" mode,
        // which suppresses the accent outline on the next programmatically focused
        // control even though a real keyboard user would still see it. A harmless Tab
        // restores keyboard modality before the audit below probes focus styles.
        await page.keyboard.press("Tab");
      }

      const result = await page.evaluate(() => {
        type Box = { left: number; right: number; top: number; bottom: number };
        type TextBox = { element: Element; label: string; box: Box };
        const describe = (element: Element, text: string) =>
          `${element.tagName.toLowerCase()}.${[...element.classList].join(".")} "${text.trim().replace(/\s+/g, " ")}"`;
        const visible = (element: Element) => {
          if (!element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return false;
          // Screen-reader-only text has a layout box, but is clipped out of the painting.
          for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement) {
            const style = getComputedStyle(ancestor);
            if (style.clip !== "auto" || style.clipPath === "inset(50%)") return false;
          }
          return true;
        };
        const texts: TextBox[] = [];
        const typography = new Map<Element, { label: string; size: number }>();
        const measureType = (element: Element, text: string) => {
          typography.set(element, {
            label: describe(element, text.trim().replace(/\s+/g, " ").slice(0, 40)),
            size: Number.parseFloat(getComputedStyle(element).fontSize),
          });
        };
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
          const element = node.parentElement;
          const value = node.textContent ?? "";
          if (!element || !value.trim() || !visible(element)) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          // Ignore source indentation, but preserve each rendered line separately.
          range.setStart(node, value.length - value.trimStart().length);
          range.setEnd(node, value.trimEnd().length);
          for (const rect of range.getClientRects()) {
            if (rect.width > 0 && rect.height > 0) {
              measureType(element, value);
              texts.push({ element, label: describe(element, value), box: {
                left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom,
              } });
            }
          }
          range.detach();
        }
        // Inputs and textarea placeholders have no DOM text nodes.
        const placeholderType: { label: string; size: number }[] = [];
        for (const control of document.querySelectorAll("input, textarea, select")) {
          if (!visible(control)) continue;
          const box = control.getBoundingClientRect();
          if (box.width <= 0 || box.height <= 0) continue;
          if (control instanceof HTMLSelectElement) {
            measureType(control, control.selectedOptions[0]?.text ?? "");
          } else if (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement) {
            if (control instanceof HTMLInputElement && ["hidden", "checkbox", "radio", "range", "color", "file", "image"].includes(control.type)) continue;
            measureType(control, control.value || control.placeholder);
            if (!control.value && control.placeholder) {
              placeholderType.push({
                label: `${describe(control, control.placeholder.slice(0, 40))}::placeholder`,
                size: Number.parseFloat(getComputedStyle(control, "::placeholder").fontSize),
              });
            }
          }
        }
        // Independent spec values: do not read tokens, or a changed token would pass.
        const fixedSizes = [14, 16, 18, 22, 26];
        const fluidSizes = [[30, 4, 44], [34, 5, 54], [38, 6.4, 68], [40, 6.8, 84]]
          .map(([min, vw, max]) => Math.min(max, Math.max(min, window.innerWidth * vw / 100)));
        const floorFailures: string[] = [];
        const scaleFailures: string[] = [];
        for (const { label, size } of [...typography.values(), ...placeholderType]) {
          if (!Number.isFinite(size) || size < 14) floorFailures.push(`${size}px: ${label}`);
          if (!fixedSizes.includes(size) && !fluidSizes.some((expected) => Math.abs(size - expected) <= 0.5)) {
            scaleFailures.push(`${size}px: ${label}`);
          }
        }
        const actions = [...document.querySelectorAll("a, button")].filter((element) => {
          if (!visible(element)) return false;
          const background = getComputedStyle(element).backgroundColor;
          return background !== "transparent" && !/^(?:rgba\(.*,[ ]*|.*\/[ ]*)0(?:\.0+)?\s*\)$/.test(background);
        });
        // Canvas resolves computed CSS colors to sRGB; it never loads an image.
        type Color = [number, number, number, number];
        const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
        if (!context) throw new Error("The contrast audit requires a 2D color parser");
        const color = (value: string): Color => {
          context.clearRect(0, 0, 1, 1);
          context.fillStyle = value;
          context.fillRect(0, 0, 1, 1);
          const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
          return [r / 255, g / 255, b / 255, a / 255];
        };
        const over = (front: Color, back: Color): Color => {
          const alpha = front[3] + back[3] * (1 - front[3]);
          if (!alpha) return [0, 0, 0, 0];
          const channel = (i: number) => (front[i] * front[3] + back[i] * back[3] * (1 - front[3])) / alpha;
          return [channel(0), channel(1), channel(2), alpha];
        };
        const painted = (element: Element | null, foreground: Color = [0, 0, 0, 0]): Color => {
          let result: Color = foreground;
          for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
            const style = getComputedStyle(ancestor);
            if (style.backgroundImage !== "none") throw new Error(`Contrast: unsupported image on ${describe(ancestor, "")}`);
            const backgroundClippedAtBorder = ancestor === element && foreground[3] > 0 && style.backgroundClip !== "border-box";
            if (!backgroundClippedAtBorder) result = over(result, color(style.backgroundColor));
            result[3] *= Number(style.opacity);
          }
          return over(result, [1, 1, 1, 1]);
        };
        const luminance = (value: Color) => {
          const linear = value.slice(0, 3).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
          return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
        };
        const contrast = (front: Color, back: Color) => {
          const a = luminance(front);
          const b = luminance(back);
          return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        };
        const rgb = (value: Color) => `rgb(${value.slice(0, 3).map((v) => Math.round(v * 255)).join(", ")})`;
        const sameRgb = (a: Color, b: Color) =>
          Math.abs(a[0] - b[0]) < 1 / 255 &&
          Math.abs(a[1] - b[1]) < 1 / 255 &&
          Math.abs(a[2] - b[2]) < 1 / 255 &&
          Math.abs(a[3] - b[3]) < 1 / 255;
        const compactSelector = (element: Element) => {
          const tag = element.tagName.toLowerCase();
          if (element.id) return `${tag}#${element.id}`;
          const classes = [...element.classList].slice(0, 2).join(".");
          return classes ? `${tag}.${classes}` : tag;
        };
        const registerFor = (background: Color) => luminance(background) < 0.25 ? "dark" : "light";

        const rootStyle = getComputedStyle(document.documentElement);
        const accentTokens = [
          "--accent-surface",
          "--accent-soft",
          "--accent-border",
          "--accent-strong",
          "--accent-strong-p",
          "--accent-text",
          "--accent-on-dark",
          "--accent-on-dark-p",
          "--accent-dark-surface",
          "--accent-dark-border",
        ].map((token) => ({ token, value: color(rootStyle.getPropertyValue(token).trim()) }));
        const accentTextFailures: string[] = [];
        const accentTextRegisters = { dark: 0, light: 0 };
        let accentTextCount = 0;
        for (const text of texts) {
          const foreground = color(getComputedStyle(text.element).color);
          const match = accentTokens.find((token) => sameRgb(foreground, token.value));
          if (!match) continue;
          accentTextCount += 1;
          const background = painted(text.element);
          accentTextRegisters[registerFor(background)] += 1;
          const ratio = contrast(foreground, background);
          if (ratio < 4.5) {
            accentTextFailures.push(`${location.pathname}: ${text.label}; ${match.token} ${rgb(foreground)} on ${rgb(background)} = ${ratio.toFixed(3)}:1`);
          }
        }
        const g4Tokens = [
          { token: "--g4", value: color("#606366") },
          { token: "--g4-l", value: color("#606366") },
          { token: "--g4-d", value: color("#8C8F92") },
        ];
        const g4TextFailures: string[] = [];
        const g4TextRegisters = { dark: 0, light: 0 };
        const auditG4Text = (element: Element, label: string, foreground: Color) => {
          const match = g4Tokens.find((token) => sameRgb(foreground, token.value));
          if (!match) return;
          const background = painted(element);
          const register = registerFor(background);
          g4TextRegisters[register] += 1;
          const ratio = contrast(foreground, background);
          if (ratio < 4.5) {
            g4TextFailures.push(`${location.pathname}: ${label}; ${match.token} ${rgb(foreground)} on ${rgb(background)} = ${ratio.toFixed(3)}:1`);
          }
        };
        for (const text of texts) {
          auditG4Text(text.element, text.label, color(getComputedStyle(text.element).color));
        }
        for (const control of document.querySelectorAll("input, textarea")) {
          if (!visible(control)) continue;
          const box = control.getBoundingClientRect();
          if (box.width <= 0 || box.height <= 0) continue;
          if (control instanceof HTMLInputElement && ["hidden", "checkbox", "radio", "range", "color", "file", "image"].includes(control.type)) continue;
          if (!(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement) || !control.placeholder || control.value) continue;
          auditG4Text(control, `${describe(control, control.placeholder.slice(0, 40))}::placeholder`, color(getComputedStyle(control, "::placeholder").color));
        }

        const accentControlFailures: string[] = [];
        const neutralControlDebt: string[] = [];
        const focusFailures: string[] = [];
        const accentControlRegisters = { dark: 0, light: 0 };
        const matchedAccentToken = (value: Color) => accentTokens.find((token) => sameRgb(value, token.value));
        const focusTargets = [
          { name: "dark exec", selector: ".r2-dark .rev-button.exec, .quick-capture .rev-button.exec, .agent-esquisse .rev-button.exec, .cmdbar .rev-button.exec" },
          { name: "light exec", selector: ".r2-ecrin .rev-button.exec, .standard-action .rev-button.exec, .rev-actions .rev-button.exec" },
        ];
        for (const target of focusTargets) {
          const control = [...document.querySelectorAll(target.selector)].find((element) => visible(element) && !(element instanceof HTMLButtonElement && element.disabled));
          if (!control || !(control instanceof HTMLElement)) continue;
          control.focus({ preventScroll: true });
          const style = getComputedStyle(control);
          const outlineWidth = Number.parseFloat(style.outlineWidth);
          const outlineStyle = style.outlineStyle;
          const outline = color(style.outlineColor);
          const match = matchedAccentToken(outline);
          if (!(outlineWidth > 0) || outlineStyle === "none" || !match) {
            focusFailures.push(`${location.pathname}: ${target.name} ${compactSelector(control)} outline ${style.outlineColor} is not an accent token`);
            continue;
          }
          const background = painted(control.parentElement);
          const ratio = contrast(outline, background);
          if (ratio < 3) {
            focusFailures.push(`${location.pathname}: ${target.name} ${compactSelector(control)} ${match.token} ${rgb(outline)} on ${rgb(background)} = ${ratio.toFixed(3)}:1`);
          }
        }

        let controlCount = 0;
        let accentControlCount = 0;
        const interactive = 'a[href], button, input, textarea, select, summary, [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="switch"], [role="tab"], [role="slider"], [role="combobox"], [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
        for (const control of document.querySelectorAll(interactive)) {
          if (!visible(control)) continue;
          const box = control.getBoundingClientRect();
          if (box.width <= 0 || box.height <= 0) continue;
          const style = getComputedStyle(control);
          const background = style.backgroundColor;
          const fillColor = color(background);
          const borders = ["top", "right", "bottom", "left"].flatMap((side) => {
            const width = Number.parseFloat(style.getPropertyValue(`border-${side}-width`));
            const borderStyle = style.getPropertyValue(`border-${side}-style`);
            const border = color(style.getPropertyValue(`border-${side}-color`));
            if (!(width > 0) || borderStyle === "none" || borderStyle === "hidden" || border[3] === 0) return [];
            return [border];
          });
          const outlineWidth = Number.parseFloat(style.outlineWidth);
          const outlineStyle = style.outlineStyle;
          const outline = outlineWidth > 0 && outlineStyle !== "none" ? color(style.outlineColor) : null;
          const fill = painted(control);
          const container = painted(control.parentElement);
          const hasDistinctFill = color(background)[3] > 0 && fill.some((channel, i) => Math.abs(channel - container[i]) > 1e-6);
          const hasContour = borders.length >= 3;
          const outlineToken = outline ? matchedAccentToken(outline) : undefined;
          const accentParts = [
            hasDistinctFill ? matchedAccentToken(fillColor) : undefined,
            ...borders.map((border) => matchedAccentToken(border)),
            outlineToken,
          ].filter((match): match is { token: string; value: Color } => Boolean(match));
          if (!hasDistinctFill && !hasContour && !outlineToken) continue;
          controlCount += 1;
          const fillRatio = contrast(fill, container);
          const borderRatios = hasContour ? borders.map((border) => contrast(painted(control, border), container)) : [];
          const outlineRatio = outlineToken && outline ? contrast(painted(control, outline), container) : 1;
          const borderRatio = Math.max(1, ...borderRatios);
          const bestRatio = Math.max(fillRatio, borderRatio, outlineRatio);
          const selector = compactSelector(control);
          const label = control.getAttribute("aria-label") || control.textContent || control.getAttribute("placeholder") || control.getAttribute("name") || "";
          if (accentParts.length > 0) {
            accentControlCount += 1;
            accentControlRegisters[registerFor(container)] += 1;
            if (bestRatio < 3) {
              accentControlFailures.push(`${location.pathname}: ${describe(control, label)}; ${accentParts.map((part) => part.token).join(", ")}; fill ${background} (effective ${rgb(fill)}), container ${rgb(container)}; fill ratio ${fillRatio.toFixed(3)}:1, border ratio ${borderRatio.toFixed(3)}:1, outline ratio ${outlineRatio.toFixed(3)}:1; all < 3:1`);
            }
            continue;
          }
          if (fillRatio < 3 && borderRatio < 3) {
            const item = `${location.pathname}|${window.innerWidth}|${selector}|${Math.max(fillRatio, borderRatio).toFixed(3)}|${describe(control, label)}`;
            neutralControlDebt.push(item);
          }
        }
        const actionFailures: string[] = [];
        for (const action of actions) {
          // Only the action's painted box uses element geometry. Text always uses Range.
          const box = action.getBoundingClientRect();
          for (const text of texts) {
            if (action.contains(text.element)) continue;
            const interactiveSelector = 'a, button, input, select, [role="button"]';
            const textControl = text.element.closest(interactiveSelector);
            if (
              action.matches(interactiveSelector) && textControl &&
              action.parentElement !== null && action.parentElement === textControl.parentElement
            ) continue;
            const dx = Math.max(box.left - text.box.right, text.box.left - box.right, 0);
            const dy = Math.max(box.top - text.box.bottom, text.box.top - box.bottom, 0);
            const overlapX = Math.min(box.right, text.box.right) - Math.max(box.left, text.box.left);
            const overlapY = Math.min(box.bottom, text.box.bottom) - Math.max(box.top, text.box.top);
            if ((overlapY > 0 && dx < 12) || (overlapX > 0 && dy < 12)) {
              actionFailures.push(`${text.label} / ${describe(action, action.textContent ?? "")} : horizontal ${dx.toFixed(2)}px, vertical ${dy.toFixed(2)}px`);
            }
          }
        }
        const textFailures: string[] = [];
        const blockDisplays = new Set(["block", "flex", "grid", "list-item", "table-cell"]);
        const isBlock = (element: Element) => blockDisplays.has(getComputedStyle(element).display);
        const immediateBlockContainer = (element: Element): Element | null => {
          for (let parent = element.parentElement; parent; parent = parent.parentElement) {
            if (isBlock(parent)) return parent;
          }
          return null;
        };
        // Inline phrase fragments still count for action clearance, never as separate blocks.
        const blockTexts = texts.filter((text) => isBlock(text.element)).map((text) => ({
          ...text, container: immediateBlockContainer(text.element),
        }));
        for (let i = 0; i < blockTexts.length; i += 1) {
          const a = blockTexts[i];
          for (let j = i + 1; j < blockTexts.length; j += 1) {
            const b = blockTexts[j];
            if (a.element.contains(b.element) || b.element.contains(a.element)) continue;
            if (a.container !== null && a.container === b.container) continue;
            const x = Math.min(a.box.right, b.box.right) - Math.max(a.box.left, b.box.left);
            const y = Math.min(a.box.bottom, b.box.bottom) - Math.max(a.box.top, b.box.top);
            if (x > 0 && y > 0) textFailures.push(`${a.label} / ${b.label} : overlap ${x.toFixed(2)} × ${y.toFixed(2)}px`);
          }
        }
        return {
          controlCount,
          accentControlCount,
          accentControlFailures,
          accentControlRegisters,
          accentTextCount,
          accentTextFailures,
          accentTextRegisters,
          g4TextFailures,
          g4TextRegisters,
          focusFailures,
          neutralControlDebt,
          textCount: texts.length,
          actionCount: actions.length,
          actionFailures,
          textFailures,
          floorFailures,
          scaleFailures,
        };
      });

      const errorResult = await measureInvalidFormStates(page, path, width);

      accentTextRegisters.dark += result.accentTextRegisters.dark;
      accentTextRegisters.light += result.accentTextRegisters.light;
      accentTextRestRegisters.dark += result.accentTextRegisters.dark;
      accentTextRestRegisters.light += result.accentTextRegisters.light;
      accentTextRegisters.dark += errorResult.accentTextRegisters.dark;
      accentTextRegisters.light += errorResult.accentTextRegisters.light;
      accentTextErrorRegisters.dark += errorResult.accentTextRegisters.dark;
      accentTextErrorRegisters.light += errorResult.accentTextRegisters.light;
      g4TextRegisters.dark += result.g4TextRegisters.dark;
      g4TextRegisters.light += result.g4TextRegisters.light;
      accentControlRegisters.dark += result.accentControlRegisters.dark;
      accentControlRegisters.light += result.accentControlRegisters.light;
      errorMeasurements.push(...errorResult.measurements);
      const seenNeutralDebt = new Set<string>();
      const unexpectedNeutralDebt: string[] = [];
      const regressedNeutralDebt: string[] = [];
      const duplicateNeutralDebt: string[] = [];
      for (const item of result.neutralControlDebt) {
        const [pagePath, measuredWidth, selector, ratio] = item.split("|");
        const key = `${pagePath}|${measuredWidth}|${selector}`;
        const frozenRatio = NEUTRAL_CONTROL_DEBT.get(key);
        if (frozenRatio === undefined) {
          unexpectedNeutralDebt.push(item);
          continue;
        }
        if (Number(ratio) + 0.01 < frozenRatio) {
          regressedNeutralDebt.push(`${item}; frozen ${frozenRatio.toFixed(3)}:1`);
        }
        if (seenNeutralDebt.has(key)) duplicateNeutralDebt.push(item);
        seenNeutralDebt.add(key);
      }
      for (const item of result.neutralControlDebt) {
        test.info().annotations.push({ type: "neutral-control-debt", description: item });
      }
      expect(result.controlCount, "the contrast audit must measure interactive controls").toBeGreaterThan(0);
      expect.soft(result.accentControlFailures, `${path} at ${width}px: accent control fill, border or outline contrast against the container must be at least 3:1`).toEqual([]);
      expect.soft(result.accentTextFailures, `${path} at ${width}px: accent text must keep 4.5:1 contrast on its painted background`).toEqual([]);
      expect.soft(result.g4TextFailures, `${path} at ${width}px: g4 text must keep 4.5:1 contrast on its painted background`).toEqual([]);
      expect.soft(result.focusFailures, `${path} at ${width}px: focused accent controls must use a visible accent outline`).toEqual([]);
      expect.soft(unexpectedNeutralDebt, `${path} at ${width}px: neutral controls below 3:1 must not grow beyond the frozen debt list`).toEqual([]);
      expect.soft(regressedNeutralDebt, `${path} at ${width}px: frozen neutral control ratios must not decrease`).toEqual([]);
      expect.soft(duplicateNeutralDebt, `${path} at ${width}px: debt entries with the same selector must not absorb each other`).toEqual([]);
      expect(result.textCount, "the geometry audit must measure rendered text").toBeGreaterThan(0);
      expect(result.actionCount, "the geometry audit must measure filled actions").toBeGreaterThan(0);
      expect.soft(result.actionFailures, `${path} at ${width}px: minimum text/action gap is 12px`).toEqual([]);
      expect.soft(result.textFailures, `${path} at ${width}px: text rectangles must not overlap`).toEqual([]);
      expect.soft(result.floorFailures, `${path} at ${width}px: visible text must be at least 14px`).toEqual([]);
      expect.soft(result.scaleFailures, `${path} at ${width}px: sizes outside the nine spec steps (fluid tolerance 0.5px)`).toEqual([]);
      expect.soft(errorResult.failures, `${path} at ${width}px: reachable form errors must be triggered through client validation and keep 4.5:1 contrast`).toEqual([]);
    }
    test.info().annotations.push({
      type: "accent-text-registers",
      description: `at ${width}px: rest dark ${accentTextRestRegisters.dark}, rest light ${accentTextRestRegisters.light}; errors dark ${accentTextErrorRegisters.dark}, errors light ${accentTextErrorRegisters.light}; final dark ${accentTextRegisters.dark}, final light ${accentTextRegisters.light}`,
    });
    test.info().annotations.push({
      type: "g4-text-registers",
      description: `at ${width}px: dark ${g4TextRegisters.dark}, light ${g4TextRegisters.light}`,
    });
    expect(accentTextRegisters.dark, `at ${width}px: accent text must be measured on at least one dark register page at rest or in a reachable form error state`).toBeGreaterThan(0);
    if (accentTextRegisters.light === 0) {
      test.info().annotations.push({
        type: "light-accent-proof",
        description: `at ${width}px: real routes expose 0 light-register accent text nodes after the newsletter removal; light-register frame and focus contrast are guarded by the injected r2-ecrin test`,
      });
    }
    expect(accentControlRegisters.dark, `at ${width}px: accent controls must be measured on at least one dark register page`).toBeGreaterThan(0);
    expect(accentControlRegisters.light, `at ${width}px: accent controls must be measured on at least one light register page`).toBeGreaterThan(0);
    expect(g4TextRegisters.dark, `at ${width}px: g4 text must be measured on at least one dark register page`).toBeGreaterThan(0);
    if (g4TextRegisters.light === 0) {
      test.info().annotations.push({
        type: "light-g4-proof",
        description: `at ${width}px: real routes expose 0 light-register g4 text nodes; light-register g4 is guarded by the injected nested-surface test`,
      });
    }
    expect(errorMeasurements.length, `at ${width}px: reachable form error states must be measured`).toBeGreaterThan(0);
    for (const measurement of errorMeasurements) {
      test.info().annotations.push({ type: "form-error-contrast", description: measurement });
    }
  });
}

async function measureInvalidFormStates(page: Page, path: string, width: number) {
  const probes = ERROR_PROBES_BY_PATH[path] ?? [];
  const failures: string[] = [];
  const measurements: string[] = [];
  const accentTextRegisters: Record<AccentRegister, number> = { dark: 0, light: 0 };

  for (const probe of probes) {
    await page.goto(`${BASE_URL}${path}`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("main h1")).toBeVisible({ timeout: 10_000 });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: "*,*::before,*::after{transition:none!important;animation:none!important}" });
    await page.evaluate(() => window.scrollTo(0, 0));

    if (path === "/" || path === "/fr") {
      await expect(async () => {
        await page.locator("#agent-operation").fill("reporting");
        await page.locator('.agent-esquisse-form button[type="submit"]').click();
        await expect(page.locator("#quick-idee")).toHaveValue("reporting");
      }).toPass({ timeout: 10_000 });
    }

    const form = page.locator(probe.form).first();
    const field = form.locator(probe.field);
    const button = form.locator("button[type='submit']");
    const error = form.locator(probe.error);

    await expect(form, `${path} at ${width}px: ${probe.name} form must exist`).toBeVisible({ timeout: 10_000 });
    await expect(async () => {
      await field.fill("pas-un-email", { timeout: 1_000 });
      await expect(field, `${path} at ${width}px: ${probe.name} invalid value must survive hydration before submit`).toHaveValue("pas-un-email", { timeout: 500 });
      await button.click({ timeout: 1_000 });
      await expect(error, `${path} at ${width}px: ${probe.name} must expose its client validation error`).toBeVisible({ timeout: 1_000 });
    }).toPass({
      intervals: [100, 250, 500],
      timeout: 10_000,
    });

    const contrastResult = await error.evaluate((element) => {
      type Color = [number, number, number, number];
      const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("The contrast audit requires a 2D color parser");
      const color = (value: string): Color => {
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = value;
        context.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
        return [r / 255, g / 255, b / 255, a / 255];
      };
      const over = (front: Color, back: Color): Color => {
        const alpha = front[3] + back[3] * (1 - front[3]);
        if (!alpha) return [0, 0, 0, 0];
        const channel = (i: number) => (front[i] * front[3] + back[i] * back[3] * (1 - front[3])) / alpha;
        return [channel(0), channel(1), channel(2), alpha];
      };
      const painted = (target: Element | null, foreground: Color = [0, 0, 0, 0]): Color => {
        let result: Color = foreground;
        for (let ancestor = target; ancestor; ancestor = ancestor.parentElement) {
          const style = getComputedStyle(ancestor);
          if (style.backgroundImage !== "none") throw new Error(`Contrast: unsupported image on ${ancestor.tagName.toLowerCase()}`);
          result = over(result, color(style.backgroundColor));
          result[3] *= Number(style.opacity);
        }
        return over(result, [1, 1, 1, 1]);
      };
      const luminance = (value: Color) => {
        const linear = value.slice(0, 3).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
        return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
      };
      const contrast = (front: Color, back: Color) => {
        const a = luminance(front);
        const b = luminance(back);
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      };
      const rgb = (value: Color) => `rgb(${value.slice(0, 3).map((channel) => Math.round(channel * 255)).join(", ")})`;
      const sameRgb = (a: Color, b: Color) =>
        Math.abs(a[0] - b[0]) < 1 / 255 &&
        Math.abs(a[1] - b[1]) < 1 / 255 &&
        Math.abs(a[2] - b[2]) < 1 / 255 &&
        Math.abs(a[3] - b[3]) < 1 / 255;
      const registerFor = (background: Color) => luminance(background) < 0.25 ? "dark" : "light";
      const rootStyle = getComputedStyle(document.documentElement);
      const accentTokens = [
        "--accent-surface",
        "--accent-soft",
        "--accent-border",
        "--accent-strong",
        "--accent-strong-p",
        "--accent-text",
        "--accent-on-dark",
        "--accent-on-dark-p",
        "--accent-dark-surface",
        "--accent-dark-border",
      ].map((token) => ({ token, value: color(rootStyle.getPropertyValue(token).trim()) }));
      const foreground = color(getComputedStyle(element).color);
      const background = painted(element);
      const accentToken = accentTokens.find((token) => sameRgb(foreground, token.value))?.token ?? null;
      return {
        accentToken,
        foreground: rgb(foreground),
        background: rgb(background),
        register: registerFor(background),
        ratio: contrast(foreground, background),
      };
    });

    const tokenDescription = contrastResult.accentToken ? `${contrastResult.accentToken} ` : "";
    const description = `${path} at ${width}px: ${probe.name} via ${probe.field}=pas-un-email; ${tokenDescription}${contrastResult.foreground} on ${contrastResult.background} (${contrastResult.register}) = ${contrastResult.ratio.toFixed(3)}:1`;
    measurements.push(description);
    if (contrastResult.accentToken) {
      accentTextRegisters[contrastResult.register as AccentRegister] += 1;
    } else {
      failures.push(`${description}; error text color is not an accent token`);
    }
    if (contrastResult.ratio < 4.5) failures.push(description);
  }

  return { failures, measurements, accentTextRegisters };
}

test("accent surface variables keep injected nested surfaces readable", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${BASE_URL}/manufacture`, { waitUntil: "domcontentloaded" });
  await expect(page.locator("main h1")).toBeVisible();
  await page.addStyleTag({ content: "*,*::before,*::after{transition:none!important;animation:none!important}" });

  const result = await page.evaluate(() => {
    type Color = [number, number, number, number];
    const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("The contrast audit requires a 2D color parser");
    const color = (value: string): Color => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
      return [r / 255, g / 255, b / 255, a / 255];
    };
    const over = (front: Color, back: Color): Color => {
      const alpha = front[3] + back[3] * (1 - front[3]);
      if (!alpha) return [0, 0, 0, 0];
      const channel = (i: number) => (front[i] * front[3] + back[i] * back[3] * (1 - front[3])) / alpha;
      return [channel(0), channel(1), channel(2), alpha];
    };
    const painted = (element: Element | null, foreground: Color = [0, 0, 0, 0]): Color => {
      let result: Color = foreground;
      for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor);
        result = over(result, color(style.backgroundColor));
        result[3] *= Number(style.opacity);
      }
      return over(result, [1, 1, 1, 1]);
    };
    const luminance = (value: Color) => {
      const linear = value.slice(0, 3).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    };
    const contrast = (front: Color, back: Color) => {
      const a = luminance(front);
      const b = luminance(back);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    };
    const rgb = (value: Color) => `rgb(${value.slice(0, 3).map((channel) => Math.round(channel * 255)).join(", ")})`;
    const sameRgb = (a: Color, b: Color) =>
      Math.abs(a[0] - b[0]) < 1 / 255 &&
      Math.abs(a[1] - b[1]) < 1 / 255 &&
      Math.abs(a[2] - b[2]) < 1 / 255 &&
      Math.abs(a[3] - b[3]) < 1 / 255;
    const registerFor = (background: Color) => luminance(background) < 0.25 ? "dark" : "light";

    const host = document.querySelector("main");
    if (!host) throw new Error("Missing main host");
    const dark = document.createElement("section");
    dark.className = "r2-dark";
    dark.innerHTML = `
      <section class="r2-ecrin" data-probe="nested-light">
        <div class="frame" data-probe="light-frame"><span class="fx"></span><span>Probe</span></div>
        <button class="rev-button exec" data-probe="light-exec">Probe</button>
        <p class="r2-registre-note" data-probe="g4-nested-light">Probe</p>
      </section>
      <p class="r2-registre-note" data-probe="g4-dark">Probe</p>
      <span class="st crit" data-probe="dark-crit">Probe</span>`;
    const instrument = document.createElement("section");
    instrument.className = "instrument";
    instrument.innerHTML = `
      <div class="frame decision-card" data-probe="instrument-card">
        <span class="fx"></span>
        <span class="r2-registre-note" data-probe="g4-instrument-card">Probe</span>
      </div>`;
    host.append(dark, instrument);

    const frame = document.querySelector('[data-probe="light-frame"]');
    const button = document.querySelector('[data-probe="light-exec"]');
    const crit = document.querySelector('[data-probe="dark-crit"]');
    if (!(frame instanceof HTMLElement) || !(button instanceof HTMLElement) || !(crit instanceof HTMLElement)) {
      throw new Error("Missing injected probes");
    }
    button.focus();
    const frameLine = color(getComputedStyle(frame, "::before").borderTopColor);
    const buttonOutline = color(getComputedStyle(button).outlineColor);
    const critText = color(getComputedStyle(crit).color);
    const critDot = color(getComputedStyle(crit, "::before").backgroundColor);
    const lightBackground = painted(frame);
    const lightContainer = painted(button.parentElement);
    const darkBackground = painted(crit);
    const rootStyle = getComputedStyle(document.documentElement);
    const g4Light = color(rootStyle.getPropertyValue("--g4-l").trim());
    const g4Dark = color(rootStyle.getPropertyValue("--g4-d").trim());
    const g4Probes = [
      { name: "r2-dark > r2-ecrin > r2-registre-note", selector: '[data-probe="g4-nested-light"]', expectedToken: "--g4-l", expected: g4Light },
      { name: "r2-dark > r2-registre-note", selector: '[data-probe="g4-dark"]', expectedToken: "--g4-d", expected: g4Dark },
      { name: "instrument > decision-card > r2-registre-note", selector: '[data-probe="g4-instrument-card"]', expectedToken: "--g4-d", expected: g4Dark },
    ].map((probe) => {
      const element = document.querySelector(probe.selector);
      if (!(element instanceof HTMLElement)) throw new Error(`Missing ${probe.name} g4 probe`);
      const foreground = color(getComputedStyle(element).color);
      const background = painted(element);
      return {
        name: probe.name,
        expectedToken: probe.expectedToken,
        expected: rgb(probe.expected),
        foreground: rgb(foreground),
        background: rgb(background),
        register: registerFor(background),
        ratio: contrast(foreground, background),
        matchesExpectedToken: sameRgb(foreground, probe.expected),
      };
    });
    return {
      lightFrameRatio: contrast(frameLine, lightBackground),
      lightFocusRatio: contrast(buttonOutline, lightContainer),
      darkCritTextRatio: contrast(critText, darkBackground),
      darkCritDotRatio: contrast(critDot, darkBackground),
      g4Probes,
    };
  });

  test.info().annotations.push({
    type: "injected-light-accent-proof",
    description: `frame ${result.lightFrameRatio.toFixed(3)}:1; focus ${result.lightFocusRatio.toFixed(3)}:1`,
  });
  test.info().annotations.push({
    type: "injected-g4-proof",
    description: result.g4Probes
      .map((probe) => `${probe.name}: ${probe.foreground} expected ${probe.expectedToken} ${probe.expected} on ${probe.background} (${probe.register}) = ${probe.ratio.toFixed(3)}:1`)
      .join("; "),
  });
  const g4ProbeFailures = result.g4Probes.flatMap((probe) => {
    const failures: string[] = [];
    if (!probe.matchesExpectedToken) {
      failures.push(`${probe.name}: expected ${probe.expectedToken} ${probe.expected}, received ${probe.foreground}`);
    }
    if (probe.ratio < 4.5) {
      failures.push(`${probe.name}: ${probe.foreground} on ${probe.background} (${probe.register}) = ${probe.ratio.toFixed(3)}:1`);
    }
    return failures;
  });
  expect(result.lightFrameRatio, "injected r2-ecrin frame line must use the light-surface accent").toBeGreaterThanOrEqual(3);
  expect(result.lightFocusRatio, "injected r2-ecrin exec focus must use the light-surface accent").toBeGreaterThanOrEqual(3);
  expect(result.darkCritTextRatio, "injected dark critical status text must use the dark-surface accent").toBeGreaterThanOrEqual(4.5);
  expect(result.darkCritDotRatio, "injected dark critical status dot must use the dark-surface accent").toBeGreaterThanOrEqual(3);
  expect(g4ProbeFailures, "injected g4 probes must use the exact expected token and keep 4.5:1 contrast").toEqual([]);
});
