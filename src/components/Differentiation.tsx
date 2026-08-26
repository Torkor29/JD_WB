"use client";

import { Reveal } from "./Reveal";

const points = [
  {
    title: "Sur mesure",
    text: "Pas de solution copiée-collée. Chaque produit est pensé pour un besoin précis.",
  },
  {
    title: "Un seul interlocuteur",
    text: "Une personne qui comprend réellement le projet — de la réflexion jusqu’au code.",
  },
  {
    title: "Web + mobile + outils",
    text: "Un projet peut naître sur le web et évoluer vers d’autres supports si le besoin l’exige.",
  },
  {
    title: "De l’idée au produit",
    text: "Accompagnement complet : réflexion, conception, développement, mise en ligne.",
  },
  {
    title: "Évolutif",
    text: "Le produit peut continuer à grandir après son lancement. Ce n’est pas une livraison jetable.",
  },
];

export function Differentiation() {
  return (
    <section id="pourquoi" className="section-pad relative overflow-hidden">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">Différenciation</p>
          <h2 className="headline mt-4 max-w-3xl text-display-lg">
            Pas de template.
            <span className="block">Pas de solution générique.</span>
          </h2>
        </Reveal>

        <div className="mt-16 space-y-0">
          {points.map((point, i) => (
            <Reveal key={point.title} delay={i * 0.05}>
              <article
                className={`grid gap-4 border-t border-line py-8 md:grid-cols-[0.35fr_0.2fr_1fr] md:gap-8 md:py-10 ${
                  i === points.length - 1 ? "border-b" : ""
                }`}
              >
                <h3 className="font-display text-2xl tracking-tight md:text-3xl">
                  {point.title}
                </h3>
                <p className="font-display text-accent md:text-right">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="max-w-xl text-lg leading-relaxed text-mist">
                  {point.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
