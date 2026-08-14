import type { NextConfig } from "next";

import { aliasRessourcesARediriger } from "./src/lib/registry/ressources";

/**
 * Arbitrage Paul du 02/08/2026 — une ressource a UNE seule URL canonique :
 * celle qui rend son expérience complète. `/[lang]/ressources/[slug]` reste un
 * alias lisible, mais il redirige en 301 vers l'expérience au lieu d'offrir une
 * fiche qui obligerait à recliquer.
 *
 * La redirection est déclarée ici, dans le routeur, et non dans une page : elle
 * est servie en un seul saut, avant tout rendu, et Next conserve la chaîne de
 * requête — donc les `source` et les `utm_*`.
 *
 * Les cartes d'index visent directement l'expérience : ce chemin ne sert qu'aux
 * liens déjà émis et aux saisies manuelles. Aucune chaîne de redirection.
 */
const REDIRECTIONS_RESSOURCES = aliasRessourcesARediriger().map(({ slug, url }) => ({
  source: `/:lang(fr|en|pt-BR|zh-CN)/ressources/${slug}`,
  destination: url,
  statusCode: 301 as const,
}));

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
    slugs.map((slug) => ({
      source: `/:lang(fr|en|pt-BR|zh-CN)/${section}/${slug}`,
      destination: `/journal/${slug}`,
      statusCode: 301 as const,
    })),
);

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...REDIRECTIONS_RESSOURCES,
      ...REDIRECTIONS_JOURNAL,
      {
        source: "/:lang/audit-claude-code",
        destination: "/:lang/audit",
        statusCode: 301,
      },
      {
        source: "/:lang/sprint",
        destination: "/:lang/deploiement-agents",
        statusCode: 301,
      },
      {
        source: "/chemin",
        destination: "/fr",
        statusCode: 301,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/demarrer-claude-code",
        destination: "/demarrer-claude-code/index.html",
      },
      /* Vercel résout tout seul `dossier/index.html`, mais `next start` non :
         sans cette règle, la route est 200 en production et 404 en local, donc
         invérifiable avant déploiement. Les deux voisines l'avaient déjà. */
      {
        source: "/architecture-claude-md",
        destination: "/architecture-claude-md/index.html",
      },
      {
        source: "/hr-radar",
        destination: "/hr-radar/index.html",
      },
    ];
  },
};

export default nextConfig;
