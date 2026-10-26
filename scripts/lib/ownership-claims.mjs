import { sourceProse } from './certification-claims.mjs';

// Published app/system copy only; the legal notice, private demos and Journal
// are outside this handoff. AST extraction excludes implementation comments.
export function ownershipClaims(source, file) {
  if (!/^(?:src\/app\/\(rev01\)\/|src\/system\/)/.test(file) ||
      /^src\/app\/\(rev01\)\/(?:fr\/)?(?:legal|sketch|journal)(?:\/|$)/.test(file)) return [];
  const forbidden = /vous\s+appartien|propriétaire\s+(?:du\s+système|de\s+tout)|propriété\s+complète|you\s+keep\s+ownership|full\s+client\s+ownership|belongs?\s+to\s+you/iu;
  return sourceProse(source, file).filter(({ text }) => forbidden.test(text));
}
