"use client";

import Image from "next/image";
import type { Transition } from "framer-motion";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect } from "react";

/**
 * Scène hero.
 *
 * L'illustration reste un seul calque, jamais découpé : c'était la source des
 * dédoublements de nuages. Le mouvement est ajouté par-dessus, en SVG, dans les
 * coordonnées de l'illustration.
 *
 * Le cadrage est partagé par tous les calques : `object-position: 50% 50%` sur
 * une image `object-cover` est le strict équivalent d'un
 * `preserveAspectRatio="xMidYMid slice"` en SVG. Un point de l'illustration
 * tombe donc au même endroit à l'écran dans l'image et dans les surcouches,
 * quel que soit le format de la fenêtre.
 */
const ANCHOR = "50% 50%";
const ART_W = 1536;
const ART_H = 1024;

/** Léger agrandissement permanent : il absorbe le parallaxe sans découvrir de bord. */
const OVERSCAN = 1.05;

/** Écran du laptop, relevé sur l'illustration. */
const SCREEN = { x: 757, y: 597 };

export function BeachWorkspaceScene() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 30, damping: 22, mass: 0.7 });
  const sy = useSpring(my, { stiffness: 30, damping: 22, mass: 0.7 });

  const sceneX = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const sceneY = useTransform(sy, [-0.5, 0.5], [-11, 11]);
  // Les mouettes sont plus près : elles réagissent nettement plus.
  const birdX = useTransform(sx, [-0.5, 0.5], [-58, 58]);
  const birdY = useTransform(sy, [-0.5, 0.5], [-32, 32]);

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
      {/* Illustration et surcouches partagent la même translation : la mer
          reste calée sur l'eau pendant le parallaxe. */}
      <motion.div
        className="absolute inset-0"
        style={
          reduce
            ? undefined
            : { x: sceneX, y: sceneY, scale: OVERSCAN }
        }
      >
        <Image
          src="/beach/hero-scene-light.webp"
          alt="Un développeur travaille sur son ordinateur portable au sommet d'une falaise bretonne, face à la mer"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: ANCHOR }}
        />

        {!reduce && <Sea />}
        {!reduce && <ScreenGlow />}
      </motion.div>

      {!reduce && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ x: birdX, y: birdY }}
        >
          <Seagull
            top="13%"
            width="clamp(34px, 5.6vw, 88px)"
            cross={29}
            delay={1}
            climb={-46}
            flap={1.05}
            ink={0.72}
          />
          <Seagull
            top="22%"
            width="clamp(26px, 4.1vw, 64px)"
            cross={37}
            delay={10}
            climb={34}
            flap={1.25}
            ink={0.6}
          />
          <Seagull
            top="8%"
            width="clamp(20px, 3.1vw, 48px)"
            cross={45}
            delay={21}
            climb={-22}
            flap={0.95}
            ink={0.5}
          />
        </motion.div>
      )}
    </div>
  );
}

/**
 * Houle. Chaque ligne est une bande de reflets répartis à intervalle régulier,
 * translatée en continu d'exactement un intervalle : la boucle est donc
 * invisible et le mouvement ne s'interrompt jamais.
 *
 * `y` descend de l'horizon vers le premier plan ; la perspective veut que les
 * reflets s'allongent, s'épaississent, s'espacent et défilent plus vite.
 */
const SWELL = [
  { y: 606, len: 54, h: 2.0, gap: 132, dur: 26, opacity: 0.42, sway: 1.5 },
  { y: 626, len: 72, h: 2.4, gap: 158, dur: 25, opacity: 0.5, sway: 1.8 },
  { y: 650, len: 92, h: 2.8, gap: 186, dur: 24, opacity: 0.56, sway: 2.2 },
  { y: 680, len: 116, h: 3.2, gap: 218, dur: 23, opacity: 0.6, sway: 2.6 },
  { y: 716, len: 142, h: 3.8, gap: 252, dur: 22, opacity: 0.64, sway: 3.2 },
  { y: 758, len: 172, h: 4.4, gap: 290, dur: 21, opacity: 0.66, sway: 3.8 },
  { y: 806, len: 204, h: 5.2, gap: 330, dur: 20, opacity: 0.68, sway: 4.6 },
  { y: 860, len: 240, h: 6.0, gap: 374, dur: 19, opacity: 0.7, sway: 5.4 },
  { y: 920, len: 280, h: 7.0, gap: 422, dur: 18, opacity: 0.72, sway: 6.4 },
  { y: 986, len: 324, h: 8.0, gap: 474, dur: 17, opacity: 0.72, sway: 7.4 },
];

