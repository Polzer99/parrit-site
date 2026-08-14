import { K } from "./K";

type RegistryLineProps = {
  value?: string;
};

export function RegistryLine({ value = "PARRIT / SITE · REV 01 · 2026" }: RegistryLineProps) {
  return <K className="registry-line">{value}</K>;
}
