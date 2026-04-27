import { readFileSync } from "fs";
import path from "path";
import OsDashboard from "./OsDashboard";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Snapshot = {
  generated_at: string;
  workspace: { name: string; slug: string };
  kpis: {
    prospects: number;
    touchpoints: number;
    rdv_today: number;
    rdv_goal: number;
    pipe_eur: number;
  };
  campaigns: Array<{
    campaign: string;
    total: number;
    rdv: number;
    devis: number;
    accord: number;
    deals: number;
    no: number;
    pending: number;
    pipe_eur: number;
    rdv_rate: number;
    deal_rate: number;
    engagement_rate: number;
    last_tp: string | null;
  }>;
  top_prospects: Array<{
    slug: string;
    nom: string;
    entreprise: string | null;
    status: string | null;
    priorite: number | null;
    telephone: string | null;
    email: string | null;
    prochain_tp_date: string | null;
    montant: number | null;
    campaign: string | null;
  }>;
  signals: Array<{
    id: string;
    source: string;
    detail_preview: string;
    confidence: number | null;
    detected_at: string;
  }>;
  touchpoints_7d: Array<{ channel: string; n: number }>;
  transcripts_recent: Array<{
    id: string;
    source: string | null;
    date: string | null;
    subject: string | null;
  }>;
};

function loadSnapshot(): Snapshot | null {
  try {
    const p = path.join(process.cwd(), "public", "os-snapshot.json");
    return JSON.parse(readFileSync(p, "utf-8"));
  } catch {
    return null;
  }
}

export default function OsHomePage() {
  const snapshot = loadSnapshot();
  if (!snapshot) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <h1 className="font-heading text-4xl mb-4">Parrit OS</h1>
          <p className="text-text-muted">
            Snapshot introuvable. Run{" "}
            <code className="bg-bg-dark text-text-light px-2 py-1 rounded text-sm">
              python3 signals/export_os_snapshot.py
            </code>
          </p>
        </div>
      </main>
    );
  }
  return <OsDashboard snapshot={snapshot} />;
}
