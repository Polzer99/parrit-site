import type { Metadata } from "next";
import Link from "next/link";

import { DecisionCard, Instrument, K, Opening, RegisterInterest, RegistryLine, St } from "@/system/components";
import { getAllJournalEntrySummaries } from "@/system/journal";

export const metadata: Metadata = {
  title: { absolute: "Parrit — Company Operating Systems" },
  alternates: { canonical: "/" },
};

const DOSSIERS = [
  {
    ref: "DOSSIER 26-001",
    sector: "PARRIT ITSELF",
    title: "The system we sell is the system we run.",
    body: "Parrit operates on its own operating system: one place where signals, clients and campaigns become decisions — delivered to the founder’s phone as cards. Built for ourselves first, compounding since.",
    value: "200+",
    result: "signals become decisions, every week",
    seal: "In production · Compounding",
  },
  {
    ref: "DOSSIER 26-002",
    sector: "A LAW FIRM",
    title: "An operating system for a law firm.",
    body: "Client intake, follow-ups and case flow — rebuilt as one system, on the firm’s own infrastructure. First capabilities certified and live; the system grows case by case.",
    value: "+€5–10K",
    result: "additional revenue per month, from re-engaged case flow",
    seal: "Under construction · First capabilities live",
  },
  {
    ref: "DOSSIER 26-003",
    sector: "A CONSUMER BRAND",
    title: "Reporting nobody writes.",
    body: "The reporting assembles itself from source systems and ships on schedule — run today by the client’s own team, without us. Owned, documented, handed over.",
    value: "2.5 months",
    result: "recovered on a single reporting process",
    seal: "Delivered · Operated by the client",
  },
] as const;

const STANDARD_EXCERPT = [
  {
    ps: "PS-01",
    name: "Observable",
    example:
      "The operator reads the state of dossier 26-001 at any moment — no meeting, no export, no asking anyone.",
  },
  {
    ps: "PS-03",
    name: "Traceable",
    example:
      "Every decision carries author, timestamp, source and rationale. The journal is the audit.",
  },
  {
    ps: "PS-05",
    name: "Owned",
    example:
      "Code, data and documentation are handed over as company assets. Parrit keeps nothing you depend on.",
  },
] as const;

const PHASES = [
  {
    no: "01",
    name: "Examination",
    body: "A diagnostic of flows, decisions and failure points — an engineering brief, not a workshop.",
  },
  {
    no: "02",
    name: "Construction",
    body: "One critical operation rebuilt end-to-end and certified before anything else begins.",
  },
  {
    no: "03",
    name: "Compounding",
    body: "Each capability joins the system. The value of every previous one increases.",
  },
] as const;

const FAQ = [
  {
    q: "Who is Parrit?",
    a: "An independent French maison, founded by Paul Larmaraud and steered by its partners — twenty engineers and operators around the project. A registered company whose full legal identity is one click away, under /Legal. Deliberately small at the core: we take few commissions, and a partner personally builds each one. The Journal is where our thinking is public.",
  },
  {
    q: "What do we own at the end?",
    a: "Everything, from the start. The repository is yours from the first commit; the system runs in your accounts, on your infrastructure, under your keys. It is built on ordinary, widely-adopted technology (TypeScript, Python, PostgreSQL), so any competent engineer can maintain it without us. That is the mechanism behind PS-05, not a promise: if Parrit disappears tomorrow, your system does not notice.",
  },
  {
    q: "Where does our data live?",
    a: "In your perimeter. Parrit builds inside your own accounts and infrastructure from day one — your data never lives on Parrit’s servers, and our access ends the day you revoke it. GDPR posture follows from that: nothing changes hands to lose.",
  },
  {
    q: "Who maintains it after delivery?",
    a: "We do. There is maintenance. A living system is never finished, and we carry what we deliver: every commission includes maintenance and evolution, so the system keeps running and keeps growing. You still own everything, and because it is built on ordinary technology you can take it over with your own team whenever you choose, like the consumer brand in dossier 26-003. Maintenance is an explicit term of the commission, priced on its own — not a subscription in disguise: stop it whenever you want, the system stays yours and keeps running.",
  },
  {
    q: "How much does it ask of my team?",
    a: "Less than a software project, more than a subscription. The Examination asks for a few hours of conversation with the people who actually run the operation. During Construction, your team keeps working as it always has — we build around the real flow, not in a workshop. Using the finished system requires no training: if a card needs a manual, we have failed.",
  },
  {
    q: "Where do you operate?",
    a: "From France, based in Lille with the registered office near Paris, and internationally. Commissions run in English and in French, for European and African companies alike. The system is built remotely, inside your own infrastructure; the examination is a video call, wherever you are.",
  },
  {
    q: "How long before the first system runs?",
    a: "Construction targets one critical operation, in production and certified — typically weeks, not quarters. The Examination fixes the scope before any commitment.",
  },
  {
    q: "What if it doesn’t hold?",
    a: "Every critical process ships with a documented path of return (PS-04). Nothing enters production without a way back out.",
  },
] as const;

