import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import { syncBuiltinESMExports } from "node:module";
import NextServerModule from "next/dist/server/next-server.js";
import { createRequestResponseMocks } from "next/dist/server/lib/mock-request.js";
import { checkGlyphs, visibleText } from "../scripts/brand-os-contracts.mjs";

// Exercise the compiled server without a listening socket. These mocks are supplied
// by the installed Next version. Browser tests separately verify proxy/hydration/layout.
const NextServer = NextServerModule.default;
const json = (file) => JSON.parse(readFileSync(file, "utf8"));
const glyphs = json("src/system/brand-os.glyphs.json");
const connectors = json("src/system/brand-os.connectors.json");
const routes = ["/", "/build-with-you", "/systems", "/commission", "/manufacture", "/dossiers", "/standard", "/journal", "/legal"];

const positioning = {
  en: {
    heading: "We turn operational problems into systems that work.",
    title: "Parrit.ai · Data and AI, tools you own",
    description: "Parrit.ai connects your sources, cleans up your data and builds tools on top of it that you own: the code, the data and the documentation.",
    footer: "What we build belongs to you",
    alt: "Paul Larmaraud, founder of Parrit.ai",
    legal: "When you use the prototype form",
  },
  fr: {
    heading: "Nous transformons des problèmes opérationnels en systèmes qui fonctionnent.",
    title: "Parrit.ai · Données et IA, des outils qui vous appartiennent",
    description: "Parrit.ai relie vos sources, remet vos données à plat et construit dessus des outils qui vous appartiennent : le code, les données et la documentation.",
    footer: "Ce que nous construisons vous appartient",
    alt: "Paul Larmaraud, fondateur de Parrit.ai",
    legal: "Lorsque vous utilisez le formulaire prototype",
  },
};

const titles = {
  en: {
    "/": ["Four steps take you from the first message to a system your team runs.", "We show client dossiers in a meeting, not online.", "The Journal records what held and what broke on our projects.", "A 15-minute examination tells you whether a system is worth building."],
    "/build-with-you": ["In 10 hours with the founder, you build a system that runs."],
    "/manufacture": ["We build each system one operation at a time, from Examination to Compounding.", "A system is manufactured. It is not installed.", "Three phases turn an examined operation into a system you own."],
    "/dossiers": ["We show client dossiers in a meeting, not on this site.", "The dossiers open in conversation. Systems commissioned by large accounts, SMEs and mid-sized companies. Anonymized on principle."],
  },
  fr: {
    "/": ["Quatre étapes mènent du premier message à un système que votre équipe fait tourner.", "Nous montrons les dossiers clients en rendez-vous, pas en ligne.", "Le Journal consigne ce qui a tenu et ce qui a cassé sur nos chantiers.", "Un examen de 15 minutes vous dit si un système vaut d'être construit."],
    "/build-with-you": ["En 10 heures avec le fondateur, vous construisez un système qui tourne."],
    "/manufacture": ["Nous construisons chaque système une opération à la fois, de l'Examen à la Capitalisation.", "Un système se fabrique. Il ne s'installe pas.", "Trois phases transforment une opération examinée en un système qui vous appartient."],
    "/dossiers": ["Nous montrons les dossiers clients en rendez-vous, pas sur ce site.", "Les dossiers s'ouvrent de vive voix. Des systèmes commandés par des grands comptes, des PME et des ETI. Anonymisés par principe."],
  },
};

