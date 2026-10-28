import { readFile } from "node:fs/promises";
import { CAL_LINK_COMMISSION, CAL_LINK_COMMISSION_EN } from "../site.config";
import { test, expect } from "./network-deny.setup";

const BASE = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const viewports = [
  { width: 1440, height: 800 }, { width: 1280, height: 720 },
  { width: 800, height: 1100 }, { width: 390, height: 844 },
];
type Range = { min: number; max: number };
type Stability = {
  heights: Record<string, Range>;
  document: Range;
  shifts: number;
  samples: number;
  captions: string[];
  cases: string[];
  offers: string[];
  phoneAnimated: boolean;
  stop: () => void;
};
declare global {
  interface Window {
    pageStability: Stability;
    fontStability: { top: Range; height: Range; shifts: number; stop: () => void };
  }
}

test.use({ serviceWorkers: "block" });

for (const locale of ["fr", "en"] as const) for (const viewport of viewports) {
  test(`page stable ${locale} ${viewport.width}×${viewport.height}`, async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    // Le fixture commun pose le deny-all avant toute navigation. Seules ces
    // deux réponses Cal attendues sont locales ; aucun route.fetch ni proxy.
    const link = locale === "fr" ? CAL_LINK_COMMISSION : CAL_LINK_COMMISSION_EN;
    // Mesure PAGE-STABLE : 420 + 150 sur ordinateur, 420 + 490 sur mobile.
    // À 800px la colonne de l'iframe mesure 718px : profil étroit à confirmer
    // sur l'hôte avec Cal réel. Fixture indépendante, jamais lue depuis le CSS.
    const calendarHeight = viewport.width <= 800 ? 910 : 570;
    const loader = await readFile("node_modules/@calcom/embed-core/dist/embed/embed.js", "utf8");
    await page.route("**/embed/embed.js", async route => {
      expect(new URL(route.request().url()).hostname).toBe("app.cal.com");
      await route.fulfill({ contentType: "application/javascript", body: loader });
    });
    let calendarRequests = 0;
    await page.route("**/embed?**", async route => {
      const url = new URL(route.request().url());
      expect(url.hostname).toBe("app.cal.com");
      expect(url.pathname).toBe(`/${link}/embed`);
      calendarRequests++;
      await route.fulfill({ contentType: "text/html", body: `<!doctype html>
        <html><head><style>html,body{margin:0}main{height:${calendarHeight}px}</style></head>
        <body><main aria-label="Calendrier local">Calendrier de test</main><script>
          const send = (type, data = {}) => parent.postMessage({fullType: 'CAL:commission:' + type, data}, '*');
          send('__iframeReady');
          setTimeout(() => {
            send('__dimensionChanged', {iframeHeight: ${calendarHeight}});
            send('linkReady');
          }, 1500);
        </script></body></html>` });
    });
    await page.route("**/api/interet", route => route.fulfill({ json: { ok: true } }));
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const url = new URL(locale === "fr" ? "/fr" : "/", BASE);
    expect(["localhost", "127.0.0.1"]).toContain(url.hostname);
    await page.goto(url.href);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => {
      const range = (value: number): Range => ({ min: value, max: value });
      const update = (target: Range, value: number) => {
        target.min = Math.min(target.min, value);
        target.max = Math.max(target.max, value);
      };
      const targets = Array.from(document.querySelectorAll<HTMLElement>(
        "main > section, .phone, .use-case, .partner, .ontocap-stack, .cal-embed-stage",
      ));
      const keys = targets.map((node, i) => `${i}:${node.id || node.className}`);
      const state: Stability = window.pageStability = {
        heights: Object.fromEntries(targets.map((node, i) => [keys[i], range(node.getBoundingClientRect().height)])),
        document: range(document.documentElement.scrollHeight), shifts: 0, samples: 0,
        captions: [], cases: [], offers: [], phoneAnimated: false, stop: () => {},
      };
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
          if (!shift.hadRecentInput) state.shifts += shift.value;
        }
      });
      observer.observe({ type: "layout-shift" });
      const remember = (list: string[], value: string | null | undefined) => {
        if (value && !list.includes(value)) list.push(value);
      };
      let frame = 0;
      const sample = () => {
        targets.forEach((node, i) => update(state.heights[keys[i]], node.getBoundingClientRect().height));
        update(state.document, document.documentElement.scrollHeight);
        remember(state.captions, document.querySelector(".ontocap")?.textContent);
        remember(state.cases, document.querySelector(".use-case")?.getAttribute("data-case"));
        remember(state.offers, document.querySelector(".partner.flip .offer")?.textContent);
        state.phoneAnimated ||= !!document.querySelector('.live[data-motion="ready"]');
        state.samples++;
        frame = requestAnimationFrame(sample);
      };
      sample();
      state.stop = () => { cancelAnimationFrame(frame); observer.disconnect(); };
    });

    // Temps réel : ni horloge accélérée, ni mouvement réduit, ni arrêt des animations.
    await page.waitForTimeout(25_000);
    expect(calendarRequests, "le calendrier doit encore être différé").toBe(0);
    const sections = page.locator("main > section");
    await expect(sections).toHaveCount(9);
    for (let i = 1; i < 9; i++) {
      const destination = await sections.nth(i).evaluate(node => node.getBoundingClientRect().top + scrollY);
      // Défilement progressif : laisse passer les entrées et sorties d'IntersectionObserver.
      await page.evaluate(async destination => {
        while (scrollY < Math.min(destination, document.documentElement.scrollHeight - innerHeight) - 1) {
          scrollTo({ top: Math.min(destination, scrollY + innerHeight / 4), behavior: "instant" });
          await new Promise(resolve => setTimeout(resolve, 120));
        }
      }, destination);
      if ([2, 5, 6].includes(i)) await page.waitForTimeout(25_000);
    }
    await page.evaluate(async () => {
      while (scrollY < document.documentElement.scrollHeight - innerHeight - 1) {
        scrollBy({ top: innerHeight / 4, behavior: "instant" });
        await new Promise(resolve => setTimeout(resolve, 120));
      }
    });
    await expect(page.locator('.cal-embed-stage[data-ready="true"]')).toBeVisible();
    expect(calendarRequests).toBe(1);
    await page.waitForTimeout(2_000);
    const calendar = page.locator(".cal-embed-stage iframe");
    await expect(calendar).toBeVisible();
    expect((await calendar.boundingBox())!.height).toBeCloseTo(calendarHeight, 0);
    const stage = (await page.locator(".cal-embed-stage").boundingBox())!;
    const frame = (await calendar.boundingBox())!;
    expect(frame.y + frame.height).toBeLessThanOrEqual(stage.y + stage.height + 1);
    const result = await page.evaluate(() => {
      const { stop, ...result } = window.pageStability;
      stop();
      return result;
    });
    await testInfo.attach("stabilite.json", { body: JSON.stringify(result, null, 2), contentType: "application/json" });
    expect(result.samples).toBeGreaterThan(100);
    expect(result.captions.length).toBeGreaterThan(1);
    expect(result.cases.length).toBeGreaterThan(1);
    expect(result.offers.length).toBeGreaterThan(1);
    expect(result.phoneAnimated).toBe(true);
    for (const [key, range] of Object.entries(result.heights)) {
      expect(range.max - range.min, key).toBeLessThanOrEqual(1);
    }
    expect(result.document.max - result.document.min, "scrollHeight").toBeLessThanOrEqual(1);
    expect(result.shifts, "somme des layout-shift hors interaction").toBeLessThanOrEqual(.01);
  });
}

