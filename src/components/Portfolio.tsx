"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { projects, type Project } from "@/lib/projects";
import { Reveal } from "./Reveal";

function BrowserPreview({ project }: { project: Project }) {
  return (
    <div className="browser-frame group overflow-hidden transition duration-500 hover:-translate-y-1 hover:shadow-lift">
      <div className="browser-chrome">
        <span />
        <span />
        <span />
        <div className="ml-3 flex-1 truncate rounded-full bg-white px-3 py-1 text-[0.65rem] text-muted">
          {project.url?.replace(/^https?:\/\//, "")}
        </div>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-paper-soft">
        <Image
          src={project.image}
          alt={`Aperçu du projet ${project.name}`}
          fill
          className="object-cover object-top transition duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
      </div>
    </div>
  );
}

function ProjectBlock({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [36, -36]);
  const flip = index % 2 === 1;

  return (
    <article
      ref={ref}
      id={`projet-${project.id}`}
      className="border-t border-line py-14 md:py-20"
    >
      <div
        className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
          flip ? "" : ""
        }`}
      >
        <motion.div style={{ y }} className={flip ? "lg:order-2" : ""}>
          <BrowserPreview project={project} />
        </motion.div>

        <Reveal className={flip ? "lg:order-1" : ""}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: `${project.accent}18`, color: project.accent }}
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
              <dd className="mt-1.5 leading-relaxed text-ink/90">{project.problem}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                Solution
              </dt>
              <dd className="mt-1.5 leading-relaxed text-ink/90">{project.solution}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                Résultat
              </dt>
              <dd className="mt-1.5 leading-relaxed text-ink/90">{project.outcome}</dd>
            </div>
          </dl>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line px-3 py-1 text-xs text-muted"
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
            <a href="#contact" className="btn btn-primary" data-cursor="interactive">
              Un projet similaire ?
            </a>
          </div>
        </Reveal>
      </div>
    </article>
  );
}

export function Portfolio() {
  return (
    <section id="realisations" className="section-pad relative">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">Réalisations</p>
          <h2 className="headline mt-4 max-w-3xl text-display-lg">
            Des produits livrés.
            <span className="block text-accent">Pas des maquettes génériques.</span>
          </h2>
          <p className="lede mt-5">
            Sites, produits digitaux et logiciels métiers — chacun avec sa
            logique, son public et son aperçu réel.
          </p>
        </Reveal>

        <div className="mt-4">
          {projects.map((project, index) => (
            <ProjectBlock key={project.id} project={project} index={index} />
          ))}
        </div>

        <Reveal className="mt-6 rounded-[1.5rem] border border-line bg-accent-soft/60 p-6 md:flex md:items-center md:justify-between md:p-8">
          <div>
            <p className="font-display text-2xl tracking-tight">
              Votre projet peut être le prochain.
            </p>
            <p className="mt-2 text-muted">
              Même s’il n’existe encore que dans votre tête.
            </p>
          </div>
          <a href="#devis" className="btn btn-primary mt-5 md:mt-0" data-cursor="interactive">
            Estimer mon devis
          </a>
        </Reveal>
      </div>
    </section>
  );
}
