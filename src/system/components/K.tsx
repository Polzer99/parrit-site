import type { CSSProperties, ReactNode } from "react";

type KProps = {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
};

export function K({ children, style, className = "" }: KProps) {
  return (
    <span className={["k", className].filter(Boolean).join(" ")} style={style}>
      {children}
    </span>
  );
}
