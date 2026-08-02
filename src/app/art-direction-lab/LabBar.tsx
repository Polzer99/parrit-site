import Link from "next/link";
import { CONCEPTS } from "./content";

/** Barre de comparaison. Elle n'appartient à aucun concept : elle sert à
 *  passer de l'un à l'autre sans revenir à l'index. */
export function LabBar({ current }: { current?: "a" | "b" | "c" | "d" }) {
  return (
    <nav className="lab-bar" aria-label="Concepts">
      <Link href="/art-direction-lab">Visual reset v2</Link>
      {CONCEPTS.map((c) => (
        <Link
          key={c.id}
          href={c.href}
          aria-current={current === c.id ? "page" : undefined}
        >
          {c.code} · {c.nom}
        </Link>
      ))}
      <span className="lab-bar-sep">Interne, non publié</span>
    </nav>
  );
}
