import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loader } from "./helpers/site-v1-render.mjs";

const manifest = JSON.parse(readFileSync("tests/fixtures/session-photos.json", "utf8"));
const section = (html, id) => {
  const value = html.match(new RegExp(`<section\\b[^>]*id="${id}"[^>]*>([\\s\\S]*?)</section>`))?.[1];
  assert.ok(value, id);
  return value;
};

test("only the twelve selected photo exports are shipped, with traced source hashes", () => {
  assert.equal(manifest.length, 3);
  const files = manifest.flatMap(p => p.files.map(f => f.file.split("/").at(-1)));
  assert.equal(files.length, 12);
  assert.deepEqual(readdirSync("public/photos/session").sort(), [...files, "SOURCES.md"].sort());
  const provenance = readFileSync("public/photos/session/SOURCES.md", "utf8");
  for (const photo of manifest) {
    assert.ok(provenance.includes(photo.source));
    assert.ok(provenance.includes(photo.sourceSha256));
    for (const file of photo.files) assert.equal(createHash("sha256").update(readFileSync(`public${file.file}`)).digest("hex"), file.sha256);
  }
});

for (const photo of manifest) test(`photo headers contain no EXIF/GPS and keep full-frame dimensions: ${photo.id}`, async () => {
  for (const file of photo.files) {
    const bytes = readFileSync(`public${file.file}`);
    // Sharp reads container headers, including EXIF blocks, without decoding pixels.
    const header = await sharp(bytes).metadata();
    for (const field of ["exif", "xmp", "iptc", "icc", "orientation"]) assert.equal(header[field], undefined, `${file.file}: ${field}`);
    assert.equal(header.width, file.width);
    assert.equal(header.height, file.height);
    assert.equal(header.format, file.file.endsWith(".avif") ? "heif" : "webp");
    assert.ok(file.width <= photo.sourceWidth && file.width <= 960);
    assert.ok(Math.abs(file.height - photo.sourceHeight * file.width / photo.sourceWidth) <= 1, "full frame, no crop");
  }
});

for (const locale of ["fr", "en"]) {
  const load = loader(locale);
  const { SinglePage } = load("src/system/components/SinglePage.tsx");
  const html = renderToStaticMarkup(createElement(SinglePage, { locale, contactQuery: "utm_campaign=field&source=old" }));
  test(`final call separates team from FAQ and Journal has one home index link (${locale})`, () => {
    const ids = [...html.matchAll(/<section\b[^>]*id="([^"]+)"/g)].map(m => m[1]);
    assert.equal(ids[ids.indexOf("bandeau") - 1], locale === "fr" ? "partenaires" : "team");
    assert.equal(ids[ids.indexOf("bandeau") + 1], "questions");
    const journal = locale === "fr" ? "/fr/journal" : "/journal";
    assert.equal((html.match(new RegExp(`href="${journal}"`, "g")) ?? []).length, 1);
    assert.ok(section(html, "articles").includes(`href="${journal}"`));
  });

  test(`field SSR exposes three local responsive pictures, dimensions and captions (${locale})`, () => {
    const field = section(html, locale === "fr" ? "terrain" : "in-the-field");
    const pictures = [...field.matchAll(/<picture>([\s\S]*?)<\/picture>/g)];
    assert.equal(pictures.length, 3);
    assert.equal((field.match(/<figcaption>/g) ?? []).length, 3);
    for (const [i, [, picture]] of pictures.entries()) {
      const attrs = Object.fromEntries([...picture.match(/<img\b[^>]+>/)[0].matchAll(/([\w-]+)="([^"]*)"/g)].map(m => m.slice(1)));
      const file = manifest[i].files.find(f => f.file === attrs.src);
      assert.ok(file);
      assert.equal(Number(attrs.width), file.width);
      assert.equal(Number(attrs.height), file.height);
      assert.equal(attrs.loading, "lazy");
      assert.ok(attrs.alt.length > 30);
      for (const [, srcset] of picture.matchAll(/srcSet="([^"]+)"/g)) {
        for (const entry of srcset.split(", ")) {
          const [src, width] = entry.split(" ");
          assert.ok(manifest[i].files.some(f => f.file === src && `${f.width}w` === width));
        }
      }
    }
    assert.doesNotMatch(html, /data-entrance=/, "SSR is visible before hydration");
  });

  test(`field and final actions preserve attribution; final connector comes from Brand OS (${locale})`, () => {
    const field = section(html, locale === "fr" ? "terrain" : "in-the-field");
    const final = section(html, "bandeau");
    for (const [content, sources] of [[field, ["intention-formation-terrain"]], [final, ["intention-projet-bandeau", "intention-formation-bandeau"]]]) {
      const actions = [...content.matchAll(/<a class="([^"]+)" href="([^"]+)"/g)];
      assert.equal(actions.length, sources.length);
      actions.forEach(([, classes, href], i) => {
        assert.match(classes, content === final && i === 0 ? /\bexec\b/ : /\bghost\b/);
        const url = new URL(href.replaceAll("&amp;", "&"), "https://example.invalid");
        assert.equal(url.pathname, locale === "fr" ? "/fr" : "/");
        assert.equal(url.hash, "#contact");
        assert.deepEqual(url.searchParams.getAll("source"), [sources[i]]);
        assert.equal(url.searchParams.get("utm_campaign"), "field");
      });
    }
    const { px } = JSON.parse(readFileSync("src/system/brand-os.connectors.json", "utf8"));
    assert.match(final, /data-connector="VS-CONNECTOR"/);
    assert.ok(final.includes(`width="${px.min_shaft + px.head_len + px.clearance * 2}"`));
    assert.match(final, new RegExp(`stroke-width="${px.stroke}"`));
    assert.equal((final.match(/<path /g) ?? []).length, 2);
  });

  test(`each offer has three vector checks and one action (${locale})`, () => {
    const offers = section(html, locale === "fr" ? "offres" : "offers");
    const cards = [...offers.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)];
    assert.equal(cards.length, 3);
    for (const [, card] of cards) {
      assert.equal((card.match(/<li>/g) ?? []).length, 3);
      assert.equal((card.match(/<svg /g) ?? []).length, 3);
      assert.equal((card.match(/<a /g) ?? []).length, 1);
      assert.doesNotMatch(card, /[✓✔]/);
    }
  });

  test(`client colours use only the authorized local source images (${locale})`, () => {
    const references = section(html, "references");
    const images = [...references.matchAll(/<img src="([^"]+)"/g)].map(m => m[1]);
    const { SITE_EVIDENCE, publicationLogo, getSiteEvidence } = load("src/lib/registry/preuves.ts");
    const allowed = SITE_EVIDENCE.filter(e => getSiteEvidence(e.id, "home")).map(e => publicationLogo(e.logo)).filter(Boolean);
    assert.equal(images.length, 10);
    for (const src of images) assert.ok(allowed.includes(src));
    assert.doesNotMatch(references, /mask-image/);
  });
}

