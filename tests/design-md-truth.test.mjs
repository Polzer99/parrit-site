import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { servedCss, servedCssFiles } from "./helpers/served-css.mjs";

test("DESIGN.md cites only variables defined in the served CSS", () => {
  const sheets = servedCssFiles();
  for (const file of ["tokens.css", "brand-os.tokens.css", "single-page.css", "booking.css", "journal-themes.css"]) {
    assert.ok(sheets.some(sheet => sheet.endsWith(`/${file}`)), `import graph includes ${file}`);
  }
  const definitions = new Set([...servedCss().matchAll(/(--[\w-]+)\s*:/g)].map(match => match[1]));
  const cited = [...readFileSync("DESIGN.md", "utf8").matchAll(/--[a-zA-Z_][\w-]*/g)].map(match => match[0]);
  assert.ok(cited.length > 0, "the design reference must cite real tokens");
  for (const variable of new Set(cited)) assert.ok(definitions.has(variable), `${variable} is not defined by the served CSS`);
});

test("DESIGN.md never copies hexadecimal colours", () => {
  assert.doesNotMatch(readFileSync("DESIGN.md", "utf8"), /#[\da-f]{3,8}\b/i);
});
