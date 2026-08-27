export type FeatureDemoId =
  | "paiement"
  | "app"
  | "webapp"
  | "rdv"
  | "fidelite";

export type ProductCapability = {
  id: string;
  title: string;
  tag: string;
  description: string;
  previewLabel: string;
  result: string;
  demo: FeatureDemoId;
  /** @deprecated alias */
  text?: string;
};

export const productCapabilities: ProductCapability[] = [
  {
    id: "sites",
    title: "Sites & paiements",
    tag: "E-commerce / devis",
    description:
      "Vitrine claire, parcours d’achat ou devis en ligne, encaissement sécurisé — du clic au paiement confirmé.",
    previewLabel: "Checkout client",
    result: "Vos clients paient en ligne. Vous recevez le reçu automatiquement.",
    demo: "paiement",
  },
  {
    id: "apps",
    title: "Applications mobiles",
    tag: "iOS / Android",
    description:
      "Une app pour vos clients ou vos équipes : réservation, suivi, notifications — usage réel, pas gadget.",
    previewLabel: "App native",
    result: "Un parcours mobile fluide, du premier écran à la confirmation.",
    demo: "app",
  },
  {
    id: "webapps",
    title: "Web apps & dashboards",
    tag: "Outil métier",
    description:
      "Espaces privés, tableaux de bord et outils internes qui font gagner du temps au quotidien.",
    previewLabel: "Espace pro",
    result: "Vos indicateurs et actions métier, accessibles depuis le navigateur.",
    demo: "webapp",
  },
  {
    id: "rdv",
    title: "Prise de rendez-vous",
    tag: "Agenda",
    description:
      "Agenda en ligne, créneaux disponibles, confirmation et rappels automatiques pour vous et vos clients.",
    previewLabel: "Réservation",
    result: "Moins d’appels, moins de no-show — le créneau est réservé et rappelé.",
    demo: "rdv",
  },
  {
    id: "fidelite",
    title: "Fidélisation",
    tag: "Wallet / points",
    description:
      "Cartes Wallet, points de passage et avantages pour faire revenir vos clients sans effort.",
    previewLabel: "Carte fidélité",
    result: "Chaque visite compte. La récompense se débloque toute seule.",
    demo: "fidelite",
  },
];

/** @deprecated kept for leftover imports */
export type FeatureMotionId = FeatureDemoId;

export const capabilityCards = productCapabilities.map((c) => ({
  id: c.id,
  title: c.title,
  text: c.description,
  motion: c.demo as FeatureMotionId | null,
}));

export const professions = [
  {
    id: "sante",
    label: "Santé & paramédical",
    need: "Prise de RDV, dossiers, suivi patient",
    motion: "rdv" as FeatureDemoId,
  },
  {
    id: "commerce",
    label: "Commerces & artisans",
    need: "Vitrine, devis, fidélité client",
    motion: "fidelite" as FeatureDemoId,
  },
];
