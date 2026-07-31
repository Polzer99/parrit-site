import Link from "next/link";
import { CONCEPTS } from "./content";

/**
 * Index du laboratoire. Aucun concept n'est présenté comme gagnant : ni ordre
 * de préférence, ni recommandation, ni mise en avant. L'arbitrage appartient
 * à Paul.
 */
export default function LabIndex() {
  return (
    <div className="lab-index">
      <p className="mono">Parrit · laboratoire de direction artistique</p>
      <h1>Visual reset v2</h1>
      <p>
        Trois directions artistiques entièrement composées, portant exactement
        les mêmes faits business. Elles se différencient par la composition, le
        rôle de l&apos;image et le registre typographique, jamais par ce
        qu&apos;elles racontent. Aucune n&apos;est recommandée.
      </p>
      <p>
        Registre commun : display condensée Barlow Condensed pour l&apos;impact,
        Arpona pour la stature, Geist pour la lecture, Geist Mono pour les
        traces. Photographies réelles uniquement.
      </p>

      <ol>
        {CONCEPTS.map((c) => (
          <li key={c.id}>
            <Link href={c.href}>
              <span className="lab-index-code">{c.code}</span>
              <span>
                <span className="lab-index-name">{c.nom}</span>
                <span className="lab-index-resume">{c.resume}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
