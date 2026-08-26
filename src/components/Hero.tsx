"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { capabilities } from "@/lib/site";
import { useIsMobile } from "@/hooks/useMedia";

function DeviceStack({
  mx,
  my,
}: {
  mx: ReturnType<typeof useSpring>;
  my: ReturnType<typeof useSpring>;
}) {
  const rotateX = useTransform(my, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mx, [-0.5, 0.5], [-10, 10]);
  const tx = useTransform(mx, [-0.5, 0.5], [-12, 12]);
  const ty = useTransform(my, [-0.5, 0.5], [-8, 8]);

  const backX = useTransform(mx, [-0.5, 0.5], [-18, 18]);
  const backY = useTransform(my, [-0.5, 0.5], [10, -10]);
  const midX = useTransform(mx, [-0.5, 0.5], [14, -14]);
  const midY = useTransform(my, [-0.5, 0.5], [-12, 12]);
  const frontX = useTransform(mx, [-0.5, 0.5], [-8, 8]);
  const frontY = useTransform(my, [-0.5, 0.5], [6, -6]);

  return (
    <motion.div
      className="relative mx-auto aspect-[4/5] w-full max-w-[520px] [perspective:1200px]"
      style={{ rotateX, rotateY, x: tx, y: ty }}
    >
      <motion.div
        className="absolute inset-[4%_2%_22%_14%] overflow-hidden rounded-[1.35rem] border border-accent/20 bg-surface-raised shadow-[0_40px_100px_rgba(0,0,0,0.55)]"
        style={{ x: backX, y: backY }}
      >
        <div className="flex items-center justify-between border-b border-line bg-ink/40 px-4 py-3">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent">
            Plateforme
          </span>
          <span className="flex items-center gap-2 text-[0.65rem] text-mist">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            Live
          </span>
        </div>
        <div className="grid gap-3 p-4">
          <div className="rounded-xl bg-gradient-to-r from-forest/40 via-accent/10 to-transparent p-3">
            <p className="font-display text-lg tracking-tight">Tableau de bord</p>
            <p className="mt-1 text-xs text-mist">Suivi · Modules · Automatisations</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["Web", "Data", "Ops"].map((label) => (
              <div
                key={label}
                className="rounded-lg border border-line bg-ink/50 px-2 py-3 text-center"
              >
                <div className="mx-auto mb-2 h-8 w-8 rounded-md bg-accent/20 ring-1 ring-accent/30" />
                <span className="text-[0.65rem] text-mist">{label}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[78, 52, 64].map((w, i) => (
              <div key={i} className="h-2 rounded-full bg-ivory/10">
                <div
                  className="h-2 rounded-full bg-accent/70"
                  style={{ width: `${w}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute left-[2%] top-[12%] h-[62%] w-[40%] rounded-[1.55rem] border border-ivory/15 bg-ink p-2 shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
        style={{ x: midX, y: midY }}
      >
        <div className="relative h-full overflow-hidden rounded-[1.15rem] bg-surface">
          <div className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-ivory/15" />
          <div className="flex h-full flex-col p-3 pt-6">
            <p className="text-[0.6rem] uppercase tracking-[0.14em] text-accent">Mobile</p>
            <div className="mt-3 flex-1 rounded-xl bg-gradient-to-br from-accent/25 via-forest/30 to-ink p-3">
              <div className="h-2 w-16 rounded-full bg-ivory/30" />
              <div className="mt-3 space-y-1.5">
                <div className="h-1.5 w-full rounded-full bg-ivory/20" />
                <div className="h-1.5 w-2/3 rounded-full bg-ivory/15" />
              </div>
            </div>
            <div className="mt-3 rounded-full bg-accent px-3 py-2 text-center text-[0.6rem] font-bold text-cta-fg">
              Ouvrir l’app
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-[4%] right-0 h-[50%] w-[72%] overflow-hidden rounded-2xl border border-line bg-[#0c110f] shadow-[0_35px_90px_rgba(0,0,0,0.55)]"
        style={{ x: frontX, y: frontY }}
      >
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/40" />
          <span className="ml-2 h-2.5 flex-1 rounded-full bg-ivory/10" />
          <span className="text-[0.6rem] uppercase tracking-[0.12em] text-mist">Web</span>
        </div>
        <div className="grid h-[calc(100%-2.4rem)] grid-cols-[0.32fr_1fr] gap-2 p-3">
          <div className="space-y-2 rounded-lg bg-surface p-2.5">
            {["Accueil", "Produit", "Clients", "Réglages"].map((item) => (
              <div
                key={item}
                className={`rounded-md px-2 py-1.5 text-[0.58rem] ${
                  item === "Produit"
                    ? "bg-accent/20 text-accent"
                    : "bg-ivory/5 text-mist"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-gradient-to-br from-surface-raised to-ink-mute p-3">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-sm tracking-tight">Produit</span>
              <span className="rounded-full bg-accent px-2 py-0.5 text-[0.55rem] font-semibold text-cta-fg">
                Sur mesure
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-16 rounded-md bg-accent/20 ring-1 ring-accent/30" />
              <div className="h-16 rounded-md bg-forest/40 ring-1 ring-forest/50" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,rgba(212,243,74,0.18),transparent_60%)] blur-2xl" />
    </motion.div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.4 });
  const smy = useSpring(my, { stiffness: 120, damping: 20, mass: 0.4 });
  const glowX = useTransform(smx, [-0.5, 0.5], ["20%", "80%"]);
  const glowY = useTransform(smy, [-0.5, 0.5], ["20%", "70%"]);
  const glow = useMotionTemplate`radial-gradient(600px circle at ${glowX} ${glowY}, rgba(212,243,74,0.12), transparent 45%)`;

  const onMove = (e: React.MouseEvent) => {
    if (reduce || mobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative min-h-[100svh] overflow-hidden pt-[72px]"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: glow }}
      />

      <div className="container-wide relative grid min-h-[calc(100svh-72px)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-16">
        <div className="relative z-10 max-w-3xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="eyebrow mb-6"
          >
            Studio digital indépendant
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="headline text-display-xl"
          >
            Votre idée mérite
            <br />
            mieux qu’un{" "}
            <span className="text-accent">template.</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lede mt-7"
          >
            Sites web, applications mobiles, plateformes et outils métiers —
            conçus et développés entièrement sur mesure, de la première idée
            jusqu’à l’évolution du produit.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a href="#contact" className="btn btn-primary" data-cursor="interactive">
              Parler de mon projet
              <span aria-hidden>→</span>
            </a>
            <a href="#realisations" className="btn btn-secondary" data-cursor="interactive">
              Voir les réalisations
            </a>
          </motion.div>

          <motion.ul
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex flex-wrap gap-2"
            aria-label="Capacités"
          >
            {capabilities.map((cap) => (
              <li
                key={cap}
                className="rounded-full border border-line bg-surface/50 px-3.5 py-1.5 text-[0.7rem] font-semibold tracking-[0.14em] text-mist"
              >
                {cap}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <DeviceStack mx={smx} my={smy} />
          <p className="mt-6 text-center text-sm text-mist lg:text-left">
            Un site. Une application. Un outil métier.
            <span className="block text-ivory/90">
              Votre projet, développé sur mesure.
            </span>
          </p>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
    </section>
  );
}