// Source 2 : contrairement au scénario long qui démarre après fonts.ready,
// celui-ci mesure l'échange de la fonte de repli avec les trois fichiers locaux.
for (const locale of ["fr", "en"] as const) for (const viewport of viewports) {
  test(`titre stable pendant le chargement des polices ${locale} ${viewport.width}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.route("**/embed/embed.js", async route => {
      expect(new URL(route.request().url()).hostname).toBe("app.cal.com");
      await route.fulfill({ contentType: "application/javascript", body: "/* Calendrier hors écran. */" });
    });
    let release = () => {};
    const fontGate = new Promise<void>(resolve => { release = resolve; });
    await page.route("**/fonts/rev02/GeneralSans-*.woff2", async route => {
      const url = new URL(route.request().url());
      expect(["localhost", "127.0.0.1"]).toContain(url.hostname);
      expect(url.pathname).toMatch(/^\/fonts\/rev02\/GeneralSans-(Regular|Medium|Semibold)\.woff2$/);
      const body = await readFile(`public${url.pathname}`);
      await fontGate;
      await route.fulfill({ contentType: "font/woff2", body });
    });
    try {
      const url = new URL(locale === "fr" ? "/fr" : "/", BASE);
      expect(["localhost", "127.0.0.1"]).toContain(url.hostname);
      await page.goto(url.href, { waitUntil: "domcontentloaded" });
      await expect(page.locator(".hero h1")).toBeVisible();
      await page.waitForTimeout(500);
      expect(await page.evaluate(() => document.fonts.check('500 75px "General Sans"'))).toBe(false);
      await page.evaluate(() => {
        const heading = document.querySelector(".hero h1")!;
        const box = heading.getBoundingClientRect();
        const state = window.fontStability = {
          top: { min: box.top, max: box.top }, height: { min: box.height, max: box.height },
          shifts: 0, stop: () => {},
        };
        const observer = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
            if (!shift.hadRecentInput) state.shifts += shift.value;
          }
        });
        observer.observe({ type: "layout-shift" });
        let frame = 0;
        const sample = () => {
          const box = heading.getBoundingClientRect();
          for (const key of ["top", "height"] as const) {
            state[key].min = Math.min(state[key].min, box[key]);
            state[key].max = Math.max(state[key].max, box[key]);
          }
          frame = requestAnimationFrame(sample);
        };
        sample();
        state.stop = () => { cancelAnimationFrame(frame); observer.disconnect(); };
      });
      release();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(250);
      for (const weight of [400, 500, 600]) {
        expect(await page.evaluate(weight => document.fonts.check(`${weight} 75px "General Sans"`), weight)).toBe(true);
      }
      const result = await page.evaluate(() => {
        const { stop, ...result } = window.fontStability;
        stop();
        return result;
      });
      await testInfo.attach("polices.json", { body: JSON.stringify(result), contentType: "application/json" });
      expect(result.top.max - result.top.min, "position du titre").toBeLessThanOrEqual(1);
      expect(result.height.max - result.height.min, "hauteur du titre").toBeLessThanOrEqual(1);
      expect(result.shifts, "échange des fontes sans saut").toBeLessThanOrEqual(.01);
    } finally {
      release();
    }
  });
}
