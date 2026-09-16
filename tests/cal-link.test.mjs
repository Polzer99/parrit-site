import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

import { CAL_LINK_COMMISSION, siteConfig } from "../site.config.ts";

test("commission uses the canonical audit event configured for Google Meet", () => {
  assert.equal(CAL_LINK_COMMISSION, "paul-larmaraud/audit");
  assert.equal(siteConfig.CAL_LINK_COMMISSION, "paul-larmaraud/audit");
});

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
