import type { Metadata } from "next";
import Link from "next/link";

import { getLocale } from "@/lib/server/locale";
import { DecisionCard, Instrument, K, Opening, QuickCapture, RegisterInterest, RegistryLine, St } from "@/system/components";
import { getAllJournalEntrySummaries } from "@/system/journal";
import { localizedAlternates, type Locale } from "@/system/locale";

const DICT = {
  en: {
    metaTitle: "Parrit · Company Operating Systems",
    metaDescription: "Parrit examines how a company operates, builds its first production system and compounds it as owned infrastructure.",
    hero: { kicker: "Parrit / Company operating systems", before: "The system your company", frame: "operates", after: "on.", sub: "One place to understand what is happening, decide what matters, and act. Designed and built for one company at a time.", primary: "Let’s talk", secondary: "Examine the Standard" },
    instrument: {
      aria: "Operating system instrument", day: "Tue 09:14",
      rows: [["3", "decisions require the executive this morning", "Today"], ["€1.2M", "at risk on blocked orders, framed, sourced, quantified", "Action required"], ["7", "actions executed overnight, each one journaled and reversible", "Journal"]],
      captions: ["EVERYTHING BELOW THIS SCREEN RUNS THE COMPANY. ONLY DECISIONS REACH YOU.", "AN ILLUSTRATIVE SCENARIO. MEASURED CLIENT FIGURES LIVE IN THE DOSSIERS BELOW."],
    },
    metrics: [["3", "operating systems in construction or production, including our own"], ["1", "company at a time. Every system is built against how it actually operates"], ["100%", "of delivered systems owned by the client: code, data, documentation"]],
    iface: {
      title: "The interface.", kicker: "What the executive actually sees", phoneAria: "Parrit OS on a phone", scenario: "SCENARIO · 09:14", systemToday: "System · Today",
      first: "Morning. Three decisions need you. Everything else was handled overnight. First:", cardTitle: "Release the blocked order", cardBody: "€480K waiting on one signature. Client cleared, stock reserved, margin verified.", cardAction: "Hold to release", cardDone: "Released", journal: "07:12 · 7 actions executed · journal updated", user: "What changed on the Milan account?", second: "Payment settled yesterday, two orders moved to production. Nothing needs you there.",
      points: [["Conversational by design", "You talk to your company.", "The interface converges toward conversation: you ask, the system answers with framed decisions. Not dashboards to interpret."], ["One card, one action", "Decisions arrive as cards.", "Framed, sourced, quantified. Hold to commit; executed through the same system, journaled, reversible. Try the card on the left: it is the real component."], ["Down to your phone", "The whole company, in your pocket.", "The same operating system runs from the workshop floor to your phone, one place to understand, decide and act."]],
    },
    dossiersTitle: "Sealed dossiers.", dossiersKicker: "Systems delivered · Verified in call",
    dossiers: [
      { ref: "DOSSIER 26-001", sector: "PARRIT ITSELF", title: "The system we sell is the system we run.", body: "Parrit operates on its own operating system: one place where signals, clients and campaigns become decisions, delivered to the founder’s phone as cards. Built for ourselves first, compounding since.", value: "200+", result: "signals become decisions, every week", seal: "In production · Compounding" },
      { ref: "DOSSIER 26-002", sector: "A LAW FIRM", title: "An operating system for a law firm.", body: "Client intake, follow-ups and case flow, rebuilt as one system on the firm’s own infrastructure. First capabilities certified and live; the system grows case by case.", value: "+€5\u201310K", result: "additional revenue per month, from re-engaged case flow", seal: "Under construction · First capabilities live" },
      { ref: "DOSSIER 26-003", sector: "A CONSUMER BRAND", title: "Reporting nobody writes.", body: "The reporting assembles itself from source systems and ships on schedule. It is run today by the client’s own team, without us. Owned, documented, handed over.", value: "2.5 months", result: "recovered on a single reporting process", seal: "Delivered · Operated by the client" },
    ],
    dossierNote: "Also among the dossiers: a CRM an agency never touches by hand, outbound infrastructure end-to-end, and systems commissioned by maisons in cosmetics and craft retail. Figures are measured in the client’s own systems and verified live, on screen, during the examination call. The dossiers, and references with the client’s consent, open in conversation, not on a website.",
    standard: { title: "Certified to the Standard.", header: "THE PARRIT STANDARD · EVERY SYSTEM, SAME SPECIFICATION", count: "6 criteria", practice: "In practice", link: "Read the full Standard", rows: [["PS-01", "Observable", "The operator reads the state of dossier 26-001 at any moment: no meeting, no export, no asking anyone."], ["PS-03", "Traceable", "Every decision carries author, timestamp, source and rationale. The journal is the audit."], ["PS-05", "Owned", "Code, data and documentation are handed over as company assets. Parrit keeps nothing you depend on."]] },
    manufacture: { title: "The Manufacture.", kicker: "How a system is built", intro: "A company operating system is not installed. It is manufactured on your flows, your decisions, your exceptions.", col1: "We work one company at a time. The system is built against how your company actually operates, not how software vendors assume it should.", col2: "Everything ships against the Standard, and everything you receive is yours: commissioned, not subscribed.", phases: [["01", "Examination", "A diagnostic of flows, decisions and failure points: an engineering brief, not a workshop."], ["02", "Construction", "One critical operation rebuilt end-to-end and certified before anything else begins."], ["03", "Compounding", "Each capability joins the system. The value of every previous one increases."]] },
    faqTitle: "Before you commission.", faqKicker: "The questions executives ask",
    faq: [
      ["Who is Parrit?", "An independent French maison, founded by Paul Larmaraud and steered by its partners, with twenty engineers and operators around the project. A registered company whose full legal identity is one click away, under /Legal. Deliberately small at the core: we take few commissions, and a partner personally builds each one. The Journal is where our thinking is public."],
      ["What do we own at the end?", "Everything, from the start. The repository is yours from the first commit; the system runs in your accounts, on your infrastructure, under your keys. It is built on ordinary, widely-adopted technology (TypeScript, Python, PostgreSQL), so any competent engineer can maintain it without us. That is the mechanism behind PS-05, not a promise: if Parrit disappears tomorrow, your system does not notice."],
      ["Where does our data live?", "In your perimeter. Parrit builds inside your own accounts and infrastructure from day one. Your data never lives on Parrit’s servers, and our access ends the day you revoke it. GDPR posture follows from that: nothing changes hands to lose."],
      ["Who maintains it after delivery?", "We do. There is maintenance. A living system is never finished, and we carry what we deliver: every commission includes maintenance and evolution, so the system keeps running and keeps growing. You still own everything, and because it is built on ordinary technology you can take it over with your own team whenever you choose, like the consumer brand in dossier 26-003. Maintenance is an explicit term of the commission, priced on its own, not a subscription in disguise: stop it whenever you want, the system stays yours and keeps running."],
      ["How much does it ask of my team?", "Less than a software project, more than a subscription. The Examination asks for a few hours of conversation with the people who actually run the operation. During Construction, your team keeps working as it always has. We build around the real flow, not in a workshop. Using the finished system requires no training: if a card needs a manual, we have failed."],
      ["Where do you operate?", "From France and internationally. Based in Lille, registered office near Paris. Commissions run in English and in French, for European and African companies alike. The system is built remotely, inside your own infrastructure; the examination is a video call, wherever you are."],
      ["How long before the first system runs?", "Construction targets one critical operation, in production and certified, typically in weeks, not quarters. The Examination fixes the scope before any commitment."],
      ["What if it doesn’t hold?", "Every critical process ships with a documented path of return (PS-04). Nothing enters production without a way back out."],
    ],
    journal: { title: "From the journal.", kicker: "How we actually think", note: "Field notes on the systems we examine, build and operate, published under our own names, dated, and occasionally wrong in public.", link: "Read the journal" },
    registerTitle: "Or start smaller.", registerKicker: "A prototype before a commission",
    close: "One conversation. Your operating system, examined.", proof: "30 MIN · AN EXAMINATION, NOT A SALES CALL · FIGURES FROM THE DOSSIERS VERIFIED LIVE", footerFounder: "FOUNDED BY PAUL LARMARAUD", footerStatus: "COMMISSIONED, NOT SUBSCRIBED", legal: "/Legal",
  },
  fr: {
    metaTitle: "Parrit · Le système qui fait tourner votre entreprise",
    metaDescription: "Parrit conçoit et construit des systèmes d'exploitation d'entreprise : un seul système pour comprendre, décider et agir. Une entreprise à la fois. Une commande, pas un abonnement.",
    hero: { kicker: "Parrit / Systèmes d'exploitation d'entreprise", before: "Le système qui fait tourner votre", frame: "entreprise.", after: "", sub: "Un seul endroit pour voir ce qui se passe, décider ce qui compte, et agir. Conçu et construit pour une entreprise à la fois.", primary: "Parlons-en", secondary: "Examiner le Standard" },
    instrument: {
      aria: "Instrument du système d'exploitation", day: "Mar 09:14",
      rows: [["3", "décisions attendent le dirigeant ce matin", "Aujourd'hui"], ["1,2 M€", "en jeu sur des commandes bloquées. Dossier complet, prêt à trancher", "Décision attendue"], ["7", "actions exécutées cette nuit, toutes consignées au journal, toutes réversibles", "Journal"]],
      captions: ["SOUS CET ÉCRAN, TOUT TOURNE. SEULES LES DÉCISIONS REMONTENT JUSQU'À VOUS.", "SCÉNARIO ILLUSTRATIF. LES CHIFFRES RÉELS, MESURÉS CHEZ NOS CLIENTS, SONT DANS LES DOSSIERS CI-DESSOUS."],
    },
    metrics: [["3", "systèmes d'exploitation en construction ou en production, dont le nôtre"], ["1", "entreprise à la fois. Chaque système se construit sur son fonctionnement réel"], ["100 %", "des systèmes livrés appartiennent au client : code, données, documentation"]],
    iface: {
      title: "L'interface.", kicker: "Ce que le dirigeant voit vraiment", phoneAria: "Parrit OS sur un téléphone", scenario: "SCÉNARIO · 09:14", systemToday: "Système · Aujourd'hui",
      first: "Bonjour. Trois décisions vous attendent. Tout le reste a été traité cette nuit. La première :", cardTitle: "Débloquer la commande", cardBody: "480 K€ suspendus à une signature. Client validé, stock réservé, marge vérifiée.", cardAction: "Appui long pour débloquer", cardDone: "Débloquée", journal: "07:12 · 7 actions exécutées · journal à jour", user: "Du nouveau sur le compte Milan ?", second: "Paiement encaissé hier, deux commandes parties en production. Rien qui ait besoin de vous.",
      points: [["La conversation comme interface", "Vous parlez à votre entreprise.", "L'interface, c'est la conversation : vous demandez, le système répond par des décisions cadrées. Pas des tableaux de bord à interpréter."], ["Une carte, une action", "Chaque décision tient sur une carte.", "Cadrée, sourcée, chiffrée. Un appui long pour valider ; l'action s'exécute dans le même système, consignée au journal, réversible. Essayez la carte ci-contre : c'est le vrai composant."], ["Jusqu'à votre téléphone", "Toute l'entreprise, dans votre poche.", "Le même système d'exploitation tourne de l'atelier à votre téléphone. Un seul endroit pour comprendre, décider, agir."]],
    },
    dossiersTitle: "Dossiers scellés.", dossiersKicker: "Systèmes livrés · Vérifiés en direct",
    dossiers: [
      { ref: "DOSSIER 26-001", sector: "PARRIT", title: "Nous vendons le système qui nous fait tourner.", body: "Parrit tourne sur son propre système d'exploitation : un seul endroit où les signaux, les clients et les campagnes deviennent des décisions, qui arrivent en cartes sur le téléphone du fondateur. Construit pour nous d'abord. Depuis, la valeur s'accumule.", value: "200+", result: "signaux deviennent des décisions chaque semaine", seal: "En production · La valeur s'accumule" },
      { ref: "DOSSIER 26-002", sector: "UN CABINET D'AVOCATS", title: "Un système d'exploitation pour un cabinet d'avocats.", body: "L'arrivée des nouveaux clients, les relances et la circulation des dossiers, refondues en un seul système sur l'infrastructure du cabinet. Les premières briques sont certifiées et en service. Le système grandit dossier après dossier.", value: "+5 à 10 K€", result: "de chiffre d'affaires en plus chaque mois, sur des dossiers relancés", seal: "En construction · Premières briques en service" },
      { ref: "DOSSIER 26-003", sector: "UNE MARQUE GRAND PUBLIC", title: "Le reporting que personne ne rédige.", body: "Le reporting s'assemble seul à partir des systèmes sources et part à l'heure. L'équipe du client le fait tourner aujourd'hui, sans nous. Documenté, transmis. À eux.", value: "2,5 mois", result: "gagnés sur un seul processus de reporting", seal: "Livré · Aux mains du client" },
    ],
    dossierNote: "Les dossiers contiennent aussi : un CRM qu'une agence ne touche jamais à la main, une infrastructure de prospection de bout en bout, des systèmes commandés par des marques de cosmétique et de commerce artisanal. Les chiffres sont mesurés dans les systèmes du client, pas dans les nôtres, et vérifiés en direct, à l'écran, pendant l'examen. Les dossiers, et des références avec l'accord du client, s'ouvrent de vive voix. Pas sur un site.",
    standard: { title: "Certifié selon le Standard.", header: "LE STANDARD PARRIT · CHAQUE SYSTÈME, MÊME SPÉCIFICATION", count: "6 critères", practice: "En pratique", link: "Lire le Standard complet", rows: [["PS-01", "Observable", "L'opérateur lit l'état d'un dossier en cours à tout moment : pas de réunion, pas d'export, personne à interroger."], ["PS-03", "Traçable", "Le journal consigne l'auteur, l'heure, la source et le motif de chaque décision. Le journal est l'audit."], ["PS-05", "Propriété du client", "Le code, les données et la documentation entrent au patrimoine de l'entreprise. L'équipe du client fait tourner le système sans nous."]] },
    manufacture: { title: "La Manufacture.", kicker: "Comment un système se construit", intro: "Un système d'exploitation d'entreprise ne s'installe pas. Il se fabrique à partir de vos flux, de vos décisions, de vos exceptions.", col1: "Nous travaillons pour une entreprise à la fois. Le système épouse la façon dont la vôtre fonctionne réellement, pas celle que les éditeurs de logiciels lui prêtent.", col2: "Tout est livré selon le Standard, et tout ce que vous recevez vous appartient. Une commande, pas un abonnement.", phases: [["01", "L'Examen", "Un diagnostic des flux, des décisions et des points de rupture. Un cahier des charges d'ingénieur, pas un atelier."], ["02", "La Construction", "Une opération critique, reconstruite de bout en bout et certifiée avant toute autre chose."], ["03", "La Capitalisation", "Chaque brique rejoint le système. La valeur de toutes les précédentes augmente."]] },
    faqTitle: "Avant de passer commande.", faqKicker: "Les questions que posent les dirigeants",
    faq: [
      ["Qui est Parrit ?", "Une maison française indépendante, fondée par Paul Larmaraud et menée par ses associés, avec vingt ingénieurs et opérateurs autour du projet. Une société immatriculée, dont l'identité légale complète est à un clic, sous Mentions légales. Volontairement resserrée : nous acceptons peu de commandes, et un associé construit chacune en personne. Notre réflexion est publique : elle se lit dans le Journal."],
      ["Qu'est-ce qui nous appartient à la fin ?", "Tout, dès le départ. Le dépôt de code est à vous dès la première ligne ; le système tourne dans vos comptes, sur votre infrastructure, avec vos clés. Il repose sur des technologies ordinaires et largement répandues (TypeScript, Python, PostgreSQL) : n'importe quel ingénieur compétent peut le maintenir sans nous. C'est ce qui garantit PS-05. Un mécanisme, pas une promesse. Si Parrit disparaît demain, votre système ne s'en aperçoit pas."],
      ["Où vivent nos données ?", "Chez vous. Parrit construit dans vos comptes et sur votre infrastructure dès le premier jour. Vos données ne passent jamais par les serveurs de Parrit, et notre accès s'arrête le jour où vous le coupez. La conformité RGPD en découle : rien ne change de mains, rien ne peut se perdre."],
      ["Qui maintient le système après la livraison ?", "Nous. La maintenance existe. Un système vivant n'est jamais terminé, et nous portons ce que nous livrons : chaque commande prévoit la maintenance et l'évolution, pour que le système continue de tourner et de grandir. Vous restez propriétaire de tout. Et parce qu'il repose sur des technologies ordinaires, votre équipe peut le reprendre quand vous le décidez, comme la marque grand public du dossier 26-003. La maintenance est une clause explicite de la commande, chiffrée à part. Pas un abonnement déguisé : vous l'arrêtez quand vous voulez, le système reste à vous et continue de tourner."],
      ["Qu'est-ce que cela demande à mon équipe ?", "Moins qu'un projet informatique, plus qu'un abonnement. L'Examen demande quelques heures de conversation avec les personnes qui font tourner l'opération au quotidien. Pendant la Construction, votre équipe travaille comme avant. Nous construisons autour du flux réel, pas en atelier. Utiliser le système fini ne demande aucune formation : si une carte a besoin d'un manuel, nous avons échoué."],
      ["D'où travaillez-vous ?", "Depuis la France et à l'international. Installés à Lille, siège social près de Paris. Les commandes se mènent en français et en anglais, pour des entreprises européennes comme africaines. Le système se construit à distance, dans votre propre infrastructure ; l'examen est une visio, où que vous soyez."],
      ["Combien de temps avant que le premier système tourne ?", "La Construction vise une opération critique, en production et certifiée, en quelques semaines le plus souvent. Pas un chantier au long cours. L'Examen fixe le périmètre avant tout engagement."],
      ["Et si ça ne tient pas ?", "Chaque processus critique est livré avec sa procédure de retour arrière, documentée (PS-04). Rien n'entre en production sans porte de sortie."],
    ],
    journal: { title: "Extraits du journal.", kicker: "Comment nous pensons vraiment", note: "Des notes de terrain sur les systèmes que nous examinons, construisons et faisons tourner. Publiées sous nos noms, datées. Et quand nous nous trompons, ça se voit.", link: "Lire le journal" },
    registerTitle: "Ou commencez par un prototype.", registerKicker: "L'entrée par le prototype",
    close: "Une conversation. Votre système d'exploitation, examiné.", proof: "30 MIN · UN EXAMEN, PAS UN RENDEZ-VOUS COMMERCIAL · LES CHIFFRES DES DOSSIERS VÉRIFIÉS EN DIRECT", footerFounder: "FONDÉE PAR PAUL LARMARAUD", footerStatus: "UNE COMMANDE, PAS UN ABONNEMENT", legal: "/Mentions légales",
  },
} as const satisfies Record<Locale, object>;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const copy = DICT[locale];
  return { title: { absolute: copy.metaTitle }, description: copy.metaDescription, alternates: localizedAlternates("/") };
}

