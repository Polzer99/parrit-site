import { ProcessConnector } from "./ProcessDiagram";

/** A shared semantic sequence, with connectors that carry no spoken content. */
export function Sequence({ steps, className = "" }: { steps: readonly (readonly [string, string?])[]; className?: string }) {
  return <ol className={`v1-sequence ${className}`}>{steps.map(([title, body], index) => <li key={title}><div><h3>{title}</h3>{body && <p>{body}</p>}</div>{index < steps.length - 1 && <ProcessConnector />}</li>)}</ol>;
}
