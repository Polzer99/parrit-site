export function ServiceGrid({ items }: { items: readonly (readonly [string, string])[] }) {
  return <div className="services">{items.map(([title, text]) => <div key={title}><span className="s">{title}</span><p>{text}</p></div>)}</div>;
}
