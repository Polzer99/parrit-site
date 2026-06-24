import { expect, test } from "@playwright/test";

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:3000";

const pages = [
  { slug: "home", path: "/fr", reviewArtifact: true },
  { slug: "masterclass-ia", path: "/fr/masterclass-ia", reviewArtifact: true },
  { slug: "masterclass-metier", path: "/fr/masterclass-metier" },
  { slug: "sessions-mcp", path: "/fr/sessions-mcp" },
  { slug: "audit", path: "/fr/audit" },
  { slug: "optimisation-flotte", path: "/fr/optimisation-flotte", reviewArtifact: true },
  { slug: "deploiement-agents", path: "/fr/deploiement-agents" },
  { slug: "outils-agentiques", path: "/fr/outils-agentiques" },
  { slug: "deployer", path: "/fr/deployer", reviewArtifact: true },
  { slug: "croissance", path: "/fr/croissance", reviewArtifact: true },
  { slug: "transmettre", path: "/fr/transmettre", reviewArtifact: true },
  { slug: "blog", path: "/fr/blog" },
  { slug: "blog-carte-action", path: "/fr/blog/une-carte-une-action" },
  { slug: "actualite", path: "/fr/actualite" },
  { slug: "glossaire", path: "/fr/glossaire" },
  { slug: "glossaire-agent-ia", path: "/fr/glossaire/agent-ia-entreprise" },
  { slug: "auteur-paul-larmaraud", path: "/fr/auteur/paul-larmaraud" },
  { slug: "zh-home", path: "/zh-CN", expectedText: /[\u3400-\u9fff]/u },
  { slug: "zh-blog", path: "/zh-CN/blog", expectedText: /[\u3400-\u9fff]/u },
  { slug: "zh-actualite", path: "/zh-CN/actualite", expectedText: /[\u3400-\u9fff]/u },
  { slug: "zh-setup", path: "/zh-CN/setup-claude-code", expectedText: /[\u3400-\u9fff]/u },
  { slug: "zh-remote", path: "/zh-CN/remote", expectedText: /[\u3400-\u9fff]/u },
  {
    slug: "zh-auteur-paul-larmaraud",
    path: "/zh-CN/auteur/paul-larmaraud",
    expectedText: /[\u3400-\u9fff]/u,
  },
  { slug: "academy", path: "/academy" },
  { slug: "fondateurs", path: "/fondateurs" },
  { slug: "diagnostic", path: "/diagnostic" },
  { slug: "detecteur-bullshit", path: "/outils/detecteur-bullshit" },
];

const expectedOrigin = "https://parrit.ai";
const expectedSocialImage = `${expectedOrigin}/opengraph-image`;
const locales = ["fr", "en", "pt-BR", "zh-CN"];
const maturityPaths = [
  "/masterclass-ia",
  "/masterclass-metier",
  "/sessions-mcp",
  "/audit",
  "/deploiement-agents",
  "/outils-agentiques",
  "/optimisation-flotte",
];
const legacyRedirects = [
  { from: "/audit-claude-code", to: "/audit" },
  { from: "/sprint", to: "/deploiement-agents" },
];
const localizedOnePagerChrome = [
  {
    path: "/en/masterclass-ia",
    nav: "Stories",
    contact: "Write to us",
    priceCta: "See pricing",
    primaryCta: "Book the masterclass",
    hero: "Stop absorbing AI noise. Understand the mechanics.",
    story: "The committee that did not know where to start",
    storyTitle: "What does transformation look like at this level?",
    railLabel: "Discovery",
    forbiddenChrome: [
      "Nous écrire",
      "Voir le prix",
      "À quoi ressemble",
      "Réserver la masterclass",
      "Arrêtez de subir",
      "Le comité qui ne savait pas",
    ],
  },
  {
    path: "/pt-BR/masterclass-ia",
    nav: "Histórias",
    contact: "Escrever para nós",
    priceCta: "Ver o preço",
    primaryCta: "Reservar a masterclass",
    hero: null,
    story: null,
    storyTitle: "Como é uma transformação neste nível?",
    railLabel: "Descoberta",
    forbiddenChrome: ["Nous écrire", "Voir le prix", "À quoi ressemble", "Réserver la masterclass"],
  },
  {
    path: "/zh-CN/masterclass-ia",
    nav: "案例",
    contact: "联系我们",
    priceCta: "查看价格",
    primaryCta: "预约大师课",
    hero: null,
    story: null,
    storyTitle: "这个阶段的转型是什么样？",
    railLabel: "认知",
    forbiddenChrome: ["Nous écrire", "Voir le prix", "À quoi ressemble", "Réserver la masterclass"],
  },
];
const localizedHomeHero = [
  {
    path: "/fr",
    h1: "Parrit opère vos deux fronts critiques : back-office automatisé et business généré.",
    cta: "Recevoir mon diagnostic",
  },
  {
    path: "/en",
    h1: "Parrit operates your two critical fronts: automated back office and generated business.",
    cta: "Get my diagnostic",
  },
  {
    path: "/pt-BR",
    h1: "A Parrit opera suas duas frentes críticas: back-office automatizado e business gerado.",
    cta: "Receber meu diagnóstico",
  },
  {
    path: "/zh-CN",
    h1: "Parrit 为你运营两个关键战线：自动化后台和业务增长。",
    cta: "获取我的诊断",
  },
];

