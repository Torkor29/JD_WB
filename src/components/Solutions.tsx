"use client";

import { Reveal } from "./Reveal";

const items = [
  {
    id: "web",
    title: "Sites web",
    text: "Sites vitrines, plateformes, sites complexes, expériences web personnalisées. Jamais un modèle recyclé.",
    span: "lg:col-span-7 lg:row-span-2",
    visual: "web",
  },
  {
    id: "mobile",
    title: "Applications mobiles",
    text: "Applications iOS et Android adaptées au besoin — pas une app pour le principe d’en avoir une.",
    span: "lg:col-span-5",
    visual: "mobile",
  },
  {
    id: "appweb",
    title: "Applications web",
    text: "Interfaces privées, tableaux de bord, plateformes SaaS, outils internes.",
    span: "lg:col-span-5",
    visual: "dash",
  },
  {
    id: "metier",
    title: "Outils métiers",
    text: "Automatisation, gestion, suivi, calcul, réservation, organisation… tout ce qui n’existe pas encore pour votre activité.",
    span: "lg:col-span-6",
    visual: "tools",
  },
  {
    id: "spec",
    title: "Projets spécifiques",
    text: "Si le besoin ne rentre dans aucune case, on l’étudie quand même. Sur mesure, c’est aussi ça.",
    span: "lg:col-span-6",
    visual: "spark",
  },
];

function Visual({ type }: { type: string }) {
  if (type === "web") {
    return (
      <div className="mt-8 overflow-hidden rounded-xl border border-line bg-ink p-3">
        <div className="mb-3 flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ivory/25" />
          <span className="h-2 w-2 rounded-full bg-ivory/25" />
          <span className="h-2 w-2 rounded-full bg-ivory/25" />
        </div>
        <div className="grid gap-3 md:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-2">
            <div className="h-3 w-2/3 rounded bg-accent/40" />
            <div className="h-2 w-full rounded bg-ivory/10" />
            <div className="h-2 w-4/5 rounded bg-ivory/10" />
            <div className="mt-4 h-8 w-28 rounded-full bg-accent" />
          </div>
          <div className="min-h-28 rounded-lg bg-gradient-to-br from-forest/40 via-surface to-accent/20" />
        </div>
      </div>
    );
  }
  if (type === "mobile") {
    return (
      <div className="mt-6 flex justify-end">
        <div className="w-28 rounded-[1.2rem] border border-line bg-ink p-1.5">
          <div className="rounded-[0.95rem] bg-surface p-2">
            <div className="mb-2 h-1 w-8 rounded-full bg-ivory/20" />
            <div className="h-20 rounded-lg bg-accent/20" />
            <div className="mt-2 space-y-1">
              <div className="h-1.5 rounded bg-ivory/15" />
              <div className="h-1.5 w-2/3 rounded bg-ivory/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (type === "dash") {
    return (
      <div className="mt-6 grid grid-cols-3 gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-lg border border-line bg-ink/60 p-2">
            <div className="h-1.5 w-1/2 rounded bg-accent/50" />
            <div className="mt-3 h-6 rounded bg-ivory/5" />
          </div>
        ))}
      </div>
    );
  }
  if (type === "tools") {
    return (
      <div className="mt-6 flex flex-wrap gap-2">
        {["Automatiser", "Suivre", "Calculer", "Organiser"].map((label) => (
          <span
            key={label}
            className="rounded-full border border-line px-3 py-1 text-xs text-mist"
          >
            {label}
          </span>
        ))}
      </div>
    );
  }
  return (
    <div className="mt-6 font-display text-5xl leading-none text-accent/40">?</div>
  );
}

export function Solutions() {
  return (
    <section id="solutions" className="section-pad relative">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">Ce qui peut être créé</p>
          <h2 className="headline mt-4 max-w-3xl text-display-lg">
            Pas de cases imposées.
            <span className="block text-mist">Seulement le bon produit.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:auto-rows-fr">
          {items.map((item, i) => (
            <Reveal
              key={item.id}
              delay={i * 0.06}
              className={`${item.span} group relative overflow-hidden rounded-[1.4rem] border border-line bg-surface/70 p-7 transition duration-500 hover:border-accent/30 hover:bg-surface-raised md:p-8`}
            >
              <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(600px_circle_at_var(--x,80%)_0%,rgba(212,243,74,0.08),transparent_50%)]" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-2xl tracking-tight md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-md text-mist leading-relaxed">{item.text}</p>
                <Visual type={item.visual} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