/** L'eau commence à la falaise ; inutile de dessiner à gauche de ça. */
const SEA_FROM = 1040;

/** Rochers émergés, autour desquels l'écume respire. */
const FOAM = [
  { x: 1222, y: 748, rx: 62, ry: 17, dur: 6.5, delay: 0 },
  { x: 1188, y: 830, rx: 74, ry: 20, dur: 8.5, delay: 2.2 },
  { x: 1300, y: 962, rx: 96, ry: 26, dur: 7.5, delay: 4.4 },
  { x: 1150, y: 700, rx: 48, ry: 13, dur: 9.5, delay: 1.3 },
];

/**
 * Trains de houle. Chacun part de l'horizon et descend vers la côte en
 * s'épaississant : c'est la perspective d'une vague qui arrive. Un décalage
 * latéral n'était pas lisible — l'eau peinte est striée horizontalement, un
 * reflet qui glisse de biais s'y confond. Une bande qui traverse la surface de
 * haut en bas, elle, se lit tout de suite.
 */
const ROLLERS = [0, 1.15, 2.3, 3.45, 4.6, 5.75].map((delay) => ({ delay, dur: 6.9 }));

/** Éclats de soleil sur l'eau : ils scintillent sur place. */
const SPARKS = [
  { x: 1348, y: 636, r: 15, dur: 3.4, delay: 0.2 },
  { x: 1462, y: 662, r: 19, dur: 4.1, delay: 1.1 },
  { x: 1268, y: 618, r: 12, dur: 3.0, delay: 2.0 },
  { x: 1418, y: 704, r: 22, dur: 4.6, delay: 0.7 },
  { x: 1512, y: 616, r: 14, dur: 3.7, delay: 2.6 },
  { x: 1330, y: 744, r: 24, dur: 5.0, delay: 1.7 },
  { x: 1494, y: 782, r: 27, dur: 4.4, delay: 3.1 },
  { x: 1384, y: 856, r: 30, dur: 5.4, delay: 0.9 },
  { x: 1470, y: 928, r: 33, dur: 4.9, delay: 2.4 },
  { x: 1256, y: 676, r: 16, dur: 3.9, delay: 3.5 },
];

