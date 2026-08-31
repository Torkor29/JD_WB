"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Props = {
  text: string;
  className?: string;
};

/** Révélation au scroll — par mots, pour ne pas bloquer le retour à la ligne */
export function ScrollRevealText({ text, className = "" }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.35"],
  });

  const words = text.split(" ");

  return (
    <p
      ref={ref}
      className={`min-w-0 max-w-full break-words text-pretty ${className}`}
    >
      {words.map((word, i) => {
        const start = i / Math.max(words.length, 1);
        const end = Math.min(1, start + 0.12);
        return (
          <Word
            key={`${word}-${i}`}
            word={word}
            progress={scrollYProgress}
            start={start}
            end={end}
            isLast={i === words.length - 1}
          />
        );
      })}
    </p>
  );
}

function Word({
  word,
  progress,
  start,
  end,
  isLast,
}: {
  word: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
  isLast: boolean;
}) {
  const opacity = useTransform(progress, [start, end], [0.22, 1]);

  return (
    <motion.span style={{ opacity }} className="inline">
      {word}
      {isLast ? "" : " "}
    </motion.span>
  );
}
