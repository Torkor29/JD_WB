export const siteConfig = {
  name: "Julien DOLOU",
  title:
    "Julien DOLOU | Studio digital — sites, apps & outils métiers | Bretagne",
  description:
    "Breton, bord de mer. Je transforme vos idées en produits numériques sur mesure : sites web, applications, prise de RDV, fidélisation et outils métiers.",
  url: "https://juliendolou.fr",
  locale: "fr_FR",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "contact@wenbot.club",
  location: "Brest, Bretagne",
  legal: {
    status: "Entrepreneur individuel",
    siren: "981241417",
    siret: "98124141700022",
    tva: "FR79981241417",
    address: "12 rue de la Fontaine Margot, 29200 Brest",
    activity: "Programmation informatique (6201Z)",
  },
  nav: [
    { label: "Histoire", href: "#histoire" },
    { label: "Services", href: "#services" },
    { label: "Réalisations", href: "#realisations" },
    { label: "Méthode", href: "#methode" },
    { label: "Contact", href: "#contact" },
  ],
} as const;
