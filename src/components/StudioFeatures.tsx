"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useRef } from "react";
import { WordsPullUpMultiStyle } from "./WordsPullUpMultiStyle";

const cards = [
  {
    id: "canvas",
    type: "video" as const,
    title: "Votre terrain digital.",
    video: "/videos/plage-feature.mp4",
    poster: "/beach/coast.jpg",
  },
  {
    id: "sites",
    type: "list" as const,
    n: "01",
    title: "Sites web sur mesure.",
    items: [
      "Vitrine qui convertit",
      "Parcours pensés pour votre public",
      "Design adapté à votre métier",
      "Mise en ligne & suivi",
    ],
  },
  {
    id: "apps",
    type: "list" as const,
    n: "02",
    title: "Apps & plateformes.",
    items: [
      "Applications mobiles iOS / Android",
      "Applications web & dashboards",
      "Espaces clients / équipes",
    ],
  },
  {
    id: "metiers",
    type: "list" as const,
    n: "03",
    title: "Outils métiers.",
    items: [
      "Prise de RDV & rappels",
      "Fidélisation / Wallet",
      "Automatisation de vos process",
    ],
  },
];

function FeatureCard({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : undefined}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

export function StudioFeatures() {
  return (
    <section id="services" className="relative min-h-screen bg-black py-16 sm:py-20">
      <div
        aria-hidden
        className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <WordsPullUpMultiStyle
            className="justify-center text-xl font-normal sm:text-2xl md:text-3xl lg:text-4xl"
            segments={[
              {
                text: "Des workflows clairs pour des projets concrets.",
                className: "text-primary-soft",
              },
            ]}
          />
          <div className="mt-2">
            <WordsPullUpMultiStyle
              className="justify-center text-xl font-normal sm:text-2xl md:text-3xl lg:text-4xl"
              delay={0.25}
              segments={[
                {
                  text: "Pensés pour votre métier. Portés par le code.",
                  className: "text-gray-500",
                },
              ]}
            />
          </div>
        </div>

        <div className="mt-12 grid gap-3 sm:mt-14 sm:gap-2 md:grid-cols-2 md:gap-1 lg:h-[480px] lg:grid-cols-4">
          {cards.map((card, i) => (
            <FeatureCard key={card.id} index={i}>
              {card.type === "video" ? (
                <div className="relative h-full min-h-[280px] overflow-hidden rounded-2xl lg:min-h-0">
                  <video
                    className="absolute inset-0 h-full w-full object-cover animate-kenburns"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={card.poster}
                  >
                    <source src={card.video} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                  <p
                    className="absolute bottom-5 left-5 right-5 text-lg font-medium sm:text-xl"
                    style={{ color: "#E1E0CC" }}
                  >
                    {card.title}
                  </p>
                </div>
              ) : (
                <div className="flex h-full min-h-[280px] flex-col rounded-2xl bg-[#212121] p-5 sm:p-6 lg:min-h-0">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 sm:h-12 sm:w-12">
                    <span className="text-xs font-bold text-primary">{card.n}</span>
                  </div>
                  <h3 className="text-lg font-medium text-primary-soft sm:text-xl">
                    <span className="mr-2 text-sm text-gray-500">{card.n}</span>
                    {card.title}
                  </h3>
                  <ul className="mt-5 flex-1 space-y-3">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-gray-400">
                        <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:gap-3"
                  >
                    En savoir plus
                    <ArrowRight size={14} className="-rotate-45" />
                  </a>
                </div>
              )}
            </FeatureCard>
          ))}
        </div>
      </div>
    </section>
  );
}
