"use client";

import { Reveal } from "./Reveal";

const audiences = [
  "Entrepreneurs",
  "TPE / PME",
  "Professionnels",
  "Startups",
  "Associations",
  "Entreprises avec un besoin métier spécifique",
  "Personnes qui ont simplement une idée",
];

export function Audience() {
  return (
    <section id="pour-qui" className="section-pad relative">
      <div className="container-site">
        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <p className="eyebrow">Pour qui</p>
            <h2 className="headline mt-4 text-display-lg">
              Vous n’avez pas besoin de savoir exactement comment le construire.
            </h2>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-mist">
              Vous avez simplement besoin de savoir ce que vous voulez résoudre.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="space-y-0 border-t border-line">
              {audiences.map((item, i) => (
                <li
                  key={item}
                  className="group flex items-center justify-between border-b border-line py-4 transition hover:bg-white/[0.02]"
                >
                  <span className="font-display text-lg tracking-tight md:text-xl">
                    <span className="mr-3 text-sm text-mist">
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
