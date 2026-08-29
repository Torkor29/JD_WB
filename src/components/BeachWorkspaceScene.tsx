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
 * dédoublements de nuages. Le mouvement est ajouté par-dessus.
 *
 * Deux contraintes gouvernent tout ce fichier.
 *
 * Le navigateur n'anime gratuitement que les transformations et l'opacité. Tout
 * le reste — masques, flous, irrégularité des crêtes — est cuit à l'avance par
 * `scripts/build-hero-assets.py`.
 *
 * Et cela ne suffit pas : sans `will-change`, le navigateur ne promeut pas les
 * éléments animés sur leur propre calque et repeint la scène entière à chaque
 * image. Mesuré : 15 images par seconde sans, 60 avec. Chaque élément animé
 * porte donc LIFT.
 *
 * Pour la même raison, l'extinction des bords se fait par un dégradé blanc posé
 * par-dessus (dans CinematicHero) et non par un masque CSS sur ce conteneur :
 * un masque sur un sous-arbre animé doit être réappliqué à chaque image.
 *
 * Le cadrage est partagé par toutes les surcouches, qui font la taille de
 * l'illustration et s'affichent avec le même `object-cover` centré. Un point de
 * l'illustration tombe donc au même endroit à l'écran dans chacune d'elles,
 * quel que soit le format de la fenêtre.
 */
const ANCHOR = "50% 50%";

/** Léger agrandissement permanent : il absorbe le parallaxe sans découvrir de bord. */
const OVERSCAN = 1.05;

/**
 * Promotion sur un calque propre. Sans elle, animer une transformation
 * n'empêche pas le repeint : c'est la différence entre 15 et 60 images par
 * seconde sur cette scène.
 */
const LIFT = {
  willChange: "transform",
  backfaceVisibility: "hidden",
} as const;
const LIFT_FADE = {
  willChange: "transform, opacity",
  backfaceVisibility: "hidden",
} as const;

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
    <div className="absolute inset-0 overflow-hidden bg-[#EAF3FC]">
      {/* Illustration et surcouches partagent la même translation : la mer
          reste calée sur l'eau pendant le parallaxe. */}
      <motion.div
        className="absolute inset-0"
        style={
          reduce
            ? undefined
            : { x: sceneX, y: sceneY, scale: OVERSCAN, ...LIFT }
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
          style={{ x: birdX, y: birdY, ...LIFT }}
        >
          <Seagull
            top="13%"
            width="clamp(40px, 6.4vw, 100px)"
            cross={29}
            delay={1}
            climb={-46}
            flap={0.78}
            ink={0.72}
          />
          <Seagull
            top="22%"
            width="clamp(31px, 4.8vw, 76px)"
            cross={37}
            delay={10}
            climb={34}
            flap={0.9}
            ink={0.6}
          />
          <Seagull
            top="8%"
            width="clamp(24px, 3.6vw, 58px)"
            cross={45}
            delay={21}
            climb={-22}
            flap={0.7}
            ink={0.5}
          />
        </motion.div>
      )}
    </div>
  );
}

/**
 * Houle.
 *
 * Chaque crête est une image déjà floutée et déjà irrégulière, que l'on fait
 * seulement descendre en grossissant. Rien d'autre n'est animé que la
 * transformation et l'opacité, les deux seules propriétés que le navigateur
 * compose sans repeindre.
 *
 * La version précédente dessinait tout en SVG, avec un masque et des filtres
 * réévalués à chaque image : 20 images par seconde au lieu de 60.
 *
 * Les crêtes balaient toute la hauteur du cadre, sans chercher à viser
 * l'horizon : c'est le masque qui les fait apparaître pile sur l'eau, et lui
 * suit exactement le cadrage de l'illustration quel que soit le format de la
 * fenêtre.
 */
const CREST_BAND = 9; // hauteur d'une crête, en % du cadre
const CREST_FROM = 30; // départ, en % du cadre
const CREST_TO = 106;

