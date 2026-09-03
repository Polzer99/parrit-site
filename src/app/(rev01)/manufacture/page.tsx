import type { Metadata } from "next";
import Link from "next/link";

import { getLocale } from "@/lib/server/locale";
import { K, RegistryLine } from "@/system/components";
import { localizedAlternates } from "@/system/locale";

const DICT = {
  en: {
    metaTitle: "The Manufacture", metaDescription: "How Parrit.ai designs and builds a company operating system: examination, construction, compounding. One company at a time, certified to the Parrit Standard.",
    kicker: "Parrit / The Manufacture", title: "Manufactured, not installed.", sub: "How a company operating system is actually built, and why it cannot be bought off the shelf.", doctrine: "The doctrine.", principleCount: "5 principles",
    principles: [
      ["One company at a time", "A system is built against how your company actually operates: its flows, its decisions, its exceptions. Not against how software vendors assume a company should work. Each commission is led hands-on by one of our partners, which is why we do not take every one."],
      ["Production before promises", "Construction targets one critical operation, rebuilt end-to-end and certified in production before anything else begins. A system that only exists in slides is not a system."],
      ["The executive decides, the system executes", "Only what requires the executive reaches the executive: framed, sourced, quantified. The decision then executes through the same system that surfaced it: traced, reversible, journaled."],
      ["Built in your perimeter", "The system is built in your accounts, on your infrastructure, under your keys from the first day, not at handover. Your data never lives on Parrit.ai’s servers, and our access ends the day you revoke it. Security is not a clause in a contract; it is where the system physically lives."],
      ["Owned, not rented", "Everything you receive is yours: code, data, documentation, handed over as company assets. The repository is yours from the first commit, and the system is built on ordinary, widely-adopted technology (TypeScript, Python, PostgreSQL), so any competent engineer can maintain it without us. Commissioned, not subscribed: if Parrit.ai disappears tomorrow, your system does not."],
    ],
    phasesTitle: "Three phases.", phasesKicker: "Examination → Construction → Compounding",
    phases: [["01", "Examination", "A diagnostic of flows, decisions and failure points, documented as an engineering brief. It fixes the scope, the first operation to rebuild, and the criteria of success before any commitment."], ["02", "Construction", "The first critical operation is rebuilt end-to-end on your infrastructure and certified to the Parrit Standard. It runs in production, with real users and real stakes, before anything else begins."], ["03", "Compounding", "Each new capability joins the operating system and increases the value of every previous one. The capabilities talk to each other: the one that detects hands over to the one that follows up. The system grows with the company, and the company keeps owning all of it."]],
    noteBefore: "Every phase ships against the", standard: "Parrit Standard", noteAfter: ". Six criteria, the same for every system we deliver.", close: "The Examination comes first. Commission it.", proof: "30 MIN · AN EXAMINATION, NOT A SALES CALL", button: "Let’s talk", status: "COMMISSIONED, NOT SUBSCRIBED", legal: "/Legal",
  },
  fr: {
    metaTitle: "La Manufacture", metaDescription: "Comment Parrit.ai conçoit et construit un système d'exploitation d'entreprise : examen, construction, capitalisation. Une entreprise à la fois, chaque système certifié selon le Standard Parrit.",
    kicker: "Parrit / La Manufacture", title: "Un système se fabrique. Il ne s'installe pas.", sub: "Comment se construit un système d'exploitation d'entreprise. Et pourquoi il ne s'achète pas sur étagère.", doctrine: "La doctrine.", principleCount: "5 principes",
    principles: [
      ["Une entreprise à la fois", "Un système se construit sur la réalité de votre entreprise : ses flux, ses décisions, ses exceptions. Pas sur l'idée que les éditeurs de logiciels se font d'une entreprise. Chaque commande est menée en personne par un associé. Nous en acceptons donc peu."],
      ["La production avant les promesses", "La Construction vise une opération critique, reconstruite de bout en bout et certifiée en production avant d'aller plus loin. Un système qui ne vit que dans une présentation n'est pas un système."],
      ["Le dirigeant décide, le système exécute", "Ne remonte au dirigeant que ce qui a besoin de lui : cadré, sourcé, chiffré. La décision s'exécute ensuite dans le système même qui l'a fait remonter, tracée et réversible, consignée au journal."],
      ["Construit chez vous", "Le système est construit dans vos comptes, sur votre infrastructure, avec vos clés. Dès le premier jour, pas à la livraison. Vos données ne passent jamais par les serveurs de Parrit.ai, et notre accès s'éteint le jour où vous le coupez. La sécurité n'est pas une clause de contrat : c'est là, physiquement, que le système tourne."],
      ["Votre propriété, pas une location", "Tout ce que vous recevez vous appartient : le code, les données, la documentation entrent au patrimoine de votre entreprise. Le dépôt de code est à vous dès la première ligne, et le système repose sur des technologies courantes et largement adoptées (TypeScript, Python, PostgreSQL) : n'importe quel ingénieur compétent peut le maintenir sans nous. Une commande, pas un abonnement : si Parrit.ai disparaît demain, votre système, lui, continue de tourner."],
    ],
    phasesTitle: "Trois phases.", phasesKicker: "Examen → Construction → Capitalisation",
    phases: [["01", "L'Examen", "Un diagnostic des flux, des décisions et des points de défaillance, consigné dans un cahier des charges d'ingénieur. Il fixe le périmètre, la première opération à reconstruire et les critères de réussite. Avant tout engagement."], ["02", "La Construction", "On reconstruit la première opération critique de bout en bout, sur votre infrastructure, et on la certifie selon le Standard Parrit. Elle tourne en production, avec de vrais utilisateurs et de vrais enjeux. Ensuite seulement, la suite."], ["03", "La Capitalisation", "Chaque nouvelle brique rejoint le système d'exploitation et augmente la valeur de toutes les précédentes. Les briques se parlent entre elles : celle qui détecte passe la main à celle qui relance. Le système grandit avec l'entreprise. L'entreprise, elle, reste propriétaire de tout."]],
    noteBefore: "Chaque phase répond au", standard: "Standard Parrit", noteAfter: ". Six critères, les mêmes pour chaque système que nous livrons.", close: "Tout commence par un Examen. Passez commande.", proof: "30 MIN · UN EXAMEN, PAS UN RENDEZ-VOUS COMMERCIAL", button: "Parlons-en", status: "UNE COMMANDE, PAS UN ABONNEMENT", legal: "/Mentions légales",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> { const copy = DICT[await getLocale()]; return { title: copy.metaTitle, description: copy.metaDescription, alternates: localizedAlternates("/manufacture") }; }

export default async function ManufacturePage() {
  const locale = await getLocale(); const copy = DICT[locale];
  return <main className="rev-page r2-dark"><div className="r2-wrap">
    <header className="r2-hero"><K>{copy.kicker}</K><h1>{copy.title}</h1><p className="r2-sub">{copy.sub}</p></header>
    <section className="r2-section" aria-labelledby="principles-heading"><div className="r2-shead"><h2 className="r2-ed" id="principles-heading">{copy.doctrine}</h2><K>{copy.principleCount}</K></div><div className="r2-faq">{copy.principles.map(([name, body]) => <div className="r2-qa" key={name}><div className="q">{name}</div><div className="a">{body}</div></div>)}</div></section>
    <section className="r2-section" aria-labelledby="phases-heading"><div className="r2-shead"><h2 className="r2-ed" id="phases-heading">{copy.phasesTitle}</h2><K>{copy.phasesKicker}</K></div><div className="r2-phases">{copy.phases.map(([no, name, body]) => <div className="r2-phase" key={no}><div className="no">{no}</div><div className="nm">{name}</div><div className="ds">{body}</div></div>)}</div><p className="r2-registre-note">{copy.noteBefore} <Link className="k" href="/standard">{copy.standard}</Link>{copy.noteAfter}</p></section>
    <section className="r2-close" aria-label={locale === "fr" ? "Commande" : "Commission"}><h2>{copy.close}</h2><p className="proof">{copy.proof}</p><Link className="rev-button exec" href="/commission">{copy.button}</Link></section>
    <footer className="r2-footer"><RegistryLine value="PARRIT / MANUFACTURE · REV 01 · 2026" /><K>{copy.status}</K><Link className="k" href="/legal">{copy.legal}</Link><K>© 2026 Parrit.ai</K></footer>
  </div></main>;
}
