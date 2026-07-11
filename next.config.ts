import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
    ];
  },
};

export default nextConfig;
