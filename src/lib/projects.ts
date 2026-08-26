export type Project = {
  id: string;
  name: string;
  category: string;
  yearLabel?: string;
  url?: string;
  problem: string;
  solution: string;
  outcome: string;
  accent: string;
  accentSoft: string;
  layout: "full" | "split-left" | "split-right" | "stack";
  tags: string[];
};

export const projects: Project[] = [
  {
    id: "d121",
    name: "D121",
    category: "Site web sur mesure",
    url: "https://d121.fr/",
    problem:
      "Un entrepreneur spécialisé en revêtements de sols souples à Brest avait besoin d’une présence digitale claire pour présenter ses prestations, rassurer et générer des demandes de devis.",
    solution:
      "Conception et développement d’un site vitrine orienté conversion : présentation des savoir-faire, galerie de réalisations, avis, zone d’intervention et prise de contact facilitée.",
    outcome:
      "Une vitrine professionnelle qui explique immédiatement le métier, les prestations et comment obtenir un devis.",
    accent: "#C4A574",
    accentSoft: "#2A241C",
    layout: "full",
    tags: ["Site web", "Local", "Conversion"],
  },
  {
    id: "comptap",
    name: "Comptap",
    category: "Produit digital / fidélisation",
    url: "https://comptap.fr/",
    problem:
      "Les commerces de proximité ont besoin d’un programme de fidélité moderne, sans forcer leurs clients à télécharger une application.",
    solution:
      "Développement d’un produit de fidélité basé sur NFC et carte Wallet, avec notifications, suivi client et espace boutique.",
    outcome:
      "Une expérience de fidélisation fluide pour le commerçant comme pour le client — sans application à télécharger.",
    accent: "#1FA66A",
    accentSoft: "#0F1F18",
    layout: "split-left",
    tags: ["Produit", "NFC", "Wallet", "Commerces"],
  },
  {
    id: "vigie",
    name: "Vigie Clinique",
    category: "Logiciel métier",
    url: "https://vigie-clinique.fr/",
    problem:
      "Les équipes de recherche clinique hospitalière jonglent entre tableurs, mails et dossiers partagés pour suivre études, centres, queries, monitoring et documents TMF.",
    solution:
      "Conception d’un logiciel de gestion de projet dédié : suivi des études et missions, checklists réglementaires (RIPH / 536/2014 / MDR / IVDR), TMF, monitoring — auto-hébergé, sans données nominatives de participants.",
    outcome:
      "Un outil métier pensé pour le quotidien des équipes hospitalières, en français, structuré autour de leurs obligations réelles.",
    accent: "#4F8CFF",
    accentSoft: "#121826",
    layout: "split-right",
    tags: ["Logiciel métier", "Santé", "Recherche clinique"],
  },
  {
    id: "farming",
    name: "Farming Navigator",
    category: "Outil numérique",
    url: "https://farming-navigator.com/",
    problem:
      "Un besoin spécifique lié au monde agricole nécessitait un outil numérique dédié, hors des solutions génériques du marché.",
    solution:
      "Conception et développement d’un produit numérique sur mesure, adapté au contexte et aux usages du terrain.",
    outcome:
      "Un outil personnalisé, pensé pour un usage réel plutôt qu’une solution standardisée.",
    accent: "#8FBF4A",
    accentSoft: "#161A10",
    layout: "stack",
    tags: ["Outil métier", "Agriculture", "Sur mesure"],
  },
];
