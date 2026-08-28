"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Scène hero TiCode — mer discrète + mouettes propres.
 * Pas de traits de vent ni d’overlays “miroir”.
 */
export function BeachWorkspaceScene() {
  const reduce = useReducedMotion();

  return (
    <div className="hero-soft-fade absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-[-2%]"
        animate={reduce ? undefined : { scale: [1, 1.025, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/beach/hero-scene-light.png"
          alt=""
          fill
          priority
          className="object-cover object-[48%_42%] sm:object-[52%_38%]"
          sizes="100vw"
        />
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/25"
      />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <radialGradient id="screenPulseLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#9ec0ff" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#9ec0ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="seaFoam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#7ec8ff" stopOpacity="0" />
          </linearGradient>
          <filter id="glowBlurLight">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        <motion.ellipse
          cx="980"
          cy="500"
          rx="90"
          ry="58"
          fill="url(#screenPulseLight)"
          filter="url(#glowBlurLight)"
          animate={reduce ? undefined : { opacity: [0.15, 0.42, 0.15] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Mer — très légère, côté océan uniquement */}
        <g opacity={0.7}>
          <SeaBand reduce={!!reduce} y={560} amp={10} duration={7} opacity={0.22} />
          <SeaBand
            reduce={!!reduce}
            y={600}
            amp={14}
            duration={8.5}
            opacity={0.16}
            delay={0.8}
          />
          <SeaBand
            reduce={!!reduce}
            y={645}
            amp={11}
            duration={9.5}
            opacity={0.12}
            delay={1.4}
          />
        </g>

        {!reduce && (
          <>
            <SeagullFlight startY={105} duration={26} delay={0} scale={0.95} drift={14} />
            <SeagullFlight startY={78} duration={32} delay={7} scale={0.7} drift={-10} />
            <SeagullFlight startY={130} duration={29} delay={15} scale={0.82} drift={8} />
          </>
        )}
      </svg>
    </div>
  );
}

function SeaBand({
  reduce,
  y,
  amp,
  duration,
  opacity,
  delay = 0,
}: {
  reduce: boolean;
  y: number;
  amp: number;
  duration: number;
  opacity: number;
  delay?: number;
}) {
  const pathA = `M720 ${y} Q920 ${y - amp} 1120 ${y} T1520 ${y} T1920 ${y} V${y + 70} H720 Z`;
  const pathB = `M720 ${y} Q920 ${y + amp} 1120 ${y} T1520 ${y} T1920 ${y} V${y + 70} H720 Z`;

  return (
    <motion.path
      d={pathA}
      fill="url(#seaFoam)"
      opacity={opacity}
      animate={reduce ? undefined : { d: [pathA, pathB, pathA] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/** Mouette — silhouette V douce, vol large et lent */
function SeagullFlight({
  startY,
  duration,
  delay,
  scale = 1,
  drift = 0,
}: {
  startY: number;
  duration: number;
  delay: number;
  scale?: number;
  drift?: number;
}) {
  const wing = 18 * scale;

  return (
    <motion.g
      initial={{ x: -100, y: startY, opacity: 0 }}
      animate={{
        x: [-100, 1700],
        y: [startY, startY + drift * 0.5, startY + drift, startY],
        opacity: [0, 0.55, 0.55, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
        delay,
        repeatDelay: 3,
      }}
    >
      <motion.path
        d={`M ${-wing} 0 C ${-wing * 0.4} ${-wing * 0.55} ${-wing * 0.15} ${-wing * 0.55} 0 0 C ${wing * 0.15} ${-wing * 0.55} ${wing * 0.4} ${-wing * 0.55} ${wing} 0`}
        fill="none"
        stroke="rgba(11, 31, 58, 0.38)"
        strokeWidth={Math.max(1.4, 1.65 * scale)}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transformOrigin: "0px 0px" }}
        animate={{ scaleY: [1, 0.35, 1] }}
        transition={{ duration: 0.75, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.g>
  );
}