export default function HomePage() {
  const journal = getAllJournalEntrySummaries().slice(0, 3);
  return (
    <>
      <Opening />
      <main className="rev-page r2-dark">
        <div className="r2-wrap">
          <header className="r2-hero">
            <K>Parrit / Company operating systems</K>
            <h1>
              The system your company{" "}
              <span className="frame">
                operates
                <i className="fx" aria-hidden="true" />
              </span>{" "}
              on.
            </h1>
            <p className="r2-sub">
              One place to understand what is happening, decide what matters, and act.
              Designed and built for one company at a time.
            </p>
            <div className="rev-actions">
              <Link className="rev-button exec" href="/commission">
                Let’s talk
              </Link>
              <Link className="rev-button ghost" href="/standard">
                Examine the Standard
              </Link>
            </div>
          </header>

          <section className="r2-instrument-stage" aria-label="Operating system instrument">
            <Instrument
              className="home-instrument"
              left={<St kind="crit">PARRIT / OS — LIVE</St>}
              center={<K>·</K>}
              right={<K>Tue 09:14</K>}
              rows={[
                {
                  value: "3",
                  label: "decisions require the executive this morning",
                  status: <K>Today</K>,
                },
                {
                  value: "€1.2M",
                  label: "at risk on blocked orders — framed, sourced, quantified",
                  status: <K style={{ color: "var(--red)" }}>Action required</K>,
                  critical: true,
                },
                {
                  value: "7",
                  label: "actions executed overnight, each one journaled and reversible",
                  status: <K>Journal</K>,
                },
              ]}
            />
            <div className="r2-instrument-caption">
              <K>EVERYTHING BELOW THIS SCREEN RUNS THE COMPANY. ONLY DECISIONS REACH YOU.</K>
              <K>AN ILLUSTRATIVE SCENARIO — MEASURED CLIENT FIGURES LIVE IN THE DOSSIERS BELOW.</K>
            </div>
          </section>
        </div>

        <div className="r2-metrics">
          <div className="r2-metrics-in">
            <div className="r2-metric">
              <div className="v">3</div>
              <div className="l">operating systems in construction or production — including our own</div>
            </div>
            <div className="r2-metric">
              <div className="v">1</div>
              <div className="l">company at a time. Every system is built against how it actually operates</div>
            </div>
            <div className="r2-metric">
              <div className="v">100%</div>
              <div className="l">of delivered systems owned by the client — code, data, documentation</div>
            </div>
          </div>
        </div>

        <div className="r2-wrap">
          <section className="r2-section" aria-labelledby="iface-heading">
            <div className="r2-shead">
              <h2 className="r2-ed" id="iface-heading">
                The interface.
              </h2>
              <K>What the executive actually sees</K>
            </div>
            <div className="r2-iface">
              <div className="r2-phone" data-phone-mockup="true" aria-label="Parrit OS on a phone">
                <div className="r2-phone-notch" aria-hidden="true" />
                <div className="r2-phone-bar">
                  <K>PARRIT / OS</K>
                  <K>SCENARIO · 09:14</K>
                </div>
                <div className="r2-thread">
                  <div className="r2-msg sys">
                    <K>System · Today</K>
                    Morning. Three decisions need you. Everything else was handled overnight.
                    First:
                  </div>
                  <DecisionCard
                    title="Release the blocked order"
                    body="€480K waiting on one signature. Client cleared, stock reserved, margin verified."
                    action="Hold to release"
                    doneLabel="Released"
                    status="att"
                  />
                  <div className="r2-journal-line">07:12 · 7 actions executed · journal updated</div>
                  <div className="r2-msg usr">What changed on the Milan account?</div>
                  <div className="r2-msg sys">
                    Payment settled yesterday, two orders moved to production. Nothing needs
                    you there.
                  </div>
                </div>
              </div>
              <div className="r2-iface-points">
                <div className="r2-iface-point">
                  <K>Conversational by design</K>
                  <h3>You talk to your company.</h3>
                  <p>
                    The interface converges toward conversation: you ask, the system answers
                    with framed decisions. Not dashboards to interpret.
                  </p>
                </div>
                <div className="r2-iface-point">
                  <K>One card, one action</K>
                  <h3>Decisions arrive as cards.</h3>
                  <p>
                    Framed, sourced, quantified. Hold to commit — executed through the same
                    system, journaled, reversible. Try the card on the left: it is the real
                    component.
                  </p>
                </div>
                <div className="r2-iface-point">
                  <K>Down to your phone</K>
                  <h3>The whole company, in your pocket.</h3>
                  <p>
                    The same operating system runs from the workshop floor to your phone —
                    one place to understand, decide and act.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="r2-section" aria-labelledby="dossiers-heading">
            <div className="r2-shead">
              <h2 className="r2-ed" id="dossiers-heading">
                Sealed dossiers.
              </h2>
              <K>Systems delivered · Verified in call</K>
            </div>
            <div className="r2-dossiers">
              {DOSSIERS.map((dossier) => (
                <article className="r2-dossier" key={dossier.ref}>
                  <div className="ref">
                    <K>{dossier.ref}</K>
                    <K>{dossier.sector}</K>
                  </div>
                  <h3>{dossier.title}</h3>
                  <p>{dossier.body}</p>
                  <div className="res">
                    <div className="v">{dossier.value}</div>
                    <div className="l">{dossier.result}</div>
                  </div>
                  <div className="seal">{dossier.seal}</div>
                </article>
              ))}
            </div>
            <p className="r2-registre-note">
              Also among the dossiers: a CRM an agency never touches by hand, outbound
              infrastructure end-to-end, and systems commissioned by maisons in cosmetics and
              craft retail. Figures are measured in the client’s own systems and verified
              live, on screen, during the examination call. The dossiers, and references
              with the client’s consent, open in conversation — not on a website.
            </p>
          </section>
        </div>

        <div className="r2-ecrin">
          <div className="r2-ecrin-in">
            <div className="r2-shead">
              <h2 className="r2-ed">Certified to the Standard.</h2>
              <K>STD-1.0 · 2026</K>
            </div>
            <div className="r2-std">
              <div className="r2-std-head">
                <K>THE PARRIT STANDARD — EVERY SYSTEM, SAME SPECIFICATION</K>
                <K>6 criteria</K>
              </div>
              {STANDARD_EXCERPT.map((row) => (
                <div className="r2-std-row" key={row.ps}>
                  <div className="ps">{row.ps}</div>
                  <div className="name">{row.name}</div>
                  <div className="ex">
                    <b>In practice</b>
                    {row.example}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: "18px" }}>
              <Link className="k" href="/standard">
                Read the full Standard
              </Link>
            </p>
          </div>
        </div>

        <div className="r2-wrap">
          <section className="r2-section" aria-labelledby="manufacture-heading">
            <div className="r2-shead">
              <h2 className="r2-ed" id="manufacture-heading">
                The Manufacture.
              </h2>
              <K>How a system is built</K>
            </div>
            <div className="r2-manu">
              <p className="r2-manu-lede">
                A company operating system is not installed. It is manufactured — on your
                flows, your decisions, your exceptions.
              </p>
              <div className="r2-manu-cols">
                <p>
                  We work <b>one company at a time</b>. The system is built against how your
                  company actually operates — not how software vendors assume it should.
                </p>
                <p>
                  Everything ships against the Standard, and everything you receive is{" "}
                  <b>yours</b>: commissioned, not subscribed.
                </p>
                <div className="r2-phases">
                  {PHASES.map((phase) => (
                    <div className="r2-phase" key={phase.no}>
                      <div className="no">{phase.no}</div>
                      <div className="nm">{phase.name}</div>
                      <div className="ds">{phase.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="r2-section" aria-labelledby="faq-heading">
            <div className="r2-shead">
              <h2 className="r2-ed" id="faq-heading">
                Before you commission.
              </h2>
              <K>The questions executives ask</K>
            </div>
            <div className="r2-faq">
              {FAQ.map((item) => (
                <div className="r2-qa" key={item.q}>
                  <div className="q">{item.q}</div>
                  <div className="a">{item.a}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="r2-section" aria-labelledby="journal-heading">
            <div className="r2-shead">
              <h2 className="r2-ed" id="journal-heading">
                From the journal.
              </h2>
              <K>How we actually think</K>
            </div>
            <div className="r2-jrnl">
              {journal.map((entry) => (
                <Link className="r2-jrnl-row" href={`/journal/${entry.slug}`} key={entry.slug}>
                  <div className="no">{entry.date}</div>
                  <div className="nm">{entry.title}</div>
                  <div className="ds">{entry.description}</div>
                </Link>
              ))}
            </div>
            <p className="r2-registre-note">
              Field notes on the systems we examine, build and operate — published under our
              own names, dated, and occasionally wrong in public.{" "}
              <Link className="k" href="/journal">
                Read the journal
              </Link>
            </p>
          </section>

          <section className="r2-section" aria-labelledby="register-heading">
            <div className="r2-shead">
              <h2 className="r2-ed" id="register-heading">
                Or start smaller.
              </h2>
              <K>The prototype funnel</K>
            </div>
            <RegisterInterest source="site:home" />
          </section>

          <section className="r2-close" aria-label="Commission">
            <h2>One conversation. Your operating system, examined.</h2>
            <p className="proof">
              30 MIN · AN EXAMINATION, NOT A SALES CALL · FIGURES FROM THE DOSSIERS VERIFIED
              LIVE
            </p>
            <Link className="rev-button exec" href="/commission">
              Let’s talk
            </Link>
          </section>

          <footer className="r2-footer">
            <RegistryLine />
            <a className="k" href="https://paul-larmaraud.com" target="_blank" rel="noopener noreferrer">
              FOUNDED BY PAUL LARMARAUD
            </a>
            <K>COMMISSIONED, NOT SUBSCRIBED</K>
            <Link className="k" href="/legal">
              /Legal
            </Link>
            <K>© 2026 Parrit.ai</K>
          </footer>
        </div>
      </main>
    </>
  );
}
