import { getAllPosts } from "@/lib/blog";
import { getAllActualitePosts } from "@/lib/actualite";
import { getPillars } from "@/lib/pillars";
import { getCatalog, getAllCatalogCases } from "@/lib/agents";

export const dynamic = "force-static";

const SITE_URL = "https://parrit.ai";

function extractH2s(html: string): string[] {
  const matches = html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi);
  const results: string[] = [];
  for (const m of matches) {
    const text = m[1].replace(/<[^>]+>/g, "").trim();
    if (text) results.push(text);
  }
  return results;
}

export async function GET(): Promise<Response> {
  const blogPosts = getAllPosts("fr");
  const actualitePosts = getAllActualitePosts("fr");
  const pillars = getPillars();
  const catalog = getCatalog({ perDept: 3 });
  const catalogCases = getAllCatalogCases();

  const lines: string[] = [
    "# Parrit.ai - contenu complet",
    "Parrit.ai aide les DG et Directeurs métiers de PME/ETI à recruter des collaborateurs virtuels qui travaillent sur leurs vrais workflows.",
    "",
    "## Positionnement",
    "- Boutique franco-chinoise qui construit et opère des agents IA sur mesure.",
    "- Promesse : un agent avec une fiche de poste, un périmètre, des accès limités et un responsable humain.",
    "- Cible : DG, dirigeants et Directeurs métiers de PME/ETI.",
    "- Ce qui est vendu : un système en production, pas un audit générique.",
    "",
    "## Offres chiffrées",
    "- Sprint agent : 5 000 €, forfait 50/50, pour recruter un premier agent en 14 jours.",
    "- Abonnement : 99 €/mois, supervision légère, suivi des runs et maintien du socle.",
    "- Évolution : 250 €/h, nouveaux connecteurs, règles métier, écrans internes ou variantes par équipe.",
    "",
    "## Plan 14 jours",
    "- Audit flash du workflow prioritaire.",
    "- VPS sécurisé et accès limités.",
    "- Premier agent en production.",
    "- Passation aux équipes et documentation.",
    "",
    "## Catalogue des collaborateurs virtuels",
    `${catalog.deployedCount} agents déjà en production. Source : content/agents/catalog.json via src/lib/agents.ts.`,
    "",
  ];

  for (const group of catalog.groups) {
    lines.push(`### ${group.persona.name} - ${group.persona.label}`);
    for (const agentCase of [...group.cases, ...group.extraCases]) {
      lines.push(`- ${agentCase.title} : ${agentCase.desc} Secteur : ${agentCase.sector}.`);
    }
    lines.push("");
  }

  lines.push("## Tous les cas du catalogue");
  for (const agentCase of catalogCases) {
    lines.push(`- ${agentCase.id} : ${agentCase.title} (${agentCase.dept}, ${agentCase.status}, ${agentCase.date}) - ${agentCase.desc}`);
  }
  lines.push("");
  lines.push("## Index éditorial");
  lines.push("");

  for (const post of blogPosts) {
    lines.push(`## ${post.title}`);
    lines.push(`URL: ${SITE_URL}/fr/blog/${post.slug}`);
    if (post.tldr) {
      lines.push(`Résumé: ${post.tldr}`);
    } else {
      lines.push(`Description: ${post.description}`);
    }
    const h2s = extractH2s(post.content);
    if (h2s.length > 0) {
      lines.push("Sections:");
      for (const h of h2s) {
        lines.push(`- ${h}`);
      }
    }
    lines.push("");
  }

  for (const post of actualitePosts) {
    lines.push(`## ${post.title}`);
    lines.push(`URL: ${SITE_URL}/fr/actualite/${post.slug}`);
    lines.push(`Description: ${post.description}`);
    const h2s = extractH2s(post.content);
    if (h2s.length > 0) {
      lines.push("Sections:");
      for (const h of h2s) {
        lines.push(`- ${h}`);
      }
    }
    lines.push("");
  }

  lines.push("## Sujets principaux");
  lines.push("");

  for (const pillar of pillars) {
    const t = pillar.translations["fr"];
    lines.push(`### ${t.title}`);
    lines.push(`URL: ${SITE_URL}/fr/blog/sujet/${pillar.slug}`);
    lines.push(`Description: ${t.description}`);
    lines.push("");
  }

  const body = lines.join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
