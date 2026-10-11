import { Children, type CSSProperties, type ReactNode } from "react";

type KProps = {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
};

export function K({ children, style, className = "" }: KProps) {
  return (
    <span className={["k", className].filter(Boolean).join(" ")} style={style}>
      {Children.map(children, (child) => typeof child === "string" ? child.replaceAll(" · ", "\u00a0·\u00a0") : child)}
    </span>
  );
}
