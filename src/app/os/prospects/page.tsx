import { readFileSync } from "fs";
import path from "path";
import ProspectsClient from "./ProspectsClient";

export const revalidate = 0;
export const dynamic = "force-dynamic";

function loadSnapshot() {
  const p = path.join(process.cwd(), "public", "os-snapshot.json");
  return JSON.parse(readFileSync(p, "utf-8"));
}

export default function ProspectsPage() {
  const snapshot = loadSnapshot();
  return <ProspectsClient prospects={snapshot.all_prospects || []} />;
}
