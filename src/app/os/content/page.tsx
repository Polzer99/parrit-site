import { readFileSync } from "fs";
import path from "path";
import ContentClient from "./ContentClient";

export const revalidate = 0;
export const dynamic = "force-dynamic";

function loadSnapshot() {
  const p = path.join(process.cwd(), "public", "os-snapshot.json");
  return JSON.parse(readFileSync(p, "utf-8"));
}

async function loadIdeas() {
  const { readFile } = await import("fs/promises");
  try {
    const p = "/Users/paullarmaraud/Parrit.ai/Projets-Dev/parrit-site/public/os-ideas.json";
    const data = await readFile(p, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export default async function ContentPage() {
  const snap = loadSnapshot();
  const ideas = await loadIdeas();
  return <ContentClient ideas={ideas} transcripts={snap.transcripts_recent || []} />;
}
