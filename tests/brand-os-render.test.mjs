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
    "/": ["Four steps take you from the first message to a system your team runs.", "Three dossiers are available online. The others are presented in a meeting.", "The Journal records what held and what broke on our own systems, and what we take from it for yours.", "A first conversation with the founder tells you whether a system is worth building."],
    "/build-with-you": ["With the founder, you build a system that runs."],
    "/manufacture": ["We build each system one operation at a time, from Examination to Compounding.", "Each system is built in your accounts, under your keys.", "Three phases turn an examined operation into a system you own."],
    "/dossiers": ["Three dossiers are summarized here. The others are presented in a meeting.", "These systems were commissioned by large accounts, SMEs and mid-sized companies. We anonymize all of them."],
  },
  fr: {
    "/": ["Quatre étapes mènent du premier message à un système que votre équipe fait tourner.", "Trois dossiers sont consultables en ligne. Les autres se présentent en rendez-vous.", "Le Journal consigne ce qui a tenu et ce qui a cassé sur nos propres systèmes, et ce que nous en tirons pour les vôtres.", "Un premier échange avec le fondateur vous dit si un système vaut d'être construit."],
    "/build-with-you": ["Avec le fondateur, vous construisez un système qui tourne."],
    "/manufacture": ["Nous construisons chaque système une opération à la fois, de l'Examen à la Capitalisation.", "Chaque système se fabrique dans vos comptes, avec vos clés.", "Trois phases transforment une opération examinée en un système qui vous appartient."],
    "/dossiers": ["Trois dossiers sont résumés ici. Les autres se présentent en rendez-vous.", "Ces systèmes ont été commandés par des grands comptes, des PME et des ETI. Nous les anonymisons tous."],
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
        const accessible = [...html.matchAll(/(?:aria-label|alt)="([^"]*)"/g)].map((match) => visibleText(match[1])).join(" ");
        for (const pattern of [/[—–]/, /\b(fictif|fictive|fictional|illustrati(f|ve)|illustrées?|non interactive|pas une analyse|not an analysis)\b/i, /\bREV\s?0\d\b|\bPS-0\d\b|\bSTD-\d\.\d\b|\bP0\b/]) {
          assert.doesNotMatch(`${text} ${accessible}`, pattern, `${label}: anti-slop SSR`);
        }
        const metadata = [...html.matchAll(/<meta\b[^>]*content="([^"]*)"[^>]*>/g)].map((match) => visibleText(match[1])).join(" ");
        const structured = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => match[1]).join(" ");
        const publicCopy = `${text} ${accessible} ${metadata} ${structured}`.replace(/(?:synchronisation (?:qui tourne )?toutes les|sync job (?:that runs|running) every) 15 minutes/g, "");
        assert.doesNotMatch(publicCopy, /offert|gratuit|\bfree\b|forfait|fixed price|sur devis|custom quote|sans engagement|no commitment|pas un abonnement|not subscribed|\b1[05][\s-]?(min|minutes|heures|hours)\b|\b30[\s-]?min|à partir de|\bHT\b|excl\. VAT/i, `${label}: no public offer`);
        if (route !== "/legal") assert.doesNotMatch(publicCopy, /€/, label);
        for (const title of titles[locale][route] ?? []) assert.ok(text.includes(title), `${label}: ${title}`);
        if (route === "/build-with-you") {
          const description = locale === "fr"
            ? "Avec le fondateur, vous construisez un système qui tourne, et vous repartez capable de construire le suivant sans nous."
            : "With the founder, you build a system that runs, and you leave able to build the next one without us.";
          for (const name of ["description", "og:description"]) {
            assert.ok(html.includes(`${name}" content="${description}"`), `${label}: standalone ${name}`);
          }
          assert.ok(text.includes(locale === "fr"
            ? "Vous repartez aussi capable de construire le suivant sans nous."
            : "You also leave able to build the next one without us."), `${label}: contextual visible copy`);
        }
        if (route === "/" || route === "/journal") {
          const journal = route === "/"
            ? html.match(/<section class="home-s-journal">[\s\S]*?<\/section>/)?.[0]
            : html.match(/<ol class="journal-list">[\s\S]*?<\/ol>/)?.[0];
          assert.ok(journal, `${label}: Journal entries render`);
          const links = [...journal.matchAll(/<a\b[^>]*href="\/journal\/[^"]+"[^>]*>[\s\S]*?<\/a>/g)].map((match) => match[0]);
          assert.ok(links.length > 0, `${label}: nonempty Journal`);
          for (const link of links) {
            assert.match(link, /hrefLang="en"|hreflang="en"/, label);
            const badge = />EN<\//.test(link);
            assert.equal(badge, locale === "fr", `${label}: per-entry EN label only in French interface`);
          }
        }
        if (route === "/") {
          const scene = html.match(/<section class="home-s-build r2-dark">[\s\S]*?<\/section>/)?.[0];
          assert.ok(scene, `${label}: product scene renders on the server`);
          const sceneText = visibleText(scene);
          const sceneCopy = locale === "fr" ? [
            "Vous demandez, vous validez, la fiche est créée.",
            "Un exemple : un agent dans la messagerie de l'équipe commerciale, relié au CRM de l'entreprise.",
            "Vous photographiez la carte.", "Vous répondez « oui ».", "Le contact est dans le CRM.",
            "Dans votre CRM",
          ] : [
            "You ask, you approve, the record is created.",
            "One example: an agent in the sales team's messaging app, connected to the company's CRM.",
            "You photograph the card.", "You reply “yes”.", "The contact is in the CRM.",
            "In your CRM",
          ];
          for (const text of sceneCopy) assert.ok(sceneText.includes(text), `${label}: ${text}`);
          assert.doesNotMatch(sceneText, /Laparra|Rungis|\bMIN\b|GESLOT|Lyon/i);
          assert.doesNotMatch(scene, /home-s-build-grid|home-s-verdict/);
          assert.deepEqual([...scene.matchAll(/class="scene-marker"[^>]*>([123])<\/span>/g)].map((match) => match[1]), ["1", "2", "3", "1", "2", "3"]);
          assert.match(scene, /class="scene-chat-approval"|class="scene-chat-bubble scene-chat-outgoing scene-chat-approval"/);
          assert.match(scene, /class="scene-chat-bubble scene-chat-outgoing scene-chat-approval"><span class="scene-marker" aria-hidden="true">2<\/span><p>oui<\/p>/, `${label}: marker 2 is anchored to the HTML approval bubble`);
          assert.match(scene, /class="scene-chat"[^>]*lang="fr"/);
          for (const transcript of ["Agent CRM", "bot", "CRM", "Aujourd'hui", "nouveau contact chez Prospect B, vu ce matin", "Message"]) {
            assert.ok(sceneText.includes(transcript), `${label}: exact p2 transcript: ${transcript}`);
          }
          const messages = [...scene.matchAll(/class="scene-chat-bubble[^"]*">[\s\S]*?<p>([\s\S]*?)<\/p>/g)]
            .map((match) => visibleText(match[1].replace(/<[^>]*>/g, "")).trim());
          assert.deepEqual(messages, [
            "nouveau contact chez Prospect B, vu ce matin",
            "Je crée Contact achat (acheteur) chez Prospect B. C'est bon ?",
            "oui",
            "C'est créé : Contact achat (acheteur) chez Prospect B.",
          ], `${label}: exact HTML messages preserve inline emphasis without changing punctuation`);
          assert.deepEqual([...scene.matchAll(/class="scene-chat-time">(08:0[45])/g)].map((match) => match[1]), ["08:04", "08:04", "08:05", "08:05"]);
          assert.match(scene, /<strong>Contact achat<\/strong> \(acheteur\) chez <strong>Prospect B<\/strong>/);
          assert.match(scene, /src="\/brand\/scenes\/scene-carte-visite-photo.png"/);
          assert.equal((scene.match(/<picture>/g) ?? []).length, 1);
          assert.equal((scene.match(/<img\b/g) ?? []).length, 2);
          assert.equal((scene.match(/loading="lazy"/g) ?? []).length, 2);
          assert.equal((scene.match(/decoding="async"/g) ?? []).length, 2);
          assert.ok(html.includes(locale === "fr"
            ? "Parrit.ai · Données et IA, des outils qui vous appartiennent"
            : "Parrit.ai · Data and AI, tools you own"));
          const journey = html.match(/<section class="home-s-maison">[\s\S]*?<\/section>/)?.[0];
          assert.ok(journey, `${label}: journey section must be rendered`);
          assert.match(journey, /<picture>/);
          assert.match(journey, /parrit-ai-founder-linkedin-buste-3x4-340.webp/);
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
    for (const locale of ["en", "fr"]) {
      const { status, html } = await render("/journal/malicious-mcp-server-after-install", locale);
      assert.equal(status, 200);
      const badge = html.match(/<aside class="harness-badge"[^>]*>[\s\S]*?<\/aside>/)?.[0];
      assert.ok(badge, `${locale}: first certified article renders its badge`);
      assert.ok(visibleText(badge).includes(locale === "fr" ? "Vérifié par le contrôle interne" : "Harness Certified ✓"));
      assert.match(badge, /href="\/certificates\/malicious-mcp-server-after-install\.json"/);
    }
    // The alias keeps English content/canonical, but the French chrome warns readers.
    const articleRoute = "/journal/one-card-one-action";
    const english = await render(articleRoute, "en");
    const french = await render(articleRoute, "fr");
    assert.equal(english.status, 200);
    assert.equal(french.status, 200);
    assert.doesNotMatch(english.html, /Article en anglais\./);
    assert.match(french.html, /<h1[^>]*>[\s\S]*?<\/h1><p>Article en anglais\.<\/p>/);
    for (const html of [english.html, french.html]) {
      assert.ok(html.includes(`rel="canonical" href="https://parrit.ai${articleRoute}"`));
    }
    assert.equal(french.html.match(/<div class="journal-body"[^>]*>[\s\S]*?<\/div>/)?.[0],
      english.html.match(/<div class="journal-body"[^>]*>[\s\S]*?<\/div>/)?.[0]);
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
