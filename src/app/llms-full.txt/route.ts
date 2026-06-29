import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";
import { getAllActualitePosts } from "@/lib/actualite";
import { getPillars } from "@/lib/pillars";

export const revalidate = 3600;

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

export async function GET(): Promise<NextResponse> {
  const blogPosts = getAllPosts("fr");
  const actualitePosts = getAllActualitePosts("fr");
  const pillars = getPillars();

  const lines: string[] = [
    "# Parrit.ai -- contenu complet",
    "Index complet des articles et ressources publis sur parrit.ai, destine aux moteurs de recherche et aux IA.",
    "",
  ];

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

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
