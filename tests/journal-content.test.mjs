import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";

import ts from "typescript";

const source = new URL("../src/system/journal.ts", import.meta.url);
const compiled = ts.transpileModule(readFileSync(source, "utf8"), {
  compilerOptions: {
    esModuleInterop: true,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2017,
  },
}).outputText;
const journalModule = { exports: {} };
const nativeRequire = createRequire(source);
const requireJournal = (name) => name === "server-only" ? {} : nativeRequire(name);
new Function("require", "module", "exports", compiled)(requireJournal, journalModule, journalModule.exports);

const { getJournalEntry, stripJournalComments } = journalModule.exports;

test("stripJournalComments removes a leading multiline MDX comment", () => {
  const content = "{/*\nRAIL parrit\n*/}\n\nA published paragraph.\n";

  const cleaned = stripJournalComments(content);

  assert.equal(cleaned, "A published paragraph.\n");
  assert.doesNotMatch(cleaned, /\{\/\*|RAIL/);
});

test("stripJournalComments removes a single-line MDX comment", () => {
  const content = "{/* FICHE D'ENTRÉE */}\n\nA published paragraph.";

  assert.equal(stripJournalComments(content), "A published paragraph.");
});

test("stripJournalComments removes multiline HTML comments", () => {
  const content = "<!--\ninternal note\n-->\n\nA published paragraph.";

  assert.equal(stripJournalComments(content), "A published paragraph.");
});

test("stripJournalComments preserves text without comments exactly", () => {
  const content = "A paragraph with  two spaces.\n\nA second paragraph.\n";

  assert.equal(stripJournalComments(content), content);
});

test("the affected journal entries load without their internal entry sheet", () => {
  const slugs = [
    "hook-timeout-lets-tool-call-through",
    "legacy-database-migration-writers-first",
    "what-a-pilot-skips-to-look-finished",
  ];

  for (const slug of slugs) {
    const content = getJournalEntry(slug)?.content;
    assert.ok(content, `${slug} loads`);
    assert.doesNotMatch(content, /^\{\/\*/u, slug);
    assert.doesNotMatch(content, /RAIL parrit|FICHE D'ENTRÉE/u, slug);
  }
});

function loadFixture(content) {
  const fixtureModule = { exports: {} };
  const fixtureRequire = (name) => name === "node:fs" ? {
    existsSync: () => true,
    readdirSync: () => ["fixture.mdx"],
    readFileSync: () => `---\ntitle: Fixture\ndate: "2026-10-13"\ndescription: Fixture\nslug: fixture\n---\n${content}`,
  } : requireJournal(name);
  new Function("require", "module", "exports", compiled)(fixtureRequire, fixtureModule, fixtureModule.exports);
  return fixtureModule.exports.getJournalEntry("fixture").content;
}

for (const comment of ["{/*\nRAIL parrit\n*/}", "{/* RAIL parrit */}", "<!-- RAIL parrit -->"]) {
  test(`entry loader removes ${JSON.stringify(comment)} and preserves paragraph whitespace`, () => {
    const paragraph = "  A published paragraph.  \n\nSecond paragraph.\n\n";
    const content = loadFixture(`${comment}\n\n${paragraph}`);
    assert.equal(content, paragraph);
    assert.doesNotMatch(content, /\{\/\*|RAIL/);
  });
}

test("entry loader preserves comment-free content byte for byte", () => {
  const content = "\n\n  Indented paragraph.  \n\nSecond paragraph.\n\n";
  assert.equal(loadFixture(content), content);
});

test("multiple mixed comments are removed non-greedily without normalizing body spacing", () => {
  const content = "{/* first */}\r\n \t\r\nFirst  paragraph.\n{/* second */}Keep me.<!-- third -->\n\nEnd.  \n";
  assert.equal(stripJournalComments(content), "First  paragraph.\nKeep me.\n\nEnd.  \n");
});
