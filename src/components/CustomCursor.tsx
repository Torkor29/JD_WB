"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMedia";

export function CustomCursor() {
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 380, damping: 28, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 380, damping: 28, mass: 0.4 });

  useEffect(() => {
    if (mobile || reduced) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        "a, button, [data-cursor='interactive'], input, textarea, select",
      );
      setHovering(Boolean(interactive));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [mobile, reduced, x, y]);

  if (mobile || reduced) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
      style={{
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        opacity: visible ? 1 : 0,
      }}
    >
      <motion.div
        className="rounded-full border border-white bg-white/10"
        animate={{
          width: hovering ? 56 : 14,
          height: hovering ? 56 : 14,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      />
    </motion.div>
  );
}
