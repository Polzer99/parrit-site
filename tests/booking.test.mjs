import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loader } from "./helpers/site-v1-render.mjs";

test("booking attribution rejects invalid/ambiguous source and preserves only UTM parameters", () => {
  const { bookingParameters } = loader("en")("src/system/booking.ts");
  assert.deepEqual(bookingParameters({ source: "journal-test", utm_source: "x", utm_custom: ["a&b", "é"], theme: "light", email: "private" }), {
    "metadata[source]": "journal-test", utm_source: "x", utm_content: "journal-test",
  });
  for (const source of ["<script>", "a".repeat(81), "Upper", "", "test\n", "test\r", "test\u2028", ["one", "two"]]) {
    assert.deepEqual(bookingParameters({ source, utm_source: "x" }), { utm_source: "x" });
  }
  for (const source of ["a", "a".repeat(80), "journal-test-2"]) {
    assert.equal(bookingParameters({ source })["metadata[source]"], source);
  }
  assert.deepEqual(bookingParameters({}), {});
});

for (const locale of ["fr", "en"]) {
  test(`booking CTA registry and attribution helper resolve localized paths (${locale})`, () => {
    const load = loader(locale);
    const { ctaHref, getCta } = load("src/lib/registry/cta.ts");
    const { buildRdvHref } = load("src/lib/attribution.ts");
    const expected = `${locale === "fr" ? "/fr" : ""}/rendez-vous?source=journal-test`;
    for (const id of ["rdv.paul", "rdv.systeme", "rdv.offre", "rdv.auteur", "prototype.demander"]) {
      assert.equal(getCta(id).cible, "/rendez-vous");
      assert.equal(ctaHref(id, locale, "journal-test"), expected);
    }
    assert.equal(buildRdvHref("journal-test", locale), expected);
  });

  test(`booking page renders localized heading, calendar attribution, mail and noindex (${locale})`, async () => {
    let calendarProps;
    const load = loader(locale, { "@/system/components/CalInline": { ParritCalInline: props => { calendarProps = props; return React.createElement("div", { "data-calendar": "" }); } } });
    const page = load("src/app/(rev01)/rendez-vous/page.tsx");
    const html = renderToStaticMarkup(await page.default({ searchParams: Promise.resolve({ source: "journal-test", utm_source: "x" }) }));
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.match(html, locale === "fr" ? /Premier échange de 15 minutes/ : /First call, 15 minutes/);
    assert.ok(html.indexOf("<h1") < html.indexOf("data-calendar"));
    assert.ok(html.indexOf("data-calendar") < html.indexOf("mailto:"));
    assert.match(html, /href="mailto:paul.larmaraud@parrit.ai"/);
    // Lot D (21/11/2026) : sans JavaScript, un lien direct vers le calendrier de la langue.
    assert.match(html, locale === "fr" ? /<noscript><p><a [^>]*href="https:\/\/cal\.com\/paul-larmaraud\/audit">Prendre rendez-vous<\/a><\/p><\/noscript>/ : /<noscript><p><a [^>]*href="https:\/\/cal\.com\/paul-larmaraud\/ai-strategy-meeting">Book a call<\/a><\/p><\/noscript>/);
    assert.equal(calendarProps.locale, locale);
    assert.deepEqual(calendarProps.bookingParams, { "metadata[source]": "journal-test", utm_source: "x", utm_content: "journal-test" });
    const metadata = await page.generateMetadata();
    assert.equal(metadata.title, locale === "fr" ? "Premier échange, 15 minutes" : "First call, 15 minutes");
    assert.equal(metadata.openGraph.title, metadata.title);
    assert.deepEqual(metadata.robots, { index: false, follow: true });
    assert.equal(metadata.alternates.canonical, `${locale === "fr" ? "/fr" : ""}/rendez-vous`);
  });

  test(`one four-element call block in interface language (${locale})`, () => {
    const load = loader(locale);
    const { BookingCall } = load("src/system/components/BookingCall.tsx");
    const { BOOKING_CALL_COPY } = load("src/system/booking.ts");
    for (const source of ["journal-test", "theme-ai-sprints"]) {
      const variant = source.startsWith("theme-") ? "ai-sprints" : "article";
      const element = BookingCall({ locale, source, variant });
      assert.equal(React.Children.count(element.props.children), 4);
      const html = renderToStaticMarkup(element);
      assert.match(html, new RegExp(`lang="${locale}"`));
      assert.ok(html.includes(BOOKING_CALL_COPY[locale][variant].description));
      assert.equal((html.match(/class="rev-button exec"/g) ?? []).length, 1);
      assert.ok(html.includes(`href="${locale === "fr" ? "/fr" : ""}/rendez-vous?source=${source}"`));
      assert.doesNotMatch(html, /offert|gratuit|€|countdown|compte à rebours/i);
    }
  });
}

