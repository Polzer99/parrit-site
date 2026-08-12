import { redirect } from "next/navigation";

/** L'atelier s'ouvre sur les références : on regarde avant de juger. */
export default function BrandLabIndex() {
  redirect("/brand-lab/inspirations");
}
