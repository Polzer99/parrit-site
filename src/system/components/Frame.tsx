import type { CSSProperties, ReactNode } from "react";

type FrameProps = {
  closed?: boolean;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  "data-done"?: boolean;
};

export function Frame({ closed = false, children, style, className = "", ...rest }: FrameProps) {
  const classes = ["frame", closed && "closed", className].filter(Boolean).join(" ");

  return (
    <div className={classes} style={style} data-done={rest["data-done"] || undefined}>
      <i className="fx" aria-hidden="true" />
      {children}
    </div>
  );
}
