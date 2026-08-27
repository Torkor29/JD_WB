export type FeatureMotionId =
  | "rdv"
  | "fidelite"
  | "dashboard"
  | "reservation"
  | "suivi";

export const professions = [
  {
    id: "sante",
    label: "Santé & paramédical",
    need: "Prise de RDV, dossiers, suivi patient",
    motion: "rdv" as FeatureMotionId,
  },
  {
    id: "commerce",
    label: "Commerces & artisans",
    need: "Vitrine, devis, fidélité client",
    motion: "fidelite" as FeatureMotionId,
  },
  {
    id: "services",
    label: "Professions libérales",
    need: "Image claire, contact, organisation",
    motion: "rdv" as FeatureMotionId,
  },
  {
    id: "startup",
    label: "Startups & produits",
    need: "MVP, dashboard, parcours utilisateurs",
    motion: "dashboard" as FeatureMotionId,
  },
  {
    id: "asso",
    label: "Associations",
    need: "Adhésions, événements, communication",
    motion: "reservation" as FeatureMotionId,
  },
  {
    id: "metier",
    label: "Besoins métiers spécifiques",
    need: "Outil sur mesure pour votre process",
    motion: "suivi" as FeatureMotionId,
  },
];

export const capabilityCards = [
  {
    id: "web",
    title: "Sites web",
    text: "Vitrines et plateformes pensées pour convertir — jamais un template recyclé.",
    motion: null as FeatureMotionId | null,
  },
  {
    id: "app",
    title: "Applications",
    text: "Mobile ou web : l’outil que vos clients ou équipes utilisent vraiment.",
    motion: "dashboard" as FeatureMotionId | null,
  },
  {
    id: "rdv",
    title: "Prise de RDV",
    text: "Agenda en ligne, confirmations, rappels — sans friction.",
    motion: "rdv" as FeatureMotionId | null,
  },
  {
    id: "fidelite",
    title: "Fidélisation",
    text: "Programmes clients, Wallet, notifications utiles.",
    motion: "fidelite" as FeatureMotionId | null,
  },
  {
    id: "metier",
    title: "Outils métiers",
    text: "Automatiser, suivre, calculer : votre process digitalisé.",
    motion: "suivi" as FeatureMotionId | null,
  },
];