/**
 * L'eau commence à 69,8 % du cadre — c'est la falaise, et la proportion est
 * fixe tant que la fenêtre est plus large que l'illustration. Les crêtes ne
 * couvrent donc que la droite du cadre : plus la surface animée est petite,
 * moins il y a de pixels à recomposer.
 */
const CREST_LEFT = 62;

const SWELL = [
  { sprite: 1, dur: 7.4, delay: 0, peak: 0.62, flip: false },
  { sprite: 2, dur: 8.6, delay: 1.6, peak: 0.5, flip: true },
  { sprite: 3, dur: 7.9, delay: 3.2, peak: 0.58, flip: false },
  { sprite: 1, dur: 8.2, delay: 4.8, peak: 0.48, flip: true },
];

function Sea() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        // Le masque suit le même cadrage que l'illustration : `cover` centré
        // est l'exact équivalent de son `object-cover` / `object-position`.
        WebkitMaskImage: "url(/beach/hero-sea-mask.png)",
        maskImage: "url(/beach/hero-sea-mask.png)",
        WebkitMaskSize: "cover",
        maskSize: "cover",
        WebkitMaskPosition: ANCHOR,
        maskPosition: ANCHOR,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        // Le masque doit vivre sur son propre calque : sinon chaque crête qui
        // avance oblige à le réappliquer sur toute la surface du parent.
        ...LIFT,
      }}
      aria-hidden
    >
      {SWELL.map((w, i) => (
        <Crest key={i} {...w} />
      ))}
    </div>
  );
}

function Crest({
  sprite,
  dur,
  delay,
  peak,
  flip,
}: (typeof SWELL)[number]) {
  const travel = ((CREST_TO - CREST_FROM) / CREST_BAND) * 100;

  return (
    <motion.div
      className="absolute right-0"
      style={{
        left: `${CREST_LEFT}%`,
        top: `${CREST_FROM}%`,
        height: `${CREST_BAND}%`,
        backgroundImage: `url(/beach/hero-swell-${sprite}.webp)`,
        backgroundSize: "100% 100%",
        // L'origine en haut évite que le grossissement déplace la crête.
        transformOrigin: "50% 0%",
        ...LIFT_FADE,
      }}
      initial={{ y: 0, scaleY: 0.5, scaleX: flip ? -1.1 : 1.1, opacity: 0 }}
      animate={{
        // La vague accélère en approchant : c'est la perspective.
        y: [0, `${travel}%`],
        scaleY: [0.5, 2.4],
        opacity: [0, peak, peak, 0],
      }}
      transition={{
        duration: dur,
        delay,
        repeat: Infinity,
        ease: "easeIn",
        opacity: {
          duration: dur,
          delay,
          repeat: Infinity,
          times: [0, 0.22, 0.78, 1],
        },
      }}
    />
  );
}

/**
 * Halo de l'écran du laptop, qui respire comme une page qui se rafraîchit.
 *
 * Le fichier fait la taille de l'illustration et s'affiche avec le même
 * cadrage : le halo tombe donc pile sur la dalle sans aucun calcul, et seule
 * son opacité est animée.
 *
 * Pas de mode de fusion : « screen » éclaircissait joliment mais obligeait le
 * navigateur à relire le fond sur toute la surface du calque, au prix de 20
 * images par seconde. La luminosité est donc cuite dans le sprite.
 */
function ScreenGlow() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={LIFT_FADE}
      animate={{ opacity: [0.12, 0.95, 0.12] }}
      transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
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
  );
}

