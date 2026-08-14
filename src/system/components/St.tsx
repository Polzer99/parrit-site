import type { ReactNode } from "react";

export type StatusKind = "ok" | "att" | "crit" | "done";

type StProps = {
  kind: StatusKind;
  children: ReactNode;
};

export function St({ kind, children }: StProps) {
  return <span className={`st ${kind}`}>{children}</span>;
}