test("home maturity section exposes all N1-N7 entry points", async ({ page }) => {
  await page.goto(new URL("/fr", BASE_URL).toString(), { waitUntil: "networkidle" });

  await expect(page.locator("#maturite .mountain-point")).toHaveCount(7);
  await expect(page.locator("#maturite .maturite-tile")).toHaveCount(7);
  await expect(page.locator("#maturite .maturite-example")).toHaveCount(3);
  await expect(page.locator("#maturite")).toContainText("Un COMEX qui découvre");
  await expect(page.locator("#maturite")).toContainText("Avant");
  await expect(page.locator("#maturite")).toContainText("Après");

  for (const path of maturityPaths) {
    await expect(page.locator(`#maturite .mountain-point[href="/fr${path}"]`)).toHaveCount(1);
    await expect(page.locator(`#maturite .maturite-tile[href="/fr${path}"]`)).toHaveCount(1);
  }
});

for (const heroCase of localizedHomeHero) {
  test(`${heroCase.path} clarifies the two-front home hero`, async ({ page }) => {
    await page.goto(new URL(heroCase.path, BASE_URL).toString(), {
      waitUntil: "networkidle",
    });

    await expect(page.locator(".hero h1")).toContainText(heroCase.h1);
    await expect(page.locator(".hero-desktop-cta .btn-red")).toContainText(heroCase.cta);
  });
}

test("mobile home hero surfaces the primary CTA before tools", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(new URL("/fr", BASE_URL).toString(), { waitUntil: "networkidle" });

  const cta = page.locator(".hero-mobile-cta .btn-red");
  await expect(cta).toBeVisible();
  await expect(cta).toContainText("Recevoir mon diagnostic");

  const layout = await page.evaluate(() => {
    const sub = document.querySelector(".hero .sub")?.getBoundingClientRect();
    const ctaBox = document
      .querySelector(".hero-mobile-cta .btn-red")
      ?.getBoundingClientRect();
    const chips = document.querySelector(".hero .chips")?.getBoundingClientRect();

    return sub && ctaBox && chips
      ? { subBottom: sub.bottom, ctaTop: ctaBox.top, ctaBottom: ctaBox.bottom, chipsTop: chips.top }
      : null;
  });

  expect(layout, "mobile hero layout boxes").not.toBeNull();
  expect(layout?.ctaTop, "CTA is after the subtitle").toBeGreaterThan(layout?.subBottom ?? 0);
  expect(layout?.ctaBottom, "CTA is visible above the fold").toBeLessThan(844);
  expect(layout?.chipsTop, "tools stay after the primary CTA on mobile").toBeGreaterThan(
    layout?.ctaBottom ?? 0,
  );
});

