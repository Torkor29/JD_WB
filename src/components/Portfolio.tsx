"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { projects, type Project } from "@/lib/projects";
import { Reveal } from "./Reveal";
import { useIsMobile } from "@/hooks/useMedia";

function ProjectVisual({ project, large = false }: { project: Project; large?: boolean }) {
  const minH = large ? "min-h-[420px] md:min-h-[520px]" : "min-h-[280px] md:min-h-[360px]";

  if (project.id === "d121") {
    return (
      <div
        className={`relative h-full overflow-hidden rounded-[1.4rem] border border-white/10 p-6 md:p-9 ${minH}`}
        style={{
          background: `linear-gradient(145deg, ${project.accentSoft}, #1a1612 55%, #0d0c0a)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at 80% 15%, ${project.accent}55, transparent 42%)`,
          }}
        />
        <div className="relative flex h-full flex-col">
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: project.accent }}>
            Revêtements · Brest
          </p>
          <h4 className="mt-4 font-display text-5xl tracking-tight md:text-6xl">D121</h4>
          <p className="mt-3 max-w-md text-sm text-ivory/70">
            Site vitrine orienté devis pour un artisan spécialisé en sols souples.
          </p>
          <div className="mt-auto grid gap-3 pt-8 sm:grid-cols-2">
            {["PVC", "Moquette", "Lames", "SDB"].map((label) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-black/25 px-4 py-5 backdrop-blur-sm transition duration-500 hover:-translate-y-1"
              >
                <div
                  className="h-16 rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${project.accent}44, transparent)`,
                  }}
                />
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
        className={`relative flex h-full items-center justify-center overflow-hidden rounded-[1.4rem] border border-white/10 ${minH}`}
        style={{
          background: `radial-gradient(circle at 30% 20%, ${project.accent}40, ${project.accentSoft} 55%, #070908)`,
        }}
      >
        <div className="absolute left-[8%] top-[18%] hidden h-36 w-28 -rotate-6 rounded-2xl border border-white/10 bg-black/25 p-3 md:block" />
        <div className="relative z-10 w-[78%] max-w-sm rounded-[1.6rem] border border-white/10 bg-black/45 p-6 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.16em] text-white/60">Wallet</span>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: project.accent }} />
          </div>
          <p className="mt-8 font-display text-4xl">Comptap</p>
          <p className="mt-2 text-sm text-white/60">Fidélité · NFC · Notifications</p>
          <div className="mt-10 grid grid-cols-3 gap-2">
            {["Scan", "Points", "Push"].map((label) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 px-2 py-3 text-center text-[0.7rem] text-white/70"
              >
                {label}
              </div>
            ))}
          </div>
          <div className="mt-5 h-11 rounded-xl" style={{ background: project.accent }} />
        </div>
        <div
          className="absolute -right-4 top-12 h-32 w-32 rotate-12 rounded-2xl border border-white/10 bg-black/30 p-3 md:right-8"
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
        className={`relative h-full overflow-hidden rounded-[1.4rem] border border-white/10 p-5 md:p-7 ${minH}`}
        style={{ background: `linear-gradient(160deg, ${project.accentSoft}, #0a0d14 70%)` }}
      >
        <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="text-xs uppercase tracking-[0.16em] text-white/50">Études</span>
          <span
            className="rounded-full px-2 py-0.5 text-[0.65rem]"
            style={{ background: `${project.accent}33`, color: project.accent }}
          >
            RIPH
          </span>
        </div>
        <div className="grid gap-3">
          {["PROTECT-2", "Amendement n°3", "Centre 04 — monitoring"].map((row, i) => (
            <div
              key={row}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5"
              style={{ transform: `rotate(${i === 1 ? -0.8 : i === 2 ? 0.7 : 0}deg)` }}
            >
              <span className="text-sm md:text-base">{row}</span>
              <span className="h-2 w-2 rounded-full" style={{ background: project.accent }} />
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2">
          {["TMF", "Queries", "Checklist"].map((t) => (
            <div
              key={t}
              className="rounded-lg border border-white/10 px-2 py-4 text-center text-[0.7rem] text-white/60"
            >
              {t}
            </div>
          ))}
        </div>
        <div
          className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full blur-3xl"
          style={{ background: `${project.accent}33` }}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex h-full items-end overflow-hidden rounded-[1.4rem] border border-white/10 p-7 md:p-9 ${minH}`}
      style={{
        background: `linear-gradient(135deg, ${project.accentSoft}, #0b0e08 55%, ${project.accent}22)`,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-48 opacity-45"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${project.accent}, transparent 60%)`,
        }}
      />
      <div className="relative w-full">
        <p className="text-xs uppercase tracking-[0.18em]" style={{ color: project.accent }}>
          Agriculture
        </p>
        <h4 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
          Farming Navigator
        </h4>
        <div className="mt-8 flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 flex-1 rounded-md border border-white/10"
              style={{
                background: `linear-gradient(180deg, ${project.accent}${18 + i * 12}, transparent)`,
                transform: `translateY(${(i % 2) * 8}px)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectCopy({ project, index }: { project: Project; index: number }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">
          {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
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
          className="link-underline mt-8 inline-flex text-sm font-semibold"
          style={{ color: project.accent }}
          data-cursor="interactive"
        >
          Voir le projet
          <span aria-hidden>↗</span>
        </a>
      )}
    </div>
  );
}

function StickyProject({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const visualY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : index % 2 === 0 ? [-1.8, 1.8] : [1.8, -1.8],
  );
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0.35, 1, 1, 0.45]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.96, 1, 1, 0.98]);

  const flip = index % 2 === 1;

  return (
    <article
      ref={ref}
      id={`projet-${project.id}`}
      className="relative min-h-[100svh] border-t border-line/50"
      style={{ zIndex: index + 1 }}
    >
      <div
        className="sticky top-[72px] flex min-h-[calc(100svh-72px)] items-center py-10"
        style={{
          background: `linear-gradient(180deg, rgba(7,9,8,0.92), rgba(7,9,8,0.98))`,
        }}
      >
        <motion.div
          style={{ opacity, scale }}
          className="container-wide grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-14"
        >
          <motion.div
            style={{ y: visualY, rotate }}
            className={flip ? "lg:order-2" : "lg:order-1"}
          >
            <ProjectVisual project={project} large />
          </motion.div>
          <div className={flip ? "lg:order-1" : "lg:order-2"}>
            <ProjectCopy project={project} index={index} />
          </div>
        </motion.div>
      </div>
    </article>
  );
}

function MobileProject({ project, index }: { project: Project; index: number }) {
  return (
    <article
      id={`projet-${project.id}`}
      className="border-t border-line/60 py-12"
    >
      <Reveal>
        <ProjectVisual project={project} />
        <div className="mt-8">
          <ProjectCopy project={project} index={index} />
        </div>
      </Reveal>
    </article>
  );
}

export function Portfolio() {
  const mobile = useIsMobile(1024);

  return (
    <section id="realisations" className="relative overflow-hidden">
      <div className="container-site section-pad pb-8 md:pb-12">
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
      </div>

      <div className="relative">
        {projects.map((project, index) =>
          mobile ? (
            <MobileProject key={project.id} project={project} index={index} />
          ) : (
            <StickyProject key={project.id} project={project} index={index} />
          ),
        )}
      </div>
    </section>
  );
}