export default async function HomePage() {
  const locale = await getLocale();
  const copy = DICT[locale];
  const journal = getAllJournalEntrySummaries().slice(0, 3);
  return (
    <>
      <Opening locale={locale} />
      <main className="rev-page r2-dark">
        <div className="r2-wrap">
          <header className="r2-hero">
            <K>{copy.hero.kicker}</K>
            <h1>{copy.hero.before} <span className="frame">{copy.hero.frame}<i className="fx" aria-hidden="true" /></span>{copy.hero.after ? <> {copy.hero.after}</> : null}</h1>
            <p className="r2-sub">{copy.hero.sub}</p>
            <div className="rev-actions"><Link className="rev-button exec" href="/commission">{copy.hero.primary}</Link><Link className="rev-button ghost" href="/standard">{copy.hero.secondary}</Link></div>
          </header>
          <section className="r2-instrument-stage" aria-label={copy.instrument.aria}>
            <Instrument className="home-instrument" left={<St kind="crit">PARRIT / OS · LIVE</St>} center={<K className="instrument-sep">·</K>} right={<K>{copy.instrument.day}</K>} rows={copy.instrument.rows.map(([value, label, status], index) => ({ value, label, status: <K style={index === 1 ? { color: "var(--red)" } : undefined}>{status}</K>, critical: index === 1 }))} />
            <div className="r2-instrument-caption">{copy.instrument.captions.map((caption) => <K key={caption}>{caption}</K>)}</div>
          </section>
        </div>
        <div className="r2-metrics"><div className="r2-metrics-in">{copy.metrics.map(([value, label]) => <div className="r2-metric" key={value}><div className="v">{value}</div><div className="l">{label}</div></div>)}</div></div>
        <QuickCapture locale={locale} />
        <div className="r2-wrap">
          <section className="r2-section" aria-labelledby="iface-heading">
            <div className="r2-shead"><h2 className="r2-ed" id="iface-heading">{copy.iface.title}</h2><K>{copy.iface.kicker}</K></div>
            <div className="r2-iface">
              <div className="r2-phone" data-phone-mockup="true" aria-label={copy.iface.phoneAria}><div className="r2-phone-notch" aria-hidden="true" /><div className="r2-phone-bar"><K>PARRIT / OS</K><K>{copy.iface.scenario}</K></div><div className="r2-thread"><div className="r2-msg sys"><K>{copy.iface.systemToday}</K>{copy.iface.first}</div><DecisionCard title={copy.iface.cardTitle} body={copy.iface.cardBody} action={copy.iface.cardAction} doneLabel={copy.iface.cardDone} status="att" /><div className="r2-journal-line">{copy.iface.journal}</div><div className="r2-msg usr">{copy.iface.user}</div><div className="r2-msg sys">{copy.iface.second}</div></div></div>
              <div className="r2-iface-points">{copy.iface.points.map(([kicker, title, body]) => <div className="r2-iface-point" key={title}><K>{kicker}</K><h3>{title}</h3><p>{body}</p></div>)}</div>
            </div>
          </section>
          <section className="r2-section" aria-labelledby="dossiers-heading"><div className="r2-shead"><h2 className="r2-ed" id="dossiers-heading">{copy.dossiersTitle}</h2><K>{copy.dossiersKicker}</K></div><div className="r2-dossiers">{copy.dossiers.map((dossier) => <article className="r2-dossier" key={dossier.ref}><div className="ref"><K>{dossier.ref}</K><K>{dossier.sector}</K></div><h3>{dossier.title}</h3><p>{dossier.body}</p><div className="res"><div className="v">{dossier.value}</div><div className="l">{dossier.result}</div></div><div className="seal">{dossier.seal}</div></article>)}</div><p className="r2-registre-note">{copy.dossierNote}</p></section>
        </div>
        <div className="r2-ecrin"><div className="r2-ecrin-in"><div className="r2-shead"><h2 className="r2-ed">{copy.standard.title}</h2><K>STD-1.0 · 2026</K></div><div className="r2-std"><div className="r2-std-head"><K>{copy.standard.header}</K><K>{copy.standard.count}</K></div>{copy.standard.rows.map(([ps, name, example]) => <div className="r2-std-row" key={ps}><div className="ps">{ps}</div><div className="name">{name}</div><div className="ex"><b>{copy.standard.practice}</b>{example}</div></div>)}</div><p style={{ marginTop: "18px" }}><Link className="k" href="/standard">{copy.standard.link}</Link></p></div></div>
        <div className="r2-wrap">
          <section className="r2-section" aria-labelledby="manufacture-heading"><div className="r2-shead"><h2 className="r2-ed" id="manufacture-heading">{copy.manufacture.title}</h2><K>{copy.manufacture.kicker}</K></div><div className="r2-manu"><p className="r2-manu-lede">{copy.manufacture.intro}</p><div className="r2-manu-cols"><p>{copy.manufacture.col1}</p><p>{copy.manufacture.col2}</p><div className="r2-phases">{copy.manufacture.phases.map(([no, name, body]) => <div className="r2-phase" key={no}><div className="no">{no}</div><div className="nm">{name}</div><div className="ds">{body}</div></div>)}</div></div></div></section>
          <section className="r2-section" aria-labelledby="faq-heading"><div className="r2-shead"><h2 className="r2-ed" id="faq-heading">{copy.faqTitle}</h2><K>{copy.faqKicker}</K></div><div className="r2-faq">{copy.faq.map(([question, answer]) => <div className="r2-qa" key={question}><div className="q">{question}</div><div className="a">{answer}</div></div>)}</div></section>
          <section className="r2-section" aria-labelledby="journal-heading"><div className="r2-shead"><h2 className="r2-ed" id="journal-heading">{copy.journal.title}</h2><K>{copy.journal.kicker}</K></div><div className="r2-jrnl">{journal.map((entry) => <Link className="r2-jrnl-row" href={`/journal/${entry.slug}`} key={entry.slug}><div className="no">{entry.date}</div><div className="nm">{entry.title}</div><div className="ds">{entry.description}</div></Link>)}</div><p className="r2-registre-note">{copy.journal.note}{" "}<Link className="k" href="/journal">{copy.journal.link}</Link></p></section>
          <section className="r2-section" aria-labelledby="register-heading"><div className="r2-shead"><h2 className="r2-ed" id="register-heading">{copy.registerTitle}</h2><K>{copy.registerKicker}</K></div><RegisterInterest source="site:home" locale={locale} /></section>
          <section className="r2-close" aria-label={locale === "fr" ? "Commande" : "Commission"}><h2>{copy.close}</h2><p className="proof">{copy.proof}</p><Link className="rev-button exec" href="/commission">{copy.hero.primary}</Link></section>
          <footer className="r2-footer"><RegistryLine /><a className="k" href="https://paul-larmaraud.com" target="_blank" rel="noopener noreferrer">{copy.footerFounder}</a><K>{copy.footerStatus}</K><Link className="k" href="/legal">{copy.legal}</Link><K>© 2026 Parrit.ai</K></footer>
        </div>
      </main>
    </>
  );
}
