"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const phases = [
  { n: "01", title: "On échange", text: "Comprendre le besoin, sans jargon." },
  { n: "02", title: "On imagine", text: "La solution utile — pas la plus complexe." },
  { n: "03", title: "On conçoit", text: "UX, UI, motion et architecture." },
  { n: "04", title: "On développe", text: "Le produit prend forme, itération après itération." },
  { n: "05", title: "On lance", text: "Mise en ligne, publication, déploiement." },
  { n: "06", title: "On évolue", text: "Maintenance et nouvelles fonctionnalités." },
];

export function MethodCinematic() {
  const [active, setActive] = useState(0);

  return (
    <section id="methode" className="section-pad bg-paper-soft">
      <div className="container-site">
        <p className="text-[10px] uppercase tracking-[0.18em] text-accent sm:text-xs">
          Méthode
        </p>
        <h2 className="mt-4 max-w-2xl text-3xl font-medium tracking-tight text-ink sm:text-4xl md:text-5xl">
          Simple. Claire. Sans mauvaise surprise.
        </h2>

        <div className="mt-10 overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-card">
          <div className="border-b border-line p-3 lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {phases.map((p, i) => (
                <button
                  key={p.n}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition ${
                    active === i
                      ? "bg-ink text-white"
                      : "bg-paper-soft text-muted"
                  }`}
                >
                  {p.n}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 px-1 pb-2"
              >
                <h3 className="text-xl text-ink">{phases[active].title}</h3>
                <p className="mt-2 text-sm text-muted">{phases[active].text}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="hidden lg:grid lg:grid-cols-[1fr_1.1fr]">
            <div className="border-r border-line p-2">
              {phases.map((phase, i) => (
                <button
                  key={phase.n}
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-center gap-4 rounded-xl px-5 py-4 text-left transition ${
                    active === i ? "bg-accent-soft" : "hover:bg-paper-soft"
                  }`}
                >
                  <span className={`text-sm ${active === i ? "text-accent" : "text-muted"}`}>
                    {phase.n}
                  </span>
                  <span className={`text-lg ${active === i ? "text-ink" : "text-muted"}`}>
                    {phase.title}
                  </span>
                </button>
              ))}
            </div>
            <div className="p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-[6rem] leading-none text-accent/15">
                    {phases[active].n}
                  </p>
                  <h3 className="mt-2 text-3xl text-ink">{phases[active].title}</h3>
                  <p className="mt-4 max-w-md text-muted">{phases[active].text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
