// Independent route contract: do not derive from implementation or sitemap.
export const PUBLIC_ROUTES = [
  "/",
  "/fr",
  "/journal",
  "/fr/journal",
  "/journal/themes/harness-engineering",
  "/journal/themes/ai-sprints",
  "/journal/themes/integration-developpement",
  "/journal/themes/conseil-transformation",
  "/fr/journal/themes/harness-engineering",
  "/fr/journal/themes/ai-sprints",
  "/fr/journal/themes/integration-developpement",
  "/fr/journal/themes/conseil-transformation",
  "/legal",
  "/fr/legal"
] as const;
export const JOURNAL_THEMES = ["harness-engineering", "ai-sprints", "integration-developpement", "conseil-transformation"] as const;
