"use client";

import { Reveal } from "./Reveal";

const items = [
  {
    id: "web",
    title: "Sites web sur mesure",
    text: "Vitrines, plateformes, sites complexes. Conçus pour convaincre et convertir — jamais copiés d’un template.",
    span: "lg:col-span-7 lg:row-span-2",
    hook: "Être trouvé. Être compris. Générer des demandes.",
  },
  {
    id: "mobile",
    title: "Applications mobiles",
    text: "iOS et Android adaptés à votre usage réel. Une app seulement si elle apporte une vraie valeur.",
    span: "lg:col-span-5",
    hook: "Dans la poche de vos utilisateurs.",
  },
  {
    id: "appweb",
    title: "Applications web",
    text: "Interfaces privées, tableaux de bord, SaaS, outils internes. Des produits qui font gagner du temps.",
    span: "lg:col-span-5",
    hook: "Remplacer les tableurs et les bricolages.",
  },
  {
    id: "metier",
    title: "Outils métiers",
    text: "Automatisation, gestion, suivi, calcul, réservation… tout ce qui n’existe pas encore pour votre activité.",
    span: "lg:col-span-6",
    hook: "Votre process, digitalisé.",
  },
  {
    id: "spec",
    title: "Projets spécifiques",
    text: "Si le besoin ne rentre dans aucune case, on l’étudie quand même. Sur mesure, c’est aussi ça.",
    span: "lg:col-span-6",
    hook: "Votre idée mérite mieux qu’un compromis.",
  },
];

export function Solutions() {
  return (
    <section id="solutions" className="section-pad relative bg-paper-soft/70">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">Ce que je construis</p>
          <h2 className="headline mt-4 max-w-3xl text-display-lg">
            Pas de cases imposées.
            <span className="block text-accent">Le bon produit pour votre besoin.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          {items.map((item, i) => (
            <Reveal
              key={item.id}
              delay={i * 0.05}
              className={`${item.span} group relative overflow-hidden rounded-[1.4rem] border border-line bg-white p-7 shadow-card transition duration-500 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lift md:p-8`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-display text-2xl tracking-tight md:text-3xl">
                {item.title}
              </h3>
              <p className="mt-2 text-sm font-semibold text-ink/70">{item.hook}</p>
              <p className="mt-3 max-w-md leading-relaxed text-muted">{item.text}</p>
              <a
                href="#devis"
                className="link-underline mt-6 inline-flex text-sm font-semibold text-accent"
                data-cursor="interactive"
              >
                Estimer ce type de projet
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
