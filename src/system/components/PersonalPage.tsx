import Link from "next/link";

import { K } from "./K";
import { ParritCalInline } from "./CalInline";
import { RegistryLine } from "./RegistryLine";

type PersonalPageProps = {
  person: string;
  role: string;
  statement: string;
  introduction: string;
  practiceTitle: string;
  practiceBody: string;
};

export function PersonalPage({
  person,
  role,
  statement,
  introduction,
  practiceTitle,
  practiceBody,
}: PersonalPageProps) {
  return (
    <main className="rev-page personal-page">
      <div className="rev-wrap personal-wrap">
        <header className="personal-hero">
          <K>{person} / {role}</K>
          <h1>{statement}</h1>
          <p>{introduction}</p>
        </header>

        <section className="personal-practice" aria-labelledby="practice-heading">
          <K>How I work</K>
          <h2 id="practice-heading">{practiceTitle}</h2>
          <p>{practiceBody}</p>
        </section>

        <section className="personal-offer" aria-labelledby="coaching-heading">
          <div className="rev-section-head">
            <h2 id="coaching-heading">Ten hours of focused coaching</h2>
            <K>One-to-one / Working sessions</K>
          </div>
          <p className="personal-offer-intro">
            A bounded engagement to examine one operational problem, make the decisions it
            requires and work through the system that should follow.
          </p>
        </section>

        <section className="personal-calendar" aria-labelledby="coaching-calendar-heading">
          <div className="rev-section-head">
            <h2 id="coaching-calendar-heading">Book a working session</h2>
            <K>Booking / Cal.com</K>
          </div>
          <ParritCalInline />
        </section>

        <section className="personal-bridge" aria-labelledby="bridge-heading">
          <K>When the problem outgrows coaching</K>
          <h2 id="bridge-heading">Bring the operating problem to Parrit.</h2>
          <p>
            Some problems need more than individual sessions. Parrit examines the operation,
            builds the system and carries it into production as owned infrastructure.
          </p>
          <Link className="rev-button ghost" href="/commission">
            Commission an examination
          </Link>
        </section>

        <footer className="rev-footer">
          <RegistryLine />
        </footer>
      </div>
    </main>
  );
}
