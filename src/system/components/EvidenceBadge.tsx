import type { PublicationEvidence } from "@/lib/registry/preuves";

/** Editorial review only. Public templates never opt in. */
export function EvidenceBadge({ evidence, internal = false }: { evidence: PublicationEvidence; internal?: boolean }) {
  return internal ? <span>{evidence.permission_status}</span> : null;
}
