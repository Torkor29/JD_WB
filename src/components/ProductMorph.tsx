"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const frames = [
  {
    id: "web",
    label: "Site web",
    caption: "Vitrine, plateforme, expérience sur mesure",
  },
  {
    id: "mobile",
    label: "Application",
    caption: "iOS & Android pensées pour l’usage réel",
  },
  {
    id: "platform",
    label: "Plateforme",
    caption: "Tableaux de bord, espaces privés, SaaS",
  },
  {
    id: "tool",
    label: "Outil métier",
    caption: "Automatiser ce qui freine votre activité",
  },
] as const;

function FrameContent({ id }: { id: (typeof frames)[number]["id"] }) {
  if (id === "web") {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-1.5 border-b border-line bg-paper-soft px-3 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/70" />
          <span className="ml-2 h-2.5 flex-1 rounded-full bg-paper-mute" />
        </div>
        <div className="grid flex-1 grid-cols-[0.35fr_1fr] gap-3 p-4">
          <div className="space-y-2 rounded-xl bg-paper-soft p-3">
            {["Accueil", "Offre", "Projets", "Contact"].map((item, i) => (
              <div
                key={item}
                className={`rounded-lg px-2 py-2 text-[0.65rem] font-semibold ${
                  i === 1 ? "bg-accent text-white" : "bg-white text-muted"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-gradient-to-br from-accent-soft via-white to-paper-mute p-4">
            <div className="h-3 w-28 rounded-full bg-accent/30" />
            <div className="mt-3 h-3 w-40 rounded-full bg-ink/10" />
            <div className="mt-6 grid grid-cols-2 gap-2">
              <div className="h-20 rounded-lg bg-accent/20" />
              <div className="h-20 rounded-lg bg-accent-deep/15" />
            </div>
            <div className="mt-4 h-8 w-28 rounded-full bg-accent" />
          </div>
        </div>
      </div>
    );
  }

  if (id === "mobile") {
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-b from-accent-soft to-white p-6">
        <div className="h-full w-[46%] max-w-[180px] rounded-[1.6rem] border border-line bg-ink p-2 shadow-lift">
          <div className="flex h-full flex-col rounded-[1.25rem] bg-white p-3">
            <div className="mx-auto h-1 w-10 rounded-full bg-paper-mute" />
            <p className="mt-4 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-accent">
              App
            </p>
            <div className="mt-3 flex-1 rounded-xl bg-gradient-to-br from-accent/20 to-accent-deep/10 p-3">
              <div className="h-2 w-16 rounded-full bg-ink/20" />
              <div className="mt-3 space-y-1.5">
                <div className="h-1.5 rounded-full bg-ink/10" />
                <div className="h-1.5 w-2/3 rounded-full bg-ink/10" />
              </div>
            </div>
            <div className="mt-3 rounded-full bg-accent py-2 text-center text-[0.6rem] font-bold text-white">
              Ouvrir
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (id === "platform") {
    return (
      <div className="flex h-full flex-col bg-paper-soft p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
            Plateforme
          </span>
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[0.6rem] font-semibold text-accent">
            Live
          </span>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-2">
          {["Users", "Ops", "Data"].map((label) => (
            <div key={label} className="rounded-xl border border-line bg-white p-3 shadow-soft">
              <div className="h-8 w-8 rounded-lg bg-accent/15" />
              <p className="mt-3 text-[0.7rem] font-semibold">{label}</p>
              <div className="mt-2 h-1.5 rounded-full bg-paper-mute">
                <div className="h-1.5 w-2/3 rounded-full bg-accent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-between bg-gradient-to-br from-white via-accent-soft to-paper-mute p-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
          Outil métier
        </p>
        <p className="mt-3 font-display text-2xl tracking-tight text-ink">
          Automatiser.
          <br />
          Suivre.
          <br />
          Décider.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {["Import", "Règles", "Alertes", "Export"].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-line bg-white/80 px-3 py-3 text-center text-xs font-semibold text-ink shadow-soft"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductMorph() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setIndex((v) => (v + 1) % frames.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [reduce]);

  const current = frames[index];

  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_50%_30%,rgba(31,94,255,0.18),transparent_65%)] blur-2xl" />

      <div className="overflow-hidden rounded-[1.6rem] border border-line bg-white shadow-lift">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="flex gap-2">
            {frames.map((frame, i) => (
              <button
                key={frame.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`rounded-full px-3 py-1 text-[0.68rem] font-semibold transition ${
                  i === index
                    ? "bg-accent text-white"
                    : "bg-paper-soft text-muted hover:text-ink"
                }`}
                data-cursor="interactive"
              >
                {frame.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative aspect-[5/4] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.98 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <FrameContent id={current.id} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="border-t border-line px-5 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id + "-caption"}
              initial={reduce ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.35 }}
            >
              <p className="font-display text-xl tracking-tight text-ink">
                {current.label}
              </p>
              <p className="mt-1 text-sm text-muted">{current.caption}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted"
        animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        Morphing produit
      </motion.div>
    </div>
  );
}
