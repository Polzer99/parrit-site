import { K } from "./K";
import { RegistryLine } from "./RegistryLine";
import { Seal } from "./Seal";

type DossierProps = {
  title: string;
  client: string;
  systemId: string;
  domain: string;
  commissionedYear: string | number;
  revision: string;
  status: string;
  problem: string;
  capabilities: readonly string[];
  before: readonly string[];
  after: readonly string[];
  measurementPeriod?: string;
};

export function Dossier({
  title,
  client,
  systemId,
  domain,
  commissionedYear,
  revision,
  status,
  problem,
  capabilities,
  before,
  after,
  measurementPeriod,
}: DossierProps) {
  const plate = [
    ["Client", client],
    ["System", systemId],
    ["Domain", domain],
    ["Commissioned", String(commissionedYear)],
    ["Rev", revision],
    ["Status", status],
  ] as const;

  return (
    <article className="dossier">
      <header className="dossier-header">
        <div>
          <K>System dossier</K>
          <h2>{title}</h2>
        </div>
        <dl className="dossier-plate">
          {plate.map(([label, value]) => (
            <div key={label}>
              <dt><K>{label}</K></dt>
              <dd><K><strong>{value}</strong></K></dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="dossier-section">
        <K><strong>01 · Operating problem</strong></K>
        <p>{problem}</p>
      </section>

      <section className="dossier-section">
        <K><strong>02 · Capabilities built</strong></K>
        <ol className="dossier-capabilities">
          {capabilities.map((capability, index) => (
            <li key={`${index}-${capability}`}>
              <K>CAP-{String(index + 1).padStart(2, "0")}</K>
              <div>{capability}</div>
            </li>
          ))}
        </ol>
      </section>

      <section className="dossier-section">
        <K>
          <strong>
            03 · Measured change{measurementPeriod ? ` · ${measurementPeriod}` : ""}
          </strong>
        </K>
        <div className="dossier-change">
          <div>
            <K>Before</K>
            <ul>{before.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="dossier-after">
            <K>After</K>
            <ul>{after.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>

      <footer className="dossier-footer">
        <Seal />
        <RegistryLine value={`PARRIT / DOSSIER · ${systemId}`} />
      </footer>
    </article>
  );
}
