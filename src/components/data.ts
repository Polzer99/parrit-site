export const WA_LINK = "https://wa.me/33759665687?text=Bonjour%20Paul%20!";

export const clients = [
  "Clévry Avocat",
  "Chamas Tacos",
  "Carte Noire",
  "Clients confidentiels",
] as const;

export const shipped = [
  {
    badge: "MICRO-SAAS",
    description: "Contestation automatis\u00e9e \u2014 Photo \u2192 IA extrait les donn\u00e9es \u2192 recommand\u00e9 AR envoy\u00e9",
    status: "En production",
    link: "https://contester-amende-sncf.vercel.app",
  },
  {
    badge: "CRM SUR MESURE",
    description: "CRM m\u00e9tier pour un grossiste \u2014 20 commerciaux, dashboard, saisonnalit\u00e9",
    status: "En production",
    link: "",
  },
  {
    badge: "AGENTS IA",
    description: "Prospection automatis\u00e9e \u2014 Signaux LinkedIn \u2192 s\u00e9quences personnalis\u00e9es \u2192 RDV",
    status: "En production",
    link: "",
  },
  {
    badge: "ASSISTANT SAP",
    description: "Chatbot IA pour utilisateurs SAP \u2014 MM/SD/FI en langage naturel",
    status: "En production",
    link: "",
  },
] as const;

export const stats = [
  { value: "48h", label: "Premier prototype" },
  { value: "0", label: "Maintenance de votre c\u00f4t\u00e9" },
  { value: "\u221e", label: "Am\u00e9lioration continue" },
] as const;

export const team = {
  line: "Paul Larmaraud & Yukun Leng \u2014 10+ ans en entreprise \u2014 LVMH, Lime, SAP, nucl\u00e9aire, grande distribution",
  paul: "https://www.linkedin.com/in/paul-larmaraud/",
  yukun: "https://www.linkedin.com/in/yukun-leng/",
} as const;
