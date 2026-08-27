export type Project = {
  id: string;
  name: string;
  category: string;
  url?: string;
  problem: string;
  solution: string;
  outcome: string;
  accent: string;
  image: string;
  tags: string[];
};

export const projects: Project[] = [
  {
    id: "d121",
    name: "D121",
    category: "Site web sur mesure",
    url: "https://d121.fr/",
    problem:
      "Un artisan spécialisé en revêtements de sols à Brest avait besoin d’une vitrine claire pour expliquer son métier et générer des devis.",
    solution:
      "Site sur mesure orienté conversion : prestations, réalisations, zone d’intervention et prise de contact immédiate.",
    outcome:
      "Une présence digitale professionnelle qui transforme une visite en demande de devis.",
    accent: "#C45A2D",
    image: "/projects/d121.jpg",
    tags: ["Site web", "Local", "Conversion"],
  },
  {
    id: "comptap",
    name: "Comptap",
    category: "Produit digital",
    url: "https://comptap.fr/",
    problem:
      "Les commerces de proximité veulent fidéliser sans imposer une application à télécharger.",
    solution:
      "Produit de fidélité NFC + carte Wallet, notifications et espace boutique.",
    outcome:
      "Une expérience simple pour le commerçant comme pour le client.",
    accent: "#1FA66A",
    image: "/projects/comptap.jpg",
    tags: ["Produit", "NFC", "Wallet"],
  },
  {
    id: "vigie",
    name: "Vigie Clinique",
    category: "Logiciel métier",
    url: "https://vigie-clinique.fr/",
    problem:
      "Les équipes de recherche clinique hospitalière perdaient du temps entre tableurs, mails et dossiers partagés.",
    solution:
      "Logiciel de gestion de projet dédié : études, centres, queries, monitoring, TMF et checklists réglementaires.",
    outcome:
      "Un outil pensé pour le quotidien hospitalier, auto-hébergé, en français.",
    accent: "#0F766E",
    image: "/projects/vigie.jpg",
    tags: ["Logiciel métier", "Santé"],
  },
  {
    id: "farming",
    name: "Farming Navigator",
    category: "Outil numérique",
    url: "https://farming-navigator.com/",
    problem:
      "Un besoin agricole spécifique ne trouvait pas de réponse dans les outils génériques du marché.",
    solution:
      "Conception et développement d’un produit numérique sur mesure pour le terrain.",
    outcome:
      "Un outil personnalisé, calibré sur l’usage réel.",
    accent: "#4D7C0F",
    image: "/projects/farming.jpg",
    tags: ["Outil métier", "Agriculture"],
  },
];
