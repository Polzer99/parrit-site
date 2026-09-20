import type { Locale } from "../locale";

export type RegistrySnapshotProps = {
  asOf: string;
  rows: readonly { domain: string; source: string; status: string; legacyWriters: number }[];
  summary: { cutover: number; migrating: number; notStarted: number; parityFail: number; total: number };
  locale?: Locale;
};

export function RegistrySnapshot({ asOf, rows, summary, locale = "en" }: RegistrySnapshotProps) {
  const headings = locale === "fr" ? ["Domaine", "Source canonique", "État", "Écrivains historiques encore actifs"] : ["Domain", "Canonical source", "Status", "Active legacy writers"];
  return <div className="registry-snapshot" style={{ marginTop: 40, fontFamily: "var(--mono)", fontSize: "var(--t-k)" }}>
    <table>
      <caption style={{ textAlign: "left", paddingBottom: 24 }}>
        {locale === "fr" ? "Registre P0 · constaté le " : "P0 registry · observed "}<time dateTime={asOf}>{asOf}</time>
      </caption>
      <thead><tr>{headings.map((heading) => <th scope="col" key={heading}>{heading}</th>)}</tr></thead>
      <tbody>{rows.map((row) => <tr key={row.domain}>
        <th scope="row" data-label={headings[0]}>{row.domain}</th><td data-label={headings[1]}>{row.source}</td><td data-label={headings[2]}>{row.status}</td><td data-label={headings[3]}>{row.legacyWriters}</td>
      </tr>)}</tbody>
    </table>
    <p style={{ marginTop: 24, lineHeight: 1.8 }}>{summary.total} {locale === "fr" ? "domaines" : "domains"} · CUTOVER {summary.cutover} · MIGRATING {summary.migrating} · NOT_STARTED {summary.notStarted} · PARITY_FAIL {summary.parityFail}</p>
  </div>;
}
