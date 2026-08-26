export const siteConfig = {
  name: "Julien DOLOU",
  title: "Julien DOLOU — Développement & produits numériques sur mesure",
  description:
    "Studio digital indépendant : création de sites web sur mesure, applications mobiles iOS et Android, applications web, plateformes et logiciels métiers. De l'idée au produit.",
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
    { label: "Méthode", href: "#methode" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export const capabilities = ["WEB", "MOBILE", "PLATEFORME", "OUTIL MÉTIER"] as const;
