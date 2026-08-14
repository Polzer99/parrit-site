import type { ReactNode } from "react";

type InstrumentRow = {
  value: string;
  label: string;
  status: ReactNode;
  critical?: boolean;
};

type InstrumentProps = {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
  rows: InstrumentRow[];
  className?: string;
};

export function Instrument({ left, center, right, rows, className = "" }: InstrumentProps) {
  return (
    <div className={["instrument", className].filter(Boolean).join(" ")}>
      <div className="instrument-bar">
        {left}
        {center}
        {right}
      </div>
      {rows.map((row) => (
        <div
          className={["instrument-row", row.critical && "critical"].filter(Boolean).join(" ")}
          key={row.value}
        >
          <span className="instrument-value">{row.value}</span>
          <span className="instrument-label">{row.label}</span>
          <span className="instrument-status">{row.status}</span>
        </div>
      ))}
    </div>
  );
}
