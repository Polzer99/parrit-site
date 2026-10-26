import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { ownershipClaims } from '../scripts/lib/ownership-claims.mjs';

test('Journal claim gate checks headings and summaries but leaves article bodies out of scope', () => {
  for (const claim of ['owned by the client', 'belongs to it', 'sent and reconciled automatically', 'runs itself']) {
    assert.equal(ownershipClaims(`---\ndescription: "${claim}"\n---\n`, 'content/journal/test.mdx').length, 1);
    assert.equal(ownershipClaims(`---\ndescription: "Approved"\n---\n${claim}`, 'content/journal/test.mdx').length, 0);
  }
  assert.equal(ownershipClaims('---\ndescription: >\n  Sent and reconciled\n  automatically.\n---\n', 'content/journal/test.mdx').length, 1);
  for (const file of readdirSync('content/journal').filter(f => f.endsWith('.mdx'))) assert.deepEqual(ownershipClaims(readFileSync(`content/journal/${file}`, 'utf8'), `content/journal/${file}`), []);
});
