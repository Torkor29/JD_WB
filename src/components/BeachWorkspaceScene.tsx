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
 * Tous les calques partagent le même cadrage : `object-cover` et `cover` de
 * `mask-size` calculent la même géométrie, à condition de garder la même
 * position d'ancrage.
 */
const ANCHOR = "50% 44%";

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
          <Seagull top="10%" width={38} duration={27} delay={1} rise={-22} />
          <Seagull top="16%" width={28} duration={34} delay={9} rise={16} />
          <Seagull top="7%" width={22} duration={41} delay={19} rise={-11} />
        </motion.div>
      )}
    </div>
  );
}

/** Vaguelettes et éclats de lumière, confinés à la surface de l'eau */
function SeaShimmer() {
  const waves = [
    { top: "60%", width: "26%", dur: 17, delay: 0, opacity: 0.5, h: 2 },
    { top: "64%", width: "32%", dur: 21, delay: 3.5, opacity: 0.45, h: 2 },
    { top: "69%", width: "38%", dur: 19, delay: 1.5, opacity: 0.55, h: 3 },
    { top: "74%", width: "30%", dur: 24, delay: 7, opacity: 0.4, h: 3 },
    { top: "79%", width: "44%", dur: 22, delay: 4.5, opacity: 0.5, h: 3 },
    { top: "85%", width: "36%", dur: 26, delay: 10, opacity: 0.45, h: 4 },
    { top: "92%", width: "48%", dur: 23, delay: 6, opacity: 0.4, h: 4 },
  ];

  const mask = {
    maskImage: "url(/beach/hero-sea-mask.webp)",
    WebkitMaskImage: "url(/beach/hero-sea-mask.webp)",
    maskSize: "cover",
    WebkitMaskSize: "cover",
    maskPosition: ANCHOR,
    WebkitMaskPosition: ANCHOR,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  } as const;

  return (
    <div className="pointer-events-none absolute inset-0" style={mask}>
      {waves.map((w, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            top: w.top,
            left: 0,
            width: w.width,
            height: w.h,
            filter: "blur(1.5px)",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.85) 45%, rgba(255,255,255,0))",
          }}
          animate={{
            x: ["58%", "175%"],
            opacity: [0, w.opacity, w.opacity, 0],
          }}
          transition={{
            duration: w.dur,
            delay: w.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.18, 0.78, 1],
          }}
        />
      ))}

      {/* Respiration lumineuse de la surface */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 78% 74%, rgba(255,255,255,0.5), rgba(255,255,255,0) 70%)",
        }}
        animate={{ opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

const WING_UP = "M2 13 C 9 1, 15 1, 20 9 C 25 1, 31 1, 38 13";
const WING_MID = "M2 9 C 9 6, 15 5, 20 8 C 25 5, 31 6, 38 9";
const WING_DOWN = "M2 5 C 9 11, 15 11, 20 8 C 25 11, 31 11, 38 5";

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
      <svg viewBox="0 0 40 16" width={width} height={(width * 16) / 40} aria-hidden>
        <motion.path
          d={WING_MID}
          fill="none"
          stroke="rgba(38, 56, 80, 0.78)"
          strokeWidth={Math.max(1.4, width / 17)}
          strokeLinecap="round"
          animate={{ d: [WING_UP, WING_MID, WING_DOWN, WING_MID, WING_UP] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
}
