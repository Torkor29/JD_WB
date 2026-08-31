"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const phases = [
  {
    n: "01",
    title: "On échange",
    text: "Comprendre le besoin métier, les utilisateurs et le résultat attendu — sans jargon.",
  },
  {
    n: "02",
    title: "On imagine",
    text: "La solution utile : site, app, RDV, paiement… seulement ce qui sert vraiment.",
  },
  {
    n: "03",
    title: "On conçoit",
    text: "Parcours, écrans et architecture clairs — prêts à être développés.",
  },
  {
    n: "04",
    title: "On développe",
    text: "Le produit prend forme, itération après itération, avec des livraisons visibles.",
  },
  {
    n: "05",
    title: "On lance",
    text: "Mise en ligne, publication stores si besoin, et formation courte à l’usage.",
  },
  {
    n: "06",
    title: "On évolue",
    text: "Maintenance, correctifs et nouvelles fonctionnalités au rythme de votre activité.",
  },
];

export function MethodCinematic() {
  const [active, setActive] = useState(0);

  return (
    <section id="methode" className="section-pad overflow-hidden bg-paper-soft">
      <div className="container-site">
        <p className="text-[10px] uppercase tracking-[0.18em] text-accent sm:text-xs">
          Méthode
        </p>
        <h2 className="mt-4 max-w-2xl break-words text-[clamp(1.65rem,4vw,3rem)] font-medium leading-[1.1] tracking-tight text-ink text-pretty">
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
                className="mt-4 min-w-0 px-1 pb-2"
              >
                <h3 className="text-xl text-ink">{phases[active].title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {phases[active].text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="hidden min-w-0 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="min-w-0 border-r border-line p-2">
              {phases.map((phase, i) => (
                <button
                  key={phase.n}
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full min-w-0 items-center gap-4 rounded-xl px-5 py-4 text-left transition ${
                    active === i ? "bg-accent-soft" : "hover:bg-paper-soft"
                  }`}
                >
                  <span
                    className={`shrink-0 text-sm ${
                      active === i ? "text-accent" : "text-muted"
                    }`}
                  >
                    {phase.n}
                  </span>
                  <span
                    className={`truncate text-lg ${
                      active === i ? "text-ink" : "text-muted"
                    }`}
                  >
                    {phase.title}
                  </span>
                </button>
              ))}
            </div>
            <div className="min-w-0 overflow-hidden p-10 xl:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.35 }}
                  className="min-w-0"
                >
                  <p className="text-[clamp(3.5rem,8vw,6rem)] leading-none text-accent/15">
                    {phases[active].n}
                  </p>
                  <h3 className="mt-2 text-2xl text-ink xl:text-3xl">
                    {phases[active].title}
                  </h3>
                  <p className="mt-4 max-w-md text-muted">
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
