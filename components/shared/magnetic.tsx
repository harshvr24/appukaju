"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useIsCoarsePointer } from "@/lib/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

interface MagneticProps {
  children: ReactNode;
  /** How far the element leans toward the cursor, 0–1 of the distance. */
  strength?: number;
  className?: string;
}

/** Wraps children so they lean toward the cursor and spring back. */
export function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });
  const coarse = useIsCoarsePointer();
  const reduced = usePrefersReducedMotion();

  if (coarse || reduced) {
    return <div className={className}>{children}</div>;
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
