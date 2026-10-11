import { K } from "./K";

type RegistryLineProps = {
  value?: string;
};

export function RegistryLine({ value = "PARRIT / SITE · 2026" }: RegistryLineProps) {
  return <K className="registry-line">{value}</K>;
}
