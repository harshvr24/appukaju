"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Total vertical drift in %; the child is over-sized to avoid gaps. */
  amount?: number;
}

/** Wrap any visual: it drifts slower than the scroll for depth. */
export function Parallax({ children, className, amount = 14 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount / 2}%`, `${amount / 2}%`]);

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        style={reduced ? undefined : { y, height: `${100 + amount}%`, top: `-${amount / 2}%` }}
        className="relative h-full w-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
