import type { NextConfig } from "next";

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
        destination: `/journal/${slug}`,
        statusCode: 301 as const,
      },
      // Bare legacy path: one 301, no locale-detection hop in between.
      {
        source: `/${section}/${slug}`,
        destination: `/journal/${slug}`,
        statusCode: 301 as const,
      },
    ]),
);

const nextConfig: NextConfig = {
  // The journal OG generator reads src/system/tokens.css at runtime; without this
  // the file is absent from the serverless bundle and the route 500s.
  outputFileTracingIncludes: {
    "/journal/[slug]/opengraph-image": ["./src/system/tokens.css", "./src/og-assets/*"],
  },
  async headers() {
    // Le kit de polices est versionné par dossier (rev02) : tout changement de
    // police passe par un nouveau dossier, donc immutable 1 an est sûr.
    return [
      {
        source: "/fonts/rev02/:file*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/paul", destination: "/", permanent: true },
      { source: "/maxime", destination: "/", permanent: true },
      ...REDIRECTIONS_JOURNAL,
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
        source: "/:lang(fr|en|pt-BR|zh-CN)",
        destination: "/",
        statusCode: 301,
      },
      {
        source: "/:lang(fr|en|pt-BR|zh-CN)/:path*",
        destination: "/",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
