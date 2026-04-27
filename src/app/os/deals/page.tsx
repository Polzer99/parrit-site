import { readFileSync } from "fs";
import path from "path";
import Link from "next/link";

export const revalidate = 0;
export const dynamic = "force-dynamic";

function loadSnapshot() {
  const p = path.join(process.cwd(), "public", "os-snapshot.json");
  return JSON.parse(readFileSync(p, "utf-8"));
}

const eur = (n: number | null | undefined) =>
  n ? new Intl.NumberFormat("fr-FR", {
    style: "currency", currency: "EUR", maximumFractionDigits: 0,
  }).format(n) : "—";

const STAGE_ORDER = ["rdv_pris", "devis_envoye", "accord_verbal", "deal_signed"];
const STAGE_LABELS: Record<string, string> = {
  rdv_pris: "RDV pris",
  devis_envoye: "Devis envoyé",
  accord_verbal: "Accord verbal",
  deal_signed: "Deal signé",
};
const STAGE_COLORS: Record<string, string> = {
  rdv_pris: "#8B6F47",
  devis_envoye: "#C8956C",
  accord_verbal: "#5FAF8E",
  deal_signed: "#2A2420",
};
const STAGE_WEIGHTS: Record<string, number> = {
  rdv_pris: 15,
  devis_envoye: 40,
  accord_verbal: 75,
  deal_signed: 100,
};

export default function DealsPage() {
  const snap = loadSnapshot();
  const closing = snap.closing_prospects || [];
  const deals = snap.deals || [];

  // Group closing_prospects by status
  const byStage: Record<string, any[]> = {};
  STAGE_ORDER.forEach((s) => (byStage[s] = []));
  closing.forEach((p: any) => {
    if (byStage[p.status]) byStage[p.status].push(p);
  });

  const totalPipe = closing.reduce(
    (acc: number, p: any) =>
      acc + (p.montant || 0) * ((STAGE_WEIGHTS[p.status] || 10) / 100),
    0,
  );
  const totalFirm = closing
    .filter((p: any) => p.status === "deal_signed")
    .reduce((acc: number, p: any) => acc + (p.montant || 0), 0);
  const totalAccord = closing
    .filter((p: any) => p.status === "accord_verbal")
    .reduce((acc: number, p: any) => acc + (p.montant || 0), 0);

  return (
    <main className="min-h-screen px-6 md:px-12 py-8 md:py-12">
      <nav className="text-sm text-text-dim mb-6">
        <Link href="/os" className="hover:text-text transition">
          ← Retour au dashboard
        </Link>
      </nav>

      <h1 className="font-heading font-light text-[52px] md:text-[64px] leading-[0.95] tracking-tight text-text mb-2">
        Deals
      </h1>
      <p className="text-text-muted mb-10">
        Pipeline RDV → Devis → Accord verbal → Deal signé. Pondération par étape.
      </p>

      {/* KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="rounded-3xl bg-white border border-border px-6 py-5">
          <p className="text-[11px] uppercase tracking-[0.15em] text-text-dim font-medium mb-1.5">
            Cash signé
          </p>
          <p className="font-heading text-4xl md:text-5xl tracking-tight text-text tabular-nums">
            {eur(totalFirm)}
          </p>
        </div>
        <div className="rounded-3xl bg-white border border-border px-6 py-5">
          <p className="text-[11px] uppercase tracking-[0.15em] text-text-dim font-medium mb-1.5">
            Accord verbal (75% pondéré)
          </p>
          <p className="font-heading text-4xl md:text-5xl tracking-tight text-accent tabular-nums">
            {eur(totalAccord)}
          </p>
        </div>
        <div className="rounded-3xl bg-white border border-border px-6 py-5">
          <p className="text-[11px] uppercase tracking-[0.15em] text-text-dim font-medium mb-1.5">
            Pipe total pondéré
          </p>
          <p className="font-heading text-4xl md:text-5xl tracking-tight text-text tabular-nums">
            {eur(totalPipe)}
          </p>
        </div>
      </section>

      {/* Kanban-like stages */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-14">
        {STAGE_ORDER.map((stage) => {
          const items = byStage[stage] || [];
          const stageTotal = items.reduce(
            (acc: number, p: any) => acc + (p.montant || 0),
            0,
          );
          return (
            <div key={stage} className="rounded-3xl bg-white border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: STAGE_COLORS[stage] }}
                  />
                  <h3 className="font-medium text-text text-sm">
                    {STAGE_LABELS[stage]}
                  </h3>
                </div>
                <span className="text-xs text-text-dim tabular-nums">
                  {items.length}
                </span>
              </div>
              {stageTotal > 0 && (
                <p className="text-xs text-text-muted tabular-nums mb-3">
                  {eur(stageTotal)}
                </p>
              )}
              <div className="space-y-2">
                {items.map((p: any) => (
                  <div
                    key={p.id}
                    className="rounded-xl bg-bg/50 border border-border px-3 py-2.5 hover:bg-bg transition"
                  >
                    <p className="font-medium text-text text-sm truncate">
                      {p.nom}
                    </p>
                    {p.entreprise && (
                      <p className="text-xs text-text-muted truncate">
                        {p.entreprise}
                      </p>
                    )}
                    {p.montant && (
                      <p className="text-xs font-medium text-accent mt-1 tabular-nums">
                        {eur(p.montant)}
                      </p>
                    )}
                    {p.prochain_tp_date && (
                      <p className="text-[10px] text-text-dim tabular-nums mt-0.5">
                        next {p.prochain_tp_date}
                      </p>
                    )}
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="text-xs text-text-dim italic">aucun</p>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {deals.length > 0 && (
        <section>
          <h2 className="font-heading text-2xl mb-4 text-text">
            Table deals structurée
          </h2>
          <div className="rounded-3xl bg-white border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-[0.15em] text-text-dim font-medium">
                  <th className="text-left px-5 py-3.5">Prospect</th>
                  <th className="text-left px-3 py-3.5">Entreprise</th>
                  <th className="text-left px-3 py-3.5">Stage</th>
                  <th className="text-right px-3 py-3.5">Valeur</th>
                  <th className="text-right px-3 py-3.5">Proba</th>
                  <th className="text-left px-5 py-3.5">Close prévu</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((d: any) => (
                  <tr key={d.id} className="border-t border-border">
                    <td className="px-5 py-3.5 font-medium text-text">
                      {d.prospect_nom || "—"}
                    </td>
                    <td className="px-3 py-3.5 text-text-muted">
                      {d.prospect_entreprise || "—"}
                    </td>
                    <td className="px-3 py-3.5 text-text-muted">{d.stage}</td>
                    <td className="px-3 py-3.5 text-right tabular-nums">
                      {eur(d.value_eur)}
                    </td>
                    <td className="px-3 py-3.5 text-right tabular-nums text-text-dim">
                      {d.probability ? `${d.probability}%` : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-text-muted tabular-nums text-xs">
                      {d.expected_close || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="mt-10 text-sm text-text-dim">
        <p>
          Données : prospects aux statuts{" "}
          <code className="text-text">rdv_pris / devis_envoye / accord_verbal / deal_signed</code>
          {" "}+ table{" "}
          <code className="text-text">deals</code> structurée (actuellement {deals.length} entrée{deals.length > 1 ? "s" : ""}).
        </p>
      </div>
    </main>
  );
}
