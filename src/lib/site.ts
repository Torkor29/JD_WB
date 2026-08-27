export const siteConfig = {
  name: "Julien DOLOU",
  title:
    "Julien DOLOU | Création de site web sur mesure, apps & logiciels métiers",
  description:
    "Vous avez une idée ? Je la transforme en produit numérique. Création de site web sur mesure, développement d’applications mobiles iOS/Android, applications web, plateformes et outils métiers. Devis clair, accompagnement de A à Z — Brest & France.",
  url: "https://juliendolou.fr",
  locale: "fr_FR",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "contact@wenbot.club",
  location: "Brest, France",
  legal: {
    status: "Entrepreneur individuel",
    siren: "981241417",
    siret: "98124141700022",
    tva: "FR79981241417",
    address: "12 rue de la Fontaine Margot, 29200 Brest",
    activity: "Programmation informatique (6201Z)",
  },
  nav: [
    { label: "Accueil", href: "#top" },
    { label: "Solutions", href: "#solutions" },
    { label: "Réalisations", href: "#realisations" },
    { label: "Devis", href: "#devis" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export const capabilities = [
  "Site web",
  "Application mobile",
  "Application web",
  "Outil métier",
] as const;
