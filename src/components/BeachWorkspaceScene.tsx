"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Scène hero TiCode — illustration claire + motion design léger.
 * Les bords fondent en transparence vers le fond blanc via .hero-soft-fade.
 */
export function BeachWorkspaceScene() {
  const reduce = useReducedMotion();

  return (
    <div className="hero-soft-fade absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-[-2%]"
        animate={reduce ? undefined : { scale: [1, 1.04, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/beach/hero-scene-light.png"
          alt=""
          fill
          priority
          className="object-cover object-[55%_40%]"
          sizes="100vw"
        />
      </motion.div>

      {/* Soft light grade (no heavy dark overlays) */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/30"
      />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <radialGradient id="screenPulseLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#9ec0ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#9ec0ff" stopOpacity="0" />
          </radialGradient>
          <filter id="glowBlurLight">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>

        <motion.ellipse
          cx="980"
          cy="500"
          rx="100"
          ry="65"
          fill="url(#screenPulseLight)"
          filter="url(#glowBlurLight)"
          animate={reduce ? undefined : { opacity: [0.2, 0.55, 0.2] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />

        <WaveFoam reduce={!!reduce} y={720} opacity={0.12} duration={9} amp={12} />
        <WaveFoam
          reduce={!!reduce}
          y={750}
          opacity={0.08}
          duration={11}
          amp={16}
          delay={0.7}
        />

        {!reduce && (
          <>
            <Seagull x={200} y={180} delay={0} />
            <Seagull x={320} y={140} delay={2} scale={0.7} />
            <Seagull x={1180} y={160} delay={3.8} scale={0.85} />
          </>
        )}
      </svg>
    </div>
  );
}

function WaveFoam({
  reduce,
  y,
  opacity,
  duration,
  amp,
  delay = 0,
}: {
  reduce: boolean;
  y: number;
  opacity: number;
  duration: number;
  amp: number;
  delay?: number;
}) {
  const a = `M-80 ${y} Q250 ${y - amp} 520 ${y} T1100 ${y} T1680 ${y} V${y + 100} H-80 Z`;
  const b = `M-80 ${y} Q250 ${y + amp} 520 ${y} T1100 ${y} T1680 ${y} V${y + 100} H-80 Z`;
  return (
    <motion.path
      d={a}
      fill={`rgba(255,255,255,${opacity})`}
      animate={reduce ? undefined : { d: [a, b, a] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

function Seagull({
  x,
  y,
  delay,
  scale = 1,
}: {
  x: number;
  y: number;
  delay: number;
  scale?: number;
}) {
  return (
    <motion.g
      animate={{ x: [0, 140, 280], y: [0, -14, 6] }}
      transition={{ duration: 28, repeat: Infinity, ease: "linear", delay }}
    >
      <motion.path
        fill="none"
        stroke="#0B1F3A"
        strokeWidth={1.6 * scale}
        strokeLinecap="round"
        opacity="0.35"
        animate={{
          d: [
            `M${x} ${y} q${13 * scale} ${-11 * scale} ${26 * scale} 0 q${-13 * scale} ${-8 * scale} ${-26 * scale} 0`,
            `M${x} ${y} q${13 * scale} ${-3 * scale} ${26 * scale} 0 q${-13 * scale} ${-3 * scale} ${-26 * scale} 0`,
            `M${x} ${y} q${13 * scale} ${-11 * scale} ${26 * scale} 0 q${-13 * scale} ${-8 * scale} ${-26 * scale} 0`,
          ],
        }}
        transition={{ duration: 0.7, repeat: Infinity }}
      />
    </motion.g>
  );
}
