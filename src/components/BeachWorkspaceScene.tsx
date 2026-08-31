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
            top="10%"
            width="clamp(30px, 4.6vw, 74px)"
            cross={29}
            delay={1}
            climb={-46}
            flap={0.78}
            ink={0.72}
          />
          <Seagull
            top="19%"
            width="clamp(23px, 3.4vw, 55px)"
            cross={37}
            delay={10}
            climb={34}
            flap={0.9}
            ink={0.6}
          />
          <Seagull
            top="6%"
            width="clamp(17px, 2.5vw, 41px)"
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
 * Mer.
 *
 * Trois nappes se relaient, chacune dérivant lentement vers la côte en
 * apparaissant puis en s'effaçant. Elles ne sont jamais toutes visibles en même
 * temps, si bien qu'aucune forme identifiable ne traverse le cadre.
 *
 * La version précédente faisait glisser une crête unique pleine largeur : ça se
 * lisait comme une barre qui descend. L'irrégularité des crêtes, la
 * perspective, les éclats du soleil, le flou et le bornage à l'eau sont
 * maintenant semés dans les fichiers par `scripts/build-hero-assets.py`. Le
 * navigateur n'a plus qu'une translation et une opacité à animer — les deux
 * seules propriétés qu'il compose sans repeindre — et surtout plus aucun masque
 * à réappliquer : un masque plein cadre coûtait un bon tiers des images par
 * seconde, puisque toute nappe qui dérive le salit en entier.
 *
 * Les nappes font la taille de l'illustration et s'affichent avec le même
 * cadrage : elles tombent donc pile sur l'eau.
 */
const SWELL = [
  { sprite: 1, dur: 13.5, delay: 0, peak: 0.9, drift: 1.5 },
  { sprite: 2, dur: 15.5, delay: 4.5, peak: 0.78, drift: 1.9 },
  { sprite: 3, dur: 14.5, delay: 9, peak: 0.84, drift: 1.7 },
];

function Sea() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {SWELL.map((w) => (
        <Nappe key={w.sprite} {...w} />
      ))}
    </div>
  );
}

function Nappe({ sprite, dur, delay, peak, drift }: (typeof SWELL)[number]) {
  return (
    <motion.div
      className="absolute inset-0"
      style={LIFT_FADE}
      // La houle porte vers la côte : elle descend et rentre légèrement.
      animate={{
        y: ["-0.5%", `${drift}%`],
        x: ["0%", "-0.35%"],
        opacity: [0, peak, peak, 0],
      }}
      transition={{
        duration: dur,
        delay,
        repeat: Infinity,
        ease: "linear",
        opacity: {
          duration: dur,
          delay,
          repeat: Infinity,
          times: [0, 0.2, 0.72, 1],
          ease: "easeInOut",
        },
      }}
    >
      <Calque src={`/beach/hero-swell-${sprite}.webp`} />
    </motion.div>
  );
}

/** Une surcouche au cadrage exact de l'illustration. */
function Calque({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes="100vw"
      className="object-cover"
      style={{ objectPosition: ANCHOR }}
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
      <Calque src="/beach/hero-screen-glow.webp" />
    </motion.div>
  );
}

/**
 * Mouette, d'après une photo de silhouettes de goélands en vol.
 *
 * Les proportions sont relevées sur la référence et reproduites : envergure
 * seize fois l'épaisseur moyenne de l'aile, corps égal à 37 % de l'envergure.
 * La version précédente avait des ailes quatre fois trop épaisses — des
 * palettes, pas des ailes de mouette. L'aile est donc longue, mince, coudée au
 * poignet, terminée en aiguille, et le corps un fuseau élancé avec une tête et
 * un bec à l'avant, une queue pointue à l'arrière.
 *
 * Deux pièges, identifiés en dépliant le cycle image par image.
 *
 * Le miroir de l'aile droite doit être appliqué AVANT la rotation, donc sur un
 * groupe statique qui l'enveloppe. Porté par l'élément animé lui-même, il
 * s'appliquait après et inversait le sens du battement : l'oiseau avait une
 * aile en haut et l'autre en bas à chaque image.
 *
 * Et l'aile doit porter sa courbure dans son tracé. Une aile droite n'est plus
 * qu'un trait horizontal en bas de course et deux oreilles en haut.
 *
 * Repère 84 × 36, épaule en (42, 29). La boîte est haute parce que le battement
 * porte la pointe de l'aile bien au-dessus du corps, et qu'un `svg` recadre son
 * contenu.
 */
const WING =
  "M42 26.4 C 33 22.8, 26 20.4, 19.5 19 C 12.5 17.6, 6.5 17.3, 1.8 17.8 " +
  "C 7 19.8, 13 21.8, 20 23.6 C 28 26, 36 29, 42 31.4 Z";

const BODY =
  "M27 31 C 31 29.6, 36 28.6, 43 28.2 C 48 27.9, 51.6 28, 53.6 28.4 " +
  "C 55 28.7, 56.2 29, 58.6 29.4 C 56.2 29.8, 55 30.2, 53.6 30.5 " +
  "C 51.6 31, 48 31.4, 43 31.6 C 37.5 31.8, 32 32, 29.6 32.8 " +
  "C 30.4 32, 30.6 31.6, 30.2 31.3 C 29.6 31, 28.2 31, 27 31 Z";

const SHOULDER = { transformBox: "view-box", transformOrigin: "42px 29px" } as const;

/**
 * Amplitude du battement, en degrés. Le tracé porte déjà douze degrés de
 * relevé : l'aile passe donc du V franc, en haut de course, à l'arc presque
 * plat du vol plané, en bas.
 */
const FLAP = { up: 27, down: -15 };

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
        <svg viewBox="0 0 84 36" className="block h-auto w-full" aria-hidden>
          {/* Le corps se soulève sur le coup d'aile descendant. Sans ce
              sursaut, l'oiseau a l'air suspendu à un fil pendant que ses ailes
              bougent. */}
          <motion.g style={LIFT} animate={{ y: [0.9, -0.7, 0.9] }} transition={beat}>
            <path d={BODY} fill={plumage} />
            <Wing plumage={plumage} beat={beat} />
            {/* Miroir statique : il enveloppe l'aile au lieu de la porter. */}
            <g transform="translate(84 0) scale(-1 1)">
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
