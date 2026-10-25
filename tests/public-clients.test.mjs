import assert from "node:assert/strict";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { PUBLIC_CLIENT_NAMES, publicClientName } from "../src/system/public-clients.ts";
import { homeClientViolations, privateClientNames, journalClientNames } from "../scripts/lib/public-clients.mjs";
import { gateNoms } from "../scripts/journal-gates.mjs";

const source = readFileSync("src/app/(rev01)/page.tsx", "utf8");
test("home accepts canonical public clients while the Journal rejects all known clients", () => {
  assert.deepEqual(homeClientViolations(source), []);
  for (const name of PUBLIC_CLIENT_NAMES) {
    assert.equal(gateNoms(`---\ntitle: ${name.toLowerCase()}\n---\nAn article.`).ok, false);
    assert.deepEqual(journalClientNames(name), [name]);
    assert.deepEqual(privateClientNames(name), []);
  }
  assert.equal(gateNoms("Naval Group").ok, false);
  assert.equal(publicClientName("Clevery Avocats"), "Clevery");
  assert.equal(gateNoms("Clevery Avocats").ok, false);
  assert.equal(publicClientName("Clevery Inconnu"), undefined);
  assert.equal(publicClientName("ClientTemoinInterdit"), undefined);
  assert.deepEqual(journalClientNames("Clevernesse, Joones, SNCFrance"), []);
});

test("an unknown client injected into either locale of the home DICT fails", () => {
  for (const name of PUBLIC_CLIENT_NAMES) {
    const displayName = name === "Clevery" ? "Clevery Avocats" : name;
    const mutations = [...source.matchAll(new RegExp(displayName, "g"))];
    assert.equal(mutations.length, 2, "one client reference in each locale");
    for (const match of mutations) {
      const changed = source.slice(0, match.index) + "ClientTemoinInterdit" + source.slice(match.index + displayName.length);
      assert.ok(homeClientViolations(changed).some(({ name }) => name === "ClientTemoinInterdit"));
    }
  }
});

test("known private clients are rejected in any home prose", () => {
  const changed = source.replace('kicker: "Parrit / Software and AI"', 'kicker: "Naval Group"');
  assert.ok(homeClientViolations(changed).some(({ name }) => name === "Naval Group"));
});

test("claims gate allows the public home but rejects each public client in Journal content", (t) => {
  const root = mkdtempSync(path.join(tmpdir(), "public-clients-gate-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const directory of ["scripts/lib", "src/system", "src/app/(rev01)", "content/journal", "public"]) {
    mkdirSync(path.join(root, directory), { recursive: true });
  }
  for (const file of ["scripts/false-claims-check.mjs", "scripts/lib/public-clients.mjs", "scripts/lib/certification-claims.mjs", "src/system/public-clients.ts"]) {
    copyFileSync(file, path.join(root, file));
  }
  symlinkSync(realpathSync("node_modules"), path.join(root, "node_modules"), "dir");
  writeFileSync(path.join(root, "src/app/(rev01)/page.tsx"), source);
  for (const file of ["public/llms.txt", "site.config.ts", "TRUTH.md"]) writeFileSync(path.join(root, file), "");
  const run = () => {
    const result = spawnSync(process.execPath, ["scripts/false-claims-check.mjs"], { cwd: root, encoding: "utf8", timeout: 10_000 });
    assert.ifError(result.error);
    return { status: result.status, output: result.stdout + result.stderr };
  };
  const accepted = run();
  assert.equal(accepted.status, 0, accepted.output);
  for (const name of [...PUBLIC_CLIENT_NAMES, "Clevery Avocats"]) {
    writeFileSync(path.join(root, "content/journal/client-test.mdx"), `---\ntitle: An article\n---\n${name}`);
    const rejected = run();
    assert.equal(rejected.status, 1, rejected.output);
    assert.match(rejected.output, /content\/journal\/client-test\.mdx.*unauthorized client/);
  }
});