function Sea() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${ART_W} ${ART_H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <mask id="hero-sea" maskUnits="userSpaceOnUse" x="0" y="0" width={ART_W} height={ART_H}>
          {/* Masque de luminance en niveaux de gris opaques : la bordure est
              dégradée, les reflets s'y éteignent au lieu de s'y couper. */}
          <image
            href="/beach/hero-sea-mask.png"
            x="0"
            y="0"
            width={ART_W}
            height={ART_H}
            preserveAspectRatio="none"
          />
        </mask>
        <linearGradient id="hero-crest" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="35%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        {/* L'eau de l'illustration est très claire et déjà striée de blanc :
            une crête blanche seule s'y perd. Le creux turquoise juste dessous
            donne le contraste qui rend le déplacement lisible. */}
        <linearGradient id="hero-trough" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1E8FA8" stopOpacity="0" />
          <stop offset="40%" stopColor="#1E8FA8" stopOpacity="1" />
          <stop offset="70%" stopColor="#2FA6BC" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#2FA6BC" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hero-spark">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#FFF6DE" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FFF6DE" stopOpacity="0" />
        </radialGradient>
        <filter id="hero-swell-blur" x="-10%" y="-400%" width="120%" height="900%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        <filter id="hero-roll-blur" x="-30%" y="-200%" width="160%" height="500%">
          <feGaussianBlur stdDeviation="11" />
        </filter>
        <linearGradient id="hero-roller" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="38%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="56%" stopColor="#EAFBFF" stopOpacity="0.55" />
          <stop offset="74%" stopColor="#1E8FA8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1E8FA8" stopOpacity="0" />
        </linearGradient>
        {/* Une bande rectiligne se lisait comme un filtre qui glisse. Le bruit
            la déforme en crête irrégulière, et comme le bruit est fixe dans le
            repère du filtre, la crête se remodèle en avançant. */}
        <filter id="hero-roller-blur" x="-15%" y="-150%" width="130%" height="400%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.004 0.021"
            numOctaves="2"
            seed="7"
            result="churn"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="churn"
            scale="34"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="hero-foam-blur" x="-70%" y="-200%" width="240%" height="500%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      <g mask="url(#hero-sea)">
        {ROLLERS.map((r) => (
          <motion.rect
            key={r.delay}
            x={SEA_FROM - 20}
            width={ART_W - SEA_FROM + 40}
            fill="url(#hero-roller)"
            filter="url(#hero-roller-blur)"
            initial={{ y: 592, height: 12, opacity: 0 }}
            animate={{
              y: [592, 1040],
              height: [16, 124],
              opacity: [0, 0.62, 0.62, 0],
            }}
            transition={{
              duration: r.dur,
              delay: r.delay,
              repeat: Infinity,
              ease: "easeIn",
              opacity: {
                duration: r.dur,
                delay: r.delay,
                repeat: Infinity,
                times: [0, 0.14, 0.82, 1],
              },
            }}
          />
        ))}

        {SWELL.map((row) => (
          <SwellRow key={row.y} {...row} />
        ))}

        {FOAM.map((f) => (
          <motion.ellipse
            key={`${f.x}-${f.y}`}
            cx={f.x}
            cy={f.y}
            rx={f.rx}
            ry={f.ry}
            fill="#FFFFFF"
            filter="url(#hero-foam-blur)"
            animate={{ opacity: [0.14, 0.55, 0.14] }}
            transition={{
              duration: f.dur,
              delay: f.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {SPARKS.map((s) => (
          <motion.circle
            key={`${s.x}-${s.y}`}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="url(#hero-spark)"
            animate={{ opacity: [0, 0.85, 0] }}
            transition={{
              duration: s.dur,
              delay: s.delay,
              repeat: Infinity,
              repeatDelay: 1.6,
              ease: "easeInOut",
            }}
          />
        ))}
      </g>
    </svg>
  );
}

function SwellRow({
  y,
  len,
  h,
  gap,
  dur,
  opacity,
  sway,
}: (typeof SWELL)[number]) {
  // On couvre la largeur de l'eau plus un intervalle, pour que la bande soit
  // encore pleine à l'instant où la translation revient à zéro.
  const count = Math.ceil((ART_W - SEA_FROM + gap) / gap) + 1;

  return (
    <motion.g
      animate={{ x: [0, -gap], y: [0, sway, 0, -sway, 0] }}
      transition={{
        x: { duration: dur, repeat: Infinity, ease: "linear" },
        y: { duration: dur * 0.42, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      {Array.from({ length: count }, (_, i) => {
        // Longueurs et positions dérangées de façon déterministe : sans ça, la
        // ligne se lit comme un peigne régulier.
        const jitter = ((i * 2654435761) % 1000) / 1000;
        const x = SEA_FROM + i * gap + jitter * gap * 0.5;
        const top = y + (jitter - 0.5) * h * 2;
        const w = len * (0.65 + jitter * 0.6);
        const a = opacity * (0.7 + jitter * 0.45);
        return (
          <g key={i}>
            {/* Onde large et floue. L'eau peinte est déjà striée de blanc fin :
                à cette échelle, un liseré de plus se confondrait avec elle.
                C'est ce lent glissement de lumière sur une large bande qui se
                lit comme un mouvement. */}
            <rect
              x={x - w * 0.25}
              y={top - h * 2}
              width={w * 1.5}
              height={h * 6}
              rx={h * 3}
              fill="url(#hero-crest)"
              opacity={a * 0.42}
              filter="url(#hero-roll-blur)"
            />
            <rect
              x={x - w * 0.15}
              y={top + h * 4}
              width={w * 1.3}
              height={h * 5}
              rx={h * 2.5}
              fill="url(#hero-trough)"
              opacity={a * 0.3}
              filter="url(#hero-roll-blur)"
            />
            <rect
              filter="url(#hero-swell-blur)"
              x={x}
              y={top}
              width={w}
              height={h}
              rx={h / 2}
              fill="url(#hero-crest)"
              opacity={a}
            />
            <rect
              filter="url(#hero-swell-blur)"
              x={x + w * 0.08}
              y={top + h * 1.15}
              width={w * 0.86}
              height={h * 0.9}
              rx={h / 2}
              fill="url(#hero-trough)"
              opacity={a * 0.55}
            />
          </g>
        );
      })}
    </motion.g>
  );
}

/** Halo de l'écran du laptop, qui respire comme une page qui se rafraîchit. */
function ScreenGlow() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen"
      viewBox={`0 0 ${ART_W} ${ART_H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <radialGradient id="hero-glow">
          <stop offset="0%" stopColor="#BFE0FF" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#8EC8FF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#8EC8FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.circle
        cx={SCREEN.x}
        cy={SCREEN.y}
        r={132}
        fill="url(#hero-glow)"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Cœur serré sur la dalle : c'est lui qui fait lire « l'écran est
          allumé », le halo large ne se voit que sur l'herbe autour. */}
      <motion.ellipse
        cx={SCREEN.x}
        cy={SCREEN.y}
        rx={44}
        ry={40}
        fill="url(#hero-glow)"
        animate={{ opacity: [0.25, 0.95, 0.25] }}
        transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/**
 * Mouette.
 *
 * L'aile est un seul tracé que l'on fait pivoter autour de l'épaule. Animer
 * l'attribut `d` ne fonctionne pas — la silhouette restait figée — et une aile
 * articulée au poignet se lisait comme cassée dès que les deux segments
 * n'étaient plus alignés.
 *
 * Tout tient donc dans la forme : large à l'emplanture, effilée jusqu'au bout,
 * bord de fuite concave. C'est ce qui la fait lire comme une aile plutôt que
 * comme un trait, y compris ailes basses. Repère 44 × 32, épaule en (22, 20).
 */
const WING = "M22 19.6 C 17.8 17.4, 11.5 14.6, 2.2 13.6 C 6.4 16.4, 13.5 19.4, 21.4 22.6 Z";
const BODY = "M11.6 19.45 C 15 18.8, 20 17.9, 24.6 18.2 C 27.2 18.4, 28.3 19, 28.3 19.45 C 28.3 19.95, 27.1 20.6, 24.6 20.8 C 20 21.1, 15 20.2, 11.6 19.45 Z";

const SHOULDER = { transformBox: "view-box", transformOrigin: "22px 20px" } as const;
const MIRROR = {
  transformBox: "view-box",
  transformOrigin: "22px 20px",
  scaleX: -1,
} as const;

/**
 * Amplitude du battement, en degrés. Le bas du battement reste franchement
 * au-dessus de l'horizontale : en l'approchant, la silhouette s'aplatissait le
 * temps de quelques images et le battement se lisait comme un à-coup entre deux
 * poses.
 */
const FLAP = { up: 33, down: 6 };

/**
 * Le coup d'aile vers le bas est vif, la remontée plus lente : c'est le rythme
 * d'un vol réel. Un aller-retour symétrique se lit comme un métronome.
 */
const FLAP_TIMING = (duration: number): Transition => ({
  duration,
  repeat: Infinity,
  times: [0, 0.36, 1],
  ease: ["easeIn", "easeOut"],
});

function Seagull({
  top,
  width,
  cross,
  delay,
  climb,
  flap,
  ink,
}: {
  top: string;
  /** Largeur CSS : proportionnelle à l'écran, bornée aux deux extrêmes. */
  width: string;
  /** Secondes pour traverser l'écran de bord à bord. */
  cross: number;
  delay: number;
  /** Dénivelé du vol, en pixels. */
  climb: number;
  /** Durée d'un battement d'ailes, en secondes. */
  flap: number;
  /** Opacité du plumage : les oiseaux lointains se noient dans la brume. */
  ink: number;
}) {
  const plumage = `rgba(41, 58, 84, ${ink})`;
  const beat = FLAP_TIMING(flap);

  return (
    <motion.div
      className="absolute"
      style={{ top, left: 0, width }}
      initial={{ x: "-14vw" }}
      animate={{ x: ["-14vw", "114vw"] }}
      transition={{
        duration: cross,
        delay,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "linear",
      }}
    >
      <motion.div
        animate={{ y: [0, climb * 0.55, climb, climb * 0.75] }}
        transition={{
          duration: cross,
          delay,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut",
        }}
      >
        <svg viewBox="0 0 44 32" className="block h-auto w-full" aria-hidden>
          {/* Le corps se soulève sur le coup d'aile descendant. Sans ce
              sursaut, l'oiseau a l'air suspendu à un fil pendant que ses ailes
              bougent. */}
          <motion.g animate={{ y: [0.7, -0.5, 0.7] }} transition={beat}>
            <path d={BODY} fill={plumage} />
            <motion.path
              d={WING}
              fill={plumage}
              style={SHOULDER}
              animate={{ rotate: [FLAP.up, FLAP.down, FLAP.up] }}
              transition={beat}
            />
            <motion.path
              d={WING}
              fill={plumage}
              style={MIRROR}
              animate={{ rotate: [FLAP.up, FLAP.down, FLAP.up] }}
              transition={beat}
            />
          </motion.g>
        </svg>
      </motion.div>
    </motion.div>
  );
}
