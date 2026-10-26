import type { NextConfig } from "next";

const RENOMMAGES_JOURNAL: Readonly<Record<string, string>> = {
  "agent-whatsapp-business-entreprise": "whatsapp-business-agent",
  "crm-automatise-pme-artisans": "automated-crm-for-smes",
  "evaluation-adoption-sap-intelligence-artificielle": "measuring-sap-adoption-with-ai",
  "facturation-automatique-ia-pme": "automated-invoicing-with-ai",
  "glm-5-2-souverainete": "glm-5-2-sovereignty",
  "prospection-ia-signaux-podcasts-linkedin": "ai-prospecting-weak-signals",
  "publier-sans-relecture-humaine": "publishing-without-human-review",
  "securite-agents-ia-entreprise": "ai-agent-security-in-the-enterprise",
  "une-carte-une-action": "one-card-one-action",
  "veille-juridique-automatisee-avocats": "automated-legal-intelligence-for-lawyers",
  "le-bon-endroit-pour-ecrire": "the-right-place-to-write",
  "le-brouillon-qui-sait-se-taire": "the-draft-that-knows-when-to-stay-silent",
};

const JOURNAL_LEGACY_ROUTES = {
  blog: [
    "evaluation-adoption-sap-intelligence-artificielle",
    "crm-automatise-pme-artisans",
    "agent-whatsapp-business-entreprise",
    "veille-juridique-automatisee-avocats",
    "facturation-automatique-ia-pme",
    "prospection-ia-signaux-podcasts-linkedin",
    "securite-agents-ia-entreprise",
    "une-carte-une-action",
    "le-brouillon-qui-sait-se-taire",
    "le-bon-endroit-pour-ecrire",
  ],
  actualite: ["glm-5-2-souverainete"],
  glossaire: [
    "agent-ia-entreprise",
    "agent-ia-vs-rpa",
    "automatiser-veille-juridique",
    "claude-code-pour-non-dev",
    "claude-code-vs-chatgpt",
    "comment-deployer-llm-entreprise",
    "comment-integrer-agent-ia",
    "mcp-anthropic-explication",
    "rgpd-llm-securite",
  ],
} as const;

const REDIRECTIONS_JOURNAL = Object.entries(JOURNAL_LEGACY_ROUTES).flatMap(
  ([section, slugs]) =>
    slugs.flatMap((slug) => [
      {
        source: `/:lang(fr|en|pt-BR|zh-CN)/${section}/${slug}`,
        destination: `/journal/${RENOMMAGES_JOURNAL[slug] ?? slug}`,
        statusCode: 301 as const,
      },
      // Bare legacy path: one 301, no locale-detection hop in between.
      {
        source: `/${section}/${slug}`,
        destination: `/journal/${RENOMMAGES_JOURNAL[slug] ?? slug}`,
        statusCode: 301 as const,
      },
    ]),
);

// Final page-unique handoff §6.4: preserve the four editorial subjects.
const THEME_REDIRECTS = [
  ["consulting-transformation", "conseil-transformation"],
  ["ai-sprints", "ai-sprints"],
  ["engineering-integration", "integration-developpement"],
  ["harness-engineering", "harness-engineering"],
].flatMap(([old, theme]) => [
  { source: `/${old}`, destination: `/journal/themes/${theme}`, statusCode: 308 as const },
  { source: `/fr/${old}`, destination: `/fr/journal/themes/${theme}`, statusCode: 308 as const },
]);
const SECTION_REDIRECTS = [
  ["manufacture", "path", "parcours"], ["build-with-you", "path", "parcours"],
  ["standard", "safeguards", "confiance"], ["systems", "safeguards", "confiance"],
  ["dossiers", "references", "references"], ["commission", "contact", "contact"],
  ["contact", "contact", "contact"],
].flatMap(([old, en, fr]) => [
  { source: `/${old}`, destination: `/#${en}`, statusCode: 308 as const },
  { source: `/fr/${old}`, destination: `/fr#${fr}`, statusCode: 308 as const },
]);

const nextConfig: NextConfig = {
  images: { minimumCacheTTL: 2678400 },
  // The OG generators read src/system/tokens.css at runtime; without this
  // the file is absent from the serverless bundle and the route 500s.
  outputFileTracingIncludes: {
    "/journal/\\[slug\\]": ["./content/journal/*.mdx", "./public/certificates/*.json"],
    "/journal/themes/\\[theme\\]": ["./content/journal/*.mdx"],
    "/llms-full.txt": ["./public/llms.txt", "./content/journal/*.mdx"],
    "/opengraph-image": ["./src/system/brand-os.tokens.css", "./src/system/tokens.css", "./src/og-assets/*"],
    "/journal/\\[slug\\]/og": ["./src/system/brand-os.tokens.css", "./src/system/tokens.css", "./src/og-assets/*"],
  },
  async headers() {
    // Le kit de polices est versionné par dossier : tout changement de
    // police passe par un nouveau dossier, donc immutable 1 an est sûr.
    return [
      {
        source: "/fonts/rev02/:file*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/fonts/rev03/:file*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      ...THEME_REDIRECTS,
      ...SECTION_REDIRECTS,
      { source: "/fr/conseil-transformation", destination: "/fr/journal/themes/conseil-transformation", statusCode: 308 },
      ...Object.entries(RENOMMAGES_JOURNAL).map(([old, current]) => ({ source: `/fr/journal/${old}`, destination: `/journal/${current}`, statusCode: 308 as const })),
      { source: "/fr/journal/:slug", destination: "/journal/:slug", statusCode: 308 },
      { source: "/camp-costa-rica/:path*", destination: "/", permanent: true },
      { source: "/paul", destination: "/", permanent: true },
      { source: "/maxime", destination: "/", permanent: true },
      ...REDIRECTIONS_JOURNAL,
      ...Object.entries(RENOMMAGES_JOURNAL).map(([ancien, nouveau]) => ({
        source: `/journal/${ancien}`,
        destination: `/journal/${nouveau}`,
        statusCode: 301 as const,
      })),
      {
        source: "/architecture-claude-md",
        destination: "/journal",
        statusCode: 301,
      },
      {
        source: "/demarrer-claude-code",
        destination: "/journal",
        statusCode: 301,
      },
      {
        source: "/:lang(en|pt-BR|zh-CN)",
        destination: "/",
        statusCode: 301,
      },
      {
        source: "/:lang(en|pt-BR|zh-CN)/:path*",
        destination: "/",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