test("home hero CTA emits the conversion metric", async ({ page }) => {
  await page.goto(new URL("/fr", BASE_URL).toString(), { waitUntil: "networkidle" });

  await page.evaluate(() => {
    const win = window as unknown as {
      __heroEvents: { event: string; props: Record<string, unknown> }[];
      posthog: { capture: (event: string, props: Record<string, unknown>) => void };
    };

    win.__heroEvents = [];
    win.posthog = {
      capture: (event, props) => win.__heroEvents.push({ event, props }),
    };
  });

  await page.locator(".hero-desktop-cta .btn-red").click();

  const event = await page.evaluate(() => {
    const win = window as unknown as {
      __heroEvents?: { event: string; props: Record<string, unknown> }[];
    };

    return win.__heroEvents?.find((item) => item.event === "hero_cta_click");
  });

  expect(event?.props).toMatchObject({ page: "/fr", placement: "desktop" });
});

for (const chromeCase of localizedOnePagerChrome) {
  test(`${chromeCase.path} localizes maturity one-pager chrome`, async ({ page }) => {
    await page.goto(new URL(chromeCase.path, BASE_URL).toString(), {
      waitUntil: "networkidle",
    });

    await expect(page.locator(".nav")).toContainText(chromeCase.nav);
    await expect(page.locator(".nav")).toContainText(chromeCase.contact);
    await expect(page.locator(".hero .cta-row")).toContainText(chromeCase.priceCta);
    await expect(page.locator(".hero .cta-row .btn-red")).toContainText(chromeCase.primaryCta);
    if (chromeCase.hero) await expect(page.locator(".hero h1")).toContainText(chromeCase.hero);
    if (chromeCase.story) await expect(page.locator("#histoires .story-card").first()).toContainText(chromeCase.story);
    const heroCtaHref = await page.locator(".hero .cta-row .btn-red").getAttribute("href");
    expect(heroCtaHref, "one-pager CTA keeps lead context").toContain("mailto:paul.larmaraud@parrit.ai?");
    const heroCtaParams = new URL(heroCtaHref?.replace(/^mailto:[^?]*/, "https://parrit.ai/lead") ?? "").searchParams;
    expect(heroCtaParams.get("subject")).toContain("Parrit N1");
    expect(heroCtaParams.get("subject")).toContain(chromeCase.primaryCta);
    expect(heroCtaParams.get("body")).toContain("N1");
    await expect(page.locator("#histoires .section-head")).toContainText(
      chromeCase.storyTitle,
    );
    await expect(page.locator(".maturity-rail")).toContainText(chromeCase.railLabel);
    const whatsappHref = await page.locator("#prix .btn-wa").getAttribute("href");
    expect(decodeURIComponent(whatsappHref ?? ""), "WhatsApp CTA keeps lead context").toContain("N1");
    expect(decodeURIComponent(whatsappHref ?? ""), "WhatsApp CTA keeps localized CTA").toContain(
      chromeCase.primaryCta,
    );

    const chromeText = await page
      .locator(".nav, .hero h1, .hero .cta-row, #histoires .section-head, #histoires .story-grid, .maturity-rail")
      .allInnerTexts();

    for (const forbidden of chromeCase.forbiddenChrome) {
      expect(chromeText.join("\n"), `no hardcoded French chrome: ${forbidden}`).not.toContain(
        forbidden,
      );
    }
  });
}

const viewports = [
  { slug: "desktop", width: 1440, height: 1100 },
  { slug: "tablet", width: 820, height: 1180 },
  { slug: "mobile", width: 390, height: 844 },
];

test("sitemap lists maturity canonicals and omits legacy redirects", async ({ request }) => {
  const sitemap = await request.get(new URL("/sitemap.xml", BASE_URL).toString());
  expect(sitemap.ok(), "sitemap response").toBeTruthy();

  const xml = await sitemap.text();
  for (const locale of locales) {
    for (const path of maturityPaths) {
      expect(xml, `sitemap contains /${locale}${path}`).toContain(
        `${expectedOrigin}/${locale}${path}`,
      );
    }

    for (const redirect of legacyRedirects) {
      expect(xml, `sitemap omits /${locale}${redirect.from}`).not.toContain(
        `${expectedOrigin}/${locale}${redirect.from}`,
      );
    }
  }
});

for (const locale of locales) {
  for (const redirect of legacyRedirects) {
    test(`${locale}${redirect.from} permanently redirects to ${locale}${redirect.to}`, async ({
      request,
    }) => {
      const response = await request.get(
        new URL(`/${locale}${redirect.from}`, BASE_URL).toString(),
        { maxRedirects: 0 },
      );

      expect(response.status(), "legacy redirect status").toBe(301);
      expect(response.headers().location, "legacy redirect target").toBe(
        `/${locale}${redirect.to}`,
      );
    });
  }
}

