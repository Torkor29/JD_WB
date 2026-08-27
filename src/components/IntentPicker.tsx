"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "./Reveal";

const intents = [
  {
    id: "site",
    label: "créer un site",
    title: "Créer un site web qui convertit",
    text: "Vitrine, plateforme ou expérience ambitieuse : un site pensé pour votre activité, pas un modèle recyclé.",
  },
  {
    id: "app",
    label: "créer une application",
    title: "Créer une application utile",
    text: "Mobile ou web : on part de l’usage réel pour définir le bon format, puis on développe le produit.",
  },
  {
    id: "auto",
    label: "automatiser quelque chose",
    title: "Automatiser un process",
    text: "Vous perdez du temps sur des tâches répétitives ? On conçoit l’outil qui les prend en charge.",
  },
  {
    id: "metier",
    label: "créer un outil métier",
    title: "Créer un outil métier",
    text: "Gestion, suivi, calcul, réservation… Un logiciel pensé pour votre façon de travailler.",
  },
  {
    id: "idee",
    label: "transformer une idée en produit",
    title: "Transformer une idée en produit",
    text: "Vous avez une intuition, pas encore un brief. C’est exactement le bon moment pour en parler.",
  },
  {
    id: "exist",
    label: "améliorer un outil existant",
    title: "Améliorer un outil existant",
    text: "Refonte, nouvelles fonctionnalités, performance, UX : on fait évoluer ce qui existe déjà.",
  },
];

export function IntentPicker() {
  const [active, setActive] = useState(intents[0].id);
  const current = intents.find((i) => i.id === active) ?? intents[0];

  return (
    <section id="projet" className="section-pad relative bg-paper-soft/70">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">Votre projet</p>
          <h2 className="headline mt-4 text-display-lg">
            Vous voulez…
            <span className="text-accent"> concrètement ?</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:gap-12">
          <Reveal>
            <div className="flex flex-wrap gap-3">
              {intents.map((intent) => {
                const selected = intent.id === active;
                return (
                  <button
                    key={intent.id}
                    type="button"
                    onClick={() => setActive(intent.id)}
                    className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                      selected
                        ? "border-accent bg-accent text-white"
                        : "border-line bg-white text-muted hover:border-accent/40 hover:text-ink"
                    }`}
                    data-cursor="interactive"
                    aria-pressed={selected}
                  >
                    {intent.label}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative min-h-[240px] overflow-hidden rounded-[1.5rem] border border-line bg-white p-8 shadow-card md:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3 className="font-display text-2xl tracking-tight md:text-3xl">
                    {current.title}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-muted">
                    {current.text}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href="#devis" className="btn btn-secondary" data-cursor="interactive">
                      Estimer
                    </a>
                    <a href="#contact" className="btn btn-primary" data-cursor="interactive">
                      Parler de mon projet
                      <span aria-hidden>→</span>
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
