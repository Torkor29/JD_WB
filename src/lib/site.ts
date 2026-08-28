export const siteConfig = {
  name: "TiCode",
  founder: "Julien",
  founderLegal: "Julien DOLOU",
  title: "TiCode | Sites, apps & outils métiers sur mesure — Bretagne",
  description:
    "TiCode, agence digitale en Bretagne. Sites web, applications, paiements, prise de RDV, fidélisation et outils métiers — conçus sur mesure.",
  url: "https://juliendolou.fr",
  locale: "fr_FR",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "Julien.dolou@hotmail.fr",
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
