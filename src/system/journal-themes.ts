import type { Locale } from "./locale";
import type { SiteV1PageId } from "./site-v1-pages";

// Shared by the themes' Article JSON-LD and their sitemap entries.
export const JOURNAL_THEMES_LAST_MODIFIED = "2026-11-03";

export const JOURNAL_THEMES = {
  "harness-engineering": { label: { fr: "Encadrer vos assistants IA", en: "Rules and checks for AI assistants" }, page: "harness-engineering", articles: ["ai-agent-security-in-the-enterprise", "permission-layer-for-coding-agents", "agents-that-fabricate-facts", "the-claim-a-green-pipeline-never-makes"] },
  "ai-sprints": { label: { fr: "Un premier résultat", en: "A first result" }, page: "ai-sprints", articles: ["what-a-pilot-skips-to-look-finished", "the-claim-a-green-pipeline-never-makes", "claude-code-pour-non-dev"] },
  "integration-developpement": { label: { fr: "Relier vos logiciels", en: "Connect your software" }, page: "engineering-integration", articles: ["comment-integrer-agent-ia", "mcp-anthropic-explication", "comment-deployer-llm-entreprise", "legacy-database-migration-writers-first"] },
  "conseil-transformation": { label: { fr: "Choisir vos priorités", en: "Choose your priorities" }, page: "consulting-transformation", articles: ["measuring-sap-adoption-with-ai", "agent-ia-vs-rpa", "claude-code-vs-chatgpt", "what-you-rent-can-be-taken-back"] },
} as const satisfies Record<string, { label: Record<Locale, string>; page: SiteV1PageId; articles: readonly string[] }>;

/** Membership comes only from the same registry used by the theme pages. */
export function getJournalThemes(slug: string) {
  return Object.values(JOURNAL_THEMES).filter(theme => (theme.articles as readonly string[]).includes(slug));
}