test("calendar config is unchanged without attribution and adds only passed parameters", () => {
  for (const bookingParams of [undefined, { "metadata[source]": "journal-test", utm_source: "x", utm_custom: ["one", "two"] }]) {
    let config;
    const load = loader("en", {
      react: { ...React, useState: () => [true, () => {}] },
      "@calcom/embed-react": {
        __esModule: true,
        default: props => { config = props.config; return null; },
        getCalApi: () => { throw new Error("No Cal network in tests"); },
      },
    });
    const { ParritCalInline } = load("src/system/components/CalInline.tsx");
    renderToStaticMarkup(React.createElement(ParritCalInline, { bookingParams }));
    assert.deepEqual(config, { ...bookingParams, layout: "month_view", theme: "dark" });
  }
});

test("RSS feed title announced by the layout is French on French pages (21/11/2026)", async () => {
  const { readFileSync } = await import("node:fs");
  const source = readFileSync("src/system/pages/layout.tsx", "utf8");
  assert.match(source, /title: locale === "fr" \? "Journal de Parrit\.ai" : "Parrit Journal"/);
});

test("booking attribution identifies only a valid site CTA when campaign is absent", () => {
  const { bookingParameters } = loader("en")("src/system/booking.ts");
  for (const source of ["rdv-nav", "rdv-parcours", "accueil-rendez-vous"]) {
    assert.deepEqual(bookingParameters({ source }), {
      "metadata[source]": source, utm_source: "parrit.ai", utm_medium: "website", utm_content: source,
    });
  }
});

test("booking attribution preserves explicit campaign source and content", () => {
  const { bookingParameters } = loader("en")("src/system/booking.ts");
  assert.deepEqual(bookingParameters({ source: "rdv-nav", utm_source: "linkedin", utm_medium: "social", utm_campaign: "audit-novembre", utm_content: "post-2", utm_term: "ia" }), {
    "metadata[source]": "rdv-nav", utm_source: "linkedin", utm_medium: "social", utm_campaign: "audit-novembre", utm_content: "post-2", utm_term: "ia",
  });
});

test("booking attribution preserves Unicode campaign labels", () => {
  const { bookingParameters } = loader("en")("src/system/booking.ts");
  for (const campaign of ["audit-rentrée", "stratégie IA", "re\u0301seau-novembre"]) {
    assert.deepEqual(bookingParameters({ utm_source: "linkedin", utm_campaign: campaign }), {
      utm_source: "linkedin", utm_campaign: campaign,
    });
  }
});

test("booking attribution does not forward personal fields or custom UTM keys", () => {
  const { bookingParameters } = loader("en")("src/system/booking.ts");
  assert.deepEqual(bookingParameters({ email: "fixture@example.invalid", name: "Fixture", phone: "0612345678", token: "synthetic", utm_email: "fixture@example.invalid", utm_custom: "secret" }), {});
});

test("booking attribution drops ambiguous, encoded, address and phone-like UTM values", () => {
  const { bookingParameters } = loader("en")("src/system/booking.ts");
  for (const value of [["one", "two"], "fixture@example.invalid", "https://example.invalid/private", "fixture%40example.invalid", "0612345678", "a\n", "a\r", "x".repeat(121), ""]) {
    assert.deepEqual(bookingParameters({ utm_source: value }), {});
  }
});

test("booking attribution does not invent a CTA without a valid source", () => {
  const { bookingParameters } = loader("en")("src/system/booking.ts");
  assert.deepEqual(bookingParameters({ utm_source: "linkedin" }), { utm_source: "linkedin" });
  assert.deepEqual(bookingParameters({ source: ["rdv-nav", "rdv-parcours"] }), {});
});
