"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect } from "react";

/**
 * Scène hero — l'illustration est décomposée en calques par
 * `scripts/split-hero-layers.py` :
 *   - hero-base        : l'illustration complète, immobile
 *   - hero-sky-drift   : la portion de ciel sans premier plan, qui dérive
 *                        lentement au-dessus du fond (les nuages bougent
 *                        vraiment, rien n'est redessiné)
 *   - hero-sea-mask    : masque de l'eau, qui confine les vaguelettes
 *   - hero-screen-glow : halo de l'écran du laptop
 *
 * Tous les calques partagent le même cadrage. L'ancrage est volontairement
 * centré : `object-position: 50% 50%` est le strict équivalent du
 * `preserveAspectRatio="xMidYMid slice"` d'un SVG, ce qui permet de dessiner
 * l'animation de l'eau directement dans les coordonnées de l'illustration.
 */
const ANCHOR = "50% 50%";
const ART_W = 1536;
const ART_H = 1024;

export function BeachWorkspaceScene() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 32, damping: 24, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 32, damping: 24, mass: 0.6 });

  const skyX = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const skyY = useTransform(sy, [-0.5, 0.5], [-5, 5]);
  const birdX = useTransform(sx, [-0.5, 0.5], [-16, 16]);
  const birdY = useTransform(sy, [-0.5, 0.5], [-9, 9]);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduce]);

  return (
    <div className="hero-soft-fade absolute inset-0 overflow-hidden bg-[#EAF3FC]">
      <Image
        src="/beach/hero-base.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: ANCHOR }}
      />

      {/* Ciel : dérive lente, superposée au pixel près sur le fond */}
      {!reduce && (
        <motion.div className="absolute inset-0" style={{ x: skyX, y: skyY }}>
          <motion.div
            className="absolute inset-0"
            animate={{ x: ["-1.2%", "1.4%", "-1.2%"], y: ["0.2%", "-0.25%", "0.2%"] }}
            transition={{ duration: 104, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/beach/hero-sky-drift.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: ANCHOR }}
            />
          </motion.div>
        </motion.div>
      )}

      {!reduce && <SeaShimmer />}

      {/* Halo de l'écran */}
      <motion.div
        className="absolute inset-0 mix-blend-screen"
        animate={reduce ? undefined : { opacity: [0.45, 0.85, 0.45] }}
        transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ opacity: 0.6 }}
      >
        <Image
          src="/beach/hero-screen-glow.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: ANCHOR }}
        />
      </motion.div>

      {/* Mouettes */}
      {!reduce && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ x: birdX, y: birdY }}
        >
          <Seagull top="12%" width={44} duration={26} delay={0.5} rise={-26} />
          <Seagull top="19%" width={33} duration={33} delay={7} rise={18} />
          <Seagull top="8%" width={26} duration={40} delay={16} rise={-13} />
        </motion.div>
      )}
    </div>
  );
}

/**
 * Vaguelettes, en coordonnées de l'illustration (1536 × 1024) et confinées à
 * l'eau par le masque extrait. Elles remontent vers la côte, plus longues et
 * plus espacées à mesure qu'on se rapproche du premier plan.
 */
const WAVES = [
  { y: 620, len: 150, h: 3, dur: 15, delay: 0, opacity: 0.7 },
  { y: 646, len: 200, h: 4, dur: 18, delay: 2.5, opacity: 0.75 },
  { y: 676, len: 250, h: 5, dur: 16, delay: 7, opacity: 0.85 },
  { y: 710, len: 220, h: 5, dur: 20, delay: 1, opacity: 0.8 },
  { y: 750, len: 300, h: 6, dur: 17, delay: 5, opacity: 0.9 },
  { y: 798, len: 270, h: 7, dur: 21, delay: 10, opacity: 0.8 },
  { y: 854, len: 360, h: 8, dur: 19, delay: 2, opacity: 0.95 },
  { y: 922, len: 320, h: 9, dur: 24, delay: 8, opacity: 0.85 },
  { y: 996, len: 400, h: 10, dur: 22, delay: 13, opacity: 0.9 },
];

