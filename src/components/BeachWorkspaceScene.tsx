"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Scène hero TiCode — mer vivante, vent, mouettes en traversée plein écran.
 */
export function BeachWorkspaceScene() {
  const reduce = useReducedMotion();

  return (
    <div className="hero-soft-fade absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-[-3%]"
        animate={
          reduce ? undefined : { scale: [1, 1.035, 1], x: [0, 10, -4, 0] }
        }
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
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

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20"
      />

      {/* Mer — reflets qui glissent sur l’océan (droite) */}
      {!reduce && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute bottom-[22%] right-0 top-[26%] w-[58%]"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.55) 48%, rgba(120,200,255,0.35) 58%, transparent 78%)",
              backgroundSize: "260% 100%",
              mixBlendMode: "soft-light",
            }}
            animate={{ backgroundPositionX: ["0%", "100%", "0%"] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute bottom-[20%] right-[2%] h-[42%] w-[50%] rounded-[40%] opacity-60"
            style={{
              background:
                "radial-gradient(ellipse at 40% 55%, rgba(255,255,255,0.4), transparent 62%)",
              mixBlendMode: "overlay",
            }}
            animate={{ x: [0, 36, -12, 0], opacity: [0.3, 0.65, 0.35, 0.3] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <radialGradient id="screenPulseLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#9ec0ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#9ec0ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="seaFoam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#a8d8ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7ec8ff" stopOpacity="0" />
          </linearGradient>
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

        {/* Vagues océan — plus visibles */}
        <g>
          <SeaBand reduce={!!reduce} y={540} amp={16} duration={5.2} opacity={0.42} />
          <SeaBand
            reduce={!!reduce}
            y={580}
            amp={20}
            duration={6.6}
            opacity={0.34}
            delay={0.35}
          />
          <SeaBand
            reduce={!!reduce}
            y={625}
            amp={24}
            duration={7.8}
            opacity={0.28}
            delay={0.9}
          />
          <SeaBand
            reduce={!!reduce}
            y={670}
            amp={18}
            duration={6}
            opacity={0.2}
            delay={0.55}
          />
        </g>

        {!reduce && (
          <>
            <GrassClump x={160} y={775} delay={0} />
            <GrassClump x={230} y={795} delay={0.3} scale={0.9} />
            <GrassClump x={310} y={810} delay={0.7} scale={1.15} />
            <GrassClump x={400} y={825} delay={0.15} scale={0.8} />
            <GrassClump x={500} y={800} delay={0.5} scale={1} />
            <WindStreaks />
            <SeagullFlight startY={110} duration={18} delay={0} scale={1.15} drift={22} />
            <SeagullFlight startY={85} duration={24} delay={3.5} scale={0.85} drift={-16} />
            <SeagullFlight startY={145} duration={20} delay={8} scale={1} drift={14} />
            <SeagullFlight startY={70} duration={27} delay={13} scale={0.65} drift={-10} />
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
  const pathA = `M680 ${y} Q880 ${y - amp} 1080 ${y} T1480 ${y} T1880 ${y} V${y + 90} H680 Z`;
  const pathB = `M680 ${y} Q880 ${y + amp} 1080 ${y} T1480 ${y} T1880 ${y} V${y + 90} H680 Z`;

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
              x: [0, -55, 0],
            }
      }
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
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
    { dx: -12, h: 34, bend: 8 },
    { dx: -4, h: 44, bend: 11 },
    { dx: 5, h: 38, bend: 9 },
    { dx: 13, h: 30, bend: 7 },
  ];

  return (
    <motion.g
      style={{ transformOrigin: `${x}px ${y}px` }}
      animate={{
        rotate: [-6 * scale, 9 * scale, -5 * scale, 8 * scale, -6 * scale],
      }}
      transition={{
        duration: 2.8 + delay * 0.4,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {blades.map((b, i) => (
        <path
          key={i}
          d={`M${x + b.dx * scale} ${y} Q${x + b.dx * scale + b.bend * scale} ${y - b.h * scale * 0.55} ${x + b.dx * scale + 3} ${y - b.h * scale}`}
          fill="none"
          stroke="rgba(28,70,28,0.45)"
          strokeWidth={1.8 * scale}
          strokeLinecap="round"
        />
      ))}
    </motion.g>
  );
}

function WindStreaks() {
  const streaks = [
    { y: 190, dur: 3.8, delay: 0, len: 120 },
    { y: 240, dur: 4.4, delay: 0.9, len: 90 },
    { y: 300, dur: 4, delay: 1.8, len: 140 },
    { y: 170, dur: 5, delay: 0.4, len: 70 },
    { y: 350, dur: 4.6, delay: 2.6, len: 100 },
  ];

  return (
    <>
      {streaks.map((s, i) => (
        <motion.line
          key={i}
          x1={-100}
          y1={s.y}
          x2={-100 + s.len}
          y2={s.y - 8}
          stroke="rgba(11,31,58,0.18)"
          strokeWidth={1.5}
          strokeLinecap="round"
          animate={{ x: [-60, 1780], opacity: [0, 0.7, 0.7, 0] }}
          transition={{
            duration: s.dur,
            repeat: Infinity,
            ease: "linear",
            delay: s.delay,
            repeatDelay: 1.8,
          }}
        />
      ))}
    </>
  );
}

/** Mouette — 2 ailes qui battent, traversée gauche → droite plein écran */
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
  const wing = 22 * scale;

  return (
    <motion.g
      initial={{ x: -120, y: startY }}
      animate={{
        x: [-120, 1720],
        y: [
          startY,
          startY + drift * 0.4,
          startY + drift,
          startY + drift * 0.2,
        ],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
        delay,
        repeatDelay: 1.2,
      }}
    >
      {/* Aile gauche */}
      <motion.path
        d={`M 0 0 Q ${-wing * 0.55} ${-wing * 0.55} ${-wing} ${-wing * 0.08}`}
        fill="none"
        stroke="rgba(11, 31, 58, 0.5)"
        strokeWidth={Math.max(1.6, 2 * scale)}
        strokeLinecap="round"
        style={{ transformOrigin: "0px 0px" }}
        animate={{ rotate: [-8, 22, -8] }}
        transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Aile droite */}
      <motion.path
        d={`M 0 0 Q ${wing * 0.55} ${-wing * 0.55} ${wing} ${-wing * 0.08}`}
        fill="none"
        stroke="rgba(11, 31, 58, 0.5)"
        strokeWidth={Math.max(1.6, 2 * scale)}
        strokeLinecap="round"
        style={{ transformOrigin: "0px 0px" }}
        animate={{ rotate: [8, -22, 8] }}
        transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.g>
  );
}