test("field anchors follow the language switch", () => {
  const { localizedHomeHash } = loader("fr")("src/system/home-anchors.ts");
  assert.equal(localizedHomeHash("#terrain", "en"), "#in-the-field");
  assert.equal(localizedHomeHash("#in-the-field", "fr"), "#terrain");
});

test("contextual text palettes used by the new layers retain AA contrast", () => {
  const css = readFileSync("src/system/brand-os.tokens.css", "utf8");
  const tokens = Object.fromEntries([...css.matchAll(/(--brand-[\w-]+):#([\da-fA-F]{6});/g)].map(m => m.slice(1)));
  const luminance = token => {
    assert.ok(tokens[token], token);
    const rgb = [0, 2, 4].map(i => parseInt(tokens[token].slice(i, i + 2), 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  };
  const pairs = [
    ["--brand-accessible-ink", "--brand-derived-white"],
    ["--brand-accessible-ink2", "--brand-core-off"],
    ["--brand-accessible-ink2", "--brand-accessible-sky"],
    ["--brand-core-off", "--brand-derived-aux-3"],
    ["--brand-derived-on-ink-2", "--brand-derived-aux-3"],
    ["--brand-core-rose", "--brand-derived-aux-3"],
    ["--brand-derived-white", "--brand-core-canard"],
    ["--brand-accessible-ink", "--brand-core-rose"],
  ];
  for (const [fg, bg] of pairs) {
    const [a, b] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
    assert.ok((a + .05) / (b + .05) >= 4.5, `${fg} on ${bg}`);
  }
});

test("entrances reveal once, react to reduced motion, and disconnect on cleanup", t => {
  const instances = [];
  class Observer {
    targets = new Set();
    constructor(callback) { this.callback = callback; instances.push(this); }
    observe(target) { this.targets.add(target); }
    unobserve(target) { this.targets.delete(target); }
    disconnect() { this.targets.clear(); }
    enter(target) { this.callback([{ target, isIntersecting: true }]); }
  }
  const listeners = new Set();
  const media = { matches: false, addEventListener: (_, fn) => listeners.add(fn), removeEventListener: (_, fn) => listeners.delete(fn) };
  const previousWindow = globalThis.window, previousObserver = globalThis.IntersectionObserver;
  globalThis.window = { IntersectionObserver: Observer, innerHeight: 800, matchMedia: () => media };
  globalThis.IntersectionObserver = Observer;
  t.after(() => {
    if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow;
    if (previousObserver === undefined) delete globalThis.IntersectionObserver; else globalThis.IntersectionObserver = previousObserver;
  });
  const sections = [0, 900, 1800].map(top => ({ dataset: {}, getBoundingClientRect: () => ({ top }) }));
  const root = { querySelectorAll: selector => {
    assert.equal(selector, ":scope > section:not(.hero):not(#contact)");
    return sections;
  } };
  const { observeSectionEntrances } = loader("en")("src/system/components/SectionEntrance.tsx");
  const stop = observeSectionEntrances(root);
  assert.equal(sections[0].dataset.entrance, undefined);
  assert.equal(sections[1].dataset.entrance, "pending");
  instances[0].enter(sections[1]);
  assert.equal(sections[1].dataset.entrance, "entered");
  assert.equal(instances[0].targets.has(sections[1]), false);
  const instanceCount = instances.length;
  instances[0].enter(sections[1]);
  assert.equal(instances.length, instanceCount, "repeated notification does not create an observer loop");
  assert.equal(instances[0].targets.has(sections[1]), false);
  media.matches = true; listeners.forEach(fn => fn());
  assert.ok(sections.every(s => s.dataset.entrance === undefined));
  assert.equal(instances[0].targets.size, 0);
  media.matches = false; listeners.forEach(fn => fn());
  assert.equal(sections[1].dataset.entrance, undefined, "already seen sections never replay");
  assert.equal(sections[2].dataset.entrance, "pending");
  stop();
  assert.equal(listeners.size, 0);
  assert.ok(instances.every(o => o.targets.size === 0));
  assert.ok(sections.every(s => s.dataset.entrance === undefined));
  media.matches = true;
  const count = instances.length;
  const stopReduced = observeSectionEntrances(root);
  assert.equal(instances.length, count, "no observer is armed in reduced motion");
  stopReduced();
});