/** Rochers émergés, autour desquels l'écume se forme */
const FOAM = [
  { x: 1163, y: 738, rx: 70, ry: 18, dur: 7, delay: 0 },
  { x: 1240, y: 856, rx: 82, ry: 22, dur: 9, delay: 2.5 },
  { x: 1318, y: 950, rx: 92, ry: 24, dur: 8, delay: 5 },
  { x: 1096, y: 1000, rx: 76, ry: 20, dur: 10, delay: 1.5 },
];

function SeaShimmer() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${ART_W} ${ART_H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <mask id="hero-sea" maskUnits="userSpaceOnUse" x="0" y="0" width={ART_W} height={ART_H}>
          <image
            href="/beach/hero-sea-mask.webp"
            x="0"
            y="0"
            width={ART_W}
            height={ART_H}
            preserveAspectRatio="none"
          />
        </mask>
        <linearGradient id="hero-wave" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="42%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="62%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id="hero-wave-blur" x="-20%" y="-300%" width="140%" height="700%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
        <filter id="hero-foam-blur" x="-60%" y="-160%" width="220%" height="420%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      <g mask="url(#hero-sea)">
        {/* Écume autour des rochers : le masque exclut la roche, la tache
            n'apparaît donc que sur l'eau qui l'entoure. */}
        {FOAM.map((f, i) => (
          <motion.ellipse
            key={`f${i}`}
            cx={f.x}
            cy={f.y}
            rx={f.rx}
            ry={f.ry}
            fill="#FFFFFF"
            filter="url(#hero-foam-blur)"
            animate={{ opacity: [0.12, 0.5, 0.12], scale: [0.9, 1.08, 0.9] }}
            transition={{
              duration: f.dur,
              delay: f.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ originX: `${f.x}px`, originY: `${f.y}px` }}
          />
        ))}

        {WAVES.map((w, i) => (
          <motion.rect
            key={i}
            // `x` est animé comme une translation : l'attribut reste à 0 pour
            // que les valeurs de l'animation soient des positions absolues.
            x={0}
            y={w.y}
            width={w.len}
            height={w.h}
            rx={w.h / 2}
            fill="url(#hero-wave)"
            filter="url(#hero-wave-blur)"
            animate={{
              x: [ART_W + 40, 780 - w.len],
              opacity: [0, w.opacity, w.opacity, 0],
            }}
            transition={{
              duration: w.dur,
              delay: w.delay,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.16, 0.74, 1],
            }}
          />
        ))}
      </g>
    </svg>
  );
}

// Le battement reste dans le registre haut : les ailes gardent toujours un V,
// comme une mouette qui plane. En passant par l'horizontale, la silhouette ne
// se lirait plus que comme un tiret pendant quelques images.
const WING_UP = "M2 22 C 11 5, 16 3, 20 12 C 24 3, 29 5, 38 22";
const WING_MID = "M2 18 C 11 8, 16 6, 20 12 C 24 6, 29 8, 38 18";
const WING_DOWN = "M2 14 C 11 11, 16 10, 20 12 C 24 10, 29 11, 38 14";

function Seagull({
  top,
  width,
  duration,
  delay,
  rise,
}: {
  top: string;
  width: number;
  duration: number;
  delay: number;
  rise: number;
}) {
  return (
    <motion.div
      className="absolute"
      style={{ top, left: 0, width }}
      initial={{ x: "-12vw", opacity: 0 }}
      animate={{
        x: ["-12vw", "112vw"],
        y: [0, rise * 0.45, rise, rise * 0.7],
        opacity: [0, 0.9, 0.9, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: 4,
        ease: "linear",
        opacity: { duration, delay, repeat: Infinity, repeatDelay: 4, times: [0, 0.1, 0.85, 1] },
      }}
    >
      <svg viewBox="0 0 40 24" width={width} height={(width * 24) / 40} aria-hidden>
        <motion.path
          d={WING_MID}
          fill="none"
          stroke="rgba(44, 62, 88, 0.72)"
          strokeWidth={Math.max(1.5, width / 18)}
          strokeLinecap="round"
          animate={{ d: [WING_UP, WING_MID, WING_DOWN, WING_MID, WING_UP] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
}
