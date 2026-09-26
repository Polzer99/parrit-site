import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import matter from "gray-matter";
import { AUTEUR, ORG_ID, orgRef, personRef } from "../src/system/auteur.ts";
import { blogPostingJsonLd, organizationJsonLd } from "../src/system/jsonld.ts";

const PERSON_ID = "https://paul-larmaraud.com/#person";

test("références canoniques exactes et indépendantes", () => {
  assert.equal(AUTEUR.id, PERSON_ID);
  assert.equal(ORG_ID, "https://parrit.ai/#organization");
  assert.deepEqual(personRef(), { "@type": "Person", "@id": PERSON_ID, name: "Paul Larmaraud", url: "https://paul-larmaraud.com" });
  assert.deepEqual(orgRef(), { "@type": "Organization", "@id": ORG_ID, name: "Parrit.ai", url: "https://parrit.ai" });
  personRef().name = "Mutated";
  orgRef().name = "Mutated";
  assert.equal(personRef().name, AUTEUR.nom);
  assert.equal(orgRef().name, "Parrit.ai");
});

test("Organization identifie le fondateur sans confondre personne et société", () => {
  const org = organizationJsonLd();
  assert.equal(org["@context"], "https://schema.org");
  assert.equal(org["@type"], "Organization");
  assert.equal(org["@id"], ORG_ID);
  assert.deepEqual(org.founder, personRef());
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
    author: personRef(), publisher: { ...orgRef(), logo: { "@type": "ImageObject", url: "https://parrit.ai/icon.png" } },
    mainEntityOfPage: canonical,
  });
});
