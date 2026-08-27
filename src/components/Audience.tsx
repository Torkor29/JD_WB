"use client";

import { Reveal } from "./Reveal";

const audiences = [
  "Entrepreneurs qui veulent avancer vite",
  "TPE / PME qui ont besoin d’un vrai outil",
  "Professionnels qui veulent une présence qui convertit",
  "Startups qui passent de l’idée au produit",
  "Associations & structures avec un besoin précis",
  "Entreprises avec un process métier à digitaliser",
  "Personnes qui ont simplement une idée",
];

export function Audience() {
  return (
    <section id="pour-qui" className="section-pad relative bg-paper-soft/80">
      <div className="container-site">
        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <p className="eyebrow">Pour qui</p>
            <h2 className="headline mt-4 text-display-lg">
              Vous n’avez pas besoin de savoir
              <span className="text-accent"> comment le construire.</span>
            </h2>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-muted">
              Vous avez simplement besoin de savoir ce que vous voulez résoudre.
              Le reste, c’est mon métier.
            </p>
            <a href="#contact" className="btn btn-primary mt-8" data-cursor="interactive">
              Expliquer mon besoin
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="space-y-0 border-t border-line">
              {audiences.map((item, i) => (
                <li
                  key={item}
                  className="group flex items-center justify-between border-b border-line py-4 transition hover:bg-white/70"
                >
                  <span className="font-display text-lg tracking-tight md:text-xl">
                    <span className="mr-3 text-sm text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item}
                  </span>
                  <span className="text-accent opacity-0 transition group-hover:opacity-100" aria-hidden>
                    →
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
