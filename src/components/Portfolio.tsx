"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { projects, type Project } from "@/lib/projects";
import { Reveal } from "./Reveal";
import { useIsMobile } from "@/hooks/useMedia";

function BrowserPreview({
  project,
  priority,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <div className="browser-frame overflow-hidden shadow-[0_12px_40px_rgba(11,31,58,0.14)] ring-1 ring-black/5 sm:shadow-[0_24px_80px_rgba(11,31,58,0.18)]">
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
  const [openDetail, setOpenDetail] = useState(false);
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const project = projects[index];
  const touchX = useRef<number | null>(null);

  const go = useCallback((dir: number) => {
    setDirection(dir);
    setOpenDetail(false);
    setIndex((i) => (i + dir + projects.length) % projects.length);
  }, []);

  useEffect(() => {
    if (reduce || mobile) return;
    const id = window.setInterval(() => go(1), 7000);
    return () => window.clearInterval(id);
  }, [go, reduce, mobile, index]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 48 : -48,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -32 : 32,
      opacity: 0,
    }),
  };

  return (
    <section
      id="realisations"
      className="section-pad relative overflow-hidden bg-paper-soft/70"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 hidden h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl sm:block"
      />
      <div className="container-site relative">
        <Reveal>
          <div className="mb-5 flex items-center gap-3 sm:mb-8">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-white sm:h-7 sm:w-7 sm:text-[12px]">
              2
            </span>
            <span className="rounded-full border border-line px-3 py-1 text-[12px] font-medium text-ink sm:px-4 sm:py-1.5 sm:text-[13px]">
              Réalisations
            </span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="headline mt-0 text-display-lg">
                Des produits livrés.
                <span className="block text-accent">Avec de vrais aperçus.</span>
              </h2>
              <p className="lede mt-4 sm:mt-5">
                Faites défiler les réalisations — chaque carte a du relief,
                de l’ombre et un aperçu réel du site ou de l’outil.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-soft transition active:scale-95"
                aria-label="Réalisation précédente"
                data-cursor="interactive"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-soft transition active:scale-95"
                aria-label="Réalisation suivante"
                data-cursor="interactive"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </Reveal>

        <div
          className="mt-8 sm:mt-12"
          onTouchStart={(e) => {
            touchX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) < 50) return;
            go(dx < 0 ? 1 : -1);
          }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.article
              key={project.id}
              id={`projet-${project.id}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid items-center gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12"
            >
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute -inset-3 -z-10 hidden rounded-[2rem] bg-gradient-to-br from-accent/20 via-transparent to-ink/10 blur-2xl sm:block sm:-inset-4"
                />
                <BrowserPreview project={project} priority={index === 0} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
                <h3 className="mt-3 font-display text-display-md sm:mt-4">
                  {project.name}
                </h3>

                {/* Mobile: short + accordion */}
                <div className="mt-4 sm:hidden">
                  <p className="leading-relaxed text-ink/90">{project.outcome}</p>
                  <button
                    type="button"
                    onClick={() => setOpenDetail((v) => !v)}
                    className="mt-3 text-sm font-semibold text-accent"
                    aria-expanded={openDetail}
                  >
                    {openDetail ? "Masquer le détail" : "Voir le détail"}
                  </button>
                  <AnimatePresence>
                    {openDetail && (
                      <motion.dl
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-3 overflow-hidden"
                      >
                        <div>
                          <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                            Problématique
                          </dt>
                          <dd className="mt-1 text-sm leading-relaxed text-ink/90">
                            {project.problem}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                            Solution
                          </dt>
                          <dd className="mt-1 text-sm leading-relaxed text-ink/90">
                            {project.solution}
                          </dd>
                        </div>
                      </motion.dl>
                    )}
                  </AnimatePresence>
                </div>

                {/* Desktop: full */}
                <dl className="mt-7 hidden space-y-4 sm:block">
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

                <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-line bg-white px-3 py-1 text-xs text-muted shadow-soft"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary w-full sm:w-auto"
                      data-cursor="interactive"
                    >
                      Voir le site
                      <span aria-hidden>↗</span>
                    </a>
                  )}
                  <a
                    href="#contact"
                    className="btn btn-primary w-full sm:w-auto"
                    data-cursor="interactive"
                  >
                    Un projet similaire ?
                  </a>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center gap-2 sm:mt-10">
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
                setOpenDetail(false);
              }}
              aria-label={`Aller à ${p.name}`}
              aria-current={i === index}
              className={`h-2.5 rounded-full transition-all ${
                i === index
                  ? "w-8 bg-accent shadow-[0_0_0_4px_rgba(31,94,255,0.15)]"
                  : "w-2.5 bg-ink/20"
              }`}
              data-cursor="interactive"
            />
          ))}
        </div>

        <div className="mt-8 -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 sm:mt-12 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
          {projects.map((p, i) => {
            const active = i === index;
            return (
              <button
                key={`thumb-${p.id}`}
                type="button"
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                  setOpenDetail(false);
                }}
                className={`w-[68%] shrink-0 overflow-hidden rounded-2xl border bg-white text-left transition sm:w-auto ${
                  active
                    ? "border-accent/40 shadow-lift"
                    : "border-line shadow-soft"
                }`}
                data-cursor="interactive"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 70vw, 22vw"
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
