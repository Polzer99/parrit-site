import Landing from "./Landing";
import { FAQS } from "./content";

const SITE_URL = "https://parrit.ai";

// JSON-LD : FAQPage (citable tel quel par les moteurs génératifs) + Course
// (l'offre elle-même, rattachée à l'Organization Parrit.ai).
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Camp Parrita : immersion entrepreneuriale au Costa Rica",
  description:
    "10 jours sans téléphone sur la côte Pacifique du Costa Rica. Chaque participant crée une activité génératrice de revenus en partant de rien, encadré discrètement. 8 places par cohorte, admission sur candidature.",
  url: `${SITE_URL}/camp-costa-rica`,
  inLanguage: "fr",
  provider: {
    "@type": "Organization",
    name: "Parrit.ai",
    url: SITE_URL,
  },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "onsite",
    location: {
      "@type": "Place",
      name: "Côte Pacifique, Costa Rica (région de Sámara et Parrita)",
      address: { "@type": "PostalAddress", addressCountry: "CR" },
    },
  },
};

export default function CampCostaRicaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <Landing />
    </>
  );
}
