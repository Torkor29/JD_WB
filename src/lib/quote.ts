import type { FeatureDemoId } from "@/lib/capabilities";

export type QuoteProjectType =
  | "site-vitrine"
  | "site-complexe"
  | "app-mobile"
  | "app-web"
  | "outil-metier"
  | "idee";

export type QuoteScope = "essentiel" | "complet" | "ambitieux";

export const quoteProjectTypes: {
  id: QuoteProjectType;
  label: string;
  hint: string;
  base: [number, number];
}[] = [
  {
    id: "site-vitrine",
    label: "Site vitrine",
    hint: "Présenter une activité et générer des contacts",
    base: [1800, 4500],
  },
  {
    id: "site-complexe",
    label: "Site / plateforme web",
    hint: "Parcours avancés, espace privé, logique métier",
    base: [4500, 14000],
  },
  {
    id: "app-mobile",
    label: "Application mobile",
    hint: "iOS et/ou Android, usage terrain ou client",
    base: [8000, 28000],
  },
  {
    id: "app-web",
    label: "Application web",
    hint: "Tableau de bord, SaaS, outil interne",
    base: [6000, 22000],
  },
  {
    id: "outil-metier",
    label: "Outil métier",
    hint: "Automatiser, suivre, calculer, organiser",
    base: [5000, 25000],
  },
  {
    id: "idee",
    label: "Je ne sais pas encore",
    hint: "On part de l’idée et on définit ensemble",
    base: [2000, 12000],
  },
];

export const quoteScopes: {
  id: QuoteScope;
  label: string;
  multiplier: number;
  text: string;
}[] = [
  {
    id: "essentiel",
    label: "Essentiel",
    multiplier: 0.85,
    text: "Cœur de besoin, lancement rapide",
  },
  {
    id: "complet",
    label: "Complet",
    multiplier: 1,
    text: "Produit solide, prêt à être utilisé",
  },
  {
    id: "ambitieux",
    label: "Ambitieux",
    multiplier: 1.35,
    text: "Parcours riches, plusieurs modules",
  },
];

export const quoteExtras: {
  id: string;
  label: string;
  add: [number, number];
  motion?: FeatureDemoId;
}[] = [
  { id: "design", label: "Design UI/UX poussé", add: [800, 2500] },
  { id: "seo", label: "SEO & contenu de lancement", add: [400, 1200] },
  {
    id: "rdv",
    label: "Prise de RDV en ligne",
    add: [900, 3200],
    motion: "rdv",
  },
  {
    id: "fidelite",
    label: "Fidélisation / Wallet",
    add: [1200, 4500],
    motion: "fidelite",
  },
  {
    id: "cms",
    label: "Espace d’administration",
    add: [600, 2000],
    motion: "webapp",
  },
  { id: "maintenance", label: "Maintenance 3 mois incluse", add: [450, 1500] },
  { id: "mobile-extra", label: "Version mobile complémentaire", add: [2500, 8000] },
];

export function estimateQuote(
  type: QuoteProjectType,
  scope: QuoteScope,
  extras: string[],
): { min: number; max: number } {
  const project = quoteProjectTypes.find((p) => p.id === type)!;
  const scopeMul = quoteScopes.find((s) => s.id === scope)!.multiplier;
  let min = Math.round(project.base[0] * scopeMul);
  let max = Math.round(project.base[1] * scopeMul);

  for (const extraId of extras) {
    const extra = quoteExtras.find((e) => e.id === extraId);
    if (!extra) continue;
    min += extra.add[0];
    max += extra.add[1];
  }

  return { min, max };
}

export function formatEuro(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}
