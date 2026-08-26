"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "./Reveal";

const intents = [
  {
    id: "site",
    label: "créer un site",
    title: "Créer un site web sur mesure",
    text: "Vitrine, plateforme ou expérience plus ambitieuse : on construit un site qui sert vraiment votre activité — pas une page générique.",
  },
  {
    id: "app",
    label: "créer une application",
    title: "Créer une application",
    text: "Mobile iOS/Android ou application web : on part de l’usage réel pour définir le bon format, puis on développe le produit.",
  },
  {
    id: "auto",
    label: "automatiser quelque chose",
    title: "Automatiser un process",
    text: "Vous perdez du temps sur des tâches répétitives ? On conçoit l’outil ou le flux qui les prend en charge.",
  },
  {
    id: "metier",
    label: "créer un outil métier",
    title: "Créer un outil métier",
    text: "Gestion, suivi, calcul, réservation, organisation… Un logiciel pensé pour votre façon de travailler.",
  },
  {
    id: "idee",
    label: "transformer une idée en produit",
    title: "Transformer une idée en produit",
    text: "Vous avez une intuition, pas encore un cahier des charges. C’est exactement le bon moment pour en parler.",
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
    <section id="projet" className="section-pad relative">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">Votre projet</p>
          <h2 className="headline mt-4 text-display-lg">Vous voulez…</h2>
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
                        ? "border-accent bg-accent text-cta-fg"
                        : "border-line text-mist hover:border-ivory/30 hover:text-ivory"
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
            <div className="relative min-h-[240px] overflow-hidden rounded-[1.5rem] border border-line bg-surface p-8 md:p-10">
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
                  <p className="mt-4 text-lg leading-relaxed text-mist">
                    {current.text}
                  </p>
                  <a
                    href="#contact"
                    className="btn btn-primary mt-8"
                    data-cursor="interactive"
                  >
                    Parler de mon projet
                    <span aria-hidden>→</span>
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
