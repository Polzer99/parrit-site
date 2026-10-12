import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import matter from "gray-matter";
import { AUTEUR, ORG_ID, orgRef } from "../src/system/auteur.ts";
import { blogPostingJsonLd, organizationJsonLd } from "../src/system/jsonld.ts";


test("références canoniques exactes et indépendantes", () => {
  assert.equal(AUTEUR.id, ORG_ID);
  assert.equal(ORG_ID, "https://parrit.ai/#organization");
  assert.deepEqual(orgRef(), { "@type": "Organization", "@id": ORG_ID, name: "Parrit.ai", url: "https://parrit.ai" });
  orgRef().name = "Mutated";
  assert.equal(orgRef().name, AUTEUR.nom);
  assert.equal(orgRef().name, "Parrit.ai");
});

test("Organization représente la maison sans fondateur", () => {
  const org = organizationJsonLd();
  assert.equal(org["@context"], "https://schema.org");
  assert.equal(org["@type"], "Organization");
  assert.equal(org["@id"], ORG_ID);
  assert.equal("founder" in org, false);
  assert.deepEqual(org.sameAs, []);
  assert.equal(org.logo, "https://parrit.ai/icon.png");
  assert.equal(org.address.addressLocality, "Rueil-Malmaison");
});

test("BlogPosting d'un vrai article : graphe lié, URL canonique et champs préservés", () => {
  const directory = new URL("../content/journal/", import.meta.url);
  const file = readdirSync(directory).filter((name) => name.endsWith(".mdx")).sort()[0];
  assert.ok(file, "Au moins une entrée réelle doit être présente");
  const { data: entry } = matter(readFileSync(new URL(file, directory), "utf8"));
  const canonical = `https://parrit.ai/journal/${entry.slug}`;
  assert.deepEqual(blogPostingJsonLd(entry), {
    "@context": "https://schema.org", "@type": "BlogPosting", "@id": `${canonical}#article`,
    headline: entry.title, datePublished: entry.date, dateModified: entry.date,
    image: `${canonical}/og`, inLanguage: "en", description: entry.description,
    author: orgRef(), publisher: { ...orgRef(), logo: { "@type": "ImageObject", url: "https://parrit.ai/icon.png" } },
    mainEntityOfPage: canonical,
  });
});
