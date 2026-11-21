import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { loader, renderPage } from "./helpers/site-v1-render.mjs";
import { visibleText } from "../scripts/brand-os-contracts.mjs";

// Décision de Paul du 21/11/2026 : check the rendered result, including headings
// assembled from fragments. The loader forbids unmocked external dependencies.
const text = html => visibleText(html).replace(/\s+/g, " ").trim();
for (const locale of ["fr", "en"]) {
  test(`contact keeps the team paragraph, portrait and actions without a biography (${locale})`, async () => {
    const html = await renderPage(locale);
    const contact = html.match(/<section class="founder"[\s\S]*?<\/section>/)[0];
    const heading = contact.match(/<h2>([\s\S]*?)<\/h2>/)[1];
    assert.equal(text(heading), locale === "fr"
      ? "Vous échangez avec Paul Larmaraud"
      : "You speak with Paul Larmaraud");
    const details = contact.match(/<div class="founder-details">([\s\S]*?)<div class="actions">/)[1];
    assert.equal((details.match(/<p>/g) ?? []).length, 1);
    assert.doesNotMatch(details, /<ul|<li/);
    assert.equal(text(details).trim(), locale === "fr"
      ? "Prise en main de l'IA, développement sur mesure, expertise métier, recherche : le travail se fait ensuite avec l'équipe adaptée à votre projet."
      : "AI adoption, custom development, industry expertise, research: the work then continues with the team that fits your project.");
    assert.doesNotMatch(visibleText(contact), /Lime|2024|fondateur|founder/);
    assert.match(contact, /<img[^>]*alt="Paul Larmaraud"/);
    assert.match(contact, /class="btn rev-button exec" href="[^"]*source=rdv-contact#contact"/);
    assert.match(contact, /href="mailto:paul.larmaraud@parrit.ai"/);
    const technology = html.match(/<p id="technologies-title"[^>]*>([\s\S]*?)<\/p>/)[1];
    assert.equal(text(technology), locale === "fr"
      ? "Nous choisissons les outils selon votre besoin."
      : "We choose tools according to your needs.");
  });

  test(`Journal introduction and description follow the approved copy (${locale})`, async () => {
    const page = loader(locale)("src/system/pages/journal.tsx");
    const html = renderToStaticMarkup(await page.default(locale));
    const header = html.match(/<header class="journal-header">([\s\S]*?)<\/header>/)[1];
    const heading = locale === "fr"
      ? "Ce journal raconte le travail sur des systèmes d'IA en entreprise."
      : "This journal describes work on AI systems in businesses.";
    const description = locale === "fr"
      ? "Les articles décrivent ce qui a fonctionné et ce qui a échoué, avec les dates et les constats."
      : "The articles describe what worked and what failed, with dates and findings.";
    assert.equal(text(header.match(/<h1>(.*?)<\/h1>/)[1]), heading);
    assert.equal(text(header.match(/<p>(.*?)<\/p>/)[1]), description);
    const metadata = await page.generateMetadata(locale);
    assert.equal(metadata.description, description);
    assert.equal(metadata.openGraph.description, description);
  });
}
