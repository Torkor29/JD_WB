"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "./Reveal";

const phases = [
  {
    n: "01",
    title: "On échange",
    text: "Comprendre le projet, le besoin et les objectifs. Sans jargon, sans brief interminable.",
  },
  {
    n: "02",
    title: "On imagine",
    text: "Définir la meilleure expérience et les fonctionnalités vraiment utiles.",
  },
  {
    n: "03",
    title: "On conçoit",
    text: "UX, UI, architecture et parcours utilisateurs — avant d’écrire la moindre ligne inutile.",
  },
  {
    n: "04",
    title: "On développe",
    text: "Construction du produit numérique, itération après itération.",
  },
  {
    n: "05",
    title: "On lance",
    text: "Mise en ligne, publication ou déploiement. Le produit rencontre ses utilisateurs.",
  },
  {
    n: "06",
    title: "On fait évoluer",
    text: "Maintenance, améliorations et nouvelles fonctionnalités au fil du réel.",
  },
];

export function Method() {
  const [active, setActive] = useState(0);

  return (
    <section id="methode" className="section-pad relative">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">La méthode</p>
          <h2 className="headline mt-4 max-w-3xl text-display-lg">
            Simple. Claire.
            <span className="block">Sans mauvaise surprise.</span>
          </h2>
        </Reveal>

        <div className="mt-14 overflow-hidden rounded-[1.6rem] border border-line bg-surface">
          <div className="grid lg:grid-cols-[1fr_1.1fr]">
            <div className="border-b border-line p-2 lg:border-b-0 lg:border-r">
              {phases.map((phase, i) => (
                <button
                  key={phase.n}
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-center gap-4 rounded-xl px-4 py-4 text-left transition md:px-5 ${
                    active === i ? "bg-accent/10" : "hover:bg-white/[0.03]"
                  }`}
                  data-cursor="interactive"
                >
                  <span
                    className={`font-display text-sm ${
                      active === i ? "text-accent" : "text-mist"
                    }`}
                  >
                    {phase.n}
                  </span>
                  <span
                    className={`font-display text-lg tracking-tight md:text-xl ${
                      active === i ? "text-ivory" : "text-mist"
                    }`}
                  >
                    {phase.title}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative min-h-[280px] p-8 md:p-12">
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <p className="font-display text-[6rem] leading-none text-accent/20 md:text-[7.5rem]">
                    {phases[active].n}
                  </p>
                  <h3 className="mt-2 font-display text-display-md">
                    {phases[active].title}
                  </h3>
                  <p className="mt-5 max-w-md text-lg leading-relaxed text-mist">
                    {phases[active].text}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
