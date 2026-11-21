import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { CAL_LINK_COMMISSION, CAL_LINK_COMMISSION_EN, siteConfig } from "../site.config.ts";
import { loader } from "./helpers/site-v1-render.mjs";

test("commission uses the canonical audit event configured for Google Meet", () => {
  assert.equal(CAL_LINK_COMMISSION, "paul-larmaraud/audit");
  assert.equal(siteConfig.CAL_LINK_COMMISSION, "paul-larmaraud/audit");
});

test("English commission uses the canonical AI strategy meeting event", () => {
  assert.equal(CAL_LINK_COMMISSION_EN, "paul-larmaraud/ai-strategy-meeting");
  assert.equal(siteConfig.CAL_LINK_COMMISSION_EN, "paul-larmaraud/ai-strategy-meeting");
});

function renderedBookingProps(props) {
  let bookingProps;
  const load = loader(props.locale, {
    // Render the mounted, ready branch; effects never run on the server.
    react: { ...React, useState: () => [true, () => {}] },
    "@calcom/embed-react": {
      __esModule: true,
      default: (props) => { bookingProps = props; return null; },
      getCalApi: () => { throw new Error("Cal API forbidden in offline tests"); },
    },
  });
  const { ParritCalInline } = load("src/system/components/CalInline.tsx");
  renderToStaticMarkup(React.createElement(ParritCalInline, props));
  return bookingProps;
}

for (const [name, props, expected] of [
  ["French locale", { locale: "fr" }, CAL_LINK_COMMISSION],
  ["English locale", { locale: "en" }, CAL_LINK_COMMISSION_EN],
  ["default locale", {}, CAL_LINK_COMMISSION_EN],
  ["explicit link in French", { locale: "fr", calLink: CAL_LINK_COMMISSION_EN }, CAL_LINK_COMMISSION_EN],
  ["explicit link in English", { locale: "en", calLink: CAL_LINK_COMMISSION }, CAL_LINK_COMMISSION],
]) {
  test(`booking embed selects the correct event: ${name}`, () => {
    assert.equal(renderedBookingProps(props)?.calLink, expected);
  });
}

test("active source files do not expose the legacy booking link", async () => {
  const root = new URL("../src/", import.meta.url);
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && /\.(?:[cm]?[jt]sx?|json|mdx?)$/.test(entry.name))
    .map((entry) => `${entry.parentPath}/${entry.name}`);
  files.push(new URL("../site.config.ts", import.meta.url));
  for (const file of files) {
    assert.ok(
      !(await readFile(file, "utf8")).includes("paul-larmaraud/30min"),
      `Legacy booking link in ${file}`,
    );
  }
});

// Décision de Paul du 21/11/2026 (nuit) : le rendez-vous ne porte le nom de personne. Le panneau de Cal.com
// (photo et nom de l'hôte, titre et description de l'événement) doit rester masqué dans le calendrier intégré.
test("booking embed hides the host and event details panel", async () => {
  const source = await readFile(new URL("../src/system/components/CalInline.tsx", import.meta.url), "utf8");
  // Les options réellement passées à Cal.com sortent d'une fonction pure : on lit sa valeur, pas son texte.
  const load = loader("en", { "@calcom/embed-react": { __esModule: true, default: () => null, getCalApi: () => { throw new Error("Cal API forbidden in offline tests"); } } });
  const options = load("src/system/components/CalInline.tsx").calUiOptions(variable => `valeur de ${variable}`);
  assert.equal(options.hideEventTypeDetails, true);
  assert.equal(options.layout, "month_view");
  assert.equal(options.styles.branding.brandColor, "valeur de var(--accent-on-dark)");
  // Et c'est bien cette fonction, sans surcharge, que le composant envoie à cal("ui").
  assert.match(source, /cal\("ui", calUiOptions\(tokenValue\)\);/);
  assert.equal(source.split("hideEventTypeDetails").length - 1, 1);
});
