"use client";

import { Reveal } from "./Reveal";
import { TextRollButton } from "./TextRollButton";

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
    <section id="solutions" className="section-pad relative overflow-hidden bg-white">
      <div className="container-site">
        <Reveal>
          <div className="mb-6 flex items-center gap-3 sm:mb-8">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-white sm:h-7 sm:w-7 sm:text-[12px]">
              1
            </span>
            <span className="rounded-full border border-line px-3 py-1 text-[12px] font-medium text-ink sm:px-4 sm:py-1.5 sm:text-[13px]">
              Ce que je construis
            </span>
          </div>
          <h2 className="headline max-w-3xl text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em]">
            Pas de cases imposées.
            <span className="block text-accent">Le bon produit pour votre besoin.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          {items.map((item, i) => (
            <Reveal
              key={item.id}
              delay={i * 0.05}
              className={`${item.span} group relative overflow-hidden rounded-[1.4rem] border border-line bg-paper-soft/50 p-7 transition duration-500 hover:-translate-y-1 hover:border-accent/30 hover:bg-white hover:shadow-lift md:p-8`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-display text-2xl tracking-tight md:text-3xl">
                {item.title}
              </h3>
              <p className="mt-2 text-sm font-semibold text-ink/70">{item.hook}</p>
              <p className="mt-3 max-w-md leading-relaxed text-muted">{item.text}</p>
              <div className="mt-6">
                <TextRollButton href="#devis" variant="accent">
                  Estimer ce projet
                </TextRollButton>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
