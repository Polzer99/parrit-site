import type { CSSProperties, ReactNode } from "react";

type FrameProps = {
  closed?: boolean;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
};

export function Frame({ closed = false, children, style, className = "" }: FrameProps) {
  const classes = ["frame", closed && "closed", className].filter(Boolean).join(" ");

  return (
    <div className={classes} style={style}>
      <i className="fx" aria-hidden="true" />
      {children}
    </div>
  );
}
