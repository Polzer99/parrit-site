import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { loader, renderPage } from "./helpers/site-v1-render.mjs";
import { visibleText } from "../scripts/brand-os-contracts.mjs";

// Décision de Paul du 21/11/2026 : check the rendered result, including headings
// assembled from fragments. The loader forbids unmocked external dependencies.
const text = html => visibleText(html).replace(/\s+/g, " ").trim();
for (const locale of ["fr", "en"]) {
  test(`contact keeps the team paragraph, then the calendar and the form, without portrait or biography (${locale})`, async () => {
    const html = await renderPage(locale);
    const contact = html.match(/<section class="founder"[\s\S]*?<\/section>/)[0];
    const heading = contact.match(/<h2>([\s\S]*?)<\/h2>/)[1];
    assert.equal(text(heading), locale === "fr"
      ? "Commencez par une tâche précise."
      : "Start with one specific task.");
    const details = contact.match(/<div class="founder-details">([\s\S]*?)<\/div>/)[1];
    assert.equal((details.match(/<p>/g) ?? []).length, 1);
    assert.doesNotMatch(details, /<ul|<li/);
    assert.equal(text(details).trim(), locale === "fr"
      ? "Vous décrivez une tâche qui prend du temps à vos équipes, ou un outil qui vous manque. Nous vous disons ce qui est réalisable. Le travail se fait ensuite avec les ingénieurs, les intervenants et les consultants dont votre projet a besoin."
      : "You describe a task that takes up your teams’ time, or a tool you are missing. We tell you what is feasible. The work then continues with the engineers, trainers and consultants your project needs.");
    assert.doesNotMatch(visibleText(contact), /Lime|2024|fondateur|founder/);
    // Repasse de conversion du 21/11/2026 (Paul : « photos de Paul, pas besoin en bas », « "Nous écrire" n'est pas appealing ») :
    // ni portrait, ni lien de courriel, ni bouton ; le calendrier puis le formulaire, chacun sous son intertitre.
    assert.doesNotMatch(contact, /<img|<picture|href="mailto:|rev-button exec/);
    assert.doesNotMatch(visibleText(contact), /Nous écrire|Write to us/);
    assert.match(contact, locale === "fr" ? /<h3 class="reservation-title">Choisissez un créneau\.<\/h3>/ : /<h3 class="reservation-title">Pick a time\.<\/h3>/);
    const technology = html.match(/<p id="technologies-title"[^>]*>([\s\S]*?)<\/p>/)[1];
    assert.equal(text(technology), locale === "fr"
      ? "Nous choisissons les outils selon votre besoin."
      : "We choose the tools that fit your needs.");
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
