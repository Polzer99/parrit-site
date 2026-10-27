import type { Locale } from "./locale";

export const PARTNER_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeNVPnXs_ji3QJSC8WHGs6UPtOgO1GPdTfs6jc6T1S5cpB9aw/viewform";

type PartnerCopy = {
  title: string;
  heading: string;
  emphasis: string;
  introduction: string;
  blocks: readonly { heading: string; text: string }[];
  action: string;
  formLanguage: string | null;
  privacy: string;
  contact: string;
};

// PAGE-DEVENIR-PARTENAIRE.md; gate-driven copy changes documented in the report.
export const PARTNER_DICT: Record<Locale, PartnerCopy> = {
  fr: {
    title: "Devenir partenaire · Parrit.ai",
    heading: "Formateurs et consultants IA,",
    emphasis: "rejoignez notre réseau.",
    introduction: "Parrit.ai répond à des demandes de formation et à des appels d'offres sur l'intelligence artificielle. Nous cherchons des formateurs qui pratiquent ce qu'ils enseignent et qui rendent leurs stagiaires autonomes.",
    blocks: [
      { heading: "Ce que nous cherchons", text: "Une pratique réelle de l'IA, et des participants qui savent faire seuls à la fin de la formation. Trois compétences maîtrisées valent mieux que douze cochées." },
      { heading: "Comment s'inscrire", text: "Un formulaire de sept à dix minutes, sans compte. Qualiopi n'est pas exigée. Ce que vous déclarez est revu avec vous avant toute mission." },
      { heading: "Vos informations", text: "Elles restent internes à Parrit.ai. Aucune fiche n'est transmise à un client sans votre accord. L'inscription ne garantit pas de mission." },
    ],
    action: "Rejoindre le réseau",
    formLanguage: null,
    privacy: "Responsable du traitement : Parrit.ai. Pour consulter, corriger ou supprimer vos informations :",
    contact: "nous contacter",
  },
  en: {
    title: "Become a partner · Parrit.ai",
    heading: "AI trainers and consultants,",
    emphasis: "join our network.",
    introduction: "Parrit.ai answers training requests and calls for tenders on artificial intelligence. We are looking for trainers who practise what they teach and leave their trainees able to work on their own.",
    blocks: [
      { heading: "What we look for", text: "Real, hands-on practice of AI, and participants who can work on their own by the end of the course. Three skills you master beat twelve boxes ticked." },
      { heading: "How to sign up", text: "A 7 to 10 minute form, no account needed. Qualiopi is not required. What you declare is reviewed with you before any assignment." },
      { heading: "Your information", text: "It stays within Parrit.ai. No profile is shared with a client without your consent. Signing up does not guarantee an assignment." },
    ],
    action: "Join the network",
    formLanguage: "The form is in French.",
    privacy: "Data controller: Parrit.ai. To access, correct or delete your information:",
    contact: "contact us",
  },
};
