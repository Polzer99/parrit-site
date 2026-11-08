import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loader } from "./helpers/site-v1-render.mjs";

test("booking attribution rejects invalid/ambiguous source and preserves only UTM parameters", () => {
  const { bookingParameters } = loader("en")("src/system/booking.ts");
  assert.deepEqual(bookingParameters({ source: "journal-test", utm_source: "x", utm_custom: ["a&b", "é"], theme: "light", email: "private" }), {
    "metadata[source]": "journal-test", utm_source: "x", utm_custom: ["a&b", "é"],
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
    assert.match(html, locale === "fr" ? /Entretien stratégique IA, 15 minutes/ : /AI strategy call, 15 minutes/);
    assert.ok(html.indexOf("<h1") < html.indexOf("data-calendar"));
    assert.ok(html.indexOf("data-calendar") < html.indexOf("mailto:"));
    assert.match(html, /href="mailto:paul.larmaraud@parrit.ai"/);
    assert.equal(calendarProps.locale, locale);
    assert.deepEqual(calendarProps.bookingParams, { "metadata[source]": "journal-test", utm_source: "x" });
    const metadata = await page.generateMetadata();
    assert.deepEqual(metadata.robots, { index: false, follow: true });
    assert.equal(metadata.alternates.canonical, `${locale === "fr" ? "/fr" : ""}/rendez-vous`);
  });

  test(`one four-element call block in interface language (${locale})`, () => {
    const { BookingCall } = loader(locale)("src/system/components/BookingCall.tsx");
    for (const source of ["journal-test", "theme-ai-sprints"]) {
      const element = BookingCall({ locale, source });
      assert.equal(React.Children.count(element.props.children), 4);
      const html = renderToStaticMarkup(element);
      assert.match(html, new RegExp(`lang="${locale}"`));
      assert.ok(html.includes(locale === "fr"
        ? "15 minutes avec Paul Larmaraud pour clarifier votre sujet. Vous repartez avec une première piste, et vous décidez de la suite."
        : "15 minutes with Paul Larmaraud to clarify your topic. You leave with a first lead, and you decide what comes next."));
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
