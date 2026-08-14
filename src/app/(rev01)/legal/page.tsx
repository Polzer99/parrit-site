import type { Metadata } from "next";

import { K, RegistryLine } from "@/system/components";

export const metadata: Metadata = {
  title: "Legal notice and privacy policy",
  description:
    "Legal notice and privacy policy for Parrit.ai, including company information, hosting, data processing and GDPR rights.",
};

const COMPANY = {
  name: "PARRIT.AI",
  form: "Simplified joint-stock company with a sole shareholder (SASU)",
  capital: "€100",
  office: "3 avenue Otis Mygatt, 92500 Rueil-Malmaison, France",
  registration: "Nanterre 928 503 218",
  siret: "928 503 218 00010",
  vat: "FR48 928 503 218",
  businessCode: "62.01Z (Computer programming)",
  publicationDirector: "Paul Larmaraud",
  email: "paul.larmaraud@parrit.ai",
} as const;

export default function LegalPage() {
  return (
    <main className="rev-page legal-page">
      <div className="rev-wrap legal-wrap">
        <header className="legal-header">
          <div>
            <K>Parrit / Document register</K>
            <h1>Legal notice and privacy policy.</h1>
          </div>
          <RegistryLine value="PARRIT / LEGAL · REV 01 · 2026" />
        </header>

        <section className="legal-document" aria-labelledby="legal-notice-heading">
          <div className="legal-document-head">
            <K>Document 01</K>
            <K>Last updated / July 2026</K>
          </div>
          <h2 id="legal-notice-heading">Legal notice</h2>

          <section>
            <h3>Publisher</h3>
            <p>
              The parrit.ai website is published by <strong>{COMPANY.name}</strong>, {COMPANY.form},
              with a share capital of {COMPANY.capital}.
            </p>
            <p>
              Registered office: {COMPANY.office}. Registered with the Nanterre Trade and Companies
              Register under number {COMPANY.registration}. SIRET: {COMPANY.siret}. VAT: {COMPANY.vat}.
              Business code (APE): {COMPANY.businessCode}.
            </p>
            <p>
              Publication director: {COMPANY.publicationDirector}. Contact:{" "}
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
            </p>
          </section>

          <section>
            <h3>Hosting</h3>
            <p>
              The website is hosted by Vercel Inc., 340 S Lemon Ave {"#"}4133, Walnut, CA 91789,
              USA (vercel.com).
            </p>
          </section>

          <section>
            <h3>Intellectual property</h3>
            <p>
              All content on the site (text, visuals, logos, the Parrit.ai brand) is the exclusive
              property of {COMPANY.name}, unless otherwise stated. Any reproduction or representation,
              in whole or in part, without prior written authorization, is prohibited.
            </p>
          </section>

          <section>
            <h3>Liability</h3>
            <p>
              {COMPANY.name} strives to keep the information published accurate, without guaranteeing
              that it is complete or up to date. The site may contain links to third-party sites over
              whose content {COMPANY.name} has no control and for which it accepts no liability.
            </p>
          </section>

          <section>
            <h3>Personal data</h3>
            <p>
              How personal data collected through this site is processed is described in the privacy
              policy below.
            </p>
          </section>
        </section>

        <section className="legal-document" aria-labelledby="privacy-heading">
          <div className="legal-document-head">
            <K>Document 02</K>
            <K>Last updated / July 2026</K>
          </div>
          <h2 id="privacy-heading">Privacy policy</h2>

          <section>
            <h3>Data controller</h3>
            <p>
              The data controller is <strong>{COMPANY.name}</strong>, {COMPANY.office}. For any
              question: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
            </p>
          </section>

          <section>
            <h3>Data we collect</h3>
            <p>
              When you fill in a form (contact, booking, access to a resource), we collect the data you
              provide: first name, last name, email address and, where relevant, phone number. We also
              measure site audience through navigation analytics.
            </p>
          </section>

          <section>
            <h3>Purposes</h3>
            <p>
              This data is used to answer your requests, contact you in a commercial context, send you
              the resources you asked for and improve the site. We never send anything without a
              legitimate reason and never resell your data.
            </p>
          </section>

          <section>
            <h3>Legal basis</h3>
            <p>
              Processing is based on your consent (forms) and on Parrit.ai&apos;s legitimate interest in
              developing its business and securing its site.
            </p>
          </section>

          <section>
            <h3>Recipients and processors</h3>
            <p>
              Your data is processed by Parrit.ai and by the technical providers strictly necessary to
              the service: hosting (Vercel), form automation (n8n), database (Supabase) and analytics
              (PostHog, hosted in the European Union). Some providers may process data outside the
              European Union, with the contractual safeguards required by the GDPR.
            </p>
          </section>

          <section>
            <h3>Retention</h3>
            <p>
              Prospecting data is kept for three years from the last contact, in line with French data
              protection authority (CNIL) guidance, then deleted or anonymized.
            </p>
          </section>

          <section>
            <h3>Your rights</h3>
            <p>
              You have the right to access, rectify, erase, restrict, object to and port your data. To
              exercise these rights, write to <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
              You may also lodge a complaint with the French data protection authority (CNIL, cnil.fr).
            </p>
          </section>
        </section>

        <footer className="rev-footer">
          <RegistryLine />
        </footer>
      </div>
    </main>
  );
}
