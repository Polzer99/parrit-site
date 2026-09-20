import type { Locale } from "../locale";
import { K } from "./K";

export type SystemCardProps = {
  domain: string;
  name: string;
  input: string;
  process: string;
  output: string;
  limits: string;
  proofLabel: string;
  locale?: Locale;
};

export function SystemCard({ domain, name, input, process, output, limits, proofLabel, locale = "en" }: SystemCardProps) {
  const labels = locale === "fr" ? ["Entrée", "Traitement", "Sortie", "Limites"] : ["Input", "Process", "Output", "Limits"];
  return <article className="system-card offer-card" style={{ border: 0, background: "var(--ink)" }}>
    {domain && <K>{domain}</K>}
    {name && <h3>{name}</h3>}
    <dl style={{ margin: 0, display: "grid", gap: 24 }}>
      {[input, process, output, limits].map((value, index) => (index === 3 || value) && <div key={labels[index]}>
        <dt><K>{labels[index]}</K></dt>
        <dd style={{ margin: "8px 0 0", lineHeight: 1.65, color: "var(--label-d)", whiteSpace: "pre-wrap" }}>{value}</dd>
      </div>)}
    </dl>
    {proofLabel && <footer style={{ marginTop: "auto" }}><K>{proofLabel}</K></footer>}
  </article>;
}
