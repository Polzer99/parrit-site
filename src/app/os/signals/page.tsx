import { readFileSync } from "fs";
import path from "path";
import SignalsClient from "./SignalsClient";

export const revalidate = 0;
export const dynamic = "force-dynamic";

function loadSnapshot() {
  const p = path.join(process.cwd(), "public", "os-snapshot.json");
  return JSON.parse(readFileSync(p, "utf-8"));
}

export default function SignalsPage() {
  const snap = loadSnapshot();
  return <SignalsClient signals={snap.signals || []} touchpoints_7d={snap.touchpoints_7d || []} />;
}
