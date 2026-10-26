export function Faq({ items }: { items: readonly (readonly [string, string])[] }) {
  return <>{items.map(([question, answer]) => <details className="v1-faq" key={question}><summary><span>{question}</span><svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M3 10h14M10 3v14" /></svg></summary><p>{answer}</p></details>)}</>;
}
