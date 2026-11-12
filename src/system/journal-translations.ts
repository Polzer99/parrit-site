import generatedSlugs from "../../content/plan/journal-translations.json" with { type: "json" };

// Content-only publication can extend routing without modifying application code.
// This manifest contains only the new bilingual slugs; legacy editions stay below.
if (!Array.isArray(generatedSlugs) || generatedSlugs.some(slug =>
  typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
) || new Set(generatedSlugs).size !== generatedSlugs.length) {
  throw new Error("Invalid generated Journal translation manifest.");
}

// Reviewed French editions, sharing the original slug. Keep in sync with content/journal/fr.
// This small registry is safe to import in client navigation and Next configuration.
export const FRENCH_JOURNAL_SLUGS: readonly string[] = [
  "agents-that-fabricate-facts",
  "ai-act-compliance-register",
  "ai-act-marking-deadline-systems-you-built",
  "ai-agent-security-in-the-enterprise",
  "ai-cost-french-vs-english-tokens",
  "ai-prospecting-weak-signals",
  "automated-crm-for-smes",
  "automated-invoicing-with-ai",
  "automated-legal-intelligence-for-lawyers",
  "computer-use-what-it-can-undo",
  "frontier-as-fallback",
  "glm-5-2-sovereignty",
  "hook-timeout-lets-tool-call-through",
  "legacy-database-migration-writers-first",
  "malicious-mcp-server-after-install",
  "mcp-stateless-spec-what-changes-for-your-servers",
  "measuring-sap-adoption-with-ai",
  "multi-provider-redundancy",
  "one-card-one-action",
  "permission-layer-for-coding-agents",
  "publishing-without-human-review",
  "self-hosting-latency-cost",
  "the-claim-a-green-pipeline-never-makes",
  "the-draft-that-knows-when-to-stay-silent",
  "the-right-place-to-write",
  "what-a-pilot-skips-to-look-finished",
  "what-a-rollback-takes-with-it",
  "what-is-a-company-operating-system",
  "what-is-parrit-ai",
  "what-you-rent-can-be-taken-back",
  "whatsapp-business-agent",
  ...generatedSlugs,
];

if (new Set(FRENCH_JOURNAL_SLUGS).size !== FRENCH_JOURNAL_SLUGS.length) {
  throw new Error("Generated Journal translation manifest repeats a legacy slug.");
}

export function hasFrenchJournalTranslation(slug: string): boolean {
  return FRENCH_JOURNAL_SLUGS.includes(slug);
}
