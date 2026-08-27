"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Scène hero TiCode — mer vivante, vent léger, mouettes en traversée plein écran.
 */
export function BeachWorkspaceScene() {
  const reduce = useReducedMotion();

  return (
    <div className="hero-soft-fade absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-[-3%]"
        animate={
          reduce
            ? undefined
            : { scale: [1, 1.03, 1], x: [0, 8, 0] }
        }
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/beach/hero-scene-light.png"
          alt=""
          fill
          priority
          className="object-cover object-[52%_38%]"
          sizes="100vw"
        />
      </motion.div>

      {/* Soft grade */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/25"
      />

      {/* Ocean shimmer — côté mer (droite) */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-[28%] right-0 w-[58%] opacity-40 mix-blend-soft-light"
          style={{
            background:
              "linear-gradient(105deg, transparent 0%, rgba(180,230,255,0.0) 30%, rgba(255,255,255,0.55) 48%, rgba(120,200,255,0.15) 62%, transparent 100%)",
            backgroundSize: "220% 100%",
          }}
          animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <radialGradient id="screenPulseLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#9ec0ff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#9ec0ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="seaFoam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7ec8ff" stopOpacity="0.05" />
          </linearGradient>
          <filter id="glowBlurLight">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>

        {/* Glow laptop */}
        <motion.ellipse
          cx="980"
          cy="500"
          rx="100"
          ry="65"
          fill="url(#screenPulseLight)"
          filter="url(#glowBlurLight)"
          animate={reduce ? undefined : { opacity: [0.18, 0.5, 0.18] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Mer qui bouge — bandes de vagues côté océan */}
        <g opacity={0.55}>
          <SeaBand
            reduce={!!reduce}
            y={610}
            amp={10}
            duration={6.5}
            opacity={0.22}
          />
          <SeaBand
            reduce={!!reduce}
            y={640}
            amp={14}
            duration={8.2}
            opacity={0.18}
            delay={0.4}
          />
          <SeaBand
            reduce={!!reduce}
            y={675}
            amp={18}
            duration={9.5}
            opacity={0.14}
            delay={1.1}
          />
          <SeaBand
            reduce={!!reduce}
            y={715}
            amp={12}
            duration={7.4}
            opacity={0.1}
            delay={0.7}
          />
        </g>

        {/* Vent — herbes au premier plan */}
        {!reduce && (
          <>
            <GrassClump x={180} y={780} delay={0} />
            <GrassClump x={260} y={800} delay={0.35} scale={0.85} />
            <GrassClump x={420} y={820} delay={0.8} scale={1.1} />
            <GrassClump x={540} y={790} delay={0.2} scale={0.7} />
            <WindStreaks />
          </>
        )}

        {/* Mouettes — traversée plein écran, formes propres */}
        {!reduce && (
          <>
            <SeagullFlight
              startY={120}
              duration={22}
              delay={0}
              scale={1}
              drift={18}
            />
            <SeagullFlight
              startY={95}
              duration={28}
              delay={5}
              scale={0.72}
              drift={-12}
            />
            <SeagullFlight
              startY={155}
              duration={25}
              delay={11}
              scale={0.88}
              drift={10}
            />
            <SeagullFlight
              startY={78}
              duration={32}
              delay={17}
              scale={0.55}
              drift={-8}
            />
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
  // Vague qui se décale horizontalement + ondulation verticale
  const pathA = `M700 ${y} Q900 ${y - amp} 1100 ${y} T1500 ${y} T1900 ${y} V${y + 80} H700 Z`;
  const pathB = `M700 ${y} Q900 ${y + amp} 1100 ${y} T1500 ${y} T1900 ${y} V${y + 80} H700 Z`;

  return (
    <motion.path
      d={pathA}
      fill="url(#seaFoam)"
      opacity={opacity}
      animate={
        reduce
          ? undefined
          : {
              d: [pathA, pathB, pathA],
              x: [0, -40, 0],
            }
      }
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

function GrassClump({
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
  const blades = [
    { dx: -10, h: 28, bend: 6 },
    { dx: -3, h: 36, bend: 8 },
    { dx: 4, h: 32, bend: 7 },
    { dx: 11, h: 24, bend: 5 },
  ];

  return (
    <motion.g
      style={{ transformOrigin: `${x}px ${y}px` }}
      animate={{ rotate: [-4 * scale, 6 * scale, -3 * scale, 5 * scale, -4 * scale] }}
      transition={{
        duration: 3.6 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {blades.map((b, i) => (
        <path
          key={i}
          d={`M${x + b.dx * scale} ${y} Q${x + b.dx * scale + b.bend * scale} ${y - b.h * scale * 0.55} ${x + b.dx * scale + 2} ${y - b.h * scale}`}
          fill="none"
          stroke="rgba(40,90,40,0.28)"
          strokeWidth={1.4 * scale}
          strokeLinecap="round"
        />
      ))}
    </motion.g>
  );
}

function WindStreaks() {
  const streaks = [
    { y: 200, dur: 4.5, delay: 0, len: 90 },
    { y: 260, dur: 5.2, delay: 1.2, len: 70 },
    { y: 330, dur: 4.8, delay: 2.4, len: 110 },
    { y: 180, dur: 6, delay: 0.8, len: 60 },
  ];

  return (
    <>
      {streaks.map((s, i) => (
        <motion.line
          key={i}
          x1={-80}
          y1={s.y}
          x2={-80 + s.len}
          y2={s.y - 6}
          stroke="rgba(11,31,58,0.12)"
          strokeWidth={1.2}
          strokeLinecap="round"
          animate={{ x: [-40, 1750], opacity: [0, 0.5, 0.5, 0] }}
          transition={{
            duration: s.dur,
            repeat: Infinity,
            ease: "linear",
            delay: s.delay,
            repeatDelay: 2.5,
          }}
        />
      ))}
    </>
  );
}

/** Mouette élégante — traversée plein écran, battement via scaleY (pas de morph glitchy) */
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
  const w = 20 * scale;
  const h = 11 * scale;

  return (
    <motion.g
      initial={{ x: -100, y: startY }}
      animate={{
        x: [-100, 1700],
        y: [
          startY,
          startY + drift * 0.35,
          startY + drift,
          startY + drift * 0.15,
        ],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
        delay,
        repeatDelay: 2,
      }}
    >
      <motion.g
        style={{ transformOrigin: "0px 0px" }}
        animate={{ scaleY: [1, 0.28, 1] }}
        transition={{
          duration: 0.7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Aile gauche + droite en un seul V net */}
        <path
          d={`M ${-w} 0 C ${-w * 0.45} ${-h} ${-w * 0.2} ${-h} 0 0 C ${w * 0.2} ${-h} ${w * 0.45} ${-h} ${w} 0`}
          fill="none"
          stroke="rgba(11, 31, 58, 0.4)"
          strokeWidth={Math.max(1.4, 1.7 * scale)}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>
    </motion.g>
  );
}
