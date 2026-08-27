"use client";

import { Reveal } from "./Reveal";

const points = [
  {
    title: "Sur mesure, vraiment",
    text: "Pas de solution copiée-collée. Chaque produit est pensé pour un besoin précis — le vôtre.",
  },
  {
    title: "Un seul interlocuteur",
    text: "Une personne qui comprend le projet de bout en bout : réflexion, design, développement, lancement.",
  },
  {
    title: "Web + mobile + outils",
    text: "Votre idée peut naître en site, devenir une app, puis un outil métier. On construit ce qu’il faut.",
  },
  {
    title: "De l’idée au produit",
    text: "Vous n’avez pas besoin d’un cahier des charges parfait. On clarifie ensemble, puis on livre.",
  },
  {
    title: "Évolutif après le lancement",
    text: "Le produit peut continuer à grandir. Ce n’est pas une livraison jetable.",
  },
];

export function Differentiation() {
  return (
    <section id="pourquoi" className="section-pad relative">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">Pourquoi travailler ensemble</p>
          <h2 className="headline mt-4 max-w-3xl text-display-lg">
            Pas de template.
            <span className="block text-accent">Pas de solution générique.</span>
          </h2>
          <p className="lede mt-5">
            Ce que vous achetez, ce n’est pas une page. C’est un produit qui
            sert votre activité.
          </p>
        </Reveal>

        <div className="mt-14 space-y-0">
          {points.map((point, i) => (
            <Reveal key={point.title} delay={i * 0.04}>
              <article
                className={`grid gap-4 border-t border-line py-8 md:grid-cols-[0.4fr_0.15fr_1fr] md:gap-8 md:py-10 ${
                  i === points.length - 1 ? "border-b" : ""
                }`}
              >
                <h3 className="font-display text-2xl tracking-tight md:text-3xl">
                  {point.title}
                </h3>
                <p className="font-display text-accent md:text-right">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="max-w-xl text-lg leading-relaxed text-muted">
                  {point.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <a href="#contact" className="btn btn-primary" data-cursor="interactive">
            Je veux un produit sur mesure
            <span aria-hidden>→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
