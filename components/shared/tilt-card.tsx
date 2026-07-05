"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { useIsCoarsePointer } from "@/lib/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

/** Perspective hover tilt with a travelling sheen. */
export function TiltCard({ children, className, maxTilt = 7 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 140, damping: 18 });
  const sy = useSpring(py, { stiffness: 140, damping: 18 });
  const rotateX = useTransform(sy, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(sx, [0, 1], [-maxTilt, maxTilt]);
  const sheenX = useTransform(sx, [0, 1], ["-60%", "160%"]);
  const coarse = useIsCoarsePointer();
  const reduced = usePrefersReducedMotion();

  if (coarse || reduced) return <div className={className}>{children}</div>;

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <div style={{ perspective: 1100 }} className={className}>
      <motion.div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn("relative h-full w-full will-change-transform")}
      >
        {children}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        >
          <motion.div
            className="absolute inset-y-0 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            style={{ left: sheenX }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
