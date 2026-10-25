import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { PUBLIC_CLIENT_NAMES } from "../src/system/public-clients.ts";
import { homeClientViolations, privateClientNames } from "../scripts/lib/public-clients.mjs";
import { gateNoms } from "../scripts/journal-gates.mjs";

const source = readFileSync("src/app/(rev01)/page.tsx", "utf8");
test("home and publisher accept only the canonical public clients", () => {
  assert.deepEqual(homeClientViolations(source), []);
  for (const name of PUBLIC_CLIENT_NAMES) {
    assert.equal(gateNoms(name).ok, true);
    assert.deepEqual(privateClientNames(name), []);
  }
  assert.equal(gateNoms("Naval Group").ok, false);
});

test("an unknown client injected into either locale of the home DICT fails", () => {
  for (const name of PUBLIC_CLIENT_NAMES) {
    const mutations = [...source.matchAll(new RegExp(name, "g"))];
    assert.ok(mutations.length >= 4, "both client lists and both case descriptions");
    for (const match of mutations) {
      const changed = source.slice(0, match.index) + "ClientTemoinInterdit" + source.slice(match.index + name.length);
      assert.ok(homeClientViolations(changed).some(({ name }) => name === "ClientTemoinInterdit"));
    }
  }
});

test("known private clients are rejected in any home prose", () => {
  const changed = source.replace('kicker: "Parrit / Software and AI"', 'kicker: "Clevery"');
  assert.ok(homeClientViolations(changed).some(({ name }) => name === "Clevery"));
});
