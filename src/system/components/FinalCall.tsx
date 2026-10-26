import Link from "next/link";
import type { ReactNode } from "react";
import { localizedPath, type Locale } from "@/system/locale";

export function FinalCall({ locale, title, children, id, className = "" }: { locale: Locale; title?: string; children?: ReactNode; id?: string; className?: string }) {
  return <section id={id} className={`final-call ${className}`}><h2>{title ?? (locale === "fr" ? "Parlons de l'opération que vous voulez transformer." : "Let's talk about the operation you want to transform.")}</h2>{children}<Link className="rev-button exec" href={localizedPath("/commission", locale)}>{locale === "fr" ? "Parler d'un projet" : "Talk about a project"}</Link></section>;
}
