export const WA_LINK = "https://wa.me/33759665687?text=Bonjour%20Paul%20!";

export const clients = [
  "Laparra",
  "Deroche",
  "Codialis",
  "SNCF",
  "SAP",
] as const;

export const shipped = [
  {
    badge: "MICRO-SAAS",
    description: "Contestation SNCF \u2014 Photo du PV \u2192 IA \u2192 recommand\u00e9 AR envoy\u00e9",
    status: "En production",
    link: "https://contester-amende-sncf.vercel.app",
  },
  {
    badge: "CRM",
    description: "Laparra \u2014 CRM fruits & l\u00e9gumes pour 20 commerciaux terrain",
    status: "En production",
    link: "https://laparra-crm.vercel.app",
  },
  {
    badge: "PLATEFORME",
    description: "MAGEC Connect \u2014 Groupement d\u2019achat, 100+ membres",
    status: "Prototype",
    link: "",
  },
  {
    badge: "AGENTS IA",
    description: "Prospection automatis\u00e9e \u2014 Signaux LinkedIn \u2192 RDV qualifi\u00e9s",
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