for (const viewport of viewports) {
  test.describe(`${viewport.slug} ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport });

    for (const route of pages) {
      test(`${route.slug} keeps Parrit DA runtime clean`, async ({ page, browserName }) => {
        const jsErrors: string[] = [];
        page.on("pageerror", (error) => jsErrors.push(error.message));
        page.on("console", (message) => {
          if (message.type() === "error") jsErrors.push(message.text());
        });

        await page.goto(new URL(route.path, BASE_URL).toString(), {
          waitUntil: "networkidle",
        });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(500);

        const audit = await page.evaluate(() => {
          const oldFontFamilies = Array.from(document.fonts)
            .map((font) => font.family)
            .filter((family) =>
              /DM Sans|Cormorant Garamond|Hanken Grotesk|JetBrains Mono|Poppins/i.test(
                family,
              ),
            );

          const documentElement = document.documentElement;
          const horizontalOverflow =
            Math.max(documentElement.scrollWidth, document.body.scrollWidth) -
            documentElement.clientWidth;

          const bodyText = document.body.innerText;
          const bannedCopyMatches = [
            /\bPOCs?\b/iu,
            /\bchatbots?\b/iu,
            /\bjours-homme\b/iu,
            /\bprompts?\b/iu,
            /\bexp[ée]rimentations?\b/iu,
            /\bSur devis\b/iu,
            /—/u,
          ]
            .map((regex) => bodyText.match(regex)?.[0])
            .filter((value): value is string => Boolean(value));

          const metadata = {
            bodyFontFamily: getComputedStyle(document.body).fontFamily,
            ogUrl:
              document
                .querySelector('meta[property="og:url"]')
                ?.getAttribute("content") ?? "",
            ogImage:
              document
                .querySelector('meta[property="og:image"]')
                ?.getAttribute("content") ?? "",
            twitterImage:
              document
                .querySelector('meta[name="twitter:image"]')
                ?.getAttribute("content") ?? "",
          };

          const runtimeUrls = [
            location.href,
            ...Array.from(document.querySelectorAll("[href],[src],[action]"))
              .flatMap((node) => [
                node.getAttribute("href"),
                node.getAttribute("src"),
                node.getAttribute("action"),
              ])
              .filter((value): value is string => Boolean(value)),
            ...performance.getEntriesByType("resource").map((entry) => entry.name),
          ];

          return {
            bannedCopyMatches,
            metadata,
            oldFontFamilies,
            horizontalOverflow,
            vercelUrls: runtimeUrls.filter((url) => /\.vercel\.app/i.test(url)),
          };
        });

        expect(audit.bannedCopyMatches, "no public doctrine banned copy").toEqual([]);
        expect(audit.metadata.bodyFontFamily, "body uses Geist").toContain("Geist");
        expect(audit.metadata.ogUrl, "canonical social URL").toMatch(
          /^https:\/\/parrit\.ai(\/|$)/,
        );
        expect(audit.metadata.ogImage, "canonical Open Graph image").toBe(
          expectedSocialImage,
        );
        expect(audit.metadata.twitterImage, "canonical Twitter image").toBe(
          expectedSocialImage,
        );
        expect(audit.oldFontFamilies, "no old font families loaded").toEqual([]);
        expect(audit.horizontalOverflow, "no horizontal overflow").toBeLessThanOrEqual(1);
        expect(audit.vercelUrls, "no runtime *.vercel.app URL").toEqual([]);
        expect(jsErrors, "no JavaScript errors").toEqual([]);
        if (route.expectedText) {
          await expect(page.locator("body"), "expected localized body copy").toContainText(
            route.expectedText,
          );
        }

        await page.screenshot({
          path: `artifacts/qa/${browserName}-${route.slug}-${viewport.slug}.png`,
          fullPage: true,
        });

        if (
          browserName === "chromium" &&
          route.reviewArtifact &&
          (viewport.slug === "desktop" || viewport.slug === "mobile")
        ) {
          await page.screenshot({
            path: `artifacts/${route.slug}-${viewport.slug}-fr.png`,
            fullPage: true,
          });
        }
      });
    }
  });
}
