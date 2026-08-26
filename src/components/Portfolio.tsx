"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { projects, type Project } from "@/lib/projects";
import { Reveal } from "./Reveal";

function ProjectVisual({ project }: { project: Project }) {
  if (project.id === "d121") {
    return (
      <div
        className="relative h-full min-h-[280px] overflow-hidden rounded-[1.25rem] border border-white/10 p-6 md:min-h-[360px] md:p-8"
        style={{ background: `linear-gradient(145deg, ${project.accentSoft}, #1a1612 60%, #0d0c0a)` }}
      >
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `radial-gradient(circle at 80% 20%, ${project.accent}55, transparent 40%)` }} />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: project.accent }}>
            Revêtements · Brest
          </p>
          <h4 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">D121</h4>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {["PVC", "Moquette", "Lames", "SDB"].map((label) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-5 backdrop-blur-sm"
              >
                <div className="h-16 rounded-lg" style={{ background: `linear-gradient(135deg, ${project.accent}33, transparent)` }} />
                <p className="mt-3 text-sm text-ivory/80">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (project.id === "comptap") {
    return (
      <div
        className="relative flex h-full min-h-[280px] items-center justify-center overflow-hidden rounded-[1.25rem] border border-white/10 md:min-h-[340px]"
        style={{ background: `radial-gradient(circle at 30% 20%, ${project.accent}33, ${project.accentSoft} 55%, #070908)` }}
      >
        <div className="relative w-[70%] max-w-xs rounded-3xl border border-white/10 bg-black/40 p-5 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.16em] text-white/60">Wallet</span>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: project.accent }} />
          </div>
          <p className="mt-6 font-display text-3xl">Comptap</p>
          <p className="mt-2 text-sm text-white/60">Fidélité · NFC · Notifications</p>
          <div className="mt-8 h-10 rounded-xl" style={{ background: project.accent }} />
        </div>
        <div
          className="absolute -right-6 top-10 h-28 w-28 rotate-12 rounded-2xl border border-white/10 bg-black/30 p-3"
          aria-hidden
        >
          <div className="h-full rounded-xl" style={{ background: `${project.accent}22` }} />
        </div>
      </div>
    );
  }

  if (project.id === "vigie") {
    return (
      <div
        className="relative h-full min-h-[280px] overflow-hidden rounded-[1.25rem] border border-white/10 p-5 md:min-h-[360px] md:p-6"
        style={{ background: `linear-gradient(160deg, ${project.accentSoft}, #0a0d14 70%)` }}
      >
        <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="text-xs uppercase tracking-[0.16em] text-white/50">Études</span>
          <span className="rounded-full px-2 py-0.5 text-[0.65rem]" style={{ background: `${project.accent}33`, color: project.accent }}>
            RIPH
          </span>
        </div>
        <div className="grid gap-3">
          {["PROTECT-2", "Amendement n°3", "Centre 04 — monitoring"].map((row, i) => (
            <div
              key={row}
              className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3"
              style={{ transform: `rotate(${i === 1 ? -0.6 : i === 2 ? 0.5 : 0}deg)` }}
            >
              <span className="text-sm">{row}</span>
              <span className="h-2 w-2 rounded-full" style={{ background: project.accent }} />
            </div>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {["TMF", "Queries", "Checklist"].map((t) => (
            <div key={t} className="rounded-lg border border-white/8 px-2 py-3 text-center text-[0.7rem] text-white/60">
              {t}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex h-full min-h-[280px] items-end overflow-hidden rounded-[1.25rem] border border-white/10 p-7 md:min-h-[320px]"
      style={{ background: `linear-gradient(135deg, ${project.accentSoft}, #0b0e08 60%, ${project.accent}22)` }}
    >
      <div className="absolute inset-x-0 top-0 h-40 opacity-40" style={{ background: `radial-gradient(circle at 50% 0%, ${project.accent}, transparent 60%)` }} />
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.18em]" style={{ color: project.accent }}>
          Agriculture
        </p>
        <h4 className="mt-3 font-display text-4xl tracking-tight">Farming Navigator</h4>
        <div className="mt-6 flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-12 flex-1 rounded-md border border-white/10"
              style={{ background: `linear-gradient(180deg, ${project.accent}${20 + i * 10}, transparent)` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectBlock({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const rotate = useTransform(scrollYProgress, [0, 1], index % 2 === 0 ? [-1.2, 1.2] : [1.2, -1.2]);

  const isFull = project.layout === "full";
  const isSplitLeft = project.layout === "split-left";
  const isSplitRight = project.layout === "split-right";

  return (
    <article
      ref={ref}
      className={`relative ${isFull ? "py-8 md:py-14" : "py-10 md:py-16"}`}
      id={`projet-${project.id}`}
    >
      <div
        className={`grid items-center gap-8 lg:gap-12 ${
          isFull
            ? "lg:grid-cols-1"
            : isSplitRight
              ? "lg:grid-cols-[0.95fr_1.05fr]"
              : "lg:grid-cols-[1.05fr_0.95fr]"
        }`}
      >
        <motion.div
          style={{ y, rotate: isFull ? 0 : rotate }}
          className={`${isSplitRight ? "lg:order-2" : ""} ${isFull ? "lg:max-w-5xl" : ""}`}
        >
          <ProjectVisual project={project} />
        </motion.div>

        <div className={`${isFull ? "max-w-3xl" : ""} ${isSplitRight ? "lg:order-1" : ""}`}>
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: `${project.accent}22`, color: project.accent }}
              >
                {project.category}
              </span>
            </div>
            <h3 className="mt-4 font-display text-display-md">{project.name}</h3>
            <dl className="mt-8 space-y-5">
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-mist">Problématique</dt>
                <dd className="mt-2 leading-relaxed text-ivory/90">{project.problem}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-mist">Solution</dt>
                <dd className="mt-2 leading-relaxed text-ivory/90">{project.solution}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-mist">Valeur apportée</dt>
                <dd className="mt-2 leading-relaxed text-ivory/90">{project.outcome}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-mist">
                  {tag}
                </span>
              ))}
            </div>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline mt-8 inline-flex text-sm font-semibold text-accent"
                data-cursor="interactive"
              >
                Voir le projet
                <span aria-hidden>↗</span>
              </a>
            )}
          </Reveal>
        </div>
      </div>
    </article>
  );
}

export function Portfolio() {
  return (
    <section id="realisations" className="section-pad relative overflow-hidden">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">Réalisations</p>
          <h2 className="headline mt-4 max-w-3xl text-display-lg">
            Des produits concrets.
            <span className="block text-mist">Des contextes différents.</span>
          </h2>
          <p className="lede mt-5">
            Pas une galerie de maquettes identiques — des projets réels, chacun
            avec sa logique, son public et son outil.
          </p>
        </Reveal>

        <div className="mt-6 divide-y divide-line/60">
          {projects.map((project, index) => (
            <ProjectBlock key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
