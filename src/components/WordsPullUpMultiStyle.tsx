"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type Segment = { text: string; className?: string };

type Props = {
  segments: Segment[];
  className?: string;
  delay?: number;
};

export function WordsPullUpMultiStyle({
  segments,
  className = "",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const words = segments.flatMap((segment) =>
    segment.text.split(" ").map((word) => ({
      word,
      className: segment.className ?? "",
    })),
  );

  let wordIndex = 0;

  return (
    <div
      ref={ref}
      className={`flex max-w-full flex-wrap justify-center gap-x-[0.28em] gap-y-1 ${className}`}
    >
      {words.map((item, i) => {
        const d = delay + wordIndex * 0.08;
        wordIndex += 1;
        return (
          <span key={`${item.word}-${i}`} className="inline-block overflow-hidden">
            <motion.span
              className={`inline-block ${item.className}`}
              initial={{ y: 20, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : undefined}
              transition={{
                duration: 0.7,
                delay: d,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {item.word}
            </motion.span>
          </span>
        );
      })}
    </div>
  );
}
