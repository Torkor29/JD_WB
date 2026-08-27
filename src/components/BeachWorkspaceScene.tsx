"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Hero type Prisma :
 * illustration cinématique (personnage au laptop sur la côte)
 * + micro-animations dessin (vagues, goélands, glow, respiration).
 */
export function BeachWorkspaceScene() {
  const reduce = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0908]">
      <motion.div
        className="absolute inset-0"
        animate={reduce ? undefined : { scale: [1, 1.045, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/beach/hero-scene.png"
          alt=""
          fill
          priority
          className="object-cover object-[58%_40%] sm:object-[55%_38%]"
          sizes="100vw"
        />
      </motion.div>

      {/* Soft cinematic grade */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/50"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_40%,rgba(255,170,70,0.1),transparent_48%)]"
      />

      {/* Couche motion design légère */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <radialGradient id="screenPulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#dff0ff" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#8eb6ff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#8eb6ff" stopOpacity="0" />
          </radialGradient>
          <filter id="glowBlur">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        {/* Pulse glow sur le laptop (zone approx. du perso) */}
        <motion.ellipse
          cx="980"
          cy="520"
          rx="95"
          ry="60"
          fill="url(#screenPulse)"
          filter="url(#glowBlur)"
          animate={reduce ? undefined : { opacity: [0.25, 0.65, 0.25] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Vagues mousse / lueur mer */}
        <WaveFoam reduce={!!reduce} y={700} opacity={0.1} duration={9} amp={14} />
        <WaveFoam
          reduce={!!reduce}
          y={730}
          opacity={0.07}
          duration={11}
          amp={18}
          delay={0.8}
        />

        {/* Brin d’herbe qui bouge (premier plan stylisé) */}
        {!reduce && (
          <g opacity="0.35" fill="#2a3a22">
            {[180, 240, 1380, 1450].map((x, i) => (
              <motion.path
                key={x}
                d={`M${x} 860 q-8 -40 0 -70 q8 22 12 70 q6 -36 16 -55 q2 28 -2 55`}
                animate={{ rotate: [-3, 3, -3] }}
                transition={{
                  duration: 3.2 + i * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transformOrigin: `${x}px 860px` }}
              />
            ))}
          </g>
        )}

        {!reduce && (
          <>
            <Seagull x={160} y={170} delay={0} />
            <Seagull x={280} y={130} delay={1.8} scale={0.7} />
            <Seagull x={1200} y={150} delay={3.5} scale={0.85} />
          </>
        )}
      </svg>

      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.5] mix-blend-overlay" />
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
      fill={`rgba(225,224,204,${opacity})`}
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
      animate={{ x: [0, 140, 280], y: [0, -16, 6] }}
      transition={{ duration: 28, repeat: Infinity, ease: "linear", delay }}
    >
      <motion.path
        fill="none"
        stroke="#E1E0CC"
        strokeWidth={1.8 * scale}
        strokeLinecap="round"
        opacity="0.55"
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
