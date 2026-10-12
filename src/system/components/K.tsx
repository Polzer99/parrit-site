import { Children, type CSSProperties, type ReactNode } from "react";

type KProps = {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
};

export function K({ children, style, className = "" }: KProps) {
  return (
    <span className={["k", className].filter(Boolean).join(" ")} style={style}>
      {/* Keep the separator with the preceding word, but allow wrapping after it. */}
      {Children.map(children, (child) => typeof child === "string" ? child.replaceAll(" · ", "\u00a0· ") : child)}
    </span>
  );
}
