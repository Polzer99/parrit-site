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
        assert.doesNotMatch(html, /posthog/i, `${label}: browser analytics must stay disabled`);
        for (const [name, value] of [["og:image", "https://parrit.ai/opengraph-image"], ["og:image:width", "1200"], ["og:image:height", "630"], ["twitter:card", "summary_large_image"], ["twitter:image", "https://parrit.ai/opengraph-image"]]) {
          assert.ok(html.includes(`${name}" content="${value}"`), `${label}: ${name}`);
        }
        assert.deepEqual(checkGlyphs(html, label, glyphs, connectors), []);
        const text = visibleText(html);
        for (const title of titles[locale][route] ?? []) assert.ok(text.includes(title), `${label}: ${title}`);
        if (route === "/") {
          const scene = html.match(/<section class="home-s-build r2-dark">[\s\S]*?<\/section>/)?.[0];
          assert.ok(scene, `${label}: product scene renders on the server`);
          const sceneText = visibleText(scene);
          const sceneCopy = locale === "fr" ? [
            "Vous demandez, vous validez, la fiche est créée.",
            "Un exemple : un agent dans la messagerie de l'équipe commerciale, relié au CRM de l'entreprise.",
            "Vous photographiez la carte.", "Vous répondez « oui ».", "Le contact est dans le CRM.",
            "Dans votre CRM", "Exemple fictif",
          ] : [
            "You ask, you approve, the record is created.",
            "One example: an agent in the sales team's messaging app, connected to the company's CRM.",
            "You photograph the card.", "You reply “yes”.", "The contact is in the CRM.",
            "In your CRM", "Fictional example",
          ];
          for (const text of sceneCopy) assert.ok(sceneText.includes(text), `${label}: ${text}`);
          assert.doesNotMatch(sceneText, /Laparra|Rungis|\bMIN\b|GESLOT|Lyon/i);
          assert.doesNotMatch(scene, /home-s-build-grid|home-s-verdict/);
          assert.deepEqual([...scene.matchAll(/class="scene-marker"[^>]*>([123])<\/span>/g)].map((match) => match[1]), ["1", "2", "3", "1", "2", "3"]);
          assert.match(scene, /class="scene-marker"[^>]*style="left:64\.5%;top:69\.5%;transform:translate\(calc\(-100% - 6px\), -50%\)"[^>]*>2<\/span>/, `${label}: FIX2 anchors marker 2 by its right edge, 6px left of the approval bubble`);
          assert.equal((scene.match(/<picture>/g) ?? []).length, 2);
          assert.equal((scene.match(/loading="lazy"/g) ?? []).length, 2);
          assert.equal((scene.match(/decoding="async"/g) ?? []).length, 2);
          assert.ok(html.includes(locale === "fr"
            ? "Parrit.ai · Données et IA, des outils qui vous appartiennent"
            : "Parrit.ai · Data and AI, tools you own"));
          const journey = html.match(/<section class="home-s-maison">[\s\S]*?<\/section>/)?.[0];
          assert.ok(journey, `${label}: journey section must be rendered`);
          assert.match(journey, /<picture>/);
          assert.match(journey, /parrit-ai-founder-linkedin-3x4-340.webp/);
          assert.ok(journey.includes(locale === "fr" ? "Paul Larmaraud, fondateur de Parrit.ai" : "Paul Larmaraud, founder of Parrit.ai"));
          const heading = visibleText((html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? "").replace(/<[^>]*>/g, "")).trim();
          assert.equal(heading, locale === "fr"
            ? "Nous transformons des problèmes opérationnels en systèmes qui fonctionnent."
            : "We turn operational problems into systems that work.");
          assert.equal(
            visibleText(journey).includes(`Paul Larmaraud · ${locale === "fr" ? "Fondateur" : "Founder"}`),
            /<img\b/.test(journey),
            `${label}: founder caption is rendered if and only if the section renders a photo`,
          );
        }
      }
    }
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
