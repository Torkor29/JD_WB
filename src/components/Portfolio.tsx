"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { projects, type Project } from "@/lib/projects";
import { Reveal } from "./Reveal";

function BrowserPreview({
  project,
  priority,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <div className="browser-frame overflow-hidden shadow-[0_24px_80px_rgba(11,31,58,0.18)] ring-1 ring-black/5">
      <div className="browser-chrome">
        <span />
        <span />
        <span />
        <div className="ml-3 flex-1 truncate rounded-full bg-white px-3 py-1 text-[0.65rem] text-muted">
          {project.url?.replace(/^https?:\/\//, "") ?? project.name.toLowerCase()}
        </div>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-paper-soft">
        <Image
          src={project.image}
          alt={`Aperçu du projet ${project.name}`}
          fill
          priority={priority}
          className="object-cover object-top"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
      </div>
    </div>
  );
}

export function Portfolio() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const reduce = useReducedMotion();
  const project = projects[index];

  const go = useCallback(
    (dir: number) => {
      setDirection(dir);
      setIndex((i) => (i + dir + projects.length) % projects.length);
    },
    [],
  );

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => go(1), 7000);
    return () => window.clearInterval(id);
  }, [go, reduce, index]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.96,
      rotateY: dir > 0 ? -6 : 6,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      scale: 0.96,
      rotateY: dir > 0 ? 6 : -6,
    }),
  };

  return (
    <section
      id="realisations"
      className="section-pad relative overflow-hidden bg-paper-soft/70"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="container-site relative">
        <Reveal>
          <div className="mb-6 flex items-center gap-3 sm:mb-8">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-white sm:h-7 sm:w-7 sm:text-[12px]">
              2
            </span>
            <span className="rounded-full border border-line px-3 py-1 text-[12px] font-medium text-ink sm:px-4 sm:py-1.5 sm:text-[13px]">
              Réalisations
            </span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="headline mt-0 text-display-lg">
                Des produits livrés.
                <span className="block text-accent">Avec de vrais aperçus.</span>
              </h2>
              <p className="lede mt-5">
                Faites défiler les réalisations — chaque carte a du relief,
                de l’ombre et un aperçu réel du site ou de l’outil.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-soft transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lift"
                aria-label="Réalisation précédente"
                data-cursor="interactive"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-soft transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lift"
                aria-label="Réalisation suivante"
                data-cursor="interactive"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 perspective-[1400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.article
              key={project.id}
              id={`projet-${project.id}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                animate={
                  reduce
                    ? undefined
                    : { y: [0, -8, 0] }
                }
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <div
                  aria-hidden
                  className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-accent/20 via-transparent to-ink/10 blur-2xl"
                />
                <BrowserPreview project={project} priority={index === 0} />
              </motion.div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(projects.length).padStart(2, "0")}
                  </span>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      background: `${project.accent}18`,
                      color: project.accent,
                    }}
                  >
                    {project.category}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-display-md">{project.name}</h3>
                <dl className="mt-7 space-y-4">
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                      Problématique
                    </dt>
                    <dd className="mt-1.5 leading-relaxed text-ink/90">
                      {project.problem}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                      Solution
                    </dt>
                    <dd className="mt-1.5 leading-relaxed text-ink/90">
                      {project.solution}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                      Résultat
                    </dt>
                    <dd className="mt-1.5 leading-relaxed text-ink/90">
                      {project.outcome}
                    </dd>
                  </div>
                </dl>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-line bg-white px-3 py-1 text-xs text-muted shadow-soft"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      data-cursor="interactive"
                    >
                      Voir le site
                      <span aria-hidden>↗</span>
                    </a>
                  )}
                  <a
                    href="#contact"
                    className="btn btn-primary"
                    data-cursor="interactive"
                  >
                    Un projet similaire ?
                  </a>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex justify-center gap-2">
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Aller à ${p.name}`}
              aria-current={i === index}
              className={`h-2.5 rounded-full transition-all ${
                i === index
                  ? "w-8 bg-accent shadow-[0_0_0_4px_rgba(31,94,255,0.15)]"
                  : "w-2.5 bg-ink/20 hover:bg-ink/40"
              }`}
              data-cursor="interactive"
            />
          ))}
        </div>

        {/* Mini strip of other previews */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((p, i) => {
            const active = i === index;
            return (
              <button
                key={`thumb-${p.id}`}
                type="button"
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className={`group overflow-hidden rounded-2xl border bg-white text-left transition duration-400 ${
                  active
                    ? "border-accent/40 shadow-lift"
                    : "border-line shadow-soft hover:-translate-y-1 hover:shadow-lift"
                }`}
                data-cursor="interactive"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 50vw, 22vw"
                  />
                </div>
                <div className="px-3 py-3">
                  <p className="font-display text-sm tracking-tight">{p.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{p.category}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