test("compiled EN/FR pages publish images, exact copy and supported glyphs; missing routes return branded 404", { timeout: 30000 }, async () => {
  const attempts = [];
  const originals = [globalThis.fetch, http.request, http.get, https.request, https.get, net.Socket.prototype.connect];
  const deny = () => {
    attempts.push("Network attempted during Brand OS server rendering");
    throw new Error(attempts.at(-1));
  };
  globalThis.fetch = deny;
  http.request = http.get = https.request = https.get = deny;
  net.Socket.prototype.connect = deny;
  syncBuiltinESMExports();
  const server = new NextServer({ dir: process.cwd(), dev: false, conf: json(".next/required-server-files.json").config, hostname: "localhost", port: 3210 });
  try {
    await server.prepare();
    const render = async (url, locale = "en") => {
      const chunks = [];
      const { req, res } = createRequestResponseMocks({
        url,
        headers: { host: "localhost:3210", "x-parrit-locale": locale, "x-parrit-pathname": locale === "fr" ? `/fr${url === "/" ? "" : url}` : url },
        resWriter: (chunk) => { chunks.push(Buffer.from(chunk)); return true; },
      });
      await server.getRequestHandler()(req, res);
      if (!res.finished) await new Promise((resolve) => res.once("finish", resolve));
      return { status: res.statusCode, html: Buffer.concat(chunks).toString() };
    };
    for (const locale of ["en", "fr"]) {
      for (const route of routes) {
        const { status, html } = await render(route, locale);
        const label = `${locale} ${route}`;
        assert.equal(status, 200, label);
        for (const [name, value] of [["og:image", "https://parrit.ai/opengraph-image"], ["og:image:width", "1200"], ["og:image:height", "630"], ["twitter:card", "summary_large_image"], ["twitter:image", "https://parrit.ai/opengraph-image"]]) {
          assert.ok(html.includes(`${name}" content="${value}"`), `${label}: ${name}`);
        }
        assert.deepEqual(checkGlyphs(html, label, glyphs, connectors), []);
        const text = visibleText(html);
        const copy = positioning[locale];
        assert.ok(text.includes(copy.footer), `${label}: ownership footer`);
        if (route === "/legal") assert.ok(text.includes(copy.legal), `${label}: prototype form only`);
        for (const title of titles[locale][route] ?? []) assert.ok(text.includes(title), `${label}: ${title}`);
        if (route === "/") {
          assert.equal(html.includes("founder-portrait"), false);
          assert.ok(text.includes(`Paul Larmaraud · ${locale === "fr" ? "Fondateur" : "Founder"}`));
          assert.equal(visibleText(html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? "").replace(/\s+/g, " ").trim(), copy.heading);
          assert.ok(html.includes(`<title>${copy.title}</title>`), `${label}: title`);
          for (const name of ["description", "og:description"]) {
            assert.ok(html.includes(`${name}" content="${copy.description}"`), `${label}: ${name}`);
          }
          assert.ok(html.includes(`og:title" content="${copy.title}"`), `${label}: OG title`);
          const organization = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
            .map((match) => JSON.parse(match[1])).find((value) => value["@type"] === "Organization");
          assert.equal(organization?.description, "Parrit.ai is a data and AI company: it turns a company's data into software tools the company owns. Based in France; working in English and French.");
          const figure = html.match(/<figure class="home-s-founder">[\s\S]*?<\/figure>/)?.[0] ?? "";
          assert.ok(figure.includes(`alt="${copy.alt}"`), `${label}: founder alt`);
          assert.ok(figure.includes('loading="lazy"'));
          assert.ok(figure.includes('decoding="async"'));
          assert.ok(figure.includes('width="340" height="453"'));
          assert.ok(figure.indexOf('type="image/avif"') < figure.indexOf('type="image/webp"'));
          for (const format of ["avif", "webp"]) {
            assert.ok(figure.includes(`srcSet="/brand/founder/parrit-ai-founder-dsc00629-3x4-340.${format} 340w, /brand/founder/parrit-ai-founder-dsc00629-3x4-680.${format} 680w"`));
          }
          assert.ok(figure.includes('sizes="(max-width: 859px) min(340px, 100vw), 340px"'));
        }
      }
    }
    const llms = readFileSync("public/llms.txt", "utf8");
    assert.ok(llms.includes("Parrit.ai is a data and AI company: it turns a company's data into software tools the company owns."));
    assert.ok(llms.includes("What Parrit builds belongs to the client: the code, the data and the documentation."));
    assert.doesNotMatch(llms, /operating systems?|commissioned, not subscribed|maintenance and evolution/i);
    const full = await render("/llms-full.txt");
    assert.equal(full.status, 200);
    assert.ok(full.html.replace(/\s+/g, " ").trim().startsWith("Parrit Parrit.ai is a data and AI company: it turns a company's data into software tools the company owns. Based in France; working in English and French. What Parrit builds belongs to the client: the code, the data and the documentation."));
    assert.ok(full.html.includes("What is a company operating system?"), "Editorial article remains available unchanged");
    for (const route of ["/brand-os-missing-page", "/fr/brand-os-missing-page"]) {
      const { status, html } = await render(route);
      assert.equal(status, 404, route);
      const heading = visibleText(html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? "");
      assert.ok(heading.includes("This page does not exist."));
      assert.ok(heading.includes("Cette page n'existe pas."));
      assert.match(html, /name="robots" content="noindex/);
      assert.equal((html.match(/class="cmdbar"/g) ?? []).length, 1);
      assert.match(html, /<footer/);
      assert.equal(html.includes("http://localhost:3000/opengraph-image"), false);
    }
  } finally {
    try {
      await server.close();
    } finally {
      [globalThis.fetch, http.request, http.get, https.request, https.get, net.Socket.prototype.connect] = originals;
      syncBuiltinESMExports();
      assert.deepEqual(attempts, [], "No network attempt may be swallowed by the application");
    }
  }
});