/**
 * Mouette.
 *
 * Deux pièges ont été identifiés en dépliant le cycle image par image.
 *
 * Le miroir de l'aile droite doit être appliqué AVANT la rotation, donc sur un
 * groupe statique qui l'enveloppe. Porté par l'élément animé lui-même, il
 * s'appliquait après et inversait le sens du battement : l'oiseau avait une
 * aile en haut et l'autre en bas à chaque image.
 *
 * Et l'aile doit porter sa courbure dans son tracé. Une aile en fuseau droit
 * n'est plus qu'un trait horizontal en bas de course et deux oreilles en haut.
 * Celle-ci a le coude de la mouette — le bord d'attaque monte jusqu'au poignet
 * puis la pointe retombe : la silhouette reste celle d'un oiseau sur tout le
 * cycle. C'est cela, et non l'amplitude, qui manquait.
 *
 * Tracé de l'aile droite, pointant vers la gauche depuis l'épaule.
 * Repère 48 × 30, épaule en (24, 15).
 */
const WING =
  "M24 15 C 20.2 12.2, 16.8 10.2, 12.8 9.6 C 9.2 9.1, 6.0 10.6, 2.6 13.4 " +
  "C 5.6 13.6, 9.0 14.1, 11.8 15.1 C 15.8 16.5, 20.2 17.8, 23.4 18.4 Z";

/**
 * Corps : fuseau court. Les ailes s'ouvrant de part et d'autre, on voit
 * l'oiseau de face — le corps ne doit presque pas dépasser. Plus long, il se
 * lisait comme un poisson volant.
 */
const BODY =
  "M20.8 15.05 C 22.4 14.5, 24.8 14.1, 26.8 14.35 C 28.2 14.55, 28.9 14.8, 28.9 15.08 " +
  "C 28.9 15.4, 28.1 15.7, 26.8 15.85 C 24.8 16.1, 22.4 15.7, 20.8 15.05 Z";

const SHOULDER = { transformBox: "view-box", transformOrigin: "24px 15px" } as const;

/**
 * Amplitude du battement, en degrés autour de l'horizontale. L'aile descend
 * franchement sous l'horizontale : sans cela le battement n'est qu'un V qui
 * s'ouvre et se referme.
 */
const FLAP = { up: 32, down: -18 };

/**
 * Le coup d'aile vers le bas est vif, la remontée plus lente : c'est le rythme
 * d'un vol réel. Un aller-retour symétrique se lit comme un métronome.
 *
 * Le cycle est calibré entre deux écueils : à une seconde, l'aile s'attarde
 * assez longtemps en haut de course pour que le battement se lise comme une
 * alternance entre deux poses ; à un demi-tour de seconde, le geste devient
 * illisible sur une silhouette de quelques dizaines de pixels.
 */
const FLAP_TIMING = (duration: number): Transition => ({
  duration,
  repeat: Infinity,
  times: [0, 0.34, 1],
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
      style={{ top, left: 0, width, ...LIFT }}
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
        style={LIFT}
        animate={{ y: [0, climb * 0.55, climb, climb * 0.75] }}
        transition={{
          duration: cross,
          delay,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut",
        }}
      >
        <svg viewBox="0 0 48 30" className="block h-auto w-full" aria-hidden>
          {/* Le corps se soulève sur le coup d'aile descendant. Sans ce
              sursaut, l'oiseau a l'air suspendu à un fil pendant que ses ailes
              bougent. */}
          <motion.g style={LIFT} animate={{ y: [0.8, -0.6, 0.8] }} transition={beat}>
            <path d={BODY} fill={plumage} />
            <Wing plumage={plumage} beat={beat} />
            {/* Miroir statique : il enveloppe l'aile au lieu de la porter. */}
            <g transform="translate(48 0) scale(-1 1)">
              <Wing plumage={plumage} beat={beat} />
            </g>
          </motion.g>
        </svg>
      </motion.div>
    </motion.div>
  );
}

function Wing({ plumage, beat }: { plumage: string; beat: Transition }) {
  return (
    <motion.path
      d={WING}
      fill={plumage}
      style={{ ...SHOULDER, ...LIFT }}
      animate={{ rotate: [FLAP.up, FLAP.down, FLAP.up] }}
      transition={beat}
    />
  );
}
