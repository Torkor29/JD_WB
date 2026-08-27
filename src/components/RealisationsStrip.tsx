"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { projects } from "@/lib/projects";
import { WordsPullUp } from "./WordsPullUp";

export function RealisationsStrip() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="realisations"
      ref={ref}
      className="section-pad overflow-hidden bg-white"
    >
      <div className="container-site">
        <p className="text-[10px] uppercase tracking-[0.18em] text-accent sm:text-xs">
          Réalisations
        </p>
        <h2 className="mt-4 max-w-2xl text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.1] tracking-tight text-ink">
          <WordsPullUp text="Des produits livrés." />
        </h2>
        <p className="mt-4 max-w-xl text-sm text-muted md:text-base">
          Sites, apps et logiciels métiers — livrés et utilisés.
        </p>

        <div className="mt-10 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, i) => (
            <motion.a
              key={project.id}
              href={project.url ?? "#contact"}
              target={project.url ? "_blank" : undefined}
              rel={project.url ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.55,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4 }}
              className="group min-w-0 overflow-hidden rounded-2xl border border-line bg-white shadow-soft"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover object-top transition duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="min-w-0 p-4">
                <p className="truncate text-sm text-muted">{project.category}</p>
                <p className="mt-1 truncate font-medium text-ink">
                  {project.name}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
