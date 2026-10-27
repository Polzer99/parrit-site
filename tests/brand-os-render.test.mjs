import { privateClientNames } from "../scripts/lib/public-clients.mjs";
import { PUBLIC_CLIENT_NAMES } from "../src/system/public-clients.ts";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import matter from "gray-matter";
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
const routes = ["/", "/journal", "/legal", ...["harness-engineering", "ai-sprints", "integration-developpement", "conseil-transformation"].map(slug => `/journal/themes/${slug}`)];

function populatedTags(html, tag, count) {
  const entries = [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "g"))];
  if (count !== undefined) assert.equal(entries.length, count, tag);
  else assert.ok(entries.length > 0, tag);
  for (const entry of entries) assert.ok(visibleText(entry[1]).trim(), `nonempty ${tag}`);
}

test("compiled EN/FR pages publish images, content structure and supported glyphs; missing routes return branded 404", { timeout: 30000 }, async () => {
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
      const html = Buffer.concat(chunks).toString();
      const structured = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => match[1]).join(" ");
      const metadata = [...html.matchAll(/<meta\b[^>]*content="([^"]*)"[^>]*>/g)].map((match) => visibleText(match[1])).join(" ");
      assert.doesNotMatch(`${visibleText(html)} ${structured} ${metadata}`, /maison (?:française indépendante )?de données|data and AI firm|Données et IA/i, `${locale} ${url}: current positioning`);
      assert.deepEqual(privateClientNames(visibleText(html)), [], `${locale} ${url}: private clients`);
      return { status: res.statusCode, html };
    };
    const metadataTitles = new Set();
    for (const locale of ["en", "fr"]) {
      for (const route of routes) {
        const { status, html } = await render(route, locale);
        const label = `${locale} ${route}`;
        assert.equal(status, 200, label);
        assert.doesNotMatch(html, /posthog/i, `${label}: browser analytics must stay disabled`);
        for (const [name, value] of [["og:image", "https://parrit.ai/opengraph-image?v=2026-10-27"], ["og:image:width", "1200"], ["og:image:height", "630"], ["twitter:card", "summary_large_image"], ["twitter:image", "https://parrit.ai/opengraph-image?v=2026-10-27"]]) {
          assert.ok(html.includes(`${name}" content="${value}"`), `${label}: ${name}`);
        }
        assert.deepEqual(checkGlyphs(html, label, glyphs, connectors), []);
        const text = visibleText(html);
        assert.deepEqual(privateClientNames(text), [], label);
        if (route === "/legal") assert.match(text, /Paul Larmaraud/, "legal retains the publication director");
        const accessible = [...html.matchAll(/(?:aria-label|alt)="([^"]*)"/g)].map((match) => visibleText(match[1])).join(" ");
        for (const pattern of [/[—–]/, /\b(fictif|fictive|fictional|illustrati(f|ve)|illustrées?|non interactive|pas une analyse|not an analysis)\b/i, /\bREV\s?0\d\b|\bPS-0\d\b|\bSTD-\d\.\d\b|\bP0\b/]) {
          if (!(route === "/" && pattern.source.includes("fictif"))) assert.doesNotMatch(`${text} ${accessible}`.replace(/Demonstration, fictional data\./g, ""), pattern, `${label}: anti-slop SSR`);
        }
        const metadata = [...html.matchAll(/<meta\b[^>]*content="([^"]*)"[^>]*>/g)].map((match) => visibleText(match[1])).join(" ");
        const structured = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => match[1]).join(" ");
        const publicCopy = `${text} ${accessible} ${metadata} ${structured}`.replace(/(?:synchronisation (?:qui tourne )?toutes les|sync job (?:that runs|running) every) 15 minutes/g, "");
        assert.doesNotMatch(publicCopy, /offert|gratuit|\bfree\b|forfait|fixed price|sur devis|custom quote|sans engagement|no commitment|pas un abonnement|not subscribed|\b1[05][\s-]?(min|minutes|heures|hours)\b|\b30[\s-]?min|à partir de(?! vos opérations\b)|\bHT\b|excl\. VAT/i, `${label}: no public offer`);
        if (route !== "/legal") assert.doesNotMatch(publicCopy, /€/, label);
        if (route !== "/legal" && route !== "/") {
          assert.doesNotMatch(publicCopy, /\bPaul\b|Larmaraud|fondat(eur|rice)|fondée par|founder|founded by|quinze minutes|fifteen minutes/i, label);
          assert.doesNotMatch(html, /<a[^>]*href="[^"]*paul-larmaraud\.com/i, label);
        }
        populatedTags(html, "h1", 1);
        populatedTags(html, "title", 1);
        const title = visibleText(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
        assert.equal(metadataTitles.has(title), false, `${label}: unique title across locales and routes`);
        metadataTitles.add(title);
        if (["/", "/build-with-you", "/manufacture", "/dossiers"].includes(route)) populatedTags(html, "h2");
        for (const name of ["description", "og:description", "og:title", "twitter:title"]) {
          const matches = [...html.matchAll(new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`, "g"))];
          assert.equal(matches.length, 1, `${label}: unique ${name}`);
          assert.ok(matches[0][1].trim(), `${label}: nonempty ${name}`);
        }
        if (route === "/build-with-you") {
          const description = html.match(/name="description" content="([^"]+)"/)?.[1];
          assert.equal(html.match(/property="og:description" content="([^"]+)"/)?.[1], description);
          const hero = html.match(/<header class="[^"]*build-with-you-hero[^"]*">[\s\S]*?<\/header>/)?.[0];
          assert.ok(hero);
          populatedTags(hero, "p");
        }
        if (route === "/journal") {
          const journal = route === "/"
            ? html.match(/<section class="home-s-journal">[\s\S]*?<\/section>/)?.[0]
            : html.match(/<ol class="journal-list">[\s\S]*?<\/ol>/)?.[0];
          assert.ok(journal, `${label}: Journal entries render`);
          if (route === "/") {
            assert.equal((journal.match(/data-language-note=""/g) ?? []).length, locale === "fr" ? 1 : 0);
          }
          assert.equal((text.match(/Articles en anglais/g) ?? []).length, locale === "fr" ? 1 : 0, `${label}: one index language note`);
          const links = [...journal.matchAll(/<a\b[^>]*href="\/journal\/[^"]+"[^>]*>[\s\S]*?<\/a>/g)].map((match) => match[0]);
          assert.ok(links.length > 0, `${label}: nonempty Journal`);
          for (const link of links) {
            assert.match(link, /hrefLang="en"|hreflang="en"/, label);
            const badge = />EN<\//.test(link);
            assert.equal(badge, false, `${label}: no repeated language label`);
          }
        }
        if (route === "/") {
          assert.match(html, /<section class="hero"/);
          const ids = [...html.matchAll(/<section\b[^>]*id="([^"]+)"/g)].map(m => m[1]);
          const expected = locale === "fr" ? ["en-production", "ce-qui-change", "parcours", "services", "partenaires", "references", "architecture", "contact"] : ["in-production", "what-changes", "path", "services", "team", "references", "architecture", "contact"];
          assert.deepEqual(ids.filter(id => expected.includes(id)), expected);
          assert.doesNotMatch(text, /Content Factor|usines? de contenu|FormIA|Qualiopi/i);
          const partners = html.match(new RegExp(`<section id="${locale === "fr" ? "partenaires" : "team"}">[\\s\\S]*?</section>`))?.[0];
          assert.ok(partners, `${label}: partners section`);
          assert.match(visibleText(partners), /\bMIT\b/);
          assert.doesNotMatch(partners, /<img|<svg/);
          assert.doesNotMatch(visibleText(html.replace(partners, "")), /\bMIT\b/);
          for (const name of PUBLIC_CLIENT_NAMES) assert.ok(text.includes(name), `${label}: ${name}`);
        }

      }
    }
    for (const locale of ["en", "fr"]) {
      const { status, html } = await render("/journal/malicious-mcp-server-after-install", locale);
      assert.equal(status, 200);
      const badge = html.match(/<aside class="harness-badge"[^>]*>[\s\S]*?<\/aside>/)?.[0];
      assert.ok(badge, `${locale}: first certified article renders its badge`);
      populatedTags(badge, "strong", 1);
      assert.match(badge, /href="\/certificates\/malicious-mcp-server-after-install\.json"/);
    }
    for (const route of ["/journal/what-is-parrit-ai", "/journal/what-is-a-company-operating-system", "/journal/hook-timeout-lets-tool-call-through", "/journal/rss.xml", "/llms-full.txt"]) {
      const { status, html } = await render(route);
      assert.equal(status, 200, route);
      assert.doesNotMatch(html, /\bPaul\b|Larmaraud|fondat(eur|rice)|fondée par|founder|founded by|quinze minutes|fifteen minutes/i, route);
      assert.doesNotMatch(html, /paul-larmaraud\.com/i, route);
      if (route === "/journal/rss.xml") assert.match(html, /<dc:creator>Parrit\.ai<\/dc:creator>/);
    }
    // Every published article also passes the positioning assertion in render().
    for (const file of readdirSync("content/journal").filter((file) => file.endsWith(".mdx"))) {
      const { data } = matter(readFileSync(`content/journal/${file}`, "utf8"));
      const route = `/journal/${data.slug}`;
      assert.equal((await render(route)).status, 200, route);
    }
    assert.doesNotMatch(readFileSync("public/llms.txt", "utf8"), /maison (?:française indépendante )?de données|data and AI firm|Données et IA/i);
    // The alias keeps English content/canonical, but the French chrome warns readers.
    const articleRoute = "/journal/one-card-one-action";
    const english = await render(articleRoute, "en");
    const french = await render(articleRoute, "fr");
    assert.equal(english.status, 200);
    assert.equal(french.status, 200);
    assert.doesNotMatch(english.html, /data-language-note/);
    const notes = [...french.html.matchAll(/<p data-language-note="">([^<]+)<\/p>/g)];
    assert.equal(notes.length, 1);
    assert.ok(visibleText(notes[0][1]).trim());
    for (const html of [english.html, french.html]) {
      assert.match(html, /<p class="journal-deck" lang="en">[^<]+<\/p>/);
      assert.ok(html.includes(`rel="canonical" href="https://parrit.ai${articleRoute}"`));
    }
    assert.equal(french.html.match(/<div class="journal-body"[^>]*>[\s\S]*?<\/div>/)?.[0],
      english.html.match(/<div class="journal-body"[^>]*>[\s\S]*?<\/div>/)?.[0]);
    for (const route of ["/brand-os-missing-page", "/fr/brand-os-missing-page"]) {
      const { status, html } = await render(route);
      assert.equal(status, 404, route);
      const heading = visibleText(html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? "");
      assert.ok(heading.trim());
      assert.match(html, /<h1[^>]*>[^<]+<br\s*\/?>\s*<span lang="fr">[^<]+<\/span>/);
      assert.match(html, /name="robots" content="noindex/);
      assert.equal((html.match(/class="cmdbar(?: [^"]*)?"/g) ?? []).length, 1);
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
