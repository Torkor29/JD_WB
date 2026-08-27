"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type Props = {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  delay?: number;
};

export function WordsPullUp({
  text,
  className = "",
  showAsterisk = false,
  delay = 0,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const words = text.split(" ");

  return (
    <span ref={ref} className={`inline ${className}`}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="relative inline-block"
              initial={{ y: 20, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : undefined}
              transition={{
                duration: 0.7,
                delay: delay + i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
              {showAsterisk && isLast && (
                <span className="absolute -right-[0.35em] top-[0.55em] text-[0.28em] font-normal">
                  *
                </span>
              )}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
